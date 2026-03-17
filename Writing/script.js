/* ═══════════════════════════════════════════════════════
   PREPBOT — ADVANCED PROOFREADING ENGINE v4
   Drop-in replacement script.
═══════════════════════════════════════════════════════ */

/* ── API ── */
const p1 = "gsk_9sz5p",
  p2 = "0Vrwv8chiknSBrJW",
  p3 = "Gdyb3FYnQIifcPYSc9",
  p4 = "Dhi1tMvB8VmAh";
const GROQ_KEY = p1 + p2 + p3 + p4;
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

/* ─────────────────────────────────────────────────────
   ERROR TYPE REFERENCE TABLE
   Used by the annotation popover to explain each mark.
─────────────────────────────────────────────────────── */
const ERROR_TYPES = {
  del:   { name: 'Delete Word',                 desc: 'This word is unnecessary and should be removed from the sentence.' },
  ins:   { name: 'Insert Missing Word',          desc: 'A word is missing here. The suggested fix shows what to insert.' },
  cap:   { name: 'Capitalise',                   desc: 'This word should begin with a capital letter — start of sentence or a proper noun.' },
  lc:    { name: 'Make Lowercase',              desc: 'This word is incorrectly capitalised in this position.' },
  trans: { name: 'Transpose / Swap Order',       desc: 'The words in this phrase are in the wrong order and need to be swapped.' },
  para:  { name: 'New Paragraph',               desc: 'A new paragraph should begin at this point in the text.' },
  spell: { name: 'Spell Out Abbreviation',       desc: 'Write this abbreviation out in full. Avoid abbreviations in formal writing.' },
  sp:    { name: 'Misspelling',                 desc: 'This word is spelled incorrectly. Check a dictionary for the correct spelling.' },
  run:   { name: 'Run-on Sentence',             desc: 'Two or more independent clauses are fused without correct punctuation or a coordinating conjunction.' },
  frag:  { name: 'Sentence Fragment',           desc: 'This is not a complete sentence — it is missing a subject, a predicate, or both.' },
  punct: { name: 'Wrong Punctuation',           desc: 'The punctuation mark here is incorrect or misplaced for this context.' },
  ww:    { name: 'Wrong Word',                  desc: 'Incorrect word choice — likely a homophone (e.g. there/their/they\'re) or confusion between similar words.' },
  agr:   { name: 'Subject-Verb Agreement',      desc: 'The subject and verb do not agree in number or person. E.g. "The students was" should be "The students were".' },
  vt:    { name: 'Wrong Verb Tense',            desc: 'The verb tense used here does not match the time frame of the sentence or passage.' },
  art:   { name: 'Article Error (a/an/the)',    desc: 'Wrong or missing article. Article use depends on context and whether a noun is countable.' },
  prep:  { name: 'Wrong Preposition',           desc: 'Incorrect preposition used. Many are idiomatic, e.g. "interested in", not "interested on".' },
  rep:   { name: 'Unnecessary Repetition',      desc: 'This word or phrase appears too soon after its previous use. Vary your vocabulary.' },
  ref:   { name: 'Unclear Pronoun Reference',   desc: 'It is unclear which noun this pronoun refers to. Rewrite to remove the ambiguity.' },
  cs:    { name: 'Comma Splice',               desc: 'Two independent clauses joined only by a comma. Use a semicolon, a conjunction, or two separate sentences.' },
  wo:    { name: 'Word Order Error',            desc: 'The words are not in the standard English grammatical order for this phrase or clause.' },
  par:   { name: 'Faulty Parallel Structure',   desc: 'All items in a list must be in the same grammatical form (e.g. all gerunds or all infinitives).' },
};

/* ─────────────────────────────────────────────────────
   INJECT EXTENDED STYLES
─────────────────────────────────────────────────────── */
(function injectStyles() {
  const css = `

  /* ── ensure paper text is always horizontal ── */
  .annotated-paper,
  #annotated-text {
    writing-mode: horizontal-tb !important;
    direction: ltr !important;
  }

  /* ── SHARED label base — wrap rather than overflow ── */
  .doodle::before {
    white-space: normal !important;
    max-width: 90px;
    text-align: center;
    line-height: 1.15;
    word-break: break-word;
  }

  /* ── ALL doodle marks are now clickable ── */
  .doodle {
    cursor: pointer;
    position: relative;
  }

  /* ════════ MARK TYPES ════════ */

  .doodle-ww { background: rgba(220,38,38,.1); border-bottom: 2.5px double #dc2626; }
  .doodle-ww::before { content:'ww'; position:absolute; bottom:calc(100% + 3px); left:50%; transform:translateX(-50%); color:#dc2626; font-family:'Caveat',cursive; font-size:.85em; font-weight:700; pointer-events:none; z-index:5; }

  .doodle-agr { background: rgba(234,88,12,.1); border-bottom: 2.5px solid #ea580c; }
  .doodle-agr::before { content:'agr'; position:absolute; bottom:calc(100% + 3px); left:50%; transform:translateX(-50%); color:#ea580c; font-family:'Caveat',cursive; font-size:.85em; font-weight:700; pointer-events:none; z-index:5; }

  .doodle-vt { background: rgba(124,58,237,.09); border-bottom: 2.5px dashed #7c3aed; }
  .doodle-vt::before { content:'vt'; position:absolute; bottom:calc(100% + 3px); left:50%; transform:translateX(-50%); color:#7c3aed; font-family:'Caveat',cursive; font-size:.85em; font-weight:700; pointer-events:none; z-index:5; }

  .doodle-art { background: rgba(2,132,199,.09); border-bottom: 2.5px dotted #0284c7; }
  .doodle-art::before { content:'art'; position:absolute; bottom:calc(100% + 3px); left:50%; transform:translateX(-50%); color:#0284c7; font-family:'Caveat',cursive; font-size:.85em; font-weight:700; pointer-events:none; z-index:5; }

  .doodle-prep { background: rgba(219,39,119,.08); border-bottom: 2.5px dotted #db2777; }
  .doodle-prep::before { content:'prep'; position:absolute; bottom:calc(100% + 3px); left:50%; transform:translateX(-50%); color:#db2777; font-family:'Caveat',cursive; font-size:.85em; font-weight:700; pointer-events:none; z-index:5; }

  .doodle-rep { background: rgba(180,83,9,.12); border-bottom: 2.5px solid #b45309; }
  .doodle-rep::before { content:'rep'; position:absolute; bottom:calc(100% + 3px); left:50%; transform:translateX(-50%); color:#b45309; font-family:'Caveat',cursive; font-size:.85em; font-weight:700; pointer-events:none; z-index:5; }

  .doodle-ref { background: rgba(15,118,110,.09); border-bottom: 2.5px dashed #0f766e; }
  .doodle-ref::before { content:'ref?'; position:absolute; bottom:calc(100% + 3px); left:50%; transform:translateX(-50%); color:#0f766e; font-family:'Caveat',cursive; font-size:.85em; font-weight:700; pointer-events:none; z-index:5; }

  .doodle-cs { background: rgba(185,28,28,.08); outline: 2px dashed #b91c1c; outline-offset: 1px; border-radius: 2px; }
  .doodle-cs::before { content:'cs'; position:absolute; bottom:calc(100% + 3px); left:50%; transform:translateX(-50%); color:#b91c1c; font-family:'Caveat',cursive; font-size:.85em; font-weight:700; pointer-events:none; z-index:5; }

  .doodle-wo { background: rgba(99,102,241,.1); border-bottom: 2.5px wavy #6366f1; text-decoration-thickness: 2px; }
  .doodle-wo::before { content:'w/o'; position:absolute; bottom:calc(100% + 3px); left:50%; transform:translateX(-50%); color:#6366f1; font-family:'Caveat',cursive; font-size:.85em; font-weight:700; pointer-events:none; z-index:5; }

  .doodle-par { background: rgba(5,150,105,.08); border-top: 2.5px solid #059669; border-bottom: 2.5px solid #059669; padding: 2px 0; }
  .doodle-par::before { content:'par'; position:absolute; bottom:calc(100% + 3px); left:50%; transform:translateX(-50%); color:#059669; font-family:'Caveat',cursive; font-size:.85em; font-weight:700; pointer-events:none; z-index:5; }

  .doodle-del { background: rgba(220,38,38,.08); text-decoration: line-through; text-decoration-color: #dc2626; }
  .doodle-del::before { content:'del'; position:absolute; bottom:calc(100% + 3px); left:50%; transform:translateX(-50%); color:#dc2626; font-family:'Caveat',cursive; font-size:.85em; font-weight:700; pointer-events:none; z-index:5; }

  .doodle-ins { background: rgba(22,163,74,.08); border-bottom: 2.5px solid #16a34a; }
  .doodle-ins::before { content:'ins'; position:absolute; bottom:calc(100% + 3px); left:50%; transform:translateX(-50%); color:#16a34a; font-family:'Caveat',cursive; font-size:.85em; font-weight:700; pointer-events:none; z-index:5; }

  .doodle-cap { background: rgba(234,88,12,.08); border-bottom: 2.5px solid #ea580c; text-transform: capitalize; }
  .doodle-cap::before { content:'cap'; position:absolute; bottom:calc(100% + 3px); left:50%; transform:translateX(-50%); color:#ea580c; font-family:'Caveat',cursive; font-size:.85em; font-weight:700; pointer-events:none; z-index:5; }

  .doodle-lc { background: rgba(2,132,199,.08); border-bottom: 2.5px solid #0284c7; }
  .doodle-lc::before { content:'lc'; position:absolute; bottom:calc(100% + 3px); left:50%; transform:translateX(-50%); color:#0284c7; font-family:'Caveat',cursive; font-size:.85em; font-weight:700; pointer-events:none; z-index:5; }

  .doodle-trans { background: rgba(124,58,237,.08); border-bottom: 2.5px dashed #7c3aed; }
  .doodle-trans::before { content:'trans'; position:absolute; bottom:calc(100% + 3px); left:50%; transform:translateX(-50%); color:#7c3aed; font-family:'Caveat',cursive; font-size:.85em; font-weight:700; pointer-events:none; z-index:5; }

  .doodle-para { background: rgba(0,0,0,.06); border-left: 3px solid #0a0a0a; padding-left: 4px; }
  .doodle-para::before { content:'para'; position:absolute; bottom:calc(100% + 3px); left:50%; transform:translateX(-50%); color:#0a0a0a; font-family:'Caveat',cursive; font-size:.85em; font-weight:700; pointer-events:none; z-index:5; }

  .doodle-spell { background: rgba(100,100,100,.08); border-bottom: 2.5px dotted #666; }
  .doodle-spell::before { content:'sp.o'; position:absolute; bottom:calc(100% + 3px); left:50%; transform:translateX(-50%); color:#666; font-family:'Caveat',cursive; font-size:.85em; font-weight:700; pointer-events:none; z-index:5; }

  .doodle-sp { background: rgba(220,38,38,.1); border-bottom: 2.5px wavy #dc2626; }
  .doodle-sp::before { content:'sp'; position:absolute; bottom:calc(100% + 3px); left:50%; transform:translateX(-50%); color:#dc2626; font-family:'Caveat',cursive; font-size:.85em; font-weight:700; pointer-events:none; z-index:5; }

  .doodle-run { background: rgba(185,28,28,.08); outline: 2px solid #b91c1c; outline-offset: 1px; border-radius: 2px; }
  .doodle-run::before { content:'run-on'; position:absolute; bottom:calc(100% + 3px); left:50%; transform:translateX(-50%); color:#b91c1c; font-family:'Caveat',cursive; font-size:.85em; font-weight:700; pointer-events:none; z-index:5; }

  .doodle-frag { background: rgba(220,38,38,.08); border-bottom: 2.5px dotted #dc2626; }
  .doodle-frag::before { content:'frag'; position:absolute; bottom:calc(100% + 3px); left:50%; transform:translateX(-50%); color:#dc2626; font-family:'Caveat',cursive; font-size:.85em; font-weight:700; pointer-events:none; z-index:5; }

  .doodle-punct { background: rgba(220,38,38,.12); border-bottom: 2.5px solid #dc2626; }
  .doodle-punct::before { content:'punct'; position:absolute; bottom:calc(100% + 3px); left:50%; transform:translateX(-50%); color:#dc2626; font-family:'Caveat',cursive; font-size:.85em; font-weight:700; pointer-events:none; z-index:5; }

  /* ════════ COLOUR HIGHLIGHTERS ════════ */

  .hl-grammar   { background: rgba(253,224,71,.55); border-radius: 2px; padding: 0 1px; }
  .hl-vocab     { background: rgba(96,165,250,.3);  border-radius: 2px; padding: 0 1px; }
  .hl-structure { background: rgba(251,146,60,.3);  border-radius: 2px; padding: 0 1px; }
  .hl-style     { background: rgba(196,181,253,.45);border-radius: 2px; padding: 0 1px; }
  .hl-good      { background: rgba(74,222,128,.3);  border-radius: 2px; padding: 0 1px; position: relative; cursor: help; }
  .hl-good::after {
    content: 'ok';
    position: absolute; bottom: calc(100% + 2px); left: 50%; transform: translateX(-50%);
    color: #16a34a; font-family:'Caveat',cursive; font-size:1em; font-weight:700;
    pointer-events:none; z-index:5;
    background: rgba(74,222,128,.2); padding: 0 3px; border-radius: 2px;
  }

  /* ════════ WORD / SENTENCE SUBSTITUTION MARKS ════════ */

  .sub-word {
    cursor: pointer;
    border-bottom: 2px solid #0055ff;
    color: #0055ff;
    background: transparent;
    transition: background .1s;
  }
  .sub-word:hover { background: rgba(0,85,255,.08); }

  .sent-sub {
    cursor: pointer;
    border-bottom: 2px solid #e67e00;
    color: #e67e00;
    background: transparent;
    transition: background .1s;
  }
  .sent-sub:hover { background: rgba(230,126,0,.08); }

  /* ════════ MARGIN COMMENT MARKERS ════════ */

  .margin-comment-marker {
    display: inline-flex; align-items: center; justify-content: center;
    width: 19px; height: 19px; background: #dc2626; color: #fff;
    font-family: 'Unbounded','Syne',sans-serif; font-size: 9px; font-weight: 700;
    border-radius: 50%; border: none; cursor: pointer;
    position: relative; top: -5px; margin: 0 2px;
    z-index: 10; flex-shrink: 0; vertical-align: middle;
    transition: transform .12s, background .12s;
    box-shadow: 1px 1px 0 rgba(0,0,0,.25);
  }
  .margin-comment-marker:hover  { transform: scale(1.25); background: #b91c1c; }
  .margin-comment-marker.active { background: #7f1d1d; transform: scale(1.15); }

  /* ════════ COMMENT POPOVER ════════ */

  #comment-popover {
    position: fixed; background: #fff; border: 2.5px solid #dc2626;
    box-shadow: 5px 5px 0 rgba(220,38,38,.25); padding: 12px 14px;
    z-index: 2000; max-width: 280px; min-width: 180px;
    display: none; animation: popIn .2s cubic-bezier(.16,1,.3,1);
  }
  #comment-popover.visible { display: block; }
  .comment-pop-label {
    font-family: 'Unbounded','Syne',sans-serif; font-size: 8px; font-weight: 700;
    text-transform: uppercase; letter-spacing: .1em; color: #dc2626;
    margin-bottom: 7px; display: flex; align-items: center; gap: 5px;
    border-bottom: 1px solid rgba(220,38,38,.2); padding-bottom: 6px;
  }
  .comment-pop-text { font-family: 'Caveat',cursive; font-size: 15px; line-height: 1.55; color: #1a1a1a; }

  /* ════════ ENHANCED ANNOTATION POPOVER ════════ */

  #mark-popover {
    position: fixed; background: #fff; border: 2.5px solid #0a0a0a;
    box-shadow: 6px 6px 0 #0a0a0a; padding: 14px; z-index: 2000;
    max-width: 330px; min-width: 240px;
    display: none; animation: popIn .18s cubic-bezier(.16,1,.3,1);
  }
  #mark-popover.visible { display: block; }

  .pop-header {
    display: flex; align-items: center; gap: 6px;
    margin-bottom: 9px; padding-bottom: 9px;
    border-bottom: 1.5px solid #eee; flex-wrap: wrap;
  }
  .pop-badge {
    font-family: 'JetBrains Mono',monospace; font-size: 9px; font-weight: 700;
    padding: 2px 7px; border-radius: 2px; background: #0a0a0a; color: #fff;
    flex-shrink: 0; letter-spacing: .03em;
  }
  .pop-error-name {
    font-family: 'Unbounded','Syne',sans-serif; font-size: 8.5px; font-weight: 700;
    text-transform: uppercase; letter-spacing: .06em; flex: 1; color: #0a0a0a;
    line-height: 1.3;
  }
  .pop-loss {
    font-family: 'JetBrains Mono',monospace; font-size: 11px; font-weight: 700;
    color: #dc2626; margin-left: auto; flex-shrink: 0;
  }
  .pop-desc {
    font-size: 12px; line-height: 1.65; color: #444; margin-bottom: 10px;
  }
  .pop-fix-row {
    display: flex; align-items: center; gap: 7px; font-size: 11px;
    margin-bottom: 10px; flex-wrap: wrap;
  }
  .pop-fix-label { color: #888; font-size: 11px; white-space: nowrap; }
  .pop-fix-btn {
    background: #dcfce7; color: #15803d; border: 1.5px solid #16a34a;
    padding: 3px 10px; font-size: 12px; font-family: 'Caveat',cursive;
    cursor: pointer; border-radius: 2px; line-height: 1.4;
  }
  .pop-fix-btn:hover { background: #bbf7d0; }

  .pop-divider { height: 1px; background: #eee; margin: 9px 0; }

  .pop-section-label {
    font-family: 'Unbounded','Syne',sans-serif; font-size: 7.5px; font-weight: 700;
    text-transform: uppercase; letter-spacing: .1em; color: #bbb; margin-bottom: 7px;
  }

  .pop-action-row { display: flex; gap: 5px; margin-bottom: 8px; flex-wrap: wrap; }
  .pop-action-btn {
    flex: 1; min-width: 72px; border: 1.5px solid #0a0a0a; background: #fff;
    color: #0a0a0a; font-family: 'Unbounded','Syne',sans-serif;
    font-size: 7.5px; font-weight: 700; text-transform: uppercase;
    letter-spacing: .06em; padding: 7px 4px; cursor: pointer;
    transition: background .12s; line-height: 1;
  }
  .pop-action-btn:hover { background: #f4f4f4; }
  .pop-action-btn.danger  { border-color: #dc2626; color: #dc2626; }
  .pop-action-btn.danger:hover  { background: #fee2e2; }
  .pop-action-btn.move    { border-color: #ff6b00; color: #ff6b00; }
  .pop-action-btn.move:hover    { background: #fff3e8; }
  .pop-action-btn.success { border-color: #16a34a; color: #16a34a; }
  .pop-action-btn.success:hover { background: #dcfce7; }

  .pop-opts-wrap {
    display: flex; flex-direction: column; gap: 4px; margin-bottom: 4px;
  }
  .pop-opt {
    text-align: left; background: #f8f8f8; border: 1.5px solid #e8e8e8;
    padding: 7px 10px; font-size: 12.5px; color: #0a0a0a;
    cursor: pointer; transition: background .1s, border-color .1s;
    line-height: 1.45; font-family: inherit;
  }
  .pop-opt:hover { background: #fffbeb; border-color: #fbbf24; }

  .pop-custom-wrap {
    display: flex; gap: 5px; align-items: stretch; margin-top: 7px;
  }
  .pop-custom-input {
    flex: 1; border: 1.5px solid #ccc; padding: 6px 9px; font-size: 12px;
    outline: none; font-family: inherit;
  }
  .pop-custom-input:focus { border-color: #0055ff; }
  .pop-custom-apply {
    border: 1.5px solid #0055ff; background: #0055ff; color: #fff;
    padding: 6px 12px; font-size: 10px; font-weight: 700;
    font-family: 'Unbounded','Syne',sans-serif; cursor: pointer;
    text-transform: uppercase; letter-spacing: .06em; white-space: nowrap;
  }
  .pop-custom-apply:hover { background: #003dd9; }

  /* Deduction badge inside doodle marks */
  .deduction {
    font-family: 'JetBrains Mono',monospace; font-size: .7em; font-weight: 700;
    color: #dc2626; vertical-align: super; margin-left: 1px; pointer-events: none;
  }

  /* ════════ LEGEND (rubric etc.) ════════ */

  .legend-sep { width: 100%; height: 1px; background: rgba(255,255,255,.1); margin: 4px 0; }

  /* ════════ MOVE MODE ════════ */

  .move-source {
    opacity: .4 !important;
    outline: 2.5px dashed #ff6b00 !important;
    outline-offset: 3px !important;
    cursor: copy !important;
  }
  #move-instruction {
    position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
    background: #0a0a0a; color: #fff; padding: 11px 20px;
    font-family: 'Unbounded','Syne',sans-serif; font-size: 9px; font-weight: 700;
    text-transform: uppercase; letter-spacing: .08em;
    z-index: 9999; box-shadow: 5px 5px 0 rgba(0,0,0,.4);
    display: flex; align-items: center; gap: 14px;
    border: 2px solid #ff6b00; animation: fadeUp .2s ease;
    white-space: nowrap;
  }
  #move-instruction em {
    font-style: italic; opacity: .7; text-transform: none;
    font-family: 'Caveat',cursive; font-size: 14px; font-weight: 400;
  }
  #cancel-move {
    background: #dc2626; color: #fff; border: none;
    padding: 5px 12px; font-size: 8.5px; font-weight: 700;
    font-family: 'Unbounded','Syne',sans-serif;
    text-transform: uppercase; cursor: pointer; flex-shrink: 0;
  }
  #cancel-move:hover { background: #b91c1c; }

  /* ════════ HIDE ORIGINAL MODAL (replaced by accordion) ════════ */

  #topic-modal { display: none !important; }

  /* ════════ ACCORDIONS ════════ */

  #editor-accordions { margin-top: 10px; }
  #results-accordions { margin-top: 0; }

  .acc-panel {
    border: 2.5px solid #0a0a0a;
    background: #fff;
    margin-bottom: 10px;
    box-shadow: 4px 4px 0 #0a0a0a;
    overflow: hidden;
  }
  .acc-header {
    width: 100%; background: #0a0a0a; color: #fff; border: none;
    padding: 11px 18px; font-family: 'Unbounded','Syne',sans-serif;
    font-size: 8.5px; font-weight: 700; text-transform: uppercase;
    letter-spacing: .1em; cursor: pointer;
    display: flex; align-items: center; justify-content: space-between;
    transition: background .15s; gap: 10px;
  }
  .acc-header:hover { background: #1e1e1e; }
  .acc-header-label { flex: 1; text-align: left; }
  .acc-count { opacity: .55; font-weight: 400; }
  .acc-chevron {
    width: 15px; height: 15px; flex-shrink: 0;
    transition: transform .22s cubic-bezier(.16,1,.3,1);
    overflow: visible;
  }
  .acc-chevron polyline { stroke: #fff; fill: none; stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }
  .acc-chevron.open { transform: rotate(180deg); }

  .acc-body { padding: 16px 18px; animation: fadeUp .2s cubic-bezier(.16,1,.3,1) both; }

  /* Topic accordion */
  .acc-topic-label {
    font-family: 'Unbounded','Syne',sans-serif; font-size: 8px; font-weight: 700;
    text-transform: uppercase; letter-spacing: .1em; color: #aaa;
    margin: 0 0 7px 0;
  }
  .acc-topic-types { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px; }
  .acc-current-topic {
    background: #f8f8f8; border: 1.5px dashed #bbb;
    padding: 10px 14px; min-height: 46px;
  }
  .acc-topic-text {
    font-family: 'Caveat',cursive; font-size: 15px; line-height: 1.55;
    color: #1a1a1a;
  }

  /* Color key accordion */
  .ck-section-title {
    font-family: 'Unbounded','Syne',sans-serif; font-size: 8px; font-weight: 700;
    text-transform: uppercase; letter-spacing: .1em; color: #999;
    margin: 0 0 8px 0;
  }
  .ck-grid {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 4px; margin-bottom: 14px;
  }
  .ck-item {
    display: flex; align-items: center; gap: 8px;
    padding: 5px 8px; border: 1px solid #ebebeb; background: #fafafa;
  }
  .ck-code { font-family: 'JetBrains Mono',monospace; font-size: 9.5px; font-weight: 700; min-width: 36px; }
  .ck-name { font-size: 11px; color: #333; flex: 1; line-height: 1.3; }
  .ck-loss { font-family: 'JetBrains Mono',monospace; font-size: 9.5px; font-weight: 700; }
  .ck-hl-grid { display: flex; flex-wrap: wrap; gap: 7px; margin-bottom: 14px; }
  .ck-hl-item { display: flex; align-items: center; gap: 5px; font-size: 11px; color: #333; }
  .ck-swatch { width: 20px; height: 13px; border-radius: 2px; border: 1px solid rgba(0,0,0,.1); flex-shrink: 0; }
  .ck-other {
    display: flex; flex-direction: column; gap: 7px;
    font-size: 11px; color: #555;
    border-top: 1px dashed #e8e8e8; padding-top: 10px;
  }
  .ck-other > div { display: flex; align-items: center; gap: 7px; }
  .ck-marker {
    display: inline-flex; align-items: center; justify-content: center;
    width: 15px; height: 15px; background: #dc2626; color: #fff;
    font-size: 8px; font-weight: 700; border-radius: 50%; flex-shrink: 0;
  }
  .ck-sub-demo  { border-bottom: 2px solid #0055ff; color: #0055ff; font-size: 12px; }
  .ck-sent-demo { border-bottom: 2px solid #e67e00; color: #e67e00; font-size: 12px; }

  /* Suggestions accordion */
  .sugg-acc .acc-header { background: #0055ff; }
  .sugg-acc .acc-header:hover { background: #003dd9; }
  .sugg-list { padding: 2px 0; }
  .suggestion-item {
    display: flex; align-items: flex-start; gap: 14px;
    padding: 11px 0; border-bottom: 1.5px dashed #f0f0f0;
    animation: slideLeft .4s cubic-bezier(.16,1,.3,1) both;
  }
  .suggestion-item:last-child { border-bottom: none; }
  .suggestion-num {
    flex-shrink: 0; width: 22px; height: 22px;
    background: #0055ff; color: #fff; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Unbounded','Syne',sans-serif; font-size: 8.5px; font-weight: 700;
  }
  .suggestion-text { font-size: 13px; line-height: 1.7; color: #333; padding-top: 1px; }

  /* Study tips accordion */
  .tips-acc .acc-header { background: #ffe500; color: #0a0a0a; }
  .tips-acc .acc-header:hover { background: #ffd000; }
  .tips-acc .acc-chevron polyline { stroke: #0a0a0a; }
  .tips-body-grid {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px;
  }
  .study-tip-card {
    background: #0a0a0a; border: 1.5px solid rgba(255,255,255,.07);
    padding: 14px; animation: fadeUp .5s cubic-bezier(.16,1,.3,1) both;
  }
  .study-tip-title {
    font-family: 'Unbounded','Syne',sans-serif; font-weight: 700; font-size: 9px;
    text-transform: uppercase; letter-spacing: .09em; color: #ffe500; margin-bottom: 6px;
  }
  .study-tip-text {
    font-size: 12px; line-height: 1.75; color: rgba(255,255,255,.65);
    font-family: 'JetBrains Mono','DM Sans',monospace;
  }

  /* ════════ RUBRIC BAR ════════ */

  .rubric-bar-track { grid-column: 1/-1; height: 3px; background: #eee; margin-top: 8px; overflow: hidden; }
  .rubric-bar-fill  { height: 100%; width: 0; transition: width 1.1s cubic-bezier(.16,1,.3,1); }

  /* ════════ ANIMATIONS ════════ */

  @keyframes fadeUp {
    from { opacity:0; transform:translateY(14px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes slideLeft {
    from { opacity:0; transform:translateX(-12px); }
    to   { opacity:1; transform:translateX(0); }
  }
  @keyframes popIn {
    from { opacity:0; transform:scale(.9) translateY(4px); }
    to   { opacity:1; transform:scale(1) translateY(0); }
  }
  `;
  const style = document.createElement('style');
  style.id = 'prepbot-extended-styles';
  style.textContent = css;
  document.head.appendChild(style);
})();

/* ─────────────────────────────────────────────────────
   DOM REFS
─────────────────────────────────────────────────────── */
const $ = id => document.getElementById(id);
const elTopicBox   = $('topic-box');
const elTopic      = $('topic-display');
const elTextarea   = $('writing-area');
const elWordCount  = $('word-count');
const elSubmitBtn  = $('submit-btn');
const elEditorSec  = $('editor-section');
const elResultsSec = $('results-section');
const elLoading    = $('loading-overlay');
const elRubric     = $('rubric-content');
const elAnnotated  = $('annotated-text');
const elStamp      = $('score-stamp');
const elRetryBtn   = $('retry-btn');
const elPopover    = $('mark-popover');
const elModal      = $('topic-modal');

/* Persistent comment popover (singleton) */
const elCommentPop = document.createElement('div');
elCommentPop.id = 'comment-popover';
document.body.appendChild(elCommentPop);

/* ── State ── */
let currentTopic = "";
let activeEl = null;
let commentCounter = 0;
let commentStore = {};
let moveSourceEl = null;
let moveHandler = null;

/* ─────────────────────────────────────────────────────
   ACCORDION UTILITY
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

  panel.querySelector('.acc-header').addEventListener('click', function () {
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
    { code:'del',   name:'Delete Word',                 color:'#dc2626', loss:'-2' },
    { code:'ins',   name:'Insert Missing Word',          color:'#16a34a', loss:'-2' },
    { code:'cap',   name:'Capitalise',                   color:'#ea580c', loss:'-2' },
    { code:'lc',    name:'Make Lowercase',              color:'#0284c7', loss:'-2' },
    { code:'trans', name:'Transpose / Swap',             color:'#7c3aed', loss:'-2' },
    { code:'para',  name:'New Paragraph',               color:'#0a0a0a', loss:'-2' },
    { code:'spell', name:'Spell Out Abbreviation',       color:'#666',    loss:'-1' },
    { code:'sp',    name:'Misspelling',                 color:'#dc2626', loss:'-2' },
    { code:'run',   name:'Run-on Sentence',             color:'#b91c1c', loss:'-3' },
    { code:'frag',  name:'Sentence Fragment',           color:'#dc2626', loss:'-3' },
    { code:'punct', name:'Wrong Punctuation',           color:'#dc2626', loss:'-2' },
    { code:'ww',    name:'Wrong Word (homophone)',      color:'#dc2626', loss:'-2' },
    { code:'agr',   name:'Subject-Verb Agreement',      color:'#ea580c', loss:'-3' },
    { code:'vt',    name:'Wrong Verb Tense',            color:'#7c3aed', loss:'-2' },
    { code:'art',   name:'Article Error (a/an/the)',    color:'#0284c7', loss:'-2' },
    { code:'prep',  name:'Wrong Preposition',           color:'#db2777', loss:'-2' },
    { code:'rep',   name:'Unnecessary Repetition',      color:'#b45309', loss:'-1' },
    { code:'ref',   name:'Unclear Pronoun Reference',   color:'#0f766e', loss:'-2' },
    { code:'cs',    name:'Comma Splice',                color:'#b91c1c', loss:'-3' },
    { code:'wo',    name:'Word Order Error',            color:'#6366f1', loss:'-2' },
    { code:'par',   name:'Faulty Parallel Structure',   color:'#059669', loss:'-2' },
  ];
  const highlights = [
    { name:'Grammar Cluster',  bg:'rgba(253,224,71,.55)' },
    { name:'Vocabulary Issue', bg:'rgba(96,165,250,.3)' },
    { name:'Structure Issue',  bg:'rgba(251,146,60,.3)' },
    { name:'Style Issue',      bg:'rgba(196,181,253,.45)' },
    { name:'Good Writing',     bg:'rgba(74,222,128,.3)' },
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
   INIT EDITOR ACCORDIONS (injected below textarea)
─────────────────────────────────────────────────────── */
function initEditorAccordions() {
  if ($('editor-accordions')) return; /* already initialised */

  const container = document.createElement('div');
  container.id = 'editor-accordions';

  /* Topic accordion */
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

  /* Insert directly after the textarea */
  if (elTextarea && elTextarea.parentNode) {
    elTextarea.parentNode.insertBefore(container, elTextarea.nextSibling);
  }

  /* Attach listeners to the new type buttons */
  container.querySelectorAll('.type-btn').forEach(btn => {
    btn.addEventListener('click', () => fetchGeneratedTopic(btn.dataset.type));
  });

  syncTopicDisplay();
}

function syncTopicDisplay() {
  const el = $('acc-topic-text');
  if (el && currentTopic) el.textContent = currentTopic;
  if (elTopic && currentTopic) elTopic.textContent = currentTopic;
}

/* ─────────────────────────────────────────────────────
   EVENT LISTENERS
─────────────────────────────────────────────────────── */
elTextarea.addEventListener('input', () => {
  const words = elTextarea.value.trim() ? elTextarea.value.trim().split(/\s+/).length : 0;
  elWordCount.textContent = words;
  elSubmitBtn.disabled = words < 20;
});

/* "New topic" button now scrolls to / expands the topic accordion */
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

$('close-modal')?.addEventListener('click', closeModal);
elModal?.addEventListener('click', e => { if (e.target === elModal) closeModal(); });

elRetryBtn?.addEventListener('click', () => {
  elResultsSec.classList.remove('active');
  elEditorSec.style.display = 'block';
  elTextarea.value = '';
  elWordCount.textContent = '0';
  elSubmitBtn.disabled = true;
  commentCounter = 0;
  commentStore = {};
  /* Expand topic accordion on retry */
  const body = $('acc-body-topic');
  if (body) {
    body.style.display = '';
    const chevron = document.querySelector('#acc-topic .acc-chevron');
    if (chevron) chevron.classList.add('open');
  }
});

/* ─────────────────────────────────────────────────────
   MODAL (hidden by CSS; functions kept for compatibility)
─────────────────────────────────────────────────────── */
function openModal() {
  elModal?.classList.add('active');
  const body = $('acc-body-topic');
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

/* ─────────────────────────────────────────────────────
   TOPIC GENERATION
─────────────────────────────────────────────────────── */
async function fetchGeneratedTopic(type) {
  if (elTopicBox) elTopicBox.style.opacity = '0.5';
  const textEl = $('acc-topic-text');
  if (textEl) textEl.textContent = 'Generating prompt...';
  if (elTopic) elTopic.innerHTML = ` Generating ${type} prompt...`;

  try {
    const res = await fetch(GROQ_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${GROQ_KEY}` },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{
          role: "user",
          content:
            `Generate ONE original, age-appropriate ${type} writing topic for a Nigerian secondary school student (SS1–SS2, age 13–15). ` +
            `Engaging, specific, achievable in 200–500 words. Return ONLY the topic text — no quotes, no label, no explanation.`
        }],
        temperature: 0.9,
        max_tokens: 130
      })
    });
    if (!res.ok) throw new Error(`API ${res.status}`);
    const data = await res.json();
    let text = (data.choices?.[0]?.message?.content || "").trim()
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
   SYSTEM PROMPT
─────────────────────────────────────────────────────── */
function getSystemPrompt() {
  return `You are an uncompromising secondary-school English examiner marking with a red pen. You are NOT generous. Find and mark EVERY error. Also give positive credit where writing is genuinely strong.

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

RESPOND ONLY WITH VALID JSON. No markdown, no preamble.

{
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

ANNOTATION TAGS — mark ALL errors. Use correct tag for each error type:

GRAMMAR ERRORS:
1.  Delete extra word:       <mark type="del"   loss="-2">word</mark>
2.  Insert missing word:     <mark type="ins"   fix="word" loss="-2"> </mark>
3.  Capitalise:              <mark type="cap"   loss="-2">word</mark>
4.  Make lowercase:          <mark type="lc"    loss="-2">Word</mark>
5.  Transpose word order:    <mark type="trans" loss="-2">wrong order phrase</mark>
6.  New paragraph here:      <mark type="para"  loss="-2"> </mark>
7.  Spell out abbreviation:  <mark type="spell" loss="-1">abbr</mark>
8.  Misspelling:             <mark type="sp"    loss="-2">mispeled</mark>
9.  Run-on sentence:         <mark type="run"   loss="-3">fused clause one fused clause two</mark>
10. Sentence fragment:       <mark type="frag"  loss="-3">Because it rained.</mark>
11. Wrong punctuation:       <mark type="punct" loss="-2">,</mark>
12. Wrong word (homophone):  <mark type="ww"    loss="-2">there</mark>
13. Agreement error (S-V):   <mark type="agr"   loss="-3">The students was</mark>
14. Wrong verb tense:        <mark type="vt"    loss="-2">Yesterday I go</mark>
15. Wrong/missing article:   <mark type="art"   loss="-2">I need a information</mark>
16. Wrong preposition:       <mark type="prep"  loss="-2">depend of</mark>
17. Unnecessary repetition:  <mark type="rep"   loss="-1">very very good</mark>
18. Unclear pronoun ref:     <mark type="ref"   loss="-2">he said to him</mark>
19. Comma splice:            <mark type="cs"    loss="-3">clause, clause</mark>
20. Wrong word order:        <mark type="wo"    loss="-2">I yesterday went</mark>
21. Faulty parallel struct:  <mark type="par"   loss="-2">running, to jump, swim</mark>

HIGHLIGHTS — wrap passages to colour-code issues:
22. Grammar cluster:    <hl cat="grammar">passage with grammar errors</hl>
23. Vocab issue:        <hl cat="vocab">weak vocabulary passage</hl>
24. Structure issue:    <hl cat="structure">poorly organised section</hl>
25. Style issue:        <hl cat="style">awkward style passage</hl>
26. Good writing:       <hl cat="good">genuinely well-written passage</hl>

POSITIVE FEEDBACK — mark strong individual words/phrases:
27. Good word/phrase:   <good reason="Precise and vivid word choice">excellent phrase</good>

EXAMINER MARGIN COMMENTS — short notes, max 4 per essay, placed at END of relevant sentence:
28. <comment text="Your opening hook is strong, but the argument collapses in paragraph 2."> </comment>

WORD / SENTENCE SUBSTITUTIONS (for vocabulary improvement):
29. Weak word:          <sub opts="stronger1, stronger2, stronger3">weak_word</sub>
30. Weak sentence:      <sent opts="Better version 1.|||Better version 2.">Original weak sentence.</sent>

RULES:
- Mark every single error — none must be missed.
- Use <hl> to highlight clusters of related errors so the student sees patterns.
- Use <hl cat="good"> to acknowledge genuinely strong passages.
- loss: -1 trivial | -2 standard | -3 moderate | -4 serious | -5 severe.
- suggestions: 5 specific, actionable improvements based on THIS essay.
- studyTips: 4 targeted tips based on the ACTUAL error types found.
- Preserve paragraph breaks as \\n\\n. Escape all JSON strings.`;
}

/* ─────────────────────────────────────────────────────
   SUBMIT
─────────────────────────────────────────────────────── */
elSubmitBtn.addEventListener('click', async () => {
  const userText = elTextarea.value.trim();
  if (!userText) return;
  elLoading.classList.add('active');

  try {
    const res = await fetch(GROQ_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${GROQ_KEY}` },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: getSystemPrompt() },
          { role: "user",   content: `TOPIC: ${currentTopic}\n\nSTUDENT ESSAY:\n${userText}` }
        ],
        temperature: 0.1,
        max_tokens: 5000
      })
    });
    if (!res.ok) throw new Error(`API ${res.status}`);

    const data = await res.json();
    let raw = data.choices?.[0]?.message?.content || "";
    raw = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim();

    const parsed = JSON.parse(raw);
    renderResults(parsed, userText);

  } catch (err) {
    console.error(err);
    alert("Grading error — the AI returned unexpected data. Please try again.");
    elLoading.classList.remove('active');
  }
});

/* ─────────────────────────────────────────────────────
   RENDER RESULTS
─────────────────────────────────────────────────────── */
function renderResults(data, originalText) {

  /* Score stamp */
  const score = Math.min(100, Math.max(0, data.totalScore || 0));
  elStamp.textContent = `${score}%`;
  elStamp.className = `score-stamp${score < 55 ? ' fail' : score < 70 ? ' avg' : ''}`;

  /* Rubric rows with animated bars */
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

  /* Reset comment state */
  commentCounter = 0;
  commentStore = {};

  /* Build annotated HTML */
  let html = data.annotatedText || originalText;
  html = html
    .replace(/\\n\\n/g, '\n\n')
    .replace(/\n\n/g, '<br><br>')
    .replace(/\n/g, '<br>');

  /* 1. Standard <mark> error tags */
  html = html.replace(
    /<mark\s+type=['"]([^'"]+)['"]\s*(?:fix=['"]([^'"]*?)['"])?\s*(?:loss=['"]([^'"]*?)['"])?>([\s\S]*?)<\/mark>/gi,
    (_, type, fix, loss, content) => {
      const fixAttr  = fix  ? ` data-fix="${safe(fix)}"`  : '';
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
    (_, reason, content) =>
      `<span class="hl-good" title="${safe(reason)}">${content}</span>`
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

  elAnnotated.innerHTML = html;

  /* Attach click + keyboard listeners to ALL doodle marks */
  elAnnotated.querySelectorAll('.doodle').forEach(el => {
    el.addEventListener('click', e => { e.stopPropagation(); openAnnotationPopover(el); });
    el.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openAnnotationPopover(el); }
    });
  });

  /* Attach popover listeners to sub-word and sent-sub */
  elAnnotated.querySelectorAll('.sub-word, .sent-sub').forEach(el => {
    el.addEventListener('click', e => { e.stopPropagation(); openAnnotationPopover(el); });
  });

  /* Attach comment listeners */
  elAnnotated.querySelectorAll('.margin-comment-marker').forEach(marker => {
    marker.addEventListener('click', e => { e.stopPropagation(); showComment(marker); });
  });

  /* Render suggestions and study tips as accordions */
  renderSuggestions(data.suggestions || []);
  renderStudyTips(data.studyTips || []);

  /* Transition */
  elLoading.classList.remove('active');
  elEditorSec.style.display = 'none';
  elResultsSec.classList.add('active');
}

/* ─────────────────────────────────────────────────────
   SUGGESTIONS PANEL (accordion)
─────────────────────────────────────────────────────── */
function renderSuggestions(suggestions) {
  /* Find or create results accordion container, placed after the paper */
  let container = $('results-accordions');
  if (!container) {
    container = document.createElement('div');
    container.id = 'results-accordions';
    const anchor = document.querySelector('.paper-scroll-wrap') ||
      document.querySelector('.annotated-paper') ||
      elAnnotated.parentNode;
    anchor.parentNode.insertBefore(container, anchor.nextSibling);
  }

  $('acc-suggestions')?.remove();
  if (!suggestions.length) return;

  const bodyHtml = `
    <div class="sugg-list">
      ${suggestions.map((s, i) => `
        <div class="suggestion-item" style="animation-delay:${(i * 0.07).toFixed(2)}s">
          <div class="suggestion-num">${i + 1}</div>
          <div class="suggestion-text">${safe(s)}</div>
        </div>`).join('')}
    </div>`;

  const panel = makeAccordion({
    id: 'suggestions',
    title: "Examiner's Suggestions",
    bodyHtml,
    startOpen: true,
    extraClass: 'sugg-acc',
    count: suggestions.length
  });
  container.appendChild(panel);
}

/* ─────────────────────────────────────────────────────
   STUDY TIPS PANEL (accordion, no emoji)
─────────────────────────────────────────────────────── */
function renderStudyTips(tips) {
  let container = $('results-accordions');
  if (!container) {
    container = document.createElement('div');
    container.id = 'results-accordions';
    elResultsSec.appendChild(container);
  }

  $('acc-studytips')?.remove();
  if (!tips.length) return;

  const bodyHtml = `
    <div class="tips-body-grid">
      ${tips.map((t, i) => `
        <div class="study-tip-card" style="animation-delay:${(i * 0.08).toFixed(2)}s">
          <div class="study-tip-title">${safe(t.title || '')}</div>
          <div class="study-tip-text">${safe(t.tip || '')}</div>
        </div>`).join('')}
    </div>`;

  const panel = makeAccordion({
    id: 'studytips',
    title: 'Study Tips For You',
    bodyHtml,
    startOpen: false,
    extraClass: 'tips-acc'
  });
  container.appendChild(panel);
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
    <div class="comment-pop-label">
       Examiner's Note ${id}
    </div>
    <div class="comment-pop-text">${safe(text)}</div>`;
  elCommentPop.classList.add('visible');

  const rect = marker.getBoundingClientRect();
  const pw = 284, ph = 120;
  let left = rect.right + 10, top = rect.top - 8;
  if (left + pw > window.innerWidth - 8) left = rect.left - pw - 10;
  if (left < 8) left = 8;
  if (top + ph > window.innerHeight - 8) top = window.innerHeight - ph - 8;
  if (top < 8) top = 8;
  elCommentPop.style.left = left + 'px';
  elCommentPop.style.top  = top  + 'px';
}

document.addEventListener('click', e => {
  if (elCommentPop.contains(e.target)) return;
  if (e.target.classList.contains('margin-comment-marker')) return;
  elCommentPop.classList.remove('visible');
  elCommentPop.dataset.activeCid = '';
  document.querySelectorAll('.margin-comment-marker.active').forEach(m => m.classList.remove('active'));
});

/* ─────────────────────────────────────────────────────
   POSITION POPOVER UTILITY
─────────────────────────────────────────────────────── */
function positionPopover(el) {
  const rect = el.getBoundingClientRect();
  const pw = 330, ph = 320;
  let left = rect.left;
  let top  = rect.bottom + 8;
  if (left + pw > window.innerWidth  - 8) left = window.innerWidth  - pw - 8;
  if (left < 8)                           left = 8;
  if (top  + ph > window.innerHeight - 8) top  = rect.top - ph - 8;
  if (top  < 8)                           top  = 8;
  elPopover.style.left = left + 'px';
  elPopover.style.top  = top  + 'px';
}

/* ─────────────────────────────────────────────────────
   ENHANCED ANNOTATION POPOVER
   Handles: all doodle-* marks, sub-word, sent-sub
─────────────────────────────────────────────────────── */
function openAnnotationPopover(el) {
  activeEl = el;

  const classes     = [...el.classList];
  const doodleClass = classes.find(c => c.startsWith('doodle-') && c !== 'doodle');
  const type        = doodleClass ? doodleClass.replace('doodle-', '') : '';
  const fix         = el.dataset.fix  || '';
  const optsStr     = el.dataset.opts || '';
  const dataType    = el.dataset.type || 'word';
  const lossAttr    = el.dataset.loss || el.querySelector?.('.deduction')?.textContent || '';

  /* Look up error info; fall back gracefully for sub/sent */
  const info = ERROR_TYPES[type] || {
    name: dataType === 'sent' ? 'Sentence Rewrite' : 'Word Substitute',
    desc: dataType === 'sent'
      ? 'Click one of the rewrite options below to replace the whole sentence, or use the actions to delete or move it.'
      : 'Click a replacement option below, or use Delete / Move / Custom Replace.'
  };

  /* Badge background — try to match the mark colour */
  const badgeBg = (() => {
    const tmp = document.querySelector(`.doodle-${type}`);
    if (tmp) {
      const s = getComputedStyle(tmp);
      return s.borderBottomColor !== 'rgba(0, 0, 0, 0)' ? s.borderBottomColor :
             s.outlineColor       !== 'rgba(0, 0, 0, 0)' ? s.outlineColor : '#0a0a0a';
    }
    return type ? '#0a0a0a' : (dataType === 'sent' ? '#e67e00' : '#0055ff');
  })();

  /* Build substitution options */
  let optsHtml = '';
  if (optsStr) {
    const opts = dataType === 'sent'
      ? optsStr.split('|||').map(s => s.trim()).filter(Boolean)
      : optsStr.split(',').map(s => s.trim()).filter(Boolean);
    if (opts.length) {
      const label = dataType === 'sent' ? 'Rewrite options — click to apply' : 'Replacement options — click to apply';
      optsHtml = `
        <div class="pop-section-label" style="margin-top:6px">${label}</div>
        <div class="pop-opts-wrap">
          ${opts.map(o => `<button class="pop-opt" data-val="${safe(o)}">${o}</button>`).join('')}
        </div>`;
    }
  }

  /* Build fix row */
  const fixHtml = fix ? `
    <div class="pop-fix-row">
      <span class="pop-fix-label">Suggested fix:</span>
      <button class="pop-fix-btn" data-val="${safe(fix)}">${fix}</button>
    </div>` : '';

  elPopover.innerHTML = `
    <div class="pop-header">
      <span class="pop-badge" style="background:${badgeBg}">${type || (dataType === 'sent' ? 'sent' : 'sub')}</span>
      <span class="pop-error-name">${info.name}</span>
      ${lossAttr ? `<span class="pop-loss">${safe(lossAttr)}</span>` : ''}
    </div>
    <div class="pop-desc">${info.desc}</div>
    ${fixHtml}
    <div class="pop-divider"></div>
    <div class="pop-section-label">Actions</div>
    <div class="pop-action-row">
      <button class="pop-action-btn danger"  id="pop-act-delete">Delete</button>
      <button class="pop-action-btn move"    id="pop-act-move">Move</button>
      <button class="pop-action-btn success" id="pop-act-custom">Custom Replace</button>
    </div>
    ${optsHtml}
    <div class="pop-custom-wrap" id="pop-custom-area" style="display:none">
      <input class="pop-custom-input" id="pop-custom-text" placeholder="Type replacement text..." />
      <button class="pop-custom-apply" id="pop-custom-go">Apply</button>
    </div>`;

  elPopover.classList.add('visible');
  positionPopover(el);

  /* Delete */
  document.getElementById('pop-act-delete')?.addEventListener('click', () => {
    deleteAnnotation(el);
    elPopover.classList.remove('visible');
    activeEl = null;
  });

  /* Move */
  document.getElementById('pop-act-move')?.addEventListener('click', () => {
    elPopover.classList.remove('visible');
    startMoveMode(el);
  });

  /* Toggle custom replace input */
  document.getElementById('pop-act-custom')?.addEventListener('click', () => {
    const area = document.getElementById('pop-custom-area');
    if (!area) return;
    const opening = area.style.display === 'none';
    area.style.display = opening ? 'flex' : 'none';
    if (opening) document.getElementById('pop-custom-text')?.focus();
  });

  /* Apply custom replacement */
  document.getElementById('pop-custom-go')?.addEventListener('click', () => {
    const val = document.getElementById('pop-custom-text')?.value.trim();
    if (val) applyOpt(val);
  });
  document.getElementById('pop-custom-text')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const val = e.target.value.trim();
      if (val) applyOpt(val);
    }
  });

  /* Substitution options */
  elPopover.querySelectorAll('.pop-opt').forEach(btn => {
    btn.addEventListener('click', () => applyOpt(btn.dataset.val || btn.textContent.trim()));
  });

  /* Fix button */
  elPopover.querySelector('.pop-fix-btn')?.addEventListener('click', function () {
    applyOpt(this.dataset.val || this.textContent.trim());
  });
}

/* ─────────────────────────────────────────────────────
   APPLY REPLACEMENT
─────────────────────────────────────────────────────── */
function applyOpt(chosen) {
  if (!activeEl) return;
  /* Remove deduction span before replacing text */
  activeEl.querySelector('.deduction')?.remove();
  activeEl.textContent = chosen;
  activeEl.style.textDecoration = 'none';
  activeEl.style.background     = 'rgba(74,222,128,.25)';
  activeEl.style.color          = 'var(--green,#00a550)';
  activeEl.style.fontWeight     = '600';
  activeEl.style.outline        = 'none';
  activeEl.style.borderBottom   = 'none';
  /* Strip annotation classes */
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
   Click any position in the annotated text to relocate
   the selected word/phrase/sentence there.
─────────────────────────────────────────────────────── */
function startMoveMode(el) {
  cancelMoveMode(); /* clear any existing move in progress */

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
    /* Cancel button */
    if (e.target.id === 'cancel-move' || e.target.closest?.('#cancel-move')) {
      cancelMoveMode();
      return;
    }
    /* Ignore clicks inside the instruction bar */
    if (e.target.closest?.('#move-instruction')) return;
    /* Only respond to clicks inside the annotated paper */
    if (!elAnnotated?.contains(e.target) && e.target !== elAnnotated) {
      cancelMoveMode();
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    /* Determine caret position at click point */
    let range = null;
    if (document.caretRangeFromPoint) {
      range = document.caretRangeFromPoint(e.clientX, e.clientY);
    } else if (document.caretPositionFromPoint) {
      const pos = document.caretPositionFromPoint(e.clientX, e.clientY);
      if (pos) {
        range = document.createRange();
        range.setStart(pos.offsetNode, pos.offset);
        range.collapse(true);
      }
    }

    if (range && moveSourceEl) {
      const src = moveSourceEl;
      src.remove();
      src.classList.remove('move-source');
      range.insertNode(src);
      /* Re-attach click listener after move */
      src.addEventListener('click', ev => { ev.stopPropagation(); openAnnotationPopover(src); });
    }

    cancelMoveMode();
  };

  document.addEventListener('click', moveHandler, { capture: true });
}

function cancelMoveMode() {
  if (moveSourceEl) { moveSourceEl.classList.remove('move-source'); moveSourceEl = null; }
  document.getElementById('move-instruction')?.remove();
  if (elAnnotated) elAnnotated.style.cursor = '';
  if (moveHandler) {
    document.removeEventListener('click', moveHandler, { capture: true });
    moveHandler = null;
  }
}

/* Close annotation popover on outside click */
document.addEventListener('click', e => {
  if (!elPopover) return;
  if (elPopover.contains(e.target)) return;
  elPopover.classList.remove('visible');
});

/* ─────────────────────────────────────────────────────
   UTIL
─────────────────────────────────────────────────────── */
function safe(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/* ─────────────────────────────────────────────────────
   INIT
─────────────────────────────────────────────────────── */
window.addEventListener('DOMContentLoaded', () => {
  initEditorAccordions();
  openModal(); /* expand topic accordion on first load */
});
