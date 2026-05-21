// Utility Functions
export function escAttr(s) {
  return s.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

export function toLatex(str) {
  let safe = str;
  safe = safe.replace(/\^(?![0-9{(-])/g, '^{ }');
  safe = safe.replace(/\^\($/g, '^{( }');
  safe = safe.replace(/\^{$/g, '^{ }');
  safe = safe.replace(/_(?![0-9{(-])/g, '_{ }');
  safe = safe.replace(/_\($/g, '_{( }');
  safe = safe.replace(/_{$/g, '_{ }');
  safe = safe.replace(/\\frac\{([^}]*)\}$/g, '\\frac{$1}{ }');
  safe = safe.replace(/\\frac$/g, '\\frac{ }{ }');
  safe = safe.replace(/\\sqrt$/g, '\\sqrt{ }');
  safe = safe.replace(/\\sqrt\{$/g, '\\sqrt{ }');
  
  return safe
    .replace(/\*/g, '\\times ')
    .replace(/\//g, '\\div ')
    .replace(/<=/g, '\\le ')
    .replace(/>=/g, '\\ge ')
    .replace(/sqrt\(/g, '\\sqrt{')
    .replace(/pi/g, '\\pi')
    .replace(/infinity/g, '\\infty')
    .replace(/sin\(/g, '\\sin(')
    .replace(/cos\(/g, '\\cos(')
    .replace(/tan\(/g, '\\tan(')
    .replace(/arcsin\(/g, '\\sin^{-1}(')
    .replace(/arccos\(/g, '\\cos^{-1}(')
    .replace(/arctan\(/g, '\\tan^{-1}(')
    .replace(/log10\(/g, '\\log_{10}(')
    .replace(/logx\(/g, '\\log_x(')
    .replace(/ln\(/g, '\\ln(')
    .replace(/int\(/g, '\\int ')
    .replace(/diff\(/g, '\\frac{d}{dx}')
    .replace(/abs\(/g, '\\left|')
    .replace(/\^(\d+)/g, '^{$1}')
    .replace(/\^\(([^)]+)\)/g, '^{$1}')
    .replace(/\^([a-zA-Z])/g, '^{$1}');
}

export function getCursorStyles(opacity = 1) {
  return `
    display: inline-block !important;
    visibility: visible !important;
    opacity: ${opacity} !important;
    width: 3px !important;
    height: 1.4em !important;
    background-color: #1a1a1a !important;
    margin: 0 2px !important;
    vertical-align: middle !important;
    animation: gp-blink 1s step-end infinite !important;
  `;
}

export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}