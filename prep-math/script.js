// script.js - Main Algebra Practice Application with Gemini and Graspable Math
// API keys loaded from the keys module, state from ../state.js
import * as PrepPortalKeys from '../../theory-page/js/keys.js';

import { auth, db } from '../../firebase-init.js';
import { collection, addDoc, doc, serverTimestamp, query, where, getDocs } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";
import { state as sharedState } from '../../theory-page/state.js';
import { handleVideoBtn } from './video.js';


// ============================================
// EXTEND SHARED STATE WITH ALGEBRA-SPECIFIC FIELDS
// ============================================
// FIX: Do NOT read window.PrepPortalKeys here — keys.js populates it
// asynchronously (Firestore read → verify → broadcast). At module parse
// time window.PrepPortalKeys is still undefined, causing:
//   TypeError: Cannot read properties of undefined (reading 'gemini')
// The key is assigned inside loadKeysFromModule() after the
// 'prepportal:keysReady' event fires.
sharedState.GEMINI_KEY = null;           // ← was: window.PrepPortalKeys.gemini || null
sharedState.YT_KEY = sharedState.YT_KEY || null;
sharedState.YT_KEY_VERIFIED = sharedState.YT_KEY_VERIFIED || false;
sharedState.currentClass = null;
sharedState.currentTopic = null;
sharedState.currentSubject = 'Algebra';
sharedState.currentMethod = 'transfer';
sharedState.currentQuestion = null;
sharedState.currentWordProblem = null;
sharedState.currentHint = null;
sharedState.currentEquation = null;
sharedState.currentAnswer = null;
sharedState.solvedCount = 0;
sharedState.user = null;
sharedState.st = sharedState.st || { cls: null, subject: 'Algebra', topic: null };

// Export the same object as state for other modules
export const state = sharedState;

// ============================================
// GRASPABLE MATH STATE
// ============================================
let gmReady = false;
let gmCanvas = null;
let pendingEq = null;
let isSolved = false;
let overlayOpen = false;
let sessionCount = 0;
const recentEquations = [];

// Word problem topics (show word problem modal, canvas blank)
const wordProblemTopics = new Set(['age-problems', 'speed-distance', 'mixture']);

// ============================================
// TOPIC MAP (from working groq version)
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

const methodHintInstruction = {
  'transfer': `Write the hint using the TRANSFER METHOD: describe moving a term across the equals sign with a sign change. ` +
    `E.g. "Transfer the +3 to the right side where it becomes −3, giving x = 7 − 3 = 4."`,
  'balancing': `Write the hint using the BALANCING METHOD: describe performing the same operation on BOTH sides. ` +
    `E.g. "Subtract 3 from both sides: x + 3 − 3 = 7 − 3, so x = 4."`
};

// ============================================
// GEMINI CONFIG
// ============================================
const GEMINI_MODELS = [
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent',
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent',
];

// ============================================
// COMPREHENSIVE CURRICULUM DATA
// ============================================
const CURRICULUM = {
  primary: {
    p1: { subjects: ['Arithmetic', 'Algebra', 'Geometry', 'Statistics'], topics: { Arithmetic: ['Counting 1-100', 'Addition (0-20)', 'Subtraction (0-20)'], Algebra: ['Finding Missing Numbers', 'Simple Equations'], Geometry: ['Shapes', 'Position Words'], Statistics: ['Simple Graphs', 'Counting Objects'] } },
    p2: { subjects: ['Arithmetic', 'Algebra', 'Geometry', 'Statistics'], topics: { Arithmetic: ['Addition up to 100', 'Subtraction up to 100', 'Multiplication Tables'], Algebra: ['Simple Equations', 'Number Sequences'], Geometry: ['2D Shapes Properties', '3D Shapes'], Statistics: ['Bar Graphs', 'Tally Charts'] } },
    p3: { subjects: ['Arithmetic', 'Algebra', 'Geometry', 'Statistics'], topics: { Arithmetic: ['Addition with Carrying', 'Subtraction with Borrowing', 'Multiplication'], Algebra: ['Equations with Two Operations', 'Patterns'], Geometry: ['Angles', 'Area of Rectangles'], Statistics: ['Line Plots', 'Mean, Median, Mode'] } },
    p4: { subjects: ['Arithmetic', 'Algebra', 'Geometry', 'Statistics'], topics: { Arithmetic: ['Large Number Operations', 'Factors and Multiples'], Algebra: ['Algebraic Expressions', 'Simple Inequalities'], Geometry: ['Types of Triangles', 'Quadrilaterals'], Statistics: ['Pie Charts', 'Line Graphs'] } },
    p5: { subjects: ['Arithmetic', 'Algebra', 'Geometry', 'Statistics'], topics: { Arithmetic: ['Fractions, Decimals, Percentages', 'Order of Operations'], Algebra: ['Solving Linear Equations', 'Simplifying Expressions'], Geometry: ['Circle Properties', 'Coordinates'], Statistics: ['Mean, Median, Mode', 'Probability'] } },
    p6: { subjects: ['Arithmetic', 'Algebra', 'Geometry', 'Statistics'], topics: { Arithmetic: ['Advanced Operations', 'Ratio and Proportion'], Algebra: ['Linear Equations with Fractions', 'Graphing'], Geometry: ['Area of Composite Shapes', 'Volume'], Statistics: ['Data Analysis', 'Statistical Graphs'] } }
  },
  junior: {
    jss1: { subjects: ['Algebra', 'Geometry', 'Statistics', 'Trigonometry'], topics: { Algebra: ['Introduction to Algebra', 'Simple Equations'], Geometry: ['Lines and Angles', 'Triangles'], Statistics: ['Data Collection', 'Frequency Tables'], Trigonometry: ['Introduction to Trigonometry', 'Sine, Cosine, Tangent'] } },
    jss2: { subjects: ['Algebra', 'Geometry', 'Statistics', 'Trigonometry'], topics: { Algebra: ['Linear Equations', 'Simultaneous Equations'], Geometry: ['Congruent Triangles', 'Circle Theorems'], Statistics: ['Cumulative Frequency', 'Probability'], Trigonometry: ['Trigonometric Ratios', 'Angles of Elevation'] } },
    jss3: { subjects: ['Algebra', 'Geometry', 'Statistics', 'Trigonometry'], topics: { Algebra: ['Quadratic Equations', 'Indices'], Geometry: ['Coordinate Geometry', 'Mensuration'], Statistics: ['Probability', 'Standard Deviation'], Trigonometry: ['Sine and Cosine Rules', 'Bearings'] } }
  },
  senior: {
    ss1: { subjects: ['Algebra', 'Geometry', 'Statistics', 'Trigonometry', 'Calculus', 'Matrices'], topics: { Algebra: ['Quadratic Equations', 'Polynomials'], Geometry: ['Coordinate Geometry', 'Circle Geometry'], Statistics: ['Probability Theory', 'Measures of Dispersion'], Trigonometry: ['Trigonometric Functions', 'Identities'], Calculus: ['Limits', 'Differentiation'], Matrices: ['Matrix Operations', 'Determinants'] } },
    ss2: { subjects: ['Algebra', 'Geometry', 'Statistics', 'Trigonometry', 'Calculus', 'Matrices'], topics: { Algebra: ['Partial Fractions', 'Sequences'], Geometry: ['Vectors', 'Conic Sections'], Statistics: ['Normal Distribution', 'Correlation'], Trigonometry: ['Compound Angles', 'Trigonometric Proofs'], Calculus: ['Integration', 'Differential Equations'], Matrices: ['2x2 Matrix Applications', 'Linear Transformations'] } },
    ss3: { subjects: ['Algebra', 'Geometry', 'Statistics', 'Trigonometry', 'Calculus', 'Matrices'], topics: { Algebra: ['Further Algebra', 'Roots of Equations'], Geometry: ['Analytical Geometry', '3D Geometry'], Statistics: ['Advanced Probability', 'Sampling'], Trigonometry: ['Trigonometric Series', 'Harmonic Motion'], Calculus: ['Integration Techniques', 'Series Expansions'], Matrices: ['3x3 Matrices', 'Markov Chains'] } }
  }
};

// ============================================
// HELPER FUNCTIONS
// ============================================
function getSubjectForClass(classLevel) {
  if (classLevel.startsWith('p')) return 'Arithmetic';
  if (classLevel.startsWith('jss')) return 'Algebra';
  return 'Algebra';
}

function getTopicsForClass(classLevel, subject) {
  let curriculum;
  if (classLevel.startsWith('p')) curriculum = CURRICULUM.primary[classLevel];
  else if (classLevel.startsWith('jss')) curriculum = CURRICULUM.junior[classLevel];
  else curriculum = CURRICULUM.senior[classLevel];
  if (!curriculum) return [];
  return curriculum.topics[subject] || [];
}

function updateTopicChips() {
  const container = document.getElementById('topic-container');
  if (!container) return;
  if (!state.currentClass) {
    container.innerHTML = '<div class="topic-placeholder">Select a class level first</div>';
    return;
  }
  const topics = getTopicsForClass(state.currentClass, state.currentSubject);
  if (!topics.length) {
    container.innerHTML = '<div class="topic-placeholder">No topics available</div>';
    return;
  }
  container.innerHTML = `<div class="topic-chips">${topics.map(topic => `<button class="topic-chip ${state.currentTopic === topic ? 'active' : ''}" data-topic="${topic}">${topic}</button>`).join('')}</div>`;
  document.querySelectorAll('.topic-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.topic-chip').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      state.currentTopic = btn.dataset.topic;
      state.st.topic = state.currentTopic;
      updateStatsDisplay();
    });
  });
}

function updateStatsDisplay() {
  const solvedCountEl = document.getElementById('stat-count');
  const classEl = document.getElementById('stat-class');
  const topicEl = document.getElementById('stat-topic');
  if (solvedCountEl) solvedCountEl.textContent = state.solvedCount;
  if (classEl) classEl.textContent = state.currentClass ? state.currentClass.toUpperCase() : '—';
  if (topicEl) topicEl.textContent = state.currentTopic || '—';
}

function showStatus(message, type = 'info') {
  const statusBar = document.getElementById('status-bar');
  if (!statusBar) return;
  statusBar.textContent = message;
  statusBar.className = `status-bar ${type}`;
  setTimeout(() => { statusBar.className = 'status-bar';
    statusBar.textContent = ''; }, 3000);
}

window.setMethod = function(btn) {
  document.querySelectorAll('.method-chip').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  state.currentMethod = btn.dataset.method;
};

function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function buildVarietySeed() {
  return { a: randInt(2, 13), b: randInt(1, 20), c: randInt(1, 15), x: randInt(-9, 9) || 2 };
}

// ============================================
// GRASPABLE MATH INIT
// ============================================
function loadGM(callback, options = {}) {
  if (window.gmath && window.gmath.Canvas) {
    callback();
    return;
  }
  const script = document.createElement('script');
  script.src = 'https://graspablemath.com/shared/libs/gmath/gm-inject.js';
  script.onload = () => {
    if (options.version && window.gmath) {
      window.gmath.setVersion(options.version);
    }
    callback();
  };
  document.head.appendChild(script);
}

// Helper to escape HTML for fallback
function escapeHtml(str) {
  return str.replace(/[&<>]/g, function(m) {
    if (m === '&') return '&amp;';
    if (m === '<') return '&lt;';
    if (m === '>') return '&gt;';
    return m;
  });
}

// function mountEquation(eq) {
//   const wrap = document.getElementById('fs-canvas-wrap');
//   const canvasEl = document.getElementById('gm-fs-canvas');
//   if (!wrap || !canvasEl) {
//     console.warn('Canvas elements not found');
//     return;
//   }
  
//   if (gmCanvas) {
//     try { gmCanvas.remove(); } catch (e) {}
//     gmCanvas = null;
//   }
  
//   // Remove only our fallback elements, not all children
//   const oldFallback = wrap.querySelector('.eq-fallback-fs');
//   if (oldFallback) oldFallback.remove();
  
//   // For word problem topics, leave canvas blank
//   const isWordProblem = wordProblemTopics.has(state.currentTopic);
//   if (isWordProblem) {
//     canvasEl.innerHTML = '<div class="eq-fallback-fs" style="color: #aaa; font-size: 14px;">✏️ Type your equation using the + menu above. Click "Insert" → "Derivation" to start.</div>';
//     return;
//   }
  
//   try {
//     gmCanvas = new window.gmath.Canvas('#gm-fs-canvas', {
//       undo_btn: true,
//       redo_btn: true,
//       new_sheet_btn: false,
//       font_size_btns: false,
//       formula_btn: false,
//       help_btn: false,
//       help_logo_btn: false,
//       fullscreen_toolbar_btn: false,
//       fullscreen_btn: false,
//       transform_btn: true,
//       keypad_btn: false,
//       scrub_btn: false,
//       draw_btn: false,
//       erase_btn: false,
//       arrange_btn: true,
//       reset_btn: false,
//       save_btn: false,
//       load_btn: false,
//       settings_btn: true,
//       insert_btn: true,
//       insert_menu_items: {
//         derivation: true,
//         function: true,
//         textbox: true,
//       },
//       use_hold_menu: false,
//       display_labels: false,
//       btn_size: 'xs',
//       ask_confirmation_on_closing: false,
//       vertical_scroll: true,
//       allow_fullscreen: false,
//       use_degrees: true,
//       show_balance_button: false,
//       substitute_parentheses: true,
//       auto_simplify_distribute: true,
//       add_like_fractions: true,
//       show_ellipsis: true,
//       multiplication_sign: 'times',
//       hide_multiplication: 'hide_where_possible',
//     });
    
//     const fontSize = window.innerWidth < 480 ? 26 : window.innerWidth < 768 ? 32 : 36;
//     gmCanvas.controller.set_font_size(fontSize);
    
//     const derivation = gmCanvas.model.createElement('derivation', {
//       eq: eq,
//       pos: { x: 'center', y: 100 },
//     });
//     if (derivation && typeof derivation.enableAutoSimplify === 'function') {
//       derivation.enableAutoSimplify();
//     }
    
//     // Solved detection
//     gmCanvas.model.on('el_changed', function(evt) {
//       if (isSolved || !state.currentAnswer || !evt || !evt.last_eq) return;
//       if (normaliseEq(evt.last_eq) === normaliseEq(state.currentAnswer)) {
//         isSolved = true;
//         document.getElementById('fs-canvas-wrap').classList.add('solved');
//         if (gmCanvas.showHint) gmCanvas.showHint('✓ Correct! Well done!');
//         onSolutionCorrect();
//       }
//     });
    
//   } catch (e) {
//     console.error('GM render failed:', eq, e);
//     canvasEl.innerHTML = '';
//     const fb = document.createElement('div');
//     fb.className = 'eq-fallback-fs';
//     fb.textContent = eq;
//     wrap.appendChild(fb);
//     showStatus('Canvas could not be loaded. Please refresh the page.', 'error');
//   }
// }

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
      insert_menu_items: {
        derivation: true,
        function: true,
        textbox: true,
      },
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
    
    /* Word problem topics: canvas is intentionally left blank.
       The student reads the problem from the modal and types the
       equation themselves using the GM insert menu. */
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
        gmCanvas.showHint('✓ Correct! Well done!');
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


function normaliseEq(str) {
  return (str || '').replace(/\s/g, '').replace(/[()]/g, '').replace(/≤/g, '<=').replace(/≥/g, '>=').toLowerCase();
}

// Initialize Graspable Math
loadGM(function() {
  if (window.gmath && typeof window.gmath.setDarkTheme === 'function') {
    window.gmath.setDarkTheme(true);
  }
  gmReady = true;
  if (pendingEq) {
    const eq = pendingEq;
    pendingEq = null;
    requestAnimationFrame(() => requestAnimationFrame(() => mountEquation(eq)));
  }
}, { version: 'latest' });

// ============================================
// GEMINI QUESTION GENERATION
// ============================================
let currentAbortController = null;

async function generateWithGemini() {
  // Cancel any ongoing request
  if (currentAbortController) {
    currentAbortController.abort();
  }
  currentAbortController = new AbortController();
  const signal = currentAbortController.signal;
  
  try {
    for (const modelUrl of GEMINI_MODELS) {
      try {
        const res = await fetch(`${modelUrl}?key=${encodeURIComponent(state.GEMINI_KEY)}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `You are PrepBot, an algebra tutor. Generate exactly 1 equation for the topic: ${topicLabels[state.currentTopic] || state.currentTopic}.

COMPLEXITY RULE (MOST IMPORTANT — do not violate this):
${topicSteps[state.currentTopic]}

VARIETY RULES:
- Use these seed values so the equation is different each time: a=${randInt(2,13)}, b=${randInt(1,20)}, c=${randInt(1,15)}, target answer≈${randInt(-9,9)||2}
- Vary signs and structure — use negative coefficients or answers sometimes${recentEquations.length ? `\nDo NOT reuse any of these recent equations: ${recentEquations.join(' | ')}` : ''}

METHOD FOR HINT:
${methodHintInstruction[state.currentMethod] || methodHintInstruction['transfer']}

Return ONLY a valid JSON object — no markdown, no explanation:
- "eq": clean ASCII string parseable by Graspable Math (use +, -, *, /, =, >, <; no LaTeX; use * for multiplication)
- "answer": solved form with no spaces, e.g. "x=4", "x>9/5", "x=-3/2"
- "hint": one sentence following the method instruction above
${wordProblemTopics.has(state.currentTopic) ? '- "problem": the word problem as a plain English sentence (no equations here)' : ''}

Examples:
{"eq": "x + 7 = 15", "answer": "x=8", "hint": "Transfer +7 to the right as −7."}
{"eq": "3x = 18", "answer": "x=6", "hint": "Divide both sides by 3."}
{"eq": "2x + 3 = 11", "answer": "x=4", "hint": "Subtract 3 from both sides, then divide by 2."}` }] }]
          }),
          signal
        });
        
        if (res.status === 429 || res.status === 503 || !res.ok) continue;
        
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const q = JSON.parse(jsonMatch[0]);
          if (q.eq) {
            currentAbortController = null;
            return q;
          }
        }
      } catch (e) {
        // FIX: rethrow AbortError immediately — without this, a cancelled
        // request silently falls through to the next model in the loop.
        if (e.name === 'AbortError') throw e;
        console.warn('Gemini model failed:', e);
      }
    }
    throw new Error('All Gemini models failed');
  } finally {
    currentAbortController = null;
  }
}

export async function generateQuestion() {
  const pageBtn = document.getElementById('gen-btn');
  const fsBtn = document.getElementById('fs-new-btn');
  if (pageBtn) { pageBtn.classList.add('loading');
    pageBtn.disabled = true; }
  if (fsBtn) { fsBtn.classList.add('loading');
    fsBtn.disabled = true; }
  showStatus('⟳ PrepBot is generating your equation...', 'info');
  
  try {
    const q = await generateWithGemini();
    
    recentEquations.push(q.eq);
    if (recentEquations.length > 5) recentEquations.shift();
    
    state.currentEquation = q.eq;
    state.currentAnswer = (q.answer || '').replace(/\s/g, '');
    state.currentHint = q.hint;
    state.currentWordProblem = q.problem || null;
    
    sessionCount++;
    state.solvedCount = sessionCount;
    isSolved = false;
    
    const canvasWrap = document.getElementById('fs-canvas-wrap');
    if (canvasWrap) canvasWrap.classList.remove('solved');
    
    const hintText = document.getElementById('fs-hint-text');
    if (hintText) hintText.textContent = q.hint;
    
    const statCount = document.getElementById('stat-count');
    if (statCount) statCount.textContent = sessionCount;
    
    const statTopic = document.getElementById('stat-topic');
    if (statTopic) statTopic.textContent = topicLabels[state.currentTopic] || state.currentTopic;
    
    const placeholder = document.getElementById('page-placeholder');
    if (placeholder) placeholder.style.display = 'none';
    
    updateStatsDisplay();
    
    // Word problem modal handling
    const isWordProblem = wordProblemTopics.has(state.currentTopic);
    const wpBtn = document.getElementById('wp-modal-btn');
    const wpText = document.getElementById('wp-modal-text');
    
    if (isWordProblem && q.problem) {
      if (wpText) wpText.textContent = q.problem;
      if (wpBtn) wpBtn.style.display = 'flex';
    } else {
      if (wpBtn) wpBtn.style.display = 'none';
      const wpModal = document.getElementById('wp-modal');
      if (wpModal) wpModal.classList.remove('open');
    }
    
    // Save to Firebase if user is logged in (with error handling)
    if (state.user) {
      try {
        await addDoc(collection(db, 'questions'), {
          userId: state.user.uid,
          class: state.currentClass,
          subject: state.currentSubject,
          topic: state.currentTopic,
          equation: q.eq,
          answer: q.answer,
          hint: q.hint,
          wordProblem: q.problem,
          timestamp: serverTimestamp()
        });
      } catch (firebaseError) {
        console.warn('Failed to save to Firebase (permission issue):', firebaseError.message);
      }
    }
    
    openOverlay();
    
    // Wait for overlay to be visible before mounting
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (gmReady) {
          mountEquation(q.eq);
        } else {
          pendingEq = q.eq;
        }
      });
    });
    
    showStatus('Question generated! Solve it in the canvas.', 'success');
    
  } catch (error) {
    if (error.name === 'AbortError') {
      // User cancelled the request (e.g., clicked generate again) - ignore
      console.log('Generation aborted');
      return;
    }
    console.error('Generation error:', error);
    showStatus(`Failed to generate: ${error.message}`, 'error');
  } finally {
    if (pageBtn) { pageBtn.classList.remove('loading');
      pageBtn.disabled = false; }
    if (fsBtn) { fsBtn.classList.remove('loading');
      fsBtn.disabled = false; }
  }
}

// ============================================
// SOLUTION CORRECT HANDLER
// ============================================
export async function onSolutionCorrect() {
  state.solvedCount++;
  sessionCount = state.solvedCount;
  updateStatsDisplay();
  
  const canvasWrap = document.getElementById('fs-canvas-wrap');
  if (canvasWrap) {
    canvasWrap.classList.add('solved');
    setTimeout(() => canvasWrap.classList.remove('solved'), 500);
  }
  
  showStatus('✅ Correct! Great job!', 'success');
  
  // Save to Firebase with error handling
  if (state.user && state.currentEquation) {
    try {
      await addDoc(collection(db, 'solutions'), {
        userId: state.user.uid,
        class: state.currentClass,
        subject: state.currentSubject,
        topic: state.currentTopic,
        equation: state.currentEquation,
        answer: state.currentAnswer,
        solved: true,
        timestamp: serverTimestamp()
      });
    } catch (firebaseError) {
      console.warn('Failed to save solution to Firebase:', firebaseError.message);
    }
  }
  
  setTimeout(() => generateQuestion(), 2000);
}

// ============================================
// OVERLAY FUNCTIONS
// ============================================
function openOverlay() {
  overlayOpen = true;
  const ov = document.getElementById('fs-overlay');
  if (ov) {
    ov.style.pointerEvents = '';
    ov.classList.add('open');
  }
  const fab = document.getElementById('open-fab');
  if (fab) fab.classList.remove('visible');
  document.body.style.overflow = 'hidden';
}

window.openOverlay = openOverlay;

function closeOverlay() {
  overlayOpen = false;
  const ov = document.getElementById('fs-overlay');
  if (ov) {
    ov.classList.remove('open');
    ov.style.pointerEvents = 'none';
  }
  const fab = document.getElementById('open-fab');
  if (fab && sessionCount > 0) fab.classList.add('visible');
  document.body.style.overflow = '';
  const wpModal = document.getElementById('wp-modal');
  if (wpModal) wpModal.classList.remove('open');
}

window.closeOverlay = closeOverlay;

function toggleWordProblemModal() {
  const modal = document.getElementById('wp-modal');
  if (modal) modal.classList.toggle('open');
}

window.toggleWordProblemModal = toggleWordProblemModal;

// ============================================
// API KEYS LOADING
// ============================================
let keysReadyPromise = null;

function loadKeysFromModule() {
  if (keysReadyPromise) return keysReadyPromise;
  
  keysReadyPromise = new Promise((resolve) => {
    // Fast path: keys.js already finished before this module ran
    if (window.PrepPortalKeys?.gemini) {
      state.GEMINI_KEY = window.PrepPortalKeys.gemini;
      state.YT_KEY = window.PrepPortalKeys.youtube || null;
      console.log('[Algebra] Keys already present on window.PrepPortalKeys');
      resolve();
      return;
    }

    // FIX: The original handler resolved without ever writing to state.GEMINI_KEY,
    // so generateWithGemini() always had a null key even after the wait completed.
    // Now we read from the event detail (or fall back to window.PrepPortalKeys)
    // and assign both keys to state before resolving.
    window.addEventListener('prepportal:keysReady', (e) => {
      state.GEMINI_KEY = e.detail?.gemini || window.PrepPortalKeys?.gemini || null;
      state.YT_KEY     = e.detail?.youtube || window.PrepPortalKeys?.youtube || null;
      console.log('[Algebra] Keys received via prepportal:keysReady:', {
        hasGemini: !!state.GEMINI_KEY,
        hasYT: !!state.YT_KEY
      });
      resolve();
    }, { once: true });
  });
  
  return keysReadyPromise;
}

// ============================================
// USER STATS LOADING
// ============================================
async function loadUserStats() {
  if (!state.user) return;
  try {
    const solutionsRef = collection(db, 'solutions');
    const q = query(solutionsRef, where('userId', '==', state.user.uid), where('solved', '==', true));
    const snapshot = await getDocs(q);
    state.solvedCount = snapshot.size;
    sessionCount = state.solvedCount;
    updateStatsDisplay();
    console.log(`Loaded ${state.solvedCount} solved questions from Firebase`);
  } catch (error) {
    console.warn('Failed to load stats from Firebase:', error.message);
  }
}

// ============================================
// AUTH INITIALIZATION
// ============================================
async function initAuth() {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, async (user) => {
      state.user = user;
      if (user) {
        console.log('User logged in:', user.email);
        await loadUserStats();
      }
      // Wait for keys from the keys module
      await loadKeysFromModule();
      resolve();
    });
  });
}

// ============================================
// TOPIC ACCORDION INIT
// ============================================
function initTopicAccordion() {
  const container = document.getElementById('topic-container');
  if (!container) return;
  
  const topicGroups = {
    'Linear Equations': ['one-step', 'two-step', 'both-sides', 'fractions', 'decimals', 'mixed-number'],
    'Quadratics': ['quadratic', 'diff-squares', 'completing-square'],
    'Inequalities': ['inequalities', 'compound-ineq', 'abs-value-ineq'],
    'Word Problems': ['age-problems', 'speed-distance', 'mixture'],
    'Simultaneous Equations': ['substitution', 'elimination', 'graphical']
  };
  
  let html = '<div class="accordion-list">';
  for (const [groupName, topics] of Object.entries(topicGroups)) {
    const groupId = `group-${groupName.replace(/\s/g, '')}`;
    html += `
      <div class="accordion-group" id="${groupId}">
        <button class="accordion-header" onclick="window.toggleAccordion('${groupId}')">
          <span>${groupName}</span>
          <svg class="accordion-arrow" viewBox="0 0 18 18"><polyline points="3 6 9 13 15 6" /></svg>
        </button>
        <div class="accordion-body">
          <div class="topic-chips">
            ${topics.map(topic => `<button class="topic-chip" data-topic="${topic}" onclick="window.setTopic(this)">${topicLabels[topic]}</button>`).join('')}
          </div>
        </div>
      </div>`;
  }
  html += '</div>';
  container.innerHTML = html;
  
  window.toggleAccordion = function(groupId) {
    const group = document.getElementById(groupId);
    if (!group) return;
    const header = group.querySelector('.accordion-header');
    const body = group.querySelector('.accordion-body');
    const isOpen = header.classList.contains('open');
    document.querySelectorAll('.accordion-header').forEach(h => h.classList.remove('open'));
    document.querySelectorAll('.accordion-body').forEach(b => b.classList.remove('open'));
    if (!isOpen) {
      header.classList.add('open');
      body.classList.add('open');
    }
  };
  
  window.setTopic = function(btn) {
    document.querySelectorAll('.topic-chip').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.currentTopic = btn.dataset.topic;
    updateStatsDisplay();
    const group = btn.closest('.accordion-group');
    if (group) {
      const header = group.querySelector('.accordion-header');
      const body = group.querySelector('.accordion-body');
      document.querySelectorAll('.accordion-header').forEach(h => h.classList.remove('open'));
      document.querySelectorAll('.accordion-body').forEach(b => b.classList.remove('open'));
      header.classList.add('open');
      body.classList.add('open');
    }
  };
}

function initTicker() {
  const tickerTrack = document.getElementById('ticker-track');
  if (!tickerTrack) return;
  const messages = ['Prep Portal 2026', 'Algebra Practice', ' Geometry & Trigonometry', ' Statistics', ' Calculus & Matrices', ' WAEC & JAMB Prep'];
  tickerTrack.innerHTML = messages.map(m => `<span>${m}</span>`).join('');
}

function initDropdown() {
  const trigger = document.getElementById('cdd-trigger');
  const panel = document.getElementById('cdd-panel');
  const valueSpan = document.getElementById('cdd-value');
  const options = document.querySelectorAll('.cdd-option');
  
  if (!trigger || !panel) return;
  
  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    const expanded = trigger.getAttribute('aria-expanded') === 'true';
    trigger.setAttribute('aria-expanded', !expanded);
    panel.classList.toggle('open');
  });
  
  options.forEach(opt => {
    opt.addEventListener('click', () => {
      const value = opt.dataset.value;
      const text = opt.textContent;
      valueSpan.textContent = text;
      state.currentClass = value;
      state.currentSubject = getSubjectForClass(value);
      state.st.cls = value;
      
      options.forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      panel.classList.remove('open');
      trigger.setAttribute('aria-expanded', 'false');
      
      updateTopicChips();
      updateStatsDisplay();
      
      const placeholder = document.getElementById('page-placeholder');
      if (placeholder) {
        placeholder.innerHTML = `Select your class level and topic, then click <strong>Generate</strong> to open the equation canvas.`;
        placeholder.style.display = '';
      }
      showStatus(`Selected: ${text} - ${state.currentSubject}`, 'info');
    });
  });
  
  document.addEventListener('click', (e) => {
    if (!trigger.contains(e.target) && !panel.contains(e.target)) {
      panel.classList.remove('open');
      trigger.setAttribute('aria-expanded', 'false');
    }
  });
}

// ============================================
// EXPORTS FOR GLOBAL ACCESS
// ============================================
window.generateQuestion = generateQuestion;
window.checkSolution = () => { return isSolved; };

// ============================================
// DOM CONTENT LOADED
// ============================================
document.addEventListener('DOMContentLoaded', async () => {
  initTopicAccordion();
  initDropdown();
  initTicker();
  
  // Disable generate button initially
  const genBtn = document.getElementById('gen-btn');
  if (genBtn) genBtn.disabled = true;
  
  // Method chips
  document.querySelectorAll('.method-chip').forEach(btn => {
    btn.addEventListener('click', () => setMethod(btn));
  });
  
  // Mobile nav toggle
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      navToggle.classList.toggle('active');
    });
  }
  
  // Wait for auth and keys
  await initAuth();
  if (genBtn) genBtn.disabled = false;
  
  // Hide loader
  const loader = document.getElementById('loader');
  if (loader) {
    setTimeout(() => {
      loader.classList.add('fade-out');
      setTimeout(() => loader.style.display = 'none', 500);
    }, 1000);
  }
});
