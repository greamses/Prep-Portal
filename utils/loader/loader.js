/* ============================================
   LOADER FUNCTIONALITY
   ============================================ */

class PageLoader {
  constructor(options = {}) {
    this.duration = options.duration || 920;
    this.onComplete = options.onComplete || null;
    this.loader = null;
    this.scrollHint = null;
  }
  
  init() {
    this.loader = document.getElementById('loader');
    this.scrollHint = document.querySelector('.scroll-hint');
    
    if (!this.loader) return;
    
    // Add loader class to body when page is ready
    window.addEventListener('load', () => {
      setTimeout(() => {
        this.hideLoader();
      }, this.duration);
    });
  }
  
  hideLoader() {
    if (this.loader) {
      this.loader.classList.add('done');
    }
    
    document.body.classList.add('active', 'loaded');
    
    if (this.onComplete && typeof this.onComplete === 'function') {
      this.onComplete();
    }
  }
  
  showLoader() {
    if (this.loader) {
      this.loader.classList.remove('done');
    }
    document.body.classList.remove('active', 'loaded');
  }
  
  setText(text1, text2) {
    if (!this.loader) return;
    
    const words = this.loader.querySelectorAll('.loader-word span');
    if (words.length >= 2) {
      words[0].textContent = text1;
      words[1].textContent = text2;
    }
  }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const pageLoader = new PageLoader();
  pageLoader.init();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PageLoader;
}