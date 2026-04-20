import { GameState, PLAYER_OFFSETS } from '../config/constants.js';
import { squareCenter } from '../utils/helpers.js';
import { CELL } from '../config/constants.js';

class GameStateManager {
  constructor() {
    this.state = GameState.WAITING_ROLL;
    this.players = [
      { pos: 1, color: '#0055ff', name: 'P1', drawX: 0, drawY: 0 },
      { pos: 1, color: '#ff2200', name: 'P2', drawX: 0, drawY: 0 }
    ];
    this.turn = 0;
    this.vsCPU = false;
    this.cpuIntel = 'advanced';
    this.autoMove = false;
    this.gameActive = false;
    this.currentRoll = 0;
    this.expectedSquare = null;
    
    // Board data
    this.fractions = {};
    this.snakes = {};
    this.snakeColors = {};
    this.ladders = {};
    
    // Fraction state
    this.currentFracPlayer = 0;
    this.currentFracAttempts = 0;
    this.currentFracData = null;
    this.isProcessingAnswer = false;
    
    // UI state
    this.logActive = false;
    this.dragState = { isDragging: false, pi: -1 };
  }
  
  initializePlayerPositions() {
    this.players.forEach((p, i) => {
      p.pos = 1;
      const c = squareCenter(1, CELL);
      p.drawX = c.x + PLAYER_OFFSETS[i].dx;
      p.drawY = c.y + PLAYER_OFFSETS[i].dy;
    });
  }
  
  reset() {
    this.state = GameState.WAITING_ROLL;
    this.turn = 0;
    this.gameActive = true;
    this.currentRoll = 0;
    this.expectedSquare = null;
    this.currentFracAttempts = 0;
    this.currentFracData = null;
    this.isProcessingAnswer = false;
    this.logActive = false;
    this.dragState = { isDragging: false, pi: -1 };
    this.initializePlayerPositions();
  }
  
  setBoardData({ snakes, snakeColors, ladders, fractions }) {
    this.snakes = snakes;
    this.snakeColors = snakeColors;
    this.ladders = ladders;
    this.fractions = fractions;
  }
  
  nextTurn() {
    this.turn = 1 - this.turn;
  }
  
  getCurrentPlayer() {
    return this.players[this.turn];
  }
  
  getOpponent() {
    return this.players[1 - this.turn];
  }
}

export const gameState = new GameStateManager();