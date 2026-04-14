import { rnd, pick, gmIneqQ } from './utils.js';

export function linearTwoVarInequality() {
    const m = rnd(1, 4);
    const c = rnd(0, 5);
    const op = pick(['>', '<', '≥', '≤']);
    
    const expression = `y-${m}*x${c >= 0 ? `-${c}` : `+${-c}`}`;
    const fullInequality = `y ${op} ${m}x${c >= 0 ? `+${c}` : `${c}`}`;
    const goal = `region ${op === '>' || op === '≥' ? 'above' : 'below'} the line`;
    
    const lineType = op === '>' || op === '<' ? 'dashed' : 'solid';
    const shade = op === '>' || op === '≥' ? 'above' : 'below';
    
    const hint = `${fullInequality}\n\n` +
        `Step 1: Graph boundary line y = ${m}x${c >= 0 ? `+${c}` : `${c}`}\n` +
        `Step 2: Use ${lineType} line (strict vs inclusive)\n` +
        `Step 3: Shade ${shade} the line\n` +
        `Step 4: Test a point (e.g., (0,0)) to verify`;
    
    return gmIneqQ(expression, goal, hint, fullInequality);
}