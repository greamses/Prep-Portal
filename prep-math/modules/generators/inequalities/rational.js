import { rnd, pick, ineqQ } from './utils.js';

export function rationalInequality() {
    const a = rnd(1, 5), b = rnd(1, 5);
    const op = pick(['>', '<', '≥', '≤']);
    return ineqQ(`(x+${a})/(x-${b})`,
        `solution depends on sign analysis`,
        `Find critical points: x=-${a} and x=${b} (denominator zero). `
        + `Test intervals: x<-${a}, -${a}<x<${b}, x>${b}. `
        + `Numerator and denominator must have same sign for ${op}0. Exclude x=${b}.`
    );
}

export function rationalRadicalInequality() {
    const a = rnd(2, 5), b = rnd(1, 4);
    return pick([
        ineqQ(`(x^2-${a*a})/(x+${b})`,
            `sign analysis needed`,
            `Factor: (x-${a})(x+${a})/(x+${b}). Critical pts: x=${-b},${-a},${a}. Sign chart across 4 intervals. Exclude x=${-b}.`),
        ineqQ(`sqrt(x+${b})`,
            `x ≥ ${-b}`,
            `For √(x+${b}) ≥ 0: domain requires x+${b} ≥ 0 → x ≥ ${-b}. Further inequality from the full problem.`),
    ]);
}