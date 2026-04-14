
import { generateEquation }   from './generators/equations/equations.js';
import { generateExpression } from './generators/expressions/expressions.js';
import { generateInequality } from './generators/inequalities/inequalities.js';

export function generateOffline(type, topic, subtopic, classId = '', method = 'transfer') {
    try {
        switch (type) {
            case 'equation':
                return generateEquation(topic, subtopic, classId, method);
            case 'expression':
                return generateExpression(topic, subtopic, classId);
            case 'inequality':
                return generateInequality(topic, subtopic, classId);
            default:
                console.warn(`[Generator] Unexpected type "${type}" — falling back to equation.`);
                return generateEquation(topic, subtopic, classId, method);
        }
    } catch (err) {
        console.error('[Generator] Error:', err);
        return {
            type: 'equation',
            eq:   'x+2=5',
            goal: 'x=3',
            hint: 'Subtract 2 from both sides.',
        };
    }
}
