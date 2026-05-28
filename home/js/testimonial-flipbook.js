/* =========================================
   MAGAZINE FLIPBOOK
   Reads PDF URL from Firestore (config/magazine).
   Run /home/generate-magazine.html once to produce
   and upload the PDF, then this loads it instantly.
========================================= */
import { db } from '/firebase-init.js';
import { doc, getDoc } from 'firebase/firestore';

export async function initTestimonialFlipbook({ containerId }) {
  const $c = jQuery('#' + containerId);
  if (!$c.length) return;

  const PLACEHOLDER =
    '<div style="display:flex;align-items:center;justify-content:center;' +
    'height:420px;font-family:monospace;font-size:11px;letter-spacing:.1em;' +
    'color:#888;text-transform:uppercase;">{MSG}</div>';

  $c.html(PLACEHOLDER.replace('{MSG}', 'Loading magazine&hellip;'));

  try {
    const snap = await getDoc(doc(db, 'config', 'magazine'));

    if (!snap.exists() || !snap.data().pdfUrl) {
      $c.html(PLACEHOLDER.replace('{MSG}',
        'Magazine not yet generated — open /home/generate-magazine.html'));
      return;
    }

    const { pdfUrl } = snap.data();

    jQuery(document).ready(() => {
      $c.empty();
      $c.flipBook(pdfUrl, {
        webgl: true,
        height: window.innerHeight,
        duration: 800,
        backgroundColor: 'transparent',
        moreControls: 'pageMode,sound',
        hideControls: 'download,share',
      });
    });
  } catch (err) {
    console.error('[flipbook]', err);
    $c.html(PLACEHOLDER.replace('{MSG}', 'Could not load magazine'));
  }
}
