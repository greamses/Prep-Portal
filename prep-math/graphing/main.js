(function() {
  'use strict';
  
  // ─── DOM ───────────────────────────────────────────────────────────────────
  const loadScreen = document.getElementById('gp-load-screen');
  const modalOverlay = document.getElementById('gp-graph-modal');
  const openModalBtn = document.getElementById('gp-open-modal-btn');
  const closeModalBtn = document.getElementById('gp-close-modal-btn');
  const newProbBtn = document.getElementById('gp-new-prob-btn');
  const toggleKbBtn = document.getElementById('gp-toggle-keyboard-btn');
  const bottomSheet = document.getElementById('gp-bottom-sheet');
  const mathPlaceholder = document.getElementById('gp-math-placeholder');
  const mathBefore = document.getElementById('gp-math-before');
  const mathAfter = document.getElementById('gp-math-after');
  const cursorEl = document.getElementById('gp-cursor');
  const feedbackBox = document.getElementById('gp-feedback-box');
  const dropdownHeader = document.getElementById('gp-dropdown-header');
  const dropdownList = document.getElementById('gp-dropdown-list');
  const dropdownContainer = document.getElementById('gp-topic-dropdown');
  const selectedText = document.getElementById('gp-dropdown-selected-text');
  const virtualKeyboard = document.getElementById('gp-virtual-keyboard');
  const keyboardTabs = document.getElementById('gp-keyboard-tabs');
  const statSolved = document.getElementById('gp-stat-solved');
  const statTopic = document.getElementById('gp-stat-topic');
  
  // ─── State ────────────────────────────────────────────────────────────────
  let currentInput = '';
  let cursorPosition = 0;
  let activeTab = '123';
  let keyboardVisible = true;
  let ggbApplet = null;
  let abcCaps = false;
  let currentTargetEquation = 'f(x) = 2x + 1';
  let solvedCount = 0;
  
  // ─── LOADING SEQUENCE ─────────────────────────────────────────────────────
  async function boot() {
    await document.fonts.ready;
    renderKeyboard('123');
    await new Promise(r => setTimeout(r, 700));
    if (loadScreen) {
      loadScreen.classList.add('fade-out');
      setTimeout(() => loadScreen.remove(), 500);
    }
  }
  boot();
  
  // ─── KEYBOARD LAYOUTS ───────────────────────────────────────────────────
  const K = {
    DEL: { val: 'DEL', cls: 'gp-key-del', display: '<svg viewBox="0 0 24 24"><path d="M21 4H8l-7 8 7 8h13a2 2 0 002-2V6a2 2 0 00-2-2zm-2.58 11L15 11.59 11.59 15 10.17 13.59 13.59 10.17 10.17 6.76 11.59 5.34 15 8.76 18.41 5.34 19.83 6.76 16.41 10.17 19.83 13.59z"/></svg>' },
    ENTER: { val: '↵', cls: 'gp-key-enter', display: '↵' },
    LEFT: { val: '←', cls: '', display: '<svg viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>' },
    RIGHT: { val: '→', cls: '', display: '<svg viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>' },
    SHIFT: { val: '⇧', cls: 'gp-key-shift', display: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 4L4 12h5v8h6v-8h5z"/></svg>' },
    xSQ: { val: '^2', cls: 'gp-key-func', display: 'x<sup>2</sup>' },
    xY: { val: '^', cls: 'gp-key-func', display: 'x<sup>y</sup>' },
    SQRT: { val: 'sqrt(', cls: 'gp-key-func', display: '√' },
    ABS: { val: 'abs(', cls: 'gp-key-func', display: '|x|' },
    SINi: { val: 'arcsin(', cls: 'gp-key-func', display: 'sin<sup>-1</sup>' },
    COSi: { val: 'arccos(', cls: 'gp-key-func', display: 'cos<sup>-1</sup>' },
    TANi: { val: 'arctan(', cls: 'gp-key-func', display: 'tan<sup>-1</sup>' },
    LN: { val: 'ln(', cls: 'gp-key-func', display: 'ln' },
    LOG10: { val: 'log10(', cls: 'gp-key-func', display: 'log<sub>10</sub>' },
    LOGx: { val: 'logx(', cls: 'gp-key-func', display: 'log<sub>x</sub>' },
    DDXK: { val: 'diff(', cls: 'gp-key-func', display: '<span style="font-size:10px;line-height:1">d/dx</span>' },
    INT: { val: 'int(', cls: 'gp-key-func', display: '∫' },
    ETOX: { val: 'e^', cls: 'gp-key-func', display: 'e<sup>x</sup>' },
    TENTOX: { val: '10^', cls: 'gp-key-func', display: '10<sup>x</sup>' },
    NROOT: { val: 'nroot(', cls: 'gp-key-func', display: '<sup>n</sup>√' },
    INF: { val: 'infinity', cls: 'gp-key-func', display: '∞' },
    ALPHA: { val: '⇧_abc', cls: 'gp-key-shift', display: 'αβγ' },
    ABC: { val: '⇧_grk', cls: 'gp-key-shift', display: 'ABC' },
    ANS: { val: 'ans', cls: 'gp-key-func', display: 'ans' },
  };
  
  function norm(k) {
    if (typeof k === 'string') return { val: k, display: k, cls: '' };
    return k;
  }
  
  const layouts = {
    '123': [
      [K.xSQ, K.xY, K.SQRT, K.ABS, '4', '5', '6', '+', '−'],
      ['x', 'y', 'π', 'e', '7', '8', '9', '×', '÷'],
      ['<', '>', '≤', '≥', '1', '2', '3', '=', K.DEL],
      [K.ANS, ',', '(', ')', '0', '.', K.LEFT, K.RIGHT, K.ENTER]
    ],
    'f(x)': [
      ['sin', 'cos', 'tan', '%', '!', '$', '°'],
      [K.SINi, K.COSi, K.TANi, '{', '}', '≤', '≥'],
      [K.LN, K.LOG10, K.LOGx, K.DDXK, K.INT, 'i', K.DEL],
      [K.ETOX, K.TENTOX, K.NROOT, K.INF, K.LEFT, K.RIGHT, K.ENTER]
    ],
    'abc': [
      ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
      ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
      [K.SHIFT, 'z', 'x', 'c', 'v', 'b', 'n', 'm', K.DEL],
      [K.ALPHA, ',', '(', ')', K.LEFT, K.RIGHT, K.ENTER]
    ],
    '#&¬': [
      ['φ', 'ς', 'ε', 'ρ', 'τ', 'υ', 'θ', 'ι', 'ο', 'π'],
      ['α', 'σ', 'δ', 'ϕ', 'γ', 'η', 'ξ', 'κ', 'λ'],
      [K.SHIFT, 'ζ', 'χ', 'ψ', 'ω', 'β', 'ν', 'μ', K.DEL],
      [K.ABC, ',', '(', ')', K.LEFT, K.RIGHT, K.ENTER]
    ],
    '...': [
      ['d/dx', '∫', '∞', 'Σ', 'Π', 'lim'],
      ['mod', 'gcd', 'lcm', 'nCr', 'nPr', K.DEL],
      [K.LEFT, K.RIGHT, K.ENTER]
    ]
  };
  
  const TAB_ORDER = ['123', 'f(x)', 'abc', '#&¬', '...'];
  
  // ─── RENDER KEYBOARD TABS ─────────────────────────────────────────────────
  function renderTabs() {
    if (!keyboardTabs) return;
    keyboardTabs.innerHTML = TAB_ORDER.map(t =>
      `<button class="gp-tab${t === activeTab ? ' active' : ''}" data-tab="${t}">${t}</button>`
    ).join('');
    keyboardTabs.querySelectorAll('.gp-tab').forEach(btn =>
      btn.addEventListener('click', () => switchTab(btn.dataset.tab))
    );
  }
  
  function switchTab(tabId) {
    activeTab = tabId;
    renderTabs();
    renderKeyboard(tabId);
  }
  
  // ─── RENDER KEYBOARD ──────────────────────────────────────────────────────
  function renderKeyboard(layoutKey) {
    if (!virtualKeyboard) return;
    const rows = layouts[layoutKey] || layouts['123'];
    let html = '';
    rows.forEach(row => {
      html += '<div class="gp-key-row">';
      row.forEach(rawKey => {
        const { val, display, cls } = norm(rawKey);
        let extraCls = cls;
        if (!extraCls && ['×', '÷', '+', '−', '=', '<', '>', '≤', '≥', '%', '!', '$', '°', 'i',
            '{', '}', 'sin', 'cos', 'tan', 'π', 'e', '∞', 'Σ', 'Π',
            'lim', 'mod', 'gcd', 'lcm', 'nCr', 'nPr'
          ].includes(val)) {
          extraCls = 'gp-key-func';
        }
        html += `<button class="gp-key${extraCls ? ' '+extraCls : ''}" data-val="${escAttr(val)}">${display}</button>`;
      });
      html += '</div>';
    });
    virtualKeyboard.innerHTML = html;
  }
  
  function escAttr(s) {
    return s.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  
  // ─── VALUE MAP ───────────────────────────────────────────────────────────
  const valueMap = {
    '×': '*',
    '÷': '/',
    '−': '-',
    '^2': '^2',
    '^': '^',
    'sqrt(': 'sqrt(',
    'abs(': 'abs(',
    'arcsin(': 'arcsin(',
    'arccos(': 'arccos(',
    'arctan(': 'arctan(',
    'ln(': 'ln(',
    'log10(': 'log10(',
    'logx(': 'logx(',
    'diff(': 'diff(',
    'int(': 'int(',
    'e^': 'e^',
    '10^': '10^',
    'nroot(': 'nroot(',
    'infinity': 'infinity',
    'd/dx': 'diff(',
    '∫': 'int(',
    '∞': 'infinity',
    'Σ': 'sum(',
    'Π': 'prod(',
    'lim': 'lim(',
    'mod': ' mod ',
    'gcd': 'gcd(',
    'lcm': 'lcm(',
    'nCr': 'nCr(',
    'nPr': 'nPr(',
    'sin': 'sin(',
    'cos': 'cos(',
    'tan': 'tan(',
    'π': 'pi',
    'e': 'e',
    'i': 'i',
    '°': '°',
    'ans': 'ans',
  };
  
  // ─── KEYBOARD INPUT ───────────────────────────────────────────────────────
  if (virtualKeyboard) {
    virtualKeyboard.addEventListener('click', e => {
      const btn = e.target.closest('.gp-key');
      if (!btn) return;
      const val = btn.dataset.val;
      handleKey(val);
    });
  }
  
  function handleKey(val) {
    if (val === 'DEL') {
      if (cursorPosition > 0) {
        currentInput = currentInput.slice(0, cursorPosition - 1) + currentInput.slice(cursorPosition);
        cursorPosition--;
      }
    } else if (val === '↵') {
      submitEquation();
      return;
    } else if (val === '←') {
      if (cursorPosition > 0) cursorPosition--;
    } else if (val === '→') {
      if (cursorPosition < currentInput.length) cursorPosition++;
    } else if (val === '⇧') {
      if (activeTab === 'abc') {
        abcCaps = !abcCaps;
        renderKeyboard('abc');
      }
    } else if (val === '⇧_abc') {
      switchTab('#&¬');
      return;
    } else if (val === '⇧_grk') {
      switchTab('abc');
      return;
    } else {
      let insert = valueMap[val] !== undefined ? valueMap[val] : val;
      if (activeTab === 'abc' && abcCaps && insert.length === 1) {
        insert = insert.toUpperCase();
      }
      currentInput = currentInput.slice(0, cursorPosition) + insert + currentInput.slice(cursorPosition);
      cursorPosition += insert.length;
    }
    renderDisplay();
  }
  
  // ─── SAFE LATEX CONVERSION ─────────────────────────────────────────────────
  function toLatex(str) {
    let safe = str;
    safe = safe.replace(/\^(?![0-9{(-])/g, '^{ }');
    safe = safe.replace(/\^\($/g, '^{( }');
    safe = safe.replace(/\^{$/g, '^{ }');
    safe = safe.replace(/_(?![0-9{(-])/g, '_{ }');
    safe = safe.replace(/_\($/g, '_{( }');
    safe = safe.replace(/_{$/g, '_{ }');
    safe = safe.replace(/\\frac\{([^}]*)\}$/g, '\\frac{$1}{ }');
    safe = safe.replace(/\\frac$/g, '\\frac{ }{ }');
    safe = safe.replace(/\\sqrt$/g, '\\sqrt{ }');
    safe = safe.replace(/\\sqrt\{$/g, '\\sqrt{ }');
    
    return safe
      .replace(/\*/g, '\\times ')
      .replace(/\//g, '\\div ')
      .replace(/<=/g, '\\le ')
      .replace(/>=/g, '\\ge ')
      .replace(/sqrt\(/g, '\\sqrt{')
      .replace(/pi/g, '\\pi')
      .replace(/infinity/g, '\\infty')
      .replace(/sin\(/g, '\\sin(')
      .replace(/cos\(/g, '\\cos(')
      .replace(/tan\(/g, '\\tan(')
      .replace(/arcsin\(/g, '\\sin^{-1}(')
      .replace(/arccos\(/g, '\\cos^{-1}(')
      .replace(/arctan\(/g, '\\tan^{-1}(')
      .replace(/log10\(/g, '\\log_{10}(')
      .replace(/logx\(/g, '\\log_x(')
      .replace(/ln\(/g, '\\ln(')
      .replace(/int\(/g, '\\int ')
      .replace(/diff\(/g, '\\frac{d}{dx}')
      .replace(/abs\(/g, '\\left|')
      .replace(/\^(\d+)/g, '^{$1}')
      .replace(/\^\(([^)]+)\)/g, '^{$1}')
      .replace(/\^([a-zA-Z])/g, '^{$1}');
  }
  
  // ─── MATHJAX DISPLAY ─────────────────────────────────────────────────────
  // ─── MATHJAX DISPLAY ─────────────────────────────────────────────────────
let renderTimer = null;

function renderDisplay() {
  if (!mathPlaceholder || !mathBefore || !mathAfter || !cursorEl) return;
  
  const hasInput = currentInput.length > 0;
  mathPlaceholder.style.display = hasInput ? 'none' : 'inline';
  
  if (!hasInput) {
    mathBefore.innerHTML = '';
    mathAfter.innerHTML = '';
    mathBefore.style.visibility = 'visible';
    mathAfter.style.visibility = 'visible';
    cursorEl.style.display = 'inline-block';
    cursorEl.style.opacity = '1';
    cursorEl.style.visibility = 'visible';
    return;
  }
  
  const lastChar = currentInput.slice(-1);
  const incompleteCommands = ['^', '_', '\\', '{', '(', '['];
  const isIncomplete = incompleteCommands.includes(lastChar);
  
  const before = currentInput.slice(0, cursorPosition);
  const after = currentInput.slice(cursorPosition);
  
  mathBefore.style.visibility = 'hidden';
  mathAfter.style.visibility = 'hidden';
  // Keep cursor visible but dimmed
  cursorEl.style.display = 'inline-block';
  cursorEl.style.opacity = '0.4';
  cursorEl.style.visibility = 'visible';
  
  mathBefore.innerHTML = before ? '\\(' + toLatex(before) + '\\)' : '';
  mathAfter.innerHTML = after ? '\\(' + toLatex(after) + '\\)' : '';
  
  clearTimeout(renderTimer);
  
  const delayTime = isIncomplete ? 150 : 50;
  
  renderTimer = setTimeout(() => {
    if (window.MathJax) {
      MathJax.typesetPromise([mathBefore, mathAfter])
        .then(() => {
          mathBefore.style.visibility = 'visible';
          mathAfter.style.visibility = 'visible';
          cursorEl.style.display = 'inline-block';
          cursorEl.style.opacity = '1';
          cursorEl.style.visibility = 'visible';
        })
        .catch((err) => {
          console.warn('MathJax error:', err);
          mathBefore.style.visibility = 'visible';
          mathAfter.style.visibility = 'visible';
          cursorEl.style.display = 'inline-block';
          cursorEl.style.opacity = '1';
          cursorEl.style.visibility = 'visible';
          mathBefore.textContent = before;
          mathAfter.textContent = after;
        });
    } else {
      mathBefore.style.visibility = 'visible';
      mathAfter.style.visibility = 'visible';
      cursorEl.style.display = 'inline-block';
      cursorEl.style.opacity = '1';
      cursorEl.style.visibility = 'visible';
    }
  }, delayTime);
}
  
  // ─── PHYSICAL KEYBOARD ───────────────────────────────────────────────────
  document.addEventListener('keydown', e => {
    if (!modalOverlay || !modalOverlay.classList.contains('active')) return;
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    
    if (e.key === 'ArrowLeft') { e.preventDefault(); if (cursorPosition > 0) cursorPosition--; renderDisplay(); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); if (cursorPosition < currentInput.length) cursorPosition++; renderDisplay(); }
    else if (e.key === 'Backspace') { e.preventDefault(); if (cursorPosition > 0) { currentInput = currentInput.slice(0, cursorPosition - 1) + currentInput.slice(cursorPosition); cursorPosition--; renderDisplay(); } }
    else if (e.key === 'Delete') { e.preventDefault(); if (cursorPosition < currentInput.length) { currentInput = currentInput.slice(0, cursorPosition) + currentInput.slice(cursorPosition + 1); renderDisplay(); } }
    else if (e.key === 'Enter') { e.preventDefault(); submitEquation(); }
    else if (e.key === 'Escape') { closeModal(); }
    else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      currentInput = currentInput.slice(0, cursorPosition) + e.key + currentInput.slice(cursorPosition);
      cursorPosition++;
      renderDisplay();
    }
  });
  
  // ─── EQUATION VALIDATION ──────────────────────────────────────────────────
  function validateEquation(userInput) {
    if (!ggbApplet || !currentTargetEquation) return false;
    
    try {
      const targetMatch = currentTargetEquation.match(/f\(x\)\s*=\s*(.+)/);
      if (!targetMatch) return false;
      
      const targetExpr = targetMatch[1].replace(/\s/g, '');
      let userExpr = userInput.replace(/\s/g, '');
      
      userExpr = userExpr.replace(/\*/g, '').replace(/×/g, '').replace(/\.0/g, '');
      const normalizedTarget = targetExpr.replace(/\*/g, '').replace(/×/g, '').replace(/\.0/g, '');
      
      const targetLinear = normalizedTarget.match(/([+-]?\d*)x([+-]\d+)?/);
      const userLinear = userExpr.match(/([+-]?\d*)x([+-]\d+)?/);
      
      if (targetLinear && userLinear) {
        let targetM = targetLinear[1] || '1';
        if (targetM === '' || targetM === '+') targetM = '1';
        if (targetM === '-') targetM = '-1';
        
        let userM = userLinear[1] || '1';
        if (userM === '' || userM === '+') userM = '1';
        if (userM === '-') userM = '-1';
        
        let targetC = targetLinear[2] || '+0';
        let userC = userLinear[2] || '+0';
        
        const mMatch = parseInt(targetM) === parseInt(userM);
        const cMatch = parseInt(targetC) === parseInt(userC);
        
        return mMatch && cMatch;
      }
      
      return normalizedTarget === userExpr;
    } catch (err) {
      console.warn('Validation error:', err);
      return false;
    }
  }
  
  // ─── COLOR GRAPH ──────────────────────────────────────────────────────────
  function colorGraph(isCorrect) {
    if (!ggbApplet) return;
    try {
      if (isCorrect) {
        ggbApplet.setColor('g', 0, 165, 80);
        ggbApplet.setLineThickness('g', 4);
      } else {
        ggbApplet.setColor('g', 239, 68, 68);
        ggbApplet.setLineThickness('g', 3);
      }
    } catch (err) {
      console.warn('Color error:', err);
    }
  }
  
  // ─── SUBMIT EQUATION ─────────────────────────────────────────────────────
  function submitEquation() {
    if (!currentInput.trim()) return;
    if (!ggbApplet) return;
    
    try {
      let ggInput = currentInput
        .replace(/arcsin\(/g, 'asin(')
        .replace(/arccos\(/g, 'acos(')
        .replace(/arctan\(/g, 'atan(')
        .replace(/int\(/g, 'Integral(')
        .replace(/diff\(/g, 'Derivative(')
        .replace(/nroot\(/g, 'nroot(')
        .replace(/infinity/g, '∞')
        .replace(/log10\(/g, 'log10(')
        .replace(/logx\(/g, 'log(');
      
      ggbApplet.evalCommand(`g(x) = ${ggInput.replace(/.*=/, '')}`);
      
      const isCorrect = validateEquation(currentInput);
      colorGraph(isCorrect);
      
      if (isCorrect) {
        solvedCount++;
        if (statSolved) statSolved.textContent = solvedCount;
        if (feedbackBox) {
          feedbackBox.textContent = '✓ Correct! Well done!';
          feedbackBox.className = 'gp-feedback-box fb-success';
        }
        if (typeof confetti !== 'undefined') {
          confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        }
      } else {
        if (feedbackBox) {
          feedbackBox.textContent = '✗ Not quite right. Try again!';
          feedbackBox.className = 'gp-feedback-box fb-error';
        }
      }
    } catch (err) {
      if (feedbackBox) {
        feedbackBox.textContent = 'Invalid equation — check your syntax';
        feedbackBox.className = 'gp-feedback-box fb-error';
      }
    }
  }
  
  // ─── MODAL ────────────────────────────────────────────────────────────────
  // ─── MODAL ────────────────────────────────────────────────────────────────
function openModal() {
  if (!modalOverlay) return;
  modalOverlay.classList.add('active');
  currentInput = '';
  cursorPosition = 0;
  
  renderTabs();
  renderKeyboard(activeTab);
  
  // Force cursor to be visible
  if (cursorEl) {
    cursorEl.style.display = 'inline-block';
    cursorEl.style.opacity = '1';
    cursorEl.style.visibility = 'visible';
  }
  
  renderDisplay();
  
  currentTargetEquation = 'f(x) = 2x + 1';
  
  if (!ggbApplet) {
    initGeoGebra();
  } else {
    setTimeout(() => {
      if (ggbApplet) {
        ggbApplet.setSize(window.innerWidth, window.innerHeight - 200);
        ggbApplet.reset();
        ggbApplet.evalCommand(currentTargetEquation);
        ggbApplet.setColor('f', 59, 130, 246);
        ggbApplet.setLineThickness('f', 3);
        ggbApplet.deleteObject('g');
        ggbApplet.setCoordSystem(-6, 6, -6, 6);
      }
    }, 150);
  }
  
  if (feedbackBox) {
    feedbackBox.textContent = 'Analyze the graph and type the equation!';
    feedbackBox.className = 'gp-feedback-box';
  }
}
  
  function closeModal() {
    if (modalOverlay) modalOverlay.classList.remove('active');
  }
  
  if (openModalBtn) openModalBtn.addEventListener('click', openModal);
  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
  
  if (newProbBtn) {
    newProbBtn.addEventListener('click', () => {
      if (!ggbApplet) return;
      
      let m;
      do {
        m = Math.floor(Math.random() * 7) - 3;
      } while (m === 0);
      
      const c = Math.floor(Math.random() * 11) - 5;
      
      let mStr = '';
      if (m === 1) mStr = '';
      else if (m === -1) mStr = '-';
      else mStr = m.toString();
      
      const cStr = c >= 0 ? `+${c}` : `${c}`;
      
      let equationStr;
      if (c === 0) {
        equationStr = `${mStr}x`;
      } else {
        equationStr = `${mStr}x ${cStr}`;
      }
      
      currentTargetEquation = `f(x) = ${equationStr}`.replace(/\s+/g, ' ').trim();
      
      ggbApplet.reset();
      ggbApplet.deleteObject('g');
      ggbApplet.evalCommand(currentTargetEquation);
      ggbApplet.setColor('f', 59, 130, 246);
      ggbApplet.setLineThickness('f', 3);
      ggbApplet.setCoordSystem(-6, 6, -6, 6);
      
      if (feedbackBox) {
        feedbackBox.textContent = 'New graph — type your equation!';
        feedbackBox.className = 'gp-feedback-box';
      }
      currentInput = '';
      cursorPosition = 0;
      renderDisplay();
    });
  }
  
  // ─── GEOGEBRA (WHITE/LIGHT THEME) ─────────────────────────────────────────
  function initGeoGebra() {
    const params = {
      appName: 'graphing',
      width: window.innerWidth,
      height: window.innerHeight - 200,
      showToolBar: false,
      showAlgebraInput: false,
      showMenuBar: false,
      enableShiftDragZoom: true,
      // Light/White theme
      borderColor: '#1a1a1a',
      axisColor: '#1a1a1a',
      gridColor: '#e0e0e0',
      bgColor: '#ffffff',
      language: 'en',
      appletOnLoad(api) {
        ggbApplet = api;
        api.evalCommand(currentTargetEquation);
        api.setAxesVisible(true, true);
        api.setGridVisible(true);
        api.setColor('f', 59, 130, 246);
        api.setLineThickness('f', 3);
        api.setCoordSystem(-6, 6, -6, 6);
      }
    };
    new GGBApplet(params, 'ggb-element').inject();
  }
  
  window.addEventListener('resize', () => {
    if (ggbApplet) ggbApplet.setSize(window.innerWidth, window.innerHeight - 200);
  });
  
  // ─── TOGGLE KEYBOARD ─────────────────────────────────────────────────────
  if (toggleKbBtn) {
    toggleKbBtn.addEventListener('click', () => {
      keyboardVisible = !keyboardVisible;
      if (bottomSheet) bottomSheet.classList.toggle('keyboard-hidden', !keyboardVisible);
    });
  }
  
  // ─── TOPIC DROPDOWN ──────────────────────────────────────────────────────
  const topics = [
    'Linear Equations (y = mx + c)',
    'Quadratics (ax² + bx + c)',
    'Trigonometry (sin / cos / tan)',
    'Inequalities',
    'Polynomials',
    'Exponential Functions',
    'Logarithmic Functions',
  ];
  
  function populateDropdown() {
    if (!dropdownList) return;
    dropdownList.innerHTML = '';
    topics.forEach(t => {
      const div = document.createElement('div');
      div.className = 'gp-dropdown-item';
      div.textContent = t;
      div.addEventListener('click', () => {
        if (selectedText) selectedText.textContent = t;
        if (statTopic) statTopic.textContent = t.split(' ')[0];
        dropdownContainer.classList.remove('open');
      });
      dropdownList.appendChild(div);
    });
  }
  
  if (dropdownHeader) {
    dropdownHeader.addEventListener('click', e => {
      e.stopPropagation();
      if (dropdownContainer) dropdownContainer.classList.toggle('open');
    });
  }
  
  document.addEventListener('click', e => {
    if (dropdownContainer && !dropdownContainer.contains(e.target)) {
      dropdownContainer.classList.remove('open');
    }
  });
  
  populateDropdown();
  
  // ─── INIT ─────────────────────────────────────────────────────────────────
  renderTabs();
  renderKeyboard('123');
  
})();