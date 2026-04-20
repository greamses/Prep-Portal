import { DOM, gameState, players } from './state.js';
import { STATE_ENUM } from './config.js';
import { fracConvLabel, getGcd } from './utils.js';
import { showStandardCard, showBonusFlipCards } from './cards.js';
import { addLog } from './ui.js';
import { endTurn, triggerWin } from './engine.js';

export function showFracQuestion(f, pi) {
  gameState.state = STATE_ENUM.WAITING_FRAC_ANSWER;
  gameState.isProcessingAnswer = false;
  gameState.currentFracPlayer = pi;
  gameState.currentFracAttempts = 0;
  gameState.currentFracData = fracConvLabel(f);
  
  const data = gameState.currentFracData;
  let html = '';
  
  if (data.type === 'mixed') {
    html = `
            <div class="frac-q-row">
                <span class="frac-lg">${data.whole}</span>
                <div class="frac-col">
                    <span class="frac-md">${data.num}</span><div class="frac-line"></div><span class="frac-md">${data.den}</span>
                </div>
                <span class="frac-eq">=</span>
                <div class="frac-col">
                    <div class="frac-input" id="ans-num"></div><div class="frac-line"></div><div class="frac-input" id="ans-den"></div>
                </div>
            </div>
            <button class="btn-check-frac" onclick="submitFractionAnswer()">Check</button>
        `;
  } else if (data.type === 'improper') {
    html = `
            <div class="frac-q-row">
                <div class="frac-col">
                    <span class="frac-lg">${data.improper.num}</span><div class="frac-line"></div><span class="frac-lg">${data.improper.den}</span>
                </div>
                <span class="frac-eq">=</span>
                <div class="frac-q-row">
                    <div class="frac-input ans-whole" id="ans-w"></div>
                    <div class="frac-col">
                        <div class="frac-input" id="ans-num"></div><div class="frac-line"></div><div class="frac-input" id="ans-den"></div>
                    </div>
                </div>
            </div>
            <button class="btn-check-frac" onclick="submitFractionAnswer()">Check</button>
        `;
  } else {
    html = `
            <div class="frac-q-row">
                <div class="frac-col">
                    <span class="frac-lg">${data.num}</span><div class="frac-line"></div><span class="frac-lg">${data.den}</span>
                </div>
                <span class="frac-eq">=</span>
                <div class="frac-input ans-whole" id="ans-w"></div>
            </div>
            <button class="btn-check-frac" onclick="submitFractionAnswer()">Check</button>
        `;
  }
  
  DOM.popupEq.innerHTML = html;
  DOM.fracPopup.classList.add('show');
  DOM.numpad.classList.add('show');
  
  document.querySelectorAll('.frac-input').forEach(i => i.classList.remove('active-focus'));
  const firstInput = DOM.popupEq.querySelector('.frac-input');
  if (firstInput) {
    firstInput.classList.add('active-focus');
    gameState.activeInput = firstInput;
  }
  
  if (gameState.vsCPU && pi === 1) {
    setTimeout(() => simulateCPUAnswer(data), 1500);
  }
}

export function simulateCPUAnswer(data) {
  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };
  
  if (data.type === 'mixed') {
    let tNum = data.improper.num;
    let tDen = data.improper.den;
    let g = getGcd(tNum, tDen);
    setVal('ans-num', tNum / g);
    setVal('ans-den', tDen / g);
  } else if (data.type === 'improper') {
    let tNum = data.num;
    let tDen = data.den;
    let g = getGcd(tNum, tDen);
    setVal('ans-w', data.whole);
    setVal('ans-num', tNum / g);
    setVal('ans-den', tDen / g);
  } else {
    setVal('ans-w', data.whole);
  }
  
  setTimeout(submitFractionAnswer, 800);
}

export function submitFractionAnswer() {
  if (gameState.isProcessingAnswer) return;
  gameState.isProcessingAnswer = true;
  
  let isCorrect = false;
  let originalIsReducible = false;
  let answeredInLowestTerms = false;
  
  const data = gameState.currentFracData;
  const getVal = (id) => {
    const el = document.getElementById(id);
    return el && el.textContent.trim() !== '' ? parseInt(el.textContent.trim()) : 0;
  };
  
  if (data.type === 'mixed') {
    originalIsReducible = (getGcd(data.improper.num, data.improper.den) > 1);
    const tNum = data.improper.num;
    const tDen = data.improper.den;
    const uNum = getVal('ans-num');
    const uDen = getVal('ans-den');
    
    if (uDen !== 0 && (uNum * tDen === tNum * uDen)) {
      isCorrect = true;
      if (getGcd(uNum, uDen) === 1) answeredInLowestTerms = true;
    }
  } else if (data.type === 'improper') {
    originalIsReducible = (getGcd(data.improper.num, data.improper.den) > 1);
    const tTotalNum = data.improper.num;
    const tDen = data.improper.den;
    
    const uWhole = getVal('ans-w');
    const uNum = getVal('ans-num');
    const uDen = getVal('ans-den');
    const uTotalNum = uWhole * uDen + uNum;
    
    if (uDen !== 0 && uNum < uDen && (uTotalNum * tDen === tTotalNum * uDen)) {
      isCorrect = true;
      if (uNum === 0 || getGcd(uNum, uDen) === 1) answeredInLowestTerms = true;
    }
  } else {
    if (getVal('ans-w') === data.whole) {
      isCorrect = true;
    }
  }
  
  if (isCorrect) {
    if (gameState.currentFracAttempts === 0) {
      if (originalIsReducible && answeredInLowestTerms) {
        showBonusFlipCards(gameState.currentFracPlayer);
      } else if (originalIsReducible && !answeredInLowestTerms) {
        addLog(`${players[gameState.currentFracPlayer].name} didn't reduce to lowest terms. No bonus wish cards!`, 'info');
        if (DOM.gameFeedback) DOM.gameFeedback.textContent = "Correct! But not lowest terms, so no bonus.";
        showStandardCard(gameState.currentFracPlayer);
      } else {
        showStandardCard(gameState.currentFracPlayer);
      }
    } else {
      DOM.fracPopup.classList.remove('show');
      DOM.numpad.classList.remove('show');
      endTurn();
    }
  } else {
    gameState.currentFracAttempts++;
    if (gameState.currentFracAttempts >= 5) {
      DOM.fracPopup.classList.remove('show');
      DOM.numpad.classList.remove('show');
      addLog(`${players[gameState.currentFracPlayer].name} failed 5 times and was disqualified!`, 'error');
      if (DOM.gameFeedback) DOM.gameFeedback.textContent = `${players[gameState.currentFracPlayer].name} disqualified!`;
      triggerWin(1 - gameState.currentFracPlayer, "Opponent failed 5 fraction questions!");
      return;
    }
    
    DOM.popupEq.classList.add('error-shake');
    setTimeout(() => {
      DOM.popupEq.classList.remove('error-shake');
      gameState.isProcessingAnswer = false;
    }, 400);
    addLog(`Incorrect! Attempt ${gameState.currentFracAttempts}/5. Try again.`, 'error');
    if (DOM.gameFeedback) DOM.gameFeedback.textContent = `Incorrect! Attempt ${gameState.currentFracAttempts}/5. Try again.`;
  }
}

export function onNumpadClick(key) {
  if (!gameState.activeInput) return;
  if (key === 'C') {
    gameState.activeInput.textContent = '';
  } else if (key === 'OK') {
    submitFractionAnswer();
  } else {
    if (gameState.activeInput.textContent.length < 3) {
      gameState.activeInput.textContent += key;
    }
  }
}