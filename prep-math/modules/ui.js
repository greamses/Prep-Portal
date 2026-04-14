/**
 * modules/ui.js
 * Shared UI utilities: custom alert modal, status bar, topic chips.
 */

// ─── Alert Modal ─────────────────────────────────────────────

const MODAL_META = {
    info:    { icon: 'ℹ', title: 'Note' },
    warn:    { icon: '⚠', title: 'Heads up' },
    error:   { icon: '✕', title: 'Error' },
    success: { icon: '✓', title: 'Correct!' },
};

function ensureAlertModal() {
    if (document.getElementById('pp-modal-overlay')) return;
    document.body.insertAdjacentHTML('beforeend', `
<div id="pp-modal-overlay" class="pp-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="pp-modal-title" style="display:none">
    <div class="pp-modal-box" id="pp-modal-box">
        <div class="pp-modal-hd">
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
.pp-modal-overlay{position:fixed;inset:0;z-index:9999;background:rgba(10,10,10,.55);display:flex;align-items:center;justify-content:center;padding:16px;}
.pp-modal-box{background:var(--bg,#f5f0e8);border:2.5px solid var(--ink,#1a1a1a);box-shadow:5px 5px 0 var(--ink,#1a1a1a);max-width:420px;width:100%;padding:24px 24px 20px;font-family:var(--font-mono,'JetBrains Mono',monospace);}
.pp-modal-hd{display:flex;align-items:center;gap:10px;margin-bottom:12px;}
.pp-modal-icon{font-size:20px;line-height:1;flex-shrink:0;}
.pp-modal-title{font-family:var(--font-display,'Unbounded',sans-serif);font-size:13px;font-weight:900;letter-spacing:.03em;text-transform:uppercase;}
.pp-modal-body{font-size:13px;line-height:1.6;color:var(--ink,#1a1a1a);margin:0 0 18px;word-break:break-word;}
.pp-modal-ftr{display:flex;justify-content:flex-end;}
.pp-modal-ok-btn{font-family:var(--font-display,'Unbounded',sans-serif);font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;padding:8px 20px;cursor:pointer;}
.pp-modal-box.type-warn  .pp-modal-hd{border-bottom:2px solid #f5a623;padding-bottom:10px;}
.pp-modal-box.type-error .pp-modal-hd{border-bottom:2px solid #ef5350;padding-bottom:10px;}
.pp-modal-box.type-error .pp-modal-ok-btn{background:#ef5350;border-color:#ef5350;color:#fff;}
.pp-modal-box.type-success .pp-modal-hd{border-bottom:2px solid #4caf50;padding-bottom:10px;}
.pp-modal-box.type-success .pp-modal-ok-btn{background:#4caf50;border-color:#4caf50;color:#fff;}
</style>`);

    document.getElementById('pp-modal-ok').addEventListener('click', closeAlertModal);
    document.getElementById('pp-modal-overlay').addEventListener('click', e => {
        if (e.target === document.getElementById('pp-modal-overlay')) closeAlertModal();
    });
}

function closeAlertModal() {
    const el = document.getElementById('pp-modal-overlay');
    if (el) el.style.display = 'none';
}

/**
 * Show a neobrutalist alert dialog.
 * @param {string} message
 * @param {'info'|'warn'|'error'|'success'} type
 */
export function ppAlert(message, type = 'info') {
    ensureAlertModal();
    const meta = MODAL_META[type] || MODAL_META.info;
    document.getElementById('pp-modal-box').className    = `pp-modal-box type-${type}`;
    document.getElementById('pp-modal-icon').textContent  = meta.icon;
    document.getElementById('pp-modal-title').textContent = meta.title;
    document.getElementById('pp-modal-body').textContent  = message;
    document.getElementById('pp-modal-overlay').style.display = 'flex';
    document.getElementById('pp-modal-ok').focus();
}

// ─── Status Bar ───────────────────────────────────────────────

/**
 * Show a message in the status bar.
 * @param {string} msg
 * @param {'info'|'warn'|'error'|'success'} type
 */
export function showStatus(msg, type = 'info') {
    const bar = document.getElementById('status-bar');
    if (!bar) return;
    bar.textContent = msg;
    bar.className = `status-bar status-${type} visible`;
    clearTimeout(bar._timer);
    bar._timer = setTimeout(() => bar.classList.remove('visible'), 6000);
}

// ─── Topic Chips ─────────────────────────────────────────────

/**
 * Render topic chips for a given class ID.
 * Calls the provided onSelect callback with (button, topicName).
 */
export function renderTopicChips(classId, topicsMap, onSelect) {
    const container = document.getElementById('topic-container');
    if (!container) return;
    const topics = topicsMap[classId] || ['General Algebra'];
    container.innerHTML = `<div class="topic-chips">
        ${topics.map(t => `<button class="topic-chip" data-topic="${t}">${t}</button>`).join('')}
    </div>`;
    container.querySelectorAll('.topic-chip').forEach(btn => {
        btn.addEventListener('click', () => {
            container.querySelectorAll('.topic-chip').forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            onSelect(btn.dataset.topic);
        });
    });
}

// ─── Custom Dropdown ─────────────────────────────────────────

/**
 * Initialise the class-level custom dropdown.
 * Calls onSelect with the chosen classId.
 */
export function initCustomDropdown(onSelect) {
    const trigger      = document.getElementById('cdd-trigger');
    const panel        = document.getElementById('cdd-panel');
    const valueDisplay = document.getElementById('cdd-value');
    if (!trigger) return;

    trigger.addEventListener('click', e => {
        e.stopPropagation();
        panel.classList.toggle('open');
        trigger.setAttribute('aria-expanded', panel.classList.contains('open'));
    });

    panel.querySelectorAll('.cdd-option').forEach(opt => {
        opt.addEventListener('click', () => {
            valueDisplay.innerText = opt.innerText;
            panel.classList.remove('open');
            trigger.setAttribute('aria-expanded', 'false');
            panel.querySelectorAll('.cdd-option').forEach(o => o.classList.remove('selected'));
            opt.classList.add('selected');
            onSelect(opt.dataset.value);
        });
    });

    document.addEventListener('click', () => {
        panel.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');
    });
}

// ─── Method Selector ─────────────────────────────────────────

/**
 * Initialise the Transfer / Balancing method chips.
 * Calls onChange with the selected method string.
 */
export function initMethodSelector(onChange) {
    const chips = document.querySelectorAll('.method-chip');
    chips.forEach(chip => {
        chip.addEventListener('click', function () {
            chips.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            onChange(this.dataset.method);
        });
    });
}
