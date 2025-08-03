(() => {
  const todayISO = new Date().toISOString().split('T')[0];
  const bg = document.getElementById('background');
  const heart = document.getElementById('heart');
  const container = document.getElementById('buttonContainer');
  const infoBox = document.getElementById('infoBox');
  const textboxContent = document.getElementById('textboxContent');
  const closeBtn = document.getElementById('closeTextbox');

  document.querySelectorAll('.glow-button').forEach(button => {
    const btnDate = button.dataset.date;
    const btnText = button.dataset.text;
    
    if (btnDate <= todayISO) {
      button.addEventListener('click', () => {
        bg.style.backgroundColor = 'black';
        container.classList.add('fade-out');
        heart.style.transition = 'opacity 1s ease-out';
        heart.style.opacity = '0';
        infoBox.classList.remove('hidden');
        infoBox.style.display = 'flex';
        infoBox.style.animation = 'openTextbox 0.5s forwards';
        textboxContent.innerText = btnText;

      });

    } 
    else {
      button.style.opacity = 0.5;
      button.style.cursor = 'not-allowed';

    }

  });

  closeBtn.addEventListener('click', () => {
    infoBox.style.animation = 'closeTextbox 0.4s forwards';

    setTimeout(() => {
      infoBox.style.display = 'none';
      infoBox.classList.add('hidden');
      bg.style.backgroundColor = 'black';
      heart.style.opacity = '0.15';
      container.classList.remove('fade-out');

    }, 400);

  });

})();

window.addEventListener('load', () => {
  const screen = document.getElementById('whiteScreen');
  const bg = document.getElementById('background');
  screen.classList.add('fade-out-white');
  setTimeout(() => {
    screen.remove();
    bg.classList.remove('hidden');
  }, 1500);
});