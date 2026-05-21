import { rnd, ineqQ } from './utils.js';

export function linearProgramming() {
    const a1 = rnd(1, 3), b1 = rnd(1, 3), c1 = rnd(6, 15);
    const a2 = rnd(1, 3), b2 = rnd(1, 3), c2 = rnd(6, 15);
    return ineqQ(`${a1}*x+${b1}*y`,
        `feasible region`,
        `Constraint 1: ${a1}x+${b1}y ≤ ${c1}. Constraint 2: ${a2}x+${b2}y ≤ ${c2}. `
        + `Also x≥0, y≥0. Graph both lines, shade feasible region, evaluate objective function at each vertex.`
    );
}