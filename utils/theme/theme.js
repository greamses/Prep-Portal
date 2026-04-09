// Theme Toggle System
(function() {
  // Prevent transitions on page load
  document.documentElement.classList.add('no-transitions');
  
  // Remove no-transitions class after page loads
  window.addEventListener('load', () => {
    setTimeout(() => {
      document.documentElement.classList.remove('no-transitions');
    }, 100);
  });
  
  // Create theme toggle button
  const createThemeToggle = () => {
    const toggle = document.createElement('button');
    toggle.className = 'theme-toggle';
    toggle.setAttribute('aria-label', 'Toggle theme');
    toggle.innerHTML = `
            <svg class="light-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
            <svg class="dark-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display: none;">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
        `;
    return toggle;
  };
  
  // Get theme from localStorage or system preference
  const getTheme = () => {
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };
  
  // Apply theme to document
  const setTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Update toggle button icons
    const toggle = document.querySelector('.theme-toggle');
    if (toggle) {
      const lightIcon = toggle.querySelector('.light-icon');
      const darkIcon = toggle.querySelector('.dark-icon');
      if (theme === 'dark') {
        lightIcon.style.display = 'none';
        darkIcon.style.display = 'block';
      } else {
        lightIcon.style.display = 'block';
        darkIcon.style.display = 'none';
      }
    }
  };
  
  // Toggle theme
  const toggleTheme = () => {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    setTheme(current === 'light' ? 'dark' : 'light');
  };
  
  // Initialize theme system
  const initTheme = () => {
    // Find the site-nav and nav-links elements
    const siteNav = document.querySelector('.site-nav');
    const navLinks = document.querySelector('.nav-links');
    
    if (siteNav && navLinks && !document.querySelector('.theme-toggle')) {
      const toggle = createThemeToggle();
      toggle.addEventListener('click', toggleTheme);
      // Insert toggle before .nav-links inside .site-nav
      siteNav.insertBefore(toggle, navLinks);
    }
    
    // Apply saved theme
    const theme = getTheme();
    setTheme(theme);
  };
  
  // Prevent FOUC (Flash of Unstyled Content)
  const theme = localStorage.getItem('theme');
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else if (theme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
  
  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTheme);
  } else {
    initTheme();
  }
})();