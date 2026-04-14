import { rnd, v, ineqQ } from './utils.js';

export function compoundAnd() {
    const vr = v(), a = rnd(2, 6), b = rnd(1, 5);
    const lo = rnd(1, 5), hi = rnd(lo + 3, 12);
    const loSol = ((lo - b) / a).toFixed(1);
    const hiSol = ((hi - b) / a).toFixed(1);
    return ineqQ(`${a}*${vr}+${b}`,
        `${loSol} < ${vr} < ${hiSol}`,
        `Solve ${lo} < ${a}${vr}+${b} < ${hi}: subtract ${b} from all parts → ${lo - b} < ${a}${vr} < ${hi - b}, then divide by ${a} → ${loSol} < ${vr} < ${hiSol}.`
    );
}

export function systemLinearInequalities() {
    return compoundAnd();
}