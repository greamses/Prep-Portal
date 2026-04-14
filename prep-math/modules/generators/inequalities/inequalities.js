import { ineqQ } from './utils.js';
import { simpleLinear, simpleLinearMult, negativeCoeff, linearWordInequality } from './linear.js';
import { compoundAnd, systemLinearInequalities } from './compound.js';
import { quadraticInequality, signChartInequality } from './quadratic.js';
import { rationalInequality, rationalRadicalInequality } from './rational.js';
import { absoluteValueInequality, absQuadratic } from './absolute.js';
import { polynomialInequality } from './polynomial.js';
import { linearProgramming } from './linear_programming.js';
import { linearTwoVar } from './two_var.js';

/**
 * Generate an inequality based on topic and class level
 * @param {string} topic - Main topic (e.g., "linear inequality", "quadratic inequality")
 * @param {string} subtopic - Specific subtopic (e.g., "negative coefficient", "compound")
 * @param {string} classId - Class level like "jss1", "jss2", "jss3", "ss1", "ss2", "ss3"
 * @returns {InequalityObject} Inequality with eq, goal, and hint
 */
export function generateInequality(topic, subtopic, classId) {
  const t = topic.toLowerCase();
  const s = (subtopic || '').toLowerCase();
  
  // JSS1 - Introduction
  if (t.includes('introduction') || t.includes('simple inequality') || t.includes('intro')) {
    return s.includes('multiply') || s.includes('2x') ? simpleLinearMult() : simpleLinear();
  }
  
  // JSS2 - Negative coefficients
  if (t.includes('negative coefficient')) return negativeCoeff();
  
  // JSS2 - Compound inequalities
  if (t.includes('compound') && t.includes('and')) return compoundAnd();
  
  // JSS3 - Linear in two variables
  if (t.includes('linear') && t.includes('two variable')) return linearTwoVar();
  
  // SS1 - Quadratic (advanced / sign chart)
  if (t.includes('quadratic') && t.includes('advanced')) return signChartInequality();
  
  // JSS3/SS1 - Quadratic inequality
  if (t.includes('quadratic') && t.includes('inequalit')) return quadraticInequality();
  
  // SS3 - Rational with radicals
  if (t.includes('rational') && t.includes('radical')) return rationalRadicalInequality();
  
  // SS1 - Rational inequality
  if (t.includes('rational') && t.includes('inequalit')) return rationalInequality();
  
  // SS3 - Absolute value with quadratics
  if (t.includes('absolute value') && t.includes('quadratic')) return absQuadratic();
  
  // SS1/SS3 - Absolute value inequality
  if (t.includes('absolute value') || t.includes('absolute val')) return absoluteValueInequality();
  
  // SS2 - Polynomial inequality
  if (t.includes('polynomial')) return polynomialInequality();
  
  // SS2 - Linear programming
  if (t.includes('linear programming') || t.includes('programming')) return linearProgramming();
  
  // System of linear inequalities
  if (t.includes('system') && t.includes('linear')) return systemLinearInequalities();
  
  // Word problems
  if (t.includes('word') && t.includes('inequalit')) return linearWordInequality();
  
  // Fallback
  return simpleLinear();
}

// Default export for convenience
export default { generateInequality };