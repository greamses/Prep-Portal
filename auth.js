// ─────────────────────────────────────────────────────────────────────────────
// API KEYS MODULE
// ─────────────────────────────────────────────────────────────────────────────

// Gemini models (as provided)
const GEMINI_MODELS = [
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent',
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-pro-preview:generateContent',
  'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash-lite:generateContent',
  'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent',
  'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-pro:generateContent',
];

// Firebase config (replace with your actual config)
const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "prep-portal-2026.web.app",
  projectId: "prep-portal-2026",
  storageBucket: "prep-portal-2026.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase (if not already initialized)
let auth, db;
if (typeof firebase !== 'undefined' && !firebase.apps?.length) {
  firebase.initializeApp(firebaseConfig);
  auth = firebase.auth();
  db = firebase.firestore();
} else if (typeof firebase !== 'undefined') {
  auth = firebase.auth();
  db = firebase.firestore();
}

// State
let authUser = null;
let editMode = false;
const KEYS = ['gemini', 'groq', 'youtube'];
let verified = { gemini: false, groq: false, youtube: false };
let loaded = { gemini: null, groq: null, youtube: null };

// DOM element references
let elements = {};

// ─────────────────────────────────────────────────────────────────────────────
// VERIFICATION FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────
async function verifyGemini(key) {
  let lastError;
  for (const modelUrl of GEMINI_MODELS) {
    try {
      const url = `${modelUrl}?key=${key}`;
      const body = JSON.stringify({ contents: [{ parts: [{ text: "Hi" }] }] });
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body
      });
      if (res.ok) return true;
      const errData = await res.json().catch(() => ({}));
      lastError = new Error(errData?.error?.message || `HTTP ${res.status}`);
    } catch (e) {
      lastError = e;
    }
  }
  throw lastError || new Error('All Gemini models failed');
}

async function verifyGroq(key) {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`
    },
    body: JSON.stringify({
      model: 'llama3-8b-8192',
      messages: [{ role: 'user', content: 'Hi' }],
      max_tokens: 1
    })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `HTTP ${res.status}`);
  }
  return true;
}

async function verifyYouTube(key) {
  const url = `https://www.googleapis.com/youtube/v3/videos?part=id&id=dQw4w9WgXcQ&key=${key}`;
  const res = await fetch(url);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `HTTP ${res.status}`);
  }
  return true;
}

const verifiers = { gemini: verifyGemini, groq: verifyGroq, youtube: verifyYouTube };

// ─────────────────────────────────────────────────────────────────────────────
// UI HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function setCardStatus(id, state, text) {
  const pill = elements[`status-${id}`];
  const label = elements[`status-${id}-txt`];
  if (pill && label) {
    pill.className = `kc-status ${state}`;
    label.textContent = text;
  }
}

function setFeedback(id, cls, msg) {
  const el = elements[`feedback-${id}`];
  if (el) {
    el.className = `kc-feedback ${cls}`;
    el.textContent = msg;
  }
}

function setVerifyBtnLoading(id, loading) {
  const btn = elements[`verify-btn-${id}`];
  if (!btn) return;
  btn.disabled = loading;
  if (loading) {
    btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="animation:spin .6s linear infinite"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg> Verifying…`;
  } else {
    btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14"><polyline points="20 6 9 17 4 12"/></svg> Verify Key`;
  }
}

function updateProgress() {
  const count = KEYS.filter(k => verified[k]).length;
  if (elements['progress-bar']) {
    elements['progress-bar'].style.width = `${(count / 3) * 100}%`;
  }
  
  const anyInput = KEYS.some(k => {
    const input = elements[`input-${k}`];
    return input && input.value.trim();
  });
  if (elements['save-all-btn']) {
    elements['save-all-btn'].disabled = !anyInput;
  }
  
  if (elements['cta-note']) {
    if (count === 3) {
      elements['cta-note'].textContent = 'All 3 keys verified — ready to save.';
    } else if (count > 0) {
      elements['cta-note'].textContent = `${count}/3 keys verified.`;
    } else {
      elements['cta-note'].textContent = 'Enter at least one key to continue.';
    }
  }
}

function showStatus(type, msg, duration = 3000) {
  if (!elements['status-bar']) return;
  elements['status-bar'].className = `status-bar ${type}`;
  elements['status-bar'].textContent = msg;
  if (duration) {
    setTimeout(() => {
      if (elements['status-bar'] && elements['status-bar'].className === `status-bar ${type}`) {
        elements['status-bar'].className = 'status-bar';
      }
    }, duration);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// FIRESTORE OPERATIONS (with null checks)
// ─────────────────────────────────────────────────────────────────────────────
async function loadKeysFromFirestore() {
  if (!authUser || !db) return { gemini: null, groq: null, youtube: null };
  try {
    const snap = await db.collection('users').doc(authUser.uid).get();
    const data = snap.data() || {};
    return {
      gemini: data.geminiKey || null,
      groq: data.groqKey || null,
      youtube: data.youtubeKey || null
    };
  } catch (err) {
    console.warn('Firestore load error:', err);
    return { gemini: null, groq: null, youtube: null };
  }
}

async function saveKeysToFirestore(keys) {
  if (!authUser) throw new Error('User not authenticated');
  if (!db) throw new Error('Firestore not initialized');
  const payload = {};
  if (keys.gemini !== undefined) payload.geminiKey = keys.gemini;
  if (keys.groq !== undefined) payload.groqKey = keys.groq;
  if (keys.youtube !== undefined) payload.youtubeKey = keys.youtube;
  await db.collection('users').doc(authUser.uid).set(payload, { merge: true });
}

// ─────────────────────────────────────────────────────────────────────────────
// BROADCAST KEYS
// ─────────────────────────────────────────────────────────────────────────────
function broadcastKeys() {
  window.PrepPortalKeys = {
    gemini: loaded.gemini || null,
    groq: loaded.groq || null,
    youtube: loaded.youtube || null,
    ready: KEYS.every(k => !!loaded[k])
  };
  window.dispatchEvent(new CustomEvent('prepportal:keysReady', {
    detail: window.PrepPortalKeys
  }));
}

// ─────────────────────────────────────────────────────────────────────────────
// VERIFY SINGLE KEY
// ─────────────────────────────────────────────────────────────────────────────
async function verifySingle(id) {
  const input = elements[`input-${id}`];
  if (!input) return;
  const key = input.value.trim();
  
  if (!key) {
    setFeedback(id, 'fail', 'Please enter a key first.');
    return;
  }
  
  setVerifyBtnLoading(id, true);
  setCardStatus(id, 'checking', 'Checking…');
  setFeedback(id, 'info', 'Sending test request…');
  
  try {
    await verifiers[id](key);
    verified[id] = true;
    loaded[id] = key;
    setCardStatus(id, 'ok', 'Verified');
    setFeedback(id, 'ok', 'Key is valid and active.');
    showStatus('success', `${id.charAt(0).toUpperCase() + id.slice(1)} key verified.`);
  } catch (err) {
    verified[id] = false;
    setCardStatus(id, 'fail', 'Invalid');
    setFeedback(id, 'fail', err.message || 'Verification failed — check the key and try again.');
    showStatus('error', `${id} key failed: ${err.message}`);
  } finally {
    setVerifyBtnLoading(id, false);
    updateProgress();
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// VERIFY ALL & SAVE
// ─────────────────────────────────────────────────────────────────────────────
async function verifyAndSaveAll() {
  if (!elements['save-all-btn']) return;
  
  elements['save-all-btn'].disabled = true;
  elements['save-all-btn'].innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="animation:spin .6s linear infinite"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg> Verifying…`;
  showStatus('info', 'Verifying all keys in parallel…', 0);
  
  const toVerify = KEYS.filter(id => {
    const input = elements[`input-${id}`];
    return input && input.value.trim();
  });
  
  if (!toVerify.length) {
    showStatus('error', 'Enter at least one API key.');
    elements['save-all-btn'].disabled = false;
    elements['save-all-btn'].innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="16" height="16"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg> Verify All &amp; Save`;
    return;
  }
  
  await Promise.all(toVerify.map(id => verifySingle(id)));
  
  const anyOk = toVerify.some(id => verified[id]);
  if (!anyOk) {
    showStatus('error', 'No keys passed verification. Check the values and retry.');
    elements['save-all-btn'].disabled = false;
    elements['save-all-btn'].innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="16" height="16"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg> Verify All &amp; Save`;
    return;
  }
  
  try {
    elements['save-all-btn'].innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="animation:spin .6s linear infinite"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg> Saving…`;
    
    await saveKeysToFirestore({
      gemini: verified.gemini ? loaded.gemini : undefined,
      groq: verified.groq ? loaded.groq : undefined,
      youtube: verified.youtube ? loaded.youtube : undefined
    });
    
    broadcastKeys();
    
    const allOk = KEYS.every(k => verified[k]);
    showStatus('success', allOk ?
      'All 3 keys verified and saved. Platform fully unlocked!' :
      'Keys saved. Some keys were not entered — add them any time.');
    
    if (KEYS.every(k => verified[k])) {
      enterBypassMode();
    }
    
    KEYS.forEach(id => {
      if (verified[id]) setCardStatus(id, 'stored', 'Saved');
    });
    
  } catch (err) {
    showStatus('error', `Save failed: ${err.message}`);
  } finally {
    elements['save-all-btn'].disabled = false;
    elements['save-all-btn'].innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="16" height="16"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg> Verify All &amp; Save`;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// BYPASS MODE
// ─────────────────────────────────────────────────────────────────────────────
function enterBypassMode() {
  if (elements['bypass-banner']) {
    elements['bypass-banner'].classList.add('visible');
  }
  
  KEYS.forEach(id => {
    const inp = elements[`input-${id}`];
    const verifyBtn = elements[`verify-btn-${id}`];
    if (loaded[id]) {
      if (inp) {
        inp.value = '•'.repeat(32);
        inp.disabled = true;
      }
      if (verifyBtn) verifyBtn.disabled = true;
      setCardStatus(id, 'stored', 'Saved');
    }
  });
  
  if (elements['save-all-btn']) elements['save-all-btn'].disabled = true;
  editMode = false;
}

function enterEditMode() {
  if (elements['bypass-banner']) {
    elements['bypass-banner'].classList.remove('visible');
  }
  
  KEYS.forEach(id => {
    const inp = elements[`input-${id}`];
    const verifyBtn = elements[`verify-btn-${id}`];
    if (inp) {
      inp.value = '';
      inp.disabled = false;
    }
    if (verifyBtn) verifyBtn.disabled = false;
    setCardStatus(id, 'idle', 'Not set');
    setFeedback(id, '', '');
    verified[id] = false;
    loaded[id] = null;
  });
  
  if (elements['save-all-btn']) elements['save-all-btn'].disabled = false;
  if (elements['progress-bar']) elements['progress-bar'].style.width = '0%';
  
  editMode = true;
  window.PrepPortalKeys = null;
}

// ─────────────────────────────────────────────────────────────────────────────
// INPUT HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function toggleVisibility(id) {
  const inp = elements[`input-${id}`];
  const eye = elements[`eye-${id}`];
  if (!inp || !eye) return;
  
  if (inp.type === 'password') {
    inp.type = 'text';
    eye.innerHTML = `<path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>`;
  } else {
    inp.type = 'password';
    eye.innerHTML = `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>`;
  }
}

async function pasteKey(id) {
  try {
    const text = await navigator.clipboard.readText();
    const inp = elements[`input-${id}`];
    if (inp && text.trim()) {
      inp.value = text.trim();
      updateProgress();
    }
  } catch (e) {
    // permissions denied — ignore
  }
}

function clearKey(id) {
  const inp = elements[`input-${id}`];
  if (inp) inp.value = '';
  verified[id] = false;
  loaded[id] = null;
  setCardStatus(id, 'idle', 'Not set');
  setFeedback(id, '', '');
  updateProgress();
}

// ─────────────────────────────────────────────────────────────────────────────
// INFO ACCORDION
// ─────────────────────────────────────────────────────────────────────────────
function toggleInfo() {
  if (elements['info-toggle'] && elements['info-body']) {
    elements['info-toggle'].classList.toggle('open');
    elements['info-body'].classList.toggle('open');
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// INITIALIZATION
// ─────────────────────────────────────────────────────────────────────────────
function initDOMCache() {
  const ids = [
    'progress-bar', 'save-all-btn', 'cta-note', 'status-bar',
    'bypass-banner', 'info-toggle', 'info-body'
  ];
  ids.forEach(id => {
    elements[id] = document.getElementById(id);
  });
  
  KEYS.forEach(key => {
    elements[`input-${key}`] = document.getElementById(`input-${key}`);
    elements[`status-${key}`] = document.getElementById(`status-${key}`);
    elements[`status-${key}-txt`] = document.getElementById(`status-${key}-txt`);
    elements[`feedback-${key}`] = document.getElementById(`feedback-${key}`);
    elements[`verify-btn-${key}`] = document.getElementById(`verify-btn-${key}`);
    elements[`eye-${key}`] = document.getElementById(`eye-${key}`);
  });
}

function initEventListeners() {
  KEYS.forEach(id => {
    const input = elements[`input-${id}`];
    if (input) {
      input.addEventListener('input', updateProgress);
    }
  });
}

function injectTicker() {
  const items = [
    'Gemini API', 'Groq', 'YouTube Data v3', 'Secure Storage',
    'Firebase', 'Instant Unlock', 'PrepBot', 'Theory Analyser',
    'Essay Grader', 'Algebra Lab', 'Video Resources', 'WAEC Prep'
  ];
  const track = document.getElementById('ticker-track');
  if (!track) return;
  const doubled = [...items, ...items];
  track.innerHTML = doubled.map(i =>
    `<span class="ticker-item">${i}<span class="ticker-dot"></span></span>`
  ).join('');
}

function initNav() {
  const toggle = document.getElementById('nav-toggle');
  const links = document.getElementById('nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('open');
      links.classList.toggle('open');
    });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// AUTHENTICATION
// ─────────────────────────────────────────────────────────────────────────────
async function onAuthStateChanged(user) {
  const gate = document.getElementById('auth-gate');
  
  if (!user) {
    if (gate) {
      gate.innerHTML = `
        <div class="gate-spinner"></div>
        <span class="gate-lbl">No active session — please sign in</span>
        <button class="btn-primary" style="margin-top:20px; background:var(--ink); color:var(--yellow); border:none; padding:12px 24px; cursor:pointer;" onclick="window.location.href='../dashboard/login.html'">
          Go to Login
        </button>
      `;
    }
    return;
  }
  
  authUser = user;
  
  if (gate) {
    gate.classList.add('hidden');
    setTimeout(() => {
      if (gate && gate.parentNode) gate.remove();
    }, 400);
  }
  
  injectTicker();
  initNav();
  
  try {
    const stored = await loadKeysFromFirestore();
    
    let allPresent = true;
    KEYS.forEach(id => {
      if (stored[id]) {
        loaded[id] = stored[id];
        verified[id] = true;
        setCardStatus(id, 'stored', 'Saved');
        setFeedback(id, 'ok', 'Key loaded from your account.');
      } else {
        allPresent = false;
      }
    });
    
    updateProgress();
    
    if (allPresent) {
      broadcastKeys();
      enterBypassMode();
      showStatus('success', 'All API keys loaded — platform ready.');
    } else {
      const count = KEYS.filter(k => stored[k]).length;
      if (count > 0) {
        showStatus('info', `${count} of 3 keys found. Add the remaining keys below.`);
      }
    }
  } catch (err) {
    showStatus('error', `Could not load saved keys: ${err.message}`);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN INIT FUNCTION
// ─────────────────────────────────────────────────────────────────────────────
function init() {
  initDOMCache();
  initEventListeners();
  if (auth) {
    auth.onAuthStateChanged(onAuthStateChanged);
  } else {
    console.warn('Firebase auth not available. Please check Firebase initialization.');
    // Show gate with error
    const gate = document.getElementById('auth-gate');
    if (gate) {
      gate.innerHTML = `
        <div class="gate-spinner"></div>
        <span class="gate-lbl">Firebase not initialized. Check your configuration.</span>
      `;
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPORTS (for module usage)
// ─────────────────────────────────────────────────────────────────────────────
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    verifySingle,
    verifyAndSaveAll,
    enterEditMode,
    toggleVisibility,
    pasteKey,
    clearKey,
    toggleInfo,
    init,
    verified,
    loaded,
    KEYS
  };
}

// For browser global usage - attach to window
if (typeof window !== 'undefined') {
  window.APIModule = {
    verifySingle,
    verifyAndSaveAll,
    enterEditMode,
    toggleVisibility,
    pasteKey,
    clearKey,
    toggleInfo,
    init
  };
  
  // Auto-init when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}