class PageLoader {
  constructor(options = {}) {
    // Increased duration slightly so the triple pulse is seen clearly
    this.duration = options.duration || 1800;
    this.loader = document.getElementById('loader');
  }
  
  init() {
    if (!this.loader) return;
    
    window.addEventListener('load', () => {
      // Small safety check to ensure images are ready
      setTimeout(() => {
        this.hide();
      }, this.duration);
    });
  }
  
  hide() {
    this.loader.classList.add('done');
    
    // Smoothly reveal the website content
    document.body.classList.add('active', 'loaded');
    
    // Dispatch a custom event in case other components need to know
    window.dispatchEvent(new Event('portalReady'));
  }
}

// Auto-run when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const portalLoader = new PageLoader();
  portalLoader.init();
});