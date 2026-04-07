// nav-data.js
// Central navigation data — edit here to update all pages

export const navData = {
  // Logo configuration
  logo: {
    iconPath: "../logo/logo-icon.svg",
    lightIconPath: "../../../logo/logo-light.svg", // fallback for other pages
    brandName: "PrepPortal",
    brandTop: "Prep",
    brandBottom: "Portal"
  },
  
  // Navigation links
  links: [
    { name: "Dashboard", href: "/", active: false },
    { name: "Science", href: "#", active: true },
    { name: "Publisher", href: "auto-science.html", active: false, isCta: true }
  ],
  
  // Optional: show user avatar / auth status
  showAuth: true,
  userAvatar: null, // set to URL if logged in
  
  // Theme toggle
  showThemeToggle: true
};

// Alternative config for different pages
export const altNavData = {
  logo: {
    iconPath: "../../logo/logo-icon.svg",
    brandName: "PrepPortal"
  },
  links: [
    { name: "Home", href: "/", active: false },
    { name: "Math", href: "../math/", active: true },
    { name: "Science", href: "../science/", active: false }
  ],
  showAuth: false,
  showThemeToggle: true
};