import { initNav } from './nav-component.js';
import { navData } from './nav-data.js';

initNav({
  containerId: 'nav-container',
  data: navData,
  onThemeToggle: () => {
    console.log('Theme toggled');
  },
  onAuthAction: (action) => {
    console.log('Auth action:', action);
  }
});