import { rnd, pick, eqQ } from './utils.js';
import { missingAddend, missingProduct, fractionEq, decimalEq } from './primary.js';
import { linearOneStep, linearBothSides, bracketEq, fractionLinearEq } from './linear.js';
import { simultaneousSubstitution, simultaneousElimination } from './simultaneous.js';
import { quadraticFactoring, quadraticCompleteSquare, quadraticFormula } from './quadratic.js';
import { exponentialEq, logarithmicEq, trigEq, suRdEq } from './advanced.js';
import { differentialEq } from './calculus.js';

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
            `Subtract ${b} from both sides, then divide by ${a}.`);
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

// Default export for convenience
export default { generateEquation };