/* ═══════════════════════════════════════════════════════════
   PREP PORTAL — WASSCE Practice Paper
   question.js — Quiz engine + PrepBot + Video Search + Theory AI
   ═══════════════════════════════════════════════════════════ */

'use strict';

// ── CONFIG ─────────────────────────────────────────────────────
const GEMINI_MODELS = ['gemini-2.5-flash-lite', 'gemini-2.0-flash', 'gemini-1.5-flash'];

const urlParams = new URLSearchParams(window.location.search);
const PAGE_CONFIG = {
    year:     urlParams.get('year'),
    subjects: urlParams.get('subjects')?.split(',') || [],
    types:    urlParams.get('types')?.split(',')    || []
};

// ── HELPERS ────────────────────────────────────────────────────
function esc(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g,'&amp;')
        .replace(/</g,'&lt;')
        .replace(/>/g,'&gt;');
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
        } catch(e) { lastErr = e; }
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
        } catch(e) { lastErr = e; }
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
            id:       item.id.videoId,
            title:    item.snippet.title,
            channel:  item.snippet.channelTitle,
            thumb:    item.snippet.thumbnails?.default?.url || ''
        }));
    } catch(e) { return []; }
}

function typesetEl(el) {
    if (!el || typeof MathJax === 'undefined' || !MathJax.typesetPromise) return Promise.resolve();
    // Clear existing MathJax nodes so it re-renders cleanly
    MathJax.typesetClear([el]);
    return MathJax.typesetPromise([el]).catch(() => {});
}

function injectScript(src) {
    return new Promise((res, rej) => {
        const s = document.createElement('script');
        s.src = src; s.onload = res; s.onerror = rej;
        document.head.appendChild(s);
    });
}

//  QUIZ ENGINE
// ══════════════════════════════════════════════════════════════
const Quiz = (() => {

    let allQuestions  = [];
    let currentIndex  = 0;
    let userAnswers   = {};
    let submitted     = false;
    let theoryMarks   = {};

    // ── Answer resolver ──────────────────────────────────────
    function resolveAnswer(q) {
        const opts = q.options || [];
        // Index fields — most common in this codebase
        for (const f of ['correctIndex','correct_index','answerIndex','answer_index']) {
            if (q[f] !== undefined && q[f] !== null) {
                const i = parseInt(q[f], 10);
                if (!isNaN(i) && opts[i] !== undefined) return opts[i];
            }
        }
        // Text / letter fields
        const raw = q.answer ?? q.correct ?? q.correctAnswer ??
                    q.correctOption ?? q.correct_answer ?? q.key ?? null;
        if (raw === null) return null;
        if (typeof raw === 'number') return opts[raw] ?? null;
        const s = String(raw).trim();
        if (/^[A-Ea-e]$/.test(s)) return opts[s.toUpperCase().charCodeAt(0) - 65] ?? null;
        if (/^\d$/.test(s))       return opts[parseInt(s, 10)] ?? null;
        return s || null;
    }

    // ── Bootstrap ────────────────────────────────────────────
    function init() {
        const subText = (PAGE_CONFIG.subjects || []).join(' & ') || 'Practice Paper';
        const metaText = `WASSCE ${PAGE_CONFIG.year||'—'} • ${(PAGE_CONFIG.types||[]).join(' & ').toUpperCase()}`;

        document.getElementById('display-subject').textContent = subText;
        document.getElementById('display-meta').textContent    = metaText;
        document.getElementById('print-header').textContent    =
            `Prep Portal · WASSCE ${PAGE_CONFIG.year||''} · ${subText} · Results`;

        document.getElementById('quit-link').addEventListener('click', e => {
            e.preventDefault(); window.history.back();
        });

        loadAndRender();
    }

    async function loadAndRender() {
        for (const sub of PAGE_CONFIG.subjects) {
            const subKey = sub.toLowerCase().replace(/\s+/g,'');
            for (const type of PAGE_CONFIG.types) {
                const path = `../${subKey}/${PAGE_CONFIG.year}/${type}.js`;
                try {
                    await injectScript(path);
                    const vName = `${subKey}${type.charAt(0).toUpperCase()+type.slice(1)}`;
                    let data;
                    try { data = window[vName] || eval(vName); } catch(_) {}
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
                } catch(_) { console.warn('Could not load:', path); }
            }
        }

        document.getElementById('loading-state').style.display = 'none';

        if (allQuestions.length === 0) {
            document.getElementById('question-card').style.display = 'flex';
            document.getElementById('question-card').innerHTML =
                `<div style="padding:40px;text-align:center">
                    <strong style="font-family:var(--font-display);font-size:15px">No Questions Found</strong>
                    <p style="font-size:12px;opacity:.6;margin-top:8px">Check file paths and variable names.</p>
                 </div>`;
            return;
        }

        buildDotMap();
        renderQuestion(0);
        document.getElementById('question-card').style.display = 'flex';
        document.getElementById('nav-bar').style.display = 'grid';
    }

    // ── Dot map ──────────────────────────────────────────────
    function buildDotMap() {
        const c = document.getElementById('q-dots');
        c.innerHTML = '';
        allQuestions.forEach((_, i) => {
            const d = document.createElement('button');
            d.className = 'q-dot'; d.title = `Q${i+1}`;
            d.addEventListener('click', () => renderQuestion(i));
            c.appendChild(d);
        });
        updateDots();
    }

    function updateDots() {
        document.querySelectorAll('.q-dot').forEach((d, i) => {
            d.classList.remove('answered','current','correct','wrong','theory-marked');
            const q = allQuestions[i]; const chosen = userAnswers[i]; const ans = q._answer;
            if (submitted) {
                if (q.type !== 'objective') {
                    if (theoryMarks[i])  d.classList.add('theory-marked');
                    else if (chosen)     d.classList.add('answered');
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
                if (i === currentIndex)        d.classList.add('current');
                else if (chosen !== undefined) d.classList.add('answered');
            }
        });
    }

    // ── Render question ──────────────────────────────────────
    function renderQuestion(idx) {
        currentIndex = idx;
        const q = allQuestions[idx]; const total = allQuestions.length; const ans = q._answer;

        document.getElementById('q-counter-label').textContent = `Q ${idx+1} of ${total}`;
        document.getElementById('progress-fill').style.width   = `${((idx+1)/total)*100}%`;
        document.getElementById('q-number-badge').textContent  =
            `Q ${idx+1}  •  ${q.subject}  •  ${q.type.toUpperCase()}`;

        const qTextEl = document.getElementById('q-text');
        qTextEl.innerHTML = esc(q.question);

        // Image
        const imgWrap = document.getElementById('q-image-wrap');
        imgWrap.innerHTML = '';
        if (q.image) {
            const img = document.createElement('img');
            img.className = 'q-image'; img.src = q.image;
            img.alt = `Q${idx+1} diagram`; imgWrap.appendChild(img);
        }

        // Options
        const optWrap = document.getElementById('q-options');
        optWrap.innerHTML = '';

        if (q.type === 'objective') {
            const grid = document.createElement('div'); grid.className = 'options-grid';
            const letters = ['A','B','C','D','E'];
            (q.options||[]).forEach((opt, oi) => {
                const btn = document.createElement('button'); btn.className = 'option-btn';
                if (submitted) {
                    btn.disabled = true;
                    if (ans !== null && opt === ans)    btn.classList.add('correct-ans');
                    else if (userAnswers[idx] === opt)  btn.classList.add('wrong-ans');
                } else if (userAnswers[idx] === opt) {
                    btn.classList.add('selected');
                }
                btn.innerHTML = `<span class="opt-letter">${letters[oi]||oi+1}</span><span>${esc(opt)}</span>`;
                btn.addEventListener('click', () => selectOption(opt, btn, grid, idx));
                grid.appendChild(btn);
            });
            optWrap.appendChild(grid);

            if (!submitted && q.hint) {
                const h = document.createElement('div'); h.className = 'hint-row';
                h.innerHTML = `<span class="hint-lbl">Hint</span><span>${esc(q.hint)}</span>`;
                optWrap.appendChild(h);
            }
        } else {
            // Theory
            const ta = document.createElement('textarea'); ta.className = 'theory-box';
            ta.placeholder = 'Write your answer here…';
            ta.value = userAnswers[idx] || '';
            if (submitted) ta.disabled = true;
            ta.addEventListener('input', () => { userAnswers[idx] = ta.value; updateDots(); });
            optWrap.appendChild(ta);

            if (submitted && theoryMarks[idx]) {
                const m = theoryMarks[idx];
                const mEl = document.createElement('div');
                mEl.style.cssText = 'margin-top:12px;padding:12px;border:2px solid var(--blue);background:rgba(0,85,255,.05)';
                mEl.innerHTML = `
                    <div class="theory-score-badge">AI Mark: ${m.score}/${m.outOf}</div>
                    <div class="theory-mark-text">${esc(m.feedback)}</div>`;
                optWrap.appendChild(mEl);
            } else if (submitted && userAnswers[idx]) {
                const sp = document.createElement('div'); sp.className = 'ai-marking-row';
                sp.innerHTML = `<div class="ai-spin"></div>AI Marking…`;
                optWrap.appendChild(sp);
            }
        }

        renderFeedback(idx);
        updateNavButtons(idx, total);
        updateDots();

        // Typeset math on the card
        typesetEl(document.getElementById('question-card'));
        typesetEl(document.getElementById('feedback-strip'));
    }

    function updateNavButtons(idx, total) {
        document.getElementById('prev-btn').disabled = (idx === 0);
        const isLast = (idx === total - 1);
        document.getElementById('next-btn').style.display   = isLast ? 'none'        : 'inline-flex';
        document.getElementById('submit-btn').style.display = isLast ? 'inline-flex' : 'none';
    }

    // ── Feedback ─────────────────────────────────────────────
    function renderFeedback(idx) {
        const strip = document.getElementById('feedback-strip');
        const label = document.getElementById('feedback-label');
        const expl  = document.getElementById('feedback-expl');
        const acts  = document.getElementById('feedback-actions');
        const q     = allQuestions[idx]; const ans = q._answer;

        strip.className = 'feedback-strip';
        expl.innerHTML  = ''; acts.innerHTML = '';

        if (!submitted) return;

        function buildExpl(raw) {
            if (!raw) return '';
            const lines = Array.isArray(raw) ? raw : [raw];
            return lines.map(l => `<p class="expl-line">${esc(l)}</p>`).join('');
        }

        // PrepBot seed button
        function addAskBtn() {
            const btn = document.createElement('button');
            btn.className = 'ask-prepbot-btn';
            btn.innerHTML = `<svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="5.5" cy="4.5" r="3"/><path d="M1 10c0-2 2-3.5 4.5-3.5S10 8 10 10"/></svg> Ask PrepBot`;
            const explText = Array.isArray(q.explanation) ? q.explanation.join('\n') : (q.explanation||'');
            btn.addEventListener('click', () => PrepBot.seedFromQuestion(q.question, ans, explText));
            acts.appendChild(btn);
        }

        // Video search button
        function addVideoBtn() {
            const btn = document.createElement('button');
            btn.className = 'search-videos-btn';
            btn.innerHTML = `<svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" stroke-width="1.8"><polygon points="4,2 10,5.5 4,9"/></svg> Videos`;
            btn.addEventListener('click', () => showVideoResults(idx, q));
            acts.appendChild(btn);
        }

        if (q.type !== 'objective') {
            const mark = theoryMarks[idx];
            if (mark) {
                strip.classList.add('neutral');
                label.textContent = `AI Mark: ${mark.score}/${mark.outOf}`;
                expl.innerHTML = `<p class="expl-line">${esc(mark.feedback)}</p>`;
            } else if (userAnswers[idx]) {
                strip.classList.add('neutral');
                label.textContent = 'Theory — marking with AI…';
            } else {
                strip.classList.add('wrong');
                label.textContent = 'No answer submitted.';
            }
            addAskBtn();
            return;
        }

        const chosen = userAnswers[idx];
        if (!chosen) {
            strip.classList.add('wrong');
            label.textContent = 'Not answered.';
            expl.innerHTML = ans
                ? `<p class="expl-line">Correct answer: <strong>${esc(ans)}</strong></p>` + buildExpl(q.explanation)
                : '<p class="expl-line">No answer key for this question.</p>';
        } else if (ans === null) {
            strip.classList.add('neutral');
            label.textContent = `You selected: ${chosen}`;
            expl.innerHTML = '<p class="expl-line">No answer key — cannot verify.</p>';
        } else if (chosen === ans) {
            strip.classList.add('correct');
            label.textContent = 'Correct!';
            expl.innerHTML = buildExpl(q.explanation);
        } else {
            strip.classList.add('wrong');
            label.textContent = `Wrong — you chose: ${chosen}`;
            expl.innerHTML =
                `<p class="expl-line">Correct answer: <strong>${esc(ans)}</strong></p>` +
                buildExpl(q.explanation);
        }

        addAskBtn();
        if (ytKey()) addVideoBtn();

        typesetEl(document.getElementById('feedback-strip'));
    }

    // ── Video results in feedback strip ──────────────────────
    async function showVideoResults(idx, q) {
        const acts  = document.getElementById('feedback-actions');
        const vidEl = document.getElementById(`video-results-${idx}`);
        if (vidEl) { vidEl.remove(); return; } // toggle off

        const wrap = document.createElement('div');
        wrap.id = `video-results-${idx}`;
        wrap.className = 'video-results-strip';
        wrap.innerHTML = `<div class="video-results-title">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor"><polygon points="3,1 9,5 3,9"/></svg>
            Searching YouTube…
        </div>`;
        acts.insertAdjacentElement('afterend', wrap);

        const query = `WAEC ${q.subject} ${q.question.slice(0,80)}`;
        const videos = await searchYouTube(query, 3);

        if (!videos.length) {
            wrap.innerHTML = `<div class="video-results-title">No videos found.</div>`;
            return;
        }

        wrap.innerHTML = `<div class="video-results-title">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor"><polygon points="3,1 9,5 3,9"/></svg>
            Related Videos
        </div>` + videos.map(v => `
            <a class="video-card" href="https://www.youtube.com/watch?v=${v.id}" target="_blank" rel="noopener">
                <img class="video-thumb" src="${v.thumb}" alt="${esc(v.title)}">
                <div class="video-meta">
                    <div class="video-title">${esc(v.title)}</div>
                    <div class="video-channel">${esc(v.channel)}</div>
                </div>
            </a>`).join('');
    }

    // ── Select option ────────────────────────────────────────
    function selectOption(opt, btn, grid, idx) {
        if (submitted) return;
        grid.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        userAnswers[idx] = opt;
        updateDots();
    }

    // ── Navigate ─────────────────────────────────────────────
    function navigate(delta) {
        const n = currentIndex + delta;
        if (n < 0 || n >= allQuestions.length) return;
        renderQuestion(n);
    }

    // ── Confirm / Submit ─────────────────────────────────────
    function confirmSubmit() {
        const answered = Object.keys(userAnswers)
            .filter(k => userAnswers[k] !== undefined && userAnswers[k] !== '').length;
        const total = allQuestions.length;
        document.getElementById('confirm-body').textContent =
            `You have answered ${answered} of ${total} questions.` +
            (answered < total ? ` ${total-answered} unanswered will be skipped.` : ' Ready to submit?');
        document.getElementById('pp-confirm-overlay').classList.add('open');
    }

    function closeConfirm() {
        document.getElementById('pp-confirm-overlay').classList.remove('open');
    }

    function submit() {
        closeConfirm();
        submitted = true;
        renderQuestion(currentIndex);
        const sb = document.getElementById('submit-btn');
        sb.disabled = true; sb.textContent = 'Submitted';
        runTheoryMarking();
        setTimeout(showResults, 4000);
        
    }

    // ── Theory AI marking ────────────────────────────────────
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
            } catch(e) { console.warn(`Theory marking Q${i+1}:`, e.message); }
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

        const raw   = await callGemini(prompt, 400);
        const clean = raw.replace(/```[a-z]*\n?/gi,'').replace(/```/g,'').trim();
        const p     = JSON.parse(clean);
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

    // ── Results ──────────────────────────────────────────────
    function showResults() {
        document.getElementById('quiz-screen').style.display    = 'none';
        document.getElementById('results-screen').style.display = 'flex';

        let correct = 0, wrong = 0, skipped = 0;
        const scorable = allQuestions.filter(q => q.type === 'objective' && q._answer !== null);

        allQuestions.forEach((q, i) => {
            if (q.type !== 'objective') return;
            const chosen = userAnswers[i]; const ans = q._answer;
            if (!chosen)        skipped++;
            else if (ans===null)  { /* no key */ }
            else if (chosen===ans) correct++;
            else                   wrong++;
        });

        const pct = scorable.length > 0 ? Math.round((correct/scorable.length)*100) : 0;
        document.getElementById('res-score').textContent   = scorable.length > 0 ? `${pct}%` : 'N/A';
        document.getElementById('res-correct').textContent = correct;
        document.getElementById('res-wrong').textContent   = wrong;
        document.getElementById('res-skipped').textContent = skipped;

        let grade = 'No answer key.';
        if (scorable.length > 0) {
            if (pct >= 80)      grade = 'Distinction — Excellent work!';
            else if (pct >= 65) grade = 'Credit — Well done.';
            else if (pct >= 50) grade = 'Pass — Keep working.';
            else                grade = 'Fail — Keep practising.';
        }
        document.getElementById('res-grade').textContent = grade;

        buildReviewList();
    }

    function buildReviewList() {
        const el = document.getElementById('review-list');
        el.innerHTML = '';

        allQuestions.forEach((q, i) => {
            const chosen = userAnswers[i]; const ans = q._answer;
            const item = document.createElement('div'); item.className = 'review-item';

            const numEl = document.createElement('div'); numEl.className = 'review-q-num';
            numEl.textContent = i + 1;

            const body = document.createElement('div'); body.className = 'review-body';

            // Question text (MathJax-rendered via innerHTML)
            const qTxt = document.createElement('div'); qTxt.className = 'review-q-text';
            qTxt.innerHTML = esc(q.question);
            body.appendChild(qTxt);

            // Image
            if (q.image) {
                const img = document.createElement('img');
                img.className = 'review-img'; img.src = q.image;
                img.alt = `Q${i+1}`; body.appendChild(img);
            }

            const ansEl = document.createElement('div'); ansEl.className = 'review-ans';

            if (q.type === 'objective') {
                if (!chosen) {
                    numEl.classList.add('rq-skip');
                    ansEl.textContent = ans ? `Not answered — Correct: ${ans}` : 'Not answered';
                } else if (ans===null) {
                    numEl.classList.add('rq-skip');
                    ansEl.textContent = `You: ${chosen}  |  No key`;
                } else if (chosen===ans) {
                    numEl.classList.add('rq-ok'); ansEl.classList.add('ok');
                    ansEl.textContent = `Correct: ${chosen}`;
                } else {
                    numEl.classList.add('rq-bad'); ansEl.classList.add('bad');
                    ansEl.innerHTML = `You: <strong>${esc(chosen)}</strong>  |  Correct: <strong>${esc(ans)}</strong>`;
                }
                body.appendChild(ansEl);

                if (q.explanation) {
                    const explEl = document.createElement('div'); explEl.className = 'review-expl';
                    const lines  = Array.isArray(q.explanation) ? q.explanation : [q.explanation];
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
            el.appendChild(item);
        });

        // Single typeset pass on the whole review list
        typesetEl(el);
    }

    function printResults() {
        const reviewEl = document.getElementById('review-list');
        if (typeof MathJax !== 'undefined' && MathJax.typesetPromise) {
            MathJax.typesetClear([reviewEl]);
            MathJax.typesetPromise([reviewEl])
                .then(() => window.print())
                .catch(()  => window.print());
        } else {
            window.print();
        }
    }

    function retake() {
        userAnswers  = {};
        theoryMarks  = {};
        currentIndex = 0;
        submitted    = false;
        document.getElementById('results-screen').style.display = 'none';
        document.getElementById('quiz-screen').style.display    = 'flex';
        const sb = document.getElementById('submit-btn');
        sb.disabled = false;
        sb.innerHTML = `Submit <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 6h8M7 3l3 3-3 3"/></svg>`;
        buildDotMap();
        renderQuestion(0);
    }

    return { init, navigate, confirmSubmit, closeConfirm, submit, retake, print: printResults };
})();

//  PREPBOT
// ══════════════════════════════════════════════════════════════
const PrepBot = (() => {

    let isOpen        = false;
    let fabDismissed  = false;
    let chatHistory   = [];    // [{role,content}]
    let contextQ      = null;  // current question context
    let recognition   = null;
    let micActive     = false;
    let popupTimer    = null;

    const SYSTEM_PROMPT = `You are PrepBot, a friendly and expert Nigerian secondary school exam tutor. You help students understand WAEC, JAMB, IGCSE, and Common Entrance exam questions. Be concise, clear, and encouraging. Use simple language. When explaining chemistry, biology, physics or maths, be precise. Do not use bullet points in every response — write naturally.`;

    // ── Init ─────────────────────────────────────────────────
    function init() {
        document.getElementById('chat-input').addEventListener('keydown', e => {
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
        });
        // Auto-resize textarea
        document.getElementById('chat-input').addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 120) + 'px';
        });
        renderIntro();
        // Show popup nudge after 8s if chat hasn't been opened
        setTimeout(() => {
            if (!isOpen && !fabDismissed) showPopup('I am reading the page with you. Ask about the current question, navigate to a number, or use the Mic to talk.');
        }, 8000);
    }

    function renderIntro() {
        const msgs = document.getElementById('chat-messages');
        msgs.innerHTML = `
            <div class="chat-intro-card">
                <div class="chat-intro-title">System Ready</div>
                <div class="chat-intro-text">I am reading the page with you. Ask about the current question, navigate to a number, or use the Mic to talk.</div>
            </div>`;
    }

    // ── Open / close / toggle ────────────────────────────────
    function open() {
        isOpen = true;
        hidePopup();
        document.getElementById('chat-window').classList.add('open');
        document.getElementById('chat-input').focus();
    }

    function close() {
        isOpen = false;
        document.getElementById('chat-window').classList.remove('open');
    }

    function toggle() { isOpen ? close() : open(); }

    // ── FAB dismiss / restore ────────────────────────────────
    function dismissFAB() {
        fabDismissed = true;
        document.getElementById('chat-fab-wrap').classList.add('fab-hidden');
        document.getElementById('chat-fab-restore').classList.add('fab-restore-visible');
        close();
    }

    function restoreFAB() {
        fabDismissed = false;
        document.getElementById('chat-fab-wrap').classList.remove('fab-hidden');
        document.getElementById('chat-fab-restore').classList.remove('fab-restore-visible');
    }

    // ── Popup nudge ──────────────────────────────────────────
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

    // ── Seed from question (called by "Ask PrepBot" btn) ─────
    function seedFromQuestion(questionText, correctAnswer, explanationText) {
        contextQ = { questionText, correctAnswer, explanationText };

        // Update context banner
        const banner = document.getElementById('chat-context-banner');
        document.getElementById('chat-context-text').textContent =
            questionText.length > 120 ? questionText.slice(0,120)+'…' : questionText;
        banner.classList.add('active');

        // Seed history
        chatHistory = [
            {
                role: 'user',
                content: `${SYSTEM_PROMPT}\n\nThe student is reviewing this exam question:\n\n"${questionText}"\n\n` +
                    (correctAnswer ? `Correct answer: ${correctAnswer}\n` : '') +
                    (explanationText ? `Explanation: ${explanationText}\n` : '') +
                    `\nHelp the student understand this question deeply. Start with a brief, friendly intro.`
            }
        ];

        // Clear chat and show intro for this question
        const msgs = document.getElementById('chat-messages');
        msgs.innerHTML = '';
        clearSuggestions();

        open();
        streamBotResponse();
    }

    // ── Clear chat ────────────────────────────────────────────
    function clearChat() {
        chatHistory = [];
        contextQ    = null;
        document.getElementById('chat-context-banner').classList.remove('active');
        renderIntro();
        clearSuggestions();
    }

    // ── Send message ─────────────────────────────────────────
    async function send() {
        const inputEl = document.getElementById('chat-input');
        const sendBtn = document.getElementById('chat-send');
        const text    = inputEl.value.trim();
        if (!text) return;

        inputEl.value = ''; inputEl.style.height = 'auto';
        sendBtn.disabled = true;
        clearSuggestions();

        appendMsg('user', text);

        // Build messages array
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
            // Offer video search if YT key is present
            if (ytKey() && contextQ) addVideoChip();
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
        const thinkingEl = appendMsg('bot', 'Thinking…', true);
        try {
            const reply = await callGeminiChat(chatHistory);
            thinkingEl.remove();
            chatHistory.push({ role: 'assistant', content: reply });
            appendMsg('bot', reply);
            if (ytKey() && contextQ) addVideoChip();
            addFollowUpChips(reply);
        } catch(e) {
            thinkingEl.remove();
            appendMsg('bot', `Could not reach AI. (${e.message})`);
        }
        sendBtn.disabled = false;
    }

    // ── Append message ────────────────────────────────────────
    function appendMsg(role, text, thinking = false) {
        const msgs = document.getElementById('chat-messages');
        const wrap = document.createElement('div');
        wrap.className = `chat-msg ${role}`;
        const bubble = document.createElement('div');
        bubble.className = `msg-bubble${thinking ? ' thinking' : ''}`;
        bubble.textContent = text;
        wrap.appendChild(bubble);
        msgs.appendChild(wrap);
        msgs.scrollTop = msgs.scrollHeight;
        return wrap;
    }

    // ── Suggestion chips ─────────────────────────────────────
    function clearSuggestions() {
        document.getElementById('suggestion-chips').innerHTML = '';
    }

    function addFollowUpChips(botReply) {
        // Parse [SUGGESTIONS: a | b | c] block the model may append
        const match = botReply.match(/\[SUGGESTIONS?:\s*([^\]]+)\]/i);
        if (!match) return;
        const chips = match[1].split('|').map(s => s.trim()).filter(Boolean);
        const wrap  = document.getElementById('suggestion-chips');
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
        const existing = wrap.querySelector('.yt-chip');
        if (existing) return;
        const btn = document.createElement('button');
        btn.className = 'suggestion-chip yt-chip';
        btn.innerHTML = `▶ Search YouTube for this`;
        btn.addEventListener('click', () => searchAndShowVideos());
        wrap.appendChild(btn);
    }

    async function searchAndShowVideos() {
        if (!contextQ) return;
        clearSuggestions();
        const loadMsg = appendMsg('bot', 'Searching YouTube…', true);
        const query   = `WAEC ${contextQ.questionText.slice(0,80)}`;
        const videos  = await searchYouTube(query, 3);
        loadMsg.remove();

        if (!videos.length) {
            appendMsg('bot', 'No relevant YouTube videos found.');
            return;
        }

        const wrap = document.createElement('div'); wrap.className = 'chat-msg bot';
        const bubble = document.createElement('div'); bubble.className = 'msg-bubble';
        bubble.innerHTML = `<div style="font-weight:700;font-size:.78rem;margin-bottom:8px">Related Videos</div>`;

        const cards = document.createElement('div'); cards.className = 'prepbot-video-cards';
        videos.forEach(v => {
            const a = document.createElement('a');
            a.className = 'prepbot-video-card';
            a.href = `https://www.youtube.com/watch?v=${v.id}`;
            a.target = '_blank'; a.rel = 'noopener';
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

    // ── Voice input ──────────────────────────────────────────
    function toggleMic() {
        if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
            showPopup('Voice input is not supported in this browser.');
            return;
        }
        if (micActive) { recognition?.stop(); return; }

        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SR();
        recognition.lang = 'en-NG'; recognition.interimResults = false;

        recognition.onresult = e => {
            const t = e.results[0][0].transcript;
            document.getElementById('chat-input').value = t;
        };
        recognition.onend  = () => { micActive = false; document.getElementById('chat-mic').classList.remove('mic-active'); };
        recognition.onerror= () => { micActive = false; document.getElementById('chat-mic').classList.remove('mic-active'); };

        micActive = true;
        document.getElementById('chat-mic').classList.add('mic-active');
        recognition.start();
    }

    return {
        init, open, close, toggle,
        dismissFAB, restoreFAB,
        seedFromQuestion,
        clearChat, send, toggleMic,
        showPopup, hidePopup
    };
})();

//  BOOT
// ══════════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
    Quiz.init();
    PrepBot.init();
});

// Receive context from platform-level PrepBot if present
window.addEventListener('prepportal:keysReady', () => {
});