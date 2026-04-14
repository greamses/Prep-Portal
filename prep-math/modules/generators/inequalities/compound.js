import { rnd, gmIneqQ } from './utils.js';

export function compoundInequality() {
    const a = rnd(2, 5);
    const b = rnd(1, 8);
    const low = rnd(0, 5);
    const high = rnd(low + 5, low + 12);
    
    const expression = `${a}*x${b >= 0 ? `+${b}` : `${b}`}`;
    const fullInequality = `${low} < ${a}x${b >= 0 ? `+${b}` : `${b}`} < ${high}`;
    
    const lowSol = ((low - b) / a).toFixed(1);
    const highSol = ((high - b) / a).toFixed(1);
    
    const goal = `${lowSol} < x < ${highSol}`;
    const hint = `${fullInequality}\n\n` +
        `Step 1: Subtract ${b} from all parts: ${low - b} < ${a}x < ${high - b}\n` +
        `Step 2: Divide by ${a}: ${lowSol} < x < ${highSol}\n` +
        `Solution: ${goal}`;
    
    return gmIneqQ(expression, goal, hint, fullInequality);
}