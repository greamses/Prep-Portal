// Board and game constants
export const BOARD_SIZE = 1024;
export const CELL = BOARD_SIZE / 8;

// Player colors
export const PLAYER_COLORS = [
  { name: 'Blue', value: '#0055ff' },
  { name: 'Red', value: '#ff2200' },
  { name: 'Green', value: '#00a550' },
  { name: 'Purple', value: '#9b59b6' },
  { name: 'Orange', value: '#e67e22' },
  { name: 'Pink', value: '#e84393' }
];

// Game states
export const GameState = {
  WAITING_ROLL: 0,
  ROLLING: 1,
  WAITING_DRAG: 2,
  WAITING_DRAG_SNAKELADDER: 3,
  WAITING_FRAC_ANSWER: 4,
  CPU_THINKING: 5,
  GAME_OVER: 6
};

// Player offsets for token positioning
export const PLAYER_OFFSETS = [
  { dx: -22, dy: -18 },
  { dx: 22, dy: 18 }
];

// Snake colors palette
export const SNAKE_COLORS_PALETTE = [
  '#c0392b', '#27ae60', '#8e44ad', '#d35400', '#2980b9', '#f39c12'
];