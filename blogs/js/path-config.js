// config.js
const CONFIG = {
  // CSS files
  cssFiles: [
    '../../../../../main.css',
    '../../../../css/blog.css'
  ],
  
  // JS files  
  jsFiles: [
    '../../../../js/path-config.js',
    '../../../js/nav.js',
    '../../../../utils/loader/loader.js',
    './blog.js'
  ],
  
  // Logo files
  logoIcon: '../logo/logo-icon.svg',
  logoLight: '../../../../logo/logo-light.svg',
  logoLoading: '../logo/logo-loading.svg',
  
  // Load all CSS
  loadAllCSS: function() {
    this.cssFiles.forEach(file => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = file;
      document.head.appendChild(link);
    });
  },
  
  // Load all JS
  loadAllJS: function() {
    this.jsFiles.forEach(file => {
      const script = document.createElement('script');
      script.src = file;
      if (file.endsWith('.js') && !file.includes('loader')) {
        script.type = 'module';
      }
      document.head.appendChild(script);
    });
  }
};

window.CONFIG = CONFIG;