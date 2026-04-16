// path-config.js
export const CONFIG = {
  // CSS files
  cssFiles: [
    './style.css',
    '../../main.css',
    '../../theory-page/style.css'
  ],
  
  // JS files  
  jsFiles: [
    '../../utils/loader/loader.js',
    './script.js'
  ],
  
  // Paths for nav-data
  paths: {
    dashboardIndex: '../../../dashboard/dashboard.html',
    homeIndex: '../../index.html',
    nationalHtml: '#',
    internationalHtml: '#',
    competitionsHtml: '#',
    fractionExplorer: './index.html',
  },
  
  // Logo files
  logoLight: '../../../logo/logo-light.svg',
  logoLoading: '../../logo/logo-light.svg',
  
  // Helper method
  getPath: function(key) {
    return this.paths[key] || this[key];
  },
  
  // Load all CSS
  loadAllCSS: function() {
    let loaded = 0;
    const totalFiles = this.cssFiles.length;
    
    this.cssFiles.forEach(file => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = file;
      link.onload = () => {
        loaded++;
        if (loaded === totalFiles) {
          document.body.style.visibility = 'visible';
        }
      };
      link.onerror = () => {
        console.warn(`Failed to load CSS: ${file}`);
        loaded++;
        if (loaded === totalFiles) {
          document.body.style.visibility = 'visible';
        }
      };
      document.head.appendChild(link);
    });
  },
  
  // Load all JS
  loadAllJS: function() {
    this.jsFiles.forEach(file => {
      const script = document.createElement('script');
      script.src = file;
      if (file.includes('nav-component') || file.includes('nav-data')) {
        script.type = 'module';
      }
      document.head.appendChild(script);
    });
  }
};

window.CONFIG = CONFIG;