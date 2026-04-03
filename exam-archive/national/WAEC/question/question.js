/* ═══════════════════════════════════════════════════════════
   PREP PORTAL — WASSCE Practice Paper
   question.js — Quiz engine + PrepBot + Video Search + Theory AI
   ═══════════════════════════════════════════════════════════ */

'use strict';

// ── CONFIG ─────────────────────────────────────────────────────
const GEMINI_MODELS = ['gemini-2.5-flash-lite', 'gemini-2.0-flash', 'gemini-1.5-flash'];

const urlParams = new URLSearchParams(window.location.search);
const PAGE_CONFIG = {
    year: urlParams.get('year'),
    subjects: urlParams.get('subjects')?.split(',') || [],
    types: urlParams.get('types')?.split(',') || []
};

// ── HELPERS ────────────────────────────────────────────────────
function esc(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function geminiKey() {
    return window.PrepPortalKeys?.gemini || window.state?.GEMINI_KEY || null;
}

function ytKey() {
    return window.PrepPortalKeys?.youtube || window.state?.YT_KEY || null;
}

async function callGemini(prompt, maxTokens = 600) {
    const key = geminiKey();
    if (!key) throw new Error('No Gemini key. Add your key in API Keys.');
    let lastErr = null;
    for (const model of GEMINI_MODELS) {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`;
        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: { temperature: 0.4, maxOutputTokens: maxTokens }
                })
            });
            if (res.status === 404) continue;
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const d = await res.json();
            return d?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
        } catch (e) { lastErr = e; }
    }
    throw lastErr || new Error('All Gemini models failed');
}

async function callGeminiChat(messages, maxTokens = 700) {
    const key = geminiKey();
    if (!key) throw new Error('No Gemini key.');
    const contents = messages.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
    }));
    let lastErr = null;
    for (const model of GEMINI_MODELS) {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`;
        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents, generationConfig: { temperature: 0.6, maxOutputTokens: maxTokens } })
            });
            if (res.status === 404) continue;
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const d = await res.json();
            return d?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
        } catch (e) { lastErr = e; }
    }
    throw lastErr || new Error('All Gemini models failed');
}

async function searchYouTube(query, maxResults = 3) {
    const key = ytKey();
    if (!key) return [];
    try {
        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=${maxResults}&q=${encodeURIComponent(query)}&key=${encodeURIComponent(key)}`;
        const res = await fetch(url);
        if (!res.ok) return [];
        const d = await res.json();
        return (d.items || []).map(item => ({
            id: item.id.videoId,
            title: item.snippet.title,
            channel: item.snippet.channelTitle,
            thumb: item.snippet.thumbnails?.default?.url || ''
        }));
    } catch (e) { return []; }
}

function typesetEl(el) {
    if (!el || typeof MathJax === 'undefined' || !MathJax.typesetPromise) return Promise.resolve();
    MathJax.typesetClear([el]);
    return MathJax.typesetPromise([el]).catch(() => {});
}

function injectScript(src) {
    return new Promise((res, rej) => {
        const s = document.createElement('script');
        s.src = src;
        s.onload = res;
        s.onerror = rej;
        document.head.appendChild(s);
    });
}

// ══════════════════════════════════════════════════════════════
//  QUIZ ENGINE
// ══════════════════════════════════════════════════════════════
const Quiz = (() => {
    
    let allQuestions = [];
    let currentIndex = 0;
    let userAnswers = {};
    let submitted = false;
    let theoryMarks = {};
    
    // DOM elements cache
    let elements = {};
    
    // ── Answer resolver ──────────────────────────────────────
    function resolveAnswer(q) {
        const opts = q.options || [];
        for (const f of ['correctIndex', 'correct_index', 'answerIndex', 'answer_index']) {
            if (q[f] !== undefined && q[f] !== null) {
                const i = parseInt(q[f], 10);
                if (!isNaN(i) && opts[i] !== undefined) return opts[i];
            }
        }
        const raw = q.answer ?? q.correct ?? q.correctAnswer ??
            q.correctOption ?? q.correct_answer ?? q.key ?? null;
        if (raw === null) return null;
        if (typeof raw === 'number') return opts[raw] ?? null;
        const s = String(raw).trim();
        if (/^[A-Ea-e]$/.test(s)) return opts[s.toUpperCase().charCodeAt(0) - 65] ?? null;
        if (/^\d$/.test(s)) return opts[parseInt(s, 10)] ?? null;
        return s || null;
    }
    
    // ── Bootstrap ────────────────────────────────────────────
    function init() {
        cacheElements();
        
        const subText = (PAGE_CONFIG.subjects || []).join(' & ') || 'Practice Paper';
        const metaText = `WASSCE ${PAGE_CONFIG.year||'—'} • ${(PAGE_CONFIG.types||[]).join(' & ').toUpperCase()}`;
        
        if (elements.displaySubject) elements.displaySubject.textContent = subText;
        if (elements.displayMeta) elements.displayMeta.textContent = metaText;
        if (elements.printHeader) elements.printHeader.textContent =
            `Prep Portal · WASSCE ${PAGE_CONFIG.year||''} · ${subText} · Results`;
        
        // Attach event listeners (no inline onclick)
        attachEventListeners();
        
        loadAndRender();
    }
    
    function cacheElements() {
        elements = {
            displaySubject: document.getElementById('display-subject'),
            displayMeta: document.getElementById('display-meta'),
            printHeader: document.getElementById('print-header'),
            quitLink: document.getElementById('quit-link'),
            loadingState: document.getElementById('loading-state'),
            questionCard: document.getElementById('question-card'),
            navBar: document.getElementById('nav-bar'),
            qCounterLabel: document.getElementById('q-counter-label'),
            progressFill: document.getElementById('progress-fill'),
            qNumberBadge: document.getElementById('q-number-badge'),
            qText: document.getElementById('q-text'),
            qImageWrap: document.getElementById('q-image-wrap'),
            qOptions: document.getElementById('q-options'),
            feedbackStrip: document.getElementById('feedback-strip'),
            feedbackLabel: document.getElementById('feedback-label'),
            feedbackExpl: document.getElementById('feedback-expl'),
            feedbackActions: document.getElementById('feedback-actions'),
            prevBtn: document.getElementById('prev-btn'),
            nextBtn: document.getElementById('next-btn'),
            submitBtn: document.getElementById('submit-btn'),
            qDots: document.getElementById('q-dots'),
            quizScreen: document.getElementById('quiz-screen'),
            resultsScreen: document.getElementById('results-screen'),
            resScore: document.getElementById('res-score'),
            resGrade: document.getElementById('res-grade'),
            resCorrect: document.getElementById('res-correct'),
            resWrong: document.getElementById('res-wrong'),
            resSkipped: document.getElementById('res-skipped'),
            reviewList: document.getElementById('review-list')
        };
    }
    
    function attachEventListeners() {
        // Quit link
        if (elements.quitLink) {
            elements.quitLink.addEventListener('click', (e) => {
                e.preventDefault();
                window.history.back();
            });
        }
        
        // Prev button
        if (elements.prevBtn) {
            elements.prevBtn.addEventListener('click', () => navigate(-1));
        }
        
        // Next button
        if (elements.nextBtn) {
            elements.nextBtn.addEventListener('click', () => navigate(1));
        }
        
        // Submit button
        if (elements.submitBtn) {
            elements.submitBtn.addEventListener('click', () => confirmSubmit());
        }
        
        // Create confirm overlay if not exists
        ensureConfirmOverlay();
    }
    
    function ensureConfirmOverlay() {
        if (document.getElementById('pp-confirm-overlay')) return;
        
        const overlay = document.createElement('div');
        overlay.id = 'pp-confirm-overlay';
        overlay.className = 'confirm-overlay';
        overlay.innerHTML = `
            <div class="confirm-modal">
                <div class="confirm-title">Submit Exam</div>
                <div class="confirm-body" id="confirm-body">Are you sure you want to submit?</div>
                <div class="confirm-actions">
                    <button class="confirm-cancel" id="confirm-cancel">Cancel</button>
                    <button class="confirm-submit" id="confirm-submit">Submit</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
        
        document.getElementById('confirm-cancel')?.addEventListener('click', () => closeConfirm());
        document.getElementById('confirm-submit')?.addEventListener('click', () => submit());
    }
    
    async function loadAndRender() {
        for (const sub of PAGE_CONFIG.subjects) {
            const subKey = sub.toLowerCase().replace(/\s+/g, '');
            for (const type of PAGE_CONFIG.types) {
                const path = `../${subKey}/${PAGE_CONFIG.year}/${type}.js`;
                try {
                    await injectScript(path);
                    const vName = `${subKey}${type.charAt(0).toUpperCase()+type.slice(1)}`;
                    let data;
                    try { data = window[vName] || eval(vName); } catch (_) {}
                    if (!data) continue;
                    
                    if (type === 'objective') {
                        data.forEach(q => {
                            const obj = { ...q, subject: sub, type };
                            obj._answer = resolveAnswer(obj);
                            allQuestions.push(obj);
                        });
                    } else {
                        const items = Array.isArray(data) ? data : Object.values(data);
                        items.forEach(q => {
                            if (typeof q === 'string') {
                                allQuestions.push({ subject: sub, type, question: q, _answer: null });
                            } else {
                                allQuestions.push({ ...q, subject: sub, type, _answer: null });
                            }
                        });
                    }
                } catch (_) { console.warn('Could not load:', path); }
            }
        }
        
        if (elements.loadingState) elements.loadingState.style.display = 'none';
        
        if (allQuestions.length === 0) {
            if (elements.questionCard) {
                elements.questionCard.style.display = 'flex';
                elements.questionCard.innerHTML = `
                    <div style="padding:40px;text-align:center">
                        <strong style="font-family:var(--font-display);font-size:15px">No Questions Found</strong>
                        <p style="font-size:12px;opacity:.6;margin-top:8px">Check file paths and variable names.</p>
                    </div>`;
            }
            return;
        }
        
        buildDotMap();
        renderQuestion(0);
        if (elements.questionCard) elements.questionCard.style.display = 'flex';
        if (elements.navBar) elements.navBar.style.display = 'grid';
    }
    
    function buildDotMap() {
        if (!elements.qDots) return;
        elements.qDots.innerHTML = '';
        allQuestions.forEach((_, i) => {
            const d = document.createElement('button');
            d.className = 'q-dot';
            d.title = `Q${i+1}`;
            d.addEventListener('click', () => renderQuestion(i));
            elements.qDots.appendChild(d);
        });
        updateDots();
    }
    
    function updateDots() {
        if (!elements.qDots) return;
        const dots = elements.qDots.querySelectorAll('.q-dot');
        dots.forEach((d, i) => {
            d.classList.remove('answered', 'current', 'correct', 'wrong', 'theory-marked');
            const q = allQuestions[i];
            const chosen = userAnswers[i];
            const ans = q._answer;
            if (submitted) {
                if (q.type !== 'objective') {
                    if (theoryMarks[i]) d.classList.add('theory-marked');
                    else if (chosen) d.classList.add('answered');
                } else if (!chosen) {
                    /* unanswered — grey */
                } else if (ans === null) {
                    d.classList.add('answered');
                } else if (chosen === ans) {
                    d.classList.add('correct');
                } else {
                    d.classList.add('wrong');
                }
            } else {
                if (i === currentIndex) d.classList.add('current');
                else if (chosen !== undefined) d.classList.add('answered');
            }
        });
    }
    
    function renderQuestion(idx) {
        currentIndex = idx;
        const q = allQuestions[idx];
        const total = allQuestions.length;
        
        if (elements.qCounterLabel) elements.qCounterLabel.textContent = `Q ${idx+1} of ${total}`;
        if (elements.progressFill) elements.progressFill.style.width = `${((idx+1)/total)*100}%`;
        if (elements.qNumberBadge) elements.qNumberBadge.textContent =
            `Q ${idx+1}  •  ${q.subject}  •  ${q.type.toUpperCase()}`;
        
        if (elements.qText) {
            elements.qText.innerHTML = esc(q.question);
        }
        
        // Image
        if (elements.qImageWrap) {
            elements.qImageWrap.innerHTML = '';
            if (q.image) {
                const img = document.createElement('img');
                img.className = 'q-image';
                img.src = q.image;
                img.alt = `Q${idx+1} diagram`;
                elements.qImageWrap.appendChild(img);
            }
        }
        
        // Options
        if (elements.qOptions) {
            elements.qOptions.innerHTML = '';
            
            if (q.type === 'objective') {
                const grid = document.createElement('div');
                grid.className = 'options-grid';
                const letters = ['A', 'B', 'C', 'D', 'E'];
                (q.options || []).forEach((opt, oi) => {
                    const btn = document.createElement('button');
                    btn.className = 'option-btn';
                    if (submitted) {
                        btn.disabled = true;
                        if (q._answer !== null && opt === q._answer) btn.classList.add('correct-ans');
                        else if (userAnswers[idx] === opt) btn.classList.add('wrong-ans');
                    } else if (userAnswers[idx] === opt) {
                        btn.classList.add('selected');
                    }
                    btn.innerHTML = `<span class="opt-letter">${letters[oi]||oi+1}</span><span>${esc(opt)}</span>`;
                    btn.addEventListener('click', () => selectOption(opt, btn, grid, idx));
                    grid.appendChild(btn);
                });
                elements.qOptions.appendChild(grid);
                
                if (!submitted && q.hint) {
                    const h = document.createElement('div');
                    h.className = 'hint-row';
                    h.innerHTML = `<span class="hint-lbl">Hint</span><span>${esc(q.hint)}</span>`;
                    elements.qOptions.appendChild(h);
                }
            } else {
                // Theory
                const ta = document.createElement('textarea');
                ta.className = 'theory-box';
                ta.placeholder = 'Write your answer here…';
                ta.value = userAnswers[idx] || '';
                if (submitted) ta.disabled = true;
                ta.addEventListener('input', () => { 
                    userAnswers[idx] = ta.value;
                    updateDots(); 
                });
                elements.qOptions.appendChild(ta);
                
                if (submitted && theoryMarks[idx]) {
                    const m = theoryMarks[idx];
                    const mEl = document.createElement('div');
                    mEl.style.cssText = 'margin-top:12px;padding:12px;border:2px solid var(--blue);background:rgba(0,85,255,.05)';
                    mEl.innerHTML = `
                        <div class="theory-score-badge">AI Mark: ${m.score}/${m.outOf}</div>
                        <div class="theory-mark-text">${esc(m.feedback)}</div>`;
                    elements.qOptions.appendChild(mEl);
                } else if (submitted && userAnswers[idx]) {
                    const sp = document.createElement('div');
                    sp.className = 'ai-marking-row';
                    sp.innerHTML = `<div class="ai-spin"></div>AI Marking…`;
                    elements.qOptions.appendChild(sp);
                }
            }
        }
        
        renderFeedback(idx);
        updateNavButtons(idx, total);
        updateDots();
        
        // Typeset math on the card
        if (elements.questionCard) typesetEl(elements.questionCard);
        if (elements.feedbackStrip) typesetEl(elements.feedbackStrip);
    }
    
    function updateNavButtons(idx, total) {
        if (elements.prevBtn) elements.prevBtn.disabled = (idx === 0);
        const isLast = (idx === total - 1);
        if (elements.nextBtn) elements.nextBtn.style.display = isLast ? 'none' : 'inline-flex';
        if (elements.submitBtn) elements.submitBtn.style.display = isLast ? 'inline-flex' : 'none';
    }
    
    function renderFeedback(idx) {
        if (!elements.feedbackStrip || !elements.feedbackLabel || !elements.feedbackExpl || !elements.feedbackActions) return;
        
        const q = allQuestions[idx];
        const ans = q._answer;
        
        elements.feedbackStrip.className = 'feedback-strip';
        elements.feedbackExpl.innerHTML = '';
        elements.feedbackActions.innerHTML = '';
        
        if (!submitted) return;
        
        function buildExpl(raw) {
            if (!raw) return '';
            const lines = Array.isArray(raw) ? raw : [raw];
            return lines.map(l => `<p class="expl-line">${esc(l)}</p>`).join('');
        }
        
        function addVideoBtn() {
            const btn = document.createElement('button');
            btn.className = 'search-videos-btn';
            btn.innerHTML = `<svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" stroke-width="1.8"><polygon points="4,2 10,5.5 4,9"/></svg> Videos`;
            btn.addEventListener('click', () => showVideoResults(idx, q));
            elements.feedbackActions.appendChild(btn);
        }
        
        
        if (q.type !== 'objective') {
            const mark = theoryMarks[idx];
            if (mark) {
                elements.feedbackStrip.classList.add('neutral');
                elements.feedbackLabel.textContent = `AI Mark: ${mark.score}/${mark.outOf}`;
                elements.feedbackExpl.innerHTML = `<p class="expl-line">${esc(mark.feedback)}</p>`;
            } else if (userAnswers[idx]) {
                elements.feedbackStrip.classList.add('neutral');
                elements.feedbackLabel.textContent = 'Theory — marking with AI…';
            } else {
                elements.feedbackStrip.classList.add('wrong');
                elements.feedbackLabel.textContent = 'No answer submitted.';
            }
            
            return;
        }
        
        const chosen = userAnswers[idx];
        if (!chosen) {
            elements.feedbackStrip.classList.add('wrong');
            elements.feedbackLabel.textContent = 'Not answered.';
            elements.feedbackExpl.innerHTML = ans ?
                `<p class="expl-line">Correct answer: <strong>${esc(ans)}</strong></p>` + buildExpl(q.explanation) :
                '<p class="expl-line">No answer key for this question.</p>';
        } else if (ans === null) {
            elements.feedbackStrip.classList.add('neutral');
            elements.feedbackLabel.textContent = `You selected: ${chosen}`;
            elements.feedbackExpl.innerHTML = '<p class="expl-line">No answer key — cannot verify.</p>';
        } else if (chosen === ans) {
            elements.feedbackStrip.classList.add('correct');
            elements.feedbackLabel.textContent = 'Correct!';
            elements.feedbackExpl.innerHTML = buildExpl(q.explanation);
        } else {
            elements.feedbackStrip.classList.add('wrong');
            elements.feedbackLabel.textContent = `Wrong — you chose: ${chosen}`;
            elements.feedbackExpl.innerHTML =
                `<p class="expl-line">Correct answer: <strong>${esc(ans)}</strong></p>` +
                buildExpl(q.explanation);
        }
        
        
        if (ytKey()) addVideoBtn();
        
        typesetEl(elements.feedbackStrip);
    }
    
    
    async function showVideoResults(idx, q) {
        const acts = elements.feedbackActions;
        const vidEl = document.getElementById(`video-results-${idx}`);
        if (vidEl) { vidEl.remove(); return; }
        
        const wrap = document.createElement('div');
        wrap.id = `video-results-${idx}`;
        wrap.className = 'video-results-strip';
        wrap.innerHTML = `<div class="video-results-title">🔍 Searching YouTube...</div>`;
        acts.insertAdjacentElement('afterend', wrap);
        
        const query = `WAEC ${q.subject} ${q.question.slice(0,80)}`;
        const videos = await searchYouTube(query, 3);
        
        if (!videos.length) {
            wrap.innerHTML = `<div class="video-results-title">No videos found.</div>`;
            return;
        }
        
        wrap.innerHTML = `<div class="video-results-title">📺 Related Videos</div>` + videos.map(v => `
            <a class="video-card" href="https://www.youtube.com/watch?v=${v.id}" target="_blank" rel="noopener">
                <img class="video-thumb" src="${v.thumb}" alt="${esc(v.title)}">
                <div class="video-meta">
                    <div class="video-title">${esc(v.title)}</div>
                    <div class="video-channel">${esc(v.channel)}</div>
                </div>
            </a>`).join('');
    }
    
    function selectOption(opt, btn, grid, idx) {
        if (submitted) return;
        grid.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        userAnswers[idx] = opt;
        updateDots();
    }
    
    function navigate(delta) {
        const n = currentIndex + delta;
        if (n < 0 || n >= allQuestions.length) return;
        renderQuestion(n);
    }
    
    function confirmSubmit() {
        const answered = Object.keys(userAnswers)
            .filter(k => userAnswers[k] !== undefined && userAnswers[k] !== '').length;
        const total = allQuestions.length;
        const confirmBody = document.getElementById('confirm-body');
        if (confirmBody) {
            confirmBody.textContent = `You have answered ${answered} of ${total} questions.` +
                (answered < total ? ` ${total-answered} unanswered will be skipped.` : ' Ready to submit?');
        }
        const overlay = document.getElementById('pp-confirm-overlay');
        if (overlay) overlay.classList.add('open');
    }
    
    function closeConfirm() {
        const overlay = document.getElementById('pp-confirm-overlay');
        if (overlay) overlay.classList.remove('open');
    }
    
    function submit() {
        closeConfirm();
        submitted = true;
        renderQuestion(currentIndex);
        if (elements.submitBtn) {
            elements.submitBtn.disabled = true;
            elements.submitBtn.textContent = 'Submitted';
        }
        runTheoryMarking();
        setTimeout(showResults, 900);
    }
    
    async function runTheoryMarking() {
        for (let i = 0; i < allQuestions.length; i++) {
            const q = allQuestions[i];
            if (q.type !== 'theory' && q.type !== 'essay') continue;
            const answer = userAnswers[i] || '';
            if (!answer.trim() || !geminiKey()) continue;
            try {
                const result = await markTheory(q.question, answer, q.markScheme || '');
                theoryMarks[i] = result;
                updateDots();
                if (currentIndex === i) renderQuestion(i);
                updateReviewTheoryItem(i, result);
            } catch (e) { console.warn(`Theory marking Q${i+1}:`, e.message); }
        }
    }
    
    async function markTheory(question, studentAnswer, markScheme = '') {
        const prompt = `You are an experienced WAEC examiner.

QUESTION:
${question}
${markScheme ? `\nMARK SCHEME:\n${markScheme}` : ''}

STUDENT'S ANSWER:
${studentAnswer}

Mark out of 10. Be fair, constructive, and specific. Note what was correct and what was missing.

Respond ONLY as raw JSON (no markdown):
{"score":7,"outOf":10,"feedback":"Your explanation of X was correct. You missed Y."}`;
        
        const raw = await callGemini(prompt, 400);
        const clean = raw.replace(/```[a-z]*\n?/gi, '').replace(/```/g, '').trim();
        const p = JSON.parse(clean);
        if (p.score === undefined || !p.feedback) throw new Error('Bad AI response');
        return { score: p.score, outOf: p.outOf || 10, feedback: p.feedback };
    }
    
    function updateReviewTheoryItem(idx, mark) {
        const el = document.getElementById(`review-theory-mark-${idx}`);
        if (!el) return;
        el.innerHTML = `
            <div class="theory-score-badge">AI Mark: ${mark.score}/${mark.outOf}</div>
            <div class="theory-mark-text">${esc(mark.feedback)}</div>`;
        typesetEl(el);
    }
    
    function showResults() {
        if (elements.quizScreen) elements.quizScreen.style.display = 'none';
        if (elements.resultsScreen) elements.resultsScreen.style.display = 'flex';
        
        let correct = 0, wrong = 0, skipped = 0;
        const scorable = allQuestions.filter(q => q.type === 'objective' && q._answer !== null);
        
        allQuestions.forEach((q, i) => {
            if (q.type !== 'objective') return;
            const chosen = userAnswers[i];
            const ans = q._answer;
            if (!chosen) skipped++;
            else if (ans === null) { /* no key */ }
            else if (chosen === ans) correct++;
            else wrong++;
        });
        
        const pct = scorable.length > 0 ? Math.round((correct / scorable.length) * 100) : 0;
        if (elements.resScore) elements.resScore.textContent = scorable.length > 0 ? `${pct}%` : 'N/A';
        if (elements.resCorrect) elements.resCorrect.textContent = correct;
        if (elements.resWrong) elements.resWrong.textContent = wrong;
        if (elements.resSkipped) elements.resSkipped.textContent = skipped;
        
        let grade = 'No answer key.';
        if (scorable.length > 0) {
            if (pct >= 80) grade = 'Distinction — Excellent work!';
            else if (pct >= 65) grade = 'Credit — Well done.';
            else if (pct >= 50) grade = 'Pass — Keep working.';
            else grade = 'Fail — Keep practising.';
        }
        if (elements.resGrade) elements.resGrade.textContent = grade;
        
        buildReviewList();
    }
    
    function buildReviewList() {
        if (!elements.reviewList) return;
        elements.reviewList.innerHTML = '';
        
        allQuestions.forEach((q, i) => {
            const chosen = userAnswers[i];
            const ans = q._answer;
            const item = document.createElement('div');
            item.className = 'review-item';
            
            const numEl = document.createElement('div');
            numEl.className = 'review-q-num';
            numEl.textContent = i + 1;
            
            const body = document.createElement('div');
            body.className = 'review-body';
            
            const qTxt = document.createElement('div');
            qTxt.className = 'review-q-text';
            qTxt.innerHTML = esc(q.question);
            body.appendChild(qTxt);
            
            if (q.image) {
                const img = document.createElement('img');
                img.className = 'review-img';
                img.src = q.image;
                img.alt = `Q${i+1}`;
                body.appendChild(img);
            }
            
            const ansEl = document.createElement('div');
            ansEl.className = 'review-ans';
            
            if (q.type === 'objective') {
                if (!chosen) {
                    numEl.classList.add('rq-skip');
                    ansEl.textContent = ans ? `Not answered — Correct: ${ans}` : 'Not answered';
                } else if (ans === null) {
                    numEl.classList.add('rq-skip');
                    ansEl.textContent = `You: ${chosen}  |  No key`;
                } else if (chosen === ans) {
                    numEl.classList.add('rq-ok');
                    ansEl.classList.add('ok');
                    ansEl.textContent = `Correct: ${chosen}`;
                } else {
                    numEl.classList.add('rq-bad');
                    ansEl.classList.add('bad');
                    ansEl.innerHTML = `You: <strong>${esc(chosen)}</strong>  |  Correct: <strong>${esc(ans)}</strong>`;
                }
                body.appendChild(ansEl);
                
                if (q.explanation) {
                    const explEl = document.createElement('div');
                    explEl.className = 'review-expl';
                    const lines = Array.isArray(q.explanation) ? q.explanation : [q.explanation];
                    explEl.innerHTML = lines.map(l => `<p class="expl-line">${esc(l)}</p>`).join('');
                    body.appendChild(explEl);
                }
            } else {
                numEl.classList.add(chosen ? 'rq-ai' : 'rq-skip');
                ansEl.classList.add('ai');
                if (chosen) {
                    ansEl.textContent = `Answer: ${chosen.length>120 ? chosen.slice(0,120)+'…' : chosen}`;
                } else {
                    ansEl.textContent = 'Theory — not answered';
                }
                body.appendChild(ansEl);
                
                const markEl = document.createElement('div');
                markEl.id = `review-theory-mark-${i}`;
                if (theoryMarks[i]) {
                    const m = theoryMarks[i];
                    markEl.innerHTML = `
                        <div class="theory-score-badge">AI Mark: ${m.score}/${m.outOf}</div>
                        <div class="theory-mark-text">${esc(m.feedback)}</div>`;
                } else if (chosen) {
                    markEl.innerHTML = `<div class="ai-marking-row"><div class="ai-spin"></div>Marking…</div>`;
                }
                body.appendChild(markEl);
            }
            
            item.appendChild(numEl);
            item.appendChild(body);
            elements.reviewList.appendChild(item);
        });
        
        typesetEl(elements.reviewList);
    }
    
    function printResults() {
        if (elements.reviewList && typeof MathJax !== 'undefined' && MathJax.typesetPromise) {
            MathJax.typesetClear([elements.reviewList]);
            MathJax.typesetPromise([elements.reviewList])
                .then(() => window.print())
                .catch(() => window.print());
        } else {
            window.print();
        }
    }
    
    function retake() {
        userAnswers = {};
        theoryMarks = {};
        currentIndex = 0;
        submitted = false;
        if (elements.resultsScreen) elements.resultsScreen.style.display = 'none';
        if (elements.quizScreen) elements.quizScreen.style.display = 'flex';
        if (elements.submitBtn) {
            elements.submitBtn.disabled = false;
            elements.submitBtn.innerHTML = `Submit <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 6h8M7 3l3 3-3 3"/></svg>`;
        }
        buildDotMap();
        renderQuestion(0);
    }
    
    // Expose public methods
    return { 
        init, 
        navigate, 
        confirmSubmit, 
        closeConfirm, 
        submit, 
        retake, 
        print: printResults,
        // Also expose for global access if needed (though event listeners are attached)
        getCurrentIndex: () => currentIndex
    };
})();

//  BOOT
// ══════════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
    Quiz.init();
});

// Receive context from platform-level PrepBot if present
window.addEventListener('prepportal:keysReady', () => {
});