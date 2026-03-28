import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";

// ── FIREBASE CONFIG ──
const firebaseConfig = {
  apiKey: "AIzaSyA2N3uI_XfSIVsto2Ku1g_qSezmD3qFmbk",
  authDomain: "prep-portal-2026.firebaseapp.com",
  projectId: "prep-portal-2026",
  storageBucket: "prep-portal-2026.firebasestorage.app",
  messagingSenderId: "837672918701",
  appId: "1:837672918701:web:e64c0c25dc01b542e23024"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ── AUTH CHECK ──
// If the user is already logged in, change "Sign In" to "Dashboard"
onAuthStateChanged(auth, (user) => {
  const btn = document.getElementById('auth-status-btn');
  if (user) {
    btn.textContent = "Dashboard";
    btn.href = "dashboard.html";
  }
});

// ── RENDER UI FROM DATA.JS ──
document.addEventListener('DOMContentLoaded', () => {
  // Render Ticker
  const track = document.getElementById('ticker-track');
  const items = [...siteData.tickerItems, ...siteData.tickerItems];
  track.innerHTML = items.map(item => `<span class="ticker-item">${item}<span class="ticker-dot">◆</span></span>`).join('');
  
  // Render Stats
  const statsContainer = document.getElementById('hero-stats');
  statsContainer.innerHTML = siteData.hero.stats.map(s => `
            <div class="stat">
                <strong>${s.value}</strong>
                <span>${s.label}</span>
            </div>
        `).join('');
});