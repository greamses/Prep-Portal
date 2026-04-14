import { rnd, pick, ineqQ } from './utils.js';

export function quadraticInequality() {
    const r1 = rnd(1, 5), r2 = rnd(r1 + 1, 7);
    const op = pick(['<', '>', '≤', '≥']);
    const B = -(r1 + r2), C = r1 * r2;
    const Bt = B === 0 ? '' : (B > 0 ? `+${B}*x` : `${B}*x`);
    const Ct = C === 0 ? '' : (C > 0 ? `+${C}` : `${C}`);

    let solution;
    if (op === '>' || op === '≥') {
        solution = `x < ${r1} or x > ${r2}`;
    } else {
        solution = `${r1} < x < ${r2}`;
    }
    return ineqQ(`x^2${Bt}${Ct}`,
        solution,
        `Factor: (x-${r1})(x-${r2}) ${op} 0. Roots at x=${r1} and x=${r2}. `
        + `Parabola opens up. ${op === '>' || op === '≥' ? `Outside roots: ${solution}.` : `Between roots: ${solution}.`}`
    );
}

export function signChartInequality() {
    const r1 = rnd(-4, -1), r2 = rnd(1, 4), r3 = rnd(r2 + 1, 7);
    const op = pick(['>', '<']);
    return ineqQ(`(x-${r1})*(x-${r2})*(x-${r3})`,
        `sign analysis needed`,
        `Roots: x=${r1}, x=${r2}, x=${r3}. `
        + `Use sign chart: test each interval. Product ${op}0 when odd number of negative factors (for >) or even (for <).`
    );
}