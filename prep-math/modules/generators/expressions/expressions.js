import { validateExpression } from './utils.js';
import { writingExpression, evaluatingExpression, orderOfOps } from './primary.js';
import { simplifyLikeTerms, distributive, simpleFactoring, factoriseQuadratic, cubesExpression } from './simplify.js';
import { indicesExpression, indicialSimplify } from './indices.js';
import { polynomialOps, remainderTheorem, polynomialDivision } from './polynomials.js';
import { rationalExpr, algebraicFractionOps, rationalFunctions } from './rational.js';
import { binomialExpansion, binomialGeneralTerm } from './binomial.js';
import { partialFractions, logExpression, complexNumbers, matrices } from './advanced.js';
import { trigIdentity, trigExpression } from './trig.js';
import { exponentialExpression } from './exponential.js';

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
  if (t.includes('order of operation')) result = orderOfOps();
  else if (t.includes('writing') && (t.includes('addition') || t.includes('expression'))) result = writingExpression();
  else if (t.includes('evaluating') || t.includes('evaluate')) result = evaluatingExpression();
  
  // Simplification
  else if (t.includes('simplif') && t.includes('like')) result = simplifyLikeTerms();
  else if (t.includes('simplif') && t.includes('indici')) result = indicialSimplify();
  else if (t.includes('simplif') || t.includes('collecting')) result = simplifyLikeTerms();
  
  // Expansion & Factoring
  else if (t.includes('distributive') || (t.includes('expand') && !t.includes('binomial') && !t.includes('factori'))) result = distributive();
  else if (t.includes('simple factor') || (t.includes('factor') && ['p3', 'p4', 'p5', 'p6'].includes(classId))) result = simpleFactoring();
  else if (t.includes('expanding binomial') || t.includes('expand binomial')) result = binomialExpansion();
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

// Default export for convenience
export default { generateExpression };