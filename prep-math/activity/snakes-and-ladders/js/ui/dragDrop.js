import { GameState } from '../config/constants.js';
import { getCanvasPoint, getSquareFromPoint } from '../utils/helpers.js';
import { CELL } from '../config/constants.js';

export class DragDropManager {
  constructor(canvas, gameState, renderer, onValidDrop, onInvalidDrop) {
    this.canvas = canvas;
    this.gameState = gameState;
    this.renderer = renderer;
    this.onValidDrop = onValidDrop;
    this.onInvalidDrop = onInvalidDrop;
    this.diceDragState = { isDragging: false, startX: 0, startY: 0, origX: 0, origY: 0 };
    this.lastTapTime = 0;
    
    this.setupEventListeners();
  }
  
  setupEventListeners() {
    this.canvas.addEventListener('pointerdown', (e) => this.handlePointerDown(e));
    window.addEventListener('pointermove', (e) => this.handlePointerMove(e));
    window.addEventListener('pointerup', (e) => this.handlePointerUp(e));
  }
  
  handlePointerDown(e) {
    if (!this.gameState.gameActive) return;
    
    if (this.gameState.state === GameState.WAITING_DRAG ||
      this.gameState.state === GameState.WAITING_DRAG_SNAKELADDER) {
      
      const pt = getCanvasPoint(e, this.canvas);
      const p = this.gameState.getCurrentPlayer();
      
      if (Math.hypot(pt.x - p.drawX, pt.y - p.drawY) < 50) {
        this.gameState.dragState = {
          isDragging: true,
          pi: this.gameState.turn
        };
        if (e.preventDefault) e.preventDefault();
        this.renderer.drawBoard();
      }
    }
  }
  
  handlePointerMove(e) {
    if (this.gameState.dragState.isDragging && this.gameState.gameActive) {
      const pt = getCanvasPoint(e, this.canvas);
      const pi = this.gameState.dragState.pi;
      this.gameState.players[pi].drawX = pt.x;
      this.gameState.players[pi].drawY = pt.y;
      this.renderer.drawBoard();
    }
  }
  
  handlePointerUp(e) {
    if (this.gameState.dragState.isDragging && this.gameState.gameActive) {
      const pi = this.gameState.dragState.pi;
      this.gameState.dragState = { isDragging: false, pi: -1 };
      
      const pt = getCanvasPoint(e, this.canvas);
      const dropSquare = getSquareFromPoint(pt.x, pt.y, CELL);
      
      if (dropSquare === this.gameState.expectedSquare) {
        const p = this.gameState.players[pi];
        p.pos = this.gameState.expectedSquare;
        this.renderer.snapToken(pi, p.pos);
        this.onValidDrop(pi, p.pos);
      } else {
        this.onInvalidDrop();
        this.renderer.snapToken(pi, this.gameState.players[pi].pos);
      }
    }
  }
  
  setupDiceDrag(diceScene, gameWrapper, onRoll) {
    diceScene.addEventListener('pointerdown', (e) => {
      if (!this.gameState.gameActive || this.gameState.state !== GameState.WAITING_ROLL) return;
      
      const now = Date.now();
      if (now - this.lastTapTime < 400) {
        onRoll();
        this.lastTapTime = 0;
        e.preventDefault();
        return;
      }
      this.lastTapTime = now;
      
      const rect = diceScene.getBoundingClientRect();
      this.diceDragState = {
        isDragging: true,
        startX: e.clientX,
        startY: e.clientY,
        origX: e.clientX,
        origY: e.clientY
      };
      
      diceScene.classList.add('dragging');
      diceScene.style.right = 'auto';
      diceScene.style.left = rect.left + 'px';
      diceScene.style.top = rect.top + 'px';
      
      e.preventDefault();
    });
    
    window.addEventListener('pointermove', (e) => {
      if (!this.diceDragState.isDragging) return;
      
      const dx = e.clientX - this.diceDragState.startX;
      const dy = e.clientY - this.diceDragState.startY;
      const wrapperRect = gameWrapper.getBoundingClientRect();
      const currentLeft = parseFloat(diceScene.style.left);
      const currentTop = parseFloat(diceScene.style.top);
      
      diceScene.style.left = Math.max(0, Math.min(wrapperRect.width - 60, currentLeft + dx)) + 'px';
      diceScene.style.top = Math.max(0, Math.min(wrapperRect.height - 60, currentTop + dy)) + 'px';
      
      this.diceDragState.startX = e.clientX;
      this.diceDragState.startY = e.clientY;
    });
    
    window.addEventListener('pointerup', (e) => {
      if (!this.diceDragState.isDragging) return;
      
      diceScene.classList.remove('dragging');
      this.diceDragState.isDragging = false;
      
      const dist = Math.hypot(
        e.clientX - this.diceDragState.origX,
        e.clientY - this.diceDragState.origY
      );
      
      if (dist > 15 && this.gameState.state === GameState.WAITING_ROLL) {
        onRoll();
      }
    });
  }
}