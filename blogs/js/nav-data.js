// nav-data.js
import CONFIG from '../../../../js/config.js';

export const navData = {
  logo: {
    iconPath: CONFIG.logoLight,
    brandName: "PrepPortal",
    brandTop: "Prep",
    brandBottom: "Portal"
  },
  
  links: [
    { name: "Dashboard", href: CONFIG.getPath('dashboardIndex'), active: false },
    { name: "Life and Health", href: CONFIG.getPath('blogHtml'), active: true },
    { name: "Animals", href: CONFIG.getPath('blogHtml'), active: false, isCta: true },
    { name: "Earth Science", href: "#", active: false },
    { name: "Space Science", href: "#", active: false },
  ],
  
  showAuth: true,
  showThemeToggle: true,
  userAvatar: null
};