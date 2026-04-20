// Random integer generator
export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// GCD calculator for fractions
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

// Coordinate conversion helpers
export function squareXY(sq, cellSize) {
  const idx = sq - 1;
  const boardRow = Math.floor(idx / 8);
  const colIdx = idx % 8;
  const boardCol = (boardRow % 2 === 0) ? colIdx : (7 - colIdx);
  const canvasRow = 7 - boardRow;
  return { x: boardCol * cellSize, y: canvasRow * cellSize };
}

export function squareCenter(sq, cellSize) {
  const { x, y } = squareXY(sq, cellSize);
  return { x: x + cellSize / 2, y: y + cellSize / 2 };
}

export function getSquareFromPoint(x, y, cellSize) {
  const col = Math.floor(x / cellSize);
  const row = Math.floor(y / cellSize);
  if (col < 0 || col > 7 || row < 0 || row > 7) return -1;
  const boardRow = 7 - row;
  const boardCol = (boardRow % 2 === 0) ? col : (7 - col);
  return boardRow * 8 + boardCol + 1;
}

// Canvas point conversion
export function getCanvasPoint(e, canvas) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
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
}// Random integer generator
export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// GCD calculator for fractions
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

// Coordinate conversion helpers
export function squareXY(sq, cellSize) {
  const idx = sq - 1;
  const boardRow = Math.floor(idx / 8);
  const colIdx = idx % 8;
  const boardCol = (boardRow % 2 === 0) ? colIdx : (7 - colIdx);
  const canvasRow = 7 - boardRow;
  return { x: boardCol * cellSize, y: canvasRow * cellSize };
}

export function squareCenter(sq, cellSize) {
  const { x, y } = squareXY(sq, cellSize);
  return { x: x + cellSize / 2, y: y + cellSize / 2 };
}

export function getSquareFromPoint(x, y, cellSize) {
  const col = Math.floor(x / cellSize);
  const row = Math.floor(y / cellSize);
  if (col < 0 || col > 7 || row < 0 || row > 7) return -1;
  const boardRow = 7 - row;
  const boardCol = (boardRow % 2 === 0) ? col : (7 - col);
  return boardRow * 8 + boardCol + 1;
}

// Canvas point conversion
export function getCanvasPoint(e, canvas) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
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