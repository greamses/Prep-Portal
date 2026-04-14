// Utility functions
export const rnd = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
export const pick = arr => arr[rnd(0, arr.length - 1)];
export const VARS = ['x', 'a', 'y', 'm', 'n'];
export const v = () => pick(VARS);
export const expQ = (eq, goal, hint) => ({ type: 'expression', eq, goal, hint });

export const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);

export function binomialCoefficient(n, k) {
  if (k < 0 || k > n) return 0;
  if (k === 0 || k === n) return 1;
  let result = 1;
  for (let i = 1; i <= k; i++) {
    result = result * (n - k + i) / i;
  }
  return Math.round(result);
}

export function validateExpression(eq, goal) {
  if (!eq || eq.includes('NaN') || eq.includes('undefined') || eq.includes('null')) {
    console.warn('Invalid expression generated:', eq);
    return false;
  }
  if (!goal || goal.includes('NaN') || goal.includes('undefined')) {
    console.warn('Invalid goal generated:', goal);
    return false;
  }
  return true;
}