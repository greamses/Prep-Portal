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
    '../../../../js/nav.js',
    '../../../../../utils/loader/loader.js',
    './blog.js'
  ],
  
  // Logo files
  logoIcon: '../../../../../logo/logo-light.svg',
  logoLight: '../../../../../logo/logo-light.svg',
  logoLoading: '../../../../../logo/logo-light.svg',
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
            // All CSS loaded, show body
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
        if (file.endsWith('.js') && !file.includes('loader')) {
          script.type = 'module';
        }
        document.head.appendChild(script);
      });
    }

};

window.CONFIG = CONFIG;


