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
    if (active) active.dispatchEvent(new Event('input', { bubbles: true }));
  });
  
  document.addEventListener('selectionchange', updatePopup);
}

export function initMathJax() {
  if (window.MathJax) return;
  window.MathJax = {
    tex: { inlineMath: [
        ['$', '$']
      ] },
    startup: { typeset: false }
  };
  const s = document.createElement('script');
  s.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
  s.async = true;
  document.head.appendChild(s);
}
/* ════════════════════════════════════════
   ui-helpers.js (Upgraded)
════════════════════════════════════════ */

/* ════════════════════════════════════════
   ui-helpers.js (Rich Text & Math)
════════════════════════════════════════ */

export class RichTextEngine {
  static init() {
    let tb = document.getElementById('text-format-toolbar');
    if (tb) return;
    
    tb = document.createElement('div');
    tb.id = 'text-format-toolbar';
    tb.innerHTML = `
      <button data-cmd="bold" title="Bold">B</button>
      <button data-cmd="italic" title="Italic">I</button>
      <button data-cmd="underline" title="Underline">U</button>
      <button data-cmd="double" title="Double Underline" style="text-decoration:underline double">U2</button>
      <button data-cmd="circle" title="Circle Point">◯</button>
      <button data-cmd="box" title="Box Point">▢</button>
      <button data-cmd="math" title="Math Equation" style="color:var(--blue);font-weight:900">∑</button>
      <button data-cmd="fontSize" data-val="5" title="Increase Size">+</button>
      <button data-cmd="fontSize" data-val="3" title="Decrease Size">-</button>
    `;
    document.body.appendChild(tb);
    
    this.attachListeners(tb);
  }
  
  static attachListeners(tb) {
    tb.addEventListener('mousedown', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;
      e.preventDefault(); // Stay focused on editor
      
      const cmd = btn.dataset.cmd;
      const val = btn.dataset.val;
      
      if (cmd === 'double') this.toggleWrap('u-double');
      else if (cmd === 'circle') this.toggleWrap('f-circle');
      else if (cmd === 'box') this.toggleWrap('f-box');
      else if (cmd === 'math') MathEditor.open();
      else if (cmd === 'fontSize') document.execCommand('fontSize', false, val);
      else document.execCommand(cmd, false, null);
      
      // Trigger word count update
      document.activeElement.dispatchEvent(new Event('input', { bubbles: true }));
    });
    
    document.addEventListener('selectionchange', () => this.positionToolbar());
  }
  
  static positionToolbar() {
    const sel = window.getSelection();
    const tb = document.getElementById('text-format-toolbar');
    if (!sel.rangeCount || sel.isCollapsed || !sel.anchorNode.parentElement.closest('.paper-editable')) {
      if (tb) tb.style.display = 'none';
      return;
    }
    
    const rect = sel.getRangeAt(0).getBoundingClientRect();
    tb.style.display = 'flex';
    tb.style.left = `${rect.left + rect.width / 2 - tb.offsetWidth / 2}px`;
    tb.style.top = `${rect.bottom + window.scrollY + 10}px`;
  }
  
  static toggleWrap(className) {
    const sel = window.getSelection();
    if (!sel.rangeCount) return;
    const range = sel.getRangeAt(0);
    const parent = sel.anchorNode.parentElement;
    
    if (parent && parent.classList.contains(className)) {
      const text = document.createTextNode(parent.textContent);
      parent.parentNode.replaceChild(text, parent);
    } else {
      const span = document.createElement('span');
      span.className = className;
      range.surroundContents(span);
    }
  }
}

export class MathEditor {
  static open() {
    let m = document.getElementById('math-modal');
    if (!m) {
      m = document.createElement('div');
      m.id = 'math-modal';
      m.innerHTML = `
        <div class="math-kb-wrap">
          <div class="math-kb-header"><span>MATH KEYBOARD</span><button id="math-close">✕</button></div>
          <div class="math-kb-preview" id="math-preview">$...$</div>
          <textarea id="math-input" placeholder="Type LaTeX or use buttons..."></textarea>
          <div class="math-kb-grid">
            <button data-latex="\\frac{x}{y}">x/y</button>
            <button data-latex="\\sqrt{x}">√x</button>
            <button data-latex="^{2}">x²</button>
            <button data-latex="_{n}">xₙ</button>
            <button data-latex="\\pi">π</button>
            <button data-latex="\\pm">±</button>
            <button data-latex="\\sin">sin</button>
            <button data-latex="\\Delta">Δ</button>
          </div>
          <button id="math-insert">INSERT EQUATION</button>
        </div>
      `;
      document.body.appendChild(m);
      this.initEvents();
    }
    m.style.display = 'flex';
    this.savedRange = window.getSelection().getRangeAt(0);
  }
  
  static initEvents() {
    const m = document.getElementById('math-modal');
    const input = document.getElementById('math-input');
    const preview = document.getElementById('math-preview');
    
    input.oninput = () => {
      preview.textContent = `$${input.value}$`;
      if (window.MathJax) window.MathJax.typesetPromise([preview]);
    };
    
    m.querySelectorAll('.math-kb-grid button').forEach(btn => {
      btn.onclick = () => {
        input.value += btn.dataset.latex;
        input.dispatchEvent(new Event('input'));
      };
    });
    
    document.getElementById('math-close').onclick = () => m.style.display = 'none';
    document.getElementById('math-insert').onclick = () => {
      const node = document.createTextNode(`$${input.value}$`);
      this.savedRange.deleteContents();
      this.savedRange.insertNode(node);
      m.style.display = 'none';
      input.value = '';
      if (window.MathJax) window.MathJax.typesetPromise();
    };
  }
}