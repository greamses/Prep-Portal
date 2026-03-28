/**
 * PORTAL LOADER - PRE-RENDER VERSION
 * This script injects critical CSS immediately to prevent "Content Flash"
 */
(function() {
  const loaderId = 'loader';
  
  // --- PART A: IMMEDIATE CSS INJECTION ---
  // We do this immediately so the browser knows #loader is black/fixed 
  // before it even reaches the <body> tag.
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
      transition: opacity 0.8s ease, visibility 0.8s;
      pointer-events: none; 
    }
    
    /* Hide the rest of the body content until loader is ready if needed */
    body:not(.loaded) { overflow: hidden; }

    /* Animation Styles */
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
    .loader-word:last-of-type span { color: #ffe500; }
    @keyframes loaderWordIn { to { transform: translateY(0); } }
    .loader-bar { width: 0px; height: 2px; background: #ffe500; margin-top: 20px; animation: lb 1.5s cubic-bezier(0.16, 1, 0.3, 1) 0.6s forwards; }
    @keyframes lb { to { width: 140px; } }
  `;
  document.head.appendChild(style);
  
  // --- PART B: CONTENT ENHANCEMENT ---
  function initLoader() {
    const loader = document.getElementById(loaderId);
    if (!loader) return;
    
    // 1. Inject Icons
    const cluster = loader.querySelector('.logo-cluster');
    if (cluster) {
      const svg = `<svg class="pulse-logo" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M50 98L10 75V25L50 2L90 25V75L50 98Z" fill="#0a0a0a" fill-opacity="0.1" /><path d="M50 50L10 27V73L50 96V50Z" fill="#0055ff" stroke="#0a0a0a" stroke-width="2.5" /><path d="M50 50L90 27V73L50 96V50Z" fill="#003db3" stroke="#0a0a0a" stroke-width="2.5" /><path d="M50 50L90 27L50 4L10 27L50 50Z" fill="#ffffff" stroke="#0a0a0a" stroke-width="2.5" /><path d="M50 35L65 43V58L50 66L35 58V43L50 35Z" fill="#ffe500" stroke="#0a0a0a" stroke-width="2" /><circle cx="50" cy="50.5" r="4" fill="#0a0a0a" /></svg>`;
      cluster.innerHTML = svg + svg + svg;
    }
    
    // 2. Stagger Word Animations
    const spans = loader.querySelectorAll('.loader-word span');
    spans.forEach((span, i) => {
      span.style.animationDelay = `${0.4 + (i * 0.15)}s`;
    });
    
    // 3. Remove Loader on Window Load
    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.classList.add('done');
        document.body.classList.add('loaded');
      }, 1500); // Adjust duration as needed
    });
  }
  
  // Run init when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLoader);
  } else {
    initLoader();
  }
})();