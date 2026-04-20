// boardGenerator.js
// Generates a random, valid Snakes N' Ladders board and math fraction parameters

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomBoard(difficulty = 'standard') {
  let snakeCount, ladderCount;
  
  switch (difficulty) {
    case 'easy':
      snakeCount = 2;
      ladderCount = 5;
      break;
    case 'hard':
      snakeCount = 6;
      ladderCount = 3;
      break;
    case 'standard':
    default:
      snakeCount = 4;
      ladderCount = 4;
      break;
  }
  
  const snakes = {};
  const snakeColors = {};
  const ladders = {};
  
  // Protect start (1) and end (64). Also protect immediately before 64.
  const usedSquares = new Set([1, 62, 63, 64]);
  const colors = ['#c0392b', '#27ae60', '#8e44ad', '#d35400', '#2980b9', '#f39c12'];
  
  // Generate valid Ladders (bottom < top)
  let lCount = 0;
  while (lCount < ladderCount) {
    let bottom = randomInt(4, 50);
    let top = randomInt(bottom + 6, 61);
    
    // Ensure no overlaps or loops
    if (!usedSquares.has(bottom) && !usedSquares.has(top)) {
      ladders[bottom] = top;
      usedSquares.add(bottom);
      usedSquares.add(top);
      lCount++;
    }
  }
  
  // Generate valid Snakes (head > tail)
  let sCount = 0;
  while (sCount < snakeCount) {
    let head = randomInt(15, 61);
    let tail = randomInt(3, head - 6);
    
    if (!usedSquares.has(head) && !usedSquares.has(tail)) {
      snakes[head] = tail;
      snakeColors[head] = colors[sCount % colors.length];
      usedSquares.add(head);
      usedSquares.add(tail);
      sCount++;
    }
  }
  
  // Generate Random Fractions for squares 2 to 63
  const fractions = { 64: { d: 'W' } };
  for (let i = 2; i <= 63; i++) {
    const isMixed = Math.random() > 0.5;
    
    if (isMixed) {
      let n = randomInt(1, 9);
      let dn = randomInt(n + 1, n + 6); // ensure numerator < denominator
      fractions[i] = {
        d: 'M',
        w: randomInt(1, 8),
        n: n,
        dn: dn
      };
    } else {
      let dn = randomInt(2, 10);
      let n = randomInt(dn + 1, dn * 4);
      if (n % dn === 0) n += 1; // avoid evaluating to a whole number immediately
      fractions[i] = {
        d: 'I',
        n: n,
        dn: dn
      };
    }
  }
  
  return { snakes, snakeColors, ladders, fractions };
}

// Attach to window so it can be called seamlessly by game.js
if (typeof window !== 'undefined') {
  window.generateRandomBoard = generateRandomBoard;
}