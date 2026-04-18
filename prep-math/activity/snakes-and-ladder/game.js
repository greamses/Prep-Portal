// game.js - Snakes N' Ladders Game Logic

// =====================================================================
// BOARD & DATA CONSTANTS
// =====================================================================
const BOARD_SIZE = 1024;
const CELL = BOARD_SIZE / 8;

let canvas, ctx;
let gameModal, gameFeedback, turnHud, dtHint, fracPopup, popupEq, winOverlay, winName, cube, logOverlay, modalTurn;
let gameWrapper, diceScene, fullscreenBtn, fullscreenBtnEnter;
let numpad, luckyCardOverlay;

const FRAC = {
    1: { d: 'M', w: 9, n: 1, dn: 9 },
    2: { d: 'I', n: 15, dn: 4 },
    3: { d: 'M', w: 3, n: 8, dn: 9 },
    4: { d: 'I', n: 17, dn: 6 },
    5: { d: 'M', w: 8, n: 3, dn: 4 },
    6: { d: 'I', n: 13, dn: 2 },
    7: { d: 'M', w: 7, n: 7, dn: 9 },
    8: { d: 'I', n: 19, dn: 5 },
    9: { d: 'M', w: 7, n: 1, dn: 3 },
    10: { d: 'I', n: 24, dn: 6 },
    11: { d: 'M', w: 3, n: 2, dn: 5 },
    12: { d: 'I', n: 26, dn: 5 },
    13: { d: 'M', w: 4, n: 2, dn: 7 },
    14: { d: 'I', n: 33, dn: 7 },
    15: { d: 'M', w: 7, n: 5, dn: 8 },
    16: { d: 'I', n: 7, dn: 2 },
    17: { d: 'M', w: 1, n: 3, dn: 10 },
    18: { d: 'I', n: 13, dn: 2 },
    19: { d: 'M', w: 6, n: 4, dn: 7 },
    20: { d: 'I', n: 19, dn: 4 },
    21: { d: 'M', w: 3, n: 4, dn: 9 },
    22: { d: 'I', n: 73, dn: 8 },
    23: { d: 'M', w: 7, n: 5, dn: 8 },
    24: { d: 'I', n: 26, dn: 4 },
    25: { d: 'M', w: 4, n: 2, dn: 9 },
    26: { d: 'I', n: 53, dn: 9 },
    27: { d: 'M', w: 4, n: 2, dn: 9 },
    28: { d: 'I', n: 56, dn: 9 },
    29: { d: 'M', w: 6, n: 2, dn: 8 },
    30: { d: 'I', n: 50, dn: 6 },
    31: { d: 'M', w: 5, n: 1, dn: 7 },
    32: { d: 'I', n: 49, dn: 9 },
    33: { d: 'M', w: 5, n: 6, dn: 8 },
    34: { d: 'I', n: 44, dn: 8 },
    35: { d: 'M', w: 3, n: 3, dn: 8 },
    36: { d: 'I', n: 56, dn: 9 },
    37: { d: 'M', w: 11, n: 5, dn: 9 },
    38: { d: 'I', n: 15, dn: 6 },
    39: { d: 'M', w: 2, n: 7, dn: 10 },
    40: { d: 'I', n: 34, dn: 9 },
    41: { d: 'M', w: 2, n: 5, dn: 5 },
    42: { d: 'I', n: 15, dn: 4 },
    43: { d: 'M', w: 1, n: 3, dn: 10 },
    44: { d: 'I', n: 26, dn: 4 },
    45: { d: 'M', w: 3, n: 4, dn: 6 },
    46: { d: 'I', n: 19, dn: 4 },
    47: { d: 'M', w: 19, n: 4, dn: 9 },
    48: { d: 'I', n: 26, dn: 5 },
    49: { d: 'M', w: 4, n: 3, dn: 8 },
    50: { d: 'I', n: 33, dn: 7 },
    51: { d: 'M', w: 5, n: 3, dn: 5 },
    52: { d: 'I', n: 26, dn: 3 },
    53: { d: 'M', w: 33, n: 7, dn: 1 },
    54: { d: 'I', n: 21, dn: 4 },
    55: { d: 'M', w: 4, n: 1, dn: 6 },
    56: { d: 'I', n: 73, dn: 8 },
    57: { d: 'M', w: 4, n: 3, dn: 5 },
    58: { d: 'I', n: 19, dn: 6 },
    59: { d: 'M', w: 3, n: 2, dn: 6 },
    60: { d: 'I', n: 21, dn: 6 },
    61: { d: 'M', w: 4, n: 1, dn: 8 },
    62: { d: 'I', n: 5, dn: 3 },
    63: { d: 'M', w: 3, n: 4, dn: 8 },
    64: { d: 'W' },
};

const SNAKES = { 54: 34, 44: 6, 62: 19, 48: 16 };
const SNAKE_COLORS = { 54: '#c0392b', 44: '#27ae60', 62: '#8e44ad', 48: '#d35400' };
const LADDERS = { 5: 26, 13: 34, 27: 46, 42: 63 };

const PLAYER_COLORS = [
    { name: 'Blue', value: '#0055ff' },
    { name: 'Red', value: '#ff2200' },
    { name: 'Green', value: '#00a550' },
    { name: 'Purple', value: '#9b59b6' },
    { name: 'Orange', value: '#e67e22' },
    { name: 'Pink', value: '#e84393' }
];

const LUCKY_CARDS = [
    { title: "Lucky Strike!", desc: "Move forward 2 spaces.", action: (pi) => applyCardMove(pi, 2) },
    { title: "Speed Boost", desc: "Move forward 4 spaces.", action: (pi) => applyCardMove(pi, 4) },
    { title: "Sabotage!", desc: "Opponent moves back 2 spaces.", action: (pi) => applyCardMove(1 - pi, -2) },
    { title: "Tripwire", desc: "Opponent moves back 3 spaces.", action: (pi) => applyCardMove(1 - pi, -3) }
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

const offsets = [{ dx: -22, dy: -18 }, { dx: 22, dy: 18 }];

const players = [
    { pos: 1, color: '#0055ff', name: 'P1', drawX: 0, drawY: 0 },
    { pos: 1, color: '#ff2200', name: 'P2', drawX: 0, drawY: 0 }
];

let vsCPU = false;
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
    if (f.d === 'W') return;
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
            expectedSquare = target;
            gameState = STATE.WAITING_DRAG;
            addLog(`${players[turn].name} rolled a ${currentRoll}! Drag token to square ${target}.`, 'action');
            if (gameFeedback) gameFeedback.textContent = `Rolled ${currentRoll}! Drag token to square ${target}.`;
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
        if (vsCPU && pi === 1) {
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
        if (vsCPU && pi === 1) {
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

function triggerWin(pi) {
    gameState = STATE.GAME_OVER;
    gameActive = false;
    const p = players[pi];
    addLog(`${p.name} WON THE GAME!`, 'action');
    winName.textContent = `${p.name} WINS!`;
    setTimeout(() => winOverlay.classList.add('show'), 800);
}

// =====================================================================
// FRACTION QUESTION & NUMPAD LOGIC
// =====================================================================
function showFracQuestion(f, pi) {
    gameState = STATE.WAITING_FRAC_ANSWER;
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
                    <div class="frac-input" id="ans-num" contenteditable="true" inputmode="none"></div>
                    <div class="frac-line"></div>
                    <div class="frac-input" id="ans-den" contenteditable="true" inputmode="none"></div>
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
                    <div class="frac-input ans-whole" id="ans-w" contenteditable="true" inputmode="none"></div>
                    <div class="frac-col">
                        <div class="frac-input" id="ans-num" contenteditable="true" inputmode="none"></div>
                        <div class="frac-line"></div>
                        <div class="frac-input" id="ans-den" contenteditable="true" inputmode="none"></div>
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
                <div class="frac-input ans-whole" id="ans-w" contenteditable="true" inputmode="none"></div>
            </div>
            <button class="btn-check-frac" onclick="submitFractionAnswer()">Check</button>
        `;
    }
    
    popupEq.innerHTML = html;
    fracPopup.classList.add('show');
    numpad.classList.add('show');
    
    const firstInput = popupEq.querySelector('.frac-input');
    if (firstInput) {
        firstInput.focus();
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
        setVal('ans-num', data.improper.num);
        setVal('ans-den', data.improper.den);
    } else if (data.type === 'improper') {
        setVal('ans-w', data.whole);
        setVal('ans-num', data.num);
        setVal('ans-den', data.den);
    } else {
        setVal('ans-w', data.whole);
    }
    
    setTimeout(submitFractionAnswer, 800);
}

function submitFractionAnswer() {
    let isCorrect = false;
    const data = currentFracData;
    
    const getVal = (id) => {
        const el = document.getElementById(id);
        return el && el.textContent.trim() !== '' ? parseInt(el.textContent.trim()) : 0;
    };
    
    if (data.type === 'mixed') {
        // Target is improper
        const tNum = data.improper.num;
        const tDen = data.improper.den;
        const uNum = getVal('ans-num');
        const uDen = getVal('ans-den');
        
        // Evaluate equivalence: Cross multiplication ensures it's mathematically equivalent
        if (uDen !== 0 && (uNum * tDen === tNum * uDen)) {
            isCorrect = true;
        }
    } else if (data.type === 'improper') {
        // Target is mixed
        const tTotalNum = data.improper.num;
        const tDen = data.improper.den;
        
        const uWhole = getVal('ans-w');
        const uNum = getVal('ans-num');
        const uDen = getVal('ans-den');
        const uTotalNum = uWhole * uDen + uNum;
        
        // Evaluate equivalence. Also enforce a proper fractional component (uNum < uDen)
        if (uDen !== 0 && uNum < uDen && (uTotalNum * tDen === tTotalNum * uDen)) {
            isCorrect = true;
        }
    } else {
        if (getVal('ans-w') === data.whole) isCorrect = true;
    }
    
    if (isCorrect) {
        if (currentFracAttempts === 0) {
            showLuckyCard(currentFracPlayer);
        } else {
            fracPopup.classList.remove('show');
            numpad.classList.remove('show');
            endTurn();
        }
    } else {
        currentFracAttempts++;
        popupEq.classList.add('error-shake');
        setTimeout(() => popupEq.classList.remove('error-shake'), 400);
        addLog('Incorrect fraction conversion. Try again!', 'error');
        if (gameFeedback) gameFeedback.textContent = "Incorrect! Try again.";
    }
}

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

document.addEventListener('focusin', e => {
    if (e.target.classList.contains('frac-input')) {
        activeInput = e.target;
    }
});

// =====================================================================
// LUCKY CARDS LOGIC
// =====================================================================
function showLuckyCard(pi) {
    fracPopup.classList.remove('show');
    numpad.classList.remove('show');
    
    const card = LUCKY_CARDS[Math.floor(Math.random() * LUCKY_CARDS.length)];
    document.getElementById('lc-title').textContent = card.title;
    document.getElementById('lc-desc').textContent = card.desc;
    
    luckyCardOverlay.classList.add('show');
    
    setTimeout(() => {
        luckyCardOverlay.classList.remove('show');
        card.action(pi);
    }, 2800);
}

function applyCardMove(targetPi, amount) {
    let newPos = players[targetPi].pos + amount;
    if (newPos > 64) newPos = 64;
    if (newPos < 1) newPos = 1;
    
    addLog(`Lucky Card Effect! ${players[targetPi].name} moves ${amount > 0 ? 'forward' : 'back'} ${Math.abs(amount)} squares!`, 'action');
    
    animateCPUToken(targetPi, players[targetPi].pos, newPos, () => {
        players[targetPi].pos = newPos;
        if (newPos === 64) {
            triggerWin(targetPi);
        } else {
            endTurn();
        }
    });
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
                <div class="lc-icon">✨</div>
                <h3 id="lc-title">Lucky Strike!</h3>
                <p id="lc-desc">Move forward 2 spaces.</p>
            </div>
        `;
        document.body.appendChild(luckyCardOverlay);
    } else {
        luckyCardOverlay = document.getElementById('lucky-card-overlay');
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
        } else {
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
        const words = ['Snakes', 'Ladders', 'Fractions', 'Prep Portal', 'Drag Dice', 'Climb Up', 'Slide Down'];
        [...words, ...words].forEach(t => {
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