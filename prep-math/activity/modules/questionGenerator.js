// questionGenerator.js - Question generation logic (FIXED)
import { MIXED_DENOMINATORS, ALL_MODES } from './config.js';

export function generateQuestion(settings) {
  let mode = settings.mode;
  
  if (settings.mode === 'mixed') {
    mode = ALL_MODES[Math.floor(Math.random() * ALL_MODES.length)];
  }
  
  if (mode === 'random-total') {
    const total = [12, 20, 24, 30, 36, 40, 48, 60][Math.floor(Math.random() * 8)];
    const denominators = [2, 3, 4, 5, 6, 8, 10, 12].filter(d => total % d === 0);
    const denominator = denominators[Math.floor(Math.random() * denominators.length)];
    const shaded = Math.floor(Math.random() * (denominator - 1)) + 1;
    return { shaded, totalParts: denominator, total, mode };
  }
  
  if (mode === 'different-parts') {
    const numSectors = Math.floor(Math.random() * 4) + 3;
    const sectors = [];
    let total = 0;
    
    const denominators = [8, 10, 12];
    const targetTotal = denominators[Math.floor(Math.random() * denominators.length)];
    
    for (let i = 0; i < numSectors; i++) {
      const remaining = targetTotal - total;
      const maxSize = remaining - (numSectors - i - 1);
      const size = i === numSectors - 1 ? remaining : Math.floor(Math.random() * (maxSize - 1)) + 1;
      const shaded = Math.random() > 0.4;
      sectors.push({ size, shaded, total: targetTotal });
      total += size;
    }
    
    let requestedMode = mode;
    if (settings.mode === 'mixed') {
      const formatModes = ['fractions', 'percents', 'degrees', 'decimals', 'time'];
      requestedMode = formatModes[Math.floor(Math.random() * formatModes.length)];
    }
    
    return { sectors, mode, requestedMode };
  }
  
  if (mode === 'compare') {
    let leftDenom, rightDenom;
    
    if (settings.sameSplitCompare) {
      leftDenom = MIXED_DENOMINATORS[Math.floor(Math.random() * MIXED_DENOMINATORS.length)];
      rightDenom = leftDenom;
    } else {
      leftDenom = MIXED_DENOMINATORS[Math.floor(Math.random() * MIXED_DENOMINATORS.length)];
      do {
        rightDenom = MIXED_DENOMINATORS[Math.floor(Math.random() * MIXED_DENOMINATORS.length)];
      } while (rightDenom === leftDenom);
    }
    
    const leftActive = Math.floor(Math.random() * (leftDenom - 1)) + 1;
    const rightActive = Math.floor(Math.random() * (rightDenom - 1)) + 1;
    return { leftActive, leftDenom, rightActive, rightDenom, mode };
  }
  
  if (['add', 'subtract', 'multiply', 'divide'].includes(mode)) {
    let leftDenom, rightDenom;
    
    if (settings.likeFractions) {
      leftDenom = MIXED_DENOMINATORS[Math.floor(Math.random() * MIXED_DENOMINATORS.length)];
      rightDenom = leftDenom;
    } else {
      leftDenom = MIXED_DENOMINATORS[Math.floor(Math.random() * MIXED_DENOMINATORS.length)];
      do {
        rightDenom = MIXED_DENOMINATORS[Math.floor(Math.random() * MIXED_DENOMINATORS.length)];
      } while (rightDenom === leftDenom);
    }
    
    const leftActive = Math.floor(Math.random() * (leftDenom - 1)) + 1;
    let rightActive;
    
    if (mode === 'subtract') {
      const leftVal = leftActive / leftDenom;
      let maxRightVal = leftVal;
      if (!settings.likeFractions) {
        maxRightVal = leftVal * 0.8;
      }
      rightActive = Math.floor(Math.random() * (rightDenom - 1)) + 1;
      while ((rightActive / rightDenom) > leftVal) {
        rightActive = Math.floor(Math.random() * (rightDenom - 1)) + 1;
      }
    } else {
      rightActive = Math.floor(Math.random() * (rightDenom - 1)) + 1;
    }
    
    return { leftActive, leftDenom, rightActive, rightDenom, mode };
  }
  
  let denom = settings.parts;
  if (settings.mode === 'mixed') {
    denom = MIXED_DENOMINATORS[Math.floor(Math.random() * MIXED_DENOMINATORS.length)];
  }
  
  const active = Math.floor(Math.random() * (denom - 1)) + 1;
  return { active, denominator: denom, mode };
}

export function getCorrectAnswer(q, mode) {
  if (mode === 'compare') {
    const leftVal = q.leftActive / q.leftDenom;
    const rightVal = q.rightActive / q.rightDenom;
    if (Math.abs(leftVal - rightVal) < 0.001) return '=';
    return leftVal > rightVal ? '>' : '<';
  }
  
  if (mode === 'random-total') {
    return Math.round((q.shaded / q.totalParts) * q.total).toString();
  }
  
  if (mode === 'different-parts') {
    const shadedTotal = q.sectors.filter(s => s.shaded).reduce((sum, s) => sum + s.size, 0);
    const total = q.sectors[0].total;
    const fraction = shadedTotal / total;
    const requestedMode = q.requestedMode || 'fractions';
    
    switch (requestedMode) {
      case 'percents': {
        const pct = fraction * 100;
        return Number.isInteger(pct) ? pct.toString() : (Math.round(pct * 10) / 10).toString();
      }
      case 'degrees': return Math.round(fraction * 360).toString();
      case 'decimals': return parseFloat(fraction.toFixed(4)).toString();
      case 'time': return Math.round(fraction * 60).toString();
      default: return `${shadedTotal}/${total}`;
    }
  }
  
  if (mode === 'add') {
    const num = q.leftActive * q.rightDenom + q.rightActive * q.leftDenom;
    const den = q.leftDenom * q.rightDenom;
    return `${num}/${den}`;
  }
  
  if (mode === 'subtract') {
    const num = q.leftActive * q.rightDenom - q.rightActive * q.leftDenom;
    const den = q.leftDenom * q.rightDenom;
    if (num < 0) return `-${-num}/${den}`;
    if (num === 0) return '0';
    return `${num}/${den}`;
  }
  
  if (mode === 'multiply') {
    const num = q.leftActive * q.rightActive;
    const den = q.leftDenom * q.rightDenom;
    return `${num}/${den}`;
  }
  
  if (mode === 'divide') {
    const num = q.leftActive * q.rightDenom;
    const den = q.leftDenom * q.rightActive;
    return `${num}/${den}`;
  }
  
  const active = q.active;
  const denominator = q.denominator;
  const fraction = active / denominator;
  
  switch (mode) {
    case 'fractions': return `${active}/${denominator}`;
    case 'percents': {
      const pct = fraction * 100;
      return Number.isInteger(pct) ? pct.toString() : (Math.round(pct * 10) / 10).toString();
    }
    case 'degrees': return Math.round(fraction * 360).toString();
    case 'decimals': return parseFloat(fraction.toFixed(4)).toString();
    case 'time': return Math.round(fraction * 60).toString();
    default: return `${active}/${denominator}`;
  }
}