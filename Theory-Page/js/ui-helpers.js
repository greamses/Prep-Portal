/* ════════════════════════════════════════
   ui-helpers.js
════════════════════════════════════════ */

/**
 * Handles standard textarea resizing (legacy support)
 */
export function autoResize(ta) {
  if (CSS.supports('field-sizing', 'content')) return;
  ta.style.height = 'auto';
  ta.style.height = ta.scrollHeight + 'px';
}

/**
 * Custom Select Component
 */
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
  
  enable() { 
    this._dis = false;
    this.btn.disabled = false;
    this.el.classList.remove('csel--dis'); 
  }
  disable() { 
    this._dis = true;
    this.btn.disabled = true;
    this.close(); 
  }
}

/**
 * Animated Ticker in the background
 */
export function initTicker() {
  const items = [
    'Government', 'Biology', 'Chemistry', 'Physics', 'Economics',
    'Literature', 'History', 'Mathematics', 'Further Maths',
    'Geography', 'Commerce', 'Accounts', 'Computer Science',
    'Agricultural Science', 'English Language',
  ];
  const doubled = [...items, ...items];
  const track = document.getElementById('ticker-track');
  if (track) {
    track.innerHTML = doubled
      .map(i => `<span class="ticker-item">${i}<span class="ticker-dot">◆</span></span>`)
      .join('');
  }
}

/**
 * Rich Text Formatting Popup (Positioned BELOW selection)
 */
export function initTextFormatting() {
  let toolbar = document.getElementById('text-format-toolbar');
  if (!toolbar) {
    toolbar = document.createElement('div');
    toolbar.id = 'text-format-toolbar';
    toolbar.innerHTML = `
      <button data-cmd="bold">B</button>
      <button data-cmd="italic">I</button>
      <button data-cmd="underline">U</button>
      <button data-cmd="double">U2</button>
    `;
    document.body.appendChild(toolbar);
  }

  const updatePopup = () => {
    const sel = window.getSelection();
    if (sel.rangeCount > 0 && !sel.isCollapsed) {
      const range = sel.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const parent = sel.anchorNode.parentElement.closest('.paper-editable');

      if (parent) {
        toolbar.style.display = 'flex';
        // Position BELOW selection + Scroll Offset
        toolbar.style.left = `${rect.left + (rect.width / 2) - (toolbar.offsetWidth / 2)}px`;
        toolbar.style.top = `${rect.bottom + window.scrollY + 15}px`;
        return;
      }
    }
    toolbar.style.display = 'none';
  };

  toolbar.addEventListener('mousedown', (e) => {
    e.preventDefault(); // Prevents losing focus
    const btn = e.target.closest('button');
    if (!btn) return;

    const cmd = btn.dataset.cmd;
    if (cmd === 'double') {
      const sel = window.getSelection();
      const range = sel.getRangeAt(0);
      const span = document.createElement('span');
      span.className = 'u-double';
      range.surroundContents(span);
    } else {
      document.execCommand(cmd, false, null);
    }
    
    // Trigger word count update
    const active = document.activeElement;
    if(active) active.dispatchEvent(new Event('input', { bubbles: true }));
  });

  document.addEventListener('selectionchange', updatePopup);
}

export function initMathJax() {
  if (window.MathJax) return;
  window.MathJax = {
    tex: { inlineMath: [['$', '$']] },
    startup: { typeset: false }
  };
  const s = document.createElement('script');
  s.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
  s.async = true;
  document.head.appendChild(s);
}
