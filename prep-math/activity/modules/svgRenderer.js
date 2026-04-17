// svgRenderer.js - SVG rendering with animated sector movement (FIXED)
import { leastCommonMultiple, toLowestTerms, formatTimeDisplay } from './utils.js';
import { DIFFERENT_PARTS_COLORS } from './config.js';

export function createFractionSVG(type, q, mode, settings, colorSet, sliderValue = null) {
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  
  const isOperation = ['add', 'subtract'].includes(mode);
  const useSlider = isOperation && sliderValue !== null;
  
  if (type === 'fraction-circle') {
    if (useSlider) {
      return createAnimatedCircleSVG(svg, q, mode, settings, colorSet, sliderValue);
    }
    if (isOperation && q) {
      return createOperationCircleSVG(svg, q, mode, settings, colorSet);
    }
    if (mode === 'compare' && q) {
      return createCompareCircleSVG(svg, q, settings, colorSet);
    }
    if (mode === 'random-total' && q) {
      return createRandomTotalCircleSVG(svg, q, settings, colorSet);
    }
    if (mode === 'different-parts' && q) {
      return createDifferentPartsCircleSVG(svg, q, settings, colorSet);
    }
    return createSingleCircleSVG(svg, q, mode, settings, colorSet);
  } else {
    if (useSlider) {
      return createAnimatedBarSVG(svg, q, mode, settings, colorSet, sliderValue);
    }
    if (isOperation && q) {
      return createOperationBarSVG(svg, q, mode, settings, colorSet);
    }
    if (mode === 'compare' && q) {
      return createCompareBarSVG(svg, q, settings, colorSet);
    }
    if (mode === 'random-total' && q) {
      return createRandomTotalBarSVG(svg, q, settings, colorSet);
    }
    if (mode === 'different-parts' && q) {
      return createDifferentPartsBarSVG(svg, q, settings, colorSet);
    }
    return createSingleBarSVG(svg, q, mode, settings, colorSet);
  }
}

function createAnimatedCircleSVG(svg, q, mode, settings, colorSet, sliderValue) {
  const svgNS = "http://www.w3.org/2000/svg";
  const INK = colorSet.ink;
  const SHADED = colorSet.shadedColor;
  const MOVING = colorSet.movingColor || '#ff9800';
  const UNSHADED = settings.hideUnshaded ? 'transparent' : colorSet.unshaded;
  
  svg.setAttribute("viewBox", "0 0 900 600");
  
  const leftCx = 220, rightCx = 680, cy = 300, r = 160;
  const lcm = leastCommonMultiple(q.leftDenom, q.rightDenom);
  const leftMultiplier = lcm / q.leftDenom;
  const rightMultiplier = lcm / q.rightDenom;
  
  const leftTotalShaded = q.leftActive * leftMultiplier;
  const rightTotalShaded = q.rightActive * rightMultiplier;
  
  let leftShadedCount, rightShadedCount;
  
  if (mode === 'add') {
    const transferred = Math.floor(sliderValue * leftTotalShaded);
    leftShadedCount = leftTotalShaded - transferred;
    rightShadedCount = rightTotalShaded + transferred;
  } else {
    const removed = Math.floor(sliderValue * rightTotalShaded);
    leftShadedCount = leftTotalShaded;
    rightShadedCount = Math.max(0, rightTotalShaded - removed);
  }
  
  // Draw both circles with correct shading
  drawCircleWithMovingSectors(svg, leftCx, cy, r, leftTotalShaded, lcm, INK, SHADED, MOVING, UNSHADED, mode, 'left', sliderValue);
  drawCircleWithMovingSectors(svg, rightCx, cy, r, rightTotalShaded, lcm, INK, SHADED, MOVING, UNSHADED, mode, 'right', sliderValue);
  
  // Draw flying sectors on top
  drawFlyingSectors(svg, leftCx, rightCx, cy, r, leftTotalShaded, rightTotalShaded, lcm, sliderValue, MOVING, INK, mode, q);
  
  if (settings.showLabels) {
    addLabel(svg, leftCx, cy - 130, `${leftShadedCount}/${lcm}`, INK);
    addLabel(svg, rightCx, cy - 130, `${rightShadedCount}/${lcm}`, INK);
  }
  
  // Add arrow indicator
  const arrow = document.createElementNS(svgNS, "text");
  arrow.setAttribute("x", "450");
  arrow.setAttribute("y", "300");
  arrow.setAttribute("text-anchor", "middle");
  arrow.setAttribute("font-size", "40");
  arrow.setAttribute("fill", INK);
  arrow.textContent = mode === 'add' ? '→' : '←';
  svg.appendChild(arrow);
  
  return svg;
}

function drawCircleWithMovingSectors(svg, cx, cy, r, totalShaded, denominator, INK, SHADED, MOVING, UNSHADED, mode, side, sliderValue) {
  const svgNS = "http://www.w3.org/2000/svg";
  const sectorAngle = 360 / denominator;
  
  const transferred = Math.floor(sliderValue * (side === 'left' && mode === 'add' ? totalShaded : (side === 'right' && mode === 'subtract' ? totalShaded : 0)));
  
  for (let i = 0; i < denominator; i++) {
    const start = (i * sectorAngle - 90) * Math.PI / 180;
    const end = ((i + 1) * sectorAngle - 90) * Math.PI / 180;
    
    let isShaded = i < totalShaded;
    let isMoving = false;
    
    if (mode === 'add' && side === 'left') {
      isMoving = i >= totalShaded - transferred && i < totalShaded;
      isShaded = i < totalShaded && !isMoving;
    } else if (mode === 'subtract' && side === 'right') {
      isMoving = i >= totalShaded - transferred && i < totalShaded;
      isShaded = i < totalShaded && !isMoving;
    }
    
    const x1 = cx + r * Math.cos(start);
    const y1 = cy + r * Math.sin(start);
    const x2 = cx + r * Math.cos(end);
    const y2 = cy + r * Math.sin(end);
    
    const largeArc = sectorAngle > 180 ? 1 : 0;
    const pathData = `M ${cx},${cy} L ${x1.toFixed(1)},${y1.toFixed(1)} A ${r},${r} 0 ${largeArc},1 ${x2.toFixed(1)},${y2.toFixed(1)} Z`;
    
    const path = document.createElementNS(svgNS, "path");
    path.setAttribute("d", pathData);
    
    if (isMoving) {
      path.setAttribute("fill", "transparent");
      path.setAttribute("stroke", INK);
      path.setAttribute("stroke-width", "3");
      path.setAttribute("stroke-dasharray", "6,4");
    } else if (isShaded) {
      path.setAttribute("fill", SHADED);
      path.setAttribute("stroke", INK);
      path.setAttribute("stroke-width", "3");
    } else {
      path.setAttribute("fill", UNSHADED);
      if (!settings.hideLines || UNSHADED !== 'transparent') {
        path.setAttribute("stroke", INK);
        path.setAttribute("stroke-width", "3");
      }
    }
    
    path.setAttribute("stroke-linejoin", "round");
    svg.appendChild(path);
  }
}

function drawFlyingSectors(svg, leftCx, rightCx, cy, r, leftTotal, rightTotal, denominator, progress, color, INK, mode, q) {
  if (progress === 0) return;
  
  const svgNS = "http://www.w3.org/2000/svg";
  const sectorAngle = 360 / denominator;
  
  let count, startIndex, startX, endX;
  
  if (mode === 'add') {
    count = Math.floor(progress * leftTotal);
    startIndex = leftTotal - count;
    startX = leftCx;
    endX = rightCx;
  } else {
    count = Math.floor(progress * rightTotal);
    startIndex = rightTotal - count;
    startX = rightCx;
    endX = leftCx;
  }
  
  for (let i = 0; i < count; i++) {
    const sectorIndex = startIndex + i;
    const startAngle = (sectorIndex * sectorAngle - 90) * Math.PI / 180;
    const endAngle = ((sectorIndex + 1) * sectorAngle - 90) * Math.PI / 180;
    const midAngle = (startAngle + endAngle) / 2;
    
    const offsetX = (endX - startX) * progress;
    const offsetY = -40 * Math.sin(progress * Math.PI);
    
    const currentX = startX + offsetX;
    const currentY = cy + offsetY;
    const currentR = r * (1 - progress * 0.2);
    
    const x1 = currentX + currentR * Math.cos(startAngle);
    const y1 = currentY + currentR * Math.sin(startAngle);
    const x2 = currentX + currentR * Math.cos(endAngle);
    const y2 = currentY + currentR * Math.sin(endAngle);
    
    const largeArc = sectorAngle > 180 ? 1 : 0;
    const pathData = `M ${currentX},${currentY} L ${x1.toFixed(1)},${y1.toFixed(1)} A ${currentR},${currentR} 0 ${largeArc},1 ${x2.toFixed(1)},${y2.toFixed(1)} Z`;
    
    const path = document.createElementNS(svgNS, "path");
    path.setAttribute("d", pathData);
    path.setAttribute("fill", color);
    path.setAttribute("opacity", "0.85");
    path.setAttribute("stroke", INK);
    path.setAttribute("stroke-width", "2.5");
    path.setAttribute("stroke-linejoin", "round");
    
    svg.appendChild(path);
  }
}

function createAnimatedBarSVG(svg, q, mode, settings, colorSet, sliderValue) {
  const svgNS = "http://www.w3.org/2000/svg";
  const INK = colorSet.ink;
  const SHADED = colorSet.shadedColor;
  const MOVING = colorSet.movingColor || '#ff9800';
  const UNSHADED = settings.hideUnshaded ? 'transparent' : colorSet.unshaded;
  
  svg.setAttribute("viewBox", "0 0 900 500");
  const totalW = 680, h = 100, x = 110;
  const leftY = 120, rightY = 280;
  
  const lcm = leastCommonMultiple(q.leftDenom, q.rightDenom);
  const leftMultiplier = lcm / q.leftDenom;
  const rightMultiplier = lcm / q.rightDenom;
  
  const leftTotalShaded = q.leftActive * leftMultiplier;
  const rightTotalShaded = q.rightActive * rightMultiplier;
  
  let leftShadedCount, rightShadedCount;
  
  if (mode === 'add') {
    const transferred = Math.floor(sliderValue * leftTotalShaded);
    leftShadedCount = leftTotalShaded - transferred;
    rightShadedCount = rightTotalShaded + transferred;
  } else {
    const removed = Math.floor(sliderValue * rightTotalShaded);
    leftShadedCount = leftTotalShaded;
    rightShadedCount = Math.max(0, rightTotalShaded - removed);
  }
  
  drawBarWithMovingSectors(svg, x, leftY, totalW, h, leftTotalShaded, lcm, INK, SHADED, MOVING, UNSHADED, mode, 'left', sliderValue);
  drawBarWithMovingSectors(svg, x, rightY, totalW, h, rightTotalShaded, lcm, INK, SHADED, MOVING, UNSHADED, mode, 'right', sliderValue);
  
  drawFlyingBars(svg, x, totalW, leftY, rightY, h, leftTotalShaded, rightTotalShaded, lcm, sliderValue, MOVING, INK, mode);
  
  if (settings.showLabels) {
    addLabel(svg, 450, leftY - 20, `${leftShadedCount}/${lcm}`, INK);
    addLabel(svg, 450, rightY - 20, `${rightShadedCount}/${lcm}`, INK);
  }
  
  const arrow = document.createElementNS(svgNS, "text");
  arrow.setAttribute("x", "450");
  arrow.setAttribute("y", "230");
  arrow.setAttribute("text-anchor", "middle");
  arrow.setAttribute("font-size", "36");
  arrow.setAttribute("fill", INK);
  arrow.textContent = mode === 'add' ? '↓' : '↑';
  svg.appendChild(arrow);
  
  return svg;
}

function drawBarWithMovingSectors(svg, x, y, totalW, h, totalShaded, denominator, INK, SHADED, MOVING, UNSHADED, mode, side, sliderValue) {
  const svgNS = "http://www.w3.org/2000/svg";
  const partW = totalW / denominator;
  
  const transferred = Math.floor(sliderValue * (side === 'left' && mode === 'add' ? totalShaded : (side === 'right' && mode === 'subtract' ? totalShaded : 0)));
  
  for (let i = 0; i < denominator; i++) {
    let isShaded = i < totalShaded;
    let isMoving = false;
    
    if (mode === 'add' && side === 'left') {
      isMoving = i >= totalShaded - transferred && i < totalShaded;
      isShaded = i < totalShaded && !isMoving;
    } else if (mode === 'subtract' && side === 'right') {
      isMoving = i >= totalShaded - transferred && i < totalShaded;
      isShaded = i < totalShaded && !isMoving;
    }
    
    const rect = document.createElementNS(svgNS, "rect");
    rect.setAttribute("x", (x + i * partW).toFixed(1));
    rect.setAttribute("y", y);
    rect.setAttribute("width", partW.toFixed(1));
    rect.setAttribute("height", h);
    
    if (isMoving) {
      rect.setAttribute("fill", "transparent");
      rect.setAttribute("stroke", INK);
      rect.setAttribute("stroke-width", "3");
      rect.setAttribute("stroke-dasharray", "6,4");
    } else if (isShaded) {
      rect.setAttribute("fill", SHADED);
      rect.setAttribute("stroke", INK);
      rect.setAttribute("stroke-width", "3");
    } else {
      rect.setAttribute("fill", UNSHADED);
      if (!settings.hideLines || UNSHADED !== 'transparent') {
        rect.setAttribute("stroke", INK);
        rect.setAttribute("stroke-width", "3");
      }
    }
    
    svg.appendChild(rect);
  }
}

function drawFlyingBars(svg, x, totalW, leftY, rightY, h, leftTotal, rightTotal, denominator, progress, color, INK, mode) {
  if (progress === 0) return;
  
  const svgNS = "http://www.w3.org/2000/svg";
  const partW = totalW / denominator;
  
  let count, startIndex, startY, endY;
  
  if (mode === 'add') {
    count = Math.floor(progress * leftTotal);
    startIndex = leftTotal - count;
    startY = leftY;
    endY = rightY;
  } else {
    count = Math.floor(progress * rightTotal);
    startIndex = rightTotal - count;
    startY = rightY;
    endY = leftY;
  }
  
  for (let i = 0; i < count; i++) {
    const sectorIndex = startIndex + i;
    const offsetY = (endY - startY) * progress;
    const offsetX = 25 * Math.sin(progress * Math.PI * 2 + i);
    const currentY = startY + offsetY;
    const currentX = x + sectorIndex * partW + offsetX;
    
    const rect = document.createElementNS(svgNS, "rect");
    rect.setAttribute("x", currentX.toFixed(1));
    rect.setAttribute("y", currentY);
    rect.setAttribute("width", (partW * 0.9).toFixed(1));
    rect.setAttribute("height", h);
    rect.setAttribute("fill", color);
    rect.setAttribute("opacity", "0.85");
    rect.setAttribute("stroke", INK);
    rect.setAttribute("stroke-width", "2.5");
    
    svg.appendChild(rect);
  }
}

function createOperationCircleSVG(svg, q, mode, settings, colorSet) {
  const svgNS = "http://www.w3.org/2000/svg";
  const INK = colorSet.ink;
  const SHADED = colorSet.shadedColor;
  const UNSHADED = settings.hideUnshaded ? 'transparent' : colorSet.unshaded;
  
  svg.setAttribute("viewBox", "0 0 900 500");
  const leftCx = 220, rightCx = 680, cy = 250, r = 160;
  
  drawCircle(svg, leftCx, cy, r, q.leftActive, q.leftDenom, INK, SHADED, UNSHADED);
  drawCircle(svg, rightCx, cy, r, q.rightActive, q.rightDenom, INK, SHADED, UNSHADED);
  
  if (settings.showLabels) {
    addLabel(svg, leftCx, cy - 120, `${q.leftActive}/${q.leftDenom}`, INK);
    addLabel(svg, rightCx, cy - 120, `${q.rightActive}/${q.rightDenom}`, INK);
  }
  
  const opSymbol = { add: '+', subtract: '−', multiply: '×', divide: '÷' }[mode];
  const opText = document.createElementNS(svgNS, "text");
  opText.setAttribute("x", "450");
  opText.setAttribute("y", "250");
  opText.setAttribute("text-anchor", "middle");
  opText.setAttribute("font-size", "48");
  opText.setAttribute("font-weight", "900");
  opText.setAttribute("fill", INK);
  opText.textContent = opSymbol;
  svg.appendChild(opText);
  
  return svg;
}

function createOperationBarSVG(svg, q, mode, settings, colorSet) {
  const svgNS = "http://www.w3.org/2000/svg";
  const INK = colorSet.ink;
  const SHADED = colorSet.shadedColor;
  const UNSHADED = settings.hideUnshaded ? 'transparent' : colorSet.unshaded;
  
  svg.setAttribute("viewBox", "0 0 900 500");
  const totalW = 680, h = 120, x = 110;
  const leftY = 100, rightY = 280;
  
  drawBar(svg, x, leftY, totalW, h, q.leftActive, q.leftDenom, INK, SHADED, UNSHADED);
  drawBar(svg, x, rightY, totalW, h, q.rightActive, q.rightDenom, INK, SHADED, UNSHADED);
  
  if (settings.showLabels) {
    addLabel(svg, 450, leftY - 20, `${q.leftActive}/${q.leftDenom}`, INK);
    addLabel(svg, 450, rightY - 20, `${q.rightActive}/${q.rightDenom}`, INK);
  }
  
  const opSymbol = { add: '+', subtract: '−', multiply: '×', divide: '÷' }[mode];
  const opText = document.createElementNS(svgNS, "text");
  opText.setAttribute("x", "450");
  opText.setAttribute("y", "230");
  opText.setAttribute("text-anchor", "middle");
  opText.setAttribute("font-size", "40");
  opText.setAttribute("font-weight", "900");
  opText.setAttribute("fill", INK);
  opText.textContent = opSymbol;
  svg.appendChild(opText);
  
  return svg;
}

function createCompareCircleSVG(svg, q, settings, colorSet) {
  const svgNS = "http://www.w3.org/2000/svg";
  const INK = colorSet.ink;
  const SHADED = colorSet.shadedColor;
  const UNSHADED = settings.hideUnshaded ? 'transparent' : colorSet.unshaded;
  
  svg.setAttribute("viewBox", "0 0 900 500");
  const leftCx = 220, rightCx = 680, cy = 250, r = 160;
  
  let leftActive = q.leftActive, leftDenom = q.leftDenom;
  let rightActive = q.rightActive, rightDenom = q.rightDenom;
  
  if (settings.sameSplitCompare && leftDenom !== rightDenom) {
    const lcm = leastCommonMultiple(leftDenom, rightDenom);
    leftActive = q.leftActive * (lcm / leftDenom);
    leftDenom = lcm;
    rightActive = q.rightActive * (lcm / rightDenom);
    rightDenom = lcm;
  }
  
  drawCircle(svg, leftCx, cy, r, leftActive, leftDenom, INK, SHADED, UNSHADED);
  drawCircle(svg, rightCx, cy, r, rightActive, rightDenom, INK, SHADED, UNSHADED);
  
  if (settings.showLabels) {
    addLabel(svg, leftCx, cy, `${leftActive}/${leftDenom}`, INK, true);
    addLabel(svg, rightCx, cy, `${rightActive}/${rightDenom}`, INK, true);
  }
  
  const vsText = document.createElementNS(svgNS, "text");
  vsText.setAttribute("x", "450");
  vsText.setAttribute("y", "250");
  vsText.setAttribute("text-anchor", "middle");
  vsText.setAttribute("font-size", "36");
  vsText.setAttribute("font-weight", "900");
  vsText.setAttribute("fill", INK);
  vsText.textContent = "?";
  svg.appendChild(vsText);
  
  return svg;
}

function createCompareBarSVG(svg, q, settings, colorSet) {
  const svgNS = "http://www.w3.org/2000/svg";
  const INK = colorSet.ink;
  const SHADED = colorSet.shadedColor;
  const UNSHADED = settings.hideUnshaded ? 'transparent' : colorSet.unshaded;
  
  svg.setAttribute("viewBox", "0 0 900 500");
  const totalW = 680, h = 120, x = 110;
  const leftY = 100, rightY = 280;
  
  let leftActive = q.leftActive, leftDenom = q.leftDenom;
  let rightActive = q.rightActive, rightDenom = q.rightDenom;
  
  if (settings.sameSplitCompare && leftDenom !== rightDenom) {
    const lcm = leastCommonMultiple(leftDenom, rightDenom);
    leftActive = q.leftActive * (lcm / leftDenom);
    leftDenom = lcm;
    rightActive = q.rightActive * (lcm / rightDenom);
    rightDenom = lcm;
  }
  
  drawBar(svg, x, leftY, totalW, h, leftActive, leftDenom, INK, SHADED, UNSHADED);
  drawBar(svg, x, rightY, totalW, h, rightActive, rightDenom, INK, SHADED, UNSHADED);
  
  if (settings.showLabels) {
    addLabel(svg, 450, leftY - 20, `${leftActive}/${leftDenom}`, INK);
    addLabel(svg, 450, rightY - 20, `${rightActive}/${rightDenom}`, INK);
  }
  
  const vsText = document.createElementNS(svgNS, "text");
  vsText.setAttribute("x", "450");
  vsText.setAttribute("y", "230");
  vsText.setAttribute("text-anchor", "middle");
  vsText.setAttribute("font-size", "32");
  vsText.setAttribute("font-weight", "900");
  vsText.setAttribute("fill", INK);
  vsText.textContent = "?";
  svg.appendChild(vsText);
  
  return svg;
}

function createRandomTotalCircleSVG(svg, q, settings, colorSet) {
  const svgNS = "http://www.w3.org/2000/svg";
  const INK = colorSet.ink;
  const SHADED = colorSet.shadedColor;
  const UNSHADED = settings.hideUnshaded ? 'transparent' : colorSet.unshaded;
  
  svg.setAttribute("viewBox", "0 0 800 800");
  const cx = 400, cy = 400, r = 280;
  
  drawCircle(svg, cx, cy, r, q.shaded, q.totalParts, INK, SHADED, UNSHADED);
  
  const outline = document.createElementNS(svgNS, "circle");
  outline.setAttribute("cx", cx);
  outline.setAttribute("cy", cy);
  outline.setAttribute("r", r);
  outline.setAttribute("fill", "none");
  outline.setAttribute("stroke", INK);
  outline.setAttribute("stroke-width", "4");
  svg.appendChild(outline);
  
  if (settings.showLabels) {
    addLabel(svg, cx, cy, `Total: ${q.total}`, INK, true);
  }
  
  return svg;
}

function createRandomTotalBarSVG(svg, q, settings, colorSet) {
  const svgNS = "http://www.w3.org/2000/svg";
  const INK = colorSet.ink;
  const SHADED = colorSet.shadedColor;
  const UNSHADED = settings.hideUnshaded ? 'transparent' : colorSet.unshaded;
  
  svg.setAttribute("viewBox", "0 0 800 500");
  const totalW = 680, h = 120, x = 60, y = 190;
  
  drawBar(svg, x, y, totalW, h, q.shaded, q.totalParts, INK, SHADED, UNSHADED);
  
  const frame = document.createElementNS(svgNS, "rect");
  frame.setAttribute("x", x - 10);
  frame.setAttribute("y", y - 10);
  frame.setAttribute("width", totalW + 20);
  frame.setAttribute("height", h + 20);
  frame.setAttribute("fill", "none");
  frame.setAttribute("stroke", INK);
  frame.setAttribute("stroke-width", "4");
  svg.appendChild(frame);
  
  if (settings.showLabels) {
    addLabel(svg, 400, y + h + 45, `Total: ${q.total}`, INK);
  }
  
  return svg;
}

function createDifferentPartsCircleSVG(svg, q, settings, colorSet) {
  const svgNS = "http://www.w3.org/2000/svg";
  const INK = colorSet.ink;
  const UNSHADED = settings.hideUnshaded ? 'transparent' : colorSet.unshaded;
  
  svg.setAttribute("viewBox", "0 0 800 800");
  const cx = 400, cy = 400, r = 280;
  
  const colorMap = buildColorMap(q.sectors);
  drawDifferentPartsCircleVarying(svg, cx, cy, r, q.sectors, colorMap, INK, UNSHADED, settings);
  
  const outline = document.createElementNS(svgNS, "circle");
  outline.setAttribute("cx", cx);
  outline.setAttribute("cy", cy);
  outline.setAttribute("r", r);
  outline.setAttribute("fill", "none");
  outline.setAttribute("stroke", INK);
  outline.setAttribute("stroke-width", "4");
  svg.appendChild(outline);
  
  if (settings.showLabels) {
    addSectorLabels(svg, cx, cy, r, q.sectors, INK);
  }
  
  return svg;
}

function createDifferentPartsBarSVG(svg, q, settings, colorSet) {
  const svgNS = "http://www.w3.org/2000/svg";
  const INK = colorSet.ink;
  const UNSHADED = settings.hideUnshaded ? 'transparent' : colorSet.unshaded;
  
  svg.setAttribute("viewBox", "0 0 800 500");
  const totalW = 680, h = 120, x = 60, y = 190;
  
  const colorMap = buildColorMap(q.sectors);
  drawDifferentPartsBarVarying(svg, x, y, totalW, h, q.sectors, colorMap, INK, UNSHADED, settings);
  
  const frame = document.createElementNS(svgNS, "rect");
  frame.setAttribute("x", x - 10);
  frame.setAttribute("y", y - 10);
  frame.setAttribute("width", totalW + 20);
  frame.setAttribute("height", h + 20);
  frame.setAttribute("fill", "none");
  frame.setAttribute("stroke", INK);
  frame.setAttribute("stroke-width", "4");
  svg.appendChild(frame);
  
  if (settings.showLabels) {
    addBarSegmentLabels(svg, x, y, totalW, h, q.sectors, INK);
  }
  
  return svg;
}

function createSingleCircleSVG(svg, q, mode, settings, colorSet) {
  const svgNS = "http://www.w3.org/2000/svg";
  const INK = colorSet.ink;
  const SHADED = colorSet.shadedColor;
  const UNSHADED = settings.hideUnshaded ? 'transparent' : colorSet.unshaded;
  
  svg.setAttribute("viewBox", "0 0 800 800");
  const cx = 400, cy = 400, r = 280;
  
  drawCircle(svg, cx, cy, r, q.active, q.denominator, INK, SHADED, UNSHADED);
  
  if (mode === 'time' && settings.showTickMarks) {
    drawTickMarks(svg, cx, cy, r, INK);
  }
  
  const outline = document.createElementNS(svgNS, "circle");
  outline.setAttribute("cx", cx);
  outline.setAttribute("cy", cy);
  outline.setAttribute("r", r);
  outline.setAttribute("fill", "none");
  outline.setAttribute("stroke", INK);
  outline.setAttribute("stroke-width", "4");
  svg.appendChild(outline);
  
  if (mode === 'time' && settings.showLabels) {
    const fraction = q.active / q.denominator;
    addLabel(svg, cx, cy, formatTimeDisplay(fraction, q.active, q.denominator), INK, true);
  }
  
  return svg;
}

function createSingleBarSVG(svg, q, mode, settings, colorSet) {
  const svgNS = "http://www.w3.org/2000/svg";
  const INK = colorSet.ink;
  const SHADED = colorSet.shadedColor;
  const UNSHADED = settings.hideUnshaded ? 'transparent' : colorSet.unshaded;
  
  svg.setAttribute("viewBox", "0 0 800 500");
  const totalW = 680, h = 120, x = 60, y = 190;
  
  drawBar(svg, x, y, totalW, h, q.active, q.denominator, INK, SHADED, UNSHADED);
  
  const frame = document.createElementNS(svgNS, "rect");
  frame.setAttribute("x", x - 10);
  frame.setAttribute("y", y - 10);
  frame.setAttribute("width", totalW + 20);
  frame.setAttribute("height", h + 20);
  frame.setAttribute("fill", "none");
  frame.setAttribute("stroke", INK);
  frame.setAttribute("stroke-width", "4");
  svg.appendChild(frame);
  
  if (mode === 'time' && settings.showLabels) {
    const fraction = q.active / q.denominator;
    addLabel(svg, 400, y + h + 45, formatTimeDisplay(fraction, q.active, q.denominator), INK);
  }
  
  return svg;
}

function drawCircle(svg, cx, cy, r, active, denominator, INK, SHADED, UNSHADED) {
  const svgNS = "http://www.w3.org/2000/svg";
  const sectorAngle = 360 / denominator;
  
  for (let i = 0; i < denominator; i++) {
    const start = (i * sectorAngle - 90) * Math.PI / 180;
    const end = ((i + 1) * sectorAngle - 90) * Math.PI / 180;
    const isShaded = i < active;
    
    const x1 = cx + r * Math.cos(start);
    const y1 = cy + r * Math.sin(start);
    const x2 = cx + r * Math.cos(end);
    const y2 = cy + r * Math.sin(end);
    
    const largeArc = sectorAngle > 180 ? 1 : 0;
    const pathData = `M ${cx},${cy} L ${x1.toFixed(1)},${y1.toFixed(1)} A ${r},${r} 0 ${largeArc},1 ${x2.toFixed(1)},${y2.toFixed(1)} Z`;
    
    const path = document.createElementNS(svgNS, "path");
    path.setAttribute("d", pathData);
    path.setAttribute("fill", isShaded ? SHADED : UNSHADED);
    path.setAttribute("stroke", INK);
    path.setAttribute("stroke-width", "3");
    path.setAttribute("stroke-linejoin", "round");
    
    svg.appendChild(path);
  }
}

function drawBar(svg, x, y, totalW, h, active, denominator, INK, SHADED, UNSHADED) {
  const svgNS = "http://www.w3.org/2000/svg";
  const partW = totalW / denominator;
  
  for (let i = 0; i < denominator; i++) {
    const isShaded = i < active;
    const rect = document.createElementNS(svgNS, "rect");
    rect.setAttribute("x", (x + i * partW).toFixed(1));
    rect.setAttribute("y", y);
    rect.setAttribute("width", partW.toFixed(1));
    rect.setAttribute("height", h);
    rect.setAttribute("fill", isShaded ? SHADED : UNSHADED);
    rect.setAttribute("stroke", INK);
    rect.setAttribute("stroke-width", "3");
    svg.appendChild(rect);
  }
}

function drawDifferentPartsCircleVarying(svg, cx, cy, r, sectors, colorMap, INK, UNSHADED, settings) {
  const svgNS = "http://www.w3.org/2000/svg";
  let currentAngle = -90;
  
  sectors.forEach((sector) => {
    const sectorAngle = (sector.size / sector.total) * 360;
    const start = currentAngle * Math.PI / 180;
    const end = (currentAngle + sectorAngle) * Math.PI / 180;
    
    const x1 = cx + r * Math.cos(start);
    const y1 = cy + r * Math.sin(start);
    const x2 = cx + r * Math.cos(end);
    const y2 = cy + r * Math.sin(end);
    
    const largeArc = sectorAngle > 180 ? 1 : 0;
    const pathData = `M ${cx},${cy} L ${x1.toFixed(1)},${y1.toFixed(1)} A ${r},${r} 0 ${largeArc},1 ${x2.toFixed(1)},${y2.toFixed(1)} Z`;
    
    const path = document.createElementNS(svgNS, "path");
    path.setAttribute("d", pathData);
    path.setAttribute("fill", sector.shaded ? colorMap.get(sector) : UNSHADED);
    
    if (!settings.hideLines) {
      path.setAttribute("stroke", INK);
      path.setAttribute("stroke-width", "3");
      path.setAttribute("stroke-linejoin", "round");
    }
    
    svg.appendChild(path);
    currentAngle += sectorAngle;
  });
}

function drawDifferentPartsBarVarying(svg, x, y, totalW, h, sectors, colorMap, INK, UNSHADED, settings) {
  const svgNS = "http://www.w3.org/2000/svg";
  let currentX = x;
  
  sectors.forEach((sector) => {
    const width = (sector.size / sector.total) * totalW;
    const rect = document.createElementNS(svgNS, "rect");
    rect.setAttribute("x", currentX.toFixed(1));
    rect.setAttribute("y", y);
    rect.setAttribute("width", width.toFixed(1));
    rect.setAttribute("height", h);
    rect.setAttribute("fill", sector.shaded ? colorMap.get(sector) : UNSHADED);
    
    if (!settings.hideLines) {
      rect.setAttribute("stroke", INK);
      rect.setAttribute("stroke-width", "3");
    }
    
    svg.appendChild(rect);
    currentX += width;
  });
}

function drawTickMarks(svg, cx, cy, r, INK) {
  const svgNS = "http://www.w3.org/2000/svg";
  for (let i = 0; i < 60; i++) {
    const angle = (i * 6 - 90) * Math.PI / 180;
    const isHourMark = i % 5 === 0;
    const innerR = isHourMark ? r - 25 : r - 12;
    const outerR = r;
    
    const x1 = cx + innerR * Math.cos(angle);
    const y1 = cy + innerR * Math.sin(angle);
    const x2 = cx + outerR * Math.cos(angle);
    const y2 = cy + outerR * Math.sin(angle);
    
    const tick = document.createElementNS(svgNS, "line");
    tick.setAttribute("x1", x1.toFixed(1));
    tick.setAttribute("y1", y1.toFixed(1));
    tick.setAttribute("x2", x2.toFixed(1));
    tick.setAttribute("y2", y2.toFixed(1));
    tick.setAttribute("stroke", INK);
    tick.setAttribute("stroke-width", isHourMark ? "3" : "1.5");
    tick.setAttribute("stroke-linecap", "square");
    svg.appendChild(tick);
  }
}

function buildColorMap(sectors) {
  const sizeMap = new Map();
  const colorMap = new Map();
  let colorIndex = 0;
  
  sectors.forEach(sector => {
    const key = sector.size;
    if (!sizeMap.has(key)) {
      sizeMap.set(key, DIFFERENT_PARTS_COLORS[colorIndex % DIFFERENT_PARTS_COLORS.length]);
      colorIndex++;
    }
    colorMap.set(sector, sizeMap.get(key));
  });
  
  return colorMap;
}

function addLabel(svg, x, y, text, INK, isDarkBg = false) {
  const svgNS = "http://www.w3.org/2000/svg";
  
  const box = document.createElementNS(svgNS, "rect");
  box.setAttribute("x", (x - 70).toString());
  box.setAttribute("y", (y - 25).toString());
  box.setAttribute("width", "140");
  box.setAttribute("height", "40");
  box.setAttribute("fill", isDarkBg ? "#1a1a1a" : "#ffffff");
  box.setAttribute("stroke", INK);
  box.setAttribute("stroke-width", "2");
  svg.appendChild(box);
  
  const label = document.createElementNS(svgNS, "text");
  label.setAttribute("x", x.toString());
  label.setAttribute("y", (y + 5).toString());
  label.setAttribute("text-anchor", "middle");
  label.setAttribute("font-family", "'JetBrains Mono', monospace");
  label.setAttribute("font-size", "20");
  label.setAttribute("font-weight", "700");
  label.setAttribute("fill", isDarkBg ? "#ffffff" : INK);
  label.textContent = text;
  svg.appendChild(label);
}

function addSectorLabels(svg, cx, cy, r, sectors, INK) {
  const svgNS = "http://www.w3.org/2000/svg";
  let currentAngle = -90;
  
  sectors.forEach((sector) => {
    const sectorAngle = (sector.size / sector.total) * 360;
    const midAngle = (currentAngle + sectorAngle / 2) * Math.PI / 180;
    const labelR = r * 0.65;
    
    const labelX = cx + labelR * Math.cos(midAngle);
    const labelY = cy + labelR * Math.sin(midAngle);
    
    const text = document.createElementNS(svgNS, "text");
    text.setAttribute("x", labelX.toFixed(1));
    text.setAttribute("y", labelY.toFixed(1));
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("dominant-baseline", "middle");
    text.setAttribute("font-family", "'JetBrains Mono', monospace");
    text.setAttribute("font-size", "16");
    text.setAttribute("font-weight", "700");
    text.setAttribute("fill", sector.shaded ? "#ffffff" : INK);
    text.textContent = toLowestTerms(sector.size, sector.total);
    svg.appendChild(text);
    
    currentAngle += sectorAngle;
  });
}

function addBarSegmentLabels(svg, x, y, totalW, h, sectors, INK) {
  const svgNS = "http://www.w3.org/2000/svg";
  let currentX = x;
  
  sectors.forEach((sector) => {
    const width = (sector.size / sector.total) * totalW;
    const centerX = currentX + width / 2;
    
    const text = document.createElementNS(svgNS, "text");
    text.setAttribute("x", centerX.toFixed(1));
    text.setAttribute("y", (y + h / 2 + 6).toString());
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("dominant-baseline", "middle");
    text.setAttribute("font-family", "'JetBrains Mono', monospace");
    text.setAttribute("font-size", "14");
    text.setAttribute("font-weight", "700");
    text.setAttribute("fill", sector.shaded ? "#ffffff" : INK);
    text.textContent = toLowestTerms(sector.size, sector.total);
    svg.appendChild(text);
    
    currentX += width;
  });
}