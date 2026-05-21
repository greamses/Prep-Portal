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
    
    return container;
  }
  
  generateHTML() {
    const { logo, links, showAuth, showThemeToggle, userAvatar } = this.data;
    
    const logoHTML = `
      <a href="${links[0]?.href || '/'}" class="nav-logo">
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
    
    const mobileToggle = `
      <button class="nav-toggle" id="nav-toggle" aria-label="Toggle menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    `;
    
    // Build full navigation HTML matching existing structure
    return `
      ${logoHTML}
      <ul class="nav-links" id="nav-links">
        ${linksHTML}
      </ul>
      ${mobileToggle}
    `;
  }
  
  attachEventListeners() {
    // Mobile menu toggle
    const toggleBtn = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');
    
    if (toggleBtn && navLinks) {
      toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
        toggleBtn.setAttribute('aria-expanded', !isExpanded);
        navLinks.classList.toggle('open');
        toggleBtn.classList.toggle('open');
        document.body.classList.toggle('nav-open');
      });
    }
    
    // Close mobile menu when clicking a link
    if (navLinks) {
      navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          const toggle = document.getElementById('nav-toggle');
          navLinks.classList.remove('open');
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
        const toggle = document.getElementById('nav-toggle');
        const navLinksEl = document.getElementById('nav-links');
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
    
    // Navigation links custom handler
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
      
      // Check if current path matches the link
      if (href && href !== '#') {
        const linkPath = href.replace(/\.\.\//g, '');
        if (currentPath.includes('fraction-explorer') && href.includes('algebra-practice')) {
          link.classList.add('active');
        } else if (currentPath.includes(linkPath.replace(/^\.\.\/|\.\//g, ''))) {
          link.classList.add('active');
        }
      }
    });
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