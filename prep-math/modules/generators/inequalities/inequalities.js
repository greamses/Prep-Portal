/**
 * inequalities/index.js - Main dispatch for GM-compatible inequalities
 * 
 * GM canvas doesn't render inequality symbols, so we mount:
 * - eq: just the expression (LHS or boundary)
 * - fullInequality: the complete inequality for display
 * - hint: step-by-step solution with inequality signs
 */

import { linearInequality, simpleLinearInequality, linearInequalityNegativeCoeff } from './linear.js';
import { compoundInequality } from './compound.js';
import { quadraticInequality, quadraticInequalitySignChart } from './quadratic.js';
import { absoluteValueInequality, absoluteValueQuadraticInequality } from './absolute.js';
import { linearTwoVarInequality } from './two_var.js';

export function generateInequality(topic, subtopic, classId) {
  const t = topic.toLowerCase();
  const s = (subtopic || '').toLowerCase();
  
  // Absolute value inequalities
  if (t.includes('absolute value') || t.includes('absolute val')) {
    if (t.includes('quadratic')) {
      return absoluteValueQuadraticInequality();
    }
    return absoluteValueInequality();
  }
  
  // Linear inequalities (JSS1, JSS2)
  if (t.includes('linear') || t.includes('simple') || t.includes('intro')) {
    if (s.includes('negative') || t.includes('negative coefficient')) {
      return linearInequalityNegativeCoeff();
    }
    if (t.includes('two variable') || t.includes('graphing')) {
      return linearTwoVarInequality();
    }
    return linearInequality();
  }
  
  // Compound inequalities (JSS2)
  if (t.includes('compound') || (t.includes('double') && t.includes('inequality'))) {
    return compoundInequality();
  }
  
  // Quadratic inequalities (JSS3, SS1)
  if (t.includes('quadratic')) {
    if (s.includes('sign chart') || s.includes('cubic') || s.includes('advanced')) {
      return quadraticInequalitySignChart();
    }
    return quadraticInequality();
  }
  
  // Linear in two variables / graphing (JSS3)
  if ((t.includes('two variable') || t.includes('graphing')) && t.includes('linear')) {
    return linearTwoVarInequality();
  }
  
  // Fallback
  return linearInequality();
}

export default { generateInequality };