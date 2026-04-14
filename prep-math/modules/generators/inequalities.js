/**
 * generators/inequalities.js
 * Algorithmic inequality generator for JSS1 through SS3.
 * Returns { type:'inequality', eq, goal, hint }
 *
 * eq   — the inequality expression (or boundary equation) for the GM canvas.
 *         GM canvas doesn't render < or > natively, so we mount the
 *         algebraic expression (LHS - RHS) and the hint carries the full solution.
 * goal — the solution set as a string (shown in hint, not auto-checked)
 * hint — full step-by-step solution with the inequality sign
 */

const rnd  = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const pick = arr => arr[rnd(0, arr.length - 1)];
const VARS = ['x', 'n', 'm'];
const v    = () => pick(VARS);
const ineqQ = (eq, goal, hint) => ({ type: 'inequality', eq, goal, hint });

// sign helpers
const ops    = ['<', '>', '≤', '≥'];
const flip   = { '<': '>', '>': '<', '≤': '≥', '≥': '≤' };
const pickOp = () => pick(ops);

// ─── JSS1 — INTRODUCTION ─────────────────────────────────────

function simpleLinear() {
    const vr = v(), op = pickOp();
    const x  = rnd(1, 10), a = rnd(1, 8);
    const rhs = x + a;
    // x + a < rhs  →  solution: vr op (rhs - a) = x
    return ineqQ(`${vr}+${a}`,
        `${vr} ${op} ${x}`,
        `Solve ${vr}+${a} ${op} ${rhs}: subtract ${a} from both sides → ${vr} ${op} ${x}.`
    );
}

function simpleLinearMult() {
    const vr = v(), a = rnd(2, 8), x = rnd(1, 10);
    const op = pick(['<', '>','≤','≥']);
    return ineqQ(`${a}*${vr}`,
        `${vr} ${op} ${x}`,
        `Solve ${a}${vr} ${op} ${a*x}: divide both sides by ${a} (positive, sign keeps) → ${vr} ${op} ${x}.`
    );
}

// ─── JSS2 — NEGATIVE COEFFICIENTS ────────────────────────────

function negativeCoeff() {
    const vr = v();
    const a = rnd(2, 8), b = rnd(1, 10), op = pick(['<', '>', '≤', '≥']);
    const rhs = rnd(5, 20);
    // -a*x + b op rhs  → -a*x op (rhs-b) → x flipOp (rhs-b)/(-a)
    const numRHS = rhs - b;
    const sol = (-numRHS / a).toFixed(1);
    return ineqQ(`-${a}*${vr}+${b}`,
        `${vr} ${flip[op]} ${sol}`,
        `Solve -${a}${vr}+${b} ${op} ${rhs}: subtract ${b} → -${a}${vr} ${op} ${numRHS}. `
        + `Divide by -${a} (FLIP sign): ${vr} ${flip[op]} ${sol}.`
    );
}

// ─── JSS2 — COMPOUND (AND) ───────────────────────────────────

function compoundAnd() {
    const vr = v(), a = rnd(2, 6), b = rnd(1, 5);
    const lo = rnd(1, 5), hi = rnd(lo + 3, 12);
    // lo < a*vr + b < hi  →  (lo-b)/a < vr < (hi-b)/a
    const loSol = ((lo - b) / a).toFixed(1);
    const hiSol = ((hi - b) / a).toFixed(1);
    return ineqQ(`${a}*${vr}+${b}`,
        `${loSol} < ${vr} < ${hiSol}`,
        `Solve ${lo} < ${a}${vr}+${b} < ${hi}: subtract ${b} from all parts → ${lo-b} < ${a}${vr} < ${hi-b}, then divide by ${a} → ${loSol} < ${vr} < ${hiSol}.`
    );
}

// ─── JSS3 — QUADRATIC INEQUALITY ─────────────────────────────

function quadraticInequality() {
    const r1 = rnd(1, 5), r2 = rnd(r1 + 1, 7);
    const op = pick(['<', '>', '≤', '≥']);
    const B = -(r1 + r2), C = r1 * r2;
    const Bt = B === 0 ? '' : (B > 0 ? `+${B}*x` : `${B}*x`);
    const Ct = C === 0 ? '' : (C > 0 ? `+${C}` : `${C}`);

    let solution;
    if (op === '>' || op === '≥') {
        solution = `x < ${r1} or x > ${r2}`;
    } else {
        solution = `${r1} < x < ${r2}`;
    }
    const sign = op.includes('>') ? 'opens upward' : 'opens upward';
    return ineqQ(`x^2${Bt}${Ct}`,
        solution,
        `Factor: (x-${r1})(x-${r2}) ${op} 0. Roots at x=${r1} and x=${r2}. `
        + `Parabola opens up. ${op === '>' || op === '≥' ? `Outside roots: ${solution}.` : `Between roots: ${solution}.`}`
    );
}

// ─── JSS3 — LINEAR IN TWO VARIABLES ──────────────────────────

function linearTwoVar() {
    const m = rnd(1, 4), c = rnd(0, 5);
    const op = pick(['>', '<', '≥', '≤']);
    return ineqQ(`y-${m}*x`,
        `y ${op} ${m}x${c >= 0 ? '+' + c : c}`,
        `Graph the line y=${m}x+${c} (dashed for strict, solid for ≤/≥). `
        + `Shade the region ${op === '>' || op === '≥' ? 'above' : 'below'} the line.`
    );
}

// ─── SS1 — RATIONAL INEQUALITY ───────────────────────────────

function rationalInequality() {
    const a = rnd(1, 5), b = rnd(1, 5);
    const op = pick(['>', '<', '≥', '≤']);
    const critR = -a, critL = b;  // (x+a)/(x-b) op 0
    return ineqQ(`(x+${a})/(x-${b})`,
        `solution depends on sign analysis`,
        `Find critical points: x=-${a} and x=${b} (denominator zero). `
        + `Test intervals: x<-${a}, -${a}<x<${b}, x>${b}. `
        + `Numerator and denominator must have same sign for ${op}0. Exclude x=${b}.`
    );
}

// ─── SS1 — ABSOLUTE VALUE INEQUALITY ─────────────────────────

function absoluteValueInequality() {
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

// ─── SS1 — QUADRATIC INEQUALITY (ADVANCED / SIGN CHART) ──────

function signChartInequality() {
    const r1 = rnd(-4, -1), r2 = rnd(1, 4), r3 = rnd(r2 + 1, 7);
    const op = pick(['>', '<']);
    return ineqQ(`(x-${r1})*(x-${r2})*(x-${r3})`,
        `sign analysis needed`,
        `Roots: x=${r1}, x=${r2}, x=${r3}. `
        + `Use sign chart: test each interval. Product ${op}0 when odd number of negative factors (for >) or even (for <).`
    );
}

// ─── SS2 — POLYNOMIAL INEQUALITY ─────────────────────────────

function polynomialInequality() {
    const r1 = rnd(-3, 0), r2 = rnd(1, 3), r3 = rnd(r2 + 1, 5);
    const op = pick(['>', '≥', '<', '≤']);
    return ineqQ(`(x-${r1})*(x-${r2})*(x-${r3})`,
        `sign analysis needed`,
        `Cubic with roots x=${r1}, ${r2}, ${r3}. `
        + `Sign chart: the cubic is positive when x→+∞. Intervals: x<${r1}, ${r1}<x<${r2}, ${r2}<x<${r3}, x>${r3}.`
    );
}

// ─── SS2 — LINEAR PROGRAMMING ────────────────────────────────

function linearProgramming() {
    const a1=rnd(1,3), b1=rnd(1,3), c1=rnd(6,15);
    const a2=rnd(1,3), b2=rnd(1,3), c2=rnd(6,15);
    return ineqQ(`${a1}*x+${b1}*y`,
        `feasible region`,
        `Constraint 1: ${a1}x+${b1}y ≤ ${c1}. Constraint 2: ${a2}x+${b2}y ≤ ${c2}. `
        + `Also x≥0, y≥0. Graph both lines, shade feasible region, evaluate objective function at each vertex.`
    );
}

// ─── SS3 — RATIONAL & RADICAL ────────────────────────────────

function rationalRadicalInequality() {
    const a = rnd(2, 5), b = rnd(1, 4);
    return pick([
        ineqQ(`(x^2-${a*a})/(x+${b})`,
            `sign analysis needed`,
            `Factor: (x-${a})(x+${a})/(x+${b}). Critical pts: x=${-b},${-a},${a}. Sign chart across 4 intervals. Exclude x=${-b}.`),
        ineqQ(`sqrt(x+${b})`,
            `x ≥ ${-b}`,
            `For √(x+${b}) ≥ 0: domain requires x+${b} ≥ 0 → x ≥ ${-b}. Further inequality from the full problem.`),
    ]);
}

// ─── SS3 — ABSOLUTE VALUE WITH QUADRATICS ────────────────────

function absQuadratic() {
    const a = rnd(1,5), b = rnd(1, 6);
    return ineqQ(`x^2-${a*2}*x+${a*a-b}`,
        `|...| analysis needed`,
        `Solve |x²-${2*a}x+${a*a-b}| < ${b}: equivalent to -${b} < x²-${2*a}x+${a*a-b} < ${b}. `
        + `Solve both halves: x²-${2*a}x+${a*a-2*b}<0 and x²-${2*a}x+${a*a}>0.`
    );
}

// ─── DISPATCH ─────────────────────────────────────────────────

export function generateInequality(topic, subtopic, classId) {
    const t = topic.toLowerCase();
    const s = (subtopic || '').toLowerCase();

    if (t.includes('introduction') || t.includes('simple inequality') || t.includes('intro')) {
        return s.includes('multiply') || s.includes('2x') ? simpleLinearMult() : simpleLinear();
    }
    if (t.includes('negative coefficient')) return negativeCoeff();
    if (t.includes('compound') && t.includes('and')) return compoundAnd();
    if (t.includes('linear') && t.includes('two variable')) return linearTwoVar();
    if (t.includes('quadratic') && t.includes('advanced')) return signChartInequality();
    if (t.includes('quadratic') && t.includes('inequalit')) return quadraticInequality();
    if (t.includes('rational') && t.includes('radical')) return rationalRadicalInequality();
    if (t.includes('rational') && t.includes('inequalit')) return rationalInequality();
    if (t.includes('absolute value') && t.includes('quadratic')) return absQuadratic();
    if (t.includes('absolute value') || t.includes('absolute val')) return absoluteValueInequality();
    if (t.includes('polynomial')) return polynomialInequality();
    if (t.includes('linear programming') || t.includes('programming')) return linearProgramming();
    if (t.includes('system') && t.includes('linear')) return compoundAnd();
    if (t.includes('word') && t.includes('inequalit')) {
        // Word-style inequality framed as algebra
        const x = rnd(5, 20), a = rnd(2, 6);
        return ineqQ(`${a}*x+${rnd(1,8)}`,
            `x ≤ ${x}`,
            `"At most ${a*x+rnd(1,8)} total" → set up ${a}x+... ≤ limit and solve.`
        );
    }

    // Fallback
    return simpleLinear();
}
