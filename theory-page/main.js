/* ════════════════════════════════════════
   main.js — entry point
   <script type="module" src="main.js"></script>
════════════════════════════════════════ */
import { initGeminiKey, initYTKey, clearKeysOnUnload } from './js/keys.js';
import { initTicker } from './js/ui-helpers.js';
import { initSetupForm, rebuildSlots, checkReady } from './js/setup-form.js';
import { initModal } from './js/modal.js';

initTicker();
initGeminiKey();
initYTKey();
clearKeysOnUnload();
initSetupForm();
initModal();
rebuildSlots();
checkReady();
