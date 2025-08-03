(() => {
  const todayISO = new Date().toISOString().split('T')[0];
  const bg = document.getElementById('background');
  const heart = document.getElementById('heart');
  const container = document.getElementById('buttonContainer');
  const infoBox = document.getElementById('infoBox');
  const textboxContent = document.getElementById('textboxContent');

  document.querySelectorAll('.glow-button').forEach(button => {
    const btnDate = button.dataset.date;
    const btnText = button.dataset.text;
    if (btnDate <= todayISO) {
      button.addEventListener('click', () => {
        bg.style.backgroundColor = 'darkred';
        container.classList.add('fade-out');
        heart.style.transition = 'opacity 1s ease-out';
        heart.style.opacity = '0';
        infoBox.classList.remove('hidden');
        textboxContent.innerText = btnText;
      });
    } else {
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