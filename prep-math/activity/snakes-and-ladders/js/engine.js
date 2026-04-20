import { STATE_ENUM, OFFSETS } from './config.js';
import { DOM, gameState, players, boardData } from './state.js';
import { addLog, updateHUD } from './ui.js';
import { drawBoard } from './render.js';
import { squareCenter } from './utils.js';
import { showFracQuestion } from './fractions.js';

export function startTurn() {
    updateHUD();
    
    if (gameState.vsCPU && gameState.turn === 1) {
        gameState.state = STATE_ENUM.CPU_THINKING;
        addLog(`${players[1].name} is thinking...`, 'info');
        if (DOM.gameFeedback) DOM.gameFeedback.textContent = `${players[1].name} is taking their turn...`;
        setTimeout(executeRoll, 1200);
    } else {
        gameState.state = STATE_ENUM.WAITING_ROLL;
        addLog(`${players[gameState.turn].name}'s turn. Drag dice or double-tap to roll.`, 'info');
        DOM.dtHint.classList.add('show');
        setTimeout(() => DOM.dtHint.classList.remove('show'), 2000);
        if (DOM.gameFeedback) DOM.gameFeedback.textContent = `${players[gameState.turn].name}'s turn. Drag dice or double-tap to roll!`;
    }
}

export function roll3DDice(result) {
    const rot = {
        1: { x: 0, y: 0 }, 2: { x: -90, y: 0 }, 3: { x: 0, y: -90 },
        4: { x: 0, y: 90 }, 5: { x: 90, y: 0 }, 6: { x: 0, y: 180 }
    };
    const spinsX = (Math.floor(Math.random() * 2) + 2) * 360;
    const spinsY = (Math.floor(Math.random() * 2) + 2) * 360;
    DOM.cube.style.transform = `translateZ(-30px) rotateX(${rot[result].x + spinsX}deg) rotateY(${rot[result].y + spinsY}deg)`;
}

export function executeRoll() {
    if ((gameState.state !== STATE_ENUM.WAITING_ROLL && gameState.state !== STATE_ENUM.CPU_THINKING) || !gameState.gameActive) return;
    
    gameState.state = STATE_ENUM.ROLLING;
    gameState.currentRoll = Math.floor(Math.random() * 6) + 1;
    roll3DDice(gameState.currentRoll);
    
    setTimeout(() => {
        if (!gameState.gameActive) return;
        let target = players[gameState.turn].pos + gameState.currentRoll;
        
        if (target > 64) {
            addLog(`${players[gameState.turn].name} rolled a ${gameState.currentRoll} but cannot move.`, 'error');
            if (DOM.gameFeedback) DOM.gameFeedback.textContent = `Rolled ${gameState.currentRoll} but need exactly ${64 - players[gameState.turn].pos} to win! Turn skipped.`;
            endTurn();
            return;
        }
        
        if (gameState.vsCPU && gameState.turn === 1) {
            addLog(`${players[1].name} rolled a ${gameState.currentRoll}!`, 'action');
            animateCPUToken(1, players[1].pos, target, () => {
                players[1].pos = target;
                checkSquareLogic(1, target);
            });
        } else {
            if (gameState.autoMove) {
                addLog(`${players[gameState.turn].name} rolled a ${gameState.currentRoll}! Token moving automatically.`, 'action');
                if (DOM.gameFeedback) DOM.gameFeedback.textContent = `Rolled ${gameState.currentRoll}! Auto-moving to ${target}...`;
                animateCPUToken(gameState.turn, players[gameState.turn].pos, target, () => {
                    players[gameState.turn].pos = target;
                    checkSquareLogic(gameState.turn, target);
                });
            } else {
                gameState.expectedSquare = target;
                gameState.state = STATE_ENUM.WAITING_DRAG;
                addLog(`${players[gameState.turn].name} rolled a ${gameState.currentRoll}! Drag token to square ${target}.`, 'action');
                if (DOM.gameFeedback) DOM.gameFeedback.textContent = `Rolled ${gameState.currentRoll}! Drag token to square ${target}.`;
            }
        }
    }, 600);
}

export function snapToken(pi, targetSq) {
    const c = squareCenter(targetSq);
    players[pi].drawX = c.x + OFFSETS[pi].dx;
    players[pi].drawY = c.y + OFFSETS[pi].dy;
    drawBoard();
}

export function animateCPUToken(pi, startSq, targetSq, callback) {
    const start = squareCenter(startSq);
    const end = squareCenter(targetSq);
    const p = players[pi];
    let startX = start.x + OFFSETS[pi].dx;
    let startY = start.y + OFFSETS[pi].dy;
    let endX = end.x + OFFSETS[pi].dx;
    let endY = end.y + OFFSETS[pi].dy;

    let startTime = null;
    const duration = 600;

    function step(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        p.drawX = startX + (endX - startX) * ease;
        p.drawY = startY + (endY - startY) * ease;
        drawBoard();

        if (progress < 1) requestAnimationFrame(step);
        else callback();
    }
    requestAnimationFrame(step);
}

export function checkSquareLogic(pi, sq) {
    if (sq in boardData.SNAKES) {
        let tail = boardData.SNAKES[sq];
        if ((gameState.vsCPU && pi === 1) || gameState.autoMove) {
            addLog(`OH NO! A snake!`, 'snake');
            setTimeout(() => {
                animateCPUToken(pi, sq, tail, () => {
                    players[pi].pos = tail;
                    checkFraction(pi, tail);
                });
            }, 700);
        } else {
            gameState.expectedSquare = tail;
            gameState.state = STATE_ENUM.WAITING_DRAG_SNAKELADDER;
            addLog(`OH NO! A snake! Drag down to square ${gameState.expectedSquare}.`, 'snake');
            if (DOM.gameFeedback) DOM.gameFeedback.textContent = `Snake! Drag down to ${gameState.expectedSquare}.`;
        }
    } else if (sq in boardData.LADDERS) {
        let top = boardData.LADDERS[sq];
        if ((gameState.vsCPU && pi === 1) || gameState.autoMove) {
            addLog(`YAY! A ladder!`, 'ladder');
            setTimeout(() => {
                animateCPUToken(pi, sq, top, () => {
                    players[pi].pos = top;
                    checkFraction(pi, top);
                });
            }, 700);
        } else {
            gameState.expectedSquare = top;
            gameState.state = STATE_ENUM.WAITING_DRAG_SNAKELADDER;
            addLog(`YAY! A ladder! Drag up to square ${gameState.expectedSquare}.`, 'ladder');
            if (DOM.gameFeedback) DOM.gameFeedback.textContent = `Ladder! Drag up to ${gameState.expectedSquare}.`;
        }
    } else if (sq === 64) {
        triggerWin(pi);
    } else {
        checkFraction(pi, sq);
    }
}

export function checkFraction(pi, sq) {
    const f = boardData.FRAC[sq];
    if (f && f.d !== 'W') {
        showFracQuestion(f, pi);
    } else {
        if (sq === 64) triggerWin(pi);
        else endTurn();
    }
}

export function endTurn() {
    gameState.turn = 1 - gameState.turn;
    startTurn();
}

export function triggerWin(pi, reason = null) {
    gameState.state = STATE_ENUM.GAME_OVER;
    gameState.gameActive = false;
    const p = players[pi];
    addLog(`${p.name} WON THE GAME!`, 'action');
    DOM.winName.textContent = `${p.name} WINS!`;
    const subText = document.getElementById('winSub');
    if (subText) subText.textContent = reason || "Reached square 64 first!";
    setTimeout(() => DOM.winOverlay.classList.add('show'), 800);
}