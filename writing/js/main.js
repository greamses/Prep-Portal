/* ═══════════════════════════════════════════════════════
   PREPBOT — MAIN ENTRY POINT
═══════════════════════════════════════════════════════ */

import { $, currentTopic, setCurrentTopic, commentCounter, setCommentCounter, resetCommentStore } from './config.js';
import { gradeEssay } from './api.js';
import { initPopover, setupPopoverListeners } from './popover.js';
import { initRender, renderResults, clearResultsAccordions, resetParagraphState } from './render.js';
import { initEditorAccordions, syncTopicDisplay, openModal, closeModal, injectRewriteStyles } from './ui.js';

// ── DOM Refs ───────────────────────────────────────────
const elTopicBox = $('topic-box');
const elTopic = $('topic-display');
const elTextarea = $('writing-area');
const elWordCount = $('word-count');
const elSubmitBtn = $('submit-btn');
const elEditorSec = $('editor-section');
const elResultsSec = $('results-section');
const elLoading = $('loading-overlay');
const elRubric = $('rubric-content');
const elAnnotated = $('annotated-text');
const elStamp = $('score-stamp');
const elRetryBtn = $('retry-btn');
const elPopover = $('mark-popover');
const elModal = $('topic-modal');

// ── Comment Popover ────────────────────────────────────
const elCommentPop = document.createElement('div');
elCommentPop.id = 'comment-popover';
document.body.appendChild(elCommentPop);

// ── Init Modules ───────────────────────────────────────
initRender(elRubric, elAnnotated, elStamp, elLoading, elEditorSec, elResultsSec);
initPopover(elPopover, elCommentPop, elAnnotated);
setupPopoverListeners();

// ── Word Count ─────────────────────────────────────────
elTextarea.addEventListener('input', () => {
  const words = elTextarea.value.trim() ? elTextarea.value.trim().split(/\s+/).length : 0;
  elWordCount.textContent = words;
  elSubmitBtn.disabled = words < 20;
});

// ── Submit ─────────────────────────────────────────────
elSubmitBtn.addEventListener('click', async () => {
  const userText = elTextarea.value.trim();
  if (!userText) return;
  
  elLoading.classList.add('active');
  
  try {
    const data = await gradeEssay(userText);
    renderResults(data, userText);
  } catch (err) {
    console.error("Grading failed:", err);
    alert(err.message.includes('API Error') ?
      "API Connection Error: We've hit a rate limit or key error. Wait a moment and try again." :
      "Grading error — the AI returned unexpected data. Please try again.");
    elLoading.classList.remove('active');
  }
});

// ── Retry ──────────────────────────────────────────────
elRetryBtn?.addEventListener('click', () => {
  elResultsSec.classList.remove('active');
  elEditorSec.style.display = 'block';
  elTextarea.value = '';
  elWordCount.textContent = '0';
  elSubmitBtn.disabled = true;
  
  setCommentCounter(0);
  resetCommentStore();
  
  document.getElementById('para-nav')?.remove();
  document.getElementById('rewrite-info-btn')?.remove();
  document.getElementById('rewrite-info-note')?.remove();
  
  resetParagraphState();
  clearResultsAccordions();
  
  const body = $('acc-body-topic');
  if (body) {
    body.style.display = '';
    document.querySelector('#acc-topic .acc-chevron')?.classList.add('open');
  }
  syncTopicDisplay();
  
  window.scrollTo({ top: 0, behavior: 'smooth' });
  elTextarea.focus();
});

// ── New Topic Button ───────────────────────────────────
$('new-topic-btn')?.addEventListener('click', () => {
  const body = $('acc-body-topic');
  if (body) {
    body.style.display = '';
    document.querySelector('#acc-topic .acc-chevron')?.classList.add('open');
    body.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  } else {
    openModal(elModal);
  }
});

// ── Modal Close ────────────────────────────────────────
$('close-modal')?.addEventListener('click', () => closeModal(elModal));
elModal?.addEventListener('click', e => { if (e.target === elModal) closeModal(elModal); });

// ── Init ───────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  injectRewriteStyles();
  initEditorAccordions(elTextarea);
  openModal(elModal);
});

// ── Expose for debugging (optional) ────────────────────
window.PrepbotState = { currentTopic, commentCounter };