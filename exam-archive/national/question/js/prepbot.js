// ══════════════════════════════════════════════════════════════
//  PREPBOT (Groq first, then Gemini 2.5/3.x)
//  With integrated YouTube video player - Popular Channels First
// ══════════════════════════════════════════════════════════════
const PrepBot = (() => {

    let isOpen       = false;
    let fabDismissed = false;
    let onResults    = false;
    let chatHistory  = [];
    let contextQ     = null;
    let recognition  = null;
    let micActive    = false;
    let popupTimer   = null;
    let activeVideoPlayer = null;

    const SYSTEM_PROMPT = `You are PrepBot, a friendly and expert Nigerian secondary school exam tutor. You help students understand WAEC, JAMB, IGCSE, and Common Entrance exam questions. Be concise, clear, and encouraging. Use simple language. When explaining chemistry, biology, physics or maths, be precise. Do not use bullet points in every response — write naturally.

IMPORTANT: AI can make mistakes. Always verify important information with your teacher or textbook. Use my explanations as a guide, not as absolute truth.`;

    // Groq configuration (fastest, for quick responses)
    const GROQ_MODELS = [
        'llama3-8b-8192',
        'llama3-70b-8192',
        'mixtral-8x7b-32768'
    ];

    // Gemini models from your config - ONLY 2.5 and 3.x (no deprecated)
    const GEMINI_MODELS = [
        { label: 'Gemini 3.1 Flash-Lite', url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent' },
        { label: 'Gemini 3.1 Pro', url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-pro-preview:generateContent' },
        { label: 'Gemini 3 Flash', url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent' },
        { label: 'Gemini 2.5 Flash-Lite', url: 'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash-lite:generateContent' },
        { label: 'Gemini 2.5 Flash', url: 'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent' },
        { label: 'Gemini 2.5 Pro', url: 'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-pro:generateContent' }
    ];

    // Popular education channels prioritized (no WAEC/JAMB keywords)
    const POPULAR_CHANNELS = {
        math: [
            { name: 'Khan Academy', handle: 'khanacademy', priority: 1 },
            { name: 'The Organic Chemistry Tutor', handle: 'theorganicchemistrytutorm', priority: 2 },
            { name: '3Blue1Brown', handle: '3blue1brown', priority: 3 },
            { name: 'blackpenredpen', handle: 'blackpenredpen', priority: 4 },
            { name: 'Eddie Woo', handle: 'misterwootube', priority: 5 },
            { name: 'Professor Leonard', handle: 'professorleonard', priority: 6 },
            { name: 'Numberphile', handle: 'numberphile', priority: 7 },
            { name: 'Mathologer', handle: 'mathologer', priority: 8 }
        ],
        physics: [
            { name: 'Khan Academy', handle: 'khanacademy', priority: 1 },
            { name: 'The Organic Chemistry Tutor', handle: 'theorganicchemistrytutorm', priority: 2 },
            { name: 'Veritasium', handle: 'veritasium', priority: 3 },
            { name: 'MinutePhysics', handle: 'minutephysics', priority: 4 },
            { name: 'Physics Girl', handle: 'physicsgirl', priority: 5 },
            { name: 'Flipping Physics', handle: 'flippingphysics', priority: 6 },
            { name: 'SciShow', handle: 'scishow', priority: 7 }
        ],
        chemistry: [
            { name: 'Khan Academy', handle: 'khanacademy', priority: 1 },
            { name: 'The Organic Chemistry Tutor', handle: 'theorganicchemistrytutorm', priority: 2 },
            { name: 'Tyler DeWitt', handle: 'tylerdewitt', priority: 3 },
            { name: 'NileRed', handle: 'nilered', priority: 4 },
            { name: 'Periodic Videos', handle: 'periodicvideos', priority: 5 },
            { name: 'Professor Dave Explains', handle: 'professordaveexplains', priority: 6 }
        ],
        biology: [
            { name: 'Khan Academy', handle: 'khanacademy', priority: 1 },
            { name: 'Amoeba Sisters', handle: 'amoebasisters', priority: 2 },
            { name: 'Kurzgesagt', handle: 'kurzgesagt', priority: 3 },
            { name: 'Professor Dave Explains', handle: 'professordaveexplains', priority: 4 },
            { name: 'SciShow', handle: 'scishow', priority: 5 },
            { name: 'CrashCourse', handle: 'crashcourse', priority: 6 }
        ],
        english: [
            { name: 'Khan Academy', handle: 'khanacademy', priority: 1 },
            { name: 'CrashCourse', handle: 'crashcourse', priority: 2 },
            { name: 'TED-Ed', handle: 'teded', priority: 3 },
            { name: 'English with Lucy', handle: 'englishwithlucy', priority: 4 },
            { name: 'BBC Learning English', handle: 'bbclearningenglish', priority: 5 }
        ],
        general: [
            { name: 'Khan Academy', handle: 'khanacademy', priority: 1 },
            { name: 'CrashCourse', handle: 'crashcourse', priority: 2 },
            { name: 'TED-Ed', handle: 'teded', priority: 3 },
            { name: 'Kurzgesagt', handle: 'kurzgesagt', priority: 4 },
            { name: 'SciShow', handle: 'scishow', priority: 5 },
            { name: 'Professor Dave Explains', handle: 'professordaveexplains', priority: 6 }
        ]
    };

    function detectSubject(questionText) {
        const text = questionText.toLowerCase();
        if (text.match(/math|algebra|geometry|calculus|trigonometry|equation|solve for|find x|differentiate|integral/i)) {
            return 'math';
        }
        if (text.match(/physics|force|velocity|acceleration|energy|momentum|electric|magnetic|circuit|newton|gravity/i)) {
            return 'physics';
        }
        if (text.match(/chemistry|chemical|reaction|molecule|atom|bond|acid|base|solution|compound|periodic table/i)) {
            return 'chemistry';
        }
        if (text.match(/biology|cell|organism|dna|protein|enzyme|photosynthesis|respiration|evolution|ecosystem/i)) {
            return 'biology';
        }
        if (text.match(/english|grammar|vocabulary|essay|writing|reading comprehension|literature|poem|novel/i)) {
            return 'english';
        }
        return 'general';
    }

    function getPrioritizedChannels(questionText) {
        const subject = detectSubject(questionText);
        const channels = POPULAR_CHANNELS[subject] || POPULAR_CHANNELS.general;
        // Sort by priority
        return [...channels].sort((a, b) => a.priority - b.priority);
    }

    function groqKey() {
        return window.PrepPortalKeys?.groq || null;
    }

    // Call Groq first (fastest for quick responses)
    async function callGroq(messages, maxTokens = 500) {
        const key = groqKey();
        if (!key) throw new Error('No Groq key available');
        
        const formattedMessages = messages.map(m => ({
            role: m.role === 'assistant' ? 'assistant' : 'user',
            content: m.content
        }));
        
        let lastError = null;
        
        for (const model of GROQ_MODELS) {
            try {
                const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${key}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        model: model,
                        messages: formattedMessages,
                        temperature: 0.6,
                        max_tokens: maxTokens
                    })
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }
                
                const data = await response.json();
                const text = data?.choices?.[0]?.message?.content;
                if (text) {
                    console.log(`Used Groq model: ${model}`);
                    return text;
                }
            } catch (error) {
                console.warn(`Groq model ${model} failed:`, error);
                lastError = error;
            }
        }
        
        throw lastError || new Error('All Groq models failed');
    }

    // Call Gemini models in order (from smallest/fastest to largest/most capable)
    async function callGemini(messages, maxTokens = 700) {
        const key = geminiKey();
        if (!key) throw new Error('No Gemini key available');
        
        const contents = messages.map(m => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }]
        }));
        
        let lastError = null;
        
        for (const model of GEMINI_MODELS) {
            try {
                const url = `${model.url}?key=${encodeURIComponent(key)}`;
                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents,
                        generationConfig: {
                            temperature: 0.6,
                            maxOutputTokens: maxTokens,
                            topP: 0.95
                        }
                    })
                });
                
                if (response.status === 404) {
                    console.warn(`Gemini model ${model.label} not found, trying next...`);
                    continue;
                }
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }
                
                const data = await response.json();
                const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
                if (text) {
                    console.log(`Used Gemini model: ${model.label}`);
                    return text;
                }
            } catch (error) {
                console.warn(`Gemini model ${model.label} failed:`, error);
                lastError = error;
            }
        }
        
        throw lastError || new Error('All Gemini models failed');
    }

    // Smart router: try Groq first, then Gemini fallback
    async function callSmartAI(messages, maxTokens = 500) {
        try {
            return await callGroq(messages, maxTokens);
        } catch (groqError) {
            console.warn('Groq failed, falling back to Gemini:', groqError.message);
            showThinkingIndicator('Switching to Gemini AI...');
            return await callGemini(messages, Math.min(maxTokens + 200, 800));
        }
    }

    function showThinkingIndicator(message) {
        const indicator = document.getElementById('thinking-indicator');
        if (indicator) {
            indicator.textContent = message;
            indicator.style.display = 'block';
            setTimeout(() => {
                if (indicator.style.display === 'block') {
                    indicator.style.display = 'none';
                }
            }, 2000);
        }
    }

    // Search YouTube using specific channel (no WAEC/JAMB keywords)
    async function searchChannelVideo(channelHandle, topicQuery) {
        const key = ytKey();
        if (!key) return null;
        
        // Clean query - remove WAEC/JAMB and exam references
        let cleanQuery = topicQuery
            .replace(/WAEC|JAMB|NECO|exam|question|practice test/gi, '')
            .replace(/\s+/g, ' ')
            .trim();
        
        // Add channel-specific search
        const searchQuery = `${cleanQuery} ${channelHandle} lesson`;
        
        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=3&channelId=${channelHandle}&q=${encodeURIComponent(cleanQuery)}&key=${encodeURIComponent(key)}`;
        
        try {
            const response = await fetch(url);
            if (!response.ok) return null;
            const data = await response.json();
            if (data.items && data.items.length > 0) {
                const item = data.items[0];
                return {
                    videoId: item.id.videoId,
                    title: item.snippet.title,
                    channel: item.snippet.channelTitle,
                    thumb: item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url || ''
                };
            }
        } catch (error) {
            console.warn(`Search failed for channel ${channelHandle}:`, error);
        }
        return null;
    }

    // Search YouTube by topic without channel restriction (no WAEC/JAMB)
    async function searchByTopic(topicQuery) {
        const key = ytKey();
        if (!key) return null;
        
        let cleanQuery = topicQuery
            .replace(/WAEC|JAMB|NECO|exam|question|practice test/gi, '')
            .replace(/\s+/g, ' ')
            .trim();
        
        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=5&q=${encodeURIComponent(cleanQuery + ' lesson tutorial')}&key=${encodeURIComponent(key)}`;
        
        try {
            const response = await fetch(url);
            if (!response.ok) return null;
            const data = await response.json();
            if (data.items && data.items.length > 0) {
                const item = data.items[0];
                return {
                    videoId: item.id.videoId,
                    title: item.snippet.title,
                    channel: item.snippet.channelTitle,
                    thumb: item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url || ''
                };
            }
        } catch (error) {
            console.warn('Topic search failed:', error);
        }
        return null;
    }

    // Main video search - prioritizes popular channels
    async function findBestVideo(questionText) {
        // Extract core concept from question (remove question numbers, etc.)
        let coreConcept = questionText
            .replace(/^Q\d+:\s*/i, '')
            .replace(/\?.*$/, '')
            .replace(/[\(\)]/g, '')
            .split('.')[0]
            .trim();
        
        // Limit length
        if (coreConcept.length > 80) {
            coreConcept = coreConcept.slice(0, 80);
        }
        
        // Get prioritized channels for this subject
        const channels = getPrioritizedChannels(questionText);
        
        // Try each popular channel in priority order
        for (const channel of channels) {
            const video = await searchChannelVideo(channel.handle, coreConcept);
            if (video) {
                console.log(`Found video on ${channel.name} channel`);
                return video;
            }
        }
        
        // Fallback to topic search if no channel videos found
        console.log('No channel videos found, trying topic search');
        return await searchByTopic(coreConcept);
    }

    // ── YouTube Video Player in Chat ─────────────────────────
    function createVideoPlayerInChat(videoId, title, channel) {
        if (activeVideoPlayer && activeVideoPlayer.parentNode) {
            activeVideoPlayer.remove();
        }
        
        const playerDiv = document.createElement('div');
        playerDiv.className = 'chat-video-player';
        playerDiv.innerHTML = `
            <div class="chat-video-header">
                <div class="chat-video-title">${esc(title)}</div>
                <div class="chat-video-channel">${esc(channel)}</div>
                <button class="chat-video-close" title="Close video">✕</button>
            </div>
            <div class="chat-video-container">
                <iframe 
                    src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1" 
                    title="YouTube video player" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen>
                </iframe>
            </div>
        `;
        
        const closeBtn = playerDiv.querySelector('.chat-video-close');
        closeBtn.addEventListener('click', () => {
            playerDiv.remove();
            activeVideoPlayer = null;
        });
        
        activeVideoPlayer = playerDiv;
        return playerDiv;
    }

    async function searchAndPlayVideo() {
        if (!contextQ) return;
        
        const thinkingEl = appendMsg('bot', 'Searching for video from top educators...', true);
        
        try {
            const video = await findBestVideo(contextQ.questionText);
            thinkingEl.remove();
            
            if (!video) {
                appendMsg('bot', 'No video found for this topic. Try a different question or search manually on YouTube.');
                return;
            }
            
            const player = createVideoPlayerInChat(video.videoId, video.title, video.channel);
            
            const msgs = document.getElementById('chat-messages');
            const playerWrapper = document.createElement('div');
            playerWrapper.className = 'chat-msg bot';
            playerWrapper.appendChild(player);
            msgs.appendChild(playerWrapper);
            msgs.scrollTop = msgs.scrollHeight;
            
        } catch (error) {
            thinkingEl.remove();
            appendMsg('bot', `Could not load video: ${error.message}`);
        }
    }

    function addVideoPlayChip() {
        const wrap = document.getElementById('suggestion-chips');
        if (wrap.querySelector('.video-play-chip')) return;
        
        const btn = document.createElement('button');
        btn.className = 'suggestion-chip video-play-chip';
        btn.innerHTML = `▶ Watch Video Lesson`;
        btn.addEventListener('click', () => searchAndPlayVideo());
        wrap.appendChild(btn);
    }

    function init() {
        document.getElementById('chat-input').addEventListener('keydown', e => {
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
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
                <div class="chat-intro-text" style="font-size:0.7rem; margin-top:8px; color:var(--muted);">Note: AI can make mistakes. Always verify with your teacher.</div>
            </div>`;
        renderActionPills();
    }

    function renderActionPills() {
        document.querySelectorAll('.prepbot-action-bar').forEach(el => el.remove());

        const state = Quiz.getState();
        if (!state.allQuestions.length) return;

        const q   = state.allQuestions[state.currentIndex];
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
            Q${idx + 1} - Ask about this question`;
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
            pill.title = question.question.length > 70
                ? question.question.slice(0, 70) + '...'
                : question.question;

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
        const state   = Quiz.getState();
        const q       = state.allQuestions[state.currentIndex];
        const idx     = state.currentIndex;
        const letters = ['A','B','C','D','E'];

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
        const explText = Array.isArray(q.explanation)
            ? q.explanation.join('\n')
            : (q.explanation || '');

        contextQ = { questionText: q.question, correctAnswer: q._answer, explanationText: explText };

        const banner = document.getElementById('chat-context-banner');
        document.getElementById('chat-context-text').textContent =
            q.question.length > 120 ? q.question.slice(0, 120) + '...' : q.question;
        banner.classList.add('active');

        chatHistory = [
            {
                role: 'user',
                content: `${SYSTEM_PROMPT}\n\nThe student is looking at this exam question:\n\n${questionBlock}\n\n` +
                    (explText ? `Official explanation: ${explText}\n\n` : '') +
                    `Please explain this question clearly. Cover the concept being tested, why the correct answer is right, and why the other options are wrong. Be concise.`
            }
        ];

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
            questionText.length > 120 ? questionText.slice(0, 120) + '...' : questionText;
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
        contextQ    = null;
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
            if (btn) { btn.style.background = 'var(--blue)'; btn.style.color = 'var(--white)'; }
        } else {
            closeQNav();
        }
    }

    function closeQNav() {
        const bar = document.getElementById('qbubbles-bar');
        if (bar) bar.style.display = 'none';
        const btn = document.getElementById('qnav-toggle-btn');
        if (btn) { btn.style.background = ''; btn.style.borderColor = ''; btn.style.color = ''; }
    }

    function buildQBubbles() {
        const grid  = document.getElementById('qbubbles-grid');
        if (!grid) return;
        const state = Quiz.getState();
        grid.innerHTML = '';
        state.allQuestions.forEach((q, i) => {
            const btn = document.createElement('button');
            btn.className = 'qbubble';
            btn.textContent = i + 1;
            btn.title = q.question.length > 60 ? q.question.slice(0, 60) + '...' : q.question;
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
        const text    = inputEl.value.trim();
        if (!text) return;

        inputEl.value = ''; inputEl.style.height = 'auto';
        sendBtn.disabled = true;
        clearSuggestions();

        appendMsg('user', text);

        if (chatHistory.length === 0) {
            chatHistory.push({ role: 'user', content: SYSTEM_PROMPT + '\n\n' + text });
        } else {
            chatHistory.push({ role: 'user', content: text });
        }

        const thinkingEl = appendMsg('bot', 'Thinking...', true);

        try {
            const reply = await callSmartAI(chatHistory);
            thinkingEl.remove();
            appendMsg('bot', reply);
            chatHistory.push({ role: 'assistant', content: reply });
            if (ytKey() && contextQ) {
                addVideoPlayChip();
            }
            addFollowUpChips(reply);
        } catch(e) {
            thinkingEl.remove();
            appendMsg('bot', `Could not connect right now. (${e.message})`);
        }

        sendBtn.disabled = false;
        inputEl.focus();
    }

    async function streamBotResponse() {
        const sendBtn = document.getElementById('chat-send');
        sendBtn.disabled = true;
        const thinkingEl = appendMsg('bot', 'Thinking...', true);
        try {
            const reply = await callSmartAI(chatHistory);
            thinkingEl.remove();
            chatHistory.push({ role: 'assistant', content: reply });
            appendMsg('bot', reply);
            if (ytKey() && contextQ) {
                addVideoPlayChip();
            }
            addFollowUpChips(reply);
        } catch(e) {
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

        if (role === 'bot' && !thinking) {
            const clean = text.replace(/\[SUGGESTIONS?:[^\]]+\]/gi, '').trim();
            bubble.innerHTML = esc(clean);
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
        const wrap  = document.getElementById('suggestion-chips');
        wrap.innerHTML = '';
        chips.slice(0, 3).forEach(chip => {
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

    function toggleMic() {
        if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
            showPopup('Voice input is not supported in this browser.');
            return;
        }
        if (micActive) { recognition?.stop(); return; }
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SR();
        recognition.lang = 'en-NG'; recognition.interimResults = false;
        recognition.onresult = e => { document.getElementById('chat-input').value = e.results[0][0].transcript; };
        recognition.onend  = () => { micActive = false; document.getElementById('chat-mic').classList.remove('mic-active'); };
        recognition.onerror= () => { micActive = false; document.getElementById('chat-mic').classList.remove('mic-active'); };
        micActive = true;
        document.getElementById('chat-mic').classList.add('mic-active');
        recognition.start();
    }

    return {
        init, open, close, toggle,
        dismissFAB, restoreFAB,
        hideFAB, showFAB,
        toggleQNav, closeQNav,
        seedFromQuestion, injectCurrentQuestion,
        clearChat, send, toggleMic,
        showPopup, hidePopup
    };
})();