// nav.js — Entry point for navigation
import { initNav } from './nav-component.js';
import { navData } from './nav-data.js';

// Initialize navigation when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initNav({
      containerSelector: '.site-nav',
      data: navData
    });
  });
} else {
  initNav({
    containerSelector: '.site-nav',
    data: navData
  });
}

// Export for use in other modules
export { initNav, navData };