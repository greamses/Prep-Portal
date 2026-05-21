import { rnd, pick, gmIneqQ } from './utils.js';

export function quadraticInequality() {
    const r1 = rnd(1, 4);
    const r2 = rnd(r1 + 1, r1 + 4);
    const op = pick(['<', '>']);
    
    const expression = `x^2-${r1 + r2}*x+${r1 * r2}`;
    const fullInequality = `x² - ${r1 + r2}x + ${r1 * r2} ${op} 0`;
    
    let goal, hint;
    
    if (op === '<') {
        goal = `${r1} < x < ${r2}`;
        hint = `${fullInequality}\n\n` +
            `Step 1: Factor: (x-${r1})(x-${r2}) < 0\n` +
            `Step 2: Critical points: x = ${r1}, x = ${r2}\n` +
            `Step 3: Parabola opens UP, solution is BETWEEN roots\n` +
            `Solution: ${goal}`;
    } else {
        goal = `x < ${r1} or x > ${r2}`;
        hint = `${fullInequality}\n\n` +
            `Step 1: Factor: (x-${r1})(x-${r2}) > 0\n` +
            `Step 2: Critical points: x = ${r1}, x = ${r2}\n` +
            `Step 3: Parabola opens UP, solution is OUTSIDE roots\n` +
            `Solution: ${goal}`;
    }
    
    return gmIneqQ(expression, goal, hint, fullInequality);
}

export function quadraticInequalitySignChart() {
    // For cubic or higher degree
    const r1 = rnd(-3, -1);
    const r2 = rnd(1, 3);
    const r3 = rnd(r2 + 1, r2 + 3);
    const op = pick(['>', '<']);
    
    const expression = `(x-${r1})*(x-${r2})*(x-${r3})`;
    const fullInequality = `(x-${r1})(x-${r2})(x-${r3}) ${op} 0`;
    const goal = `sign analysis needed`;
    
    const hint = `${fullInequality}\n\n` +
        `Step 1: Critical points: x = ${r1}, ${r2}, ${r3}\n` +
        `Step 2: Create sign chart with intervals:\n` +
        `   x < ${r1}, ${r1} < x < ${r2}, ${r2} < x < ${r3}, x > ${r3}\n` +
        `Step 3: Test a point in each interval\n` +
        `Step 4: Product ${op} 0 on intervals with ${op === '>' ? 'odd' : 'even'} number of negatives`;
    
    return gmIneqQ(expression, goal, hint, fullInequality);
}