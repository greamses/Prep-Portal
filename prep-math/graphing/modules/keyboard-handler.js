import { state, updateState } from './state.js';
import { dom } from './dom-elements.js';
import { layouts, norm, getKeyClass } from './keyboard-layouts.js';
import { VALUE_MAP, TAB_ORDER } from './constants.js';
import { escAttr } from './utils.js';
import { renderDisplay } from './math-display.js';
import { submitEquation, liveUpdateGraph, clearSubmissionFeedback } from './equation-validator.js';

let switchTabCallback = null;

export function setSwitchTabCallback(callback) {
  switchTabCallback = callback;
}

export function renderTabs() {
  const { keyboardTabs } = dom;
  if (!keyboardTabs) return;
  
  keyboardTabs.innerHTML = TAB_ORDER.map(t =>
    `<button class="gp-tab${t === state.activeTab ? ' active' : ''}" data-tab="${t}">${t}</button>`
  ).join('');
  
  keyboardTabs.querySelectorAll('.gp-tab').forEach(btn =>
    btn.addEventListener('click', () => {
      const tabId = btn.dataset.tab;
      updateState('activeTab', tabId);
      renderTabs();
      renderKeyboard(tabId);
    })
  );
}

export function renderKeyboard(layoutKey) {
  const { virtualKeyboard } = dom;
  if (!virtualKeyboard) return;
  
  const rows = layouts[layoutKey] || layouts['123'];
  let html = '';
  
  rows.forEach(row => {
    html += '<div class="gp-key-row">';
    row.forEach(rawKey => {
      const { val, display, cls } = norm(rawKey);
      const extraCls = getKeyClass(val, cls);
      html += `<button class="gp-key${extraCls ? ' ' + extraCls : ''}" data-val="${escAttr(val)}">${display}</button>`;
    });
    html += '</div>';
  });
  
  virtualKeyboard.innerHTML = html;
}

export function handleKey(val) {
  // Clear any submission feedback when user starts typing
  clearSubmissionFeedback();
  
  if (val === 'DEL') {
    if (state.cursorPosition > 0) {
      const newInput = state.currentInput.slice(0, state.cursorPosition - 1) +
        state.currentInput.slice(state.cursorPosition);
      updateState('currentInput', newInput);
      updateState('cursorPosition', state.cursorPosition - 1);
    }
  } else if (val === '↵') {
    submitEquation();
    return;
  } else if (val === '←') {
    if (state.cursorPosition > 0) {
      updateState('cursorPosition', state.cursorPosition - 1);
    }
  } else if (val === '→') {
    if (state.cursorPosition < state.currentInput.length) {
      updateState('cursorPosition', state.cursorPosition + 1);
    }
  } else if (val === '⇧') {
    if (state.activeTab === 'abc') {
      updateState('abcCaps', !state.abcCaps);
      renderKeyboard('abc');
    }
  } else if (val === '⇧_abc') {
    updateState('activeTab', '#&¬');
    renderTabs();
    renderKeyboard('#&¬');
    return;
  } else if (val === '⇧_grk') {
    updateState('activeTab', 'abc');
    renderTabs();
    renderKeyboard('abc');
    return;
  } else {
    let insert = VALUE_MAP[val] !== undefined ? VALUE_MAP[val] : val;
    if (state.activeTab === 'abc' && state.abcCaps && insert.length === 1) {
      insert = insert.toUpperCase();
    }
    const newInput = state.currentInput.slice(0, state.cursorPosition) + insert +
      state.currentInput.slice(state.cursorPosition);
    updateState('currentInput', newInput);
    updateState('cursorPosition', state.cursorPosition + insert.length);
  }
  
  renderDisplay();
  liveUpdateGraph(); // Add live update on every key press
}

export function initKeyboardEvents() {
  const { virtualKeyboard } = dom;
  if (virtualKeyboard) {
    virtualKeyboard.addEventListener('click', e => {
      const btn = e.target.closest('.gp-key');
      if (!btn) return;
      handleKey(btn.dataset.val);
    });
  }
  
  document.addEventListener('keydown', e => {
    const { modalOverlay } = dom;
    if (!modalOverlay || !modalOverlay.classList.contains('active')) return;
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      if (state.cursorPosition > 0) {
        updateState('cursorPosition', state.cursorPosition - 1);
        renderDisplay();
      }
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      if (state.cursorPosition < state.currentInput.length) {
        updateState('cursorPosition', state.cursorPosition + 1);
        renderDisplay();
      }
    } else if (e.key === 'Backspace') {
      e.preventDefault();
      clearSubmissionFeedback(); // Clear feedback when deleting
      if (state.cursorPosition > 0) {
        const newInput = state.currentInput.slice(0, state.cursorPosition - 1) +
          state.currentInput.slice(state.cursorPosition);
        updateState('currentInput', newInput);
        updateState('cursorPosition', state.cursorPosition - 1);
        renderDisplay();
        liveUpdateGraph();
      }
    } else if (e.key === 'Delete') {
      e.preventDefault();
      clearSubmissionFeedback(); // Clear feedback when deleting
      if (state.cursorPosition < state.currentInput.length) {
        const newInput = state.currentInput.slice(0, state.cursorPosition) +
          state.currentInput.slice(state.cursorPosition + 1);
        updateState('currentInput', newInput);
        renderDisplay();
        liveUpdateGraph();
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      submitEquation();
    } else if (e.key === 'Escape') {
      closeModal();
    } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      clearSubmissionFeedback(); // Clear feedback when typing
      const newInput = state.currentInput.slice(0, state.cursorPosition) + e.key +
        state.currentInput.slice(state.cursorPosition);
      updateState('currentInput', newInput);
      updateState('cursorPosition', state.cursorPosition + 1);
      renderDisplay();
      liveUpdateGraph();
    }
  });
}