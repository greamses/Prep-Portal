/* ═══════════════════════════════════════════════════════
   THEORY ANALYSER  v6.1
   Multi-question · Auto-gen · Level-calibrated · Print-exact
   ─────────────────────────────────────────────────────
   TheoryAnalyser.init({ geminiKey, subject, level, mountId?, onResult? })
   await TheoryAnalyser.generateQuestions(count, signal?)
   await TheoryAnalyser.analyse(answer, question, maxMarks?)
   TheoryAnalyser.reconfigure(partial)
═══════════════════════════════════════════════════════ */
(function (global) {
  'use strict';

  let _cfg = null, _midx = 0;

  /* NOTE: gemini-3.1-* models do not exist and caused wasted retries.
     Removed. Valid fallback chain only. */
  const MODELS = [
    'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash-lite:generateContent',
    'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent',
    'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-pro:generateContent',
  ];
  const QUOTA = new Set([429, 503, 529]);

  /* ─── Gemini post ─── */
  async function _post(body) {
    for (let i = _midx; i < MODELS.length; i++) {
      let res;
      try {
        res = await fetch(`${MODELS[i]}?key=${_cfg.geminiKey}`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
      } catch (e) { console.warn('[TA] Network error, trying next model'); continue; }
      if (QUOTA.has(res.status)) { _midx = i + 1; continue; }
      if (!res.ok) throw new Error(`API ${res.status}: ${await res.text().catch(() => '')}`);
      _midx = i;
      return await res.json();
    }
    _midx = 0;
    throw new Error('All Gemini models are over quota. Please try again later.');
  }

  function _esc(s) {
    return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  /* ─── FIX: The original regex skipped \u000A (newline), which is the most
     common character Gemini puts literally inside JSON string values (especially
     in annotatedText). Literal newlines inside a JSON string are invalid and
     cause "Unexpected non-whitespace character after JSON at position N".

     Fix: convert \r\n / \r / \n → the two-character JSON escape sequence \\n
     BEFORE stripping other control characters. This is safe because properly
     escaped newlines in the AI output are already written as backslash + "n"
     (two chars, neither of which is 0x0A), so they pass through untouched. ─── */
  function _parseJSON(raw) {
    const s = raw.indexOf('{'), e = raw.lastIndexOf('}');
    if (s < 0 || e < 0) throw new Error('No JSON in AI response');
    const cleaned = raw.slice(s, e + 1)
      .replace(/\r\n/g, '\\n')          // Windows line endings → JSON escape
      .replace(/\r/g,   '\\n')          // old Mac line endings → JSON escape
      .replace(/\n/g,   '\\n')          // Unix newlines (0x0A) → JSON escape
      .replace(/\t/g,   '\\t')          // literal tabs → JSON escape
      .replace(/[\u0000-\u0008\u000B-\u001F\u007F]/g, ''); // strip remaining control chars
    return JSON.parse(cleaned);
  }

  /* ─────────────────────────────────────────────────────
     LEVEL PROFILE
  ─────────────────────────────────────────────────────── */
  function _levelProfile(level) {
    const l = (level || '').toLowerCase();
    if (/primary [123]|grade [123]|p\.?[123]/.test(l)) return {
      label:'Infant / Lower Primary (Pry 1–3)', age:'5–9', maxDefault:5,
      calibration:`
MARKING — INFANT LEVEL (age 5–9):
• Maximum generosity. One correct fact in any phrasing = FULL marks for that point.
• NEVER penalise for missing technical vocabulary.
• "Bones keep us standing" is fully correct for the skeletal system.
• Default maxMarks to 5 if not stated. Cap at 5 even if question says more.
• OUTSTANDING: student mentions 2+ facts unprompted, or uses age-advanced vocabulary.`
    };
    if (/primary [45]|grade [45]|p\.?[45]/.test(l)) return {
      label:'Lower Primary (Pry 4–5)', age:'9–11', maxDefault:8,
      calibration:`
MARKING — LOWER PRIMARY (age 9–11):
• Definition alone earns 60% of marks. Full marks needs one example or extra fact.
• Accept informal but correct equivalents.
• Default maxMarks to 8 if not stated.
• OUTSTANDING: student structures answer and provides real-world example unprompted.`
    };
    if (/primary 6|grade 6|p\.?6/.test(l)) return {
      label:'Upper Primary (Pry 6)', age:'11–12', maxDefault:10,
      calibration:`
MARKING — UPPER PRIMARY (age 11–12):
• Definition + one supporting point earns 70%. Full marks needs example or explanation.
• Default maxMarks to 10.
• OUTSTANDING: multi-point structured answer with application.`
    };
    if (/jss/.test(l)) return {
      label:'Junior Secondary (JSS)', age:'11–15', maxDefault:10,
      calibration:`
MARKING — JSS (age 11–15):
• Definition earns ~40%. Full marks needs explanation + example.
• Technical terms expected; clear informal equivalents earn partial credit.
• Default maxMarks to 10.
• OUTSTANDING: analysis or cross-subject connection typical of SS level.`
    };
    return {
      label:'Senior Secondary (SS)', age:'15–19', maxDefault:10,
      calibration:`
MARKING — SS (age 15–19):
• Definition alone earns only 20–30%. Full marks requires: definition + explanation + examples + analysis.
• Correct technical vocabulary required. Vague answers penalised even if correct.
• Default maxMarks to 10.
• OUTSTANDING: university-level depth, cross-topic synthesis, or original insight.`
    };
  }

  /* ─────────────────────────────────────────────────────
     ANNOTATED TEXT PARSER
  ─────────────────────────────────────────────────────── */
  function _parseAnnotated(raw) {
    if (!raw) return '';
    let h = raw
      .replace(/\\n\\n/g,'\n\n').replace(/\n\n/g,'<br><br>').replace(/\n/g,'<br>');

    h = h.replace(
      /<mark\s+type=['"]([^'"]+)['"]\s*(?:fix=['"]([^'"]*?)['"])?\s*>([\s\S]*?)<\/mark>/gi,
      (_, type, fix, content) => {
        if (type === 'del') return `<span class="rp-del" title="Delete">${content}</span>`;
        if (type === 'ins') return `<span class="rp-ins"><span class="rp-caret">&#x2038;</span><span class="rp-ins-w">${_esc(fix||'')}</span></span>`;
        if (fix) return `<span class="rp-wrap"><span class="rp-above">${_esc(fix)}</span><span class="rp-err">${content}</span></span>`;
        return `<span class="rp-err" title="${_esc(type)}">${content}</span>`;
      }
    );
    h = h.replace(/<ok>([\s\S]*?)<\/ok>/gi,
      (_, c) => `<span class="rp-ok"><span class="rp-tick">&#10003;</span>${c}</span>`);
    h = h.replace(/<weak>([\s\S]*?)<\/weak>/gi,
      (_, c) => `<span class="rp-weak">${c}</span>`);
    return h;
  }

  /* ─────────────────────────────────────────────────────
     INJECT CSS
  ─────────────────────────────────────────────────────── */
  function _injectCSS() {
    if (document.getElementById('ta-css')) return;
    if (!document.querySelector('link[href*="Caveat"]')) {
      const lk = document.createElement('link');
      lk.rel = 'stylesheet';
      lk.href = 'https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;700&display=swap';
      document.head.appendChild(lk);
    }
    const st = document.createElement('style');
    st.id = 'ta-css';
    st.textContent = `
.ta-root { font-family:'JetBrains Mono',monospace; color:var(--ink,#0a0a0a); }
.ta-root * { box-sizing:border-box; }

/* loading */
.ta-loading {
  display:flex; align-items:center; gap:14px; padding:20px 24px;
  border:var(--border,2.5px solid #0a0a0a); background:var(--bg,#fff);
  box-shadow:5px 5px 0 var(--ink,#0a0a0a);
  font-family:'JetBrains Mono',monospace; font-size:10px; font-weight:600;
  text-transform:uppercase; letter-spacing:.12em; color:var(--muted,#777);
}
.ta-spinner {
  width:18px; height:18px; flex-shrink:0;
  border:2.5px solid var(--ruled,#ece8df); border-top-color:var(--ink,#0a0a0a);
  border-radius:50%; animation:ta-spin .7s linear infinite;
}
@keyframes ta-spin { to { transform:rotate(360deg); } }

/* error */
.ta-error {
  padding:20px 24px; border:var(--border,2.5px solid #0a0a0a);
  border-left:5px solid var(--red,#ff2200); background:var(--bg,#fff);
  box-shadow:5px 5px 0 var(--ink,#0a0a0a); font-size:11px;
}
.ta-error strong {
  display:block; margin-bottom:6px; font-family:'Unbounded',sans-serif;
  font-weight:700; font-size:10px; text-transform:uppercase; letter-spacing:.08em;
  color:var(--red,#ff2200);
}

/* ── Age mismatch notice ── */
.ta-mismatch, .ta-outstanding {
  display:flex; gap:16px; align-items:flex-start; padding:16px 20px;
  border:var(--border,2.5px solid #0a0a0a); margin-bottom:14px;
  box-shadow:4px 4px 0 var(--ink,#0a0a0a);
}
.ta-mismatch {
  border-left:5px solid var(--amber,#e67e00);
  background:rgba(230,126,0,.07);
}
.ta-outstanding {
  border-left:5px solid var(--yellow,#ffe500);
  background:rgba(255,229,0,.1); position:relative; overflow:hidden;
}
.ta-outstanding::before {
  content:'★'; position:absolute; right:16px; top:50%;
  transform:translateY(-50%); font-size:5rem; opacity:.05;
  font-family:'Unbounded',sans-serif; font-weight:900; pointer-events:none;
}
.ta-notice-icon { font-size:1.4rem; flex-shrink:0; line-height:1; }
.ta-notice-title {
  font-family:'Unbounded',sans-serif; font-weight:700; font-size:8.5px;
  text-transform:uppercase; letter-spacing:.12em; margin-bottom:5px;
}
.ta-mismatch .ta-notice-title { color:var(--amber,#e67e00); }
.ta-outstanding .ta-notice-title { color:var(--ink,#0a0a0a); }
.ta-notice-body {
  font-family:'JetBrains Mono',monospace; font-size:10.5px; line-height:1.75;
}

/* ════════════════════════════
   ANSWER PAPER
════════════════════════════ */
.ta-paper {
  position:relative;
  background-color:var(--paper,#fffef8);
  background-image:
    linear-gradient(to right, transparent 56px, rgba(255,34,0,.25) 56px, rgba(255,34,0,.25) 58px, transparent 58px);
  border:var(--border,2.5px solid #0a0a0a);
  box-shadow:6px 6px 0 var(--ink,#0a0a0a);
  margin-bottom:22px;
  -webkit-print-color-adjust:exact; print-color-adjust:exact;
}

/* paper sheet header */
.ta-sheet-hdr {
  display:grid; grid-template-columns:1fr auto;
  gap:10px; align-items:start;
  padding:14px 20px 12px 68px;
  border-bottom:2px solid var(--ruled,#ece8df);
  background:rgba(255,254,248,.96);
  -webkit-print-color-adjust:exact; print-color-adjust:exact;
}
.ta-sheet-info { display:flex; flex-wrap:wrap; gap:4px 24px; }
.ta-sheet-field {
  font-family:'JetBrains Mono',monospace; font-size:9px; font-weight:600;
  text-transform:uppercase; letter-spacing:.12em; color:var(--muted,#777);
}
.ta-sheet-field span {
  color:var(--ink,#0a0a0a); margin-left:4px;
  font-family:'Caveat',cursive; font-size:1rem; font-weight:700;
  text-transform:none; letter-spacing:0;
}

/* total score stamp (sheet level) */
.ta-sheet-stamp-zone { position:relative; }
.ta-stamp {
  display:inline-flex; flex-direction:column; align-items:center; justify-content:center;
  gap:1px; padding:9px 14px;
  border-width:3px; border-style:solid;
  box-shadow:inset 0 0 0 1px currentColor;
  transform:rotate(-8deg); transform-origin:center;
  opacity:.88; line-height:1; user-select:none;
  background:rgba(255,254,248,.85); min-width:76px; text-align:center;
  transition:opacity .2s, transform .2s; cursor:default;
  -webkit-print-color-adjust:exact; print-color-adjust:exact;
}
.ta-stamp:hover { opacity:1; transform:rotate(-8deg) scale(1.05); }
.ta-stamp-score { font-family:'Unbounded',sans-serif; font-weight:900; font-size:1.8rem; letter-spacing:-.02em; }
.ta-stamp-band  { font-family:'JetBrains Mono',monospace; font-weight:600; font-size:7px; text-transform:uppercase; letter-spacing:.18em; }
.ta-stamp-star  {
  position:absolute; top:-10px; right:-10px;
  background:var(--yellow,#ffe500); border:2px solid var(--ink,#0a0a0a);
  box-shadow:2px 2px 0 var(--ink,#0a0a0a);
  font-size:7px; font-weight:900; font-family:'Unbounded',sans-serif;
  text-transform:uppercase; letter-spacing:.1em; padding:3px 7px;
  z-index:5; white-space:nowrap;
}
.ta-s-excellent { color:var(--green,#00a550); border-color:var(--green,#00a550); }
.ta-s-good      { color:var(--blue,#0055ff);  border-color:var(--blue,#0055ff); }
.ta-s-average   { color:var(--amber,#e67e00); border-color:var(--amber,#e67e00); }
.ta-s-weak      { color:var(--amber,#e67e00); border-color:var(--amber,#e67e00); }
.ta-s-very-weak { color:var(--red,#ff2200);   border-color:var(--red,#ff2200); }

/* per-question block inside paper */
.ta-q-block { border-top:1px dashed rgba(0,0,0,.12); position:relative; }
.ta-q-block:first-child { border-top:none; }

.ta-q-label {
  display:flex; align-items:center; gap:10px;
  padding:10px 20px 6px 68px;
  background:rgba(255,254,248,.9);
}
.ta-q-num {
  font-family:'Unbounded',sans-serif; font-weight:900; font-size:9px;
  letter-spacing:.1em; text-transform:uppercase;
}
.ta-q-compulsory {
  font-family:'JetBrains Mono',monospace; font-size:8px; font-weight:600;
  text-transform:uppercase; letter-spacing:.12em;
  color:var(--red,#ff2200); display:flex; align-items:center; gap:3px;
}
.ta-q-marks-badge {
  margin-left:auto;
  font-family:'JetBrains Mono',monospace; font-size:8px; font-weight:600;
  text-transform:uppercase; letter-spacing:.1em; color:var(--muted,#777);
}
.ta-q-marks-badge span { color:var(--ink,#0a0a0a); font-weight:700; }

.ta-q-qtext {
  padding:4px 20px 8px 68px;
  font-family:'JetBrains Mono',monospace; font-size:11px; font-weight:600;
  line-height:1.65; color:var(--ink,#0a0a0a);
}

/* small per-question stamp */
.ta-q-stamp-wrap {
  position:absolute; right:14px; top:8px; z-index:4;
}
.ta-q-stamp {
  display:inline-flex; flex-direction:column; align-items:center;
  gap:1px; padding:6px 10px;
  border-width:2.5px; border-style:solid;
  box-shadow:inset 0 0 0 1px currentColor;
  transform:rotate(-6deg); transform-origin:center;
  opacity:.85; line-height:1; user-select:none;
  background:rgba(255,254,248,.8); text-align:center;
  -webkit-print-color-adjust:exact; print-color-adjust:exact;
}
.ta-q-stamp-score { font-family:'Unbounded',sans-serif; font-weight:900; font-size:1.15rem; letter-spacing:-.02em; }
.ta-q-stamp-lbl   { font-family:'JetBrains Mono',monospace; font-size:6.5px; font-weight:600; text-transform:uppercase; letter-spacing:.16em; }

/* annotated answer */
.ta-annotated {
  background-image:
    repeating-linear-gradient(to bottom,
      transparent, transparent 31px,
      var(--ruled,#ece8df) 31px, var(--ruled,#ece8df) 32px);
  background-position: 0 0;
  padding: 9px 24px 32px 68px;
  font-family:'Caveat',cursive; font-size:1.14rem; font-weight:500;
  line-height:32px; color:#1a1a2e;
  word-wrap:break-word; overflow-wrap:break-word; min-height:96px;
  -webkit-print-color-adjust:exact; print-color-adjust:exact;
}

/* ── Teacher notes ── */
.ta-teacher-notes {
  padding: 10px 24px 18px 68px;
  border-top: 1px dashed rgba(255,34,0,.2);
  -webkit-print-color-adjust:exact; print-color-adjust:exact;
}
.ta-tn-heading {
  font-family:'Caveat',cursive; font-size:.9rem; font-weight:700;
  color:var(--red,#ff2200); opacity:.7;
  text-transform:uppercase; letter-spacing:.06em;
  margin-bottom:4px;
}
.ta-tn-list { list-style:none; padding:0; margin:0; }
.ta-tn-list li {
  font-family:'Caveat',cursive; font-size:1.04rem; font-weight:500;
  color:var(--red,#ff2200);
  line-height:1.55; padding-left:16px; position:relative;
  margin-bottom:2px;
}
.ta-tn-list.miss li::before {
  content:'✗'; position:absolute; left:0;
  font-weight:700; font-size:1em;
}
.ta-tn-list.impr li::before {
  content:'↗'; position:absolute; left:0;
  font-size:.95em;
}
.rp-wrap {
  display:inline-block; vertical-align:bottom;
  position:relative; padding-top:1.5em; line-height:1.4;
}
.rp-above {
  position:absolute; bottom:calc(100% - 1.5em); left:50%;
  transform:translateX(-50%);
  font-family:'Caveat',cursive; font-size:1em; font-weight:700;
  color:var(--red,#ff2200); white-space:nowrap; line-height:1; pointer-events:none;
}
.rp-err { text-decoration:underline wavy var(--red,#ff2200); text-decoration-thickness:1.5px; }
.rp-del { font-family:'Caveat',cursive; font-weight:700; color:var(--red,#ff2200); text-decoration:line-through var(--red,#ff2200); text-decoration-thickness:2px; }
.rp-ins { font-family:'Caveat',cursive; font-weight:700; color:var(--red,#ff2200); }
.rp-caret { margin-right:1px; }
.rp-ins-w { font-size:.95em; }
.rp-ok {
  background:rgba(0,165,80,.14); border-radius:2px; padding:0 2px;
  outline:1.5px solid rgba(0,165,80,.3);
  -webkit-print-color-adjust:exact; print-color-adjust:exact;
}
.rp-tick { font-family:'Caveat',cursive; font-weight:700; color:var(--green,#00a550); font-size:1.1em; margin-right:1px; }
.rp-weak { text-decoration:underline wavy var(--amber,#e67e00); text-decoration-thickness:1.5px; }

/* legend */
.ta-legend {
  display:flex; flex-wrap:wrap; gap:8px 18px;
  padding:9px 20px 11px 68px;
  border-top:1px dashed var(--ruled,#ece8df);
  background:rgba(255,254,248,.9);
  font-family:'JetBrains Mono',monospace; font-size:8px;
  color:var(--muted,#777); text-transform:uppercase; letter-spacing:.09em;
  -webkit-print-color-adjust:exact; print-color-adjust:exact;
}
.ta-leg-i { display:flex; align-items:center; gap:6px; }

/* ════════════════════════════
   RESULT CARDS (screen only)
════════════════════════════ */
.ta-summary-card, .ta-card {
  border:var(--border,2.5px solid #0a0a0a);
  background:var(--bg,#fff);
  box-shadow:5px 5px 0 var(--ink,#0a0a0a);
  margin-bottom:14px; overflow:hidden;
  animation:ta-in .3s ease both;
}
@keyframes ta-in { from{opacity:0;transform:translateY(5px);} to{opacity:1;transform:none;} }
.ta-card-hd {
  display:flex; align-items:center; gap:10px; padding:11px 18px;
  border-bottom:var(--border,2.5px solid #0a0a0a);
  background:var(--ink,#0a0a0a); color:var(--bg,#fff);
  font-family:'Unbounded',sans-serif; font-weight:700;
  font-size:8px; text-transform:uppercase; letter-spacing:.14em;
}
.ta-hd-pill {
  padding:2px 9px; border:2px solid var(--yellow,#ffe500);
  background:var(--yellow,#ffe500); color:var(--ink,#0a0a0a);
  font-family:'Unbounded',sans-serif; font-size:7.5px;
  font-weight:700; text-transform:uppercase; letter-spacing:.1em; white-space:nowrap;
}
.ta-hd-ghost {
  padding:2px 9px; border:1.5px solid rgba(255,255,255,.3);
  color:rgba(255,255,255,.55); font-family:'JetBrains Mono',monospace;
  font-size:8px; font-weight:600; letter-spacing:.08em; white-space:nowrap;
}
.ta-feedback {
  padding:18px 20px; font-family:'JetBrains Mono',monospace;
  font-size:10.5px; line-height:1.9;
  border-left:5px solid var(--yellow,#ffe500); background:var(--off,#f7f4ee);
}

/* summary row */
.ta-summary-row {
  display:flex; flex-wrap:wrap; gap:0;
  border-bottom:var(--border,2.5px solid #0a0a0a);
}
.ta-summary-cell {
  padding:16px 20px; border-right:var(--border,2.5px solid #0a0a0a);
  flex:1; min-width:90px;
}
.ta-summary-cell:last-child { border-right:none; }
.ta-sc-label {
  font-family:'JetBrains Mono',monospace; font-size:7.5px; font-weight:600;
  text-transform:uppercase; letter-spacing:.14em; color:var(--muted,#777);
  margin-bottom:6px;
}
.ta-sc-val {
  font-family:'Unbounded',sans-serif; font-weight:900; font-size:1.5rem;
  line-height:1;
}

/* tbl */
.ta-tbl { width:100%; border-collapse:collapse; }
.ta-tbl th {
  text-align:left; padding:8px 14px; font-family:'JetBrains Mono',monospace;
  font-size:8px; font-weight:600; letter-spacing:.12em; text-transform:uppercase;
  color:var(--muted,#777); border-bottom:var(--border,2.5px solid #0a0a0a);
  background:var(--off,#f7f4ee);
}
.ta-tbl td {
  padding:10px 14px; font-family:'JetBrains Mono',monospace; font-size:10.5px;
  line-height:1.6; border-bottom:1px solid var(--ruled,#ece8df); vertical-align:top;
}
.ta-tbl tr:last-child td { border-bottom:none; }
.ta-tbl .tc-m { width:60px; text-align:center; font-weight:700; }
.ta-tbl .tc-n { font-size:9.5px; color:var(--muted,#777); font-style:italic; }
.ta-green { color:var(--green,#00a550); }
.ta-amber { color:var(--amber,#e67e00); }
.ta-red   { color:var(--red,#ff2200); }

.ta-list { list-style:none; padding:0; margin:0; }
.ta-list li {
  padding:10px 14px 10px 36px; position:relative;
  font-family:'JetBrains Mono',monospace; font-size:10.5px;
  line-height:1.65; border-bottom:1px solid var(--ruled,#ece8df);
}
.ta-list li:last-child { border-bottom:none; }
.ta-list.miss li::before { content:'✗'; position:absolute; left:12px; color:var(--red,#ff2200); font-weight:700; font-size:1rem; }
.ta-list.impr { counter-reset:n; }
.ta-list.impr li { counter-increment:n; }
.ta-list.impr li::before {
  content:counter(n); position:absolute; left:10px; top:11px;
  width:20px; height:20px; background:var(--ink,#0a0a0a); color:var(--bg,#fff);
  border-radius:50%; font-family:'Unbounded',sans-serif; font-size:7px; font-weight:700;
  line-height:20px; text-align:center; display:inline-block;
}
.ta-tips { display:grid; grid-template-columns:repeat(auto-fill,minmax(185px,1fr)); gap:10px; padding:14px; }
.ta-tip {
  border:var(--border,2.5px solid #0a0a0a); padding:14px 16px;
  box-shadow:4px 4px 0 var(--ink,#0a0a0a); background:var(--yellow,#ffe500);
  position:relative; overflow:hidden;
}
.ta-tip::after { content:''; position:absolute; inset:0; background:var(--ink,#0a0a0a); transform:translateY(102%); transition:transform .25s cubic-bezier(.16,1,.3,1); z-index:1; }
.ta-tip:hover::after { transform:translateY(0); }
.ta-tip-t,.ta-tip-b { position:relative; z-index:2; transition:color .25s; }
.ta-tip:hover .ta-tip-t { color:var(--yellow,#ffe500); }
.ta-tip:hover .ta-tip-b { color:rgba(255,229,0,.72); }
.ta-tip-t { font-family:'Unbounded',sans-serif; font-weight:700; font-size:8px; text-transform:uppercase; letter-spacing:.12em; margin-bottom:7px; }
.ta-tip-b { font-family:'JetBrains Mono',monospace; font-size:9.5px; line-height:1.7; color:rgba(10,10,10,.72); }
.ta-empty { padding:14px 18px; font-family:'JetBrains Mono',monospace; font-size:10.5px; color:var(--muted,#777); }

/* responsive */
@media (max-width:580px) {
  .ta-sheet-hdr { padding-left:14px; }
  .ta-annotated { padding-left:20px; }
  .ta-legend    { padding-left:14px; }
  .ta-q-label, .ta-q-qtext { padding-left:20px; }
  .rp-wrap { padding-top:1.2em; }
  .ta-tips { grid-template-columns:1fr; }
}

/* ════════════════════════════
   PRINT
════════════════════════════ */
@media print {
  .ta-cards-section { display:none !important; }
  .ta-mismatch, .ta-outstanding { display:none !important; }
  .ta-paper {
    box-shadow:none !important; border:1.5px solid #ccc !important;
    break-inside:avoid;
    -webkit-print-color-adjust:exact !important; print-color-adjust:exact !important;
  }
  .ta-stamp, .ta-q-stamp { opacity:1 !important; }
}
    `;
    document.head.appendChild(st);
  }

  /* ─────────────────────────────────────────────────────
     RENDER MULTI-QUESTION RESULTS
  ─────────────────────────────────────────────────────── */
  function _renderAll(results, combined, studentName, submissionDate, el) {
    const totalScore = combined.totalScore || results.reduce((s, r) => s + (r.data?.totalScore || 0), 0);
    const totalMax   = combined.totalMax   || results.reduce((s, r) => s + (r.data?.maxMarks   || 0), 0);
    const pct  = totalMax ? Math.round((totalScore / totalMax) * 100) : 0;
    const band = combined.band || (pct >= 80 ? 'Excellent' : pct >= 65 ? 'Good' : pct >= 50 ? 'Average' : pct >= 30 ? 'Weak' : 'Very Weak');
    const bk   = band.toLowerCase().replace(/\s+/g,'-');

    /* ── Build paper ── */
    let paperHtml = `
<div class="ta-paper">
  <div class="ta-sheet-hdr">
    <div class="ta-sheet-info">
      <div class="ta-sheet-field">Name: <span>${_esc(studentName)}</span></div>
      <div class="ta-sheet-field">Subject: <span>${_esc(_cfg.subject)}</span></div>
      <div class="ta-sheet-field">Class: <span>${_esc(_cfg.level)}</span></div>
      <div class="ta-sheet-field">Date: <span>${_esc(submissionDate)}</span></div>
    </div>
    <div class="ta-sheet-stamp-zone">
      ${combined.isOutstanding ? `<div class="ta-stamp-star">★ Outstanding</div>` : ''}
      <div class="ta-stamp ta-s-${bk}">
        <span class="ta-stamp-score">${totalScore}/${totalMax}</span>
        <span class="ta-stamp-band">${band}</span>
      </div>
    </div>
  </div>`;

    results.forEach((r, i) => {
      const d = r.data;
      if (!d) return;
      const qbk = (d.band||'Average').toLowerCase().replace(/\s+/g,'-');
      const annotated = _parseAnnotated(d.annotatedText || '');

      const missedItems = (d.missedPoints || []).filter(Boolean);
      const imprItems   = (d.improvements || []).filter(Boolean);
      const teacherNotes = (missedItems.length || imprItems.length) ? `
    <div class="ta-teacher-notes">
      ${missedItems.length ? `
        <div class="ta-tn-heading">Missed:</div>
        <ul class="ta-tn-list miss">${missedItems.map(p => `<li>${_esc(p)}</li>`).join('')}</ul>` : ''}
      ${imprItems.length ? `
        <div class="ta-tn-heading" style="margin-top:${missedItems.length?'8px':'0'}">Improve:</div>
        <ul class="ta-tn-list impr">${imprItems.map(p => `<li>${_esc(p)}</li>`).join('')}</ul>` : ''}
    </div>` : '';

      paperHtml += `
  <div class="ta-q-block">
    <div class="ta-q-stamp-wrap">
      <div class="ta-q-stamp ta-s-${qbk}">
        <span class="ta-q-stamp-score">${d.totalScore}/${d.maxMarks}</span>
        <span class="ta-q-stamp-lbl">${_esc(d.band)}</span>
      </div>
    </div>
    <div class="ta-q-label">
      <span class="ta-q-num">Question ${i + 1}</span>
      ${r.compulsory ? `<span class="ta-q-compulsory">★ Compulsory</span>` : ''}
      <span class="ta-q-marks-badge">Marks: <span>${d.totalScore}/${d.maxMarks}</span></span>
    </div>
    <div class="ta-q-qtext">${_esc(r.question)}</div>
    <div class="ta-annotated">${annotated || '<span style="opacity:.35;font-style:italic">No answer provided</span>'}</div>
    ${teacherNotes}
  </div>`;
    });

    paperHtml += `
  <div class="ta-legend">
    <div class="ta-leg-i"><span class="rp-ok" style="padding:0 4px"><span class="rp-tick">✓</span>text</span> Valid point</div>
    <div class="ta-leg-i"><span class="rp-weak" style="padding:0 2px">text</span> Incomplete</div>
    <div class="ta-leg-i"><span style="font-family:'Caveat',cursive;color:#ff2200;font-weight:700">fix</span> above = correction</div>
    <div class="ta-leg-i"><span class="rp-del">word</span> = delete</div>
    <div class="ta-leg-i"><span style="font-family:'Caveat',cursive;color:#ff2200;font-size:.9em">✗ Missed / ↗ Improve</span> = teacher notes</div>
  </div>
</div>`;

    /* ── Build cards (screen only) ── */
    let cardsHtml = `<div class="ta-cards-section">`;

    results.forEach((r, i) => {
      const d = r.data; if (!d) return;
      if (d.isAgeMismatch) cardsHtml += `
        <div class="ta-mismatch">
          <div class="ta-notice-icon">⚠️</div>
          <div><div class="ta-notice-title">Q${i+1}: Advanced Question</div>
          <div class="ta-notice-body">${_esc(d.ageMismatchNote)}</div></div>
        </div>`;
      if (d.isOutstanding) cardsHtml += `
        <div class="ta-outstanding">
          <div class="ta-notice-icon">🌟</div>
          <div><div class="ta-notice-title">Q${i+1}: Outstanding Performance!</div>
          <div class="ta-notice-body">${_esc(d.outstandingNote)}</div></div>
        </div>`;
    });

    cardsHtml += `
    <div class="ta-summary-card">
      <div class="ta-card-hd">Overall Score <span class="ta-hd-pill">${totalScore} / ${totalMax}</span></div>
      <div class="ta-summary-row">
        <div class="ta-summary-cell"><div class="ta-sc-label">Total</div><div class="ta-sc-val ta-green">${totalScore}/${totalMax}</div></div>
        <div class="ta-summary-cell"><div class="ta-sc-label">Percentage</div><div class="ta-sc-val">${pct}%</div></div>
        <div class="ta-summary-cell"><div class="ta-sc-label">Band</div><div class="ta-sc-val">${band}</div></div>
      </div>
      <div class="ta-feedback">${_esc(combined.overallFeedback || '')}</div>
    </div>`;

    results.forEach((r, i) => {
      const d = r.data; if (!d) return;
      const ptRows = (d.awardedPoints||[]).map(p =>
        `<tr><td style="width:24px;color:var(--green);font-weight:700">✓</td><td>${_esc(p.point)}</td><td class="tc-m ta-green">${p.marks}</td><td class="tc-n">${_esc(p.comment||'')}</td></tr>`
      ).join('');
      const missed = d.missedPoints||[];
      const impr   = d.improvements||[];
      cardsHtml += `
      <div class="ta-card">
        <div class="ta-card-hd">Q${i+1} — ${_esc(r.question.length > 60 ? r.question.slice(0,60)+'…' : r.question)}
          <span class="ta-hd-ghost">${d.totalScore}/${d.maxMarks}</span>
        </div>
        <div class="ta-feedback">${_esc(d.feedback)}</div>
        ${ptRows ? `<div style="overflow-x:auto"><table class="ta-tbl"><thead><tr><th style="width:24px"></th><th>Point</th><th style="width:60px;text-align:center">Marks</th><th>Note</th></tr></thead><tbody>${ptRows}</tbody></table></div>` : ''}
        ${missed.length ? `<div class="ta-card-hd" style="background:var(--off);color:var(--ink);border-top:var(--border);font-size:7.5px">Missed Points</div><ul class="ta-list miss">${missed.map(p=>`<li>${_esc(p)}</li>`).join('')}</ul>` : ''}
        ${impr.length ? `<div class="ta-card-hd" style="background:var(--off);color:var(--ink);border-top:var(--border);font-size:7.5px">Improvements</div><ul class="ta-list impr">${impr.map(p=>`<li>${_esc(p)}</li>`).join('')}</ul>` : ''}
      </div>`;
    });

    const oi = combined.overallImprovements || [];
    if (oi.length) cardsHtml += `<div class="ta-card"><div class="ta-card-hd">Overall Improvements</div><ul class="ta-list impr">${oi.map(p=>`<li>${_esc(p)}</li>`).join('')}</ul></div>`;

    const tips = combined.overallStudyTips || [];
    if (tips.length) {
      cardsHtml += `<div class="ta-card"><div class="ta-card-hd">Study Tips</div><div class="ta-tips">${tips.map(t=>`<div class="ta-tip"><div class="ta-tip-t">${_esc(t.title)}</div><div class="ta-tip-b">${_esc(t.tip)}</div></div>`).join('')}</div></div>`;
    }
    cardsHtml += `</div>`;

    el.innerHTML = `<div class="ta-root">${paperHtml}${cardsHtml}</div>`;
    el.scrollIntoView({ behavior:'smooth', block:'nearest' });
  }

  /* ─────────────────────────────────────────────────────
     COMBINED MARKING PROMPT (all questions in one call)
  ─────────────────────────────────────────────────────── */
  function _combinedPrompt(questionsArr, answersArr) {
    const profile = _levelProfile(_cfg.level || '');

    const qBlocks = questionsArr.map((q, i) => {
      const ml = q.marks
        ? `${q.marks} marks`
        : `infer from question text; default ${profile.maxDefault}, max 10`;
      return `--- QUESTION ${i + 1} (${ml}) ---
${q.text}

STUDENT ANSWER ${i + 1}:
${(answersArr[i] || '').trim() || '[No answer provided]'}`;
    }).join('\n\n');

    const _topicLine = (_cfg.topics && _cfg.topics.length)
      ? `\nFOCUS TOPICS: ${_cfg.topics.join(' | ')}\nAssess all content within the context of these specific topics.\n`
      : '';
    return `You are a ${_cfg.subject} examiner marking a ${profile.label} student (age ${profile.age}) in Nigeria.
Mark ALL questions below as one combined exam paper and compute a single cumulative score.${_topicLine}

${qBlocks}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LEVEL CALIBRATION:
${profile.calibration}

MARKING RULES (apply to every question):
- Award marks only for statements that are factually correct AND directly answer the question.
- Accept clear paraphrases. Reject irrelevant padding and factual errors.
- Same idea repeated in one answer = award once. Never exceed marks for that question.
- missedPoints per question: correct points the question expected that the student omitted.
- improvements per question: 2-3 specific, actionable suggestions for that answer.
- Total score = exact sum of all per-question scores.

BANDS (% of total marks): Excellent ≥80% | Good 65–79% | Average 50–64% | Weak 30–49% | Very Weak <30%

AGE-APPROPRIATENESS (per question):
If a question is clearly beyond ${profile.label}, set isAgeMismatch:true and write an encouraging ageMismatchNote for the student.

OUTSTANDING (per question):
If an answer far exceeds ${profile.label} expectations, set isOutstanding:true with a warm outstandingNote.

PROOFREAD & ANNOTATE every student answer — return the exact student text with these inline XML tags:
  <mark type="sp"    fix="correct">misspeled</mark>    spelling
  <mark type="cap"   fix="Word">word</mark>             capitalise
  <mark type="lc"    fix="word">Word</mark>             lowercase
  <mark type="agr"   fix="correct">wrong</mark>         subject-verb agreement
  <mark type="vt"    fix="correct">wrong</mark>         verb tense
  <mark type="punct" fix=". ">wrong,</mark>             punctuation
  <mark type="ww"    fix="right">wrong</mark>           wrong word
  <mark type="ins"   fix="word"> </mark>                insert missing word
  <mark type="del">extra word</mark>                    delete
  <ok>text earning marks</ok>                           valid point
  <weak>vague or incomplete point</weak>                partial

ANNOTATION RULES: Only mark errors you are certain about. Wrap ALL valid/partial content with ok/weak. Preserve original wording inside tags. Paragraph breaks as \\n\\n. Escape all JSON strings.

CRITICAL JSON RULES:
- Return ONLY valid JSON — no markdown fences, no preamble, no text after the closing brace.
- ALL string values must have newlines escaped as \\n, never literal newline characters.
- Escape any double-quotes inside string values as \\".

{
  "totalScore"        : <exact sum of all question scores>,
  "totalMax"          : <exact sum of all question maxMarks>,
  "band"              : "Excellent|Good|Average|Weak|Very Weak",
  "isOutstanding"     : <true if ANY question is outstanding>,
  "overallFeedback"   : "<2–3 sentence cumulative examiner comment>",
  "overallImprovements": ["<general improvement 1>","<general improvement 2>"],
  "overallStudyTips"  : [{ "title":"<short title>","tip":"<2 sentences>" }],
  "questions": [
    {
      "totalScore"    : <n>,
      "maxMarks"      : <n>,
      "band"          : "Excellent|Good|Average|Weak|Very Weak",
      "isAgeMismatch" : false,
      "ageMismatchNote": "",
      "isOutstanding" : false,
      "outstandingNote": "",
      "awardedPoints" : [{ "point":"<what student said>","marks":<n>,"comment":"<1 sentence>" }],
      "missedPoints"  : ["<important correct point not made>"],
      "feedback"      : "<1–2 sentence examiner comment for this question>",
      "improvements"  : ["<specific improvement>","<specific improvement>"],
      "annotatedText" : "<full student answer with all XML tags — newlines as \\n>"
    }
  ]
}`;
  }

  /* ─────────────────────────────────────────────────────
     AUTO-GEN QUESTIONS PROMPT
  ─────────────────────────────────────────────────────── */
  function _genPrompt(count, existingTopics) {
    const profile = _levelProfile(_cfg.level || '');
    const avoid = existingTopics.length ? `Avoid topics already covered: ${existingTopics.join(', ')}.` : '';
    const topicFocus = (_cfg.topics && _cfg.topics.length)
      ? `Focus questions on these specific topics ONLY: ${_cfg.topics.join(', ')}.`
      : 'Cover a range of appropriate topics for this subject.';
    return `You are a ${_cfg.subject} teacher writing exam questions for ${profile.label} students (age ${profile.age}) in Nigeria.

Generate exactly ${count} theory question(s) appropriate for this level.

RULES:
- ${topicFocus}
- Each question must be answerable in 3–10 sentences at this level.
- Questions must be specific, testable, and unambiguous.
- Vary the question types (explain, describe, state, compare, give examples, etc.)
- Suggest a mark value between 5 and 10 per question.
- ${avoid}

Return ONLY valid JSON — no markdown fences, no extra text:
{
  "questions": [
    { "text": "<question text>", "suggestedMarks": <5-10> }
  ]
}`;
  }

  /* ─────────────────────────────────────────────────────
     PUBLIC API
  ─────────────────────────────────────────────────────── */
  const TheoryAnalyser = {

    init(config = {}) {
      ['geminiKey','subject','level'].forEach(k => {
        if (!config[k]) throw new Error(`TheoryAnalyser.init: missing "${k}"`);
      });
      _cfg = { mountId:'theory-results', ...config };
      _midx = 0;
      _injectCSS();
      console.info(`[TA] Ready — ${_cfg.subject} (${_cfg.level})`);
    },

    /**
     * generateQuestions(count, existingTopics?)
     * Returns array of { text, suggestedMarks }
     */
    async generateQuestions(count = 1, existingTopics = []) {
      if (!_cfg) throw new Error('Call init() first');
      const raw = await _post({
        systemInstruction: { parts:[{ text: _genPrompt(count, existingTopics) }] },
        contents: [{ parts:[{ text: `Generate ${count} question(s) for ${_cfg.subject}, ${_cfg.level}.` }] }],
        generationConfig: { responseMimeType:'application/json', temperature:0.85, maxOutputTokens:1200 },
      });
      const text = raw.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const data = _parseJSON(text);
      return data.questions || [];
    },

    /**
     * analyseAll(questionsArr, answersArr, studentName, submissionDate)
     * questionsArr: [{text, marks, compulsory}]
     * answersArr:   [string]
     * Single API call marks all questions together, renders cumulative result.
     */
    async analyseAll(questionsArr, answersArr, studentName, submissionDate) {
      if (!_cfg) throw new Error('Call init() first');
      const el = document.getElementById(_cfg.mountId);
      if (!el) throw new Error(`No element #${_cfg.mountId}`);

      el.innerHTML = `<div class="ta-root"><div class="ta-loading"><div class="ta-spinner"></div>Marking ${questionsArr.length} question${questionsArr.length > 1 ? 's' : ''}…</div></div>`;
      el.scrollIntoView({ behavior:'smooth', block:'nearest' });

      try {
        const raw = await _post({
          systemInstruction: { parts:[{ text: _combinedPrompt(questionsArr, answersArr) }] },
          contents: [{ parts:[{ text: `Mark this exam paper for ${studentName}, ${_cfg.subject}, ${_cfg.level}.` }] }],
          generationConfig: { responseMimeType:'application/json', temperature:0.1, maxOutputTokens:10000 },
        });

        const text = raw.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const combined = _parseJSON(text);

        const results = (combined.questions || []).map((q, i) => ({
          question  : questionsArr[i]?.text || `Question ${i+1}`,
          compulsory: questionsArr[i]?.compulsory || false,
          data      : q,
        }));

        _renderAll(results, combined, studentName, submissionDate, el);

        if (typeof _cfg.onResult === 'function') try { _cfg.onResult({ combined, results }); } catch(_) {}
        return { combined, results };

      } catch (err) {
        el.innerHTML = `<div class="ta-root"><div class="ta-error"><strong>Marking failed</strong>${_esc(err.message)}</div></div>`;
        return null;
      }
    },

    reconfigure(partial = {}) {
      if (!_cfg) throw new Error('Call init() first');
      _cfg = { ..._cfg, ...partial };
    },

    getConfig() { return _cfg ? { ..._cfg } : null; },
  };

  global.TheoryAnalyser = TheoryAnalyser;
})(typeof window !== 'undefined' ? window : global);
