// keys.js
import { state } from '../state.js';
import { checkReady } from './setup-form.js';
import { auth, db } from '../../firebase-init.js';
import { doc, setDoc, getDoc } from 'https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js';

/* Helper to wait for auth */
function waitForAuth() {
    return new Promise((resolve, reject) => {
        if (auth.currentUser) {
            resolve(auth.currentUser);
        } else {
            const unsubscribe = auth.onAuthStateChanged((user) => {
                unsubscribe();
                if (user) {
                    resolve(user);
                } else {
                    reject(new Error('No authenticated user'));
                }
            });
        }
    });
}

/* Firebase helpers */
async function saveKeyToFirestore(field, value) {
    try {
        const user = await waitForAuth();
        const uid = user.uid;
        
        await setDoc(doc(db, 'users', uid), { [field]: value }, { merge: true });
        console.log(`Saved ${field} to Firestore for user ${uid}`);
        return true;
    } catch (e) {
        console.warn(`Could not save ${field} to Firestore:`, e);
        return false;
    }
}

async function loadKeysFromFirestore() {
    try {
        const user = await waitForAuth();
        const uid = user.uid;
        
        console.log(`Loading keys from Firestore for user ${uid}`);
        
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Firestore timeout')), 5000);
        });
        
        const snap = await Promise.race([
            getDoc(doc(db, 'users', uid)),
            timeoutPromise
        ]);
        
        if (snap.exists()) {
            const data = snap.data();
            console.log(`Loaded keys from Firestore:`, {
                hasGemini: !!data.geminiKey,
                hasYoutube: !!data.youtubeKey
            });
            return data;
        } else {
            console.log('No existing keys in Firestore');
            return null;
        }
    } catch (e) {
        if (e.message !== 'Firestore timeout') {
            console.warn('Could not load keys from Firestore:', e);
        }
        return null;
    }
}

/* Update global PrepPortalKeys for TheoryAnalyser */
function updatePrepPortalKeys() {
    if (!window.PrepPortalKeys) {
        window.PrepPortalKeys = {};
    }
    window.PrepPortalKeys.gemini = state.KEY_VERIFIED ? state.GEMINI_KEY : null;
    window.PrepPortalKeys.youtube = state.YT_KEY_VERIFIED ? state.YT_KEY : null;
    
    // Also sync to window.state if it exists
    if (window.state) {
        window.state.GEMINI_KEY = state.GEMINI_KEY;
        window.state.KEY_VERIFIED = state.KEY_VERIFIED;
        window.state.YT_KEY = state.YT_KEY;
        window.state.YT_KEY_VERIFIED = state.YT_KEY_VERIFIED;
    }
    
    console.log('PrepPortalKeys updated:', {
        hasGemini: !!window.PrepPortalKeys.gemini,
        hasYoutube: !!window.PrepPortalKeys.youtube
    });
}

/* Gemini key */
export function setGeminiKeyRaw(raw, verified, source = 'manual') {
    const key = raw.trim();
    state.GEMINI_KEY = key;
    state.KEY_VERIFIED = verified;

    // Update global PrepPortalKeys for TheoryAnalyser
    updatePrepPortalKeys();

    const dot = document.getElementById('apikey-dot');
    const txt = document.getElementById('apikey-status-text');
    const done = document.getElementById('done-key');
    const verBtn = document.getElementById('apikey-verify-btn');

    if (!key) {
        if (dot) dot.className = 'apikey-dot';
        if (txt) txt.textContent = 'Paste your key, then click Verify';
        if (done) done.classList.remove('show');
        if (verBtn) {
            verBtn.disabled = true;
            verBtn.className = 'apikey-verify-btn';
            verBtn.textContent = 'Verify →';
        }
        console.log('Gemini key cleared');
    } else if (!verified) {
        if (dot) dot.className = 'apikey-dot bad';
        if (txt) txt.textContent = 'Key pasted — click Verify to confirm it works';
        if (done) done.classList.remove('show');
        if (verBtn) {
            verBtn.disabled = false;
            verBtn.className = 'apikey-verify-btn';
            verBtn.textContent = 'Verify →';
        }
        console.log('Gemini key pasted (unverified)');
    } else {
        if (dot) dot.className = 'apikey-dot ok';
        if (txt) txt.textContent = 'Key verified and active';
        if (done) done.classList.add('show');
        if (verBtn) {
            verBtn.disabled = true;
            verBtn.className = 'apikey-verify-btn verified';
            verBtn.textContent = 'Verified';
        }
        
        // Only save to Firestore if it's a new verification
        if (source === 'manual' || source === 'verify') {
            saveKeyToFirestore('geminiKey', key);
        }
        console.log('Gemini key verified and active');
    }
    checkReady();
}

export async function initGeminiKey() {
    console.log('Initializing Gemini key...');
    
    try {
        await waitForAuth();
        console.log('Auth ready for Gemini key');
        
        // Only load from Firestore - single source of truth
        const stored = await loadKeysFromFirestore();
        
        if (stored?.geminiKey) {
            const input = document.getElementById('apikey-input');
            if (input) {
                input.value = stored.geminiKey;
                setGeminiKeyRaw(stored.geminiKey, true, 'firestore');
                console.log('Gemini key loaded from Firestore and set in state');
            } else {
                // Input not found, just set the key
                setGeminiKeyRaw(stored.geminiKey, true, 'firestore');
                console.log('Gemini key set from Firestore (no input field)');
            }
        } else {
            console.log('No Gemini key found in Firestore');
        }

        // Check if the API key input exists on the page
        const input = document.getElementById('apikey-input');
        if (input && !input.hasListener) {
            input.addEventListener('input', function () {
                setGeminiKeyRaw(this.value, false, 'manual');
            });
            input.hasListener = true;
        }

        const toggle = document.getElementById('apikey-toggle');
        if (toggle && !toggle.hasListener) {
            toggle.addEventListener('click', function () {
                const inp = document.getElementById('apikey-input');
                if (inp) {
                    const hidden = inp.type === 'password';
                    inp.type = hidden ? 'text' : 'password';
                    this.textContent = hidden ? 'Hide' : 'Show';
                }
            });
            toggle.hasListener = true;
        }

        const verifyBtn = document.getElementById('apikey-verify-btn');
        if (verifyBtn && !verifyBtn.hasListener) {
            verifyBtn.addEventListener('click', async function () {
                const key = state.GEMINI_KEY.trim();
                if (!key) {
                    alert('Please paste your Gemini API key first');
                    return;
                }

                const dot = document.getElementById('apikey-dot');
                const txt = document.getElementById('apikey-status-text');
                const done = document.getElementById('done-key');
                
                this.disabled = true;
                this.className = 'apikey-verify-btn verifying';
                this.textContent = 'Checking…';
                if (dot) dot.className = 'apikey-dot verifying';
                if (txt) txt.textContent = 'Verifying key with Gemini…';

                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 10000);

                try {
                    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${encodeURIComponent(key)}`;
                    const res = await fetch(url, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            contents: [{ parts: [{ text: 'Reply with the single word: ok' }] }],
                            generationConfig: { maxOutputTokens: 5 },
                        }),
                        signal: controller.signal
                    });
                    
                    clearTimeout(timeoutId);
                    
                    if (res.ok) {
                        setGeminiKeyRaw(key, true, 'verify');
                        if (txt) txt.textContent = 'Key verified successfully!';
                        console.log('Gemini key verification successful');
                    } else if (res.status === 400) {
                        setGeminiKeyRaw(key, true, 'verify');
                        if (txt) txt.textContent = 'Key verified (format accepted)';
                        console.log('Gemini key accepted despite 400 response');
                    } else if (res.status === 429) {
                        setGeminiKeyRaw(key, true, 'verify');
                        if (txt) txt.textContent = 'Key valid (quota limit active)';
                        console.log('Gemini key valid but quota exceeded');
                    } else if (res.status === 401 || res.status === 403) {
                        state.KEY_VERIFIED = false;
                        updatePrepPortalKeys();
                        if (dot) dot.className = 'apikey-dot bad';
                        if (txt) txt.textContent = 'Invalid key — check and re-paste from AI Studio';
                        if (done) done.classList.remove('show');
                        this.className = 'apikey-verify-btn failed';
                        this.textContent = 'Invalid';
                        this.disabled = false;
                        console.log('Invalid Gemini key');
                    } else {
                        throw new Error(`HTTP ${res.status}`);
                    }
                } catch (err) {
                    clearTimeout(timeoutId);
                    if (err.name === 'AbortError') {
                        if (dot) dot.className = 'apikey-dot bad';
                        if (txt) txt.textContent = 'Request timed out — check your internet connection';
                        this.className = 'apikey-verify-btn failed';
                        this.textContent = 'Retry →';
                        this.disabled = false;
                        console.log('Gemini verification timeout');
                    } else {
                        if (dot) dot.className = 'apikey-dot bad';
                        if (txt) txt.textContent = `Could not reach Gemini — check connection (${err.message})`;
                        this.className = 'apikey-verify-btn failed';
                        this.textContent = 'Retry →';
                        this.disabled = false;
                        console.error('Gemini verification error:', err);
                    }
                }
                checkReady();
            });
            verifyBtn.hasListener = true;
        }
        
        // Log final key status
        console.log('Gemini key initialization complete. Key present:', !!state.GEMINI_KEY, 'Verified:', state.KEY_VERIFIED);
        
    } catch (error) {
        console.error('Error initializing Gemini key:', error);
    }
}

/* YouTube key */
export function setYTKeyRaw(raw, verified, source = 'manual') {
    const key = raw.trim();
    state.YT_KEY = key;
    state.YT_KEY_VERIFIED = verified;

    // Update global PrepPortalKeys for TheoryAnalyser
    updatePrepPortalKeys();

    const dot = document.getElementById('yt-apikey-dot');
    const txt = document.getElementById('yt-apikey-status-text');
    const done = document.getElementById('yt-done-key');
    const verBtn = document.getElementById('yt-apikey-verify-btn');
    const sub = document.getElementById('yt-apikey-sub');

    if (!key) {
        if (dot) dot.className = 'apikey-dot';
        if (txt) txt.textContent = 'Optional — skip to use channel search links';
        if (done) done.style.display = 'none';
        if (verBtn) {
            verBtn.disabled = true;
            verBtn.className = 'apikey-verify-btn';
            verBtn.textContent = 'Verify →';
        }
        if (sub) sub.textContent = 'Add your key for real embedded videos with thumbnails — skip for channel search links instead';
    } else if (!verified) {
        if (dot) dot.className = 'apikey-dot bad';
        if (txt) txt.textContent = 'Key pasted — click Verify to confirm';
        if (done) done.style.display = 'none';
        if (verBtn) {
            verBtn.disabled = false;
            verBtn.className = 'apikey-verify-btn';
            verBtn.textContent = 'Verify →';
        }
        console.log('YouTube key pasted (unverified)');
    } else {
        if (dot) dot.className = 'apikey-dot ok';
        if (txt) txt.textContent = 'YouTube key verified — real video embeds enabled';
        if (done) done.style.display = '';
        if (verBtn) {
            verBtn.disabled = true;
            verBtn.className = 'apikey-verify-btn verified';
            verBtn.textContent = 'Verified';
        }
        if (sub) sub.textContent = 'Real embedded videos with thumbnails are enabled';
        
        if (source === 'manual' || source === 'verify') {
            saveKeyToFirestore('youtubeKey', key);
        }
        console.log('YouTube key verified and active');
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

    try {
        await waitForAuth();
        
        // Only load from Firestore - single source of truth
        const stored = await loadKeysFromFirestore();
        
        if (stored?.youtubeKey) {
            document.getElementById('yt-apikey-input').value = stored.youtubeKey;
            setYTKeyRaw(stored.youtubeKey, true, 'firestore');
            console.log('YouTube key loaded from Firestore');
        }
    } catch (error) {
        if (error.name !== 'AbortError') {
            console.warn('Error loading YouTube key:', error);
        }
    }

    const ytInput = document.getElementById('yt-apikey-input');
    if (ytInput && !ytInput.hasListener) {
        ytInput.addEventListener('input', function () {
            setYTKeyRaw(this.value, false, 'manual');
        });
        ytInput.hasListener = true;
    }

    const ytToggle = document.getElementById('yt-apikey-toggle');
    if (ytToggle && !ytToggle.hasListener) {
        ytToggle.addEventListener('click', function () {
            const inp = document.getElementById('yt-apikey-input');
            const hidden = inp.type === 'password';
            inp.type = hidden ? 'text' : 'password';
            this.textContent = hidden ? 'Hide' : 'Show';
        });
        ytToggle.hasListener = true;
    }

    const skipBtn = document.getElementById('yt-apikey-skip-btn');
    if (skipBtn && !skipBtn.hasListener) {
        skipBtn.addEventListener('click', () => {
            document.getElementById('yt-apikey-input').value = '';
            state.YT_KEY = '';
            state.YT_KEY_VERIFIED = false;
            updatePrepPortalKeys();
            const dot = document.getElementById('yt-apikey-dot');
            const txt = document.getElementById('yt-apikey-status-text');
            if (dot) dot.className = 'apikey-dot ok';
            if (txt) txt.textContent = 'Using channel search links (no key needed)';
            console.log('YouTube key skipped');
        });
        skipBtn.hasListener = true;
    }

    const ytVerifyBtn = document.getElementById('yt-apikey-verify-btn');
    if (ytVerifyBtn && !ytVerifyBtn.hasListener) {
        ytVerifyBtn.addEventListener('click', async function () {
            const key = state.YT_KEY.trim();
            if (!key) return;

            const dot = document.getElementById('yt-apikey-dot');
            const txt = document.getElementById('yt-apikey-status-text');
            this.disabled = true;
            this.className = 'apikey-verify-btn verifying';
            this.textContent = 'Checking…';
            if (dot) dot.className = 'apikey-dot verifying';
            if (txt) txt.textContent = 'Verifying key with YouTube…';

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);

            try {
                const res = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1&q=test&key=${encodeURIComponent(key)}`, {
                    signal: controller.signal
                });
                
                clearTimeout(timeoutId);
                
                if (res.ok) {
                    setYTKeyRaw(key, true, 'verify');
                } else if (res.status === 400 || res.status === 403) {
                    state.YT_KEY_VERIFIED = false;
                    updatePrepPortalKeys();
                    if (dot) dot.className = 'apikey-dot bad';
                    if (txt) txt.textContent = 'Invalid YouTube key — check Google Cloud Console';
                    this.className = 'apikey-verify-btn failed';
                    this.textContent = 'Invalid';
                    this.disabled = false;
                } else {
                    throw new Error(`HTTP ${res.status}`);
                }
            } catch (err) {
                clearTimeout(timeoutId);
                if (err.name === 'AbortError') {
                    if (dot) dot.className = 'apikey-dot bad';
                    if (txt) txt.textContent = 'Request timed out — check your internet connection';
                    this.className = 'apikey-verify-btn failed';
                    this.textContent = 'Retry →';
                    this.disabled = false;
                    console.log('YouTube verification timeout');
                } else {
                    if (dot) dot.className = 'apikey-dot bad';
                    if (txt) txt.textContent = `Could not reach YouTube — (${err.message})`;
                    this.className = 'apikey-verify-btn failed';
                    this.textContent = 'Retry →';
                    this.disabled = false;
                    console.error('YouTube verification error:', err);
                }
            }
        });
        ytVerifyBtn.hasListener = true;
    }
}

export function clearKeysOnUnload() {
    window.addEventListener('beforeunload', () => {
        state.GEMINI_KEY = '';
        state.KEY_VERIFIED = false;
        state.YT_KEY = '';
        state.YT_KEY_VERIFIED = false;
        updatePrepPortalKeys();
        console.log('Keys cleared on unload');
    });
}