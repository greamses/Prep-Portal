/* ═══════════════════════════════════════════════════════════
   SETUP QUIZ SCRIPT
═══════════════════════════════════════════════════════════ */
function setupQuiz(quizData, timeLimitSeconds = 3600) {
  let currentQuestionIndex = 0;
  let answers = new Array(quizData.length).fill(null);
  let timeLeft = timeLimitSeconds;
  let correctCount = 0;
  let wrongCount = 0;
  let timerInterval = null;
  
  const elQuestionText = document.getElementById('question-text');
  const elQuestionImage = document.getElementById('question-image');
  const elOptionsContainer = document.getElementById('options-container');
  const elQNumDisplay = document.getElementById('q-number-display');
  const elCurrentQText = document.getElementById('current-q-text');
  const elTotalQText = document.getElementById('total-q-text');
  const elBtnPrev = document.getElementById('btn-prev');
  const elBtnNext = document.getElementById('btn-next');
  const elSlider = document.getElementById('q-slider');
  const elInput = document.getElementById('q-input');
  const elHintContainer = document.getElementById('hint-container');
  const elHintText = document.getElementById('hint-text');
  const elHintContent = document.getElementById('hint-content');
  const elHintIcon = document.getElementById('hint-icon');
  const elTimer = document.getElementById('timer-display');
  const elCorrectCount = document.getElementById('correct-count');
  const elWrongCount = document.getElementById('wrong-count');
  const elUnansweredDots = document.getElementById('unanswered-dots');
  
  function init() {
    const total = quizData.length;
    if (elTotalQText) elTotalQText.innerText = total;
    if (elSlider) elSlider.max = total;
    if (elInput) elInput.max = total;
    
    // IMPORTANT: Expose data to PrepBot so it can read the page live
    window.__prepbotQuizData = quizData;
    window.__prepbotJumpToQuestion = jumpToQuestion;
    
    if (elSlider) elSlider.addEventListener('input', (e) => jumpToQuestion(e.target.value - 1));
    if (elInput) {
      elInput.addEventListener('change', (e) => {
        let val = parseInt(e.target.value);
        if (val >= 1 && val <= total) jumpToQuestion(val - 1);
        else e.target.value = currentQuestionIndex + 1;
      });
    }
    
    if (elBtnPrev) elBtnPrev.addEventListener('click', () => changeQuestion(-1));
    if (elBtnNext) elBtnNext.addEventListener('click', () => changeQuestion(1));
    if (elHintContainer) elHintContainer.addEventListener('click', toggleHint);
    
    loadQuestion();
    startTimer();
  }
  
  function renderUnansweredDots() {
    if (!elUnansweredDots) return;
    elUnansweredDots.innerHTML = '';
    let hasUnanswered = false;
    answers.forEach((ans, index) => {
      if (ans === null) {
        hasUnanswered = true;
        const dot = document.createElement('div');
        dot.className = `nav-dot ${index === currentQuestionIndex ? 'active' : ''}`;
        dot.id = `nav-dot-${index}`;
        dot.onclick = () => jumpToQuestion(index);
        elUnansweredDots.appendChild(dot);
      }
    });
    elUnansweredDots.style.display = hasUnanswered ? 'flex' : 'none';
  }
  
  function loadQuestion() {
    const qData = quizData[currentQuestionIndex];
    
    if (elQNumDisplay) elQNumDisplay.innerText = currentQuestionIndex + 1;
    if (elCurrentQText) elCurrentQText.innerText = currentQuestionIndex + 1;
    if (elSlider) elSlider.value = currentQuestionIndex + 1;
    if (elInput) elInput.value = currentQuestionIndex + 1;
    
    if (elQuestionText) elQuestionText.innerHTML = qData.question;
    
    // IMPORTANT: Let PrepBot know exactly what question we are looking at right now
    window.__prepbotCurrentQuestionIndex = currentQuestionIndex;
    window.__prepbotQuestion = qData.question;
    
    if (elQuestionImage) {
      if (qData.image) {
        elQuestionImage.src = qData.image;
        elQuestionImage.classList.remove('hidden');
      } else {
        elQuestionImage.src = "";
        elQuestionImage.classList.add('hidden');
      }
    }
    
    if (elHintContent) elHintContent.classList.add('hidden');
    if (elHintIcon) elHintIcon.innerText = 'expand_more';
    if (elHintText) elHintText.innerHTML = qData.hint;
    if (elHintContainer) elHintContainer.style.display = (answers[currentQuestionIndex] !== null) ? 'none' : 'block';
    
    renderUnansweredDots();
    
    if (elOptionsContainer) {
      elOptionsContainer.innerHTML = '';
      const letters = ['A', 'B', 'C', 'D', 'E'];
      
      qData.options.forEach((optText, index) => {
        const isAnswered = answers[currentQuestionIndex] !== null;
        const isSelected = answers[currentQuestionIndex] === index;
        const isCorrect = index === qData.correctIndex;
        
        let cardClass = "option-card";
        if (isAnswered) {
          cardClass += " disabled";
          if (isCorrect) cardClass += " correct";
          if (isSelected && !isCorrect) cardClass += " incorrect";
        }
        
        let feedbackIcon = isCorrect ? "check" : "close";
        let feedbackTitle = isCorrect ? "Right answer" : "Not quite";
        let feedbackDesc = "";
        if (isCorrect) {
          feedbackDesc = qData.explanation.map(step => `<div class="math-step">${step}</div>`).join('');
        } else {
          if (qData.wrongFeedback && qData.wrongFeedback[index]) {
            feedbackDesc = `<div class="math-step">${qData.wrongFeedback[index]}</div>`;
          } else {
            feedbackDesc = `<div class="math-step">This option is incorrect. See the right answer for the full working.</div>`;
          }
        }
        
        const cardHtml = `
                    <div class="${cardClass}" id="opt-card-${index}">
                        <div class="option-content">
                            <span class="option-letter">${letters[index]}.</span>
                            <span class="option-text">${optText}</span>
                        </div>
                        <div class="feedback-box" id="feedback-${index}">
                            <div class="feedback-title">
                                <span class="material-symbols-outlined">${feedbackIcon}</span>
                                ${feedbackTitle}
                            </div>
                            <div class="feedback-desc">${feedbackDesc}</div>
                        </div>
                    </div>`;
        elOptionsContainer.insertAdjacentHTML('beforeend', cardHtml);
        document.getElementById(`opt-card-${index}`).addEventListener('click', () => selectOption(index));
      });
    }
    
    if (elBtnPrev) elBtnPrev.disabled = currentQuestionIndex === 0;
    if (elBtnNext) elBtnNext.innerText = currentQuestionIndex === quizData.length - 1 ? "Finish" : "Next";
    if (window.MathJax) MathJax.typesetPromise();
  }
  
  function selectOption(selectedIndex) {
    if (answers[currentQuestionIndex] !== null) return;
    const qData = quizData[currentQuestionIndex];
    answers[currentQuestionIndex] = selectedIndex;
    
    if (selectedIndex === qData.correctIndex) {
      correctCount++;
      if (elCorrectCount) elCorrectCount.innerText = correctCount;
    } else {
      wrongCount++;
      if (elWrongCount) elWrongCount.innerText = wrongCount;
    }
    
    if (elHintContainer) elHintContainer.style.display = 'none';
    
    const activeDot = document.getElementById(`nav-dot-${currentQuestionIndex}`);
    if (activeDot) {
      activeDot.classList.add('pop-out');
      setTimeout(renderUnansweredDots, 300);
    } else renderUnansweredDots();
    
    const options = document.querySelectorAll('.option-card');
    options.forEach((opt, idx) => {
      opt.classList.add('disabled');
      if (idx === qData.correctIndex) opt.classList.add('correct');
      if (idx === selectedIndex && idx !== qData.correctIndex) opt.classList.add('incorrect');
    });
    
    if (window.MathJax) MathJax.typesetPromise();
  }
  
  function changeQuestion(direction) {
    let newIndex = currentQuestionIndex + direction;
    if (newIndex >= 0 && newIndex < quizData.length) jumpToQuestion(newIndex);
    else if (newIndex >= quizData.length) alert("Quiz Completed! Check your results.");
  }
  
  function jumpToQuestion(index) {
    currentQuestionIndex = index;
    loadQuestion();
  }
  
  function toggleHint() {
    if (!elHintContent) return;
    if (elHintContent.classList.contains('hidden')) {
      elHintContent.classList.remove('hidden');
      if (elHintIcon) elHintIcon.innerText = 'expand_less';
      if (window.MathJax) MathJax.typesetPromise();
    } else {
      elHintContent.classList.add('hidden');
      if (elHintIcon) elHintIcon.innerText = 'expand_more';
    }
  }
  
  function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        if (elTimer) elTimer.innerText = "00:00";
        alert("Time is up!");
        return;
      }
      timeLeft--;
      let m = Math.floor(timeLeft / 60);
      let s = timeLeft % 60;
      if (elTimer) elTimer.innerText = `${m < 10 ? '0'+m : m}:${s < 10 ? '0'+s : s}`;
    }, 1000);
  }
  
  init();
  return {
    jumpToQuestion,
    changeQuestion,
    stopTimer: () => clearInterval(timerInterval),
    getResults: () => ({ correctCount, wrongCount, answers })
  };
}


export default setupQuiz;