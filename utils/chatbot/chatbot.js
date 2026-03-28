import chatbotcss from './chatbotcss.js';

/* ═══════════════════════════════════════════════════════════
   PREPBOT — Content-Aware AI Study Assistant (Groq / Llama 3.1)
   Logics: DOM Scraping, Context Injection, MathJax, Auto-Nav
   Update: High-Frequency Dynamic Conversation Starters
═══════════════════════════════════════════════════════════ */

(function() {

    /* ── INJECT CSS ── */
    (function injectStyles() {
        const style = document.createElement('style');
        style.textContent = chatbotcss;
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
    
    const isGitHubPages = location.hostname.includes("github.io");
    const BASE = isGitHubPages ? "/" + location.pathname.split('/')[1] : "";
    
    const SITE_MAP = {
        "Home": `${BASE}/index.html`,
        "Cambridge": `${BASE}/Cambridge/index.html`,
        "WAEC": `${BASE}/WAEC/index.html`,
        "Scholastic": `${BASE}/Scholarstic/index.html`,
    };

    /* ── DOM SCRAPER (Content Awareness) ── */
    function getPageContext() {
        const selectors = ['main', 'article', '.study-content', '.lesson-body', '#question-text', '.content'];
        let mainContent = "";
        
        for (const selector of selectors) {
            const el = document.querySelector(selector);
            if (el) {
                const clone = el.cloneNode(true);
                clone.querySelectorAll('#prepbot, script, style, .chat-window').forEach(n => n.remove());
                mainContent = clone.innerText.replace(/\s+/g, ' ').trim();
                break; 
            }
        }

        if (!mainContent) mainContent = document.body.innerText.replace(/\s+/g, ' ').substring(0, 1500);

        return {
            title: document.title,
            h1: document.querySelector('h1')?.innerText || "this topic",
            body: mainContent.substring(0, 3000)
        };
    }

    /* ── INJECT HTML ── */
    const mount = document.getElementById('prepbot');
    if (!mount) return;
    
    mount.innerHTML = `
        <div id="chat-fab-wrap">
            <button id="chat-fab" aria-label="Open Assistant">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                <span class="fab-dot"></span>
            </button>
            <button id="chat-fab-dismiss" title="Hide">×</button>
        </div>

        <div id="prepbot-popup" role="status">
            <button class="prepbot-popup-close" id="prepbot-popup-close">×</button>
            <p id="prepbot-popup-text"></p>
        </div>

        <button id="chat-fab-restore" title="Show PrepBot"><span>AI</span></button>

        <div id="chat-window" role="dialog">
            <div class="chat-header">
                <div class="chat-header-left">
                    <div class="chat-avatar"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
                    <div class="chat-header-info"><h4>${BOT_NAME}</h4><div class="chat-status"><span class="chat-status-dot"></span><span>Online</span></div></div>
                </div>
                <div class="chat-header-actions">
                    <button class="chat-icon-btn" id="chat-clear-btn">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                    </button>
                    <button class="chat-icon-btn" id="chat-close">×</button>
                </div>
            </div>

            <div class="chat-tabs" id="chat-tabs">
                <button class="chat-tab active" data-subject="General">All</button>
                <button class="chat-tab" data-subject="Mathematics">Maths</button>
                <button class="chat-tab" data-subject="English">English</button>
                <button class="chat-tab" data-subject="Science">Science</button>
            </div>

            <div class="chat-messages" id="chat-messages">
                <div class="chat-intro-card">
                    <div class="intro-label">${BOT_NAME} &middot; ACTIVE CONTEXT</div>
                    <p>I'm reading this page with you. Ask me to <strong>explain</strong>, <strong>summarize</strong>, or <strong>solve</strong> any part of this lesson.</p>
                </div>
            </div>

            <div class="chat-suggestions" id="chat-suggestions"></div>

            <div class="chat-input-row">
                <div class="chat-input-wrap">
                    <textarea id="chat-input" rows="1" placeholder="Ask about this page…" maxlength="500"></textarea>
                </div>
                <button id="chat-send">
                    <svg class="send-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                    <div class="send-spinner"></div>
                </button>
            </div>
            <div class="chat-clear-bar" id="chat-clear-bar">
                <span>Clear chat?</span>
                <div class="chat-clear-bar-actions"><button id="clear-cancel">No</button><button id="clear-confirm">Clear</button></div>
            </div>
        </div>
    `;
    
    /* ── STATE & REFS ── */
    const win = document.getElementById('chat-window');
    const input = document.getElementById('chat-input');
    const messages = document.getElementById('chat-messages');
    const sendBtn = document.getElementById('chat-send');
    const suggBox = document.getElementById('chat-suggestions');
    const popup = document.getElementById('prepbot-popup');
    const popupText = document.getElementById('prepbot-popup-text');
    
    let isOpen = false;
    let isBusy = false;
    let history = []; 
    let activeSubject = 'General';
    let currentNudgePrompt = ""; 

    /* ── SYSTEM PROMPT ── */
    function getSystemPrompt() {
        const page = getPageContext();
        return `You are ${BOT_NAME}, an expert study assistant. 
        REAL-TIME PAGE CONTEXT:
        - Topic: ${page.h1}
        - Content: "${page.body}"
        
        INSTRUCTIONS:
        1. Use the provided page content to answer.
        2. Use LaTeX for math: \\(...\\) for inline and \\[...\\] for blocks.
        3. Be concise and academic.`;
    }

    /* ── UI LOGIC ── */
    function toggleChat(force) {
        isOpen = force !== undefined ? force : !isOpen;
        win.classList.toggle('open', isOpen);
        if (isOpen) { 
            popup.classList.remove('visible');
            updateSuggestions();
            setTimeout(() => input.focus(), 300); 
        }
    }

    async function sendMessage(overrideText) {
        const text = overrideText || input.value.trim();
        if (!text || isBusy) return;

        isBusy = true;
        sendBtn.disabled = true;
        sendBtn.classList.add('loading');
        input.value = '';
        input.style.height = 'auto';

        appendMessage('user', text);
        showTyping();

        const systemPrompt = getSystemPrompt();
        history.push({ role: 'user', content: text });
        if (history.length > 8) history = history.slice(-8);

        try {
            const res = await fetch(GROQ_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${GROQ_KEY}` },
                body: JSON.stringify({
                    model: "llama-3.1-8b-instant",
                    messages: [{ role: "system", content: systemPrompt }, ...history],
                    temperature: 0.6
                })
            });
            const data = await res.json();
            hideTyping();
            let reply = data.choices?.[0]?.message?.content || "Error getting response.";
            history.push({ role: 'assistant', content: reply });
            appendMessage('bot', reply);
        } catch (err) {
            hideTyping();
            appendMessage('bot', "Connection error.");
        }
        isBusy = false;
        sendBtn.disabled = false;
        sendBtn.classList.remove('loading');
    }

    function appendMessage(role, text) {
        const wrap = document.createElement('div');
        wrap.className = `msg ${role}`;
        wrap.innerHTML = `<div class="msg-meta">${role === 'user' ? 'You' : BOT_NAME}</div><div class="msg-bubble">${formatText(text)}</div>`;
        messages.appendChild(wrap);
        messages.scrollTop = messages.scrollHeight;
        if (window.MathJax) MathJax.typesetPromise?.([wrap]);
    }

    function formatText(t) { return t.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>'); }
    function showTyping() { const t = document.createElement('div'); t.id = 'typing'; t.className = 'msg bot'; t.innerHTML = `<div class="msg-bubble">...</div>`; messages.appendChild(t); messages.scrollTop = messages.scrollHeight; }
    function hideTyping() { document.getElementById('typing')?.remove(); }

    function updateSuggestions() {
        suggBox.innerHTML = '';
        const page = getPageContext();
        const chips = [`Explain ${page.h1}`, 'Summarize this', 'Give me a quiz'];
        chips.forEach(c => {
            const b = document.createElement('button');
            b.className = 'suggestion-chip';
            b.textContent = c;
            b.onclick = () => sendMessage(c);
            suggBox.appendChild(b);
        });
    }

    /* ── DYNAMIC CONVERSATION STARTERS (NUDGES) ── */
    function triggerNudge() {
        if (isOpen || isBusy) return;

        const page = getPageContext();
        const nudgeData = [
            { label: `Confused by ${page.h1}? Tap for an explanation.`, prompt: `Can you explain "${page.h1}" in simple terms based on this page?` },
            { label: `Want a quick summary of this lesson?`, prompt: `Give me a 3-point bullet summary of the content on this page.` },
            { label: `Think you know ${page.h1}? Let me quiz you!`, prompt: `Based on the text on this page, give me one multiple choice question to test my knowledge.` },
            { label: `Need the key formulas/facts from this page?`, prompt: `List the most important formulas or facts from this current page.` }
        ];

        const pick = nudgeData[Math.floor(Math.random() * nudgeData.length)];
        popupText.textContent = pick.label;
        currentNudgePrompt = pick.prompt;
        
        popup.classList.add('visible');
        // Hide after 7 seconds
        setTimeout(() => popup.classList.remove('visible'), 7000);
    }

    // Start nudging every 10-15 seconds
    function startNudgeTimer() {
        const delay = Math.floor(Math.random() * (15000 - 10000 + 1) + 10000);
        setTimeout(() => {
            triggerNudge();
            startNudgeTimer();
        }, delay);
    }

    /* ── EVENTS ── */
    document.getElementById('chat-fab').onclick = () => toggleChat();
    document.getElementById('chat-close').onclick = () => toggleChat(false);
    sendBtn.onclick = () => sendMessage();
    input.onkeydown = e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } };

    // When clicking the popup nudge
    popup.onclick = (e) => {
        if (e.target.id === 'prepbot-popup-close') {
            popup.classList.remove('visible');
            return;
        }
        toggleChat(true);
        if (currentNudgePrompt) {
            setTimeout(() => sendMessage(currentNudgePrompt), 500);
        }
    };

    document.getElementById('prepbot-popup-close').onclick = (e) => {
        e.stopPropagation();
        popup.classList.remove('visible');
    };

    document.getElementById('chat-fab-dismiss').onclick = (e) => {
        e.stopPropagation();
        document.getElementById('chat-fab-wrap').classList.add('fab-hidden');
        document.getElementById('chat-fab-restore').classList.add('fab-restore-visible');
    };

    document.getElementById('chat-fab-restore').onclick = () => {
        document.getElementById('chat-fab-wrap').classList.remove('fab-hidden');
        document.getElementById('chat-fab-restore').classList.remove('fab-restore-visible');
    };

    // Initialize timers
    setTimeout(startNudgeTimer, 5000); // First nudge after 5s

})();