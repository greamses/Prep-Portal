/* ═══════════════════════════════════════════════════════
   PREPBOT — ADVANCED PROOFREADING ENGINE v3
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
   INJECT EXTENDED STYLES
   All new mark types, highlighters, comment system,
   suggestions + study tips panels.
   Label overflow is fixed: labels wrap horizontally,
   never overflow sideways.
───────────────────────────────────────────────────── */
(function injectStyles() {
  const css = `

  /* ── ensure paper text is always horizontal ── */
  .annotated-paper,
  #annotated-text {
    writing-mode: horizontal-tb !important;
    direction: ltr !important;
  }

  /* ── SHARED label base — allows text to wrap rather than overflow ── */
  .doodle::before {
    white-space: normal !important;
    max-width: 90px;
    text-align: center;
    line-height: 1.15;
    word-break: break-word;
  }

  /* ════════ NEW MARK TYPES ════════ */

  /* 12 — Wrong word (homophone / near-homophone) */
  .doodle-ww {
    background: rgba(220, 38, 38, .1);
    border-bottom: 2.5px double #dc2626;
  }
  .doodle-ww::before {
    content: 'ww';
    position: absolute; bottom: calc(100% + 3px);
    left: 50%; transform: translateX(-50%);
    color: #dc2626; font-family: 'Caveat', cursive;
    font-size: .85em; font-weight: 700;
    pointer-events: none; z-index: 5;
  }

  /* 13 — Subject-verb agreement */
  .doodle-agr {
    background: rgba(234, 88, 12, .1);
    border-bottom: 2.5px solid #ea580c;
  }
  .doodle-agr::before {
    content: 'agr';
    position: absolute; bottom: calc(100% + 3px);
    left: 50%; transform: translateX(-50%);
    color: #ea580c; font-family: 'Caveat', cursive;
    font-size: .85em; font-weight: 700;
    pointer-events: none; z-index: 5;
  }

  /* 14 — Wrong verb tense */
  .doodle-vt {
    background: rgba(124, 58, 237, .09);
    border-bottom: 2.5px dashed #7c3aed;
  }
  .doodle-vt::before {
    content: 'vt';
    position: absolute; bottom: calc(100% + 3px);
    left: 50%; transform: translateX(-50%);
    color: #7c3aed; font-family: 'Caveat', cursive;
    font-size: .85em; font-weight: 700;
    pointer-events: none; z-index: 5;
  }

  /* 15 — Wrong / missing article */
  .doodle-art {
    background: rgba(2, 132, 199, .09);
    border-bottom: 2.5px dotted #0284c7;
  }
  .doodle-art::before {
    content: 'art';
    position: absolute; bottom: calc(100% + 3px);
    left: 50%; transform: translateX(-50%);
    color: #0284c7; font-family: 'Caveat', cursive;
    font-size: .85em; font-weight: 700;
    pointer-events: none; z-index: 5;
  }

  /* 16 — Wrong preposition */
  .doodle-prep {
    background: rgba(219, 39, 119, .08);
    border-bottom: 2.5px dotted #db2777;
  }
  .doodle-prep::before {
    content: 'prep';
    position: absolute; bottom: calc(100% + 3px);
    left: 50%; transform: translateX(-50%);
    color: #db2777; font-family: 'Caveat', cursive;
    font-size: .85em; font-weight: 700;
    pointer-events: none; z-index: 5;
  }

  /* 17 — Unnecessary repetition */
  .doodle-rep {
    background: rgba(180, 83, 9, .12);
    border-bottom: 2.5px solid #b45309;
  }
  .doodle-rep::before {
    content: 'rep';
    position: absolute; bottom: calc(100% + 3px);
    left: 50%; transform: translateX(-50%);
    color: #b45309; font-family: 'Caveat', cursive;
    font-size: .85em; font-weight: 700;
    pointer-events: none; z-index: 5;
  }

  /* 18 — Unclear pronoun reference */
  .doodle-ref {
    background: rgba(15, 118, 110, .09);
    border-bottom: 2.5px dashed #0f766e;
  }
  .doodle-ref::before {
    content: 'ref?';
    position: absolute; bottom: calc(100% + 3px);
    left: 50%; transform: translateX(-50%);
    color: #0f766e; font-family: 'Caveat', cursive;
    font-size: .85em; font-weight: 700;
    pointer-events: none; z-index: 5;
  }

  /* 19 — Comma splice */
  .doodle-cs {
    background: rgba(185, 28, 28, .08);
    outline: 2px dashed #b91c1c;
    outline-offset: 1px;
    border-radius: 2px;
  }
  .doodle-cs::before {
    content: 'cs';
    position: absolute; bottom: calc(100% + 3px);
    left: 50%; transform: translateX(-50%);
    color: #b91c1c; font-family: 'Caveat', cursive;
    font-size: .85em; font-weight: 700;
    pointer-events: none; z-index: 5;
  }

  /* 20 — Word order */
  .doodle-wo {
    background: rgba(99, 102, 241, .1);
    border-bottom: 2.5px wavy #6366f1;
    text-decoration-thickness: 2px;
  }
  .doodle-wo::before {
    content: 'w/o';
    position: absolute; bottom: calc(100% + 3px);
    left: 50%; transform: translateX(-50%);
    color: #6366f1; font-family: 'Caveat', cursive;
    font-size: .85em; font-weight: 700;
    pointer-events: none; z-index: 5;
  }

  /* 21 — Parallel structure */
  .doodle-par {
    background: rgba(5, 150, 105, .08);
    border-top: 2.5px solid #059669;
    border-bottom: 2.5px solid #059669;
    padding: 2px 0;
  }
  .doodle-par::before {
    content: '‖ par';
    position: absolute; bottom: calc(100% + 3px);
    left: 50%; transform: translateX(-50%);
    color: #059669; font-family: 'Caveat', cursive;
    font-size: .85em; font-weight: 700;
    pointer-events: none; z-index: 5;
  }

  /* ════════ COLOUR HIGHLIGHTERS ════════ */

  .hl-grammar {
    background: rgba(253, 224, 71, .55);
    border-radius: 2px;
    padding: 0 1px;
  }
  .hl-vocab {
    background: rgba(96, 165, 250, .3);
    border-radius: 2px;
    padding: 0 1px;
  }
  .hl-structure {
    background: rgba(251, 146, 60, .3);
    border-radius: 2px;
    padding: 0 1px;
  }
  .hl-style {
    background: rgba(196, 181, 253, .45);
    border-radius: 2px;
    padding: 0 1px;
  }

  /* Good writing — green highlight + ✓ above */
  .hl-good {
    background: rgba(74, 222, 128, .3);
    border-radius: 2px;
    padding: 0 1px;
    position: relative;
    cursor: help;
  }
  .hl-good::after {
    content: '✓';
    position: absolute;
    bottom: calc(100% + 2px);
    left: 50%; transform: translateX(-50%);
    color: #16a34a;
    font-family: 'Caveat', cursive;
    font-size: 1em; font-weight: 700;
    pointer-events: none; z-index: 5;
    background: rgba(74,222,128,.2);
    padding: 0 3px;
    border-radius: 2px;
  }

  /* ════════ MARGIN COMMENT MARKERS ════════ */

  .margin-comment-marker {
    display: inline-flex;
    align-items: center; justify-content: center;
    width: 19px; height: 19px;
    background: #dc2626;
    color: #fff;
    font-family: 'Unbounded', 'Syne', sans-serif;
    font-size: 9px; font-weight: 700;
    border-radius: 50%;
    border: none; cursor: pointer;
    position: relative; top: -5px;
    margin: 0 2px;
    z-index: 10; flex-shrink: 0;
    vertical-align: middle;
    transition: transform .12s, background .12s;
    box-shadow: 1px 1px 0 rgba(0,0,0,.25);
  }
  .margin-comment-marker:hover  { transform: scale(1.25); background: #b91c1c; }
  .margin-comment-marker.active { background: #7f1d1d; transform: scale(1.15); }

  #comment-popover {
    position: fixed;
    background: #fff;
    border: 2.5px solid #dc2626;
    box-shadow: 5px 5px 0 rgba(220,38,38,.25);
    padding: 12px 14px;
    z-index: 2000;
    max-width: 280px; min-width: 180px;
    display: none;
    animation: popIn .2s cubic-bezier(.16,1,.3,1);
  }
  #comment-popover.visible { display: block; }
  @keyframes popIn {
    from { opacity:0; transform:scale(.9) translateY(4px); }
    to   { opacity:1; transform:scale(1) translateY(0); }
  }
  .comment-pop-label {
    font-family: 'Unbounded', 'Syne', sans-serif;
    font-size: 8px; font-weight: 700;
    text-transform: uppercase; letter-spacing: .1em;
    color: #dc2626; margin-bottom: 7px;
    display: flex; align-items: center; gap: 5px;
    border-bottom: 1px solid rgba(220,38,38,.2);
    padding-bottom: 6px;
  }
  .comment-pop-text {
    font-family: 'Caveat', cursive;
    font-size: 15px; line-height: 1.55;
    color: #1a1a1a;
  }

  /* ════════ SUGGESTIONS PANEL ════════ */

  .suggestions-panel {
    border: 2.5px solid #0a0a0a;
    background: #fff;
    margin-bottom: 24px;
    box-shadow: 7px 7px 0 #0a0a0a;
    overflow: hidden;
    animation: fadeUp .4s cubic-bezier(.16,1,.3,1) both;
  }
  .suggestions-header {
    background: #0055ff;
    color: #fff;
    padding: 13px 20px;
    font-family: 'Unbounded', 'Syne', sans-serif;
    font-weight: 700; font-size: 10px;
    text-transform: uppercase; letter-spacing: .1em;
    display: flex; align-items: center; gap: 10px;
  }
  .suggestions-body { padding: 4px 0; }
  .suggestion-item {
    display: flex; align-items: flex-start; gap: 14px;
    padding: 13px 20px;
    border-bottom: 1.5px dashed #f0f0f0;
    animation: slideLeft .4s cubic-bezier(.16,1,.3,1) both;
  }
  .suggestion-item:last-child { border-bottom: none; }
  .suggestion-num {
    flex-shrink: 0;
    width: 24px; height: 24px;
    background: #0055ff; color: #fff; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Unbounded', 'Syne', sans-serif;
    font-size: 9px; font-weight: 700;
  }
  .suggestion-text {
    font-size: 13px; line-height: 1.7;
    color: #333; padding-top: 2px;
  }

  /* ════════ STUDY TIPS PANEL ════════ */

  .study-tips-panel {
    border: 2.5px solid #0a0a0a;
    background: #0a0a0a;
    margin-bottom: 24px;
    box-shadow: 7px 7px 0 rgba(0,0,0,.2);
    overflow: hidden;
    animation: fadeUp .5s cubic-bezier(.16,1,.3,1) .1s both;
  }
  .study-tips-header {
    background: #ffe500;
    color: #0a0a0a;
    padding: 13px 20px;
    font-family: 'Unbounded', 'Syne', sans-serif;
    font-weight: 700; font-size: 10px;
    text-transform: uppercase; letter-spacing: .1em;
    display: flex; align-items: center; gap: 10px;
    border-bottom: 2.5px solid #0a0a0a;
  }
  .study-tips-body {
    padding: 16px 20px;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 12px;
  }
  .study-tip-card {
    background: rgba(255,255,255,.05);
    border: 1.5px solid rgba(255,255,255,.1);
    padding: 15px;
    animation: fadeUp .5s cubic-bezier(.16,1,.3,1) both;
  }
  .study-tip-card:nth-child(1){animation-delay:.06s}
  .study-tip-card:nth-child(2){animation-delay:.12s}
  .study-tip-card:nth-child(3){animation-delay:.18s}
  .study-tip-card:nth-child(4){animation-delay:.24s}
  .study-tip-icon  { font-size: 24px; margin-bottom: 8px; display: block; }
  .study-tip-title {
    font-family: 'Unbounded', 'Syne', sans-serif;
    font-weight: 700; font-size: 9.5px;
    text-transform: uppercase; letter-spacing: .09em;
    color: #ffe500; margin-bottom: 6px;
  }
  .study-tip-text {
    font-size: 12px; line-height: 1.75;
    color: rgba(255,255,255,.65);
    font-family: 'JetBrains Mono', 'DM Sans', monospace;
  }

  /* ════════ MARK TYPE LEGEND ADDITIONS ════════ */

  .legend-sep {
    width: 100%;
    height: 1px;
    background: rgba(255,255,255,.1);
    margin: 4px 0;
  }

  /* ════════ RUBRIC BAR (safe fallback) ════════ */

  .rubric-bar-track {
    grid-column: 1/-1;
    height: 3px; background: #eee;
    margin-top: 8px; overflow: hidden;
  }
  .rubric-bar-fill {
    height: 100%; width: 0;
    transition: width 1.1s cubic-bezier(.16,1,.3,1);
  }

  /* ════════ ANIMATIONS ════════ */

  @keyframes fadeUp {
    from { opacity:0; transform:translateY(14px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes slideLeft {
    from { opacity:0; transform:translateX(-12px); }
    to   { opacity:1; transform:translateX(0); }
  }
  `;
  const style = document.createElement('style');
  style.id = 'prepbot-extended-styles';
  style.textContent = css;
  document.head.appendChild(style);
})();

/* ─────────────────────────────────────────────────────
   DOM REFS
───────────────────────────────────────────────────── */
const $ = id => document.getElementById(id);
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

/* Persistent comment popover (singleton) */
const elCommentPop = document.createElement('div');
elCommentPop.id = 'comment-popover';
document.body.appendChild(elCommentPop);

/* State */
let currentTopic = "";
let activeEl = null;
let commentCounter = 0;
let commentStore = {}; // id → text

/* ─────────────────────────────────────────────────────
   EVENT LISTENERS
───────────────────────────────────────────────────── */
elTextarea.addEventListener('input', () => {
  const words = elTextarea.value.trim() ?
    elTextarea.value.trim().split(/\s+/).length : 0;
  elWordCount.textContent = words;
  elSubmitBtn.disabled = words < 20;
});

$('new-topic-btn').addEventListener('click', openModal);
$('close-modal').addEventListener('click', closeModal);

elModal.addEventListener('click', e => {
  if (e.target === elModal) closeModal();
});

document.querySelectorAll('.type-btn').forEach(btn => {
  btn.addEventListener('click', () => fetchGeneratedTopic(btn.dataset.type));
});

elRetryBtn.addEventListener('click', () => {
  elResultsSec.classList.remove('active');
  elEditorSec.style.display = 'block';
  openModal();
  elTextarea.value = '';
  elWordCount.textContent = '0';
  elSubmitBtn.disabled = true;
  elPopover.classList.remove('visible');
  activeEl = null;
});

/* ─────────────────────────────────────────────────────
   MODAL
───────────────────────────────────────────────────── */
function openModal() { elModal.classList.add('active'); }

function closeModal() {
  elModal.classList.remove('active');
  if (!currentTopic) {
    currentTopic = "Write a descriptive essay about an abandoned place that suddenly comes to life.";
    elTopic.textContent = currentTopic;
  }
}

/* ─────────────────────────────────────────────────────
   TOPIC GENERATION
───────────────────────────────────────────────────── */
async function fetchGeneratedTopic(type) {
  elTopicBox.style.opacity = '0.5';
  elTopic.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Generating ${type} prompt…`;
  closeModal();
  
  try {
    const res = await fetch(GROQ_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${GROQ_KEY}` },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{
          role: "user",
          content: `Generate ONE original, age-appropriate ${type} writing topic for a Nigerian secondary school student (SS1–SS2, age 13–15). ` +
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
    elTopic.textContent = currentTopic;
    const words = elTextarea.value.trim() ? elTextarea.value.trim().split(/\s+/).length : 0;
    elSubmitBtn.disabled = words < 20;
  } catch (err) {
    console.error(err);
    elTopic.textContent = "Error generating topic. Please try again.";
    currentTopic = "";
  } finally {
    elTopicBox.style.opacity = '1';
  }
}

/* ─────────────────────────────────────────────────────
   SYSTEM PROMPT
───────────────────────────────────────────────────── */
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
    { "icon": "<relevant emoji>", "title": "<short title>", "tip": "<concrete 2-sentence study tip>" },
    { "icon": "<emoji>", "title": "<title>", "tip": "<tip>" },
    { "icon": "<emoji>", "title": "<title>", "tip": "<tip>" },
    { "icon": "<emoji>", "title": "<title>", "tip": "<tip>" }
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
26. Good writing ✓:     <hl cat="good">genuinely well-written passage</hl>

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
- studyTips: 4 targeted tips based on the ACTUAL error types found. Match icon to topic.
- Preserve paragraph breaks as \\n\\n. Escape all JSON strings.`;
}

/* ─────────────────────────────────────────────────────
   SUBMIT
───────────────────────────────────────────────────── */
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
          { role: "user", content: `TOPIC: ${currentTopic}\n\nSTUDENT ESSAY:\n${userText}` }
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
    alert("Grading error — AI returned unexpected data. Please try again.");
    elLoading.classList.remove('active');
  }
});

/* ─────────────────────────────────────────────────────
   RENDER RESULTS
───────────────────────────────────────────────────── */
function renderResults(data, originalText) {
  
  /* ── Score stamp ── */
  const score = Math.min(100, Math.max(0, data.totalScore || 0));
  elStamp.textContent = `${score}%`;
  elStamp.className = `score-stamp${score < 55 ? ' fail' : score < 70 ? ' avg' : ''}`;
  
  /* ── Rubric rows with animated bars ── */
  elRubric.innerHTML = '';
  const frag = document.createDocumentFragment();
  (data.rubric || []).forEach((item, i) => {
    const pct = Math.round((item.score / item.outOf) * 100);
    const col = pct >= 70 ? 'var(--green, #00a550)' : pct >= 50 ? 'var(--amber, #e67e00)' : 'var(--red, #ff2200)';
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
  
  /* Animate bars after paint */
  requestAnimationFrame(() => requestAnimationFrame(() => {
    elRubric.querySelectorAll('.rubric-bar-fill').forEach(bar => {
      bar.style.width = bar.dataset.pct + '%';
    });
  }));
  
  /* ── Reset comment state ── */
  commentCounter = 0;
  commentStore = {};
  
  /* ── Build annotated HTML ── */
  let html = data.annotatedText || originalText;
  
  /* Newlines → breaks */
  html = html.replace(/\\n\\n/g, '\n\n')
    .replace(/\n\n/g, '<br><br>')
    .replace(/\n/g, '<br>');
  
  /* ── 1. Standard <mark> error tags ── */
  html = html.replace(
    /<mark\s+type=['"]([^'"]+)['"]\s*(?:fix=['"]([^'"]*?)['"])?\s*(?:loss=['"]([^'"]*?)['"])?>([\s\S]*?)<\/mark>/gi,
    (_, type, fix, loss, content) => {
      const fixAttr = fix ? ` data-fix="${safe(fix)}"` : '';
      const deduction = loss ? `<span class="deduction">${safe(loss)}</span>` : '';
      return `<span class="doodle doodle-${safe(type)}"${fixAttr}>${content}${deduction}</span>`;
    }
  );
  
  /* ── 2. Colour highlights <hl cat="..."> ── */
  html = html.replace(
    /<hl\s+cat=['"]([^'"]+)['"]>([\s\S]*?)<\/hl>/gi,
    (_, cat, content) => `<span class="hl-${safe(cat)}">${content}</span>`
  );
  
  /* ── 3. Positive feedback <good reason="..."> ── */
  html = html.replace(
    /<good\s+reason=['"]([^'"]+)['"]>([\s\S]*?)<\/good>/gi,
    (_, reason, content) =>
    `<span class="hl-good" title="${safe(reason)}">${content}</span>`
  );
  
  /* ── 4. Margin comments <comment text="..."> ── */
  html = html.replace(
    /<comment\s+text=['"]([^'"]+)['"]>([\s\S]*?)<\/comment>/gi,
    (_, text) => {
      const id = ++commentCounter;
      commentStore[id] = text;
      return `<button class="margin-comment-marker" data-cid="${id}">${id}</button>`;
    }
  );
  
  /* ── 5. Word substitutions <sub opts="..."> ── */
  html = html.replace(
    /<sub\s+opts=['"]([^'"]+)['"]>([^<]+)<\/sub>/gi,
    (_, opts, word) =>
    `<span class="sub-word" data-opts="${safe(opts)}" data-type="word">${word}</span>`
  );
  
  /* ── 6. Sentence rewrites <sent opts="..."> ── */
  html = html.replace(
    /<sent\s+opts=['"]([^'"]+)['"]>([\s\S]*?)<\/sent>/gi,
    (_, opts, sentence) =>
    `<span class="sent-sub" data-opts="${safe(opts)}" data-type="sent">${sentence}</span>`
  );
  
  elAnnotated.innerHTML = html;
  
  /* ── Attach popover listeners ── */
  elAnnotated.querySelectorAll('.sub-word, .sent-sub').forEach(el => {
    el.addEventListener('click', e => { e.stopPropagation();
      openPopover(el); });
  });
  
  /* ── Attach comment listeners ── */
  elAnnotated.querySelectorAll('.margin-comment-marker').forEach(marker => {
    marker.addEventListener('click', e => {
      e.stopPropagation();
      showComment(marker);
    });
  });
  
  /* ── Render suggestions panel ── */
  renderSuggestions(data.suggestions || []);
  
  /* ── Render study tips panel ── */
  renderStudyTips(data.studyTips || []);
  
  /* ── Transition ── */
  elLoading.classList.remove('active');
  elEditorSec.style.display = 'none';
  elResultsSec.classList.add('active');
}

/* ─────────────────────────────────────────────────────
   SUGGESTIONS PANEL
───────────────────────────────────────────────────── */
function renderSuggestions(suggestions) {
  /* Find or create panel — insert before the paper scroll wrapper */
  let panel = $('suggestions-panel');
  if (!panel) {
    panel = document.createElement('div');
    panel.id = 'suggestions-panel';
    panel.className = 'suggestions-panel';
    const anchor = document.querySelector('.paper-scroll-wrap') ||
      document.querySelector('.annotated-paper') ||
      elAnnotated.parentNode;
    anchor.parentNode.insertBefore(panel, anchor);
  }
  
  if (!suggestions.length) { panel.style.display = 'none'; return; }
  panel.style.display = '';
  
  panel.innerHTML = `
    <div class="suggestions-header">
      <i class="fas fa-pen-nib"></i>
      Examiner's Suggestions&nbsp;
      <span style="opacity:.6;font-weight:400;">(${suggestions.length})</span>
    </div>
    <div class="suggestions-body">
      ${suggestions.map((s, i) => `
        <div class="suggestion-item" style="animation-delay:${(i * 0.07).toFixed(2)}s">
          <div class="suggestion-num">${i + 1}</div>
          <div class="suggestion-text">${safe(s)}</div>
        </div>`).join('')}
    </div>`;
}

/* ─────────────────────────────────────────────────────
   STUDY TIPS PANEL
───────────────────────────────────────────────────── */
function renderStudyTips(tips) {
  let panel = $('study-tips-panel');
  if (!panel) {
    panel = document.createElement('div');
    panel.id = 'study-tips-panel';
    panel.className = 'study-tips-panel';
    /* Append at end of results section */
    const retryRow = elRetryBtn ? elRetryBtn.closest('.footer-controls') : null;
    if (retryRow) {
      elResultsSec.insertBefore(panel, retryRow);
    } else {
      elResultsSec.appendChild(panel);
    }
  }
  
  if (!tips.length) { panel.style.display = 'none'; return; }
  panel.style.display = '';
  
  panel.innerHTML = `
    <div class="study-tips-header">
      <i class="fas fa-graduation-cap"></i> Study Tips Tailored For You
    </div>
    <div class="study-tips-body">
      ${tips.map((t, i) => `
        <div class="study-tip-card" style="animation-delay:${(i * 0.08).toFixed(2)}s">
          <span class="study-tip-icon">${safe(t.icon || '')}</span>
          <div class="study-tip-title">${safe(t.title || '')}</div>
          <div class="study-tip-text">${safe(t.tip || '')}</div>
        </div>`).join('')}
    </div>`;
}

/* ─────────────────────────────────────────────────────
   COMMENT POPOVER
───────────────────────────────────────────────────── */
function showComment(marker) {
  const id = parseInt(marker.dataset.cid, 10);
  const text = commentStore[id];
  if (!text) return;
  
  /* Toggle off if re-clicking same marker */
  if (elCommentPop.classList.contains('visible') &&
    elCommentPop.dataset.activeCid == id) {
    elCommentPop.classList.remove('visible');
    marker.classList.remove('active');
    elCommentPop.dataset.activeCid = '';
    return;
  }
  
  /* Deactivate any previous marker */
  document.querySelectorAll('.margin-comment-marker.active')
    .forEach(m => m.classList.remove('active'));
  marker.classList.add('active');
  elCommentPop.dataset.activeCid = id;
  
  elCommentPop.innerHTML = `
    <div class="comment-pop-label">
      <i class="fas fa-comment-dots"></i> Examiner's Note ${id}
    </div>
    <div class="comment-pop-text">${safe(text)}</div>`;
  elCommentPop.classList.add('visible');
  
  /* Smart positioning */
  const rect = marker.getBoundingClientRect();
  const pw = 284;
  const ph = 120;
  let left = rect.right + 10;
  let top = rect.top - 8;
  if (left + pw > window.innerWidth - 8) left = rect.left - pw - 10;
  if (left < 8) left = 8;
  if (top + ph > window.innerHeight - 8) top = window.innerHeight - ph - 8;
  if (top < 8) top = 8;
  elCommentPop.style.left = left + 'px';
  elCommentPop.style.top = top + 'px';
}

/* Close comment popover on outside click */
document.addEventListener('click', e => {
  if (elCommentPop.contains(e.target)) return;
  if (e.target.classList.contains('margin-comment-marker')) return;
  elCommentPop.classList.remove('visible');
  elCommentPop.dataset.activeCid = '';
  document.querySelectorAll('.margin-comment-marker.active')
    .forEach(m => m.classList.remove('active'));
});

/* ─────────────────────────────────────────────────────
   MARK POPOVER (word / sentence substitutions)
───────────────────────────────────────────────────── */
function openPopover(el) {
  activeEl = el;
  const type = el.dataset.type || 'word';
  const optsStr = el.dataset.opts || '';
  if (!optsStr) return;
  
  const opts = type === 'sent' ?
    optsStr.split('|||').map(s => s.trim()).filter(Boolean) :
    optsStr.split(',').map(s => s.trim()).filter(Boolean);
  
  const isSent = type === 'sent';
  const labelColor = isSent ? 'var(--amber, #e67e00)' : 'var(--blue, #0055ff)';
  const iconClass = isSent ? 'fas fa-pen' : 'fas fa-lightbulb';
  const labelText = isSent ? 'Sentence Rewrite' : 'Word Substitute';
  
  let html = `<div class="pop-title" style="color:${labelColor}">
    <i class="${iconClass}"></i> ${labelText}
  </div>`;
  opts.forEach(opt => { html += `<button class="pop-opt">${opt}</button>`; });
  
  elPopover.innerHTML = html;
  elPopover.classList.add('visible');
  
  const rect = el.getBoundingClientRect();
  const pw = 300;
  let left = rect.left;
  let top = rect.bottom + 6;
  if (left + pw > window.innerWidth - 8) left = window.innerWidth - pw - 8;
  if (left < 8) left = 8;
  if (top + 160 > window.innerHeight) top = rect.top - 170;
  elPopover.style.left = left + 'px';
  elPopover.style.top = top + 'px';
  
  elPopover.querySelectorAll('.pop-opt').forEach(btn => {
    btn.addEventListener('click', () => applyOpt(btn.textContent));
  });
}

function applyOpt(chosen) {
  if (!activeEl) return;
  activeEl.textContent = chosen;
  activeEl.style.textDecoration = 'none';
  activeEl.style.color = 'var(--green, #00a550)';
  activeEl.style.fontWeight = '600';
  activeEl.classList.remove('sub-word', 'sent-sub');
  elPopover.classList.remove('visible');
  activeEl = null;
}

document.addEventListener('click', e => {
  if (!elPopover.contains(e.target)) elPopover.classList.remove('visible');
});

/* ─────────────────────────────────────────────────────
   UTIL
───────────────────────────────────────────────────── */
function safe(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/* ─────────────────────────────────────────────────────
   INIT
───────────────────────────────────────────────────── */
window.addEventListener('DOMContentLoaded', openModal);