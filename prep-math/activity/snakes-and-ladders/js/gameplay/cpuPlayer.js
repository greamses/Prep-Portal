export class CPUPlayer {
  constructor(gameState, movementManager, fractionManager, cardManager) {
    this.gameState = gameState;
    this.movementManager = movementManager;
    this.fractionManager = fractionManager;
    this.cardManager = cardManager;
  }
  
  takeTurn() {
    const currentPlayer = this.gameState.getCurrentPlayer();
    let target = currentPlayer.pos + this.gameState.currentRoll;
    
    this.movementManager.animateToken(1, currentPlayer.pos, target, () => {
      this.gameState.players[1].pos = target;
      this.processMoveResult(target);
    });
  }
  
  processMoveResult(sq) {
    const moveResult = this.movementManager.processMove(1, sq);
    
    switch (moveResult.type) {
      case 'snake':
        this.modalManager.addLogMessage(`OH NO! A snake!`, 'snake');
        setTimeout(() => {
          this.movementManager.animateToken(1, sq, moveResult.destination, () => {
            this.gameState.players[1].pos = moveResult.destination;
            this.fractionManager.checkFraction(1, moveResult.destination);
          });
        }, 700);
        break;
        
      case 'ladder':
        this.modalManager.addLogMessage(`YAY! A ladder!`, 'ladder');
        setTimeout(() => {
          this.movementManager.animateToken(1, sq, moveResult.destination, () => {
            this.gameState.players[1].pos = moveResult.destination;
            this.fractionManager.checkFraction(1, moveResult.destination);
          });
        }, 700);
        break;
        
      case 'win':
        // Win handled by main game
        break;
        
      default:
        this.fractionManager.checkFraction(1, sq);
    }
  }
  
  evaluateCardUse(card) {
    return this.cardManager.evaluateCardTactics(
      card,
      1,
      this.gameState.cpuIntel
    );
  }
}