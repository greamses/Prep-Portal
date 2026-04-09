// config.js
export const CONFIG = {
    cssFiles: [
      // Global CSS
      '../../../../../main.css',
      '../../../../css/style.css',
      '../../../../css/blog.css',
    ],
    // ... rest of your config
  // JS files  
  jsFiles: [
    '../../../../js/path-config.js',
    '../../../../js/nav.js',
    '../../../../../utils/loader/loader.js',
    './blog.js'
  ],
  
  // Paths for nav-data
  paths: {
    dashboardIndex: '../../../../../dashboard/dashboard.html',
    blogHtml: '../../animal/blog/blog.html',
    renderCss: '../../../../css/render.css',
  },
  
  // Logo files
  logoIcon: '../../../../../logo/logo-light.svg',
  logoLight: '../../../../../logo/logo-light.svg',
  logoLoading: '../../../../../logo/logo-light.svg',
  
  getPath: function(key) {
    return this.paths[key] || this[key];
  },
  
  // CSS loading state
  _cssLoaded: 0,
  _cssFailed: 0,
  _cssTotal: 0,
  _cssReady: false,
  
  // Load all CSS - returns Promise
  loadAllCSS: function() {
    this._cssTotal = this.cssFiles.length;
    this._cssLoaded = 0;
    this._cssFailed = 0;
    this._cssReady = false;
    
    console.log(`[CONFIG] Loading ${this._cssTotal} CSS files...`);
    
    if (this.cssFiles.length === 0) {
      this._markCssReady();
      return Promise.resolve();
    }
    
    const promises = this.cssFiles.map((file) => {
      return new Promise((resolve) => {
        // Check if already loaded
        const existing = document.querySelector(`link[href="${file}"]`);
        if (existing) {
          console.log(`[CONFIG] CSS already loaded: ${file}`);
          this._cssLoaded++;
          resolve();
          return;
        }
        
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = file;
        
        link.onload = () => {
          this._cssLoaded++;
          console.log(`[CONFIG] ✓ CSS loaded (${this._cssLoaded}/${this._cssTotal}): ${file}`);
          resolve();
        };
        
        link.onerror = (e) => {
          this._cssFailed++;
          console.error(`[CONFIG] ✗ CSS failed (${this._cssFailed}): ${file}`, e);
          resolve(); // Resolve anyway to not block
        };
        
        document.head.appendChild(link);
      });
    });
    
    return Promise.all(promises).then(() => {
      this._markCssReady();
      return { loaded: this._cssLoaded, failed: this._cssFailed };
    });
  },
  
  _markCssReady: function() {
    this._cssReady = true;
    
    // Set global flag for loader.js to check
    window.__CONFIG_CSS_READY = true;
    
    // Dispatch event
    window.dispatchEvent(new CustomEvent('configCssReady', {
      detail: { loaded: this._cssLoaded, failed: this._cssFailed }
    }));
    
    console.log(`[CONFIG] CSS ready - ${this._cssLoaded} loaded, ${this._cssFailed} failed`);
    
    // Make body visible as fallback
    document.body.style.visibility = 'visible';
  },
  
  // Check if CSS is ready
  isCssReady: function() {
    return this._cssReady || window.__CONFIG_CSS_READY === true;
  },
  
  // Load all JS
  loadAllJS: function() {
    this.jsFiles.forEach(file => {
      const existing = document.querySelector(`script[src="${file}"]`);
      if (existing) return;
      
      const script = document.createElement('script');
      script.src = file;
      if (file.endsWith('.js')) {
        script.type = 'module';
      }
      
      script.onerror = (error) => {
        console.error(`[CONFIG] ✗ JS failed: ${file}`, error);
      };
      
      document.head.appendChild(script);
    });
  }
  
};

window.CONFIG = CONFIG;