import { DOM, gameState, players, boardData } from './state.js';
import { addLog } from './ui.js';
import { animateCPUToken, endTurn, triggerWin } from './engine.js';

export const STANDARD_CARDS = [
  { title: "Lucky Strike", desc: "Move forward 2 spaces.", type: 'self', amount: 2, action: (pi) => applyCardMove(pi, 2) },
  { title: "Minor Boost", desc: "Move forward 3 spaces.", type: 'self', amount: 3, action: (pi) => applyCardMove(pi, 3) },
  { title: "Sabotage", desc: "Opponent moves back 2 spaces.", type: 'opponent', amount: -2, action: (pi) => applyCardMove(1 - pi, -2) },
  { title: "Tripwire", desc: "Opponent moves back 3 spaces.", type: 'opponent', amount: -3, action: (pi) => applyCardMove(1 - pi, -3) }
];

export const BONUS_HUGE_WINS = [
  { title: "MEGA BOOST!", desc: "Move forward 8 spaces.", type: 'self', amount: 8, action: (pi) => applyCardMove(pi, 8) },
  { title: "SUPER LEAP!", desc: "Move forward 6 spaces.", type: 'self', amount: 6, action: (pi) => applyCardMove(pi, 6) }
];

export const BONUS_SMALL_WINS = [
  { title: "Tiny Step", desc: "Move forward 1 space.", type: 'self', amount: 1, action: (pi) => applyCardMove(pi, 1) },
  { title: "Small Jump", desc: "Move forward 2 spaces.", type: 'self', amount: 2, action: (pi) => applyCardMove(pi, 2) },
  { title: "Minor Snag", desc: "Opponent moves back 1.", type: 'opponent', amount: -1, action: (pi) => applyCardMove(1 - pi, -1) }
];

export function evaluateCardTactics(card, pi, level) {
  if (level === 'basic') return true;
  
  let score = 0;
  if (card.type === 'self') {
    let target = players[pi].pos + card.amount;
    if (target > 64) target = 64;
    score += card.amount * 2;
    
    if (boardData.SNAKES[target]) {
      let tail = boardData.SNAKES[target];
      score -= (target - tail) * 2;
    }
    if (boardData.LADDERS[target]) {
      let top = boardData.LADDERS[target];
      score += (top - target) * 2;
    }
  } else if (card.type === 'opponent') {
    let oppi = 1 - pi;
    let target = players[oppi].pos + card.amount;
    if (target < 1) target = 1;
    score += Math.abs(card.amount) * 2;
    
    if (boardData.LADDERS[target]) {
      let top = boardData.LADDERS[target];
      score -= (top - target) * 3;
    }
    if (boardData.SNAKES[target]) {
      let tail = boardData.SNAKES[target];
      score += (target - tail) * 2;
    }
  }
  return score >= 0;
}

export function showStandardCard(pi) {
  let actionTaken = false;
  DOM.fracPopup.classList.remove('show');
  DOM.numpad.classList.remove('show');
  
  const card = STANDARD_CARDS[Math.floor(Math.random() * STANDARD_CARDS.length)];
  document.getElementById('lc-title').textContent = card.title;
  document.getElementById('lc-desc').textContent = card.desc;
  
  DOM.luckyCardOverlay.classList.add('show');
  
  const btnUse = document.getElementById('btn-use-card');
  const btnDiscard = document.getElementById('btn-discard-card');
  
  const newUse = btnUse.cloneNode(true);
  const newDiscard = btnDiscard.cloneNode(true);
  btnUse.parentNode.replaceChild(newUse, btnUse);
  btnDiscard.parentNode.replaceChild(newDiscard, btnDiscard);
  
  const handleUse = () => {
    if (actionTaken) return;
    actionTaken = true;
    DOM.luckyCardOverlay.classList.remove('show');
    card.action(pi);
  };
  
  const handleDiscard = () => {
    if (actionTaken) return;
    actionTaken = true;
    DOM.luckyCardOverlay.classList.remove('show');
    addLog(`${players[pi].name} discarded the card.`, 'info');
    endTurn();
  };
  
  newUse.addEventListener('click', handleUse);
  newDiscard.addEventListener('click', handleDiscard);
  
  if (gameState.vsCPU && pi === 1) {
    newUse.style.display = 'none';
    newDiscard.style.display = 'none';
    setTimeout(() => {
      let useIt = evaluateCardTactics(card, pi, gameState.cpuIntel);
      if (useIt) {
        addLog(`CPU analyzed board. Card used.`, 'action');
        handleUse();
      } else {
        addLog(`CPU evaluated penalty! Card discarded.`, 'info');
        handleDiscard();
      }
    }, 2500);
  } else {
    newUse.style.display = 'block';
    newDiscard.style.display = 'block';
  }
}

export function showBonusFlipCards(pi) {
  DOM.fracPopup.classList.remove('show');
  DOM.numpad.classList.remove('show');
  
  let huge = BONUS_HUGE_WINS[Math.floor(Math.random() * BONUS_HUGE_WINS.length)];
  let small1 = BONUS_SMALL_WINS[Math.floor(Math.random() * BONUS_SMALL_WINS.length)];
  let small2 = BONUS_SMALL_WINS[Math.floor(Math.random() * BONUS_SMALL_WINS.length)];
  
  let pool = [huge, small1, small2];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  
  const container = document.getElementById('bc-cards-container');
  container.innerHTML = '';
  
  let hasPicked = false;
  let chosenCardObj = null;
  
  pool.forEach((card, index) => {
    const cardEl = document.createElement('div');
    cardEl.className = 'bc-card';
    cardEl.dataset.index = index;
    cardEl.innerHTML = `
            <div class="bc-card-inner">
                <div class="bc-face bc-front">✨</div>
                <div class="bc-face bc-back">
                    <strong class="bc-card-title">${card.title}</strong>
                    <span class="bc-card-desc">${card.desc}</span>
                </div>
            </div>
        `;
    
    cardEl.addEventListener('click', () => {
      if (hasPicked || (gameState.vsCPU && pi === 1)) return;
      hasPicked = true;
      chosenCardObj = card;
      
      cardEl.classList.add('flipped');
      showBonusActions(pi, cardEl, pool, index, card);
    });
    
    container.appendChild(cardEl);
  });
  
  document.getElementById('bc-actions').style.display = 'none';
  DOM.bonusCardOverlay.classList.add('show');
  addLog(`${players[pi].name} earned Bonus Wish Cards! Pick one to reveal.`, 'info');
  
  if (gameState.vsCPU && pi === 1) {
    setTimeout(() => {
      const cpuChoiceIdx = Math.floor(Math.random() * 3);
      const cpuCardEl = container.children[cpuChoiceIdx];
      hasPicked = true;
      chosenCardObj = pool[cpuChoiceIdx];
      
      cpuCardEl.classList.add('flipped');
      
      setTimeout(() => {
        let useIt = evaluateCardTactics(chosenCardObj, pi, gameState.cpuIntel);
        Array.from(container.children).forEach((el, i) => {
          if (i !== cpuChoiceIdx) el.classList.add('flipped');
        });
        
        setTimeout(() => {
          DOM.bonusCardOverlay.classList.remove('show');
          if (useIt) {
            addLog(`CPU used the revealed bonus card!`, 'action');
            chosenCardObj.action(pi);
          } else {
            addLog(`CPU discarded the revealed bonus to avoid penalties.`, 'info');
            endTurn();
          }
        }, 2500);
      }, 1500);
    }, 1200);
  }
}

export function showBonusActions(pi, flippedEl, pool, chosenIndex, chosenCardObj) {
  const actionContainer = document.getElementById('bc-actions');
  const btnUse = document.getElementById('btn-use-bonus');
  const btnDiscard = document.getElementById('btn-discard-bonus');
  
  const newUse = btnUse.cloneNode(true);
  const newDiscard = btnDiscard.cloneNode(true);
  btnUse.parentNode.replaceChild(newUse, btnUse);
  btnDiscard.parentNode.replaceChild(newDiscard, btnDiscard);
  
  actionContainer.style.display = 'flex';
  let resolved = false;
  
  const executeResolution = (used) => {
    if (resolved) return;
    resolved = true;
    actionContainer.style.display = 'none';
    
    const container = document.getElementById('bc-cards-container');
    Array.from(container.children).forEach((el, i) => {
      if (i !== chosenIndex) el.classList.add('flipped');
    });
    
    setTimeout(() => {
      DOM.bonusCardOverlay.classList.remove('show');
      if (used) {
        chosenCardObj.action(pi);
      } else {
        addLog(`${players[pi].name} discarded the bonus card.`, 'info');
        endTurn();
      }
    }, 2500);
  };
  
  newUse.addEventListener('click', () => executeResolution(true));
  newDiscard.addEventListener('click', () => executeResolution(false));
}

export function applyCardMove(targetPi, amount) {
  let newPos = players[targetPi].pos + amount;
  if (newPos > 64) newPos = 64;
  if (newPos < 1) newPos = 1;
  
  addLog(`Card Effect! ${players[targetPi].name} moves ${amount > 0 ? 'forward' : 'back'} ${Math.abs(amount)} squares!`, 'action');
  
  animateCPUToken(targetPi, players[targetPi].pos, newPos, () => {
    players[targetPi].pos = newPos;
    
    if (newPos in boardData.SNAKES) {
      let tail = boardData.SNAKES[newPos];
      addLog(`Card put ${players[targetPi].name} on a snake!`, 'snake');
      setTimeout(() => {
        animateCPUToken(targetPi, newPos, tail, () => {
          players[targetPi].pos = tail;
          finalizeCardMove(targetPi, tail);
        });
      }, 600);
    } else if (newPos in boardData.LADDERS) {
      let top = boardData.LADDERS[newPos];
      addLog(`Card put ${players[targetPi].name} on a ladder!`, 'ladder');
      setTimeout(() => {
        animateCPUToken(targetPi, newPos, top, () => {
          players[targetPi].pos = top;
          finalizeCardMove(targetPi, top);
        });
      }, 600);
    } else {
      finalizeCardMove(targetPi, newPos);
    }
  });
}

export function finalizeCardMove(pi, sq) {
  if (sq === 64) triggerWin(pi);
  else endTurn();
}