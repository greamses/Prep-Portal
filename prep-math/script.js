 /* ═══════════════════════════════════════════
     FIREBASE — AUTH & KEY FETCH
     Gemini key stored at: users/{uid}.geminiKey
  ═══════════════════════════════════════════ */
 let authUser = null;
 
 firebase.auth().onAuthStateChanged(user => {
   authUser = user;
 });
 
 async function getGeminiKey() {
   if (!authUser) throw new Error('Please sign in to use PrepBot');
   const snap = await firebase.firestore()
     .collection('users')
     .doc(authUser.uid)
     .get();
   const key = snap.data()?.geminiKey;
   if (!key) throw new Error('No Gemini key found. Add one in Account Settings.');
   return key;
 }
 
 /* ═══════════════════════════════════════════
    GEMINI CONFIG
 ═══════════════════════════════════════════ */
 const GEMINI_MODEL = 'gemini-1.5-flash';
 const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
 
 /* ═══════════════════════════════════════════
    TOPIC MAP
 ═══════════════════════════════════════════ */
 const topicMap = {
   'one-step': 'simple one-step linear equations, e.g. x + 5 = 12, x - 3 = 7, 4x = 20, x/3 = 4',
   'two-step': 'two-step equations, e.g. 2x + 3 = 11, 4x - 5 = 19, x/3 + 2 = 6, 3(x-1) = 12',
   'both-sides': 'equations with variables on both sides, e.g. 3x + 2 = x + 10, 5x - 4 = 2x + 8',
   'fractions': 'equations involving fractions, e.g. x/2 + 3 = 7, (2x+1)/3 = 5, x/4 - 1 = 2',
   'decimals': 'equations involving decimal coefficients or constants, e.g. 1.5x + 2.3 = 8, 0.4x - 1.2 = 2.4',
   'mixed-number': 'equations where answers may be mixed numbers or improper fractions, e.g. x/4 + 1 = 3/2, 2x - 1/3 = 5/6',
   'quadratic': 'simple factorable quadratic equations, e.g. x^2 - 5x + 6 = 0, x^2 + 3x - 10 = 0',
   'diff-squares': 'difference of two squares, e.g. x^2 - 9 = 0, 4x^2 - 25 = 0, x^2 - 16 = 0',
   'completing-square': 'completing the square to solve quadratics, e.g. x^2 + 6x + 5 = 0, x^2 - 4x - 12 = 0',
   'inequalities': 'simple linear inequalities, e.g. 2x + 3 > 7, 4x - 1 <= 11, x/2 >= 3',
   'compound-ineq': 'compound inequalities, e.g. -3 < 2x + 1 < 9, 1 <= 3x - 2 <= 10',
   'abs-value-ineq': 'absolute value inequalities, e.g. |x - 3| < 5, |2x + 1| >= 7',
   'age-problems': 'age word problems translated into a linear equation',
   'speed-distance': 'speed-distance-time word problems resulting in a linear equation',
   'mixture': 'mixture or concentration word problems resulting in a linear equation',
   'substitution': 'pair of simultaneous linear equations solved by substitution',
   'elimination': 'pair of simultaneous linear equations solved by elimination',
   'graphical': 'pair of simultaneous linear equations that represent two straight lines meeting at a point',
 };
 
 const topicLabels = {
   'one-step': 'One-Step',
   'two-step': 'Two-Step',
   'both-sides': 'Both Sides',
   'fractions': 'Fractions',
   'decimals': 'Decimals',
   'mixed-number': 'Mixed Numbers',
   'quadratic': 'Factoring',
   'diff-squares': 'Diff. of Squares',
   'completing-square': 'Complete the Square',
   'inequalities': 'Inequalities',
   'compound-ineq': 'Compound Ineq.',
   'abs-value-ineq': 'Abs. Value Ineq.',
   'age-problems': 'Age Problems',
   'speed-distance': 'Speed & Distance',
   'mixture': 'Mixture',
   'substitution': 'Substitution',
   'elimination': 'Elimination',
   'graphical': 'Graphical',
 };
 
 /* ═══════════════════════════════════════════
    STEP CONSTRAINTS
 ═══════════════════════════════════════════ */
 const topicSteps = {
   'one-step': 'EXACTLY 1 operation to isolate x. E.g. "x + 7 = 15" (subtract once) or "3x = 18" (divide once). DO NOT add a second operation.',
   'two-step': 'EXACTLY 2 operations to isolate x. E.g. "2x + 3 = 11" (subtract, then divide). No more, no fewer.',
   'both-sides': 'Variable appears on BOTH sides; 2–3 steps: collect variable terms, then isolate. E.g. "5x - 4 = 2x + 8".',
   'fractions': 'Equation contains a fraction coefficient or constant; 2–3 steps: clear fraction, then isolate. E.g. "x/3 + 2 = 6".',
   'decimals': 'Coefficients or constants are decimals; 2 steps max. E.g. "1.5x + 2 = 8".',
   'mixed-number': 'Answer is a fraction or mixed number; 2 steps. E.g. "4x - 1 = 3/2".',
   'quadratic': 'Factorable quadratic in the form ax^2 + bx + c = 0. Solve by factoring only — do NOT use the quadratic formula.',
   'diff-squares': 'Form x^2 - k = 0 or ax^2 - b = 0. Solve by recognising the difference of two squares.',
   'completing-square': 'Quadratic solved by completing the square only. E.g. "x^2 + 6x - 7 = 0".',
   'inequalities': 'Simple linear inequality; 1–2 steps. E.g. "3x - 4 > 8". Remember to flip the sign if dividing by a negative.',
   'compound-ineq': 'Compound inequality of the form a < bx + c < d; 2 steps. E.g. "-1 < 2x + 3 < 9".',
   'abs-value-ineq': 'Absolute value inequality of the form |ax + b| < c or |ax + b| > c.',
   'age-problems': 'Word problem → single linear equation → solve in 2–3 steps. Return a "problem" field with the word problem as a plain English sentence. The "eq" field must contain the equation only, not the word problem.',
   'speed-distance': 'Word problem → single linear equation → solve in 2–3 steps. Return a "problem" field with the word problem as a plain English sentence. The "eq" field must contain the equation only.',
   'mixture': 'Word problem → single linear equation → solve in 2–3 steps. Return a "problem" field with the word problem as a plain English sentence. The "eq" field must contain the equation only.',
   'substitution': 'Two simultaneous linear equations solved by substitution. "eq" must contain BOTH equations separated by a comma, e.g. "y=2x-1,3x+y=14".',
   'elimination': 'Two simultaneous linear equations solved by elimination. "eq" must contain BOTH equations separated by a comma.',
   'graphical': 'Two simultaneous linear equations that intersect at one point. "eq" must contain BOTH equations separated by a comma.',
 };
 
 /* ═══════════════════════════════════════════
    METHOD HINT INSTRUCTIONS
 ═══════════════════════════════════════════ */
 const methodHintInstruction = {
   'transfer': 'Write the hint using the TRANSFER METHOD: describe moving a term across the equals sign with a sign change. ' +
     'E.g. "Transfer the +3 to the right side where it becomes −3, giving x = 7 − 3 = 4."',
   'balancing': 'Write the hint using the BALANCING METHOD: describe performing the same operation on BOTH sides. ' +
     'E.g. "Subtract 3 from both sides: x + 3 − 3 = 7 − 3, so x = 4."'
 };
 
 /* ═══════════════════════════════════════════
    STATE
 ═══════════════════════════════════════════ */
 let currentTopic = 'one-step';
 let gmReady = false;
 let gmCanvas = null;
 let pendingEq = null;
 let currentAnswer = null;
 let sessionCount = 0;
 let overlayOpen = false;
 let isSolved = false;
 
 const recentEquations = [];
 const wordProblemTopics = new Set(['age-problems', 'speed-distance', 'mixture']);
 
 /* ═══════════════════════════════════════════
    GRASPABLE MATH INIT
 ═══════════════════════════════════════════ */
 loadGM(function() {
   gmath.setDarkTheme(true);
   gmReady = true;
   if (pendingEq) {
     const eq = pendingEq;
     pendingEq = null;
     requestAnimationFrame(() => requestAnimationFrame(() => mountEquation(eq)));
   }
 }, { version: 'latest' });
 
 /* ═══════════════════════════════════════════
    ACCORDION
 ═══════════════════════════════════════════ */
 function toggleAccordion(groupId) {
   const group = document.getElementById(groupId);
   const header = group.querySelector('.accordion-header');
   const body = group.querySelector('.accordion-body');
   const isOpen = header.classList.contains('open');
   
   document.querySelectorAll('.accordion-header').forEach(h => h.classList.remove('open'));
   document.querySelectorAll('.accordion-body').forEach(b => b.classList.remove('open'));
   
   if (!isOpen) {
     header.classList.add('open');
     body.classList.add('open');
   }
 }
 
 function updateGroupHighlight() {
   document.querySelectorAll('.accordion-group').forEach(g => {
     const hasActive = g.querySelector('.topic-chip.active');
     g.classList.toggle('has-active', !!hasActive);
   });
 }
 
 /* ═══════════════════════════════════════════
    TOPIC
 ═══════════════════════════════════════════ */
 function setTopic(btn) {
   document.querySelectorAll('.topic-chip').forEach(b => b.classList.remove('active'));
   btn.classList.add('active');
   currentTopic = btn.dataset.topic;
   updateGroupHighlight();
   
   const group = btn.closest('.accordion-group');
   const header = group.querySelector('.accordion-header');
   const body = group.querySelector('.accordion-body');
   document.querySelectorAll('.accordion-header').forEach(h => h.classList.remove('open'));
   document.querySelectorAll('.accordion-body').forEach(b => b.classList.remove('open'));
   header.classList.add('open');
   body.classList.add('open');
 }
 
 /* ═══════════════════════════════════════════
    METHOD
 ═══════════════════════════════════════════ */
 function setMethod(btn) {
   document.querySelectorAll('.method-chip').forEach(b => b.classList.remove('active'));
   btn.classList.add('active');
 }
 
 /* ═══════════════════════════════════════════
    OVERLAY CONTROL
 ═══════════════════════════════════════════ */
 function openOverlay() {
   overlayOpen = true;
   const ov = document.getElementById('fs-overlay');
   ov.style.pointerEvents = '';
   ov.classList.add('open');
   document.getElementById('open-fab').classList.remove('visible');
   document.body.style.overflow = 'hidden';
 }
 
 function closeOverlay() {
   overlayOpen = false;
   const ov = document.getElementById('fs-overlay');
   ov.classList.remove('open');
   ov.style.pointerEvents = 'none';
   if (sessionCount > 0) document.getElementById('open-fab').classList.add('visible');
   document.body.style.overflow = '';
   document.getElementById('wp-modal').classList.remove('open');
 }
 
 function toggleOverlay() {
   overlayOpen ? closeOverlay() : openOverlay();
 }
 
 /* ═══════════════════════════════════════════
    WORD PROBLEM MODAL
 ═══════════════════════════════════════════ */
 function toggleWordProblemModal() {
   document.getElementById('wp-modal').classList.toggle('open');
 }
 
 /* ═══════════════════════════════════════════
    VARIETY SEED
 ═══════════════════════════════════════════ */
 function randInt(min, max) {
   return Math.floor(Math.random() * (max - min + 1)) + min;
 }
 
 function buildVarietySeed() {
   return {
     a: randInt(2, 13),
     b: randInt(1, 20),
     c: randInt(1, 15),
     x: randInt(-9, 9) || 2,
   };
 }
 
 /* ═══════════════════════════════════════════
    GENERATE — Gemini
 ═══════════════════════════════════════════ */
 async function generateQuestion() {
   const pageBtn = document.getElementById('gen-btn');
   const fsBtn = document.getElementById('fs-new-btn');
   
   pageBtn.classList.add('loading');
   pageBtn.disabled = true;
   fsBtn.classList.add('loading');
   fsBtn.disabled = true;
   
   showStatus('info', '\u27f3 PrepBot is generating your equation\u2026');
   
   try {
     /* ── Fetch user's Gemini key from Firestore ── */
     const geminiKey = await getGeminiKey();
     
     /* ── Build prompt ── */
     const seed = buildVarietySeed();
     const avoidClause = recentEquations.length ?
       `\nDo NOT reuse any of these recent equations: ${recentEquations.join(' | ')}` :
       '';
     const isWordProblem = wordProblemTopics.has(currentTopic);
     const stepRule = topicSteps[currentTopic];
     const method = document.querySelector('.method-chip.active')?.dataset?.method || 'transfer';
     const hintInstruction = methodHintInstruction[method];
     
     const prompt =
       `You are PrepBot, an algebra tutor. Generate exactly 1 equation for the topic: ${topicLabels[currentTopic]}.

COMPLEXITY RULE (MOST IMPORTANT — do not violate this):
${stepRule}

VARIETY RULES:
- Use these seed values so the equation is different each time: a=${seed.a}, b=${seed.b}, c=${seed.c}, target answer≈${seed.x}
- Vary signs and structure — use negative coefficients or answers sometimes${avoidClause}

METHOD INSTRUCTION (use this to write the hint):
${hintInstruction}

Return ONLY a valid JSON object — no markdown, no explanation:
- "eq": clean ASCII string parseable by Graspable Math (use +, -, *, /, =, >, <; no LaTeX; use * for multiplication)
- "answer": solved form with no spaces, e.g. "x=4", "x>9/5", "x=-3/2"
- "hint": one sentence following the METHOD INSTRUCTION above
${isWordProblem ? '- "problem": the word problem as a plain English sentence (no equations here)' : ''}

Examples:
{"eq": "x + 7 = 15", "answer": "x=8", "hint": "Transfer +7 to the right as −7."}
{"eq": "3x = 18", "answer": "x=6", "hint": "Divide both sides by 3."}
{"eq": "2x + 3 = 11", "answer": "x=4", "hint": "Subtract 3 from both sides, then divide by 2."}
{"eq": "5x - 2 > 7", "answer": "x>9/5", "hint": "Transfer −2 to the right as +2, giving 5x > 9."}`;
     
     /* ── Call Gemini ── */
     const res = await fetch(`${GEMINI_URL}?key=${geminiKey}`, {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({
         systemInstruction: {
           parts: [{ text: 'You are PrepBot. Respond with raw JSON only, no markdown.' }]
         },
         contents: [{ parts: [{ text: prompt }] }],
         generationConfig: {
           temperature: 1.0,
           maxOutputTokens: 300,
           responseMimeType: 'application/json',
         },
       }),
     });
     
     if (!res.ok) throw new Error(`Gemini error ${res.status}`);
     
     const data = await res.json();
     const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
     const clean = raw.replace(/```json|```/gi, '').trim();
     const q = JSON.parse(clean);
     
     if (!q.eq) throw new Error('No equation in response');
     
     recentEquations.push(q.eq);
     if (recentEquations.length > 5) recentEquations.shift();
     
     currentAnswer = (q.answer || '').replace(/\s/g, '');
     
     hideStatus();
     sessionCount++;
     
     isSolved = false;
     document.getElementById('fs-canvas-wrap').classList.remove('solved');
     
     document.getElementById('fs-topic-badge').textContent = topicLabels[currentTopic];
     document.getElementById('fs-eq-label').textContent = q.eq;
     document.getElementById('fs-hint-text').textContent = q.hint;
     
     document.getElementById('stat-count').textContent = sessionCount;
     document.getElementById('stat-topic').textContent = topicLabels[currentTopic];
     document.getElementById('page-placeholder').style.display = 'none';
     
     openOverlay();
     
     /* ── Word problem modal ── */
     const wpBtn = document.getElementById('wp-modal-btn');
     if (isWordProblem && q.problem) {
       document.getElementById('wp-modal-text').textContent = q.problem;
       wpBtn.style.display = '';
     } else {
       wpBtn.style.display = 'none';
       document.getElementById('wp-modal').classList.remove('open');
     }
     
     window.__currentWordProblem = (isWordProblem && q.problem) ? q.problem : null;
     
     if (gmReady) {
       requestAnimationFrame(() => requestAnimationFrame(() => mountEquation(q.eq)));
     } else {
       pendingEq = q.eq;
     }
     
   } catch (err) {
     showStatus('error', `PrepBot error: ${err.message}`);
     console.error(err);
   }
   
   pageBtn.classList.remove('loading');
   pageBtn.disabled = false;
   fsBtn.classList.remove('loading');
   fsBtn.disabled = false;
 }
 
 /* ═══════════════════════════════════════════
    MOUNT EQUATION INTO GM CANVAS
 ═══════════════════════════════════════════ */
 function mountEquation(eq) {
   const wrap = document.getElementById('fs-canvas-wrap');
   const canvasEl = document.getElementById('gm-fs-canvas');
   
   if (gmCanvas) {
     try { gmCanvas.remove(); } catch (e) {}
     gmCanvas = null;
   }
   canvasEl.innerHTML = '';
   const old = wrap.querySelector('.eq-fallback-fs');
   if (old) old.remove();
   
   try {
     gmCanvas = new gmath.Canvas('#gm-fs-canvas', {
       undo_btn: true,
       redo_btn: true,
       new_sheet_btn: false,
       font_size_btns: false,
       formula_btn: false,
       help_btn: false,
       help_logo_btn: false,
       fullscreen_toolbar_btn: false,
       fullscreen_btn: false,
       transform_btn: true,
       keypad_btn: false,
       scrub_btn: false,
       draw_btn: false,
       erase_btn: false,
       arrange_btn: true,
       reset_btn: false,
       save_btn: false,
       load_btn: false,
       settings_btn: true,
       insert_btn: true,
       insert_menu_items: { derivation: true, function: true, textbox: true },
       use_hold_menu: false,
       display_labels: false,
       btn_size: 'xs',
       ask_confirmation_on_closing: false,
       vertical_scroll: true,
       allow_fullscreen: false,
       use_degrees: true,
       show_balance_button: false,
       substitute_parentheses: true,
       auto_simplify_distribute: true,
       add_like_fractions: true,
       show_ellipsis: true,
       multiplication_sign: 'times',
       hide_multiplication: 'hide_where_possible',
     });
     
     /* Responsive font size */
     const fontSize = window.innerWidth < 480 ? 26 :
       window.innerWidth < 768 ? 32 :
       36;
     gmCanvas.controller.set_font_size(fontSize);
     
     /* Word problem topics: leave canvas blank for student to type */
     if (!window.__currentWordProblem) {
       const derivation = gmCanvas.model.createElement('derivation', {
         eq: eq,
         pos: { x: 'center', y: 100 },
       });
       if (derivation && typeof derivation.enableAutoSimplify === 'function') {
         derivation.enableAutoSimplify();
       }
     }
     
     /* ── Solved detection ── */
     gmCanvas.model.on('el_changed', function(evt) {
       if (isSolved || !currentAnswer || !evt || !evt.last_eq) return;
       console.log('[GM] last_eq:', evt.last_eq, '| expected:', currentAnswer);
       if (normaliseEq(evt.last_eq) === normaliseEq(currentAnswer)) {
         isSolved = true;
         document.getElementById('fs-canvas-wrap').classList.add('solved');
         gmCanvas.showHint('\u2713 Correct! Well done!');
       }
     });
     
   } catch (e) {
     canvasEl.innerHTML = '';
     const fb = document.createElement('div');
     fb.className = 'eq-fallback-fs';
     fb.textContent = eq;
     wrap.appendChild(fb);
     console.warn('GM render failed:', eq, e);
   }
 }
 
 /* ═══════════════════════════════════════════
    NORMALISE
 ═══════════════════════════════════════════ */
 function normaliseEq(str) {
   return (str || '')
     .replace(/\s/g, '')
     .replace(/[()]/g, '')
     .replace(/\u2264/g, '<=')
     .replace(/\u2265/g, '>=')
     .toLowerCase();
 }
 
 /* ═══════════════════════════════════════════
    STATUS HELPERS
 ═══════════════════════════════════════════ */
 function showStatus(type, msg) {
   const bar = document.getElementById('status-bar');
   bar.className = `status-bar ${type}`;
   bar.textContent = msg;
 }
 
 function hideStatus() {
   document.getElementById('status-bar').className = 'status-bar';
 }
 
 /* ═══════════════════════════════════════════
    INIT
 ═══════════════════════════════════════════ */
 updateGroupHighlight();
 
 document.addEventListener('keydown', e => {
   if (e.key === 'Escape' && overlayOpen) closeOverlay();
 });