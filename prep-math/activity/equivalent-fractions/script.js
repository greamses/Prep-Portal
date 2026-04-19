// Modal functionality
const modal = document.getElementById('viz-modal');
const modalBody = document.getElementById('viz-modal-body');

// Visualizer state and functions in global scope
window.vizState = {
  mode: 'multiply',
  leftNum: 2, leftDen: 5,
  midTop: 1, midBot: 1,
  verify: 0,
  opacity: 100
};

window.vizEl = {};

// Define vizSetMode globally before it's called
window.vizSetMode = function(mode) {
  window.vizState.mode = mode;
  
  const multiplyBtn = document.getElementById('mode-multiply');
  const divideBtn = document.getElementById('mode-divide');
  const addBtn = document.getElementById('mode-add');
  const subtractBtn = document.getElementById('mode-subtract');
  const badge = document.getElementById('modal-mode-badge');
  
  if (multiplyBtn) multiplyBtn.classList.toggle('active', mode === 'multiply');
  if (divideBtn) divideBtn.classList.toggle('active', mode === 'divide');
  if (addBtn) addBtn.classList.toggle('active', mode === 'add');
  if (subtractBtn) subtractBtn.classList.toggle('active', mode === 'subtract');
  
  const modeNames = { multiply: 'Multiply', divide: 'Divide', add: 'Add', subtract: 'Subtract' };
  if (badge) badge.textContent = modeNames[mode] || 'Multiply';
  
  window.vizState.verify = 0;
  window.vizState.opacity = 100;
  if (window.vizEl.sVerify) window.vizEl.sVerify.value = 0;
  if (window.vizEl.sOpacity) window.vizEl.sOpacity.value = 100;
  if (window.vizEl.vOpacity) window.vizEl.vOpacity.textContent = '100%';
  
  if (typeof window.vizUpdate === 'function') {
    window.vizUpdate();
  }
};

// Helper function for SVG paths
window.getSlicePath = function(cx, cy, r, startAngle, endAngle) {
  if (Math.abs(endAngle - startAngle) >= 2 * Math.PI - 0.001) {
    return `M ${cx} ${cy-r} A ${r} ${r} 0 1 1 ${cx} ${cy+r} A ${r} ${r} 0 1 1 ${cx} ${cy-r} Z`;
  }
  const x1 = cx + r * Math.cos(startAngle);
  const y1 = cy + r * Math.sin(startAngle);
  const x2 = cx + r * Math.cos(endAngle);
  const y2 = cy + r * Math.sin(endAngle);
  const largeArc = (endAngle - startAngle > Math.PI) ? 1 : 0;
  return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
};

// Check if drawing is possible
window.canDraw = function(num, den) {
  if (den <= 0) return { can: false, reason: 'impossible' };
  if (num < 0) return { can: false, reason: 'impossible' };
  if (!Number.isInteger(num) || !Number.isInteger(den)) return { can: false, reason: 'impossible' };
  if (den > 100) return { can: false, reason: 'too big' };
  if (num / den > 12) return { can: false, reason: 'too big' };
  return { can: true, reason: null };
};

// Draw visual function
window.drawVisual = function(container, num, den, colorType) {
  if (!container) return;
  container.innerHTML = '';
  
  const drawCheck = window.canDraw(num, den);
  const isBlue = colorType === 'blue';
  const colorFill = isBlue ? 'rgba(0, 85, 255, 0.15)' : 'rgba(0, 165, 80, 0.15)';
  const colorStroke = isBlue ? '#0055ff' : '#00a550';
  
  if (!drawCheck.can) {
    const message = drawCheck.reason === 'impossible' ? 'impossible' : 'too big';
    const pw = document.createElement('div');
    pw.className = 'pie-wrapper';
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('viewBox', '0 0 200 200');
    
    const bg = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    bg.setAttribute('cx', '100');
    bg.setAttribute('cy', '100');
    bg.setAttribute('r', '95');
    bg.setAttribute('fill', 'white');
    bg.setAttribute('stroke', colorStroke);
    bg.setAttribute('stroke-width', '2');
    svg.appendChild(bg);
    
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', '100');
    text.setAttribute('y', '105');
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('font-family', "'Cambria Math', 'JetBrains Mono', monospace");
    text.setAttribute('font-size', message === 'impossible' ? '22' : '18');
    text.setAttribute('fill', colorStroke);
    text.setAttribute('font-style', 'italic');
    text.textContent = message;
    svg.appendChild(text);
    
    pw.appendChild(svg);
    container.appendChild(pw);
    return;
  }
  
  let wholes = 0, pieNum = 0;
  
  if (num > 0 && den > 0) {
    wholes = Math.min(Math.floor(num / den), 12);
    pieNum = num - wholes * den;
  }

  // Whole units as circles
  if (wholes > 0) {
    const wc = document.createElement('div');
    wc.className = 'wholes-container';
    for (let i = 0; i < wholes; i++) {
      const circle = document.createElement('div');
      circle.className = `whole-circle whole-${colorType}`;
      wc.appendChild(circle);
    }
    container.appendChild(wc);
  }

  // Pie chart
  const pw = document.createElement('div');
  pw.className = 'pie-wrapper';
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');
  svg.setAttribute('viewBox', '0 0 200 200');
  if (isBlue) svg.id = 'blue-pie-svg';
  else svg.id = 'green-pie-svg';

  const cx = 100, cy = 100, r = 95;
  
  // Background
  const bg = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  bg.setAttribute('cx', cx);
  bg.setAttribute('cy', cy);
  bg.setAttribute('r', r);
  bg.setAttribute('fill', 'white');
  bg.setAttribute('stroke', colorStroke);
  bg.setAttribute('stroke-width', '2');
  svg.appendChild(bg);

  // Filled portion
  if (pieNum > 0 && den > 0) {
    const sa = -Math.PI / 2;
    const ea = sa + (pieNum / den) * 2 * Math.PI;
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', window.getSlicePath(cx, cy, r, sa, ea));
    path.setAttribute('fill', colorFill);
    path.setAttribute('stroke', colorStroke);
    path.setAttribute('stroke-width', '1.5');
    if (isBlue) path.id = 'blue-filled-path';
    svg.appendChild(path);
  }

  // Division lines
  const maxLines = isBlue ? 50 : 100;
  
  if (den <= maxLines) {
    for (let i = 0; i < den; i++) {
      const angle = -Math.PI / 2 + i * 2 * Math.PI / den;
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', cx);
      line.setAttribute('y1', cy);
      line.setAttribute('x2', cx + r * Math.cos(angle));
      line.setAttribute('y2', cy + r * Math.sin(angle));
      line.setAttribute('stroke', colorStroke);
      line.setAttribute('stroke-width', '1.5');
      svg.appendChild(line);
    }
  }
  
  pw.appendChild(svg);
  container.appendChild(pw);
};

// Update visualizer
window.vizUpdate = function() {
  const state = window.vizState;
  const el = window.vizEl;
  
  if (!el.vLeftNum) return;
  
  let rightNum, rightDen;
  let isEqual = false;
  
  if (state.mode === 'multiply') {
    rightNum = state.leftNum * state.midTop;
    rightDen = state.leftDen * state.midBot;
    if (el.vMidTop) el.vMidTop.textContent = '×' + state.midTop;
    if (el.vMidBot) el.vMidBot.textContent = '×' + state.midBot;
    isEqual = (state.midTop === state.midBot);
  } else if (state.mode === 'divide') {
    rightNum = state.leftNum / state.midTop;
    rightDen = state.leftDen / state.midBot;
    if (el.vMidTop) el.vMidTop.textContent = '÷' + state.midTop;
    if (el.vMidBot) el.vMidBot.textContent = '÷' + state.midBot;
    isEqual = (state.midTop === state.midBot);
  } else if (state.mode === 'add') {
    rightNum = state.leftNum + state.midTop;
    rightDen = state.leftDen + state.midBot;
    if (el.vMidTop) el.vMidTop.textContent = '+' + state.midTop;
    if (el.vMidBot) el.vMidBot.textContent = '+' + state.midBot;
    const leftValue = state.leftNum / state.leftDen;
    const rightValue = rightNum / rightDen;
    isEqual = Math.abs(leftValue - rightValue) < 0.0001;
  } else if (state.mode === 'subtract') {
    rightNum = state.leftNum - state.midTop;
    rightDen = state.leftDen - state.midBot;
    if (el.vMidTop) el.vMidTop.textContent = '−' + state.midTop;
    if (el.vMidBot) el.vMidBot.textContent = '−' + state.midBot;
    const leftValue = state.leftNum / state.leftDen;
    const rightValue = rightNum / rightDen;
    isEqual = Math.abs(leftValue - rightValue) < 0.0001;
  }

  el.vLeftNum.textContent = state.leftNum;
  el.vLeftDen.textContent = state.leftDen;
  
  if (el.vSign) {
    el.vSign.textContent = isEqual ? '=' : '≠';
    el.vSign.className = 'cell sign ' + (isEqual ? 'text-green' : 'text-purple');
  }
  
  const formatNum = (n) => {
    if (!Number.isInteger(n)) return '?';
    return Math.round(n);
  };
  
  el.vRightNum.textContent = formatNum(rightNum);
  el.vRightDen.textContent = formatNum(rightDen);

  window.drawVisual(el.leftVis, state.leftNum, state.leftDen, 'blue');
  
  const rightDrawCheck = window.canDraw(rightNum, rightDen);
  if (!rightDrawCheck.can) {
    window.drawVisual(el.rightVis, rightNum, rightDen, 'green');
    el.sVerify.disabled = true;
    el.sOpacity.disabled = true;
  } else {
    window.drawVisual(el.rightVis, rightNum, rightDen, 'green');
    el.sVerify.disabled = false;
    el.sOpacity.disabled = false;
  }
  
  window.vizState.verify = 0;
  if (el.sVerify) el.sVerify.value = 0;
  window.vizUpdateVerify();
};

// Verify animation
window.vizUpdateVerify = function() {
  const leftSvg = document.getElementById('blue-pie-svg');
  const rightSvg = document.getElementById('green-pie-svg');
  const leftPieWrapper = leftSvg ? leftSvg.closest('.pie-wrapper') : null;
  const rightPieWrapper = rightSvg ? rightSvg.closest('.pie-wrapper') : null;
  
  if (!leftSvg || !rightSvg || !leftPieWrapper || !rightPieWrapper) return;
  
  const leftHasText = leftSvg.querySelector('text') !== null;
  const rightHasText = rightSvg.querySelector('text') !== null;
  
  if (leftHasText || rightHasText) return;
  
  const progress = window.vizState.verify / 100;
  const opacityProgress = window.vizState.opacity / 100;
  
  const leftRect = leftPieWrapper.getBoundingClientRect();
  const rightRect = rightPieWrapper.getBoundingClientRect();
  
  const distX = rightRect.left - leftRect.left;
  const distY = rightRect.top - leftRect.top;
  
  leftSvg.style.position = 'relative';
  leftSvg.style.zIndex = progress > 0 ? '100' : '1';
  leftSvg.style.pointerEvents = 'none';
  leftSvg.style.transform = `translate(${distX * progress}px, ${distY * progress}px)`;
  
  const blueBg = leftSvg.querySelector('circle[fill="white"], circle[fill^="rgba"]');
  const bluePath = leftSvg.querySelector('path');
  const blueLines = leftSvg.querySelectorAll('line');
  
  if (progress > 0) {
    if (blueBg) {
      const bgOpacity = 1 - opacityProgress;
      blueBg.setAttribute('fill', bgOpacity <= 0.01 ? 'transparent' : `rgba(255, 255, 255, ${bgOpacity})`);
    }
    
    if (bluePath) {
      const fillOpacity = (1 - opacityProgress) * 0.15;
      bluePath.setAttribute('fill', fillOpacity <= 0.01 ? 'transparent' : `rgba(0, 85, 255, ${fillOpacity})`);
    }
    
    const lineOpacity = Math.max(0.3, 1 - opacityProgress * 0.7);
    blueLines.forEach(line => {
      line.style.opacity = lineOpacity;
    });
  }
  
  rightSvg.style.position = 'relative';
  rightSvg.style.zIndex = '1';
  rightSvg.style.opacity = '1';
  
  const rightPaths = rightSvg.querySelectorAll('path, line, circle');
  rightPaths.forEach(el => {
    el.style.opacity = '1';
    el.style.visibility = 'visible';
  });
  
  if (progress === 0) {
    leftSvg.style.transform = 'translate(0px, 0px)';
    leftSvg.style.opacity = '1';
    leftSvg.style.zIndex = '1';
    leftSvg.style.pointerEvents = 'auto';
    
    if (blueBg) blueBg.setAttribute('fill', 'white');
    if (bluePath) bluePath.setAttribute('fill', 'rgba(0, 85, 255, 0.15)');
    blueLines.forEach(line => line.style.opacity = '1');
  }
};

// Update opacity only
window.vizUpdateOpacity = function() {
  const leftSvg = document.getElementById('blue-pie-svg');
  if (!leftSvg) return;
  
  const leftHasText = leftSvg.querySelector('text') !== null;
  if (leftHasText) return;
  
  const opacityProgress = window.vizState.opacity / 100;
  
  const blueBg = leftSvg.querySelector('circle[fill="white"], circle[fill^="rgba"]');
  const bluePath = leftSvg.querySelector('path');
  const blueLines = leftSvg.querySelectorAll('line');
  
  if (blueBg) {
    const bgOpacity = 1 - opacityProgress;
    blueBg.setAttribute('fill', bgOpacity <= 0.01 ? 'transparent' : `rgba(255, 255, 255, ${bgOpacity})`);
  }
  
  if (bluePath) {
    const fillOpacity = (1 - opacityProgress) * 0.15;
    bluePath.setAttribute('fill', fillOpacity <= 0.01 ? 'transparent' : `rgba(0, 85, 255, ${fillOpacity})`);
  }
  
  const lineOpacity = Math.max(0.3, 1 - opacityProgress * 0.7);
  blueLines.forEach(line => line.style.opacity = lineOpacity);
};

// Initialize visualizer
function initVisualizer() {
  window.vizEl = {
    sLeftNum: document.getElementById('s-left-num'),
    sLeftDen: document.getElementById('s-left-den'),
    sMidTop: document.getElementById('s-mid-top'),
    sMidBot: document.getElementById('s-mid-bot'),
    sVerify: document.getElementById('verify-slider'),
    sOpacity: document.getElementById('opacity-slider'),
    vLeftNum: document.getElementById('val-left-num'),
    vLeftDen: document.getElementById('val-left-den'),
    vMidTop: document.getElementById('val-mid-top'),
    vMidBot: document.getElementById('val-mid-bot'),
    vRightNum: document.getElementById('val-right-num'),
    vRightDen: document.getElementById('val-right-den'),
    vSign: document.getElementById('val-sign'),
    vOpacity: document.getElementById('val-opacity'),
    leftVis: document.getElementById('left-vis'),
    rightVis: document.getElementById('right-vis')
  };

  const sliders = [window.vizEl.sLeftNum, window.vizEl.sLeftDen, window.vizEl.sMidTop, window.vizEl.sMidBot];
  sliders.forEach(s => {
    if (!s) return;
    s.addEventListener('input', (e) => {
      const id = e.target.id;
      if (id === 's-left-num') window.vizState.leftNum = parseInt(e.target.value);
      if (id === 's-left-den') window.vizState.leftDen = parseInt(e.target.value);
      if (id === 's-mid-top') window.vizState.midTop = parseInt(e.target.value);
      if (id === 's-mid-bot') window.vizState.midBot = parseInt(e.target.value);
      window.vizState.verify = 0;
      window.vizState.opacity = 100;
      if (window.vizEl.sVerify) window.vizEl.sVerify.value = 0;
      if (window.vizEl.sOpacity) window.vizEl.sOpacity.value = 100;
      if (window.vizEl.vOpacity) window.vizEl.vOpacity.textContent = '100%';
      window.vizUpdate();
    });
  });

  if (window.vizEl.sVerify) {
    window.vizEl.sVerify.addEventListener('input', (e) => {
      window.vizState.verify = parseInt(e.target.value);
      window.vizUpdateVerify();
    });
  }
  
  if (window.vizEl.sOpacity) {
    window.vizEl.sOpacity.addEventListener('input', (e) => {
      window.vizState.opacity = parseInt(e.target.value);
      if (window.vizEl.vOpacity) {
        window.vizEl.vOpacity.textContent = window.vizState.opacity + '%';
      }
      if (window.vizState.verify > 0) {
        window.vizUpdateVerify();
      } else {
        window.vizUpdateOpacity();
      }
    });
  }

  window.addEventListener('resize', () => {
    if (window.vizState.verify > 0) window.vizUpdateVerify();
  });

  window.vizUpdate();
}

// Visualizer HTML template
const visualizerHTML = `
<style>
  .viz-wrapper * { box-sizing: border-box; margin: 0; padding: 0; }
  
  .viz-wrapper {
    --purple: #0055ff;
    --green: #00a550;
    --blue-fill: rgba(0, 85, 255, 0.15);
    --blue-stroke: #0055ff;
    --green-fill: rgba(0, 165, 80, 0.15);
    --green-stroke: #00a550;
    --ink: #1a1a1a;
    --yellow: #ffe500;
    --off: #ede7dd;
    --muted: #777;
    font-family: 'JetBrains Mono', monospace;
    display: flex;
    flex-direction: row;
    height: 100%;
    min-height: 100%;
    background: #ffffff;
  }

  .viz-wrapper .sidebar {
    width: 180px;
    padding: 20px 15px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    background: var(--off);
    border-right: 2px solid var(--ink);
    flex-shrink: 0;
  }

  .viz-wrapper .checkbox-item {
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    font-family: 'Unbounded', sans-serif;
    font-size: 0.8rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--ink);
    user-select: none;
    padding: 8px 10px;
    transition: all 0.15s;
  }

  .viz-wrapper .checkbox-item:hover {
    background: rgba(0,0,0,0.05);
  }

  .viz-wrapper .checkbox {
    width: 20px;
    height: 20px;
    border: 2.5px solid var(--ink);
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.2s;
    flex-shrink: 0;
  }

  .viz-wrapper .checkbox-item.active .checkbox {
    background-color: var(--yellow);
  }

  .viz-wrapper .checkbox-item.active .checkbox::after {
    content: "✓";
    color: var(--ink);
    font-size: 14px;
    font-weight: 900;
  }

  .viz-wrapper .main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 15px 20px;
    overflow-y: auto;
    min-width: 0;
  }

  .viz-wrapper .math-grid {
    display: grid;
    grid-template-columns: minmax(90px, 130px) 50px minmax(130px, 190px) 50px;
    align-items: center;
    justify-content: center;
    row-gap: 8px;
    margin: 10px 0;
    font-size: clamp(24px, 6vw, 36px);
    font-weight: 700;
  }

  .viz-wrapper .cell {
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Cambria Math', 'JetBrains Mono', monospace;
    font-style: italic;
  }

  .viz-wrapper .left-ctrl { 
    justify-content: flex-end; 
    padding-right: 15px; 
  }

  .viz-wrapper .mid-ctrl { 
    justify-content: flex-start; 
    gap: 12px; 
    font-size: clamp(20px, 5vw, 28px); 
  }

  .viz-wrapper .fraction-line hr {
    border: none;
    height: 3px;
    background-color: var(--ink);
    margin: 0;
    width: 100%;
  }

  .viz-wrapper .left-line hr { background-color: var(--blue-stroke); }
  .viz-wrapper .right-line hr { background-color: var(--green-stroke); }

  .viz-wrapper .text-purple { color: var(--blue-stroke) !important; }
  .viz-wrapper .text-green { color: var(--green-stroke) !important; }

  .viz-wrapper input[type=range] {
    -webkit-appearance: none;
    width: 100%;
    max-width: 110px;
    background: transparent;
    margin: 0;
  }

  .viz-wrapper input[type=range]::-webkit-slider-runnable-track {
    width: 100%;
    height: 4px;
    background: transparent;
    border-radius: 0;
  }

  .viz-wrapper input[type=range]::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 18px;
    width: 18px;
    border: 3px solid var(--ink);
    background: var(--yellow);
    margin-top: -7px;
    cursor: pointer;
    box-shadow: 2px 2px 0 var(--ink);
    transition: transform 0.15s ease, box-shadow 0.15s ease;
    border-radius: 0;
  }

  .viz-wrapper input[type=range]::-webkit-slider-thumb:hover {
    transform: scale(1.1);
    box-shadow: 3px 3px 0 var(--ink);
  }

  .viz-wrapper input[type=range]::-webkit-slider-thumb:active {
    transform: scale(0.95);
    box-shadow: 1px 1px 0 var(--ink);
  }

  .viz-wrapper input[type=range]::-moz-range-track {
    width: 100%;
    height: 4px;
    background: transparent;
    border-radius: 0;
  }

  .viz-wrapper input[type=range]::-moz-range-thumb {
    height: 18px;
    width: 18px;
    border: 3px solid var(--ink);
    background: var(--yellow);
    cursor: pointer;
    box-shadow: 2px 2px 0 var(--ink);
    border-radius: 0;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
  }

  .viz-wrapper input[type=range]::-moz-range-thumb:hover {
    transform: scale(1.1);
    box-shadow: 3px 3px 0 var(--ink);
  }

  .viz-wrapper input[type=range]::-moz-range-thumb:active {
    transform: scale(0.95);
    box-shadow: 1px 1px 0 var(--ink);
  }

  .viz-wrapper .slider-purple::-webkit-slider-runnable-track,
  .viz-wrapper .slider-green::-webkit-slider-runnable-track,
  .viz-wrapper #verify-slider::-webkit-slider-runnable-track,
  .viz-wrapper #opacity-slider::-webkit-slider-runnable-track {
    background: transparent;
  }

  .viz-wrapper .slider-purple::-moz-range-track,
  .viz-wrapper .slider-green::-moz-range-track,
  .viz-wrapper #verify-slider::-moz-range-track,
  .viz-wrapper #opacity-slider::-moz-range-track {
    background: transparent;
  }

  .viz-wrapper input[type=range]:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .viz-wrapper input[type=range]:disabled::-webkit-slider-thumb {
    box-shadow: 1px 1px 0 var(--ink);
    transform: none;
  }

  .viz-wrapper input[type=range]:disabled::-moz-range-thumb {
    box-shadow: 1px 1px 0 var(--ink);
    transform: none;
  }

  .viz-wrapper .vis-area {
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex: 1;
    margin-top: 15px;
    min-height: 200px;
    gap: 10px;
    flex-wrap: wrap;
  }

  .viz-wrapper .vis-container {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
    justify-content: center;
    position: relative;
  }

  .viz-wrapper .wholes-container {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
    max-width: 120px;
    justify-content: center;
  }

  .viz-wrapper .whole-circle {
    width: 45px;
    height: 45px;
    border: 2.5px solid var(--ink);
    border-radius: 50%;
  }

  .viz-wrapper .whole-blue {
    background-color: var(--blue-fill);
    border-color: var(--blue-stroke);
  }

  .viz-wrapper .whole-green {
    background-color: var(--green-fill);
    border-color: var(--green-stroke);
  }

  .viz-wrapper .pie-wrapper {
    position: relative;
    width: clamp(140px, 30vw, 200px);
    height: clamp(140px, 30vw, 200px);
  }

  .viz-wrapper .pie-wrapper svg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transition: transform 0.35s cubic-bezier(0.2, 0.9, 0.4, 1);
    will-change: transform;
  }

  .viz-wrapper #blue-pie-svg {
    z-index: 1;
  }

  .viz-wrapper #green-pie-svg {
    z-index: 1;
  }

  .viz-wrapper #green-pie-svg path,
  .viz-wrapper #green-pie-svg line,
  .viz-wrapper #green-pie-svg circle {
    opacity: 1 !important;
    visibility: visible !important;
  }

  .viz-wrapper .verify-section {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    margin: 15px 0 10px;
    padding-top: 15px;
    border-top: 2px solid var(--ink);
    font-family: 'Unbounded', sans-serif;
    font-size: 14px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    flex-wrap: wrap;
  }

  .viz-wrapper .verify-item {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .viz-wrapper #verify-slider,
  .viz-wrapper #opacity-slider { 
    width: 150px;
  }

  .viz-wrapper #val-opacity {
    min-width: 45px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
  }

  @media (max-width: 700px) {
    .viz-wrapper {
      flex-direction: column;
    }
    
    .viz-wrapper .sidebar {
      width: 100%;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: center;
      padding: 12px 10px;
      gap: 8px;
      border-right: none;
      border-bottom: 2px solid var(--ink);
    }
    
    .viz-wrapper .checkbox-item {
      font-size: 0.7rem;
      padding: 6px 8px;
      gap: 8px;
    }
    
    .viz-wrapper .checkbox {
      width: 18px;
      height: 18px;
    }
    
    .viz-wrapper .main-content {
      padding: 12px;
    }
    
    .viz-wrapper .math-grid {
      grid-template-columns: 75px 35px 110px 35px;
      font-size: 20px;
      margin: 5px 0;
    }
    
    .viz-wrapper .left-ctrl {
      padding-right: 10px;
    }
    
    .viz-wrapper .mid-ctrl {
      font-size: 18px;
      gap: 8px;
    }
    
    .viz-wrapper input[type=range] {
      max-width: 75px;
    }
    
    .viz-wrapper .vis-area {
      flex-direction: column;
      gap: 20px;
    }
    
    .viz-wrapper .whole-circle {
      width: 35px;
      height: 35px;
    }
    
    .viz-wrapper .verify-section {
      gap: 15px;
    }
    
    .viz-wrapper #verify-slider,
    .viz-wrapper #opacity-slider {
      width: 120px;
    }
  }

  @media (max-width: 480px) {
    .viz-wrapper .sidebar {
      padding: 8px 5px;
    }
    
    .viz-wrapper .checkbox-item {
      font-size: 0.6rem;
      padding: 5px;
    }
    
    .viz-wrapper .math-grid {
      grid-template-columns: 60px 30px 90px 30px;
      font-size: 18px;
    }
    
    .viz-wrapper .left-ctrl {
      padding-right: 8px;
    }
    
    .viz-wrapper .mid-ctrl {
      font-size: 14px;
      gap: 5px;
    }
    
    .viz-wrapper input[type=range] {
      max-width: 60px;
    }
    
    .viz-wrapper .verify-section {
      font-size: 12px;
      gap: 10px;
    }
    
    .viz-wrapper .verify-item {
      gap: 5px;
    }
    
    .viz-wrapper #verify-slider,
    .viz-wrapper #opacity-slider {
      width: 100px;
    }
    
    .viz-wrapper .pie-wrapper {
      width: 130px;
      height: 130px;
    }
  }

  @media (hover: none) and (pointer: coarse) {
    .viz-wrapper input[type=range]::-webkit-slider-thumb {
      height: 24px;
      width: 24px;
      margin-top: -10px;
    }
    
    .viz-wrapper input[type=range]::-moz-range-thumb {
      height: 24px;
      width: 24px;
    }
    
    .viz-wrapper .checkbox-item {
      padding: 8px 12px;
    }
  }

  @media (max-width: 900px) and (orientation: landscape) {
    .viz-wrapper {
      flex-direction: row;
    }
    
    .viz-wrapper .sidebar {
      width: 150px;
      flex-direction: column;
      border-right: 2px solid var(--ink);
      border-bottom: none;
    }
    
    .viz-wrapper .vis-area {
      flex-direction: row;
    }
  }

  .viz-wrapper input[type=range]:focus-visible {
    outline: 3px solid var(--blue-stroke);
    outline-offset: 3px;
  }

  .viz-wrapper .checkbox-item:focus-visible {
    outline: 3px solid var(--blue-stroke);
    outline-offset: 2px;
  }

  .viz-wrapper .checkbox-item,
  .viz-wrapper button,
  .viz-wrapper input[type=range] {
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
    user-select: none;
  }
</style>

<div class="viz-wrapper">
  <div class="sidebar">
    <div class="checkbox-item active" id="mode-multiply" onclick="vizSetMode('multiply')">
      <div class="checkbox"></div>
      <span>Multiply</span>
    </div>
    <div class="checkbox-item" id="mode-divide" onclick="vizSetMode('divide')">
      <div class="checkbox"></div>
      <span>Divide</span>
    </div>
    <div class="checkbox-item" id="mode-add" onclick="vizSetMode('add')">
      <div class="checkbox"></div>
      <span>Add</span>
    </div>
    <div class="checkbox-item" id="mode-subtract" onclick="vizSetMode('subtract')">
      <div class="checkbox"></div>
      <span>Subtract</span>
    </div>
  </div>

  <div class="main-content">
    <div class="math-grid">
      <div class="cell left-ctrl">
        <input type="range" class="slider-purple" id="s-left-num" min="1" max="50" value="2">
      </div>
      <div class="cell text-purple" id="val-left-num">2</div>
      <div class="cell mid-ctrl text-green">
        <input type="range" class="slider-green" id="s-mid-top" min="1" max="10" value="1">
        <span id="val-mid-top">×1</span>
      </div>
      <div class="cell text-green" id="val-right-num">2</div>
      <div class="cell"></div>
      <div class="cell fraction-line left-line text-purple"><hr></div>
      <div class="cell sign text-green" id="val-sign">=</div>
      <div class="cell fraction-line right-line text-green"><hr></div>
      <div class="cell left-ctrl">
        <input type="range" class="slider-purple" id="s-left-den" min="1" max="20" value="5">
      </div>
      <div class="cell text-purple" id="val-left-den">5</div>
      <div class="cell mid-ctrl text-green">
        <input type="range" class="slider-green" id="s-mid-bot" min="1" max="10" value="1">
        <span id="val-mid-bot">×1</span>
      </div>
      <div class="cell text-green" id="val-right-den">5</div>
    </div>

    <div class="vis-area">
      <div class="vis-container" id="left-vis"></div>
      <div class="vis-container" id="right-vis"></div>
    </div>

    <div class="verify-section">
      <div class="verify-item">
        <span>Verify</span>
        <input type="range" id="verify-slider" min="0" max="100" value="0">
      </div>
      <div class="verify-item">
        <span>Opacity</span>
        <input type="range" id="opacity-slider" min="0" max="100" value="100">
        <span id="val-opacity">100%</span>
      </div>
    </div>
  </div>
</div>
`;

// Modal functions
function openModal() {
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  
  const sessionsEl = document.getElementById('stat-sessions');
  if (sessionsEl) {
    sessionsEl.textContent = parseInt(sessionsEl.textContent || 0) + 1;
  }
  
  if (!modalBody.querySelector('.viz-wrapper')) {
    modalBody.innerHTML = visualizerHTML;
    setTimeout(initVisualizer, 20);
  }
}

function closeModal() {
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.classList.contains('active')) {
    closeModal();
  }
});

// Ticker setup
(function initTicker() {
  const track = document.getElementById('ticker-track');
  if (track) {
    const items = ['FRACTION MULTIPLICATION', 'FRACTION DIVISION', 'FRACTION ADDITION', 'FRACTION SUBTRACTION', 'VISUAL LEARNING', 'INTERACTIVE PIE CHARTS'];
    const html = items.map(item => `<span class="ticker-item">${item}</span>`).join('');
    track.innerHTML = html + html;
  }
  
  window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if (loader) {
      loader.classList.add('fade-out');
      setTimeout(() => loader.style.display = 'none', 300);
    }
  });
})();