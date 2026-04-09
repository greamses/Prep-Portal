// nav-data.js
import {CONFIG} from './path-config.js';

// nav-data.js
export const navData = {
  logo: {
    iconPath: window.CONFIG?.logoLight || '../../../../../logo/logo-light.svg',
    brandName: "PrepPortal",
    brandTop: "Prep",
    brandBottom: "Portal"
  },
  
  links: [
    { name: "Dashboard", href: window.CONFIG?.paths?.dashboardIndex || '#', active: false },
    { name: "Life and Health", href: window.CONFIG?.paths?.lifeHtml || '#', active: true },
    { name: "Animals", href: window.CONFIG?.paths?.animalsHtml || '#', active: false, isCta: true },
    { name: "Earth Science", href: "#", active: false },
    { name: "Space Science", href: "#", active: false },
  ],
  
  showAuth: true,
  showThemeToggle: true,
  userAvatar: null
};