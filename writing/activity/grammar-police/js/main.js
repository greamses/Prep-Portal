import { state } from "./utils/state.js";
import { PASSAGES } from "./data/grammarData.js";
import { PP_EXERCISES } from "./data/punctuationData.js";
import { playFlipSound, playPanSound, initAudio } from "./utils/audio.js";
import { updateProgress, checkPassage, resetPassage } from "./ui/grammar.js";
import {
  updatePPProgress,
  checkExercise,
  resetExercise,
  deselectToken,
} from "./ui/punctuation.js";
import {
  makeCoverPage,
  makeTOCLeftPage,
  makeTOCRightPage,
  makeExplanationLeftPage,
  makeExplanationRightPage,
  makePassageLeftPage,
  makePassageRightPage,
  makeChapterDividerLeft,
  makeChapterDividerRight,
  makePPExplLeftPage,
  makePPExplRightPage,
  makeExerLeftPage,
  makeExerRightPage,
  makeBackCoverPage,
} from "./ui/pages.js";

const MOBILE_BREAK = 768;

function isMobileView() {
  return window.innerWidth < MOBILE_BREAK;
}

/* Pan the book to center one page at a time on mobile.
   The book overflows the stage naturally; we shift it ±25% of its
   own width so the active page lands at the viewport centre.
   Even pages (0, 2, 4 …) are on the right half → shift left 25%.
   Odd pages (1, 3, 5 …) are on the left half → shift right 25%. */
function mobilePanToPage(page, animate) {
  const book = document.getElementById("gpBook");
  const showRight = page === 0 || page % 2 === 0;
  const tx = showRight ? "-25%" : "25%";

  if (!animate) {
    book.style.transition = "none";
    book.style.transform = `translateX(${tx})`;
    requestAnimationFrame(() =>
      requestAnimationFrame(() => (book.style.transition = ""))
    );
  } else {
    book.style.transform = `translateX(${tx})`;
  }
}

/* On mobile: apply the pan offset so the active page is centred.
   On desktop: clear any transform and let the book sit naturally. */
function setupMobileClip() {
  const book = document.getElementById("gpBook");

  if (isMobileView()) {
    mobilePanToPage(state.mobileCurrentPage, false);
  } else {
    book.style.transition = "none";
    book.style.transform = "";
    requestAnimationFrame(() =>
      requestAnimationFrame(() => (book.style.transition = ""))
    );
  }
}

/* Unified next-page handler — pan on small screens, flip on desktop. */
function handleNext() {
  if (!state.pageFlip) return;
  const total = state.pageFlip.getPageCount();

  if (isMobileView()) {
    if (state.mobileCurrentPage >= total - 1) return;

    if (state.mobileCurrentPage % 2 === 0) {
      /* even page → we're on the right side → flip to next spread */
      state.mobileCurrentPage++;
      state.mobileFlipping = true;
      state.pageFlip.flipNext();
    } else {
      /* odd page → we're on the left side → pan to right page */
      state.mobileCurrentPage++;
      mobilePanToPage(state.mobileCurrentPage, true);
      playPanSound();
      syncUI();
    }
  } else {
    state.pageFlip.flipNext();
  }
}

/* Unified prev-page handler. */
function handlePrev() {
  if (!state.pageFlip) return;

  if (isMobileView()) {
    if (state.mobileCurrentPage <= 0) return;

    if (state.mobileCurrentPage % 2 === 1) {
      /* odd page → we're on the left side → flip back to previous spread */
      state.mobileCurrentPage--;
      state.mobileFlipping = true;
      state.pageFlip.flipPrev();
    } else {
      /* even page → we're on the right side → pan back to left page */
      state.mobileCurrentPage--;
      mobilePanToPage(state.mobileCurrentPage, true);
      playPanSound();
      syncUI();
    }
  } else {
    state.pageFlip.flipPrev();
  }
}

function buildBookPages() {
  const book = document.getElementById("gpBook");
  book.innerHTML = "";
  const pages = [];

  pages.push(makeCoverPage());
  pages.push(makeTOCLeftPage());
  pages.push(makeTOCRightPage());

  PASSAGES.forEach((_, i) => {
    state.EXPLANATION_START_PAGE[i] = pages.length;
    pages.push(makeExplanationLeftPage(i));
    pages.push(makeExplanationRightPage(i));
    state.PASSAGE_START_PAGE[i] = pages.length;
    pages.push(makePassageLeftPage(i));
    pages.push(makePassageRightPage(i));
  });

  pages.push(makeChapterDividerLeft());
  pages.push(makeChapterDividerRight());

  PP_EXERCISES.forEach((_, i) => {
    state.PP_EXPL_START[i] = pages.length;
    pages.push(makePPExplLeftPage(i));
    pages.push(makePPExplRightPage(i));
    state.PP_EXER_START[i] = pages.length;
    pages.push(makeExerLeftPage(i));
    pages.push(makeExerRightPage(i));
  });

  pages.push(makeBackCoverPage());
  pages.forEach((p) => book.appendChild(p));

  PASSAGES.forEach((_, i) => updateProgress(i));
  PP_EXERCISES.forEach((_, i) => updatePPProgress(i));

  state.bookBuilt = true;
}

function initPageFlip() {
  const book = document.getElementById("gpBook");
  const W = book.offsetWidth;
  const H = book.offsetHeight;

  state.pageFlip = new St.PageFlip(book, {
    width: Math.floor(W / 2),
    height: H,
    size: "fixed",
    showCover: true,
    maxShadowOpacity: 0.55,
    mobileScrollSupport: false,
    clickEventForward: false,
    swipeDistance: 9999,
  });

  state.pageFlip.loadFromHTML(book.querySelectorAll(".page"));

  state.pageFlip.on("flip", () => {
    playFlipSound();
    if (isMobileView() && state.mobileFlipping) {
      state.mobileFlipping = false;
      mobilePanToPage(state.mobileCurrentPage, false);
    }
    syncUI();
  });

  state.pageFlip.on("changeOrientation", syncUI);
}

function syncUI() {
  const total = state.pageFlip.getPageCount();

  if (isMobileView()) {
    const cur = state.mobileCurrentPage;
    document.getElementById("gpPageNum").textContent = `${cur + 1} / ${total}`;
    document.getElementById("gpPrev").disabled = cur === 0;
    document.getElementById("gpNext").disabled = cur >= total - 1;
  } else {
    const cur = state.pageFlip.getCurrentPageIndex();
    document.getElementById("gpPageNum").textContent = `${cur + 1} / ${total}`;
    document.getElementById("gpPrev").disabled = cur === 0;
    document.getElementById("gpNext").disabled = cur >= total - 1;
  }
}

function jumpToPage(targetPage) {
  const book = document.getElementById("gpBook");
  book.classList.add("gp-book--jumping");
  setTimeout(() => {
    state.pageFlip.turnToPage(targetPage);
    if (isMobileView()) {
      state.mobileCurrentPage = targetPage;
      mobilePanToPage(targetPage, false);
    }
    syncUI();
    requestAnimationFrame(() => book.classList.remove("gp-book--jumping"));
  }, 220);
}

function openModal() {
  const modal = document.getElementById("gpModal");
  modal.hidden = false;
  document.body.style.overflow = "hidden";
  initAudio();
  if (!state.bookBuilt) {
    buildBookPages();
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        initPageFlip();
        wireBookEvents();
        setupMobileClip();
        syncUI();
      });
    });
  } else {
    setupMobileClip();
    syncUI();
  }
}

function closeModal() {
  document.getElementById("gpModal").hidden = true;
  document.body.style.overflow = "";
  deselectToken();
  if (state.drag.ghost) {
    state.drag.ghost.remove();
    state.drag.ghost = null;
  }
}

function wireBookEvents() {
  document.getElementById("gpPrev").addEventListener("click", handlePrev);
  document.getElementById("gpNext").addEventListener("click", handleNext);

  document.getElementById("pcTocList").addEventListener("click", (e) => {
    const gpItem = e.target.closest("[data-goto-explanation]");
    if (gpItem) {
      const idx = parseInt(gpItem.dataset.gotoExplanation, 10);
      const page = state.EXPLANATION_START_PAGE[idx];
      if (page !== undefined) jumpToPage(page);
      return;
    }
    const ppItem = e.target.closest("[data-goto-pp-explanation]");
    if (ppItem) {
      const idx = parseInt(ppItem.dataset.gotoPpExplanation, 10);
      const page = state.PP_EXPL_START[idx];
      if (page !== undefined) jumpToPage(page);
    }
  });

  document.getElementById("gpBook").addEventListener("click", (e) => {
    const gpCheck = e.target.closest("[data-gp-check]");
    const gpReset = e.target.closest("[data-gp-reset]");
    const ppCheck = e.target.closest("[data-pp-check]");
    const ppReset = e.target.closest("[data-pp-reset]");
    if (gpCheck) checkPassage(parseInt(gpCheck.dataset.gpCheck, 10));
    if (gpReset) resetPassage(parseInt(gpReset.dataset.gpReset, 10));
    if (ppCheck) checkExercise(parseInt(ppCheck.dataset.ppCheck, 10));
    if (ppReset) resetExercise(parseInt(ppReset.dataset.ppReset, 10));
  });

  document.addEventListener("keydown", (e) => {
    if (document.getElementById("gpModal").hidden) return;
    if (e.key === "Escape")     closeModal();
    if (e.key === "ArrowLeft")  handlePrev();
    if (e.key === "ArrowRight") handleNext();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("gpOpen").addEventListener("click", openModal);
  document.getElementById("gpClose").addEventListener("click", closeModal);
  document.getElementById("gpModal").addEventListener("click", (e) => {
    if (e.target === e.currentTarget) closeModal();
  });

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (!state.pageFlip) return;
      const book = document.getElementById("gpBook");
      state.pageFlip.updateState({
        width: Math.floor(book.offsetWidth / 2),
        height: book.offsetHeight,
      });
      setupMobileClip();
    }, 250);
  });
});
