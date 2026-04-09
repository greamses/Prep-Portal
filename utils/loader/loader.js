(function() {
  const loaderId = 'loader';
  const accentColor = '#ffe500';
  
  // 1. INJECT CSS IMMEDIATELY (Prevents Flash)
  const style = document.createElement('style');
  style.textContent = `
      #${loaderId} {
        position: fixed !important;
        inset: 0 !important;
        background: #0a0a0a !important;
        z-index: 999999 !important;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 6px;
        font-family: 'Unbounded', sans-serif;
        visibility: visible;
        opacity: 1;
      }

      #${loaderId}.done { 
        opacity: 0; 
        visibility: hidden; 
        transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.8s;
        pointer-events: none; 
      }

      #loader-wrapper { display: flex; flex-direction: column; align-items: center; margin-bottom: 20px; }
      .logo-cluster { display: flex; gap: 12px; }
      
      .pulse-logo { width: 32px; height: auto; opacity: 0; animation: logoWave 1.6s infinite; }
      .pulse-logo:nth-child(2) { animation-delay: 0.15s; }
      .pulse-logo:nth-child(3) { animation-delay: 0.3s; }

      @keyframes logoWave {
        0%, 100% { transform: scale(0.92); opacity: 0.2; filter: grayscale(100%) brightness(0.4); }
        50% { transform: scale(1.05); opacity: 1; filter: grayscale(0%) brightness(1.1); }
      }

      .loader-word { overflow: hidden; height: clamp(30px, 6vw, 60px); line-height: 1.1; }
      .loader-word span {
        display: block; font-weight: 900; font-size: clamp(28px, 6vw, 56px);
        color: #ffffff; text-transform: uppercase; letter-spacing: -0.01em;
        transform: translateY(110%); animation: loaderWordIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }

      .loader-word:last-of-type span { color: ${accentColor}; }

      @keyframes loaderWordIn { to { transform: translateY(0); } }

      .loader-bar {
        width: 0px; height: 2px; background: ${accentColor};
        margin-top: 20px; animation: lb 1.5s cubic-bezier(0.16, 1, 0.3, 1) 0.6s forwards;
      }
      @keyframes lb { to { width: 140px; } }
      
      /* Ensure body becomes visible when loader hides */
      body.portal-ready {
        visibility: visible !important;
      }
    `;
  document.head.appendChild(style);
  
// State tracking
let cssReady = false;
let pageLoaded = false;
let loaderHidden = false;

// Function to check if we can hide loader
function tryHideLoader() {
  if (loaderHidden) return;
  
  // STRICTLY rely on CONFIG's tracking. Do NOT guess using document.styleSheets.
  const configCssReady = (window.CONFIG && window.CONFIG.isCssReady && window.CONFIG.isCssReady()) || window.__CONFIG_CSS_READY === true;
  
  cssReady = configCssReady;
  
  // Hide loader ONLY when both CSS is fully loaded AND page is loaded
  if ((cssReady && pageLoaded) || window.__FORCE_HIDE_LOADER) {
    hideLoader();
  }
}

function hideLoader() {
  if (loaderHidden) return;
  loaderHidden = true;
  
  const loader = document.getElementById(loaderId);
  if (!loader) return;
  
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      
      document.body.style.visibility = 'visible';
      document.body.classList.add('portal-ready');
      loader.classList.add('done');
      
      setTimeout(() => {
        loader.style.display = 'none';
      }, 850);
      
    });
  });
}
  
  // 2. ENHANCE HTML CONTENT
  function init() {
    const loader = document.getElementById(loaderId);
    if (!loader) return;
    
    // Inject Triple SVGs
    const cluster = loader.querySelector('.logo-cluster');
    if (cluster) {
      const svg = `<svg class="pulse-logo" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M50 98L10 75V25L50 2L90 25V75L50 98Z" fill="#0a0a0a" fill-opacity="0.1" /><path d="M50 50L10 27V73L50 96V50Z" fill="#0055ff" stroke="#0a0a0a" stroke-width="2.5" /><path d="M50 50L90 27V73L50 96V50Z" fill="#003db3" stroke="#0a0a0a" stroke-width="2.5" /><path d="M50 50L90 27L50 4L10 27L50 50Z" fill="#ffffff" stroke="#0a0a0a" stroke-width="2.5" /><path d="M50 35L65 43V58L50 66L35 58V43L50 35Z" fill="${accentColor}" stroke="#0a0a0a" stroke-width="2" /><circle cx="50" cy="50.5" r="4" fill="#0a0a0a" /></svg>`;
      cluster.innerHTML = svg + svg + svg;
    }
    
    // Stagger word entry
    const words = loader.querySelectorAll('.loader-word span');
    words.forEach((span, i) => {
      span.style.animationDelay = `${0.4 + (i * 0.15)}s`;
    });
    
    // Listen for CSS ready event from CONFIG
    window.addEventListener('configCssReady', () => {
      console.log('[Loader] Received configCssReady event');
      cssReady = true;
      tryHideLoader();
    });
    
    // Page load event
    window.addEventListener('load', () => {
      console.log('[Loader] Page load complete');
      pageLoaded = true;
      tryHideLoader();
    });
    
    // Safety timeout - force hide loader after 5 seconds max
    setTimeout(() => {
      if (!loaderHidden) {
        console.warn('[Loader] Safety timeout - forcing loader hide');
        window.__FORCE_HIDE_LOADER = true;
        hideLoader();
      }
    }, 5000);
    
    // Also check periodically in case events were missed
    const checkInterval = setInterval(() => {
      if (loaderHidden) {
        clearInterval(checkInterval);
        return;
      }
      
      // Check if CONFIG has marked CSS ready
      if (window.CONFIG?.isCssReady?.() || window.__CONFIG_CSS_READY) {
        cssReady = true;
        tryHideLoader();
      }
      
      // Check if page is loaded
      if (document.readyState === 'complete') {
        pageLoaded = true;
        tryHideLoader();
      }
    }, 100);
    
    // Clean up interval after 6 seconds
    setTimeout(() => clearInterval(checkInterval), 6000);
  }
  
  // Run as soon as DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();