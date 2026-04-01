// ============================================
// FIREBASE — KEY FETCH (UPDATED FOR MODULAR FIREBASE)
// Uses shared Firebase instance from firebase-init.js
// ============================================
import { auth, db } from '../../firebase-init.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js';

async function getGeminiKey() {
    // Wait for auth to be ready
    if (!auth) {
        throw new Error('Firebase auth not initialized');
    }
    
    // Wait for user to be authenticated (up to 5 seconds)
    let user = auth.currentUser;
    if (!user) {
        console.log('Waiting for user authentication...');
        await new Promise((resolve) => {
            const unsubscribe = auth.onAuthStateChanged((user) => {
                if (user) {
                    unsubscribe();
                    resolve();
                }
            });
            setTimeout(() => {
                unsubscribe();
                resolve();
            }, 5000);
        });
        user = auth.currentUser;
    }
    
    if (!user) {
        throw new Error('Please sign in to use PrepBot. Go to Account Settings to add your Gemini API key.');
    }
    
    console.log('Fetching Gemini key for user:', user.uid);
    
    try {
        // Try users/{uid} document first
        const userSnap = await getDoc(doc(db, 'users', user.uid));
        if (userSnap.exists()) {
            const geminiKey = userSnap.data().geminiKey;
            if (geminiKey && geminiKey.trim()) {
                console.log('Found Gemini key in users document');
                return geminiKey;
            }
        }
        
        // Try users/{uid}/settings/keys subcollection
        const settingsSnap = await getDoc(doc(db, 'users', user.uid, 'settings', 'keys'));
        if (settingsSnap.exists()) {
            const geminiKey = settingsSnap.data().geminiKey;
            if (geminiKey && geminiKey.trim()) {
                console.log('Found Gemini key in settings document');
                return geminiKey;
            }
        }
        
        throw new Error('No Gemini key found. Add one in Account Settings.');
        
    } catch (err) {
        console.error('Error fetching Gemini key:', err);
        throw new Error(`Could not retrieve API key: ${err.message}`);
    }
}

// ============================================
// GEMINI CONFIG - UPDATED MODELS
// ============================================
const GEMINI_MODELS = [
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent',
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-pro-preview:generateContent',
  'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash-lite:generateContent',
  'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent',
  'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-pro:generateContent',
];

let currentModelIndex = 0;

// Helper function to get next model URL
function getNextModelUrl() {
    const modelUrl = GEMINI_MODELS[currentModelIndex];
    currentModelIndex = (currentModelIndex + 1) % GEMINI_MODELS.length;
    return modelUrl;
}

// ============================================
// CLASS CURRICULUM DATA - Primary 1 to SS3
// ============================================
const curriculumTopics = {
    p1: {
        name: "Primary 1",
        level: "primary",
        topics: [
            { id: "p1-counting", label: "Counting & Number Patterns", difficulty: "easy", mappedTopic: "one-step" },
            { id: "p1-addition", label: "Simple Addition", difficulty: "easy", mappedTopic: "one-step" },
            { id: "p1-subtraction", label: "Simple Subtraction", difficulty: "easy", mappedTopic: "one-step" },
            { id: "p1-missing", label: "Find the Missing Number", difficulty: "easy", mappedTopic: "one-step" }
        ]
    },
    p2: {
        name: "Primary 2",
        level: "primary",
        topics: [
            { id: "p2-addition", label: "Addition with Unknown", difficulty: "easy", mappedTopic: "one-step" },
            { id: "p2-subtraction", label: "Subtraction with Unknown", difficulty: "easy", mappedTopic: "one-step" },
            { id: "p2-multiplication", label: "Simple Multiplication", difficulty: "easy", mappedTopic: "one-step" },
            { id: "p2-division", label: "Simple Division", difficulty: "easy", mappedTopic: "one-step" }
        ]
    },
    p3: {
        name: "Primary 3",
        level: "primary",
        topics: [
            { id: "p3-mult-step", label: "Multi-step Operations", difficulty: "easy-medium", mappedTopic: "two-step" },
            { id: "p3-fractions", label: "Simple Fractions", difficulty: "medium", mappedTopic: "fractions" },
            { id: "p3-word-problems", label: "Word Problems", difficulty: "medium", mappedTopic: "age-problems" }
        ]
    },
    p4: {
        name: "Primary 4",
        level: "primary",
        topics: [
            { id: "p4-equations", label: "Simple Equations", difficulty: "medium", mappedTopic: "one-step" },
            { id: "p4-variables", label: "Variables & Expressions", difficulty: "medium", mappedTopic: "both-sides" },
            { id: "p4-inequalities", label: "Simple Inequalities", difficulty: "medium", mappedTopic: "inequalities" }
        ]
    },
    p5: {
        name: "Primary 5",
        level: "primary",
        topics: [
            { id: "p5-one-step", label: "One-Step Equations", difficulty: "medium", mappedTopic: "one-step" },
            { id: "p5-two-step", label: "Two-Step Equations", difficulty: "medium", mappedTopic: "two-step" },
            { id: "p5-decimals", label: "Equations with Decimals", difficulty: "medium", mappedTopic: "decimals" }
        ]
    },
    p6: {
        name: "Primary 6",
        level: "primary",
        topics: [
            { id: "p6-variables-both", label: "Variables on Both Sides", difficulty: "medium-hard", mappedTopic: "both-sides" },
            { id: "p6-fractions", label: "Equations with Fractions", difficulty: "hard", mappedTopic: "fractions" },
            { id: "p6-word-problems", label: "Advanced Word Problems", difficulty: "hard", mappedTopic: "age-problems" }
        ]
    },
    jss1: {
        name: "JSS 1",
        level: "jss",
        topics: [
            { id: "jss1-linear", label: "Linear Equations", difficulty: "medium", mappedTopic: "both-sides" },
            { id: "jss1-simultaneous", label: "Simultaneous Equations", difficulty: "medium-hard", mappedTopic: "substitution" },
            { id: "jss1-inequalities", label: "Inequalities", difficulty: "medium", mappedTopic: "inequalities" },
            { id: "jss1-word-problems", label: "Word Problems", difficulty: "hard", mappedTopic: "age-problems" }
        ]
    },
    jss2: {
        name: "JSS 2",
        level: "jss",
        topics: [
            { id: "jss2-quadratic", label: "Quadratic Equations", difficulty: "hard", mappedTopic: "quadratic" },
            { id: "jss2-factorization", label: "Factorization", difficulty: "hard", mappedTopic: "quadratic" },
            { id: "jss2-algebraic-fractions", label: "Algebraic Fractions", difficulty: "hard", mappedTopic: "fractions" },
            { id: "jss2-graphs", label: "Graphical Solutions", difficulty: "hard", mappedTopic: "graphical" }
        ]
    },
    jss3: {
        name: "JSS 3",
        level: "jss",
        topics: [
            { id: "jss3-complex", label: "Complex Equations", difficulty: "hard", mappedTopic: "both-sides" },
            { id: "jss3-simultaneous-quad", label: "Simultaneous Quadratics", difficulty: "hard", mappedTopic: "substitution" },
            { id: "jss3-inequalities-advanced", label: "Advanced Inequalities", difficulty: "hard", mappedTopic: "compound-ineq" },
            { id: "jss3-exam-practice", label: "Exam Practice", difficulty: "hard", mappedTopic: "quadratic" }
        ]
    },
    ss1: {
        name: "SS 1",
        level: "ss",
        topics: [
            { id: "ss1-polynomials", label: "Polynomials", difficulty: "advanced", mappedTopic: "quadratic" },
            { id: "ss1-logarithms", label: "Logarithms", difficulty: "advanced", mappedTopic: "inequalities" },
            { id: "ss1-indices", label: "Indices & Surds", difficulty: "advanced", mappedTopic: "both-sides" },
            { id: "ss1-sequences", label: "Sequences & Series", difficulty: "advanced", mappedTopic: "quadratic" }
        ]
    },
    ss2: {
        name: "SS 2",
        level: "ss",
        topics: [
            { id: "ss2-calculus", label: "Introduction to Calculus", difficulty: "advanced", mappedTopic: "quadratic" },
            { id: "ss2-trigonometry", label: "Trigonometric Equations", difficulty: "advanced", mappedTopic: "quadratic" },
            { id: "ss2-exponential", label: "Exponential Functions", difficulty: "advanced", mappedTopic: "both-sides" },
            { id: "ss2-logarithmic", label: "Logarithmic Equations", difficulty: "advanced", mappedTopic: "inequalities" }
        ]
    },
    ss3: {
        name: "SS 3",
        level: "ss",
        topics: [
            { id: "ss3-differentiation", label: "Differentiation", difficulty: "advanced", mappedTopic: "quadratic" },
            { id: "ss3-integration", label: "Integration", difficulty: "advanced", mappedTopic: "quadratic" },
            { id: "ss3-waec-prep", label: "WAEC Prep", difficulty: "advanced", mappedTopic: "quadratic" },
            { id: "ss3-jamb-prep", label: "JAMB Prep", difficulty: "advanced", mappedTopic: "both-sides" }
        ]
    }
};

// ============================================
// TOPIC MAP
// ============================================
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

// ============================================
// STEP CONSTRAINTS
// ============================================
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

// ============================================
// METHOD HINT INSTRUCTIONS
// ============================================
const methodHintInstruction = {
    'transfer': 'Write the hint using the TRANSFER METHOD: describe moving a term across the equals sign with a sign change. ' +
        'E.g. "Transfer the +3 to the right side where it becomes −3, giving x = 7 − 3 = 4."',
    'balancing': 'Write the hint using the BALANCING METHOD: describe performing the same operation on BOTH sides. ' +
        'E.g. "Subtract 3 from both sides: x + 3 − 3 = 7 − 3, so x = 4."'
};

// ============================================
// STATE
// ============================================
let currentTopic = 'one-step';
let currentClassId = '';
let currentClassTopic = null;
let gmReady = false;
let gmCanvas = null;
let pendingEq = null;
let currentAnswer = null;
let sessionCount = 0;
let overlayOpen = false;
let isSolved = false;

const recentEquations = [];
const wordProblemTopics = new Set(['age-problems', 'speed-distance', 'mixture']);

// ============================================
// UTILITY FUNCTIONS
// ============================================
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

function normaliseEq(str) {
    return (str || '')
        .replace(/\s/g, '')
        .replace(/[()]/g, '')
        .replace(/\u2264/g, '<=')
        .replace(/\u2265/g, '>=')
        .toLowerCase();
}

// ============================================
// STATUS HELPERS
// ============================================
function showStatus(type, msg) {
    const bar = document.getElementById('status-bar');
    if (bar) {
        bar.className = `status-bar ${type}`;
        bar.textContent = msg;
        bar.style.height = '46px';
        setTimeout(() => {
            if (bar) bar.style.height = '0';
        }, 2500);
    }
}

function hideStatus() {
    const bar = document.getElementById('status-bar');
    if (bar) bar.className = 'status-bar';
}

// ============================================
// CLASS & TOPIC SELECTION FUNCTIONS
// ============================================
function onClassChange(selectedValue) {
    if (selectedValue) {
        currentClassId = selectedValue;
    } else {
        const select = document.getElementById('class-select');
        if (select) {
            currentClassId = select.value;
        }
    }
    
    if (!currentClassId) {
        document.getElementById('topic-container').innerHTML = '<div class="topic-placeholder">Select a class level first</div>';
        document.getElementById('stat-class').textContent = '—';
        return;
    }
    
    const classData = curriculumTopics[currentClassId];
    if (!classData) {
        console.error('Invalid class ID:', currentClassId);
        return;
    }
    
    document.getElementById('stat-class').textContent = classData.name;
    
    let topicsHtml = '<div class="topic-chips">';
    classData.topics.forEach(topic => {
        topicsHtml += `<button class="topic-chip" data-topic-id="${topic.id}" data-mapped-topic="${topic.mappedTopic}" onclick="setClassTopic(this)">${topic.label}</button>`;
    });
    topicsHtml += '</div>';
    document.getElementById('topic-container').innerHTML = topicsHtml;
    
    showStatus('info', `${classData.name} selected. Choose a topic.`);
}

function setClassTopic(btn) {
    document.querySelectorAll('#topic-container .topic-chip').forEach(chip => chip.classList.remove('active'));
    btn.classList.add('active');
    currentClassTopic = {
        id: btn.getAttribute('data-topic-id'),
        label: btn.innerText,
        mappedTopic: btn.getAttribute('data-mapped-topic')
    };
    currentTopic = currentClassTopic.mappedTopic;
    document.getElementById('stat-topic').textContent = currentClassTopic.label;
    showStatus('info', `Topic: ${currentClassTopic.label}`);
}

// ============================================
// METHOD SELECTION
// ============================================
function setMethod(btn) {
    document.querySelectorAll('.method-chip').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

// ============================================
// OVERLAY CONTROL
// ============================================
function openOverlay() {
    overlayOpen = true;
    const ov = document.getElementById('fs-overlay');
    ov.style.pointerEvents = '';
    ov.classList.add('open');
    const fab = document.getElementById('open-fab');
    if (fab) fab.classList.remove('visible');
    document.body.style.overflow = 'hidden';
}

function closeOverlay() {
    overlayOpen = false;
    const ov = document.getElementById('fs-overlay');
    ov.classList.remove('open');
    ov.style.pointerEvents = 'none';
    if (sessionCount > 0) {
        const fab = document.getElementById('open-fab');
        if (fab) fab.classList.add('visible');
    }
    document.body.style.overflow = '';
    const wpModal = document.getElementById('wp-modal');
    if (wpModal) wpModal.classList.remove('open');
}

function toggleOverlay() {
    overlayOpen ? closeOverlay() : openOverlay();
}

// ============================================
// WORD PROBLEM MODAL
// ============================================
function toggleWordProblemModal() {
    const modal = document.getElementById('wp-modal');
    if (modal) modal.classList.toggle('open');
}

// ============================================
// GRASPABLE MATH INIT & MOUNT
// ============================================
function mountEquation(eq) {
    const wrap = document.getElementById('fs-canvas-wrap');
    const canvasEl = document.getElementById('gm-fs-canvas');

    // Guard: if the container hasn't been laid out yet, retry once
    if (wrap && wrap.offsetHeight === 0) {
        console.warn('Canvas wrap has no height yet — retrying in 200ms');
        setTimeout(() => mountEquation(eq), 200);
        return;
    }
    
    if (gmCanvas) {
        try { gmCanvas.remove(); } catch (e) {}
        gmCanvas = null;
    }
    if (canvasEl) canvasEl.innerHTML = '';
    const old = wrap?.querySelector('.eq-fallback-fs');
    if (old) old.remove();
    
    try {
        gmCanvas = new gmath.Canvas('#gm-fs-canvas', {
            // ── History ──
            undo_btn: true,
            redo_btn: true,
            // ── Sheet ──
            new_sheet_btn: false,
            font_size_btns: false,
            // ── Tools (all enabled for students) ──
            formula_btn: false,
            help_btn: false,
            help_logo_btn: false,
            fullscreen_toolbar_btn: false,
            fullscreen_btn: false,
            transform_btn: true,
            keypad_btn: true,       // ← enabled: on-screen keypad
            scrub_btn: false,
            draw_btn: true,         // ← enabled: freehand drawing
            erase_btn: true,        // ← enabled: eraser
            arrange_btn: true,
            reset_btn: true,        // ← enabled: clear canvas
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
        
        const fontSize = window.innerWidth < 480 ? 26 :
            window.innerWidth < 768 ? 32 :
            36;
        gmCanvas.controller.set_font_size(fontSize);
        
        // Always add the equation — word problems still need the equation on the canvas
        const derivation = gmCanvas.model.createElement('derivation', {
            eq: eq,
            pos: { x: 'center', y: 100 },
        });
        if (derivation && typeof derivation.enableAutoSimplify === 'function') {
            derivation.enableAutoSimplify();
        }
        
        gmCanvas.model.on('el_changed', function(evt) {
            if (isSolved || !currentAnswer || !evt || !evt.last_eq) return;
            if (normaliseEq(evt.last_eq) === normaliseEq(currentAnswer)) {
                isSolved = true;
                const canvasWrap = document.getElementById('fs-canvas-wrap');
                if (canvasWrap) canvasWrap.classList.add('solved');
                if (gmCanvas) gmCanvas.showHint('✓ Correct! Well done!');
            }
        });
        
    } catch (e) {
        if (canvasEl) {
            canvasEl.innerHTML = '';
            const fb = document.createElement('div');
            fb.className = 'eq-fallback-fs';
            fb.textContent = eq;
            if (wrap) wrap.appendChild(fb);
        }
        console.warn('GM render failed:', eq, e);
    }
}

// ============================================
// GENERATE — Gemini with class context and model rotation
// ============================================
async function generateQuestion() {
    const pageBtn = document.getElementById('gen-btn');
    const fsBtn = document.getElementById('fs-new-btn');
    
    if (!currentClassId) {
        showStatus('error', 'Please select a class level first');
        return;
    }
    if (!currentClassTopic) {
        showStatus('error', 'Please select a topic');
        return;
    }
    
    if (pageBtn) {
        pageBtn.classList.add('loading');
        pageBtn.disabled = true;
    }
    if (fsBtn) {
        fsBtn.classList.add('loading');
        fsBtn.disabled = true;
    }
    
    showStatus('info', '✨ PrepBot is generating your equation...');
    
    try {
        const geminiKey = await getGeminiKey();
        const modelUrl = getNextModelUrl();
        
        const seed = buildVarietySeed();
        const avoidClause = recentEquations.length ?
            `\nDo NOT reuse any of these recent equations: ${recentEquations.join(' | ')}` :
            '';
        const isWordProblem = wordProblemTopics.has(currentTopic);
        const stepRule = topicSteps[currentTopic];
        const method = document.querySelector('.method-chip.active')?.dataset?.method || 'transfer';
        const hintInstruction = methodHintInstruction[method];
        
        const classData = curriculumTopics[currentClassId];
        const classContext = classData ? `Student is in ${classData.name} (${classData.level.toUpperCase()} level).` : '';
        const topicContext = currentClassTopic ? `Selected topic: ${currentClassTopic.label}.` : '';
        
        const prompt = `You are PrepBot, an algebra tutor. ${classContext} ${topicContext}
Generate exactly 1 equation for the topic: ${topicLabels[currentTopic]}.

COMPLEXITY RULE (MOST IMPORTANT — do not violate this):
${stepRule}

VARIETY RULES:
- Use these seed values so the equation is different each time: a=${seed.a}, b=${seed.b}, c=${seed.c}, target answer≈${seed.x}
- Vary signs and structure — use negative coefficients or answers sometimes${avoidClause}
- Ensure the difficulty matches ${classData?.name || 'the selected class'} level

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
        
        const res = await fetch(`${modelUrl}?key=${geminiKey}`, {
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
        const canvasWrap = document.getElementById('fs-canvas-wrap');
        if (canvasWrap) canvasWrap.classList.remove('solved');
        
        // Update footer hint
        const fsHintText = document.getElementById('fs-hint-text');
        if (fsHintText) fsHintText.textContent = q.hint;
        
        // Word problem button (lives in footer)
        const wpBtn = document.getElementById('wp-modal-btn');
        if (isWordProblem && q.problem) {
            const wpText = document.getElementById('wp-modal-text');
            if (wpText) wpText.textContent = q.problem;
            if (wpBtn) wpBtn.style.display = '';
        } else {
            if (wpBtn) wpBtn.style.display = 'none';
            const wpModal = document.getElementById('wp-modal');
            if (wpModal) wpModal.classList.remove('open');
        }
        
        window.__currentWordProblem = (isWordProblem && q.problem) ? q.problem : null;
        
        // Update page stats
        const statCount = document.getElementById('stat-count');
        const statTopic = document.getElementById('stat-topic');
        const pagePlaceholder = document.getElementById('page-placeholder');
        
        if (statCount) statCount.textContent = sessionCount;
        if (statTopic) statTopic.textContent = currentClassTopic?.label || topicLabels[currentTopic];
        if (pagePlaceholder) pagePlaceholder.style.display = 'none';
        
        openOverlay();
        
        if (gmReady) {
            // Wait for the overlay CSS transition + flex reflow to complete
            // before GM tries to measure the canvas container.
            // Double-RAF is ~16ms — not enough for a 300ms CSS transition.
            setTimeout(() => mountEquation(q.eq), 320);
        } else {
            pendingEq = q.eq;
        }
        
    } catch (err) {
        showStatus('error', `PrepBot error: ${err.message}`);
        console.error(err);
    }
    
    if (pageBtn) {
        pageBtn.classList.remove('loading');
        pageBtn.disabled = false;
    }
    if (fsBtn) {
        fsBtn.classList.remove('loading');
        fsBtn.disabled = false;
    }
}

// ============================================
// TICKER INIT
// ============================================
const tickerItems = [
    "Primary 1-6", "JSS 1-3", "SS 1-3", "Linear Equations", "Quadratic Equations",
    "Inequalities", "Word Problems", "Simultaneous Equations", "Polynomials",
    "Calculus", "WAEC Prep", "JAMB Prep", "Interactive Canvas", "AI-Generated"
];

function injectTicker() {
    const track = document.getElementById('ticker-track');
    if (!track) return;
    const items = [...tickerItems, ...tickerItems];
    track.innerHTML = items.map(item =>
        `<span class="ticker-item">${item}<span class="ticker-dot"></span></span>`
    ).join('');
}

// ============================================
// NAVIGATION TOGGLE
// ============================================
function initNavToggle() {
    const toggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');
    if (toggle && navLinks) {
        toggle.addEventListener('click', () => {
            toggle.classList.toggle('open');
            navLinks.classList.toggle('open');
        });
    }
}

// ============================================
// CUSTOM DROPDOWN INITIALIZATION
// ============================================
function initCustomDropdown() {
    const trigger = document.getElementById('cdd-trigger');
    const panel = document.getElementById('cdd-panel');
    const valueDisplay = document.getElementById('cdd-value');
    const options = document.querySelectorAll('.cdd-option');
    
    if (!trigger || !panel) return;
    
    let currentValue = '';
    
    function closeDropdown() {
        trigger.setAttribute('aria-expanded', 'false');
        panel.classList.remove('open');
    }
    
    function openDropdown() {
        trigger.setAttribute('aria-expanded', 'true');
        panel.classList.add('open');
    }
    
    function toggleDropdown(e) {
        e.stopPropagation();
        const expanded = trigger.getAttribute('aria-expanded') === 'true';
        if (expanded) {
            closeDropdown();
        } else {
            openDropdown();
        }
    }
    
    function selectOption(option) {
        const value = option.getAttribute('data-value');
        const label = option.textContent;
        
        valueDisplay.textContent = label;
        currentValue = value;
        currentClassId = value;
        
        if (typeof window.onClassChange === 'function') {
            window.onClassChange(value);
        }
        
        closeDropdown();
        
        options.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
    }
    
    trigger.addEventListener('click', toggleDropdown);
    
    options.forEach(option => {
        option.addEventListener('click', function(e) {
            e.stopPropagation();
            selectOption(this);
        });
    });
    
    document.addEventListener('click', function(e) {
        if (!trigger.contains(e.target) && !panel.contains(e.target)) {
            closeDropdown();
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && panel.classList.contains('open')) {
            closeDropdown();
        }
    });
    
    const defaultOption = document.querySelector('.cdd-option[data-value="p1"]');
    if (defaultOption && !currentValue) {
        selectOption(defaultOption);
    }
}

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    injectTicker();
    initNavToggle();
    initCustomDropdown();
    
    const statCount = document.getElementById('stat-count');
    const statClass = document.getElementById('stat-class');
    const statTopic = document.getElementById('stat-topic');
    if (statCount) statCount.textContent = '0';
    if (statClass) statClass.textContent = '—';
    if (statTopic) statTopic.textContent = '—';
    
    // Check if user is logged in and display status
    if (auth && auth.currentUser) {
        console.log('User logged in:', auth.currentUser.email);
    } else if (auth) {
        console.log('Waiting for user login...');
        auth.onAuthStateChanged((user) => {
            if (user) {
                console.log('User logged in:', user.email);
            }
        });
    }
});

// Load Graspable Math
if (typeof loadGM === 'function') {
    loadGM(function() {
        if (typeof gmath !== 'undefined') {
            gmath.setDarkTheme(true);
        }
        gmReady = true;
        if (pendingEq) {
            const eq = pendingEq;
            pendingEq = null;
            // Give the overlay layout time to settle before GM measures
            setTimeout(() => mountEquation(eq), 320);
        }
    }, { version: 'latest' });
}

// ESC key listener
document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlayOpen) closeOverlay();
});

// Make functions available globally
window.onClassChange = onClassChange;
window.setClassTopic = setClassTopic;
window.setMethod = setMethod;
window.generateQuestion = generateQuestion;
window.openOverlay = openOverlay;
window.closeOverlay = closeOverlay;
window.toggleOverlay = toggleOverlay;
window.toggleWordProblemModal = toggleWordProblemModal;
