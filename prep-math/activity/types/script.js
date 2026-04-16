// script.js
const MODES = {
  mixed: { label: 'Mixed Number', placeholder: 'e.g., 1 1/2', hint: 'Type as whole numerator/denominator — e.g., 1 1/2', modalQ: 'What mixed number does the shape show?' },
  improper: { label: 'Improper Fraction', placeholder: 'e.g., 3/2', hint: 'Type as numerator/denominator — e.g., 3/2', modalQ: 'What improper fraction does the shape show?' },
  percents: { label: 'Percent', placeholder: 'e.g., 150%', hint: 'Type the percentage — e.g., 150', modalQ: 'What percentage does the shape show?', unit: '%' },
  decimals: { label: 'Decimal', placeholder: 'e.g., 1.5', hint: 'Type as decimal — e.g., 1.5', modalQ: 'What decimal does the shape show?' },
  'mixed-practice': { label: 'Answer', placeholder: 'Type your answer', hint: 'Answer in simplest form', modalQ: 'What value does the shape show?' }
};

let streak = 0;
let totalSolved = 0;
let currentQuestion = null;
let isLoading = false;

const settings = {
  mode: 'mixed',
  wholes: 1,
  shapeType: 'circle',
  hideLines: false,
  hideUnshaded: false
};

function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); }

function simplifyFraction(n, d) {
  const divisor = gcd(Math.abs(n), d);
  return { numerator: n / divisor, denominator: d / divisor };
}

function toMixedNumber(numerator, denominator) {
  if (numerator < denominator) return { whole: 0, num: numerator, den: denominator };
  const whole = Math.floor(numerator / denominator);
  const remainder = numerator % denominator;
  if (remainder === 0) return { whole, num: 0, den: 1 };
  const simplified = simplifyFraction(remainder, denominator);
  return { whole, num: simplified.numerator, den: simplified.denominator };
}

function formatMixed(numerator, denominator) {
  const mixed = toMixedNumber(numerator, denominator);
  if (mixed.whole === 0) return `${mixed.num}/${mixed.den}`;
  if (mixed.num === 0) return `${mixed.whole}`;
  return `${mixed.whole} ${mixed.num}/${mixed.den}`;
}

function formatImproper(numerator, denominator) {
  const simplified = simplifyFraction(numerator, denominator);
  return `${simplified.numerator}/${simplified.denominator}`;
}

function generateQuestion() {
  let mode = settings.mode;
  if (mode === 'mixed-practice') {
    const modes = ['mixed', 'improper', 'percents', 'decimals'];
    mode = modes[Math.floor(Math.random() * modes.length)];
  }
  
  const wholes = settings.wholes;
  const denominator = [2, 3, 4, 5, 6, 8][Math.floor(Math.random() * 6)];
  const maxShaded = wholes * denominator;
  const minShaded = Math.max(1, Math.floor(maxShaded * 0.2));
  const shaded = Math.floor(Math.random() * (maxShaded - minShaded + 1)) + minShaded;
  const value = shaded / denominator;
  
  let correctAnswer;
  switch (mode) {
    case 'mixed':
      correctAnswer = formatMixed(shaded, denominator);
      break;
    case 'improper':
      correctAnswer = formatImproper(shaded, denominator);
      break;
    case 'percents':
      correctAnswer = Math.round(value * 100).toString();
      break;
    case 'decimals':
      correctAnswer = parseFloat(value.toFixed(4)).toString();
      break;
    default:
      correctAnswer = formatMixed(shaded, denominator);
  }
  
  return { shaded, denominator, wholes, mode, correctAnswer, value };
}

const SHADED_COLORS = ['#1a3a5c', '#1b4a3d', '#5c3a1a', '#3d1e3d', '#1e4a4a', '#6b3a1a', '#2a1e1e', '#4a6e6d'];
let currentColor = '#1a3a5c';
function randomColor() { return SHADED_COLORS[Math.floor(Math.random() * SHADED_COLORS.length)]; }

function renderShape(question) {
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute('viewBox', '0 0 800 600');
  
  if (settings.shapeType === 'circle') {
    renderMixedCircles(svg, question);
  } else {
    renderMixedBars(svg, question);
  }
  return svg;
}

function renderMixedCircles(svg, q) {
  const svgNS = "http://www.w3.org/2000/svg";
  const wholes = q.wholes;
  const denominator = q.denominator;
  const shadedTotal = q.shaded;
  const fullWholes = Math.floor(shadedTotal / denominator);
  const remainder = shadedTotal % denominator;
  
  const circleRadius = 70;
  const startX = 150;
  let currentX = startX;
  const yCenter = 250;
  
  // Draw whole circles (full shaded blocks)
  for (let i = 0; i < fullWholes; i++) {
    drawFullCircle(svg, currentX, yCenter, circleRadius, denominator, denominator, currentColor, settings.hideLines);
    currentX += circleRadius * 1.6;
  }
  
  // Draw the fractional part (stacked fraction representation)
  if (remainder > 0) {
    drawFractionCircleStack(svg, currentX + 40, yCenter - 30, circleRadius * 0.8, remainder, denominator, currentColor, settings.hideLines);
  }
  
  // If no full wholes but remainder exists (less than 1)
  if (fullWholes === 0 && remainder > 0) {
    drawFractionCircleStack(svg, startX + 80, yCenter - 30, circleRadius * 0.9, remainder, denominator, currentColor, settings.hideLines);
  }
}

function drawFullCircle(svg, cx, cy, r, active, denominator, fillColor, hideLines) {
  const svgNS = "http://www.w3.org/2000/svg";
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
    
    const pathData = `M ${cx},${cy} L ${x1.toFixed(1)},${y1.toFixed(1)} A ${r},${r} 0 ${largeArc},1 ${x2.toFixed(1)},${y2.toFixed(1)} Z`;
    const path = document.createElementNS(svgNS, "path");
    path.setAttribute("d", pathData);
    path.setAttribute("fill", isShaded ? fillColor : (settings.hideUnshaded ? 'transparent' : '#e0d8cc'));
    if (!hideLines) {
      path.setAttribute("stroke", "#1a1a1a");
      path.setAttribute("stroke-width", "3");
    }
    svg.appendChild(path);
  }
}

function drawFractionCircleStack(svg, cx, cy, r, active, denominator, fillColor, hideLines) {
  const svgNS = "http://www.w3.org/2000/svg";
  
  // Draw fraction circle
  drawFullCircle(svg, cx, cy, r, active, denominator, fillColor, hideLines);
  
  // Add fraction label below
  const label = document.createElementNS(svgNS, "text");
  label.setAttribute("x", cx);
  label.setAttribute("y", cy + r + 25);
  label.setAttribute("text-anchor", "middle");
  label.setAttribute("font-family", "'JetBrains Mono', monospace");
  label.setAttribute("font-size", "18");
  label.setAttribute("font-weight", "700");
  label.setAttribute("fill", "#1a1a1a");
  label.textContent = `${active}/${denominator}`;
  svg.appendChild(label);
}

function renderMixedBars(svg, q) {
  const svgNS = "http://www.w3.org/2000/svg";
  const wholes = q.wholes;
  const denominator = q.denominator;
  const shadedTotal = q.shaded;
  const fullWholes = Math.floor(shadedTotal / denominator);
  const remainder = shadedTotal % denominator;
  
  const barHeight = 60;
  const barWidth = 120;
  let currentX = 100;
  const yCenter = 250;
  
  // Draw whole bars (full shaded blocks)
  for (let i = 0; i < fullWholes; i++) {
    drawFullBar(svg, currentX, yCenter - barHeight/2, barWidth, barHeight, denominator, denominator, currentColor, settings.hideLines);
    currentX += barWidth + 20;
  }
  
  // Draw fractional part as stacked bar representation
  if (remainder > 0) {
    drawFractionBarStack(svg, currentX + 40, yCenter - 40, barWidth * 0.7, barHeight * 0.8, remainder, denominator, currentColor, settings.hideLines);
  }
  
  if (fullWholes === 0 && remainder > 0) {
    drawFractionBarStack(svg, 200, yCenter - 40, barWidth * 0.8, barHeight * 0.8, remainder, denominator, currentColor, settings.hideLines);
  }
}

function drawFullBar(svg, x, y, width, height, active, denominator, fillColor, hideLines) {
  const svgNS = "http://www.w3.org/2000/svg";
  const partWidth = width / denominator;
  
  for (let i = 0; i < denominator; i++) {
    const isShaded = i < active;
    const rect = document.createElementNS(svgNS, "rect");
    rect.setAttribute("x", (x + i * partWidth).toFixed(1));
    rect.setAttribute("y", y);
    rect.setAttribute("width", partWidth.toFixed(1));
    rect.setAttribute("height", height);
    rect.setAttribute("fill", isShaded ? fillColor : (settings.hideUnshaded ? 'transparent' : '#e0d8cc'));
    if (!hideLines) {
      rect.setAttribute("stroke", "#1a1a1a");
      rect.setAttribute("stroke-width", "3");
    }
    svg.appendChild(rect);
  }
}

function drawFractionBarStack(svg, cx, cy, width, height, active, denominator, fillColor, hideLines) {
  const svgNS = "http://www.w3.org/2000/svg";
  const partWidth = width / denominator;
  
  for (let i = 0; i < denominator; i++) {
    const isShaded = i < active;
    const rect = document.createElementNS(svgNS, "rect");
    rect.setAttribute("x", (cx + i * partWidth).toFixed(1));
    rect.setAttribute("y", cy);
    rect.setAttribute("width", partWidth.toFixed(1));
    rect.setAttribute("height", height);
    rect.setAttribute("fill", isShaded ? fillColor : (settings.hideUnshaded ? 'transparent' : '#e0d8cc'));
    if (!hideLines) {
      rect.setAttribute("stroke", "#1a1a1a");
      rect.setAttribute("stroke-width", "3");
    }
    svg.appendChild(rect);
  }
  
  // Add fraction label
  const label = document.createElementNS(svgNS, "text");
  label.setAttribute("x", cx + width/2);
  label.setAttribute("y", cy + height + 20);
  label.setAttribute("text-anchor", "middle");
  label.setAttribute("font-family", "'JetBrains Mono', monospace");
  label.setAttribute("font-size", "16");
  label.setAttribute("font-weight", "700");
  label.setAttribute("fill", "#1a1a1a");
  label.textContent = `${active}/${denominator}`;
  svg.appendChild(label);
}

function normalizeMixedAnswer(input) {
  input = input.trim().replace(/\s+/g, ' ');
  const parts = input.split(' ');
  if (parts.length === 2) {
    const fraction = parts[1].split('/');
    if (fraction.length === 2) {
      return { whole: parseInt(parts[0]), num: parseInt(fraction[0]), den: parseInt(fraction[1]) };
    }
  }
  return null;
}

function compareAnswers(user, correct, mode, question) {
  const userLower = user.toLowerCase().trim();
  
  if (mode === 'mixed') {
    const correctMixed = toMixedNumber(question.shaded, question.denominator);
    const correctStr = formatMixed(question.shaded, question.denominator).toLowerCase();
    if (userLower === correctStr) return true;
    
    const userMixed = normalizeMixedAnswer(userLower);
    if (userMixed && !isNaN(userMixed.whole) && !isNaN(userMixed.num) && !isNaN(userMixed.den)) {
      const userValue = userMixed.whole + userMixed.num / userMixed.den;
      const targetValue = question.shaded / question.denominator;
      return Math.abs(userValue - targetValue) < 0.001;
    }
    
    if (userLower.includes('/')) {
      const frac = userLower.split('/');
      if (frac.length === 2) {
        const userNum = parseInt(frac[0]);
        const userDen = parseInt(frac[1]);
        if (!isNaN(userNum) && !isNaN(userDen)) {
          return Math.abs((userNum / userDen) - (question.shaded / question.denominator)) < 0.001;
        }
      }
    }
    
    const userNum = parseFloat(userLower);
    if (!isNaN(userNum)) {
      return Math.abs(userNum - (question.shaded / question.denominator)) < 0.01;
    }
    return false;
  }
  
  if (mode === 'improper') {
    const targetValue = question.shaded / question.denominator;
    if (userLower.includes('/')) {
      const parts = userLower.split('/');
      if (parts.length === 2) {
        const userNum = parseInt(parts[0]);
        const userDen = parseInt(parts[1]);
        if (!isNaN(userNum) && !isNaN(userDen)) {
          return Math.abs((userNum / userDen) - targetValue) < 0.001;
        }
      }
    }
    const userNum = parseFloat(userLower);
    if (!isNaN(userNum)) return Math.abs(userNum - targetValue) < 0.01;
    return userLower === correct.toLowerCase();
  }
  
  if (mode === 'percents' || mode === 'decimals') {
    const userNum = parseFloat(userLower.replace('%', ''));
    const targetNum = parseFloat(correct);
    if (isNaN(userNum)) return false;
    const tolerance = mode === 'decimals' ? 0.005 : 1;
    return Math.abs(userNum - targetNum) <= tolerance;
  }
  
  return userLower === correct.toLowerCase();
}

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
    if (dd.id === 'dd-wholes') settings.wholes = parseInt(value);
    if (dd.id === 'dd-type') settings.shapeType = value;
  });
});

document.getElementById('hide-lines')?.addEventListener('change', e => settings.hideLines = e.target.checked);
document.getElementById('hide-unshaded')?.addEventListener('change', e => settings.hideUnshaded = e.target.checked);

function toggleKeypad() {
  document.getElementById('numpad-container').classList.toggle('hidden');
  document.getElementById('keypad-toggle').classList.toggle('active');
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
    if (container.nodeType === Node.TEXT_NODE && offset > 0) {
      container.textContent = container.textContent.slice(0, offset - 1);
      range.setStart(container, offset - 1);
      range.setEnd(container, offset - 1);
    } else if (container.childNodes[offset - 1]) {
      container.childNodes[offset - 1].remove();
    }
  }
  selection.removeAllRanges();
  selection.addRange(range);
}

function checkAnswer() {
  if (!currentQuestion || isLoading) return;
  const input = document.getElementById('answer-input');
  const raw = input.textContent.trim();
  const fb = document.getElementById('feedback-box');
  const mode = currentQuestion.mode;
  
  if (!raw) {
    fb.className = 'gp-feedback-box fb-error';
    fb.textContent = 'Type your answer first.';
    return;
  }
  
  const isCorrect = compareAnswers(raw, currentQuestion.correctAnswer, mode, currentQuestion);
  
  if (isCorrect) {
    streak++;
    totalSolved++;
    updateStats();
    fb.className = 'gp-feedback-box fb-success';
    fb.textContent = `✓ Correct! Next question…`;
    const flash = document.getElementById('correct-flash');
    flash.classList.add('show');
    setTimeout(() => flash.classList.remove('show'), 300);
    setTimeout(() => loadNewQuestion(), 800);
  } else {
    streak = 0;
    updateStats();
    fb.className = 'gp-feedback-box fb-error';
    fb.textContent = `✗ Not quite. The correct answer is ${currentQuestion.correctAnswer}. Try again!`;
    input.focus();
  }
}

function loadNewQuestion() {
  if (isLoading) return;
  isLoading = true;
  currentQuestion = generateQuestion();
  currentColor = randomColor();
  const modeInfo = MODES[currentQuestion.mode] || MODES.mixed;
  document.getElementById('modal-title').textContent = modeInfo.modalQ;
  document.getElementById('format-hint').textContent = modeInfo.hint;
  document.getElementById('answer-label').textContent = modeInfo.label;
  document.getElementById('answer-input').textContent = '';
  document.getElementById('answer-input').setAttribute('data-placeholder', modeInfo.placeholder);
  const loader = document.getElementById('pp-loader');
  const fb = document.getElementById('feedback-box');
  loader.classList.remove('hidden');
  fb.className = 'gp-feedback-box';
  fb.textContent = 'Study the shape and type your answer below.';
  const wrap = document.getElementById('polypad-wrap');
  const oldSvg = wrap.querySelector('svg');
  if (oldSvg) oldSvg.remove();
  const svg = renderShape(currentQuestion);
  wrap.appendChild(svg);
  setTimeout(() => {
    loader.classList.add('hidden');
    document.getElementById('answer-input').focus();
    isLoading = false;
  }, 100);
}

function startSession() {
  streak = 0;
  totalSolved = 0;
  updateStats();
  document.getElementById('polypad-modal').classList.add('active');
  document.body.style.overflow = 'hidden';
  loadNewQuestion();
}

function closeModal() {
  document.getElementById('polypad-modal').classList.remove('active');
  document.body.style.overflow = '';
}

function updateStats() {
  document.getElementById('modal-streak').textContent = streak === 0 ? '0 in a row' : `🔥 ${streak} in a row`;
  document.getElementById('stat-streak').textContent = streak;
  document.getElementById('stat-total').textContent = totalSolved;
}

(function initTicker() {
  const words = ['Mixed Numbers', 'Improper Fractions', 'Whole + Proper', 'Visual Learning', 'Prep Portal 2026'];
  const track = document.getElementById('ticker-track');
  if (track) {
    [...words, ...words].forEach(w => {
      const span = document.createElement('span');
      span.className = 'ticker-item';
      span.textContent = w;
      track.appendChild(span);
    });
  }
})();

window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hide');
  }, 500);
});

document.getElementById('answer-input')?.addEventListener('keydown', e => {
  if (e.key === 'Enter') { e.preventDefault(); checkAnswer(); }
});