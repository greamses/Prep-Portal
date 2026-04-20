import { BOARD_SIZE, OFFSETS, STATE_ENUM } from './config.js';
import { DOM, gameState, players, boardData } from './state.js';
import { drawBoard } from './render.js';
import { toggleDropdown, toggleFullscreen, injectDynamicUI, initColorDropdowns } from './ui.js';
import { setupDiceDrag, setupEventListeners, setupKeyboardListeners, setupDropdownListeners } from './input.js';
import { submitFractionAnswer } from './fractions.js';
import { generateRandomBoard } from './boardGenerator.js';
import { startTurn } from './engine.js';
import { squareCenter } from './utils.js';

export function resetGame() {
  players[0].name = "P1";
  players[1].name = gameState.vsCPU ? "CPU" : "P2";
  
  players.forEach((p, i) => {
    p.pos = 1;
    const c = squareCenter(1);
    p.drawX = c.x + OFFSETS[i].dx;
    p.drawY = c.y + OFFSETS[i].dy;
  });
  
  const diffDropdown = document.getElementById('dd-difficulty');
  let diffVal = 'standard';
  if (diffDropdown) {
    const selected = diffDropdown.querySelector('.selected');
    if (selected) diffVal = selected.dataset.value;
  }
  
  const newBoard = generateRandomBoard(diffVal);
  boardData.SNAKES = newBoard.snakes;
  boardData.SNAKE_COLORS = newBoard.snakeColors;
  boardData.LADDERS = newBoard.ladders;
  boardData.FRAC = newBoard.fractions;
  
  gameState.turn = 0;
  DOM.logOverlay.innerHTML = '';
  DOM.logOverlay.classList.remove('active');
  gameState.logActive = false;
  DOM.winOverlay.classList.remove('show');
  if (DOM.fracPopup) DOM.fracPopup.classList.remove('show');
  if (DOM.numpad) DOM.numpad.classList.remove('show');
  
  gameState.gameActive = true;
  gameState.state = STATE_ENUM.WAITING_ROLL;
  
  if (DOM.diceScene) {
    DOM.diceScene.style.left = '';
    DOM.diceScene.style.top = '';
    DOM.diceScene.style.right = '16px';
  }
  
  drawBoard();
  startTurn();
  if (DOM.gameFeedback) DOM.gameFeedback.textContent = 'Game reset! Drag dice or double-tap to roll.';
}

export function openGameModal() {
  DOM.gameModal = document.getElementById('game-modal');
  DOM.canvas = document.getElementById('boardCanvas');
  DOM.ctx = DOM.canvas.getContext('2d');
  DOM.canvas.width = BOARD_SIZE;
  DOM.canvas.height = BOARD_SIZE;
  
  DOM.gameFeedback = document.getElementById('game-feedback');
  DOM.turnHud = document.getElementById('turnHud');
  DOM.dtHint = document.getElementById('dtHint');
  DOM.fracPopup = document.getElementById('fracPopup');
  DOM.popupEq = document.getElementById('popupEq');
  DOM.winOverlay = document.getElementById('winOverlay');
  DOM.winName = document.getElementById('winName');
  DOM.cube = document.getElementById('cube');
  DOM.logOverlay = document.getElementById('logOverlay');
  DOM.modalTurn = document.getElementById('modal-turn');
  DOM.gameWrapper = document.getElementById('gameWrapper');
  DOM.diceScene = document.getElementById('diceScene');
  DOM.fullscreenBtn = document.getElementById('fullscreen-btn');
  DOM.fullscreenBtnEnter = document.getElementById('fullscreen-btn-enter');
  
  injectDynamicUI();
  
  gameState.gameActive = true;
  DOM.gameModal.classList.add('active');
  document.body.style.overflow = 'hidden';
  
  initColorDropdowns();
  resetGame();
  setupDiceDrag();
}

export function closeGameModal() {
  gameState.gameActive = false;
  if (document.fullscreenElement || document.webkitFullscreenElement) {
    if (document.exitFullscreen) document.exitFullscreen();
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
  }
  if (DOM.gameWrapper) DOM.gameWrapper.classList.remove('fullscreen-mode');
  if (DOM.fullscreenBtn) DOM.fullscreenBtn.style.display = 'none';
  if (DOM.fullscreenBtnEnter) DOM.fullscreenBtnEnter.style.display = 'inline-flex';
  
  DOM.gameModal.classList.remove('active');
  document.body.style.overflow = '';
  DOM.winOverlay.classList.remove('show');
  if (DOM.fracPopup) DOM.fracPopup.classList.remove('show');
  if (DOM.numpad) DOM.numpad.classList.remove('show');
}

// Attach all references required directly by innerHTML/inline global listeners
window.toggleDropdown = toggleDropdown;
window.openGameModal = openGameModal;
window.closeGameModal = closeGameModal;
window.resetGame = resetGame;
window.toggleFullscreen = toggleFullscreen;
window.submitFractionAnswer = submitFractionAnswer;
window.generateRandomBoard = generateRandomBoard;

document.addEventListener('DOMContentLoaded', () => {
  const track = document.getElementById('ticker-track');
  if (track) {
    const words = ['Snakes', 'Ladders', 'Fractions', 'Prep Portal', 'Drag Dice', 'Climb Up', 'Slide Down'];
    [...words, ...words].forEach(t => {
      const s = document.createElement('span');
      s.className = 'ticker-item';
      s.textContent = t;
      track.appendChild(s);
    });
  }
  
  DOM.canvas = document.getElementById('boardCanvas');
  if (DOM.canvas) {
    DOM.ctx = DOM.canvas.getContext('2d');
    DOM.canvas.width = BOARD_SIZE;
    DOM.canvas.height = BOARD_SIZE;
    setupEventListeners();
  }
  setupKeyboardListeners();
  setupDropdownListeners();
});