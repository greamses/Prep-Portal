// script.js - Main entry point (type="module")

import { appState, updateState, setGeminiKey } from './modules/state-manager.js';
import { generateWithGemini } from './modules/gemini-client.js';
import { generateFallbackEquation } from './modules/equation-modules/index.js';
import { openOverlay, closeOverlay, toggleCanvas, toggleWordProblemModal, closeWordProblemModal, minimizeWordProblemModal, markSolvedFromModal } from './modules/canvas-manager.js';
import { showStatus, ppAlert, initUI } from './modules/ui-controller.js';

const TOPICS_BY_CLASS = {
    p1: ["Missing Numbers (1-10)", "Simple Addition", "Basic Patterns"],
    p2: ["Missing Numbers (1-20)", "Addition & Subtraction", "Number Sequences"],
    p3: ["Missing Numbers (1-100)", "Multiplication Intro", "Simple Division"],
    p4: ["Multiplication & Division", "Fractions Intro", "Word Problems"],
    p5: ["Fractions & Decimals", "Ratios Intro", "Area & Perimeter"],
    p6: ["Order of Operations", "Solving for X", "Ratios & Proportion"],
    jss1: ["Algebraic Simplification", "Linear Equations", "Brackets & Fractions"],
    jss2: ["Word Problems (Algebra)", "Indices & Powers", "Number Bases"],
    jss3: ["Simultaneous Equations", "Quadratic Equations", "Factorization"],
    ss1: ["Linear Equations", "Quadratic Equations", "Sets & Sequences"],
    ss2: ["Linear Inequalities", "Partial Fractions", "Simultaneous Equations"],
    ss3: ["Advanced Factorization", "Binomial Theorem", "Coordinate Geometry"],
};

const WORD_PROBLEM_TOPICS = new Set([
    "Basic Patterns", "Number Sequences", "Word Problems",
    "Ratios Intro", "Area & Perimeter", "Ratios & Proportion",
    "Word Problems (Algebra)",
]);

// Make functions global for HTML onclick handlers
window.generateQuestion = generateQuestion;
window.closeOverlay = closeOverlay;
window.toggleCanvas = toggleCanvas;
window.toggleWordProblemModal = toggleWordProblemModal;
window.closeWordProblemModal = closeWordProblemModal;
window.minimizeWordProblemModal = minimizeWordProblemModal;
window.markSolvedFromModal = () => markSolvedFromModal(appState, updateState);

async function generateQuestion() {
    if (!appState.classId || !appState.topic) {
        ppAlert("Please select a class level and a topic first.", 'warn');
        return;
    }
    if (!appState.isGMLoaded) {
        ppAlert("The math engine is still loading. Give it a moment and try again.", 'info');
        return;
    }
    
    const genBtn = document.getElementById('gen-btn');
    if (genBtn) {
        genBtn.classList.add('loading');
        genBtn.disabled = true;
    }
    
    let data;
    
    // Use key from PrepPortalKeys (loaded by your keys module)
    if (appState.geminiKey) {
        try {
            data = await generateWithGemini(
                appState.classId,
                appState.topic,
                appState.method,
                appState.geminiKey,
                WORD_PROBLEM_TOPICS
            );
            showStatus(`Question ready — ${appState.topic}`, 'info');
        } catch (err) {
            console.error('Gemini error:', err);
            data = generateFallbackEquation(appState.classId, appState.topic);
            showStatus(`AI generation failed — using default question.`, 'warn');
        }
    } else {
        data = generateFallbackEquation(appState.classId, appState.topic);
        showStatus('No Gemini key — showing default question. Add your key in API Keys to enable AI questions.', 'warn');
    }
    
    if (WORD_PROBLEM_TOPICS.has(appState.topic) && !data.type) {
        data.type = 'word';
    }
    
    openOverlay(data, appState, updateState);
    
    if (genBtn) {
        genBtn.classList.remove('loading');
        genBtn.disabled = false;
    }
}

function initSystem() {
    appState.isGMLoaded = true;
    if (typeof gmath !== 'undefined') {
        gmath.setDarkTheme(true);
    }
    console.log('[AlgebraLab] Graspable Math ready.');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initUI(TOPICS_BY_CLASS, (classId, topic) => {
        updateState({ classId, topic });
    });
    
    // Load Graspable Math
    if (typeof loadGM !== 'undefined') {
        loadGM(initSystem, { version: 'latest' });
    } else {
        console.error('[AlgebraLab] gm-inject.js not found');
    }
    
    // Listen for keys from your existing PrepPortalKeys system
    window.addEventListener('prepportal:keysReady', (e) => {
        const gemini = e.detail?.gemini || null;
        console.log('[AlgebraLab] Keys received — Gemini present:', !!gemini);
        setGeminiKey(gemini);
    });
    
    // Also handle if keys were already loaded before this module ran
    if (window.PrepPortalKeys?.gemini) {
        setGeminiKey(window.PrepPortalKeys.gemini);
    }
});

// Responsive resize handler
function getResponsiveFontSettings() {
    const isSmallScreen = window.innerWidth <= 768;
    const isTablet = window.innerWidth <= 1024 && window.innerWidth > 768;
    return {
        maxFontSize: isSmallScreen ? 28 : (isTablet ? 36 : 50),
    };
}

function handleResponsiveResize() {
    if (appState.gmCanvas && appState.gmCanvas.controller) {
        const settings = getResponsiveFontSettings();
        const currentFontSize = appState.gmCanvas.controller.get_font_size();
        if (currentFontSize > settings.maxFontSize) {
            appState.gmCanvas.controller.set_font_size(settings.maxFontSize);
        }
        if (appState.gmCanvas.view) appState.gmCanvas.view.update();
    }
}

let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(handleResponsiveResize, 250);
});