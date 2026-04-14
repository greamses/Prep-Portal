// Utility functions
export const rnd = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
export const pick = arr => arr[rnd(0, arr.length - 1)];
export const VARS = ['x', 'n', 'm'];
export const v = () => pick(VARS);
export const ineqQ = (eq, goal, hint) => ({ type: 'inequality', eq, goal, hint });

// Sign helpers
export const ops = ['<', '>', '≤', '≥'];
export const flip = { '<': '>', '>': '<', '≤': '≥', '≥': '≤' };
export const pickOp = () => pick(ops);