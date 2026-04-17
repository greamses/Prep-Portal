// utils.js - Math and utility functions
export function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}

export function leastCommonMultiple(a, b) {
  return (a * b) / gcd(a, b);
}

export function generateRandomColorSet() {
  const isPastel = Math.random() > 0.5;
  const palette = isPastel ? 
    ['#a8c9e5', '#b8e0b8', '#f5d6b3', '#e0b8e0', '#b8e0e0'] : 
    ['#7b9cae', '#8fbc94', '#d9b48b', '#c9a0c9', '#8fcbcb'];
  const randomColor = palette[Math.floor(Math.random() * palette.length)];
  
  return {
    shadedColor: randomColor,
    unshaded: isPastel ? '#e8e4dc' : '#e0d8cc',
    ink: '#1a1a1a',
    movingColor: '#ff9800',
  };
}

export function parseFraction(frac) {
  if (frac.includes(' ')) {
    const parts = frac.split(' ');
    const whole = parseInt(parts[0], 10);
    const fractionParts = parts[1].split('/');
    const num = parseInt(fractionParts[0], 10);
    const den = parseInt(fractionParts[1], 10);
    if (!isNaN(whole) && !isNaN(num) && !isNaN(den) && den !== 0) {
      return { numerator: whole * den + num, denominator: den };
    }
    return null;
  }
  
  const parts = frac.split('/');
  if (parts.length === 2) {
    const num = parseInt(parts[0], 10);
    const den = parseInt(parts[1], 10);
    if (!isNaN(num) && !isNaN(den) && den !== 0) {
      return { numerator: num, denominator: den };
    }
    return null;
  }
  
  const whole = parseInt(frac, 10);
  if (!isNaN(whole)) {
    return { numerator: whole, denominator: 1 };
  }
  
  return null;
}

export function areFractionsEquivalent(frac1, frac2) {
  const f1 = parseFraction(frac1);
  const f2 = parseFraction(frac2);
  if (!f1 || !f2) return false;
  return f1.numerator * f2.denominator === f2.numerator * f1.denominator;
}

export function simplifyFraction(frac) {
  const parsed = parseFraction(frac);
  if (!parsed) return frac;
  
  let { numerator, denominator } = parsed;
  let whole = 0;
  
  if (numerator >= denominator) {
    whole = Math.floor(numerator / denominator);
    numerator = numerator % denominator;
  }
  
  if (numerator > 0) {
    const divisor = gcd(numerator, denominator);
    numerator /= divisor;
    denominator /= divisor;
  }
  
  if (whole > 0 && numerator > 0) return `${whole} ${numerator}/${denominator}`;
  if (whole > 0) return whole.toString();
  if (numerator > 0) return `${numerator}/${denominator}`;
  return '0';
}

export function toLowestTerms(numerator, denominator) {
  const divisor = gcd(numerator, denominator);
  return `${numerator / divisor}/${denominator / divisor}`;
}

export function formatTimeDisplay(fraction, active, denominator) {
  if (fraction === 1) return '1 hour';
  if (fraction === 0.5) return '½ hour';
  if (fraction === 0.25) return '¼ hour';
  if (fraction === 0.75) return '¾ hour';
  return `${active}/${denominator} hour`;
}