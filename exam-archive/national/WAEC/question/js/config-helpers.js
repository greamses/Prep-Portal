/* ═══════════════════════════════════════════════════════════
   PREP PORTAL — WASSCE Practice Paper
   MODULE 1: Configuration & Utility Helpers
   ═══════════════════════════════════════════════════════════ */

'use strict';

// ── CONFIG ─────────────────────────────────────────────────────
const GEMINI_MODELS = ['gemini-2.5-flash-lite', 'gemini-2.0-flash', 'gemini-1.5-flash'];

const urlParams = new URLSearchParams(window.location.search);
const PAGE_CONFIG = {
    year:     urlParams.get('year'),
    subjects: urlParams.get('subjects')?.split(',') || [],
    types:    urlParams.get('types')?.split(',')    || []
};

// ── HELPERS ────────────────────────────────────────────────────
function esc(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g,'&amp;')
        .replace(/</g,'&lt;')
        .replace(/>/g,'&gt;');
}

function geminiKey() {
    return window.PrepPortalKeys?.gemini || window.state?.GEMINI_KEY || null;
}

function ytKey() {
    return window.PrepPortalKeys?.youtube || window.state?.YT_KEY || null;
}

function typesetEl(el) {
    if (!el || typeof MathJax === 'undefined' || !MathJax.typesetPromise) return Promise.resolve();
    MathJax.typesetClear([el]);
    return MathJax.typesetPromise([el]).catch(() => {});
}

function injectScript(src) {
    return new Promise((res, rej) => {
        const s = document.createElement('script');
        s.src = src; s.onload = res; s.onerror = rej;
        document.head.appendChild(s);
    });
}