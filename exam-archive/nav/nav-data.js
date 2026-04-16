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
    { name: "Home", href: CONFIG.paths?.homeIndex || '../../index.html', active: true },
    { name: "Algebra", href: CONFIG.paths?.algebraHtml || '../drag/index.html', active: true },
    { name: "Graph", href: CONFIG.paths?.graphHtml || '../graphing/index.html', active: true },
    { name: "Fractions", href: CONFIG.paths?.fractionsHtml || '../activity/index.html', active: true },
  ],
  
  showAuth: false,
  showThemeToggle: false,
  userAvatar: null
};