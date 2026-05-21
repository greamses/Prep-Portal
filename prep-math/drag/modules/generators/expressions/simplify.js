import { rnd, pick, v, expQ } from './utils.js';

export function simplifyLikeTerms() {
    const vr = v(), a=rnd(2,8), b=rnd(2,7), c=rnd(1,6), d=rnd(1,5);
    const expressions = [
        expQ(`${a}*${vr}+${b}*${vr}`,         `${a+b}*${vr}`,          `Add coefficients of ${vr}: ${a}+${b}=${a+b}.`),
        expQ(`${a+b}*${vr}-${b}*${vr}`,       `${a}*${vr}`,            `Subtract coefficients: ${a+b}−${b}=${a}.`),
        expQ(`${a}*${vr}+${c}+${b}*${vr}+${d}`, `${a+b}*${vr}+${c+d}`,  `Group like terms: (${a}+${b})${vr}+(${c}+${d}).`),
        expQ(`${a}*${vr}-${b}*${vr}+${c}`,    `${a-b}*${vr}+${c}`,     `Collect ${vr} terms: (${a}-${b})${vr}+${c}.`),
    ];
    return pick(expressions);
}

export function distributive() {
    const vr = v(), a=rnd(2,8), b=rnd(2,7), c=rnd(1,6);
    const expressions = [
        expQ(`${a}*(${vr}+${b})`,  `${a}*${vr}+${a*b}`,   `Expand: ${a}×${vr}+${a}×${b}=${a}${vr}+${a*b}.`),
        expQ(`${a}*(${vr}-${c})`,  `${a}*${vr}-${a*c}`,   `Expand: ${a}×${vr}-${a}×${c}=${a}${vr}-${a*c}.`),
        expQ(`${vr}*(${vr}+${b})`, `${vr}^2+${b}*${vr}`,  `Expand: ${vr}×${vr}+${vr}×${b}=${vr}²+${b}${vr}.`),
    ];
    return pick(expressions);
}

export function simpleFactoring() {
    const cf=rnd(2,6), a=rnd(2,8), b=rnd(1,7);
    const vr = v();
    const expressions = [
        expQ(`${cf*a}*${vr}+${cf*b}`,  `${cf}*(${a}*${vr}+${b})`, `HCF of ${cf*a} and ${cf*b} is ${cf}. Factor out ${cf}.`),
        expQ(`${cf}*${vr}^2+${cf*b}*${vr}`, `${cf}*${vr}*(${vr}+${b})`, `Factor out ${cf}${vr} from both terms.`),
    ];
    return pick(expressions);
}

export function factoriseQuadratic() {
    const r1=rnd(1,5), r2=rnd(1,5), neg=pick([true,false]);
    const R2 = neg ? -r2 : r2;
    const B = -(r1+R2), C = r1*R2;
    const Bt = B===0 ? '' : (B>0 ? `+${B}*x` : `${B}*x`);
    const Ct = C===0 ? '' : (C>0 ? `+${C}` : `${C}`);
    const expressions = [
        expQ(`x^2${Bt}${Ct}`, `(x${r1>=0?'-'+r1:'+'+Math.abs(r1)})*(x${R2>=0?'-'+R2:'+'+Math.abs(R2)})`,
            `Find two numbers with product ${C} and sum ${-B}: use ${-r1} and ${-R2}.`),
        expQ(`x^2-${r1*r1}`, `(x-${r1})*(x+${r1})`, `Difference of squares: a²-b²=(a-b)(a+b). Here a=x, b=${r1}.`),
    ];
    return pick(expressions);
}

export function cubesExpression() {
    const a=rnd(2,4);
    const expressions = [
        expQ(`x^3-${a}^3`,           `(x-${a})*(x^2+${a}*x+${a*a})`, `Difference of cubes: a³-b³=(a-b)(a²+ab+b²). Let b=${a}.`),
        expQ(`x^3+${a}^3`,           `(x+${a})*(x^2-${a}*x+${a*a})`, `Sum of cubes: a³+b³=(a+b)(a²-ab+b²). Let b=${a}.`),
        expQ(`${8*a}*x^3-${a}`,      `${a}*(8*x^3-1)`,                `Factor out ${a}: ${a}(8x³-1). Recognise 8x³-1 as a difference of cubes.`),
    ];
    return pick(expressions);
}