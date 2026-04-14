/**
 * modules/generator.js
 * Offline question generator — fully dynamic, no static templates.
 * Every call produces varied numbers, variables, and structures.
 *
 * Returned shape:
 *   { type: 'equation',   eq, goal, hint }  — auto-checked via GM ASCII
 *   { type: 'expression', eq, goal, hint }  — Mark Done, goal shown in hint only
 *   { type: 'word',       problem, hint }   — Mark Solved via modal
 */

// ─── Utilities ────────────────────────────────────────────────

const rnd  = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const sign = n => (n >= 0 ? `+${n}` : `${n}`);        // "+3" or "-3"
const coeff = (n, v) => n === 1 ? v : `${n}*${v}`;    // "x" or "3*x"

const VARS  = ['x', 'n', 'm', 'y', 'k'];
const NAMES = ['Emeka','Amaka','Tunde','Ngozi','Chidi','Bisi','Kemi','Femi','Ada','Uche'];
const ITEMS = ['mangoes','oranges','books','pens','yams','biscuits','pencils','tomatoes','sweets'];
const PLACES = ['Lagos','Ibadan','Enugu','Abuja','Kano','Port Harcourt','Benin City'];
const SHOPS  = ['market','shop','store','stall'];

// Type-tagged constructors
const eqQ  = (eq, goal, hint) => ({ type: 'equation',   eq, goal, hint });
const expQ = (eq, goal, hint) => ({ type: 'expression', eq, goal, hint });
const wdQ  = (problem, hint)  => ({ type: 'word', problem, hint });

// Ensure a random integer satisfying condition; retry up to 20 times
function rndWhere(min, max, cond) {
    for (let i = 0; i < 20; i++) {
        const n = rnd(min, max);
        if (cond(n)) return n;
    }
    return min;
}

// ─── Equation builders ────────────────────────────────────────

/** ax + b = c  (picks x, a, b; derives c) */
function linearEq(method, aPick = () => rnd(2,9)) {
    const v = pick(VARS);
    const a = aPick(), x = rnd(1, 10), b = rnd(1, 15);
    const c = a * x + b;
    const hintB = method === 'balancing'
        ? `Subtract ${b} from both sides to get ${coeff(a,v)}=${c-b}, then divide both sides by ${a}.`
        : `Move ${b} across: ${coeff(a,v)}=${c-b}, then divide by ${a}.`;
    return eqQ(`${a}*${v}+${b}=${c}`, `${v}=${x}`, hintB);
}

/** ax - b = c  (varied sign) */
function linearEqSub(method) {
    const v = pick(VARS);
    const a = rnd(2,9), x = rnd(1,10), b = rnd(1,15);
    const c = a * x - b;
    const hint = method === 'balancing'
        ? `Add ${b} to both sides, then divide by ${a}.`
        : `Move -${b} across: ${coeff(a,v)}=${c+b}, then divide by ${a}.`;
    return eqQ(`${a}*${v}-${b}=${c}`, `${v}=${x}`, hint);
}

// ─── Per-topic generators ─────────────────────────────────────

const GENERATORS = {

    // ══ PRIMARY ═══════════════════════════════════════════════

    'Missing Numbers (1-10)': () => {
        const x = rnd(1, 9), a = rnd(1, 10 - x);
        const b = x + a;
        return pick([
            eqQ(`x+${a}=${b}`, `x=${x}`, `Subtract ${a} from both sides.`),
            eqQ(`${b}-x=${a}`, `x=${x}`, `What number taken from ${b} leaves ${a}?`),
            eqQ(`x-${a}=${x-a >= 1 ? x-a : 1}`, `x=${x-a >= 1 ? x : a+1}`,
                `Add ${a} to both sides.`),
        ]);
    },

    'Missing Numbers (1-20)': () => {
        const x = rnd(2, 18), a = rnd(1, 20 - x);
        const b = x + a;
        return pick([
            eqQ(`x+${a}=${b}`, `x=${x}`, `Subtract ${a} from both sides.`),
            eqQ(`${b}-x=${a}`, `x=${x}`, `Subtract ${a} from ${b}.`),
        ]);
    },

    'Missing Numbers (1-100)': () => {
        const x = rnd(5, 90), a = rnd(5, 100 - x);
        const b = x + a;
        return pick([
            eqQ(`x+${a}=${b}`, `x=${x}`, `Subtract ${a} from both sides.`),
            eqQ(`${b}-x=${a}`, `x=${x}`, `What must be added to ${a} to reach ${b}?`),
        ]);
    },

    'Simple Addition': () => {
        const x = rnd(2, 9), a = rnd(1, x - 1);
        const sum = x + a;
        return pick([
            eqQ(`x+${a}=${sum}`, `x=${x}`, `Subtract ${a} from both sides.`),
            eqQ(`${a}+x=${sum}`, `x=${x}`, `Subtract ${a} from both sides.`),
        ]);
    },

    'Addition & Subtraction': () => {
        const x = rnd(3, 18), a = rnd(1, x - 1);
        return pick([
            eqQ(`x+${a}=${x+a}`, `x=${x}`, `Subtract ${a} from both sides.`),
            eqQ(`x-${a}=${x-a}`, `x=${x}`, `Add ${a} to both sides.`),
            eqQ(`${x+a}-x=${a}`, `x=${x}`, `Rearrange: subtract ${a} from ${x+a}.`),
        ]);
    },

    'Multiplication Intro': () => {
        const a = pick([2, 3, 4, 5]), x = rnd(2, 9);
        return eqQ(`${a}*x=${a*x}`, `x=${x}`, `Divide both sides by ${a}.`);
    },

    'Simple Division': () => {
        const d = pick([2, 3, 4, 5]), x = rnd(2, 9);
        return eqQ(`x/${d}=${x}`, `x=${d*x}`, `Multiply both sides by ${d}.`);
    },

    'Multiplication & Division': () => {
        const a = pick([2, 3, 4, 5, 6]), x = rnd(2, 10);
        return pick([
            eqQ(`${a}*x=${a*x}`, `x=${x}`, `Divide both sides by ${a}.`),
            eqQ(`x/${a}=${x}`,   `x=${a*x}`, `Multiply both sides by ${a}.`),
        ]);
    },

    'Fractions Intro': () => {
        const d = pick([2, 3, 4, 5, 6, 8, 10]), x = rnd(2, 8);
        return pick([
            eqQ(`x/${d}=${x}`,   `x=${d*x}`, `Multiply both sides by ${d}.`),
            eqQ(`x/${d}+1=${x+1}`, `x=${d*x}`, `Subtract 1 from both sides, then multiply by ${d}.`),
        ]);
    },

    'Fractions & Decimals': () => {
        const d = pick([2, 4, 5, 10]), x = rnd(2, 8);
        return pick([
            eqQ(`x/${d}=${x}`,     `x=${d*x}`, `Multiply both sides by ${d}.`),
            eqQ(`${d}*x=${d*x}`,   `x=${x}`,   `Divide both sides by ${d}.`),
            eqQ(`x/${d}+2=${x+2}`, `x=${d*x}`, `Subtract 2 first, then multiply by ${d}.`),
        ]);
    },

    'Solving for X': () => {
        const a = rnd(2, 9), x = rnd(1, 10), b = rnd(1, 12);
        const c = a * x + b;
        return pick([
            eqQ(`${a}*x=${a*x}`, `x=${x}`, `Divide both sides by ${a}.`),
            eqQ(`${a}*x+${b}=${c}`, `x=${x}`, `Subtract ${b}, then divide by ${a}.`),
        ]);
    },

    // ══ EXPRESSIONS (no = sign) ═══════════════════════════════

    'Order of Operations': () => {
        const templates = [
            () => { const a=rnd(2,6),b=rnd(2,6),c=rnd(1,5); return expQ(`${a}*(${b}+${c})`, `${a*(b+c)}`, `Brackets first: ${b}+${c}=${b+c}, then ×${a}.`); },
            () => { const a=rnd(2,8),b=rnd(2,6),c=rnd(2,5); return expQ(`${a}+${b}*${c}`, `${a+b*c}`, `Multiply first: ${b}×${c}=${b*c}, then add ${a}.`); },
            () => { const a=rnd(2,5),b=rnd(2,5),c=rnd(2,5),d=rnd(1,4);
                    return expQ(`(${a}+${b})*(${c}-${d})`, `${(a+b)*(c-d)}`, `Evaluate each bracket, then multiply.`); },
            () => { const a=rnd(10,20),b=rnd(2,6),c=rnd(1,4); return expQ(`${a}-${b}*${c}`, `${a-b*c}`, `Multiply first: ${b}×${c}=${b*c}, then subtract from ${a}.`); },
        ];
        return pick(templates)();
    },

    'Algebraic Simplification': () => {
        const v = pick(VARS);
        const a = rnd(2, 7), b = rnd(2, 7), c = rnd(1, 8);
        return pick([
            expQ(`${a}*${v}+${b}*${v}`,         `${a+b}*${v}`,     `Add the coefficients of ${v}: ${a}+${b}=${a+b}.`),
            expQ(`${a+b}*${v}-${b}*${v}`,       `${a}*${v}`,       `Subtract coefficients of ${v}: ${a+b}−${b}=${a}.`),
            expQ(`${a}*${v}+${c}+${b}*${v}`,    `${a+b}*${v}+${c}`,`Group like terms: (${a}+${b})${v}+${c}.`),
            expQ(`${a}*${v}+${b}*${v}-${c}`,    `${a+b}*${v}-${c}`,`Collect ${v} terms first, then simplify the constant.`),
        ]);
    },

    'Indices & Powers': () => {
        const b = pick(['x', 'a', 'y', 'm']);
        const p = rnd(2, 4), q = rnd(2, 4);
        return pick([
            expQ(`${b}^${p}*${b}^${q}`,   `${b}^${p+q}`,   `Multiplying same base: add the powers (${p}+${q}=${p+q}).`),
            expQ(`(${b}^${p})^${q}`,       `${b}^${p*q}`,   `Power of a power: multiply the indices (${p}×${q}=${p*q}).`),
            expQ(`${b}^${p+q}/${b}^${q}`, `${b}^${p}`,     `Dividing same base: subtract the powers (${p+q}−${q}=${p}).`),
            expQ(`${b}^0*${b}^${p}`,       `${b}^${p}`,     `Any base to power 0 is 1; so this simplifies to ${b}^${p}.`),
        ]);
    },

    'Factorization': () => {
        const a = rnd(2, 6);
        const r1 = rnd(1, 5), r2 = rnd(1, 5);
        const B = -(r1+r2), C = r1*r2;
        // Format: x^2 - Bx + C  (where B is negative, so displayed as +B)
        const Bstr = B < 0 ? `${-B}` : `${B}`;
        return pick([
            // Difference of two squares
            expQ(`x^2-${a*a}`,
                 `(x-${a})*(x+${a})`,
                 `Difference of two squares: x²−${a*a} = (x−${a})(x+${a}).`),
            // Simple trinomial (positive roots)
            expQ(`x^2+${r1+r2}*x+${r1*r2}`,
                 `(x+${r1})*(x+${r2})`,
                 `Find two numbers that multiply to ${r1*r2} and add to ${r1+r2}.`),
            // Common factor
            (() => { const cf=rnd(2,5),bv=rnd(2,6);
                     return expQ(`${cf}*x^2+${cf*bv}*x`, `${cf}*x*(x+${bv})`, `Take out the common factor ${cf}x.`); })(),
        ]);
    },

    'Advanced Factorization': () => {
        const r1 = rnd(1, 4), r2 = rnd(1, 4), a = rnd(2, 4);
        return pick([
            // ax²+bx+c where a>1
            (() => { const b=(a*(r1+r2)), c=(a*r1*r2);
                     return expQ(`${a}*x^2+${b}*x+${c}`, `${a}*(x+${r1})*(x+${r2})`,
                       `Factorise ${a}x²+${b}x+${c}. Look for a common factor first, then split the middle term.`); })(),
            // Perfect square trinomial
            (() => { const k=rnd(2,5);
                     return expQ(`x^2+${2*k}*x+${k*k}`, `(x+${k})^2`,
                       `This is a perfect square: (x+${k})².`); })(),
            // Difference of two squares (harder)
            (() => { const k=rnd(3,7);
                     return expQ(`${a}*x^2-${a*k*k}`, `${a}*(x-${k})*(x+${k})`,
                       `Take out ${a} first: ${a}(x²−${k*k}) = ${a}(x−${k})(x+${k}).`); })(),
        ]);
    },

    'Binomial Theorem': () => {
        const a = rnd(1, 5);
        return pick([
            expQ(`(x+${a})^2`,   `x^2+${2*a}*x+${a*a}`,          `Expand: x²+2(${a})x+${a}² = x²+${2*a}x+${a*a}.`),
            expQ(`(x-${a})^2`,   `x^2-${2*a}*x+${a*a}`,          `Expand: x²−2(${a})x+${a}² = x²−${2*a}x+${a*a}.`),
            expQ(`(x+${a})*(x-${a})`, `x^2-${a*a}`,               `Difference of two squares: (x+${a})(x−${a}) = x²−${a*a}.`),
            expQ(`(x+${a})^3`,
                `x^3+${3*a}*x^2+${3*a*a}*x+${a*a*a}`,
                `Use the binomial expansion: x³+3(${a})x²+3(${a*a})x+${a*a*a}.`),
        ]);
    },

    'Partial Fractions': () => {
        // A/(x+p) + B/(x+q) combined form
        const p = rnd(1,4), q = rnd(p+1, 6), A = rnd(1,5), B = rnd(1,5);
        const num1 = A + B;
        const num2 = A*q + B*p;
        // Combined: (A(x+q)+B(x+p)) / ((x+p)(x+q)) = ((A+B)x + (Aq+Bp)) / ((x+p)(x+q))
        return expQ(
            `(${num1}*x+${num2})/((x+${p})*(x+${q}))`,
            `${A}/(x+${p})+${B}/(x+${q})`,
            `Decompose into A/(x+${p})+B/(x+${q}). Multiply through and compare coefficients.`
        );
    },

    // ══ WORD PROBLEMS ══════════════════════════════════════════

    'Basic Patterns': () => {
        const start = rnd(1, 10), step = rnd(2, 6);
        const seq = [start, start+step, start+2*step, start+3*step];
        return wdQ(
            `A number pattern starts: ${seq.join(', ')}, … \nWhat is the 8th term? What is the rule?`,
            `Find the common difference. The nth term = first term + (n−1) × step.`
        );
    },

    'Number Sequences': () => {
        const templates = [
            () => { const a=rnd(2,8),d=rnd(2,5);
                    return wdQ(`The sequence ${a}, ${a+d}, ${a+2*d}, … increases by the same amount each time. Find the 10th term.`,
                               `nth term = ${a} + (n−1)×${d}. Substitute n=10.`); },
            () => { const a=rnd(2,5);
                    return wdQ(`A geometric sequence starts: ${a}, ${a*2}, ${a*4}, ${a*8}, … What is the next term? What is the 6th term?`,
                               `Each term is multiplied by 2. 6th term = ${a} × 2^5.`); },
        ];
        return pick(templates)();
    },

    'Word Problems': () => {
        const name = pick(NAMES), item = pick(ITEMS);
        const total = rnd(20, 80), groups = pick([2,3,4,5,6,8,10]);
        const templates = [
            wdQ(`${name} has ${total} ${item} and shares them equally among ${groups} friends. How many does each friend get?`,
                `Divide: ${total} ÷ ${groups}.`),
            wdQ(`${pick(NAMES)} buys ${rnd(3,8)} packs of ${item}. Each pack has ${rnd(5,12)} pieces. How many ${item} in total?`,
                `Multiply the number of packs by the pieces per pack.`),
            wdQ(`A trader in ${pick(PLACES)} sells ${item} at ₦${rnd(5,20)} each. She earns ₦${rnd(100,300)}. How many ${item} did she sell?`,
                `Divide the total earnings by the price per ${item.slice(0,-1)}.`),
        ];
        return pick(templates);
    },

    'Ratios Intro': () => {
        const a = rnd(2,5), b = rnd(2,5), scale = rnd(2,8);
        return wdQ(
            `Two quantities are in the ratio ${a}:${b}. If the first quantity is ${a*scale}, what is the second quantity?`,
            `If ${a} parts = ${a*scale}, then 1 part = ${scale}. The second quantity = ${b} parts = ${b}×${scale}.`
        );
    },

    'Area & Perimeter': () => {
        const l = rnd(4,15), w = rnd(3,l);
        const shapes = [
            wdQ(`A rectangle is ${l} m long and ${w} m wide.\na) What is its perimeter?\nb) What is its area?`,
                `Perimeter = 2×(l+w) = 2×(${l}+${w}). Area = l×w = ${l}×${w}.`),
            wdQ(`A square field has side length ${l} m. Find its perimeter and area.`,
                `Perimeter = 4×${l}. Area = ${l}² = ${l*l} m².`),
            wdQ(`A triangle has a base of ${l} cm and a perpendicular height of ${w} cm. What is its area?`,
                `Area of triangle = ½ × base × height = ½ × ${l} × ${w}.`),
        ];
        return pick(shapes);
    },

    'Ratios & Proportion': () => {
        const price = rnd(5, 30), qty1 = rnd(2, 6), qty2 = rnd(qty1+1, 10);
        return pick([
            wdQ(`If ${qty1} ${pick(ITEMS)} cost ₦${price*qty1}, how much will ${qty2} cost at the same rate?`,
                `Find the cost of 1 item: ₦${price*qty1}÷${qty1}=₦${price}. Then multiply by ${qty2}.`),
            wdQ(`A car travels ${rnd(60,120)} km in ${rnd(1,3)} hour(s). At the same speed, how far does it travel in ${rnd(4,6)} hours?`,
                `Find speed = distance ÷ time. Then distance = speed × new time.`),
        ]);
    },

    'Word Problems (Algebra)': () => {
        const name1 = pick(NAMES), name2 = pick(NAMES.filter(n => n !== name1));
        const diff = rnd(2, 8), sum = rnd(14, 30);
        const templates = [
            wdQ(`${name1} is ${diff} years older than ${name2}. The sum of their ages is ${sum}. How old is each person?\nLet ${name2}'s age = x.`,
                `x + (x+${diff}) = ${sum} → 2x+${diff}=${sum} → 2x=${sum-diff} → x=${(sum-diff)/2}.`),
            wdQ(`${pick(NAMES)} thinks of a number. When ${rnd(3,8)} is added to three times the number, the result is ${rnd(20,50)}. Find the number.`,
                `Let the number = x. Write the equation 3x + ? = ?, then solve.`),
            wdQ(`The sum of two consecutive even numbers is ${rnd(20,60)}. Find the numbers.`,
                `Let the first = x. Then x + (x+2) = ${rnd(20,60)}. Solve for x.`),
        ];
        return pick(templates);
    },

    'Number Bases': () => {
        const dec = rnd(5, 30);
        const bin = dec.toString(2);
        const oct = dec.toString(8);
        return pick([
            wdQ(`Convert the binary number ${bin}₂ to base 10.\nWork out: what does each digit represent?`,
                `Start from the right: each position is a power of 2 (1, 2, 4, 8, …). Add up the values where the digit is 1.`),
            wdQ(`Convert the decimal number ${dec} to base 2 (binary).\nUse repeated division by 2 and record the remainders.`,
                `Divide ${dec} by 2 repeatedly. Read the remainders from bottom to top.`),
            wdQ(`What is ${bin}₂ + ${(rnd(1,4)).toString(2)}₂? Give your answer in binary and also in base 10.`,
                `Add binary numbers column by column from the right. Remember: 1+1=10 in binary.`),
        ]);
    },

    'Sets & Sequences': () => {
        const a = rnd(2,6), d = rnd(2,5), n = rnd(5,15);
        return pick([
            wdQ(`An arithmetic sequence has first term ${a} and common difference ${d}.\na) Find the ${n}th term.\nb) Find the sum of the first ${n} terms.`,
                `nth term = a+(n−1)d. Sum = n/2 × (2a+(n−1)d). Substitute a=${a}, d=${d}, n=${n}.`),
            wdQ(`In a class of ${rnd(25,40)} students: ${rnd(10,20)} study Maths, ${rnd(10,20)} study English, and ${rnd(3,8)} study both.\nHow many study neither subject?`,
                `Use: |M∪E| = |M|+|E|−|M∩E|. Then subtract from the total.`),
        ]);
    },

    // ══ EQUATIONS (algebraic) ══════════════════════════════════

    'Linear Equations': (classId, method) => {
        const isAdvanced = classId === 'ss1';
        if (isAdvanced) {
            // ax+b = cx+d
            const c = rnd(1,4), x = rnd(1,8), b = rnd(1,10), d = rnd(b+1, 20);
            const a = c + Math.floor((d-b)/x) + 1;
            const realC = a * x + b - d; // cx such that ax+b=cx+d
            if (realC <= 0) return linearEq(method); // fallback
            const lhs = `${a}*x+${b}`, rhs = `${realC}*x+${d}`;
            const hintB = method === 'balancing'
                ? `Subtract ${realC}*x from both sides, then subtract ${b}.`
                : `Move x terms left, constants right.`;
            return eqQ(`${lhs}=${rhs}`, `x=${x}`, hintB);
        }
        return pick([linearEq(method), linearEqSub(method)]);
    },

    'Brackets & Fractions': (_, method) => {
        const x = rnd(1, 8), a = rnd(2, 6), b = rnd(1, 8);
        const c = a * (x + b);
        const d = rnd(2, 5), e = rnd(1, 8);
        const fEq = x * d; // x/d = fEq/d
        return pick([
            eqQ(`${a}*(x+${b})=${c}`, `x=${x}`,
                method === 'balancing'
                    ? `Divide both sides by ${a}, then subtract ${b}.`
                    : `Expand the bracket: ${a}x+${a*b}=${c}. Then solve.`),
            eqQ(`x/${d}+${e}=${fEq/d+e}`, `x=${fEq}`,
                `Subtract ${e} from both sides, then multiply by ${d}.`),
        ]);
    },

    'Simultaneous Equations': (classId) => {
        const isAdvanced = classId === 'ss2';
        if (isAdvanced) {
            // 2x+3y=a, x-y=b
            const x = rnd(1,6), y = rnd(1,6);
            const a = 2*x+3*y, b = x-y;
            const sign_b = b >= 0 ? `=${b}` : `=${b}`;
            return eqQ(`2*x+3*y=${a}`, `x=${x},y=${y}`,
                `Second equation: x−y=${b}. Use substitution or elimination. Solution: x=${x}, y=${y}.`);
        }
        const x = rnd(1,7), y = rnd(1,7);
        const a = x+y, b = x-y;
        const b_str = b >= 0 ? `${b}` : `${b}`;
        return eqQ(`x+y=${a}`, `x=${x},y=${y}`,
            `Second equation: x−y=${b_str}. Add the equations to eliminate y, then back-substitute.`);
    },

    'Quadratic Equations': (classId) => {
        const isAdvanced = ['ss1','ss2','ss3'].includes(classId);
        if (isAdvanced) {
            // Roots can be negative
            const r1 = rnd(-4, -1), r2 = rnd(1, 5);
            const B = -(r1+r2), C = r1*r2;
            const Bstr = B >= 0 ? `+${B}` : `${B}`;
            const Cstr = C >= 0 ? `+${C}` : `${C}`;
            return eqQ(`x^2${Bstr}*x${Cstr}=0`, `x=${r2}`,
                `Factorise: find two numbers with product ${C} and sum ${-B}. Solution: x=${r1} or x=${r2}.`);
        }
        // Both positive roots
        const r1 = rnd(1,5), r2 = rnd(1,5);
        const B = r1+r2, C = r1*r2;
        return eqQ(`x^2-${B}*x+${C}=0`, `x=${Math.min(r1,r2)}`,
            `Factorise: find two numbers with product ${C} and sum ${B}. Then x=${r1} or x=${r2}.`);
    },

    'Linear Inequalities': (_, method) => {
        // GM doesn't handle > natively — present as equation boundary, note inequality
        const a = rnd(2,8), x = rnd(1,8), b = rnd(1,12);
        const c = a*x+b;
        return eqQ(`${a}*x+${b}=${c}`, `x=${x}`,
            `This is the boundary case: ${a}x+${b}=${c} → x=${x}. For the inequality ${a}x+${b}>${c}, the solution is x>${x}.`);
    },

    'Coordinate Geometry': () => {
        const m = rnd(1,4), b = rnd(0,6), x = rnd(1,6);
        const y = m*x+b;
        const b_str = b === 0 ? '' : `+${b}`;
        return pick([
            eqQ(`y-${m}*x=${b}`, `y=${y}`,
                `This is the line y=${m}x${b_str}. Substitute x=${x} to find y.`),
            eqQ(`${m}*x-y+${b}=0`, `y=${y}`,
                `Rearrange to y=${m}x${b_str}. Substitute x=${x}.`),
        ]);
    },
};

// ─── Public API ───────────────────────────────────────────────

/**
 * Generate a question for the given topic offline (no AI key needed).
 * @param {string} topic
 * @param {string} classId
 * @param {string} method  'transfer' | 'balancing'
 * @returns {{ type, eq?, problem?, goal, hint }}
 */
export function generateOffline(topic, classId = '', method = 'transfer') {
    const gen = GENERATORS[topic];
    if (!gen) {
        // Graceful fallback for any unrecognised topic
        return eqQ('x+2=5', 'x=3', 'Subtract 2 from both sides.');
    }
    try {
        const result = gen(classId, method);
        // Safety: filter out questions with NaN or undefined in critical fields
        if (result.type === 'equation' && (!result.eq || !result.goal)) {
            return eqQ('x+2=5', 'x=3', 'Subtract 2 from both sides.');
        }
        return result;
    } catch {
        return eqQ('x+2=5', 'x=3', 'Subtract 2 from both sides.');
    }
}
