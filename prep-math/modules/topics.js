/**
 * modules/topics.js
 * Topic registry — class map, type classification, type helper.
 */

export const TOPICS_BY_CLASS = {
    p1:   ['Missing Numbers (1-10)', 'Simple Addition',        'Basic Patterns'],
    p2:   ['Missing Numbers (1-20)', 'Addition & Subtraction', 'Number Sequences'],
    p3:   ['Missing Numbers (1-100)','Multiplication Intro',   'Simple Division'],
    p4:   ['Multiplication & Division', 'Fractions Intro',     'Word Problems'],
    p5:   ['Fractions & Decimals',   'Ratios Intro',           'Area & Perimeter'],
    p6:   ['Order of Operations',    'Solving for X',          'Ratios & Proportion'],
    jss1: ['Algebraic Simplification','Linear Equations',      'Brackets & Fractions'],
    jss2: ['Word Problems (Algebra)','Indices & Powers',        'Number Bases'],
    jss3: ['Simultaneous Equations', 'Quadratic Equations',    'Factorization'],
    ss1:  ['Linear Equations',       'Quadratic Equations',    'Sets & Sequences'],
    ss2:  ['Linear Inequalities',    'Partial Fractions',      'Simultaneous Equations'],
    ss3:  ['Advanced Factorization', 'Binomial Theorem',       'Coordinate Geometry'],
};

/**
 * Topics shown as text problem in the modal — blank canvas for working.
 * "word" type: no auto-check, Mark Solved button.
 */
export const WORD_PROBLEM_TOPICS = new Set([
    'Basic Patterns',
    'Number Sequences',
    'Word Problems',
    'Ratios Intro',
    'Area & Perimeter',
    'Ratios & Proportion',
    'Word Problems (Algebra)',
    'Number Bases',
    'Sets & Sequences',
]);

/**
 * Topics shown as expressions on the canvas — student simplifies/expands.
 * "expression" type: no auto-check, Mark Done button.
 */
export const EXPRESSION_TOPICS = new Set([
    'Order of Operations',
    'Algebraic Simplification',
    'Indices & Powers',
    'Factorization',
    'Advanced Factorization',
    'Binomial Theorem',
    'Partial Fractions',
]);

/**
 * Return the question type for a given topic.
 * @returns {'equation' | 'expression' | 'word'}
 */
export function getTopicType(topic) {
    if (WORD_PROBLEM_TOPICS.has(topic))  return 'word';
    if (EXPRESSION_TOPICS.has(topic))    return 'expression';
    return 'equation';
}
