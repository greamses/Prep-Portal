import { CELL } from '../config/constants.js';
import { squareXY, squareCenter } from '../utils/helpers.js';

export class BoardRenderer {
    constructor(canvas, ctx, gameState) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.gameState = gameState;
    }
    
    drawBoard() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw squares
        for (let sq = 1; sq <= 64; sq++) {
            this.drawSquare(sq);
        }
        
        // Draw ladders and snakes
        Object.entries(this.gameState.ladders).forEach(([bot, top]) => {
            this.drawLadder(parseInt(bot), parseInt(top));
        });
        
        Object.entries(this.gameState.snakes).forEach(([head, tail]) => {
            this.drawSnake(parseInt(head), parseInt(tail));
        });
        
        this.drawPlayers();
    }
    
    drawSquare(sq) {
        const { x, y } = squareXY(sq, CELL);
        const isSnakeHead = sq in this.gameState.snakes;
        const isLadderBot = sq in this.gameState.ladders;
        
        let bg = (Math.floor((sq - 1) / 8) + (sq - 1)) % 2 === 0 ? '#ffffff' : '#f5f0e8';
        if (sq === 64) bg = '#ffe500';
        else if (sq === 1) bg = '#e8f5ec';
        else if (isSnakeHead) bg = '#fff2f2';
        else if (isLadderBot) bg = '#edfff5';
        
        this.ctx.fillStyle = bg;
        this.ctx.fillRect(x, y, CELL, CELL);
        this.ctx.strokeStyle = '#1a1a1a';
        this.ctx.lineWidth = 1.5;
        this.ctx.strokeRect(x, y, CELL, CELL);
        
        // Draw square number
        this.ctx.fillStyle = '#777';
        this.ctx.font = `700 18px 'JetBrains Mono', monospace`;
        this.ctx.textAlign = 'right';
        this.ctx.fillText(sq, x + CELL - 8, y + 24);
        
        // Draw special squares
        if (sq === 64) {
            this.ctx.fillStyle = '#1a1a1a';
            this.ctx.font = `900 26px 'Unbounded', sans-serif`;
            this.ctx.textAlign = 'center';
            this.ctx.fillText('WIN', x + CELL / 2, y + CELL / 2 - 6);
        } else if (sq === 1) {
            this.ctx.fillStyle = '#1a1a1a';
            this.ctx.font = `900 20px 'Unbounded', sans-serif`;
            this.ctx.textAlign = 'center';
            this.ctx.fillText("START", x + CELL / 2, y + CELL / 2 + 6);
        } else {
            const f = this.gameState.fractions[sq];
            if (f) this.drawCellFraction(f, x + CELL / 2, y + CELL / 2 + 6);
        }
    }
    
    drawCellFraction(f, cx, cy) {
        if (!f || f.d === 'W') return;
        const SIZE = 22;
        this.ctx.fillStyle = '#1a1a1a';
        
        if (f.d === 'M') {
            this.ctx.font = `bold ${SIZE + 6}px 'JetBrains Mono', monospace`;
            const wStr = String(f.w);
            const ww = this.ctx.measureText(wStr).width;
            this.ctx.font = `bold ${SIZE}px 'JetBrains Mono', monospace`;
            const fw = Math.max(
                this.ctx.measureText(String(f.n)).width, 
                this.ctx.measureText(String(f.dn)).width
            ) + 6;
            const totalW = ww + 6 + fw;
            const startX = cx - totalW / 2;
            
            this.ctx.font = `bold ${SIZE + 6}px 'JetBrains Mono', monospace`;
            this.ctx.textAlign = 'left';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(wStr, startX, cy + 1);
            this.ctx.textBaseline = 'alphabetic';
            this.drawStackedFrac(f.n, f.dn, startX + ww + 6 + fw / 2, cy, SIZE);
        } else {
            this.drawStackedFrac(f.n, f.dn, cx, cy, SIZE);
        }
    }
    
    drawStackedFrac(num, den, cx, cy, size) {
        const numStr = String(num);
        const denStr = String(den);
        this.ctx.font = `bold ${size}px 'JetBrains Mono', monospace`;
        const nw = this.ctx.measureText(numStr).width;
        const dw = this.ctx.measureText(denStr).width;
        const lineW = Math.max(nw, dw) + 6;
        
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'bottom';
        this.ctx.fillText(numStr, cx, cy - 2);
        this.ctx.textBaseline = 'top';
        this.ctx.fillText(denStr, cx, cy + 3);
        this.ctx.textBaseline = 'alphabetic';
        this.ctx.fillRect(cx - lineW / 2, cy - 1, lineW, 2.5);
    }
    
    drawLadder(bot, top) {
        const b = squareCenter(bot, CELL);
        const t = squareCenter(top, CELL);
        const dx = t.x - b.x;
        const dy = t.y - b.y;
        const len = Math.hypot(dx, dy);
        const ang = Math.atan2(dy, dx);
        
        this.ctx.save();
        this.ctx.translate(b.x, b.y);
        this.ctx.rotate(ang);
        
        const railW = 16;
        const halfSpread = 22;
        
        // Shadow rails
        this.ctx.fillStyle = 'rgba(0,0,0,0.35)';
        this.ctx.fillRect(0, -halfSpread - railW / 2 + 8, len, railW);
        this.ctx.fillRect(0, halfSpread - railW / 2 + 8, len, railW);
        
        // Wood gradient
        const woodG = this.ctx.createLinearGradient(0, -halfSpread - railW / 2, 0, -halfSpread + railW / 2);
        woodG.addColorStop(0, '#5c3a21');
        woodG.addColorStop(0.5, '#8b5a2b');
        woodG.addColorStop(1, '#4a2f1d');
        
        // Draw rungs
        const steps = Math.floor(len / 35);
        for (let i = 1; i < steps; i++) {
            const rx = (len / steps) * i;
            this.ctx.fillStyle = 'rgba(0,0,0,0.35)';
            this.ctx.fillRect(rx - 3, -halfSpread + 4, 10, halfSpread * 2);
            
            const rungG = this.ctx.createLinearGradient(rx - 4, 0, rx + 4, 0);
            rungG.addColorStop(0, '#704523');
            rungG.addColorStop(1, '#4a2f1d');
            this.ctx.fillStyle = rungG;
            this.ctx.fillRect(rx - 4, -halfSpread, 8, halfSpread * 2);
        }
        
        // Draw rails
        this.ctx.fillStyle = woodG;
        this.ctx.fillRect(-8, -halfSpread - railW / 2, len + 16, railW);
        
        const woodG2 = this.ctx.createLinearGradient(0, halfSpread - railW / 2, 0, halfSpread + railW / 2);
        woodG2.addColorStop(0, '#5c3a21');
        woodG2.addColorStop(0.5, '#8b5a2b');
        woodG2.addColorStop(1, '#4a2f1d');
        this.ctx.fillStyle = woodG2;
        this.ctx.fillRect(-8, halfSpread - railW / 2, len + 16, railW);
        
        this.ctx.restore();
    }
    
    drawSnake(head, tail) {
        const h = squareCenter(head, CELL);
        const t = squareCenter(tail, CELL);
        const dist = Math.hypot(h.x - t.x, h.y - t.y);
        const offset = dist * 0.35;
        
        const cp1x = h.x + (t.x > h.x ? offset : -offset);
        const cp1y = h.y + offset;
        const cp2x = t.x + (t.x > h.x ? -offset : offset);
        const cp2y = t.y - offset;
        
        const baseCol = this.gameState.snakeColors[head] || '#27ae60';
        
        this.ctx.save();
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        
        // Shadow
        this.ctx.shadowColor = 'rgba(0,0,0,0.4)';
        this.ctx.shadowBlur = 12;
        this.ctx.shadowOffsetX = 6;
        this.ctx.shadowOffsetY = 6;
        this.ctx.beginPath();
        this.ctx.moveTo(h.x, h.y);
        this.ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, t.x, t.y);
        this.ctx.lineWidth = 30;
        this.ctx.strokeStyle = baseCol;
        this.ctx.stroke();
        
        this.ctx.shadowColor = 'transparent';
        
        // Pattern
        this.ctx.beginPath();
        this.ctx.moveTo(h.x, h.y);
        this.ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, t.x, t.y);
        this.ctx.lineWidth = 24;
        this.ctx.setLineDash([12, 12]);
        this.ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        this.ctx.stroke();
        this.ctx.setLineDash([]);
        
        // Center line
        this.ctx.beginPath();
        this.ctx.moveTo(h.x, h.y);
        this.ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, t.x, t.y);
        this.ctx.lineWidth = 6;
        this.ctx.strokeStyle = 'rgba(255,235,100,0.6)';
        this.ctx.stroke();
        
        // Head
        const headAng = Math.atan2(cp1y - h.y, cp1x - h.x);
        this.drawSnakeHead(h.x, h.y, headAng, baseCol);
        
        // Tail
        this.ctx.beginPath();
        this.ctx.arc(t.x, t.y, 15, 0, Math.PI * 2);
        this.ctx.fillStyle = baseCol;
        this.ctx.fill();
        
        this.ctx.restore();
    }
    
    drawSnakeHead(x, y, ang, color) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(ang);
        
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.moveTo(-18, -18);
        this.ctx.quadraticCurveTo(25, -25, 30, 0);
        this.ctx.quadraticCurveTo(25, 25, -18, 18);
        this.ctx.closePath();
        this.ctx.fill();
        
        // Eyes
        this.ctx.fillStyle = '#f1c40f';
        this.ctx.beginPath();
        this.ctx.arc(8, -10, 5, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.arc(8, 10, 5, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.fillStyle = '#1a1a1a';
        this.ctx.beginPath();
        this.ctx.arc(10, -10, 2.5, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.arc(10, 10, 2.5, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Tongue
        this.ctx.strokeStyle = '#e74c3c';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(30, 0);
        this.ctx.lineTo(48, 0);
        this.ctx.moveTo(48, 0);
        this.ctx.lineTo(54, -5);
        this.ctx.moveTo(48, 0);
        this.ctx.lineTo(54, 5);
        this.ctx.stroke();
        
        this.ctx.restore();
    }
    
    drawPlayers() {
        this.gameState.players.forEach((p, i) => {
            const isDragging = (this.gameState.dragState.isDragging && 
                               this.gameState.dragState.pi === i);
            const px = p.drawX;
            const py = p.drawY;
            const radius = isDragging ? 28 : 22;
            
            this.ctx.save();
            
            // Shadow
            this.ctx.fillStyle = 'rgba(0,0,0,0.3)';
            this.ctx.beginPath();
            this.ctx.ellipse(px + 4, py + (isDragging ? 20 : 12), 
                            radius * 0.8, radius * 0.4, 0, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Token
            this.ctx.fillStyle = p.color;
            this.ctx.strokeStyle = '#1a1a1a';
            this.ctx.lineWidth = 4;
            this.ctx.beginPath();
            this.ctx.arc(px, py, radius, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.stroke();
            
            // Highlight
            this.ctx.strokeStyle = 'rgba(255,255,255,0.4)';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.arc(px, py, radius - 6, 0, Math.PI * 2);
            this.ctx.stroke();
            
            // Player name
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = `900 ${isDragging ? 18 : 14}px 'Unbounded', sans-serif`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(p.name, px, py + 1);
            
            this.ctx.restore();
        });
    }
    
    snapToken(pi, targetSq) {
        const c = squareCenter(targetSq, CELL);
        const offsets = [{ dx: -22, dy: -18 }, { dx: 22, dy: 18 }];
        this.gameState.players[pi].drawX = c.x + offsets[pi].dx;
        this.gameState.players[pi].drawY = c.y + offsets[pi].dy;
        this.drawBoard();
    }
}