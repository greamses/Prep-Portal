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

// ── HANDLE REDIRECT RESULT (FOR GOOGLE MOBILE) ──
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
    cardTitle.textContent = "Access  Account";
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

document.querySelectorAll('.pw-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const input = document.getElementById(btn.dataset.target);
    input.type = input.type === 'password' ? 'text' : 'password';
    btn.textContent = input.type === 'password' ? '👁' : '✕';
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