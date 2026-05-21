// ============================================
// AUTH MODAL INJECTABLE COMPONENT
// auth-modal.js
// ============================================

import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";

import { auth, googleProvider } from "../../firebase-init.js";

// ============================================
// INJECT AUTH MODAL
// ============================================

export function injectAuthModal() {
  const mountPoint = document.querySelector(".log-in");

  if (!mountPoint) {
    console.warn('No ".log-in" container found for auth modal injection.');
    return;
  }

  mountPoint.innerHTML = `

  <div class="auth-overlay"></div>

  <div class="auth-modal">

    <button class="auth-close" id="auth-close-btn" aria-label="Close">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8"
        stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 6L6 18"/><path d="M6 6L18 18"/>
      </svg>
    </button>

    <div class="auth-brand">
      <div class="auth-badge">
        <img src="/logo/logo-light.svg" alt="Prep Portal Logo" />
      </div>
      <div class="auth-title">
      <span class="brand-top">Prep</span><span class="brand-bottom">portal</span>
      </div>
    </div>

    <div class="auth-tabs">
      <button class="auth-tab active" data-auth-tab="login">Login</button>
      <button class="auth-tab" data-auth-tab="signup">Sign Up</button>
    </div>

    <!-- LOGIN -->
    <form class="auth-form active" id="login-form">

      <div class="auth-heading">
        <h3>Welcome back.</h3>
        <p>Continue your learning journey.</p>
      </div>

      <div class="auth-sep"></div>

      <div class="auth-field">
        <label>Email Address</label>
        <input type="email" placeholder="student@email.com" required />
      </div>

      <div class="auth-field">
        <label>Password</label>
        <input type="password" placeholder="••••••••" required />
      </div>

      <div class="auth-options">
        <label class="remember-box">
          <input type="checkbox" />
          <span>Remember me</span>
        </label>
        <a href="#">Forgot password?</a>
      </div>

      <button type="submit" class="auth-submit">
        <span>Login to Dashboard</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8"
          stroke-linecap="round" stroke-linejoin="round">
          <path d="M5 12H19"/><path d="M12 5L19 12L12 19"/>
        </svg>
      </button>

      <div class="auth-or"><span>or</span></div>

      <button type="button" class="google-btn" id="google-login">
        <svg viewBox="0 0 48 48">
          <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z"/>
          <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
          <path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.3C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.2-8l-6.5 5C9.7 39.6 16.3 44 24 44z"/>
          <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.1-3.3 5.5-6 7l6.3 5.3C39.3 36.8 44 31 44 24c0-1.3-.1-2.3-.4-3.5z"/>
        </svg>
        <span>Continue with Google</span>
      </button>

    </form>

    <!-- SIGNUP -->
    <form class="auth-form" id="signup-form">

      <div class="auth-heading">
        <h3>Create account.</h3>
        <p>Start preparing smarter today.</p>
      </div>

      <div class="auth-sep"></div>

      <div class="auth-field">
        <label>Full Name</label>
        <input type="text" placeholder="Emmanuel Daniel" required />
      </div>

      <div class="auth-field">
        <label>Email Address</label>
        <input type="email" placeholder="student@email.com" required />
      </div>

      <div class="auth-field">
        <label>Password</label>
        <input type="password" placeholder="Create a strong password" required />
      </div>

      <button type="submit" class="auth-submit">
        <span>Create Account</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8"
          stroke-linecap="round" stroke-linejoin="round">
          <path d="M5 12H19"/><path d="M12 5L19 12L12 19"/>
        </svg>
      </button>

      <div class="auth-or"><span>or</span></div>

      <button type="button" class="google-btn" id="google-signup">
        <svg viewBox="0 0 48 48">
          <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z"/>
          <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
          <path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.3C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.2-8l-6.5 5C9.7 39.6 16.3 44 24 44z"/>
          <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.1-3.3 5.5-6 7l6.3 5.3C39.3 36.8 44 31 44 24c0-1.3-.1-2.3-.4-3.5z"/>
        </svg>
        <span>Sign up with Google</span>
      </button>

    </form>

  </div>

  `;

  initializeAuthModal(mountPoint);
}

// ============================================
// INITIALIZE
// ============================================

function initializeAuthModal(authContainer) {
  const closeBtn = document.getElementById("auth-close-btn");
  const overlay = authContainer.querySelector(".auth-overlay");
  const tabs = authContainer.querySelectorAll(".auth-tab");
  const forms = authContainer.querySelectorAll(".auth-form");

  // ============================================
  // OPEN MODAL
  // ============================================

  window.openAuthModal = (mode = "login") => {
    authContainer.classList.add("active");
    switchTab(mode);
    document.body.style.overflow = "hidden";
  };

  // ============================================
  // CLOSE MODAL
  // ============================================

  function closeModal() {
    authContainer.classList.remove("active");
    document.body.style.overflow = "";
  }

  // ============================================
  // SWITCH TAB
  // ============================================

  function switchTab(mode) {
    tabs.forEach((tab) => {
      tab.classList.toggle("active", tab.dataset.authTab === mode);
    });
    forms.forEach((form) => {
      form.classList.toggle("active", form.id === `${mode}-form`);
    });
  }

  // ============================================
  // TAB EVENTS
  // ============================================

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => switchTab(tab.dataset.authTab));
  });

  // ============================================
  // CLOSE EVENTS
  // ============================================

  closeBtn.addEventListener("click", closeModal);
  overlay.addEventListener("click", closeModal);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  // ============================================
  // OPEN TRIGGERS
  // ============================================

  document.addEventListener("click", (e) => {
    const trigger = e.target.closest("[data-auth-open]");
    if (!trigger) return;
    e.preventDefault();
    window.openAuthModal(trigger.dataset.authOpen || "login");
  });

  // ============================================
  // GOOGLE LOGIN
  // ============================================

  document
    .getElementById("google-login")
    .addEventListener("click", async () => {
      try {
        await signInWithPopup(auth, googleProvider);
        closeModal();
      } catch (err) {
        console.error(err);
        alert(err.message);
      }
    });

  // ============================================
  // GOOGLE SIGNUP
  // ============================================

  document
    .getElementById("google-signup")
    .addEventListener("click", async () => {
      try {
        await signInWithPopup(auth, googleProvider);
        closeModal();
      } catch (err) {
        console.error(err);
        alert(err.message);
      }
    });

  // ============================================
  // EMAIL LOGIN
  // ============================================

  document
    .getElementById("login-form")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = e.target.querySelector('input[type="email"]').value;
      const password = e.target.querySelector('input[type="password"]').value;
      try {
        await signInWithEmailAndPassword(auth, email, password);
        closeModal();
      } catch (err) {
        console.error(err);
        alert(err.message);
      }
    });

  // ============================================
  // EMAIL SIGNUP
  // ============================================

  document
    .getElementById("signup-form")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = e.target.querySelector('input[type="text"]').value;
      const email = e.target.querySelector('input[type="email"]').value;
      const password = e.target.querySelector('input[type="password"]').value;
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
        );
        await updateProfile(userCredential.user, { displayName: name });
        closeModal();
      } catch (err) {
        console.error(err);
        alert(err.message);
      }
    });
}

// ============================================
// AUTO INIT
// ============================================

document.addEventListener("DOMContentLoaded", injectAuthModal);
