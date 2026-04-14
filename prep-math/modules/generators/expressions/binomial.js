import { rnd, pick, expQ, binomialCoefficient } from './utils.js';

export function binomialExpansion() {
    const a = rnd(1, 4);
    const expressions = [
        expQ(`(x+${a})^2`, `x^2+${2*a}*x+${a*a}`, `Pascal's row 1,2,1: x²+2(${a})x+${a}²=x²+${2*a}x+${a*a}.`),
        expQ(`(x-${a})^2`, `x^2-${2*a}*x+${a*a}`, `Pascal's row 1,2,1: x²-2(${a})x+${a}²=x²-${2*a}x+${a*a}.`),
        expQ(`(x+${a})^3`, `x^3+${3*a}*x^2+${3*a*a}*x+${a*a*a}`, `Pascal's row 1,3,3,1 for n=3.`),
        expQ(`(x+${a})*(x-${a})`, `x^2-${a*a}`, `Difference of squares: (x+${a})(x-${a})=x²-${a*a}.`),
    ];
    return pick(expressions);
}

export function binomialGeneralTerm() {
    const n = rnd(3, 6),
        a = rnd(1, 3);
    const terms = [];
    for (let k = 0; k <= n; k++) {
        const coeff = binomialCoefficient(n, k);
        const xpow = n - k;
        const apow = k;
        if (coeff !== 0) {
            if (xpow === 0) terms.push(`${coeff}*${a}^${apow}`);
            else if (apow === 0) terms.push(`${coeff}*x^${xpow}`);
            else terms.push(`${coeff}*x^${xpow}*${a}^${apow}`);
        }
    }
    return expQ(`(x+${a})^${n}`,
        terms.join(' + '),
        `General term T_{k+1}=C(${n},k)x^{${n}-k}×${a}^k. Expand using binomial theorem.`);
}