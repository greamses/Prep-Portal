import { rnd, pick, expQ } from './utils.js';

export function rationalExpr() {
    const r1=rnd(1,4), r2=rnd(1,4);
    const expressions = [
        expQ(`(x^2-${r1*r1})/(x-${r1})`, `x+${r1}`, `Factor numerator: (x-${r1})(x+${r1}). Cancel (x-${r1}).`),
        expQ(`(x^2+${r1+r2}*x+${r1*r2})/(x+${r1})`, `x+${r2}`, `Factor: (x+${r1})(x+${r2}). Cancel (x+${r1}).`),
        expQ(`(2*x^2-${2*r1*r1})/(x-${r1})`, `2*(x+${r1})`, `Factor: 2(x-${r1})(x+${r1}). Cancel (x-${r1}).`),
    ];
    return pick(expressions);
}

export function algebraicFractionOps() {
    const a=rnd(2,6), b=rnd(2,6), vr='x';
    const expressions = [
        expQ(`${a}/${vr}+${b}/${vr}`,     `${a+b}/${vr}`,  `Same denominator: add numerators → ${a+b}/${vr}.`),
        expQ(`${a}/(${vr}+1)+${b}/(${vr}+1)`, `${a+b}/(${vr}+1)`, `Same denominator: add numerators.`),
        expQ(`(2*${vr}/${3})*(${3}/(${vr}))`, `2`, `Multiply fractions; cancel ${vr} and 3.`),
    ];
    return pick(expressions);
}

export function rationalFunctions() {
    const a=rnd(2,4), b=rnd(1,4);
    return expQ(`(x^2-${a*a})/(x^2-${a+b}*x+${a*b})`,
        `(x+${a})/(x-${b})`,
        `Factor: numerator=(x-${a})(x+${a}), denominator=(x-${a})(x-${b}). Cancel (x-${a}).`);
}