/* ═══════════════════════════════════════════════════════════
   PREP PORTAL — WASSCE Practice Paper
   MODULE 4: PrepBot - AI Chat Assistant
   ═══════════════════════════════════════════════════════════ */

'use strict';

const PrepBot = (() => {
    
    let isOpen = false;
    let fabDismissed = false;
    let onResults = false;
    let chatHistory = [];
    let contextQ = null;
    let recognition = null;
    let micActive = false;
    let popupTimer = null;
    
    const SYSTEM_PROMPT = `You are PrepBot, a friendly and expert Nigerian secondary school exam tutor. You help students understand WAEC, JAMB, IGCSE, and Common Entrance exam questions. Be concise, clear, and encouraging. Use simple language. When explaining chemistry, biology, physics or maths, be precise. Do not use bullet points in every response — write naturally.`;
    
    function init() {
        document.getElementById('chat-input').addEventListener('keydown', e => {
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault();
                send(); }
        });
        document.getElementById('chat-input').addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 120) + 'px';
        });
        renderIntro();
        setTimeout(() => {
            if (!isOpen && !fabDismissed) {
                showPopup('Need help understanding this question? I am reading the page with you.');
            }
        }, 8000);
    }
    
    function renderIntro() {
        const msgs = document.getElementById('chat-messages');
        msgs.innerHTML = `
            <div class="chat-intro-card">
                <div class="chat-intro-title">System Ready</div>
                <div class="chat-intro-text">I am reading the page with you. Ask about the current question, navigate to a number, or use the Mic to talk.</div>
            </div>`;
        renderActionPills();
    }
    
    function renderActionPills() {
        document.querySelectorAll('.prepbot-action-bar').forEach(el => el.remove());
        
        const state = Quiz.getState();
        if (!state.allQuestions.length) return;
        
        const q = state.allQuestions[state.currentIndex];
        const idx = state.currentIndex;
        
        const msgs = document.getElementById('chat-messages');
        
        const bar1 = document.createElement('div');
        bar1.className = 'prepbot-action-bar';
        
        const thisQBtn = document.createElement('button');
        thisQBtn.className = 'prepbot-pill prepbot-pill--primary';
        thisQBtn.innerHTML = `
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="6" cy="6" r="5"/><path d="M6 5v4M6 3h.01"/>
            </svg>
            Q${idx + 1} &mdash; Ask about this question`;
        thisQBtn.addEventListener('click', () => injectCurrentQuestion());
        bar1.appendChild(thisQBtn);
        msgs.insertBefore(bar1, msgs.firstChild);
        
        const bar2 = document.createElement('div');
        bar2.className = 'prepbot-action-bar prepbot-action-bar--qnav';
        
        const label = document.createElement('span');
        label.className = 'prepbot-nav-label';
        label.textContent = 'Go to:';
        bar2.appendChild(label);
        
        const scroll = document.createElement('div');
        scroll.className = 'prepbot-qpills-scroll';
        
        state.allQuestions.forEach((question, i) => {
            const pill = document.createElement('button');
            pill.className = 'prepbot-qpill';
            pill.textContent = i + 1;
            pill.title = question.question.length > 70 ?
                question.question.slice(0, 70) + '…' :
                question.question;
            
            const chosen = state.userAnswers[i];
            if (i === state.currentIndex) {
                pill.classList.add('qpill--current');
            } else if (chosen !== undefined && chosen !== '') {
                if (state.submitted && question.type === 'objective') {
                    pill.classList.add(chosen === question._answer ? 'qpill--correct' : 'qpill--wrong');
                } else if (!state.submitted) {
                    pill.classList.add('qpill--answered');
                }
            }
            
            pill.addEventListener('click', () => {
                Quiz.goTo(i);
                renderActionPills();
                msgs.scrollTop = 0;
            });
            scroll.appendChild(pill);
        });
        bar2.appendChild(scroll);
        msgs.insertBefore(bar2, bar1.nextSibling);
    }
    
    function injectCurrentQuestion() {
        const state = Quiz.getState();
        const q = state.allQuestions[state.currentIndex];
        const idx = state.currentIndex;
        const letters = ['A', 'B', 'C', 'D', 'E'];
        
        if (!q) return;
        
        let questionBlock = `Q${idx + 1}: ${q.question}`;
        if (q.type === 'objective' && q.options?.length) {
            questionBlock += '\n\n' + q.options
                .map((opt, i) => `${letters[i] || i + 1}) ${opt}`)
                .join('\n');
        }
        if (q._answer) {
            questionBlock += `\n\nCorrect answer: ${q._answer}`;
        }
        const explText = Array.isArray(q.explanation) ?
            q.explanation.join('\n') :
            (q.explanation || '');
        
        contextQ = { questionText: q.question, correctAnswer: q._answer, explanationText: explText };
        
        const banner = document.getElementById('chat-context-banner');
        document.getElementById('chat-context-text').textContent =
            q.question.length > 120 ? q.question.slice(0, 120) + '…' : q.question;
        banner.classList.add('active');
        
        chatHistory = [
        {
            role: 'user',
            content: `${SYSTEM_PROMPT}\n\nThe student is looking at this exam question:\n\n${questionBlock}\n\n` +
                (explText ? `Official explanation: ${explText}\n\n` : '') +
                `Please explain this question clearly. Cover the concept being tested, why the correct answer is right, and why the other options are wrong. Be concise.`
        }];
        
        const msgs = document.getElementById('chat-messages');
        msgs.innerHTML = '';
        renderActionPills();
        
        const qCard = document.createElement('div');
        qCard.className = 'chat-msg user';
        qCard.innerHTML = `<div class="msg-bubble" style="font-size:.8rem;line-height:1.65">${esc(questionBlock)}</div>`;
        msgs.appendChild(qCard);
        msgs.scrollTop = msgs.scrollHeight;
        typesetEl(qCard);
        
        streamBotResponse();
    }
    
    function seedFromQuestion(questionText, correctAnswer, explanationText) {
        contextQ = { questionText, correctAnswer, explanationText };
        
        const banner = document.getElementById('chat-context-banner');
        document.getElementById('chat-context-text').textContent =
            questionText.length > 120 ? questionText.slice(0, 120) + '…' : questionText;
        banner.classList.add('active');
        
        chatHistory = [{
            role: 'user',
            content: `${SYSTEM_PROMPT}\n\nThe student is reviewing this exam question:\n\n"${questionText}"\n\n` +
                (correctAnswer ? `Correct answer: ${correctAnswer}\n` : '') +
                (explanationText ? `Explanation: ${explanationText}\n` : '') +
                `\nHelp the student understand this question deeply. Start with a brief, friendly intro.`
        }];
        
        const msgs = document.getElementById('chat-messages');
        msgs.innerHTML = '';
        clearSuggestions();
        renderActionPills();
        
        open();
        streamBotResponse();
    }
    
    function open() {
        isOpen = true;
        hidePopup();
        document.getElementById('chat-fab-wrap').classList.add('fab-hidden');
        document.getElementById('chat-window').classList.add('open');
        renderActionPills();
        document.getElementById('chat-input').focus();
    }
    
    function close() {
        isOpen = false;
        document.getElementById('chat-window').classList.remove('open');
        closeQNav();
        if (!fabDismissed && !onResults) {
            document.getElementById('chat-fab-wrap').classList.remove('fab-hidden');
        }
    }
    
    function toggle() { isOpen ? close() : open(); }
    
    function dismissFAB() {
        fabDismissed = true;
        document.getElementById('chat-fab-wrap').classList.add('fab-hidden');
        document.getElementById('chat-fab-restore').classList.add('fab-restore-visible');
        close();
    }
    
    function restoreFAB() {
        fabDismissed = false;
        document.getElementById('chat-fab-restore').classList.remove('fab-restore-visible');
        if (!onResults) {
            document.getElementById('chat-fab-wrap').classList.remove('fab-hidden');
        }
    }
    
    function hideFAB() {
        onResults = true;
        document.getElementById('chat-fab-wrap').classList.add('fab-hidden');
        document.getElementById('chat-fab-restore').classList.remove('fab-restore-visible');
        hidePopup();
        close();
    }
    
    function showFAB() {
        onResults = false;
        if (!fabDismissed) {
            document.getElementById('chat-fab-wrap').classList.remove('fab-hidden');
        }
    }
    
    function showPopup(text) {
        clearTimeout(popupTimer);
        const popup = document.getElementById('prepbot-popup');
        document.getElementById('prepbot-popup-text').textContent = text;
        popup.classList.add('visible');
        popupTimer = setTimeout(() => hidePopup(), 8000);
    }
    
    function hidePopup() {
        clearTimeout(popupTimer);
        document.getElementById('prepbot-popup').classList.remove('visible');
    }
    
    function clearChat() {
        chatHistory = [];
        contextQ = null;
        document.getElementById('chat-context-banner').classList.remove('active');
        renderIntro();
        clearSuggestions();
    }
    
    function toggleQNav() {
        const bar = document.getElementById('qbubbles-bar');
        if (!bar) return;
        const isHidden = bar.style.display === 'none' || !bar.style.display;
        if (isHidden) {
            buildQBubbles();
            bar.style.display = 'block';
            const btn = document.getElementById('qnav-toggle-btn');
            if (btn) { btn.style.background = 'var(--blue)';
                btn.style.color = 'var(--white)'; }
        } else {
            closeQNav();
        }
    }
    
    function closeQNav() {
        const bar = document.getElementById('qbubbles-bar');
        if (bar) bar.style.display = 'none';
        const btn = document.getElementById('qnav-toggle-btn');
        if (btn) { btn.style.background = '';
            btn.style.borderColor = '';
            btn.style.color = ''; }
    }
    
    function buildQBubbles() {
        const grid = document.getElementById('qbubbles-grid');
        if (!grid) return;
        const state = Quiz.getState();
        grid.innerHTML = '';
        state.allQuestions.forEach((q, i) => {
            const btn = document.createElement('button');
            btn.className = 'qbubble';
            btn.textContent = i + 1;
            btn.title = q.question.length > 60 ? q.question.slice(0, 60) + '…' : q.question;
            if (i === state.currentIndex) btn.classList.add('qb-current');
            const chosen = state.userAnswers[i];
            if (chosen !== undefined && chosen !== '') {
                if (state.submitted && q.type === 'objective') {
                    btn.classList.add(chosen === q._answer ? 'qb-correct' : 'qb-wrong');
                } else if (!state.submitted) {
                    btn.classList.add('qb-answered');
                }
            }
            btn.addEventListener('click', () => {
                Quiz.goTo(i);
                closeQNav();
                renderActionPills();
            });
            grid.appendChild(btn);
        });
    }
    
    async function send() {
        const inputEl = document.getElementById('chat-input');
        const sendBtn = document.getElementById('chat-send');
        const text = inputEl.value.trim();
        if (!text) return;
        
        inputEl.value = '';
        inputEl.style.height = 'auto';
        sendBtn.disabled = true;
        clearSuggestions();
        
        appendMsg('user', text);
        
        if (chatHistory.length === 0) {
            chatHistory.push({ role: 'user', content: SYSTEM_PROMPT + '\n\n' + text });
        } else {
            chatHistory.push({ role: 'user', content: text });
        }
        
        const thinkingEl = appendMsg('bot', 'Thinking…', true);
        
        try {
            const reply = await callGeminiChat(chatHistory);
            thinkingEl.remove();
            appendMsg('bot', reply);
            chatHistory.push({ role: 'assistant', content: reply });
            if (ytKey() && contextQ) addVideoChip();
            addFollowUpChips(reply);
        } catch (e) {
            thinkingEl.remove();
            appendMsg('bot', `Could not connect right now. (${e.message})`);
        }
        
        sendBtn.disabled = false;
        inputEl.focus();
    }
    
    async function streamBotResponse() {
        const sendBtn = document.getElementById('chat-send');
        sendBtn.disabled = true;
        const thinkingEl = appendMsg('bot', 'Thinking…', true);
        try {
            const reply = await callGeminiChat(chatHistory);
            thinkingEl.remove();
            chatHistory.push({ role: 'assistant', content: reply });
            appendMsg('bot', reply);
            if (ytKey() && contextQ) addVideoChip();
            addFollowUpChips(reply);
        } catch (e) {
            thinkingEl.remove();
            appendMsg('bot', `Could not reach AI. (${e.message})`);
        }
        sendBtn.disabled = false;
    }
    
    function appendMsg(role, text, thinking = false) {
        const msgs = document.getElementById('chat-messages');
        const wrap = document.createElement('div');
        wrap.className = `chat-msg ${role}`;
        const bubble = document.createElement('div');
        bubble.className = `msg-bubble${thinking ? ' thinking' : ''}`;
        
        // In appendMsg function, replace the bot message section:
if (role === 'bot' && !thinking) {
    const clean = text.replace(/\[SUGGESTIONS?:[^\]]+\]/gi, '').trim();
    bubble.innerHTML = formatBotMessage(clean); // Changed from esc(clean)
    wrap.appendChild(bubble);
    msgs.appendChild(wrap);
    msgs.scrollTop = msgs.scrollHeight;
    typesetEl(bubble);
} else {
            bubble.textContent = text;
            wrap.appendChild(bubble);
            msgs.appendChild(wrap);
            msgs.scrollTop = msgs.scrollHeight;
        }
        return wrap;
    }
    
    function clearSuggestions() {
        document.getElementById('suggestion-chips').innerHTML = '';
    }
    
    function addFollowUpChips(botReply) {
        const match = botReply.match(/\[SUGGESTIONS?:\s*([^\]]+)\]/i);
        if (!match) return;
        const chips = match[1].split('|').map(s => s.trim()).filter(Boolean);
        const wrap = document.getElementById('suggestion-chips');
        wrap.innerHTML = '';
        chips.forEach(chip => {
            const btn = document.createElement('button');
            btn.className = 'suggestion-chip';
            btn.textContent = chip;
            btn.addEventListener('click', () => {
                document.getElementById('chat-input').value = chip;
                send();
            });
            wrap.appendChild(btn);
        });
    }
    
    function addVideoChip() {
        const wrap = document.getElementById('suggestion-chips');
        if (wrap.querySelector('.yt-chip')) return;
        const btn = document.createElement('button');
        btn.className = 'suggestion-chip yt-chip';
        btn.innerHTML = `▶ Search YouTube`;
        btn.addEventListener('click', () => searchAndShowVideos());
        wrap.appendChild(btn);
    }
    
    async function searchAndShowVideos() {
        if (!contextQ) return;
        clearSuggestions();
        const loadMsg = appendMsg('bot', 'Searching YouTube…', true);
        const query = `WAEC ${contextQ.questionText.slice(0, 80)}`;
        const videos = await searchYouTube(query, 3);
        loadMsg.remove();
        
        if (!videos.length) { appendMsg('bot', 'No relevant YouTube videos found.'); return; }
        
        const wrap = document.createElement('div');
        wrap.className = 'chat-msg bot';
        const bubble = document.createElement('div');
        bubble.className = 'msg-bubble';
        bubble.innerHTML = `<div style="font-weight:700;font-size:.78rem;margin-bottom:8px">Related Videos</div>`;
        const cards = document.createElement('div');
        cards.className = 'prepbot-video-cards';
        videos.forEach(v => {
            const a = document.createElement('a');
            a.className = 'prepbot-video-card';
            a.href = `https://www.youtube.com/watch?v=${v.id}`;
            a.target = '_blank';
            a.rel = 'noopener';
            a.innerHTML = `
                <img src="${v.thumb}" alt="${esc(v.title)}">
                <div class="prepbot-video-card-meta">
                    <div class="prepbot-video-card-title">${esc(v.title)}</div>
                    <div class="prepbot-video-card-channel">${esc(v.channel)}</div>
                </div>`;
            cards.appendChild(a);
        });
        bubble.appendChild(cards);
        wrap.appendChild(bubble);
        document.getElementById('chat-messages').appendChild(wrap);
        document.getElementById('chat-messages').scrollTop = 9999;
    }
    
    function toggleMic() {
        if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
            showPopup('Voice input is not supported in this browser.');
            return;
        }
        if (micActive) { recognition?.stop(); return; }
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SR();
        recognition.lang = 'en-NG';
        recognition.interimResults = false;
        recognition.onresult = e => { document.getElementById('chat-input').value = e.results[0][0].transcript; };
        recognition.onend = () => { micActive = false;
            document.getElementById('chat-mic').classList.remove('mic-active'); };
        recognition.onerror = () => { micActive = false;
            document.getElementById('chat-mic').classList.remove('mic-active'); };
        micActive = true;
        document.getElementById('chat-mic').classList.add('mic-active');
        recognition.start();
    }
    
    // Add this function inside your PrepBot module
    function formatBotMessage(text) {
        if (!text) return '';
        
        // Escape HTML first to prevent XSS
        let formatted = escapeHtml(text);
        
        // Handle bold + italic together (***text*** or ___text___)
        formatted = formatted.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
        formatted = formatted.replace(/___(.+?)___/g, '<strong><em>$1</em></strong>');
        
        // Handle bold (**text** or __text__)
        formatted = formatted.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        formatted = formatted.replace(/__(.+?)__/g, '<strong>$1</strong>');
        
        // Handle italic (*text* or _text_)
        formatted = formatted.replace(/\*([^*\n]+?)\*/g, '<em>$1</em>');
        formatted = formatted.replace(/_([^_\n]+?)_/g, '<em>$1</em>');
        
        // Handle inline code (`text`)
        formatted = formatted.replace(/`([^`]+?)`/g, '<code>$1</code>');
        
        // Handle headers (### text, ## text, # text)
        formatted = formatted.replace(/^### (.+)$/gm, '<h4>$1</h4>');
        formatted = formatted.replace(/^## (.+)$/gm, '<h3>$1</h3>');
        formatted = formatted.replace(/^# (.+)$/gm, '<h2>$1</h2>');
        
        // Handle blockquotes (> text)
        formatted = formatted.replace(/^&gt; (.+)$/gm, '<blockquote>$1</blockquote>');
        
        // Handle unordered lists (- item or * item)
        formatted = formatted.replace(/^[-*] (.+)$/gm, '<li>$1</li>');
        formatted = formatted.replace(/(<li>.+<\/li>\n?)+/g, '<ul>$&</ul>');
        
        // Handle ordered lists (1. item)
        formatted = formatted.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');
        formatted = formatted.replace(/(<li>.+<\/li>\n?)+/g, function(match) {
            // Only wrap if not already inside <ol>
            if (!match.includes('<ol>')) {
                return '<ol>' + match + '</ol>';
            }
            return match;
        });
        
        // Convert newlines to <br> or paragraphs
        formatted = formatted.replace(/\n\n/g, '</p><p>');
        formatted = formatted.replace(/\n/g, '<br>');
        
        // Wrap in paragraph if not already
        if (!formatted.startsWith('<')) {
            formatted = '<p>' + formatted + '</p>';
        }
        
        return formatted;
    }
    
    // Helper function to escape HTML
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // Update the appendMsg function to use formatting
    // Find this line in appendMsg:
    // bubble.innerHTML = esc(clean);
    // Replace with:
    // bubble.innerHTML = formatBotMessage(clean);
    
    return {
        init,
        open,
        close,
        toggle,
        dismissFAB,
        restoreFAB,
        hideFAB,
        showFAB,
        toggleQNav,
        closeQNav,
        seedFromQuestion,
        injectCurrentQuestion,
        clearChat,
        send,
        toggleMic,
        showPopup,
        hidePopup
    };
})();