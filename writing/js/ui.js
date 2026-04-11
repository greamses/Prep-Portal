/* ═══════════════════════════════════════════════════════
   PREPBOT — UI UTILITIES
═══════════════════════════════════════════════════════ */

import { $, currentTopic, setCurrentTopic } from './config.js';
import { fetchGeneratedTopic } from './api.js';

// ── Accordion Factory ──────────────────────────────────
export function makeAccordion({ id, title, bodyHtml, startOpen = false, extraClass = '', count = null }) {
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

// ── Color Key HTML ─────────────────────────────────────
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
    { code: 'ww', name: 'Wrong Word', color: '#dc2626', loss: '-2' },
    { code: 'agr', name: 'Subject-Verb Agreement', color: '#ea580c', loss: '-3' },
    { code: 'vt', name: 'Wrong Verb Tense', color: '#7c3aed', loss: '-2' },
    { code: 'art', name: 'Article Error', color: '#0284c7', loss: '-2' },
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
    <p class="ck-section-title">Pen Marks — click any marked word to see options</p>
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
      <div><span class="ck-sub-demo">word</span> Blue underline = Click to substitute this word</div>
      <div><span class="ck-sent-demo">sentence</span> Amber underline = Click to rewrite this sentence</div>
    </div>`;
}

// ── Editor Accordions ──────────────────────────────────
export function initEditorAccordions(textareaEl) {
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
  
  if (textareaEl?.parentNode) {
    textareaEl.parentNode.insertBefore(container, textareaEl.nextSibling);
  }
  
  container.querySelectorAll('.type-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.type-btn').forEach(b => b.classList.remove('type-btn--active'));
      btn.classList.add('type-btn--active');
      
      fetchGeneratedTopic(btn.dataset.type, {
        onStart: () => {
          const box = $('topic-box');
          if (box) box.style.opacity = '0.5';
          const textEl = $('acc-topic-text');
          if (textEl) textEl.textContent = 'Generating prompt...';
          const topicDisplay = $('topic-display');
          if (topicDisplay) topicDisplay.innerHTML = `Generating ${btn.dataset.type} prompt...`;
        },
        onSuccess: (topic) => {
          const box = $('topic-box');
          if (box) box.style.opacity = '1';
          syncTopicDisplay();
          const textarea = $('writing-area');
          const submitBtn = $('submit-btn');
          if (textarea && submitBtn) {
            const words = textarea.value.trim() ? textarea.value.trim().split(/\s+/).length : 0;
            submitBtn.disabled = words < 20;
          }
        },
        onError: () => {
          const box = $('topic-box');
          if (box) box.style.opacity = '1';
          const textEl = $('acc-topic-text');
          if (textEl) textEl.textContent = 'Error generating topic. Please try again.';
          const topicDisplay = $('topic-display');
          if (topicDisplay) topicDisplay.textContent = 'Error generating topic. Please try again.';
        }
      });
    });
  });
  
  syncTopicDisplay();
}

// ── Sync Topic Display ─────────────────────────────────
export function syncTopicDisplay() {
  const el = $('acc-topic-text');
  if (el && currentTopic) el.textContent = currentTopic;
  const topicDisplay = $('topic-display');
  if (topicDisplay && currentTopic) topicDisplay.textContent = currentTopic;
}

// ── Modal ──────────────────────────────────────────────
export function openModal(modalEl) {
  modalEl?.classList.add('active');
  const body = $('acc-body-topic');
  if (body) {
    body.style.display = '';
    const chevron = document.querySelector('#acc-topic .acc-chevron');
    if (chevron) chevron.classList.add('open');
  }
}

export function closeModal(modalEl) {
  modalEl?.classList.remove('active');
  if (!currentTopic) {
    setCurrentTopic("Write a descriptive essay about an abandoned place that suddenly comes to life.");
    syncTopicDisplay();
  }
}

// ── Inject Rewrite Styles ──────────────────────────────
export function injectRewriteStyles() {
  if (document.getElementById('rewrite-injected-css')) return;
  const s = document.createElement('style');
  s.id = 'rewrite-injected-css';
  s.textContent = `
    .score-stamp.rewrite-stamp {
      background: #0a0a0a; color: #fff;
      font-size: clamp(1.4rem, 5vw, 2rem);
      letter-spacing: .04em; padding: .4em .7em;
    }
    .rewrite-stamp-wrap { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
    #rewrite-info-btn {
      width: 26px; height: 26px; border-radius: 50%;
      border: 2px solid #0a0a0a; background: #fff; color: #0a0a0a;
      font-weight: 800; font-size: .85rem; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; box-shadow: 2px 2px 0 #0a0a0a;
      transition: background .15s, color .15s;
    }
    #rewrite-info-btn:hover { background: #0a0a0a; color: #fff; }
    #rewrite-info-note {
      margin-top: 10px; padding: 12px 14px; background: #fffbe6;
      border: 2px solid #0a0a0a; box-shadow: 3px 3px 0 #0a0a0a;
      font-size: .875rem; line-height: 1.5; max-width: 480px;
    }
  `;
  document.head.appendChild(s);
}