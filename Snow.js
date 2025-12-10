// Snow Animation Module
const Snow = {
  container: null,
  count: CONFIG.SNOW_COUNT_INITIAL,
  speedMultiplier: 1.0,
  boosted: false,

  init() {

  },

  create(count) {
    if (!this.container) return 0;
    
    this.container.innerHTML = '';
    
    for (let i = 0; i < count; i++) {
      const flake = document.createElement('div');
      flake.className = 'snowflake';
      
      const delay = Math.random() * 8;
      const duration = 8 + Math.random() * 8;
      const startX = Math.random() * 100;
      const drift = Math.random() * 60 - 30;
      const endX = startX + drift;
      
      flake.style.left = `${startX}vw`;
      flake.style.setProperty('--sx', `${startX}vw`);
      flake.style.setProperty('--sx2', `${endX}vw`);
      flake.style.animationDuration = `${duration / this.speedMultiplier}s, ${6 / this.speedMultiplier}s`;
      flake.style.animationDelay = `${delay}s, ${delay / 2}s`;
      flake.style.opacity = 0.6 + Math.random() * 0.4;
      flake.style.transform = `scale(${0.6 + Math.random() * 0.8})`;
      
      this.container.appendChild(flake);
    }
  },

  boost() {
    if (this.boosted) return;
    
    this.count = CONFIG.SNOW_COUNT_BOOSTED;
    this.speedMultiplier = CONFIG.SNOW_SPEED_MULTIPLIER;
    this.boosted = true;
    this.create(this.count);
  }
};

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
  Snow.init();
});