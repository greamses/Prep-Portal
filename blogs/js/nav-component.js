// NavComponent.js
// Reusable navigation component with dynamic data

import { navData } from './nav-data.js';

class NavComponent {
  constructor(options = {}) {
    this.containerId = options.containerId || 'nav-container';
    this.data = options.data || navData;
    this.onNavItemClick = options.onNavItemClick || null;
    this.onThemeToggle = options.onThemeToggle || null;
  }
  
  // Render the navigation HTML
  render() {
    const container = document.getElementById(this.containerId);
    if (!container) {
      console.error(`Navigation container #${this.containerId} not found`);
      return;
    }
    
    container.innerHTML = this.generateHTML();
    this.attachEventListeners();
    this.highlightActiveLink();
    
    return container;
  }
  
  generateHTML() {
    const { logo, links, showAuth, showThemeToggle, userAvatar } = this.data;
    
    // Build logo HTML
    const logoHTML = `
      <a href="/" class="nav-logo">
        <img src="${logo.iconPath}" alt="${logo.brandName} logo" />
        ${logo.brandTop ? `
          <div class="logo-brand">
            <span class="brand-top">${logo.brandTop}</span>
            <span class="brand-bottom">${logo.brandBottom || logo.brandName}</span>
          </div>
        ` : `
          <div class="logo-brand">${logo.brandName}</div>
        `}
      </a>
    `;
    
    // Build links HTML
    const linksHTML = links.map(link => {
      const activeClass = link.active ? 'active' : '';
      const ctaClass = link.isCta ? 'nav-cta' : '';
      return `<li><a href="${link.href}" class="${activeClass} ${ctaClass}" data-nav-link="${link.name}">${link.name}</a></li>`;
    }).join('');
    
    // Build auth section (if enabled)
    let authHTML = '';
    if (showAuth) {
      if (userAvatar) {
        authHTML = `
          <div class="nav-auth">
            <img src="${userAvatar}" alt="User avatar" class="user-avatar" />
            <button class="logout-btn" id="logoutBtn">Logout</button>
          </div>
        `;
      } else {
        authHTML = `
          <div class="nav-auth">
            <button class="login-btn" id="loginBtn">Login</button>
            <button class="signup-btn" id="signupBtn">Sign Up</button>
          </div>
        `;
      }
    }
    
    // Build theme toggle (if enabled)
    let themeHTML = '';
    if (showThemeToggle) {
      themeHTML = `
        <button class="theme-toggle" id="themeToggleBtn" aria-label="Toggle theme">
          <svg class="sun-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
          <svg class="moon-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        </button>
      `;
    }
    
    // Mobile toggle button
    const mobileToggle = `
      <button class="nav-toggle" id="nav-toggle" aria-label="Toggle menu">
        <span></span><span></span><span></span>
      </button>
    `;
    
    // Combine everything
    return `
      ${logoHTML}
      <ul class="nav-links" id="navLinks">
        ${linksHTML}
        ${showAuth ? `<li class="nav-auth-mobile" id="navAuthMobile">${authHTML}</li>` : ''}
      </ul>
      ${showThemeToggle ? themeHTML : ''}
      ${mobileToggle}
    `;
  }
  
  attachEventListeners() {
    // Mobile menu toggle
    const toggleBtn = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('navLinks');
    
    if (toggleBtn && navLinks) {
      toggleBtn.addEventListener('click', () => {
        const expanded = toggleBtn.getAttribute('aria-expanded') === 'true';
        toggleBtn.setAttribute('aria-expanded', !expanded);
        navLinks.classList.toggle('show');
        document.body.classList.toggle('nav-open');
      });
    }
    
    // Theme toggle
    const themeToggle = document.getElementById('themeToggleBtn');
    if (themeToggle && this.onThemeToggle) {
      themeToggle.addEventListener('click', () => this.onThemeToggle());
    } else if (themeToggle) {
      themeToggle.addEventListener('click', () => this.toggleTheme());
    }
    
    // Login/Signup buttons
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (loginBtn) loginBtn.addEventListener('click', () => this.handleAuth('login'));
    if (signupBtn) signupBtn.addEventListener('click', () => this.handleAuth('signup'));
    if (logoutBtn) logoutBtn.addEventListener('click', () => this.handleAuth('logout'));
    
    // Navigation link clicks
    const navLinkElements = document.querySelectorAll('[data-nav-link]');
    navLinkElements.forEach(link => {
      link.addEventListener('click', (e) => {
        if (this.onNavItemClick) {
          e.preventDefault();
          this.onNavItemClick(link.getAttribute('data-nav-link'), link.getAttribute('href'));
        }
      });
    });
  }
  
  highlightActiveLink() {
    const currentPath = window.location.pathname;
    const links = document.querySelectorAll('.nav-links a');
    
    links.forEach(link => {
      const href = link.getAttribute('href');
      if (href && href !== '#' && currentPath.includes(href.replace(/^\.\.\/|\.\//g, ''))) {
        link.classList.add('active');
      }
    });
  }
  
  toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Dispatch event for other components
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: newTheme } }));
  }
  
  handleAuth(action) {
    // Dispatch auth event — parent page can listen
    window.dispatchEvent(new CustomEvent('authAction', { detail: { action } }));
  }
  
  // Update user avatar dynamically
  setUserAvatar(avatarUrl) {
    this.data.userAvatar = avatarUrl;
    this.render();
  }
  
  // Update active link
  setActiveLink(linkName) {
    this.data.links = this.data.links.map(link => ({
      ...link,
      active: link.name === linkName
    }));
    this.render();
  }
}

// Auto-initialize if container exists
export function initNav(options = {}) {
  const nav = new NavComponent(options);
  nav.render();
  return nav;
}

export default NavComponent;