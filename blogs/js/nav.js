import { initNav } from './NavComponent.js';

// Initialize navigation with custom options
const nav = initNav({
  containerId: 'nav-container',
  onNavItemClick: (linkName, href) => {
    console.log(`Navigating to: ${linkName} (${href})`);
    // You can add custom logic here, like analytics
    if (href && href !== '#') {
      window.location.href = href;
    }
  },
  onThemeToggle: () => {
    console.log('Theme toggled');
    // You can update other parts of the page
  }
});

// Example: update user avatar after login
// nav.setUserAvatar('https://example.com/avatar.jpg');