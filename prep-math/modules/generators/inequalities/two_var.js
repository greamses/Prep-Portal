import { rnd, pick, ineqQ } from './utils.js';

export function linearTwoVar() {
    const m = rnd(1, 4), c = rnd(0, 5);
    const op = pick(['>', '<', '≥', '≤']);
    return ineqQ(`y-${m}*x`,
        `y ${op} ${m}x${c >= 0 ? '+' + c : c}`,
        `Graph the line y=${m}x+${c} (dashed for strict, solid for ≤/≥). `
        + `Shade the region ${op === '>' || op === '≥' ? 'above' : 'below'} the line.`
    );
}