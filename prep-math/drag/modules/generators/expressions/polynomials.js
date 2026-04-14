import { rnd, pick, expQ } from './utils.js';

export function polynomialOps() {
    const a=rnd(1,5), b=rnd(1,5), c=rnd(1,5), d=rnd(1,5);
    const expressions = [
        expQ(`(${a}*x^2+${b}*x+${c})+(${d}*x^2+${rnd(1,5)}*x+${rnd(1,5)})`,
            `${a+d}*x^2+${b+rnd(1,5)}*x+${c+rnd(1,5)}`,
            `Add like terms: combine x² terms, then x terms, then constants.`),
        expQ(`${a}*x^3-${b}*x^2+${c}*x-${d}`,
            `${a}x^3-${b}x^2+${c}x-${d}`,
            `Degree 3 polynomial. Identify coefficients: a=${a}, b=-${b}, c=${c}, d=-${d}.`),
    ];
    return pick(expressions);
}

export function remainderTheorem() {
    const a=rnd(1,4), b=rnd(0,5), c=rnd(0,5), d=rnd(0,4);
    const root = rnd(1,3);
    const R = a*Math.pow(root,3) - b*Math.pow(root,2) + c*root - d;
    return expQ(`${a}*x^3-${b}*x^2+${c}*x-${d}`,
        `R=${R}`,
        `Use remainder theorem: substitute x=${root}. R=${a}(${root})³-${b}(${root})²+${c}(${root})-${d}=${R}.`);
}

export function polynomialDivision() {
    const a=rnd(1,3), b=rnd(0,4), c=rnd(0,4), root=rnd(1,3);
    return expQ(`(${a}*x^2+${a*root+b}*x+${b*root+c})/(x+${root})`,
        `${a}*x+${b} + ${c}/(x+${root})`,
        `Perform polynomial long division or synthetic division (root=-${root}).`);
}