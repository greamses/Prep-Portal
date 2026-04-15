// Global State Management
export const state = {
  currentInput: '',
  cursorPosition: 0,
  activeTab: '123',
  keyboardVisible: true,
  ggbApplet: null,
  abcCaps: false,
  currentTargetEquation: 'f(x) = 2x + 1',
  solvedCount: 0,
  renderTimer: null,
  currentTopic: 'Linear' // Add current topic to state
};

export function updateState(key, value) {
  state[key] = value;
}

export function getState(key) {
  return state[key];
}