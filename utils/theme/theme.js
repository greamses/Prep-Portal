

(function () {
  'use strict';

  /* ─────────────────────────────────────────
     CONSTANTS
  ───────────────────────────────────────── */
  const STORAGE_KEY  = 'prep-portal-theme';
  const ATTR         = 'data-theme';
  const ROOT         = document.documentElement;

  const LOGO_LIGHT   = '../logo/logo-light.svg';
  const LOGO_DARK    = '../logo/logo-dark.svg';


  /* ─────────────────────────────────────────
     STEP 1 — FOUC PREVENTION
     Runs synchronously; sets theme before
     first paint so there is zero flash.
  ───────────────────────────────────────── */
  ROOT.classList.add('no-transitions');

  const _saved = localStorage.getItem(STORAGE_KEY);
  const _sysDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const _initial = (_saved === 'light' || _saved === 'dark')
    ? _saved
    : (_sysDark ? 'dark' : 'light');

  ROOT.setAttribute(ATTR, _initial);


  /* ─────────────────────────────────────────
     STEP 2 — CORE HELPERS
  ───────────────────────────────────────── */

  /** Read current theme from DOM */
  function getTheme() {
    return ROOT.getAttribute(ATTR) || 'light';
  }

  /** Apply theme: DOM attribute + localStorage + icon + logos */
  function setTheme(theme, announce) {
    ROOT.setAttribute(ATTR, theme);
    localStorage.setItem(STORAGE_KEY, theme);
    _updateToggleUI(theme);
    _updateLogos(theme);
    if (announce) _announceTheme(theme);

    // Fire custom event so other scripts can react
    window.dispatchEvent(new CustomEvent('prep-portal:theme-change', {
      detail: { theme }
    }));
  }

  /** Flip current theme */
  function toggleTheme() {
    setTheme(getTheme() === 'light' ? 'dark' : 'light', true);
  }


  /* ─────────────────────────────────────────
     STEP 3 — TOGGLE BUTTON
  ───────────────────────────────────────── */

  /**
   * Build the neobrutalist toggle button.
   * Uses CSS classes for icon visibility
   * (not inline style) so CSS animations work.
   */
  function _createToggleButton() {
    const btn = document.createElement('button');
    btn.className     = 'theme-toggle';
    btn.type          = 'button';
    btn.setAttribute('aria-label',   'Switch to dark mode');
    btn.setAttribute('aria-pressed', 'false');

    // Sun icon (visible in light mode)
    btn.innerHTML = `
      <svg class="theme-icon theme-icon--sun"
           width="18" height="18" viewBox="0 0 24 24"
           fill="none" stroke="currentColor" stroke-width="2.5"
           stroke-linecap="round" stroke-linejoin="round"
           aria-hidden="true" focusable="false">
        <circle cx="12" cy="12" r="4.5"/>
        <line x1="12" y1="2"    x2="12" y2="4.5"/>
        <line x1="12" y1="19.5" x2="12" y2="22"/>
        <line x1="4.22" y1="4.22"   x2="5.93" y2="5.93"/>
        <line x1="18.07" y1="18.07" x2="19.78" y2="19.78"/>
        <line x1="2"  y1="12" x2="4.5"  y2="12"/>
        <line x1="19.5" y1="12" x2="22" y2="12"/>
        <line x1="4.22" y1="19.78" x2="5.93" y2="18.07"/>
        <line x1="18.07" y1="5.93"  x2="19.78" y2="4.22"/>
      </svg>
      <!-- Moon icon (visible in dark mode) -->
      <svg class="theme-icon theme-icon--moon"
           width="18" height="18" viewBox="0 0 24 24"
           fill="none" stroke="currentColor" stroke-width="2.5"
           stroke-linecap="round" stroke-linejoin="round"
           aria-hidden="true" focusable="false">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
      </svg>`;

    btn.addEventListener('click', toggleTheme);

    // Keyboard: Space / Enter handled natively for <button>
    return btn;
  }

  /** Sync toggle button aria + icon visibility to current theme */
  function _updateToggleUI(theme) {
    const btn = document.querySelector('.theme-toggle');
    if (!btn) return;

    const isDark = theme === 'dark';
    btn.setAttribute('aria-pressed', String(isDark));
    btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    btn.classList.toggle('theme-toggle--dark', isDark);
  }

  /** Swap every logo image in the document */
  function _updateLogos(theme) {
    const isDark = theme === 'dark';
    document.querySelectorAll('img[src*="logo-light"], img[src*="logo-dark"]')
      .forEach(img => {
        img.src = isDark ? LOGO_DARK : LOGO_LIGHT;
      });
  }


  /* ─────────────────────────────────────────
     STEP 4 — SCREEN-READER ANNOUNCEMENT
     A visually-hidden live region reads the
     new theme name aloud on toggle.
  ───────────────────────────────────────── */
  let _liveRegion = null;

  function _ensureLiveRegion() {
    if (_liveRegion) return;
    _liveRegion = document.createElement('span');
    _liveRegion.setAttribute('aria-live',   'polite');
    _liveRegion.setAttribute('aria-atomic', 'true');
    // Visually hidden, always in DOM
    Object.assign(_liveRegion.style, {
      position: 'absolute',
      width:    '1px',
      height:   '1px',
      padding:  '0',
      margin:   '-1px',
      overflow: 'hidden',
      clip:     'rect(0,0,0,0)',
      border:   '0',
    });
    document.body.appendChild(_liveRegion);
  }

  function _announceTheme(theme) {
    _ensureLiveRegion();
    // Brief delay lets the DOM update first
    setTimeout(() => {
      _liveRegion.textContent = '';
      setTimeout(() => {
        _liveRegion.textContent =
          theme === 'dark' ? 'Dark mode enabled' : 'Light mode enabled';
      }, 50);
    }, 0);
  }


  /* ─────────────────────────────────────────
     STEP 5 — INJECT TOGGLE INTO NAV
  ───────────────────────────────────────── */
  function _injectToggle() {
    // Don't inject twice (e.g. after hot reload)
    if (document.querySelector('.theme-toggle')) {
      _updateToggleUI(getTheme());
      return;
    }

    const siteNav  = document.querySelector('.site-nav');
    const navLinks = document.querySelector('.nav-links');

    if (!siteNav || !navLinks) return;

    const btn = _createToggleButton();
    // Insert just before the nav-links list
    siteNav.insertBefore(btn, navLinks);
  }


  /* ─────────────────────────────────────────
     STEP 6 — SYSTEM PREFERENCE LISTENER
     If the user has never set a preference,
     honour live OS-level changes (e.g. sunset
     mode on macOS / Android).
  ───────────────────────────────────────── */
  window.matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', (e) => {
      // Only follow system if the user hasn't made a manual choice
      if (!localStorage.getItem(STORAGE_KEY)) {
        setTheme(e.matches ? 'dark' : 'light', false);
      }
    });


  /* ─────────────────────────────────────────
     STEP 7 — INITIALISE
  ───────────────────────────────────────── */
  function _init() {
    _injectToggle();

    // Sync everything to whatever was set in STEP 1
    setTheme(getTheme(), false);

    // Re-enable transitions now that theme is applied
    // rAF ensures at least one paint has happened
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        ROOT.classList.remove('no-transitions');
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _init);
  } else {
    _init();
  }


  /* ─────────────────────────────────────────
     STEP 8 — PUBLIC API
     Other scripts (prepbot, keys.js, etc.)
     can read/set theme via window.PrepPortalTheme.
  ───────────────────────────────────────── */
  window.PrepPortalTheme = {
    get:    getTheme,
    set:    (t) => setTheme(t, true),
    toggle: toggleTheme,
  };

})();


/* ══════════════════════════════════════════
   TOGGLE BUTTON STYLES  (injected once)
   Keeps everything self-contained — no
   separate stylesheet dependency for the
   toggle itself.
══════════════════════════════════════════ */
(function _injectToggleStyles() {
  if (document.getElementById('pp-theme-toggle-styles')) return;
  const style = document.createElement('style');
  style.id = 'pp-theme-toggle-styles';
  style.textContent = `
    /* ── Neobrutalist toggle button ─────── */
    .theme-toggle {
      --_bg:     var(--surface, #fffef8);
      --_border: var(--border-color, #0a0a0a);
      --_shadow: var(--shadow-sm, 3px 3px 0 #0a0a0a);

      display:         flex;
      align-items:     center;
      justify-content: center;
      width:           38px;
      height:          38px;
      background:      var(--_bg);
      border:          2.5px solid var(--_border);
      box-shadow:      var(--_shadow);
      cursor:          pointer;
      color:           var(--ink, #0a0a0a);
      flex-shrink:     0;
      transition:
        box-shadow  0.12s ease,
        transform   0.12s ease,
        background  0.2s  ease;
    }

    .theme-toggle:hover {
      box-shadow: var(--shadow-md, 5px 5px 0 #0a0a0a);
      transform:  translate(-1px, -1px);
    }

    .theme-toggle:active {
      box-shadow: none;
      transform:  translate(2px, 2px);
    }

    /* Focus ring — use theme token */
    .theme-toggle:focus-visible {
      outline:        var(--focus-ring, 3px solid #ffe500);
      outline-offset: var(--focus-ring-offset, 2px);
    }

    /* Dark mode variant */
    .dark .theme-toggle {
      --_bg:     var(--surface, #1a1a1a);
      --_border: var(--border-color, #f0f0f0);
      --_shadow: 3px 3px 0 var(--border-color, #f0f0f0);
    }

    /* ── Icon visibility via CSS ─────────
       CSS controls this — not JS inline style.
       Avoids FOUC on the icon itself.
    ─────────────────────────────────────── */
    .theme-icon { display: block; }

    /* Light mode: show sun, hide moon */
    :root:not(.dark) .theme-icon--moon,
    [data-theme="light"]           .theme-icon--moon { display: none; }

    /* Dark mode: show moon, hide sun */
    .dark .theme-icon--sun              { display: none; }
    .dark .theme-icon--moon             { display: block; }

    /* SVG inherits button colour */
    .theme-toggle svg { stroke: currentColor; }
  `;
  document.head.appendChild(style);
}());
