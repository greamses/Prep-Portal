// modules/state-manager.js

export const appState = {
  classId: null,
  topic: null,
  method: 'transfer',
  solvedCount: 0,
  currentGoal: null,
  gmCanvas: null,
  isGMLoaded: false,
  geminiKey: null,
  layoutManager: null,
};

export function updateState(updates) {
  Object.assign(appState, updates);
  
  if (updates.solvedCount !== undefined) {
    const countEl = document.getElementById('stat-count');
    if (countEl) countEl.innerText = appState.solvedCount;
  }
  if (updates.classId !== undefined) {
    const optionText = document.querySelector(`.cdd-option[data-value="${appState.classId}"]`)?.innerText;
    const classEl = document.getElementById('stat-class');
    if (classEl) classEl.innerText = optionText || '—';
  }
  if (updates.topic !== undefined) {
    const topicEl = document.getElementById('stat-topic');
    if (topicEl) topicEl.innerText = appState.topic || '—';
  }
}

export function setGeminiKey(key) {
  appState.geminiKey = key || null;
  
  const display = document.getElementById('gemini-key-display');
  const dot = document.getElementById('gemini-key-dot');
  
  if (key) {
    if (display) {
      display.value = '✓ Key Loaded ✓';
      display.classList.add('key-filled');
      display.placeholder = 'Key loaded ✓';
    }
    if (dot) {
      dot.classList.add('key-dot--ok');
      dot.classList.remove('key-dot--missing');
      dot.title = 'Gemini key ready';
    }
  } else {
    if (display) {
      display.value = '';
      display.classList.remove('key-filled');
      display.placeholder = 'Not loaded — add key in API Keys';
    }
    if (dot) {
      dot.classList.add('key-dot--missing');
      dot.classList.remove('key-dot--ok');
      dot.title = 'Gemini key missing';
    }
  }
}