import { initDOMElements, dom } from './modules/dom-elements.js';
import { state } from './modules/state.js';
import { renderTabs, renderKeyboard, initKeyboardEvents } from './modules/keyboard-handler.js';
import { renderDisplay } from './modules/math-display.js';
import { initModalEvents } from './modules/modal-controller.js';
import { populateDropdown, initDropdownEvents, setDefaultTopic } from './modules/dropdown-controller.js';
import { handleWindowResize } from './modules/geogebra-controller.js';

// Loading sequence
async function boot() {
  await document.fonts.ready;
  renderKeyboard('123');
  await new Promise(r => setTimeout(r, 700));
  
  const loadScreen = document.getElementById('gp-load-screen');
  if (loadScreen) {
    loadScreen.classList.add('fade-out');
    setTimeout(() => loadScreen.remove(), 500);
  }
}

// Math display focus handling
function initMathDisplayFocus() {
  const { mathDisplay, cursorEl } = dom;
  
  if (mathDisplay) {
    mathDisplay.setAttribute('tabindex', '0');
    
    mathDisplay.addEventListener('focus', () => {
      if (cursorEl) {
        cursorEl.style.visibility = 'visible';
        cursorEl.style.opacity = '1';
      }
    });
    
    mathDisplay.addEventListener('blur', () => {
      if (cursorEl) {
        cursorEl.style.visibility = 'visible';
        cursorEl.style.opacity = '0.5';
      }
    });
    
    mathDisplay.addEventListener('click', () => {
      mathDisplay.focus();
    });
  }
}

// Initialize app
function init() {
  initDOMElements();
  setDefaultTopic(); // Set the default topic first
  initMathDisplayFocus();
  initKeyboardEvents();
  initModalEvents();
  populateDropdown();
  initDropdownEvents();
  
  renderTabs();
  renderKeyboard('123');
  
  window.addEventListener('resize', handleWindowResize);
  
  boot();
}

// Start app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}