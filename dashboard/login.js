import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  setPersistence,
  browserLocalPersistence
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

setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log('Auth persistence set to LOCAL (survives refreshes)');
  })
  .catch((error) => {
    console.error(' Failed to set persistence:', error);
  });

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
    console.log('User already logged in, redirecting to dashboard');
    window.location.href = "dashboard.html";
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

// ── REGISTER WITH EMAIL/PASSWORD ──
document.getElementById('btn-register').addEventListener('click', async (e) => {
  const name = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const pass = document.getElementById('reg-pw').value;
  
  if (!name || !email || pass.length < 6) {
    showMsg("Fill all fields. Password must be 6+ characters.");
    return;
  }
  
  setLoading(e.target, true);
  try {
    // Ensure persistence is set before creating user
    await setPersistence(auth, browserLocalPersistence);
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    await updateProfile(userCredential.user, { displayName: name });
    console.log('✅ User registered:', userCredential.user.email);
    window.location.href = "dashboard.html";
  } catch (error) {
    console.error('Registration error:', error);
    showMsg(getReadableErrorMessage(error.code));
    setLoading(e.target, false);
  }
});

// ── LOGIN WITH EMAIL/PASSWORD ──
document.getElementById('btn-login').addEventListener('click', async (e) => {
  const email = document.getElementById('login-email').value.trim();
  const pass = document.getElementById('login-pw').value;
  
  if (!email || !pass) {
    showMsg("Enter email and password.");
    return;
  }
  
  setLoading(e.target, true);
  try {
    // Ensure persistence is set before signing in
    await setPersistence(auth, browserLocalPersistence);
    await signInWithEmailAndPassword(auth, email, pass);
    console.log('User logged in:', email);
    window.location.href = "dashboard.html";
  } catch (error) {
    console.error('Login error:', error);
    showMsg(getReadableErrorMessage(error.code));
    setLoading(e.target, false);
  }
});

// ── GOOGLE SIGN-IN WITH POPUP (Better persistence) ──
document.querySelectorAll('.btn-google').forEach(btn => {
  btn.addEventListener('click', async () => {
    try {
      // Ensure persistence is set
      await setPersistence(auth, browserLocalPersistence);
      
      // Use popup instead of redirect for better state persistence
      const result = await signInWithPopup(auth, googleProvider);
      
      console.log('✅ Google sign-in successful:', result.user.displayName);
      showMsg("Login successful! Redirecting...", "success");
      
      // Redirect to dashboard
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 500);
      
    } catch (error) {
      console.error('Google sign-in error:', error);
      
      if (error.code === 'auth/popup-blocked') {
        showMsg("Popup was blocked. Please allow popups for this site.");
      } else if (error.code === 'auth/popup-closed-by-user') {
        showMsg("Sign-in cancelled. Please try again.");
      } else if (error.code === 'auth/account-exists-with-different-credential') {
        showMsg("An account already exists with the same email address but different sign-in credentials.");
      } else {
        showMsg(getReadableErrorMessage(error.code));
      }
    }
  });
});

// ── PASSWORD RESET ──
document.getElementById('forgot-link').addEventListener('click', async (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value.trim();
  
  if (!email) {
    showMsg("Enter your email first.");
    return;
  }
  
  try {
    await sendPasswordResetEmail(auth, email);
    showMsg("Password reset link sent to your email!", "success");
  } catch (error) {
    console.error('Password reset error:', error);
    showMsg(getReadableErrorMessage(error.code));
  }
});

// ── HELPER: Readable error messages ──
function getReadableErrorMessage(code) {
  const messages = {
    'auth/invalid-email': 'Invalid email address.',
    'auth/user-disabled': 'This account has been disabled.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password.',
    'auth/email-already-in-use': 'Email already in use.',
    'auth/weak-password': 'Password should be at least 6 characters.',
    'auth/network-request-failed': 'Network error. Check your connection.',
    'auth/too-many-requests': 'Too many attempts. Try again later.',
    'auth/popup-blocked': 'Popup blocked. Allow popups and try again.',
    'auth/popup-closed-by-user': 'Sign-in cancelled.',
    'auth/account-exists-with-different-credential': 'Account exists with different sign-in method.',
    'auth/operation-not-allowed': 'This sign-in method is not enabled.'
  };
  return messages[code] || `Authentication error: ${code}`;
}
