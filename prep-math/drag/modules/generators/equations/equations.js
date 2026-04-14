// generators/equations/equations.js
import { pick } from './utils.js';
import { linearEquations } from './linear.js';
import { generateAlgebraicFraction } from './fractions.js';

export function generateEquation(topic, subtopic, classId, method = 'transfer') {
    const s = (subtopic || '').toLowerCase();
    const cls = (classId || '').toLowerCase();

    // =============================================
    // ALGEBRAIC FRACTIONS (P4-P6)
    // Topic name is the exact key — route directly.
    // =============================================
    if (topic === 'Algebraic Fractions') {
        return generateAlgebraicFraction(cls, s);
    }

    // =============================================
    // P1: LINEAR EQUATIONS (Missing numbers with ☐)
    // =============================================
    if (cls === 'p1') {
        if (s.includes('addend'))                               return pick([linearEquations.p1MissingAddend, linearEquations.p1MissingSecondAddend])();
        if (s.includes('sum'))                                  return linearEquations.p1MissingSum();
        if (s.includes('balance'))                              return linearEquations.p1BalanceEquation();
        if (s.includes('subtrahend'))                           return linearEquations.p1MissingSubtrahend();
        if (s.includes('minuend'))                              return linearEquations.p1MissingMinuend();
        if (s.includes('difference'))                           return linearEquations.p1MissingDifference();
        if (s.includes('mixed') || s.includes('true') || s.includes('complete')) {
            return pick([linearEquations.p1MissingAddend, linearEquations.p1MissingSubtrahend, linearEquations.p1MissingSum])();
        }
        return linearEquations.p1MissingAddend();
    }

    // =============================================
    // P2: LINEAR EQUATIONS (Within 20)
    // =============================================
    if (cls === 'p2') {
        if (s.includes('addend'))                               return linearEquations.p2MissingAddendWithin20();
        if (s.includes('sum'))                                  return linearEquations.p2MissingSumWithin20();
        if (s.includes('balance'))                              return linearEquations.p2BalanceWithin20();
        if (s.includes('subtrahend'))                           return linearEquations.p2MissingSubtrahendWithin20();
        if (s.includes('minuend'))                              return linearEquations.p2MissingMinuendWithin20();
        if (s.includes('difference'))                           return linearEquations.p2MissingDifferenceWithin20();
        if (s.includes('two-digit') && s.includes('addition'))  return linearEquations.p2TwoDigitAddMissingOnes();
        if (s.includes('two-digit') && s.includes('subtraction')) return linearEquations.p2TwoDigitSubtractMissing();
        // "Multiplication as repeated addition", "Missing factor", "Balance with multiplication"
        if (s.includes('multiplication') || s.includes('repeated') || s.includes('factor')) {
            return linearEquations.p3MultiplicationFacts();
        }
        return linearEquations.p2MissingAddendWithin20();
    }

    // =============================================
    // P3: LINEAR EQUATIONS (Within 100, ×/÷ facts)
    // =============================================
    if (cls === 'p3') {
        if (s.includes('addition'))                             return linearEquations.p3AdditionWithin100();
        if (s.includes('subtraction'))                         return linearEquations.p3SubtractionWithin100();
        if (s.includes('multiplication') || s.includes('product') || s.includes('factor')) {
            return linearEquations.p3MultiplicationFacts();
        }
        if (s.includes('division') || s.includes('quotient') || s.includes('divisor') || s.includes('dividend')) {
            return linearEquations.p3DivisionFacts();
        }
        if (s.includes('mixed') || s.includes('two-step') || s.includes('balance')) {
            return linearEquations.p3MixedOperations();
        }
        return linearEquations.p3AdditionWithin100();
    }

    // =============================================
    // P4: LINEAR EQUATIONS
    // Subtopics from topics.js:
    //   "Multiplication facts (6,7,8,9)" | "Missing product" | "Missing factor"
    //   "Multi-digit multiplication" | "2-digit × 1-digit" | "3-digit × 1-digit"
    //   "Division with remainders" | "Find quotient and remainder" | "Missing divisor" | "Missing dividend"
    //   "Fraction equations" | "Find missing numerator" | "Find missing denominator"
    //   "Decimal equations" | "Missing number in addition" | "Missing number in subtraction" | "Balance decimal equations"
    // =============================================
    if (cls === 'p4') {
        // Multiplication — covers fact tables, multi-digit, ×-digit subtopics
        if (s.includes('multiplication') || s.includes('product') ||
            s.includes('multi-digit')    || s.includes('× 1-digit')) {
            return linearEquations.p3MultiplicationFacts();
        }
        // Missing factor also shared with multiplication
        if (s.includes('missing factor')) return linearEquations.p3MultiplicationFacts();

        // Division — covers remainder, quotient, missing divisor/dividend
        if (s.includes('division')  || s.includes('quotient') ||
            s.includes('divisor')   || s.includes('dividend') ||
            s.includes('remainder')) {
            return linearEquations.p3DivisionFacts();
        }

        // Fraction equations — "Fraction equations", "Find missing numerator/denominator"
        if (s.includes('fraction') || s.includes('numerator') || s.includes('denominator')) {
            return pick([linearEquations.bracketDivideAdd, linearEquations.bracketDivideSubtract])();
        }

        // Decimal equations — all decimal subtopics
        if (s.includes('decimal') || s.includes('balance decimal')) {
            return linearEquations.oneStepAdd();
        }

        return linearEquations.oneStepAdd();
    }

    // =============================================
    // P5: LINEAR EQUATIONS
    // Subtopics from topics.js:
    //   "Fraction equations" | "Add/subtract unlike denominators" | "Multiply fractions" | "Divide fractions"
    //   "Decimal equations" | "Add/subtract decimals" | "Multiply decimals" | "Divide decimals"
    //   "Percentage equations" | "Find percentage of a number" | "Find the whole" | "Find the percent"
    //   "Ratio equations" | "Find missing term" | "Scale ratios"
    //   "Order of operations equations" | "Find missing number" | "Insert parentheses"
    // =============================================
    if (cls === 'p5') {
        // Fraction equations — all fraction/denominator subtopics
        if (s.includes('fraction')     || s.includes('denominator') ||
            s.includes('numerator')    || s.includes('unlike')) {
            return pick([linearEquations.bracketDivideAdd, linearEquations.bracketDivideSubtract])();
        }
        // Decimal equations
        if (s.includes('decimal')) return linearEquations.oneStepAdd();
        // Percentage equations
        if (s.includes('percentage') || s.includes('percent') ||
            s.includes('find the whole') || s.includes('find the percent')) {
            return linearEquations.oneStepAdd();
        }
        // Ratio equations
        if (s.includes('ratio') || s.includes('missing term') || s.includes('scale ratio')) {
            return linearEquations.oneStepAdd();
        }
        // Order of operations
        if (s.includes('order of operations') || s.includes('insert parentheses')) {
            return linearEquations.multistepBracketAddConst();
        }
        return pick([linearEquations.twoStepAdd, linearEquations.twoStepSubtract])();
    }

    // =============================================
    // P6: LINEAR EQUATIONS
    // Subtopics from topics.js:
    //   "One-step equations" | "x + a = b" | "x - a = b" | "ax = b" | "x/a = b"
    //   "Two-step equations" | "ax + b = c" | "ax - b = c" | "x/a + b = c"
    //   "Equations with fractions" | "Fraction coefficients" | "Fraction constants"
    //   "Equations with decimals" | "Decimal coefficients" | "Decimal constants"
    // =============================================
    if (cls === 'p6') {
        // One-step — catches the group label AND each individual form (x + a = b etc.)
        if (s.includes('one-step')       ||
            s === 'x + a = b'            || s === 'x - a = b' ||
            s === 'ax = b'               || s === 'x/a = b') {
            return pick([
                linearEquations.oneStepAdd,
                linearEquations.oneStepSubtract,
                linearEquations.oneStepAddReversed,
                linearEquations.oneStepSubtractFrom,
            ])();
        }
        // Two-step — catches the group label AND individual forms
        if (s.includes('two-step')       ||
            s.includes('ax + b')         || s.includes('ax - b') ||
            s.includes('x/a + b')) {
            return pick([linearEquations.twoStepAdd, linearEquations.twoStepSubtract])();
        }
        // Fraction equations — "Equations with fractions", "Fraction coefficients", "Fraction constants"
        if (s.includes('fraction') || s.includes('coefficient') || s.includes('constant')) {
            return pick([linearEquations.bracketDivideAdd, linearEquations.bracketDivideSubtract])();
        }
        // Decimal equations
        if (s.includes('decimal')) return linearEquations.oneStepAdd();

        return linearEquations.oneStepAdd();
    }

    // =============================================
    // FALLBACK
    // =============================================
    return linearEquations.oneStepAdd();
}

export default { generateEquation };
