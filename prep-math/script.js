/**
 * Prep Portal 2026 — Algebra Lab
 * Main entry point. Imports from modules/, wires GM canvas, manages app state.
 */

import { TOPICS_BY_CLASS, getTopicType }        from './modules/topics.js';
import { generateOffline }                       from './modules/generator.js';
import { generateWithGemini }                    from './modules/gemini.js';
import { ppAlert, showStatus, renderTopicChips,
         initCustomDropdown, initMethodSelector } from './modules/ui.js';

// ─── App State ────────────────────────────────────────────────

const appState = {
    classId:       null,
    topic:         null,
    method:        'transfer',
    solvedCount:   0,
    currentGoal:   null,
    currentType:   null,   // 'equation' | 'expression' | 'word'
    gmCanvas:      null,
    isGMLoaded:    false,
    geminiKey:     null,
    layoutManager: null,
};

// ─── GM Canvas Settings ───────────────────────────────────────

const CANVAS_SETTINGS = {
    auto_resize_on_scroll: false,
    use_toolbar:     true,
    undo_btn:        true,
    redo_btn:        true,
    new_sheet_btn:   false,
    font_size_btns:  true,
    formula_btn:     true,
    help_btn:        false,
    help_logo_btn:   false,
    fullscreen_toolbar_btn: false,
    fullscreen_btn:  false,
    transform_btn:   false,
    keypad_btn:      false,
    scrub_btn:       false,
    draw_btn:        false,
    erase_btn:       false,
    arrange_btn:     false,
    reset_btn:       true,
    save_btn:        false,
    load_btn:        false,
    settings_btn:    true,
    insert_btn:      true,
    insert_menu_items: { derivation: true, function: true, textbox: true },
    use_hold_menu:   false,
    display_labels:  false,
    btn_size:        'xs',
    ask_confirmation_on_closing: false,
    vertical_scroll: true,
};

const DERIVATION_SETTINGS = {
    h_align: 'center',
    pos: { x: 'center', y: 'center' },
    keep_in_container: false,
    draggable:    true,
    no_handles:   false,
    collapsed_mode: false,
    show_bg:      false,
};

// ─── Responsive Font Helper ───────────────────────────────────

function getResponsiveFontSettings() {
    const w = window.innerWidth;
    const small  = w <= 768;
    const tablet = w <= 1024 && w > 768;
    return {
        mayAdjustCanvasHeight:    true,
        minCanvasHeight:          small ? 200 : tablet ? 250 : 300,
        mayAdjustFontSize:        true,
        maxFontSize:              small ? 28  : tablet ? 36  : 50,
        verticallyCenterDerivations: true,
        shouldFitVertically:      true,
    };
}

let _resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(_resizeTimeout);
    _resizeTimeout = setTimeout(() => {
        if (!appState.gmCanvas) return;
        try {
            const s = getResponsiveFontSettings();
            if (appState.layoutManager?.updateLayout) appState.layoutManager.updateLayout();
            if (s.mayAdjustFontSize && appState.gmCanvas.controller) {
                const fs = appState.gmCanvas.controller.get_font_size();
                if (fs > s.maxFontSize) appState.gmCanvas.controller.set_font_size(s.maxFontSize);
            }
            appState.gmCanvas.view?.update();
        } catch (e) {
            console.warn('[AlgebraLab] Resize error:', e);
        }
    }, 250);
});

// ─── Key Integration ──────────────────────────────────────────

function applyGeminiKey(key) {
    appState.geminiKey = key || null;
    const display = document.getElementById('gemini-key-display');
    const dot     = document.getElementById('gemini-key-dot');
    if (key) {
        display?.classList.add('key-filled');
        if (display) { display.value = key; display.placeholder = 'Key loaded ✓'; }
        dot?.classList.add('key-dot--ok');
        dot?.classList.remove('key-dot--missing');
        if (dot) dot.title = 'Gemini key ready';
        showStatus('Gemini key loaded — AI questions enabled.', 'info');
    } else {
        display?.classList.remove('key-filled');
        if (display) { display.value = ''; display.placeholder = 'Not loaded — add key in API Keys'; }
        dot?.classList.add('key-dot--missing');
        dot?.classList.remove('key-dot--ok');
        if (dot) dot.title = 'Gemini key missing';
    }
}

window.addEventListener('prepportal:keysReady', e => {
    const gemini = e.detail?.gemini || null;
    console.log('[AlgebraLab] keysReady — Gemini present:', !!gemini);
    applyGeminiKey(gemini);
});

if (window.PrepPortalKeys?.gemini) applyGeminiKey(window.PrepPortalKeys.gemini);

// ─── DOMContentLoaded ─────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
    initCustomDropdown(classId => {
        appState.classId = classId;
        const statClass = document.getElementById('stat-class');
        if (statClass) statClass.innerText = document.querySelector(`[data-value="${classId}"]`)?.innerText ?? classId;
        renderTopicChips(classId, TOPICS_BY_CLASS, topic => {
            appState.topic = topic;
            const statTopic = document.getElementById('stat-topic');
            if (statTopic) statTopic.innerText = topic;
        });
    });

    initMethodSelector(method => { appState.method = method; });

    if (typeof loadGM !== 'undefined') {
        loadGM(() => {
            appState.isGMLoaded = true;
            gmath.setDarkTheme(true);
            console.log('[AlgebraLab] Graspable Math ready.');
        }, { version: 'latest' });
    } else {
        console.error('[AlgebraLab] gm-inject.js not loaded.');
    }
});

// ─── Generate Question ────────────────────────────────────────

window.generateQuestion = async () => {
    if (!appState.classId || !appState.topic) {
        ppAlert('Please select a class level and a topic first.', 'warn');
        return;
    }
    if (!appState.isGMLoaded) {
        ppAlert('The math canvas is still loading. Try again in a moment.', 'info');
        return;
    }

    const genBtn = document.getElementById('gen-btn');
    if (genBtn) { genBtn.classList.add('loading'); genBtn.disabled = true; }

    const topicType = getTopicType(appState.topic);
    showStatus(
        topicType === 'word'       ? 'Generating word problem…'  :
        topicType === 'expression' ? 'Generating expression…'    :
                                     'Generating equation…',
        'info'
    );

    let data;
    if (appState.geminiKey) {
        try {
            data = await generateWithGemini(
                appState.topic, appState.classId, appState.method, appState.geminiKey
            );
            showStatus(`Question ready — ${appState.topic}`, 'info');
        } catch (err) {
            console.warn('[AlgebraLab] Gemini failed, using offline generator:', err.message);
            data = generateOffline(appState.topic, appState.classId, appState.method);
            showStatus('AI unavailable — using offline generator.', 'warn');
        }
    } else {
        data = generateOffline(appState.topic, appState.classId, appState.method);
        showStatus('No Gemini key — using offline generator. Add your key in API Keys to enable AI.', 'warn');
    }

    openOverlay(data);

    if (genBtn) { genBtn.classList.remove('loading'); genBtn.disabled = false; }
};

// ─── Overlay & Canvas ─────────────────────────────────────────

function openOverlay(data) {
    const overlay  = document.getElementById('fs-overlay');
    const hintEl   = document.getElementById('fs-hint-text');
    const wpBtn    = document.getElementById('wp-modal-btn');
    const doneBtn  = document.getElementById('fs-mark-done-btn');
    const wpModal  = document.getElementById('wp-modal');
    const wpText   = document.getElementById('wp-modal-text');
    const canvasEl = document.getElementById('gm-fs-canvas');

    overlay.classList.add('open');
    overlay.style.pointerEvents = 'auto';
    appState.currentType = data.type;

    // Reset everything before mounting new question
    closeWordProblemModal();
    restoreCanvas();
    canvasEl.innerHTML = '';

    // Show/hide type-specific footer buttons
    wpBtn.style.display   = data.type === 'word'       ? 'inline-flex' : 'none';
    doneBtn.style.display = data.type === 'expression' ? 'inline-flex' : 'none';

    hintEl.innerText = data.hint;

    if (data.type === 'word') {
        // Populate modal and open it automatically
        wpText.textContent = data.problem;
        appState.currentGoal = null;
        openWordProblemModal();
        mountBlankCanvas();

    } else if (data.type === 'expression') {
        // Mount the expression on canvas — no auto-check, student uses Mark Done
        appState.currentGoal = null;
        mountEquationCanvas(data.eq, null);   // pass null goal → skip change listener

    } else {
        // Equation — mount and auto-check on change
        appState.currentGoal = data.goal.replace(/\s/g, '');
        mountEquationCanvas(data.eq, appState.currentGoal);
    }
}

function mountBlankCanvas() {
    const rs = getResponsiveFontSettings();
    appState.gmCanvas = new gmath.Canvas('#gm-fs-canvas', CANVAS_SETTINGS);
    if (rs.mayAdjustFontSize) {
        appState.gmCanvas.controller.set_font_size(Math.min(40, rs.maxFontSize));
    }
}

function mountEquationCanvas(eq, goalAscii) {
    const rs = getResponsiveFontSettings();
    appState.gmCanvas = new gmath.Canvas('#gm-fs-canvas', CANVAS_SETTINGS);
    if (rs.mayAdjustFontSize) {
        appState.gmCanvas.controller.set_font_size(Math.min(40, rs.maxFontSize));
    }

    const derivation = appState.gmCanvas.model.createElement('derivation', {
        eq,
        ...DERIVATION_SETTINGS,
    });

    try {
        const result = gmath.autoLayout.autoLayoutCanvasForOutlier(appState.gmCanvas, rs);
        appState.layoutManager = (result?.updateLayout)
            ? result
            : { updateLayout: () => appState.gmCanvas?.view?.update() };
    } catch {
        appState.layoutManager = { updateLayout: () => appState.gmCanvas?.view?.update() };
    }

    // Auto-check only for equations with a defined goal
    if (goalAscii) {
        derivation.events.on('change', () => {
            const current = derivation.getLastModel().to_ascii().replace(/\s/g, '');
            if (current === goalAscii) handleSuccess();
        });
    }

    setTimeout(() => {
        appState.layoutManager?.updateLayout?.() ?? appState.gmCanvas?.view?.update();
    }, 100);
}

function handleSuccess() {
    const wrap = document.getElementById('fs-canvas-wrap');
    wrap.classList.add('solved');
    appState.solvedCount++;
    document.getElementById('stat-count').innerText = appState.solvedCount;
    setTimeout(() => {
        wrap.classList.remove('solved');
        ppAlert(`That's ${appState.solvedCount} solved. Keep going!`, 'success');
    }, 900);
}

// ─── Overlay Controls (assigned to window for onclick handlers) ───────────

window.closeOverlay = () => {
    const overlay = document.getElementById('fs-overlay');
    overlay.classList.remove('open');
    overlay.style.pointerEvents = 'none';
    closeWordProblemModal();
    restoreCanvas();
};

window.openOverlay = () => {
    // Re-open last question if overlay was closed via FAB
    const overlay = document.getElementById('fs-overlay');
    overlay.classList.add('open');
    overlay.style.pointerEvents = 'auto';
    document.getElementById('open-fab')?.classList.remove('visible');
};

// ─── Canvas Toggle ────────────────────────────────────────────

window.toggleCanvas = () => {
    const wrap = document.getElementById('fs-canvas-wrap');
    const btn  = document.getElementById('fs-canvas-toggle-btn');
    const hiding = !wrap.classList.contains('canvas-hidden');
    wrap.classList.toggle('canvas-hidden', hiding);
    btn?.classList.toggle('canvas-off', hiding);
    if (btn) btn.title = hiding ? 'Show canvas' : 'Hide canvas';
};

function restoreCanvas() {
    const wrap = document.getElementById('fs-canvas-wrap');
    const btn  = document.getElementById('fs-canvas-toggle-btn');
    wrap?.classList.remove('canvas-hidden');
    btn?.classList.remove('canvas-off');
    if (btn) btn.title = 'Hide canvas';
}

// ─── Word Problem Modal ───────────────────────────────────────

function openWordProblemModal() {
    const modal  = document.getElementById('wp-modal');
    const card   = document.getElementById('wp-modal-card');
    const minBtn = document.getElementById('wp-minimize-btn');
    card?.classList.remove('minimized');
    minBtn?.classList.remove('is-minimized');
    modal?.classList.add('open');
}

window.closeWordProblemModal = () => {
    const modal  = document.getElementById('wp-modal');
    const card   = document.getElementById('wp-modal-card');
    const minBtn = document.getElementById('wp-minimize-btn');
    modal?.classList.remove('open');
    card?.classList.remove('minimized');
    minBtn?.classList.remove('is-minimized');
};

window.toggleWordProblemModal = () => {
    const modal = document.getElementById('wp-modal');
    modal?.classList.contains('open') ? closeWordProblemModal() : openWordProblemModal();
};

window.minimizeWordProblemModal = () => {
    const card   = document.getElementById('wp-modal-card');
    const minBtn = document.getElementById('wp-minimize-btn');
    const isMin  = card?.classList.toggle('minimized');
    minBtn?.classList.toggle('is-minimized', isMin);
};

// Mark Solved — from word problem modal
window.markSolvedFromModal = () => {
    closeWordProblemModal();
    handleSuccess();
};

// Mark Done — for expression type (student simplified manually)
window.markExpressionDone = () => {
    handleSuccess();
};
