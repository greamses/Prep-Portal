/* ═══════════════════════════════════════════════════════════
   PREP PORTAL — WASSCE Practice Paper
   MODULE 3: Quiz Engine - Core quiz functionality
   ═══════════════════════════════════════════════════════════ */

'use strict';

const Quiz = (() => {

    let allQuestions  = [];
    let currentIndex  = 0;
    let userAnswers   = {};
    let submitted     = false;
    let theoryMarks   = {};

    // ── Answer resolver ──────────────────────────────────────
    function resolveAnswer(q) {
        const opts = q.options || [];
        for (const f of ['correctIndex','correct_index','answerIndex','answer_index']) {
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
                    // unanswered — grey
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

        const imgWrap = document.getElementById('q-image-wrap');
        imgWrap.innerHTML = '';
        if (q.image) {
            const img = document.createElement('img');
            img.className = 'q-image'; img.src = q.image;
            img.alt = `Q${idx+1} diagram`; imgWrap.appendChild(img);
        }

        const optWrap = document.getElementById('q-options');
        optWrap.innerHTML = '';

        if (q.type === 'objective') {
            renderObjectiveOptions(q, idx, optWrap);
        } else {
            renderTheoryOptions(q, idx, optWrap);
        }

        renderFeedback(idx);
        updateNavButtons(idx, total);
        updateDots();

        typesetEl(document.getElementById('question-card'));
        typesetEl(document.getElementById('feedback-strip'));
    }

    function renderObjectiveOptions(q, idx, optWrap) {
        const grid = document.createElement('div'); grid.className = 'options-grid';
        const letters = ['A','B','C','D','E'];
        (q.options||[]).forEach((opt, oi) => {
            const btn = document.createElement('button'); btn.className = 'option-btn';
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
        optWrap.appendChild(grid);

        if (!submitted && q.hint) {
            const h = document.createElement('div'); h.className = 'hint-row';
            h.innerHTML = `<span class="hint-lbl">Hint</span><span>${esc(q.hint)}</span>`;
            optWrap.appendChild(h);
        }
    }

    function renderTheoryOptions(q, idx, optWrap) {
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

    function updateNavButtons(idx, total) {
        document.getElementById('prev-btn').disabled = (idx === 0);
        const isLast = (idx === total - 1);
        document.getElementById('next-btn').style.display   = isLast ? 'none'        : 'inline-flex';
        document.getElementById('submit-btn').style.display = isLast ? 'inline-flex' : 'none';
    }

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
        document.getElementById('confirm-body').textContent =
            `You have answered ${answered} of ${total} questions.` +
            (answered < total ? ` ${total-answered} unanswered will be skipped.` : ' Ready to submit?');
        document.getElementById('pp-confirm-overlay').classList.add('open');
    }

    function closeConfirm() {
        document.getElementById('pp-confirm-overlay').classList.remove('open');
    }

    async function submit() {
        closeConfirm();
        submitted = true;
        renderQuestion(currentIndex);
        const sb = document.getElementById('submit-btn');
        sb.disabled = true; sb.textContent = 'Submitted';
        await runTheoryMarking();
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
            } catch(e) { console.warn(`Theory marking Q${i+1}:`, e.message); }
        }
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
        document.getElementById('quiz-screen').style.display    = 'none';
        document.getElementById('results-screen').style.display = 'flex';
        PrepBot.hideFAB();

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

            const qTxt = document.createElement('div'); qTxt.className = 'review-q-text';
            qTxt.innerHTML = esc(q.question);
            body.appendChild(qTxt);

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
        PrepBot.showFAB();
        buildDotMap();
        renderQuestion(0);
    }

    function getState() {
        return { allQuestions, currentIndex, userAnswers, submitted };
    }

    function goTo(idx) {
        if (idx < 0 || idx >= allQuestions.length) return;
        renderQuestion(idx);
    }

    return { 
        init, navigate, goTo, getState, 
        confirmSubmit, closeConfirm, submit, 
        retake, print: printResults 
    };
})();