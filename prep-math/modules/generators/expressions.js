/**
 * generators/expressions.js
 * Algorithmic expression generator for all class levels.
 * Returns { type:'expression', eq, goal, hint }
 *
 * eq   — the expression to mount on GM canvas (no '=' sign)
 * goal — simplified form (shown in hint only, not auto-checked)
 * hint — what to do
 */

const rnd  = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const pick = arr => arr[rnd(0, arr.length - 1)];
const VARS = ['x', 'a', 'y', 'm', 'n'];
const v    = () => pick(VARS);
const expQ = (eq, goal, hint) => ({ type: 'expression', eq, goal, hint });

// Helper function for GCD
const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);

// Helper function to validate expressions
function validateExpression(eq, goal) {
  if (!eq || eq.includes('NaN') || eq.includes('undefined') || eq.includes('null')) {
    console.warn('Invalid expression generated:', eq);
    return false;
  }
  if (!goal || goal.includes('NaN') || goal.includes('undefined')) {
    console.warn('Invalid goal generated:', goal);
    return false;
  }
  return true;
}

// ─── PRIMARY / JSS1 — writing & evaluating ───────────────────

function writingExpression() {
    const vr = v(), a = rnd(2,9), b = rnd(1,8);
    const expressions = [
        expQ(`${a}+${b}`,       `${a+b}`,       `Evaluate: ${a}+${b}=${a+b}.`),
        expQ(`${a+b}-${b}`,     `${a}`,         `Evaluate: ${a+b}-${b}=${a}.`),
        expQ(`${vr}+${b}`,      `${vr}+${b}`,   `This expression means "some number plus ${b}". Leave in simplest form.`),
        expQ(`2*${vr}+${b}`,    `2*${vr}+${b}`, `"Twice a number plus ${b}". It cannot be simplified further.`),
    ];
    return pick(expressions);
}

function evaluatingExpression() {
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

function orderOfOps() {
    const templates = [
        () => { const a=rnd(2,6),b=rnd(2,6),c=rnd(1,5); return expQ(`${a}*(${b}+${c})`,`${a*(b+c)}`,`Brackets first: ${b}+${c}=${b+c}, then ×${a}=${a*(b+c)}.`); },
        () => { const a=rnd(2,9),b=rnd(2,6),c=rnd(2,5); return expQ(`${a}+${b}*${c}`,`${a+b*c}`,`Multiply first: ${b}×${c}=${b*c}, then add ${a}.`); },
        () => { const a=rnd(10,20),b=rnd(2,5),c=rnd(1,4); return expQ(`${a}-${b}*${c}`,`${a-b*c}`,`Multiply first: ${b}×${c}=${b*c}, then subtract from ${a}.`); },
        () => { const a=rnd(2,5),b=rnd(2,5),c=rnd(2,5),d=rnd(1,4);
                return expQ(`(${a}+${b})*(${c}-${d})`,`${(a+b)*(c-d)}`,`Evaluate each bracket first, then multiply.`); },
    ];
    return pick(templates)();
}

// ─── SIMPLIFICATION ──────────────────────────────────────────

function simplifyLikeTerms() {
    const vr = v(), a=rnd(2,8), b=rnd(2,7), c=rnd(1,6), d=rnd(1,5);
    const expressions = [
        expQ(`${a}*${vr}+${b}*${vr}`,         `${a+b}*${vr}`,          `Add coefficients of ${vr}: ${a}+${b}=${a+b}.`),
        expQ(`${a+b}*${vr}-${b}*${vr}`,       `${a}*${vr}`,            `Subtract coefficients: ${a+b}−${b}=${a}.`),
        expQ(`${a}*${vr}+${c}+${b}*${vr}+${d}`, `${a+b}*${vr}+${c+d}`,  `Group like terms: (${a}+${b})${vr}+(${c}+${d}).`),
        expQ(`${a}*${vr}-${b}*${vr}+${c}`,    `${a-b}*${vr}+${c}`,     `Collect ${vr} terms: (${a}-${b})${vr}+${c}.`),
    ];
    return pick(expressions);
}

function distributive() {
    const vr = v(), a=rnd(2,8), b=rnd(2,7), c=rnd(1,6);
    const expressions = [
        expQ(`${a}*(${vr}+${b})`,  `${a}*${vr}+${a*b}`,   `Expand: ${a}×${vr}+${a}×${b}=${a}${vr}+${a*b}.`),
        expQ(`${a}*(${vr}-${c})`,  `${a}*${vr}-${a*c}`,   `Expand: ${a}×${vr}-${a}×${c}=${a}${vr}-${a*c}.`),
        expQ(`${vr}*(${vr}+${b})`, `${vr}^2+${b}*${vr}`,  `Expand: ${vr}×${vr}+${vr}×${b}=${vr}²+${b}${vr}.`),
    ];
    return pick(expressions);
}

function simpleFactoring() {
    const cf=rnd(2,6), a=rnd(2,8), b=rnd(1,7);
    const vr = v();
    const expressions = [
        expQ(`${cf*a}*${vr}+${cf*b}`,  `${cf}*(${a}*${vr}+${b})`, `HCF of ${cf*a} and ${cf*b} is ${cf}. Factor out ${cf}.`),
        expQ(`${cf}*${vr}^2+${cf*b}*${vr}`, `${cf}*${vr}*(${vr}+${b})`, `Factor out ${cf}${vr} from both terms.`),
    ];
    return pick(expressions);
}

// ─── INDICES ─────────────────────────────────────────────────

function indicesExpression() {
    const b = pick(['x','a','y','m']);
    const p = rnd(2,5), q = rnd(2,4);
    const expressions = [
        expQ(`${b}^${p}*${b}^${q}`,    `${b}^${p+q}`,  `Multiply same base: add powers → ${b}^${p+q}.`),
        expQ(`${b}^${p+q}/${b}^${q}`,  `${b}^${p}`,    `Divide same base: subtract powers → ${b}^${p}.`),
        expQ(`(${b}^${p})^${q}`,        `${b}^${p*q}`,  `Power of power: multiply indices → ${b}^${p*q}.`),
        expQ(`${b}^0*${b}^${p}`,        `${b}^${p}`,    `Any base^0 = 1, so this equals ${b}^${p}.`),
        expQ(`${b}^(-${q})`,            `1/${b}^${q}`,  `Negative index: ${b}^-${q} = 1/${b}^${q}.`),
        expQ(`(${rnd(2,4)}*${b}^${p})^${2}`, `${rnd(2,4)**2}*${b}^${p*2}`, `Apply power to both coefficient and base.`),
    ];
    return pick(expressions);
}

function indicialSimplify() {
    const m = rnd(2,5), n = rnd(2,4), p = rnd(2,4);
    const vr = pick(['x','y','a']);
    const expressions = [
        expQ(`${m}*${vr}^${p}*${n}*${vr}^${2}`,    `${m*n}*${vr}^${p+2}`, `Multiply coefficients, add powers: ${m}×${n}=${m*n} and ${p}+2=${p+2}.`),
        expQ(`(${m}*${vr}^${p})/(${n}*${vr}^${2})`, `${m/gcd(m,n)}*${vr}^${p-2}/${n/gcd(m,n)}`, `Divide coefficients and subtract powers: ${p}-2=${p-2}.`),
        expQ(`(${m}*${vr}^${p})^${2}`, `${m**2}*${vr}^${p*2}`, `Apply the outer power to coefficient and exponent: ${m}²=${m**2} and ${p}×2=${p*2}.`),
    ];
    return pick(expressions);
}

// ─── EXPANDING & FACTORISING ─────────────────────────────────

function expandBinomials() {
    const a=rnd(1,5), b=rnd(1,5), c=rnd(1,5);
    const vr = 'x';
    const expressions = [
        expQ(`(${vr}+${a})*(${vr}+${b})`, `${vr}^2+${a+b}*${vr}+${a*b}`, `FOIL: x²+(${a}+${b})x+${a}×${b}=x²+${a+b}x+${a*b}.`),
        expQ(`(${vr}+${a})*(${vr}-${b})`, `${vr}^2+${a-b}*${vr}-${a*b}`, `FOIL: x²+(${a}-${b})x-${a*b}.`),
        expQ(`(${vr}-${a})*(${vr}-${b})`, `${vr}^2-${a+b}*${vr}+${a*b}`, `FOIL: x²-(${a}+${b})x+${a*b}.`),
        expQ(`(${c}*${vr}+${a})*(${vr}+${b})`, `${c}*${vr}^2+${c*b+a}*${vr}+${a*b}`, `Expand: ${c}x²+(${c*b}+${a})x+${a*b}.`),
    ];
    return pick(expressions);
}

function factoriseQuadratic() {
    const r1=rnd(1,5), r2=rnd(1,5), neg=pick([true,false]);
    const R2 = neg ? -r2 : r2;
    const B = -(r1+R2), C = r1*R2;
    const Bt = B===0 ? '' : (B>0 ? `+${B}*x` : `${B}*x`);
    const Ct = C===0 ? '' : (C>0 ? `+${C}` : `${C}`);
    const expressions = [
        expQ(`x^2${Bt}${Ct}`, `(x${r1>=0?'-'+r1:'+'+Math.abs(r1)})*(x${R2>=0?'-'+R2:'+'+Math.abs(R2)})`,
            `Find two numbers with product ${C} and sum ${-B}: use ${-r1} and ${-R2}.`),
        expQ(`x^2-${r1*r1}`, `(x-${r1})*(x+${r1})`, `Difference of squares: a²-b²=(a-b)(a+b). Here a=x, b=${r1}.`),
    ];
    return pick(expressions);
}

function cubesExpression() {
    const a=rnd(2,4);
    const expressions = [
        expQ(`x^3-${a}^3`,           `(x-${a})*(x^2+${a}*x+${a*a})`, `Difference of cubes: a³-b³=(a-b)(a²+ab+b²). Let b=${a}.`),
        expQ(`x^3+${a}^3`,           `(x+${a})*(x^2-${a}*x+${a*a})`, `Sum of cubes: a³+b³=(a+b)(a²-ab+b²). Let b=${a}.`),
        expQ(`${8*a}*x^3-${a}`,      `${a}*(8*x^3-1)`,                `Factor out ${a}: ${a}(8x³-1). Recognise 8x³-1 as a difference of cubes.`),
    ];
    return pick(expressions);
}

// ─── RATIONAL EXPRESSIONS ────────────────────────────────────

function rationalExpr() {
    const r1=rnd(1,4), r2=rnd(1,4);
    const expressions = [
        expQ(`(x^2-${r1*r1})/(x-${r1})`, `x+${r1}`, `Factor numerator: (x-${r1})(x+${r1}). Cancel (x-${r1}).`),
        expQ(`(x^2+${r1+r2}*x+${r1*r2})/(x+${r1})`, `x+${r2}`, `Factor: (x+${r1})(x+${r2}). Cancel (x+${r1}).`),
        expQ(`(2*x^2-${2*r1*r1})/(x-${r1})`, `2*(x+${r1})`, `Factor: 2(x-${r1})(x+${r1}). Cancel (x-${r1}).`),
    ];
    return pick(expressions);
}

function algebraicFractionOps() {
    const a=rnd(2,6), b=rnd(2,6), vr='x';
    const expressions = [
        expQ(`${a}/${vr}+${b}/${vr}`,     `${a+b}/${vr}`,  `Same denominator: add numerators → ${a+b}/${vr}.`),
        expQ(`${a}/(${vr}+1)+${b}/(${vr}+1)`, `${a+b}/(${vr}+1)`, `Same denominator: add numerators.`),
        expQ(`(2*${vr}/${3})*(${3}/(${vr}))`, `2`, `Multiply fractions; cancel ${vr} and 3.`),
    ];
    return pick(expressions);
}

// ─── SS — POLYNOMIALS ────────────────────────────────────────

function polynomialOps() {
    const a=rnd(1,5), b=rnd(1,5), c=rnd(1,5), d=rnd(1,5);
    const expressions = [
        expQ(`(${a}*x^2+${b}*x+${c})+(${d}*x^2+${rnd(1,5)}*x+${rnd(1,5)})`,
            `${a+d}*x^2+${b+rnd(1,5)}*x+${c+rnd(1,5)}`,
            `Add like terms: combine x² terms, then x terms, then constants.`),
        expQ(`${a}*x^3-${b}*x^2+${c}*x-${d}`,
            `${a}x^3-${b}x^2+${c}x-${d}`,
            `Degree 3 polynomial. Identify coefficients: a=${a}, b=-${b}, c=${c}, d=-${d}.`),
    ];
    return pick(expressions);
}

function remainderTheorem() {
    const a=rnd(1,4), b=rnd(0,5), c=rnd(0,5), d=rnd(0,4);
    const root = rnd(1,3);
    const R = a*Math.pow(root,3) - b*Math.pow(root,2) + c*root - d;
    return expQ(`${a}*x^3-${b}*x^2+${c}*x-${d}`,
        `R=${R}`,
        `Use remainder theorem: substitute x=${root}. R=${a}(${root})³-${b}(${root})²+${c}(${root})-${d}=${R}.`);
}

// ─── SS — BINOMIAL EXPANSION ─────────────────────────────────

function binomialExpansion() {
    const a=rnd(1,4);
    const expressions = [
        expQ(`(x+${a})^2`, `x^2+${2*a}*x+${a*a}`, `Pascal's row 1,2,1: x²+2(${a})x+${a}²=x²+${2*a}x+${a*a}.`),
        expQ(`(x-${a})^2`, `x^2-${2*a}*x+${a*a}`, `Pascal's row 1,2,1: x²-2(${a})x+${a}²=x²-${2*a}x+${a*a}.`),
        expQ(`(x+${a})^3`, `x^3+${3*a}*x^2+${3*a*a}*x+${a*a*a}`, `Pascal's row 1,3,3,1 for n=3.`),
        expQ(`(x+${a})*(x-${a})`, `x^2-${a*a}`, `Difference of squares: (x+${a})(x-${a})=x²-${a*a}.`),
    ];
    return pick(expressions);
}

// ─── SS2 — PARTIAL FRACTIONS ─────────────────────────────────

function partialFractions() {
    const p=rnd(1,4), q=rnd(p+1,6), A=rnd(1,5), B=rnd(1,5);
    const num1=A+B, num2=A*q+B*p;
    return expQ(
        `(${num1}*x+${num2})/((x+${p})*(x+${q}))`,
        `${A}/(x+${p})+${B}/(x+${q})`,
        `Set up: ${num1}x+${num2} = A(x+${q}) + B(x+${p}). Solve: when x=-${p}, get A=${A}; when x=-${q}, get B=${B}.`
    );
}

// ─── SS2 — LOGARITHMIC EXPRESSIONS ──────────────────────────

function logExpression() {
    const a=rnd(2,5), b=rnd(2,5);
    const expressions = [
        expQ(`log(${a*b})`, `log(${a})+log(${b})`, `Product rule: log(ab)=log a+log b.`),
        expQ(`log(${Math.pow(a,2)})`, `2*log(${a})`, `Power rule: log(a²)=2 log a.`),
        expQ(`log(${a})+log(${b})`, `log(${a*b})`, `Combine: log ${a}+log ${b}=log(${a}×${b})=log ${a*b}.`),
        expQ(`2*log(${a})-log(${a*a})`, `log(${a*a}/${b})`, `Use power rule: 2log(${a})=log(${a}²), then quotient rule.`),
    ];
    return pick(expressions);
}

// ─── SS2 — COMPLEX NUMBERS ───────────────────────────────────

function complexNumbers() {
    const a=rnd(1,6), b=rnd(1,6), c=rnd(1,6), d=rnd(1,6);
    const expressions = [
        expQ(`(${a}+${b}*i)+(${c}+${d}*i)`, `${a+c}+${b+d}*i`, `Add real parts and imaginary parts separately.`),
        expQ(`(${a}+${b}*i)*(${c}+${d}*i)`, `${a*c-b*d}+${a*d+b*c}*i`, `FOIL: remember i²=-1. Real part=${a*c}-${b*d}=${a*c-b*d}, imaginary=${a*d+b*c}.`),
        expQ(`i^2`, `-1`, `By definition: i=√(-1), so i²=-1.`),
        expQ(`(${a}+${b}*i)*(${a}-${b}*i)`, `${a*a+b*b}`, `Conjugate product: a²+b²=${a*a+b*b}. Always a real number.`),
    ];
    return pick(expressions);
}

// ─── SS3 — MATRICES ─────────────────────────────────────────

function matrices() {
    const a=rnd(1,5),b=rnd(1,5),c=rnd(1,5),d=rnd(1,5);
    const det = a*d - b*c;
    const expressions = [
        expQ(`det([[${a},${b}],[${c},${d}]])`, `${det}`, `det = ad-bc = ${a}×${d}-${b}×${c} = ${det}.`),
        expQ(`[[${a},${b}],[${c},${d}]]+[[${rnd(1,4)},${rnd(1,4)}],[${rnd(1,4)},${rnd(1,4)}]]`, `[[${a+rnd(1,4)},${b+rnd(1,4)}],[${c+rnd(1,4)},${d+rnd(1,4)}]]`, `Matrix addition: add corresponding entries.`),
    ];
    return pick(expressions);
}

function polynomialDivision() {
    const a=rnd(1,3), b=rnd(0,4), c=rnd(0,4), root=rnd(1,3);
    return expQ(`(${a}*x^2+${a*root+b}*x+${b*root+c})/(x+${root})`,
        `${a}*x+${b} + ${c}/(x+${root})`,
        `Perform polynomial long division or synthetic division (root=-${root}).`);
}

function rationalFunctions() {
    const a=rnd(2,4), b=rnd(1,4);
    return expQ(`(x^2-${a*a})/(x^2-${a+b}*x+${a*b})`,
        `(x+${a})/(x-${b})`,
        `Factor: numerator=(x-${a})(x+${a}), denominator=(x-${a})(x-${b}). Cancel (x-${a}).`);
}

function binomialGeneralTerm() {
    const n=rnd(3,6), a=rnd(1,3);
    const terms = [];
    for (let k = 0; k <= n; k++) {
        const coeff = binomialCoefficient(n, k);
        const xpow = n - k;
        const apow = k;
        if (coeff !== 0) {
            if (xpow === 0) terms.push(`${coeff}*${a}^${apow}`);
            else if (apow === 0) terms.push(`${coeff}*x^${xpow}`);
            else terms.push(`${coeff}*x^${xpow}*${a}^${apow}`);
        }
    }
    return expQ(`(x+${a})^${n}`,
        terms.join(' + '),
        `General term T_{k+1}=C(${n},k)x^{${n}-k}×${a}^k. Expand using binomial theorem.`);
}

// Helper for binomial coefficient
function binomialCoefficient(n, k) {
    if (k < 0 || k > n) return 0;
    if (k === 0 || k === n) return 1;
    let result = 1;
    for (let i = 1; i <= k; i++) {
        result = result * (n - k + i) / i;
    }
    return Math.round(result);
}

// ─── SS3 — TRIG IDENTITIES ───────────────────────────────────

function trigIdentity() {
    const expressions = [
        expQ(`sin^2(x)+cos^2(x)`, `1`, `Pythagorean identity: sin²x+cos²x=1 for all x.`),
        expQ(`1-cos^2(x)`, `sin^2(x)`, `Rearrange sin²x+cos²x=1: sin²x=1-cos²x.`),
        expQ(`tan(x)*cos(x)`, `sin(x)`, `tan x=sin x/cos x, so tan x × cos x = sin x.`),
        expQ(`sec^2(x)-tan^2(x)`, `1`, `Pythagorean identity: 1+tan²x=sec²x, so sec²x-tan²x=1.`),
        expQ(`sin(2x)`, `2*sin(x)*cos(x)`, `Double angle formula: sin(2x)=2 sin x cos x.`),
        expQ(`cos(2x)`, `cos^2(x)-sin^2(x)`, `Double angle formula: cos(2x)=cos²x-sin²x.`),
    ];
    return pick(expressions);
}

function trigExpression() {
    return trigIdentity();
}

// ─── ADDITIONAL FUNCTIONS ────────────────────────────────────

function exponentialExpression() {
    const a = rnd(1, 3), b = rnd(1, 3);
    const expressions = [
        expQ(`e^{${a}x} * e^{${b}x}`, `e^{${a+b}x}`, `Add exponents when multiplying same base: e^{${a}x + ${b}x} = e^{${a+b}x}.`),
        expQ(`\\frac{e^{${a+b}x}}{e^{${b}x}}`, `e^{${a}x}`, `Subtract exponents when dividing: e^{${a+b}x - ${b}x} = e^{${a}x}.`),
        expQ(`(e^{${a}x})^{${b}}`, `e^{${a*b}x}`, `Multiply exponents: (e^{${a}x})^{${b}} = e^{${a*b}x}.`),
    ];
    return pick(expressions);
}

// ─── DISPATCH ─────────────────────────────────────────────────

/**
 * Generate an expression based on topic and class level
 * @param {string} topic - Main topic (e.g., "simplify like terms")
 * @param {string} subtopic - Specific subtopic (unused currently, reserved for future)
 * @param {string} classId - Class level like "p3", "p4", "p5", "p6", "ss1", "ss2", "ss3"
 * @returns {ExpressionObject} Expression with eq, goal, and hint
 */
export function generateExpression(topic, subtopic, classId) {
    const t = topic.toLowerCase();
    let result = null;

    // Primary level (JSS1-3)
    if (t.includes('order of operation'))   result = orderOfOps();
    else if (t.includes('writing') && (t.includes('addition') || t.includes('expression'))) result = writingExpression();
    else if (t.includes('evaluating') || t.includes('evaluate')) result = evaluatingExpression();
    
    // Simplification
    else if (t.includes('simplif') && t.includes('like')) result = simplifyLikeTerms();
    else if (t.includes('simplif') && t.includes('indici')) result = indicialSimplify();
    else if (t.includes('simplif') || t.includes('collecting')) result = simplifyLikeTerms();
    
    // Expansion & Factoring
    else if (t.includes('distributive') || (t.includes('expand') && !t.includes('binomial') && !t.includes('factori'))) result = distributive();
    else if (t.includes('simple factor') || (t.includes('factor') && ['p3','p4','p5','p6'].includes(classId))) result = simpleFactoring();
    else if (t.includes('expanding binomial') || t.includes('expand binomial')) result = expandBinomials();
    else if (t.includes('multiply') && t.includes('expression')) result = distributive();
    else if (t.includes('factori') && t.includes('quadratic')) result = factoriseQuadratic();
    else if (t.includes('factori') && (t.includes('trinomial') || t.includes('basic'))) result = factoriseQuadratic();
    else if (t.includes('difference') && t.includes('cube')) result = cubesExpression();
    else if (t.includes('sum') && t.includes('cube')) result = cubesExpression();
    
    // Indices/Exponents
    else if (t.includes('laws of ind') || t.includes('law of ind')) result = indicesExpression();
    else if (t.includes('indici') || t.includes('index')) result = indicesExpression();
    
    // Rational expressions
    else if (t.includes('rational expression') || (t.includes('simplify') && t.includes('rational'))) result = rationalExpr();
    else if (t.includes('algebraic fraction')) result = algebraicFractionOps();
    else if (t.includes('rational function')) result = rationalFunctions();
    
    // Polynomials
    else if (t.includes('polynomial') && (t.includes('division') || t.includes('long') || t.includes('synthetic'))) result = polynomialDivision();
    else if (t.includes('polynomial') || t.includes('degree')) result = polynomialOps();
    else if (t.includes('remainder') || t.includes('factor theorem')) result = remainderTheorem();
    
    // Binomial
    else if (t.includes('binomial expansion') || t.includes('binomial theorem') || t.includes('general term')) result = binomialGeneralTerm();
    else if (t.includes('binomial')) result = binomialExpansion();
    
    // SS2 topics
    else if (t.includes('partial fraction')) result = partialFractions();
    else if (t.includes('logarithm') || t.includes('log expression')) result = logExpression();
    else if (t.includes('complex number')) result = complexNumbers();
    
    // SS3 topics
    else if (t.includes('trig') && t.includes('identit')) result = trigIdentity();
    else if (t.includes('trig expression')) result = trigExpression();
    else if (t.includes('matrix')) result = matrices();
    else if (t.includes('exponential')) result = exponentialExpression();
    
    // Fallback
    else {
        console.warn(`No matching generator for topic: "${topic}", classId: "${classId}". Using fallback.`);
        result = simplifyLikeTerms();
    }

    // Validate the result before returning
    if (!validateExpression(result.eq, result.goal)) {
        console.warn('Invalid expression generated, using fallback');
        result = simplifyLikeTerms();
    }

    return result;
}