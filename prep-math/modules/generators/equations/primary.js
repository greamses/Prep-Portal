import { rnd, pick, eqQ } from './utils.js';

export function missingAddend(max) {
    const x = rnd(1, max - 1), a = rnd(1, max - x);
    return pick([
        eqQ(`x+${a}=${x+a}`, `x=${x}`, `Subtract ${a} from both sides.`),
        eqQ(`${a}+x=${x+a}`, `x=${x}`, `Subtract ${a} from both sides.`),
        eqQ(`${x+a}-x=${a}`, `x=${x}`, `Subtract ${a} from ${x+a}.`),
    ]);
}

export function missingProduct() {
    const a = pick([2,3,4,5,6,8,9,10]), x = rnd(2, 10);
    return pick([
        eqQ(`${a}*x=${a*x}`,  `x=${x}`, `Divide both sides by ${a}.`),
        eqQ(`x*${a}=${a*x}`,  `x=${x}`, `Divide both sides by ${a}.`),
        eqQ(`x/${a}=${x}`,    `x=${a*x}`, `Multiply both sides by ${a}.`),
    ]);
}

export function fractionEq() {
    const d = pick([2,3,4,5,8,10]), x = rnd(2,8);
    return pick([
        eqQ(`x/${d}=${x}`,       `x=${d*x}`,  `Multiply both sides by ${d}.`),
        eqQ(`x/${d}+1=${x+1}`,   `x=${d*x}`,  `Subtract 1 first, then multiply by ${d}.`),
        eqQ(`${d}*x+2=${d*x+2}`, `x=${x}`,    `Subtract 2, then divide by ${d}.`),
    ]);
}

export function decimalEq() {
    const d = pick([2, 4, 5, 10]);
    const x = rnd(1, 8);
    const a = (rnd(1, 5) / 10).toFixed(1);
    const b = (x * d / 10 + parseFloat(a)).toFixed(1);
    return pick([
        eqQ(`x+${a}=${b}`, `x=${(parseFloat(b)-parseFloat(a)).toFixed(1)}`, `Subtract ${a} from both sides.`),
        eqQ(`${a}*${d}*x=${parseFloat(a)*d*x}`, `x=${x}`, `Divide both sides by ${parseFloat(a)*d}.`),
    ]);
}