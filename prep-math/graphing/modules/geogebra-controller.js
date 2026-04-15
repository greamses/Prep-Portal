import { state, updateState } from './state.js';
import { dom } from './dom-elements.js';
import { renderDisplay, clearInput, ensureCursorVisible } from './math-display.js';

export function initGeoGebra() {
  const params = {
    appName: 'graphing',
    width: window.innerWidth,
    height: window.innerHeight - 200,
    showToolBar: false,
    showAlgebraInput: false,
    showMenuBar: false,
    enableShiftDragZoom: true,
    borderColor: '#1a1a1a',
    axisColor: '#1a1a1a',
    gridColor: '#e0e0e0',
    bgColor: '#ffffff',
    language: 'en',
    appletOnLoad(api) {
      updateState('ggbApplet', api);
      api.evalCommand(state.currentTargetEquation);
      api.setAxesVisible(true, true);
      api.setGridVisible(true);
      api.setColor('f', 59, 130, 246);
      api.setLineThickness('f', 3);
      api.setCoordSystem(-6, 6, -6, 6);
    }
  };
  
  new GGBApplet(params, 'ggb-element').inject();
}

export function generateNewProblem() {
  if (!state.ggbApplet) return;
  
  // Get current topic from state (fallback to statTopic text)
  const currentTopic = state.currentTopic || dom.statTopic?.textContent || 'Linear';
  
  console.log('Generating problem for topic:', currentTopic);
  
  let newEquation;
  if (currentTopic === 'Quadratics') {
    newEquation = generateQuadraticProblem();
  } else if (currentTopic === 'Trigonometry') {
    newEquation = generateTrigProblem();
  } else if (currentTopic === 'Exponential') {
    newEquation = generateExponentialProblem();
  } else {
    // Default to Linear
    newEquation = generateLinearProblem();
  }
  
  console.log('New equation:', newEquation);
  
  updateState('currentTargetEquation', newEquation);
  
  state.ggbApplet.reset();
  state.ggbApplet.deleteObject('g');
  state.ggbApplet.evalCommand(newEquation);
  state.ggbApplet.setColor('f', 59, 130, 246);
  state.ggbApplet.setLineThickness('f', 3);
  
  // Adjust coordinate system based on equation type
  if (newEquation.includes('^2') || newEquation.includes('²')) {
    state.ggbApplet.setCoordSystem(-6, 6, -4, 10);
  } else if (newEquation.includes('sin') || newEquation.includes('cos') || newEquation.includes('tan')) {
    state.ggbApplet.setCoordSystem(-Math.PI * 2, Math.PI * 2, -2, 2);
  } else {
    state.ggbApplet.setCoordSystem(-6, 6, -6, 6);
  }
  
  if (dom.feedbackBox) {
    dom.feedbackBox.textContent = `New ${currentTopic.toLowerCase()} graph — start typing!`;
    dom.feedbackBox.className = 'gp-feedback-box';
  }
  
  clearInput();
  ensureCursorVisible();
  
  // Clear any existing preview graph
  try {
    state.ggbApplet.deleteObject('g');
  } catch (e) {
    // Ignore
  }
}

function generateLinearProblem() {
  let m;
  do {
    m = Math.floor(Math.random() * 7) - 3;
  } while (m === 0);
  
  const c = Math.floor(Math.random() * 11) - 5;
  
  let mStr = formatCoefficient(m, '');
  const cStr = c >= 0 ? `+${c}` : `${c}`;
  
  let equationStr;
  if (c === 0) {
    equationStr = `${mStr}x`;
  } else {
    equationStr = `${mStr}x ${cStr}`;
  }
  
  return `f(x) = ${equationStr}`.replace(/\s+/g, ' ').trim();
}

function generateQuadraticProblem() {
  // Generate nice quadratic equations
  const types = [
    () => { // x^2 + bx + c
      const b = Math.floor(Math.random() * 7) - 3;
      const c = Math.floor(Math.random() * 9) - 4;
      return {
        a: 1,
        b: b === 0 ? 2 : b,
        c: c
      };
    },
    () => { // ax^2 + c (no x term)
      let a;
      do {
        a = Math.floor(Math.random() * 5) - 2;
      } while (a === 0 || a === 1);
      const c = Math.floor(Math.random() * 9) - 4;
      return { a, b: 0, c };
    },
    () => { // Perfect square: (x + d)^2
      const d = Math.floor(Math.random() * 5) - 2;
      return {
        a: 1,
        b: 2 * d,
        c: d * d
      };
    },
    () => { // Factored form: a(x - r1)(x - r2)
      const r1 = Math.floor(Math.random() * 5) - 2;
      const r2 = Math.floor(Math.random() * 5) - 2;
      return {
        a: 1,
        b: -(r1 + r2),
        c: r1 * r2
      };
    },
    () => { // Negative a coefficient
      const b = Math.floor(Math.random() * 5);
      const c = Math.floor(Math.random() * 7) - 3;
      return {
        a: -1,
        b: b,
        c: c
      };
    }
  ];
  
  const generator = types[Math.floor(Math.random() * types.length)];
  const { a, b, c } = generator();
  
  return formatQuadraticEquation(a, b, c);
}

function generateTrigProblem() {
  const functions = ['sin', 'cos'];
  const func = functions[Math.floor(Math.random() * functions.length)];
  
  const amplitude = Math.floor(Math.random() * 3) + 1; // 1, 2, or 3
  const frequency = Math.floor(Math.random() * 3) + 1; // 1, 2, or 3
  const phaseShift = Math.floor(Math.random() * 5) - 2; // -2 to 2
  const verticalShift = Math.floor(Math.random() * 5) - 2; // -2 to 2
  
  let equation = `f(x) = `;
  
  // Amplitude
  if (amplitude !== 1) {
    equation += amplitude;
  }
  
  equation += `${func}(`;
  
  // Frequency
  if (frequency !== 1) {
    equation += frequency;
  }
  equation += 'x';
  
  // Phase shift
  if (phaseShift !== 0) {
    equation += phaseShift > 0 ? ` + ${phaseShift}` : ` - ${Math.abs(phaseShift)}`;
  }
  
  equation += ')';
  
  // Vertical shift
  if (verticalShift !== 0) {
    equation += verticalShift > 0 ? ` + ${verticalShift}` : ` - ${Math.abs(verticalShift)}`;
  }
  
  return equation;
}

function generateExponentialProblem() {
  const base = Math.floor(Math.random() * 3) + 2; // 2, 3, or 4
  const coefficient = Math.floor(Math.random() * 5) - 2; // -2 to 2
  const exponentCoeff = Math.floor(Math.random() * 3) + 1; // 1 or 2
  const verticalShift = Math.floor(Math.random() * 5) - 2; // -2 to 2
  
  let equation = 'f(x) = ';
  
  if (coefficient !== 1 && coefficient !== 0) {
    if (coefficient === -1) {
      equation += '-';
    } else {
      equation += coefficient;
    }
  }
  
  equation += `${base}^`;
  
  if (exponentCoeff !== 1) {
    equation += `(${exponentCoeff}x)`;
  } else {
    equation += 'x';
  }
  
  if (verticalShift !== 0) {
    equation += verticalShift > 0 ? ` + ${verticalShift}` : ` - ${Math.abs(verticalShift)}`;
  }
  
  return equation;
}

function formatCoefficient(value, variable) {
  if (value === 1) return variable || '1';
  if (value === -1) return '-' + (variable || '1');
  return value.toString() + (variable || '');
}

function formatQuadraticEquation(a, b, c) {
  let equation = 'f(x) = ';
  
  // x^2 term
  if (a === 1) {
    equation += 'x^2';
  } else if (a === -1) {
    equation += '-x^2';
  } else {
    equation += a + 'x^2';
  }
  
  // x term
  if (b !== 0) {
    if (b === 1) {
      equation += ' + x';
    } else if (b === -1) {
      equation += ' - x';
    } else if (b > 0) {
      equation += ' + ' + b + 'x';
    } else {
      equation += ' - ' + Math.abs(b) + 'x';
    }
  }
  
  // constant term
  if (c !== 0) {
    if (c > 0) {
      equation += ' + ' + c;
    } else {
      equation += ' - ' + Math.abs(c);
    }
  }
  
  return equation;
}

export function handleWindowResize() {
  if (state.ggbApplet) {
    state.ggbApplet.setSize(window.innerWidth, window.innerHeight - 200);
  }
}