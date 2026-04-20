import { getGcd } from '../utils/helpers.js';

export function fracConvLabel(f) {
  if (f.d === 'M') {
    const top = f.w * f.dn + f.n;
    return {
      type: 'mixed',
      whole: f.w,
      num: f.n,
      den: f.dn,
      improper: { num: top, den: f.dn }
    };
  }
  
  const w = Math.floor(f.n / f.dn);
  const r = f.n % f.dn;
  
  if (r === 0) {
    return { type: 'whole', whole: w, num: f.n, den: f.dn };
  }
  
  return {
    type: 'improper',
    whole: w,
    num: r,
    den: f.dn,
    improper: { num: f.n, den: f.dn }
  };
}

export function validateFractionAnswer(data, answers) {
  let isCorrect = false;
  let originalIsReducible = false;
  let answeredInLowestTerms = false;
  
  const getVal = (val) => val !== undefined && val !== '' ? parseInt(val) : 0;
  
  if (data.type === 'mixed') {
    const tNum = data.improper.num;
    const tDen = data.improper.den;
    originalIsReducible = (getGcd(tNum, tDen) > 1);
    
    const uNum = getVal(answers.num);
    const uDen = getVal(answers.den);
    
    if (uDen !== 0 && (uNum * tDen === tNum * uDen)) {
      isCorrect = true;
      if (getGcd(uNum, uDen) === 1) answeredInLowestTerms = true;
    }
  } else if (data.type === 'improper') {
    const tTotalNum = data.improper.num;
    const tDen = data.improper.den;
    originalIsReducible = (getGcd(tTotalNum, tDen) > 1);
    
    const uWhole = getVal(answers.whole);
    const uNum = getVal(answers.num);
    const uDen = getVal(answers.den);
    const uTotalNum = uWhole * uDen + uNum;
    
    if (uDen !== 0 && uNum < uDen && (uTotalNum * tDen === tTotalNum * uDen)) {
      isCorrect = true;
      if (uNum === 0 || getGcd(uNum, uDen) === 1) answeredInLowestTerms = true;
    }
  } else if (data.type === 'whole') {
    if (getVal(answers.whole) === data.whole) {
      isCorrect = true;
    }
  }
  
  return { isCorrect, originalIsReducible, answeredInLowestTerms };
}