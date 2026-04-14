import { rnd, pick, expQ } from './utils.js';

export function trigIdentity() {
  const expressions = [
    expQ(`sin^2(x)+cos^2(x)`, `1`, `Pythagorean identity: sin²x+cos²x=1 for all x.`),
    expQ(`1-cos^2(x)`, `sin^2(x)`, `Rearrange sin²x+cos²x=1: sin²x=1-cos²x.`),
    expQ(`tan(x)*cos(x)`, `sin(x)`, `tan x=sin x/cos x, so tan x × cos x = sin x.`),
    expQ(`sec^2(x)-tan^2(x)`, `1`, `Pythagorean identity: 1+tan²x=sec²x, so sec²x-tan²x=1.`),
    expQ(`sin(2x)`, `2*sin(x)*cos(x)`, `Double angle formula: sin(2x)=2 sin x cos x.`),
    expQ(`cos(2x)`, `cos^2(x)-sin^2(x)`, `Double angle formula: cos(2x)=cos²x-sin²x.`),
  ];
  return pick(expressions);
}

export function trigExpression() {
  return trigIdentity();
}