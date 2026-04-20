import { GameState } from '../config/constants.js';
import { squareCenter } from '../utils/helpers.js';
import { CELL } from '../config/constants.js';

export class MovementManager {
  constructor(gameState, renderer, onMoveComplete) {
    this.gameState = gameState;
    this.renderer = renderer;
    this.onMoveComplete = onMoveComplete;
  }
  
  animateToken(pi, startSq, targetSq, callback) {
    const start = squareCenter(startSq, CELL);
    const end = squareCenter(targetSq, CELL);
    const p = this.gameState.players[pi];
    const offsets = [{ dx: -22, dy: -18 }, { dx: 22, dy: 18 }];
    
    let startX = start.x + offsets[pi].dx;
    let startY = start.y + offsets[pi].dy;
    let endX = end.x + offsets[pi].dx;
    let endY = end.y + offsets[pi].dy;
    
    let startTime = null;
    const duration = 600;
    
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      
      p.drawX = startX + (endX - startX) * ease;
      p.drawY = startY + (endY - startY) * ease;
      this.renderer.drawBoard();
      
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        callback();
      }
    };
    
    requestAnimationFrame(step);
  }
  
  processMove(pi, targetSquare) {
    this.gameState.players[pi].pos = targetSquare;
    
    // Check for snake or ladder
    if (targetSquare in this.gameState.snakes) {
      return { type: 'snake', destination: this.gameState.snakes[targetSquare] };
    } else if (targetSquare in this.gameState.ladders) {
      return { type: 'ladder', destination: this.gameState.ladders[targetSquare] };
    } else if (targetSquare === 64) {
      return { type: 'win', destination: 64 };
    } else {
      return { type: 'normal', destination: targetSquare };
    }
  }
  
  handleAutoMove(pi, startPos, targetPos) {
    this.animateToken(pi, startPos, targetPos, () => {
      this.gameState.players[pi].pos = targetPos;
      this.onMoveComplete(pi, targetPos);
    });
  }
}