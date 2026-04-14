/**
 * modules/generator.js
 * Offline question router.
 *
 * Rules:
 *  - type 'equation'   → generators/equations.js
 *  - type 'expression' → generators/expressions.js
 *  - type 'inequality' → generators/inequalities.js
 *  - type 'word'       → NOT handled here; caller must use gemini.js
 *
 * All three sub-generators work without an API key.
 */

import { generateEquation }   from './generators/equations/equations.js';
import { generateExpression } from './generators/expressions.js';
import { generateInequality } from './generators/inequalities.js';

/**
 * Generate a question for a non-word topic.
 *
 * @param {'equation'|'expression'|'inequality'} type
 * @param {string} topic     - topic group name  (e.g. 'Linear Equations')
 * @param {string} subtopic  - specific subtopic (e.g. 'Solve ax + b = c (integers)')
 * @param {string} classId   - e.g. 'jss1', 'ss2'
 * @param {string} method    - 'transfer' | 'balancing' (relevant for equations only)
 * @returns {{ type, eq, goal, hint }}
 */
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
