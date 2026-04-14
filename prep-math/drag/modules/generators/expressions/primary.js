import { rnd, pick, v, expQ } from './utils.js';

export function writingExpression() {
    const vr = v(), a = rnd(2,9), b = rnd(1,8);
    const expressions = [
        expQ(`${a}+${b}`,       `${a+b}`,       `Evaluate: ${a}+${b}=${a+b}.`),
        expQ(`${a+b}-${b}`,     `${a}`,         `Evaluate: ${a+b}-${b}=${a}.`),
        expQ(`${vr}+${b}`,      `${vr}+${b}`,   `This expression means "some number plus ${b}". Leave in simplest form.`),
        expQ(`2*${vr}+${b}`,    `2*${vr}+${b}`, `"Twice a number plus ${b}". It cannot be simplified further.`),
    ];
    return pick(expressions);
}

export function evaluatingExpression() {
    const vr = v(), a = rnd(2,8), val = rnd(2,10);
    const expressions = [
        expQ(`${a}*${vr}+${rnd(1,6)}`, `${a*val+rnd(1,6)}`,
             `Substitute ${vr}=${val}: ${a}×${val}+... Evaluate step by step.`),
        expQ(`${vr}^2+${rnd(1,5)}*${vr}`, `${val*val+rnd(1,5)*val}`,
             `Substitute ${vr}=${val}: ${val}²+...×${val}. Square first, then multiply.`),
        expQ(`(${vr}+${rnd(1,5)})*${rnd(2,4)}`, `${(val+rnd(1,5))*rnd(2,4)}`,
             `Substitute ${vr}=${val}, then evaluate the bracket and multiply.`),
    ];
    return pick(expressions);
}

export function orderOfOps() {
    const templates = [
        () => { const a=rnd(2,6),b=rnd(2,6),c=rnd(1,5); return expQ(`${a}*(${b}+${c})`,`${a*(b+c)}`,`Brackets first: ${b}+${c}=${b+c}, then ×${a}=${a*(b+c)}.`); },
        () => { const a=rnd(2,9),b=rnd(2,6),c=rnd(2,5); return expQ(`${a}+${b}*${c}`,`${a+b*c}`,`Multiply first: ${b}×${c}=${b*c}, then add ${a}.`); },
        () => { const a=rnd(10,20),b=rnd(2,5),c=rnd(1,4); return expQ(`${a}-${b}*${c}`,`${a-b*c}`,`Multiply first: ${b}×${c}=${b*c}, then subtract from ${a}.`); },
        () => { const a=rnd(2,5),b=rnd(2,5),c=rnd(2,5),d=rnd(1,4);
                return expQ(`(${a}+${b})*(${c}-${d})`,`${(a+b)*(c-d)}`,`Evaluate each bracket first, then multiply.`); },
    ];
    return pick(templates)();
}