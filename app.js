// ============ GLOBALE VARIABLEN ============
let currentPage = 0;
const totalPages = 6;
let solvedRiddles = JSON.parse(localStorage.getItem('ac_solvedRiddles')) || [];
let currentDoor = null;
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

// ============ DOM ELEMENTE ============
const loginOverlay = document.getElementById('loginOverlay');
const passwordInput = document.getElementById('passwordInput');
const loginButton = document.getElementById('loginButton');
const loginError = document.getElementById('loginError');
const calendarGrid = document.getElementById('calendarGrid');
const starProgress = document.getElementById('starProgress');
const prevButton = document.getElementById('prevButton');
const nextButton = document.getElementById('nextButton');
const pageIndicators = document.getElementById('pageIndicators');
const solvedCount = document.getElementById('solvedCount');
const currentDateElement = document.getElementById('currentDate');
const backgroundCountdown = document.getElementById('backgroundCountdown');
const riddleModal = document.getElementById('riddleModal');
const rewardModal = document.getElementById('rewardModal');
const doorSound = document.getElementById('doorSound');
const correctSound = document.getElementById('correctSound');
const bellSound = document.getElementById('bellSound');
const snowflakesContainer = document.getElementById('snowflakesContainer');
const confettiCanvas = document.getElementById('confetti-canvas');

// ============ INITIALISIERUNG ============
function initApp() {
    updateCurrentDate();
    createStars();
    createDoors();
    createPageIndicators();
    updateCountdown();
    createSnowflakes();
    setupEventListeners();
    loadProgress();
    adjustStarProgress();
    window.addEventListener('resize', adjustStarProgress);
}

// ============ FUNKTIONEN ============
function updateCurrentDate() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    currentDateElement.textContent = now.toLocaleDateString('de-DE', options);
}

// Sterne mit dynamischem Rand je nach Bildschirmgröße
function adjustStarProgress() {
    const container = document.querySelector('.star-progress-container');
    const progress = document.querySelector('.star-progress');

    if (!container || !progress) return;

    const containerWidth = container.offsetWidth;
    const stars = document.querySelectorAll('.star');
    const starCount = stars.length;
    const starWidth = 24; // Geschätzte Breite eines Sterns inkl. Abstand
    const minPadding = 20; // Minimaler Rand

    // Berechne benötigte Breite
    const neededWidth = starCount * starWidth;

    // Wenn zu breit für Container, reduziere Stern-Größe
    if (neededWidth > containerWidth - minPadding * 2) {
        const scale = (containerWidth - minPadding * 2) / neededWidth;
        stars.forEach(star => {
            star.style.fontSize = `${1.2 * scale}rem`;
        });
    } else {
        // Zurücksetzen auf Standard
        stars.forEach(star => {
            star.style.fontSize = '';
        });
    }
}

function createStars() {
    starProgress.innerHTML = '';
    for (let i = 0; i < 24; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        if (i < solvedRiddles.length) star.classList.add('filled');
        star.innerHTML = '★';
        starProgress.appendChild(star);
    }
    updateSolvedCount();
}

function updateSolvedCount() {
    solvedCount.textContent = `${solvedRiddles.length}/24`;
}

// Türchen mit gleichmäßigem Abstand
function createDoors() {
    calendarGrid.innerHTML = '';
    const today = new Date();
    const isDecember = today.getMonth() === 11;

    for (let i = 0; i < 4; i++) {
        const doorIndex = currentPage * 4 + i + 1;
        if (doorIndex > 24) break;

        const doorWrapper = document.createElement('div');
        doorWrapper.className = 'door-wrapper';

        const door = document.createElement('div');
        door.className = 'door';
        door.dataset.id = doorIndex;

        // Türstatus bestimmen
        let doorState = 'locked';
        if (solvedRiddles.includes(doorIndex)) {
            doorState = 'open';
        } else {
            const doorDate = new Date(today.getFullYear(), 11, doorIndex);

            if (!isDecember) {
                doorState = 'open';
            } else if (doorIndex === today.getDate()) {
                doorState = 'today';
            } else if (doorIndex < today.getDate()) {
                doorState = 'missed';
            } else {
                doorState = 'locked';
            }
        }

        door.classList.add(doorState);

        // Türinhalt
        const doorNumber = document.createElement('div');
        doorNumber.className = 'door-number';
        doorNumber.textContent = doorIndex;

        const doorDate = document.createElement('div');
        doorDate.className = 'door-date';
        doorDate.textContent = `${doorIndex}. Dez`;

        door.appendChild(doorNumber);
        door.appendChild(doorDate);

        // Klick-Event
        door.addEventListener('click', () => handleDoorClick(doorIndex, doorState));

        doorWrapper.appendChild(door);
        calendarGrid.appendChild(doorWrapper);
    }

    // Navigation aktivieren/deaktivieren
    prevButton.disabled = currentPage === 0;
    nextButton.disabled = currentPage === totalPages - 1;
}

function createPageIndicators() {
    pageIndicators.innerHTML = '';
    for (let i = 0; i < totalPages; i++) {
        const indicator = document.createElement('div');
        indicator.className = 'page-indicator';
        if (i === currentPage) indicator.classList.add('active');
        indicator.dataset.page = i;
        indicator.addEventListener('click', () => {
            currentPage = parseInt(indicator.dataset.page);
            updateCalendar();
        });
        pageIndicators.appendChild(indicator);
    }
}

function updateCalendar() {
    createDoors();
    updatePageIndicators();
}

function updatePageIndicators() {
    document.querySelectorAll('.page-indicator').forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentPage);
    });
}

function updateCountdown() {
    const today = new Date();
    const christmas = new Date(today.getFullYear(), 11, 24);
    const timeDiff = christmas.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    const displayDays = daysDiff > 0 ? daysDiff : 0;

    backgroundCountdown.textContent = displayDays;

    // Animation für Countdown-Update
    backgroundCountdown.style.animation = 'none';
    setTimeout(() => {
        backgroundCountdown.style.animation = 'gentlePulse 8s ease-in-out infinite';
    }, 10);
}

function handleDoorClick(doorNumber, state) {
    // Sound abspielen
    doorSound.volume = 0.1;
    doorSound.currentTime = 0;
    doorSound.play();

    currentDoor = doorNumber;

    if (state === 'locked') {
        const door = document.querySelector(`.door[data-id="${doorNumber}"]`);
        door.classList.add('shake');
        setTimeout(() => door.classList.remove('shake'), 500);
        return;
    }

    if (state === 'open' || solvedRiddles.includes(doorNumber)) {
        showReward(doorNumber);
    } else {
        showRiddle(doorNumber);
    }
}

function showRiddle(doorNumber) {
    const riddle = riddles[doorNumber - 1];

    // Modal einrichten
    document.getElementById('doorNumber').textContent = doorNumber;
    document.getElementById('questionTitle').textContent = `LOVI TÜRCHEN ${doorNumber}`;
    document.getElementById('questionText').textContent = riddle.question;

    // Options-Container leeren
    const optionsContainer = document.getElementById('optionsContainer');
    optionsContainer.innerHTML = '';

    // Special Inputs verstecken
    document.getElementById('specialInputs').style.display = 'none';

    // Feedback zurücksetzen
    document.getElementById('feedbackMessage').textContent = '';
    document.getElementById('feedbackMessage').className = 'feedback-message';

    // Je nach Fragetyp unterschiedlich behandeln
    if (riddle.type === 'multiple-choice' || riddle.type === 'true-false') {
        riddle.options.forEach((option, index) => {
            const optionElement = document.createElement('button');
            optionElement.className = 'option';
            optionElement.textContent = option;
            optionElement.dataset.index = index;
            optionElement.addEventListener('click', () => {
                document.querySelectorAll('.option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                optionElement.classList.add('selected');
            });
            optionsContainer.appendChild(optionElement);
        });
    } else if (riddle.type === 'slider') {
        const sliderHTML = `
            <div class="slider-container" style="margin: 20px 0;">
                <input type="range" min="${riddle.min}" max="${riddle.max}" value="${Math.floor((riddle.min + riddle.max) / 2)}" 
                       class="login-input" id="answerSlider" style="width: 100%;">
                <div style="text-align: center; margin-top: 10px; font-size: 1.2rem; color: var(--gold);">
                    Wert: <span id="sliderValue">${Math.floor((riddle.min + riddle.max) / 2)}</span> ${riddle.unit}
                </div>
            </div>
        `;
        document.getElementById('specialInputs').innerHTML = sliderHTML;
        document.getElementById('specialInputs').style.display = 'block';

        const slider = document.getElementById('answerSlider');
        const sliderValue = document.getElementById('sliderValue');

        slider.addEventListener('input', () => {
            sliderValue.textContent = slider.value;
        });
    } else if (riddle.type === 'text') {
        document.getElementById('specialInputs').innerHTML = `
            <input type="text" id="textAnswer" class="login-input" placeholder="Gib deine Antwort ein..." style="width: 100%; margin: 20px 0;">
        `;
        document.getElementById('specialInputs').style.display = 'block';
    } else if (riddle.type === 'date') {
        document.getElementById('specialInputs').innerHTML = `
            <input type="date" id="dateAnswer" class="login-input" style="width: 100%; margin: 20px 0;">
        `;
        document.getElementById('specialInputs').style.display = 'block';
    }

    // Modal anzeigen
    riddleModal.classList.add('active');
}

function checkAnswer() {
    const doorNumber = currentDoor;
    const riddle = riddles[doorNumber - 1];
    const feedbackMessage = document.getElementById('feedbackMessage');

    let isCorrect = false;

    if (riddle.type === 'multiple-choice' || riddle.type === 'true-false') {
        const selectedOption = document.querySelector('.option.selected');
        if (!selectedOption) {
            feedbackMessage.textContent = 'Bitte wähle eine Antwort aus!';
            feedbackMessage.className = 'feedback-message incorrect';
            return;
        }

        const selectedIndex = parseInt(selectedOption.dataset.index);
        isCorrect = selectedIndex === riddle.correctAnswer;
    } else if (riddle.type === 'slider') {
        const slider = document.getElementById('answerSlider');
        const userValue = parseInt(slider.value);
        const correctValue = riddle.correctAnswer;
        const tolerance = Math.max(5, Math.floor(correctValue * 0.1));
        isCorrect = Math.abs(userValue - correctValue) <= tolerance;
    } else if (riddle.type === 'text') {
        const textAnswer = document.getElementById('textAnswer');
        const userAnswer = textAnswer.value.trim().toLowerCase();
        isCorrect = userAnswer === riddle.correctAnswer.toLowerCase();
    } else if (riddle.type === 'date') {
        const dateAnswer = document.getElementById('dateAnswer');
        const userDate = new Date(dateAnswer.value);
        const correctDate = new Date(riddle.correctAnswer);
        isCorrect = userDate.getTime() === correctDate.getTime();
    }

    if (isCorrect) {
        // Erfolg
        feedbackMessage.textContent = 'Richtig! Herzlichen Glückwunsch!';
        feedbackMessage.className = 'feedback-message correct';

        correctSound.volume = 0.3;
        correctSound.currentTime = 0;
        correctSound.play();

        createConfetti();

        setTimeout(() => {
            riddleModal.classList.remove('active');
            showReward(doorNumber);
        }, 1500);
    } else {
        // Fehler
        feedbackMessage.textContent = 'Leider falsch. Versuche es noch einmal!';
        feedbackMessage.className = 'feedback-message incorrect';

        riddleModal.classList.add('shake');
        setTimeout(() => riddleModal.classList.remove('shake'), 500);
    }
}

function showReward(doorNumber) {
    document.getElementById('rewardDoorNumber').textContent = doorNumber;

    const emoji = doorNumber === 24 ? '✨🎄🎅✨' : '🎁';
    document.getElementById('rewardEmoji').textContent = emoji;

    document.getElementById('rewardText').textContent = rewards[doorNumber - 1];

    // Modal anzeigen
    rewardModal.classList.add('active');

    // Glockensound
    bellSound.volume = 0.5;
    bellSound.currentTime = 0;
    bellSound.play();

    // Wenn noch nicht gelöst, speichern
    if (!solvedRiddles.includes(doorNumber)) {
        solvedRiddles.push(doorNumber);
        localStorage.setItem('ac_solvedRiddles', JSON.stringify(solvedRiddles));
        createStars();
        updateCalendar();
        adjustStarProgress();
    }
}

const snowContainer = document.getElementById("snow-container");

let snowCount = 50;
let snowSpeedMult = 1.0;
let snowBoosted = false;

function createSnowflakes(count) {
    snowContainer.innerHTML = "";
    for (let i = 0; i < count; i++) {
        const f = document.createElement("div");
        f.className = "snowflake";
        const delay = Math.random() * 8;
        const duration = 8 + Math.random() * 8;
        const sx = Math.random() * 100;
        const drift = (Math.random() * 60 - 30);
        f.style.left = sx + "vw";
        f.style.setProperty("--sx", sx + "vw");
        f.style.setProperty("--sx2", (sx + drift) + "vw");
        f.style.animationDuration = `${duration / snowSpeedMult}s, ${6 / snowSpeedMult}s`;
        f.style.animationDelay = `${delay}s, ${delay / 2}s`;
        f.style.opacity = 0.6 + Math.random() * 0.4;
        f.style.transform = `scale(${0.6 + Math.random() * 0.8})`;
        snowContainer.appendChild(f);
    }
}
createSnowflakes(snowCount);

function boostSnow() {
    snowCount = 200;
    snowSpeedMult = 1.5;
    snowBoosted = true;
    createSnowflakes(snowCount);
}
// ============ KONFETTI ============
function createConfetti() {
    const canvas = confettiCanvas;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const confettiCount = 120;
    const confetti = [];

    for (let i = 0; i < confettiCount; i++) {
        confetti.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            r: Math.random() * 10 + 5,
            d: Math.random() * 5 + 2,
            color: `hsl(${Math.random() * 360}, 100%, 60%)`,
            tilt: Math.random() * 10 - 10,
            tiltAngleIncrement: Math.random() * 0.1 + 0.05,
            tiltAngle: 0
        });
    }

    let animationId;
    let time = 0;

    function drawConfetti() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        confetti.forEach((c, i) => {
            ctx.beginPath();
            ctx.lineWidth = c.d;
            ctx.strokeStyle = c.color;
            ctx.moveTo(c.x + c.tilt + c.r, c.y);
            ctx.lineTo(c.x + c.tilt, c.y + c.tilt + c.r);
            ctx.stroke();

            c.tiltAngle += c.tiltAngleIncrement;
            c.y += (Math.cos(time + c.d) + 1 + c.r / 2) / 2;
            c.x += Math.sin(time) / 2;
            c.tilt = Math.sin(c.tiltAngle) * 15;

            if (c.y > canvas.height) {
                confetti[i] = {
                    x: Math.random() * canvas.width,
                    y: -10,
                    r: c.r,
                    d: c.d,
                    color: c.color,
                    tilt: c.tilt,
                    tiltAngleIncrement: c.tiltAngleIncrement,
                    tiltAngle: c.tiltAngle
                };
            }
        });

        time += 0.05;

        if (time < 3) {
            animationId = requestAnimationFrame(drawConfetti);
        } else {
            cancelAnimationFrame(animationId);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    drawConfetti();
}

function loadProgress() {
    const savedProgress = localStorage.getItem('ac_solvedRiddles');
    if (savedProgress) {
        solvedRiddles = JSON.parse(savedProgress);
        createStars();
    }
}

function setupEventListeners() {
    // Login
    loginButton.addEventListener('click', handleLogin);
    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleLogin();
    });

    // Navigation
    prevButton.addEventListener('click', () => {
        if (currentPage > 0) {
            currentPage--;
            updateCalendar();
        }
    });

    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages - 1) {
            currentPage++;
            updateCalendar();
        }
    });

    // Tastaturnavigation
    document.addEventListener('keydown', (e) => {
        if (loginOverlay.classList.contains('hidden')) {
            if (e.key === 'ArrowLeft' && currentPage > 0) {
                currentPage--;
                updateCalendar();
            } else if (e.key === 'ArrowRight' && currentPage < totalPages - 1) {
                currentPage++;
                updateCalendar();
            } else if (e.key === 'Escape') {
                document.querySelectorAll('.modal-overlay').forEach(modal => {
                    modal.classList.remove('active');
                });
            }

            // Konami-Code
            konamiCode.push(e.key);
            if (konamiCode.length > konamiSequence.length) {
                konamiCode.shift();
            }

            if (konamiCode.join(',') === konamiSequence.join(',')) {
                for (let i = 1; i <= 24; i++) {
                    if (!solvedRiddles.includes(i)) {
                        solvedRiddles.push(i);
                    }
                }
                localStorage.setItem('ac_solvedRiddles', JSON.stringify(solvedRiddles));
                createStars();
                updateCalendar();
                adjustStarProgress();
                alert('Dev-Mode aktiviert! Alle Türchen sind jetzt geöffnet!');
                konamiCode = [];
            }
        }
    });

    // Swipe-Navigation
    let touchStartX = 0;
    calendarGrid.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, false);

    calendarGrid.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > 40) {
            if (diff > 0 && currentPage < totalPages - 1) {
                currentPage++;
                updateCalendar();
            } else if (diff < 0 && currentPage > 0) {
                currentPage--;
                updateCalendar();
            }
        }
    }, false);

    // Modal-Buttons
    document.getElementById('closeRiddleModal').addEventListener('click', () => {
        riddleModal.classList.remove('active');
    });

    document.getElementById('closeRewardModal').addEventListener('click', () => {
        rewardModal.classList.remove('active');
    });

    document.getElementById('submitAnswer').addEventListener('click', checkAnswer);

    // Modal außerhalb schließen
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });

    // Fenstergröße anpassen
    window.addEventListener('resize', () => {
        confettiCanvas.width = window.innerWidth;
        confettiCanvas.height = window.innerHeight;
        createSnowflakes();
    });
}

function handleLogin() {
    const password = passwordInput.value;

    if (password === 'lovi liebt dich') {
        loginOverlay.classList.add('hidden');
        updateCountdown();
        createSnowflakes(); // Schneeflocken neu erstellen nach Login
        setTimeout(() => {
            // Zusätzliche Animation nach kurzer Verzögerung
            document.querySelectorAll('.door').forEach(door => {
                door.style.transition = 'all 0.5s ease';
            });
        }, 500);
    } else {
        loginError.textContent = 'Falsches Passwort. Versuche es erneut.';
        loginError.style.display = 'block';

        setTimeout(() => {
            loginError.style.display = 'none';
        }, 3000);
    }
}

// ============ APP START ============
window.addEventListener('DOMContentLoaded', initApp);