/**
 * Prep Portal 2026 - Algebra Lab
 * Equations generated live by Gemini AI via window.PrepPortalKeys
 */

// ─── 1. CONFIGURATION & DATA ─────────────────────────────────

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


// Canvas settings for responsive design
const canvasFullscreenSettings = {
    auto_resize_on_scroll: false,
    use_toolbar: true,
    undo_btn: true,
    redo_btn: true,
    new_sheet_btn: false,
    font_size_btns: true,
    formula_btn: true,
    help_btn: false,
    help_logo_btn: false,
    fullscreen_toolbar_btn: false,
    fullscreen_btn: false,
    transform_btn: false,
    keypad_btn: false,
    scrub_btn: false,
    draw_btn: false,
    erase_btn: false,
    arrange_btn: false,
    reset_btn: true,
    save_btn: false,
    load_btn: false,
    settings_btn: true,
    insert_btn: true,
    insert_menu_items: {
        derivation: true,
        function: true,
        textbox: true,
    },
    use_hold_menu: false,
    display_labels: false,
    btn_size: 'xs',
    ask_confirmation_on_closing: false,
    vertical_scroll: true,
};

const singleLineDerivationSettings = {
    h_align: 'center',
    pos: { x: 'center', y: 'center' },
    keep_in_container: false,
    draggable: true,
    no_handles: false,
    collapsed_mode: false,
    show_bg: false,
};

// Model chain with correct endpoints
const GEMINI_MODELS = [
    { label: 'Gemini 3.1 Flash-Lite', url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent' },
    { label: 'Gemini 3.1 Pro', url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-pro-preview:generateContent' },
    { label: 'Gemini 3 Flash', url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent' },
    { label: 'Gemini 2.5 Flash-Lite', url: 'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash-lite:generateContent' },
    { label: 'Gemini 2.5 Flash', url: 'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent' },
    { label: 'Gemini 2.5 Pro', url: 'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-pro:generateContent' },
];

let appState = {
    classId:     null,
    topic:       null,
    method:      'transfer',
    solvedCount: 0,
    currentGoal: null,
    gmCanvas:    null,
    isGMLoaded:  false,
    geminiKey:   null,
    layoutManager: null, // For responsive font sizing
};

// ─── 2. CUSTOM MODAL SYSTEM ───────────────────────────────────

function ensureModal() {
    if (document.getElementById('pp-modal-overlay')) return;
    document.body.insertAdjacentHTML('beforeend', `
<div id="pp-modal-overlay" class="pp-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="pp-modal-title" style="display:none">
    <div class="pp-modal-box" id="pp-modal-box">
        <div class="pp-modal-hd" id="pp-modal-hd">
            <span id="pp-modal-icon" class="pp-modal-icon" aria-hidden="true"></span>
            <strong id="pp-modal-title" class="pp-modal-title"></strong>
        </div>
        <p id="pp-modal-body" class="pp-modal-body"></p>
        <div class="pp-modal-ftr">
            <button id="pp-modal-ok" class="btn btn-yellow pp-modal-ok-btn">OK</button>
        </div>
    </div>
</div>
<style>
.pp-modal-overlay{
    position:fixed;inset:0;z-index:9999;
    background:rgba(10,10,10,.55);
    display:flex;align-items:center;justify-content:center;
    padding:16px;
}
.pp-modal-box{
    background:var(--color-bg,#f5f0e8);
    border:2.5px solid var(--color-ink,#1a1a1a);
    box-shadow:5px 5px 0 var(--color-ink,#1a1a1a);
    max-width:420px;width:100%;
    padding:24px 24px 20px;
    font-family:var(--font-mono,'JetBrains Mono',monospace);
}
.pp-modal-hd{
    display:flex;align-items:center;gap:10px;
    margin-bottom:12px;
}
.pp-modal-icon{font-size:20px;line-height:1;flex-shrink:0;}
.pp-modal-title{
    font-family:var(--font-display,'Unbounded',sans-serif);
    font-size:13px;font-weight:900;letter-spacing:.03em;
    text-transform:uppercase;
}
.pp-modal-body{
    font-size:13px;line-height:1.6;
    color:var(--color-ink,#1a1a1a);
    margin:0 0 18px;
    word-break:break-word;
}
.pp-modal-ftr{display:flex;justify-content:flex-end;}
.pp-modal-ok-btn{
    font-family:var(--font-display,'Unbounded',sans-serif);
    font-size:11px;font-weight:700;letter-spacing:.06em;
    text-transform:uppercase;
    padding:8px 20px;cursor:pointer;
}
.pp-modal-box.type-warn  .pp-modal-hd{border-bottom:2px solid #f5a623;padding-bottom:10px;}
.pp-modal-box.type-error .pp-modal-hd{border-bottom:2px solid #ef5350;padding-bottom:10px;}
.pp-modal-box.type-error .pp-modal-ok-btn{background:#ef5350;border-color:#ef5350;color:#fff;}
.pp-modal-box.type-success .pp-modal-hd{border-bottom:2px solid #4caf50;padding-bottom:10px;}
.pp-modal-box.type-success .pp-modal-ok-btn{background:#4caf50;border-color:#4caf50;color:#fff;}
</style>`);

    document.getElementById('pp-modal-ok').addEventListener('click', closeModal);
    document.getElementById('pp-modal-overlay').addEventListener('click', (e) => {
        if (e.target === document.getElementById('pp-modal-overlay')) closeModal();
    });
}

const MODAL_META = {
    info:    { icon: 'ℹ', title: 'Note' },
    warn:    { icon: '⚠', title: 'Heads up' },
    error:   { icon: '✕', title: 'Error' },
    success: { icon: '✓', title: 'Correct!' },
};

function ppAlert(message, type = 'info') {
    ensureModal();
    const meta = MODAL_META[type] || MODAL_META.info;
    document.getElementById('pp-modal-box').className  = `pp-modal-box type-${type}`;
    document.getElementById('pp-modal-icon').textContent  = meta.icon;
    document.getElementById('pp-modal-title').textContent = meta.title;
    document.getElementById('pp-modal-body').textContent  = message;
    document.getElementById('pp-modal-overlay').style.display = 'flex';
    document.getElementById('pp-modal-ok').focus();
}

function closeModal() {
    const overlay = document.getElementById('pp-modal-overlay');
    if (overlay) overlay.style.display = 'none';
}

// ─── 3. STATUS BAR ────────────────────────────────────────────

function showStatus(msg, type = 'info') {
    const bar = document.getElementById('status-bar');
    if (!bar) return;
    bar.textContent = msg;
    bar.className = `status-bar status-${type} visible`;
    clearTimeout(bar._timer);
    bar._timer = setTimeout(() => bar.classList.remove('visible'), 6000);
}

// ─── 4. KEY INTEGRATION ───────────────────────────────────────

function applyGeminiKey(key) {
    appState.geminiKey = key || null;

    const display = document.getElementById('gemini-key-display');
    const dot     = document.getElementById('gemini-key-dot');

    if (key) {
        if (display) {
            display.value = key;
            display.classList.add('key-filled');
            display.placeholder = 'Key loaded ✓';
        }
        if (dot) {
            dot.classList.add('key-dot--ok');
            dot.classList.remove('key-dot--missing');
            dot.title = 'Gemini key ready';
        }
        showStatus('Gemini key loaded — AI equations enabled.', 'info');
    } else {
        if (display) {
            display.value = '';
            display.classList.remove('key-filled');
            display.placeholder = 'Not loaded — add key in API Keys';
        }
        if (dot) {
            dot.classList.add('key-dot--missing');
            dot.classList.remove('key-dot--ok');
            dot.title = 'Gemini key missing';
        }
    }
}

// Pick up the key when keys.js fires after Firestore load
window.addEventListener('prepportal:keysReady', (e) => {
    const gemini = e.detail?.gemini || null;
    console.log('[AlgebraLab] prepportal:keysReady — Gemini key present:', !!gemini);
    applyGeminiKey(gemini);
});

// Also handle if the key was ready before this module ran
if (window.PrepPortalKeys?.gemini) {
    applyGeminiKey(window.PrepPortalKeys.gemini);
}

// ─── 5. UI INITIALIZATION ─────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
    initCustomDropdown();
    initMethodSelector();

    if (typeof loadGM !== 'undefined') {
        loadGM(initSystem, { version: 'latest' });
    } else {
        console.error('[AlgebraLab] gm-inject.js not found. Check your HTML script tag.');
    }
});



// Responsive font size settings
function getResponsiveFontSettings() {
    const isSmallScreen = window.innerWidth <= 768;
    const isTablet = window.innerWidth <= 1024 && window.innerWidth > 768;
    
    return {
        mayAdjustCanvasHeight: true,
        minCanvasHeight: isSmallScreen ? 200 : (isTablet ? 250 : 300),
        mayAdjustFontSize: true,
        maxFontSize: isSmallScreen ? 28 : (isTablet ? 36 : 50),
        verticallyCenterDerivations: true,
        shouldFitVertically: true,
    };
}

// Handle window resize for responsive font sizing
// Handle window resize for responsive font sizing
function handleResponsiveResize() {
    if (appState.gmCanvas) {
        try {
            const settings = getResponsiveFontSettings();
            
            // Try to use layoutManager if it exists and has the method
            if (appState.layoutManager && typeof appState.layoutManager.updateLayout === 'function') {
                appState.layoutManager = gmath.autoLayout.autoLayoutCanvasForOutlier(
                    appState.gmCanvas,
                    settings
                );
            }
            
            // Adjust font size if needed
            if (settings.mayAdjustFontSize && appState.gmCanvas.controller) {
                const currentFontSize = appState.gmCanvas.controller.get_font_size();
                if (currentFontSize > settings.maxFontSize) {
                    appState.gmCanvas.controller.set_font_size(settings.maxFontSize);
                }
            }
            
            // Force view update as fallback
            if (appState.gmCanvas.view && typeof appState.gmCanvas.view.update === 'function') {
                appState.gmCanvas.view.update();
            }
        } catch (error) {
            console.warn('[AlgebraLab] Resize handling error:', error);
        }
    }
}

// Debounced resize handler
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(handleResponsiveResize, 250);
});

function initSystem() {
    appState.isGMLoaded = true;
    gmath.setDarkTheme(true);
    console.log('[AlgebraLab] Graspable Math ready.');
}

function initCustomDropdown() {
    const trigger      = document.getElementById('cdd-trigger');
    const panel        = document.getElementById('cdd-panel');
    const options      = document.querySelectorAll('.cdd-option');
    const valueDisplay = document.getElementById('cdd-value');

    trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        panel.classList.toggle('open');
    });

    options.forEach(opt => {
        opt.addEventListener('click', () => {
            appState.classId = opt.dataset.value;
            valueDisplay.innerText = opt.innerText;
            panel.classList.remove('open');
            renderTopicChips(appState.classId);
            document.getElementById('stat-class').innerText = opt.innerText;
        });
    });

    document.addEventListener('click', () => panel.classList.remove('open'));
}

function renderTopicChips(classId) {
    const container = document.getElementById('topic-container');
    const topics = TOPICS_BY_CLASS[classId] || ["General Algebra"];
    container.innerHTML = `<div class="topic-chips">
        ${topics.map(t => `<button class="topic-chip" onclick="selectTopic(this, '${t}')">${t}</button>`).join('')}
    </div>`;
}

window.selectTopic = (btn, topic) => {
    document.querySelectorAll('.topic-chip').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    appState.topic = topic;
    document.getElementById('stat-topic').innerText = topic;
};

function initMethodSelector() {
    const chips = document.querySelectorAll('.method-chip');
    chips.forEach(chip => {
        chip.addEventListener('click', function () {
            chips.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            appState.method = this.dataset.method;
        });
    });
}

// ─── 6. GEMINI EQUATION GENERATOR ────────────────────────────

async function generateWithGemini(classId, topic, method, apiKey) {
    const hintStyle = method === 'balancing'
        ? 'phrase the hint using the balancing method (do the same to both sides)'
        : 'phrase the hint using the transposing/transfer method (move terms across the equals sign)';

    const prompt = `You are an algebra question generator for Nigerian school students.

Generate ONE algebra question for the topic "${topic}" at the "${classId}" level (P1-P6 = Primary, JSS1-JSS3 = Junior Secondary, SS1-SS3 = Senior Secondary).

STRICT RULES:
- The equation must be solvable by a student at that level.
- The "eq" field is fed into Graspable Math. Use ONLY: letters, digits, +, -, *, /, ^, =, and parentheses. No spaces inside eq.
- The "goal" must be the exact simplified solution in ASCII with no spaces (e.g. "x=7" or "x=3,y=2").
- The "hint" is one friendly sentence. ${hintStyle}.
- Match difficulty: Primary = whole-number arithmetic; JSS = single-variable linear; SS = quadratic/simultaneous.
- Vary the numbers — do not always use the same values.

Respond with ONLY a raw JSON object, nothing else.
Example: {"eq":"2*x-4=10","goal":"x=7","hint":"Add 4 to both sides, then divide by 2."}`;

    let lastError = null;

    for (const model of GEMINI_MODELS) {
        const url = `${model.url}?key=${encodeURIComponent(apiKey)}`;
        try {
            console.log(`[AlgebraLab] Trying ${model.label}...`);
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: { temperature: 0.9, maxOutputTokens: 300 }
                })
            });

            if (res.status === 404) {
                console.warn(`[AlgebraLab] ${model.label} not found, trying next…`);
                continue;
            }

            if (!res.ok) {
                const errText = await res.text().catch(() => '');
                throw new Error(`HTTP ${res.status} — ${errText.slice(0, 200)}`);
            }

            const data  = await res.json();
            const raw   = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
            const clean = raw.replace(/```[a-z]*\n?/gi, '').replace(/```/g, '').trim();

            const parsed = JSON.parse(clean);

            if (!parsed.eq || !parsed.goal || !parsed.hint) {
                throw new Error(`Incomplete fields in response: ${clean}`);
            }

            parsed.goal = parsed.goal.replace(/\s/g, '');
            console.log(`[AlgebraLab] ✓ Equation from ${model.label}:`, parsed);
            return parsed;

        } catch (err) {
            console.warn(`[AlgebraLab] ${model.label} failed:`, err.message);
            lastError = err;
        }
    }

    throw lastError || new Error('All Gemini models failed.');
}

// ─── 7. STATIC FALLBACK ───────────────────────────────────────

function getFallbackTemplate(topic) {
    const templates = {
        "Missing Numbers (1-10)": { eq: "x+3=10",     goal: "x=7", hint: "What number plus 3 equals 10?" },
        "Simple Addition":        { eq: "x+5=12",     goal: "x=7", hint: "Subtract 5 from both sides." },
        "Linear Equations":       { eq: "2*x-4=10",   goal: "x=7", hint: "Add 4 to both sides, then divide by 2." },
        "Solving for X":          { eq: "3*x=15",     goal: "x=5", hint: "Divide both sides by 3." },
        "Quadratic Equations":    { eq: "x^2-5*x+6=0", goal: "x=2", hint: "Factorise — find two numbers that multiply to 6 and add to -5." },
        "Simultaneous Equations": { eq: "x+y=5",      goal: "x=3", hint: "Use substitution or elimination." },
        "Factorization":          { eq: "x^2-9=0",    goal: "x=3", hint: "Difference of two squares: (x+3)(x-3)=0." },
    };
    return templates[topic] || { eq: "x+2=5", goal: "x=3", hint: "Solve for x." };
}

// ─── 8. CORE GENERATE FLOW ────────────────────────────────────

window.generateQuestion = async () => {
    if (!appState.classId || !appState.topic) {
        ppAlert("Please select a class level and a topic first.", 'warn');
        return;
    }
    if (!appState.isGMLoaded) {
        ppAlert("The math engine is still loading. Give it a moment and try again.", 'info');
        return;
    }

    const genBtn = document.getElementById('gen-btn');
    genBtn.classList.add('loading');
    genBtn.disabled = true;
    showStatus('Generating equation with Gemini AI…', 'info');

    let data;

    if (appState.geminiKey) {
        try {
            data = await generateWithGemini(
                appState.classId,
                appState.topic,
                appState.method,
                appState.geminiKey
            );
            showStatus(`Equation ready — ${appState.topic}`, 'info');
        } catch (err) {
            console.error('[AlgebraLab] Gemini error:', err);
            data = getFallbackTemplate(appState.topic);
            showStatus(`AI generation failed (${err.message}) — using a sample equation.`, 'warn');
        }
    } else {
        data = getFallbackTemplate(appState.topic);
        showStatus('No Gemini key — showing a sample equation. Add your key in API Keys to enable AI equations.', 'warn');
    }

    openOverlay(data);

    genBtn.classList.remove('loading');
    genBtn.disabled = false;
};

// ─── 9. CANVAS INTEGRATION WITH RESPONSIVE FONTS ──────────────

// ─── 9. CANVAS INTEGRATION WITH RESPONSIVE FONTS ──────────────

function openOverlay(data) {
    const overlay = document.getElementById('fs-overlay');
    overlay.classList.add('open');
    overlay.style.pointerEvents = 'auto';
    
    document.getElementById('fs-hint-text').innerText = data.hint;
    appState.currentGoal = data.goal.replace(/\s/g, '');
    
    const canvasWrap = document.getElementById('gm-fs-canvas');
    canvasWrap.innerHTML = '';
    
    // Get responsive settings based on screen size
    const responsiveSettings = getResponsiveFontSettings();
    
    // Initialize canvas with fullscreen settings
    appState.gmCanvas = new gmath.Canvas('#gm-fs-canvas', canvasFullscreenSettings);
    
    // Apply responsive font size if needed
    if (responsiveSettings.mayAdjustFontSize) {
        const initialFontSize = Math.min(40, responsiveSettings.maxFontSize);
        appState.gmCanvas.controller.set_font_size(initialFontSize);
    }
    
    const derivation = appState.gmCanvas.model.createElement('derivation', {
        eq: data.eq,
        ...singleLineDerivationSettings
    });
    
    // Apply auto-layout with responsive settings
    try {
        const layoutResult = gmath.autoLayout.autoLayoutCanvasForOutlier(
            appState.gmCanvas,
            responsiveSettings
        );
        
        // Check what was returned and store appropriately
        if (layoutResult && typeof layoutResult.updateLayout === 'function') {
            appState.layoutManager = layoutResult;
        } else if (layoutResult && typeof layoutResult === 'object') {
            // Some versions might return a different structure
            appState.layoutManager = {
                updateLayout: () => {
                    // Try to manually trigger a layout update
                    if (appState.gmCanvas && appState.gmCanvas.view) {
                        appState.gmCanvas.view.update();
                    }
                }
            };
        } else {
            // Fallback: create a simple layout manager wrapper
            appState.layoutManager = {
                updateLayout: () => {
                    if (appState.gmCanvas && appState.gmCanvas.view) {
                        appState.gmCanvas.view.update();
                    }
                }
            };
        }
    } catch (layoutError) {
        console.warn('[AlgebraLab] Auto-layout error:', layoutError);
        // Create a dummy layout manager to prevent future errors
        appState.layoutManager = {
            updateLayout: () => {
                if (appState.gmCanvas && appState.gmCanvas.view) {
                    appState.gmCanvas.view.update();
                }
            }
        };
    }
    
    derivation.events.on('change', () => {
        const currentASCII = derivation.getLastModel().to_ascii().replace(/\s/g, '');
        if (currentASCII === appState.currentGoal) handleSuccess();
    });
    
    // Add a small delay to ensure proper rendering
    setTimeout(() => {
        if (appState.layoutManager && typeof appState.layoutManager.updateLayout === 'function') {
            appState.layoutManager.updateLayout();
        } else if (appState.gmCanvas && appState.gmCanvas.view) {
            // Fallback: manually update the view
            appState.gmCanvas.view.update();
        }
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

window.closeOverlay = () => {
    const overlay = document.getElementById('fs-overlay');
    overlay.classList.remove('open');
    overlay.style.pointerEvents = 'none';
};

window.toggleWordProblemModal = () => {
    document.getElementById('wp-modal').classList.toggle('open');
};

// Add CSS for responsive canvas container
const responsiveStyles = document.createElement('style');
responsiveStyles.textContent = `
    @media (max-width: 768px) {
        #gm-fs-canvas {
            min-height: 200px;
        }
        .fs-canvas-wrap {
            padding: 10px;
        }
    }
    @media (min-width: 769px) and (max-width: 1024px) {
        #gm-fs-canvas {
            min-height: 250px;
        }
    }
    @media (min-width: 1025px) {
        #gm-fs-canvas {
            min-height: 300px;
        }
    }
`;
document.head.appendChild(responsiveStyles);