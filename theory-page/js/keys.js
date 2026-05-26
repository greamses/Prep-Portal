// keys.js — API keys are now supplied by the backend.
// User key input has been removed. This module auto-marks keys as ready
// so all dependent modules (setup-form, analyser, video) continue working.
import { state } from '../state.js';
import { checkReady } from './setup-form.js';

function markReady() {
  state.KEY_VERIFIED = true;
  state.YT_KEY_VERIFIED = true;

  window.PrepPortalKeys = { gemini: 'backend', youtube: 'backend', ready: true };
  window.dispatchEvent(
    new CustomEvent('prepportal:keysReady', { detail: window.PrepPortalKeys })
  );

  checkReady();
}

// No-op stubs — preserve export shape so importers don't break
export function setGeminiKeyRaw() {}
export function setYTKeyRaw() {}
export async function initGeminiKey() { markReady(); }
export async function initYTKey() {}
export function clearKeysOnUnload() {}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', markReady);
} else {
  markReady();
}
