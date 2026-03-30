// index.js
import { auth } from './firebase-init.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";

// ─────────────────────────────────────────────
// NOTE: data.js and loader.js are plain <script>
// tags, NOT ES modules — do NOT import them here.
// Access their globals directly (siteData, etc.)
// ─────────────────────────────────────────────

// ── DOM REFS ──
const authStatusBtn    = document.getElementById('auth-status-btn');
const typewriterEl     = document.getElementById('typewriter');
const tickerTrack      = document.getElementById('ticker-track');
const heroStatsEl      = document.getElementById('hero-stats');

// ── AUTH → SWAP NAV BUTTON ──
onAuthStateChanged(auth, (user) => {
  if (!authStatusBtn) return;
  if (user) {
    authStatusBtn.textContent = 'Dashboard';
    authStatusBtn.href = './dashboard/dashboard.html';
  } else {
    authStatusBtn.textContent = 'Sign In';
    authStatusBtn.href = './dashboard/login.html';
  }
});

// ── TYPEWRITER ──
const typewriterWords = ['Exams', 'Skills', 'Future'];
let wordIndex    = 0;
let charIndex    = 0;
let isDeleting   = false;

function typeWriter() {
  if (!typewriterEl) return;

  const currentWord = typewriterWords[wordIndex];

  if (isDeleting) {
    typewriterEl.textContent = currentWord.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typewriterEl.textContent = currentWord.substring(0, charIndex + 1);
    charIndex++;
  }

  let delay = isDeleting ? 75 : 150;

  if (!isDeleting && charIndex === currentWord.length) {
    delay = 1500;           // pause at end of word
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    wordIndex = (wordIndex + 1) % typewriterWords.length;
    delay = 300;            // brief pause before next word
  }

  setTimeout(typeWriter, delay);
}

// ── TICKER ──
// Uses siteData from data.js (global), falls back to inline array
function initTicker() {
  if (!tickerTrack) return;

  const items = (typeof siteData !== 'undefined' && siteData.tickerItems)
    ? [...siteData.tickerItems, ...siteData.tickerItems]
    : [
        'WAEC 2024 Past Questions Now Available ◆',
        'JAMB CBT Practice Exams Updated for 2025 ◆',
        'New IGCSE Math Videos Added ◆',
        'Common Entrance 2026 Prep Kits Released ◆',
        'A-Level Physics Notes with Worked Examples ◆',
      ].flatMap(item => [item, item]); // duplicate for seamless loop

  tickerTrack.innerHTML = items
    .map(item => `<span class="ticker-item">${item}<span class="ticker-dot">◆</span></span>`)
    .join('');
}

// ── HERO STATS ──
// Uses siteData from data.js (global), falls back to inline array
function renderHeroStats() {
  if (!heroStatsEl) return;

  const stats = (typeof siteData !== 'undefined' && siteData.hero?.stats)
    ? siteData.hero.stats
    : [
        { value: '500+',  label: 'Past Papers'    },
        { value: '10K+',  label: 'Questions'       },
        { value: '95%',   label: 'Success Rate'    },
      ];

  heroStatsEl.innerHTML = stats
    .map(s => `<div class="stat"><strong>${s.value}</strong><span>${s.label}</span></div>`)
    .join('');
}

// ── INIT ──
// Modules are deferred by default, so the DOM is ready when this runs.
typeWriter();
initTicker();
renderHeroStats();
