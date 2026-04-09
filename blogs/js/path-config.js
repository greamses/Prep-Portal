// config.js
 export const CONFIG = {
  // CSS files
  cssFiles: [
    '../../../../../main.css',
    '../../../../css/blog.css',
    '../../../../css/style.css'
  ],
  
  // JS files  
  jsFiles: [
    '../../../../../utils/loader/loader.js',
    '../../../../js/path-config.js',
    '../../../../js/nav.js',
    './blog.js',

  ],
  
  // Paths for nav-data
  paths: {
    dashboardIndex: '../../../../../dashboard/dashboard.html',
    lifeHtml: '../../life/blog/blog.html',
    animalHtml: '../../animal/blog/blog.html',
    renderCss: '../../../../css/render.css',
  },
  
  // Logo files
  logoIcon: '../../../../../logo/logo-light.svg',
  logoLight: '../../../../../logo/logo-light.svg',
  logoLoading: '../../../../../logo/logo-light.svg',
  
  // Helper method
  getPath: function(key) {
    return this.paths[key] || this[key];
  },
  
  // Load all CSS
  loadAllCSS: function() {
    let loaded = 0;
    this.cssFiles.forEach(file => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = file;
      link.onload = () => {
        loaded++;
        if (loaded === this.cssFiles.length) {
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
      if (file.endsWith('.js')){
        script.type = 'module';
      }
      document.head.appendChild(script);
    });
  }
  
};

window.CONFIG = CONFIG;

