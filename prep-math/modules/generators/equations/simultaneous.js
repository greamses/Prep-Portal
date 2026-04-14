import { rnd, eqQ, sign } from './utils.js';

export function simultaneousSubstitution() {
    const x = rnd(1, 7), y = rnd(1, 7), m = rnd(2, 5);
    const b = y - m * x;
    return eqQ(`${m}*x+y=${m*x+y}`, `x=${x},y=${y}`,
        `Second equation y=${m<0?m+'x+'+b:m+'*x'+sign(b)}. Substitute into first and solve. Answer: x=${x}, y=${y}.`);
}

export function simultaneousElimination() {
    const x = rnd(1,6), y = rnd(1,6);
    const a1=rnd(2,4), a2=rnd(2,4), b1=rnd(1,4), b2=rnd(1,4);
    return eqQ(`${a1}*x+${b1}*y=${a1*x+b1*y}`, `x=${x},y=${y}`,
        `Second equation: ${a2}x+${b2}y=${a2*x+b2*y}. Eliminate one variable by scaling and adding/subtracting. x=${x}, y=${y}.`);
}