import { rnd, eqQ } from './utils.js';

export function differentialEq() {
    const k = rnd(2, 5), C = rnd(0, 4);
    return eqQ(`dy/dx=${k}*x`, `y=${k/2}*x^2+C`,
        `Integrate both sides: y = ∫${k}x dx = ${k/2}x²+C. Use initial conditions to find C.`);
}