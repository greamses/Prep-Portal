import { state, updateState } from './state.js';
import { dom } from './dom-elements.js';

let liveUpdateTimer = null;
const LIVE_UPDATE_DELAY = 300; // ms delay for live updates

export function validateEquation(userInput) {
  if (!state.ggbApplet || !state.currentTargetEquation) return false;
  
  try {
    const targetMatch = state.currentTargetEquation.match(/f\(x\)\s*=\s*(.+)/);
    if (!targetMatch) return false;
    
    const targetExpr = targetMatch[1].replace(/\s/g, '');
    let userExpr = userInput.replace(/\s/g, '');
    
    // Normalize both expressions
    userExpr = normalizeExpression(userExpr);
    const normalizedTarget = normalizeExpression(targetExpr);
    
    // Check equation type and validate accordingly
    if (isQuadratic(normalizedTarget) || isQuadratic(userExpr)) {
      return validateQuadratic(normalizedTarget, userExpr);
    }
    
    // Linear validation
    return validateLinear(normalizedTarget, userExpr);
    
  } catch (err) {
    console.warn('Validation error:', err);
    return false;
  }
}

function normalizeExpression(expr) {
  return expr
    .replace(/\*/g, '')
    .replace(/×/g, '')
    .replace(/\.0/g, '')
    .replace(/\s/g, '');
}

function isQuadratic(expr) {
  return expr.includes('x^2') || expr.includes('x²') || expr.match(/x\^2|xx/);
}

function validateLinear(target, user) {
  const targetLinear = target.match(/([+-]?\d*)x([+-]\d+)?/);
  const userLinear = user.match(/([+-]?\d*)x([+-]\d+)?/);
  
  if (targetLinear && userLinear) {
    let targetM = targetLinear[1] || '1';
    if (targetM === '' || targetM === '+') targetM = '1';
    if (targetM === '-') targetM = '-1';
    
    let userM = userLinear[1] || '1';
    if (userM === '' || userM === '+') userM = '1';
    if (userM === '-') userM = '-1';
    
    let targetC = targetLinear[2] || '+0';
    let userC = userLinear[2] || '+0';
    
    const mMatch = parseFloat(targetM) === parseFloat(userM);
    const cMatch = parseFloat(targetC) === parseFloat(userC);
    
    return mMatch && cMatch;
  }
  
  return target === user;
}

function validateQuadratic(target, user) {
  // Parse quadratic coefficients
  const targetCoeffs = parseQuadratic(target);
  const userCoeffs = parseQuadratic(user);
  
  if (!targetCoeffs || !userCoeffs) return false;
  
  // Compare coefficients with tolerance for floating point
  const tolerance = 0.0001;
  
  return Math.abs(targetCoeffs.a - userCoeffs.a) < tolerance &&
         Math.abs(targetCoeffs.b - userCoeffs.b) < tolerance &&
         Math.abs(targetCoeffs.c - userCoeffs.c) < tolerance;
}

function parseQuadratic(expr) {
  try {
    // Handle different quadratic formats
    let a = 0, b = 0, c = 0;
    
    // Remove spaces and standardize
    let standardized = expr
      .replace(/x²/g, 'x^2')
      .replace(/xx/g, 'x^2')
      .replace(/\s/g, '');
    
    // Extract x^2 coefficient
    const x2Match = standardized.match(/([+-]?\d*\.?\d*)x\^2/);
    if (x2Match) {
      let coeff = x2Match[1];
      if (coeff === '' || coeff === '+') a = 1;
      else if (coeff === '-') a = -1;
      else a = parseFloat(coeff);
    }
    
    // Extract x coefficient (not part of x^2)
    const remaining = standardized.replace(/([+-]?\d*\.?\d*)x\^2/, '');
    const xMatch = remaining.match(/([+-]?\d*\.?\d*)x(?!\^)/);
    if (xMatch) {
      let coeff = xMatch[1];
      if (coeff === '' || coeff === '+') b = 1;
      else if (coeff === '-') b = -1;
      else b = parseFloat(coeff);
    }
    
    // Extract constant term
    const constantMatch = remaining.replace(/([+-]?\d*\.?\d*)x(?!\^)/, '')
                                  .match(/([+-]?\d+\.?\d*)$/);
    if (constantMatch) {
      c = parseFloat(constantMatch[1]) || 0;
    }
    
    return { a, b, c };
  } catch (err) {
    console.warn('Failed to parse quadratic:', err);
    return null;
  }
}

// Live update function - silently plot the graph without error messages
export function liveUpdateGraph() {
  clearTimeout(liveUpdateTimer);
  
  liveUpdateTimer = setTimeout(() => {
    if (!state.ggbApplet) return;
    
    // If input is empty, just clear the graph
    if (!state.currentInput || !state.currentInput.trim()) {
      try {
        state.ggbApplet.deleteObject('g');
      } catch (err) {
        // Ignore errors when deleting non-existent object
      }
      
      // Only update feedback if it's not showing success/error from submission
      if (dom.feedbackBox && !dom.feedbackBox.classList.contains('fb-success') && 
          !dom.feedbackBox.classList.contains('fb-error')) {
        dom.feedbackBox.textContent = 'Type an equation to see it plotted';
        dom.feedbackBox.className = 'gp-feedback-box';
      }
      return;
    }
    
    try {
      let ggInput = state.currentInput
        .replace(/arcsin\(/g, 'asin(')
        .replace(/arccos\(/g, 'acos(')
        .replace(/arctan\(/g, 'atan(')
        .replace(/int\(/g, 'Integral(')
        .replace(/diff\(/g, 'Derivative(')
        .replace(/nroot\(/g, 'nroot(')
        .replace(/infinity/g, '∞')
        .replace(/log10\(/g, 'log10(')
        .replace(/logx\(/g, 'log(')
        .replace(/²/g, '^2');
      
      // Remove any "y=" or "f(x)=" prefix
      ggInput = ggInput.replace(/^(y|f\(x\))\s*=\s*/, '');
      
      // CRITICAL: Check if the input might be valid before sending to GeoGebra
      // This prevents the error popup from GeoGebra
      if (!isPotentiallyValidEquation(ggInput)) {
        // Silently ignore - don't even try to plot
        try {
          state.ggbApplet.deleteObject('g');
        } catch (e) {
          // Ignore
        }
        return;
      }
      
      // Temporarily disable error dialogs from GeoGebra
      const originalErrorHandler = window.onerror;
      window.onerror = function(msg, url, line, col, error) {
        // Silently catch GeoGebra errors
        if (msg && msg.includes('GeoGebra')) {
          return true; // Prevent error from showing
        }
        return false;
      };
      
      // Try to evaluate and plot
      try {
        state.ggbApplet.evalCommand(`g(x) = ${ggInput}`);
        
        // Set color to orange for preview
        state.ggbApplet.setColor('g', 255, 140, 0); // Orange
        state.ggbApplet.setLineThickness('g', 2);
        
        // Only update feedback if it's not showing success/error from submission
        if (dom.feedbackBox && !dom.feedbackBox.classList.contains('fb-success') && 
            !dom.feedbackBox.classList.contains('fb-error')) {
          dom.feedbackBox.textContent = 'Preview — press Enter to check your answer';
          dom.feedbackBox.className = 'gp-feedback-box';
        }
      } catch (evalErr) {
        // Silently fail - just remove the graph
        try {
          state.ggbApplet.deleteObject('g');
        } catch (e) {
          // Ignore
        }
      } finally {
        // Restore original error handler
        window.onerror = originalErrorHandler;
      }
      
    } catch (err) {
      // Silently fail - GeoGebra will just not show the graph
      try {
        state.ggbApplet.deleteObject('g');
      } catch (e) {
        // Ignore
      }
    }
  }, LIVE_UPDATE_DELAY);
}

// Helper function to check if equation might be valid before sending to GeoGebra
function isPotentiallyValidEquation(input) {
  // Remove whitespace
  const trimmed = input.trim();
  
  // Empty is not valid
  if (trimmed.length === 0) return false;
  
  // Check for basic structure
  // Must contain x and some operator or function
  const hasX = trimmed.includes('x');
  const hasOperator = /[+\-*/^]/.test(trimmed);
  const hasFunction = /(sin|cos|tan|log|ln|sqrt|abs)/.test(trimmed);
  
  // If it doesn't have x and doesn't have functions, it's probably not ready
  if (!hasX && !hasFunction) return false;
  
  // Check for unmatched parentheses
  const openParens = (trimmed.match(/\(/g) || []).length;
  const closeParens = (trimmed.match(/\)/g) || []).length;
  if (openParens !== closeParens) return false;
  
  // Check for incomplete expressions (ending with operator)
  if (/[+\-*/^]$/.test(trimmed)) return false;
  
  // Check for incomplete function calls
  if (/(sin|cos|tan|log|ln|sqrt|abs)$/.test(trimmed)) return false;
  
  return true;
}

export function submitEquation() {
  if (!state.currentInput.trim()) {
    if (dom.feedbackBox) {
      dom.feedbackBox.textContent = 'Please enter an equation';
      dom.feedbackBox.className = 'gp-feedback-box fb-error';
    }
    return;
  }
  
  if (!state.ggbApplet) return;
  
  try {
    let ggInput = state.currentInput
      .replace(/arcsin\(/g, 'asin(')
      .replace(/arccos\(/g, 'acos(')
      .replace(/arctan\(/g, 'atan(')
      .replace(/int\(/g, 'Integral(')
      .replace(/diff\(/g, 'Derivative(')
      .replace(/nroot\(/g, 'nroot(')
      .replace(/infinity/g, '∞')
      .replace(/log10\(/g, 'log10(')
      .replace(/logx\(/g, 'log(')
      .replace(/²/g, '^2');
    
    // Remove any "y=" or "f(x)=" prefix
    ggInput = ggInput.replace(/^(y|f\(x\))\s*=\s*/, '');
    
    // Try to evaluate
    state.ggbApplet.evalCommand(`g(x) = ${ggInput}`);
    
    const isCorrect = validateEquation(state.currentInput);
    colorGraph(isCorrect);
    
    if (isCorrect) {
      const newCount = state.solvedCount + 1;
      updateState('solvedCount', newCount);
      if (dom.statSolved) dom.statSolved.textContent = newCount;
      if (dom.feedbackBox) {
        dom.feedbackBox.textContent = '✓ Correct! Well done!';
        dom.feedbackBox.className = 'gp-feedback-box fb-success';
      }
      if (typeof confetti !== 'undefined') {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      }
    } else {
      if (dom.feedbackBox) {
        dom.feedbackBox.textContent = '✗ Not quite right. Try again!';
        dom.feedbackBox.className = 'gp-feedback-box fb-error';
      }
    }
  } catch (err) {
    // Only show error on submission attempt
    if (dom.feedbackBox) {
      dom.feedbackBox.textContent = 'Invalid equation — check your syntax';
      dom.feedbackBox.className = 'gp-feedback-box fb-error';
    }
  }
}

function colorGraph(isCorrect) {
  if (!state.ggbApplet) return;
  try {
    if (isCorrect) {
      state.ggbApplet.setColor('g', 0, 165, 80); // Green for correct
      state.ggbApplet.setLineThickness('g', 4);
    } else {
      state.ggbApplet.setColor('g', 239, 68, 68); // Red for incorrect
      state.ggbApplet.setLineThickness('g', 3);
    }
  } catch (err) {
    console.warn('Color error:', err);
  }
}

// Clear the submission feedback when user starts typing again
export function clearSubmissionFeedback() {
  if (dom.feedbackBox) {
    // Only clear if it's showing success/error
    if (dom.feedbackBox.classList.contains('fb-success') || 
        dom.feedbackBox.classList.contains('fb-error')) {
      dom.feedbackBox.textContent = 'Preview — press Enter to check your answer';
      dom.feedbackBox.className = 'gp-feedback-box';
    }
  }
}