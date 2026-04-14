import { rnd, pick, ineqQ } from './utils.js';

export function absoluteValueInequality() {
    const a = rnd(1, 6), c = rnd(3, 10);
    const b = rnd(0, 4);
    const op = pick(['<', '>', '≤', '≥']);
    let solution;
    if (op === '<' || op === '≤') {
        solution = `${(b - c) / a} < x < ${(b + c) / a}`;
    } else {
        solution = `x < ${(b - c) / a} or x > ${(b + c) / a}`;
    }
    return ineqQ(`${a}*x-${b}`,
        solution,
        `Solve |${a}x-${b}| ${op} ${c}: `
        + (op === '<' || op === '≤'
            ? `-${c} ${op} ${a}x-${b} ${op} ${c}. Add ${b}: ${b - c} ${op} ${a}x ${op} ${b + c}. Divide by ${a}.`
            : `${a}x-${b} > ${c} or ${a}x-${b} < -${c}.`)
    );
}

export function absQuadratic() {
    const a = rnd(1, 5), b = rnd(1, 6);
    return ineqQ(`x^2-${a*2}*x+${a*a-b}`,
        `|...| analysis needed`,
        `Solve |x²-${2*a}x+${a*a-b}| < ${b}: equivalent to -${b} < x²-${2*a}x+${a*a-b} < ${b}. `
        + `Solve both halves: x²-${2*a}x+${a*a-2*b}<0 and x²-${2*a}x+${a*a}>0.`
    );
}