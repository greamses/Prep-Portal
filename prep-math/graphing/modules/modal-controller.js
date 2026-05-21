import { state, updateState } from './state.js';
import { dom } from './dom-elements.js';
import { renderTabs, renderKeyboard } from './keyboard-handler.js';
import { renderDisplay, clearInput, ensureCursorVisible } from './math-display.js';
import { initGeoGebra, generateNewProblem } from './geogebra-controller.js';

export function openModal() {
  const { modalOverlay, mathDisplay } = dom;
  if (!modalOverlay) return;
  
  modalOverlay.classList.add('active');
  clearInput();
  
  renderTabs();
  renderKeyboard(state.activeTab);
  ensureCursorVisible();
  renderDisplay();
  
  setTimeout(() => {
    if (mathDisplay) {
      mathDisplay.focus();
      mathDisplay.setAttribute('tabindex', '0');
    }
  }, 100);
  
  // Generate initial equation based on current topic
  const currentTopic = state.currentTopic || 'Linear';
  let initialEquation;
  
  if (currentTopic === 'Quadratics') {
    initialEquation = 'f(x) = x^2';
  } else if (currentTopic === 'Trigonometry') {
    initialEquation = 'f(x) = sin(x)';
  } else {
    initialEquation = 'f(x) = 2x + 1';
  }
  
  updateState('currentTargetEquation', initialEquation);
  
  if (!state.ggbApplet) {
    initGeoGebra();
  } else {
    setTimeout(() => {
      if (state.ggbApplet) {
        state.ggbApplet.setSize(window.innerWidth, window.innerHeight - 200);
        state.ggbApplet.reset();
        state.ggbApplet.evalCommand(initialEquation);
        state.ggbApplet.setColor('f', 59, 130, 246);
        state.ggbApplet.setLineThickness('f', 3);
        state.ggbApplet.deleteObject('g');
        
        // Set appropriate coordinate system
        if (initialEquation.includes('^2')) {
          state.ggbApplet.setCoordSystem(-6, 6, -4, 10);
        } else if (initialEquation.includes('sin')) {
          state.ggbApplet.setCoordSystem(-Math.PI * 2, Math.PI * 2, -2, 2);
        } else {
          state.ggbApplet.setCoordSystem(-6, 6, -6, 6);
        }
      }
    }, 150);
  }
  
  if (dom.feedbackBox) {
    dom.feedbackBox.textContent = `Analyze the ${currentTopic.toLowerCase()} graph and start typing!`;
    dom.feedbackBox.className = 'gp-feedback-box';
  }
}

export function closeModal() {
  const { modalOverlay } = dom;
  if (modalOverlay) modalOverlay.classList.remove('active');
}

export function toggleKeyboard() {
  updateState('keyboardVisible', !state.keyboardVisible);
  if (dom.bottomSheet) {
    dom.bottomSheet.classList.toggle('keyboard-hidden', !state.keyboardVisible);
  }
}

export function initModalEvents() {
  const { openModalBtn, closeModalBtn, newProbBtn, toggleKbBtn } = dom;
  
  if (openModalBtn) openModalBtn.addEventListener('click', openModal);
  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
  if (newProbBtn) newProbBtn.addEventListener('click', generateNewProblem);
  if (toggleKbBtn) toggleKbBtn.addEventListener('click', toggleKeyboard);
}