import { state, updateState } from './state.js';
import { dom } from './dom-elements.js';
import { toLatex, getCursorStyles } from './utils.js';

export function renderDisplay() {
  const { mathPlaceholder, mathBefore, mathAfter, cursorEl } = dom;
  if (!mathPlaceholder || !mathBefore || !mathAfter || !cursorEl) return;
  
  const hasInput = state.currentInput.length > 0;
  
  mathPlaceholder.style.display = hasInput ? 'none' : 'inline';
  
  if (!hasInput) {
    mathBefore.innerHTML = '';
    mathAfter.innerHTML = '';
    mathBefore.style.visibility = 'visible';
    mathAfter.style.visibility = 'visible';
    cursorEl.style.cssText = getCursorStyles(1);
    return;
  }
  
  const before = state.currentInput.slice(0, state.cursorPosition);
  const after = state.currentInput.slice(state.cursorPosition);
  
  mathBefore.style.visibility = 'hidden';
  mathAfter.style.visibility = 'hidden';
  cursorEl.style.cssText = getCursorStyles(0.4);
  
  mathBefore.innerHTML = before ? '\\(' + toLatex(before) + '\\)' : '';
  mathAfter.innerHTML = after ? '\\(' + toLatex(after) + '\\)' : '';
  
  clearTimeout(state.renderTimer);
  
  state.renderTimer = setTimeout(() => {
    if (window.MathJax) {
      MathJax.typesetPromise([mathBefore, mathAfter])
        .then(() => {
          mathBefore.style.visibility = 'visible';
          mathAfter.style.visibility = 'visible';
          cursorEl.style.cssText = getCursorStyles(1);
        })
        .catch((err) => {
          console.warn('MathJax error:', err);
          mathBefore.style.visibility = 'visible';
          mathAfter.style.visibility = 'visible';
          cursorEl.style.cssText = getCursorStyles(1);
          mathBefore.textContent = before;
          mathAfter.textContent = after;
        });
    } else {
      mathBefore.style.visibility = 'visible';
      mathAfter.style.visibility = 'visible';
      cursorEl.style.cssText = getCursorStyles(1);
    }
  }, 50);
}

export function ensureCursorVisible() {
  if (dom.cursorEl) {
    dom.cursorEl.style.cssText = getCursorStyles(1);
  }
}

export function clearInput() {
  updateState('currentInput', '');
  updateState('cursorPosition', 0);
  renderDisplay();
  ensureCursorVisible();
}