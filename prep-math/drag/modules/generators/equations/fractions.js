// generators/equations/fractions.js

import { rnd, pick, v, eqQ } from './utils.js';

// Helper: find LCM of two numbers
function lcm(a, b) {
    return Math.abs(a * b) / gcd(a, b);
}

function gcd(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b !== 0) {
        const t = b;
        b = a % b;
        a = t;
    }
    return a;
}

// Helper: check if number is integer
function isInt(n) {
    return Math.abs(n - Math.round(n)) < 0.0001;
}

// =============================================
// P4: Simple fractional equations
// =============================================

// Variable divided by number (x/a = b)
export function p4VariableDividedByNumber() {
    const a = rnd(2, 8);
    const b = rnd(2, 12);
    const x = a * b;
    const variable = v();
    return eqQ(
        `${variable}/${a} = ${b}`,
        `${variable} = ${x}`,
        `Multiply both sides by ${a}: ${variable} = ${a} × ${b} = ${x}`
    );
}

// Number divided by variable (a/x = b)
export function p4NumberDividedByVariable() {
    const a = rnd(4, 24);
    const factors = [];
    for (let i = 2; i <= Math.sqrt(a); i++) {
        if (a % i === 0) {
            factors.push(i);
            if (i !== a / i) factors.push(a / i);
        }
    }
    if (factors.length === 0) return p4NumberDividedByVariable();
    const x = pick(factors);
    const b = a / x;
    const variable = v();
    return eqQ(
        `${a}/${variable} = ${b}`,
        `${variable} = ${x}`,
        `Multiply both sides by ${variable}: ${a} = ${b}${variable} → ${variable} = ${a} ÷ ${b} = ${x}`
    );
}

// Variable over number plus constant (x/a + c = d)
export function p4VariableOverNumberPlusConstant() {
    const a = rnd(2, 6);
    const c = rnd(1, 5);
    const d = rnd(c + 2, c + 10);
    const x = a * (d - c);
    const variable = v();
    return eqQ(
        `${variable}/${a} + ${c} = ${d}`,
        `${variable} = ${x}`,
        `Subtract ${c}: ${variable}/${a} = ${d - c} → ${variable} = ${a} × ${d - c} = ${x}`
    );
}

// Variable over number minus constant (x/a - c = d)
export function p4VariableOverNumberMinusConstant() {
    const a = rnd(2, 6);
    const c = rnd(1, 5);
    const d = rnd(c + 2, c + 10);
    const x = a * (d + c);
    const variable = v();
    return eqQ(
        `${variable}/${a} - ${c} = ${d}`,
        `${variable} = ${x}`,
        `Add ${c}: ${variable}/${a} = ${d + c} → ${variable} = ${a} × ${d + c} = ${x}`
    );
}

// =============================================
// P5: Equations with fractions on both sides
// =============================================

// Cross multiplication (x/a = b/c)
export function p5CrossMultiplication() {
    const a = rnd(2, 8);
    const b = rnd(2, 8);
    const c = rnd(2, 8);
    const x = (a * b) / c;
    if (!isInt(x) || x === a) return p5CrossMultiplication();
    const result = Math.round(x);
    const variable = v();
    return eqQ(
        `${variable}/${a} = ${b}/${c}`,
        `${variable} = ${result}`,
        `Cross multiply: ${c}${variable} = ${a} × ${b} = ${a * b} → ${variable} = ${a * b} ÷ ${c} = ${result}`
    );
}

// Variable plus number over number ((x + a)/b = c)
export function p5VariablePlusNumberOverNumber() {
    const b = rnd(2, 6);
    const c = rnd(2, 10);
    const a = rnd(1, 8);
    const x = b * c - a;
    const variable = v();
    return eqQ(
        `(${variable} + ${a})/${b} = ${c}`,
        `${variable} = ${x}`,
        `Multiply by ${b}: ${variable} + ${a} = ${b} × ${c} = ${b * c} → ${variable} = ${b * c} - ${a} = ${x}`
    );
}

// Variable minus number over number ((x - a)/b = c)
export function p5VariableMinusNumberOverNumber() {
    const b = rnd(2, 6);
    const c = rnd(2, 10);
    const a = rnd(1, 8);
    const x = b * c + a;
    const variable = v();
    return eqQ(
        `(${variable} - ${a})/${b} = ${c}`,
        `${variable} = ${x}`,
        `Multiply by ${b}: ${variable} - ${a} = ${b} × ${c} = ${b * c} → ${variable} = ${b * c} + ${a} = ${x}`
    );
}

// Number over variable plus number (a/(x + b) = c)
export function p5NumberOverVariablePlusNumber() {
    const a = rnd(4, 20);
    const c = rnd(2, 5);
    const rhs = a / c;
    if (!isInt(rhs)) return p5NumberOverVariablePlusNumber();
    const b = rnd(1, 8);
    const x = rhs - b;
    if (x <= 0) return p5NumberOverVariablePlusNumber();
    const variable = v();
    return eqQ(
        `${a}/(${variable} + ${b}) = ${c}`,
        `${variable} = ${x}`,
        `Multiply: ${a} = ${c}(${variable} + ${b}) → ${a} = ${c}${variable} + ${c * b} → ${c}${variable} = ${a - c * b} → ${variable} = ${x}`
    );
}

// Number over variable minus number (a/(x - b) = c)
export function p5NumberOverVariableMinusNumber() {
    const a = rnd(4, 20);
    const c = rnd(2, 5);
    const rhs = a / c;
    if (!isInt(rhs)) return p5NumberOverVariableMinusNumber();
    const b = rnd(1, 8);
    const x = rhs + b;
    if (x <= 0) return p5NumberOverVariableMinusNumber();
    const variable = v();
    return eqQ(
        `${a}/(${variable} - ${b}) = ${c}`,
        `${variable} = ${x}`,
        `Multiply: ${a} = ${c}(${variable} - ${b}) → ${a} = ${c}${variable} - ${c * b} → ${c}${variable} = ${a + c * b} → ${variable} = ${x}`
    );
}

// =============================================
// P6: Complex fractional equations
// =============================================

// Add variable fractions (x/a + x/b = c)
export function p6AddVariableFractions() {
    const a = rnd(2, 5);
    const b = rnd(2, 5);
    const lcmAB = lcm(a, b);
    const sumCoeff = (lcmAB / a) + (lcmAB / b);
    const c = rnd(2, 8);
    const x = (c * lcmAB) / sumCoeff;
    if (!isInt(x)) return p6AddVariableFractions();
    const result = Math.round(x);
    const variable = v();
    return eqQ(
        `${variable}/${a} + ${variable}/${b} = ${c}`,
        `${variable} = ${result}`,
        `Multiply by ${lcmAB}: ${lcmAB/a}${variable} + ${lcmAB/b}${variable} = ${c * lcmAB} → ${sumCoeff}${variable} = ${c * lcmAB} → ${variable} = ${result}`
    );
}

// Sum of two fraction expressions ((x+a)/b + (x+c)/d = e)
export function p6SumOfTwoFractionExpressions() {
    const b = rnd(2, 4);
    const d = rnd(2, 4);
    const lcmBD = lcm(b, d);
    const a = rnd(1, 5);
    const c = rnd(1, 5);
    const e = rnd(3, 8);

    const coeffX = (lcmBD / b) + (lcmBD / d);
    const constTerm = (lcmBD / b) * a + (lcmBD / d) * c;
    const x = (e * lcmBD - constTerm) / coeffX;

    if (!isInt(x) || x <= 0) return p6SumOfTwoFractionExpressions();
    const result = Math.round(x);
    const variable = v();
    return eqQ(
        `(${variable} + ${a})/${b} + (${variable} + ${c})/${d} = ${e}`,
        `${variable} = ${result}`,
        `Multiply by ${lcmBD}: ${lcmBD/b}(${variable} + ${a}) + ${lcmBD/d}(${variable} + ${c}) = ${e * lcmBD} → ${coeffX}${variable} + ${constTerm} = ${e * lcmBD} → ${variable} = ${result}`
    );
}

// Linear expression over number ((ax + b)/c = d)
export function p6LinearExpressionOverNumber() {
    const a = rnd(2, 5);
    const c = rnd(2, 6);
    const d = rnd(2, 8);
    const b = rnd(1, 10);
    const ax = c * d - b;
    const x = ax / a;
    if (!isInt(x) || x <= 0) return p6LinearExpressionOverNumber();
    const result = Math.round(x);
    const variable = v();
    return eqQ(
        `(${a}${variable} + ${b})/${c} = ${d}`,
        `${variable} = ${result}`,
        `Multiply by ${c}: ${a}${variable} + ${b} = ${c} × ${d} = ${c * d} → ${a}${variable} = ${c * d - b} → ${variable} = ${result}`
    );
}

// Equal fractions with variable ((x + a)/b = (x + c)/d)
export function p6EqualFractionsWithVariable() {
    const b = rnd(2, 5);
    const d = rnd(2, 5);
    const a = rnd(1, 8);
    const c = rnd(1, 8);
    const x = (b * c - d * a) / (d - b);
    if (!isInt(x) || x <= 0) return p6EqualFractionsWithVariable();
    const result = Math.round(x);
    const variable = v();
    return eqQ(
        `(${variable} + ${a})/${b} = (${variable} + ${c})/${d}`,
        `${variable} = ${result}`,
        `Cross multiply: ${d}(${variable} + ${a}) = ${b}(${variable} + ${c}) → ${d}${variable} + ${d*a} = ${b}${variable} + ${b*c} → ${d - b}${variable} = ${b*c - d*a} → ${variable} = ${result}`
    );
}

// =============================================
// Main export function
// =============================================

export function generateAlgebraicFraction(cls, subtopic = '') {
    const s = subtopic.toLowerCase();

    // P4
    if (cls === 'p4') {
        if (s.includes('variable divided by number')) return p4VariableDividedByNumber();
        if (s.includes('number divided by variable')) return p4NumberDividedByVariable();
        if (s.includes('variable over number plus constant')) return p4VariableOverNumberPlusConstant();
        if (s.includes('variable over number minus constant')) return p4VariableOverNumberMinusConstant();
        return pick([p4VariableDividedByNumber, p4NumberDividedByVariable, p4VariableOverNumberPlusConstant])();
    }

    // P5
    if (cls === 'p5') {
        if (s.includes('cross multiplication')) return p5CrossMultiplication();
        if (s.includes('variable plus number over number')) return p5VariablePlusNumberOverNumber();
        if (s.includes('variable minus number over number')) return p5VariableMinusNumberOverNumber();
        if (s.includes('number over variable plus number')) return p5NumberOverVariablePlusNumber();
        if (s.includes('number over variable minus number')) return p5NumberOverVariableMinusNumber();
        return pick([p5CrossMultiplication, p5VariablePlusNumberOverNumber, p5VariableMinusNumberOverNumber])();
    }

    // P6
    if (cls === 'p6') {
        if (s.includes('add variable fractions')) return p6AddVariableFractions();
        if (s.includes('sum of two fraction expressions')) return p6SumOfTwoFractionExpressions();
        if (s.includes('linear expression over number')) return p6LinearExpressionOverNumber();
        if (s.includes('equal fractions with variable')) return p6EqualFractionsWithVariable();
        return pick([p6AddVariableFractions, p6SumOfTwoFractionExpressions, p6LinearExpressionOverNumber])();
    }

    // Default to P4 level
    return p4VariableDividedByNumber();
}

export default {
    generateAlgebraicFraction,
    p4VariableDividedByNumber,
    p4NumberDividedByVariable,
    p4VariableOverNumberPlusConstant,
    p4VariableOverNumberMinusConstant,
    p5CrossMultiplication,
    p5VariablePlusNumberOverNumber,
    p5VariableMinusNumberOverNumber,
    p5NumberOverVariablePlusNumber,
    p5NumberOverVariableMinusNumber,
    p6AddVariableFractions,
    p6SumOfTwoFractionExpressions,
    p6LinearExpressionOverNumber,
    p6EqualFractionsWithVariable
};
