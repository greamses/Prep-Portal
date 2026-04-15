// DOM Elements Cache
export const dom = {
  loadScreen: null,
  modalOverlay: null,
  openModalBtn: null,
  closeModalBtn: null,
  newProbBtn: null,
  toggleKbBtn: null,
  bottomSheet: null,
  mathPlaceholder: null,
  mathBefore: null,
  mathAfter: null,
  cursorEl: null,
  feedbackBox: null,
  dropdownHeader: null,
  dropdownList: null,
  dropdownContainer: null,
  selectedText: null,
  virtualKeyboard: null,
  keyboardTabs: null,
  statSolved: null,
  statTopic: null,
  mathDisplay: null
};

export function initDOMElements() {
  dom.loadScreen = document.getElementById('gp-load-screen');
  dom.modalOverlay = document.getElementById('gp-graph-modal');
  dom.openModalBtn = document.getElementById('gp-open-modal-btn');
  dom.closeModalBtn = document.getElementById('gp-close-modal-btn');
  dom.newProbBtn = document.getElementById('gp-new-prob-btn');
  dom.toggleKbBtn = document.getElementById('gp-toggle-keyboard-btn');
  dom.bottomSheet = document.getElementById('gp-bottom-sheet');
  dom.mathPlaceholder = document.getElementById('gp-math-placeholder');
  dom.mathBefore = document.getElementById('gp-math-before');
  dom.mathAfter = document.getElementById('gp-math-after');
  dom.cursorEl = document.getElementById('gp-cursor');
  dom.feedbackBox = document.getElementById('gp-feedback-box');
  dom.dropdownHeader = document.getElementById('gp-dropdown-header');
  dom.dropdownList = document.getElementById('gp-dropdown-list');
  dom.dropdownContainer = document.getElementById('gp-topic-dropdown');
  dom.selectedText = document.getElementById('gp-dropdown-selected-text');
  dom.virtualKeyboard = document.getElementById('gp-virtual-keyboard');
  dom.keyboardTabs = document.getElementById('gp-keyboard-tabs');
  dom.statSolved = document.getElementById('gp-stat-solved');
  dom.statTopic = document.getElementById('gp-stat-topic');
  dom.mathDisplay = document.querySelector('.gp-math-display');
}