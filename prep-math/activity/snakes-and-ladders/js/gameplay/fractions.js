import { fracConvLabel, validateFractionAnswer } from '../core/fractionLogic.js';

export class FractionManager {
    constructor(gameState, modalManager, onStandardCard, onBonusCard, onComplete) {
        this.gameState = gameState;
        this.modalManager = modalManager;
        this.onStandardCard = onStandardCard;
        this.onBonusCard = onBonusCard;
        this.onComplete = onComplete;
        this.activeInput = null;
        
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        document.addEventListener('pointerdown', (e) => {
            if (e.target.classList.contains('frac-input')) {
                document.querySelectorAll('.frac-input').forEach(i => 
                    i.classList.remove('active-focus'));
                e.target.classList.add('active-focus');
                this.activeInput = e.target;
            }
        });
        
        window.addEventListener('keydown', (e) => this.handleKeydown(e));
    }
    
    handleKeydown(e) {
        const popup = document.getElementById('fracPopup');
        if (!popup || !popup.classList.contains('show')) return;
        if (!this.activeInput) return;
        
        if (e.key >= '0' && e.key <= '9') {
            e.preventDefault();
            this.onNumpadInput(e.key);
        } else if (e.key === 'Backspace') {
            e.preventDefault();
            this.activeInput.textContent = this.activeInput.textContent.slice(0, -1);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            this.submitAnswer();
        } else if (e.key.toLowerCase() === 'c' || e.key === 'Escape') {
            e.preventDefault();
            this.onNumpadInput('C');
        } else if (e.key === 'Tab') {
            e.preventDefault();
            this.focusNextInput(!e.shiftKey);
        }
    }
    
    focusNextInput(forward = true) {
        const inputs = Array.from(document.querySelectorAll('.frac-input'));
        const idx = inputs.indexOf(this.activeInput);
        if (idx >= 0) {
            const nextIdx = forward ? 
                (idx + 1) % inputs.length : 
                (idx - 1 + inputs.length) % inputs.length;
            inputs.forEach(i => i.classList.remove('active-focus'));
            this.activeInput = inputs[nextIdx];
            this.activeInput.classList.add('active-focus');
        }
    }
    
    onNumpadInput(key) {
        if (!this.activeInput) return;
        
        if (key === 'C') {
            this.activeInput.textContent = '';
        } else if (key === 'OK') {
            this.submitAnswer();
        } else {
            if (this.activeInput.textContent.length < 3) {
                this.activeInput.textContent += key;
            }
        }
    }
    
    checkFraction(pi, sq) {
        const f = this.gameState.fractions[sq];
        if (f && f.d !== 'W') {
            this.showQuestion(f, pi);
        } else if (sq === 64) {
            // Win handled by movement manager
        } else {
            this.onComplete();
        }
    }
    
    showQuestion(f, pi) {
        this.gameState.state = 4; // WAITING_FRAC_ANSWER
        this.gameState.isProcessingAnswer = false;
        this.gameState.currentFracPlayer = pi;
        this.gameState.currentFracAttempts = 0;
        this.gameState.currentFracData = fracConvLabel(f);
        
        const html = this.generateQuestionHTML(this.gameState.currentFracData);
        this.modalManager.showFractionPopup(html);
        
        // Show numpad
        const numpad = document.getElementById('snakes-numpad');
        if (numpad) numpad.classList.add('show');
        
        // Focus first input
        document.querySelectorAll('.frac-input').forEach(i => 
            i.classList.remove('active-focus'));
        const firstInput = document.querySelector('#popupEq .frac-input');
        if (firstInput) {
            firstInput.classList.add('active-focus');
            this.activeInput = firstInput;
        }
        
        // CPU auto-answer
        if (this.gameState.vsCPU && pi === 1) {
            setTimeout(() => this.simulateCPUAnswer(), 1500);
        }
    }
    
    generateQuestionHTML(data) {
        if (data.type === 'mixed') {
            return `
                <div class="frac-q-row">
                    <span class="frac-lg">${data.whole}</span>
                    <div class="frac-col">
                        <span class="frac-md">${data.num}</span>
                        <div class="frac-line"></div>
                        <span class="frac-md">${data.den}</span>
                    </div>
                    <span class="frac-eq">=</span>
                    <div class="frac-col">
                        <div class="frac-input" id="ans-num"></div>
                        <div class="frac-line"></div>
                        <div class="frac-input" id="ans-den"></div>
                    </div>
                </div>
                <button class="btn-check-frac" onclick="window.submitFractionAnswer()">Check</button>
            `;
        } else if (data.type === 'improper') {
            return `
                <div class="frac-q-row">
                    <div class="frac-col">
                        <span class="frac-lg">${data.improper.num}</span>
                        <div class="frac-line"></div>
                        <span class="frac-lg">${data.improper.den}</span>
                    </div>
                    <span class="frac-eq">=</span>
                    <div class="frac-q-row">
                        <div class="frac-input ans-whole" id="ans-w"></div>
                        <div class="frac-col">
                            <div class="frac-input" id="ans-num"></div>
                            <div class="frac-line"></div>
                            <div class="frac-input" id="ans-den"></div>
                        </div>
                    </div>
                </div>
                <button class="btn-check-frac" onclick="window.submitFractionAnswer()">Check</button>
            `;
        } else {
            return `
                <div class="frac-q-row">
                    <div class="frac-col">
                        <span class="frac-lg">${data.num}</span>
                        <div class="frac-line"></div>
                        <span class="frac-lg">${data.den}</span>
                    </div>
                    <span class="frac-eq">=</span>
                    <div class="frac-input ans-whole" id="ans-w"></div>
                </div>
                <button class="btn-check-frac" onclick="window.submitFractionAnswer()">Check</button>
            `;
        }
    }
    
    simulateCPUAnswer() {
        const data = this.gameState.currentFracData;
        const setVal = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.textContent = val;
        };
        
        if (data.type === 'mixed') {
            let tNum = data.improper.num;
            let tDen = data.improper.den;
            let g = this.getGcd(tNum, tDen);
            setVal('ans-num', tNum / g);
            setVal('ans-den', tDen / g);
        } else if (data.type === 'improper') {
            let tNum = data.num;
            let tDen = data.den;
            let g = this.getGcd(tNum, tDen);
            setVal('ans-w', data.whole);
            setVal('ans-num', tNum / g);
            setVal('ans-den', tDen / g);
        } else {
            setVal('ans-w', data.whole);
        }
        
        setTimeout(() => this.submitAnswer(), 800);
    }
    
    getGcd(a, b) {
        a = Math.abs(a);
        b = Math.abs(b);
        while (b) {
            let t = b;
            b = a % b;
            a = t;
        }
        return a;
    }
    
    submitAnswer() {
        if (this.gameState.isProcessingAnswer) return;
        this.gameState.isProcessingAnswer = true;
        
        const answers = this.collectAnswers();
        const result = validateFractionAnswer(
            this.gameState.currentFracData, 
            answers
        );
        
        if (result.isCorrect) {
            this.handleCorrectAnswer(result);
        } else {
            this.handleIncorrectAnswer();
        }
    }
    
    collectAnswers() {
        const getVal = (id) => {
            const el = document.getElementById(id);
            return el && el.textContent.trim() !== '' ? 
                parseInt(el.textContent.trim()) : 0;
        };
        
        return {
            whole: getVal('ans-w'),
            num: getVal('ans-num'),
            den: getVal('ans-den')
        };
    }
    
    handleCorrectAnswer(result) {
        const pi = this.gameState.currentFracPlayer;
        
        if (this.gameState.currentFracAttempts === 0) {
            if (result.originalIsReducible && result.answeredInLowestTerms) {
                this.modalManager.hideFractionPopup();
                document.getElementById('snakes-numpad')?.classList.remove('show');
                this.onBonusCard(pi);
            } else if (result.originalIsReducible && !result.answeredInLowestTerms) {
                this.modalManager.addLogMessage(
                    `${this.gameState.players[pi].name} didn't reduce to lowest terms. No bonus!`, 
                    'info'
                );
                this.modalManager.hideFractionPopup();
                document.getElementById('snakes-numpad')?.classList.remove('show');
                this.onStandardCard(pi);
            } else {
                this.modalManager.hideFractionPopup();
                document.getElementById('snakes-numpad')?.classList.remove('show');
                this.onStandardCard(pi);
            }
        } else {
            this.modalManager.hideFractionPopup();
            document.getElementById('snakes-numpad')?.classList.remove('show');
            this.onComplete();
        }
    }
    
    handleIncorrectAnswer() {
        this.gameState.currentFracAttempts++;
        
        if (this.gameState.currentFracAttempts >= 5) {
            this.modalManager.hideFractionPopup();
            document.getElementById('snakes-numpad')?.classList.remove('show');
            this.modalManager.addLogMessage(
                `${this.gameState.players[this.gameState.currentFracPlayer].name} failed 5 times!`,
                'error'
            );
            // Trigger win for opponent
            const winner = 1 - this.gameState.currentFracPlayer;
            this.gameState.state = 6; // GAME_OVER
            this.modalManager.showWinOverlay(
                this.gameState.players[winner].name,
                "Opponent failed 5 fraction questions!"
            );
            return;
        }
        
        const popupEq = document.getElementById('popupEq');
        popupEq.classList.add('error-shake');
        setTimeout(() => {
            popupEq.classList.remove('error-shake');
            this.gameState.isProcessingAnswer = false;
        }, 400);
        
        this.modalManager.addLogMessage(
            `Incorrect! Attempt ${this.gameState.currentFracAttempts}/5. Try again.`,
            'error'
        );
    }
}

// Global function for HTML button
window.submitFractionAnswer = () => {
    if (window.game?.fractionManager) {
        window.game.fractionManager.submitAnswer();
    }
};