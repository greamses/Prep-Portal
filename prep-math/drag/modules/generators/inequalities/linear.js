import { rnd, pickOp, gmIneqQ } from './utils.js';

export function linearInequality() {
    const a = rnd(2, 8);
    const b = rnd(1, 12);
    const c = rnd(a * 2 + b, a * 8 + b);
    const op = pickOp();
    
    const solution = ((c - b) / a).toFixed(1);
    const flipNote = a < 0 ? ' (FLIP the sign!)' : '';
    
    const expression = `${a}*x${b >= 0 ? `+${b}` : `${b}`}`;
    const fullInequality = `${a}x${b >= 0 ? `+${b}` : `${b}`} ${op} ${c}`;
    
    let goal, hint;
    const step1RHS = c - b;
    
    const opMap = {
        '<': { goal: `x < ${solution}`, hint: `x < ${solution}` },
        '>': { goal: `x > ${solution}`, hint: `x > ${solution}` },
        '≤': { goal: `x ≤ ${solution}`, hint: `x ≤ ${solution}` },
        '≥': { goal: `x ≥ ${solution}`, hint: `x ≥ ${solution}` }
    };
    
    goal = opMap[op].goal;
    hint = `${fullInequality}\n\n` +
        `Step 1: Subtract ${b} from both sides: ${a}x ${op} ${step1RHS}\n` +
        `Step 2: Divide by ${a}${flipNote}: x ${op} ${solution}\n` +
        `Solution: ${goal}`;
    
    return gmIneqQ(expression, goal, hint, fullInequality);
}

export function simpleLinearInequality() {
    return linearInequality();
}

export function linearInequalityNegativeCoeff() {
    const a = -rnd(2, 6); // negative coefficient
    const b = rnd(1, 10);
    const c = rnd(5, 20);
    const op = pickOp();
    const flippedOp = flip[op];
    
    const solution = ((c - b) / a).toFixed(1);
    const expression = `${a}*x${b >= 0 ? `+${b}` : `${b}`}`;
    const fullInequality = `${a}x${b >= 0 ? `+${b}` : `${b}`} ${op} ${c}`;
    const goal = `x ${flippedOp} ${solution}`;
    
    const hint = `${fullInequality}\n\n` +
        `Step 1: Subtract ${b} from both sides: ${a}x ${op} ${c - b}\n` +
        `Step 2: Divide by ${a} (negative, FLIP sign!): x ${flippedOp} ${solution}\n` +
        `Solution: x ${flippedOp} ${solution}`;
    
    return gmIneqQ(expression, goal, hint, fullInequality);
}