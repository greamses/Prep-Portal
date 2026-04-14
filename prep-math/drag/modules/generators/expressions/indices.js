import { rnd, pick, expQ } from './utils.js';

export function indicesExpression() {
    const b = pick(['x','a','y','m']);
    const p = rnd(2,5), q = rnd(2,4);
    const expressions = [
        expQ(`${b}^${p}*${b}^${q}`,    `${b}^${p+q}`,  `Multiply same base: add powers → ${b}^${p+q}.`),
        expQ(`${b}^${p+q}/${b}^${q}`,  `${b}^${p}`,    `Divide same base: subtract powers → ${b}^${p}.`),
        expQ(`(${b}^${p})^${q}`,        `${b}^${p*q}`,  `Power of power: multiply indices → ${b}^${p*q}.`),
        expQ(`${b}^0*${b}^${p}`,        `${b}^${p}`,    `Any base^0 = 1, so this equals ${b}^${p}.`),
        expQ(`${b}^(-${q})`,            `1/${b}^${q}`,  `Negative index: ${b}^-${q} = 1/${b}^${q}.`),
        expQ(`(${rnd(2,4)}*${b}^${p})^${2}`, `${rnd(2,4)**2}*${b}^${p*2}`, `Apply power to both coefficient and base.`),
    ];
    return pick(expressions);
}

export function indicialSimplify() {
    const m = rnd(2,5), n = rnd(2,4), p = rnd(2,4);
    const vr = pick(['x','y','a']);
    const expressions = [
        expQ(`${m}*${vr}^${p}*${n}*${vr}^${2}`,    `${m*n}*${vr}^${p+2}`, `Multiply coefficients, add powers: ${m}×${n}=${m*n} and ${p}+2=${p+2}.`),
        expQ(`(${m}*${vr}^${p})/(${n}*${vr}^${2})`, `${m/gcd(m,n)}*${vr}^${p-2}/${n/gcd(m,n)}`, `Divide coefficients and subtract powers: ${p}-2=${p-2}.`),
        expQ(`(${m}*${vr}^${p})^${2}`, `${m**2}*${vr}^${p*2}`, `Apply the outer power to coefficient and exponent: ${m}²=${m**2} and ${p}×2=${p*2}.`),
    ];
    return pick(expressions);
}

function gcd(a, b) {
    return b === 0 ? a : gcd(b, a % b);
}