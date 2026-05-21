import { rnd, eqQ } from './utils.js';

export function quadraticFactoring(advanced = false) {
    const r1 = advanced ? rnd(-5, -1) : rnd(1, 6);
    const r2 = rnd(1, 6);
    const B = -(r1 + r2), C = r1 * r2;
    const Bterm = B === 0 ? '' : (B > 0 ? `+${B}*x` : `${B}*x`);
    const Cterm = C === 0 ? '' : (C > 0 ? `+${C}` : `${C}`);
    return eqQ(`x^2${Bterm}${Cterm}=0`, `x=${Math.max(r1,r2)}`,
        `Find two numbers with product ${C} and sum ${-B}. Roots: x=${r1} or x=${r2}.`);
}

export function quadraticCompleteSquare() {
    const h = rnd(-4, 4), k = rnd(1, 9);
    const B = -2*h, C = h*h - k;
    const Bterm = B === 0 ? '' : (B > 0 ? `+${B}*x` : `${B}*x`);
    const Cterm = C === 0 ? '' : (C > 0 ? `+${C}` : `${C}`);
    const r1 = (h + Math.sqrt(k)).toFixed(1), r2 = (h - Math.sqrt(k)).toFixed(1);
    return eqQ(`x^2${Bterm}${Cterm}=0`, `x=${r1}`,
        `Complete the square: (x${h>=0?'-'+h:'+'+Math.abs(h)})²=${k}. Solutions: x=${r1} or x=${r2}.`);
}

export function quadraticFormula() {
    const a = rnd(1, 4), b = rnd(-6, 6), c = rnd(-8, 8);
    const disc = b*b - 4*a*c;
    if (disc < 0) return quadraticFormula();
    const x1 = ((-b + Math.sqrt(disc)) / (2*a)).toFixed(2);
    const x2 = ((-b - Math.sqrt(disc)) / (2*a)).toFixed(2);
    const Bterm = b === 0 ? '' : (b > 0 ? `+${b}*x` : `${b}*x`);
    const Cterm = c === 0 ? '' : (c > 0 ? `+${c}` : `${c}`);
    const aStr = a === 1 ? '' : `${a}*`;
    return eqQ(`${aStr}x^2${Bterm}${Cterm}=0`, `x=${x1}`,
        `Use the quadratic formula with a=${a}, b=${b}, c=${c}. Discriminant=${disc}. x=${x1} or x=${x2}.`);
}