// canvas.js - Graspable Math Canvas Integration
// Handles equation rendering, manipulation, and solution checking

let gmathInstance = null;
let canvasContainer = null;
let currentEquation = null;
let manualAnswerCallback = null;

export async function initCanvas() {
  return new Promise((resolve, reject) => {
    // Wait for Graspable Math to load
    if (window.GMath) {
      setupCanvas();
      resolve();
    } else {
      const checkInterval = setInterval(() => {
        if (window.GMath) {
          clearInterval(checkInterval);
          setupCanvas();
          resolve();
        }
      }, 100);
      
      setTimeout(() => {
        clearInterval(checkInterval);
        console.warn('Graspable Math failed to load, using manual input mode');
        showManualInputFallback();
        resolve();
      }, 10000);
    }
  });
}

function setupCanvas() {
  canvasContainer = document.getElementById('gm-fs-canvas');
  if (!canvasContainer) return;
  
  try {
    gmathInstance = new window.GMath({
      container: canvasContainer,
      options: {
        mode: 'equation',
        enableKeyboard: true,
        showMenu: true,
        showToolbar: true,
        theme: 'dark',
        backgroundColor: '#0c0c0c'
      }
    });
    
    // Listen for solution events
    gmathInstance.on('change', (state) => {
      checkIfSolved(state);
    });
    
    console.log('Graspable Math initialized');
  } catch (error) {
    console.error('Failed to initialize Graspable Math:', error);
    showManualInputFallback();
  }
}

function showManualInputFallback() {
  if (!canvasContainer) return;
  canvasContainer.innerHTML = `
    <div class="eq-fallback-fs">
      <div>
        <div> Manual Equation Solver</div>
        <div style="font-size: 14px; margin-top: 16px; margin-bottom: 20px;">
          Current problem: <strong id="fallback-problem" style="color: #ffcc00;">—</strong>
        </div>
        <div style="margin-top: 20px;">
          <textarea id="manual-solution" rows="3" placeholder="Enter your solution here..." 
                 style="width: 100%; padding: 12px; font-family: monospace; background: #1a1a1a; border: 1px solid #333; color: white; border-radius: 4px;"></textarea>
          <div style="margin-top: 12px; display: flex; gap: 10px; justify-content: center;">
            <button id="manual-check-btn" style="padding: 10px 24px; background: #ffcc00; border: none; cursor: pointer; font-weight: bold; border-radius: 4px;">
              Check Answer
            </button>
            <button id="manual-reset-btn" style="padding: 10px 24px; background: #333; border: none; cursor: pointer; color: white; border-radius: 4px;">
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
  
  const checkBtn = document.getElementById('manual-check-btn');
  if (checkBtn) {
    checkBtn.addEventListener('click', () => {
      const solutionInput = document.getElementById('manual-solution');
      const userAnswer = solutionInput?.value.trim();
      if (userAnswer && window.checkManualSolution) {
        window.checkManualSolution(userAnswer);
      } else if (userAnswer && manualAnswerCallback) {
        manualAnswerCallback(userAnswer);
      }
    });
  }
  
  const resetBtn = document.getElementById('manual-reset-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      const solutionInput = document.getElementById('manual-solution');
      if (solutionInput) solutionInput.value = '';
    });
  }
}

export function showManualInput(wordProblem, hint, onAnswerSubmit) {
  manualAnswerCallback = onAnswerSubmit;
  
  if (!canvasContainer) return;
  
  canvasContainer.innerHTML = `
    <div class="eq-fallback-fs">
      <div style="max-width: 600px; margin: 0 auto; text-align: left;">
        <div style="font-size: 18px; margin-bottom: 20px; color: #ffcc00; font-weight: bold;">${escapeHtml(wordProblem?.substring(0, 100) || 'Problem')}</div>
        <div style="font-size: 14px; margin-bottom: 20px; color: #aaa; padding: 12px; background: #1a1a1a; border-left: 3px solid #ffcc00;">
           ${escapeHtml(hint || 'Think carefully about the concept and enter your answer below.')}
        </div>
        <div style="margin-top: 20px;">
          <textarea id="manual-solution" rows="4" placeholder="Enter your answer here..." 
                 style="width: 100%; padding: 12px; font-family: monospace; background: #1a1a1a; border: 1px solid #333; color: white; border-radius: 4px; font-size: 14px;"></textarea>
          <div style="margin-top: 16px; display: flex; gap: 12px; justify-content: center;">
            <button id="manual-check-btn" style="padding: 12px 28px; background: #ffcc00; border: none; cursor: pointer; font-weight: bold; border-radius: 4px; font-size: 14px;">
              ✓ Submit Answer
            </button>
            <button id="manual-reset-btn" style="padding: 12px 28px; background: #333; border: none; cursor: pointer; color: white; border-radius: 4px; font-size: 14px;">
              ↺ Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
  
  const checkBtn = document.getElementById('manual-check-btn');
  if (checkBtn) {
    checkBtn.addEventListener('click', () => {
      const solutionInput = document.getElementById('manual-solution');
      const userAnswer = solutionInput?.value.trim();
      if (userAnswer && manualAnswerCallback) {
        manualAnswerCallback(userAnswer);
      } else if (userAnswer && window.checkManualSolution) {
        window.checkManualSolution(userAnswer);
      } else {
        const statusBar = document.getElementById('status-bar');
        if (statusBar) {
          statusBar.textContent = 'Please enter your answer';
          statusBar.className = 'status-bar error';
          setTimeout(() => statusBar.className = 'status-bar', 2000);
        }
      }
    });
  }
  
  const resetBtn = document.getElementById('manual-reset-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      const solutionInput = document.getElementById('manual-solution');
      if (solutionInput) solutionInput.value = '';
    });
  }
}

export async function loadEquation(equation) {
  currentEquation = equation;
  
  const fallbackProblem = document.getElementById('fallback-problem');
  if (fallbackProblem) fallbackProblem.textContent = equation;
  
  if (gmathInstance && equation) {
    try {
      await gmathInstance.setEquation(equation);
      console.log('Equation loaded:', equation);
      return true;
    } catch (error) {
      console.error('Failed to load equation:', error);
      showManualInputFallback();
      return false;
    }
  } else if (!gmathInstance) {
    showManualInputFallback();
  }
  return false;
}

export async function getCurrentEquation() {
  if (gmathInstance) {
    try {
      return await gmathInstance.getEquation();
    } catch (error) {
      return currentEquation;
    }
  }
  return currentEquation;
}

export async function checkSolution(expectedEquation) {
  if (!gmathInstance) {
    return false;
  }
  
  try {
    const current = await gmathInstance.getEquation();
    const expected = expectedEquation || currentEquation;
    
    // Normalize both equations for comparison
    const normalizedCurrent = normalizeEquation(current);
    const normalizedExpected = normalizeEquation(expected);
    
    const isCorrect = normalizedCurrent === normalizedExpected;
    
    if (isCorrect) {
      console.log('✅ Solution correct!');
    }
    
    return isCorrect;
  } catch (error) {
    console.error('Error checking solution:', error);
    return false;
  }
}

function normalizeEquation(eq) {
  if (!eq) return '';
  
  // Remove whitespace
  let normalized = eq.replace(/\s/g, '');
  
  // Normalize common variations
  normalized = normalized
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/−/g, '-')
    .replace(/→/g, '=')
    .replace(/⇒/g, '=')
    .replace(/\\cdot/g, '*')
    .replace(/\\times/g, '*');
  
  return normalized;
}

function checkIfSolved(state) {
  // This is called when the equation changes
  // We can check if it matches a known solution form
  if (state && state.equation) {
    const isIsolated = /^[a-z]\s*=\s*[-]?\d+/.test(state.equation);
    if (isIsolated) {
      console.log('Equation solved to isolated variable form');
      if (window.onSolutionCorrect) window.onSolutionCorrect();
    }
  }
}

export function resetCanvas() {
  if (gmathInstance) {
    gmathInstance.clear();
  }
  currentEquation = null;
  const manualSolution = document.getElementById('manual-solution');
  if (manualSolution) manualSolution.value = '';
}

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}