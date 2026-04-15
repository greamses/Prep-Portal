
    // ── Questions ──────────────────────────────────────────────
    // fraction-circle: denominator = total parts, active = shaded parts
    const QUESTIONS = [
    {
      label: 'Q1 — What fraction does the circle show?',
      topic: 'Halves',
      denominator: 2,
      active: 1,
      answer: '1/2',
      hint: 'The circle is split into 2 equal parts. 1 is shaded.',
    },
    {
      label: 'Q2 — Identify the shaded fraction (thirds).',
      topic: 'Thirds',
      denominator: 3,
      active: 2,
      answer: '2/3',
      hint: 'The circle is split into 3 equal parts. 2 are shaded.',
    },
    {
      label: 'Q3 — What fraction is shaded? (quarters)',
      topic: 'Quarters',
      denominator: 4,
      active: 3,
      answer: '3/4',
      hint: 'The circle is split into 4 equal parts. 3 are shaded.',
    },
    {
      label: 'Q4 — Name the fraction shown (sixths).',
      topic: 'Sixths',
      denominator: 6,
      active: 4,
      answer: '4/6',
      acceptAlso: ['2/3'],
      hint: 'The circle is split into 6 equal parts. 4 are shaded. (Also written as 2/3.)',
    },
    {
      label: 'Q5 — Identify the shaded fraction (eighths).',
      topic: 'Eighths',
      denominator: 8,
      active: 5,
      answer: '5/8',
      hint: 'The circle is split into 8 equal parts. 5 are shaded.',
    }, ];
    
    // ── State ──────────────────────────────────────────────────
    let pad = null; // Polypad instance
    let scriptReady = false; // CDN script loaded?
    let currentQ = 0;
    let solved = 0;
    const doneSet = new Set();
    
    // ── Ticker ─────────────────────────────────────────────────
    const TICKER_ITEMS = [
      'Fraction Explorer', 'JSS 1–3', 'Visual Fractions',
      'Prep Portal 2026', 'Interactive Math', 'Halves · Thirds · Quarters',
    ];
    (function buildTicker() {
      const track = document.getElementById('ticker-track');
      const doubled = [...TICKER_ITEMS, ...TICKER_ITEMS];
      doubled.forEach(t => {
        const span = document.createElement('span');
        span.className = 'ticker-item';
        span.textContent = t;
        track.appendChild(span);
      });
    })();
    
    // ── Dynamic script loader ──────────────────────────────────
    function loadScript(src) {
      return new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = src;
        s.onload = resolve;
        s.onerror = () => reject(new Error('Failed to load: ' + src));
        document.body.appendChild(s);
      });
    }
    
    // ── Load Polypad for a given question ──────────────────────
    async function loadQuestion(qIndex) {
      const q = QUESTIONS[qIndex];
      
      // Update modal title + stat
      document.getElementById('modal-title').textContent = q.label;
      document.getElementById('stat-topic').textContent = q.topic;
      
      // Reset feedback + input
      const fb = document.getElementById('feedback-box');
      fb.className = 'gp-feedback-box';
      fb.textContent = 'Look at the shaded part of the circle and type the fraction below.';
      document.getElementById('answer-input').value = '';
      document.getElementById('answer-input').focus();
      
      const loader = document.getElementById('pp-loader');
      loader.classList.remove('hidden');
      
      try {
        // 1. Load CDN script once
        if (!scriptReady) {
          loader.querySelector('.pp-loader-text').textContent = 'Loading Polypad…';
          await loadScript('https://static.mathigon.org/api/polypad-en-v5.0.5.js');
          scriptReady = true;
        }
        
        // 2. Destroy previous instance cleanly
        if (pad) {
          try { pad.destroy(); } catch (_) {}
          pad = null;
        }
        
        // 3. Build initial state
        const initialState = {
          options: {
            grid: 'square-grid',
            background: '#ffffff',
          },
          tiles: {
            'fc1': {
              name: 'fraction-circle',
              x: 400,
              y: 1200,
              denominator: q.denominator,
              active: q.active,
              labels: 'hidden',
              size: 8,
            },
          },
        };
        
        // 4. Create new instance — Polypad.create returns a Promise
        loader.querySelector('.pp-loader-text').textContent = 'Building canvas…';
        pad = await Polypad.create(document.querySelector('#polypad'), {
          sidebarTiles: false,
          sidebarSettings: false,
          toolbar: true,
          canvas: 'fixed',
          initial: initialState,
        });
        
        pad.setTool('move');
        
        loader.classList.add('hidden');
        
      } catch (err) {
        console.error('Polypad error:', err);
        loader.innerHTML = `
          <div style="text-align:center;padding:24px;font-family:var(--font-mono);font-size:.75rem;color:#ff2200;">
            <strong>Canvas failed to load.</strong><br/>${err.message}
          </div>`;
      }
    }
    
    // ── Open / Close modal ─────────────────────────────────────
    function openModal(qIndex) {
      currentQ = qIndex;
      document.getElementById('polypad-modal').classList.add('active');
      document.body.style.overflow = 'hidden';
      loadQuestion(qIndex);
    }
    
    function closeModal() {
      document.getElementById('polypad-modal').classList.remove('active');
      document.body.style.overflow = '';
    }
    
    // ── Next question ──────────────────────────────────────────
    function nextQuestion() {
      const next = (currentQ + 1) % QUESTIONS.length;
      openModal(next);
    }
    
    // ── Check answer ───────────────────────────────────────────
    function checkAnswer() {
      const q = QUESTIONS[currentQ];
      const raw = document.getElementById('answer-input').value.trim().toLowerCase();
      const fb = document.getElementById('feedback-box');
      
      if (!raw) {
        fb.className = 'gp-feedback-box fb-error';
        fb.textContent = 'Please type your answer first.';
        return;
      }
      
      const correct = normalise(raw) === normalise(q.answer) ||
        (q.acceptAlso || []).some(alt => normalise(raw) === normalise(alt));
      
      if (correct) {
        fb.className = 'gp-feedback-box fb-success';
        fb.textContent = `✓ Correct! The fraction is ${q.answer}. ${q.hint}`;
        if (!doneSet.has(currentQ)) {
          doneSet.add(currentQ);
          solved++;
          document.getElementById('stat-solved').textContent = solved;
          // Mark question item done on entry page
          const item = document.querySelector(`.q-item[data-q="${currentQ}"]`);
          if (item) item.classList.add('q-done');
        }
      } else {
        fb.className = 'gp-feedback-box fb-error';
        fb.textContent = `✗ Not quite. Look at the number of shaded sections vs total sections.`;
      }
    }
    
    // Normalise answer: strip spaces, handle "1 / 2" → "1/2"
    function normalise(str) {
      return str.replace(/\s+/g, '').toLowerCase();
    }
    
    // Enter key submits
    document.getElementById('answer-input').addEventListener('keydown', e => {
      if (e.key === 'Enter') checkAnswer();
    });
    
    // Escape key closes modal
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeModal();
    });
  