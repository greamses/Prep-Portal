import { WORD_GROUPS } from "../data/grammarData.js";

export function updateProgress(passageIdx) {
  const blanks = document.querySelectorAll(
    `.gp-blank[data-passage="${passageIdx}"]`,
  );
  const filled = [...blanks].filter((b) => b.value !== "").length;
  const total = blanks.length;
  const pct = total ? (filled / total) * 100 : 0;

  const fill = document.getElementById(`prog-${passageIdx}`);
  const text = document.getElementById(`prog-text-${passageIdx}`);
  if (fill) fill.style.width = pct + "%";
  if (text) text.textContent = `${filled} / ${total} filled`;
}

export function buildBlank(seg, passageIdx) {
  const group = WORD_GROUPS[seg.group];
  const select = document.createElement("select");
  select.className = `gp-blank gp-blank--${seg.group}`;
  select.dataset.correct = seg.correct.toLowerCase();
  select.dataset.passage = passageIdx;
  select.setAttribute("aria-label", `select: ${group.label}`);

  select.addEventListener("mousedown", (e) => e.stopPropagation());
  select.addEventListener("touchstart", (e) => e.stopPropagation(), {
    passive: true,
  });

  const ph = document.createElement("option");
  ph.value = "";
  ph.textContent = "pick…";
  ph.disabled = true;
  ph.selected = true;
  select.appendChild(ph);

  [...group.options]
    .sort(() => Math.random() - 0.5)
    .forEach((opt) => {
      const o = document.createElement("option");
      o.value = opt.toLowerCase();
      o.textContent = opt;
      select.appendChild(o);
    });

  select.addEventListener("change", () => updateProgress(passageIdx));
  return select;
}

export function renderParas(paraArray, passageIdx, container) {
  paraArray.forEach((para) => {
    const p = document.createElement("p");
    p.className = "book-para";
    para.forEach((seg) => {
      if (typeof seg === "string") {
        p.appendChild(document.createTextNode(seg));
      } else {
        p.appendChild(buildBlank(seg, passageIdx));
      }
    });
    container.appendChild(p);
  });
}

export function checkPassage(passageIdx) {
  const blanks = document.querySelectorAll(
    `.gp-blank[data-passage="${passageIdx}"]`,
  );
  let correct = 0,
    answered = 0;

  blanks.forEach((sel) => {
    sel.classList.remove(
      "gp-blank--correct",
      "gp-blank--wrong",
      "gp-blank--unfilled",
    );
    if (!sel.value) {
      sel.classList.add("gp-blank--unfilled");
      return;
    }
    answered++;
    const ok = sel.value === sel.dataset.correct;
    sel.classList.add(ok ? "gp-blank--correct" : "gp-blank--wrong");
    if (ok) correct++;
  });

  setTimeout(() => {
    document
      .querySelectorAll(".gp-blank--unfilled")
      .forEach((b) => b.classList.remove("gp-blank--unfilled"));
  }, 800);

  const pct = answered ? Math.round((correct / answered) * 100) : 0;
  const tier = pct === 100 ? "perfect" : pct >= 70 ? "good" : "low";
  const scoreEl = document.getElementById(`score-${passageIdx}`);
  if (scoreEl) {
    scoreEl.innerHTML = `<span class="pc-score-pill pc-score-pill--${tier}">${pct === 100 ? "✨ " : ""}${correct} / ${answered} correct</span>`;
  }
}

export function resetPassage(passageIdx) {
  document
    .querySelectorAll(`.gp-blank[data-passage="${passageIdx}"]`)
    .forEach((sel) => {
      sel.selectedIndex = 0;
      sel.classList.remove(
        "gp-blank--correct",
        "gp-blank--wrong",
        "gp-blank--unfilled",
      );
    });
  const scoreEl = document.getElementById(`score-${passageIdx}`);
  if (scoreEl) scoreEl.innerHTML = "";
  updateProgress(passageIdx);
}
