import { DOM, gameState, players } from './state.js';
import { STATE_ENUM, PLAYER_COLORS } from './config.js';
import { executeRoll, checkSquareLogic, checkFraction, snapToken } from './engine.js';
import { getCanvasPoint, getSquareFromPoint } from './utils.js';
import { drawBoard } from './render.js';
import { onNumpadClick, submitFractionAnswer } from './fractions.js';
import { addLog } from './ui.js';

export function setupDiceDrag() {
    if (gameState.diceSetupDone || !DOM.diceScene) return;
    
    DOM.diceScene.addEventListener('pointerdown', (e) => {
        if (!gameState.gameActive || gameState.state !== STATE_ENUM.WAITING_ROLL) return;
        
        const now = Date.now();
        if (now - gameState.lastTapTime < 400) {
            executeRoll();
            gameState.lastTapTime = 0;
            e.preventDefault();
            return;
        }
        gameState.lastTapTime = now;
        
        const rect = DOM.diceScene.getBoundingClientRect();
        gameState.diceDragState = { 
            isDragging: true, startX: e.clientX, startY: e.clientY, origX: e.clientX, origY: e.clientY
        };
        
        DOM.diceScene.classList.add('dragging');
        DOM.diceScene.style.right = 'auto';
        DOM.diceScene.style.left = (rect.left) + 'px';
        DOM.diceScene.style.top = (rect.top) + 'px';
        
        e.preventDefault();
    });
    
    window.addEventListener('pointermove', (e) => {
        if (!gameState.diceDragState.isDragging) return;
        const dx = e.clientX - gameState.diceDragState.startX;
        const dy = e.clientY - gameState.diceDragState.startY;
        const wrapperRect = DOM.gameWrapper.getBoundingClientRect();
        const currentLeft = parseFloat(DOM.diceScene.style.left);
        const currentTop = parseFloat(DOM.diceScene.style.top);
        
        DOM.diceScene.style.left = Math.max(0, Math.min(wrapperRect.width - 60, currentLeft + dx)) + 'px';
        DOM.diceScene.style.top = Math.max(0, Math.min(wrapperRect.height - 60, currentTop + dy)) + 'px';
        
        gameState.diceDragState.startX = e.clientX;
        gameState.diceDragState.startY = e.clientY;
    });
    
    window.addEventListener('pointerup', (e) => {
        if (!gameState.diceDragState.isDragging) return;
        DOM.diceScene.classList.remove('dragging');
        gameState.diceDragState.isDragging = false;

        const dist = Math.hypot(e.clientX - gameState.diceDragState.origX, e.clientY - gameState.diceDragState.origY);
        if (dist > 15 && gameState.state === STATE_ENUM.WAITING_ROLL) {
            executeRoll();
        }
    });

    gameState.diceSetupDone = true;
}

export function setupEventListeners() {
    DOM.canvas.addEventListener('pointerdown', e => {
        if (!gameState.gameActive) return;
        
        if (gameState.state === STATE_ENUM.WAITING_DRAG || gameState.state === STATE_ENUM.WAITING_DRAG_SNAKELADDER) {
            const pt = getCanvasPoint(e);
            const p = players[gameState.turn];
            if (Math.hypot(pt.x - p.drawX, pt.y - p.drawY) < 50) {
                gameState.dragState = { isDragging: true, pi: gameState.turn };
                if (e.preventDefault) e.preventDefault();
                drawBoard();
            }
        }
    });

    window.addEventListener('pointermove', e => {
        if (gameState.dragState.isDragging && gameState.gameActive) {
            const pt = getCanvasPoint(e);
            players[gameState.dragState.pi].drawX = pt.x;
            players[gameState.dragState.pi].drawY = pt.y;
            drawBoard();
        }
    });

    window.addEventListener('pointerup', e => {
        if (gameState.dragState.isDragging && gameState.gameActive) {
            const pi = gameState.dragState.pi;
            gameState.dragState = { isDragging: false, pi: -1 };
            
            const pt = getCanvasPoint(e);
            const dropSquare = getSquareFromPoint(pt.x, pt.y);
            
            if (dropSquare === gameState.expectedSquare) {
                const p = players[pi];
                p.pos = gameState.expectedSquare;
                snapToken(pi, p.pos);
                
                if (gameState.state === STATE_ENUM.WAITING_DRAG) checkSquareLogic(pi, p.pos);
                else if (gameState.state === STATE_ENUM.WAITING_DRAG_SNAKELADDER) checkFraction(pi, p.pos);
            } else {
                addLog(`Wrong square. Drop token on square ${gameState.expectedSquare}.`, 'error');
                if (DOM.gameFeedback) DOM.gameFeedback.textContent = `Wrong square! Drop on ${gameState.expectedSquare}.`;
                snapToken(pi, players[pi].pos);
            }
        }
    });
}

export function setupKeyboardListeners() {
    document.addEventListener('pointerdown', e => {
        if (e.target.classList.contains('frac-input')) {
            document.querySelectorAll('.frac-input').forEach(i => i.classList.remove('active-focus'));
            e.target.classList.add('active-focus');
            gameState.activeInput = e.target;
        }
    });

    window.addEventListener('keydown', e => {
        if (!DOM.fracPopup || !DOM.fracPopup.classList.contains('show')) return;
        if (!gameState.activeInput) return;
        
        if (e.key >= '0' && e.key <= '9') {
            e.preventDefault();
            onNumpadClick(e.key);
        } else if (e.key === 'Backspace') {
            e.preventDefault();
            gameState.activeInput.textContent = gameState.activeInput.textContent.slice(0, -1);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            submitFractionAnswer();
        } else if (e.key.toLowerCase() === 'c' || e.key === 'Escape') {
            e.preventDefault();
            onNumpadClick('C');
        } else if (e.key === 'Tab') {
            e.preventDefault();
            const inputs = Array.from(DOM.popupEq.querySelectorAll('.frac-input'));
            const idx = inputs.indexOf(gameState.activeInput);
            if (idx >= 0) {
                let nextIdx = e.shiftKey ? (idx - 1 + inputs.length) % inputs.length : (idx + 1) % inputs.length;
                inputs.forEach(i => i.classList.remove('active-focus'));
                gameState.activeInput = inputs[nextIdx];
                gameState.activeInput.classList.add('active-focus');
            }
        }
    });
}

export function setupDropdownListeners() {
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.pp-dropdown')) {
            document.querySelectorAll('.pp-dropdown.open').forEach(el => el.classList.remove('open'));
        }
    });

    document.addEventListener('click', (e) => {
        const item = e.target.closest('.pp-dropdown-item');
        if (!item) return;
        const dd = item.closest('.pp-dropdown');
        if (!dd) return;
        
        const value = item.dataset.value;
        const headerSpan = dd.querySelector('.dd-selected');
        
        dd.querySelectorAll('.pp-dropdown-item').forEach(i => i.classList.remove('selected'));
        item.classList.add('selected');
        
        if (dd.id === 'dd-opponent') {
            gameState.vsCPU = (value === 'cpu');
            headerSpan.textContent = item.textContent.trim();
        } else if (dd.id === 'dd-cpu-intel') {
            gameState.cpuIntel = value;
            headerSpan.textContent = item.textContent.trim();
        } else if (dd.id === 'dd-movement') {
            gameState.autoMove = (value === 'auto');
            headerSpan.textContent = item.textContent.trim();
        } else {
            const color = PLAYER_COLORS.find(c => c.value === value);
            if (color) {
                headerSpan.innerHTML = `
                    <span style="display: flex; align-items: center; gap: 8px;">
                        <span style="display: inline-block; width: 16px; height: 16px; border-radius: 50%; background: ${color.value}; border: 2px solid #1a1a1a;"></span>
                        ${color.name}
                    </span>
                `;
                if (dd.id === 'dd-p1-color') players[0].color = value;
                if (dd.id === 'dd-p2-color') players[1].color = value;
                if (gameState.gameActive) drawBoard();
            } else if (dd.id === 'dd-difficulty') {
                headerSpan.textContent = item.textContent.trim();
            }
        }
        
        dd.classList.remove('open');
    }, true);
}