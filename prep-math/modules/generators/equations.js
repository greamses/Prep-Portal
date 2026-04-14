/**
 * generators/equations.js
 * Algorithmic equation generator for all class levels.
 * Takes (topic, subtopic, classId, method) and returns { type:'equation', eq, goal, hint }
 *
 * GM eq format: letters, digits, +, -, *, /, ^, =, parentheses — no spaces.
 * goal: exact ASCII solution, no spaces, e.g. "x=7" or "x=3,y=2"
 */

// ─── Utilities ────────────────────────────────────────────────
const rnd   = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const pick  = arr => arr[rnd(0, arr.length - 1)];
const VARS  = ['x', 'n', 'm', 'y', 'k'];
const v     = () => pick(VARS);
const eqQ   = (eq, goal, hint) => ({ type: 'equation', eq, goal, hint });

const hintFor = (method, removeStep, divideStep) =>
    method === 'balancing' ? `${removeStep} from both sides, then ${divideStep}.`
                           : `Move the constant across: ${removeStep}, then ${divideStep}.`;

// ─── PRIMARY ─────────────────────────────────────────────────

function missingAddend(max) {
    const x = rnd(1, max - 1), a = rnd(1, max - x);
    return pick([
        eqQ(`x+${a}=${x+a}`, `x=${x}`, `Subtract ${a} from both sides.`),
        eqQ(`${a}+x=${x+a}`, `x=${x}`, `Subtract ${a} from both sides.`),
        eqQ(`${x+a}-x=${a}`, `x=${x}`, `Subtract ${a} from ${x+a}.`),
    ]);
}

function missingProduct() {
    const a = pick([2,3,4,5,6,8,9,10]), x = rnd(2, 10);
    return pick([
        eqQ(`${a}*x=${a*x}`,  `x=${x}`, `Divide both sides by ${a}.`),
        eqQ(`x*${a}=${a*x}`,  `x=${x}`, `Divide both sides by ${a}.`),
        eqQ(`x/${a}=${x}`,    `x=${a*x}`, `Multiply both sides by ${a}.`),
    ]);
}

function fractionEq() {
    const d = pick([2,3,4,5,8,10]), x = rnd(2,8);
    return pick([
        eqQ(`x/${d}=${x}`,       `x=${d*x}`,  `Multiply both sides by ${d}.`),
        eqQ(`x/${d}+1=${x+1}`,   `x=${d*x}`,  `Subtract 1 first, then multiply by ${d}.`),
        eqQ(`${d}*x+2=${d*x+2}`, `x=${x}`,    `Subtract 2, then divide by ${d}.`),
    ]);
}

function decimalEq() {
    const d = pick([2, 4, 5, 10]);
    const x = rnd(1, 8);
    const a = (rnd(1, 5) / 10).toFixed(1);
    const b = (x * d / 10 + parseFloat(a)).toFixed(1);
    return pick([
        eqQ(`x+${a}=${b}`, `x=${(parseFloat(b)-parseFloat(a)).toFixed(1)}`, `Subtract ${a} from both sides.`),
        eqQ(`${a}*${d}*x=${parseFloat(a)*d*x}`, `x=${x}`, `Divide both sides by ${parseFloat(a)*d}.`),
    ]);
}

// ─── JSS/SS — LINEAR ─────────────────────────────────────────

function linearOneStep(method) {
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

function linearBothSides(method) {
    const vr = v();
    const x = rnd(1, 8), c = rnd(2, 6), b = rnd(1, 12), d = rnd(b+1, 20);
    const a = c + Math.ceil((d - b) / x);
    return eqQ(`${a}*${vr}+${b}=${c}*${vr}+${(a-c)*x+b}`, `${vr}=${x}`,
        method === 'balancing'
            ? `Subtract ${c}${vr} from both sides, then subtract ${b}.`
            : `Move ${vr} terms left, constants right.`);
}

function bracketEq(method) {
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

function fractionLinearEq(method) {
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

function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); }

// ─── JSS3/SS1 — SIMULTANEOUS ─────────────────────────────────

function simultaneousSubstitution() {
    const x = rnd(1, 7), y = rnd(1, 7), m = rnd(2, 5);
    const b = y - m * x;
    return eqQ(`${m}*x+y=${m*x+y}`, `x=${x},y=${y}`,
        `Second equation y=${m<0?m+'x+'+b:m+'*x'+sign(b)}. Substitute into first and solve. Answer: x=${x}, y=${y}.`);
}
const sign = n => n >= 0 ? `+${n}` : `${n}`;

function simultaneousElimination() {
    const x = rnd(1,6), y = rnd(1,6);
    const a1=rnd(2,4), a2=rnd(2,4), b1=rnd(1,4), b2=rnd(1,4);
    return eqQ(`${a1}*x+${b1}*y=${a1*x+b1*y}`, `x=${x},y=${y}`,
        `Second equation: ${a2}x+${b2}y=${a2*x+b2*y}. Eliminate one variable by scaling and adding/subtracting. x=${x}, y=${y}.`);
}

// ─── JSS3/SS — QUADRATIC ─────────────────────────────────────

function quadraticFactoring(advanced = false) {
    const r1 = advanced ? rnd(-5, -1) : rnd(1, 6);
    const r2 = rnd(1, 6);
    const B = -(r1 + r2), C = r1 * r2;
    const Bterm = B === 0 ? '' : (B > 0 ? `+${B}*x` : `${B}*x`);
    const Cterm = C === 0 ? '' : (C > 0 ? `+${C}` : `${C}`);
    return eqQ(`x^2${Bterm}${Cterm}=0`, `x=${Math.max(r1,r2)}`,
        `Find two numbers with product ${C} and sum ${-B}. Roots: x=${r1} or x=${r2}.`);
}

function quadraticCompleteSquare() {
    const h = rnd(-4, 4), k = rnd(1, 9);
    const B = -2*h, C = h*h - k;
    const Bterm = B === 0 ? '' : (B > 0 ? `+${B}*x` : `${B}*x`);
    const Cterm = C === 0 ? '' : (C > 0 ? `+${C}` : `${C}`);
    const r1 = (h + Math.sqrt(k)).toFixed(1), r2 = (h - Math.sqrt(k)).toFixed(1);
    return eqQ(`x^2${Bterm}${Cterm}=0`, `x=${r1}`,
        `Complete the square: (x${h>=0?'-'+h:'+'+Math.abs(h)})²=${k}. Solutions: x=${r1} or x=${r2}.`);
}

function quadraticFormula() {
    const a = rnd(1, 4), b = rnd(-6, 6), c = rnd(-8, 8);
    const disc = b*b - 4*a*c;
    if (disc < 0) return quadraticFormula(); // retry for real roots
    const x1 = ((-b + Math.sqrt(disc)) / (2*a)).toFixed(2);
    const x2 = ((-b - Math.sqrt(disc)) / (2*a)).toFixed(2);
    const Bterm = b === 0 ? '' : (b > 0 ? `+${b}*x` : `${b}*x`);
    const Cterm = c === 0 ? '' : (c > 0 ? `+${c}` : `${c}`);
    const aStr = a === 1 ? '' : `${a}*`;
    return eqQ(`${aStr}x^2${Bterm}${Cterm}=0`, `x=${x1}`,
        `Use the quadratic formula with a=${a}, b=${b}, c=${c}. Discriminant=${disc}. x=${x1} or x=${x2}.`);
}

// ─── SS — EXPONENTIAL & LOGARITHMIC ─────────────────────────

function exponentialEq() {
    const templates = [
        () => { const p=rnd(1,4); return eqQ(`2^x=${Math.pow(2,p)}`,`x=${p}`,`Express RHS as a power of 2: 2^${p}. Then x=${p}.`); },
        () => { const p=rnd(1,3); return eqQ(`3^(2*x-1)=${Math.pow(3,2*p-1)}`,`x=${p}`,`Set exponents equal: 2x-1=${2*p-1}, so x=${p}.`); },
        () => { const p=rnd(1,3); return eqQ(`4^x-2^(x+1)=0`,`x=1`,`Rewrite 4^x as 2^(2x): 2^(2x)=2^(x+1), so 2x=x+1.`); },
    ];
    return pick(templates)();
}

function logarithmicEq() {
    const templates = [
        () => { const b=pick([2,3,5,10]),p=rnd(1,4); return eqQ(`log${b}x=${p}`,`x=${Math.pow(b,p)}`,`Convert: x=${b}^${p}=${Math.pow(b,p)}.`); },
        () => { const p=rnd(2,5); return eqQ(`log(x)+log(x-1)=log(${p*(p-1)})`,`x=${p}`,`Combine logs: log(x(x-1))=log(${p*(p-1)}). Solve x²-x-${p*(p-1)}=0.`); },
    ];
    return pick(templates)();
}

// ─── SS2 — TRIGONOMETRIC ─────────────────────────────────────

function trigEq() {
    // Present as equation the student solves; GM canvas used for workings
    const angles = [30,45,60,90,0];
    const θ = pick(angles);
    const sinVal = Math.round(Math.sin(θ * Math.PI/180) * 100) / 100;
    return eqQ(`sin(x)=${sinVal}`, `x=${θ}`,
        `sin(${θ}°)=${sinVal}. In [0°,360°]: x=${θ}° and x=${180-θ}°.`);
}

function suRdEq() {
    const a = rnd(3, 8), b = rnd(1, 4);
    const x = (a - b) * (a - b) - b; // x such that sqrt(x+b)+b = a, i.e. sqrt(x+b)=a-b
    // Actually: sqrt(x+c) = a → x = a²-c
    const c = rnd(1, 6), aVal = rnd(3, 8);
    const xSol = aVal * aVal - c;
    return eqQ(`sqrt(x+${c})=${aVal}`, `x=${xSol}`,
        `Square both sides: x+${c}=${aVal*aVal}. So x=${xSol}.`);
}

// ─── SS3 — DIFFERENTIAL ─────────────────────────────────────

function differentialEq() {
    const k = rnd(2, 5), C = rnd(0, 4);
    return eqQ(`dy/dx=${k}*x`, `y=${k/2}*x^2+C`,
        `Integrate both sides: y = ∫${k}x dx = ${k/2}x²+C. Use initial conditions to find C.`);
}

// ─── DISPATCH ─────────────────────────────────────────────────

export function generateEquation(topic, subtopic, classId, method = 'transfer') {
    const t = topic.toLowerCase();
    const s = (subtopic || '').toLowerCase();

    // Primary — missing number
    if (t.includes('addition') && (t.includes('1-10') || t.includes('within 10') || t.includes('p1') || classId === 'p1')) return missingAddend(10);
    if (t.includes('addition') && (t.includes('1-20') || t.includes('within 20'))) return missingAddend(20);
    if (t.includes('addition') && (t.includes('1-100') || t.includes('within 100'))) return missingAddend(100);
    if (t.includes('addition')) return missingAddend(20);
    if (t.includes('subtraction') && !t.includes('word')) return missingAddend(20);
    if (t.includes('multiplication') && !t.includes('word') && !t.includes('multi-digit')) return missingProduct();
    if (t.includes('division') && !t.includes('word') && !t.includes('remainder')) {
        const d = pick([2,3,4,5,6]), x = rnd(2,10);
        return eqQ(`x/${d}=${x}`, `x=${d*x}`, `Multiply both sides by ${d}.`);
    }
    if (t.includes('multi-digit multiplication')) {
        const a = rnd(2,9), b = rnd(10,99);
        return eqQ(`${a}*x=${a*b}`, `x=${b}`, `Divide both sides by ${a}.`);
    }
    if (t.includes('division with remainder')) {
        const d = rnd(3,9), q = rnd(2,9), r = rnd(0, d-1);
        return eqQ(`x/${d}=${q}`, `x=${d*q}`, `Multiply both sides by ${d}. (Ignore remainder for equation form.)`);
    }
    if (t.includes('fraction equation') || (t.includes('fraction') && t.includes('equation'))) return fractionEq();
    if (t.includes('decimal equation') || (t.includes('decimal') && t.includes('equation'))) return decimalEq();
    if (t.includes('percentage equation')) {
        const pct = pick([10,20,25,50]), whole = rnd(4,20)*10;
        return eqQ(`${pct/100}*x=${pct*whole/100}`, `x=${whole}`, `Divide both sides by ${pct/100} (i.e. multiply by ${100/pct}).`);
    }
    if (t.includes('ratio equation')) {
        const a=rnd(2,6),b=rnd(2,6),k=rnd(2,5);
        return eqQ(`${a}/x=${a*k}/${b*k}`, `x=${b}`, `Cross-multiply: ${a}×${b*k}=${a*k}×x, so x=${b}.`);
    }
    if (t.includes('order of operations') && t.includes('equation')) {
        const m=rnd(2,5),x=rnd(2,8),a=rnd(2,10);
        return eqQ(`${a}+${m}*x=${a+m*x}`, `x=${x}`, `Subtract ${a} first, then divide by ${m}.`);
    }
    if (t.includes('one-step equation')) return linearOneStep(method);
    if (t.includes('two-step equation')) {
        const a=rnd(2,8), x=rnd(1,10), b=rnd(1,12);
        return eqQ(`${a}*x+${b}=${a*x+b}`, `x=${x}`,
            hintFor(method, `subtract ${b}`, `divide by ${a}`));
    }
    if (t.includes('bracket') || t.includes('brackets')) return bracketEq(method);
    if (t.includes('algebraic fraction') || (t.includes('fraction') && t.includes('variable'))) return fractionLinearEq(method);
    if (t.includes('linear') && t.includes('both side')) return linearBothSides(method);
    if (t.includes('linear equation') || t.includes('linear equations')) return linearOneStep(method);
    if (t.includes('forming') && t.includes('solving')) return linearOneStep(method);
    if (t.includes('number base')) {
        const dec = rnd(5,30), base = pick([2,5,8]);
        const conv = dec.toString(base);
        return eqQ(`x=${dec}`, `x=${dec}`,
            `${conv} in base ${base} = ${dec} in base 10. Check by expanding: ${conv.split('').map((d,i,a)=>`${d}×${base}^${a.length-1-i}`).join('+')} = ${dec}.`);
    }
    if (t.includes('substitution') && (t.includes('simultaneous') || t.includes('system'))) return simultaneousSubstitution();
    if (t.includes('elimination') && t.includes('simultaneous')) return simultaneousElimination();
    if (t.includes('simultaneous')) return pick([simultaneousSubstitution, simultaneousElimination])();
    if (t.includes('quadratic') && t.includes('formula')) return quadraticFormula();
    if (t.includes('quadratic') && t.includes('completing')) return quadraticCompleteSquare();
    if (t.includes('quadratic') && (t.includes('factor') || t.includes('factori'))) return quadraticFactoring(false);
    if (t.includes('quadratic') && (classId==='ss1'||classId==='ss2'||classId==='ss3')) return quadraticFactoring(true);
    if (t.includes('quadratic')) return quadraticFactoring(['ss1','ss2','ss3'].includes(classId));
    if (t.includes('nature of root') || t.includes('discriminant')) {
        const a=rnd(1,4),b=rnd(-6,6),c=rnd(-8,8);
        const d=b*b-4*a*c;
        const verdict = d>0?'two distinct real roots':d===0?'one repeated root':'no real roots';
        return eqQ(`${a!==1?a+'*':''}x^2${b>0?'+'+b:''+b}*x${c>0?'+'+c:''+c}=0`, `disc=${d}`,
            `D=b²-4ac=${b}²-4(${a})(${c})=${d}. Since D${d>0?'>':d<0?'<':'='}0, there are ${verdict}.`);
    }
    if (t.includes('exponential')) return exponentialEq();
    if (t.includes('logarithm') || t.includes('log')) return logarithmicEq();
    if (t.includes('trigonometric') || t.includes('trig')) return trigEq();
    if (t.includes('surd')) return suRdEq();
    if (t.includes('differential') || t.includes('dy/dx')) return differentialEq();
    if (t.includes('parametric')) {
        const m=rnd(1,5), c=rnd(0,4);
        return eqQ(`y-${m}*x=${c}`, `y=${m}*x+${c}`,
            `Rearrange: y=${m}x+${c}. This is the Cartesian form of the parametric equations.`);
    }
    if (t.includes('exponential') && t.includes('system')) return exponentialEq();

    // Fallback: generic linear
    return linearOneStep(method);
}
