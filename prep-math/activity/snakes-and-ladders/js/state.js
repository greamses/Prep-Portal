import { STATE_ENUM } from './config.js';

export const DOM = {
    canvas: null, ctx: null, gameModal: null, gameFeedback: null,
    turnHud: null, dtHint: null, fracPopup: null, popupEq: null,
    winOverlay: null, winName: null, cube: null, logOverlay: null,
    modalTurn: null, gameWrapper: null, diceScene: null, 
    fullscreenBtn: null, fullscreenBtnEnter: null,
    numpad: null, luckyCardOverlay: null, bonusCardOverlay: null
};

export const boardData = {
    FRAC: {},
    SNAKES: {},
    SNAKE_COLORS: {},
    LADDERS: {}
};

export const players =[
    { pos: 1, color: '#0055ff', name: 'P1', drawX: 0, drawY: 0 },
    { pos: 1, color: '#ff2200', name: 'P2', drawX: 0, drawY: 0 }
];

export const gameState = {
    vsCPU: false,
    cpuIntel: 'advanced',
    autoMove: false,
    turn: 0,
    state: STATE_ENUM.WAITING_ROLL,
    expectedSquare: null,
    currentRoll: 0,
    logActive: false,
    dragState: { isDragging: false, pi: -1 },
    diceDragState: { isDragging: false, startX: 0, startY: 0, origX: 0, origY: 0 },
    numpadDragState: { isDragging: false, startX: 0, startY: 0 },
    activeInput: null,
    lastTapTime: 0,
    gameActive: false,
    diceSetupDone: false,
    
    currentFracPlayer: 0,
    currentFracAttempts: 0,
    currentFracData: null,
    isProcessingAnswer: false
};