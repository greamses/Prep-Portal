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
    { name: "Authentication", href: CONFIG.paths?.authHtml || '../utils/auth/auth.html', active: true },
    { name: "Read", href: CONFIG.paths?.readHtml || '../blogs/science/biology/life/blog/blog.html', active: true },
  ],
  
  showAuth: false,
  showThemeToggle: false,
  userAvatar: null
};