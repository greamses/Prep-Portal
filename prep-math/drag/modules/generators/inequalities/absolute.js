import { rnd, pick, gmIneqQ } from './utils.js';

export function absoluteValueInequality() {
    const a = rnd(1, 4);
    const b = rnd(1, 6);
    const c = rnd(5, 15);
    const op = pick(['<', '>', '≤', '≥']);
    
    const expression = `${a}*x${b >= 0 ? `-${b}` : `+${-b}`}`;
    const fullInequality = `|${a}x-${b}| ${op} ${c}`;
    
    let goal, hint;
    
    if (op === '<' || op === '≤') {
        const lower = ((b - c) / a).toFixed(1);
        const upper = ((b + c) / a).toFixed(1);
        goal = `${lower} < x < ${upper}`;
        hint = `${fullInequality}\n\n` +
            `Step 1: Remove absolute value: -${c} ${op} ${a}x-${b} ${op} ${c}\n` +
            `Step 2: Add ${b} to all parts: ${b - c} ${op} ${a}x ${op} ${b + c}\n` +
            `Step 3: Divide by ${a}: ${lower} ${op} x ${op} ${upper}\n` +
            `Solution: ${goal}`;
    } else {
        const lower = ((b - c) / a).toFixed(1);
        const upper = ((b + c) / a).toFixed(1);
        goal = `x < ${lower} or x > ${upper}`;
        hint = `${fullInequality}\n\n` +
            `Step 1: Remove absolute value: ${a}x-${b} ${op} ${c} OR ${a}x-${b} ${op} -${c}\n` +
            `Step 2: Add ${b} to both sides of each\n` +
            `Step 3: Divide by ${a}: x ${op} ${upper} OR x ${op} ${lower}\n` +
            `Solution: ${goal}`;
    }
    
    return gmIneqQ(expression, goal, hint, fullInequality);
}

export function absoluteValueQuadraticInequality() {
    const a = rnd(1, 3);
    const b = rnd(2, 5);
    const c = rnd(3, 8);
    
    const expression = `x^2-${2*a}*x+${a*a-b}`;
    const fullInequality = `|x² - ${2*a}x + ${a*a - b}| < ${c}`;
    const goal = `compound inequality needed`;
    
    const hint = `${fullInequality}\n\n` +
        `Step 1: Remove absolute value: -${c} < x² - ${2*a}x + ${a*a - b} < ${c}\n` +
        `Step 2: Solve two inequalities:\n` +
        `   x² - ${2*a}x + ${a*a - b + c} > 0\n` +
        `   x² - ${2*a}x + ${a*a - b - c} < 0\n` +
        `Step 3: Find intersection of solution sets`;
    
    return gmIneqQ(expression, goal, hint, fullInequality);
}