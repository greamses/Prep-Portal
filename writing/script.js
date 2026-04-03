/* ═══════════════════════════════════════════════════════
   PREPBOT — MAIN  (entry point, load this LAST)
   Requires: all other proofreader.*.js files
   Load order:
     1. proofreader.config.js
     2. proofreader.ui.js
     3. proofreader.api.js
     4. proofreader.render.js
     5. proofreader.popover.js
     6. proofreader.main.js   ← this file
   Styles:
     <link rel="stylesheet" href="proofreader.css">
     (proofreader.styles.js has been removed — CSS is now external)
═══════════════════════════════════════════════════════ */

/* ─────────────────────────────────────────────────────
   DOM REF SHORTCUT
─────────────────────────────────────────────────────── */
const $ = id => document.getElementById(id);

/* ─────────────────────────────────────────────────────
   DOM REFS  (elements assumed present in the HTML)
─────────────────────────────────────────────────────── */
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

/* Persistent comment popover (singleton — appended once) */
const elCommentPop = document.createElement('div');
elCommentPop.id = 'comment-popover';
document.body.appendChild(elCommentPop);

/* ─────────────────────────────────────────────────────
   SHARED STATE  (mutated by api.js / render.js / popover.js)
─────────────────────────────────────────────────────── */
let currentTopic = "";
let activeEl = null;
let commentCounter = 0;
let commentStore = {};
let moveSourceEl = null;
let moveHandler = null;

/* ─────────────────────────────────────────────────────
   WORD COUNT  — enable submit button at 20 words
─────────────────────────────────────────────────────── */
elTextarea.addEventListener('input', () => {
  const words = elTextarea.value.trim() ? elTextarea.value.trim().split(/\s+/).length : 0;
  elWordCount.textContent = words;
  elSubmitBtn.disabled = words < 20;
});

/* ─────────────────────────────────────────────────────
   SUBMIT
─────────────────────────────────────────────────────── */
elSubmitBtn.addEventListener('click', async () => {
  const userText = elTextarea.value.trim();
  if (!userText) return;
  
  elLoading.classList.add('active');
  
  try {
    const data = await gradeEssay(userText);
    renderResults(data, userText);
  } catch (err) {
    console.error("Grading failed:", err);
    
    if (err.message.includes('API Error')) {
      alert("API Connection Error: We've hit a rate limit or key error. Wait a moment and try again.");
    } else {
      alert("Grading error — the AI returned unexpected data. Please try again.");
    }
    
    elLoading.classList.remove('active');
  }
});

/* ─────────────────────────────────────────────────────
   RETRY  — return to editor, keep current topic, reset state
─────────────────────────────────────────────────────── */
elRetryBtn?.addEventListener('click', () => {
  elResultsSec.classList.remove('active');
  elEditorSec.style.display = 'block';
  elTextarea.value = '';
  elWordCount.textContent = '0';
  elSubmitBtn.disabled = true;
  commentCounter = 0;
  commentStore = {};
  
  /* Remove stale elements */
  document.getElementById('para-nav')?.remove();
  document.getElementById('rewrite-info-btn')?.remove();
  document.getElementById('rewrite-info-note')?.remove();
  
  /* Reset paragraph nav state */
  paragraphChunks = [];
  currentParagraphIdx = 0;
  paraNavShowAll = false;
  
  /* Clear previous results panels */
  _clearResultsAccordions();
  
  /* Re-expand topic accordion and sync topic display */
  const body = $('acc-body-topic');
  if (body) {
    body.style.display = '';
    const chevron = document.querySelector('#acc-topic .acc-chevron');
    if (chevron) chevron.classList.add('open');
  }
  syncTopicDisplay();
  
  /* Scroll back to top so editor is fully visible */
  window.scrollTo({ top: 0, behavior: 'smooth' });
  elTextarea.focus();
});

/* ─────────────────────────────────────────────────────
   NEW TOPIC BUTTON — scroll to / expand topic accordion
─────────────────────────────────────────────────────── */
$('new-topic-btn')?.addEventListener('click', () => {
  const body = $('acc-body-topic');
  if (body) {
    body.style.display = '';
    const chevron = document.querySelector('#acc-topic .acc-chevron');
    if (chevron) chevron.classList.add('open');
    body.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  } else {
    openModal();
  }
});

/* ─────────────────────────────────────────────────────
   MODAL CLOSE (kept for compatibility)
─────────────────────────────────────────────────────── */
$('close-modal')?.addEventListener('click', closeModal);
elModal?.addEventListener('click', e => { if (e.target === elModal) closeModal(); });

/* ─────────────────────────────────────────────────────
   INIT
─────────────────────────────────────────────────────── */
window.addEventListener('DOMContentLoaded', () => {
  _injectRewriteStyles();
  initEditorAccordions();
  openModal(); /* expand topic accordion on first load */
});

/* ─────────────────────────────────────────────────────
   REWRITE STAMP STYLES  — injected once
─────────────────────────────────────────────────────── */
function _injectRewriteStyles() {
  if (document.getElementById('rewrite-injected-css')) return;
  const s = document.createElement('style');
  s.id = 'rewrite-injected-css';
  s.textContent = `
    .score-stamp.rewrite-stamp {
      background: #0a0a0a;
      color: #fff;
      font-size: clamp(1.4rem, 5vw, 2rem);
      letter-spacing: .04em;
      padding: .4em .7em;
    }
    .rewrite-stamp-wrap {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
    }
    #rewrite-info-btn {
      width: 26px; height: 26px;
      border-radius: 50%;
      border: 2px solid #0a0a0a;
      background: #fff;
      color: #0a0a0a;
      font-weight: 800;
      font-size: .85rem;
      cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
      box-shadow: 2px 2px 0 #0a0a0a;
      transition: background .15s, color .15s;
    }
    #rewrite-info-btn:hover { background: #0a0a0a; color: #fff; }
    #rewrite-info-note {
      margin-top: 10px;
      padding: 12px 14px;
      background: #fffbe6;
      border: 2px solid #0a0a0a;
      box-shadow: 3px 3px 0 #0a0a0a;
      font-size: .875rem;
      line-height: 1.5;
      max-width: 480px;
    }
  `;
  document.head.appendChild(s);
}




/* ═══════════════════════════════════════════════════════
   PREPBOT — RENDER LAYER
   Requires: proofreader.config.js, proofreader.ui.js,
             proofreader.popover.js
═══════════════════════════════════════════════════════ */

/* ── Paragraph nav state ── */
let paragraphChunks = [];
let currentParagraphIdx = 0;
let paraNavShowAll = false;

/* ─────────────────────────────────────────────────────
   PARSE ANNOTATED HTML → RAW SPAN TAGS
   Converts the AI's custom XML tags into HTML spans.
─────────────────────────────────────────────────────── */
function parseAnnotatedHtml(raw) {
  let html = raw
    .replace(/\\n\\n/g, '\n\n')
    .replace(/\n\n/g, '<br><br>')
    .replace(/\n/g, '<br>');
  
  /* 1. Standard <mark> error tags */
  html = html.replace(
    /<mark\s+type=['"]([^'"]+)['"]\s*(?:fix=['"]([^'"]*?)['"])?\s*(?:loss=['"]([^'"]*?)['"])?>([\s\S]*?)<\/mark>/gi,
    (_, type, fix, loss, content) => {
      const fixAttr = fix ? ` data-fix="${safe(fix)}"` : '';
      const lossAttr = loss ? ` data-loss="${safe(loss)}"` : '';
      const deduction = loss ? `<span class="deduction">${safe(loss)}</span>` : '';
      const label = (ERROR_TYPES[type] || { name: type }).name;
      return `<span class="doodle doodle-${safe(type)}"${fixAttr}${lossAttr} tabindex="0" role="button" aria-label="${label}: click for options">${content}${deduction}</span>`;
    }
  );
  
  /* 2. Colour highlights */
  html = html.replace(
    /<hl\s+cat=['"]([^'"]+)['"]>([\s\S]*?)<\/hl>/gi,
    (_, cat, content) => `<span class="hl-${safe(cat)}">${content}</span>`
  );
  
  /* 3. Positive feedback */
  html = html.replace(
    /<good\s+reason=['"]([^'"]+)['"]>([\s\S]*?)<\/good>/gi,
    (_, reason, content) => `<span class="hl-good" title="${safe(reason)}">${content}</span>`
  );
  
  /* 4. Margin comments */
  html = html.replace(
    /<comment\s+text=['"]([^'"]+)['"]>([\s\S]*?)<\/comment>/gi,
    (_, text) => {
      const id = ++commentCounter;
      commentStore[id] = text;
      return `<button class="margin-comment-marker" data-cid="${id}">${id}</button>`;
    }
  );
  
  /* 5. Word substitutions */
  html = html.replace(
    /<sub\s+opts=['"]([^'"]+)['"]>([^<]+)<\/sub>/gi,
    (_, opts, word) =>
    `<span class="sub-word" data-opts="${safe(opts)}" data-type="word">${word}</span>`
  );
  
  /* 6. Sentence rewrites */
  html = html.replace(
    /<sent\s+opts=['"]([^'"]+)['"]>([\s\S]*?)<\/sent>/gi,
    (_, opts, sentence) =>
    `<span class="sent-sub" data-opts="${safe(opts)}" data-type="sent">${sentence}</span>`
  );
  
  return html;
}

/* ─────────────────────────────────────────────────────
   ATTACH EVENT LISTENERS to a container element
   (called after each paragraph render or full render)
─────────────────────────────────────────────────────── */
function attachAnnotationListeners(container) {
  container.querySelectorAll('.doodle').forEach(el => {
    el.addEventListener('click', e => { e.stopPropagation();
      openAnnotationPopover(el); });
    el.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault();
        openAnnotationPopover(el); }
    });
  });
  
  container.querySelectorAll('.sub-word, .sent-sub').forEach(el => {
    el.addEventListener('click', e => { e.stopPropagation();
      openAnnotationPopover(el); });
  });
  
  container.querySelectorAll('.margin-comment-marker').forEach(marker => {
    marker.addEventListener('click', e => { e.stopPropagation();
      showComment(marker); });
  });
}

/* ─────────────────────────────────────────────────────
   PARAGRAPH NAV  — build / update UI
─────────────────────────────────────────────────────── */
function buildParagraphNav() {
  document.getElementById('para-nav')?.remove();
  
  if (paragraphChunks.length <= 1) return;
  
  const nav = document.createElement('div');
  nav.id = 'para-nav';
  nav.innerHTML = `
    <button class="para-nav-btn" id="para-prev" ${currentParagraphIdx === 0 ? 'disabled' : ''}>← Prev</button>
    <span id="para-nav-label">Paragraph ${currentParagraphIdx + 1} of ${paragraphChunks.length}</span>
    <button class="para-nav-btn" id="para-next" ${currentParagraphIdx === paragraphChunks.length - 1 ? 'disabled' : ''}>Next →</button>
    <button class="para-nav-btn show-all" id="para-showall">${paraNavShowAll ? 'Collapse' : 'Show All'}</button>`;
  
  const paper = elAnnotated.closest('.annotated-paper') || elAnnotated.parentNode;
  paper.parentNode.insertBefore(nav, paper);
  
  document.getElementById('para-prev').addEventListener('click', () => {
    if (currentParagraphIdx > 0) showParagraph(currentParagraphIdx - 1);
  });
  
  document.getElementById('para-next').addEventListener('click', () => {
    if (currentParagraphIdx < paragraphChunks.length - 1) showParagraph(currentParagraphIdx + 1);
  });
  
  document.getElementById('para-showall').addEventListener('click', () => {
    paraNavShowAll = !paraNavShowAll;
    if (paraNavShowAll) {
      elAnnotated.innerHTML = paragraphChunks.join('<br><br>');
      attachAnnotationListeners(elAnnotated);
    } else {
      showParagraph(currentParagraphIdx);
    }
    buildParagraphNav();
  });
}

function showParagraph(index) {
  currentParagraphIdx = index;
  paraNavShowAll = false;
  elAnnotated.innerHTML = paragraphChunks[index];
  attachAnnotationListeners(elAnnotated);
  buildParagraphNav();
  elAnnotated.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/* ─────────────────────────────────────────────────────
   HELPERS
─────────────────────────────────────────────────────── */
function _clearResultsAccordions() {
  document.getElementById('acc-suggestions')?.remove();
  document.getElementById('acc-studytips')?.remove();
  /* Leave the container div itself — it will be reused on next render */
}

/* Show the REWRITE stamp with a toggleable 'i' info note */
function _showRewriteStamp(reason) {
  /* Clear any previous results content */
  elRubric.innerHTML = '';
  elAnnotated.innerHTML = '';
  _clearResultsAccordions();
  document.getElementById('para-nav')?.remove();
  
  /* Stamp */
  elStamp.textContent = 'REWRITE';
  elStamp.className = 'score-stamp rewrite-stamp';
  
  /* Remove old info elements if retrying off-topic twice */
  document.getElementById('rewrite-info-btn')?.remove();
  document.getElementById('rewrite-info-note')?.remove();
  
  /* Create the info (ℹ) button */
  const infoBtn = document.createElement('button');
  infoBtn.id = 'rewrite-info-btn';
  infoBtn.textContent = 'i';
  infoBtn.setAttribute('aria-label', 'Why REWRITE?');
  infoBtn.title = 'Tap to see why';
  
  /* Create the hidden note */
  const infoNote = document.createElement('div');
  infoNote.id = 'rewrite-info-note';
  infoNote.textContent = reason || 'Your essay does not address the given writing prompt.';
  infoNote.hidden = true;
  
  infoBtn.addEventListener('click', e => {
    e.stopPropagation();
    infoNote.hidden = !infoNote.hidden;
  });
  
  /* Append next to the stamp */
  const stampParent = elStamp.parentNode;
  stampParent.appendChild(infoBtn);
  stampParent.appendChild(infoNote);
}

/* ─────────────────────────────────────────────────────
   MAIN RENDER
─────────────────────────────────────────────────────── */
function renderResults(data, originalText) {
  
  /* ── Off-topic: show REWRITE stamp, skip everything else ── */
  if (data.offTopic) {
    _showRewriteStamp(data.offTopicReason || '');
    elLoading.classList.remove('active');
    elEditorSec.style.display = 'none';
    elResultsSec.classList.add('active');
    return;
  }
  
  /* ── Remove any stale REWRITE info elements ── */
  document.getElementById('rewrite-info-btn')?.remove();
  document.getElementById('rewrite-info-note')?.remove();
  
  /* ── Score stamp ── */
  const score = Math.min(100, Math.max(0, data.totalScore || 0));
  elStamp.textContent = `${score}%`;
  elStamp.className = `score-stamp${score < 55 ? ' fail' : score < 70 ? ' avg' : ''}`;
  
  /* ── Rubric bars ── */
  elRubric.innerHTML = '';
  const frag = document.createDocumentFragment();
  (data.rubric || []).forEach((item, i) => {
    const pct = Math.round((item.score / item.outOf) * 100);
    const col = pct >= 70 ? 'var(--green,#00a550)' : pct >= 50 ? 'var(--amber,#e67e00)' : 'var(--red,#ff2200)';
    const row = document.createElement('div');
    row.className = 'rubric-row';
    row.style.animationDelay = `${i * 0.06}s`;
    row.innerHTML = `
      <div class="rubric-cat">${safe(item.category)}</div>
      <div class="rubric-score" style="color:${col}">${item.score} / ${item.outOf}</div>
      <p class="rubric-fb">${safe(item.feedback)}</p>
      <div class="rubric-bar-track">
        <div class="rubric-bar-fill" data-pct="${pct}" style="background:${col}"></div>
      </div>`;
    frag.appendChild(row);
  });
  elRubric.appendChild(frag);
  
  requestAnimationFrame(() => requestAnimationFrame(() => {
    elRubric.querySelectorAll('.rubric-bar-fill').forEach(bar => {
      bar.style.width = bar.dataset.pct + '%';
    });
  }));
  
  /* ── Reset comment state ── */
  commentCounter = 0;
  commentStore = {};
  
  /* ── Build annotated HTML from AI response ── */
  const annotatedHtml = parseAnnotatedHtml(data.annotatedText || originalText);
  
  /* ── Split into paragraphs for nav ── */
  paragraphChunks = annotatedHtml.split('<br><br>').filter(p => p.trim());
  currentParagraphIdx = 0;
  paraNavShowAll = false;
  
  document.getElementById('para-nav')?.remove();
  
  if (paragraphChunks.length > 1) {
    elAnnotated.innerHTML = paragraphChunks[0];
    attachAnnotationListeners(elAnnotated);
    buildParagraphNav();
  } else {
    elAnnotated.innerHTML = annotatedHtml;
    attachAnnotationListeners(elAnnotated);
  }
  
  /* ── Suggestions & study tips ── */
  renderSuggestions(data.suggestions || []);
  renderStudyTips(data.studyTips || []);
  
  /* ── Transition to results view ── */
  elLoading.classList.remove('active');
  elEditorSec.style.display = 'none';
  elResultsSec.classList.add('active');
}

/* ─────────────────────────────────────────────────────
   SUGGESTIONS PANEL
─────────────────────────────────────────────────────── */
function renderSuggestions(suggestions) {
  let container = document.getElementById('results-accordions');
  if (!container) {
    container = document.createElement('div');
    container.id = 'results-accordions';
    const anchor = document.querySelector('.paper-scroll-wrap') ||
      document.querySelector('.annotated-paper') ||
      elAnnotated.parentNode;
    anchor.parentNode.insertBefore(container, anchor.nextSibling);
  }
  
  document.getElementById('acc-suggestions')?.remove();
  if (!suggestions.length) return;
  
  const bodyHtml = `
    <div class="sugg-list">
      ${suggestions.map((s, i) => `
        <div class="suggestion-item" style="animation-delay:${(i * 0.07).toFixed(2)}s">
          <div class="suggestion-num">${i + 1}</div>
          <div class="suggestion-text">${safe(s)}</div>
        </div>`).join('')}
    </div>`;
  
  container.appendChild(makeAccordion({
    id: 'suggestions',
    title: "Examiner's Suggestions",
    bodyHtml,
    startOpen: true,
    extraClass: 'sugg-acc',
    count: suggestions.length
  }));
}

/* ─────────────────────────────────────────────────────
   STUDY TIPS PANEL
─────────────────────────────────────────────────────── */
function renderStudyTips(tips) {
  let container = document.getElementById('results-accordions');
  if (!container) {
    container = document.createElement('div');
    container.id = 'results-accordions';
    elResultsSec.appendChild(container);
  }
  
  document.getElementById('acc-studytips')?.remove();
  if (!tips.length) return;
  
  const bodyHtml = `
    <div class="tips-body-grid">
      ${tips.map((t, i) => `
        <div class="study-tip-card" style="animation-delay:${(i * 0.08).toFixed(2)}s">
          <div class="study-tip-title">${safe(t.title || '')}</div>
          <div class="study-tip-text">${safe(t.tip   || '')}</div>
        </div>`).join('')}
    </div>`;
  
  container.appendChild(makeAccordion({
    id: 'studytips',
    title: 'Study Tips For You',
    bodyHtml,
    startOpen: false,
    extraClass: 'tips-acc'
  }));
}




/* ═══════════════════════════════════════════════════════
   PREPBOT — CONFIG & CONSTANTS
   Load this file FIRST.
═══════════════════════════════════════════════════════ */

/* ── API ── */
// Key is managed by auth.js — read from window.PrepPortalKeys at call time
function _getGeminiKey() {
  const key = window.PrepPortalKeys?.gemini || null;
  if (!key) throw new Error('No Gemini key found. Please sign in and add your key in Account Settings.');
  return key;
}

/*
 * Model fallback chain — tried in order.
 * When a model returns 429 (quota) or 503 (overload) the next is tried automatically.
 * The index of the last working model is remembered across calls so we don't keep
 * hammering an exhausted model on subsequent requests.
 */
const GEMINI_MODELS = [
  { label: 'Gemini 3.1 Flash-Lite', url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent' },
  { label: 'Gemini 3.1 Pro', url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-pro-preview:generateContent' },
  { label: 'Gemini 3 Flash', url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent' },
  { label: 'Gemini 2.5 Flash-Lite', url: 'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash-lite:generateContent' },
  { label: 'Gemini 2.5 Flash', url: 'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent' },
  { label: 'Gemini 2.5 Pro', url: 'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-pro:generateContent' },
];

/* Tracks which model we're currently on so exhausted ones are skipped on the next call */
let _geminiModelIdx = 0;

/* Status codes that mean "quota / overloaded — try the next model" */
const _QUOTA_CODES = new Set([429, 503, 529]);

/**
 * geminiPost(body)
 * Posts `body` JSON to each model in GEMINI_MODELS starting from _geminiModelIdx.
 * On quota errors it advances the index and retries the next model silently.
 * On any other HTTP error (4xx/5xx) it throws immediately.
 * Returns { res, data } for the first successful response.
 */
async function geminiPost(body) {
  for (let i = _geminiModelIdx; i < GEMINI_MODELS.length; i++) {
    const model = GEMINI_MODELS[i];
    let res;
    try {
      res = await fetch(`${model.url}?key=${_getGeminiKey()}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
    } catch (networkErr) {
      /* Network-level failure — treat like a transient error and try next model */
      console.warn(`[Gemini] Network error on ${model.label}:`, networkErr);
      continue;
    }
    
    if (_QUOTA_CODES.has(res.status)) {
      console.warn(`[Gemini] ${model.label} quota/overload (${res.status}) — trying next model`);
      _geminiModelIdx = i + 1; /* remember: skip this model next time too */
      continue;
    }
    
    if (!res.ok) {
      /* Non-quota error (e.g. 400 bad request) — don't silently swallow it */
      const errText = await res.text().catch(() => '');
      throw new Error(`API Error ${res.status} (${model.label}): ${errText}`);
    }
    
    /* Success — lock in this model for subsequent calls */
    if (_geminiModelIdx !== i) {
      console.info(`[Gemini] Now using: ${model.label}`);
      _geminiModelIdx = i;
    }
    const data = await res.json();
    return { res, data, label: model.label };
  }
  
  /* Every model exhausted */
  _geminiModelIdx = 0; /* reset for next page load attempt */
  throw new Error('API Error: All Gemini models are currently over quota. Please try again later.');
}

/* ── Error type metadata ── */
const ERROR_TYPES = {
  del: { name: 'Delete Word', desc: 'This word is unnecessary and should be removed from the sentence.' },
  ins: { name: 'Insert Missing Word', desc: 'A word is missing here. The suggested fix shows what to insert.' },
  cap: { name: 'Capitalise', desc: 'This word should begin with a capital letter — start of sentence or a proper noun.' },
  lc: { name: 'Make Lowercase', desc: 'This word is incorrectly capitalised in this position.' },
  trans: { name: 'Transpose / Swap Order', desc: 'The words in this phrase are in the wrong order and need to be swapped.' },
  para: { name: 'New Paragraph', desc: 'A new paragraph should begin at this point in the text.' },
  spell: { name: 'Spell Out Abbreviation', desc: 'Write this abbreviation out in full. Avoid abbreviations in formal writing.' },
  sp: { name: 'Misspelling', desc: 'This word is spelled incorrectly. Check a dictionary for the correct spelling.' },
  run: { name: 'Run-on Sentence', desc: 'Two or more independent clauses are fused without correct punctuation or a coordinating conjunction.' },
  frag: { name: 'Sentence Fragment', desc: 'This is not a complete sentence — it is missing a subject, a predicate, or both.' },
  punct: { name: 'Wrong Punctuation', desc: 'The punctuation mark here is incorrect or misplaced for this context.' },
  ww: { name: 'Wrong Word', desc: "Incorrect word choice — likely a homophone (e.g. there/their/they're) or confusion between similar words." },
  agr: { name: 'Subject-Verb Agreement', desc: 'The subject and verb do not agree in number or person. E.g. "The students was" should be "The students were".' },
  vt: { name: 'Wrong Verb Tense', desc: 'The verb tense used here does not match the time frame of the sentence or passage.' },
  art: { name: 'Article Error (a/an/the)', desc: 'Wrong or missing article. Article use depends on context and whether a noun is countable.' },
  prep: { name: 'Wrong Preposition', desc: 'Incorrect preposition used. Many are idiomatic, e.g. "interested in", not "interested on".' },
  rep: { name: 'Unnecessary Repetition', desc: 'This word or phrase appears too soon after its previous use. Vary your vocabulary.' },
  ref: { name: 'Unclear Pronoun Reference', desc: 'It is unclear which noun this pronoun refers to. Rewrite to remove the ambiguity.' },
  cs: { name: 'Comma Splice', desc: 'Two independent clauses joined only by a comma. Use a semicolon, a conjunction, or two separate sentences.' },
  wo: { name: 'Word Order Error', desc: 'The words are not in the standard English grammatical order for this phrase or clause.' },
  par: { name: 'Faulty Parallel Structure', desc: 'All items in a list must be in the same grammatical form (e.g. all gerunds or all infinitives).' },
};

/*
 * ── ERROR_ACTIONS ──────────────────────────────────────
 * Which action buttons to show in the popover per error type.
 *
 *  d  showDelete  — word should literally be removed
 *  m  showMove    — content is correct, just in wrong position
 *  c  showCustom  — free-text replacement field
 * ────────────────────────────────────────────────────── */
const ERROR_ACTIONS = {
  //           d       m      c
  del: { d: true, m: false, c: false },
  ins: { d: false, m: false, c: false },
  cap: { d: false, m: false, c: true },
  lc: { d: false, m: false, c: true },
  sp: { d: false, m: false, c: true },
  ww: { d: false, m: false, c: true },
  vt: { d: false, m: false, c: true },
  art: { d: false, m: false, c: true },
  prep: { d: false, m: false, c: true },
  agr: { d: false, m: false, c: true },
  ref: { d: false, m: false, c: true },
  rep: { d: true, m: false, c: true },
  cs: { d: false, m: false, c: true },
  wo: { d: false, m: false, c: true },
  trans: { d: false, m: true, c: false },
  para: { d: true, m: false, c: false },
  spell: { d: false, m: false, c: true },
  run: { d: false, m: false, c: true },
  frag: { d: false, m: false, c: true },
  punct: { d: false, m: false, c: true },
  par: { d: false, m: false, c: true },
  // virtual types for sub-word / sent-sub
  word: { d: false, m: false, c: true },
  sent: { d: false, m: true, c: true },
};




/* ═══════════════════════════════════════════════════════
   PREPBOT — API LAYER
   Requires: proofreader.config.js
═══════════════════════════════════════════════════════ */

/* ── Writing type set by the topic accordion ── */
let currentWritingType = 'general';

/* ─────────────────────────────────────────────────────
   WRITING-TYPE SUBSTITUTION GUIDELINES
─────────────────────────────────────────────────────── */
function getSubstitutionGuidelines(type) {
  const guides = {
    narrative: `
SUBSTITUTION STYLE — NARRATIVE writing:
  Word subs (<sub>): Replace dull, flat verbs and adjectives with vivid, character-driven ones.
    • Verbs of motion/speech are the highest priority: walked → trudged/slunk/bolted; said → whispered/snapped/murmured/blurted.
    • Replace generic nouns with concrete, sensory-specific ones: place → alleyway/threshold/clearing.
    • Offer 3 options at different emotional registers so the student can pick the mood.
  Sentence rewrites (<sent>): Rewrite weak sentences to create pace, tension, or voice.
    • Use sentence fragments deliberately for effect. Vary length.
    • Inject sensory detail (sight, sound, smell, touch) into rewrites.
    • Version 1 should heighten tension/drama; version 2 should deepen interiority/reflection.`,
    
    descriptive: `
SUBSTITUTION STYLE — DESCRIPTIVE writing:
  Word subs (<sub>): Target sensory poverty — any word that tells rather than shows.
    • Replace colour/size/shape adjectives with figurative ones: big → looming/vast/cathedral-like.
    • Verbs should evoke texture and movement: moved → drifted/shimmered/rippled.
    • Offer 3 options across visual, tactile, and auditory senses where possible.
  Sentence rewrites (<sent>): Expand thin sentences into images.
    • Version 1 uses a simile or metaphor. Version 2 uses precise concrete detail (no figurative).
    • Both versions must create a clear picture without telling the reader what to feel.`,
    
    argumentative: `
SUBSTITUTION STYLE — ARGUMENTATIVE / PERSUASIVE writing:
  Word subs (<sub>): Target imprecise, casual, or emotive words.
    • Replace "I think/feel/believe" hedges with assertive academic alternatives: it is clear that / evidence suggests / one must acknowledge.
    • Replace vague intensifiers: very → markedly/considerably/significantly; bad → detrimental/counterproductive.
    • Replace informal connectives: but → however/nevertheless/conversely; so → therefore/consequently/as a result.
    • Offer 3 options at different formality levels.
  Sentence rewrites (<sent>): Sharpen logic and structure.
    • Version 1 adds a concession-rebuttal pattern (although X, Y).
    • Version 2 tightens with a topic sentence + evidence clause structure.`,
    
    expository: `
SUBSTITUTION STYLE — EXPOSITORY / INFORMATIVE writing:
  Word subs (<sub>): Target vague or informal diction.
    • Replace pseudo-academic words with genuinely precise ones: use → employ/utilise/apply (whichever fits the context).
    • Replace "a lot of / many" with quantified or specific alternatives: numerous/a significant proportion of/the majority of.
    • Replace passive constructions where the actor matters: it was found → researchers found / studies show.
    • Offer 3 options ranked from informal to formal.
  Sentence rewrites (<sent>): Improve clarity and logical flow.
    • Version 1 uses an active voice topic sentence + supporting clause.
    • Version 2 uses a definition or classification structure for the same idea.`,
    
    general: `
SUBSTITUTION STYLE — GENERAL:
  Word subs (<sub>): Replace any weak, vague, or overused word with 3 stronger alternatives.
    • Prefer specific over general, active over passive, concrete over abstract.
  Sentence rewrites (<sent>): Offer 2 rewrites — one for clarity, one for impact.`,
  };
  
  return guides[type] || guides.general;
}

/* ─────────────────────────────────────────────────────
   SYSTEM PROMPT
─────────────────────────────────────────────────────── */
function getSystemPrompt() {
  return `You are an uncompromising secondary-school English examiner marking with a red pen. Find and mark real errors. Also give positive credit where writing is genuinely strong.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OFF-TOPIC DETECTION — CHECK THIS FIRST:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Before marking anything, decide: does this essay address the assigned TOPIC?

Mark offTopic: true if ANY of these apply:
  • The essay is about a completely different subject (e.g. topic is "describe a market" but student wrote about football).
  • The essay is a bare restatement of the topic with no real content (under ~30 meaningful words).
  • The student has written in a different language with only isolated English words.
  • The essay appears to be random or incoherent text with no connection to the topic.

Mark offTopic: false (proceed to mark normally) if:
  • The essay attempts the topic, even loosely, imperfectly, or creatively.
  • The student drifts off-topic in one section but the main thrust addresses the prompt.

When offTopic is true:
  • Set all rubric scores to 0.
  • Leave annotatedText as an empty string "".
  • Leave suggestions and studyTips as empty arrays [].
  • Provide a brief offTopicReason (1–2 plain sentences explaining why).
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CALIBRATION:
  Grammar & Mechanics /30:
    30    = Zero errors.
    24-26 = 2-3 minor slips.
    18-22 = 4-7 mixed errors.
    12-16 = 8-12 clear mechanical weaknesses.
    6-10  = 13+ errors; pervasive problems.

  Vocabulary & Style /25:
    23-25 = Varied, precise, sophisticated throughout.
    18-22 = Generally good; some weak/repetitive words.
    12-16 = Frequent vague or imprecise diction.
    6-10  = Very limited vocabulary.

  Structure & Coherence /25:
    23-25 = Clear intro, developed body, satisfying conclusion; smooth transitions.
    18-22 = Mostly organised; one weakness.
    12-16 = Partial structure; missing or underdeveloped sections.
    6-10  = Little organisation.

  Creativity & Content /20:
    18-20 = Genuinely original; rich detail; engaging.
    13-17 = Interesting but uneven.
    8-12  = Generic; lacks depth.
    3-7   = Very thin.

TOTAL BANDS: 85-95 near-perfect | 70-84 good | 55-69 average | 40-54 weak | 0-39 very weak.
NEVER exceed 95. When in doubt, choose the LOWER score.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VERB TENSE — DETECTION RULES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 1 — Establish the dominant tense of the essay before marking anything.
  • Narratives are almost always simple past (he walked, she said, they ran).
  • Expository/argumentative essays use simple present for general truths and claims.
  • Descriptive essays may mix present and past; judge by the opening paragraph.

STEP 2 — Mark <mark type="vt"> on every verb that breaks the dominant tense
  WITHOUT a clear logical reason. Common error patterns in student writing:

  Tense shift mid-paragraph (most common):
    ✗ "He opened the door and sees a stranger." → fix="saw"
    ✗ "She was tired. She walks home slowly." → fix="walked"
    ✗ "The man grabbed her arm. She screams." → fix="screamed"

  Simple past used where PAST PERFECT is required (sequence of events):
    ✗ "After he ate, he went to school." (if the eating clearly happened first) → fix="had eaten"
    ✗ "She told me she finished the work." → fix="had finished"
    ✗ "By the time I arrived, they left." → fix="had left"

  Present simple used where PAST SIMPLE is required in narration:
    ✗ "I go to the market and I buy yam." (in a past narrative) → fix="went ... bought"

  Wrong form of BE / HAVE as auxiliary:
    ✗ "She have been waiting." → fix="has been waiting"
    ✗ "They was going." → fix="were going"
    ✗ "He don't understand." → fix="doesn't understand"

  Non-standard Nigerian English tense constructions:
    ✗ "I was going to go since morning." → fix="I had been going since morning" or "I left in the morning"
    ✗ "They have went home." → fix="have gone"
    ✗ "He has came." → fix="has come"
    ✗ "We have being there." → fix="have been"

STEP 3 — DO NOT mark as vt errors:
  • Historic present used deliberately for storytelling effect (stylistic choice).
  • Dialogue — a character may use any tense appropriate to their speech.
  • General truths stated in simple present inside a past-tense narrative
    (e.g. "He knew that water boils at 100°C." — "boils" is correct here).
  • Conditional structures: "If I were rich, I would buy…" — "were" is subjunctive, not an error.

fix= attribute: always provide the corrected verb or verb phrase.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CAPITALISATION — DETECTION RULES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Use <mark type="cap"> when a word MUST be capitalised but is not.
Use <mark type="lc"> when a word is capitalised but MUST NOT be.

STEP 1 — SCAN FOR THE PRONOUN "I" FIRST (most missed error):
  Every single occurrence of the word "i" used as a first-person pronoun must be capitalised.
  This applies in ALL positions: start, middle, end of sentence.
    ✗ "Yesterday i went to school."             fix="I"
    ✗ "She told me that i should come early."   fix="I"
    ✗ "My friend and i played football."        fix="I"
    ✗ "i think the answer is correct."          fix="I"
  NOTE: The letter "i" in words like "is", "in", "it", "if" is NOT this error. Only standalone "i" as pronoun.

STEP 2 — SCAN EVERY SENTENCE OPENING (second most missed error):
  The first word of every sentence must start with a capital letter.
  After: full stop (.), question mark (?), exclamation mark (!).
    ✗ "He opened the door. the room was empty."        → "the" should be "The"
    ✗ "She ran fast. unfortunately, she missed the bus." → "unfortunately" should be "Unfortunately"
  ALSO check after dialogue closing punctuation:
    ✗ '"Come here," he said. she walked over.'         → "she" should be "She"

ALWAYS capitalise (mark cap if lowercase):
  3. People's full names and surnames: "adaeze", "mr okafor", "dr aminu" — capitalise every part.
  4. Titles DIRECTLY before a name (part of the name): 
       "president Tinubu" → fix="President Tinubu"
       "doctor Obi" → fix="Doctor Obi"
       "mrs Johnson" → fix="Mrs Johnson"
       "chief Emeka" → fix="Chief Emeka"
       (BUT: "the president announced" — title used generically, no capital.)
  5. Specific named places — countries, cities, states, rivers, mountains, landmarks:
       "nigeria", "lagos", "abuja", "river niger", "aso rock", "mount kilimanjaro"
       → capitalise every word in the specific name.
  6. Nationalities, languages, ethnic groups, religions:
       "nigerian", "yoruba", "igbo", "hausa", "fulani", "tiv",
       "english", "french", "arabic", "swahili",
       "christian", "muslim", "islam", "christianity", "buddhism"
       — ALL must be capitalised, always, wherever they appear.
  7. Days of the week and months of the year — always:
       "monday", "friday", "january", "december" → capitalise.
       (Seasons do NOT get capitals: harmattan, rainy season, summer.)
  8. Named institutions, organisations, schools, government bodies when used as specific names:
       "university of lagos" → "University of Lagos"
       "federal government of nigeria" → "Federal Government of Nigeria"
       "national assembly" → "National Assembly" (when referring to the Nigerian body specifically)
  9. Titles of books, films, newspapers when cited:
       "things fall apart" → "Things Fall Apart"
       "the punch" → "The Punch"
  10. Acronyms and initialisms are always fully uppercase:
       "un", "waec", "jamb", "ui" (University of Ibadan abbreviation) → "UN", "WAEC", "JAMB"

NEVER capitalise (mark lc if incorrectly uppercased):
  1. Generic common nouns: "The Government said..." (referring generally)
       → fix="government" — UNLESS it's "the Federal Government of Nigeria" (specific body).
  2. School subjects used generically: "I study mathematics, physics, and chemistry"
       → all lowercase. Exception: "English" (language/nationality) always capitalised;
       "French" (language) always capitalised.
  3. Seasons: "harmattan", "rainy season", "dry season", "summer", "winter" — always lowercase.
  4. Compass directions used generically: "go north", "the south", "head east" — lowercase.
       (BUT specific regions: "Northern Nigeria", "South-East geopolitical zone" — capitalise.)
  5. Family relationship words used generically (with a possessive pronoun):
       "my father", "her mother", "his uncle", "their grandmother" → always lowercase.
       (BUT when used as a title replacing the name: "Father said", "Mother called" — capital.)
  6. The word "internet" — now standardly lowercase.
  7. Generic time references: "in the morning", "last night", "this afternoon" — lowercase.

COMMON NIGERIAN STUDENT CAPITALISATION ERRORS TO CATCH:
  ✗ "My Father told me..." (father used generically with "My") → fix="father"
  ✗ "In The Morning" (random mid-sentence caps) → fix="the morning"  
  ✗ "She is A Teacher" (article/determiner mid-sentence) → fix="a"
  ✗ "The School is Big" (common noun mid-sentence) → fix="school"
  ✗ "i and my friend" → fix="I"
  ✗ "we went to church. afterwards, i played" → "afterwards" cap + "i" cap
  ✗ "He is an igbo man" → fix="Igbo"
  ✗ "last monday" → fix="Monday"

IMPORTANT: Check EVERY sentence boundary and EVERY standalone "i". These two account for the majority of cap/lc errors in student writing. Do not skip any.

fix= attribute: always provide the correctly capitalised (or lowercased) word or phrase.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SPELLING — DETECTION RULES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Use <mark type="sp"> only when you are certain the word is misspelled.
Provide fix= with the correct spelling always.

TWO-STEP CHECK before marking:
  1. Is this British English or Nigerian English? If yes, it is correct — do NOT mark.
  2. Is the misspelling unambiguous? If the correct spelling is obvious, mark it.

NEVER mark as spelling errors (these are ALL correct):
  British spellings: colour, honour, favour, organise, realise, recognise, analyse,
    centre, theatre, licence (noun), practise (verb), programme, travelling, fulfil,
    skilful, enrol, grey, mould, plough, neighbour, behaviour, endeavour, humour,
    labelled, modelling, jewellery, sceptical, defence, offence, pretence.
  Nigerian / West African English: learnt, spelt, dreamt, burnt, smelt, spilt,
    ageing, whilst, amongst, towards, afterwards, backwards, forwards, upwards.
  Proper nouns: any name of person, city, country, school, brand.

ACTIVELY MARK these common Nigerian student misspellings:
  Vowel confusion / transposition:
    recieve → receive, beleive → believe, freind → friend, wierd → weird,
    peice → piece, breif → brief, acheive → achieve, neice → niece,
    concieve → conceive, percieve → perceive, decieve → deceive.
  Consonant doubling errors:
    occured → occurred, reffered → referred, comitted → committed,
    begining → beginning, writting → writing, runing → running,
    droped → dropped, planed → planned, stoped → stopped,
    acomodate → accommodate, recomend → recommend, neccesary → necessary,
    posession → possession, agression → aggression, profesional → professional.
  Silent letters / phonetic spelling:
    knowlege → knowledge, goverment → government, parliment → parliament,
    enviroment → environment, seperately → separately, intresting → interesting,
    differnt → different, studing → studying, definitly → definitely,
    independance → independence, existance → existence, perseverence → perseverance,
    bussiness → business, responsibilty → responsibility, priviledge → privilege,
    calender → calendar, cemetary → cemetery, concious → conscious,
    embarass → embarrass, harrass → harass, occassion → occasion,
    sentance → sentence, grammer → grammar, pronounciation → pronunciation.
  Common word confusions (spelling, not homophones):
    alot → a lot (two words), aswell → as well (two words),
    alright → all right (preferred in formal writing),
    infact → in fact (two words), atleast → at least (two words),
    untill → until, usefull → useful, carefull → careful,
    beautifull → beautiful, wonderfull → wonderful, powerfull → powerful.

When uncertain whether a word is misspelled (rare proper nouns, dialect words,
technical terms), DO NOT mark — omit the tag entirely.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${getSubstitutionGuidelines(currentWritingType)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SUBSTITUTION RULES (apply to every <sub> and <sent> tag):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Use <sub> on ANY word that is grammatically correct but weak, vague, overused, or
  below the register expected for this writing type. Do NOT wait for an obvious error.
  The threshold is: "could a stronger word go here?" — if yes, wrap it.
- Use <sent> on any sentence that is structurally correct but flat, unclear, or
  under-developed for the genre. Provide exactly 2 rewrites separated by |||.
- All substitution options MUST match the writing type's register and style guidelines above.
- For <sub>, always provide exactly 3 comma-separated options of increasing strength/precision.
- NEVER use the original word as one of the substitution options.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

RESPOND ONLY WITH VALID JSON. No markdown, no preamble.

{
  "offTopic": false,
  "offTopicReason": "",
  "totalScore": <exact sum>,
  "rubric": [
    { "category": "Grammar & Mechanics",  "score": <n>, "outOf": 30, "feedback": "<2 sentences naming specific errors>" },
    { "category": "Vocabulary & Style",   "score": <n>, "outOf": 25, "feedback": "<2 sentences>" },
    { "category": "Structure & Coherence","score": <n>, "outOf": 25, "feedback": "<2 sentences>" },
    { "category": "Creativity & Content", "score": <n>, "outOf": 20, "feedback": "<2 sentences>" }
  ],
  "annotatedText": "<essay with all tags below>",
  "suggestions": ["<actionable suggestion 1>", "<actionable suggestion 2>", "<suggestion 3>", "<suggestion 4>", "<suggestion 5>"],
  "studyTips": [
    { "title": "<short title>", "tip": "<concrete 2-sentence study tip>" },
    { "title": "<title>", "tip": "<tip>" },
    { "title": "<title>", "tip": "<tip>" },
    { "title": "<title>", "tip": "<tip>" }
  ]
}

ANNOTATION TAGS — mark confirmed errors only:

GRAMMAR ERRORS:
1.  Delete extra word:       <mark type="del"   loss="-2">word</mark>
2.  Insert missing word:     <mark type="ins"   fix="word" loss="-2"> </mark>
3.  Capitalise:              <mark type="cap"   fix="Word" loss="-2">word</mark>
4.  Make lowercase:          <mark type="lc"    fix="word" loss="-2">Word</mark>
5.  Transpose word order:    <mark type="trans" loss="-2">wrong order phrase</mark>
6.  New paragraph here:      <mark type="para"  loss="-2"> </mark>
7.  Spell out abbreviation:  <mark type="spell" fix="full form" loss="-1">abbr</mark>
8.  Misspelling:             <mark type="sp"    fix="correct spelling" loss="-2">mispeled</mark>
9.  Run-on sentence:         <mark type="run"   loss="-3">fused clause one fused clause two</mark>
10. Sentence fragment:       <mark type="frag"  loss="-3">Because it rained.</mark>
11. Wrong punctuation:       <mark type="punct" fix="correct punctuation" loss="-2">,</mark>
12. Wrong word (homophone):  <mark type="ww"    fix="correct word" loss="-2">there</mark>
13. Agreement error (S-V):   <mark type="agr"   fix="corrected phrase" loss="-3">The students was</mark>
14. Wrong verb tense:        <mark type="vt"    fix="correct verb form" loss="-2">Yesterday I go</mark>
15. Wrong/missing article:   <mark type="art"   fix="correct article" loss="-2">I need a information</mark>
16. Wrong preposition:       <mark type="prep"  fix="correct preposition" loss="-2">depend of</mark>
17. Unnecessary repetition:  <mark type="rep"   loss="-1">very very good</mark>
18. Unclear pronoun ref:     <mark type="ref"   fix="clearer phrasing" loss="-2">he said to him</mark>
19. Comma splice:            <mark type="cs"    loss="-3">clause, clause</mark>
20. Wrong word order:        <mark type="wo"    fix="correct order" loss="-2">I yesterday went</mark>
21. Faulty parallel struct:  <mark type="par"   fix="parallel form" loss="-2">running, to jump, swim</mark>

NOTE: Always include fix="..." on error types 3,4,7,8,11,12,13,14,15,16,18,20,21.
This value is shown as the red-pen correction in the popup.

HIGHLIGHTS — wrap passages to colour-code issues:
22. Grammar cluster:    <hl cat="grammar">passage with grammar errors</hl>
23. Vocab issue:        <hl cat="vocab">weak vocabulary passage</hl>
24. Structure issue:    <hl cat="structure">poorly organised section</hl>
25. Style issue:        <hl cat="style">awkward style passage</hl>
26. Good writing:       <hl cat="good">genuinely well-written passage</hl>

POSITIVE FEEDBACK:
27. Good word/phrase:   <good reason="Precise and vivid word choice">excellent phrase</good>

EXAMINER MARGIN COMMENTS — max 4 per essay, at END of relevant sentence:
28. <comment text="Your opening hook is strong, but the argument collapses in paragraph 2."> </comment>

WORD / SENTENCE SUBSTITUTIONS:
29. Weak word:     <sub opts="stronger1, stronger2, stronger3">weak_word</sub>
30. Weak sentence: <sent opts="Better version 1.|||Better version 2.">Original weak sentence.</sent>

RULES:
- Only mark errors you are certain about.
- Always populate fix="..." wherever specified in tag list — it drives the red-pen display.
- Use <hl> to highlight clusters of related errors so the student sees patterns.
- loss: -1 trivial | -2 standard | -3 moderate | -4 serious | -5 severe.
- suggestions: 5 specific, actionable improvements based on THIS essay.
- studyTips: 4 targeted tips based on the ACTUAL error types found.
- Preserve paragraph breaks as \\n\\n. Escape all JSON strings.`;
}

/* ─────────────────────────────────────────────────────
   TOPIC GENERATION
─────────────────────────────────────────────────────── */
async function fetchGeneratedTopic(type) {
  currentWritingType = type;
  
  if (elTopicBox) elTopicBox.style.opacity = '0.5';
  const textEl = document.getElementById('acc-topic-text');
  if (textEl) textEl.textContent = 'Generating prompt...';
  if (elTopic) elTopic.innerHTML = `Generating ${type} prompt...`;
  
  try {
    const { data } = await geminiPost({
      contents: [{
        parts: [{
          text: `Generate ONE original, age-appropriate ${type} writing topic for a Nigerian secondary school student (SS1–SS2, age 13–15). Engaging, specific, achievable in 200–500 words. Return ONLY the topic text — no quotes, no label, no explanation.`
        }]
      }],
      generationConfig: {
        temperature: 0.9,
        maxOutputTokens: 130
      }
    });
    
    let text = (data.candidates?.[0]?.content?.parts?.[0]?.text || "").trim()
      .replace(/^["'"']+|["'"']+$/g, '');
    currentTopic = text || "Write about a memorable experience and what you learned from it.";
    syncTopicDisplay();
    
    const words = elTextarea.value.trim() ? elTextarea.value.trim().split(/\s+/).length : 0;
    elSubmitBtn.disabled = words < 20;
    
  } catch (err) {
    console.error(err);
    if (textEl) textEl.textContent = 'Error generating topic. Please try again.';
    if (elTopic) elTopic.textContent = 'Error generating topic. Please try again.';
    currentTopic = "";
  } finally {
    if (elTopicBox) elTopicBox.style.opacity = '1';
  }
}

/* ─────────────────────────────────────────────────────
   ESSAY GRADING  (called by submit handler in main.js)
─────────────────────────────────────────────────────── */
async function gradeEssay(userText) {
  const { data } = await geminiPost({
    systemInstruction: {
      parts: [{ text: getSystemPrompt() }]
    },
    contents: [{
      parts: [{ text: `WRITING TYPE: ${currentWritingType.toUpperCase()}\nTOPIC: ${currentTopic}\n\nSTUDENT ESSAY:\n${userText}` }]
    }],
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.1,
      maxOutputTokens: 20000
    }
  });
  let raw = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  
  const jsonStart = raw.indexOf('{');
  const jsonEnd = raw.lastIndexOf('}');
  
  if (jsonStart !== -1 && jsonEnd !== -1) {
    raw = raw.substring(jsonStart, jsonEnd + 1);
  } else {
    throw new Error("No JSON object found in response");
  }
  
  raw = raw.replace(/[\u0000-\u0009\u000B-\u001F]+/g, "");
  
  return JSON.parse(raw);
}




/* ═══════════════════════════════════════════════════════
   PREPBOT — POPOVER & INTERACTION LAYER
   Requires: proofreader.config.js
═══════════════════════════════════════════════════════ */

/* ─────────────────────────────────────────────────────
   UTIL
─────────────────────────────────────────────────────── */
function safe(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* ─────────────────────────────────────────────────────
   POSITION POPOVER
─────────────────────────────────────────────────────── */
function positionPopover(el) {
  const rect = el.getBoundingClientRect();
  const pw = 340,
    ph = 360;
  let left = rect.left;
  let top = rect.bottom + 10;
  if (left + pw > window.innerWidth - 8) left = window.innerWidth - pw - 8;
  if (left < 8) left = 8;
  if (top + ph > window.innerHeight - 8) top = rect.top - ph - 8;
  if (top < 8) top = 8;
  elPopover.style.left = left + 'px';
  elPopover.style.top = top + 'px';
}

/* ─────────────────────────────────────────────────────
   RED PEN CORRECTION BLOCK
─────────────────────────────────────────────────────── */
function buildRedPenHtml(originalText, fix, optsStr, dataType, type) {
  const original = originalText.replace(/<[^>]+>/g, '').trim();
  
  /* ── Case 1: grammar fix (single correct form) ── */
  if (fix) {
    return `
      <div class="pop-redpen">
        <span class="pop-redpen-original">${safe(original)}</span>
        <span class="pop-redpen-arrow">→</span>
        <button class="pop-redpen-fix" data-val="${safe(fix)}">${safe(fix)}</button>
      </div>`;
  }
  
  /* ── Case 2: substitution options ── */
  if (optsStr) {
    const separator = dataType === 'sent' ? '|||' : ',';
    const opts = optsStr.split(separator).map(s => s.trim()).filter(Boolean);
    if (!opts.length) return '';
    
    const isSent = dataType === 'sent';
    const btns = opts.map(o =>
      `<button class="pop-redpen-opt ${isSent ? 'sent' : ''}" data-val="${safe(o)}">${safe(o)}</button>`
    ).join('');
    
    return `
      <div class="pop-redpen ${isSent ? 'pop-redpen--sent' : ''}">
        ${!isSent ? `<span class="pop-redpen-original">${safe(original)}</span><span class="pop-redpen-arrow">→</span>` : ''}
        <div class="pop-redpen-opts">${btns}</div>
      </div>`;
  }
  
  /* ── Case 3: del / trans / para — no replacement needed ── */
  if (type === 'del') {
    return `
      <div class="pop-redpen pop-redpen--del">
        <span class="pop-redpen-original">${safe(original)}</span>
        <span class="pop-redpen-arrow">→</span>
        <span class="pop-redpen-delete">delete</span>
      </div>`;
  }
  
  return '';
}

/* ─────────────────────────────────────────────────────
   ANNOTATION POPOVER
─────────────────────────────────────────────────────── */
function openAnnotationPopover(el) {
  activeEl = el;
  
  const classes = [...el.classList];
  const doodleClass = classes.find(c => c.startsWith('doodle-') && c !== 'doodle');
  const type = doodleClass ? doodleClass.replace('doodle-', '') : '';
  const fix = el.dataset.fix || '';
  const optsStr = el.dataset.opts || '';
  const dataType = el.dataset.type || (optsStr && !type ? 'word' : '');
  const lossAttr = el.dataset.loss || el.querySelector?.('.deduction')?.textContent || '';
  
  const actionKey = type || dataType || 'word';
  const actions = ERROR_ACTIONS[actionKey] || { d: false, m: false, c: true };
  
  const info = ERROR_TYPES[type] || {
    name: dataType === 'sent' ? 'Sentence Rewrite' : 'Word Substitute',
    desc: dataType === 'sent' ?
      'This sentence could be more effective. Click a rewrite option below to replace it.' :
      'This word could be stronger. Click a replacement option to upgrade it.'
  };
  
  const badgeBg = (() => {
    const tmp = document.querySelector(`.doodle-${type}`);
    if (tmp) {
      const s = getComputedStyle(tmp);
      return s.borderBottomColor !== 'rgba(0, 0, 0, 0)' ? s.borderBottomColor :
        s.outlineColor !== 'rgba(0, 0, 0, 0)' ? s.outlineColor : '#0a0a0a';
    }
    return type ? '#0a0a0a' : (dataType === 'sent' ? '#e67e00' : '#0055ff');
  })();
  
  const redPenHtml = buildRedPenHtml(el.textContent, fix, optsStr, dataType, type);
  
  const actionBtns = [
    actions.d ? `<button class="pop-action-btn danger"  id="pop-act-delete">Delete</button>` : '',
    actions.m ? `<button class="pop-action-btn move"    id="pop-act-move">Move</button>` : '',
    actions.c ? `<button class="pop-action-btn success" id="pop-act-custom">Custom Replace</button>` : '',
  ].filter(Boolean).join('');
  
  const actionsSection = actionBtns ? `
    <div class="pop-divider"></div>
    <div class="pop-section-label">More actions</div>
    <div class="pop-action-row">${actionBtns}</div>` : '';
  
  elPopover.innerHTML = `
    <div class="pop-header">
      <span class="pop-badge" style="background:${badgeBg}">${type || (dataType === 'sent' ? 'sent' : 'sub')}</span>
      <span class="pop-error-name">${info.name}</span>
      ${lossAttr ? `<span class="pop-loss">${safe(lossAttr)}</span>` : ''}
    </div>
    <div class="pop-desc">${info.desc}</div>
    ${redPenHtml}
    ${actionsSection}
    <div class="pop-custom-wrap" id="pop-custom-area" style="display:none">
      <input class="pop-custom-input" id="pop-custom-text" placeholder="Type replacement text..." />
      <button class="pop-custom-apply" id="pop-custom-go">Apply</button>
    </div>`;
  
  elPopover.classList.add('visible');
  positionPopover(el);
  
  /* ── Wire up action buttons ── */
  document.getElementById('pop-act-delete')?.addEventListener('click', () => {
    deleteAnnotation(el);
    elPopover.classList.remove('visible');
    activeEl = null;
  });
  
  document.getElementById('pop-act-move')?.addEventListener('click', () => {
    elPopover.classList.remove('visible');
    startMoveMode(el);
  });
  
  document.getElementById('pop-act-custom')?.addEventListener('click', () => {
    const area = document.getElementById('pop-custom-area');
    if (!area) return;
    const opening = area.style.display === 'none';
    area.style.display = opening ? 'flex' : 'none';
    if (opening) document.getElementById('pop-custom-text')?.focus();
  });
  
  document.getElementById('pop-custom-go')?.addEventListener('click', () => {
    const val = document.getElementById('pop-custom-text')?.value.trim();
    if (val) applyOpt(val);
  });
  
  document.getElementById('pop-custom-text')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') { const val = e.target.value.trim(); if (val) applyOpt(val); }
  });
  
  /* ── Red pen fix/opt buttons ── */
  elPopover.querySelectorAll('.pop-redpen-fix, .pop-redpen-opt').forEach(btn => {
    btn.addEventListener('click', () => applyOpt(btn.dataset.val || btn.textContent.trim()));
  });
}

/* ─────────────────────────────────────────────────────
   APPLY REPLACEMENT
─────────────────────────────────────────────────────── */
function applyOpt(chosen) {
  if (!activeEl) return;
  activeEl.querySelector('.deduction')?.remove();
  activeEl.textContent = chosen;
  activeEl.style.textDecoration = 'none';
  activeEl.style.background = 'rgba(74,222,128,.25)';
  activeEl.style.color = 'var(--green,#00a550)';
  activeEl.style.fontWeight = '600';
  activeEl.style.outline = 'none';
  activeEl.style.borderBottom = 'none';
  [...activeEl.classList]
  .filter(c => c.startsWith('doodle') || c === 'sub-word' || c === 'sent-sub')
    .forEach(c => activeEl.classList.remove(c));
  elPopover.classList.remove('visible');
  activeEl = null;
}

/* ─────────────────────────────────────────────────────
   DELETE ANNOTATION
─────────────────────────────────────────────────────── */
function deleteAnnotation(el) {
  el.style.transition = 'opacity .35s, text-decoration .35s';
  el.style.textDecoration = 'line-through';
  el.style.opacity = '0.3';
  setTimeout(() => { el.remove(); }, 380);
}

/* ─────────────────────────────────────────────────────
   MOVE MODE
─────────────────────────────────────────────────────── */
function startMoveMode(el) {
  cancelMoveMode();
  
  moveSourceEl = el;
  el.classList.add('move-source');
  
  const preview = el.textContent.replace(/\s+/g, ' ').trim().slice(0, 45) +
    (el.textContent.trim().length > 45 ? '...' : '');
  
  const instr = document.createElement('div');
  instr.id = 'move-instruction';
  instr.innerHTML = `Click where to place <em>"${preview}"</em> <button id="cancel-move">Cancel</button>`;
  document.body.appendChild(instr);
  
  if (elAnnotated) elAnnotated.style.cursor = 'crosshair';
  
  moveHandler = (e) => {
    if (e.target.id === 'cancel-move' || e.target.closest?.('#cancel-move')) {
      cancelMoveMode();
      return;
    }
    if (e.target.closest?.('#move-instruction')) return;
    if (!elAnnotated?.contains(e.target) && e.target !== elAnnotated) {
      cancelMoveMode();
      return;
    }
    
    e.preventDefault();
    e.stopPropagation();
    
    let range = null;
    if (document.caretRangeFromPoint) {
      range = document.caretRangeFromPoint(e.clientX, e.clientY);
    } else if (document.caretPositionFromPoint) {
      const pos = document.caretPositionFromPoint(e.clientX, e.clientY);
      if (pos) { range = document.createRange();
        range.setStart(pos.offsetNode, pos.offset);
        range.collapse(true); }
    }
    
    if (range && moveSourceEl) {
      const src = moveSourceEl;
      src.remove();
      src.classList.remove('move-source');
      range.insertNode(src);
      src.addEventListener('click', ev => { ev.stopPropagation();
        openAnnotationPopover(src); });
    }
    
    cancelMoveMode();
  };
  
  document.addEventListener('click', moveHandler, { capture: true });
}

function cancelMoveMode() {
  if (moveSourceEl) { moveSourceEl.classList.remove('move-source');
    moveSourceEl = null; }
  document.getElementById('move-instruction')?.remove();
  if (elAnnotated) elAnnotated.style.cursor = '';
  if (moveHandler) { document.removeEventListener('click', moveHandler, { capture: true });
    moveHandler = null; }
}

/* ─────────────────────────────────────────────────────
   COMMENT POPOVER
─────────────────────────────────────────────────────── */
function showComment(marker) {
  const id = parseInt(marker.dataset.cid, 10);
  const text = commentStore[id];
  if (!text) return;
  
  if (elCommentPop.classList.contains('visible') && elCommentPop.dataset.activeCid == id) {
    elCommentPop.classList.remove('visible');
    marker.classList.remove('active');
    elCommentPop.dataset.activeCid = '';
    return;
  }
  
  document.querySelectorAll('.margin-comment-marker.active').forEach(m => m.classList.remove('active'));
  marker.classList.add('active');
  elCommentPop.dataset.activeCid = id;
  
  elCommentPop.innerHTML = `
    <div class="comment-pop-label"> Examiner's Note ${id}</div>
    <div class="comment-pop-text">${safe(text)}</div>`;
  elCommentPop.classList.add('visible');
  
  const rect = marker.getBoundingClientRect();
  const pw = 284,
    ph = 120;
  let left = rect.right + 10,
    top = rect.top - 8;
  if (left + pw > window.innerWidth - 8) left = rect.left - pw - 10;
  if (left < 8) left = 8;
  if (top + ph > window.innerHeight - 8) top = window.innerHeight - ph - 8;
  if (top < 8) top = 8;
  elCommentPop.style.left = left + 'px';
  elCommentPop.style.top = top + 'px';
}

/* ── Close comment popover on outside click ── */
document.addEventListener('click', e => {
  if (!elCommentPop) return;
  if (elCommentPop.contains(e.target)) return;
  if (e.target.classList.contains('margin-comment-marker')) return;
  elCommentPop.classList.remove('visible');
  elCommentPop.dataset.activeCid = '';
  document.querySelectorAll('.margin-comment-marker.active').forEach(m => m.classList.remove('active'));
});

/* ── Close annotation popover on outside click ── */
document.addEventListener('click', e => {
  if (!elPopover) return;
  if (elPopover.contains(e.target)) return;
  elPopover.classList.remove('visible');
});




/* ═══════════════════════════════════════════════════════
   PREPBOT — UI UTILITIES
   Requires: proofreader.config.js
═══════════════════════════════════════════════════════ */

/* ─────────────────────────────────────────────────────
   ACCORDION FACTORY
─────────────────────────────────────────────────────── */
function makeAccordion({ id, title, bodyHtml, startOpen = false, extraClass = '', count = null }) {
  const panel = document.createElement('div');
  panel.className = `acc-panel${extraClass ? ' ' + extraClass : ''}`;
  panel.id = `acc-${id}`;
  
  const countSpan = count !== null ? ` <span class="acc-count">(${count})</span>` : '';
  
  panel.innerHTML = `
    <button class="acc-header">
      <span class="acc-header-label">${title}${countSpan}</span>
      <svg class="acc-chevron${startOpen ? ' open' : ''}" viewBox="0 0 24 24">
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </button>
    <div class="acc-body" id="acc-body-${id}" style="${startOpen ? '' : 'display:none'}">
      ${bodyHtml}
    </div>`;
  
  panel.querySelector('.acc-header').addEventListener('click', function() {
    const body = document.getElementById(`acc-body-${id}`);
    const opening = body.style.display === 'none';
    body.style.display = opening ? '' : 'none';
    this.querySelector('.acc-chevron').classList.toggle('open', opening);
  });
  
  return panel;
}

/* ─────────────────────────────────────────────────────
   COLOR KEY HTML
─────────────────────────────────────────────────────── */
function buildColorKeyHtml() {
  const marks = [
    { code: 'del', name: 'Delete Word', color: '#dc2626', loss: '-2' },
    { code: 'ins', name: 'Insert Missing Word', color: '#16a34a', loss: '-2' },
    { code: 'cap', name: 'Capitalise', color: '#ea580c', loss: '-2' },
    { code: 'lc', name: 'Make Lowercase', color: '#0284c7', loss: '-2' },
    { code: 'trans', name: 'Transpose / Swap', color: '#7c3aed', loss: '-2' },
    { code: 'para', name: 'New Paragraph', color: '#0a0a0a', loss: '-2' },
    { code: 'spell', name: 'Spell Out Abbreviation', color: '#666', loss: '-1' },
    { code: 'sp', name: 'Misspelling', color: '#dc2626', loss: '-2' },
    { code: 'run', name: 'Run-on Sentence', color: '#b91c1c', loss: '-3' },
    { code: 'frag', name: 'Sentence Fragment', color: '#dc2626', loss: '-3' },
    { code: 'punct', name: 'Wrong Punctuation', color: '#dc2626', loss: '-2' },
    { code: 'ww', name: 'Wrong Word (homophone)', color: '#dc2626', loss: '-2' },
    { code: 'agr', name: 'Subject-Verb Agreement', color: '#ea580c', loss: '-3' },
    { code: 'vt', name: 'Wrong Verb Tense', color: '#7c3aed', loss: '-2' },
    { code: 'art', name: 'Article Error (a/an/the)', color: '#0284c7', loss: '-2' },
    { code: 'prep', name: 'Wrong Preposition', color: '#db2777', loss: '-2' },
    { code: 'rep', name: 'Unnecessary Repetition', color: '#b45309', loss: '-1' },
    { code: 'ref', name: 'Unclear Pronoun Reference', color: '#0f766e', loss: '-2' },
    { code: 'cs', name: 'Comma Splice', color: '#b91c1c', loss: '-3' },
    { code: 'wo', name: 'Word Order Error', color: '#6366f1', loss: '-2' },
    { code: 'par', name: 'Faulty Parallel Structure', color: '#059669', loss: '-2' },
  ];
  
  const highlights = [
    { name: 'Grammar Cluster', bg: 'rgba(253,224,71,.55)' },
    { name: 'Vocabulary Issue', bg: 'rgba(96,165,250,.3)' },
    { name: 'Structure Issue', bg: 'rgba(251,146,60,.3)' },
    { name: 'Style Issue', bg: 'rgba(196,181,253,.45)' },
    { name: 'Good Writing', bg: 'rgba(74,222,128,.3)' },
  ];
  
  return `
    <p class="ck-section-title">Pen Marks — click any marked word, phrase or sentence to see options</p>
    <div class="ck-grid">
      ${marks.map(m => `
        <div class="ck-item">
          <span class="ck-code" style="color:${m.color}">${m.code}</span>
          <span class="ck-name">${m.name}</span>
          <span class="ck-loss" style="color:${m.color}">${m.loss}</span>
        </div>`).join('')}
    </div>
    <p class="ck-section-title" style="margin-top:4px">Highlights</p>
    <div class="ck-hl-grid">
      ${highlights.map(h => `
        <div class="ck-hl-item">
          <span class="ck-swatch" style="background:${h.bg}"></span>
          <span>${h.name}</span>
        </div>`).join('')}
    </div>
    <div class="ck-other">
      <div><span class="ck-marker">1</span> Red circle = Examiner margin comment — click to read</div>
      <div><span class="ck-sub-demo">word</span>&nbsp; Blue underline = Click to substitute this word</div>
      <div><span class="ck-sent-demo">sentence</span>&nbsp; Amber underline = Click to rewrite this sentence</div>
    </div>`;
}

/* ─────────────────────────────────────────────────────
   EDITOR ACCORDIONS (injected below textarea once)
─────────────────────────────────────────────────────── */
function initEditorAccordions() {
  if (document.getElementById('editor-accordions')) return;
  
  const container = document.createElement('div');
  container.id = 'editor-accordions';
  
  const topicBody = `
    <p class="acc-topic-label">Choose a writing type to generate a topic</p>
    <div class="acc-topic-types" id="acc-type-btns">
      ${['Narrative','Descriptive','Argumentative','Expository'].map(t =>
        `<button class="type-btn" data-type="${t.toLowerCase()}">${t}</button>`
      ).join('')}
    </div>
    <div class="acc-current-topic">
      <p class="acc-topic-label" style="margin-bottom:3px">Current writing prompt</p>
      <div class="acc-topic-text" id="acc-topic-text">No topic yet — select a type above to generate one.</div>
    </div>`;
  
  container.appendChild(makeAccordion({ id: 'topic', title: 'Writing Prompt', bodyHtml: topicBody, startOpen: true }));
  container.appendChild(makeAccordion({ id: 'colorkey', title: 'Annotation Color Key', bodyHtml: buildColorKeyHtml(), startOpen: false }));
  
  if (elTextarea && elTextarea.parentNode) {
    elTextarea.parentNode.insertBefore(container, elTextarea.nextSibling);
  }
  
  container.querySelectorAll('.type-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.type-btn').forEach(b => b.classList.remove('type-btn--active'));
      btn.classList.add('type-btn--active');
      fetchGeneratedTopic(btn.dataset.type);
    });
  });
  
  syncTopicDisplay();
}

/* ─────────────────────────────────────────────────────
   SYNC TOPIC DISPLAY
─────────────────────────────────────────────────────── */
function syncTopicDisplay() {
  const el = document.getElementById('acc-topic-text');
  if (el && currentTopic) el.textContent = currentTopic;
  if (elTopic && currentTopic) elTopic.textContent = currentTopic;
}

/* ─────────────────────────────────────────────────────
   MODAL (compatibility shims)
─────────────────────────────────────────────────────── */
function openModal() {
  elModal?.classList.add('active');
  const body = document.getElementById('acc-body-topic');
  if (body) {
    body.style.display = '';
    const chevron = document.querySelector('#acc-topic .acc-chevron');
    if (chevron) chevron.classList.add('open');
  }
}

function closeModal() {
  elModal?.classList.remove('active');
  if (!currentTopic) {
    currentTopic = "Write a descriptive essay about an abandoned place that suddenly comes to life.";
    syncTopicDisplay();
  }
}