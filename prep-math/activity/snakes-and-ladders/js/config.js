export const BOARD_SIZE = 1024;
export const CELL = BOARD_SIZE / 8;

export const PLAYER_COLORS = [
  { name: 'Blue', value: '#0055ff' },
  { name: 'Red', value: '#ff2200' },
  { name: 'Green', value: '#00a550' },
  { name: 'Purple', value: '#9b59b6' },
  { name: 'Orange', value: '#e67e22' },
  { name: 'Pink', value: '#e84393' }
];

export const STATE_ENUM = {
  WAITING_ROLL: 0,
  ROLLING: 1,
  WAITING_DRAG: 2,
  WAITING_DRAG_SNAKELADDER: 3,
  WAITING_FRAC_ANSWER: 4,
  CPU_THINKING: 5,
  GAME_OVER: 6
};

export const OFFSETS = [{ dx: -22, dy: -18 }, { dx: 22, dy: 18 }];