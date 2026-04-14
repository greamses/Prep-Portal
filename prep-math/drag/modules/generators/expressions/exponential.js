import { rnd, pick, expQ } from './utils.js';

export function exponentialExpression() {
    const a = rnd(1, 3), b = rnd(1, 3);
    const expressions = [
        expQ(`e^{${a}x} * e^{${b}x}`, `e^{${a+b}x}`, `Add exponents when multiplying same base: e^{${a}x + ${b}x} = e^{${a+b}x}.`),
        expQ(`\\frac{e^{${a+b}x}}{e^{${b}x}}`, `e^{${a}x}`, `Subtract exponents when dividing: e^{${a+b}x - ${b}x} = e^{${a}x}.`),
        expQ(`(e^{${a}x})^{${b}}`, `e^{${a*b}x}`, `Multiply exponents: (e^{${a}x})^{${b}} = e^{${a*b}x}.`),
    ];
    return pick(expressions);
}