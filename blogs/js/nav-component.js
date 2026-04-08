// nav-component.js — INJECTS INTO EXISTING .site-nav

import { navData } from './nav-data.js';

class NavComponent {
  constructor(options = {}) {
    this.containerSelector = options.containerSelector || '.site-nav';
    this.data = options.data || navData;
    this.onNavItemClick = options.onNavItemClick || null;
    this.onThemeToggle = options.onThemeToggle || null;
    this.onAuthAction = options.onAuthAction || null;
  }
  
  render() {
    const container = document.querySelector(this.containerSelector);
    if (!container) {
      console.error(`Navigation container ${this.containerSelector} not found`);
      return;
    }
    
    // Clear existing content but keep the element
    container.innerHTML = this.generateHTML();
    this.attachEventListeners();
    this.highlightActiveLink();
    this.syncThemeIcon();
    
    return container;
  }
  
  generateHTML() {
    const { logo, links, showAuth, showThemeToggle, userAvatar } = this.data;
    
    const logoHTML = `
      <a href="/" class="nav-logo">
        <img src="${logo.iconPath}" alt="${logo.brandName} logo" />
        <div class="logo-brand">
          <span class="brand-top">${logo.brandTop}</span>
          <span class="brand-bottom">${logo.brandBottom}</span>
        </div>
      </a>
    `;
    
    const linksHTML = links.map(link => {
      const activeClass = link.active ? 'active' : '';
      const ctaClass = link.isCta ? 'nav-cta' : '';
      return `<li><a href="${link.href}" class="${activeClass} ${ctaClass}" data-nav-link="${link.name}">${link.name}</a></li>`;
    }).join('');
    
    let themeHTML = '';
    if (showThemeToggle) {
      themeHTML = `
        <button class="theme-toggle" id="themeToggleBtn" aria-label="Toggle theme">
          <svg class="sun-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
          <svg class="moon-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        </button>
      `;
    }
    
    const mobileToggle = `
      <button class="nav-toggle" id="navToggle" aria-label="Toggle menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    `;
    
    // Build full navigation HTML matching your existing structure
    return `
      ${logoHTML}
      <ul class="nav-links" id="navLinks">
        ${linksHTML}
      </ul>
      ${showThemeToggle ? themeHTML : ''}
      ${mobileToggle}
    `;
  }
  
  attachEventListeners() {
    // Mobile menu toggle — using 'open' class to match your CSS
    const toggleBtn = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    
    if (toggleBtn && navLinks) {
      // Remove any existing listeners to avoid duplicates
      const newToggleBtn = toggleBtn.cloneNode(true);
      toggleBtn.parentNode.replaceChild(newToggleBtn, toggleBtn);
      const finalToggleBtn = document.getElementById('navToggle');
      
      finalToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isExpanded = finalToggleBtn.getAttribute('aria-expanded') === 'true';
        finalToggleBtn.setAttribute('aria-expanded', !isExpanded);
        
        // Toggle 'open' class (matches your CSS: .nav-links.open)
        navLinks.classList.toggle('open');
        
        // Toggle class on hamburger button for animation
        finalToggleBtn.classList.toggle('open');
        
        // Prevent body scroll
        document.body.classList.toggle('nav-open');
      });
    }
    
    // Close mobile menu when clicking a link
    const navLinksEl = document.getElementById('navLinks');
    if (navLinksEl) {
      navLinksEl.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          const toggle = document.getElementById('navToggle');
          navLinksEl.classList.remove('open');
          if (toggle) {
            toggle.setAttribute('aria-expanded', 'false');
            toggle.classList.remove('open');
          }
          document.body.classList.remove('nav-open');
        });
      });
    }
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const toggle = document.getElementById('navToggle');
        const navLinksEl = document.getElementById('navLinks');
        if (navLinksEl && navLinksEl.classList.contains('open')) {
          navLinksEl.classList.remove('open');
          if (toggle) {
            toggle.setAttribute('aria-expanded', 'false');
            toggle.classList.remove('open');
          }
          document.body.classList.remove('nav-open');
        }
      }
    });
    
    // Theme toggle
    const themeToggle = document.getElementById('themeToggleBtn');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        this.toggleTheme();
        if (this.onThemeToggle) this.onThemeToggle();
      });
    }
    
    // Auth buttons
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (loginBtn) loginBtn.addEventListener('click', () => this.handleAuth('login'));
    if (signupBtn) signupBtn.addEventListener('click', () => this.handleAuth('signup'));
    if (logoutBtn) logoutBtn.addEventListener('click', () => this.handleAuth('logout'));
    
    // Navigation links
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
    this.syncThemeIcon();
    
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: newTheme } }));
  }
  
  syncThemeIcon() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');
    
    if (!sunIcon || !moonIcon) return;
    
    if (currentTheme === 'dark') {
      sunIcon.style.display = 'none';
      moonIcon.style.display = 'block';
    } else {
      sunIcon.style.display = 'block';
      moonIcon.style.display = 'none';
    }
  }
  
  handleAuth(action) {
    window.dispatchEvent(new CustomEvent('authAction', { detail: { action } }));
    if (this.onAuthAction) this.onAuthAction(action);
  }
  
  setUserAvatar(avatarUrl) {
    this.data.userAvatar = avatarUrl;
    this.render();
  }
  
  setActiveLink(linkName) {
    this.data.links = this.data.links.map(link => ({
      ...link,
      active: link.name === linkName
    }));
    this.render();
  }
}

export function initNav(options = {}) {
  const nav = new NavComponent(options);
  nav.render();
  return nav;
}

export default NavComponent;