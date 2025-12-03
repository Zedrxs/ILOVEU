// Einfaches Passwort für den Einstieg.
// Du kannst es hier anpassen:
const APP_PASSWORD = 'lernen';

// Globale Zustände
let tasks = [];
let currentTask = null;
let currentStepIndex = 0;
let score = {
  points: 0,
  completed: 0,
};

// Hilfsfunktionen
function $(id) {
  return document.getElementById(id);
}

function show(el) {
  el.classList.remove('hidden');
}

function hide(el) {
  el.classList.add('hidden');
}

function setAssistantMessage(text) {
  const box = $('assistant-message');
  box.innerHTML = `<p>${text}</p>`;
}

function appendMessage(role, text) {
  const log = $('conversation-log');
  const msg = document.createElement('div');
  msg.classList.add('message');
  msg.classList.add(role === 'assistant' ? 'message-assistant' : 'message-user');
  const label = role === 'assistant' ? 'KI' : 'Du';
  msg.innerHTML = `<span class="message-label">${label}</span>${text}`;
  log.appendChild(msg);
  log.scrollTop = log.scrollHeight;
}

function normalizeNumberInput(value) {
  if (typeof value !== 'string') return NaN;
  const replaced = value.trim().replace(',', '.');
  return Number(replaced);
}

function checkAnswer(step, userInput) {
  if (step.expectedType === 'number') {
    const num = normalizeNumberInput(userInput);
    if (Number.isNaN(num)) return false;
    const diff = Math.abs(num - step.expectedValue);
    return diff <= (step.tolerance ?? 0);
  }
  // String-Vergleich (z.B. für spätere Aufgaben)
  const expected = String(step.expectedValue).trim().toLowerCase();
  const got = String(userInput).trim().toLowerCase();
  return expected === got;
}

function checkFinalAnswer(finalConfig, userInput) {
  if (finalConfig.type === 'number') {
    const num = normalizeNumberInput(userInput);
    if (Number.isNaN(num)) return false;
    const diff = Math.abs(num - finalConfig.value);
    return diff <= (finalConfig.tolerance ?? 0);
  }
  const expected = String(finalConfig.value).trim().toLowerCase();
  const got = String(userInput).trim().toLowerCase();
  return expected === got;
}

// Aufgaben laden
async function loadTasks() {
  try {
    const res = await fetch('tasks.json', { cache: 'no-cache' });
    if (!res.ok) {
      throw new Error('HTTP ' + res.status);
    }
    const data = await res.json();
    tasks = Array.isArray(data.tasks) ? data.tasks : [];
    renderTasks();
  } catch (err) {
    console.error('Fehler beim Laden der Aufgaben:', err);
    const errEl = $('tasks-error');
    errEl.textContent =
      'Konnte die Aufgaben nicht laden. Stelle sicher, dass du die Seite über einen lokalen Server aufrufst (nicht direkt als Datei) und dass die Datei "tasks.json" gültig ist.';
    show(errEl);
  }
}

function renderTasks() {
  const list = $('tasks-list');
  list.innerHTML = '';

  const count = tasks.length;
  $('task-count').textContent =
    count === 1 ? '1 Aufgabe' : `${count} Aufgaben`;

  tasks.forEach((task) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'task-card';
    card.addEventListener('click', () => {
      startTask(task.id);
    });

    const left = document.createElement('div');
    left.className = 'task-card-header';
    const title = document.createElement('h3');
    title.className = 'task-title';
    title.textContent = task.title;
    const desc = document.createElement('p');
    desc.className = 'task-description';
    desc.textContent = task.shortDescription || task.description || '';
    left.appendChild(title);
    left.appendChild(desc);

    const right = document.createElement('div');
    right.className = 'task-meta';

    const diff = document.createElement('span');
    diff.className = 'pill';
    const diffLower = String(task.difficulty || '').toLowerCase();
    if (diffLower.includes('einfach')) diff.classList.add('pill-easy');
    else if (diffLower.includes('mittel')) diff.classList.add('pill-medium');
    else if (diffLower.includes('schwer')) diff.classList.add('pill-hard');
    else diff.classList.add('pill-difficulty');
    diff.textContent = `Stufe: ${task.difficulty ?? '?'}`;

    const points = document.createElement('span');
    points.className = 'pill pill-points';
    points.textContent = `${task.points ?? 0} Punkte`;

    right.appendChild(diff);
    right.appendChild(points);

    card.appendChild(left);
    card.appendChild(right);

    list.appendChild(card);
  });
}

function resetTrainerUI() {
  $('conversation-log').innerHTML = '';
  $('step-input').value = '';
  $('step-error').textContent = '';
  hide($('step-error'));
  hide($('final-compare-container'));
  $('final-input').value = '';
  $('final-feedback').textContent = '';
  $('final-feedback').classList.remove('correct', 'incorrect');
}

function startTask(taskId) {
  const task = tasks.find((t) => t.id === taskId);
  if (!task) return;

  currentTask = task;
  currentStepIndex = 0;

  hide($('trainer-empty'));
  show($('trainer-content'));
  resetTrainerUI();

  $('trainer-title').textContent = task.title;
  $('trainer-description').textContent = task.description || '';
  $('trainer-points').textContent = `${task.points ?? 0} Punkte`;
  $('trainer-difficulty').textContent = `Schwierigkeit: ${
    task.difficulty ?? '?'
  }`;

  setAssistantMessage(
    'Los geht’s! Ich führe dich Schritt für Schritt. Trage bei jedem Schritt das passende Zwischenergebnis ein.'
  );

  appendMessage(
    'assistant',
    `Wir betrachten die Aufgabe: <strong>${task.title}</strong><br/><span style="opacity:0.8;">${task.description}</span>`
  );

  showCurrentStepPrompt();
}

function showCurrentStepPrompt() {
  if (!currentTask) return;
  const steps = currentTask.steps || [];

  if (currentStepIndex >= steps.length) {
    // Schritte sind durch, jetzt finalen Vergleich erlauben
    hide($('step-input-container'));
    show($('final-compare-container'));
    setAssistantMessage(
      'Gut gemacht! Jetzt trägst du dein Endergebnis ein und ich vergleiche es mit meiner Lösung.'
    );
    appendMessage(
      'assistant',
      'Du hast alle Zwischenschritte erledigt. Jetzt gib bitte dein <strong>Endergebnis</strong> ein.'
    );
    $('final-input').focus();
    return;
  }

  const step = steps[currentStepIndex];
  $('step-label').textContent = step.prompt;
  $('step-input').value = '';
  $('step-input').focus();

  setAssistantMessage(
    'Überlege dir das Zwischenergebnis für den aktuellen Schritt. Wenn du unsicher bist, versuche es trotzdem: aus Fehlern lernt man!'
  );
}

function updateScore(pointsToAdd) {
  score.points += pointsToAdd;
  score.completed += 1;
  $('score-points').textContent = String(score.points);
  $('score-completed').textContent = String(score.completed);
}

// Event-Handler
function initLogin() {
  const loginForm = $('login-form');
  const passwordInput = $('password-input');
  const loginError = $('login-error');

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const value = passwordInput.value || '';
    if (value === APP_PASSWORD) {
      sessionStorage.setItem('rechner-trainer-auth', 'ok');
      hide($('login-screen'));
      show($('main-screen'));
      loadTasks();
    } else {
      loginError.textContent = 'Falsches Passwort. Bitte versuche es erneut.';
      show(loginError);
    }
  });
}

function initStepForm() {
  const stepForm = $('step-form');
  const stepInput = $('step-input');
  const stepError = $('step-error');

  stepForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!currentTask) return;
    const steps = currentTask.steps || [];
    if (currentStepIndex >= steps.length) return;

    const step = steps[currentStepIndex];
    const userValue = stepInput.value;

    appendMessage('user', userValue);

    const ok = checkAnswer(step, userValue);
    if (!ok) {
      stepError.textContent =
        'Das passt noch nicht ganz. Überlege noch einmal oder schau dir den Tipp der KI an.';
      show(stepError);
      const hint = step.assistantHint || 'Versuche die Rechnung noch einmal sorgfältig.';
      appendMessage('assistant', `<strong>Tipp:</strong> ${hint}`);
      setAssistantMessage(
        'Fehler sind normal. Lies meinen Tipp genau und versuche den Schritt noch einmal.'
      );
      return;
    }

    hide(stepError);
    const explain =
      step.assistantExplain ||
      'Sehr gut! Der Zwischenschritt ist korrekt. Wir machen weiter.';
    appendMessage(
      'assistant',
      `<strong>Richtig!</strong> ${explain}`
    );

    currentStepIndex += 1;
    showCurrentStepPrompt();
  });
}

function initFinalForm() {
  const finalForm = $('final-form');
  const finalInput = $('final-input');
  const finalFeedback = $('final-feedback');

  finalForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!currentTask || !currentTask.finalAnswer) return;

    const userValue = finalInput.value;
    appendMessage('user', `Mein Endergebnis: ${userValue}`);

    const isCorrect = checkFinalAnswer(currentTask.finalAnswer, userValue);
    finalFeedback.classList.remove('correct', 'incorrect');

    if (isCorrect) {
      finalFeedback.textContent = 'Super! Deine Lösung stimmt mit meiner KI-Lösung überein.';
      finalFeedback.classList.add('correct');
      appendMessage(
        'assistant',
        `<strong>Richtig!</strong> ${currentTask.finalAnswer.assistantSummary ||
          'Dein Ergebnis ist korrekt.'}`
      );
      setAssistantMessage(
        'Gut gemacht! Deine Lösung ist korrekt. Such dir gerne noch eine weitere Aufgabe aus.'
      );
      // Punkte nur einmal pro Aufgabe vergeben (sehr einfache Variante)
      updateScore(currentTask.points ?? 0);
    } else {
      finalFeedback.textContent =
        'Fast! Deine Lösung unterscheidet sich von meiner. Schau dir meine Erklärung an und vergleiche Schritt für Schritt.';
      finalFeedback.classList.add('incorrect');
      appendMessage(
        'assistant',
        `<strong>Meine Lösung:</strong> ${
          currentTask.finalAnswer.assistantSummary ||
          'Ich habe ein anderes Ergebnis berechnet.'
        }`
      );
      setAssistantMessage(
        'Dein Ergebnis war knapp daneben. Lies dir meine Lösung in Ruhe durch und versuche nachzuvollziehen, wo der Unterschied ist.'
      );
    }
  });
}

function initApp() {
  initLogin();
  initStepForm();
  initFinalForm();

  // Wenn man die Seite neu lädt und bereits eingeloggt war
  const authenticated = sessionStorage.getItem('rechner-trainer-auth') === 'ok';
  if (authenticated) {
    hide($('login-screen'));
    show($('main-screen'));
    loadTasks();
  } else {
    show($('login-screen'));
    hide($('main-screen'));
  }
}

document.addEventListener('DOMContentLoaded', initApp);


