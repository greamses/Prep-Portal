"use strict";

/* ═══════════════════════════════════════════════════════════
   EXPLANATION DATA
   ═══════════════════════════════════════════════════════════ */
const EXPLANATIONS = [
  /* ── Case 01: ? and . ───────────────────────────────────── */
  {
    caseNum: "01",
    title:   "Questions & Statements",
    focus:   "? · .",
    leftHTML: `
      <h2 class="exp-heading">Sentence Endings</h2>
      <p class="exp-intro">Every sentence needs an ending mark:</p>

      <div class="exp-word-block exp-word-block--blue">
        <span class="exp-word exp-word--punct">?</span>
        <span class="exp-eq">= <strong>question mark</strong></span>
        <p class="exp-eg">"Are you ready?" &nbsp;·&nbsp; "Where is Kemi?"</p>
      </div>

      <div class="exp-word-block exp-word-block--yellow">
        <span class="exp-word exp-word--punct">.</span>
        <span class="exp-eq">= <strong>full stop</strong></span>
        <p class="exp-eg">"She is ready." &nbsp;·&nbsp; "We went home."</p>
      </div>

      <div class="exp-secret-box">
        <p class="exp-secret-title">Question words</p>
        <p class="exp-secret-body">Sentences starting with <strong>Who, What, Where, When, Why, How, Is, Are, Did, Do, Can, Will</strong> are nearly always questions.</p>
      </div>`,

    rightHTML: `
      <div class="exp-trick-box">
        <div class="exp-trick-header">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          The Test
        </div>
        <ol class="exp-steps">
          <li class="exp-step">Is the sentence <strong>asking</strong> something?<br><span class="exp-yes">Yes →</span> use <strong>?</strong></li>
          <li class="exp-step">Is the sentence <strong>telling</strong> something?<br><span class="exp-yes">Yes →</span> use <strong>.</strong></li>
        </ol>
      </div>

      <div class="exp-quicktest">
        <p class="exp-qt-label">Quick Test</p>
        <p class="exp-qt-row"><span class="exp-qt-q">"Did you eat<u>__</u>"</span> → asking → <strong>?</strong></p>
        <p class="exp-qt-row"><span class="exp-qt-q">"She ate pizza<u>__</u>"</span> → telling → <strong>.</strong></p>
        <p class="exp-qt-row"><span class="exp-qt-q">"Where is my bag<u>__</u>"</span> → asking → <strong>?</strong></p>
        <p class="exp-qt-row"><span class="exp-qt-q">"The dog barked<u>__</u>"</span> → telling → <strong>.</strong></p>
      </div>

      <div class="exp-reminder">
        <p><strong>Tip:</strong> Read aloud. If your voice goes <em>up</em> at the end, it is usually a question.</p>
      </div>`,
  },

  /* ── Case 02: , ─────────────────────────────────────────── */
  {
    caseNum: "02",
    title:   "Commas",
    focus:   ",",
    leftHTML: `
      <h2 class="exp-heading">The Pause Mark</h2>
      <p class="exp-intro">A comma marks a short pause. Use it in two main ways:</p>

      <div class="exp-word-block exp-word-block--blue">
        <span class="exp-word exp-word--punct">,</span>
        <span class="exp-eq">= <strong>between items in a list</strong></span>
        <p class="exp-eg">"I have a dog, a cat, and a fish."</p>
      </div>

      <div class="exp-word-block exp-word-block--yellow">
        <span class="exp-word exp-word--punct">,</span>
        <span class="exp-eq">= <strong>after an opening phrase</strong></span>
        <p class="exp-eg">"After school, we played." · "Before you eat, wash your hands."</p>
      </div>`,

    rightHTML: `
      <div class="exp-trick-box">
        <div class="exp-trick-header">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          The Comma Test
        </div>
        <ol class="exp-steps">
          <li class="exp-step">Are there <strong>items in a list</strong>?<br><span class="exp-yes">Yes →</span> put commas between them</li>
          <li class="exp-step">Does the sentence <strong>start with a phrase</strong> (time / place / if / after / before)?<br><span class="exp-yes">Yes →</span> put a comma after it</li>
        </ol>
      </div>

      <div class="exp-quicktest">
        <p class="exp-qt-label">Quick Test</p>
        <p class="exp-qt-row"><span class="exp-qt-q">"I like apples<u>__</u> pears<u>__</u> and mangoes."</span><br>→ list → <strong>, ,</strong></p>
        <p class="exp-qt-row"><span class="exp-qt-q">"After the rain<u>__</u> the sun came out."</span><br>→ opening phrase → <strong>,</strong></p>
      </div>

      <div class="exp-reminder">
        <p><strong>Note:</strong> No comma is needed before "and" when there are only <em>two</em> items.</p>
        <p style="margin-top:0.2rem">"I have a dog and a cat." ← no comma needed</p>
      </div>`,
  },

  /* ── Case 03: Mixed ─────────────────────────────────────── */
  {
    caseNum: "03",
    title:   "Mixed Punctuation",
    focus:   "? · . · ,",
    leftHTML: `
      <h2 class="exp-heading">All Three Together</h2>
      <p class="exp-intro">A quick reminder of all three marks:</p>

      <div class="exp-word-block exp-word-block--blue">
        <span class="exp-word exp-word--punct">?</span>
        <span class="exp-eq">= <strong>asking</strong></span>
        <p class="exp-eg">"Where are you going?"</p>
      </div>

      <div class="exp-word-block exp-word-block--yellow">
        <span class="exp-word exp-word--punct">.</span>
        <span class="exp-eq">= <strong>telling / statement</strong></span>
        <p class="exp-eg">"She went to school."</p>
      </div>

      <div class="exp-word-block exp-word-block--green">
        <span class="exp-word exp-word--punct">,</span>
        <span class="exp-eq">= <strong>pause (list or opening phrase)</strong></span>
        <p class="exp-eg">"After class, we ate rice, beans, and stew."</p>
      </div>`,

    rightHTML: `
      <div class="exp-trick-box">
        <div class="exp-trick-header">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          The 3-Step Check
        </div>
        <ol class="exp-steps">
          <li class="exp-step">Is it a <strong>question</strong>? → <strong>?</strong></li>
          <li class="exp-step">End of a <strong>statement</strong>? → <strong>.</strong></li>
          <li class="exp-step"><strong>List</strong> or <strong>opening phrase</strong>? → <strong>,</strong></li>
        </ol>
      </div>

      <div class="exp-pairs-grid">
        <div class="exp-pair"><span class="exp-pair-a">?</span><span class="exp-pair-sep">=</span><span class="exp-pair-b">question</span></div>
        <div class="exp-pair"><span class="exp-pair-a">.</span><span class="exp-pair-sep">=</span><span class="exp-pair-b">statement</span></div>
        <div class="exp-pair"><span class="exp-pair-a">,</span><span class="exp-pair-sep">=</span><span class="exp-pair-b">list / pause</span></div>
      </div>

      <div class="exp-reminder">
        <p><strong>Top tip:</strong> Read the sentence aloud. A <em>pause inside</em> = comma. Voice <em>goes up at end</em> = question mark. Voice <em>stops at end</em> = full stop.</p>
      </div>`,
  },
];

/* ═══════════════════════════════════════════════════════════
   EXERCISE DATA
   Each item is an array of strings (text) and gap objects
   { correct: "?" | "." | "," }
   ═══════════════════════════════════════════════════════════ */
const EXERCISES = [
  {
    id:    "ex1",
    title: "Questions & Statements",
    focus: "? · .",
    pool:  ["?", "."],
    items: [
      ["Is the sky blue",                        { correct: "?" }],
      ["She packed her school bag",              { correct: "." }],
      ["Can you hear that noise",                { correct: "?" }],
      ["The mango tree is very tall",            { correct: "." }],
      ["Did you finish your supper",             { correct: "?" }],
      ["Kemi walked home from school",           { correct: "." }],
      ["Where is your homework",                 { correct: "?" }],
      ["The match started at three o'clock",     { correct: "." }],
      ["Are you coming to the party",            { correct: "?" }],
      ["We ate rice and stew for lunch",         { correct: "." }],
      ["Who left the door open",                 { correct: "?" }],
      ["The market was very busy today",         { correct: "." }],
    ],
  },
  {
    id:    "ex2",
    title: "Commas in Lists & Phrases",
    focus: ",",
    pool:  [","],
    items: [
      ["I like football",   { correct: "," }, " basketball",  { correct: "," }, " and athletics."],
      ["After school",      { correct: "," }, " we went to the playground."],
      ["She is kind",       { correct: "," }, " clever",      { correct: "," }, " and hardworking."],
      ["Before you sleep",  { correct: "," }, " brush your teeth."],
      ["We visited Lagos",  { correct: "," }, " Abuja",       { correct: "," }, " and Enugu."],
      ["He bought bread",   { correct: "," }, " eggs",        { correct: "," }, " and milk."],
      ["On Fridays",        { correct: "," }, " we wear our school uniforms."],
      ["Her bag had books", { correct: "," }, " pencils",     { correct: "," }, " and a ruler."],
      ["If it rains",       { correct: "," }, " we will have class inside."],
      ["He ran fast",       { correct: "," }, " jumped high", { correct: "," }, " and won the race."],
    ],
  },
  {
    id:    "ex3",
    title: "Mixed Punctuation",
    focus: "? · . · ,",
    pool:  ["?", ".", ","],
    items: [
      ["Did you eat breakfast",                                           { correct: "?" }],
      ["The cat sat on the mat",                                          { correct: "." }],
      ["I packed my books", { correct: "," }, " my lunch", { correct: "," }, " and my water bottle", { correct: "." }],
      ["Where is the library",                                            { correct: "?" }],
      ["After the game",  { correct: "," }, " we drank cold water",      { correct: "." }],
      ["She reads",       { correct: "," }, " writes",     { correct: "," }, " and draws every day", { correct: "." }],
      ["Can you help me with this",                                       { correct: "?" }],
      ["The sun set behind the hills",                                    { correct: "." }],
      ["Before leaving",  { correct: "," }, " check that the lights are off", { correct: "." }],
      ["Who is your favourite teacher",                                   { correct: "?" }],
      ["He is funny",     { correct: "," }, " kind",       { correct: "," }, " and always helpful", { correct: "." }],
      ["We finished all our work",                                        { correct: "." }],
    ],
  },
];

/* ═══════════════════════════════════════════════════════════
   STATE
   ═══════════════════════════════════════════════════════════ */
let pageFlip  = null;
let bookBuilt = false;

const EXPL_START = [];
const EXER_START = [];

const drag = {
  char:       null,
  sourceSlot: null,
  ghost:      null,
  selected:   null,
};

/* ═══════════════════════════════════════════════════════════
   PAGE HELPERS
   ═══════════════════════════════════════════════════════════ */
function makePage(extraClass, density) {
  const div = document.createElement("div");
  div.className = `page${extraClass ? " " + extraClass : ""}`;
  if (density) div.dataset.density = density;
  return div;
}

function coverPattern() {
  return `<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <pattern id="diagP" width="20" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2="20" stroke="rgba(255,255,255,0.05)" stroke-width="6"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#diagP)"/>
  </svg>`;
}

/* ═══════════════════════════════════════════════════════════
   COVER + TOC + BACK
   ═══════════════════════════════════════════════════════════ */
function makeCoverPage() {
  const page = makePage("", "hard");
  page.innerHTML = `
    <div class="pc pc--cover">
      <div class="pc-cover-bg" aria-hidden="true">${coverPattern()}</div>
      <div class="pc-cover-content">
        <div class="pc-cover-badge" aria-hidden="true">
          <svg viewBox="0 0 64 64" fill="none" width="58" height="58">
            <path d="M32 4L6 17V38C6 51 17 62 32 64C47 62 58 51 58 38V17L32 4Z"
                  fill="rgba(255,229,0,0.18)" stroke="#ffe500" stroke-width="2.5"/>
            <text x="32" y="46" text-anchor="middle" font-size="30" font-family="serif"
                  fill="#ffe500" font-weight="900">?</text>
          </svg>
        </div>
        <h1 class="pc-cover-title">Punctuation<br>Patrol</h1>
        <p class="pc-cover-sub">English · Prep Portal</p>
        <div class="pc-cover-divider"></div>
        <ul class="pc-cover-chips" aria-label="Activity details">
          <li>3 Exercises</li>
          <li>Drag &amp; Drop</li>
          <li>Learn &amp; Practise</li>
        </ul>
        <p class="pc-cover-hint">Open to start &rarr;</p>
      </div>
      <div class="pc-cover-footer">prepportal.com</div>
    </div>`;
  return page;
}

function makeTOCLeftPage() {
  const page = makePage();
  page.innerHTML = `
    <div class="pc pc--toc">
      <div class="pc-header">Table of Contents</div>
      <ul class="pc-toc-list" id="ppTocList">
        ${EXERCISES.map((ex, i) => `
          <li class="pc-toc-item" data-goto-explanation="${i}">
            <span class="pc-toc-num">0${i + 1}</span>
            <span class="pc-toc-info">
              <strong class="pc-toc-title">${ex.title}</strong>
              <span class="pc-toc-focus">${ex.focus}</span>
              <span class="pc-toc-badge">Learn + Practise</span>
            </span>
            <span class="pc-toc-arrow">&rarr;</span>
          </li>`).join("")}
      </ul>
      <p class="pc-toc-tip">Click a title to jump to that lesson.</p>
    </div>`;
  return page;
}

function makeTOCRightPage() {
  const page = makePage();
  page.innerHTML = `
    <div class="pc pc--ref">
      <div class="pc-header">How This Book Works</div>
      <div class="pc-howto">
        <div class="pc-howto-step">
          <span class="pc-howto-num">1</span>
          <div><strong>Read the lesson</strong>
            <p>Each chapter starts with a friendly explanation of when to use each punctuation mark.</p>
          </div>
        </div>
        <div class="pc-howto-step">
          <span class="pc-howto-num">2</span>
          <div><strong>Use the trick</strong>
            <p>Use the Detective's Test to decide which mark fits before you practise.</p>
          </div>
        </div>
        <div class="pc-howto-step">
          <span class="pc-howto-num">3</span>
          <div><strong>Do the exercise</strong>
            <p>Drag a mark from the yellow strip and drop it anywhere in the sentence — it snaps to the nearest position. Sentences with commas show how many are needed.</p>
          </div>
        </div>
        <div class="pc-howto-step">
          <span class="pc-howto-num">4</span>
          <div><strong>Check &amp; learn</strong>
            <p>Press <em>Check</em> to see your score. Wrong sentences reveal the correct answer — review the lesson and try again!</p>
          </div>
        </div>
      </div>
      <p class="pc-ref-foot">Double-click any page to turn it &rarr;</p>
    </div>`;
  return page;
}

function makeBackCoverPage() {
  const page = makePage("", "hard");
  page.innerHTML = `
    <div class="pc pc--back-cover">
      <div class="pc-back-inner">
        <svg viewBox="0 0 60 60" fill="none" width="52" height="52" aria-hidden="true">
          <path d="M30 56L6 42V18L30 4L54 18V42L30 56Z" fill="#ffe500" stroke="#0a0a0a" stroke-width="3"/>
          <text x="30" y="37" text-anchor="middle" font-size="22" font-family="sans-serif"
                fill="#0a0a0a" font-weight="900">P</text>
        </svg>
        <p class="pc-back-msg">Punctuation matters.<br>Keep going!</p>
        <p class="pc-back-site">prepportal.com</p>
      </div>
    </div>`;
  return page;
}

/* ═══════════════════════════════════════════════════════════
   EXPLANATION PAGES
   ═══════════════════════════════════════════════════════════ */
function makeExplLeftPage(idx) {
  const exp  = EXPLANATIONS[idx];
  const page = makePage();
  page.innerHTML = `
    <div class="pc pc--explanation pc--explanation-left">
      <div class="pc-exp-header">
        <span class="pc-exp-case">Case File #0${idx + 1}</span>
        <span class="pc-exp-focus">${exp.focus}</span>
      </div>
      <div class="pc-exp-body">${exp.leftHTML}</div>
    </div>`;
  return page;
}

function makeExplRightPage(idx) {
  const exp  = EXPLANATIONS[idx];
  const page = makePage();
  page.innerHTML = `
    <div class="pc pc--explanation pc--explanation-right">
      <div class="pc-exp-header pc-exp-header--right">
        <span class="pc-exp-subtitle">${exp.title}</span>
        <span class="pc-exp-badge">Lesson</span>
      </div>
      <div class="pc-exp-body">${exp.rightHTML}</div>
      <div class="pc-exp-cta">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><polyline points="9 18 15 12 9 6"/></svg>
        Flip to practise &rarr;
      </div>
    </div>`;
  return page;
}

/* ═══════════════════════════════════════════════════════════
   TOKENISER
   Converts an item array into word/slot token list.
   Words get a leading space except the very first.
   Slots carry the correct character (or null for inter-word).
   ═══════════════════════════════════════════════════════════ */
function tokenizeSentence(item) {
  const tokens = [];
  let wordCount = 0;

  item.forEach((seg) => {
    if (typeof seg === "string") {
      const words = seg.trim().split(/\s+/).filter(Boolean);
      words.forEach((word) => {
        /* Add inter-word slot before every word that follows another word */
        if (tokens.length > 0 && tokens[tokens.length - 1].type === "word") {
          tokens.push({ type: "slot", correct: null });
        }
        tokens.push({ type: "word", text: wordCount === 0 ? word : " " + word });
        wordCount++;
      });
    } else {
      /* Gap object — attach correct value to the slot at this position */
      if (tokens.length > 0 && tokens[tokens.length - 1].type === "slot") {
        tokens[tokens.length - 1].correct = seg.correct;
      } else {
        tokens.push({ type: "slot", correct: seg.correct });
      }
    }
  });

  /* Trailing slot after final word (sentence-end position) */
  if (tokens.length > 0 && tokens[tokens.length - 1].type === "word") {
    tokens.push({ type: "slot", correct: null });
  }

  return tokens;
}

/* ═══════════════════════════════════════════════════════════
   NEAREST SLOT
   ═══════════════════════════════════════════════════════════ */
function findNearestSlot(sentence, clientX) {
  const slots = sentence.querySelectorAll(".pp-slot");
  let nearest = null, nearestDist = Infinity;
  slots.forEach((slot) => {
    const rect = slot.getBoundingClientRect();
    const cx   = rect.left + rect.width / 2;
    const dist = Math.abs(clientX - cx);
    if (dist < nearestDist) { nearestDist = dist; nearest = slot; }
  });
  return nearest;
}

/* ═══════════════════════════════════════════════════════════
   SENTENCE ROW BUILDER
   ═══════════════════════════════════════════════════════════ */
function buildSentenceRow(item, itemIdx, exerIdx) {
  const tokens       = tokenizeSentence(item);
  const requiredCount = tokens.filter((t) => t.type === "slot" && t.correct).length;
  const commaCount    = tokens.filter((t) => t.type === "slot" && t.correct === ",").length;

  const row = document.createElement("div");
  row.className = "pp-item";

  const num = document.createElement("span");
  num.className   = "pp-item-num";
  num.textContent = (itemIdx + 1) + ".";
  row.appendChild(num);

  const wrap = document.createElement("span");
  wrap.className         = "pp-sentence";
  wrap.dataset.exerIdx   = exerIdx;
  wrap.dataset.itemIdx   = itemIdx;
  wrap.dataset.maxSlots  = requiredCount;

  /* Build tokens into DOM */
  tokens.forEach((token) => {
    if (token.type === "word") {
      const span = document.createElement("span");
      span.className   = "pp-word";
      span.textContent = token.text;
      wrap.appendChild(span);
    } else {
      const slot = document.createElement("span");
      slot.className        = "pp-slot";
      slot.dataset.exerIdx  = exerIdx;
      slot.dataset.itemIdx  = itemIdx;
      if (token.correct) slot.dataset.correct = token.correct;

      slot.addEventListener("mousedown",  (e) => e.stopPropagation());
      slot.addEventListener("touchstart", (e) => e.stopPropagation(), { passive: true });

      /* Click: clear if filled, or place selected token */
      slot.addEventListener("click", (e) => {
        e.stopPropagation();
        if (slot.dataset.placed) {
          clearSlot(slot);
        } else if (drag.char) {
          tryPlaceInSlot(slot, drag.char, wrap);
          deselectToken();
        }
      });

      /* Re-drag from filled slot (HTML5) */
      slot.setAttribute("draggable", "false");
      slot.addEventListener("dragstart", (e) => {
        if (!slot.dataset.placed) { e.preventDefault(); return; }
        e.stopPropagation();
        drag.char       = slot.dataset.placed;
        drag.sourceSlot = slot;
        e.dataTransfer.setData("text/plain", slot.dataset.placed);
        e.dataTransfer.effectAllowed = "move";
      });
      slot.addEventListener("dragend", () => { drag.char = null; drag.sourceSlot = null; });

      /* Re-drag from filled slot (touch) */
      slot.addEventListener("touchstart", (e) => {
        if (!slot.dataset.placed) return;
        e.stopPropagation();
        e.preventDefault();
        drag.char       = slot.dataset.placed;
        drag.sourceSlot = slot;
        createGhost(slot.dataset.placed, e.touches[0]);
      }, { passive: false });

      wrap.appendChild(slot);
    }
  });

  /* ── Sentence-level drag target ── */
  wrap.addEventListener("dragover", (e) => {
    if (!drag.char) return;
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = drag.sourceSlot ? "move" : "copy";
    wrap.classList.add("pp-sentence--drag-active");
    const nearest = findNearestSlot(wrap, e.clientX);
    wrap.querySelectorAll(".pp-slot--hover").forEach((s) => s.classList.remove("pp-slot--hover"));
    if (nearest) nearest.classList.add("pp-slot--hover");
  });

  wrap.addEventListener("dragleave", (e) => {
    if (e.relatedTarget && wrap.contains(e.relatedTarget)) return;
    wrap.classList.remove("pp-sentence--drag-active");
    wrap.querySelectorAll(".pp-slot--hover").forEach((s) => s.classList.remove("pp-slot--hover"));
  });

  wrap.addEventListener("drop", (e) => {
    e.preventDefault();
    e.stopPropagation();
    wrap.classList.remove("pp-sentence--drag-active");
    wrap.querySelectorAll(".pp-slot--hover").forEach((s) => s.classList.remove("pp-slot--hover"));
    const char    = drag.char || e.dataTransfer.getData("text/plain");
    const nearest = findNearestSlot(wrap, e.clientX);
    if (!char || !nearest) return;
    if (drag.sourceSlot && drag.sourceSlot !== nearest) clearSlot(drag.sourceSlot);
    tryPlaceInSlot(nearest, char, wrap);
    drag.char       = null;
    drag.sourceSlot = null;
  });

  row.appendChild(wrap);

  /* Comma count hint (only for sentences needing commas) */
  if (commaCount > 0) {
    const hint = document.createElement("span");
    hint.className   = "pp-needs";
    hint.textContent = commaCount + " ,";
    row.appendChild(hint);
  }

  return row;
}

/* Thin wrapper so page-builders don't need to change */
function buildSentences(items, start, end, exerIdx, container) {
  for (let i = start; i < end && i < items.length; i++) {
    container.appendChild(buildSentenceRow(items[i], i, exerIdx));
  }
}

/* ═══════════════════════════════════════════════════════════
   PLACE / CLEAR
   ═══════════════════════════════════════════════════════════ */
function tryPlaceInSlot(slot, char, sentence) {
  /* Replacing content in a filled slot is always allowed */
  if (slot.dataset.placed) {
    clearSlot(slot);
    placeInSlot(slot, char);
    return;
  }
  /* Reject if sentence is at its maximum fill count */
  const maxSlots = parseInt(sentence.dataset.maxSlots || 99);
  const filled   = [...sentence.querySelectorAll(".pp-slot")].filter((s) => s.dataset.placed).length;
  if (filled >= maxSlots) return;
  placeInSlot(slot, char);
}

function placeInSlot(slot, char) {
  slot.dataset.placed = char;
  slot.textContent    = char;
  slot.classList.add("pp-slot--filled");
  slot.classList.remove("pp-slot--correct", "pp-slot--wrong", "pp-slot--hover");
  slot.setAttribute("draggable", "true");
  updateProgress(parseInt(slot.dataset.exerIdx));
}

function clearSlot(slot) {
  delete slot.dataset.placed;
  slot.textContent = "";
  slot.classList.remove("pp-slot--filled", "pp-slot--correct", "pp-slot--wrong", "pp-slot--hover");
  slot.setAttribute("draggable", "false");
  updateProgress(parseInt(slot.dataset.exerIdx));
}

/* ═══════════════════════════════════════════════════════════
   POOL TOKENS
   ═══════════════════════════════════════════════════════════ */
function buildToken(char) {
  const el = document.createElement("span");
  el.className    = "pp-token";
  el.dataset.char = char;
  el.textContent  = char;
  el.setAttribute("draggable", "true");
  el.setAttribute("title", `Drag '${char}'`);

  el.addEventListener("mousedown", (e) => e.stopPropagation());

  el.addEventListener("dragstart", (e) => {
    e.stopPropagation();
    drag.char       = char;
    drag.sourceSlot = null;
    e.dataTransfer.setData("text/plain", char);
    e.dataTransfer.effectAllowed = "copy";
    el.classList.add("pp-token--dragging");
    deselectToken();
  });
  el.addEventListener("dragend", () => el.classList.remove("pp-token--dragging"));

  el.addEventListener("click", (e) => {
    e.stopPropagation();
    if (drag.selected === el) { deselectToken(); return; }
    deselectToken();
    drag.char     = char;
    drag.selected = el;
    el.classList.add("pp-token--selected");
  });

  el.addEventListener("touchstart", (e) => {
    e.stopPropagation();
    e.preventDefault();
    drag.char       = char;
    drag.sourceSlot = null;
    deselectToken();
    createGhost(char, e.touches[0]);
  }, { passive: false });

  return el;
}

function deselectToken() {
  if (drag.selected) {
    drag.selected.classList.remove("pp-token--selected");
    drag.selected = null;
  }
  drag.char = null;
}

/* ═══════════════════════════════════════════════════════════
   TOUCH GHOST
   ═══════════════════════════════════════════════════════════ */
function createGhost(char, touch) {
  if (drag.ghost) drag.ghost.remove();
  const g = document.createElement("span");
  g.className   = "pp-drag-ghost";
  g.textContent = char;
  document.body.appendChild(g);
  drag.ghost = g;
  moveGhost(touch);
}

function moveGhost(touch) {
  if (!drag.ghost) return;
  drag.ghost.style.left = (touch.clientX - 19) + "px";
  drag.ghost.style.top  = (touch.clientY - 19) + "px";
}

/* Global touch — move ghost and highlight nearest slot */
document.addEventListener("touchmove", (e) => {
  if (!drag.ghost) return;
  e.preventDefault();
  moveGhost(e.touches[0]);

  drag.ghost.style.visibility = "hidden";
  const under    = document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY);
  drag.ghost.style.visibility = "";
  const sentence = under?.closest(".pp-sentence");

  document.querySelectorAll(".pp-sentence--drag-active").forEach((s) => {
    if (s !== sentence) {
      s.classList.remove("pp-sentence--drag-active");
      s.querySelectorAll(".pp-slot--hover").forEach((sl) => sl.classList.remove("pp-slot--hover"));
    }
  });

  if (sentence) {
    sentence.classList.add("pp-sentence--drag-active");
    const nearest = findNearestSlot(sentence, e.touches[0].clientX);
    sentence.querySelectorAll(".pp-slot--hover").forEach((s) => s.classList.remove("pp-slot--hover"));
    if (nearest) nearest.classList.add("pp-slot--hover");
  }
}, { passive: false });

/* Global touch — drop on touchend */
document.addEventListener("touchend", (e) => {
  if (!drag.ghost) return;
  const touch = e.changedTouches[0];

  drag.ghost.style.visibility = "hidden";
  const under    = document.elementFromPoint(touch.clientX, touch.clientY);
  drag.ghost.remove();
  drag.ghost = null;

  const sentence = under?.closest(".pp-sentence");
  document.querySelectorAll(".pp-sentence--drag-active").forEach((s) => {
    s.classList.remove("pp-sentence--drag-active");
    s.querySelectorAll(".pp-slot--hover").forEach((sl) => sl.classList.remove("pp-slot--hover"));
  });

  if (sentence && drag.char) {
    const nearest = findNearestSlot(sentence, touch.clientX);
    if (nearest) {
      if (drag.sourceSlot && drag.sourceSlot !== nearest) clearSlot(drag.sourceSlot);
      tryPlaceInSlot(nearest, drag.char, sentence);
    }
  }
  drag.char       = null;
  drag.sourceSlot = null;
});

/* ═══════════════════════════════════════════════════════════
   PRACTICE PAGES
   ═══════════════════════════════════════════════════════════ */
function makeExerLeftPage(idx) {
  const ex   = EXERCISES[idx];
  const half = Math.ceil(ex.items.length / 2);
  const page = makePage();

  const pc = document.createElement("div");
  pc.className = "pc pc--practice";

  pc.innerHTML = `
    <div class="pc-practice-header">
      <span class="pc-practice-label">Exercise ${idx + 1} of ${EXERCISES.length}</span>
      <strong class="pc-practice-title">${ex.title}</strong>
      <span class="pc-focus-badge">${ex.focus}</span>
    </div>`;

  const items = document.createElement("div");
  items.className = "pp-items";
  buildSentences(ex.items, 0, half, idx, items);
  pc.appendChild(items);

  page.appendChild(pc);
  return page;
}

function makeExerRightPage(idx) {
  const ex   = EXERCISES[idx];
  const half = Math.ceil(ex.items.length / 2);
  const page = makePage();

  const pc = document.createElement("div");
  pc.className = "pc pc--practice";

  const items = document.createElement("div");
  items.className = "pp-items";
  buildSentences(ex.items, half, ex.items.length, idx, items);
  pc.appendChild(items);

  /* Pool strip */
  const pool = document.createElement("div");
  pool.className = "pp-pool-strip";
  pool.innerHTML = `<span class="pp-pool-label">Drag:</span><span class="pp-pool-tokens"></span>`;
  const tokenContainer = pool.querySelector(".pp-pool-tokens");
  ex.pool.forEach((char) => tokenContainer.appendChild(buildToken(char)));
  pc.appendChild(pool);

  /* Check section */
  const check = document.createElement("div");
  check.className = "pc-check-section";
  check.innerHTML = `
    <div class="pc-progress">
      <div class="pc-progress-track"><div class="pc-progress-fill" id="ppProg-${idx}"></div></div>
      <span class="pc-progress-text" id="ppProgText-${idx}">0 / 0 placed</span>
    </div>
    <div class="pc-check-actions">
      <button class="pc-btn pc-btn--ghost" data-reset="${idx}">Reset</button>
      <button class="pc-btn pc-btn--check" data-check="${idx}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="13" height="13"><polyline points="20 6 9 17 4 12"/></svg>
        Check
      </button>
    </div>
    <div class="pc-score" id="ppScore-${idx}"></div>`;
  pc.appendChild(check);

  page.appendChild(pc);
  return page;
}

/* ═══════════════════════════════════════════════════════════
   BUILD ALL PAGES
   ═══════════════════════════════════════════════════════════ */
function buildBookPages() {
  const book  = document.getElementById("ppBook");
  book.innerHTML = "";
  const pages = [];

  pages.push(makeCoverPage());    /* 0 – front cover (hard) */
  pages.push(makeTOCLeftPage());  /* 1 – TOC */
  pages.push(makeTOCRightPage()); /* 2 – how it works */

  EXERCISES.forEach((_, i) => {
    EXPL_START[i] = pages.length;
    pages.push(makeExplLeftPage(i));
    pages.push(makeExplRightPage(i));

    EXER_START[i] = pages.length;
    pages.push(makeExerLeftPage(i));
    pages.push(makeExerRightPage(i));
  });

  pages.push(makeBackCoverPage());

  pages.forEach((p) => book.appendChild(p));

  EXERCISES.forEach((_, i) => updateProgress(i));

  bookBuilt = true;
}

/* ═══════════════════════════════════════════════════════════
   EXERCISE LOGIC
   ═══════════════════════════════════════════════════════════ */
function updateProgress(exerIdx) {
  const allSlots      = document.querySelectorAll(`.pp-slot[data-exer-idx="${exerIdx}"]`);
  const requiredSlots = document.querySelectorAll(`.pp-slot[data-correct][data-exer-idx="${exerIdx}"]`);
  const filled  = [...allSlots].filter((s) => s.dataset.placed).length;
  const total   = requiredSlots.length;
  const pct     = total ? Math.min((filled / total) * 100, 100) : 0;

  const fill = document.getElementById(`ppProg-${exerIdx}`);
  const text = document.getElementById(`ppProgText-${exerIdx}`);
  if (fill) fill.style.width = pct + "%";
  if (text) text.textContent = `${filled} / ${total} placed`;
}

function checkExercise(exerIdx) {
  const sentences = document.querySelectorAll(`.pp-sentence[data-exer-idx="${exerIdx}"]`);
  let totalRequired = 0, totalCorrect = 0;

  sentences.forEach((sentence) => {
    /* Clear previous answer reveal */
    sentence.closest(".pp-item")?.querySelector(".pp-correct-answer")?.remove();

    const allSlots      = [...sentence.querySelectorAll(".pp-slot")];
    const requiredSlots = allSlots.filter((s) => s.dataset.correct);
    let sentenceOk = true;

    allSlots.forEach((slot) => {
      slot.classList.remove("pp-slot--correct", "pp-slot--wrong");
      if (!slot.dataset.placed) return;
      const correct = slot.dataset.correct && slot.dataset.placed === slot.dataset.correct;
      slot.classList.add(correct ? "pp-slot--correct" : "pp-slot--wrong");
      if (!correct) sentenceOk = false;
    });

    /* Unfilled required slots also make the sentence wrong */
    requiredSlots.forEach((s) => { if (!s.dataset.placed) sentenceOk = false; });

    totalRequired += requiredSlots.length;
    totalCorrect  += requiredSlots.filter((s) => s.dataset.placed === s.dataset.correct).length;

    /* Show correct answer below wrong sentences */
    if (!sentenceOk) {
      const itemIdx = parseInt(sentence.dataset.itemIdx);
      const item    = EXERCISES[exerIdx].items[itemIdx];
      let ansText   = "";
      item.forEach((seg) => { ansText += typeof seg === "string" ? seg : seg.correct; });

      const ans = document.createElement("div");
      ans.className = "pp-correct-answer";
      ans.innerHTML = `<span class="pp-ca-label">Answer:</span> <em>${ansText}</em>`;
      sentence.closest(".pp-item").appendChild(ans);
    }
  });

  const pct  = totalRequired ? Math.round((totalCorrect / totalRequired) * 100) : 0;
  const tier = pct === 100 ? "perfect" : pct >= 70 ? "good" : "low";
  const scoreEl = document.getElementById(`ppScore-${exerIdx}`);
  if (scoreEl) {
    scoreEl.innerHTML = `<span class="pc-score-pill pc-score-pill--${tier}">${pct === 100 ? "✨ " : ""}${totalCorrect} / ${totalRequired} correct</span>`;
  }
}

function resetExercise(exerIdx) {
  document.querySelectorAll(`.pp-slot[data-exer-idx="${exerIdx}"]`).forEach(clearSlot);
  document.querySelectorAll(`.pp-sentence[data-exer-idx="${exerIdx}"]`).forEach((s) => {
    s.closest(".pp-item")?.querySelector(".pp-correct-answer")?.remove();
    s.classList.remove("pp-sentence--drag-active");
  });
  const scoreEl = document.getElementById(`ppScore-${exerIdx}`);
  if (scoreEl) scoreEl.innerHTML = "";
  deselectToken();
}

/* ═══════════════════════════════════════════════════════════
   STPAGEFLIP INIT
   ═══════════════════════════════════════════════════════════ */
function initPageFlip() {
  const book = document.getElementById("ppBook");
  const W    = book.offsetWidth;
  const H    = book.offsetHeight;

  pageFlip = new St.PageFlip(book, {
    width:               Math.floor(W / 2),
    height:              H,
    size:                "fixed",
    showCover:           true,
    usePortrait:         true,
    maxShadowOpacity:    0.55,
    mobileScrollSupport: false,
    clickEventForward:   false,
    swipeDistance:       9999,
  });

  pageFlip.loadFromHTML(book.querySelectorAll(".page"));
  pageFlip.on("flip",              syncUI);
  pageFlip.on("changeOrientation", syncUI);
}

function syncUI() {
  const cur   = pageFlip.getCurrentPageIndex();
  const total = pageFlip.getPageCount();
  document.getElementById("ppPageNum").textContent = `${cur + 1} / ${total}`;
  document.getElementById("ppPrev").disabled = cur === 0;
  document.getElementById("ppNext").disabled = cur >= total - 1;
}

function jumpToPage(n) {
  const book = document.getElementById("ppBook");
  book.classList.add("pp-book--jumping");
  setTimeout(() => {
    pageFlip.turnToPage(n);
    syncUI();
    requestAnimationFrame(() => book.classList.remove("pp-book--jumping"));
  }, 220);
}

/* ═══════════════════════════════════════════════════════════
   MODAL
   ═══════════════════════════════════════════════════════════ */
function openModal() {
  const modal = document.getElementById("ppModal");
  modal.hidden = false;
  document.body.style.overflow = "hidden";

  if (!bookBuilt) {
    buildBookPages();
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        initPageFlip();
        wireBookEvents();
        syncUI();
      });
    });
  }
}

function closeModal() {
  document.getElementById("ppModal").hidden = true;
  document.body.style.overflow = "";
  deselectToken();
  if (drag.ghost) { drag.ghost.remove(); drag.ghost = null; }
}

/* ═══════════════════════════════════════════════════════════
   EVENT WIRING
   ═══════════════════════════════════════════════════════════ */
function wireBookEvents() {
  document.getElementById("ppPrev").addEventListener("click", () => { pageFlip.flipPrev(); syncUI(); });
  document.getElementById("ppNext").addEventListener("click", () => { pageFlip.flipNext(); syncUI(); });

  /* Double-click to advance — skip all interactive elements */
  document.getElementById("ppBook").addEventListener("dblclick", (e) => {
    if (e.target.closest(".pp-slot, .pp-token, .pp-pool-strip, .pc-btn, .pp-sentence")) return;
    pageFlip.flipNext();
    syncUI();
  });

  /* TOC → explanation pages */
  document.getElementById("ppTocList").addEventListener("click", (e) => {
    const item = e.target.closest("[data-goto-explanation]");
    if (!item) return;
    const idx = parseInt(item.dataset.gotoExplanation, 10);
    if (EXPL_START[idx] !== undefined) jumpToPage(EXPL_START[idx]);
  });

  /* Check / Reset buttons */
  document.getElementById("ppBook").addEventListener("click", (e) => {
    const checkBtn = e.target.closest("[data-check]");
    const resetBtn = e.target.closest("[data-reset]");
    if (checkBtn) checkExercise(parseInt(checkBtn.dataset.check, 10));
    if (resetBtn) resetExercise(parseInt(resetBtn.dataset.reset, 10));
  });

  /* Keyboard */
  document.addEventListener("keydown", (e) => {
    if (document.getElementById("ppModal").hidden) return;
    if (e.key === "Escape")     closeModal();
    if (e.key === "ArrowLeft")  { pageFlip.flipPrev(); syncUI(); }
    if (e.key === "ArrowRight") { pageFlip.flipNext(); syncUI(); }
  });
}

/* ═══════════════════════════════════════════════════════════
   BOOT
   ═══════════════════════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("ppOpen").addEventListener("click",  openModal);
  document.getElementById("ppClose").addEventListener("click", closeModal);
  document.getElementById("ppModal").addEventListener("click", (e) => {
    if (e.target === e.currentTarget) closeModal();
  });

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (!pageFlip) return;
      const book = document.getElementById("ppBook");
      pageFlip.updateState({ width: Math.floor(book.offsetWidth / 2), height: book.offsetHeight });
    }, 250);
  });
});
