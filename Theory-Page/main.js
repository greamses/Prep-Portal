/* ════════════════════════════════════════
   main.js — entry point
   <script type="module" src="main.js"></script>
════════════════════════════════════════ */
import { initGeminiKey, initYTKey, clearKeysOnUnload } from './keys.js';
import { initTicker } from './ui-helpers.js';
import { initSetupForm, rebuildSlots, checkReady } from './setup-form.js';
import { initModal } from './modal.js';

initTicker();
initGeminiKey();
initYTKey();
clearKeysOnUnload();
initSetupForm();
initModal();
rebuildSlots();
checkReady();
