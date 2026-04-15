    // ─────────────────────────────────────────────────────────
    // CONFIG
    // ─────────────────────────────────────────────────────────
    const MODES = {
      fractions: {
        label: 'Fraction',
        placeholder: 'e.g. 3/4',
        hint: 'Type as numerator/denominator — e.g. 3/4',
        polypadLabel: 'fraction',
        modalQ: 'What fraction does the shape show?',
      },
      percents: {
        label: 'Percent',
        placeholder: 'e.g. 75%',
        hint: 'Type the percentage — e.g. 75 or 75%',
        polypadLabel: 'percentage',
        modalQ: 'What percentage does the shape show?',
      },
      degrees: {
        label: 'Degrees',
        placeholder: 'e.g. 270°',
        hint: 'Type the angle in degrees — e.g. 270 or 270°',
        polypadLabel: 'hidden',
        modalQ: 'How many degrees does the shaded sector represent?',
      },
      decimals: {
        label: 'Decimal',
        placeholder: 'e.g. 0.75',
        hint: 'Type as a decimal — e.g. 0.75',
        polypadLabel: 'decimal',
        modalQ: 'What decimal does the shape show?',
      },
    };
    
    // ─────────────────────────────────────────────────────────
    // STATE
    // ─────────────────────────────────────────────────────────
    let pad = null;
    let scriptReady = false;
    let streak = 0;
    let totalSolved = 0;
    let currentQ = null; // { active, denominator }
    let isLoading = false;
    
    const settings = { mode: 'fractions', parts: 2, type: 'fraction-circle' };
    
    // ─────────────────────────────────────────────────────────
    // TICKER
    // ─────────────────────────────────────────────────────────
    (function buildTicker() {
      const words = [
        'Fraction Explorer', 'PrepBot · Maths', 'Visual Fractions',
        'Prep Portal 2026', 'Circles · Bars', 'Endless Practice',
      ];
      const track = document.getElementById('ticker-track');
      [...words, ...words].forEach(t => {
        const s = document.createElement('span');
        s.className = 'ticker-item';
        s.textContent = t;
        track.appendChild(s);
      });
    })();
    
    // ─────────────────────────────────────────────────────────
    // DROPDOWN LOGIC
    // ─────────────────────────────────────────────────────────
    function toggleDropdown(id) {
      const dd = document.getElementById(id);
      const isOpen = dd.classList.contains('open');
      document.querySelectorAll('.pp-dropdown.open').forEach(el => el.classList.remove('open'));
      if (!isOpen) dd.classList.add('open');
    }
    
    document.addEventListener('click', e => {
      if (!e.target.closest('.pp-dropdown'))
        document.querySelectorAll('.pp-dropdown.open').forEach(el => el.classList.remove('open'));
    });
    
    document.querySelectorAll('.pp-dropdown-list').forEach(list => {
      list.addEventListener('click', e => {
        const item = e.target.closest('.pp-dropdown-item');
        if (!item) return;
        const dd = item.closest('.pp-dropdown');
        const value = item.dataset.value;
        
        list.querySelectorAll('.pp-dropdown-item').forEach(i => i.classList.remove('selected'));
        item.classList.add('selected');
        dd.querySelector('.dd-selected').textContent = item.textContent.trim();
        dd.classList.remove('open');
        
        if (dd.id === 'dd-mode') settings.mode = value;
        if (dd.id === 'dd-parts') settings.parts = parseInt(value, 10);
        if (dd.id === 'dd-type') settings.type = value;
      });
    });
    
    // ─────────────────────────────────────────────────────────
    // SCRIPT LOADER (once)
    // ─────────────────────────────────────────────────────────
    function loadScript(src) {
      return new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = src;
        s.onload = resolve;
        s.onerror = () => reject(new Error('Script failed: ' + src));
        document.body.appendChild(s);
      });
    }
    
    // ─────────────────────────────────────────────────────────
    // SHADOW DOM FIX
    //
    // Problem: Polypad attaches a shadow root to the host element.
    // pad.destroy() removes JS state/listeners but does NOT detach
    // the shadow root from the DOM — calling Polypad.create() on
    // the same element again conflicts with the orphaned shadow DOM.
    //
    // Fix:
    //   1. pad.destroy()  — clean up JS
    //   2. hostEl.remove() — removes the element from the DOM tree,
    //      detaching its shadow root so the GC can collect it
    //   3. Create a brand-new <div> — pristine, no shadow root
    //   4. Polypad.create() on the fresh element — no conflicts
    // ─────────────────────────────────────────────────────────
    function nukePad() {
      if (pad) {
        try { pad.destroy(); } catch (_) {}
        pad = null;
      }
      // Step 2: remove from DOM — this is the critical step that kills
      // the shadow root; without it the orphaned shadow persists in memory
      const existing = document.getElementById('polypad');
      if (existing) existing.remove();
    }
    
    function freshHost() {
      // Step 3: brand-new element, completely untouched by Polypad
      const div = document.createElement('div');
      div.id = 'polypad';
      div.style.cssText = 'width:100%;height:100%;position:absolute;inset:0;';
      const wrap = document.getElementById('polypad-wrap');
      // Insert before loader so it sits behind the overlay in z-order
      wrap.insertBefore(div, wrap.querySelector('#pp-loader'));
      return div;
    }
    
    // ─────────────────────────────────────────────────────────
    // QUESTION GENERATION
    // ─────────────────────────────────────────────────────────
    function generateQuestion() {
      const denom = settings.parts;
      const active = Math.floor(Math.random() * (denom - 1)) + 1; // 1 to denom-1
      return { active, denominator: denom };
    }
    
    function getCorrectAnswer(active, denominator, mode) {
      switch (mode) {
        case 'fractions':
          return `${active}/${denominator}`;
        case 'percents': {
          const pct = (active / denominator) * 100;
          return Number.isInteger(pct) ?
            pct.toString() :
            (Math.round(pct * 10) / 10).toString();
        }
        case 'degrees':
          return Math.round((active / denominator) * 360).toString();
        case 'decimals': {
          // Max 4 decimal places, strip trailing zeros
          return parseFloat((active / denominator).toFixed(4)).toString();
        }
      }
    }
    
    function isCorrect(raw, correctVal, mode) {
      const clean = raw.replace(/[°%\s]/g, '').toLowerCase();
      const target = correctVal.replace(/[°%\s]/g, '').toLowerCase();
      
      if (mode === 'fractions') return clean === target;
      
      const userNum = parseFloat(clean);
      const targNum = parseFloat(target);
      if (isNaN(userNum) || isNaN(targNum)) return false;
      
      const tolerance = mode === 'decimals' ? 0.005 : 1;
      return Math.abs(userNum - targNum) <= tolerance;
    }
    
    function displayAnswer(val, mode) {
      switch (mode) {
        case 'percents':
          return val + '%';
        case 'degrees':
          return val + '°';
        default:
          return val;
      }
    }
    
    // ─────────────────────────────────────────────────────────
    // LOAD QUESTION ONTO CANVAS
    // ─────────────────────────────────────────────────────────
    async function loadQuestion(q) {
      if (isLoading) return;
      isLoading = true;
      currentQ = q;
      
      const loader = document.getElementById('pp-loader');
      const loaderTxt = document.getElementById('pp-loader-text');
      const fb = document.getElementById('feedback-box');
      const input = document.getElementById('answer-input');
      const m = MODES[settings.mode];
      
      loader.classList.remove('hidden');
      fb.className = 'gp-feedback-box';
      fb.textContent = 'Study the shape and type your answer below.';
      input.value = '';
      
      document.getElementById('modal-title').textContent = m.modalQ;
      document.getElementById('format-hint').textContent = m.hint;
      document.getElementById('answer-input').placeholder = m.placeholder;
      document.getElementById('answer-label').textContent = m.label;
      
      try {
        // Load Polypad CDN script once
        if (!scriptReady) {
          loaderTxt.textContent = 'Loading Polypad…';
          await loadScript('https://static.mathigon.org/api/polypad-en-v5.0.5.js');
          scriptReady = true;
        }
        
        // Destroy + remove old host (shadow DOM fix)
        nukePad();
        
        // Inject fresh host element
        const host = freshHost();
        
        // Build tile — fully locked
        const tile = {
          name: settings.type,
          x: settings.type === 'fraction-bar' ? 200 : 400,
          y: 1200,
          denominator: q.denominator,
          active: q.active,
          labels: m.polypadLabel,
          size: settings.type === 'fraction-bar' ? 6 : 8,
          status: 'locked', // no interaction whatsoever
          hideHandles: true,
        };
        
        loaderTxt.textContent = 'Building canvas…';
        
        // Polypad.create returns a Promise — must be awaited
        pad = await Polypad.create(host, {
          sidebarTiles: false,
          sidebarSettings: false,
          toolbar: false,
          noCopyPaste: true,
          noDeleting: true,
          noRotating: true,
          noSnapping: true,
          initial: {
            options: { grid: 'square-grid', background: '#ffffff' },
            tiles: { t1: tile },
          },
        });
        
        pad.setTool('move');
        loader.classList.add('hidden');
        input.focus();
        
      } catch (err) {
        console.error('Polypad error:', err);
        loader.innerHTML = `
          <div style="text-align:center;padding:24px;font-family:var(--font-mono);
               font-size:.75rem;color:var(--red);">
            <strong>Canvas failed to load.</strong><br/>${err.message}
          </div>`;
      } finally {
        isLoading = false;
      }
    }
    
    // ─────────────────────────────────────────────────────────
    // SESSION OPEN / CLOSE
    // ─────────────────────────────────────────────────────────
    function startSession() {
      streak = 0;
      syncStats();
      document.getElementById('polypad-modal').classList.add('active');
      document.body.style.overflow = 'hidden';
      loadQuestion(generateQuestion());
    }
    
    function closeModal() {
      document.getElementById('polypad-modal').classList.remove('active');
      document.body.style.overflow = '';
      nukePad();
    }
    
    // ─────────────────────────────────────────────────────────
    // ANSWER CHECKING
    // ─────────────────────────────────────────────────────────
    function checkAnswer() {
      if (!currentQ || isLoading) return;
      
      const raw = document.getElementById('answer-input').value.trim();
      const fb = document.getElementById('feedback-box');
      
      if (!raw) {
        fb.className = 'gp-feedback-box fb-error';
        fb.textContent = 'Type your answer first.';
        return;
      }
      
      const correct = getCorrectAnswer(currentQ.active, currentQ.denominator, settings.mode);
      
      if (isCorrect(raw, correct, settings.mode)) {
        streak++;
        totalSolved++;
        syncStats();
        
        fb.className = 'gp-feedback-box fb-success';
        fb.textContent = `✓ Correct! The answer is ${displayAnswer(correct, settings.mode)}. Next question…`;
        
        // Green flash on canvas
        const flash = document.getElementById('correct-flash');
        flash.classList.add('show');
        setTimeout(() => flash.classList.remove('show'), 300);
        
        // Auto-advance
        setTimeout(() => loadQuestion(generateQuestion()), 850);
        
      } else {
        streak = 0;
        syncStats();
        fb.className = 'gp-feedback-box fb-error';
        fb.textContent = '✗ Not quite — count the shaded sections vs total sections carefully.';
        document.getElementById('answer-input').select();
      }
    }
    
    function syncStats() {
      document.getElementById('modal-streak').textContent =
        streak === 0 ? '0 in a row' : `🔥 ${streak} in a row`;
      document.getElementById('stat-streak').textContent = streak;
      document.getElementById('stat-total').textContent = totalSolved;
    }
    
    // ─────────────────────────────────────────────────────────
    // KEYBOARD
    // ─────────────────────────────────────────────────────────
    document.getElementById('answer-input').addEventListener('keydown', e => {
      if (e.key === 'Enter') checkAnswer();
    });
    
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' &&
        document.getElementById('polypad-modal').classList.contains('active')) {
        closeModal();
      }
    });