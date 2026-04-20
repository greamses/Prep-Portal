import { GameState } from '../config/constants.js';

export class TurnManager {
  constructor(gameState, modalManager, onCPUTurn, onPlayerTurn) {
    this.gameState = gameState;
    this.modalManager = modalManager;
    this.onCPUTurn = onCPUTurn;
    this.onPlayerTurn = onPlayerTurn;
  }
  
  startTurn() {
    this.updateHUD();
    
    if (this.gameState.vsCPU && this.gameState.turn === 1) {
      this.gameState.state = GameState.CPU_THINKING;
      this.modalManager.addLogMessage(
        `${this.gameState.players[1].name} is thinking...`,
        'info'
      );
      setTimeout(() => this.onCPUTurn(), 1200);
    } else {
      this.gameState.state = GameState.WAITING_ROLL;
      this.modalManager.addLogMessage(
        `${this.gameState.getCurrentPlayer().name}'s turn. Drag dice or double-tap to roll.`,
        'info'
      );
      this.onPlayerTurn();
    }
  }
  
  executeRoll() {
    if ((this.gameState.state !== GameState.WAITING_ROLL &&
        this.gameState.state !== GameState.CPU_THINKING) ||
      !this.gameState.gameActive) return;
    
    this.gameState.state = GameState.ROLLING;
    this.gameState.currentRoll = Math.floor(Math.random() * 6) + 1;
    
    // Animate dice
    this.roll3DDice(this.gameState.currentRoll);
    
    setTimeout(() => {
      if (!this.gameState.gameActive) return;
      
      const currentPlayer = this.gameState.getCurrentPlayer();
      let target = currentPlayer.pos + this.gameState.currentRoll;
      
      if (target > 64) {
        this.modalManager.addLogMessage(
          `${currentPlayer.name} rolled a ${this.gameState.currentRoll} but cannot move (needs exactly ${64 - currentPlayer.pos} to win).`,
          'error'
        );
        this.endTurn();
        return;
      }
      
      if (this.gameState.vsCPU && this.gameState.turn === 1) {
        this.modalManager.addLogMessage(
          `${currentPlayer.name} rolled a ${this.gameState.currentRoll}!`,
          'action'
        );
        // CPU move handled by CPUPlayer
      } else {
        if (this.gameState.autoMove) {
          this.modalManager.addLogMessage(
            `${currentPlayer.name} rolled a ${this.gameState.currentRoll}! Token moving automatically.`,
            'action'
          );
          // Auto-move handled by movement manager
        } else {
          this.gameState.expectedSquare = target;
          this.gameState.state = GameState.WAITING_DRAG;
          this.modalManager.addLogMessage(
            `${currentPlayer.name} rolled a ${this.gameState.currentRoll}! Drag token to square ${target}.`,
            'action'
          );
        }
      }
    }, 600);
  }
  
  roll3DDice(result) {
    const cube = document.getElementById('cube');
    if (!cube) return;
    
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
  
  endTurn() {
    this.gameState.nextTurn();
    this.startTurn();
  }
  
  updateHUD() {
    const player = this.gameState.getCurrentPlayer();
    this.modalManager.updateHUD(player.name, player.color);
  }
}