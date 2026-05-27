const chatbotcss = `
/* ══════════════════════════════════════════════════════
   PREPBOT — inherits from theme.css; fallbacks ensure it
   works standalone. Rounded-card style matching blog UI.
   ══════════════════════════════════════════════════════ */

/* ── LOCAL ALIASES (read from theme.css :root, with fallbacks) ── */
#prepbot, #chat-fab-wrap, #chat-fab-restore, #chat-window, #prepbot-popup,
#prepbot *, #chat-fab-wrap *, #chat-fab-restore *, #chat-window *, #prepbot-popup * {
    --_bg:       var(--bg,              #ffffff);
    --_ink:      var(--ink,             #0a0a0a);
    --_surface:  var(--surface-secondary, #f7f4ee);
    --_paper:    var(--surface-primary, #fffef8);
    --_accent:   var(--accent-secondary, #0055ff);
    --_danger:   var(--accent-danger,   #ff2200);
    --_success:  var(--accent-success,  #00a550);
    --_warning:  var(--accent-warning,  #e67e00);
    --_primary:  var(--accent-primary,  #ffe500);
    --_muted:    var(--text-secondary,  #555555);
    --_faint:    var(--text-tertiary,   #888888);
    --_border:   var(--border,          2.5px solid #0a0a0a);
    --_border-s: var(--border-subtle,   1px solid rgba(10,10,10,0.12));
    --_r:        var(--radius-sm,       12px);
    --_ease:     var(--ease-in-out,     cubic-bezier(0.16,1,0.3,1));
    --_sh-sm:    var(--shadow-sm,       3px 3px 0 #0a0a0a);
    --_sh-md:    var(--shadow-md,       5px 5px 0 #0a0a0a);
    --_sh-lg:    var(--shadow-lg,       6px 6px 0 #0a0a0a);
    --_sh-xl:    var(--shadow-xl,       9px 9px 0 #0a0a0a);
    --_f-display: var(--font-display,   'Unbounded', sans-serif);
    --_f-mono:    var(--font-mono,      'JetBrains Mono', monospace);
    box-sizing: border-box;
}

/* ══════════════════════════════════════════════════════
   FAB WRAP
   ══════════════════════════════════════════════════════ */
#chat-fab-wrap {
    position: fixed;
    bottom: 28px;
    right: 24px;
    z-index: 10002;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: transform 0.25s var(--_ease), opacity 0.2s ease;
}

#chat-fab-wrap.fab-hidden {
    transform: translateY(14px);
    opacity: 0;
    pointer-events: none;
}

/* ── Dismiss × ── */
#chat-fab-dismiss {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: var(--_ink);
    border: var(--_border);
    color: var(--_bg);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transform: scale(0.7);
    transition: opacity 0.2s ease, transform 0.2s var(--_ease), background 0.15s;
    flex-shrink: 0;
    font-size: 14px;
    font-family: var(--_f-mono);
}

#chat-fab-wrap:hover #chat-fab-dismiss { opacity: 1; transform: scale(1); }
#chat-fab-dismiss:hover { background: var(--_danger); }

/* ── Restore tab ── */
#chat-fab-restore {
    position: fixed;
    bottom: 50%;
    right: -68px;
    transform: translateY(50%);
    z-index: 10001;
    background: var(--_ink);
    color: var(--_bg);
    border: var(--_border);
    border-right: none;
    border-radius: var(--_r) 0 0 var(--_r);
    padding: 12px 10px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    font-family: var(--_f-display);
    font-size: 0.58rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    transition: right 0.3s var(--_ease), background 0.15s;
    box-shadow: -3px 0 0 var(--_accent);
}

#chat-fab-restore.fab-restore-visible { right: 0; }
#chat-fab-restore:hover { background: var(--_accent); box-shadow: -3px 0 0 var(--_ink); }

/* ── FAB button (pill) ── */
#chat-fab {
    z-index: 10002;
    background: var(--_ink);
    border: var(--_border);
    border-radius: 100px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 20px 12px 16px;
    outline: none;
    font-family: var(--_f-display);
    font-weight: 700;
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--_bg);
    transition: background 0.2s ease, transform 0.2s var(--_ease), box-shadow 0.2s ease;
    box-shadow: 4px 4px 0 var(--_accent);
}

#chat-fab:hover {
    background: var(--_accent);
    transform: translate(-2px, -2px);
    box-shadow: 6px 6px 0 var(--_ink);
}

#chat-fab:active {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0 var(--_ink);
}

#chat-fab .fab-dot {
    width: 8px;
    height: 8px;
    background: #4cff91;
    border-radius: 50%;
    flex-shrink: 0;
    animation: pb-pulse 2.4s ease-in-out infinite;
}

@keyframes pb-pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.45; transform: scale(0.65); }
}

#chat-fab .fab-label { display: none; }

/* ══════════════════════════════════════════════════════
   CHAT WINDOW
   ══════════════════════════════════════════════════════ */
#chat-window {
    position: fixed;
    bottom: 88px;
    right: 24px;
    width: 420px;
    height: 600px;
    z-index: 10001;
    background: var(--_bg);
    border: var(--_border);
    border-radius: var(--_r);
    box-shadow: var(--_sh-xl);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    transform: translateY(20px) scale(0.96);
    opacity: 0;
    pointer-events: none;
    transform-origin: bottom right;
    transition: transform 0.3s var(--_ease), opacity 0.25s ease;
}

#chat-window.open {
    transform: translateY(0) scale(1);
    opacity: 1;
    pointer-events: all;
}

/* ══════════════════════════════════════════════════════
   HEADER
   ══════════════════════════════════════════════════════ */
.chat-header {
    background: var(--_ink);
    color: var(--_bg);
    padding: 14px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
    border-bottom: var(--_border);
    border-radius: var(--_r) var(--_r) 0 0;
}

.chat-header-left {
    display: flex;
    align-items: center;
    gap: 12px;
}

.chat-avatar {
    width: 36px;
    height: 36px;
    background: var(--_ink);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    border: var(--_border);
    overflow: hidden;
    padding: 3px;
}

.chat-avatar svg { display: block; stroke: var(--_bg); }

.chat-header-info h4 {
    font-family: var(--_f-display);
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin: 0 0 2px;
    color: var(--_bg);
}

.chat-header-info .chat-status {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 0.6rem;
    font-family: var(--_f-mono);
    color: rgba(255,255,255,0.45);
    text-transform: uppercase;
    letter-spacing: 0.06em;
}

.chat-status-dot {
    width: 6px;
    height: 6px;
    background: #4cff91;
    border-radius: 50%;
    animation: pb-pulse 2.4s ease-in-out infinite;
}

.chat-header-actions {
    display: flex;
    align-items: center;
    gap: 4px;
}

.chat-icon-btn {
    width: 30px;
    height: 30px;
    background: none;
    border: 1px solid rgba(255,255,255,0.18);
    border-radius: 8px;
    cursor: pointer;
    color: rgba(255,255,255,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.15s, color 0.15s, border-color 0.15s;
    font-size: 18px;
    font-family: var(--_f-mono);
}

.chat-icon-btn:hover {
    background: var(--_accent);
    color: var(--_bg);
    border-color: var(--_accent);
}

/* ══════════════════════════════════════════════════════
   CONTEXT BANNER
   ══════════════════════════════════════════════════════ */
.chat-context-banner {
    display: none;
    align-items: center;
    gap: 8px;
    padding: 8px 14px;
    background: var(--_accent);
    color: var(--_bg);
    border-bottom: var(--_border);
    font-family: var(--_f-mono);
    font-size: 0.66rem;
    flex-shrink: 0;
    overflow: hidden;
}

.chat-context-banner.active { display: flex; }

.chat-context-label {
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-size: 0.57rem;
    white-space: nowrap;
    flex-shrink: 0;
}

#chat-context-text {
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    opacity: 0.9;
}

.chat-context-clear {
    background: none;
    border: 1px solid rgba(255,255,255,0.35);
    border-radius: 6px;
    color: rgba(255,255,255,0.75);
    cursor: pointer;
    font-size: 13px;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-family: var(--_f-mono);
    transition: all 0.15s;
}

.chat-context-clear:hover { background: rgba(255,255,255,0.2); color: #fff; }

/* ══════════════════════════════════════════════════════
   ACTION PILLS (legacy quiz pages)
   ══════════════════════════════════════════════════════ */
.prepbot-action-bar {
    padding: 10px 14px 0;
    display: flex;
    flex-shrink: 0;
}

.prepbot-action-bar--qnav {
    align-items: center;
    gap: 8px;
    overflow: hidden;
    padding-bottom: 10px;
    border-bottom: var(--_border);
}

.prepbot-nav-label {
    font-family: var(--_f-mono);
    font-size: 0.58rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--_muted);
    white-space: nowrap;
    flex-shrink: 0;
}

.prepbot-qpills-scroll {
    display: flex;
    gap: 5px;
    overflow-x: auto;
    flex: 1;
    padding-bottom: 3px;
}

.prepbot-qpills-scroll::-webkit-scrollbar { height: 3px; }
.prepbot-qpills-scroll::-webkit-scrollbar-thumb { background: var(--_ink); border-radius: 99px; }

.prepbot-pill {
    font-family: var(--_f-mono);
    font-size: 0.63rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    padding: 7px 14px;
    border: var(--_border);
    border-radius: var(--_r);
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: all 0.18s;
    white-space: nowrap;
}

.prepbot-pill--primary {
    background: var(--_accent);
    color: var(--_bg);
    box-shadow: var(--_sh-sm);
}

.prepbot-pill--primary:hover {
    background: var(--_ink);
    color: var(--_accent);
    transform: translate(-1px,-1px);
    box-shadow: var(--_sh-md);
}

.prepbot-qpill {
    width: 30px;
    height: 30px;
    min-width: 30px;
    border: var(--_border);
    border-radius: 8px;
    background: var(--_bg);
    color: var(--_ink);
    font-family: var(--_f-mono);
    font-size: 0.63rem;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s;
    flex-shrink: 0;
}

.prepbot-qpill:hover { background: var(--_accent); color: var(--_bg); }
.prepbot-qpill.qpill--current { background: var(--_ink); color: var(--_primary); border-color: var(--_ink); }
.prepbot-qpill.qpill--answered { background: var(--_surface); color: var(--_muted); }
.prepbot-qpill.qpill--correct { background: var(--_success); color: var(--_bg); border-color: var(--_success); }
.prepbot-qpill.qpill--wrong { background: var(--_danger); color: var(--_bg); border-color: var(--_danger); }

/* ── Quiz nav bar ── */
.quiz-nav-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 14px;
    background: var(--_bg);
    border-bottom: var(--_border);
    gap: 10px;
}

.quiz-nav-btn {
    font-family: var(--_f-display);
    font-size: 0.63rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    padding: 6px 12px;
    border: var(--_border);
    border-radius: var(--_r);
    background: var(--_ink);
    color: var(--_bg);
    cursor: pointer;
    transition: all 0.18s;
    box-shadow: var(--_sh-sm);
}

.quiz-nav-btn:hover {
    background: var(--_accent);
    transform: translate(-1px,-1px);
    box-shadow: var(--_sh-md);
}

.quiz-nav-info {
    font-family: var(--_f-mono);
    font-size: 0.72rem;
    font-weight: 600;
}

/* ── Quiz nav pill ── */
.quiz-nav-pill {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: var(--_accent);
    color: var(--_bg);
    padding: 8px 16px;
    font-family: var(--_f-display);
    font-size: 0.68rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    cursor: pointer;
    transition: all 0.2s;
    margin: 10px 14px;
    border: var(--_border);
    border-radius: var(--_r);
    box-shadow: var(--_sh-sm);
    width: calc(100% - 28px);
}

.quiz-nav-pill:hover {
    background: var(--_ink);
    color: var(--_accent);
    transform: translate(-2px,-2px);
    box-shadow: var(--_sh-md);
}

.quiz-nav-pill svg { width: 14px; height: 14px; stroke: currentColor; }

/* ══════════════════════════════════════════════════════
   MESSAGES AREA
   ══════════════════════════════════════════════════════ */
.chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 18px 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    scroll-behavior: smooth;
    background: var(--_surface);
}

.chat-messages::-webkit-scrollbar { width: 4px; }
.chat-messages::-webkit-scrollbar-track { background: transparent; }
.chat-messages::-webkit-scrollbar-thumb { background: var(--_ink); border-radius: 99px; opacity: 0.3; }

/* ── Intro card ── */
.chat-intro-card {
    border: var(--_border);
    border-radius: var(--_r);
    background: var(--_bg);
    padding: 16px;
    position: relative;
    overflow: hidden;
    box-shadow: var(--_sh-sm);
}

.chat-intro-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0;
    width: 4px; height: 100%;
    background: var(--_accent);
    border-radius: var(--_r) 0 0 var(--_r);
}

.chat-intro-card .intro-label {
    font-family: var(--_f-display);
    font-size: 0.57rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--_accent);
    margin-bottom: 6px;
}

.chat-intro-card p {
    font-family: var(--_f-mono);
    font-size: 0.78rem;
    color: var(--_muted);
    line-height: 1.65;
    margin-bottom: 0;
}

.chat-intro-card strong { color: var(--_ink); }

/* ══════════════════════════════════════════════════════
   MESSAGE BUBBLES
   ══════════════════════════════════════════════════════ */
.msg {
    display: flex;
    flex-direction: column;
    gap: 4px;
    max-width: 85%;
    animation: pb-msg-in 0.24s var(--_ease) both;
}

@keyframes pb-msg-in {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
}

.msg.user { align-self: flex-end; align-items: flex-end; }
.msg.bot  { align-self: flex-start; align-items: flex-start; }

.msg-meta {
    font-family: var(--_f-mono);
    font-size: 0.54rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--_faint);
}

.msg-bubble {
    padding: 10px 14px;
    font-family: var(--_f-mono);
    font-size: 0.81rem;
    line-height: 1.65;
    border: var(--_border);
    border-radius: var(--_r);
}

.msg.user .msg-bubble {
    background: var(--_ink);
    color: var(--_bg);
    border-bottom-right-radius: 4px;
    box-shadow: var(--_sh-sm);
}

.msg.bot .msg-bubble {
    background: var(--_bg);
    color: var(--_ink);
    border-left: 4px solid var(--_accent);
    border-bottom-left-radius: 4px;
    box-shadow: 3px 3px 0 rgba(0,0,0,0.06);
}

.msg.bot .msg-bubble strong { color: var(--_accent); font-weight: 700; }
.msg.bot .msg-bubble em     { color: var(--_ink); font-style: italic; }

/* Math styling */
.math-inline {
    font-family: var(--_f-mono);
    background: var(--_surface);
    padding: 2px 5px;
    border: var(--_border-s);
    border-radius: 5px;
    display: inline-block;
}

.math-block {
    font-family: var(--_f-mono);
    background: var(--_surface);
    padding: 12px;
    margin: 10px 0;
    border: var(--_border);
    border-radius: var(--_r);
    overflow-x: auto;
}

.step-highlight {
    color: var(--_accent);
    background: rgba(0,85,255,0.08);
    padding: 2px 5px;
    border-radius: 4px;
}

/* ── Typing indicator ── */
.typing-dots {
    display: flex;
    gap: 5px;
    align-items: center;
}

.typing-dots span {
    width: 7px;
    height: 7px;
    background: var(--_accent);
    border-radius: 50%;
    animation: pb-bounce 1.2s infinite ease-in-out;
}

.typing-dots span:nth-child(2) { animation-delay: 0.2s; }
.typing-dots span:nth-child(3) { animation-delay: 0.4s; }

@keyframes pb-bounce {
    0%, 80%, 100% { transform: translateY(0);    opacity: 0.3; }
    40%            { transform: translateY(-7px); opacity: 1; }
}

/* ── Message footer (speaker) ── */
.msg-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-top: 8px;
    border-top: var(--_border-s);
    padding-top: 5px;
}

/* ── Speaker button ── */
.speaker-btn {
    background: none;
    border: var(--_border);
    border-radius: 8px;
    cursor: pointer;
    color: var(--_accent);
    padding: 5px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: all 0.18s;
    margin-top: 6px;
    width: 28px;
    height: 28px;
}

.speaker-btn:hover { background: var(--_accent); color: var(--_bg); border-color: var(--_accent); }

.soundwave {
    display: inline-flex;
    align-items: flex-end;
    gap: 2px;
    height: 14px;
    margin-left: 8px;
}

.soundwave span {
    width: 3px;
    background: var(--_accent);
    border-radius: 2px;
    animation: pb-wave 1s infinite ease-in-out;
}

.soundwave span:nth-child(2) { animation-delay: 0.2s; height: 100%; }
.soundwave span:nth-child(3) { animation-delay: 0.4s; height: 60%; }

@keyframes pb-wave {
    0%, 100% { height: 4px; }
    50%       { height: 14px; }
}

/* ══════════════════════════════════════════════════════
   SUGGESTIONS STRIP
   ══════════════════════════════════════════════════════ */
.chat-suggestions {
    display: flex;
    gap: 6px;
    flex-wrap: nowrap;
    overflow-x: auto;
    padding: 10px 14px;
    border-top: var(--_border);
    background: var(--_bg);
    flex-shrink: 0;
}

.chat-suggestions:empty { padding: 0; border: none; }

.chat-suggestions::-webkit-scrollbar { height: 0; }

.suggestion-chip {
    font-family: var(--_f-mono);
    font-size: 0.67rem;
    font-weight: 600;
    padding: 7px 14px;
    border: var(--_border);
    border-radius: 100px;
    background: var(--_bg);
    color: var(--_ink);
    cursor: pointer;
    transition: all 0.18s;
    white-space: nowrap;
    flex-shrink: 0;
}

.suggestion-chip:hover {
    background: var(--_accent);
    color: var(--_bg);
    border-color: var(--_accent);
    transform: translateY(-1px);
}

/* ══════════════════════════════════════════════════════
   INPUT ROW
   ══════════════════════════════════════════════════════ */
.chat-input-row {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 12px;
    border-top: var(--_border);
    flex-shrink: 0;
    background: var(--_bg);
    border-radius: 0 0 var(--_r) var(--_r);
}

.chat-input-wrap {
    flex: 1;
    display: flex;
    align-items: center;
    background: var(--_surface);
    border: var(--_border);
    border-radius: var(--_r);
    padding: 0 8px 0 14px;
    gap: 6px;
    transition: box-shadow 0.15s;
}

.chat-input-wrap:focus-within {
    box-shadow: 0 0 0 2px var(--_accent);
}

#chat-input {
    flex: 1;
    border: none;
    outline: none;
    resize: none;
    background: transparent;
    font-family: var(--_f-mono);
    font-size: 0.8rem;
    color: var(--_ink);
    padding: 10px 0;
    line-height: 1.5;
    max-height: 84px;
    overflow-y: auto;
}

#chat-input::placeholder {
    color: var(--_faint);
    opacity: 0.7;
}

/* ── Mic ── */
#chat-mic {
    width: 32px;
    height: 32px;
    background: transparent;
    color: var(--_faint);
    border: none;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: color 0.15s, background 0.15s;
}

#chat-mic:hover { color: var(--_accent); background: rgba(0,85,255,0.07); }
#chat-mic svg { transition: transform 0.2s var(--_ease); }
#chat-mic.mic-active { color: var(--_danger); animation: pb-pulse-mic 1.5s infinite; }
#chat-mic.mic-active svg { transform: scale(1.15); }

@keyframes pb-pulse-mic {
    0%   { background: transparent; }
    50%  { background: rgba(255,34,0,0.08); }
    100% { background: transparent; }
}

/* ── Send ── */
#chat-send {
    width: 40px;
    height: 40px;
    background: var(--_accent);
    color: var(--_bg);
    border: var(--_border);
    border-radius: var(--_r);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: background 0.18s, transform 0.15s var(--_ease);
}

#chat-send:hover:not(:disabled) {
    background: var(--_ink);
    transform: translate(-1px,-1px);
}

#chat-send:active { transform: translate(1px,1px); }
#chat-send:disabled { background: var(--_faint); cursor: default; }
#chat-send .send-icon,
#chat-send .send-spinner { transition: opacity 0.15s; }
#chat-send .send-spinner { display: none; }
#chat-send.loading .send-icon { display: none; }
#chat-send.loading .send-spinner { display: block; }

@keyframes pb-spin { to { transform: rotate(360deg); } }

.send-spinner {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255,255,255,0.25);
    border-top-color: #fff;
    border-radius: 50%;
    animation: pb-spin 0.7s linear infinite;
}

/* ══════════════════════════════════════════════════════
   Q-BUBBLES PANEL
   ══════════════════════════════════════════════════════ */
.qbubbles-bar {
    background: var(--_bg);
    border-bottom: var(--_border);
    padding: 10px 14px;
    flex-shrink: 0;
    animation: pb-slide-down 0.2s var(--_ease) both;
}

@keyframes pb-slide-down {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: translateY(0); }
}

.qbubbles-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
}

.qbubbles-title {
    font-family: var(--_f-mono);
    font-size: 0.57rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--_accent);
    display: flex;
    align-items: center;
    gap: 6px;
}

.qbubbles-close {
    background: none;
    border: var(--_border);
    border-radius: 8px;
    cursor: pointer;
    color: var(--_ink);
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-family: var(--_f-mono);
    transition: all 0.15s;
}

.qbubbles-close:hover { background: var(--_ink); color: var(--_bg); }

.qbubbles-grid { display: flex; flex-wrap: wrap; gap: 6px; }

.qbubble {
    width: 32px;
    height: 32px;
    border: var(--_border);
    border-radius: 8px;
    background: var(--_surface);
    color: var(--_ink);
    font-family: var(--_f-mono);
    font-size: 0.68rem;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s;
}

.qbubble:hover {
    background: var(--_accent);
    color: var(--_bg);
    border-color: var(--_accent);
    transform: translateY(-1px);
}

/* ══════════════════════════════════════════════════════
   CLEAR BAR
   ══════════════════════════════════════════════════════ */
.chat-clear-bar {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    background: var(--_ink);
    color: var(--_bg);
    padding: 12px 16px;
    display: none;
    align-items: center;
    justify-content: space-between;
    z-index: 10;
    border-top: var(--_border);
    border-radius: 0 0 var(--_r) var(--_r);
}

.chat-clear-bar.visible { display: flex; }

.chat-clear-bar span {
    font-family: var(--_f-mono);
    font-size: 0.64rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
}

.chat-clear-bar-actions { display: flex; gap: 8px; }

#clear-confirm,
#clear-cancel {
    font-family: var(--_f-mono);
    font-size: 0.6rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    padding: 6px 12px;
    border: var(--_border);
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.15s, color 0.15s;
    background: transparent;
}

#clear-confirm { background: var(--_accent); color: var(--_bg); border-color: var(--_accent); }
#clear-confirm:hover { background: var(--_bg); color: var(--_accent); }
#clear-cancel { color: rgba(255,255,255,0.6); border-color: rgba(255,255,255,0.28); }
#clear-cancel:hover { color: #fff; border-color: #fff; }

/* ══════════════════════════════════════════════════════
   POPUP NUDGE
   ══════════════════════════════════════════════════════ */
#prepbot-popup {
    position: fixed;
    bottom: calc(68px + 1.4rem);
    right: 24px;
    max-width: 300px;
    min-height: 52px;
    background: var(--_ink);
    color: var(--_bg);
    border: var(--_border);
    border-radius: var(--_r);
    padding: 12px 36px 14px 16px;
    font-family: var(--_f-mono);
    font-size: 0.74rem;
    line-height: 1.55;
    box-shadow: 6px 6px 0 var(--_accent);
    cursor: pointer;
    z-index: 10000;
    opacity: 0;
    transform: translateY(8px) scale(0.96);
    pointer-events: none;
    transition: opacity 0.3s ease, transform 0.3s ease;
    user-select: none;
    overflow-x: auto;
}

#prepbot-popup::after {
    content: '';
    position: absolute;
    bottom: -12px;
    right: 24px;
    border-width: 12px 8px 0 8px;
    border-style: solid;
    border-color: var(--_ink) transparent transparent transparent;
}

#prepbot-popup.visible {
    opacity: 1;
    transform: translateY(0) scale(1);
    pointer-events: auto;
}

#prepbot-popup p {
    margin: 0; padding: 0;
    display: block;
    overflow-x: auto;
}

#prepbot-popup .MJX-TEX,
#prepbot-popup mjx-container { font-size: 0.92em !important; color: var(--_bg); }
#prepbot-popup mjx-container svg { fill: var(--_bg); color: var(--_bg); }

.prepbot-popup-close {
    position: absolute;
    top: 8px; right: 8px;
    background: none;
    border: none;
    color: rgba(255,255,255,0.45);
    font-size: 1.1rem;
    line-height: 1;
    cursor: pointer;
    padding: 0;
    width: 20px; height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--_f-mono);
}

.prepbot-popup-close:hover { color: var(--_accent); }

/* ══════════════════════════════════════════════════════
   INLINE VIDEO PLAYER
   ══════════════════════════════════════════════════════ */
.chat-video-player {
    border: var(--_border);
    border-radius: var(--_r);
    background: var(--_bg);
    box-shadow: var(--_sh-sm);
    overflow: hidden;
    width: 100%;
}

.chat-video-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 12px;
    background: var(--_ink);
    color: var(--_bg);
    gap: 10px;
}

.chat-video-info { flex: 1; overflow: hidden; }

.chat-video-title {
    font-family: var(--_f-mono);
    font-size: 0.68rem;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: var(--_bg);
}

.chat-video-channel {
    font-family: var(--_f-mono);
    font-size: 0.58rem;
    color: rgba(255,255,255,0.48);
    margin-top: 2px;
}

.chat-video-close {
    background: none;
    border: 1px solid rgba(255,255,255,0.28);
    border-radius: 6px;
    color: rgba(255,255,255,0.6);
    cursor: pointer;
    width: 24px; height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    flex-shrink: 0;
    transition: all 0.15s;
    font-family: var(--_f-mono);
}

.chat-video-close:hover { background: var(--_danger); border-color: var(--_danger); color: #fff; }

.chat-video-container {
    position: relative;
    padding-bottom: 56.25%;
    height: 0;
}

.chat-video-container iframe {
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
    border: none;
}

.video-play-chip {
    background: var(--_danger) !important;
    color: var(--_bg) !important;
    border-color: var(--_danger) !important;
}

.video-play-chip:hover {
    background: var(--_ink) !important;
    border-color: var(--_ink) !important;
}

/* ══════════════════════════════════════════════════════
   MOBILE — fix navbar overlap
   ══════════════════════════════════════════════════════ */
@media (max-width: 480px) {
    #chat-window {
        width: calc(100vw - 12px);
        right: 6px;
        bottom: 0;
        top: calc(var(--nav-height, 3.875rem) + 6px);
        height: auto;
        border-radius: 0 0 var(--_r) var(--_r);
        border-top-left-radius: 0;
        border-top-right-radius: 0;
    }

    #chat-fab-wrap {
        right: 14px;
        bottom: 18px;
    }

    #chat-fab { padding: 10px 16px 10px 12px; }

    .suggestion-chip {
        font-size: 0.62rem;
        padding: 6px 12px;
    }

    .quiz-nav-pill {
        font-size: 0.63rem;
        padding: 6px 12px;
    }

    #prepbot-popup {
        right: 14px;
        max-width: calc(100vw - 70px);
        font-size: 0.7rem;
    }
}
`;

export default chatbotcss;
