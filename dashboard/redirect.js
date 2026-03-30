// redirect.js
// Imports auth from the central firebase-init.js — no duplicate initializeApp call.
import { auth } from "./firebase-init.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";

// ── AUTH CHECK ──
// If the user is already logged in, swap "Sign In" button to "Dashboard"
onAuthStateChanged(auth, (user) => {
  const btn = document.getElementById('auth-status-btn');
  if (!btn) return;
  if (user) {
    btn.textContent = "Dashboard";
    btn.href = "./dashboard/dashboard.html";
  }
});

// ── RENDER UI FROM DATA.JS ──
document.addEventListener('DOMContentLoaded', () => {
  // Render Ticker
  const track = document.getElementById('ticker-track');
  if (track && typeof siteData !== 'undefined') {
    const items = [...siteData.tickerItems, ...siteData.tickerItems];
    track.innerHTML = items.map(item =>
      `<span class="ticker-item">${item}<span class="ticker-dot">◆</span></span>`
    ).join('');
  }

  // Render Stats
  const statsContainer = document.getElementById('hero-stats');
  if (statsContainer && typeof siteData !== 'undefined') {
    statsContainer.innerHTML = siteData.hero.stats.map(s => `
      <div class="stat">
        <strong>${s.value}</strong>
        <span>${s.label}</span>
      </div>
    `).join('');
  }
});
