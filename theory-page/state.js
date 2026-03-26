/* ════════════════════════════════════════
   state.js
   Single source of truth for all mutable
   runtime state. Exported as one object so
   mutations are visible to all importers.
════════════════════════════════════════ */

export const state = {
  /* API keys */
  GEMINI_KEY   : '',
  KEY_VERIFIED : false,
  YT_KEY       : '',
  YT_KEY_VERIFIED: false,

  /* Setup form */
  st: {
    name      : '',
    cls       : '',
    level     : '',
    subjectKey: '',
    track     : '',
    subject   : '',
    count     : 1,
  },

  /* Modal */
  submissionDate: '',
};
