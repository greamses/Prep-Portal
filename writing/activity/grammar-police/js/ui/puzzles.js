// ============================================================================
// BRAIN-BREAK PUZZLE PAGES — a crossword and a rebus, placed just before the
// section divider. Self-contained: each builder returns a ready .page element
// with its own (directly-attached) interactivity.
// ============================================================================

function pageEl(innerHTML, density = null) {
  const div = document.createElement("div");
  div.className = "page";
  if (density) div.dataset.density = density;
  div.innerHTML = innerHTML;
  return div;
}

// ── Crossword ────────────────────────────────────────────────────────────────
// Sparse 5x5 grid: THEIR (1-across), THERE (1-down), RIGHT (2-down).
const CROSSWORD = {
  rows: 5,
  cols: 5,
  grid: [
    ["T", "H", "E", "I", "R"],
    ["H", "", "", "", "I"],
    ["E", "", "", "", "G"],
    ["R", "", "", "", "H"],
    ["E", "", "", "", "T"],
  ],
  numbers: { "0,0": 1, "0,4": 2 },
  across: [{ num: 1, text: "Belonging to them — “___ books” (5)" }],
  down: [
    { num: 1, text: "In that place — “over ___” (5)" },
    { num: 2, text: "Correct, not wrong (5)" },
  ],
};

function clueList(title, clues) {
  return `<div class="cw-cluecol"><h3>${title}</h3><ol>${clues
    .map((c) => `<li><strong>${c.num}.</strong> ${c.text}</li>`)
    .join("")}</ol></div>`;
}

export function makeCrosswordPage() {
  const s = CROSSWORD;
  let grid = `<div class="cw-grid" style="grid-template-columns:repeat(${s.cols},1fr)">`;
  for (let r = 0; r < s.rows; r++) {
    for (let c = 0; c < s.cols; c++) {
      const ch = s.grid[r][c];
      if (!ch) { grid += `<div class="cw-cell cw-cell--block"></div>`; continue; }
      const num = s.numbers[`${r},${c}`];
      grid += `<div class="cw-cell">${num ? `<span class="cw-num">${num}</span>` : ""}<input class="cw-input" maxlength="1" autocomplete="off" spellcheck="false" data-answer="${ch}" aria-label="row ${r + 1} column ${c + 1}"></div>`;
    }
  }
  grid += `</div>`;

  const page = pageEl(
    `<div class="pc gp-puzzle gp-c-blue">
      <span class="gp-tab gp-tab--blue">Brain Break</span>
      <header class="gp-puzzle__head"><span class="gp-kicker">Word Puzzle</span><h2>Grammar Crossword</h2></header>
      <p class="gp-puzzle__intro">Fill the grid using the confusable words you have learned, then press Check.</p>
      <div class="cw-wrap">
        ${grid}
        <div class="cw-clues">${clueList("Across", s.across)}${clueList("Down", s.down)}</div>
      </div>
      <div class="cw-actions">
        <button class="pc-btn pc-btn--ghost" data-cw-reveal>Reveal</button>
        <button class="pc-btn pc-btn--check" data-cw-check>Check</button>
      </div>
    </div>`
  );

  const root = page.querySelector(".pc");
  const inputs = () => [...root.querySelectorAll(".cw-input")];
  // Auto-advance to the next cell as you type.
  inputs().forEach((inp, i, arr) => {
    inp.addEventListener("input", () => {
      inp.value = inp.value.toUpperCase().slice(0, 1);
      inp.classList.remove("cw-input--correct", "cw-input--wrong");
      if (inp.value && arr[i + 1]) arr[i + 1].focus();
    });
  });
  root.querySelector("[data-cw-check]").addEventListener("click", () => {
    inputs().forEach((inp) => {
      if (!inp.value) { inp.classList.remove("cw-input--correct", "cw-input--wrong"); return; }
      const ok = inp.value.toUpperCase() === inp.dataset.answer.toUpperCase();
      inp.classList.toggle("cw-input--correct", ok);
      inp.classList.toggle("cw-input--wrong", !ok);
    });
  });
  root.querySelector("[data-cw-reveal]").addEventListener("click", () => {
    inputs().forEach((inp) => {
      inp.value = inp.dataset.answer;
      inp.classList.add("cw-input--correct");
      inp.classList.remove("cw-input--wrong");
    });
  });
  return page;
}

// ── Rebus riddles ────────────────────────────────────────────────────────────
const REBUS = [
  { emoji: "\u{1F41D} + \u{1F343}", answer: "BELIEVE", hint: "bee + leaf" },
  { emoji: "⭐ + \u{1F41F}", answer: "STARFISH", hint: "star + fish" },
  { emoji: "☀️ + \u{1F338}", answer: "SUNFLOWER", hint: "sun + flower" },
  { emoji: "\u{1F327}️ + \u{1F380}", answer: "RAINBOW", hint: "rain + bow" },
];

export function makeRebusPage() {
  const cards = REBUS.map(
    (it, i) => `
    <div class="rb-card">
      <div class="rb-emoji">${it.emoji}</div>
      <button class="rb-reveal" data-rb="${i}">Reveal</button>
      <div class="rb-answer" id="rb-ans-${i}" hidden><strong>${it.answer}</strong><span>${it.hint}</span></div>
    </div>`
  ).join("");

  const page = pageEl(
    `<div class="pc gp-puzzle gp-c-purple">
      <span class="gp-tab gp-tab--purple">Brain Break</span>
      <header class="gp-puzzle__head"><span class="gp-kicker">Picture Puzzle</span><h2>Rebus Riddles</h2></header>
      <p class="gp-puzzle__intro">Each picture sounds out a word. Say the pictures aloud, then tap Reveal.</p>
      <div class="rb-grid">${cards}</div>
    </div>`
  );

  const root = page.querySelector(".pc");
  root.querySelectorAll("[data-rb]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const ans = root.querySelector(`#rb-ans-${btn.dataset.rb}`);
      const reveal = ans.hasAttribute("hidden");
      ans.toggleAttribute("hidden", !reveal);
      btn.textContent = reveal ? "Hide" : "Reveal";
    });
  });
  return page;
}
