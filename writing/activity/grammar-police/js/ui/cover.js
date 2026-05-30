// ============================================================================
// COVER COMPONENT - the front cover, section divider, and back cover all share
// ONE look: a white field, a wavy gradient across the lower third (with a dotted
// outline), the Prep Portal logo top-left, and a rounded spine wrapping the left
// edge. Only the colour shade changes per face.
//
// Everything sizes in container-query units (see cover.css) so the SAME markup
// renders full-size in the flipbook AND shrunk on the bookshelf.
// ============================================================================

const LOGO = "/icon.svg";

// Colour shades per face. `outline` is the dotted wave-crest stroke.
const VARIANTS = {
  blue:   { id: "gpWaveBlue",   top: "#1e50d6", bottom: "#050d33", outline: "#0a1f5c" },
  teal:   { id: "gpWaveTeal",   top: "#14b8a6", bottom: "#042f2e", outline: "#06403a" },
  purple: { id: "gpWavePurple", top: "#8b5cf6", bottom: "#1e0a4d", outline: "#2e1065" },
};

// The wavy crest path (open) — reused for the fill and the dotted outline.
const WAVE_CREST = "M0,96 C100,28 180,28 240,80 C300,132 340,132 400,76";

function coverInner(variant = "blue") {
  const g = VARIANTS[variant] || VARIANTS.blue;
  return `
    <div class="gp-cover__spine" aria-hidden="true"></div>
    <img class="gp-cover__logo-tl" src="${LOGO}" alt="Prep Portal logo">
    <div class="gp-cover__wave" aria-hidden="true">
      <svg viewBox="0 0 400 260" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="${g.id}" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="${g.top}"/>
            <stop offset="1" stop-color="${g.bottom}"/>
          </linearGradient>
        </defs>
        <path d="${WAVE_CREST} L400,260 L0,260 Z" fill="url(#${g.id})"/>
        <path d="${WAVE_CREST}" fill="none" stroke="${g.outline}" stroke-width="2.5"
              stroke-dasharray="7 5" stroke-linecap="round" vector-effect="non-scaling-stroke"/>
      </svg>
    </div>`;
}

export function frontCoverInner(book = {}) {
  void book;
  return coverInner("blue");
}

export function dividerInner() {
  return coverInner("teal");
}

export function backCoverInner(book = {}) {
  void book;
  return coverInner("purple");
}
