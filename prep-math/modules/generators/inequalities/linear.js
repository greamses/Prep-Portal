import { rnd, pickOp, v, ineqQ } from './utils.js';

export function simpleLinear() {
    const vr = v(), op = pickOp();
    const x = rnd(1, 10), a = rnd(1, 8);
    const rhs = x + a;
    return ineqQ(`${vr}+${a}`,
        `${vr} ${op} ${x}`,
        `Solve ${vr}+${a} ${op} ${rhs}: subtract ${a} from both sides → ${vr} ${op} ${x}.`
    );
}

export function simpleLinearMult() {
    const vr = v(), a = rnd(2, 8), x = rnd(1, 10);
    const op = pickOp();
    return ineqQ(`${a}*${vr}`,
        `${vr} ${op} ${x}`,
        `Solve ${a}${vr} ${op} ${a*x}: divide both sides by ${a} (positive, sign keeps) → ${vr} ${op} ${x}.`
    );
}

export function negativeCoeff() {
    const vr = v();
    const a = rnd(2, 8), b = rnd(1, 10), op = pickOp();
    const rhs = rnd(5, 20);
    const numRHS = rhs - b;
    const sol = (-numRHS / a).toFixed(1);
    return ineqQ(`-${a}*${vr}+${b}`,
        `${vr} ${flip[op]} ${sol}`,
        `Solve -${a}${vr}+${b} ${op} ${rhs}: subtract ${b} → -${a}${vr} ${op} ${numRHS}. `
        + `Divide by -${a} (FLIP sign): ${vr} ${flip[op]} ${sol}.`
    );
}

export function linearWordInequality() {
    const x = rnd(5, 20), a = rnd(2, 6);
    return ineqQ(`${a}*x+${rnd(1,8)}`,
        `x ≤ ${x}`,
        `"At most ${a*x+rnd(1,8)} total" → set up ${a}x+... ≤ limit and solve.`
    );
}