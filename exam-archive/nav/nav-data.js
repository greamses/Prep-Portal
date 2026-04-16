// nav-data.js
import { CONFIG } from './path-config.js';

export const navData = {
  logo: {
    iconPath: CONFIG.logoLight || '../../../logo/logo-light.svg',
    brandName: "PrepPortal",
    brandTop: "Prep",
    brandBottom: "Portal"
  },
  
  links: [
    { name: "Dashboard", href: CONFIG.paths?.dashboardIndex || '../../../dashboard/dashboard.html', active: false },
    { name: "National", href: CONFIG.paths?.nationalHtml || '#', active: true },
    { name: "International", href: CONFIG.paths?.internationalHtml || '#', active: false },
    { name: "Competitions", href: CONFIG.paths?.competitionsHtml || '#', active: false },
  ],
  
  showAuth: false,
  showThemeToggle: false,
  userAvatar: null
};