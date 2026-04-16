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

const settings = { mode: 'fractions', parts: 2, type: 'fraction-circle' };

// ─────────────────────────────────────────────────────────
// TICKER
// ─────────────────────────────────────────────────────────
(function buildTicker() {
  const words = [
    'Fraction Explorer', 'PrepBot · Maths', 'Visual Fractions',
    'Prep Portal 2026', 'Circles · Bars', 'Endless Practice',
  ];
  const track = document.getElementById('ticker-track');
  [...words, ...words].forEach(t => {
    const s = document.createElement('span');
    s.className = 'ticker-item';
    s.textContent = t;
    track.appendChild(s);
  });
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
  input.value += char;
  input.focus();
}

function numpadBackspace() {
  const input = document.getElementById('answer-input');
  input.value = input.value.slice(0, -1);
  input.focus();
}

// ─────────────────────────────────────────────────────────
// COLOR UTILITIES — One random color per render
// ─────────────────────────────────────────────────────────
const MUTED_COLORS = [
  '#2E5A88', '#3D6B5D', '#8B5E3C', '#6B4C6B', '#4A6E6D',
  '#9B6B43', '#5C4E4E', '#3A6B5C', '#7C5C4A', '#4A5B6B',
  '#6B5B4D', '#3D5C5C', '#5A4E6B', '#4E6B5A', '#886644',
  '#4A6B8A', '#6B5A4E', '#3A5C6B', '#7C6B5A', '#5C5A6B',
];

const PASTEL_COLORS = [
  '#A8C4E0', '#A8E0C4', '#E0C4A8', '#C4A8E0', '#E0A8C4',
  '#A8E0E0', '#E0E0A8', '#C4E0A8', '#E0A8A8', '#A8A8E0',
  '#B8D4A8', '#D4A8B8', '#A8B8D4', '#D4D4A8', '#B8A8D4',
];

function generateRandomColorSet() {
  const isPastel = Math.random() > 0.5;
  const palette = isPastel ? PASTEL_COLORS : MUTED_COLORS;
  const randomColor = palette[Math.floor(Math.random() * palette.length)];
  
  return {
    shadedColor: randomColor,
    unshaded: isPastel ? '#FAFAF5' : '#F0EDE8',
    ink: isPastel ? '#3A3A3A' : '#1A1A1A',
  };
}

let currentColorSet = generateRandomColorSet();

// ─────────────────────────────────────────────────────────
// SVG CANVAS RENDERER — All shaded parts use same color
// ─────────────────────────────────────────────────────────
function createFractionSVG(type, active, denominator) {
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  
  const INK = currentColorSet.ink;
  const SHADED = currentColorSet.shadedColor;
  const UNSHADED = currentColorSet.unshaded;
  
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
      path.setAttribute("stroke", INK);
      path.setAttribute("stroke-width", "4");
      path.setAttribute("stroke-linejoin", "round");
      svg.appendChild(path);
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
      rect.setAttribute("stroke", INK);
      rect.setAttribute("stroke-width", "4");
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

function isCorrect(raw, correctVal, mode) {
  const clean = raw.replace(/[°%\s]/g, '').toLowerCase();
  const target = correctVal.replace(/[°%\s]/g, '').toLowerCase();
  
  if (mode === 'fractions') return clean === target;
  
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
    default: return val;
  }
}

// ─────────────────────────────────────────────────────────
// LOAD QUESTION (now pure SVG)
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
  input.value = '';

  document.getElementById('modal-title').textContent = m.modalQ;
  document.getElementById('format-hint').textContent = m.hint;
  document.getElementById('answer-input').placeholder = m.placeholder;
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

// ─────────────────────────────────────────────────────────
// ANSWER CHECKING
// ─────────────────────────────────────────────────────────
function checkAnswer() {
  if (!currentQ || isLoading) return;
  
  const raw = document.getElementById('answer-input').value.trim();
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
    fb.textContent = `✓ Correct! The answer is ${displayAnswer(correct, mode)}. Next question…`;
    
    const flash = document.getElementById('correct-flash');
    flash.classList.add('show');
    setTimeout(() => flash.classList.remove('show'), 300);
    
    setTimeout(() => loadQuestion(generateQuestion()), 850);
  } else {
    streak = 0;
    syncStats();
    fb.className = 'gp-feedback-box fb-error';
    fb.textContent = '✗ Not quite — count the shaded sections vs total sections carefully.';
    document.getElementById('answer-input').select();
  }
}

function syncStats() {
  document.getElementById('modal-streak').textContent =
    streak === 0 ? '0 in a row' : `🔥 ${streak} in a row`;
  document.getElementById('stat-streak').textContent = streak;
  document.getElementById('stat-total').textContent = totalSolved;
}

// ─────────────────────────────────────────────────────────
// KEYBOARD
// ─────────────────────────────────────────────────────────
document.getElementById('answer-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') checkAnswer();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && document.getElementById('polypad-modal').classList.contains('active')) {
    closeModal();
  }
});