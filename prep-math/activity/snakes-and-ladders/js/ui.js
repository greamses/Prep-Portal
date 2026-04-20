import { DOM, gameState, players, PLAYER_COLORS } from './state.js';
import { onNumpadClick } from './fractions.js';
import { drawBoard } from './render.js';

export function addLog(msg, type = 'info') {
  if (!gameState.logActive) {
    gameState.logActive = true;
    DOM.logOverlay.classList.add('active');
  }
  const el = document.createElement('div');
  el.className = `snakes-log-entry ${type}`;
  el.textContent = msg;
  DOM.logOverlay.appendChild(el);
  DOM.logOverlay.scrollTop = DOM.logOverlay.scrollHeight;
}

export function updateHUD() {
  DOM.turnHud.textContent = `${players[gameState.turn].name}'S TURN`;
  DOM.turnHud.style.background = players[gameState.turn].color;
  if (DOM.modalTurn) DOM.modalTurn.textContent = `${players[gameState.turn].name}'s Turn`;
}

export function toggleFullscreen() {
  if (!DOM.gameWrapper) DOM.gameWrapper = document.getElementById('gameWrapper');
  if (!DOM.gameWrapper) return;
  
  if (!document.fullscreenElement && !document.webkitFullscreenElement &&
    !document.mozFullScreenElement && !document.msFullscreenElement) {
    
    if (DOM.gameWrapper.requestFullscreen) DOM.gameWrapper.requestFullscreen();
    else if (DOM.gameWrapper.webkitRequestFullscreen) DOM.gameWrapper.webkitRequestFullscreen();
    else if (DOM.gameWrapper.msRequestFullscreen) DOM.gameWrapper.msRequestFullscreen();
    
    DOM.gameWrapper.classList.add('fullscreen-mode');
    if (DOM.fullscreenBtn) DOM.fullscreenBtn.style.display = 'inline-flex';
    if (DOM.fullscreenBtnEnter) DOM.fullscreenBtnEnter.style.display = 'none';
  } else {
    if (document.exitFullscreen) document.exitFullscreen();
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    else if (document.msExitFullscreen) document.msExitFullscreen();
    
    DOM.gameWrapper.classList.remove('fullscreen-mode');
    if (DOM.fullscreenBtn) DOM.fullscreenBtn.style.display = 'none';
    if (DOM.fullscreenBtnEnter) DOM.fullscreenBtnEnter.style.display = 'inline-flex';
  }
}

export function updateFullscreenClass() {
  if (!DOM.gameWrapper) DOM.gameWrapper = document.getElementById('gameWrapper');
  if (!DOM.gameWrapper) return;
  
  const isFullscreen = document.fullscreenElement || document.webkitFullscreenElement ||
    document.mozFullScreenElement || document.msFullscreenElement;
  
  if (isFullscreen) {
    DOM.gameWrapper.classList.add('fullscreen-mode');
    if (DOM.fullscreenBtn) DOM.fullscreenBtn.style.display = 'inline-flex';
    if (DOM.fullscreenBtnEnter) DOM.fullscreenBtnEnter.style.display = 'none';
  } else {
    DOM.gameWrapper.classList.remove('fullscreen-mode');
    if (DOM.fullscreenBtn) DOM.fullscreenBtn.style.display = 'none';
    if (DOM.fullscreenBtnEnter) DOM.fullscreenBtnEnter.style.display = 'inline-flex';
  }
}

document.addEventListener('fullscreenchange', updateFullscreenClass);
document.addEventListener('webkitfullscreenchange', updateFullscreenClass);
document.addEventListener('mozfullscreenchange', updateFullscreenClass);
document.addEventListener('MSFullscreenChange', updateFullscreenClass);

export function toggleDropdown(id) {
  const dd = document.getElementById(id);
  if (!dd) return;
  const isOpen = dd.classList.contains('open');
  document.querySelectorAll('.pp-dropdown.open').forEach(el => el.classList.remove('open'));
  if (!isOpen) dd.classList.add('open');
}

export function initColorDropdowns() {
  const p1Dropdown = document.getElementById('dd-p1-color');
  const p2Dropdown = document.getElementById('dd-p2-color');
  
  if (p1Dropdown) {
    const list = p1Dropdown.querySelector('.pp-dropdown-list');
    list.innerHTML = '';
    PLAYER_COLORS.forEach(color => {
      const item = document.createElement('div');
      item.className = 'pp-dropdown-item' + (color.value === players[0].color ? ' selected' : '');
      item.dataset.value = color.value;
      item.innerHTML = `<span style="display: flex; align-items: center; gap: 8px;"><span style="display: inline-block; width: 16px; height: 16px; border-radius: 50%; background: ${color.value}; border: 2px solid #1a1a1a;"></span>${color.name}</span>`;
      list.appendChild(item);
    });
    p1Dropdown.querySelector('.dd-selected').innerHTML = `<span style="display: flex; align-items: center; gap: 8px;"><span style="display: inline-block; width: 16px; height: 16px; border-radius: 50%; background: ${players[0].color}; border: 2px solid #1a1a1a;"></span>${PLAYER_COLORS.find(c => c.value === players[0].color)?.name || 'Blue'}</span>`;
  }
  
  if (p2Dropdown) {
    const list = p2Dropdown.querySelector('.pp-dropdown-list');
    list.innerHTML = '';
    PLAYER_COLORS.forEach(color => {
      const item = document.createElement('div');
      item.className = 'pp-dropdown-item' + (color.value === players[1].color ? ' selected' : '');
      item.dataset.value = color.value;
      item.innerHTML = `<span style="display: flex; align-items: center; gap: 8px;"><span style="display: inline-block; width: 16px; height: 16px; border-radius: 50%; background: ${color.value}; border: 2px solid #1a1a1a;"></span>${color.name}</span>`;
      list.appendChild(item);
    });
    p2Dropdown.querySelector('.dd-selected').innerHTML = `<span style="display: flex; align-items: center; gap: 8px;"><span style="display: inline-block; width: 16px; height: 16px; border-radius: 50%; background: ${players[1].color}; border: 2px solid #1a1a1a;"></span>${PLAYER_COLORS.find(c => c.value === players[1].color)?.name || 'Red'}</span>`;
  }
}

export function injectDynamicUI() {
  if (!document.getElementById('snakes-numpad')) {
    DOM.numpad = document.createElement('div');
    DOM.numpad.id = 'snakes-numpad';
    DOM.numpad.className = 'snakes-numpad';
    DOM.numpad.innerHTML = `
            <div class="np-header">::: DRAG :::</div>
            <div class="np-grid">
                <button data-key="1">1</button><button data-key="2">2</button><button data-key="3">3</button>
                <button data-key="4">4</button><button data-key="5">5</button><button data-key="6">6</button>
                <button data-key="7">7</button><button data-key="8">8</button><button data-key="9">9</button>
                <button data-key="C" class="np-util">C</button><button data-key="0">0</button><button data-key="OK" class="np-ok">OK</button>
            </div>
        `;
    document.body.appendChild(DOM.numpad);
    setupNumpadDrag();
  } else {
    DOM.numpad = document.getElementById('snakes-numpad');
  }
  
  if (!document.getElementById('lucky-card-overlay')) {
    DOM.luckyCardOverlay = document.createElement('div');
    DOM.luckyCardOverlay.id = 'lucky-card-overlay';
    DOM.luckyCardOverlay.className = 'snakes-lucky-overlay';
    DOM.luckyCardOverlay.innerHTML = `
            <div class="lc-box">
                <div class="lc-icon">🎟️</div>
                <h3 id="lc-title">Lucky Strike!</h3>
                <p id="lc-desc">Move forward 2 spaces.</p>
                <div class="lc-actions" style="margin-top: 24px; display: flex; gap: 12px; justify-content: center;">
                    <button class="btn-check-frac" id="btn-use-card" style="margin-top: 0;">USE</button>
                    <button class="btn-secondary" id="btn-discard-card">DISCARD</button>
                </div>
            </div>
        `;
    document.body.appendChild(DOM.luckyCardOverlay);
  } else {
    DOM.luckyCardOverlay = document.getElementById('lucky-card-overlay');
  }
  
  if (!document.getElementById('bonus-card-overlay')) {
    DOM.bonusCardOverlay = document.createElement('div');
    DOM.bonusCardOverlay.id = 'bonus-card-overlay';
    DOM.bonusCardOverlay.className = 'snakes-lucky-overlay';
    DOM.bonusCardOverlay.innerHTML = `
            <div class="lc-box" style="max-width: 400px;">
                <h3 style="color: #ff2200;">BONUS EARNED!</h3>
                <p style="font-size: 13px;">You reduced to lowest terms! Pick 1 Wish Card.</p>
                <div class="bc-cards" id="bc-cards-container"></div>
                <div class="lc-actions" id="bc-actions" style="margin-top: 16px; display: none; gap: 12px; justify-content: center;">
                    <button class="btn-check-frac" id="btn-use-bonus" style="margin-top: 0;">USE REVEALED</button>
                    <button class="btn-secondary" id="btn-discard-bonus">DISCARD</button>
                </div>
            </div>
        `;
    document.body.appendChild(DOM.bonusCardOverlay);
  } else {
    DOM.bonusCardOverlay = document.getElementById('bonus-card-overlay');
  }
}

export function setupNumpadDrag() {
  const header = DOM.numpad.querySelector('.np-header');
  
  header.addEventListener('pointerdown', (e) => {
    gameState.numpadDragState.isDragging = true;
    const rect = DOM.numpad.getBoundingClientRect();
    gameState.numpadDragState.startX = e.clientX - rect.left;
    gameState.numpadDragState.startY = e.clientY - rect.top;
    e.preventDefault();
  });
  
  window.addEventListener('pointermove', (e) => {
    if (!gameState.numpadDragState.isDragging) return;
    DOM.numpad.style.left = (e.clientX - gameState.numpadDragState.startX) + 'px';
    DOM.numpad.style.top = (e.clientY - gameState.numpadDragState.startY) + 'px';
    DOM.numpad.style.right = 'auto';
    DOM.numpad.style.bottom = 'auto';
  });
  
  window.addEventListener('pointerup', () => {
    gameState.numpadDragState.isDragging = false;
  });
  
  DOM.numpad.addEventListener('pointerdown', e => {
    if (e.target.tagName === 'BUTTON') {
      e.preventDefault();
      onNumpadClick(e.target.dataset.key);
    }
  });
}