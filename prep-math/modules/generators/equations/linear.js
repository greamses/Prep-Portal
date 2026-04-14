// =============================================
// LINEAR EQUATIONS GENERATOR
// Works with the provided utils.js
// =============================================

import { rnd, pick, v, eqQ } from './utils.js';

const VARS = ['x', 'n', 'm', 'y', 'k', 'z', 'p'];
const vr = () => pick(VARS);

// Helper for sum with sign (e.g., + 5 or - 3)
const signed = (n) => n >= 0 ? `+ ${n}` : `- ${-n}`;

// Missing number symbol for P1-P3
const BOX = '☐'; // Unicode ballot box

// =============================================
// P1: ADDITION & SUBTRACTION WITHIN 10
// =============================================

export function p1MissingAddend() {
    const a = rnd(1, 8),
        b = rnd(1, 8);
    return eqQ(`${BOX} + ${a} = ${a + b}`, `${BOX} = ${b}`,
        `Subtract ${a} from ${a + b}. Count backwards if needed.`);
}

export function p1MissingSecondAddend() {
    const a = rnd(1, 8),
        b = rnd(1, 8);
    return eqQ(`${a} + ${BOX} = ${a + b}`, `${BOX} = ${b}`,
        `Subtract ${a} from ${a + b}.`);
}

export function p1MissingSum() {
    const a = rnd(1, 8),
        b = rnd(1, 8);
    return eqQ(`${a} + ${b} = ${BOX}`, `${BOX} = ${a + b}`,
        `Add ${a} and ${b} together.`);
}

export function p1BalanceEquation() {
    const a = rnd(1, 5),
        b = rnd(1, 5),
        c = rnd(1, a + b - 1);
    return eqQ(`${a} + ${b} = ${BOX} + ${c}`, `${BOX} = ${a + b - c}`,
        `First add ${a} + ${b} = ${a + b}. Then think: what plus ${c} equals ${a + b}?`);
}

export function p1MissingSubtrahend() {
    const a = rnd(5, 12),
        b = rnd(1, a - 1);
    return eqQ(`${a} - ${BOX} = ${a - b}`, `${BOX} = ${b}`,
        `Think: ${a} minus what equals ${a - b}? Or subtract ${a - b} from ${a}.`);
}

export function p1MissingMinuend() {
    const a = rnd(5, 12),
        b = rnd(1, a - 1);
    return eqQ(`${BOX} - ${b} = ${a - b}`, `${BOX} = ${a}`,
        `Add ${b} and ${a - b} together.`);
}

export function p1MissingDifference() {
    const a = rnd(5, 12),
        b = rnd(1, a - 1);
    return eqQ(`${a} - ${b} = ${BOX}`, `${BOX} = ${a - b}`,
        `Subtract ${b} from ${a}.`);
}

// =============================================
// P2: WITHIN 20
// =============================================

export function p2MissingAddendWithin20() {
    const a = rnd(5, 15),
        b = rnd(1, 20 - a);
    return pick([
        eqQ(`${BOX} + ${a} = ${a + b}`, `${BOX} = ${b}`, `Subtract ${a} from ${a + b}.`),
        eqQ(`${a} + ${BOX} = ${a + b}`, `${BOX} = ${b}`, `Subtract ${a} from ${a + b}.`),
    ]);
}

export function p2MissingSumWithin20() {
    const a = rnd(5, 15),
        b = rnd(1, 20 - a);
    return eqQ(`${a} + ${b} = ${BOX}`, `${BOX} = ${a + b}`, `Add ${a} and ${b}.`);
}

export function p2BalanceWithin20() {
    const a = rnd(3, 8),
        b = rnd(3, 8),
        c = rnd(2, a + b - 2);
    return eqQ(`${a} + ${b} = ${BOX} + ${c}`, `${BOX} = ${a + b - c}`,
        `${a} + ${b} = ${a + b}. What plus ${c} equals ${a + b}?`);
}

export function p2MissingSubtrahendWithin20() {
    const a = rnd(10, 20),
        b = rnd(1, a - 1);
    return eqQ(`${a} - ${BOX} = ${a - b}`, `${BOX} = ${b}`,
        `${a} minus what equals ${a - b}?`);
}

export function p2MissingMinuendWithin20() {
    const a = rnd(10, 20),
        b = rnd(1, a - 1);
    return eqQ(`${BOX} - ${b} = ${a - b}`, `${BOX} = ${a}`,
        `What minus ${b} equals ${a - b}? Add them.`);
}

export function p2MissingDifferenceWithin20() {
    const a = rnd(10, 20),
        b = rnd(1, a - 1);
    return eqQ(`${a} - ${b} = ${BOX}`, `${BOX} = ${a - b}`,
        `Subtract ${b} from ${a}.`);
}

export function p2TwoDigitAddMissingOnes() {
    const tens1 = rnd(1, 4) * 10,
        tens2 = rnd(1, 4) * 10;
    const ones1 = rnd(1, 8),
        ones2 = rnd(1, 9 - ones1);
    const num1 = tens1 + ones1,
        num2 = tens2 + ones2;
    return pick([
        eqQ(`${tens1} + ${BOX} + ${num2} = ${num1 + num2}`, `${BOX} = ${ones1}`,
            `Find the missing ones digit.`),
        eqQ(`${num1} + ${BOX} = ${num1 + num2}`, `${BOX} = ${num2}`,
            `Subtract ${num1} from ${num1 + num2}.`),
    ]);
}

export function p2TwoDigitSubtractMissing() {
    const num1 = rnd(30, 80),
        num2 = rnd(10, num1 - 10);
    return pick([
        eqQ(`${num1} - ${BOX} = ${num1 - num2}`, `${BOX} = ${num2}`,
            `Subtract to find the missing number.`),
        eqQ(`${BOX} - ${num2} = ${num1 - num2}`, `${BOX} = ${num1}`,
            `Add ${num2} and ${num1 - num2}.`),
    ]);
}

// =============================================
// P3: WITHIN 100 & MULTIPLICATION/DIVISION
// =============================================

export function p3AdditionWithin100() {
    const a = rnd(20, 70),
        b = rnd(10, 99 - a);
    return pick([
        eqQ(`${BOX} + ${a} = ${a + b}`, `${BOX} = ${b}`, `Subtract ${a} from ${a + b}.`),
        eqQ(`${a} + ${BOX} = ${a + b}`, `${BOX} = ${b}`, `Subtract ${a} from ${a + b}.`),
        eqQ(`${a} + ${b} = ${BOX}`, `${BOX} = ${a + b}`, `Add ${a} and ${b}.`),
    ]);
}

export function p3SubtractionWithin100() {
    const a = rnd(40, 99),
        b = rnd(10, a - 10);
    return pick([
        eqQ(`${a} - ${BOX} = ${a - b}`, `${BOX} = ${b}`,
            `${a} minus what equals ${a - b}?`),
        eqQ(`${BOX} - ${b} = ${a - b}`, `${BOX} = ${a}`,
            `What minus ${b} equals ${a - b}?`),
        eqQ(`${a} - ${b} = ${BOX}`, `${BOX} = ${a - b}`,
            `Subtract ${b} from ${a}.`),
    ]);
}

export function p3MultiplicationFacts() {
    const tables = [2, 3, 4, 5, 10];
    const factor1 = pick(tables),
        factor2 = rnd(1, 10);
    return pick([
        eqQ(`${factor1} × ${factor2} = ${BOX}`, `${BOX} = ${factor1 * factor2}`,
            `Multiply ${factor1} and ${factor2}.`),
        eqQ(`${factor1} × ${BOX} = ${factor1 * factor2}`, `${BOX} = ${factor2}`,
            `Divide ${factor1 * factor2} by ${factor1}.`),
        eqQ(`${BOX} × ${factor2} = ${factor1 * factor2}`, `${BOX} = ${factor1}`,
            `Divide ${factor1 * factor2} by ${factor2}.`),
    ]);
}

export function p3DivisionFacts() {
    const divisor = rnd(2, 5),
        quotient = rnd(2, 10);
    const dividend = divisor * quotient;
    return pick([
        eqQ(`${dividend} ÷ ${divisor} = ${BOX}`, `${BOX} = ${quotient}`,
            `Divide ${dividend} by ${divisor}.`),
        eqQ(`${dividend} ÷ ${BOX} = ${quotient}`, `${BOX} = ${divisor}`,
            `${dividend} divided by what equals ${quotient}?`),
        eqQ(`${BOX} ÷ ${divisor} = ${quotient}`, `${BOX} = ${dividend}`,
            `What divided by ${divisor} equals ${quotient}? Multiply.`),
    ]);
}

export function p3MixedOperations() {
    const x = rnd(2, 8);
    return pick([
        eqQ(`3 × ${BOX} + 4 = ${3 * x + 4}`, `${BOX} = ${x}`,
            `Work backwards: subtract 4, then divide by 3.`),
        eqQ(`2 × ${BOX} - 3 = ${2 * x - 3}`, `${BOX} = ${x}`,
            `Work backwards: add 3, then divide by 2.`),
        eqQ(`${BOX} × 4 + 2 = ${x * 4 + 2}`, `${BOX} = ${x}`,
            `Work backwards: subtract 2, then divide by 4.`),
    ]);
}

// =============================================
// ONE-STEP EQUATIONS (VARIABLES)
// =============================================

export function oneStepAdd() {
    const v = vr();
    const x = rnd(-10, 15),
        a = rnd(-12, 12);
    return eqQ(`${v} ${signed(a)} = ${x + a}`, `${v} = ${x}`,
        `Subtract ${a} from both sides.`);
}

export function oneStepSubtract() {
    const v = vr();
    const x = rnd(-10, 15),
        a = rnd(-12, 12);
    return eqQ(`${v} - ${a} = ${x - a}`, `${v} = ${x}`,
        `Add ${a} to both sides.`);
}

export function oneStepAddReversed() {
    const v = vr();
    const x = rnd(-10, 15),
        a = rnd(-12, 12);
    return eqQ(`${a} + ${v} = ${a + x}`, `${v} = ${x}`,
        `Subtract ${a} from both sides.`);
}

export function oneStepSubtractFrom() {
    const v = vr();
    const x = rnd(-10, 15),
        a = rnd(x + 1, x + 20);
    return eqQ(`${a} - ${v} = ${a - x}`, `${v} = ${x}`,
        `Subtract ${a} from both sides, then divide by -1.`);
}

export function oneStepNegativeX() {
    const v = vr();
    const x = rnd(-10, 15),
        a = rnd(-12, 12);
    return eqQ(`-${v} ${signed(a)} = ${-x + a}`, `${v} = ${x}`,
        `Subtract ${a} from both sides, then divide by -1.`);
}

export function oneStepNegativeXMinus() {
    const v = vr();
    const x = rnd(-10, 15),
        a = rnd(1, 12);
    return eqQ(`-${v} - ${a} = ${-x - a}`, `${v} = ${x}`,
        `Add ${a} to both sides, then divide by -1.`);
}

// =============================================
// TWO-STEP EQUATIONS
// =============================================

export function twoStepAdd() {
    const v = vr();
    const x = rnd(-8, 12);
    const a = pick([1, -1]);
    const b = rnd(-15, 15);
    const left = a === 1 ? `${v} ${signed(b)}` : `-${v} ${signed(b)}`;
    const right = a * x + b;
    const hint = a === 1 ?
        `Subtract ${b} from both sides.` :
        `Subtract ${b} from both sides, then divide by -1.`;
    return eqQ(`${left} = ${right}`, `${v} = ${x}`, hint);
}

export function twoStepSubtract() {
    const v = vr();
    const x = rnd(-8, 12);
    const a = pick([1, -1]);
    const b = rnd(-15, 15);
    const left = a === 1 ? `${v} - ${b}` : `-${v} - ${b}`;
    const right = a * x - b;
    const hint = a === 1 ?
        `Add ${b} to both sides.` :
        `Add ${b} to both sides, then divide by -1.`;
    return eqQ(`${left} = ${right}`, `${v} = ${x}`, hint);
}

// =============================================
// EQUATIONS WITH BRACKETS
// =============================================

export function bracketMultiplyAdd() {
    const v = vr();
    const x = rnd(-8, 12);
    const a = pick([1, -1]);
    const b = rnd(-10, 10);
    const left = a === 1 ? `(${v} ${signed(b)})` : `-(${v} ${signed(b)})`;
    const right = a * (x + b);
    const hint = a === 1 ?
        `Subtract ${b} from both sides.` :
        `Divide both sides by -1, then subtract ${b}.`;
    return eqQ(`${left} = ${right}`, `${v} = ${x}`, hint);
}

export function bracketMultiplySubtract() {
    const v = vr();
    const x = rnd(-8, 12);
    const a = pick([1, -1]);
    const b = rnd(-10, 10);
    const left = a === 1 ? `(${v} - ${b})` : `-(${v} - ${b})`;
    const right = a * (x - b);
    const hint = a === 1 ?
        `Add ${b} to both sides.` :
        `Divide both sides by -1, then add ${b}.`;
    return eqQ(`${left} = ${right}`, `${v} = ${x}`, hint);
}

export function bracketDivideAdd() {
    const v = vr();
    const x = rnd(-8, 12);
    const a = rnd(-10, 10);
    const b = rnd(2, 6);
    return eqQ(`(${v} ${signed(a)}) / ${b} = ${(x + a) / b}`, `${v} = ${x}`,
        `Multiply both sides by ${b}, then subtract ${a}.`);
}

export function bracketDivideSubtract() {
    const v = vr();
    const x = rnd(-8, 12);
    const a = rnd(-10, 10);
    const b = rnd(2, 6);
    return eqQ(`(${v} - ${a}) / ${b} = ${(x - a) / b}`, `${v} = ${x}`,
        `Multiply both sides by ${b}, then add ${a}.`);
}

// =============================================
// MULTISTEP WITH BRACKETS
// =============================================

export function multistepBracketAddConst() {
    const v = vr();
    const x = rnd(-6, 10);
    const a = pick([1, -1]);
    const b = rnd(-8, 8);
    const c = rnd(-12, 12);
    const left = a === 1 ?
        `(${v} ${signed(b)}) ${signed(c)}` :
        `-(${v} ${signed(b)}) ${signed(c)}`;
    const right = a * (x + b) + c;
    const hint = a === 1 ?
        `Subtract ${c}, then subtract ${b}.` :
        `Subtract ${c}, divide by -1, then subtract ${b}.`;
    return eqQ(`${left} = ${right}`, `${v} = ${x}`, hint);
}

export function multistepBracketSubConst() {
    const v = vr();
    const x = rnd(-6, 10);
    const a = pick([1, -1]);
    const b = rnd(-8, 8);
    const c = rnd(-12, 12);
    const left = a === 1 ?
        `(${v} - ${b}) ${signed(c)}` :
        `-(${v} - ${b}) ${signed(c)}`;
    const right = a * (x - b) + c;
    const hint = a === 1 ?
        `Subtract ${c}, then add ${b}.` :
        `Subtract ${c}, divide by -1, then add ${b}.`;
    return eqQ(`${left} = ${right}`, `${v} = ${x}`, hint);
}

export function multistepBracketReversed() {
    const v = vr();
    const x = rnd(-6, 10);
    const a = pick([1, -1]);
    const b = rnd(-8, 8);
    const left = a === 1 ? `(${b} + ${v})` : `-(${b} + ${v})`;
    const right = a * (b + x);
    const hint = a === 1 ?
        `Subtract ${b} from both sides.` :
        `Divide by -1, then subtract ${b}.`;
    return eqQ(`${left} = ${right}`, `${v} = ${x}`, hint);
}

// =============================================
// VARIABLES ON BOTH SIDES
// =============================================

export function bothSidesSameCoeff() {
    const v = vr();
    const x = rnd(-8, 12);
    const a = rnd(-12, 12);
    return pick([
        eqQ(`${v} ${signed(a)} = ${x + a}`, `${v} = ${x}`,
            `Subtract ${a} from both sides.`),
        eqQ(`${v} - ${a} = ${x - a}`, `${v} = ${x}`,
            `Add ${a} to both sides.`),
    ]);
}

export function bothSidesOppositeSigns() {
    const v = vr();
    
    const x1 = rnd(-6, 10);
    const a1 = rnd(-10, 10);
    const b1 = a1 + 2 * x1;
    
    if (Math.abs(b1) <= 20) {
        return eqQ(`${v} ${signed(a1)} = -${v} ${signed(b1)}`, `${v} = ${x1}`,
            `Add ${v} to both sides, then subtract ${a1}.`);
    }
    
    const x2 = rnd(-6, 10);
    const a2 = rnd(-10, 10);
    const b2 = a2 - 2 * x2;
    
    if (Math.abs(b2) <= 20) {
        return eqQ(`-${v} ${signed(a2)} = ${v} ${signed(b2)}`, `${v} = ${x2}`,
            `Add ${v} to both sides, then subtract ${b2}.`);
    }
    
    return bothSidesSameCoeff();
}

export function bothSidesWithBrackets() {
    const v = vr();
    const x = rnd(-6, 10);
    const a = rnd(-8, 8);
    return pick([
        eqQ(`(${v} ${signed(a)}) = ${x + a}`, `${v} = ${x}`,
            `Remove brackets, then subtract ${a}.`),
        eqQ(`${v} ${signed(a)} = (${v} ${signed(a)})`, `${v} = ${v}`,
            `Both sides are identical. Any value works!`),
    ]);
}

export function bothSidesBracketsEqualCoeff() {
    const v = vr();
    const x = rnd(-6, 10);
    const a = rnd(-8, 8);
    const coeff = pick([1, -1]);
    const left = coeff === 1 ? `(${v} ${signed(a)})` : `-(${v} ${signed(a)})`;
    const right = coeff * (x + a);
    return eqQ(`${left} = ${right}`, `${v} = ${x}`,
        coeff === 1 ? `Subtract ${a} from both sides.` :
        `Divide by -1, then subtract ${a}.`);
}

// =============================================
// EXPORT ALL
// =============================================

export const linearEquations = {
    // P1
    p1MissingAddend,
    p1MissingSecondAddend,
    p1MissingSum,
    p1BalanceEquation,
    p1MissingSubtrahend,
    p1MissingMinuend,
    p1MissingDifference,
    
    // P2
    p2MissingAddendWithin20,
    p2MissingSumWithin20,
    p2BalanceWithin20,
    p2MissingSubtrahendWithin20,
    p2MissingMinuendWithin20,
    p2MissingDifferenceWithin20,
    p2TwoDigitAddMissingOnes,
    p2TwoDigitSubtractMissing,
    
    // P3
    p3AdditionWithin100,
    p3SubtractionWithin100,
    p3MultiplicationFacts,
    p3DivisionFacts,
    p3MixedOperations,
    
    // One-step
    oneStepAdd,
    oneStepSubtract,
    oneStepAddReversed,
    oneStepSubtractFrom,
    oneStepNegativeX,
    oneStepNegativeXMinus,
    
    // Two-step
    twoStepAdd,
    twoStepSubtract,
    
    // Brackets
    bracketMultiplyAdd,
    bracketMultiplySubtract,
    bracketDivideAdd,
    bracketDivideSubtract,
    
    // Multistep brackets
    multistepBracketAddConst,
    multistepBracketSubConst,
    multistepBracketReversed,
    
    // Both sides
    bothSidesSameCoeff,
    bothSidesOppositeSigns,
    bothSidesWithBrackets,
    bothSidesBracketsEqualCoeff,
};