import { rnd, pick, ineqQ } from './utils.js';

export function polynomialInequality() {
    const r1 = rnd(-3, 0), r2 = rnd(1, 3), r3 = rnd(r2 + 1, 5);
    const op = pick(['>', '≥', '<', '≤']);
    return ineqQ(`(x-${r1})*(x-${r2})*(x-${r3})`,
        `sign analysis needed`,
        `Cubic with roots x=${r1}, ${r2}, ${r3}. `
        + `Sign chart: the cubic is positive when x→+∞. Intervals: x<${r1}, ${r1}<x<${r2}, ${r2}<x<${r3}, x>${r3}.`
    );
}