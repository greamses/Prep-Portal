/* ═══════════════════════════════════════════════════════════
   PREPBOT — Reusable AI Study Assistant (Groq / Llama 3.1)
   Features: AI Chat, MathJax/LaTeX, Auto-Navigation, Hidden Quiz Context
   Updated: Strict LaTeX, Material Symbols, & Image Attachments
═══════════════════════════════════════════════════════════ */

(function() {

    /* ── INJECT CSS ── */
    (function injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
/* ════════════════════════════════════════
   PREPBOT — BLUE / BLACK THEME
   ════════════════════════════════════════ */

#prepbot,
#prepbot *,
#chat-fab-wrap,
#chat-fab-wrap *,
#chat-fab-restore,
#chat-window,
#chat-window * {
    --bg:      #ffffff;
    --ink:     #1f1f1f;
    --blue:    #0b57d0;
    --muted:   #444746;
    --rule:    #e0e2e0;
    --cb:      cubic-bezier(0.22, 1, 0.36, 1);
}

/* ── FAB WRAP ── */
#chat-fab-wrap {
    position: fixed;
    bottom: 32px;
    right: 32px;
    z-index: 9999;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: transform 0.25s var(--cb), opacity 0.2s ease;
}

#chat-fab-wrap.fab-hidden {
    transform: translateY(16px);
    opacity: 0;
    pointer-events: none;
}

/* ── DISMISS X ── */
#chat-fab-dismiss {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: var(--ink);
    border: 1.5px solid var(--ink);
    color: var(--bg);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transform: scale(0.7);
    transition: opacity 0.2s ease, transform 0.2s var(--cb), background 0.15s;
    flex-shrink: 0;
}

#chat-fab-wrap:hover #chat-fab-dismiss {
    opacity: 1;
    transform: scale(1);
}

#chat-fab-dismiss:hover {
    background: #c0392b;
    border-color: #c0392b;
}

/* ── RESTORE TAB ── */
#chat-fab-restore {
    position: fixed;
    bottom: 50%;
    right: -62px;
    transform: translateY(50%);
    z-index: 9999;
    background: var(--ink);
    color: var(--bg);
    border: 2px solid var(--ink);
    border-right: none;
    padding: 10px 8px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    font-family: 'Unbounded', sans-serif;
    font-size: 0.6rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    transition: right 0.3s var(--cb), background 0.15s;
    box-shadow: -3px 0 0 var(--blue);
}

#chat-fab-restore.fab-restore-visible { right: 0; }

#chat-fab-restore:hover {
    background: var(--blue);
    border-color: var(--blue);
    box-shadow: -3px 0 0 var(--ink);
}

/* ── FAB BUTTON ── */
#chat-fab {
    z-index: 9999;
    width: auto;
    height: auto;
    background: var(--ink);
    border: 2px solid var(--ink);
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 20px 12px 16px;
    outline: none;
    font-family: 'Unbounded', sans-serif;
    font-weight: 700;
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--bg);
    transition: background 0.25s ease, transform 0.2s var(--cb), box-shadow 0.2s ease;
    box-shadow: 3px 3px 0 var(--blue);
}

#chat-fab:hover {
    background: var(--blue);
    border-color: var(--blue);
    transform: translate(-2px, -2px);
    box-shadow: 5px 5px 0 var(--ink);
}

#chat-fab:active {
    transform: translate(1px, 1px);
    box-shadow: 1px 1px 0 var(--ink);
}

#chat-fab .fab-dot {
    width: 7px;
    height: 7px;
    background: #4cff91;
    border-radius: 50%;
    flex-shrink: 0;
    animation: pulse-dot 2.4s ease-in-out infinite;
}

@keyframes pulse-dot {
    0%, 100% { opacity: 1;   transform: scale(1);   }
    50%       { opacity: 0.5; transform: scale(0.7); }
}

#chat-fab .fab-label { display: none; }

/* ── CHAT WINDOW ── */
#chat-window {
    position: fixed;
    bottom: 100px;
    right: 32px;
    width: 400px;
    height: 580px;
    z-index: 9998;
    background: var(--bg);
    border: 2px solid var(--ink);
    box-shadow: 6px 6px 0 var(--blue);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    transform: translateY(24px) scale(0.97);
    opacity: 0;
    pointer-events: none;
    transform-origin: bottom right;
    transition: transform 0.3s var(--cb), opacity 0.25s ease;
}

#chat-window.open {
    transform: translateY(0) scale(1);
    opacity: 1;
    pointer-events: all;
}

/* animated colour stripe at top of window */
#chat-window::before {
    content: '';
    display: block;
    height: 4px;
    flex-shrink: 0;
    background: repeating-linear-gradient(
        90deg,
        var(--blue)  0px,  var(--blue) 32px,
        var(--ink)  32px, var(--ink)  48px,
        var(--blue) 48px, var(--blue) 80px,
        var(--ink)  80px, var(--ink)  96px
    );
    background-size: 200% 100%;
    animation: stripeScroll 10s linear infinite;
}

@keyframes stripeScroll {
    from { background-position: 0 0; }
    to   { background-position: 200% 0; }
}

/* ── HEADER ── */
.chat-header {
    background: var(--ink);
    color: var(--bg);
    padding: 14px 18px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
    border-bottom: 2px solid var(--blue);
}

.chat-header-left {
    display: flex;
    align-items: center;
    gap: 12px;
}

.chat-avatar {
    width: 36px;
    height: 36px;
    background: var(--blue);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.chat-avatar svg { display: block; }

.chat-header-info h4 {
    font-family: 'Unbounded', sans-serif;
    font-size: 0.78rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin: 0 0 2px;
    color: var(--bg);
}

.chat-header-info .chat-status {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 0.62rem;
    font-family: 'JetBrains Mono', monospace;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: rgba(255, 255, 255, 0.4);
}

.chat-status-dot {
    width: 6px;
    height: 6px;
    background: #4cff91;
    border-radius: 50%;
    animation: pulse-dot 2.4s ease-in-out infinite;
}

.chat-header-actions {
    display: flex;
    align-items: center;
    gap: 4px;
}

.chat-icon-btn {
    width: 32px;
    height: 32px;
    background: none;
    border: 1px solid rgba(255, 255, 255, 0.12);
    cursor: pointer;
    color: rgba(255, 255, 255, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.18s, color 0.18s, border-color 0.18s;
}

.chat-icon-btn:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
    border-color: rgba(255, 255, 255, 0.3);
}

/* ── TABS ── */
.chat-tabs {
    display: flex;
    border-bottom: 2px solid var(--ink);
    flex-shrink: 0;
    overflow-x: auto;
    scrollbar-width: none;
    background: var(--bg);
}

.chat-tabs::-webkit-scrollbar { display: none; }

.chat-tab {
    flex-shrink: 0;
    padding: 9px 16px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.62rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.09em;
    color: var(--muted);
    background: none;
    border: none;
    border-right: 1px solid var(--rule);
    cursor: pointer;
    transition: background 0.2s, color 0.2s;
    white-space: nowrap;
}

.chat-tab:hover {
    background: #f4f4f4;
    color: var(--ink);
}

.chat-tab.active {
    background: var(--ink);
    color: var(--bg);
}

/* ── MESSAGES AREA ── */
.chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 14px;
    scroll-behavior: smooth;
    background: #fafafa;
}

.chat-messages::-webkit-scrollbar { width: 3px; }
.chat-messages::-webkit-scrollbar-track { background: transparent; }
.chat-messages::-webkit-scrollbar-thumb { background: var(--rule); }
.chat-messages::-webkit-scrollbar-thumb:hover { background: var(--muted); }

/* ── INTRO CARD ── */
.chat-intro-card {
    border: 1.5px solid var(--rule);
    background: var(--bg);
    padding: 16px 18px;
    position: relative;
    overflow: hidden;
    box-shadow: 3px 3px 0 var(--rule);
}

.chat-intro-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0;
    width: 3px; height: 100%;
    background: var(--blue);
}

.chat-intro-card .intro-label {
    font-family: 'Unbounded', sans-serif;
    font-size: 0.58rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--blue);
    margin-bottom: 6px;
}

.chat-intro-card p {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.8rem;
    color: var(--muted);
    line-height: 1.65;
}

.chat-intro-card strong { color: var(--ink); }

/* ── MESSAGE BUBBLES ── */
.msg {
    display: flex;
    flex-direction: column;
    gap: 4px;
    max-width: 86%;
    animation: msg-in 0.28s var(--cb) both;
}

@keyframes msg-in {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0);    }
}

.msg.user { align-self: flex-end; align-items: flex-end; }
.msg.bot  { align-self: flex-start; align-items: flex-start; }

.msg-meta {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.56rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--muted);
    opacity: 0.6;
}

.msg-bubble {
    padding: 10px 14px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.82rem;
    line-height: 1.65;
    position: relative;
}

/* user bubble */
.msg.user .msg-bubble {
    background: var(--ink);
    color: var(--bg);
    border: 2px solid var(--ink);
    box-shadow: 2px 2px 0 var(--blue);
}

/* bot bubble: white with blue accent left-bar */
.msg.bot .msg-bubble {
    background: var(--bg);
    color: var(--ink);
    border: 1.5px solid var(--rule);
    border-left: 3px solid var(--blue);
    box-shadow: 2px 2px 0 var(--rule);
}

.msg.bot .msg-bubble strong { color: var(--blue); font-weight: 700; }
.msg.bot .msg-bubble em     { color: var(--ink);  font-style: italic; }

/* ── TYPING INDICATOR ── */
#typing-indicator .msg-bubble { padding: 12px 16px; min-width: 56px; }

.typing-dots { display: flex; gap: 5px; align-items: center; }

.typing-dots span {
    width: 7px;
    height: 7px;
    background: var(--blue);
    border-radius: 50%;
    animation: bounce 1.2s infinite ease-in-out;
}

.typing-dots span:nth-child(2) { animation-delay: 0.2s; }
.typing-dots span:nth-child(3) { animation-delay: 0.4s; }

@keyframes bounce {
    0%, 80%, 100% { transform: translateY(0);   opacity: 0.35; }
    40%           { transform: translateY(-6px); opacity: 1;    }
}

/* ── SUGGESTIONS STRIP ── */
.chat-suggestions {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
    padding: 12px 20px;
    border-top: 1px solid var(--rule);
    border-bottom: 2px solid var(--ink);
    background: var(--bg);
    flex-shrink: 0;
}

.suggestion-chip {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.6rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    padding: 6px 12px;
    border: 1.5px solid var(--ink);
    background: var(--bg);
    color: var(--ink);
    cursor: pointer;
    transition: background 0.2s, color 0.2s;
    white-space: nowrap;
}

.suggestion-chip:hover {
    background: var(--ink);
    color: var(--bg);
}

.suggestion-chip.blue,
.suggestion-chip.green {
    border-color: var(--blue);
    color: var(--blue);
}

.suggestion-chip.blue:hover,
.suggestion-chip.green:hover {
    background: var(--blue);
    color: var(--bg);
}

/* ── INPUT ROW ── */
.chat-input-row {
    display: flex;
    align-items: stretch;
    border-top: 2px solid var(--ink);
    flex-shrink: 0;
    background: var(--bg);
}

.chat-input-wrap {
    flex: 1;
    display: flex;
    align-items: center;
    padding: 0 4px 0 16px;
    gap: 6px;
}

#chat-input {
    flex: 1;
    border: none;
    outline: none;
    resize: none;
    background: transparent;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.82rem;
    color: var(--ink);
    padding: 14px 0;
    line-height: 1.5;
    max-height: 96px;
    overflow-y: auto;
}

#chat-input::placeholder { color: var(--muted); opacity: 0.5; }

.char-counter {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.58rem;
    font-weight: 600;
    color: var(--muted);
    opacity: 0.4;
    letter-spacing: 0.05em;
    white-space: nowrap;
    align-self: flex-end;
    padding-bottom: 15px;
    flex-shrink: 0;
}

.char-counter.near-limit { color: #e05c2a; opacity: 1; }

/* ── SEND BUTTON ── */
#chat-send {
    width: 56px;
    background: var(--ink);
    color: var(--bg);
    border: none;
    border-left: 2px solid var(--ink);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: background 0.2s, color 0.2s;
}

#chat-send:hover:not(:disabled) {
    background: var(--blue);
    color: var(--bg);
}

#chat-send:disabled { background: #aaa; cursor: default; }

#chat-send .send-icon,
#chat-send .send-spinner { transition: opacity 0.15s; }

#chat-send .send-spinner          { display: none; }
#chat-send.loading .send-icon     { display: none; }
#chat-send.loading .send-spinner  { display: block; }

@keyframes spin { to { transform: rotate(360deg); } }

.send-spinner {
    width: 18px;
    height: 18px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
}

/* ── FOOTER BRAND ── */
.chat-footer-brand {
    padding: 7px 16px;
    border-top: 1px solid var(--rule);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    background: var(--bg);
    flex-shrink: 0;
}

.chat-footer-brand span {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.56rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--muted);
    opacity: 0.4;
}

.chat-footer-brand .pp-logo { opacity: 0.45; font-weight: 700; color: var(--ink); }
.chat-footer-brand .pp-logo em { font-style: normal; color: var(--blue); }

/* ── CLEAR CONFIRM BAR ── */
.chat-clear-bar {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    background: var(--ink);
    color: var(--bg);
    padding: 12px 20px;
    display: none;
    align-items: center;
    justify-content: space-between;
    z-index: 10;
    border-top: 2px solid var(--blue);
}

.chat-clear-bar.visible { display: flex; }

.chat-clear-bar span {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.66rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
}

.chat-clear-bar-actions { display: flex; gap: 8px; }

.clear-confirm-btn,
.clear-cancel-btn {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.6rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    padding: 6px 12px;
    border: 1.5px solid;
    cursor: pointer;
    transition: background 0.15s, color 0.15s;
}

.clear-confirm-btn {
    background: var(--blue);
    color: #fff;
    border-color: var(--blue);
}

.clear-confirm-btn:hover { background: #0947b3; }

.clear-cancel-btn {
    background: transparent;
    color: rgba(255, 255, 255, 0.6);
    border-color: rgba(255, 255, 255, 0.2);
}

.clear-cancel-btn:hover { color: #fff; border-color: #fff; }

/* ── Q-BUBBLES PANEL ── */
.qbubbles-bar {
    background: var(--bg);
    border-bottom: 2px solid var(--ink);
    padding: 10px 16px 14px;
    flex-shrink: 0;
    animation: qbSlideDown 0.2s var(--cb) both;
}

@keyframes qbSlideDown {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: translateY(0);    }
}

.qbubbles-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
}

.qbubbles-title {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.58rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--blue);
    display: flex;
    align-items: center;
    gap: 6px;
}

.qbubbles-close {
    background: none;
    border: 1px solid var(--rule);
    cursor: pointer;
    color: var(--muted);
    width: 22px; height: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    line-height: 1;
    transition: background 0.15s, color 0.15s, border-color 0.15s;
}

.qbubbles-close:hover {
    background: var(--ink);
    color: var(--bg);
    border-color: var(--ink);
}

.qbubbles-grid { display: flex; flex-wrap: wrap; gap: 6px; }

.qbubble {
    width: 32px;
    height: 32px;
    border: 1.5px solid var(--ink);
    background: var(--bg);
    color: var(--ink);
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.63rem;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.15s, color 0.15s, box-shadow 0.15s, transform 0.1s;
}

.qbubble:hover {
    background: var(--blue);
    border-color: var(--blue);
    color: var(--bg);
    box-shadow: 2px 2px 0 var(--ink);
    transform: translate(-1px, -1px);
}

.qbubble:active {
    transform: translate(1px, 1px);
    box-shadow: none;
}

/* ── MICROPHONE ── */
#chat-mic {
    width: 44px;
    background: transparent;
    color: var(--muted);
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: color 0.2s, background 0.2s;
}

#chat-mic:hover { color: var(--blue); background: rgba(11, 87, 208, 0.06); }
#chat-mic svg   { transition: transform 0.2s var(--cb); }

#chat-mic.mic-active {
    color: #e05c2a;
    animation: pulse-mic 1.5s infinite;
}

#chat-mic.mic-active svg { transform: scale(1.15); }

@keyframes pulse-mic {
    0%   { background: transparent; }
    50%  { background: rgba(224, 92, 42, 0.1); }
    100% { background: transparent; }
}

/* ── POPUP NUDGE ── */
#prepbot-popup {
    position: fixed;
    bottom: calc(72px + 1.4rem);
    right: 32px;
    max-width: 230px;
    background: var(--ink);
    color: var(--bg);
    border: 2px solid var(--ink);
    padding: 10px 32px 10px 14px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.72rem;
    line-height: 1.5;
    box-shadow: 3px 3px 0 var(--blue);
    cursor: pointer;
    z-index: 9997;
    opacity: 0;
    transform: translateY(8px) scale(0.96);
    pointer-events: none;
    transition: opacity 0.25s ease, transform 0.25s ease;
    user-select: none;
}

#prepbot-popup::after {
    content: '';
    position: absolute;
    bottom: -10px;
    right: 20px;
    border-width: 10px 7px 0 7px;
    border-style: solid;
    border-color: var(--ink) transparent transparent transparent;
}

#prepbot-popup.visible {
    opacity: 1;
    transform: translateY(0) scale(1);
    pointer-events: auto;
}

#prepbot-popup p {
    margin: 0;
    padding: 0;
}

.prepbot-popup-close {
    position: absolute;
    top: 5px;
    right: 7px;
    background: none;
    border: none;
    color: rgba(255,255,255,0.45);
    font-size: 1rem;
    line-height: 1;
    cursor: pointer;
    padding: 0;
    transition: color 0.15s;
}

.prepbot-popup-close:hover { color: #fff; }

/* ── MOBILE ── */
@media (max-width: 480px) {
    #chat-window {
        width: calc(100vw - 16px);
        right: 8px;
        bottom: 86px;
        height: 90vh;
        max-height: 700px;
    }

    #chat-fab-wrap { right: 16px; bottom: 20px; }
    #chat-fab      { padding: 10px 16px 10px 12px; }

    .chat-tabs .chat-tab { padding: 8px 12px; }

    #prepbot-popup { right: 16px; max-width: calc(100vw - 80px); }
}
        `;
        document.head.appendChild(style);
    })();

    /* ── CONFIG ── */
    const p1 = "gsk_9sz5p";
    const p2 = "0Vrwv8chiknSBrJW";
    const p3 = "Gdyb3FYnQIifcPYSc9";
    const p4 = "Dhi1tMvB8VmAh";
    
    const GROQ_KEY = p1 + p2 + p3 + p4;
    
    const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
    const BOT_NAME = 'PrepBot';
    const YEAR = '2026';
    
    const isGitHubPages = location.hostname.includes("github.io");
    
    const BASE = isGitHubPages ?
        "/" + location.pathname.split('/')[1] // repo name
        :
        ""; // local dev
    
    const SITE_MAP = {
        "Home": `${BASE}/index.html`,
        "Cambridge": `${BASE}/Cambridge/index.html`,
        "WAEC": `${BASE}/WAEC/index.html`,
        "Scholastic": `${BASE}/Scholarstic/index.html`,
        "Scholastic Upper Primary": `${BASE}/Scholarstic/Upper-Primary/index.html`,
    };

    /* ── INJECT HTML ── */
    const mount = document.getElementById('prepbot');
    if (!mount) return;
    
    mount.innerHTML = `
        <div id="chat-fab-wrap">
            <button id="chat-fab" aria-label="Open ${BOT_NAME} Study Assistant" aria-expanded="false">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                <span class="fab-dot"></span>
            </button>
            <button id="chat-fab-dismiss" aria-label="Hide PrepBot button" title="Hide">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
            </button>
        </div>

        <div id="prepbot-popup" role="status" aria-live="polite">
            <button class="prepbot-popup-close" id="prepbot-popup-close" aria-label="Dismiss tip">×</button>
            <p id="prepbot-popup-text"></p>
        </div>

        <button id="chat-fab-restore" aria-label="Show PrepBot button" title="Show PrepBot">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            <span>AI</span>
        </button>

        <div id="chat-window" role="dialog" aria-label="${BOT_NAME} Study Assistant" aria-modal="true">
            <div class="chat-header">
                <div class="chat-header-left">
                    <div class="chat-avatar">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="10"/>
                            <polyline points="12 6 12 12 16 14"/>
                        </svg>
                    </div>
                    <div class="chat-header-info">
                        <h4>${BOT_NAME}</h4>
                        <div class="chat-status">
                            <span class="chat-status-dot"></span>
                            <span>AI Study Assistant &middot; Online</span>
                        </div>
                    </div>
                </div>
                <div class="chat-header-actions">
                    <button class="chat-icon-btn" id="chat-clear-btn" title="Clear chat" aria-label="Clear conversation">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6l-1 14H6L5 6"/>
                            <path d="M10 11v6"/><path d="M14 11v6"/>
                            <path d="M9 6V4h6v2"/>
                        </svg>
                    </button>
                    <button class="chat-icon-btn" id="chat-close" title="Close" aria-label="Close ${BOT_NAME}">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </button>
                </div>
            </div>

            <div class="chat-tabs" id="chat-tabs" role="tablist">
                <button class="chat-tab active" data-subject="General"     role="tab" aria-selected="true">All</button>
                <button class="chat-tab"         data-subject="Mathematics" role="tab">Maths</button>
                <button class="chat-tab"         data-subject="English"     role="tab">English</button>
                <button class="chat-tab"         data-subject="Science"     role="tab">Science</button>
                <button class="chat-tab"         data-subject="Exam Tips"   role="tab">Tips</button>
            </div>

            <div class="qbubbles-bar" id="qbubbles-bar" style="display:none">
                <div class="qbubbles-header">
                    <span class="qbubbles-title">
                        Get help on a question
                    </span>
                    <button class="qbubbles-close" id="qbubbles-close" title="Close">×</button>
                </div>
                <div class="qbubbles-grid" id="qbubbles-grid"></div>
            </div>

            <div class="chat-messages" id="chat-messages" aria-live="polite" aria-relevant="additions">
                <div class="chat-intro-card">
                    <div class="intro-label">${BOT_NAME} &middot; ${YEAR}</div>
                    <p>Hi! I'm your <strong>AI study assistant</strong> for Prep Portal. Ask me anything — Maths, English, Science, Social Studies, or exam strategy. I'll explain it clearly.</p>
                </div>
            </div>

            <div class="chat-suggestions" id="chat-suggestions"></div>

            <div class="chat-input-row">
                <div class="chat-input-wrap">
                    <textarea id="chat-input" rows="1" placeholder="Ask a study question…" maxlength="500" aria-label="Type your question"></textarea>
                    <span class="char-counter" id="char-counter">500</span>
                </div>
                <button id="chat-mic" aria-label="Voice input" title="Speak your question">
                    <svg class="mic-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="9" y="2" width="6" height="12" rx="3"/>
                        <path d="M5 10a7 7 0 0 0 14 0"/>
                        <line x1="12" y1="19" x2="12" y2="22"/>
                        <line x1="9" y1="22" x2="15" y2="22"/>
                    </svg>
                    <svg class="mic-stop-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none" style="display:none">
                        <rect x="5" y="5" width="14" height="14" rx="2"/>
                    </svg>
                </button>
                <button id="chat-send" aria-label="Send message">
                    <svg class="send-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13"/>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                    </svg>
                    <div class="send-spinner"></div>
                </button>
            </div>

            <div class="chat-footer-brand">
                <span>Powered by AI &middot;</span>
                <span class="pp-logo">Prep<em>Portal</em></span>
            </div>

            <div class="chat-clear-bar" id="chat-clear-bar">
                <span>Clear conversation?</span>
                <div class="chat-clear-bar-actions">
                    <button class="clear-cancel-btn"  id="clear-cancel">Cancel</button>
                    <button class="clear-confirm-btn" id="clear-confirm">Clear</button>
                </div>
            </div>
        </div>
    `;
    
    /* ── ELEMENT REFS ── */
    const fab = document.getElementById('chat-fab');
    const fabWrap = document.getElementById('chat-fab-wrap');
    const fabDismiss = document.getElementById('chat-fab-dismiss');
    const fabRestore = document.getElementById('chat-fab-restore');
    const win = document.getElementById('chat-window');
    const closeBtn = document.getElementById('chat-close');
    const messages = document.getElementById('chat-messages');
    const input = document.getElementById('chat-input');
    const sendBtn = document.getElementById('chat-send');
    const charCounter = document.getElementById('char-counter');
    const micBtn = document.getElementById('chat-mic');
    const clearBtn = document.getElementById('chat-clear-btn');
    const clearBar = document.getElementById('chat-clear-bar');
    const clearConfirm = document.getElementById('clear-confirm');
    const clearCancel = document.getElementById('clear-cancel');
    const suggBox = document.getElementById('chat-suggestions');
    const tabs = document.querySelectorAll('.chat-tab');
    const qbubblesBar = document.getElementById('qbubbles-bar');
    const qbubblesGrid = document.getElementById('qbubbles-grid');
    const qbubblesClose = document.getElementById('qbubbles-close');
    
    /* ── STATE ── */
    let isOpen = false;
    let isBusy = false;
    let history = []; 
    let activeSubject = 'General';
    let isListening = false;
    let recognition = null;
    let pendingNavigation = null;
    let pendingSecretContext = null; 
    let pendingImage = null; // Stores an image URL if the question has one
    
    /* ── SAFE HTML & LATEX PARSER ── */
    function stripHtmlKeepMath(html) {
        if (!html) return '';
        // If it's already plain text/LaTeX, just trim and return it
        if (!/<[a-z][\s\S]*>/i.test(html)) return html.trim();
        
        const temp = document.createElement('div');
        temp.innerHTML = html;
        
        // Remove MathJax 3 containers if it was read from the DOM after rendering
        temp.querySelectorAll('mjx-container, .MathJax').forEach(el => el.remove());
        
        // Preserve MathJax 2 scripts just in case
        temp.querySelectorAll('script[type^="math/tex"]').forEach(script => {
            const isDisplay = script.type.includes('mode=display');
            const tex = script.innerHTML;
            const textNode = document.createTextNode(isDisplay ? `\\[${tex}\\]` : `\\(${tex}\\)`);
            script.parentNode.replaceChild(textNode, script);
        });
        
        return (temp.textContent || temp.innerText || '').trim();
    }
    
    function getQuizData() {
        return window.__prepbotQuizData || null;
    }
    
    function getFallbackQuestionText() {
        if (window.__prepbotQuestion) return stripHtmlKeepMath(window.__prepbotQuestion);
        
        const selectors = ['#question-text', '.question-text', '[data-question]'];
        for (const sel of selectors) {
            const el = document.querySelector(sel);
            if (!el) continue;
            const text = stripHtmlKeepMath(el.innerHTML);
            if (text) return text;
        }
        return null;
    }

    function getFallbackQuestionImage() {
        const el = document.getElementById('question-image');
        if (el && el.getAttribute('src') && !el.classList.contains('hidden')) {
            return el.src;
        }
        return null;
    }
    
    function getQuestionNumber() {
        const el = document.getElementById('q-number-display') || document.getElementById('current-q-text');
        return el ? el.innerText.trim() : null;
    }
    
    /* ── QUESTION ACTIONS ── */
    function buildQuestionBubbles() {
        const data = getQuizData();
        if (!data || !data.length) {
            qbubblesBar.style.display = 'none';
            return;
        }
        qbubblesGrid.innerHTML = '';
        data.forEach((q, i) => {
            const btn = document.createElement('button');
            btn.className = 'qbubble';
            btn.textContent = i + 1;
            btn.title = `Get help on Question ${i + 1}`;
            btn.addEventListener('click', () => askAboutQuestion(i, data));
            qbubblesGrid.appendChild(btn);
        });
        qbubblesBar.style.display = '';
    }
    
    function askAboutQuestion(index, data) {
        const d = data || getQuizData();
        if (!d) return;
        const q = d[index];
        if (!q) return;
        
        if (window.__prepbotJumpToQuestion) window.__prepbotJumpToQuestion(index);
        
        const rawQ = stripHtmlKeepMath(q.question);
        const optLetters = ['A', 'B', 'C', 'D', 'E'];
        
        const optsText = (q.options || []).map((o, i) =>
            `${optLetters[i]}. ${stripHtmlKeepMath(o)}`
        ).join('\n');
        
        const correctLetter = (q.correctIndex !== undefined && q.correctIndex !== null) ? optLetters[q.correctIndex] : "Unknown";
        
        let officialExplanation = "";
        if (Array.isArray(q.explanation)) {
            officialExplanation = q.explanation.map(step => stripHtmlKeepMath(step)).join('\n');
        } else if (q.explanation) {
            officialExplanation = stripHtmlKeepMath(q.explanation);
        }

        // Check if there is an image and stage it for rendering
        pendingImage = q.image ? q.image : null;

        input.value = `Question ${index + 1}: ${rawQ}\n\nOptions:\n${optsText}\n\nPlease explain how to solve this step by step.`;
        
        pendingSecretContext = `\n\n[SYSTEM NOTE: The official correct option for this question is **${correctLetter}**.\nOfficial step-by-step logic:\n${officialExplanation || '(No official solution provided. Solve it accurately yourself.)'}\n\nYOUR TASK: Use this official answer/logic as your foundation. Teach the concept to the student in a clear, friendly, and engaging way. Do not just blindly copy-paste the text; explain the steps smoothly and confirm that the correct answer is ${correctLetter}.]`;
        
        qbubblesBar.style.display = 'none';
        suggBox.style.display = 'none';
        toggleChat(true);
        setTimeout(sendMessage, 50);
    }
    
    /* ── OPEN / CLOSE ── */
    function toggleChat(forceOpen) {
        isOpen = forceOpen !== undefined ? forceOpen : !isOpen;
        win.classList.toggle('open', isOpen);
        fab.setAttribute('aria-expanded', isOpen);
        if (isOpen) {
            updateSuggestions(activeSubject);
            suggBox.style.display = '';
            setTimeout(() => input.focus(), 280);
        }
    }
    
    fab.addEventListener('click', () => toggleChat());
    closeBtn.addEventListener('click', () => toggleChat(false));
    fabDismiss.addEventListener('click', e => {
        e.stopPropagation();
        toggleChat(false);
        fabWrap.classList.add('fab-hidden');
        fabRestore.classList.add('fab-restore-visible');
    });
    
    fabRestore.addEventListener('click', () => {
        fabWrap.classList.remove('fab-hidden');
        fabRestore.classList.remove('fab-restore-visible');
    });
    
    document.addEventListener('mousedown', e => {
        if (isOpen && !win.contains(e.target) && e.target !== fab && !fab.contains(e.target)) toggleChat(false);
    });
    
    if (qbubblesClose) {
        qbubblesClose.addEventListener('click', () => {
            qbubblesBar.style.display = 'none';
            suggBox.style.display = '';
        });
    }
    
    /* ── CHIPS & SUGGESTIONS ── */
    const subjectSuggestions = {
        'General': ['What is LCM?', 'BODMAS rule', 'Exam tips', 'Take me to Dashboard'],
        'Mathematics': ['HCF and LCM', 'Solve: 3x + 5 = 20', 'Convert ¾ to %', 'BODMAS example', 'Roman numerals'],
        'English': ['Parts of speech', 'Simile vs metaphor', 'What is a clause?', 'Punctuation rules', 'Essay structure'],
        'Science': ['Photosynthesis', 'Food chain example', 'States of matter', "Newton's laws", 'Digestive system'],
        'Exam Tips': ['How to manage time', 'Beat exam anxiety', 'How to revise', 'Mark scheme tips', 'Past paper strategy'],
    };
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
            });
            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');
            activeSubject = tab.dataset.subject;
            updateSuggestions(activeSubject);
        });
    });
    
    function updateSuggestions(subject) {
        const chips = subjectSuggestions[subject] || subjectSuggestions['General'];
        suggBox.innerHTML = '';
        
        const hasQuiz = (getQuizData() && typeof window.__prepbotCurrentQuestionIndex !== 'undefined');
        const fallbackText = getFallbackQuestionText();
        
        if (hasQuiz || fallbackText) {
            const tq = document.createElement('button');
            tq.id = 'chip-this-q';
            tq.className = 'suggestion-chip blue';
            tq.textContent = 'This question';
            tq.addEventListener('click', () => {
                if (hasQuiz) {
                    askAboutQuestion(window.__prepbotCurrentQuestionIndex, getQuizData());
                } else {
                    const qNum = getQuestionNumber();
                    const prefix = qNum ? `Question ${qNum}: ` : '';
                    
                    // Attach image if visible
                    pendingImage = getFallbackQuestionImage();
                    
                    input.value = `${prefix}${fallbackText}\n\nPlease explain how to solve this step by step.`;
                    suggBox.style.display = 'none';
                    sendMessage();
                }
            });
            suggBox.appendChild(tq);
        }
        
        if (hasQuiz) {
            const pq = document.createElement('button');
            pq.id = 'chip-pick-q';
            pq.className = 'suggestion-chip green';
            pq.textContent = 'Pick a question';
            pq.addEventListener('click', () => {
                buildQuestionBubbles();
                suggBox.style.display = 'none';
            });
            suggBox.appendChild(pq);
        }
        
        chips.forEach((text, i) => {
            const btn = document.createElement('button');
            btn.className = 'suggestion-chip' + ((i === 0 && !hasQuiz && !fallbackText) ? ' blue' : '');
            btn.textContent = text;
            btn.addEventListener('click', () => {
                input.value = text;
                suggBox.style.display = 'none';
                sendMessage();
            });
            suggBox.appendChild(btn);
        });
    }
    
    /* ── NUMBER SHORTCUT PARSER ── */
    function parseQuestionNumber(text) {
        const t = text.trim().toLowerCase();
        const exactMatch = t.match(/^(?:q(?:uestion)?\.?\s*|#)?(\d+)\s*[?!.]*$/i);
        if (exactMatch) return parseInt(exactMatch[1], 10);
        
        const intentPattern = /(?:help|explain|solve|show|go to|what about|how to|read|answer|jump to).*?(?:q(?:uestion)?\.?\s*|#)(\d+)\s*[?!.]*$/i;
        const intentMatch = t.match(intentPattern);
        if (intentMatch) return parseInt(intentMatch[1], 10);
        
        return null;
    }
    
    /* ── INPUT HELPERS ── */
    input.addEventListener('input', () => {
        input.style.height = 'auto';
        input.style.height = Math.min(input.scrollHeight, 96) + 'px';
        const remaining = 500 - input.value.length;
        charCounter.textContent = remaining;
        charCounter.classList.toggle('near-limit', remaining < 80);
    });
    
    input.addEventListener('keydown', e => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    sendBtn.addEventListener('click', sendMessage);
    
    /* ── CHAT LOGIC ── */
    clearBtn.addEventListener('click', () => clearBar.classList.add('visible'));
    clearCancel.addEventListener('click', () => clearBar.classList.remove('visible'));
    clearConfirm.addEventListener('click', () => {
        history = [];
        messages.innerHTML = `
            <div class="chat-intro-card">
                <div class="intro-label">${BOT_NAME} &middot; ${YEAR}</div>
                <p>Conversation cleared. Ask me anything — <strong>Maths, English, Science</strong>, or exam strategy.</p>
            </div>`;
        suggBox.style.display = '';
        clearBar.classList.remove('visible');
    });
    
    function appendMessage(role, text, imageUrl = null) {
        const wrap = document.createElement('div');
        wrap.className = `msg ${role}`;
        wrap.innerHTML = `<div class="msg-meta">${role === 'user' ? 'You' : BOT_NAME}</div>`;
        
        const bubble = document.createElement('div');
        bubble.className = 'msg-bubble';
        
        // Include the image in the bubble if provided
        let imgHtml = '';
        if (imageUrl) {
            imgHtml = `<img src="${imageUrl}" alt="Question Image" style="max-width: 100%; max-height: 160px; border-radius: 6px; margin-bottom: 8px; border: 1px solid var(--rule); display: block; object-fit: contain; background: #fff;">`;
        }
        
        bubble.innerHTML = imgHtml + formatText(text);
        wrap.appendChild(bubble);
        
        messages.appendChild(wrap);
        messages.scrollTop = messages.scrollHeight;
        renderMathWhenReady(bubble);
        return bubble;
    }
    
    function showTyping() {
        const wrap = document.createElement('div');
        wrap.className = 'msg bot';
        wrap.id = 'typing-indicator';
        wrap.innerHTML = `<div class="msg-meta">${BOT_NAME}</div><div class="msg-bubble"><div class="typing-dots"><span></span><span></span><span></span></div></div>`;
        messages.appendChild(wrap);
        messages.scrollTop = messages.scrollHeight;
    }
    
    function hideTyping() {
        const el = document.getElementById('typing-indicator');
        if (el) el.remove();
    }
    
    function formatText(text) {
        const mathChunks = [];
        const ph = i => `\x00M${i}\x00`;
        
        let safe = text
            .replace(/\\\[[\s\S]*?\\\]/g, m => { mathChunks.push(m); return ph(mathChunks.length - 1); })
            .replace(/\\\([\s\S]*?\\\)/g, m => { mathChunks.push(m); return ph(mathChunks.length - 1); })
            .replace(/\$\$[\s\S]*?\$\$/g, m => { mathChunks.push(m.replace(/^\$\$/, '\\[').replace(/\$\$$/, '\\]')); return ph(mathChunks.length - 1); })
            .replace(/\$[^\$\n]+?\$/g, m => { mathChunks.push(m.replace(/^\$/, '\\(').replace(/\$$/, '\\)')); return ph(mathChunks.length - 1); })
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/\[ICON:[^\]]+\]/g, '')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code style="background:#f0f0f0;padding:1px 5px;font-family:monospace;font-size:0.9em">$1</code>')
            .replace(/\n/g, '<br>')
            .replace(/\x00M(\d+)\x00/g, (_, i) => mathChunks[+i]);
        
        return safe;
    }
    
    function renderMath(el) {
        if (!window.MathJax) return;
        if (MathJax.typesetPromise) {
            if (MathJax.typesetClear) MathJax.typesetClear([el]);
            MathJax.typesetPromise([el]).then(() => {
                const msgs = el.closest('.chat-messages');
                if (msgs) msgs.scrollTop = msgs.scrollHeight;
            });
        } else if (MathJax.Hub) {
            MathJax.Hub.Queue(['Typeset', MathJax.Hub, el]);
        }
    }
    
    function renderMathWhenReady(el) {
        if (window.MathJax && (MathJax.typesetPromise || MathJax.Hub)) {
            renderMath(el);
        } else {
            let attempts = 0;
            const poll = setInterval(() => {
                attempts++;
                if (window.MathJax && (MathJax.typesetPromise || MathJax.Hub)) {
                    clearInterval(poll);
                    renderMath(el);
                } else if (attempts > 40) clearInterval(poll);
            }, 100);
        }
    }
    
    function getSystemPrompt(subject) {
        const siteMapStr = Object.entries(SITE_MAP)
            .map(([name, url]) => `- ${name}: ${url}`)
            .join('\n');
        
        const base = `You are ${BOT_NAME}, a friendly AI study assistant on Prep Portal — an exam prep platform for Nigerian and international students.
Rules:
- Be clear, concise, and encouraging.
- Use **bold** for key terms and final answers.
- Use numbered steps for multi-step solutions.
- Keep responses short enough to read in a chat window.

CRITICAL MATH FORMATTING RULES:
- You MUST use LaTeX for absolutely ALL mathematical content, including single variables, single numbers, fractions, equations, and expressions.
- Inline math MUST be wrapped in \\(...\\). Example: write "Let \\(x = 5\\)" instead of "Let x = 5". Write "The sum of \\(3\\) and \\(4\\) is \\(7\\)" instead of "The sum of 3 and 4 is 7".
- Display/block math MUST be wrapped in \\[...\\] on its own line.
- Do NOT use plain text for math. Only use plain text for normal descriptive language (words).

NAVIGATION INSTRUCTIONS:
You have the ability to navigate the user to different pages on the website. 
Here are the available pages:
${siteMapStr}

NAVIGATION RULES — follow these exactly:
1. Only navigate when the user uses a clear navigation keyword such as: "go to", "goto", "open", "take me to", "navigate".
2. You MUST confirm with the user BEFORE navigating. Acknowledge where they want to go, then include the [NAVIGATE: url] command.
3. If the user uses an ambiguous word (e.g. "check", "view", "show", "access"), ask: "Did you want me to take you to a page, or were you asking something else?"
4. Do NOT invent URLs. Only use the exact URLs listed above.

Example of correct behaviour:
User: "Take me to WAEC"
You: "Sure! I'll take you to the WAEC section right away. [NAVIGATE: ./WAEC/index.html]"`;
        
        return subject !== 'General' ? base + `\n\nThe student has selected the **${subject}** tab, so focus your responses on ${subject} topics.` : base;
    }
    
    /* ── SEND MESSAGE (GROQ API) ── */
    async function sendMessage() {
        const text = input.value.trim();
        if (!text || isBusy) return;
        
        // Navigation confirmation logic
        if (pendingNavigation) {
            const answer = text.toLowerCase().replace(/[^a-z]/g, '');
            if (['yes', 'y', 'yeah', 'yep', 'sure', 'ok', 'okay', 'yup', 'go', 'proceed'].includes(answer)) {
                appendMessage('user', text);
                input.value = '';
                input.style.height = 'auto';
                charCounter.textContent = '500';
                const { url, pageName } = pendingNavigation;
                pendingNavigation = null;
                appendMessage('bot', `Navigating you to **${pageName}** now…`);
                setTimeout(() => { window.location.href = url; }, 1200);
                return;
            } else if (['no', 'n', 'nope', 'nah', 'cancel', 'stop', 'nevermind', 'never mind', 'dont'].includes(answer)) {
                appendMessage('user', text);
                input.value = '';
                input.style.height = 'auto';
                charCounter.textContent = '500';
                pendingNavigation = null;
                appendMessage('bot', "No problem! I'll stay right here. What else can I help you with?");
                return;
            }
            pendingNavigation = null;
        }
        
        const NAV_KEYWORDS = ['goto', 'go to', 'moveto', 'move to', 'search', 'open', 'take me to', 'navigate', 'navigate to', 'show me', 'visit', 'find', 'bring me to', 'head to', 'direct me to', 'launch', 'load', 'switch to', 'jump to page', 'take me', 'go', 'redirect', 'redirect me', 'send me to'];
        const NAV_SYNONYMS = {'proceed': 'go to', 'access': 'open', 'pull up': 'open', 'pull-up': 'open', 'bring up': 'open', 'route me': 'navigate', 'route': 'navigate', 'transport': 'take me to', 'forward': 'navigate', 'look up': 'search', 'lookup': 'search', 'check out': 'visit', 'check': 'visit', 'view': 'open', 'display': 'open', 'show': 'show me', 'get me to': 'take me to', 'get me': 'take me to', 'send me': 'send me to', 'lead me': 'navigate', 'bring': 'bring me to', 'enter': 'open', 'pass me to': 'navigate'};
        
        const lowerText = text.toLowerCase();
        const detectedKeyword = NAV_KEYWORDS.find(kw => lowerText.includes(kw));
        let synonymKeyword = null;
        if (!detectedKeyword) {
            for (const [syn, mapped] of Object.entries(NAV_SYNONYMS)) {
                if (lowerText.includes(syn)) {
                    synonymKeyword = { word: syn, maps_to: mapped };
                    break;
                }
            }
        }
        
        if (!detectedKeyword && synonymKeyword) {
            input.value = '';
            input.style.height = 'auto';
            charCounter.textContent = '500';
            appendMessage('user', text);
            appendMessage('bot', `I noticed the word **"${synonymKeyword.word}"** in your message. Did you want me to **navigate you** to a page on the site, or were you asking something else?\n\nReply **"yes"** if you meant navigation, or just rephrase your question!`);
            history.push({ role: 'user', content: text });
            history.push({ role: 'assistant', content: `Clarification asked about synonym "${synonymKeyword.word}".` });
            return;
        }
        
        const qNum = parseQuestionNumber(text);
        if (qNum !== null && qNum > 0) {
            const data = getQuizData();
            if (data && qNum <= data.length) {
                input.value = '';
                input.style.height = 'auto';
                charCounter.textContent = '500';
                askAboutQuestion(qNum - 1, data);
                return;
            }
        }
        
        isBusy = true;
        sendBtn.disabled = true;
        sendBtn.classList.add('loading');
        suggBox.style.display = 'none';
        
        input.value = '';
        input.style.height = 'auto';
        charCounter.textContent = '500';
        charCounter.classList.remove('near-limit');
        
        // Grab the image before clearing it
        const attachedImage = pendingImage;
        pendingImage = null;

        // Render clean text + image to the UI
        appendMessage('user', text, attachedImage);
        
        // Build the prompt for the AI
        let textForAI = text;
        if (attachedImage) {
            textForAI += "\n\n[SYSTEM NOTE: This question contains an image. Since you are a text model, rely on the provided question text and the official explanation below to understand the visual context.]";
        }
        if (pendingSecretContext) {
            textForAI += pendingSecretContext;
            pendingSecretContext = null; // reset it
        }

        history.push({ role: 'user', content: textForAI });
        showTyping();
        
        if (history.length > 6) {
            history = history.slice(-6);
        }
        
        const payloadMessages = [
            { role: "system", content: getSystemPrompt(activeSubject) },
            ...history
        ];
        
        try {
            const res = await fetch(GROQ_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${GROQ_KEY}`
                },
                body: JSON.stringify({
                    model: "llama-3.1-8b-instant",
                    messages: payloadMessages,
                    temperature: 0.7,
                    max_tokens: 800
                })
            });
            
            hideTyping();
            
            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                const errMsg = errData?.error?.message || `HTTP ${res.status}`;
                
                if (res.status === 429) {
                    appendMessage('bot', "**Whoa, slow down!** I'm getting too many questions at once. Please wait 15 seconds and try again.");
                    history.pop();
                } else {
                    appendMessage('bot', `**API error:** ${errMsg}`);
                    history.pop();
                }
            } else {
                const data = await res.json();
                let reply = data.choices?.[0]?.message?.content || "Sorry, I couldn't get a response. Please try again.";
                
                const navMatch = reply.match(/\[NAVIGATE:\s*([^\]]+)\]/i);
                
                if (navMatch) {
                    const urlToNavigate = navMatch[1].trim();
                    const pageName = Object.keys(SITE_MAP).find(k => SITE_MAP[k] === urlToNavigate) || urlToNavigate;
                    reply = reply.replace(navMatch[0], '').trim();
                    
                    pendingNavigation = { url: urlToNavigate, pageName };
                    
                    const confirmMsg = (reply ? reply + '\n\n' : '') +
                        `I'd like to take you to **${pageName}**. Shall I go ahead?\n\nReply **Yes** to navigate or **No** to stay here.`;
                    
                    history.push({ role: 'assistant', content: confirmMsg });
                    appendMessage('bot', confirmMsg);
                    
                } else {
                    history.push({ role: 'assistant', content: reply });
                    appendMessage('bot', reply);
                }
            }
        }
        catch (err) {
            hideTyping();
            appendMessage('bot', `**Connection Error:** Please check your internet and try again.`);
            history.pop();
        }
        
        isBusy = false;
        sendBtn.disabled = false;
        sendBtn.classList.remove('loading');
        input.focus();
    }
    
    /* ── VOICE INPUT (Web Speech API) ── */
    (function initVoice() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (!SpeechRecognition) {
            if (micBtn) micBtn.style.display = 'none';
            return;
        }
        
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-GB';
        
        const micIcon = micBtn.querySelector('.mic-icon');
        const micStopIcon = micBtn.querySelector('.mic-stop-icon');
        
        function setListening(on) {
            isListening = on;
            micBtn.classList.toggle('mic-active', on);
            micIcon.style.display = on ? 'none' : '';
            micStopIcon.style.display = on ? '' : 'none';
            micBtn.setAttribute('aria-label', on ? 'Stop recording' : 'Voice input');
            input.placeholder = on ? 'Listening… speak now' : 'Ask a study question…';
        }
        
        recognition.addEventListener('result', e => {
            const transcript = Array.from(e.results)
                .map(r => r[0].transcript)
                .join('');
            input.value = transcript;
            
            const remaining = 500 - input.value.length;
            charCounter.textContent = Math.max(remaining, 0);
            charCounter.classList.toggle('near-limit', remaining < 80);
            
            input.style.height = 'auto';
            input.style.height = Math.min(input.scrollHeight, 96) + 'px';
            
            if (e.results[e.results.length - 1].isFinal) {
                setListening(false);
                setTimeout(() => sendMessage(), 300);
            }
        });
        
        recognition.addEventListener('end', () => {
            if (isListening) setListening(false);
        });
        
        recognition.addEventListener('error', e => {
            setListening(false);
            const msgs = {
                'not-allowed': 'Microphone access was denied. Please allow microphone access in your browser settings.',
                'no-speech': 'No speech detected. Please try again.',
                'network': 'Network error during voice recognition. Please check your connection.',
                'aborted': null,
            };
            const msg = msgs[e.error] !== undefined ? msgs[e.error] : `Voice error: ${e.error}`;
            if (msg) appendMessage('bot', msg);
        });
        
        micBtn.addEventListener('click', () => {
            if (isBusy) return;
            
            if (isListening) {
                recognition.stop();
                setListening(false);
            } else {
                try {
                    recognition.start();
                    setListening(true);
                    if (!isOpen) toggleChat(true);
                } catch (err) {
                    recognition.stop();
                    setListening(false);
                }
            }
        });
        
        const origToggle = toggleChat;
        window.__prepbotToggle = origToggle;
    })();

    /* ── CONTEXTUAL POPUP NUDGES ── */
    (function initPopupNudges() {
        const popupEl   = document.getElementById('prepbot-popup');
        const popupText = document.getElementById('prepbot-popup-text');
        const popupClose = document.getElementById('prepbot-popup-close');
        if (!popupEl || !popupText) return;

        // Page-context detection helpers
        function onQuizPage()      { return !!document.getElementById('question-text') || !!window.__prepbotQuestion; }
        function onHomePage()      { return location.pathname === '/' || location.pathname.endsWith('index.html') && !onQuizPage(); }
        function onCambridgePage() { return location.pathname.toLowerCase().includes('cambridge'); }
        function onWAECPage()      { return location.pathname.toLowerCase().includes('waec'); }
        function onScholasticPage(){ return location.pathname.toLowerCase().includes('scholarstic'); }

        // Pool of nudge messages keyed by context
        const NUDGES = {
            quiz: [
                { text: "Stuck on this question? Tap me for a step-by-step explanation! ", fill: "Explain this question step by step." },
                { text: "Not sure about your answer? I can walk you through it! ", fill: "Help me understand how to approach this question." },
                { text: "Want to know the trick behind this? Ask me!", fill: "What's the quickest way to solve this type of question?" },
                { text: "I can explain why the correct answer is correct — just ask! ", fill: "Why is the correct answer right for this question?" },
                { text: "Need a formula refresher? I've got you covered 📐", fill: "Give me a quick formula refresher for this topic." },
            ],
            cambridge: [
                { text: "Cambridge exam coming up? Ask me for revision tips! ", fill: "Give me top revision tips for Cambridge exams." },
                { text: "Want past paper strategies for Cambridge? Let's talk! ", fill: "What's the best past paper strategy for Cambridge?" },
                { text: "I can quiz you on any Cambridge topic — just ask! ", fill: "Quiz me on a Cambridge topic of your choice." },
            ],
            waec: [
                { text: "WAEC prep mode! Ask me anything about syllabus topics ", fill: "What are the key topics I must cover for WAEC?" },
                { text: "Struggling with WAEC Maths? I'll make it click! ➗", fill: "Help me with a common WAEC maths topic." },
                { text: "I can help you with WAEC English comprehension strategies ", fill: "How do I tackle WAEC English comprehension questions?" },
            ],
            scholastic: [
                { text: "Scholastic exam ahead? I can help you prepare! ", fill: "How should I prepare for the Scholastic exam?" },
                { text: "Ask me about Scholastic Maths or Verbal topics! ", fill: "Explain a common Scholastic Verbal Reasoning question type." },
                { text: "Need a quick brain warm-up? Ask me a practice question! ", fill: "Give me a quick practice question for Scholastic prep." },
            ],
            home: [
                { text: "Not sure where to start? I'll point you in the right direction! ️", fill: "Where should I start on Prep Portal?" },
                { text: "Choose an exam section and I'll guide your revision! ", fill: "Which exam section should I focus on first?" },
                { text: "Ask me to navigate to any exam section — WAEC, Cambridge, Scholastic…", fill: "Take me to the Cambridge section." },
                { text: "I can build a quick study plan for you — just ask! ", fill: "Help me make a study plan for my exams." },
            ],
            general: [
                { text: "Got a tricky Maths question? Tap to ask me! ", fill: "Explain BODMAS with an example." },
                { text: "Need help with English grammar? I'm here! ", fill: "What are the parts of speech?" },
                { text: "Exam anxiety? I have tips that actually work ", fill: "How do I manage exam anxiety?" },
                { text: "Ask me anything — Maths, Science, English or exam tips! ", fill: "Give me a quick Science fact I should know for exams." },
                { text: "I can explain any topic in simple steps — try me! ", fill: "Explain photosynthesis simply." },
            ],
        };

        function getPool() {
            if (onQuizPage())      return [...NUDGES.quiz, ...NUDGES.general];
            if (onCambridgePage()) return [...NUDGES.cambridge, ...NUDGES.general];
            if (onWAECPage())      return [...NUDGES.waec, ...NUDGES.general];
            if (onScholasticPage())return [...NUDGES.scholastic, ...NUDGES.general];
            if (onHomePage())      return [...NUDGES.home, ...NUDGES.general];
            return NUDGES.general;
        }

        let lastNudgeIndex = -1;
        let hideTimer = null;
        let scheduleTimer = null;

        function pickNudge() {
            const pool = getPool();
            let idx;
            do { idx = Math.floor(Math.random() * pool.length); } while (idx === lastNudgeIndex && pool.length > 1);
            lastNudgeIndex = idx;
            return pool[idx];
        }

        function showPopup() {
            if (isOpen) { scheduleNext(); return; } // don't nag while chat is open
            if (fabWrap.classList.contains('fab-hidden')) { scheduleNext(); return; }

            const nudge = pickNudge();
            popupText.textContent = nudge.text;
            popupEl.dataset.fill = nudge.fill;
            popupEl.classList.add('visible');

            clearTimeout(hideTimer);
            hideTimer = setTimeout(hidePopup, 7000); // auto-dismiss after 7s
        }

        function hidePopup() {
            popupEl.classList.remove('visible');
            clearTimeout(hideTimer);
        }

        function scheduleNext() {
            clearTimeout(scheduleTimer);
            // Random interval: 20–50 seconds
            const delay = (20 + Math.floor(Math.random() * 31)) * 1000;
            scheduleTimer = setTimeout(showPopup, delay);
        }

        // Click popup body → pre-fill and open chat
        popupEl.addEventListener('click', e => {
            if (e.target === popupClose || popupClose.contains(e.target)) return;
            const fill = popupEl.dataset.fill;
            if (fill) input.value = fill;
            hidePopup();
            toggleChat(true);
            scheduleNext();
        });

        popupClose.addEventListener('click', e => {
            e.stopPropagation();
            hidePopup();
            scheduleNext();
        });

        // Hide popup whenever the chat window is closed via the header X button
        closeBtn.addEventListener('click', hidePopup);

        // First popup: show after 12 seconds
        scheduleTimer = setTimeout(showPopup, 12000);
    })();

})();