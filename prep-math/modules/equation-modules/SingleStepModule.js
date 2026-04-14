// modules/equation-modules/SingleStepModule.js

import { EquationModule } from './BaseModule.js';

export class SingleStepModule extends EquationModule {
    canHandle() {
        const topics = ["Missing Numbers", "Simple Addition", "Addition & Subtraction", "Solving for X", "Basic Algebra"];
        return topics.some(t => this.topic.includes(t));
    }
    
    generate() {
        const ops = ['addition', 'subtraction', 'multiplication', 'division'];
        let opIndex = 0;
        
        if (this.classId === 'p1') opIndex = 0;
        else if (this.classId === 'p2') opIndex = this.randomInt(0, 1);
        else if (this.classId === 'p3' || this.classId === 'p4') opIndex = this.randomInt(0, 2);
        else opIndex = this.randomInt(0, 3);
        
        switch(ops[opIndex]) {
            case 'addition': return this.generateAddition();
            case 'subtraction': return this.generateSubtraction();
            case 'multiplication': return this.generateMultiplication();
            case 'division': return this.generateDivision();
            default: return this.generateAddition();
        }
    }
    
    generateAddition() {
        const range = this.getRangeForLevel();
        let x = this.randomInt(range.minX, range.maxX);
        let a = this.randomInt(range.minConst, Math.min(range.maxConst, x - 1));
        let b = x + a;
        
        if (b > range.maxX + range.maxConst) {
            x = this.randomInt(range.minX, range.maxX / 2);
            a = this.randomInt(range.minConst, range.maxConst);
            b = x + a;
        }
        
        let equation = `x+${a}=${b}`;
        let hint = `Subtract ${a} from both sides: x = ${b} - ${a} = ${x}`;
        
        if (this.classId !== 'p1' && this.randomInt(1, 5) === 1) {
            equation = `${a}+x=${b}`;
        }
        
        return { type: 'equation', eq: equation, goal: `x=${x}`, hint: hint };
    }
    
    generateSubtraction() {
        const range = this.getRangeForLevel();
        const type = this.randomInt(1, 3);
        
        if (type <= 2) {
            let a = this.randomInt(range.minConst, range.maxConst);
            let b = this.randomInt(range.minX, range.maxX);
            let x = a + b;
            
            return {
                type: 'equation',
                eq: `x-${a}=${b}`,
                goal: `x=${x}`,
                hint: `Add ${a} to both sides: x = ${b} + ${a} = ${x}`
            };
        } else {
            let a = this.randomInt(range.minConst + 5, range.maxConst + 20);
            let b = this.randomInt(2, Math.min(a - 1, range.maxX));
            let x = a - b;
            
            return {
                type: 'equation',
                eq: `${a}-x=${b}`,
                goal: `x=${x}`,
                hint: `Add x to both sides, then subtract ${b}: x = ${a} - ${b} = ${x}`
            };
        }
    }
    
    generateMultiplication() {
        const range = this.getRangeForLevel();
        let a = this.randomInt(2, this.classId === 'p3' ? 5 : 9);
        let x = this.randomInt(range.minX, Math.min(range.maxX / a, 20));
        let b = a * x;
        
        return {
            type: 'equation',
            eq: `${a}*x=${b}`,
            goal: `x=${x}`,
            hint: `Divide both sides by ${a}: x = ${b} ÷ ${a} = ${x}`
        };
    }
    
    generateDivision() {
        const range = this.getRangeForLevel();
        let a = this.randomInt(2, this.classId === 'p3' ? 4 : 8);
        let b = this.randomInt(2, Math.min(range.maxX / a, 15));
        let x = a * b;
        
        return {
            type: 'equation',
            eq: `x/${a}=${b}`,
            goal: `x=${x}`,
            hint: `Multiply both sides by ${a}: x = ${b} × ${a} = ${x}`
        };
    }
}