import { PASSAGES, EXPLANATIONS, WORD_GROUPS } from "../data/grammarData.js";
import { PP_EXPLANATIONS, PP_EXERCISES } from "../data/punctuationData.js";
import { renderParas } from "./grammar.js";
import { buildSentences, buildToken } from "./punctuation.js";

export function makePage(extraClass, density) {
  const div = document.createElement("div");
  div.className = `page${extraClass ? " " + extraClass : ""}`;
  if (density) div.dataset.density = density;
  return div;
}

export function coverPattern() {
  return `<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <pattern id="diag" width="20" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2="20" stroke="rgba(255,255,255,0.05)" stroke-width="6"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#diag)"/>
  </svg>`;
}

export function makeCoverPage() {
  const page = makePage("", "hard");
  page.innerHTML = `
    <div class="pc pc--cover">
      <div class="pc-cover-bg" aria-hidden="true">
        ${coverPattern()}
      </div>
      <div class="pc-cover-content">
        <div class="pc-cover-badge" aria-hidden="true">
          <svg viewBox="0 0 64 64" fill="none" width="64" height="64">
            <path d="M32 4L6 17V38C6 51 17 62 32 64C47 62 58 51 58 38V17L32 4Z"
                  fill="rgba(255,229,0,0.18)" stroke="#ffe500" stroke-width="2.5"/>
            <path d="M22 33L29 40L42 26" stroke="#ffe500" stroke-width="3.5"
                  stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <h1 class="pc-cover-title">Grammar<br>Police</h1>
        <p class="pc-cover-pp-sub">+ Punctuation Patrol</p>
        <p class="pc-cover-sub">English · Prep Portal</p>
        <div class="pc-cover-divider"></div>
        <ul class="pc-cover-chips" aria-label="Activity details">
          <li>3 Passages</li>
          <li>3 Exercises</li>
          <li>60+ Blanks</li>
          <li>Drag &amp; Drop</li>
        </ul>
        <p class="pc-cover-hint">Open to start &rarr;</p>
      </div>
      <div class="pc-cover-footer">prepportal.com</div>
    </div>`;
  return page;
}

export function makeTOCLeftPage() {
  const page = makePage();
  page.innerHTML = `
    <div class="pc pc--toc">
      <div class="pc-header">Table of Contents</div>
      <ul class="pc-toc-list" id="pcTocList">
        <li class="pc-toc-section-header">
          <span class="pc-toc-section-label">Grammar Police</span>
        </li>
        ${PASSAGES.map(
          (p, i) => `
          <li class="pc-toc-item" data-goto-explanation="${i}">
            <span class="pc-toc-num">0${i + 1}</span>
            <span class="pc-toc-info">
              <strong class="pc-toc-title">${p.title}</strong>
              <span class="pc-toc-focus">${p.focus}</span>
              <span class="pc-toc-badge">Learn + Practise</span>
            </span>
            <span class="pc-toc-arrow">&rarr;</span>
          </li>`,
        ).join("")}
        <li class="pc-toc-section-header">
          <span class="pc-toc-section-label">Punctuation Patrol</span>
        </li>
        ${PP_EXERCISES.map(
          (ex, i) => `
          <li class="pc-toc-item" data-goto-pp-explanation="${i}">
            <span class="pc-toc-num">0${i + 4}</span>
            <span class="pc-toc-info">
              <strong class="pc-toc-title">${ex.title}</strong>
              <span class="pc-toc-focus">${ex.focus}</span>
              <span class="pc-toc-badge">Learn + Practise</span>
            </span>
            <span class="pc-toc-arrow">&rarr;</span>
          </li>`,
        ).join("")}
      </ul>
      <p class="pc-toc-tip">Click a title to go straight to that lesson.</p>
    </div>`;
  return page;
}

export function makeTOCRightPage() {
  const page = makePage();
  page.innerHTML = `
    <div class="pc pc--ref">
      <div class="pc-header">How This Book Works</div>
      <div class="pc-howto">
        <div class="pc-howto-step">
          <span class="pc-howto-num">1</span>
          <div>
            <strong>Read the lesson</strong>
            <p>Each chapter opens with a friendly explanation of the words or punctuation marks and when to use them.</p>
          </div>
        </div>
        <div class="pc-howto-step">
          <span class="pc-howto-num">2</span>
          <div>
            <strong>Try the trick</strong>
            <p>Use the Detective's Trick to decide which word or mark fits — before flipping to the activity.</p>
          </div>
        </div>
        <div class="pc-howto-step">
          <span class="pc-howto-num">3</span>
          <div>
            <strong>Do the activity</strong>
            <p>Grammar chapters: choose from the dropdown. Punctuation chapters: drag a mark from the yellow strip or tap to select then tap a position in the sentence.</p>
          </div>
        </div>
        <div class="pc-howto-step">
          <span class="pc-howto-num">4</span>
          <div>
            <strong>Check &amp; learn</strong>
            <p>Press <em>Check</em> to see your score instantly. Review the lesson and try again!</p>
          </div>
        </div>
      </div>
      <p class="pc-ref-foot">Word groups: ${Object.values(WORD_GROUPS)
        .map((g) => g.label)
        .join(" · ")}</p>
    </div>`;
  return page;
}

export function makeExplanationLeftPage(idx) {
  const exp = EXPLANATIONS[idx];
  const page = makePage();
  page.innerHTML = `
    <div class="pc pc--explanation pc--explanation-left">
      <div class="pc-exp-header">
        <span class="pc-exp-case">Case File #0${idx + 1}</span>
        <span class="pc-exp-focus">${exp.focus}</span>
      </div>
      <div class="pc-exp-body">
        ${exp.leftHTML}
      </div>
    </div>`;
  return page;
}

export function makeExplanationRightPage(idx) {
  const exp = EXPLANATIONS[idx];
  const page = makePage();
  page.innerHTML = `
    <div class="pc pc--explanation pc--explanation-right">
      <div class="pc-exp-header pc-exp-header--right">
        <span class="pc-exp-subtitle">${exp.title}</span>
        <span class="pc-exp-badge">Lesson</span>
      </div>
      <div class="pc-exp-body">
        ${exp.rightHTML}
      </div>
      <div class="pc-exp-cta">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><polyline points="9 18 15 12 9 6"/></svg>
        Flip to practise &rarr;
      </div>
    </div>`;
  return page;
}

export function makePassageLeftPage(passageIdx) {
  const passage = PASSAGES[passageIdx];
  const page = makePage();
  page.dataset.passage = passageIdx;

  const pc = document.createElement("div");
  pc.className = "pc pc--passage";
  pc.innerHTML = `
    <div class="pc-passage-header">
      <span class="pc-passage-label">Passage ${passageIdx + 1} of ${PASSAGES.length}</span>
      <strong class="pc-passage-title">${passage.title}</strong>
      <span class="pc-focus-badge">${passage.focus}</span>
    </div>`;

  const body = document.createElement("div");
  body.className = "pc-passage-body";
  renderParas(passage.paragraphs.slice(0, 2), passageIdx, body);
  pc.appendChild(body);
  page.appendChild(pc);
  return page;
}

export function makePassageRightPage(passageIdx) {
  const passage = PASSAGES[passageIdx];
  const page = makePage();
  page.dataset.passage = passageIdx;

  const pc = document.createElement("div");
  pc.className = "pc pc--passage pc--passage-right";

  const body = document.createElement("div");
  body.className = "pc-passage-body";
  renderParas(passage.paragraphs.slice(2), passageIdx, body);
  pc.appendChild(body);

  const check = document.createElement("div");
  check.className = "pc-check-section";
  check.innerHTML = `
    <div class="pc-progress">
      <div class="pc-progress-track"><div class="pc-progress-fill" id="prog-${passageIdx}"></div></div>
      <span class="pc-progress-text" id="prog-text-${passageIdx}">0 / 0 filled</span>
    </div>
    <div class="pc-check-actions">
      <button class="pc-btn pc-btn--ghost" data-gp-reset="${passageIdx}">Reset</button>
      <button class="pc-btn pc-btn--check" data-gp-check="${passageIdx}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="13" height="13"><polyline points="20 6 9 17 4 12"/></svg>
        Check
      </button>
    </div>
    <div class="pc-score" id="score-${passageIdx}"></div>`;
  pc.appendChild(check);
  page.appendChild(pc);
  return page;
}

export function makeChapterDividerLeft() {
  const page = makePage();
  page.innerHTML = `
    <div class="pc pc--divider pc--divider-left">
      <div class="pc-div-stamp">Grammar Police</div>
      <div class="pc-div-check">
        <svg viewBox="0 0 40 40" fill="none" width="40" height="40">
          <circle cx="20" cy="20" r="18" fill="#1a7f37" stroke="#0a0a0a" stroke-width="2"/>
          <polyline points="11,20 17,27 29,13" stroke="#fff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <p>Section Complete</p>
      </div>
      <div class="pc-div-recap">
        <p class="pc-div-recap-label">Confusables covered</p>
        <div class="pc-div-tags">
          <span>they're · their · there</span>
          <span>we're · were · where</span>
          <span>you're · your · it's · its</span>
        </div>
      </div>
      <p class="pc-div-turn">Turn the page to continue &rarr;</p>
    </div>`;
  return page;
}

export function makeChapterDividerRight() {
  const page = makePage();
  page.innerHTML = `
    <div class="pc pc--divider pc--divider-right">
      <div class="pc-div-badge" aria-hidden="true">
        <svg viewBox="0 0 64 64" fill="none" width="64" height="64">
          <path d="M32 4L6 17V38C6 51 17 62 32 64C47 62 58 51 58 38V17L32 4Z"
                fill="rgba(255,229,0,0.18)" stroke="#ffe500" stroke-width="2.5"/>
          <text x="32" y="46" text-anchor="middle" font-size="30" font-family="serif"
                fill="#ffe500" font-weight="900">?</text>
        </svg>
      </div>
      <h2 class="pc-div-chapter-title">Punctuation<br>Patrol</h2>
      <p class="pc-div-chapter-sub">English · Prep Portal</p>
      <ul class="pc-div-chapter-list">
        <li>Question marks &amp; Full stops</li>
        <li>Commas in lists &amp; phrases</li>
        <li>Mixed punctuation</li>
      </ul>
      <p class="pc-div-method">Drag punctuation marks into sentences</p>
    </div>`;
  return page;
}

export function makePPExplLeftPage(idx) {
  const exp = PP_EXPLANATIONS[idx];
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

export function makePPExplRightPage(idx) {
  const exp = PP_EXPLANATIONS[idx];
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

export function makeExerLeftPage(idx) {
  const ex = PP_EXERCISES[idx];
  const half = Math.ceil(ex.items.length / 2);
  const page = makePage();

  const pc = document.createElement("div");
  pc.className = "pc pc--practice";
  pc.innerHTML = `
    <div class="pc-practice-header">
      <span class="pc-practice-label">Exercise ${idx + 1} of ${PP_EXERCISES.length}</span>
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

export function makeExerRightPage(idx) {
  const ex = PP_EXERCISES[idx];
  const half = Math.ceil(ex.items.length / 2);
  const page = makePage();

  const pc = document.createElement("div");
  pc.className = "pc pc--practice";

  const items = document.createElement("div");
  items.className = "pp-items";
  buildSentences(ex.items, half, ex.items.length, idx, items);
  pc.appendChild(items);

  const pool = document.createElement("div");
  pool.className = "pp-pool-strip";
  pool.innerHTML = `<span class="pp-pool-label">Drag:</span><span class="pp-pool-tokens"></span>`;
  const tokenContainer = pool.querySelector(".pp-pool-tokens");
  ex.pool.forEach((char) => tokenContainer.appendChild(buildToken(char)));
  pc.appendChild(pool);

  const check = document.createElement("div");
  check.className = "pc-check-section";
  check.innerHTML = `
    <div class="pc-progress">
      <div class="pc-progress-track"><div class="pc-progress-fill" id="ppProg-${idx}"></div></div>
      <span class="pc-progress-text" id="ppProgText-${idx}">0 / 0 placed</span>
    </div>
    <div class="pc-check-actions">
      <button class="pc-btn pc-btn--ghost" data-pp-reset="${idx}">Reset</button>
      <button class="pc-btn pc-btn--check" data-pp-check="${idx}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="13" height="13"><polyline points="20 6 9 17 4 12"/></svg>
        Check
      </button>
    </div>
    <div class="pc-score" id="ppScore-${idx}"></div>`;
  pc.appendChild(check);

  page.appendChild(pc);
  return page;
}

export function makeBackCoverPage() {
  const page = makePage("", "hard");
  page.innerHTML = `
    <div class="pc pc--back-cover">
      <div class="pc-back-inner">
        <svg viewBox="0 0 60 60" fill="none" width="52" height="52" aria-hidden="true">
          <path d="M30 56L6 42V18L30 4L54 18V42L30 56Z" fill="#ffe500" stroke="#0a0a0a" stroke-width="3"/>
          <text x="30" y="37" text-anchor="middle" font-size="22" font-family="sans-serif"
                fill="#0a0a0a" font-weight="900">P</text>
        </svg>
        <p class="pc-back-msg">Keep practising.<br>Words matter.</p>
        <p class="pc-back-site">prepportal.com</p>
      </div>
    </div>`;
  return page;
}
