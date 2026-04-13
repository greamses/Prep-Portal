import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";

// ── SVG ICONS ──
const ICON_EYE_OPEN = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="animation: eyeIn 0.3s ease-out"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;

const ICON_EYE_CLOSED = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="animation: eyeIn 0.3s ease-out"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`;

// Add internal animation style for the icons
const style = document.createElement('style');
style.textContent = `@keyframes eyeIn { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }`;
document.head.appendChild(style);

const firebaseConfig = {
  apiKey: "AIzaSyA2N3uI_XfSIVsto2Ku1g_qSezmD3qFmbk",
  authDomain: "prep-portal-2026.web.app",
  projectId: "prep-portal-2026",
  storageBucket: "prep-portal-2026.firebasestorage.app",
  messagingSenderId: "837672918701",
  appId: "1:837672918701:web:e64c0c25dc01b542e23024",
  measurementId: "G-2PDS7LL77R"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const msgBox = document.getElementById('msg');
const loginPanel = document.getElementById('panel-login');
const registerPanel = document.getElementById('panel-register');
const cardTitle = document.getElementById('card-title');
const tabLogin = document.getElementById('tab-login');
const tabRegister = document.getElementById('tab-register');
const footText = document.getElementById('foot-text');
const footLink = document.getElementById('foot-link');

function showMsg(text, type = 'error') {
  msgBox.textContent = text;
  msgBox.className = `msg show ${type}`;
}

function setLoading(btn, isLoading) {
  if (isLoading) {
    btn.disabled = true;
    btn.dataset.originalText = btn.innerHTML;
    btn.innerHTML = `<span class="spinner"></span> Processing...`;
  } else {
    btn.disabled = false;
    btn.innerHTML = btn.dataset.originalText;
  }
}

// ── CHECK IF ALREADY LOGGED IN ──
onAuthStateChanged(auth, (user) => {
  if (user) {
    window.location.href = "dashboard.html";
  }
});

// ── HANDLE REDIRECT RESULT ──
getRedirectResult(auth)
  .then((result) => {
    if (result) {
      window.location.href = "dashboard.html";
    }
  }).catch((error) => {
    if (error.code !== 'auth/redirect-cancelled-by-user') {
      showMsg("Google Login Error: " + error.message);
    }
  });

function switchTab(mode) {
  msgBox.className = 'msg';
  if (mode === 'register') {
    loginPanel.classList.remove('active');
    registerPanel.classList.add('active');
    tabLogin.classList.remove('active');
    tabRegister.classList.add('active');
    cardTitle.textContent = "Create Account";
    footText.textContent = "Already have an account?";
    footLink.textContent = "Sign In";
  } else {
    registerPanel.classList.remove('active');
    loginPanel.classList.add('active');
    tabRegister.classList.remove('active');
    tabLogin.classList.add('active');
    cardTitle.textContent = "Access Account";
    footText.textContent = "Don't have an account?";
    footLink.textContent = "Register free";
  }
}

tabLogin.addEventListener('click', () => switchTab('login'));
tabRegister.addEventListener('click', () => switchTab('register'));
footLink.addEventListener('click', () => {
  const isLogin = loginPanel.classList.contains('active');
  switchTab(isLogin ? 'register' : 'login');
});

// ── UPDATED PASSWORD TOGGLE WITH SVG ──
document.querySelectorAll('.pw-toggle').forEach(btn => {
  // Set initial state
  btn.innerHTML = ICON_EYE_CLOSED;
  
  btn.addEventListener('click', () => {
    const input = document.getElementById(btn.dataset.target);
    const isVisible = input.type === 'text';
    
    // Toggle type
    input.type = isVisible ? 'password' : 'text';
    
    // Toggle SVG with small animation
    btn.innerHTML = isVisible ? ICON_EYE_CLOSED : ICON_EYE_OPEN;
  });
});

document.getElementById('btn-register').addEventListener('click', async (e) => {
  const name = document.getElementById('reg-name').value;
  const email = document.getElementById('reg-email').value;
  const pass = document.getElementById('reg-pw').value;
  if (!name || !email || pass.length < 6) {
    showMsg("Fill all fields. Password must be 6+ characters.");
    return;
  }
  setLoading(e.target, true);
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    await updateProfile(userCredential.user, { displayName: name });
    window.location.href = "dashboard.html";
  } catch (error) {
    showMsg(error.message);
    setLoading(e.target, false);
  }
});

document.getElementById('btn-login').addEventListener('click', async (e) => {
  const email = document.getElementById('login-email').value;
  const pass = document.getElementById('login-pw').value;
  if (!email || !pass) { showMsg("Enter email and password."); return; }
  setLoading(e.target, true);
  try {
    await signInWithEmailAndPassword(auth, email, pass);
    window.location.href = "dashboard.html";
  } catch (error) {
    showMsg("Invalid login credentials.");
    setLoading(e.target, false);
  }
});

document.querySelectorAll('.btn-google').forEach(btn => {
  btn.addEventListener('click', async () => {
    try {
      await signInWithRedirect(auth, googleProvider);
    } catch (error) {
      showMsg("Google failed: " + error.message);
    }
  });
});

document.getElementById('forgot-link').addEventListener('click', async (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  if (!email) { showMsg("Enter your email first."); return; }
  try {
    await sendPasswordResetEmail(auth, email);
    showMsg("Reset link sent!", "success");
  } catch (error) { showMsg(error.message); }
});