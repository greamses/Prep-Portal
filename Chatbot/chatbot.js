/* ═══════════════════════════════════════════════════════════
   PREPBOT — Reusable AI Study Assistant (Groq / Llama 3.1)
   Features: AI Chat, MathJax/LaTeX, Auto-Navigation, Hidden Quiz Context
   Updated: Strict LaTeX enforcement & Material Symbols
═══════════════════════════════════════════════════════════ */

(function() {
    
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
                <span class="fab-label">Ask Me</span>
                <span class="fab-dot"></span>
            </button>
            <button id="chat-fab-dismiss" aria-label="Hide PrepBot button" title="Hide">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
            </button>
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
                        <span class="material-symbols-outlined" style="font-size: 16px;">help</span>
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
            tq.innerHTML = '<span class="material-symbols-outlined" style="margin-right: 5px; font-size: 14px; vertical-align: text-bottom;">help</span> This question';
            tq.addEventListener('click', () => {
                if (hasQuiz) {
                    askAboutQuestion(window.__prepbotCurrentQuestionIndex, getQuizData());
                } else {
                    const qNum = getQuestionNumber();
                    const prefix = qNum ? `Question ${qNum}: ` : '';
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
            pq.innerHTML = '<span class="material-symbols-outlined" style="margin-right: 5px; font-size: 14px; vertical-align: text-bottom;">format_list_numbered</span> Pick a question';
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
    
    function appendMessage(role, text) {
        const wrap = document.createElement('div');
        wrap.className = `msg ${role}`;
        wrap.innerHTML = `<div class="msg-meta">${role === 'user' ? 'You' : BOT_NAME}</div>`;
        
        const bubble = document.createElement('div');
        bubble.className = 'msg-bubble';
        bubble.innerHTML = formatText(text);
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
            .replace(/\[ICON:([^\]]+)\]/g, '<span class="material-symbols-outlined" style="margin-right: 6px; font-size: 1.2em; vertical-align: middle;">$1</span>')
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
                appendMessage('bot', `[ICON:check_circle] Navigating you to **${pageName}** now…`);
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
            appendMessage('bot', `[ICON:info] I noticed the word **"${synonymKeyword.word}"** in your message. Did you want me to **navigate you** to a page on the site, or were you asking something else?\n\nReply **"yes"** if you meant navigation, or just rephrase your question!`);
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
        
        // Render ONLY the clean text to the user interface
        appendMessage('user', text);
        
        // Append the secret context to the prompt if it exists, before saving to history
        let textForAI = text;
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
                    appendMessage('bot', "[ICON:hourglass_empty] **Whoa, slow down!** I'm getting too many questions at once. Please wait 15 seconds and try again.");
                    history.pop();
                } else {
                    appendMessage('bot', `[ICON:warning] **API error:** ${errMsg}`);
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
                        `[ICON:link] I'd like to take you to **${pageName}**. Shall I go ahead?\n\nReply **Yes** to navigate or **No** to stay here.`;
                    
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
            appendMessage('bot', `[ICON:wifi_off] **Connection Error:** Please check your internet and try again.`);
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
                'not-allowed': '[ICON:mic_off] Microphone access was denied. Please allow microphone access in your browser settings.',
                'no-speech': '[ICON:speaker_notes_off] No speech detected. Please try again.',
                'network': '[ICON:wifi_off] Network error during voice recognition. Please check your connection.',
                'aborted': null,
            };
            const msg = msgs[e.error] !== undefined ? msgs[e.error] : `[ICON:warning] Voice error: ${e.error}`;
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
    
})();