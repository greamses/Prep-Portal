// nav-data.js
import { CONFIG } from './path-config.js';

export const navData = {
  logo: {
    iconPath: CONFIG.logoLight || '../../logo/logo-light.svg',
    brandName: "PrepPortal",
    brandTop: "Prep",
    brandBottom: "Portal"
  },
  
  links: [
    { name: "Dashboard", href: CONFIG.paths?.dashboardIndex || '../../dashboard/dashboard.html', active: false },
    { name: "Algebra", href: CONFIG.paths?.algebraHtml || '../drag/index.html', active: true },
    { name: "Graph", href: CONFIG.paths?.graphHtml || '../graphing/index.html', active: true },
    { name: "Fractions", href: CONFIG.paths?.fractionsHtml || '../activity/index.html', active: true },
  ],
  
  showAuth: false,
  showThemeToggle: false,
  userAvatar: null
};