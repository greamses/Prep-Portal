// config.js - Complete path configuration with all assets
const CONFIG = {
  BASE_PATH: '../',
  
  // Root paths
  ROOTS: {
    LOGO: '../logo/',
    JS: '../../../../js/',
    CSS: '../../../../',
    UTILS: '../../../../utils/',
    MAIN_CSS: '../../../../',
    BLOG_CSS: '../../../css/',
    BLOG_JS: '../../../js/',
    FOOTER_LOGO: '../../../../logo/'
  },
  
  // Logo files
  LOGOS: {
    icon: '../../../../logo/logo-light.svg',
    light: '../../../../logo/logo-light.svg',
    dark: '../logo/logo-dark.svg',
    favicon: '../logo/favicon.ico'
  },
  
  // All JS files
  JS_FILES: {
    config: 'config.js',
    pathConfig: '../../../../js/path-config.js',
    nav: '../../../js/nav.js',
    loader: '../../../../utils/loader/loader.js',
    blog: 'blog.js',
    mathJax: 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js'
  },
  
  // All CSS files
  CSS_FILES: {
    main: '../../../../main.css',
    blog: '../../../css/blog.css'
  },
  
  // Firebase imports
  FIREBASE_IMPORTS: {
    app: 'https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js',
    auth: 'https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js',
    firestore: 'https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js'
  },
  
  // Helper methods
  getPath: function(path) {
    return this.BASE_PATH + path;
  },
  
  getLogo: function(logoKey) {
    return this.BASE_PATH + this.LOGOS[logoKey];
  },
  
  getJS: function(jsKey) {
    return this.BASE_PATH + this.JS_FILES[jsKey];
  },
  
  getCSS: function(cssKey) {
    return this.BASE_PATH + this.CSS_FILES[cssKey];
  },
  
  getRoot: function(rootKey) {
    return this.BASE_PATH + this.ROOTS[rootKey];
  },
  
  // Load favicon/icon
  loadFavicon: function() {
    const link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/svg+xml';
    link.href = this.getLogo('icon');
    document.head.appendChild(link);
  },
  
  // Load single CSS
  loadCSS: function(cssKey) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = this.getCSS(cssKey);
    document.head.appendChild(link);
  },
  
  // Load all CSS
  loadAllCSS: function() {
    this.loadCSS('main');
    this.loadCSS('blog');
  },
  
  // Load single JS
  loadJS: function(jsKey, isModule = false) {
    const script = document.createElement('script');
    script.src = this.getJS(jsKey);
    if (isModule) script.type = 'module';
    document.head.appendChild(script);
    return script;
  },
  
  // Load all essential JS
  loadAllJS: function() {
    this.loadJS('pathConfig', true);
    this.loadJS('nav', true);
    this.loadJS('loader', true);
    
    // Load blog.js last
    setTimeout(() => {
      import(this.getJS('blog'));
    }, 200);
  },
  
  // Update base path
  updatePaths: function(newBasePath) {
    this.BASE_PATH = newBasePath;
    console.log('Base path updated to:', newBasePath);
  }
};

// Export for browser
if (typeof window !== 'undefined') {
  window.CONFIG = CONFIG;
}