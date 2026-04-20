import { BOARD_SIZE, CELL, GameState } from './config/constants.js';
import { gameState } from './core/gameState.js';
import { generateRandomBoard } from './core/boardGenerator.js';
import { BoardRenderer } from './ui/renderer.js';
import { DragDropManager } from './ui/dragDrop.js';
import { ModalManager } from './ui/modals.js';
import { MovementManager } from './gameplay/movement.js';
import { CardManager } from './gameplay/cards.js';
import { FractionManager } from './gameplay/fractions.js';
import { CPUPlayer } from './gameplay/cpuPlayer.js';
import { TurnManager } from './gameplay/turns.js';

class SnakesAndLaddersGame {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.renderer = null;
        this.dragDropManager = null;
        this.modalManager = null;
        this.movementManager = null;
        this.cardManager = null;
        this.fractionManager = null;
        this.cpuPlayer = null;
        this.turnManager = null;
        
        this.uiElements = {};
        this.isInitialized = false;
    }
    
    initialize() {
        this.captureUIElements();
        this.setupCanvas();
        
        // Initialize managers
        this.renderer = new BoardRenderer(this.canvas, this.ctx, gameState);
        this.modalManager = new ModalManager();
        this.movementManager = new MovementManager(gameState, this.renderer, 
            (pi, pos) => this.onMoveComplete(pi, pos));
        this.cardManager = new CardManager(gameState, 
            () => this.turnManager.endTurn());
        this.fractionManager = new FractionManager(gameState, this.modalManager,
            (pi) => this.cardManager.showStandardCard(pi),
            (pi) => this.cardManager.showBonusCards(pi),
            () => this.turnManager.endTurn());
        this.cpuPlayer = new CPUPlayer(gameState, this.movementManager, 
            this.fractionManager, this.cardManager);
        this.turnManager = new TurnManager(gameState, this.modalManager,
            () => this.cpuPlayer.takeTurn(),
            () => this.startPlayerTurn());
        
        this.dragDropManager = new DragDropManager(this.canvas, gameState, 
            this.renderer,
            (pi, pos) => this.handleValidDrop(pi, pos),
            () => this.handleInvalidDrop());
        
        this.setupModalCallbacks();
        this.setupDice();
        this.setupFullscreen();
        
        this.isInitialized = true;
    }
    
    captureUIElements() {
        this.uiElements = {
            gameModal: document.getElementById('game-modal'),
            gameFeedback: document.getElementById('game-feedback'),
            dtHint: document.getElementById('dtHint'),
            winOverlay: document.getElementById('winOverlay'),
            cube: document.getElementById('cube'),
            gameWrapper: document.getElementById('gameWrapper'),
            diceScene: document.getElementById('diceScene'),
            fullscreenBtn: document.getElementById('fullscreen-btn'),
            fullscreenBtnEnter: document.getElementById('fullscreen-btn-enter')
        };
    }
    
    setupCanvas() {
        this.canvas = document.getElementById('boardCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = BOARD_SIZE;
        this.canvas.height = BOARD_SIZE;
    }
    
    setupModalCallbacks() {
        this.modalManager.callbacks = {
            onOpponentChange: (isCPU) => {
                gameState.vsCPU = isCPU;
                gameState.players[1].name = isCPU ? "CPU" : "P2";
            },
            onIntelChange: (level) => {
                gameState.cpuIntel = level;
            },
            onMovementChange: (isAuto) => {
                gameState.autoMove = isAuto;
            },
            onColorChange: (dropdownId, color) => {
                if (dropdownId === 'dd-p1-color') {
                    gameState.players[0].color = color;
                } else {
                    gameState.players[1].color = color;
                }
                if (gameState.gameActive) this.renderer.drawBoard();
            }
        };
        
        this.modalManager.initialize(this.uiElements);
    }
    
    setupDice() {
        const { diceScene, gameWrapper } = this.uiElements;
        this.dragDropManager.setupDiceDrag(diceScene, gameWrapper, 
            () => this.turnManager.executeRoll());
    }
    
    setupFullscreen() {
        const { fullscreenBtn, fullscreenBtnEnter, gameWrapper } = this.uiElements;
        
        window.toggleFullscreen = () => {
            if (!document.fullscreenElement) {
                gameWrapper.requestFullscreen();
                gameWrapper.classList.add('fullscreen-mode');
                fullscreenBtn.style.display = 'inline-flex';
                fullscreenBtnEnter.style.display = 'none';
            } else {
                document.exitFullscreen();
                gameWrapper.classList.remove('fullscreen-mode');
                fullscreenBtn.style.display = 'none';
                fullscreenBtnEnter.style.display = 'inline-flex';
            }
        };
        
        document.addEventListener('fullscreenchange', () => this.updateFullscreenUI());
        document.addEventListener('webkitfullscreenchange', () => this.updateFullscreenUI());
    }
    
    updateFullscreenUI() {
        const { fullscreenBtn, fullscreenBtnEnter, gameWrapper } = this.uiElements;
        const isFullscreen = !!document.fullscreenElement;
        
        if (isFullscreen) {
            gameWrapper.classList.add('fullscreen-mode');
            fullscreenBtn.style.display = 'inline-flex';
            fullscreenBtnEnter.style.display = 'none';
        } else {
            gameWrapper.classList.remove('fullscreen-mode');
            fullscreenBtn.style.display = 'none';
            fullscreenBtnEnter.style.display = 'inline-flex';
        }
    }
    
    openGameModal() {
        if (!this.isInitialized) {
            this.initialize();
        }
        
        this.resetGame();
        this.uiElements.gameModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    closeGameModal() {
        gameState.gameActive = false;
        
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
        
        this.uiElements.gameWrapper.classList.remove('fullscreen-mode');
        this.uiElements.fullscreenBtn.style.display = 'none';
        this.uiElements.fullscreenBtnEnter.style.display = 'inline-flex';
        this.uiElements.gameModal.classList.remove('active');
        document.body.style.overflow = '';
        this.uiElements.winOverlay.classList.remove('show');
        
        this.modalManager.hideFractionPopup();
    }
    
    resetGame() {
        // Update player names
        gameState.players[0].name = "P1";
        gameState.players[1].name = gameState.vsCPU ? "CPU" : "P2";
        
        // Generate new board
        const diffDropdown = document.getElementById('dd-difficulty');
        let difficulty = 'standard';
        if (diffDropdown) {
            const selected = diffDropdown.querySelector('.selected');
            if (selected) difficulty = selected.dataset.value;
        }
        
        const boardData = generateRandomBoard(difficulty);
        gameState.setBoardData(boardData);
        
        // Reset state
        gameState.reset();
        
        // Clear UI
        this.modalManager.clearLog();
        this.uiElements.winOverlay.classList.remove('show');
        this.modalManager.hideFractionPopup();
        
        // Reset dice position
        if (this.uiElements.diceScene) {
            this.uiElements.diceScene.style.left = '';
            this.uiElements.diceScene.style.top = '';
            this.uiElements.diceScene.style.right = '16px';
        }
        
        // Draw initial board
        this.renderer.drawBoard();
        
        // Start first turn
        this.turnManager.startTurn();
        
        if (this.uiElements.gameFeedback) {
            this.uiElements.gameFeedback.textContent = 'Game reset! Drag dice or double-tap to roll.';
        }
    }
    
    handleValidDrop(pi, pos) {
        if (gameState.state === GameState.WAITING_DRAG) {
            this.movementManager.processMove(pi, pos);
            this.checkSquareLogic(pi, pos);
        } else if (gameState.state === GameState.WAITING_DRAG_SNAKELADDER) {
            this.fractionManager.checkFraction(pi, pos);
        }
    }
    
    handleInvalidDrop() {
        this.modalManager.addLogMessage(
            `Wrong square. Drop token on square ${gameState.expectedSquare}.`, 
            'error'
        );
        if (this.uiElements.gameFeedback) {
            this.uiElements.gameFeedback.textContent = 
                `Wrong square! Drop on ${gameState.expectedSquare}.`;
        }
    }
    
    checkSquareLogic(pi, sq) {
        const moveResult = this.movementManager.processMove(pi, sq);
        
        switch(moveResult.type) {
            case 'snake':
                this.handleSnakeEncounter(pi, sq, moveResult.destination);
                break;
            case 'ladder':
                this.handleLadderEncounter(pi, sq, moveResult.destination);
                break;
            case 'win':
                this.triggerWin(pi);
                break;
            default:
                this.fractionManager.checkFraction(pi, sq);
        }
    }
    
    handleSnakeEncounter(pi, from, to) {
        if ((gameState.vsCPU && pi === 1) || gameState.autoMove) {
            this.modalManager.addLogMessage(`OH NO! A snake!`, 'snake');
            setTimeout(() => {
                this.movementManager.animateToken(pi, from, to, () => {
                    gameState.players[pi].pos = to;
                    this.fractionManager.checkFraction(pi, to);
                });
            }, 700);
        } else {
            gameState.expectedSquare = to;
            gameState.state = GameState.WAITING_DRAG_SNAKELADDER;
            this.modalManager.addLogMessage(
                `OH NO! A snake! Drag down to square ${to}.`, 'snake');
            if (this.uiElements.gameFeedback) {
                this.uiElements.gameFeedback.textContent = `Snake! Drag down to ${to}.`;
            }
        }
    }
    
    handleLadderEncounter(pi, from, to) {
        if ((gameState.vsCPU && pi === 1) || gameState.autoMove) {
            this.modalManager.addLogMessage(`YAY! A ladder!`, 'ladder');
            setTimeout(() => {
                this.movementManager.animateToken(pi, from, to, () => {
                    gameState.players[pi].pos = to;
                    this.fractionManager.checkFraction(pi, to);
                });
            }, 700);
        } else {
            gameState.expectedSquare = to;
            gameState.state = GameState.WAITING_DRAG_SNAKELADDER;
            this.modalManager.addLogMessage(
                `YAY! A ladder! Drag up to square ${to}.`, 'ladder');
            if (this.uiElements.gameFeedback) {
                this.uiElements.gameFeedback.textContent = `Ladder! Drag up to ${to}.`;
            }
        }
    }
    
    onMoveComplete(pi, pos) {
        this.checkSquareLogic(pi, pos);
    }
    
    triggerWin(pi, reason = null) {
        gameState.state = GameState.GAME_OVER;
        gameState.gameActive = false;
        
        const winner = gameState.players[pi];
        this.modalManager.addLogMessage(`${winner.name} WON THE GAME!`, 'action');
        this.modalManager.showWinOverlay(winner.name, reason);
    }
    
    startPlayerTurn() {
        this.modalManager.updateHUD(
            gameState.getCurrentPlayer().name,
            gameState.getCurrentPlayer().color
        );
    }
}

// Create global instance
const game = new SnakesAndLaddersGame();

// Global functions for HTML
window.toggleDropdown = (id) => game.modalManager.toggleDropdown(id);
window.openGameModal = () => game.openGameModal();
window.closeGameModal = () => game.closeGameModal();
window.resetGame = () => game.resetGame();
window.toggleFullscreen = () => {
    if (game.uiElements.gameWrapper) {
        window.toggleFullscreen();
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Pre-initialize canvas for rendering
    const canvas = document.getElementById('boardCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        canvas.width = BOARD_SIZE;
        canvas.height = BOARD_SIZE;
    }
});