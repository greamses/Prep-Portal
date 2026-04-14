// modules/canvas-manager.js

import { showStatus, ppAlert } from './ui-controller.js';
import { updateState } from './state-manager.js';

const canvasFullscreenSettings = {
  auto_resize_on_scroll: false,
  use_toolbar: true,
  undo_btn: true,
  redo_btn: true,
  new_sheet_btn: false,
  font_size_btns: true,
  formula_btn: true,
  help_btn: false,
  help_logo_btn: false,
  fullscreen_toolbar_btn: false,
  fullscreen_btn: false,
  transform_btn: false,
  keypad_btn: false,
  scrub_btn: false,
  draw_btn: false,
  erase_btn: false,
  arrange_btn: false,
  reset_btn: true,
  save_btn: false,
  load_btn: false,
  settings_btn: true,
  insert_btn: true,
  insert_menu_items: { derivation: true, function: true, textbox: true },
  use_hold_menu: false,
  display_labels: false,
  btn_size: 'xs',
  ask_confirmation_on_closing: false,
  vertical_scroll: true,
};

const singleLineDerivationSettings = {
  h_align: 'center',
  pos: { x: 'center', y: 'center' },
  keep_in_container: false,
  draggable: true,
  no_handles: false,
  collapsed_mode: false,
  show_bg: false,
};

function getResponsiveFontSettings() {
  const isSmallScreen = window.innerWidth <= 768;
  const isTablet = window.innerWidth <= 1024 && window.innerWidth > 768;
  return {
    mayAdjustCanvasHeight: true,
    minCanvasHeight: isSmallScreen ? 200 : (isTablet ? 250 : 300),
    mayAdjustFontSize: true,
    maxFontSize: isSmallScreen ? 28 : (isTablet ? 36 : 50),
    verticallyCenterDerivations: true,
    shouldFitVertically: true,
  };
}

function handleSuccess(appState, updateStateCallback) {
  const wrap = document.getElementById('fs-canvas-wrap');
  if (wrap) wrap.classList.add('solved');
  
  const newCount = appState.solvedCount + 1;
  updateStateCallback({ solvedCount: newCount });
  
  setTimeout(() => {
    if (wrap) wrap.classList.remove('solved');
    ppAlert(`That's ${newCount} solved. Keep going!`, 'success');
  }, 900);
}

export function openOverlay(data, appState, updateStateCallback) {
  const overlay = document.getElementById('fs-overlay');
  const hintEl = document.getElementById('fs-hint-text');
  const wpBtn = document.getElementById('wp-modal-btn');
  const wpText = document.getElementById('wp-modal-text');
  const canvasEl = document.getElementById('gm-fs-canvas');
  
  if (overlay) {
    overlay.classList.add('open');
    overlay.style.pointerEvents = 'auto';
  }
  
  closeWordProblemModal();
  restoreCanvas();
  if (canvasEl) canvasEl.innerHTML = '';
  
  const responsiveSettings = getResponsiveFontSettings();
  
  if (data.type === 'word') {
    if (wpText) wpText.textContent = data.problem;
    if (hintEl) hintEl.innerText = data.hint;
    if (wpBtn) wpBtn.style.display = 'inline-flex';
    appState.currentGoal = null;
    
    openWordProblemModal();
    
    if (typeof gmath !== 'undefined') {
      appState.gmCanvas = new gmath.Canvas('#gm-fs-canvas', canvasFullscreenSettings);
      if (responsiveSettings.mayAdjustFontSize && appState.gmCanvas.controller) {
        appState.gmCanvas.controller.set_font_size(Math.min(40, responsiveSettings.maxFontSize));
      }
    }
  } else {
    if (wpBtn) wpBtn.style.display = 'none';
    if (hintEl) hintEl.innerText = data.hint;
    appState.currentGoal = data.goal.replace(/\s/g, '');
    
    if (typeof gmath !== 'undefined') {
      appState.gmCanvas = new gmath.Canvas('#gm-fs-canvas', canvasFullscreenSettings);
      if (responsiveSettings.mayAdjustFontSize && appState.gmCanvas.controller) {
        appState.gmCanvas.controller.set_font_size(Math.min(40, responsiveSettings.maxFontSize));
      }
      
      const derivation = appState.gmCanvas.model.createElement('derivation', {
        eq: data.eq,
        ...singleLineDerivationSettings
      });
      
      derivation.events.on('change', () => {
        const currentASCII = derivation.getLastModel().to_ascii().replace(/\s/g, '');
        if (currentASCII === appState.currentGoal) {
          handleSuccess(appState, updateStateCallback);
        }
      });
      
      setTimeout(() => {
        if (appState.gmCanvas?.view) appState.gmCanvas.view.update();
      }, 100);
    }
  }
}

export function closeOverlay() {
  const overlay = document.getElementById('fs-overlay');
  if (overlay) {
    overlay.classList.remove('open');
    overlay.style.pointerEvents = 'none';
  }
  closeWordProblemModal();
  restoreCanvas();
}

export function toggleCanvas() {
  const wrap = document.getElementById('fs-canvas-wrap');
  const btn = document.getElementById('fs-canvas-toggle-btn');
  if (!wrap) return;
  const isHiding = !wrap.classList.contains('canvas-hidden');
  wrap.classList.toggle('canvas-hidden', isHiding);
  if (btn) {
    btn.classList.toggle('canvas-off', isHiding);
    btn.title = isHiding ? 'Show canvas' : 'Hide canvas';
  }
}

function restoreCanvas() {
  const wrap = document.getElementById('fs-canvas-wrap');
  const btn = document.getElementById('fs-canvas-toggle-btn');
  if (!wrap) return;
  wrap.classList.remove('canvas-hidden');
  if (btn) {
    btn.classList.remove('canvas-off');
    btn.title = 'Hide canvas';
  }
}

export function openWordProblemModal() {
  const modal = document.getElementById('wp-modal');
  const card = document.getElementById('wp-modal-card');
  const minBtn = document.getElementById('wp-minimize-btn');
  if (card) card.classList.remove('minimized');
  if (minBtn) minBtn.classList.remove('is-minimized');
  if (modal) modal.classList.add('open');
}

export function closeWordProblemModal() {
  const modal = document.getElementById('wp-modal');
  const card = document.getElementById('wp-modal-card');
  const minBtn = document.getElementById('wp-minimize-btn');
  if (modal) modal.classList.remove('open');
  if (card) card.classList.remove('minimized');
  if (minBtn) minBtn.classList.remove('is-minimized');
}

export function minimizeWordProblemModal() {
  const card = document.getElementById('wp-modal-card');
  const minBtn = document.getElementById('wp-minimize-btn');
  if (!card) return;
  const isMin = card.classList.toggle('minimized');
  if (minBtn) minBtn.classList.toggle('is-minimized', isMin);
}

export function toggleWordProblemModal() {
  const modal = document.getElementById('wp-modal');
  if (modal && modal.classList.contains('open')) {
    closeWordProblemModal();
  } else {
    openWordProblemModal();
  }
}

export function markSolvedFromModal(appState, updateStateCallback) {
  closeWordProblemModal();
  handleSuccess(appState, updateStateCallback);
}