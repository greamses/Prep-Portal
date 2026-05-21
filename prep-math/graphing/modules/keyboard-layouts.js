import { FUNCTION_KEYS } from './constants.js';

export const K = {
  DEL: { val: 'DEL', cls: 'gp-key-del', display: '<svg viewBox="0 0 24 24"><path d="M21 4H8l-7 8 7 8h13a2 2 0 002-2V6a2 2 0 00-2-2zm-2.58 11L15 11.59 11.59 15 10.17 13.59 13.59 10.17 10.17 6.76 11.59 5.34 15 8.76 18.41 5.34 19.83 6.76 16.41 10.17 19.83 13.59z"/></svg>' },
  ENTER: { val: '↵', cls: 'gp-key-enter', display: '↵' },
  LEFT: { val: '←', cls: '', display: '<svg viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>' },
  RIGHT: { val: '→', cls: '', display: '<svg viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>' },
  SHIFT: { val: '⇧', cls: 'gp-key-shift', display: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 4L4 12h5v8h6v-8h5z"/></svg>' },
  xSQ: { val: '^2', cls: 'gp-key-func', display: 'x<sup>2</sup>' },
  xY: { val: '^', cls: 'gp-key-func', display: 'x<sup>y</sup>' },
  SQRT: { val: 'sqrt(', cls: 'gp-key-func', display: '√' },
  ABS: { val: 'abs(', cls: 'gp-key-func', display: '|x|' },
  SINi: { val: 'arcsin(', cls: 'gp-key-func', display: 'sin<sup>-1</sup>' },
  COSi: { val: 'arccos(', cls: 'gp-key-func', display: 'cos<sup>-1</sup>' },
  TANi: { val: 'arctan(', cls: 'gp-key-func', display: 'tan<sup>-1</sup>' },
  LN: { val: 'ln(', cls: 'gp-key-func', display: 'ln' },
  LOG10: { val: 'log10(', cls: 'gp-key-func', display: 'log<sub>10</sub>' },
  LOGx: { val: 'logx(', cls: 'gp-key-func', display: 'log<sub>x</sub>' },
  DDXK: { val: 'diff(', cls: 'gp-key-func', display: '<span style="font-size:10px;line-height:1">d/dx</span>' },
  INT: { val: 'int(', cls: 'gp-key-func', display: '∫' },
  ETOX: { val: 'e^', cls: 'gp-key-func', display: 'e<sup>x</sup>' },
  TENTOX: { val: '10^', cls: 'gp-key-func', display: '10<sup>x</sup>' },
  NROOT: { val: 'nroot(', cls: 'gp-key-func', display: '<sup>n</sup>√' },
  INF: { val: 'infinity', cls: 'gp-key-func', display: '∞' },
  ALPHA: { val: '⇧_abc', cls: 'gp-key-shift', display: 'αβγ' },
  ABC: { val: '⇧_grk', cls: 'gp-key-shift', display: 'ABC' },
  ANS: { val: 'ans', cls: 'gp-key-func', display: 'ans' },
};

export const layouts = {
  '123': [
    [K.xSQ, K.xY, K.SQRT, K.ABS, '4', '5', '6', '+', '−'],
    ['x', 'y', 'π', 'e', '7', '8', '9', '×', '÷'],
    ['<', '>', '≤', '≥', '1', '2', '3', '=', K.DEL],
    [K.ANS, ',', '(', ')', '0', '.', K.LEFT, K.RIGHT, K.ENTER]
  ],
  'f(x)': [
    ['sin', 'cos', 'tan', '%', '!', '$', '°'],
    [K.SINi, K.COSi, K.TANi, '{', '}', '≤', '≥'],
    [K.LN, K.LOG10, K.LOGx, K.DDXK, K.INT, 'i', K.DEL],
    [K.ETOX, K.TENTOX, K.NROOT, K.INF, K.LEFT, K.RIGHT, K.ENTER]
  ],
  'abc': [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    [K.SHIFT, 'z', 'x', 'c', 'v', 'b', 'n', 'm', K.DEL],
    [K.ALPHA, ',', '(', ')', K.LEFT, K.RIGHT, K.ENTER]
  ],
  '#&¬': [
    ['φ', 'ς', 'ε', 'ρ', 'τ', 'υ', 'θ', 'ι', 'ο', 'π'],
    ['α', 'σ', 'δ', 'ϕ', 'γ', 'η', 'ξ', 'κ', 'λ'],
    [K.SHIFT, 'ζ', 'χ', 'ψ', 'ω', 'β', 'ν', 'μ', K.DEL],
    [K.ABC, ',', '(', ')', K.LEFT, K.RIGHT, K.ENTER]
  ],
  '...': [
    ['d/dx', '∫', '∞', 'Σ', 'Π', 'lim'],
    ['mod', 'gcd', 'lcm', 'nCr', 'nPr', K.DEL],
    [K.LEFT, K.RIGHT, K.ENTER]
  ]
};

export function norm(k) {
  if (typeof k === 'string') return { val: k, display: k, cls: '' };
  return k;
}

export function getKeyClass(val, cls) {
  if (!cls && FUNCTION_KEYS.includes(val)) {
    return 'gp-key-func';
  }
  return cls;
}