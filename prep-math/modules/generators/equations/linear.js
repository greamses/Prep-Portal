import { rnd, pick, v, eqQ, hintFor, gcd } from './utils.js';

export function linearOneStep(method) {
    const vr = v();
    const a = rnd(2, 9), x = rnd(1, 12), b = rnd(1, 15);
    return pick([
        eqQ(`${a}*${vr}+${b}=${a*x+b}`, `${vr}=${x}`,
            hintFor(method, `subtract ${b}`, `divide by ${a}`)),
        eqQ(`${a}*${vr}-${b}=${a*x-b}`, `${vr}=${x}`,
            hintFor(method, `add ${b}`, `divide by ${a}`)),
        eqQ(`${vr}/${a}+${b}=${Math.round(x/a)+b}`, `${vr}=${Math.round(x/a)*a}`,
            `Subtract ${b} from both sides, then multiply by ${a}.`),
    ]);
}

export function linearBothSides(method) {
    const vr = v();
    const x = rnd(1, 8), c = rnd(2, 6), b = rnd(1, 12), d = rnd(b+1, 20);
    const a = c + Math.ceil((d - b) / x);
    return eqQ(`${a}*${vr}+${b}=${c}*${vr}+${(a-c)*x+b}`, `${vr}=${x}`,
        method === 'balancing'
            ? `Subtract ${c}${vr} from both sides, then subtract ${b}.`
            : `Move ${vr} terms left, constants right.`);
}

export function bracketEq(method) {
    const vr = v();
    const x = rnd(1, 8), a = rnd(2, 7), b = rnd(1, 8);
    const c = a * (x + b);
    return pick([
        eqQ(`${a}*(${vr}+${b})=${c}`, `${vr}=${x}`,
            method === 'balancing'
                ? `Divide both sides by ${a}, then subtract ${b}.`
                : `Expand: ${a}${vr}+${a*b}=${c}, then solve.`),
        eqQ(`${a}*(${vr}-${b})=${a*(x-b)}`, `${vr}=${x}`,
            `Divide both sides by ${a}, then add ${b}.`),
        eqQ(`${a}*(${vr}+${b})+${rnd(1,5)}=${c+rnd(1,5)}`, `${vr}=${x}`,
            `Subtract the constant first, then divide by ${a}, then subtract ${b}.`),
    ]);
}

export function fractionLinearEq(method) {
    const vr = v();
    const x = rnd(2, 10), d1 = pick([2,3,4,5,6]), d2 = pick([2,3,4,5,6]);
    const lcm = (d1 * d2) / gcd(d1, d2);
    const b = rnd(1, 8);
    return pick([
        eqQ(`${vr}/${d1}+${vr}/${d2}=${x*(d1+d2)/(d1*d2)}`, `${vr}=${x}`,
            `Multiply both sides by the LCM (${lcm}).`),
        eqQ(`(${vr}+${b})/${d1}=${x+b}/${d1}`, `${vr}=${x}`,
            `Multiply both sides by ${d1}, then subtract ${b}.`),
        eqQ(`${vr}/${d1}-${vr}/${d2}=${x*(d2-d1)/(d1*d2)}`, `${vr}=${x}`,
            `Multiply by the LCM (${lcm}) to clear fractions.`),
    ]);
}