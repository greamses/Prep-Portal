import { CELL } from './config.js';
import { DOM } from './state.js';

export function squareXY(sq) {
  const idx = sq - 1;
  const boardRow = Math.floor(idx / 8);
  const colIdx = idx % 8;
  const boardCol = (boardRow % 2 === 0) ? colIdx : (7 - colIdx);
  const canvasRow = 7 - boardRow;
  return { x: boardCol * CELL, y: canvasRow * CELL };
}

export function squareCenter(sq) {
  const { x, y } = squareXY(sq);
  return { x: x + CELL / 2, y: y + CELL / 2 };
}

export function getCanvasPoint(e) {
  if (!DOM.canvas) return { x: 0, y: 0 };
  const rect = DOM.canvas.getBoundingClientRect();
  const scaleX = DOM.canvas.width / rect.width;
  const scaleY = DOM.canvas.height / rect.height;
  let clientX = e.clientX;
  let clientY = e.clientY;
  
  if (e.touches && e.touches.length > 0) {
    clientX = e.touches[0].clientX;
    clientY = e.touches[0].clientY;
  } else if (e.changedTouches && e.changedTouches.length > 0) {
    clientX = e.changedTouches[0].clientX;
    clientY = e.changedTouches[0].clientY;
  }
  
  return {
    x: (clientX - rect.left) * scaleX,
    y: (clientY - rect.top) * scaleY
  };
}

export function getSquareFromPoint(x, y) {
  const col = Math.floor(x / CELL);
  const row = Math.floor(y / CELL);
  if (col < 0 || col > 7 || row < 0 || row > 7) return -1;
  const boardRow = 7 - row;
  const boardCol = (boardRow % 2 === 0) ? col : (7 - col);
  return boardRow * 8 + boardCol + 1;
}

export function getGcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    let t = b;
    b = a % b;
    a = t;
  }
  return a;
}

export function fracConvLabel(f) {
  if (f.d === 'M') {
    const top = f.w * f.dn + f.n;
    return { type: 'mixed', whole: f.w, num: f.n, den: f.dn, improper: { num: top, den: f.dn } };
  }
  const w = Math.floor(f.n / f.dn);
  const r = f.n % f.dn;
  if (r === 0) {
    return { type: 'whole', whole: w, num: f.n, den: f.dn };
  }
  return { type: 'improper', whole: w, num: r, den: f.dn, improper: { num: f.n, den: f.dn } };
}