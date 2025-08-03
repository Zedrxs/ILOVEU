(() => {
  const todayISO = new Date().toISOString().split('T')[0];

  document.querySelectorAll('.glow-button').forEach(button => {
    const btnDate = button.dataset.date; // Format YYYY-MM-DD

    if (btnDate === todayISO) {
      // Aktuelles Datum: Button ist klickbar
      button.addEventListener('click', () => {
        const bg = document.getElementById('background');
        const heart = document.getElementById('heart');
        const container = document.getElementById('buttonContainer');

        // Background rot
        bg.style.backgroundColor = 'darkred';

        // Buttons verschwinden
        container.classList.add('fade-out');

        // Herz transparent ausblenden
        heart.style.transition = 'opacity 1s ease-out';
        heart.style.opacity = '0';
      });
    } else {
      // Andere Buttons deaktivieren
      button.style.opacity = 0.5;
      button.style.cursor = 'not-allowed';
    }
  });
})();

button.addEventListener('click', () => {
  const bg = document.getElementById('background');
  const heart = document.getElementById('heart');
  const container = document.getElementById('buttonContainer');

  // Background rot
  bg.style.backgroundColor = 'darkred';

  // Buttons verschwinden
  container.classList.add('fade-out');

  // Herz transparent ausblenden
  heart.style.transition = 'opacity 1s ease-out';
  heart.style.opacity = '0';
});