const canvas = document.getElementById('game-board');
const arrangementsCanvas = document.getElementById('arrangements-canvas');
const ctx = canvas.getContext('2d');
const arrCtx = arrangementsCanvas.getContext('2d');

const blockSize = 40;
const miniBlockSize = 20;
const cols = Math.floor(canvas.width / blockSize);
const rows = Math.floor(canvas.height / blockSize);

let baseSpeed = 1000;
let currentSpeed = baseSpeed;
const speedIncrease = 50;
const minSpeed = 100;
let level = 1;
let score = 0;
let elapsedSeconds = 0;
let speedTimer = null;        // interval handle for time-based speed
let board = Array(rows).fill().map(() => Array(cols).fill(0));
let currentPiece = null;
let nextPiece = null;
let gameOver = false;

let keyState = {};
let buttonIntervals = {};

const shapes = [];

// ── Prep Portal block palette ────────────────────────────────
// 11 distinct flat colors that read well on a cream/white canvas
const colors = [
  '#ffe600', // yellow
  '#0047ff', // blue
  '#00c04b', // green
  '#e5000a', // red
  '#ff6b35', // orange
  '#9b5de5', // purple
  '#00b4d8', // teal
  '#f72585', // pink
  '#06d6a0', // mint
  '#1a1a1a', // ink/black
  '#ff9f1c', // amber
];

function getArrangements(area) {
  const arrangements = [];
  for (let width = 1; width <= area; width++) {
    if (area % width === 0) arrangements.push([width, area / width]);
  }
  return arrangements;
}

function isPrime(num) {
  if (num < 2) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
}

// ── Neobrutalist block renderer ──────────────────────────────
function drawNeoBlock(context, x, y, w, h, color, border = '#1a1a1a') {
  // Flat fill
  context.fillStyle = color;
  context.fillRect(x, y, w, h);
  // Hard ink border
  context.strokeStyle = border;
  context.lineWidth = 2;
  context.strokeRect(x + 1, y + 1, w - 2, h - 2);
  // 3-px offset shadow (bottom + right edges)
  context.fillStyle = 'rgba(26,26,26,0.35)';
  context.fillRect(x + w,     y + 3,   3, h);   // right
  context.fillRect(x + 3,     y + h,   w, 3);   // bottom
}

function drawMiniNeoBlock(context, x, y, w, h, color) {
  context.fillStyle = color;
  context.fillRect(x, y, w, h);
  context.strokeStyle = '#1a1a1a';
  context.lineWidth = 1;
  context.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
}

class Piece {
  constructor(shape) {
    this.shape = shape;
    this.arrangementIndex = 0;
    this.arrangement = shape.arrangements[0];
    this.color = shape.color;
    this.x = Math.floor(cols / 2) - Math.floor(this.arrangement[0] / 2);
    this.y = -this.arrangement[1];
    this.updatePrimeIndicator();
  }

  updatePrimeIndicator() {
    const el = document.getElementById('prime-indicator');
    el.textContent = `Area: ${this.shape.area} (${this.shape.isPrime ? 'PRIME ★' : 'Not Prime'})`;
    el.className = this.shape.isPrime ? 'prime' : 'not-prime';
  }

  draw() {
  const [width, height] = this.arrangement;
  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      const blockY = this.y + row;
      if (blockY >= 0) {
        drawNeoBlock(
          ctx,
          (this.x + col) * blockSize + 1,
          blockY * blockSize + 1,
          blockSize - 2,
          blockSize - 2,
          this.color
        );
      }
    }
  }
  
  // Prime dashed outline
  if (this.shape.isPrime && this.y >= 0) {
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    ctx.strokeRect(
      this.x * blockSize + 2,
      this.y * blockSize + 2,
      width * blockSize - 4,
      height * blockSize - 4
    );
    ctx.setLineDash([]);
  }
  
  // Only draw labels once the piece is at least partially visible
  const visibleTop = Math.max(this.y, 0);
  if (visibleTop < this.y + height) {
    const piecePixelX = this.x * blockSize;
    const piecePixelY = this.y * blockSize;
    const piecePixelW = width * blockSize;
    const piecePixelH = height * blockSize;
    const centerX = piecePixelX + piecePixelW / 2;
    const centerY = piecePixelY + piecePixelH / 2;
    
    // ── Helper to determine if a color is dark ──────────
    const isDark = (hex) => {
      // Remove # and parse RGB
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      // Calculate perceived brightness
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      return brightness < 128;
    };
    
    // ── Area — large, centered on piece ───────────────────
    const areaText = String(this.shape.area);
    const areaSize = Math.min(piecePixelW, piecePixelH) * 0.55;
    const textColor = isDark(this.color) ? '#ffffff' : '#1a1a1a';
    
    ctx.font = `900 ${Math.max(14, areaSize)}px "Unbounded", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Shadow/glow for better contrast
    ctx.fillStyle = isDark(this.color) ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.6)';
    ctx.fillText(areaText, centerX + 2, centerY + 2);
    
    // Main text
    ctx.fillStyle = textColor;
    ctx.fillText(areaText, centerX, centerY);
    
    // ── Helper: draw a block-sized badge ──────────────────
    const drawBlockSizedBadge = (text, x, y) => {
      // Draw as a full block with same dimensions as game blocks
      drawNeoBlock(ctx, x + 1, y + 1, blockSize - 2, blockSize - 2, '#ffe600');
      
      // Text centered in the block
      ctx.font = `700 ${blockSize * 0.45}px "JetBrains Mono", monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#1a1a1a';
      ctx.fillText(text, x + blockSize / 2, y + blockSize / 2);
    };
    
    // ── Width badge — centered on the top side of the piece ──
    const widthBadgeX = piecePixelX + (piecePixelW - blockSize) / 2;
    const widthBadgeY = piecePixelY - blockSize - 4;
    if (widthBadgeY >= 0) {
      drawBlockSizedBadge(String(width), widthBadgeX, widthBadgeY);
    }
    
    // ── Height badge — centered on the right side (or left if needed) ──
    const rightX = piecePixelX + piecePixelW + 4;
    const leftX = piecePixelX - blockSize - 4;
    const sideBadgeY = piecePixelY + (piecePixelH - blockSize) / 2;
    
    if (rightX + blockSize <= canvas.width) {
      drawBlockSizedBadge(String(height), rightX, sideBadgeY);
    } else if (leftX >= 0) {
      drawBlockSizedBadge(String(height), leftX, sideBadgeY);
    }
  }
  
  this.drawArrangements();
}

  drawArrangements() {
    // Cream background
    arrCtx.fillStyle = '#f5f0e8';
    arrCtx.fillRect(0, 0, arrangementsCanvas.width, arrangementsCanvas.height);

    const arrangements = this.shape.arrangements;
    const padding = 16;
    let currentX = padding;

    arrangements.forEach((arr, index) => {
      const [width, height] = arr;
      const isCurrent = index === this.arrangementIndex;
      const bw = width * miniBlockSize;
      const bh = height * miniBlockSize;

      // Yellow highlight on active arrangement
      if (isCurrent) {
        arrCtx.fillStyle = '#ffe600';
        arrCtx.fillRect(currentX - 4, padding - 4, bw + 8, bh + 8);
        arrCtx.strokeStyle = '#1a1a1a';
        arrCtx.lineWidth = 2;
        arrCtx.strokeRect(currentX - 4, padding - 4, bw + 8, bh + 8);
      }

      for (let row = 0; row < height; row++) {
        for (let col = 0; col < width; col++) {
          drawMiniNeoBlock(
            arrCtx,
            currentX + col * miniBlockSize,
            padding + row * miniBlockSize,
            miniBlockSize - 1,
            miniBlockSize - 1,
            this.color
          );
        }
      }

      // Dimension label
      arrCtx.fillStyle = '#1a1a1a';
      arrCtx.font = `700 12px "JetBrains Mono", monospace`;
      arrCtx.fillText(`${width}×${height}`, currentX, padding + bh + 16);

      currentX += bw + padding * 2;
    });

    document.getElementById('current-arrangement').textContent =
      `Arrangement ${this.arrangementIndex + 1} / ${arrangements.length}`;
  }

  canMove(dx, dy) {
    const [width, height] = this.arrangement;
    for (let row = 0; row < height; row++) {
      for (let col = 0; col < width; col++) {
        const newX = this.x + col + dx;
        const newY = this.y + row + dy;
        if (newX < 0 || newX >= cols || newY >= rows ||
          (newY >= 0 && board[newY][newX])) return false;
      }
    }
    return true;
  }

  changeArrangement(delta) {
    const arrangements = this.shape.arrangements;
    this.arrangementIndex = (this.arrangementIndex + delta + arrangements.length) % arrangements.length;
    const [newWidth] = arrangements[this.arrangementIndex];
    this.x = Math.max(0, Math.min(this.x, cols - newWidth));
    const [nw, nh] = arrangements[this.arrangementIndex];
    if (this.canFit(nw, nh)) this.arrangement = [nw, nh];
    this.updatePrimeIndicator();
  }

  canFit(width, height) {
    for (let row = 0; row < height; row++) {
      for (let col = 0; col < width; col++) {
        const nx = this.x + col;
        const ny = this.y + row;
        if (nx < 0 || nx >= cols || ny >= rows || (ny >= 0 && board[ny][nx])) return false;
      }
    }
    return true;
  }
}

// Build shapes
for (let area = 2; area <= 12; area++) {
  shapes.push({
    area,
    isPrime: isPrime(area),
    arrangements: getArrangements(area),
    color: colors[area - 2],
  });
}

function drawBoard() {
  // Cream board background
  ctx.fillStyle = '#f5f0e8';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Subtle grid
  ctx.strokeStyle = 'rgba(26, 26, 26, 0.07)';
  ctx.lineWidth = 1;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      ctx.strokeRect(col * blockSize, row * blockSize, blockSize, blockSize);
    }
  }

  // Placed blocks
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (board[row][col]) {
        drawNeoBlock(
          ctx,
          col * blockSize + 1,
          row * blockSize + 1,
          blockSize - 2,
          blockSize - 2,
          board[row][col]
        );
      }
    }
  }

  if (currentPiece) currentPiece.draw();
}

function createNewPiece() {
  return new Piece(shapes[Math.floor(Math.random() * shapes.length)]);
}

function updateSpeed() {
  // Speed increases from both score (every 1000 pts) AND time (every 15 s)
  const scoreLevel = Math.floor(score / 1000);
  const timeLevel  = Math.floor(elapsedSeconds / 15);
  level = scoreLevel + timeLevel + 1;
  currentSpeed = Math.max(minSpeed, baseSpeed - (level - 1) * speedIncrease);
}

function startSpeedTimer() {
  stopSpeedTimer();
  speedTimer = setInterval(() => {
    if (gameOver) { stopSpeedTimer(); return; }
    elapsedSeconds++;
    updateSpeed();
  }, 1000);
}

function stopSpeedTimer() {
  if (speedTimer) { clearInterval(speedTimer); speedTimer = null; }
}

function checkLines() {
  let linesCleared = 0;
  for (let row = rows - 1; row >= 0; row--) {
    if (board[row].every(cell => cell !== 0)) {
      board.splice(row, 1);
      board.unshift(Array(cols).fill(0));
      linesCleared++;
      score += 100;
    }
  }
  if (linesCleared > 0) {
    document.getElementById('score').textContent = `Score: ${score}`;
    level = Math.floor(score / 1000) + 1;
    updateSpeed();
  }
}

function lockPiece() {
  const [width, height] = currentPiece.arrangement;
  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      if (currentPiece.y + row >= 0) {
        board[currentPiece.y + row][currentPiece.x + col] = currentPiece.color;
      }
    }
  }
  checkLines();
  currentPiece = nextPiece;
  nextPiece = createNewPiece();
  if (!currentPiece.canMove(0, 0)) {
    gameOver = true;
    stopSpeedTimer();
    alert(`Game Over! Final Score: ${score}`);
  }
}

function gameLoop() {
  if (!gameOver) {
    if (currentPiece.canMove(0, 1)) {
      currentPiece.y++;
    } else {
      lockPiece();
    }
    drawBoard();
    setTimeout(gameLoop, currentSpeed);
  }
}

// ── Overlay controls ──────────────────────────────────────────
function initOverlayControls() {
  ['up', 'left', 'right', 'down', 'rotate', 'm-plus', 'm-minus'].forEach(id => {
    const btn = document.getElementById(id);
    if (!btn) return;
    btn.addEventListener('mousedown',   e => { e.preventDefault(); startContinuousAction(id); });
    btn.addEventListener('touchstart',  e => { e.preventDefault(); startContinuousAction(id); });
    btn.addEventListener('mouseup',     e => { e.preventDefault(); stopContinuousAction(id); });
    btn.addEventListener('mouseleave',  e => { e.preventDefault(); stopContinuousAction(id); });
    btn.addEventListener('touchend',    e => { e.preventDefault(); stopContinuousAction(id); });
    btn.addEventListener('touchcancel', e => { e.preventDefault(); stopContinuousAction(id); });
  });
}

function startContinuousAction(id) {
  if (gameOver || !currentPiece) return;
  if (buttonIntervals[id]) clearInterval(buttonIntervals[id]);
  handleOverlayButton(id);
  buttonIntervals[id] = setInterval(() => {
    if (gameOver || !currentPiece) { stopContinuousAction(id); return; }
    handleOverlayButton(id);
  }, 100);
}

function stopContinuousAction(id) {
  if (buttonIntervals[id]) { clearInterval(buttonIntervals[id]); buttonIntervals[id] = null; }
}

function handleOverlayButton(id) {
  if (gameOver || !currentPiece) return;
  switch (id) {
    case 'up': case 'rotate': currentPiece.changeArrangement(1);               break;
    case 'left':  if (currentPiece.canMove(-1, 0)) currentPiece.x--;           break;
    case 'right': if (currentPiece.canMove(1,  0)) currentPiece.x++;           break;
    case 'down':  if (currentPiece.canMove(0,  1)) currentPiece.y++;           break;
    case 'm-plus':  currentPiece.changeArrangement(1);                         break;
    case 'm-minus': currentPiece.changeArrangement(-1);                        break;
  }
  drawBoard();
}

// ── Keyboard controls ─────────────────────────────────────────
document.addEventListener('keydown', e => {
  if (gameOver || !currentPiece) return;
  if (keyState[e.key]) return;
  keyState[e.key] = true;
  switch (e.key) {
    case 'ArrowLeft':  startContinuousKeyAction('ArrowLeft');  break;
    case 'ArrowRight': startContinuousKeyAction('ArrowRight'); break;
    case 'ArrowDown':  startContinuousKeyAction('ArrowDown');  break;
    case ' ': case 'r': currentPiece.changeArrangement(1);    break;
    case 'm':           currentPiece.changeArrangement(-1);   break;
  }
  drawBoard();
});

document.addEventListener('keyup', e => {
  keyState[e.key] = false;
  stopContinuousKeyAction(e.key);
});

function startContinuousKeyAction(key) {
  if (gameOver || !currentPiece) return;
  if (buttonIntervals[key]) clearInterval(buttonIntervals[key]);
  handleKeyAction(key);
  buttonIntervals[key] = setInterval(() => {
    if (gameOver || !currentPiece || !keyState[key]) { stopContinuousKeyAction(key); return; }
    handleKeyAction(key);
  }, 100);
}

function stopContinuousKeyAction(key) {
  if (buttonIntervals[key]) { clearInterval(buttonIntervals[key]); buttonIntervals[key] = null; }
}

function handleKeyAction(key) {
  switch (key) {
    case 'ArrowLeft':  if (currentPiece.canMove(-1, 0)) currentPiece.x--; break;
    case 'ArrowRight': if (currentPiece.canMove(1,  0)) currentPiece.x++; break;
    case 'ArrowDown':  if (currentPiece.canMove(0,  1)) currentPiece.y++; break;
  }
  drawBoard();
}

// ── Init ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initOverlayControls();
  nextPiece = createNewPiece();
  currentPiece = createNewPiece();
  startSpeedTimer();
  gameLoop();
});
