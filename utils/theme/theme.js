// Theme Toggle System
(function() {
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
    // Find or create nav container for theme toggle
    const nav = document.querySelector('.site-nav');
    const navLinks = document.querySelector('.nav-links');
    
    if (nav && navLinks && !document.querySelector('.theme-toggle')) {
      const toggle = createThemeToggle();
      toggle.addEventListener('click', toggleTheme);
      // Insert before the last item or at the end of nav-links
      navLinks.appendChild(toggle);
    }
    
    // Apply saved theme
    const theme = getTheme();
    setTheme(theme);
  };
  
  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTheme);
  } else {
    initTheme();
  }
})();

// Dynamic Typing Effect for Hero Title
(function() {
  const words = ['Design', 'Code', 'Create', 'Innovate', 'Build'];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingDelay = 100;
  let deletingDelay = 50;
  let pauseDelay = 1500;
  
  const highlightElement = document.querySelector('.highlight');
  const cursorElement = document.querySelector('.cursor');
  
  if (!highlightElement || !cursorElement) return;
  
  function typeEffect() {
    const currentWord = words[wordIndex];
    
    if (isDeleting) {
      highlightElement.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typingDelay = deletingDelay;
    } else {
      highlightElement.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typingDelay = 100;
    }
    
    // If word is complete
    if (!isDeleting && charIndex === currentWord.length) {
      isDeleting = true;
      typingDelay = pauseDelay;
    }
    
    // If deletion is complete
    if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typingDelay = 100;
    }
    
    setTimeout(typeEffect, typingDelay);
  }
  
  // Start typing effect after a short delay
  setTimeout(typeEffect, 500);
})();

// Character Reveal Animation for Hero Title
(function() {
  const heroTitle = document.querySelector('.hero-title');
  if (!heroTitle) return;
  
  // Get the text content and wrap each character
  const text = heroTitle.innerText;
  const words_array = text.split(' ');
  
  let wrappedHtml = '';
  for (let i = 0; i < words_array.length; i++) {
    const word = words_array[i];
    const wordChars = word.split('');
    for (let j = 0; j < wordChars.length; j++) {
      if (wordChars[j].match(/[a-zA-Z0-9]/)) {
        wrappedHtml += `<span class="char-wrapper"><span class="char">${wordChars[j]}</span></span>`;
      } else {
        wrappedHtml += wordChars[j];
      }
    }
    if (i < words_array.length - 1) wrappedHtml += ' ';
  }
  
  heroTitle.innerHTML = wrappedHtml;
  
  // Trigger animation after page load
  setTimeout(() => {
    document.body.classList.add('active');
  }, 100);
})();

// Scroll Reveal Animation
(function() {
  const revealElements = document.querySelectorAll('.reveal');
  
  const revealOnScroll = () => {
    const windowHeight = window.innerHeight;
    const revealPoint = 150;
    
    revealElements.forEach(element => {
      const revealTop = element.getBoundingClientRect().top;
      if (revealTop < windowHeight - revealPoint) {
        element.classList.add('visible');
      }
    });
  };
  
  window.addEventListener('scroll', revealOnScroll);
  revealOnScroll(); // Initial check
})();

// Mobile Navigation Toggle
(function() {
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('open');
      navLinks.classList.toggle('open');
    });
    
    // Close mobile menu when clicking a link
    const links = navLinks.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }
})();

// Card hover effect enhancement
(function() {
  const cards = document.querySelectorAll('.card, .subject-card');
  
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      // Add a small delay for smoother transition
      card.style.transition = 'transform 0.12s ease, box-shadow 0.12s ease';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transition = '';
    });
  });
})();

// Dynamic year in footer
(function() {
  const footerYear = document.querySelector('.footer-bottom p');
  if (footerYear) {
    const year = new Date().getFullYear();
    footerYear.innerHTML = footerYear.innerHTML.replace('2026', year);
  }
})();

// Prevent FOUC (Flash of Unstyled Content)
(function() {
  // Ensure theme is applied before page becomes visible
  const theme = localStorage.getItem('theme');
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else if (theme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();

// Smooth scroll for anchor links
(function() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#' || href === '') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
})();

// Add loading class to body for transition effects
window.addEventListener('load', () => {
  document.body.classList.add('loaded');
});

// Ticker animation pause on hover
(function() {
  const ticker = document.querySelector('.ticker');
  const tickerTrack = document.querySelector('.ticker-track');
  
  if (ticker && tickerTrack) {
    ticker.addEventListener('mouseenter', () => {
      tickerTrack.style.animationPlayState = 'paused';
    });
    
    ticker.addEventListener('mouseleave', () => {
      tickerTrack.style.animationPlayState = 'running';
    });
  }
})();