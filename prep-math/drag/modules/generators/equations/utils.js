// Utility functions
export const rnd = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
export const pick = arr => arr[rnd(0, arr.length - 1)];
export const VARS = ['x', 'n', 'm', 'y', 'k'];
export const v = () => pick(VARS);
export const eqQ = (eq, goal, hint) => ({ type: 'equation', eq, goal, hint });
export const sign = n => n >= 0 ? `+${n}` : `${n}`;
export const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);

export const hintFor = (method, removeStep, divideStep) =>
  method === 'balancing' ? `${removeStep} from both sides, then ${divideStep}.` :
  `Move the constant across: ${removeStep}, then ${divideStep}.`;