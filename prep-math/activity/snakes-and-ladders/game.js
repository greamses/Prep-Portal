// game.js - Snakes N' Ladders Game Logic

// =====================================================================
// BOARD & DATA CONSTANTS (Flexible via Generator)
// =====================================================================
const BOARD_SIZE = 1024;
const CELL = BOARD_SIZE / 8;

let canvas, ctx;
let gameModal, gameFeedback, turnHud, dtHint, fracPopup, popupEq, winOverlay, winName, cube, logOverlay, modalTurn;
let gameWrapper, diceScene, fullscreenBtn, fullscreenBtnEnter;
let numpad, luckyCardOverlay, bonusCardOverlay;

// These defaults will be overwritten by `boardGenerator.js` on Game Start
let FRAC = {};
let SNAKES = {};
let SNAKE_COLORS = {};
let LADDERS = {};

const PLAYER_COLORS =[
    { name: 'Blue', value: '#0055ff' },
    { name: 'Red', value: '#ff2200' },
    { name: 'Green', value: '#00a550' },
    { name: 'Purple', value: '#9b59b6' },
    { name: 'Orange', value: '#e67e22' },
    { name: 'Pink', value: '#e84393' }
];

// STANDARD cards from normal conversion
const STANDARD_CARDS =[
    { title: "Lucky Strike", desc: "Move forward 2 spaces.", type: 'self', amount: 2, action: (pi) => applyCardMove(pi, 2) },
    { title: "Minor Boost", desc: "Move forward 3 spaces.", type: 'self', amount: 3, action: (pi) => applyCardMove(pi, 3) },
    { title: "Sabotage", desc: "Opponent moves back 2 spaces.", type: 'opponent', amount: -2, action: (pi) => applyCardMove(1 - pi, -2) },
    { title: "Tripwire", desc: "Opponent moves back 3 spaces.", type: 'opponent', amount: -3, action: (pi) => applyCardMove(1 - pi, -3) }
];

// BONUS Pool for reducing to lowest terms
const BONUS_HUGE_WINS =[
    { title: "MEGA BOOST!", desc: "Move forward 8 spaces.", type: 'self', amount: 8, action: (pi) => applyCardMove(pi, 8) },
    { title: "SUPER LEAP!", desc: "Move forward 6 spaces.", type: 'self', amount: 6, action: (pi) => applyCardMove(pi, 6) }
];
const BONUS_SMALL_WINS =[
    { title: "Tiny Step", desc: "Move forward 1 space.", type: 'self', amount: 1, action: (pi) => applyCardMove(pi, 1) },
    { title: "Small Jump", desc: "Move forward 2 spaces.", type: 'self', amount: 2, action: (pi) => applyCardMove(pi, 2) },
    { title: "Minor Snag", desc: "Opponent moves back 1.", type: 'opponent', amount: -1, action: (pi) => applyCardMove(1 - pi, -1) }
];

// =====================================================================
// GAME STATE
// =====================================================================
const STATE = {
    WAITING_ROLL: 0,
    ROLLING: 1,
    WAITING_DRAG: 2,
    WAITING_DRAG_SNAKELADDER: 3,
    WAITING_FRAC_ANSWER: 4,
    CPU_THINKING: 5,
    GAME_OVER: 6
};

const offsets =[{ dx: -22, dy: -18 }, { dx: 22, dy: 18 }];

const players =[
    { pos: 1, color: '#0055ff', name: 'P1', drawX: 0, drawY: 0 },
    { pos: 1, color: '#ff2200', name: 'P2', drawX: 0, drawY: 0 }
];

let vsCPU = false;
let cpuIntel = 'advanced'; // 'basic' or 'advanced'
let autoMove = false;
let turn = 0;
let gameState = STATE.WAITING_ROLL;
let expectedSquare = null;
let currentRoll = 0;
let logActive = false;
let dragState = { isDragging: false, pi: -1 };
let diceDragState = { isDragging: false, startX: 0, startY: 0, origX: 0, origY: 0 };
let numpadDragState = { isDragging: false, startX: 0, startY: 0 };
let activeInput = null;
let lastTapTime = 0;
let gameActive = false;
let diceSetupDone = false;

let currentFracPlayer = 0;
let currentFracAttempts = 0;
let currentFracData = null;
let isProcessingAnswer = false;

// =====================================================================
// COORDINATE HELPERS
// =====================================================================
function squareXY(sq) {
    const idx = sq - 1;
    const boardRow = Math.floor(idx / 8);
    const colIdx = idx % 8;
    const boardCol = (boardRow % 2 === 0) ? colIdx : (7 - colIdx);
    const canvasRow = 7 - boardRow;
    return { x: boardCol * CELL, y: canvasRow * CELL };
}

function squareCenter(sq) {
    const { x, y } = squareXY(sq);
    return { x: x + CELL / 2, y: y + CELL / 2 };
}

function getCanvasPoint(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    let clientX = e.clientX;
    let clientY = e.clientY;
    if (e.touches && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    } else if (e.changedTouches && e.changedTouches.length > 0) {
        clientX = e.changedTouches[0].clientX;
        clientY = e.changedTouches[0].clientY;
    }
    return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY
    };
}

function getSquareFromPoint(x, y) {
    const col = Math.floor(x / CELL);
    const row = Math.floor(y / CELL);
    if (col < 0 || col > 7 || row < 0 || row > 7) return -1;
    const boardRow = 7 - row;
    const boardCol = (boardRow % 2 === 0) ? col : (7 - col);
    return boardRow * 8 + boardCol + 1;
}

// =====================================================================
// FRACTION HELPERS
// =====================================================================
function getGcd(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b) {
        let t = b;
        b = a % b;
        a = t;
    }
    return a;
}

function fracConvLabel(f) {
    if (f.d === 'M') {
        const top = f.w * f.dn + f.n;
        return { type: 'mixed', whole: f.w, num: f.n, den: f.dn, improper: { num: top, den: f.dn } };
    }
    const w = Math.floor(f.n / f.dn);
    const r = f.n % f.dn;
    if (r === 0) {
        return { type: 'whole', whole: w, num: f.n, den: f.dn };
    }
    return { type: 'improper', whole: w, num: r, den: f.dn, improper: { num: f.n, den: f.dn } };
}

function drawStackedFrac(num, den, cx, cy, size) {
    const numStr = String(num);
    const denStr = String(den);
    ctx.font = `bold ${size}px 'JetBrains Mono', monospace`;
    const nw = ctx.measureText(numStr).width;
    const dw = ctx.measureText(denStr).width;
    const lineW = Math.max(nw, dw) + 6;
    
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText(numStr, cx, cy - 2);
    ctx.textBaseline = 'top';
    ctx.fillText(denStr, cx, cy + 3);
    ctx.textBaseline = 'alphabetic';
    ctx.fillRect(cx - lineW / 2, cy - 1, lineW, 2.5);
}

function drawCellFraction(f, cx, cy) {
    if (!f || f.d === 'W') return;
    const SIZE = 22;
    ctx.fillStyle = '#1a1a1a';
    
    if (f.d === 'M') {
        ctx.font = `bold ${SIZE + 6}px 'JetBrains Mono', monospace`;
        const wStr = String(f.w);
        const ww = ctx.measureText(wStr).width;
        ctx.font = `bold ${SIZE}px 'JetBrains Mono', monospace`;
        const fw = Math.max(ctx.measureText(String(f.n)).width, ctx.measureText(String(f.dn)).width) + 6;
        const totalW = ww + 6 + fw;
        const startX = cx - totalW / 2;
        
        ctx.font = `bold ${SIZE + 6}px 'JetBrains Mono', monospace`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(wStr, startX, cy + 1);
        ctx.textBaseline = 'alphabetic';
        drawStackedFrac(f.n, f.dn, startX + ww + 6 + fw / 2, cy, SIZE);
    } else {
        drawStackedFrac(f.n, f.dn, cx, cy, SIZE);
    }
}

// =====================================================================
// BOARD RENDERING
// =====================================================================
function drawBoard() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let sq = 1; sq <= 64; sq++) {
        const { x, y } = squareXY(sq);
        const isSnakeHead = sq in SNAKES;
        const isLadderBot = sq in LADDERS;
        
        let bg = (Math.floor((sq - 1) / 8) + (sq - 1)) % 2 === 0 ? '#ffffff' : '#f5f0e8';
        if (sq === 64) bg = '#ffe500';
        else if (sq === 1) bg = '#e8f5ec';
        else if (isSnakeHead) bg = '#fff2f2';
        else if (isLadderBot) bg = '#edfff5';
        
        ctx.fillStyle = bg;
        ctx.fillRect(x, y, CELL, CELL);
        ctx.strokeStyle = '#1a1a1a';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(x, y, CELL, CELL);
        
        ctx.fillStyle = '#777';
        ctx.font = `700 18px 'JetBrains Mono', monospace`;
        ctx.textAlign = 'right';
        ctx.fillText(sq, x + CELL - 8, y + 24);
        
        if (sq === 64) {
            ctx.fillStyle = '#1a1a1a';
            ctx.font = `900 26px 'Unbounded', sans-serif`;
            ctx.textAlign = 'center';
            ctx.fillText('WIN', x + CELL / 2, y + CELL / 2 - 6);
            ctx.font = `400 15px 'Unbounded', sans-serif`;
            ctx.fillText('SQUARE 64', x + CELL / 2, y + CELL / 2 + 20);
        } else if (sq === 1) {
            ctx.fillStyle = '#1a1a1a';
            ctx.font = `900 20px 'Unbounded', sans-serif`;
            ctx.textAlign = 'center';
            ctx.fillText("START", x + CELL / 2, y + CELL / 2 + 6);
        } else {
            const f = FRAC[sq];
            if (f) drawCellFraction(f, x + CELL / 2, y + CELL / 2 + 6);
        }
    }
    
    for (const [bot, top] of Object.entries(LADDERS)) drawLadder(parseInt(bot), parseInt(top));
    for (const [head, tail] of Object.entries(SNAKES)) drawSnake(parseInt(head), parseInt(tail));
    drawPlayers();
}

function drawLadder(bot, top) {
    const b = squareCenter(bot);
    const t = squareCenter(top);
    const dx = t.x - b.x;
    const dy = t.y - b.y;
    const len = Math.hypot(dx, dy);
    const ang = Math.atan2(dy, dx);
    
    ctx.save();
    ctx.translate(b.x, b.y);
    ctx.rotate(ang);
    
    const railW = 16;
    const halfSpread = 22;
    
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.fillRect(0, -halfSpread - railW / 2 + 8, len, railW);
    ctx.fillRect(0, halfSpread - railW / 2 + 8, len, railW);
    
    const woodG = ctx.createLinearGradient(0, -halfSpread - railW / 2, 0, -halfSpread + railW / 2);
    woodG.addColorStop(0, '#5c3a21');
    woodG.addColorStop(0.5, '#8b5a2b');
    woodG.addColorStop(1, '#4a2f1d');
    
    const steps = Math.floor(len / 35);
    for (let i = 1; i < steps; i++) {
        const rx = (len / steps) * i;
        ctx.fillStyle = 'rgba(0,0,0,0.35)';
        ctx.fillRect(rx - 3, -halfSpread + 4, 10, halfSpread * 2);
        
        const rungG = ctx.createLinearGradient(rx - 4, 0, rx + 4, 0);
        rungG.addColorStop(0, '#704523');
        rungG.addColorStop(1, '#4a2f1d');
        ctx.fillStyle = rungG;
        ctx.fillRect(rx - 4, -halfSpread, 8, halfSpread * 2);
    }
    
    ctx.fillStyle = woodG;
    ctx.fillRect(-8, -halfSpread - railW / 2, len + 16, railW);
    const woodG2 = ctx.createLinearGradient(0, halfSpread - railW / 2, 0, halfSpread + railW / 2);
    woodG2.addColorStop(0, '#5c3a21');
    woodG2.addColorStop(0.5, '#8b5a2b');
    woodG2.addColorStop(1, '#4a2f1d');
    ctx.fillStyle = woodG2;
    ctx.fillRect(-8, halfSpread - railW / 2, len + 16, railW);
    
    ctx.restore();
}

function drawSnake(head, tail) {
    const h = squareCenter(head);
    const t = squareCenter(tail);
    const dist = Math.hypot(h.x - t.x, h.y - t.y);
    const offset = dist * 0.35;
    
    const cp1x = h.x + (t.x > h.x ? offset : -offset);
    const cp1y = h.y + offset;
    const cp2x = t.x + (t.x > h.x ? -offset : offset);
    const cp2y = t.y - offset;
    
    const baseCol = SNAKE_COLORS[head] || '#27ae60';
    
    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    ctx.shadowColor = 'rgba(0,0,0,0.4)';
    ctx.shadowBlur = 12;
    ctx.shadowOffsetX = 6;
    ctx.shadowOffsetY = 6;
    ctx.beginPath();
    ctx.moveTo(h.x, h.y);
    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, t.x, t.y);
    ctx.lineWidth = 30;
    ctx.strokeStyle = baseCol;
    ctx.stroke();
    
    ctx.shadowColor = 'transparent';
    
    ctx.beginPath();
    ctx.moveTo(h.x, h.y);
    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, t.x, t.y);
    ctx.lineWidth = 24;
    ctx.setLineDash([12, 12]);
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.stroke();
    ctx.setLineDash([]);
    
    ctx.beginPath();
    ctx.moveTo(h.x, h.y);
    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, t.x, t.y);
    ctx.lineWidth = 6;
    ctx.strokeStyle = 'rgba(255,235,100,0.6)';
    ctx.stroke();
    
    const headAng = Math.atan2(cp1y - h.y, cp1x - h.x);
    drawSnakeHead(h.x, h.y, headAng, baseCol);
    
    ctx.beginPath();
    ctx.arc(t.x, t.y, 15, 0, Math.PI * 2);
    ctx.fillStyle = baseCol;
    ctx.fill();
    
    ctx.restore();
}

function drawSnakeHead(x, y, ang, color) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(ang);
    
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(-18, -18);
    ctx.quadraticCurveTo(25, -25, 30, 0);
    ctx.quadraticCurveTo(25, 25, -18, 18);
    ctx.closePath();
    ctx.fill();
    
    ctx.fillStyle = '#f1c40f';
    ctx.beginPath();
    ctx.arc(8, -10, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(8, 10, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath();
    ctx.arc(10, -10, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(10, 10, 2.5, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = '#e74c3c';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(30, 0);
    ctx.lineTo(48, 0);
    ctx.moveTo(48, 0);
    ctx.lineTo(54, -5);
    ctx.moveTo(48, 0);
    ctx.lineTo(54, 5);
    ctx.stroke();
    
    ctx.restore();
}

function drawPlayers() {
    players.forEach((p, i) => {
        const isDragging = (dragState.isDragging && dragState.pi === i);
        const px = p.drawX;
        const py = p.drawY;
        const radius = isDragging ? 28 : 22;
        
        ctx.save();
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.beginPath();
        ctx.ellipse(px + 4, py + (isDragging ? 20 : 12), radius * 0.8, radius * 0.4, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = p.color;
        ctx.strokeStyle = '#1a1a1a';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(px, py, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        ctx.strokeStyle = 'rgba(255,255,255,0.4)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(px, py, radius - 6, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.fillStyle = '#ffffff';
        ctx.font = `900 ${isDragging ? 18 : 14}px 'Unbounded', sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(players[i].name, px, py + 1);
        ctx.restore();
    });
}

// =====================================================================
// GAME LOGIC & CPU AUTOMATION
// =====================================================================
function addLog(msg, type = 'info') {
    if (!logActive) {
        logActive = true;
        logOverlay.classList.add('active');
    }
    const el = document.createElement('div');
    el.className = `snakes-log-entry ${type}`;
    el.textContent = msg;
    logOverlay.appendChild(el);
    logOverlay.scrollTop = logOverlay.scrollHeight;
}

function updateHUD() {
    turnHud.textContent = `${players[turn].name}'S TURN`;
    turnHud.style.background = players[turn].color;
    if (modalTurn) modalTurn.textContent = `${players[turn].name}'s Turn`;
}

function startTurn() {
    updateHUD();
    
    if (vsCPU && turn === 1) {
        gameState = STATE.CPU_THINKING;
        addLog(`${players[1].name} is thinking...`, 'info');
        if (gameFeedback) gameFeedback.textContent = `${players[1].name} is taking their turn...`;
        setTimeout(executeRoll, 1200);
    } else {
        gameState = STATE.WAITING_ROLL;
        addLog(`${players[turn].name}'s turn. Drag dice or double-tap to roll.`, 'info');
        dtHint.classList.add('show');
        setTimeout(() => dtHint.classList.remove('show'), 2000);
        if (gameFeedback) gameFeedback.textContent = `${players[turn].name}'s turn. Drag dice or double-tap to roll!`;
    }
}

function roll3DDice(result) {
    const rot = {
        1: { x: 0, y: 0 },
        2: { x: -90, y: 0 },
        3: { x: 0, y: -90 },
        4: { x: 0, y: 90 },
        5: { x: 90, y: 0 },
        6: { x: 0, y: 180 }
    };
    const spinsX = (Math.floor(Math.random() * 2) + 2) * 360;
    const spinsY = (Math.floor(Math.random() * 2) + 2) * 360;
    cube.style.transform = `translateZ(-30px) rotateX(${rot[result].x + spinsX}deg) rotateY(${rot[result].y + spinsY}deg)`;
}

function executeRoll() {
    if ((gameState !== STATE.WAITING_ROLL && gameState !== STATE.CPU_THINKING) || !gameActive) return;
    
    gameState = STATE.ROLLING;
    currentRoll = Math.floor(Math.random() * 6) + 1;
    roll3DDice(currentRoll);
    
    setTimeout(() => {
        if (!gameActive) return;
        let target = players[turn].pos + currentRoll;
        
        if (target > 64) {
            addLog(`${players[turn].name} rolled a ${currentRoll} but cannot move (needs exactly ${64 - players[turn].pos} to win).`, 'error');
            if (gameFeedback) gameFeedback.textContent = `Rolled ${currentRoll} but need exactly ${64 - players[turn].pos} to win! Turn skipped.`;
            endTurn();
            return;
        }
        
        if (vsCPU && turn === 1) {
            addLog(`${players[1].name} rolled a ${currentRoll}!`, 'action');
            animateCPUToken(1, players[1].pos, target, () => {
                players[1].pos = target;
                checkSquareLogic(1, target);
            });
        } else {
            if (autoMove) {
                addLog(`${players[turn].name} rolled a ${currentRoll}! Token moving automatically.`, 'action');
                if (gameFeedback) gameFeedback.textContent = `Rolled ${currentRoll}! Auto-moving to ${target}...`;
                animateCPUToken(turn, players[turn].pos, target, () => {
                    players[turn].pos = target;
                    checkSquareLogic(turn, target);
                });
            } else {
                expectedSquare = target;
                gameState = STATE.WAITING_DRAG;
                addLog(`${players[turn].name} rolled a ${currentRoll}! Drag token to square ${target}.`, 'action');
                if (gameFeedback) gameFeedback.textContent = `Rolled ${currentRoll}! Drag token to square ${target}.`;
            }
        }
    }, 600);
}

function snapToken(pi, targetSq) {
    const c = squareCenter(targetSq);
    players[pi].drawX = c.x + offsets[pi].dx;
    players[pi].drawY = c.y + offsets[pi].dy;
    drawBoard();
}

function animateCPUToken(pi, startSq, targetSq, callback) {
    const start = squareCenter(startSq);
    const end = squareCenter(targetSq);
    const p = players[pi];
    let startX = start.x + offsets[pi].dx;
    let startY = start.y + offsets[pi].dy;
    let endX = end.x + offsets[pi].dx;
    let endY = end.y + offsets[pi].dy;

    let startTime = null;
    const duration = 600;

    function step(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        p.drawX = startX + (endX - startX) * ease;
        p.drawY = startY + (endY - startY) * ease;
        drawBoard();

        if (progress < 1) {
            requestAnimationFrame(step);
        } else {
            callback();
        }
    }
    requestAnimationFrame(step);
}

function checkSquareLogic(pi, sq) {
    if (sq in SNAKES) {
        let tail = SNAKES[sq];
        if ((vsCPU && pi === 1) || autoMove) {
            addLog(`OH NO! A snake!`, 'snake');
            setTimeout(() => {
                animateCPUToken(pi, sq, tail, () => {
                    players[pi].pos = tail;
                    checkFraction(pi, tail);
                });
            }, 700);
        } else {
            expectedSquare = tail;
            gameState = STATE.WAITING_DRAG_SNAKELADDER;
            addLog(`OH NO! A snake! Drag down to square ${expectedSquare}.`, 'snake');
            if (gameFeedback) gameFeedback.textContent = `Snake! Drag down to ${expectedSquare}.`;
        }
    } else if (sq in LADDERS) {
        let top = LADDERS[sq];
        if ((vsCPU && pi === 1) || autoMove) {
            addLog(`YAY! A ladder!`, 'ladder');
            setTimeout(() => {
                animateCPUToken(pi, sq, top, () => {
                    players[pi].pos = top;
                    checkFraction(pi, top);
                });
            }, 700);
        } else {
            expectedSquare = top;
            gameState = STATE.WAITING_DRAG_SNAKELADDER;
            addLog(`YAY! A ladder! Drag up to square ${expectedSquare}.`, 'ladder');
            if (gameFeedback) gameFeedback.textContent = `Ladder! Drag up to ${expectedSquare}.`;
        }
    } else if (sq === 64) {
        triggerWin(pi);
    } else {
        checkFraction(pi, sq);
    }
}

function checkFraction(pi, sq) {
    const f = FRAC[sq];
    if (f && f.d !== 'W') {
        showFracQuestion(f, pi);
    } else {
        if (sq === 64) {
            triggerWin(pi);
        } else {
            endTurn();
        }
    }
}

function endTurn() {
    turn = 1 - turn;
    startTurn();
}

function triggerWin(pi, reason = null) {
    gameState = STATE.GAME_OVER;
    gameActive = false;
    const p = players[pi];
    addLog(`${p.name} WON THE GAME!`, 'action');
    winName.textContent = `${p.name} WINS!`;
    const subText = document.getElementById('winSub');
    if (subText) {
        subText.textContent = reason || "Reached square 64 first!";
    }
    setTimeout(() => winOverlay.classList.add('show'), 800);
}

// =====================================================================
// FRACTION QUESTION & NUMPAD LOGIC
// =====================================================================
function showFracQuestion(f, pi) {
    gameState = STATE.WAITING_FRAC_ANSWER;
    isProcessingAnswer = false;
    currentFracPlayer = pi;
    currentFracAttempts = 0;
    currentFracData = fracConvLabel(f);

    const data = currentFracData;
    let html = '';

    if (data.type === 'mixed') {
        html = `
            <div class="frac-q-row">
                <span class="frac-lg">${data.whole}</span>
                <div class="frac-col">
                    <span class="frac-md">${data.num}</span>
                    <div class="frac-line"></div>
                    <span class="frac-md">${data.den}</span>
                </div>
                <span class="frac-eq">=</span>
                <div class="frac-col">
                    <div class="frac-input" id="ans-num"></div>
                    <div class="frac-line"></div>
                    <div class="frac-input" id="ans-den"></div>
                </div>
            </div>
            <button class="btn-check-frac" onclick="submitFractionAnswer()">Check</button>
        `;
    } else if (data.type === 'improper') {
        html = `
            <div class="frac-q-row">
                <div class="frac-col">
                    <span class="frac-lg">${data.improper.num}</span>
                    <div class="frac-line"></div>
                    <span class="frac-lg">${data.improper.den}</span>
                </div>
                <span class="frac-eq">=</span>
                <div class="frac-q-row">
                    <div class="frac-input ans-whole" id="ans-w"></div>
                    <div class="frac-col">
                        <div class="frac-input" id="ans-num"></div>
                        <div class="frac-line"></div>
                        <div class="frac-input" id="ans-den"></div>
                    </div>
                </div>
            </div>
            <button class="btn-check-frac" onclick="submitFractionAnswer()">Check</button>
        `;
    } else {
        html = `
            <div class="frac-q-row">
                <div class="frac-col">
                    <span class="frac-lg">${data.num}</span>
                    <div class="frac-line"></div>
                    <span class="frac-lg">${data.den}</span>
                </div>
                <span class="frac-eq">=</span>
                <div class="frac-input ans-whole" id="ans-w"></div>
            </div>
            <button class="btn-check-frac" onclick="submitFractionAnswer()">Check</button>
        `;
    }

    popupEq.innerHTML = html;
    fracPopup.classList.add('show');
    numpad.classList.add('show');

    // Remove active states and set focus specifically via class to avoid inputmode issues
    document.querySelectorAll('.frac-input').forEach(i => i.classList.remove('active-focus'));
    const firstInput = popupEq.querySelector('.frac-input');
    if (firstInput) {
        firstInput.classList.add('active-focus');
        activeInput = firstInput;
    }

    if (vsCPU && pi === 1) {
        setTimeout(() => simulateCPUAnswer(data), 1500);
    }
}

function simulateCPUAnswer(data) {
    const setVal = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
    };
    
    if (data.type === 'mixed') {
        let tNum = data.improper.num;
        let tDen = data.improper.den;
        let g = getGcd(tNum, tDen);
        setVal('ans-num', tNum / g);
        setVal('ans-den', tDen / g);
    } else if (data.type === 'improper') {
        let tNum = data.num;
        let tDen = data.den;
        let g = getGcd(tNum, tDen);
        setVal('ans-w', data.whole);
        setVal('ans-num', tNum / g);
        setVal('ans-den', tDen / g);
    } else {
        setVal('ans-w', data.whole);
    }
    
    setTimeout(submitFractionAnswer, 800);
}

function submitFractionAnswer() {
    if (isProcessingAnswer) return; 
    isProcessingAnswer = true;
    
    let isCorrect = false;
    let originalIsReducible = false;
    let answeredInLowestTerms = false;
    
    const data = currentFracData;
    const getVal = (id) => {
        const el = document.getElementById(id);
        return el && el.textContent.trim() !== '' ? parseInt(el.textContent.trim()) : 0;
    };

    if (data.type === 'mixed') {
        originalIsReducible = (getGcd(data.improper.num, data.improper.den) > 1);
        const tNum = data.improper.num;
        const tDen = data.improper.den;
        const uNum = getVal('ans-num');
        const uDen = getVal('ans-den');
        
        if (uDen !== 0 && (uNum * tDen === tNum * uDen)) {
            isCorrect = true;
            if (getGcd(uNum, uDen) === 1) answeredInLowestTerms = true;
        }
    } else if (data.type === 'improper') {
        originalIsReducible = (getGcd(data.improper.num, data.improper.den) > 1);
        const tTotalNum = data.improper.num; 
        const tDen = data.improper.den;
        
        const uWhole = getVal('ans-w');
        const uNum = getVal('ans-num');
        const uDen = getVal('ans-den');
        const uTotalNum = uWhole * uDen + uNum;
        
        if (uDen !== 0 && uNum < uDen && (uTotalNum * tDen === tTotalNum * uDen)) {
            isCorrect = true;
            if (uNum === 0 || getGcd(uNum, uDen) === 1) answeredInLowestTerms = true;
        }
    } else {
        if (getVal('ans-w') === data.whole) {
            isCorrect = true;
        }
    }

    if (isCorrect) {
        if (currentFracAttempts === 0) {
            if (originalIsReducible && answeredInLowestTerms) {
                // Perfect hit + Lowest terms guarantee bonus card
                showBonusFlipCards(currentFracPlayer); 
            } else if (originalIsReducible && !answeredInLowestTerms) {
                // Correct, but missed the reduction bonus
                addLog(`${players[currentFracPlayer].name} didn't reduce to lowest terms. No bonus wish cards!`, 'info');
                if (gameFeedback) gameFeedback.textContent = "Correct! But not lowest terms, so no bonus.";
                showStandardCard(currentFracPlayer);
            } else {
                // Normal fraction conversion standard card
                showStandardCard(currentFracPlayer);
            }
        } else {
            fracPopup.classList.remove('show');
            numpad.classList.remove('show');
            endTurn();
        }
    } else {
        currentFracAttempts++;
        if (currentFracAttempts >= 5) {
            fracPopup.classList.remove('show');
            numpad.classList.remove('show');
            addLog(`${players[currentFracPlayer].name} failed 5 times and was disqualified!`, 'error');
            if (gameFeedback) gameFeedback.textContent = `${players[currentFracPlayer].name} disqualified!`;
            triggerWin(1 - currentFracPlayer, "Opponent failed 5 fraction questions!");
            return;
        }
        
        popupEq.classList.add('error-shake');
        setTimeout(() => {
            popupEq.classList.remove('error-shake');
            isProcessingAnswer = false; 
        }, 400);
        addLog(`Incorrect! Attempt ${currentFracAttempts}/5. Try again.`, 'error');
        if (gameFeedback) gameFeedback.textContent = `Incorrect! Attempt ${currentFracAttempts}/5. Try again.`;
    }
}

// =====================================================================
// INPUT MANAGEMENT (CUSTOM FOCUS AND KEYBOARD)
// =====================================================================
document.addEventListener('pointerdown', e => {
    if (e.target.classList.contains('frac-input')) {
        document.querySelectorAll('.frac-input').forEach(i => i.classList.remove('active-focus'));
        e.target.classList.add('active-focus');
        activeInput = e.target;
    }
});

window.addEventListener('keydown', e => {
    if (!fracPopup || !fracPopup.classList.contains('show')) return;
    if (!activeInput) return;
    
    if (e.key >= '0' && e.key <= '9') {
        e.preventDefault();
        onNumpadClick(e.key);
    } else if (e.key === 'Backspace') {
        e.preventDefault();
        activeInput.textContent = activeInput.textContent.slice(0, -1);
    } else if (e.key === 'Enter') {
        e.preventDefault();
        submitFractionAnswer();
    } else if (e.key.toLowerCase() === 'c' || e.key === 'Escape') {
        e.preventDefault();
        onNumpadClick('C');
    } else if (e.key === 'Tab') {
        e.preventDefault();
        const inputs = Array.from(popupEq.querySelectorAll('.frac-input'));
        const idx = inputs.indexOf(activeInput);
        if (idx >= 0) {
            let nextIdx = e.shiftKey ? (idx - 1 + inputs.length) % inputs.length : (idx + 1) % inputs.length;
            inputs.forEach(i => i.classList.remove('active-focus'));
            activeInput = inputs[nextIdx];
            activeInput.classList.add('active-focus');
        }
    }
});

function onNumpadClick(key) {
    if (!activeInput) return;
    if (key === 'C') {
        activeInput.textContent = '';
    } else if (key === 'OK') {
        submitFractionAnswer();
    } else {
        if (activeInput.textContent.length < 3) {
            activeInput.textContent += key;
        }
    }
}

// =====================================================================
// CARD LOGIC: EVALUATION TACTICS (Used by AI)
// =====================================================================
function evaluateCardTactics(card, pi, level) {
    if (level === 'basic') {
        return true; 
    }
    
    // Advanced Board Analysis
    let score = 0;
    if (card.type === 'self') {
        let target = players[pi].pos + card.amount;
        if (target > 64) target = 64;
        score += card.amount * 2; 
        
        if (SNAKES[target]) {
            let tail = SNAKES[target];
            score -= (target - tail) * 2; 
        }
        if (LADDERS[target]) {
            let top = LADDERS[target];
            score += (top - target) * 2; 
        }
    } else if (card.type === 'opponent') {
        let oppi = 1 - pi;
        let target = players[oppi].pos + card.amount;
        if (target < 1) target = 1;
        score += Math.abs(card.amount) * 2; 
        
        if (LADDERS[target]) {
            let top = LADDERS[target];
            score -= (top - target) * 3; 
        }
        if (SNAKES[target]) {
            let tail = SNAKES[target];
            score += (target - tail) * 2; 
        }
    }
    return score >= 0;
}

// =====================================================================
// STANDARD CARDS (From normal fraction conversion)
// =====================================================================
function showStandardCard(pi) {
    let actionTaken = false; 
    fracPopup.classList.remove('show');
    numpad.classList.remove('show');

    const card = STANDARD_CARDS[Math.floor(Math.random() * STANDARD_CARDS.length)];
    document.getElementById('lc-title').textContent = card.title;
    document.getElementById('lc-desc').textContent = card.desc;

    luckyCardOverlay.classList.add('show');
    
    const btnUse = document.getElementById('btn-use-card');
    const btnDiscard = document.getElementById('btn-discard-card');
    
    const newUse = btnUse.cloneNode(true);
    const newDiscard = btnDiscard.cloneNode(true);
    btnUse.parentNode.replaceChild(newUse, btnUse);
    btnDiscard.parentNode.replaceChild(newDiscard, btnDiscard);
    
    const handleUse = () => {
        if (actionTaken) return;
        actionTaken = true;
        luckyCardOverlay.classList.remove('show');
        card.action(pi);
    };
    
    const handleDiscard = () => {
        if (actionTaken) return;
        actionTaken = true;
        luckyCardOverlay.classList.remove('show');
        addLog(`${players[pi].name} discarded the card.`, 'info');
        endTurn();
    };

    newUse.addEventListener('click', handleUse);
    newDiscard.addEventListener('click', handleDiscard);

    if (vsCPU && pi === 1) {
        newUse.style.display = 'none';
        newDiscard.style.display = 'none';
        
        setTimeout(() => {
            let useIt = evaluateCardTactics(card, pi, cpuIntel);
            if (useIt) {
                addLog(`CPU analyzed board. Card used.`, 'action');
                handleUse();
            } else {
                addLog(`CPU evaluated penalty! Card discarded.`, 'info');
                handleDiscard();
            }
        }, 2500);
    } else {
        newUse.style.display = 'block';
        newDiscard.style.display = 'block';
    }
}

// =====================================================================
// BONUS WISH CARDS (From reducing to lowest terms)
// =====================================================================
function showBonusFlipCards(pi) {
    fracPopup.classList.remove('show');
    numpad.classList.remove('show');
    
    // Select 1 huge win, 2 small wins
    let huge = BONUS_HUGE_WINS[Math.floor(Math.random() * BONUS_HUGE_WINS.length)];
    let small1 = BONUS_SMALL_WINS[Math.floor(Math.random() * BONUS_SMALL_WINS.length)];
    let small2 = BONUS_SMALL_WINS[Math.floor(Math.random() * BONUS_SMALL_WINS.length)];
    
    let pool =[huge, small1, small2];
    for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
       [pool[i], pool[j]] =[pool[j], pool[i]];
    }
    
    const container = document.getElementById('bc-cards-container');
    container.innerHTML = '';
    
    let hasPicked = false;
    let chosenCardObj = null;
    
    pool.forEach((card, index) => {
        const cardEl = document.createElement('div');
        cardEl.className = 'bc-card';
        cardEl.dataset.index = index;
        cardEl.innerHTML = `
            <div class="bc-card-inner">
                <div class="bc-face bc-front">✨</div>
                <div class="bc-face bc-back">
                    <strong class="bc-card-title">${card.title}</strong>
                    <span class="bc-card-desc">${card.desc}</span>
                </div>
            </div>
        `;
        
        cardEl.addEventListener('click', () => {
            if (hasPicked || (vsCPU && pi === 1)) return;
            hasPicked = true;
            chosenCardObj = card;
            
            cardEl.classList.add('flipped');
            showBonusActions(pi, cardEl, pool, index, card);
        });
        
        container.appendChild(cardEl);
    });

    document.getElementById('bc-actions').style.display = 'none';
    bonusCardOverlay.classList.add('show');
    addLog(`${players[pi].name} earned Bonus Wish Cards! Pick one to reveal.`, 'info');

    if (vsCPU && pi === 1) {
        setTimeout(() => {
            const cpuChoiceIdx = Math.floor(Math.random() * 3);
            const cpuCardEl = container.children[cpuChoiceIdx];
            hasPicked = true;
            chosenCardObj = pool[cpuChoiceIdx];
            
            cpuCardEl.classList.add('flipped');
            
            setTimeout(() => {
                let useIt = evaluateCardTactics(chosenCardObj, pi, cpuIntel);
                
                // Reveal missed cards immediately
                Array.from(container.children).forEach((el, i) => {
                    if (i !== cpuChoiceIdx) el.classList.add('flipped');
                });
                
                setTimeout(() => {
                    bonusCardOverlay.classList.remove('show');
                    if (useIt) {
                        addLog(`CPU used the revealed bonus card!`, 'action');
                        chosenCardObj.action(pi);
                    } else {
                        addLog(`CPU discarded the revealed bonus to avoid penalties.`, 'info');
                        endTurn();
                    }
                }, 2500);

            }, 1500);
            
        }, 1200);
    }
}

function showBonusActions(pi, flippedEl, pool, chosenIndex, chosenCardObj) {
    const actionContainer = document.getElementById('bc-actions');
    const btnUse = document.getElementById('btn-use-bonus');
    const btnDiscard = document.getElementById('btn-discard-bonus');
    
    const newUse = btnUse.cloneNode(true);
    const newDiscard = btnDiscard.cloneNode(true);
    btnUse.parentNode.replaceChild(newUse, btnUse);
    btnDiscard.parentNode.replaceChild(newDiscard, btnDiscard);
    
    actionContainer.style.display = 'flex';
    
    let resolved = false;

    const executeResolution = (used) => {
        if (resolved) return;
        resolved = true;
        actionContainer.style.display = 'none';
        
        // Reveal what they missed
        const container = document.getElementById('bc-cards-container');
        Array.from(container.children).forEach((el, i) => {
            if (i !== chosenIndex) el.classList.add('flipped');
        });
        
        setTimeout(() => {
            bonusCardOverlay.classList.remove('show');
            if (used) {
                chosenCardObj.action(pi);
            } else {
                addLog(`${players[pi].name} discarded the bonus card.`, 'info');
                endTurn();
            }
        }, 2500);
    };

    newUse.addEventListener('click', () => executeResolution(true));
    newDiscard.addEventListener('click', () => executeResolution(false));
}


function applyCardMove(targetPi, amount) {
    let newPos = players[targetPi].pos + amount;
    if (newPos > 64) newPos = 64;
    if (newPos < 1) newPos = 1;

    addLog(`Card Effect! ${players[targetPi].name} moves ${amount > 0 ? 'forward' : 'back'} ${Math.abs(amount)} squares!`, 'action');

    animateCPUToken(targetPi, players[targetPi].pos, newPos, () => {
        players[targetPi].pos = newPos;
        
        if (newPos in SNAKES) {
            let tail = SNAKES[newPos];
            addLog(`Card put ${players[targetPi].name} on a snake!`, 'snake');
            setTimeout(() => {
                animateCPUToken(targetPi, newPos, tail, () => {
                    players[targetPi].pos = tail;
                    finalizeCardMove(targetPi, tail);
                });
            }, 600);
        } else if (newPos in LADDERS) {
            let top = LADDERS[newPos];
            addLog(`Card put ${players[targetPi].name} on a ladder!`, 'ladder');
            setTimeout(() => {
                animateCPUToken(targetPi, newPos, top, () => {
                    players[targetPi].pos = top;
                    finalizeCardMove(targetPi, top);
                });
            }, 600);
        } else {
            finalizeCardMove(targetPi, newPos);
        }
    });
}

function finalizeCardMove(pi, sq) {
    if (sq === 64) {
        triggerWin(pi);
    } else {
        endTurn();
    }
}

// =====================================================================
// DOM INJECTION FOR NUMPAD & LUCKY CARDS
// =====================================================================
function injectDynamicUI() {
    if (!document.getElementById('snakes-numpad')) {
        numpad = document.createElement('div');
        numpad.id = 'snakes-numpad';
        numpad.className = 'snakes-numpad';
        numpad.innerHTML = `
            <div class="np-header">::: DRAG :::</div>
            <div class="np-grid">
                <button data-key="1">1</button><button data-key="2">2</button><button data-key="3">3</button>
                <button data-key="4">4</button><button data-key="5">5</button><button data-key="6">6</button>
                <button data-key="7">7</button><button data-key="8">8</button><button data-key="9">9</button>
                <button data-key="C" class="np-util">C</button><button data-key="0">0</button><button data-key="OK" class="np-ok">OK</button>
            </div>
        `;
        document.body.appendChild(numpad);
        setupNumpadDrag();
    } else {
        numpad = document.getElementById('snakes-numpad');
    }

    if (!document.getElementById('lucky-card-overlay')) {
        luckyCardOverlay = document.createElement('div');
        luckyCardOverlay.id = 'lucky-card-overlay';
        luckyCardOverlay.className = 'snakes-lucky-overlay';
        luckyCardOverlay.innerHTML = `
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
        document.body.appendChild(luckyCardOverlay);
    } else {
        luckyCardOverlay = document.getElementById('lucky-card-overlay');
    }

    if (!document.getElementById('bonus-card-overlay')) {
        bonusCardOverlay = document.createElement('div');
        bonusCardOverlay.id = 'bonus-card-overlay';
        bonusCardOverlay.className = 'snakes-lucky-overlay';
        bonusCardOverlay.innerHTML = `
            <div class="lc-box" style="max-width: 400px;">
                <h3 style="color: #ff2200;">BONUS EARNED!</h3>
                <p style="font-size: 13px;">You reduced to lowest terms! Pick 1 Wish Card.</p>
                <div class="bc-cards" id="bc-cards-container">
                    <!-- Cards injected via JS -->
                </div>
                <div class="lc-actions" id="bc-actions" style="margin-top: 16px; display: none; gap: 12px; justify-content: center;">
                    <button class="btn-check-frac" id="btn-use-bonus" style="margin-top: 0;">USE REVEALED</button>
                    <button class="btn-secondary" id="btn-discard-bonus">DISCARD</button>
                </div>
            </div>
        `;
        document.body.appendChild(bonusCardOverlay);
    } else {
        bonusCardOverlay = document.getElementById('bonus-card-overlay');
    }
}

function setupNumpadDrag() {
    const header = numpad.querySelector('.np-header');
    
    header.addEventListener('pointerdown', (e) => {
        numpadDragState.isDragging = true;
        const rect = numpad.getBoundingClientRect();
        numpadDragState.startX = e.clientX - rect.left;
        numpadDragState.startY = e.clientY - rect.top;
        e.preventDefault();
    });

    window.addEventListener('pointermove', (e) => {
        if (!numpadDragState.isDragging) return;
        numpad.style.left = (e.clientX - numpadDragState.startX) + 'px';
        numpad.style.top = (e.clientY - numpadDragState.startY) + 'px';
        numpad.style.right = 'auto';
        numpad.style.bottom = 'auto';
    });

    window.addEventListener('pointerup', () => {
        numpadDragState.isDragging = false;
    });

    numpad.addEventListener('pointerdown', e => {
        if (e.target.tagName === 'BUTTON') {
            e.preventDefault();
            onNumpadClick(e.target.dataset.key);
        }
    });
}

// =====================================================================
// DRAGGABLE DICE & BOARD TOKENS
// =====================================================================
function setupDiceDrag() {
    if (diceSetupDone) return;
    if (!diceScene) return;
    
    diceScene.addEventListener('pointerdown', (e) => {
        if (!gameActive || gameState !== STATE.WAITING_ROLL) return;
        
        const now = Date.now();
        if (now - lastTapTime < 400) {
            executeRoll();
            lastTapTime = 0;
            e.preventDefault();
            return;
        }
        lastTapTime = now;
        
        const rect = diceScene.getBoundingClientRect();
        diceDragState = { 
            isDragging: true, 
            startX: e.clientX, 
            startY: e.clientY,
            origX: e.clientX,
            origY: e.clientY
        };
        
        diceScene.classList.add('dragging');
        diceScene.style.right = 'auto';
        diceScene.style.left = (rect.left) + 'px';
        diceScene.style.top = (rect.top) + 'px';
        
        e.preventDefault();
    });
    
    window.addEventListener('pointermove', (e) => {
        if (!diceDragState.isDragging) return;
        const dx = e.clientX - diceDragState.startX;
        const dy = e.clientY - diceDragState.startY;
        const wrapperRect = gameWrapper.getBoundingClientRect();
        const currentLeft = parseFloat(diceScene.style.left);
        const currentTop = parseFloat(diceScene.style.top);
        
        diceScene.style.left = Math.max(0, Math.min(wrapperRect.width - 60, currentLeft + dx)) + 'px';
        diceScene.style.top = Math.max(0, Math.min(wrapperRect.height - 60, currentTop + dy)) + 'px';
        
        diceDragState.startX = e.clientX;
        diceDragState.startY = e.clientY;
    });
    
    window.addEventListener('pointerup', (e) => {
        if (!diceDragState.isDragging) return;
        diceScene.classList.remove('dragging');
        diceDragState.isDragging = false;

        const dist = Math.hypot(e.clientX - diceDragState.origX, e.clientY - diceDragState.origY);
        if (dist > 15 && gameState === STATE.WAITING_ROLL) {
            executeRoll();
        }
    });

    diceSetupDone = true;
}

function setupEventListeners() {
    canvas.addEventListener('pointerdown', e => {
        if (!gameActive) return;
        
        if (gameState === STATE.WAITING_DRAG || gameState === STATE.WAITING_DRAG_SNAKELADDER) {
            const pt = getCanvasPoint(e);
            const p = players[turn];
            if (Math.hypot(pt.x - p.drawX, pt.y - p.drawY) < 50) {
                dragState = { isDragging: true, pi: turn };
                if (e.preventDefault) e.preventDefault();
                drawBoard();
            }
        }
    });

    window.addEventListener('pointermove', e => {
        if (dragState.isDragging && gameActive) {
            const pt = getCanvasPoint(e);
            players[dragState.pi].drawX = pt.x;
            players[dragState.pi].drawY = pt.y;
            drawBoard();
        }
    });

    window.addEventListener('pointerup', e => {
        if (dragState.isDragging && gameActive) {
            const pi = dragState.pi;
            dragState = { isDragging: false, pi: -1 };
            
            const pt = getCanvasPoint(e);
            const dropSquare = getSquareFromPoint(pt.x, pt.y);
            
            if (dropSquare === expectedSquare) {
                const p = players[pi];
                p.pos = expectedSquare;
                snapToken(pi, p.pos);
                
                if (gameState === STATE.WAITING_DRAG) {
                    checkSquareLogic(pi, p.pos);
                } else if (gameState === STATE.WAITING_DRAG_SNAKELADDER) {
                    checkFraction(pi, p.pos);
                }
            } else {
                addLog(`Wrong square. Drop token on square ${expectedSquare}.`, 'error');
                if (gameFeedback) gameFeedback.textContent = `Wrong square! Drop on ${expectedSquare}.`;
                snapToken(pi, players[pi].pos);
            }
        }
    });
}

// =====================================================================
// FULLSCREEN MODE
// =====================================================================
function toggleFullscreen() {
    if (!gameWrapper) gameWrapper = document.getElementById('gameWrapper');
    if (!gameWrapper) return;
    
    if (!document.fullscreenElement && !document.webkitFullscreenElement && 
        !document.mozFullScreenElement && !document.msFullscreenElement) {
        
        if (gameWrapper.requestFullscreen) {
            gameWrapper.requestFullscreen();
        } else if (gameWrapper.webkitRequestFullscreen) {
            gameWrapper.webkitRequestFullscreen();
        } else if (gameWrapper.msRequestFullscreen) {
            gameWrapper.msRequestFullscreen();
        }
        
        gameWrapper.classList.add('fullscreen-mode');
        if (fullscreenBtn) fullscreenBtn.style.display = 'inline-flex';
        if (fullscreenBtnEnter) fullscreenBtnEnter.style.display = 'none';
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
        
        gameWrapper.classList.remove('fullscreen-mode');
        if (fullscreenBtn) fullscreenBtn.style.display = 'none';
        if (fullscreenBtnEnter) fullscreenBtnEnter.style.display = 'inline-flex';
    }
}

document.addEventListener('fullscreenchange', updateFullscreenClass);
document.addEventListener('webkitfullscreenchange', updateFullscreenClass);
document.addEventListener('mozfullscreenchange', updateFullscreenClass);
document.addEventListener('MSFullscreenChange', updateFullscreenClass);

function updateFullscreenClass() {
    if (!gameWrapper) gameWrapper = document.getElementById('gameWrapper');
    if (!gameWrapper) return;
    
    const isFullscreen = document.fullscreenElement || 
                         document.webkitFullscreenElement || 
                         document.mozFullScreenElement ||
                         document.msFullscreenElement;
    
    if (isFullscreen) {
        gameWrapper.classList.add('fullscreen-mode');
        if (fullscreenBtn) fullscreenBtn.style.display = 'inline-flex';
        if (fullscreenBtnEnter) fullscreenBtnEnter.style.display = 'none';
    } else {
        gameWrapper.classList.remove('fullscreen-mode');
        if (fullscreenBtn) fullscreenBtn.style.display = 'none';
        if (fullscreenBtnEnter) fullscreenBtnEnter.style.display = 'inline-flex';
    }
}

// =====================================================================
// DROPDOWNS & INITIALIZATION
// =====================================================================
function toggleDropdown(id) {
    const dd = document.getElementById(id);
    if (!dd) return;
    const isOpen = dd.classList.contains('open');
    document.querySelectorAll('.pp-dropdown.open').forEach(el => el.classList.remove('open'));
    if (!isOpen) dd.classList.add('open');
}

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
        vsCPU = (value === 'cpu');
        headerSpan.textContent = item.textContent.trim();
    } else if (dd.id === 'dd-cpu-intel') {
        cpuIntel = value;
        headerSpan.textContent = item.textContent.trim();
    } else if (dd.id === 'dd-movement') {
        autoMove = (value === 'auto');
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
            if (gameActive) drawBoard();
        } else if (dd.id === 'dd-difficulty') {
            headerSpan.textContent = item.textContent.trim();
        }
    }
    
    dd.classList.remove('open');
}, true);

function initColorDropdowns() {
    const p1Dropdown = document.getElementById('dd-p1-color');
    const p2Dropdown = document.getElementById('dd-p2-color');
    
    if (p1Dropdown) {
        const list = p1Dropdown.querySelector('.pp-dropdown-list');
        list.innerHTML = '';
        PLAYER_COLORS.forEach(color => {
            const item = document.createElement('div');
            item.className = 'pp-dropdown-item' + (color.value === players[0].color ? ' selected' : '');
            item.dataset.value = color.value;
            item.innerHTML = `
                <span style="display: flex; align-items: center; gap: 8px;">
                    <span style="display: inline-block; width: 16px; height: 16px; border-radius: 50%; background: ${color.value}; border: 2px solid #1a1a1a;"></span>
                    ${color.name}
                </span>
            `;
            list.appendChild(item);
        });
        p1Dropdown.querySelector('.dd-selected').innerHTML = `
            <span style="display: flex; align-items: center; gap: 8px;">
                <span style="display: inline-block; width: 16px; height: 16px; border-radius: 50%; background: ${players[0].color}; border: 2px solid #1a1a1a;"></span>
                ${PLAYER_COLORS.find(c => c.value === players[0].color)?.name || 'Blue'}
            </span>
        `;
    }
    
    if (p2Dropdown) {
        const list = p2Dropdown.querySelector('.pp-dropdown-list');
        list.innerHTML = '';
        PLAYER_COLORS.forEach(color => {
            const item = document.createElement('div');
            item.className = 'pp-dropdown-item' + (color.value === players[1].color ? ' selected' : '');
            item.dataset.value = color.value;
            item.innerHTML = `
                <span style="display: flex; align-items: center; gap: 8px;">
                    <span style="display: inline-block; width: 16px; height: 16px; border-radius: 50%; background: ${color.value}; border: 2px solid #1a1a1a;"></span>
                    ${color.name}
                </span>
            `;
            list.appendChild(item);
        });
        p2Dropdown.querySelector('.dd-selected').innerHTML = `
            <span style="display: flex; align-items: center; gap: 8px;">
                <span style="display: inline-block; width: 16px; height: 16px; border-radius: 50%; background: ${players[1].color}; border: 2px solid #1a1a1a;"></span>
                ${PLAYER_COLORS.find(c => c.value === players[1].color)?.name || 'Red'}
            </span>
        `;
    }
}

function resetGame() {
    players[0].name = "P1";
    players[1].name = vsCPU ? "CPU" : "P2";

    players.forEach((p, i) => {
        p.pos = 1;
        const c = squareCenter(1);
        p.drawX = c.x + offsets[i].dx;
        p.drawY = c.y + offsets[i].dy;
    });
    
    // Attempt to Generate Fresh Random Board Map 
    const diffDropdown = document.getElementById('dd-difficulty');
    let diffVal = 'standard';
    if (diffDropdown) {
        const selected = diffDropdown.querySelector('.selected');
        if (selected) diffVal = selected.dataset.value;
    }

    if (typeof window.generateRandomBoard === 'function') {
        const boardData = window.generateRandomBoard(diffVal);
        SNAKES = boardData.snakes;
        SNAKE_COLORS = boardData.snakeColors;
        LADDERS = boardData.ladders;
        FRAC = boardData.fractions;
    } else {
        console.warn("boardGenerator not found. Make sure boardGenerator.js is loaded without the export keyword!");
    }

    turn = 0;
    logOverlay.innerHTML = '';
    logOverlay.classList.remove('active');
    logActive = false;
    winOverlay.classList.remove('show');
    if (fracPopup) fracPopup.classList.remove('show');
    if (numpad) numpad.classList.remove('show');
    
    gameActive = true;
    gameState = STATE.WAITING_ROLL;
    
    if (diceScene) {
        diceScene.style.left = '';
        diceScene.style.top = '';
        diceScene.style.right = '16px';
    }
    
    drawBoard();
    startTurn();
    if (gameFeedback) gameFeedback.textContent = 'Game reset! Drag dice or double-tap to roll.';
}

function openGameModal() {
    gameModal = document.getElementById('game-modal');
    canvas = document.getElementById('boardCanvas');
    ctx = canvas.getContext('2d');
    canvas.width = BOARD_SIZE;
    canvas.height = BOARD_SIZE;
    
    gameFeedback = document.getElementById('game-feedback');
    turnHud = document.getElementById('turnHud');
    dtHint = document.getElementById('dtHint');
    fracPopup = document.getElementById('fracPopup');
    popupEq = document.getElementById('popupEq');
    winOverlay = document.getElementById('winOverlay');
    winName = document.getElementById('winName');
    cube = document.getElementById('cube');
    logOverlay = document.getElementById('logOverlay');
    modalTurn = document.getElementById('modal-turn');
    gameWrapper = document.getElementById('gameWrapper');
    diceScene = document.getElementById('diceScene');
    fullscreenBtn = document.getElementById('fullscreen-btn');
    fullscreenBtnEnter = document.getElementById('fullscreen-btn-enter');
    
    injectDynamicUI();
    
    gameActive = true;
    gameModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    initColorDropdowns();
    resetGame();
    setupDiceDrag();
}

function closeGameModal() {
    gameActive = false;
    if (document.fullscreenElement || document.webkitFullscreenElement) {
        if (document.exitFullscreen) document.exitFullscreen();
        else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    }
    if (gameWrapper) gameWrapper.classList.remove('fullscreen-mode');
    if (fullscreenBtn) fullscreenBtn.style.display = 'none';
    if (fullscreenBtnEnter) fullscreenBtnEnter.style.display = 'inline-flex';
    
    gameModal.classList.remove('active');
    document.body.style.overflow = '';
    winOverlay.classList.remove('show');
    if (fracPopup) fracPopup.classList.remove('show');
    if (numpad) numpad.classList.remove('show');
}

document.addEventListener('DOMContentLoaded', () => {
    const track = document.getElementById('ticker-track');
    if (track) {
        const words =['Snakes', 'Ladders', 'Fractions', 'Prep Portal', 'Drag Dice', 'Climb Up', 'Slide Down'];[...words, ...words].forEach(t => {
            const s = document.createElement('span');
            s.className = 'ticker-item';
            s.textContent = t;
            track.appendChild(s);
        });
    }
    
    canvas = document.getElementById('boardCanvas');
    if (canvas) {
        ctx = canvas.getContext('2d');
        canvas.width = BOARD_SIZE;
        canvas.height = BOARD_SIZE;
        setupEventListeners();
    }
});

// Window Bindings
window.toggleDropdown = toggleDropdown;
window.openGameModal = openGameModal;
window.closeGameModal = closeGameModal;
window.resetGame = resetGame;
window.toggleFullscreen = toggleFullscreen;
window.submitFractionAnswer = submitFractionAnswer;