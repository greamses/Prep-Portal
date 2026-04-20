import { CELL } from './config.js';
import { DOM, boardData, players, gameState } from './state.js';
import { squareXY, squareCenter } from './utils.js';

export function drawBoard() {
  if (!DOM.ctx) return;
  DOM.ctx.clearRect(0, 0, DOM.canvas.width, DOM.canvas.height);
  
  for (let sq = 1; sq <= 64; sq++) {
    const { x, y } = squareXY(sq);
    const isSnakeHead = sq in boardData.SNAKES;
    const isLadderBot = sq in boardData.LADDERS;
    
    let bg = (Math.floor((sq - 1) / 8) + (sq - 1)) % 2 === 0 ? '#ffffff' : '#f5f0e8';
    if (sq === 64) bg = '#ffe500';
    else if (sq === 1) bg = '#e8f5ec';
    else if (isSnakeHead) bg = '#fff2f2';
    else if (isLadderBot) bg = '#edfff5';
    
    DOM.ctx.fillStyle = bg;
    DOM.ctx.fillRect(x, y, CELL, CELL);
    DOM.ctx.strokeStyle = '#1a1a1a';
    DOM.ctx.lineWidth = 1.5;
    DOM.ctx.strokeRect(x, y, CELL, CELL);
    
    DOM.ctx.fillStyle = '#777';
    DOM.ctx.font = `700 18px 'JetBrains Mono', monospace`;
    DOM.ctx.textAlign = 'right';
    DOM.ctx.fillText(sq, x + CELL - 8, y + 24);
    
    if (sq === 64) {
      DOM.ctx.fillStyle = '#1a1a1a';
      DOM.ctx.font = `900 26px 'Unbounded', sans-serif`;
      DOM.ctx.textAlign = 'center';
      DOM.ctx.fillText('WIN', x + CELL / 2, y + CELL / 2 - 6);
      DOM.ctx.font = `400 15px 'Unbounded', sans-serif`;
      DOM.ctx.fillText('SQUARE 64', x + CELL / 2, y + CELL / 2 + 20);
    } else if (sq === 1) {
      DOM.ctx.fillStyle = '#1a1a1a';
      DOM.ctx.font = `900 20px 'Unbounded', sans-serif`;
      DOM.ctx.textAlign = 'center';
      DOM.ctx.fillText("START", x + CELL / 2, y + CELL / 2 + 6);
    } else {
      const f = boardData.FRAC[sq];
      if (f) drawCellFraction(f, x + CELL / 2, y + CELL / 2 + 6);
    }
  }
  
  for (const [bot, top] of Object.entries(boardData.LADDERS)) drawLadder(parseInt(bot), parseInt(top));
  for (const [head, tail] of Object.entries(boardData.SNAKES)) drawSnake(parseInt(head), parseInt(tail));
  drawPlayers();
}

export function drawLadder(bot, top) {
  const b = squareCenter(bot);
  const t = squareCenter(top);
  const dx = t.x - b.x;
  const dy = t.y - b.y;
  const len = Math.hypot(dx, dy);
  const ang = Math.atan2(dy, dx);
  
  DOM.ctx.save();
  DOM.ctx.translate(b.x, b.y);
  DOM.ctx.rotate(ang);
  
  const railW = 16;
  const halfSpread = 22;
  
  DOM.ctx.fillStyle = 'rgba(0,0,0,0.35)';
  DOM.ctx.fillRect(0, -halfSpread - railW / 2 + 8, len, railW);
  DOM.ctx.fillRect(0, halfSpread - railW / 2 + 8, len, railW);
  
  const woodG = DOM.ctx.createLinearGradient(0, -halfSpread - railW / 2, 0, -halfSpread + railW / 2);
  woodG.addColorStop(0, '#5c3a21');
  woodG.addColorStop(0.5, '#8b5a2b');
  woodG.addColorStop(1, '#4a2f1d');
  
  const steps = Math.floor(len / 35);
  for (let i = 1; i < steps; i++) {
    const rx = (len / steps) * i;
    DOM.ctx.fillStyle = 'rgba(0,0,0,0.35)';
    DOM.ctx.fillRect(rx - 3, -halfSpread + 4, 10, halfSpread * 2);
    
    const rungG = DOM.ctx.createLinearGradient(rx - 4, 0, rx + 4, 0);
    rungG.addColorStop(0, '#704523');
    rungG.addColorStop(1, '#4a2f1d');
    DOM.ctx.fillStyle = rungG;
    DOM.ctx.fillRect(rx - 4, -halfSpread, 8, halfSpread * 2);
  }
  
  DOM.ctx.fillStyle = woodG;
  DOM.ctx.fillRect(-8, -halfSpread - railW / 2, len + 16, railW);
  const woodG2 = DOM.ctx.createLinearGradient(0, halfSpread - railW / 2, 0, halfSpread + railW / 2);
  woodG2.addColorStop(0, '#5c3a21');
  woodG2.addColorStop(0.5, '#8b5a2b');
  woodG2.addColorStop(1, '#4a2f1d');
  DOM.ctx.fillStyle = woodG2;
  DOM.ctx.fillRect(-8, halfSpread - railW / 2, len + 16, railW);
  
  DOM.ctx.restore();
}

export function drawSnake(head, tail) {
  const h = squareCenter(head);
  const t = squareCenter(tail);
  const dist = Math.hypot(h.x - t.x, h.y - t.y);
  const offset = dist * 0.35;
  
  const cp1x = h.x + (t.x > h.x ? offset : -offset);
  const cp1y = h.y + offset;
  const cp2x = t.x + (t.x > h.x ? -offset : offset);
  const cp2y = t.y - offset;
  
  const baseCol = boardData.SNAKE_COLORS[head] || '#27ae60';
  
  DOM.ctx.save();
  DOM.ctx.lineCap = 'round';
  DOM.ctx.lineJoin = 'round';
  
  DOM.ctx.shadowColor = 'rgba(0,0,0,0.4)';
  DOM.ctx.shadowBlur = 12;
  DOM.ctx.shadowOffsetX = 6;
  DOM.ctx.shadowOffsetY = 6;
  DOM.ctx.beginPath();
  DOM.ctx.moveTo(h.x, h.y);
  DOM.ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, t.x, t.y);
  DOM.ctx.lineWidth = 30;
  DOM.ctx.strokeStyle = baseCol;
  DOM.ctx.stroke();
  
  DOM.ctx.shadowColor = 'transparent';
  
  DOM.ctx.beginPath();
  DOM.ctx.moveTo(h.x, h.y);
  DOM.ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, t.x, t.y);
  DOM.ctx.lineWidth = 24;
  DOM.ctx.setLineDash([12, 12]);
  DOM.ctx.strokeStyle = 'rgba(255,255,255,0.2)';
  DOM.ctx.stroke();
  DOM.ctx.setLineDash([]);
  
  DOM.ctx.beginPath();
  DOM.ctx.moveTo(h.x, h.y);
  DOM.ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, t.x, t.y);
  DOM.ctx.lineWidth = 6;
  DOM.ctx.strokeStyle = 'rgba(255,235,100,0.6)';
  DOM.ctx.stroke();
  
  const headAng = Math.atan2(cp1y - h.y, cp1x - h.x);
  drawSnakeHead(h.x, h.y, headAng, baseCol);
  
  DOM.ctx.beginPath();
  DOM.ctx.arc(t.x, t.y, 15, 0, Math.PI * 2);
  DOM.ctx.fillStyle = baseCol;
  DOM.ctx.fill();
  
  DOM.ctx.restore();
}

export function drawSnakeHead(x, y, ang, color) {
  DOM.ctx.save();
  DOM.ctx.translate(x, y);
  DOM.ctx.rotate(ang);
  
  DOM.ctx.fillStyle = color;
  DOM.ctx.beginPath();
  DOM.ctx.moveTo(-18, -18);
  DOM.ctx.quadraticCurveTo(25, -25, 30, 0);
  DOM.ctx.quadraticCurveTo(25, 25, -18, 18);
  DOM.ctx.closePath();
  DOM.ctx.fill();
  
  DOM.ctx.fillStyle = '#f1c40f';
  DOM.ctx.beginPath();
  DOM.ctx.arc(8, -10, 5, 0, Math.PI * 2);
  DOM.ctx.fill();
  DOM.ctx.beginPath();
  DOM.ctx.arc(8, 10, 5, 0, Math.PI * 2);
  DOM.ctx.fill();
  DOM.ctx.fillStyle = '#1a1a1a';
  DOM.ctx.beginPath();
  DOM.ctx.arc(10, -10, 2.5, 0, Math.PI * 2);
  DOM.ctx.fill();
  DOM.ctx.beginPath();
  DOM.ctx.arc(10, 10, 2.5, 0, Math.PI * 2);
  DOM.ctx.fill();
  
  DOM.ctx.strokeStyle = '#e74c3c';
  DOM.ctx.lineWidth = 3;
  DOM.ctx.beginPath();
  DOM.ctx.moveTo(30, 0);
  DOM.ctx.lineTo(48, 0);
  DOM.ctx.moveTo(48, 0);
  DOM.ctx.lineTo(54, -5);
  DOM.ctx.moveTo(48, 0);
  DOM.ctx.lineTo(54, 5);
  DOM.ctx.stroke();
  
  DOM.ctx.restore();
}

export function drawPlayers() {
  players.forEach((p, i) => {
    const isDragging = (gameState.dragState.isDragging && gameState.dragState.pi === i);
    const px = p.drawX;
    const py = p.drawY;
    const radius = isDragging ? 28 : 22;
    
    DOM.ctx.save();
    DOM.ctx.fillStyle = 'rgba(0,0,0,0.3)';
    DOM.ctx.beginPath();
    DOM.ctx.ellipse(px + 4, py + (isDragging ? 20 : 12), radius * 0.8, radius * 0.4, 0, 0, Math.PI * 2);
    DOM.ctx.fill();
    
    DOM.ctx.fillStyle = p.color;
    DOM.ctx.strokeStyle = '#1a1a1a';
    DOM.ctx.lineWidth = 4;
    DOM.ctx.beginPath();
    DOM.ctx.arc(px, py, radius, 0, Math.PI * 2);
    DOM.ctx.fill();
    DOM.ctx.stroke();
    
    DOM.ctx.strokeStyle = 'rgba(255,255,255,0.4)';
    DOM.ctx.lineWidth = 2;
    DOM.ctx.beginPath();
    DOM.ctx.arc(px, py, radius - 6, 0, Math.PI * 2);
    DOM.ctx.stroke();
    
    DOM.ctx.fillStyle = '#ffffff';
    DOM.ctx.font = `900 ${isDragging ? 18 : 14}px 'Unbounded', sans-serif`;
    DOM.ctx.textAlign = 'center';
    DOM.ctx.textBaseline = 'middle';
    DOM.ctx.fillText(players[i].name, px, py + 1);
    DOM.ctx.restore();
  });
}

export function drawStackedFrac(num, den, cx, cy, size) {
  const numStr = String(num);
  const denStr = String(den);
  DOM.ctx.font = `bold ${size}px 'JetBrains Mono', monospace`;
  const nw = DOM.ctx.measureText(numStr).width;
  const dw = DOM.ctx.measureText(denStr).width;
  const lineW = Math.max(nw, dw) + 6;
  
  DOM.ctx.textAlign = 'center';
  DOM.ctx.textBaseline = 'bottom';
  DOM.ctx.fillText(numStr, cx, cy - 2);
  DOM.ctx.textBaseline = 'top';
  DOM.ctx.fillText(denStr, cx, cy + 3);
  DOM.ctx.textBaseline = 'alphabetic';
  DOM.ctx.fillRect(cx - lineW / 2, cy - 1, lineW, 2.5);
}

export function drawCellFraction(f, cx, cy) {
  if (!f || f.d === 'W') return;
  const SIZE = 22;
  DOM.ctx.fillStyle = '#1a1a1a';
  
  if (f.d === 'M') {
    DOM.ctx.font = `bold ${SIZE + 6}px 'JetBrains Mono', monospace`;
    const wStr = String(f.w);
    const ww = DOM.ctx.measureText(wStr).width;
    DOM.ctx.font = `bold ${SIZE}px 'JetBrains Mono', monospace`;
    const fw = Math.max(DOM.ctx.measureText(String(f.n)).width, DOM.ctx.measureText(String(f.dn)).width) + 6;
    const totalW = ww + 6 + fw;
    const startX = cx - totalW / 2;
    
    DOM.ctx.font = `bold ${SIZE + 6}px 'JetBrains Mono', monospace`;
    DOM.ctx.textAlign = 'left';
    DOM.ctx.textBaseline = 'middle';
    DOM.ctx.fillText(wStr, startX, cy + 1);
    DOM.ctx.textBaseline = 'alphabetic';
    drawStackedFrac(f.n, f.dn, startX + ww + 6 + fw / 2, cy, SIZE);
  } else {
    drawStackedFrac(f.n, f.dn, cx, cy, SIZE);
  }
}