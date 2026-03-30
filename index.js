// index.js
import { auth } from './firebase-init.js'; // Import the initialized auth object
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";

// --- Imports for other features (assuming these files export functions) ---
import { initLoader } from './utils/loader/loader.js'; // Assuming this module exports initLoader
import { loadData } from './data.js'; // Assuming this module exports loadData, possibly for ticker/stats

// --- DOM Elements ---
const authStatusBtn = document.getElementById('auth-status-btn');
const typewriterElement = document.getElementById('typewriter');
const tickerTrack = document.getElementById('ticker-track');
const heroStatsElement = document.getElementById('hero-stats');

// --- Feature Data (from data.js or defined here) ---
const typewriterWords = ["Exams", "Skills", "Future"]; // Example words
const tickerItems = [ // Example ticker items
  "WAEC 2024 Past Questions Now Available",
  "JAMB CBT Practice Exams Updated for 2025",
  "New IGCSE Math Videos Added",
  "Common Entrance 2026 Prep Kits Released",
  "A-Level Physics Notes with Worked Examples"
];
const heroStats = [ // Example hero stats
  { count: "500+", label: "Past Papers" },
  { count: "10K+", label: "Questions Solved" },
  { count: "95%", label: "Success Rate" }
];


// --- AUTH STATUS HANDLER (for nav button) ---
onAuthStateChanged(auth, (user) => {
  if (authStatusBtn) { // Ensure the button exists before trying to modify it
    if (user) {
      // User is signed in
      authStatusBtn.textContent = 'Dashboard';
      authStatusBtn.href = './dashboard/index.html';
    } else {
      // User is signed out
      authStatusBtn.textContent = 'Sign In';
      authStatusBtn.href = './dashboard/login.html';
    }
  }
});


// --- TYPEWRITER EFFECT ---
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 150;
let deletingSpeed = 75;
let delayBetweenWords = 1500;

function typeWriter() {
  const currentWord = typewriterWords[wordIndex];
  if (isDeleting) {
    typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
    charIndex++;
  }
  
  let speed = isDeleting ? deletingSpeed : typingSpeed;
  
  if (!isDeleting && charIndex === currentWord.length) {
    speed = delayBetweenWords;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    wordIndex = (wordIndex + 1) % typewriterWords.length;
    speed = typingSpeed;
  }
  
  setTimeout(typeWriter, speed);
}


// --- TICKER EFFECT ---
function initTicker() {
  if (!tickerTrack) return;
  
  tickerItems.forEach(item => {
    const span = document.createElement('span');
    span.textContent = item;
    tickerTrack.appendChild(span);
    tickerTrack.appendChild(document.createTextNode(' \u2022 ')); // Add a dot separator
  });
  
  // Duplicate content for seamless looping
  tickerItems.forEach(item => {
    const span = document.createElement('span');
    span.textContent = item;
    tickerTrack.appendChild(span);
    tickerTrack.appendChild(document.createTextNode(' \u2022 '));
  });
  
  // A small hack to restart animation if needed due to content change
  tickerTrack.innerHTML += tickerTrack.innerHTML;
}


// --- HERO STATS RENDERING ---
function renderHeroStats() {
  if (!heroStatsElement) return;
  
  heroStats.forEach(stat => {
    const div = document.createElement('div');
    div.className = 'stat-item';
    div.innerHTML = `<span class="stat-count">${stat.count}</span><span class="stat-label">${stat.label}</span>`;
    heroStatsElement.appendChild(div);
  });
}


// --- INITIALIZATION ON DOM CONTENT LOADED ---
document.addEventListener('DOMContentLoaded', () => {
  // Initialize the loader
  // Assuming initLoader is exported from utils/loader/loader.js and handles the display logic
  if (typeof initLoader === 'function') {
    initLoader();
  } else {
    console.warn('initLoader function not found. Ensure utils/loader/loader.js is loaded and exports initLoader.');
    // Fallback: hide loader if script isn't found/working
    document.getElementById('loader')?.remove();
  }
  
  // Start the typewriter effect
  if (typewriterElement) {
    typeWriter();
  }
  
  // Initialize the ticker
  initTicker();
  
  // Render hero statistics
  renderHeroStats();
  
  // The 'redirect.js' script is imported in HTML, assuming it handles its own logic.
});