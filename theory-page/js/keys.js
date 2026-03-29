/* ════════════════════════════════════════
   keys.js
════════════════════════════════════════ */
import { state } from '../state.js';
import { checkReady } from './setup-form.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
import { getFirestore, doc, setDoc, getDoc } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

/* ── Firebase helpers ── */
function currentUID() {
  return getAuth().currentUser?.uid ?? null;
}

async function saveKeyToFirestore(field, value) {
  const uid = currentUID();
  if (!uid) return;
  try {
    const db = getFirestore();
    await setDoc(doc(db, 'users', uid, 'settings', 'keys'), { [field]: value }, { merge: true });
  } catch (e) {
    console.warn('Could not save key to Firestore:', e);
  }
}

async function loadKeysFromFirestore() {
  const uid = currentUID();
  if (!uid) return null;
  try {
    const db = getFirestore();
    const snap = await getDoc(doc(db, 'users', uid, 'settings', 'keys'));
    return snap.exists() ? snap.data() : null;
  } catch (e) {
    console.warn('Could not load keys from Firestore:', e);
    return null;
  }
}

/* ── Gemini key ── */
export function setGeminiKeyRaw(raw, verified) {
  const key = raw.trim();
  state.GEMINI_KEY = key;
  state.KEY_VERIFIED = verified;

  const dot    = document.getElementById('apikey-dot');
  const txt    = document.getElementById('apikey-status-text');
  const done   = document.getElementById('done-key');
  const verBtn = document.getElementById('apikey-verify-btn');

  if (!key) {
    dot.className = 'apikey-dot';
    txt.textContent = 'Paste your key, then click Verify';
    done.classList.remove('show');
    verBtn.disabled = true;
    verBtn.className = 'apikey-verify-btn';
    verBtn.textContent = 'Verify →';
  } else if (!verified) {
    dot.className = 'apikey-dot bad';
    txt.textContent = 'Key pasted — click Verify to confirm it works';
    done.classList.remove('show');
    verBtn.disabled = false;
    verBtn.className = 'apikey-verify-btn';
    verBtn.textContent = 'Verify →';
    sessionStorage.setItem('pp_gemini_key', key);
  } else {
    dot.className = 'apikey-dot ok';
    txt.textContent = 'Key verified and active';
    done.classList.add('show');
    verBtn.disabled = true;
    verBtn.className = 'apikey-verify-btn verified';
    verBtn.textContent = 'Verified';
    sessionStorage.setItem('pp_gemini_key', key);
    saveKeyToFirestore('geminiKey', key); // <-- persist to Firebase
  }
  checkReady();
}

export async function initGeminiKey() {
  // Try Firestore first, fall back to sessionStorage
  const stored = await loadKeysFromFirestore();
  const saved = stored?.geminiKey || sessionStorage.getItem('pp_gemini_key') || '';
  if (saved) {
    document.getElementById('apikey-input').value = saved;
    setGeminiKeyRaw(saved, !!stored?.geminiKey); // treat Firestore key as pre-verified
  }

  document.getElementById('apikey-input').addEventListener('input', function () {
    setGeminiKeyRaw(this.value, false);
  });

  document.getElementById('apikey-toggle').addEventListener('click', function () {
    const inp = document.getElementById('apikey-input');
    const hidden = inp.type === 'password';
    inp.type = hidden ? 'text' : 'password';
    this.textContent = hidden ? 'Hide' : 'Show';
  });

  document.getElementById('apikey-verify-btn').addEventListener('click', async function () {
    const key = state.GEMINI_KEY.trim();
    if (!key) return;

    const dot  = document.getElementById('apikey-dot');
    const txt  = document.getElementById('apikey-status-text');
    const done = document.getElementById('done-key');
    this.disabled = true;
    this.className = 'apikey-verify-btn verifying';
    this.textContent = 'Checking…';
    dot.className = 'apikey-dot verifying';
    txt.textContent = 'Verifying key with Gemini…';

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${encodeURIComponent(key)}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Reply with the single word: ok' }] }],
          generationConfig: { maxOutputTokens: 5 },
        }),
      });
      if (res.ok || res.status === 400) {
        setGeminiKeyRaw(key, true);
      } else if (res.status === 429) {
        setGeminiKeyRaw(key, true);
        document.getElementById('apikey-status-text').textContent =
          'Key valid (quota limit active — will retry automatically)';
      } else if (res.status === 401 || res.status === 403) {
        state.KEY_VERIFIED = false;
        dot.className = 'apikey-dot bad';
        txt.textContent = 'Invalid key — check and re-paste from AI Studio';
        done.classList.remove('show');
        this.className = 'apikey-verify-btn failed';
        this.textContent = 'Invalid';
        this.disabled = false;
        sessionStorage.removeItem('pp_gemini_key');
      } else {
        throw new Error(`HTTP ${res.status}`);
      }
    } catch (err) {
      dot.className = 'apikey-dot bad';
      txt.textContent = `Could not reach Gemini — check connection (${err.message})`;
      this.className = 'apikey-verify-btn failed';
      this.textContent = 'Retry →';
      this.disabled = false;
    }
    checkReady();
  });
}

/* ── YouTube key ── */
export function setYTKeyRaw(raw, verified) {
  const key = raw.trim();
  state.YT_KEY = key;
  state.YT_KEY_VERIFIED = verified;

  const dot    = document.getElementById('yt-apikey-dot');
  const txt    = document.getElementById('yt-apikey-status-text');
  const done   = document.getElementById('yt-done-key');
  const verBtn = document.getElementById('yt-apikey-verify-btn');
  const sub    = document.getElementById('yt-apikey-sub');

  if (!key) {
    dot.className = 'apikey-dot';
    txt.textContent = 'Optional — skip to use channel search links';
    done.style.display = 'none';
    verBtn.disabled = true;
    verBtn.className = 'apikey-verify-btn';
    verBtn.textContent = 'Verify →';
    sub.textContent = 'Add your key for real embedded videos with thumbnails — skip for channel search links instead';
  } else if (!verified) {
    dot.className = 'apikey-dot bad';
    txt.textContent = 'Key pasted — click Verify to confirm';
    done.style.display = 'none';
    verBtn.disabled = false;
    verBtn.className = 'apikey-verify-btn';
    verBtn.textContent = 'Verify →';
    sessionStorage.setItem('pp_yt_key', key);
  } else {
    dot.className = 'apikey-dot ok';
    txt.textContent = 'YouTube key verified — real video embeds enabled';
    done.style.display = '';
    verBtn.disabled = true;
    verBtn.className = 'apikey-verify-btn verified';
    verBtn.textContent = 'Verified';
    sub.textContent = 'Real embedded videos with thumbnails are enabled';
    sessionStorage.setItem('pp_yt_key', key);
    saveKeyToFirestore('ytKey', key); // <-- persist to Firebase
  }
}

export async function initYTKey() {
  if (document.getElementById('yt-apikey-section')) return;

  const anchor = document.getElementById('apikey-section') || document.querySelector('main') || document.body;
  anchor.insertAdjacentHTML('afterend', `
<section class="setup-card" id="yt-apikey-section">
  <div class="setup-card-hd">
    <div class="step-badge">★</div>
    <div>
      <div class="setup-card-title">YouTube API Key <span class="optional-badge">Optional</span></div>
      <div class="setup-card-sub" id="yt-apikey-sub">Add your key for real embedded videos with thumbnails — skip for channel search links instead</div>
    </div>
  </div>
  <div class="apikey-row">
    <input id="yt-apikey-input" class="apikey-input" type="password"
      placeholder="Paste YouTube Data API v3 key…" autocomplete="off" spellcheck="false">
    <button id="yt-apikey-toggle" class="apikey-toggle" type="button">Show</button>
  </div>
  <div class="apikey-status-row">
    <span class="apikey-dot" id="yt-apikey-dot"></span>
    <span class="apikey-status-text" id="yt-apikey-status-text">Optional — skip to use channel search links</span>
    <span class="done-badge" id="yt-done-key" style="display:none">✓</span>
  </div>
  <div style="display:flex;gap:10px;margin-top:10px;flex-wrap:wrap">
    <button id="yt-apikey-verify-btn" class="apikey-verify-btn" type="button" disabled>Verify →</button>
    <button id="yt-apikey-skip-btn" class="apikey-verify-btn" type="button"
      style="background:var(--off,#f7f4ee);color:var(--ink,#0a0a0a);border-color:var(--ruled,#ece8df);box-shadow:none">
      Skip
    </button>
  </div>
</section>`);

  // Try Firestore first, fall back to sessionStorage
  const stored = await loadKeysFromFirestore();
  const saved = stored?.ytKey || sessionStorage.getItem('pp_yt_key') || '';
  if (saved) {
    document.getElementById('yt-apikey-input').value = saved;
    setYTKeyRaw(saved, !!stored?.ytKey);
  }

  document.getElementById('yt-apikey-input').addEventListener('input', function () {
    setYTKeyRaw(this.value, false);
  });

  document.getElementById('yt-apikey-toggle').addEventListener('click', function () {
    const inp = document.getElementById('yt-apikey-input');
    const hidden = inp.type === 'password';
    inp.type = hidden ? 'text' : 'password';
    this.textContent = hidden ? 'Hide' : 'Show';
  });

  document.getElementById('yt-apikey-skip-btn').addEventListener('click', () => {
    document.getElementById('yt-apikey-input').value = '';
    state.YT_KEY = '';
    state.YT_KEY_VERIFIED = false;
    document.getElementById('yt-apikey-dot').className = 'apikey-dot ok';
    document.getElementById('yt-apikey-status-text').textContent = 'Using channel search links (no key needed)';
  });

  document.getElementById('yt-apikey-verify-btn').addEventListener('click', async function () {
    const key = state.YT_KEY.trim();
    if (!key) return;

    const dot = document.getElementById('yt-apikey-dot');
    const txt = document.getElementById('yt-apikey-status-text');
    this.disabled = true;
    this.className = 'apikey-verify-btn verifying';
    this.textContent = 'Checking…';
    dot.className = 'apikey-dot verifying';
    txt.textContent = 'Verifying key with YouTube…';

    try {
      const res = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1&q=test&key=${encodeURIComponent(key)}`);
      if (res.ok) {
        setYTKeyRaw(key, true);
      } else if (res.status === 400 || res.status === 403) {
        state.YT_KEY_VERIFIED = false;
        dot.className = 'apikey-dot bad';
        txt.textContent = 'Invalid YouTube key — check Google Cloud Console';
        this.className = 'apikey-verify-btn failed';
        this.textContent = 'Invalid';
        this.disabled = false;
        sessionStorage.removeItem('pp_yt_key');
      } else {
        throw new Error(`HTTP ${res.status}`);
      }
    } catch (err) {
      dot.className = 'apikey-dot bad';
      txt.textContent = `Could not reach YouTube — (${err.message})`;
      this.className = 'apikey-verify-btn failed';
      this.textContent = 'Retry →';
      this.disabled = false;
    }
  });
}

export function clearKeysOnUnload() {
  window.addEventListener('beforeunload', () => {
    sessionStorage.removeItem('pp_gemini_key');
    sessionStorage.removeItem('pp_yt_key');
    state.GEMINI_KEY = '';
    state.KEY_VERIFIED = false;
    state.YT_KEY = '';
    state.YT_KEY_VERIFIED = false;
    // Note: Firestore copy is intentionally NOT cleared here
  });
}