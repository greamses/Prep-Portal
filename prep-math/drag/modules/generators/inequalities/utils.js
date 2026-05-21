// Utility functions
export const rnd = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
export const pick = arr => arr[rnd(0, arr.length - 1)];
export const VARS = ['x', 'n', 'm'];
export const v = () => pick(VARS);

// GM-compatible inequality return type
export const gmIneqQ = (expression, goal, hint, fullInequality) => ({
  type: 'inequality',
  eq: expression, // For GM canvas: just the expression
  goal: goal, // Solution set as string
  hint: hint, // Step-by-step with inequality signs
  fullInequality: fullInequality // The complete inequality for display
});

// Sign helpers
export const ops = ['<', '>', '≤', '≥'];
export const flip = { '<': '>', '>': '<', '≤': '≥', '≥': '≤' };
export const pickOp = () => pick(ops);