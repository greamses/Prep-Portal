/* ════════════════════════════════════════
   modal.js
════════════════════════════════════════ */
import { state } from '../state.js';
import { getSlotData, getSelectedTopicLabels } from './setup-form.js';
import { handleVideoBtn } from './video.js';
import { RichTextEngine, initTextFormatting, initMathJax } from './ui-helpers.js';

let mathTimeout = null;

export function initModal() {
  // Initialize Formatting Helpers once
  initTextFormatting();
  initMathJax();
  
  document.getElementById('begin-btn').addEventListener('click', _openModal);
  document.getElementById('modal-close').addEventListener('click', _closeModal);
  document.getElementById('cancel-btn').addEventListener('click', _closeModal);
  document.getElementById('new-q-btn').addEventListener('click', _closeModal);
  
  document.getElementById('modal').addEventListener('click', function(e) {
    if (e.target === this && document.getElementById('phase-write').style.display !== 'none')
      _closeModal();
  });
  
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') _closeModal();
  });
  
  document.getElementById('submit-btn').addEventListener('click', async function() {
    
    paper.innerHTML = html;
    
    // INITIALIZE THE TOOLBAR
    RichTextEngine.init();
    // When Submit is clicked:
    const answers = [];
    document.querySelectorAll('.paper-editable').forEach((ed, i) => {
      answers[i] = ed.innerHTML;
    });
    
    this.disabled = true;
    this.textContent = 'Marking…';
    _showPhase('results');
    
    await TheoryAnalyser.analyseAll(getSlotData(), answers, state.st.name, state.submissionDate);
    
    this.disabled = false;
    this.textContent = 'Submit for Marking';
  });
  
  document.getElementById('try-again-btn').addEventListener('click', () => {
    _showPhase('write');
    document.querySelectorAll('.paper-editable').forEach(ed => ed.innerHTML = '');
    _updateWC();
    setTimeout(() => document.querySelector('.paper-editable')?.focus(), 80);
  });
  
  document.getElementById('print-btn').addEventListener('click', () => {
    const paper = document.querySelector('#theory-results .ta-paper');
    if (paper)
      document.getElementById('print-sheet').innerHTML = `<div class="ta-root">${paper.outerHTML}</div>`;
    window.print();
  });
}

function _openModal() {
  const slots = getSlotData();
  const trackLabel = state.st.track ? ` · ${state.st.track.charAt(0).toUpperCase() + state.st.track.slice(1)}` : '';
  const levelForAI = state.st.cls + (state.st.track ? ` (${state.st.track})` : '');
  
  document.getElementById('mhdr-sub').textContent = state.st.subject;
  document.getElementById('mhdr-cls').textContent = state.st.cls + trackLabel;
  document.getElementById('mhdr-name').textContent = state.st.name;
  
  state.submissionDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  
  const paper = document.getElementById('exam-paper');
  let html = `
    <div class="paper-hdr">
      <div class="paper-info">
        <span class="paper-field">Name:<span class="paper-field-val">${state.st.name}</span></span>
        <span class="paper-field">Subject:<span class="paper-field-val">${state.st.subject}</span></span>
        <span class="paper-field">Class:<span class="paper-field-val">${state.st.cls}${trackLabel}</span></span>
        <span class="paper-field">Date:<span class="paper-field-val">${state.submissionDate}</span></span>
      </div>
    </div>`;
  
  slots.forEach((q, i) => {
    /* Inside _openModal template loop */
    html += `
  <div class="paper-q-block" data-qidx="${i}">
    <div class="paper-q-label">
      <span class="paper-q-num">Question ${i + 1}</span>
      ${q.compulsory ? `<span class="paper-q-compulsory">★ Compulsory</span>` : `<span class="paper-field">Optional</span>`}
      ${q.marks ? `<span style="margin-left:auto" class="paper-field">${q.marks} marks</span>` : ''}
    </div>
    <div class="paper-q-text">${q.text}</div>
    <div class="paper-q-prompt">Answer:</div>
    
    <!-- This div replaces your old paper-ta -->
    <div class="paper-editable" 
         id="editor-${i}" 
         contenteditable="true" 
         data-qidx="${i}" 
         data-placeholder="Write your answer here…"
         spellcheck="true"></div>

    <div class="paper-video-row" id="video-row-${i}">
      <button class="paper-video-btn" data-qidx="${i}"
        data-qtext="${q.text.replace(/"/g, '&quot;')}" type="button">▶ Watch Video</button>
    </div>
  </div>`;
  });
  
  paper.innerHTML = html;
  
  // Set up listeners for the editable divs
  paper.querySelectorAll('.paper-editable').forEach(ed => {
    ed.addEventListener('input', () => {
      _updateWC();
      
      // Live MathJax Rendering (Debounced)
      clearTimeout(mathTimeout);
      mathTimeout = setTimeout(() => {
        if (window.MathJax && window.MathJax.typesetPromise) {
          window.MathJax.typesetPromise([ed]).catch((err) => console.log(err.message));
        }
      }, 1500);
    });
  });
  
  paper.querySelectorAll('.paper-video-btn').forEach(btn =>
    btn.addEventListener('click', () => handleVideoBtn(btn)));
  
  _updateWC();
  _showPhase('write');
  
  TheoryAnalyser.init({
    geminiKey: state.GEMINI_KEY,
    subject: state.st.subject,
    level: levelForAI,
    topics: getSelectedTopicLabels(),
    mountId: 'theory-results',
  });
  
  const modal = document.getElementById('modal');
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  
  // Focus first editor
  setTimeout(() => paper.querySelector('.paper-editable')?.focus(), 260);
}

function _closeModal() {
  document.getElementById('modal').classList.remove('open');
  document.getElementById('modal').setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function _showPhase(phase) {
  const pw = document.getElementById('phase-write');
  const pr = document.getElementById('phase-results');
  const fw = document.getElementById('ftr-write');
  const fr = document.getElementById('ftr-results');
  if (phase === 'write') {
    pw.style.display = 'block';
    pr.style.display = 'none';
    fw.style.display = 'flex';
    fr.style.display = 'none';
    document.getElementById('mhdr-phase').textContent = 'Write';
    document.getElementById('theory-results').innerHTML = '';
  } else {
    pw.style.display = 'none';
    pr.style.display = 'block';
    fw.style.display = 'none';
    fr.style.display = 'flex';
    document.getElementById('mhdr-phase').textContent = 'Results';
    document.getElementById('modal-body').scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function _updateWC() {
  const all = document.querySelectorAll('.paper-editable');
  let total = 0;
  
  all.forEach(ed => {
    const text = ed.innerText.trim();
    if (text) total += text.split(/\s+/).length;
  });
  
  document.getElementById('wc').textContent = total;
  
  const slots = getSlotData();
  const compulsoryIndices = slots
    .map((s, i) => s.compulsory ? i : null)
    .filter(i => i !== null);
  
  const compulsoryDone = compulsoryIndices.every(idx => {
    const ed = document.getElementById(`editor-${idx}`);
    return ed && ed.innerText.trim().length > 3;
  });
  
  // Enable submit if word count >= 5 and all compulsory questions are answered
  document.getElementById('submit-btn').disabled = !(total >= 5 && (compulsoryIndices.length === 0 || compulsoryDone));
}