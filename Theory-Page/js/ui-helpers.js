/* ════════════════════════════════════════
   ui-helpers.js
════════════════════════════════════════ */

export function autoResize(ta) {
  if (CSS.supports('field-sizing', 'content')) return;
  ta.style.height = 'auto';
  ta.style.height = ta.scrollHeight + 'px';
}

export class CSelect {
  constructor(id, { onSelect } = {}) {
    this.el = document.getElementById(id);
    this.btn = this.el.querySelector('.csel-btn');
    this.valEl = this.el.querySelector('.csel-placeholder');
    this.panel = this.el.querySelector('.csel-panel');
    this.cb = onSelect;
    this.value = null;
    this._dis = false;
    
    this.btn.addEventListener('click', e => {
      e.stopPropagation();
      if (!this._dis) this.toggle();
    });
    this.panel.addEventListener('click', e => {
      const item = e.target.closest('.csel-item');
      if (!item) return;
      this.pick(item.dataset.val, item.querySelector('span')?.textContent);
    });
    document.addEventListener('click', e => {
      if (!this.el.contains(e.target)) this.close();
    });
    this.btn.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (!this._dis) this.toggle(); }
      if (e.key === 'Escape') this.close();
    });
  }
  
  toggle() {
    document.querySelectorAll('.csel.open').forEach(el => {
      if (el !== this.el) el.classList.remove('open');
    });
    const o = !this.el.classList.contains('open');
    this.el.classList.toggle('open', o);
    this.btn.setAttribute('aria-expanded', o);
  }
  
  close() {
    this.el.classList.remove('open');
    this.btn.setAttribute('aria-expanded', 'false');
  }
  
  pick(val, label) {
    this.value = val;
    this.valEl.textContent = label || val;
    this.btn.classList.add('has-val');
    this.panel.querySelectorAll('.csel-item').forEach(i =>
      i.classList.toggle('selected', i.dataset.val === val));
    this.close();
    if (this.cb) this.cb(val, label || val);
  }
  
  reset(placeholder) {
    this.value = null;
    this.valEl.textContent = placeholder || '— Select —';
    this.btn.classList.remove('has-val');
    this.panel.querySelectorAll('.csel-item').forEach(i => i.classList.remove('selected'));
  }
  
  setItems(groups) {
    let html = '';
    for (const g of groups) {
      if (g.label) html += `<div class="csel-group">${g.label}</div>`;
      for (const item of (g.items || [g])) {
        html += `<div class="csel-item" data-val="${item.val}"><span>${item.label}</span></div>`;
      }
    }
    this.panel.innerHTML = html;
  }
  
  enable() { this._dis = false;
    this.btn.disabled = false;
    this.el.classList.remove('csel--dis'); }
  disable() { this._dis = true;
    this.btn.disabled = true;
    this.close(); }
}

export function initTicker() {
  const items = [
    'Government', 'Biology', 'Chemistry', 'Physics', 'Economics',
    'Literature', 'History', 'Mathematics', 'Further Maths',
    'Geography', 'Commerce', 'Accounts', 'Computer Science',
    'Agricultural Science', 'English Language',
  ];
  const doubled = [...items, ...items];
  document.getElementById('ticker-track').innerHTML = doubled
    .map(i => `<span class="ticker-item">${i}<span class="ticker-dot">◆</span></span>`)
    .join('');
}

/* Add this to ui-helpers.js */

export function initTextFormatting() {
  // 1. Create Toolbar Element
  const toolbar = document.createElement('div');
  toolbar.id = 'text-format-toolbar';
  toolbar.innerHTML = `
    <button data-format="bold" title="Bold"><b>B</b></button>
    <button data-format="italic" title="Italic"><i>I</i></button>
    <button data-format="underline" title="Underline"><u>U</u></button>
  `;
  document.body.appendChild(toolbar);
  
  let activeTextArea = null;
  
  const handleSelection = (e) => {
    const ta = e.target;
    if (!ta.classList.contains('paper-ta')) return;
    
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    
    if (start !== end) {
      activeTextArea = ta;
      const { left, top } = getCursorXY(ta, end);
      const rect = ta.getBoundingClientRect();
      
      toolbar.style.display = 'flex';
      toolbar.style.left = `${rect.left + left}px`;
      toolbar.style.top = `${rect.top + top - 40}px`; // 40px above cursor
    } else {
      toolbar.style.display = 'none';
    }
  };
  
  // 2. Formatting Logic
  toolbar.addEventListener('mousedown', (e) => {
    e.preventDefault(); // Prevents textarea from losing focus
    const btn = e.target.closest('button');
    if (!btn || !activeTextArea) return;
    
    const format = btn.dataset.format;
    const start = activeTextArea.selectionStart;
    const end = activeTextArea.selectionEnd;
    const text = activeTextArea.value;
    const selectedText = text.substring(start, end);
    
    let newText = '';
    if (format === 'bold') newText = `**${selectedText}**`;
    if (format === 'italic') newText = `_${selectedText}_`;
    if (format === 'underline') newText = `<u>${selectedText}</u>`;
    
    activeTextArea.setRangeText(newText, start, end, 'select');
    toolbar.style.display = 'none';
    
    // Trigger the word count update manually
    activeTextArea.dispatchEvent(new Event('input'));
  });
  
  // 3. Attach Listeners
  document.addEventListener('mouseup', handleSelection);
  document.addEventListener('keyup', handleSelection);
  document.addEventListener('scroll', () => toolbar.style.display = 'none', true);
}

/**
 * Helper to find coordinates of selection in textarea
 */
function getCursorXY(textarea, selectionEnd) {
  const { offsetLeft: left, offsetTop: top } = textarea;
  const div = document.createElement('div');
  const copyStyle = getComputedStyle(textarea);
  for (const prop of copyStyle) div.style[prop] = copyStyle[prop];
  
  div.style.position = 'absolute';
  div.style.visibility = 'hidden';
  div.style.whiteSpace = 'pre-wrap';
  div.textContent = textarea.value.substring(0, selectionEnd);
  
  const span = document.createElement('span');
  span.textContent = textarea.value.substring(selectionEnd) || '.';
  div.appendChild(span);
  document.body.appendChild(div);
  
  const { offsetLeft, offsetTop } = span;
  document.body.removeChild(div);
  return { left: offsetLeft, top: offsetTop };
}