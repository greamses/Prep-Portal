// ─────────────────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────────────────
const MODES = {
  fractions: {
    label: 'Fraction',
    placeholder: 'e.g. 3/4',
    hint: 'Type as numerator/denominator — e.g. 3/4',
    modalQ: 'What fraction does the shape show?',
  },
  percents: {
    label: 'Percent',
    placeholder: 'e.g. 75%',
    hint: 'Type the percentage — e.g. 75 or 75%',
    modalQ: 'What percentage does the shape show?',
  },
  degrees: {
    label: 'Degrees',
    placeholder: 'e.g. 270°',
    hint: 'Type the angle in degrees — e.g. 270 or 270°',
    modalQ: 'How many degrees does the shaded sector represent?',
  },
  decimals: {
    label: 'Decimal',
    placeholder: 'e.g. 0.75',
    hint: 'Type as a decimal — e.g. 0.75',
    modalQ: 'What decimal does the shape show?',
  },
  mixed: {
    label: 'Answer',
    placeholder: 'Type your answer',
    hint: 'Answer in the format shown',
    modalQ: 'What value does the shape show?',
  },
};

// ─────────────────────────────────────────────────────────
// STATE
// ─────────────────────────────────────────────────────────
let streak = 0;
let totalSolved = 0;
let currentQ = null;
let isLoading = false;

const settings = { 
  mode: 'fractions', 
  parts: 2, 
  type: 'fraction-circle',
  hideLines: false,
  hideUnshaded: false
};

// ─────────────────────────────────────────────────────────
// TICKER
// ─────────────────────────────────────────────────────────
(function buildTicker() {
  const words = [
    'Fraction Explorer', 'PrepBot · Maths', 'Visual Fractions',
    'Prep Portal 2026', 'Circles · Bars', 'Endless Practice',
  ];
  const track = document.getElementById('ticker-track');
  if (track) {
    [...words, ...words].forEach(t => {
      const s = document.createElement('span');
      s.className = 'ticker-item';
      s.textContent = t;
      track.appendChild(s);
    });
  }
})();

// ─────────────────────────────────────────────────────────
// DROPDOWN LOGIC
// ─────────────────────────────────────────────────────────
function toggleDropdown(id) {
  const dd = document.getElementById(id);
  const isOpen = dd.classList.contains('open');
  document.querySelectorAll('.pp-dropdown.open').forEach(el => el.classList.remove('open'));
  if (!isOpen) dd.classList.add('open');
}

document.addEventListener('click', e => {
  if (!e.target.closest('.pp-dropdown'))
    document.querySelectorAll('.pp-dropdown.open').forEach(el => el.classList.remove('open'));
});

document.querySelectorAll('.pp-dropdown-list').forEach(list => {
  list.addEventListener('click', e => {
    const item = e.target.closest('.pp-dropdown-item');
    if (!item) return;
    const dd = item.closest('.pp-dropdown');
    const value = item.dataset.value;
    
    list.querySelectorAll('.pp-dropdown-item').forEach(i => i.classList.remove('selected'));
    item.classList.add('selected');
    dd.querySelector('.dd-selected').textContent = item.textContent.trim();
    dd.classList.remove('open');
    
    if (dd.id === 'dd-mode') settings.mode = value;
    if (dd.id === 'dd-parts') {
      settings.parts = value === 'mixed' ? 'mixed' : parseInt(value, 10);
    }
    if (dd.id === 'dd-type') settings.type = value;
  });
});

// ─────────────────────────────────────────────────────────
// CHECKBOX LISTENERS
// ─────────────────────────────────────────────────────────
document.getElementById('hide-lines')?.addEventListener('change', (e) => {
  settings.hideLines = e.target.checked;
});

document.getElementById('hide-unshaded')?.addEventListener('change', (e) => {
  settings.hideUnshaded = e.target.checked;
});

// ─────────────────────────────────────────────────────────
// KEYPAD FUNCTIONS
// ─────────────────────────────────────────────────────────
function toggleKeypad() {
  const container = document.getElementById('numpad-container');
  const btn = document.getElementById('keypad-toggle');
  container.classList.toggle('hidden');
  btn.classList.toggle('active');
}

function numpadInput(char) {
  const input = document.getElementById('answer-input');
  input.focus();
  
  const selection = window.getSelection();
  if (selection.rangeCount === 0) {
    input.textContent += char;
    return;
  }
  
  const range = selection.getRangeAt(0);
  range.deleteContents();
  
  const textNode = document.createTextNode(char);
  range.insertNode(textNode);
  
  range.setStartAfter(textNode);
  range.setEndAfter(textNode);
  selection.removeAllRanges();
  selection.addRange(range);
}

function numpadBackspace() {
  const input = document.getElementById('answer-input');
  input.focus();
  
  const selection = window.getSelection();
  if (selection.rangeCount === 0) return;
  
  const range = selection.getRangeAt(0);
  
  if (!range.collapsed) {
    range.deleteContents();
  } else {
    const container = range.startContainer;
    const offset = range.startOffset;
    
    if (container.nodeType === Node.TEXT_NODE) {
      if (offset > 0) {
        const text = container.textContent;
        container.textContent = text.slice(0, offset - 1) + text.slice(offset);
        range.setStart(container, offset - 1);
        range.setEnd(container, offset - 1);
      } else if (container.previousSibling) {
        const prev = container.previousSibling;
        prev.remove();
      }
    } else if (container.nodeType === Node.ELEMENT_NODE) {
      const children = Array.from(container.childNodes);
      const childAtIndex = children[offset - 1];
      if (childAtIndex) {
        childAtIndex.remove();
      }
    }
  }
  
  selection.removeAllRanges();
  selection.addRange(range);
}

// ─────────────────────────────────────────────────────────
// COLOR UTILITIES — Darker colors
// ─────────────────────────────────────────────────────────
const MUTED_COLORS = [
  '#1a3a5c', '#1b4a3d', '#5c3a1a', '#3d1e3d', '#1e4a4a',
  '#6b3a1a', '#2a1e1e', '#1a4a3a', '#4a2e1a', '#1a2e4a',
  '#3d2e1a', '#1a3a3a', '#2e1e3d', '#1e3d2e', '#4a2e0d',
  '#1a3a5c', '#3d2a1a', '#1a2e4a', '#4a2e1a', '#2a1e3d',
];

const PASTEL_COLORS = [
  '#6b8db5', '#6bb58d', '#b58d6b', '#8d6bb5', '#b56b8d',
  '#6bb5b5', '#b5b56b', '#8db56b', '#b56b6b', '#6b6bb5',
  '#7da36b', '#a36b7d', '#6b7da3', '#a3a36b', '#7d6ba3',
];

function generateRandomColorSet() {
  const isPastel = Math.random() > 0.5;
  const palette = isPastel ? PASTEL_COLORS : MUTED_COLORS;
  const randomColor = palette[Math.floor(Math.random() * palette.length)];
  
  return {
    shadedColor: randomColor,
    unshaded: isPastel ? '#e8e4dc' : '#e0d8cc',
    ink: '#1a1a1a',
  };
}

let currentColorSet = generateRandomColorSet();

// ─────────────────────────────────────────────────────────
// SVG CANVAS RENDERER — Updated with hide options
// ─────────────────────────────────────────────────────────
function createFractionSVG(type, active, denominator) {
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  
  const INK = currentColorSet.ink;
  const SHADED = currentColorSet.shadedColor;
  const UNSHADED = settings.hideUnshaded ? 'transparent' : currentColorSet.unshaded;
  
  if (type === 'fraction-circle') {
    svg.setAttribute("viewBox", "0 0 800 800");
    const cx = 400;
    const cy = 400;
    const r = 280;
    
    // Background circle
    const bgCircle = document.createElementNS(svgNS, "circle");
    bgCircle.setAttribute("cx", cx);
    bgCircle.setAttribute("cy", cy);
    bgCircle.setAttribute("r", r);
    bgCircle.setAttribute("fill", "none");
    bgCircle.setAttribute("stroke", INK);
    bgCircle.setAttribute("stroke-width", "4");
    svg.appendChild(bgCircle);
    
    const sectorAngle = 360 / denominator;
    
    for (let i = 0; i < denominator; i++) {
      const start = (i * sectorAngle - 90) * Math.PI / 180;
      const end = ((i + 1) * sectorAngle - 90) * Math.PI / 180;
      const isShaded = i < active;
      
      const x1 = cx + r * Math.cos(start);
      const y1 = cy + r * Math.sin(start);
      const x2 = cx + r * Math.cos(end);
      const y2 = cy + r * Math.sin(end);
      
      const largeArc = sectorAngle > 180 ? 1 : 0;
      
      const pathData = `
        M ${cx},${cy}
        L ${x1.toFixed(1)},${y1.toFixed(1)}
        A ${r},${r} 0 ${largeArc},1 ${x2.toFixed(1)},${y2.toFixed(1)}
        Z
      `;
      
      const path = document.createElementNS(svgNS, "path");
      path.setAttribute("d", pathData.trim());
      path.setAttribute("fill", isShaded ? SHADED : UNSHADED);
      
      // Only draw stroke if lines are not hidden
      if (!settings.hideLines) {
        path.setAttribute("stroke", INK);
        path.setAttribute("stroke-width", "4");
        path.setAttribute("stroke-linejoin", "round");
      }
      
      svg.appendChild(path);
    }
    
    // If hiding unshaded parts, add a subtle outline around the whole shape
    if (settings.hideUnshaded) {
      const outlineCircle = document.createElementNS(svgNS, "circle");
      outlineCircle.setAttribute("cx", cx);
      outlineCircle.setAttribute("cy", cy);
      outlineCircle.setAttribute("r", r);
      outlineCircle.setAttribute("fill", "none");
      outlineCircle.setAttribute("stroke", INK);
      outlineCircle.setAttribute("stroke-width", "4");
      svg.appendChild(outlineCircle);
    }
    
  } else { // fraction-bar
    svg.setAttribute("viewBox", "0 0 800 420");
    const totalW = 680;
    const h = 160;
    const x = (800 - totalW) / 2;
    const y = (420 - h) / 2;
    const partW = totalW / denominator;
    
    for (let i = 0; i < denominator; i++) {
      const isShaded = i < active;
      const rect = document.createElementNS(svgNS, "rect");
      rect.setAttribute("x", (x + i * partW).toFixed(1));
      rect.setAttribute("y", y);
      rect.setAttribute("width", partW.toFixed(1));
      rect.setAttribute("height", h);
      rect.setAttribute("fill", isShaded ? SHADED : UNSHADED);
      
      // Only draw stroke if lines are not hidden
      if (!settings.hideLines) {
        rect.setAttribute("stroke", INK);
        rect.setAttribute("stroke-width", "4");
      }
      
      rect.setAttribute("rx", "12");
      svg.appendChild(rect);
    }
    
    // Outer frame
    const frame = document.createElementNS(svgNS, "rect");
    frame.setAttribute("x", x - 10);
    frame.setAttribute("y", y - 10);
    frame.setAttribute("width", totalW + 20);
    frame.setAttribute("height", h + 20);
    frame.setAttribute("fill", "none");
    frame.setAttribute("stroke", INK);
    frame.setAttribute("stroke-width", "4");
    frame.setAttribute("rx", "16");
    svg.appendChild(frame);
  }
  
  svg.setAttribute("width", "100%");
  svg.setAttribute("height", "100%");
  svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
  return svg;
}

// ─────────────────────────────────────────────────────────
// QUESTION GENERATION
// ─────────────────────────────────────────────────────────
const MIXED_DENOMINATORS = [2, 3, 4, 5, 6, 8, 10];
const ALL_MODES = ['fractions', 'percents', 'degrees', 'decimals'];

function generateQuestion() {
  let denom = settings.parts;
  let mode = settings.mode;
  
  // Mixed Practice: randomize BOTH denominator AND mode
  if (settings.mode === 'mixed') {
    denom = MIXED_DENOMINATORS[Math.floor(Math.random() * MIXED_DENOMINATORS.length)];
    mode = ALL_MODES[Math.floor(Math.random() * ALL_MODES.length)];
  }
  
  const active = Math.floor(Math.random() * (denom - 1)) + 1;
  
  return { active, denominator: denom, mode };
}

function getCorrectAnswer(active, denominator, mode) {
  switch (mode) {
    case 'fractions': return `${active}/${denominator}`;
    case 'percents': {
      const pct = (active / denominator) * 100;
      return Number.isInteger(pct) ? pct.toString() : (Math.round(pct * 10) / 10).toString();
    }
    case 'degrees': return Math.round((active / denominator) * 360).toString();
    case 'decimals': return parseFloat((active / denominator).toFixed(4)).toString();
    default: return `${active}/${denominator}`;
  }
}

// ─────────────────────────────────────────────────────────
// FRACTION UTILITIES
// ─────────────────────────────────────────────────────────
function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}

function parseFraction(frac) {
  // Handle mixed numbers like "1 1/2"
  if (frac.includes(' ')) {
    const parts = frac.split(' ');
    const whole = parseInt(parts[0], 10);
    const fractionParts = parts[1].split('/');
    const num = parseInt(fractionParts[0], 10);
    const den = parseInt(fractionParts[1], 10);
    if (!isNaN(whole) && !isNaN(num) && !isNaN(den) && den !== 0) {
      return { numerator: whole * den + num, denominator: den };
    }
    return null;
  }
  
  // Handle simple fractions
  const parts = frac.split('/');
  if (parts.length === 2) {
    const num = parseInt(parts[0], 10);
    const den = parseInt(parts[1], 10);
    if (!isNaN(num) && !isNaN(den) && den !== 0) {
      return { numerator: num, denominator: den };
    }
    return null;
  }
  
  // Handle whole numbers
  const whole = parseInt(frac, 10);
  if (!isNaN(whole)) {
    return { numerator: whole, denominator: 1 };
  }
  
  return null;
}

function areFractionsEquivalent(frac1, frac2) {
  const f1 = parseFraction(frac1);
  const f2 = parseFraction(frac2);
  
  if (!f1 || !f2) return false;
  
  // Cross multiply to check equivalence
  return f1.numerator * f2.denominator === f2.numerator * f1.denominator;
}

function simplifyFraction(frac) {
  const parsed = parseFraction(frac);
  if (!parsed) return frac;
  
  let { numerator, denominator } = parsed;
  let whole = 0;
  
  if (numerator >= denominator) {
    whole = Math.floor(numerator / denominator);
    numerator = numerator % denominator;
  }
  
  if (numerator > 0) {
    const divisor = gcd(numerator, denominator);
    numerator /= divisor;
    denominator /= divisor;
  }
  
  if (whole > 0 && numerator > 0) {
    return `${whole} ${numerator}/${denominator}`;
  } else if (whole > 0) {
    return whole.toString();
  } else if (numerator > 0) {
    return `${numerator}/${denominator}`;
  } else {
    return '0';
  }
}

// ─────────────────────────────────────────────────────────
// ANSWER CHECKING
// ─────────────────────────────────────────────────────────
function isCorrect(raw, correctVal, mode) {
  const clean = raw.replace(/[°%\s]/g, '').toLowerCase();
  const target = correctVal.replace(/[°%\s]/g, '').toLowerCase();
  
  if (mode === 'fractions') {
    // Check if exact match first
    if (clean === target) return true;
    
    // Check for equivalent fractions
    return areFractionsEquivalent(clean, target);
  }
  
  const userNum = parseFloat(clean);
  const targNum = parseFloat(target);
  if (isNaN(userNum) || isNaN(targNum)) return false;
  
  const tolerance = mode === 'decimals' ? 0.005 : 1;
  return Math.abs(userNum - targNum) <= tolerance;
}

function displayAnswer(val, mode) {
  switch (mode) {
    case 'percents': return val + '%';
    case 'degrees': return val + '°';
    case 'fractions': return simplifyFraction(val);
    default: return val;
  }
}

function checkAnswer() {
  if (!currentQ || isLoading) return;
  
  const input = document.getElementById('answer-input');
  const raw = input.textContent.trim();
  const fb = document.getElementById('feedback-box');
  const mode = currentQ.mode || settings.mode;
  
  if (!raw) {
    fb.className = 'gp-feedback-box fb-error';
    fb.textContent = 'Type your answer first.';
    return;
  }
  
  const correct = getCorrectAnswer(currentQ.active, currentQ.denominator, mode);
  
  if (isCorrect(raw, correct, mode)) {
    streak++;
    totalSolved++;
    syncStats();
    
    fb.className = 'gp-feedback-box fb-success';
    
    // Special message for equivalent fractions
    const cleanRaw = raw.replace(/[°%\s]/g, '').toLowerCase();
    if (mode === 'fractions' && cleanRaw !== correct && areFractionsEquivalent(cleanRaw, correct)) {
      const simplified = simplifyFraction(correct);
      fb.textContent = `✓ Correct! ${raw} is equivalent to ${simplified}. Next question…`;
    } else {
      fb.textContent = `✓ Correct! The answer is ${displayAnswer(correct, mode)}. Next question…`;
    }
    
    const flash = document.getElementById('correct-flash');
    flash.classList.add('show');
    setTimeout(() => flash.classList.remove('show'), 300);
    
    setTimeout(() => loadQuestion(generateQuestion()), 850);
  } else {
    streak = 0;
    syncStats();
    fb.className = 'gp-feedback-box fb-error';
    
    // More helpful error message for fractions
    if (mode === 'fractions') {
      const simplified = simplifyFraction(correct);
      fb.textContent = `✗ Not quite. Try an equivalent fraction to ${simplified}.`;
    } else {
      fb.textContent = '✗ Not quite — count the shaded sections vs total sections carefully.';
    }
    
    // Focus and select all text
    input.focus();
    const range = document.createRange();
    range.selectNodeContents(input);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }
}

// ─────────────────────────────────────────────────────────
// LOAD QUESTION
// ─────────────────────────────────────────────────────────
function loadQuestion(q) {
  if (isLoading) return;
  isLoading = true;
  currentQ = q;
  
  // Generate new random color for this question
  currentColorSet = generateRandomColorSet();

  const loader = document.getElementById('pp-loader');
  const loaderTxt = document.getElementById('pp-loader-text');
  const fb = document.getElementById('feedback-box');
  const input = document.getElementById('answer-input');
  const modeForDisplay = q.mode || settings.mode;
  const m = MODES[modeForDisplay] || MODES.fractions;

  loader.classList.remove('hidden');
  loaderTxt.textContent = 'Rendering shape…';
  fb.className = 'gp-feedback-box';
  fb.textContent = 'Study the shape and type your answer below.';
  input.textContent = '';
  input.setAttribute('data-placeholder', m.placeholder);

  document.getElementById('modal-title').textContent = m.modalQ;
  document.getElementById('format-hint').textContent = m.hint;
  document.getElementById('answer-label').textContent = m.label;

  // Render SVG instantly
  const wrap = document.getElementById('polypad-wrap');
  const oldSvg = wrap.querySelector('svg');
  if (oldSvg) oldSvg.remove();

  const svg = createFractionSVG(settings.type, q.active, q.denominator);
  wrap.appendChild(svg);

  setTimeout(() => {
    loader.classList.add('hidden');
    input.focus();
    isLoading = false;
  }, 80);
}

// ─────────────────────────────────────────────────────────
// SESSION OPEN / CLOSE
// ─────────────────────────────────────────────────────────
function startSession() {
  streak = 0;
  syncStats();
  document.getElementById('polypad-modal').classList.add('active');
  document.body.style.overflow = 'hidden';
  loadQuestion(generateQuestion());
}

function closeModal() {
  document.getElementById('polypad-modal').classList.remove('active');
  document.body.style.overflow = '';
  const wrap = document.getElementById('polypad-wrap');
  const oldSvg = wrap.querySelector('svg');
  if (oldSvg) oldSvg.remove();
}

function syncStats() {
  document.getElementById('modal-streak').textContent =
    streak === 0 ? '0 in a row' : `🔥 ${streak} in a row`;
  document.getElementById('stat-streak').textContent = streak;
  document.getElementById('stat-total').textContent = totalSolved;
}

// ─────────────────────────────────────────────────────────
// KEYBOARD EVENT HANDLERS
// ─────────────────────────────────────────────────────────
const answerInput = document.getElementById('answer-input');

answerInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    e.preventDefault();
    checkAnswer();
  }
});

// Prevent paste of formatted content
answerInput.addEventListener('paste', e => {
  e.preventDefault();
  const text = e.clipboardData.getData('text/plain');
  
  const selection = window.getSelection();
  if (selection.rangeCount === 0) {
    answerInput.textContent += text;
    return;
  }
  
  const range = selection.getRangeAt(0);
  range.deleteContents();
  
  const textNode = document.createTextNode(text);
  range.insertNode(textNode);
  
  range.setStartAfter(textNode);
  range.setEndAfter(textNode);
  selection.removeAllRanges();
  selection.addRange(range);
});

// Prevent drag and drop
answerInput.addEventListener('drop', e => {
  e.preventDefault();
});

// Prevent new lines from other inputs
answerInput.addEventListener('beforeinput', e => {
  if (e.inputType === 'insertParagraph' || e.inputType === 'insertLineBreak') {
    e.preventDefault();
  }
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && document.getElementById('polypad-modal').classList.contains('active')) {
    closeModal();
  }
});