// main.js - Main application controller
import { MODES, DISABLE_PARTS_MODES } from './config.js';
import { generateRandomColorSet, areFractionsEquivalent, simplifyFraction } from './utils.js';
import { generateQuestion, getCorrectAnswer } from './questionGenerator.js';
import { createFractionSVG } from './svgRenderer.js';
import { SliderController } from './sliderController.js';

// State
let streak = 0;
let totalSolved = 0;
let currentQ = null;
let isLoading = false;
let sliderController = null;

const settings = { 
  mode: 'fractions', 
  parts: 2, 
  type: 'fraction-circle',
  hideLines: false,
  hideUnshaded: false,
  showTickMarks: true,
  showLabels: true,
  sameSplitCompare: false,
  likeFractions: false,
};

let currentColorSet = generateRandomColorSet();

// Initialize ticker
(function buildTicker() {
  const words = ['Fraction Explorer', 'Add • Subtract', 'Multiply • Divide', 'Visual Math', 'Sector Animation'];
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

// Dropdown logic
window.toggleDropdown = function(id) {
  const dd = document.getElementById(id);
  const isOpen = dd.classList.contains('open');
  document.querySelectorAll('.pp-dropdown.open').forEach(el => el.classList.remove('open'));
  if (!isOpen) dd.classList.add('open');
};

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
    
    if (dd.id === 'dd-mode') {
      settings.mode = value;
      updatePartsDropdownState();
    }
    if (dd.id === 'dd-parts') {
      settings.parts = value === 'mixed' ? 'mixed' : parseInt(value, 10);
    }
    if (dd.id === 'dd-type') settings.type = value;
  });
});

function updatePartsDropdownState() {
  const partsDropdown = document.getElementById('dd-parts');
  if (DISABLE_PARTS_MODES.includes(settings.mode)) {
    partsDropdown.style.opacity = '0.5';
    partsDropdown.style.pointerEvents = 'none';
  } else {
    partsDropdown.style.opacity = '1';
    partsDropdown.style.pointerEvents = 'auto';
  }
  
  const likeFractionsCheckbox = document.getElementById('like-fractions-checkbox-container');
  if (likeFractionsCheckbox) {
    const isOperation = ['add', 'subtract'].includes(settings.mode);
    likeFractionsCheckbox.style.display = isOperation ? 'flex' : 'none';
  }
}

// Checkbox listeners
document.getElementById('hide-lines')?.addEventListener('change', (e) => {
  settings.hideLines = e.target.checked;
  refreshVisualization();
});

document.getElementById('hide-unshaded')?.addEventListener('change', (e) => {
  settings.hideUnshaded = e.target.checked;
  refreshVisualization();
});

document.getElementById('show-ticks-modal')?.addEventListener('change', (e) => {
  settings.showTickMarks = e.target.checked;
  refreshVisualization();
});

document.getElementById('show-labels-modal')?.addEventListener('change', (e) => {
  settings.showLabels = e.target.checked;
  refreshVisualization();
});

document.getElementById('same-split-toggle')?.addEventListener('change', (e) => {
  settings.sameSplitCompare = e.target.checked;
  refreshVisualization();
});

document.getElementById('like-fractions-toggle')?.addEventListener('change', (e) => {
  settings.likeFractions = e.target.checked;
  if (currentQ && ['add', 'subtract'].includes(currentQ.mode)) {
    loadQuestion(generateQuestion(settings));
  }
});

function refreshVisualization() {
  if (currentQ && document.getElementById('polypad-modal').classList.contains('active')) {
    renderSVG();
  }
}

function renderSVG() {
  if (!currentQ) return;
  const wrap = document.getElementById('polypad-wrap');
  const oldSvg = wrap.querySelector('svg');
  if (oldSvg) oldSvg.remove();
  
  const mode = currentQ.mode || settings.mode;
  const useSlider = ['add', 'subtract'].includes(mode) && sliderController;
  const svg = createFractionSVG(
    settings.type, 
    currentQ, 
    mode, 
    settings, 
    currentColorSet,
    useSlider ? sliderController.sliderValue : null
  );
  wrap.appendChild(svg);
}

// Keypad functions
window.toggleKeypad = function() {
  const container = document.getElementById('numpad-container');
  const btn = document.getElementById('keypad-toggle');
  container.classList.toggle('hidden');
  btn.classList.toggle('active');
};

window.numpadInput = function(char) {
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
};

window.numpadBackspace = function() {
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
      const text = container.textContent;
      container.textContent = text.slice(0, offset - 1) + text.slice(offset);
      range.setStart(container, offset - 1);
      range.setEnd(container, offset - 1);
    }
  }
  selection.removeAllRanges();
  selection.addRange(range);
};

// Answer checking
function isCorrect(raw, correctVal, mode) {
  const clean = raw.replace(/[°%\s]/g, '').toLowerCase();
  const target = correctVal.replace(/[°%\s]/g, '').toLowerCase();
  
  if (mode === 'compare') return clean === target;
  
  if (mode === 'fractions' || mode === 'different-parts' || 
      mode === 'add' || mode === 'subtract' || mode === 'multiply' || mode === 'divide') {
    if (clean === target) return true;
    return areFractionsEquivalent(clean, target);
  }
  
  if (mode === 'random-total') {
    return parseInt(clean, 10) === parseInt(target, 10);
  }
  
  return Math.abs(parseFloat(clean) - parseFloat(target)) <= (mode === 'decimals' ? 0.005 : 1);
}

function displayAnswer(val, mode, extraData = null) {
  if (mode === 'different-parts' && extraData?.requestedMode) {
    switch (extraData.requestedMode) {
      case 'percents': return val + '%';
      case 'degrees': return val + '°';
      case 'time': return val + ' minutes';
      default: return simplifyFraction(val);
    }
  }
  
  switch (mode) {
    case 'percents': return val + '%';
    case 'degrees': return val + '°';
    case 'time': return val + ' minutes';
    case 'fractions': case 'different-parts': case 'add': 
    case 'subtract': case 'multiply': case 'divide':
      return simplifyFraction(val);
    default: return val;
  }
}

window.checkAnswer = function() {
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
  
  let correct;
  if (['add', 'subtract'].includes(mode) && sliderController) {
    const fraction = sliderController.getCurrentFraction();
    correct = `${fraction.numerator}/${fraction.denominator}`;
  } else {
    correct = getCorrectAnswer(currentQ, mode);
  }
  
  if (isCorrect(raw, correct, mode)) {
    streak++;
    totalSolved++;
    syncStats();
    
    fb.className = 'gp-feedback-box fb-success';
    fb.textContent = `✓ Correct! ${displayAnswer(correct, mode, currentQ)}`;
    
    const flash = document.getElementById('correct-flash');
    flash.classList.add('show');
    setTimeout(() => flash.classList.remove('show'), 300);
    
    setTimeout(() => loadQuestion(generateQuestion(settings)), 850);
  } else {
    streak = 0;
    syncStats();
    fb.className = 'gp-feedback-box fb-error';
    fb.textContent = `✗ Expected ${simplifyFraction(correct)}`;
    input.focus();
  }
};

function syncStats() {
  document.getElementById('modal-streak').textContent = streak ? `🔥 ${streak} in a row` : '0 in a row';
  document.getElementById('stat-streak').textContent = streak;
  document.getElementById('stat-total').textContent = totalSolved;
}

// Load question
function loadQuestion(q) {
  if (isLoading) return;
  isLoading = true;
  currentQ = q;
  
  currentColorSet = generateRandomColorSet();
  
  const loader = document.getElementById('pp-loader');
  const fb = document.getElementById('feedback-box');
  const input = document.getElementById('answer-input');
  const modeForDisplay = q.mode || settings.mode;
  
  let uiMode = modeForDisplay;
  if (modeForDisplay === 'different-parts' && q.requestedMode) {
    uiMode = q.requestedMode;
  }
  
  const m = MODES[uiMode] || MODES.fractions;
  const isTimeMode = uiMode === 'time';
  const isCompare = modeForDisplay === 'compare';
  const isOperation = ['add', 'subtract'].includes(modeForDisplay);
  
  loader.classList.remove('hidden');
  fb.className = 'gp-feedback-box';
  fb.textContent = m.hint;
  input.textContent = '';
  input.setAttribute('data-placeholder', m.placeholder);
  
  document.getElementById('modal-title').textContent = m.modalQ;
  document.getElementById('format-hint').textContent = m.hint;
  document.getElementById('answer-label').textContent = m.label;
  
  document.getElementById('same-split-checkbox-container').style.display = isCompare ? 'flex' : 'none';
  document.getElementById('ticks-checkbox-container').style.display = isTimeMode ? 'flex' : 'none';
  document.getElementById('like-fractions-checkbox-container').style.display = isOperation ? 'flex' : 'none';
  
  const labelsContainer = document.getElementById('labels-checkbox-container');
  labelsContainer.style.display = (isTimeMode || isCompare || isOperation) ? 'flex' : 'none';
  
  const standardNumpad = document.getElementById('standard-numpad');
  const compareNumpad = document.getElementById('compare-numpad');
  if (isCompare) {
    standardNumpad.classList.add('hidden');
    compareNumpad.classList.remove('hidden');
  } else {
    standardNumpad.classList.remove('hidden');
    compareNumpad.classList.add('hidden');
  }
  
  const wrap = document.getElementById('polypad-wrap');
  
  if (sliderController) {
    sliderController.destroy();
    sliderController = null;
  }
  
  if (isOperation) {
    sliderController = new SliderController(wrap, settings, currentColorSet);
    sliderController.initialize(q, modeForDisplay);
    sliderController.onValueChange = (value) => {
      const fraction = sliderController.getCurrentFraction();
      const simplified = simplifyFraction(`${fraction.numerator}/${fraction.denominator}`);
      fb.textContent = `Current sum: ${simplified} (${Math.round(value * 100)}% moved)`;
    };
  } else {
    renderSVG();
  }
  
  setTimeout(() => {
    loader.classList.add('hidden');
    input.focus();
    isLoading = false;
  }, 80);
}

// Session controls
window.startSession = function() {
  streak = 0;
  syncStats();
  updatePartsDropdownState();
  document.getElementById('polypad-modal').classList.add('active');
  document.body.style.overflow = 'hidden';
  loadQuestion(generateQuestion(settings));
};

window.closeModal = function() {
  document.getElementById('polypad-modal').classList.remove('active');
  document.body.style.overflow = '';
  if (sliderController) {
    sliderController.destroy();
    sliderController = null;
  }
  const wrap = document.getElementById('polypad-wrap');
  const oldSvg = wrap.querySelector('svg');
  if (oldSvg) oldSvg.remove();
};

// Keyboard handlers
const answerInput = document.getElementById('answer-input');
answerInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    e.preventDefault();
    window.checkAnswer();
  }
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && document.getElementById('polypad-modal').classList.contains('active')) {
    window.closeModal();
  }
});

// Initialize
updatePartsDropdownState();