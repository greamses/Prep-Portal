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

export class RichTextEngine {
  static init() {
    if (document.getElementById('text-format-toolbar')) return;
    const tb = document.createElement('div');
    tb.id = 'text-format-toolbar';
    tb.innerHTML = `
      <button data-cmd="bold">B</button>
      <button data-cmd="italic">I</button>
      <button data-cmd="underline">U</button>
      <button data-cmd="doubleUnderline">U2</button>
      <button data-cmd="circle">◯</button>
      <button data-cmd="box">▢</button>
      <button data-cmd="math" style="color:var(--blue); font-weight:900">∑</button>
      <select id="ts-color" title="Text Color">
        <option value="inherit">Color</option>
        <option value="#ff2200">Red</option>
        <option value="#0055ff">Blue</option>
        <option value="#00a550">Green</option>
      </select>
      <select id="ts-bg" title="Highlight">
        <option value="transparent">Highlt</option>
        <option value="#ffe500">Yellow</option>
        <option value="#ffcfcf">Pink</option>
        <option value="#cfffcf">Mint</option>
      </select>
      <button data-cmd="sizeUp">+</button>
      <button data-cmd="sizeDown">-</button>
    `;
    document.body.appendChild(tb);
    this.attachListeners(tb);
  }
  
  static toggleWrapper(className, tag = 'span') {
    const sel = window.getSelection();
    if (!sel.rangeCount) return;
    const range = sel.getRangeAt(0);
    const parent = sel.anchorNode.parentElement;
    
    if (parent && parent.classList.contains(className)) {
      // Toggle OFF: Unwrap
      const text = document.createTextNode(parent.textContent);
      parent.parentNode.replaceChild(text, parent);
    } else {
      // Toggle ON: Wrap
      const wrapper = document.createElement(tag);
      wrapper.className = className;
      range.surroundContents(wrapper);
    }
  }
  
  static changeStyle(prop, val) {
    const sel = window.getSelection();
    if (!sel.rangeCount) return;
    const range = sel.getRangeAt(0);
    const span = document.createElement('span');
    span.style[prop] = val;
    range.surroundContents(span);
  }
  
  static attachListeners(tb) {
    tb.addEventListener('mousedown', e => {
      const btn = e.target.closest('button');
      if (!btn) return;
      e.preventDefault();
      const cmd = btn.dataset.cmd;
      
      if (cmd === 'doubleUnderline') this.toggleWrapper('u-double');
      else if (cmd === 'circle') this.toggleWrapper('f-circle');
      else if (cmd === 'box') this.toggleWrapper('f-box');
      else if (cmd === 'math') MathEditor.open();
      else if (cmd === 'sizeUp') document.execCommand('fontSize', false, '4');
      else if (cmd === 'sizeDown') document.execCommand('fontSize', false, '2');
      else document.execCommand(cmd, false, null);
      
      this.refreshUI();
    });
    
    tb.querySelector('#ts-color').addEventListener('change', (e) => {
      this.changeStyle('color', e.target.value);
    });
    
    tb.querySelector('#ts-bg').addEventListener('change', (e) => {
      this.changeStyle('backgroundColor', e.target.value);
    });
    
    document.addEventListener('selectionchange', () => this.positionToolbar());
  }
  
  static positionToolbar() {
    const sel = window.getSelection();
    const tb = document.getElementById('text-format-toolbar');
    if (sel.isCollapsed || !sel.anchorNode.parentElement.closest('.paper-editable')) {
      tb.style.display = 'none';
      return;
    }
    const rect = sel.getRangeAt(0).getBoundingClientRect();
    tb.style.display = 'flex';
    tb.style.left = `${rect.left + (rect.width/2) - (tb.offsetWidth/2)}px`;
    tb.style.top = `${rect.bottom + window.scrollY + 15}px`;
  }
  
  static refreshUI() {
    const active = document.activeElement;
    if (active.classList.contains('paper-editable')) {
      active.dispatchEvent(new Event('input', { bubbles: true }));
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
          <div class="math-kb-header"><span>EQUATION EDITOR</span><button id="math-close">✕</button></div>
          <div class="math-kb-preview" id="math-preview">Type...</div>
          <textarea id="math-input" style="width:100%; height:60px; padding:10px; border:none; outline:none; font-family:monospace" placeholder="Latex code here..."></textarea>
          <div class="math-kb-grid">
            <button class="math-btn" data-latex="\\sqrt{x}">√</button>
            <button class="math-btn" data-latex="^{2}">x²</button>
            <button class="math-btn" data-latex="_{n}">xₙ</button>
            <button class="math-btn" data-latex="\\frac{a}{b}">½</button>
            <button class="math-btn" data-latex="\\pi">π</button>
            <button class="math-btn" data-latex="\\theta">θ</button>
            <button class="math-btn" data-latex="\\pm">±</button>
            <button class="math-btn" data-latex="\\sin">sin</button>
            <button class="math-btn" data-latex="\\infty">∞</button>
            <button class="math-btn" data-latex="\\Delta">Δ</button>
          </div>
          <div class="math-kb-footer">
            <button class="btn btn-primary" id="math-insert" style="flex:1">INSERT EQUATION</button>
          </div>
        </div>
      `;
      document.body.appendChild(m);
      this.initEvents();
    }
    m.style.display = 'flex';
    this.target = window.getSelection().getRangeAt(0);
  }
  
  static initEvents() {
    const m = document.getElementById('math-modal');
    const input = document.getElementById('math-input');
    const preview = document.getElementById('math-preview');
    
    input.addEventListener('input', () => {
      preview.textContent = `$${input.value}$`;
      if (window.MathJax) window.MathJax.typesetPromise([preview]);
    });
    
    m.querySelectorAll('.math-btn').forEach(btn => {
      btn.onclick = () => {
        input.value += btn.dataset.latex;
        input.dispatchEvent(new Event('input'));
      };
    });
    
    document.getElementById('math-close').onclick = () => m.style.display = 'none';
    document.getElementById('math-insert').onclick = () => {
      const latex = `$${input.value}$`;
      const node = document.createTextNode(latex);
      this.target.deleteContents();
      this.target.insertNode(node);
      m.style.display = 'none';
      input.value = '';
      window.MathJax.typesetPromise();
    };
  }
}