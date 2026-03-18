    /* ═══════════════════════════════════════════
       CONFIG
    ═══════════════════════════════════════════ */
    const p1 = "gsk_9sz5p";
    const p2 = "0Vrwv8chiknSBrJW";
    const p3 = "Gdyb3FYnQIifcPYSc9";
    const p4 = "Dhi1tMvB8VmAh";
    const GROQ_KEY = p1 + p2 + p3 + p4;
    const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
    
    /* ═══════════════════════════════════════════
       TOPIC MAP
    ═══════════════════════════════════════════ */
    const topicMap = {
      'one-step': 'simple one-step linear equations, e.g. x + 5 = 12, x - 3 = 7, 4x = 20, x/3 = 4',
      'two-step': 'two-step equations, e.g. 2x + 3 = 11, 4x - 5 = 19, x/3 + 2 = 6, 3(x-1) = 12',
      'both-sides': 'equations with variables on both sides, e.g. 3x + 2 = x + 10, 5x - 4 = 2x + 8',
      'fractions': 'equations involving fractions, e.g. x/2 + 3 = 7, (2x+1)/3 = 5, x/4 - 1 = 2',
      'decimals': 'equations involving decimal coefficients or constants, e.g. 1.5x + 2.3 = 8, 0.4x - 1.2 = 2.4',
      'mixed-number': 'equations where answers may be mixed numbers or improper fractions, e.g. x/4 + 1 = 3/2, 2x - 1/3 = 5/6',
      'quadratic': 'simple factorable quadratic equations, e.g. x^2 - 5x + 6 = 0, x^2 + 3x - 10 = 0',
      'diff-squares': 'difference of two squares, e.g. x^2 - 9 = 0, 4x^2 - 25 = 0, x^2 - 16 = 0',
      'completing-square': 'completing the square to solve quadratics, e.g. x^2 + 6x + 5 = 0, x^2 - 4x - 12 = 0',
      'inequalities': 'simple linear inequalities, e.g. 2x + 3 > 7, 4x - 1 <= 11, x/2 >= 3',
      'compound-ineq': 'compound inequalities, e.g. -3 < 2x + 1 < 9, 1 <= 3x - 2 <= 10',
      'abs-value-ineq': 'absolute value inequalities, e.g. |x - 3| < 5, |2x + 1| >= 7',
      'age-problems': 'age word problems translated into a linear equation, e.g. Sam is 3 times as old as Tim; in 4 years their ages sum to 36',
      'speed-distance': 'speed-distance-time word problems resulting in a linear equation, e.g. two trains leave at the same time, one at 60 km/h and one at 90 km/h',
      'mixture': 'mixture or concentration word problems resulting in a linear equation, e.g. mix a 20% solution with a 50% solution to get 30 litres at 35%',
      'substitution': 'pair of simultaneous linear equations solved by substitution, e.g. y = 2x - 1 and 3x + y = 14',
      'elimination': 'pair of simultaneous linear equations solved by elimination, e.g. 2x + 3y = 12 and 4x - y = 10',
      'graphical': 'pair of simultaneous linear equations that represent two straight lines meeting at a point, e.g. x + y = 5 and x - y = 1',
    };
    
    const topicLabels = {
      'one-step': 'One-Step',
      'two-step': 'Two-Step',
      'both-sides': 'Both Sides',
      'fractions': 'Fractions',
      'decimals': 'Decimals',
      'mixed-number': 'Mixed Numbers',
      'quadratic': 'Factoring',
      'diff-squares': 'Diff. of Squares',
      'completing-square': 'Complete the Square',
      'inequalities': 'Inequalities',
      'compound-ineq': 'Compound Ineq.',
      'abs-value-ineq': 'Abs. Value Ineq.',
      'age-problems': 'Age Problems',
      'speed-distance': 'Speed & Distance',
      'mixture': 'Mixture',
      'substitution': 'Substitution',
      'elimination': 'Elimination',
      'graphical': 'Graphical',
    };
    
    /* ═══════════════════════════════════════════
       STEP CONSTRAINTS — strict per-topic rules
       injected into the prompt so the model
       cannot exceed the correct complexity
    ═══════════════════════════════════════════ */
    const topicSteps = {
      'one-step': 'EXACTLY 1 operation to isolate x. E.g. "x + 7 = 15" (subtract once) or "3x = 18" (divide once). DO NOT add a second operation.',
      'two-step': 'EXACTLY 2 operations to isolate x. E.g. "2x + 3 = 11" (subtract, then divide). No more, no fewer.',
      'both-sides': 'Variable appears on BOTH sides; 2–3 steps: collect variable terms, then isolate. E.g. "5x - 4 = 2x + 8".',
      'fractions': 'Equation contains a fraction coefficient or constant; 2–3 steps: clear fraction, then isolate. E.g. "x/3 + 2 = 6".',
      'decimals': 'Coefficients or constants are decimals; 2 steps max. E.g. "1.5x + 2 = 8".',
      'mixed-number': 'Answer is a fraction or mixed number; 2 steps. E.g. "4x - 1 = 3/2".',
      'quadratic': 'Factorable quadratic in the form ax^2 + bx + c = 0. Solve by factoring only — do NOT use the quadratic formula.',
      'diff-squares': 'Form x^2 - k = 0 or ax^2 - b = 0. Solve by recognising the difference of two squares.',
      'completing-square': 'Quadratic solved by completing the square only. E.g. "x^2 + 6x - 7 = 0".',
      'inequalities': 'Simple linear inequality; 1–2 steps. E.g. "3x - 4 > 8". Remember to flip the sign if dividing by a negative.',
      'compound-ineq': 'Compound inequality of the form a < bx + c < d; 2 steps. E.g. "-1 < 2x + 3 < 9".',
      'abs-value-ineq': 'Absolute value inequality of the form |ax + b| < c or |ax + b| > c.',
      'age-problems': 'Word problem → single linear equation → solve in 2–3 steps. Return a "problem" field with the word problem as a plain English sentence. The "eq" field must contain the equation only, not the word problem.',
      'speed-distance': 'Word problem → single linear equation → solve in 2–3 steps. Return a "problem" field with the word problem as a plain English sentence. The "eq" field must contain the equation only.',
      'mixture': 'Word problem → single linear equation → solve in 2–3 steps. Return a "problem" field with the word problem as a plain English sentence. The "eq" field must contain the equation only.',
      'substitution': 'Two simultaneous linear equations solved by substitution. "eq" must contain BOTH equations separated by a comma, e.g. "y=2x-1,3x+y=14".',
      'elimination': 'Two simultaneous linear equations solved by elimination. "eq" must contain BOTH equations separated by a comma.',
      'graphical': 'Two simultaneous linear equations that intersect at one point. "eq" must contain BOTH equations separated by a comma.',
    };
    
    /* ═══════════════════════════════════════════
       METHOD DESCRIPTIONS FOR PROMPT
    ═══════════════════════════════════════════ */
    const methodHintInstruction = {
      'transfer': `Write the hint using the TRANSFER METHOD: describe moving a term across the equals sign with a sign change. ` +
        `E.g. "Transfer the +3 to the right side where it becomes −3, giving x = 7 − 3 = 4."`,
      'balancing': `Write the hint using the BALANCING METHOD: describe performing the same operation on BOTH sides. ` +
        `E.g. "Subtract 3 from both sides: x + 3 − 3 = 7 − 3, so x = 4."`
    };
    
    /* GM drag_mode per method */
    const methodDragMode = {
      'transfer': 'drag_and_simplify',
      'balancing': 'drag',
    };
    
    /* ═══════════════════════════════════════════
       STATE
    ═══════════════════════════════════════════ */
    let currentTopic = 'one-step';
    let currentMethod = 'transfer';
    let gmReady = false;
    let gmCanvas = null;
    let pendingEq = null;
    let currentAnswer = null;
    let sessionCount = 0;
    let overlayOpen = false;
    let isSolved = false;
    
    /* Track last 5 equations to force variety in the prompt */
    const recentEquations = [];
    
    /* Topics that produce a word problem — eq goes to GM, prose shown as GM text */
    const wordProblemTopics = new Set(['age-problems', 'speed-distance', 'mixture']);
    
    /* ═══════════════════════════════════════════
       GRASPABLE MATH INIT
       Dark theme MUST be set before any Canvas()
    ═══════════════════════════════════════════ */
    loadGM(function() {
      gmath.setDarkTheme(true);
      gmReady = true;
      if (pendingEq) {
        const eq = pendingEq;
        pendingEq = null;
        requestAnimationFrame(() => requestAnimationFrame(() => mountEquation(eq)));
      }
    }, { version: 'latest' });
    
    /* ═══════════════════════════════════════════
       ACCORDION
    ═══════════════════════════════════════════ */
    function toggleAccordion(groupId) {
      const group = document.getElementById(groupId);
      const header = group.querySelector('.accordion-header');
      const body = group.querySelector('.accordion-body');
      const isOpen = header.classList.contains('open');
      
      document.querySelectorAll('.accordion-header').forEach(h => h.classList.remove('open'));
      document.querySelectorAll('.accordion-body').forEach(b => b.classList.remove('open'));
      
      if (!isOpen) {
        header.classList.add('open');
        body.classList.add('open');
      }
    }
    
    function updateGroupHighlight() {
      document.querySelectorAll('.accordion-group').forEach(g => {
        const hasActive = g.querySelector('.topic-chip.active');
        g.classList.toggle('has-active', !!hasActive);
      });
    }
    
    /* ═══════════════════════════════════════════
       TOPIC
    ═══════════════════════════════════════════ */
    function setTopic(btn) {
      document.querySelectorAll('.topic-chip').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentTopic = btn.dataset.topic;
      updateGroupHighlight();
      
      const group = btn.closest('.accordion-group');
      const header = group.querySelector('.accordion-header');
      const body = group.querySelector('.accordion-body');
      document.querySelectorAll('.accordion-header').forEach(h => h.classList.remove('open'));
      document.querySelectorAll('.accordion-body').forEach(b => b.classList.remove('open'));
      header.classList.add('open');
      body.classList.add('open');
    }
    
    /* ═══════════════════════════════════════════
       METHOD
    ═══════════════════════════════════════════ */
    function setMethod(btn) {
      document.querySelectorAll('.method-chip').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentMethod = btn.dataset.method;
      
      const tag = document.getElementById('method-mode-tag');
      if (currentMethod === 'transfer') {
        tag.className = 'method-mode-tag transfer';
        tag.textContent = 'Drag & Simplify';
      } else {
        tag.className = 'method-mode-tag balancing';
        tag.textContent = 'Drag Only';
      }
    }
    
    /* ═══════════════════════════════════════════
       OVERLAY CONTROL
    ═══════════════════════════════════════════ */
    function openOverlay() {
      overlayOpen = true;
      const ov = document.getElementById('fs-overlay');
      ov.style.pointerEvents = ''; // restore clicks
      ov.classList.add('open');
      document.getElementById('open-fab').classList.remove('visible');
      document.body.style.overflow = 'hidden';
    }
    
    function closeOverlay() {
      overlayOpen = false;
      const ov = document.getElementById('fs-overlay');
      ov.classList.remove('open');
      ov.style.pointerEvents = 'none'; // stop overlay eating clicks
      if (sessionCount > 0) document.getElementById('open-fab').classList.add('visible');
      document.body.style.overflow = '';
    }
    
    function toggleOverlay() {
      overlayOpen ? closeOverlay() : openOverlay();
    }
    
    /* ═══════════════════════════════════════════
       VARIETY SEED — random integers injected
       into the prompt each time so the model
       can't fall back on the same equation shape
    ═══════════════════════════════════════════ */
    function randInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    function buildVarietySeed() {
      const a = randInt(2, 13);
      const b = randInt(1, 20);
      const c = randInt(1, 15);
      const x = randInt(-9, 9) || 2; // avoid 0 as answer
      return { a, b, c, x };
    }
    
    /* ═══════════════════════════════════════════
       GENERATE — 1 equation from Groq
    ═══════════════════════════════════════════ */
    async function generateQuestion() {
      const pageBtn = document.getElementById('gen-btn');
      const fsBtn = document.getElementById('fs-new-btn');
      pageBtn.classList.add('loading');
      pageBtn.disabled = true;
      fsBtn.classList.add('loading');
      fsBtn.disabled = true;
      showStatus('info', '⟳ PrepBot is generating your equation…');
      
      const methodLabel = currentMethod === 'transfer' ? 'Transfer' : 'Balancing';
      const seed = buildVarietySeed();
      const avoidClause = recentEquations.length ?
        `\nDo NOT reuse any of these recent equations: ${recentEquations.join(' | ')}` :
        '';
      const isWordProblem = wordProblemTopics.has(currentTopic);
      const stepRule = topicSteps[currentTopic];
      
      const prompt =
        `You are PrepBot, an algebra tutor. Generate exactly 1 equation for the topic: ${topicLabels[currentTopic]}.

COMPLEXITY RULE (MOST IMPORTANT — do not violate this):
${stepRule}

${methodHintInstruction[currentMethod]}

VARIETY RULES:
- Use these seed values so the equation is different each time: a=${seed.a}, b=${seed.b}, c=${seed.c}, target answer≈${seed.x}
- Vary signs and structure — use negative coefficients or answers sometimes${avoidClause}

Return ONLY a valid JSON object — no markdown, no explanation:
- "eq": clean ASCII string parseable by Graspable Math (use +, -, *, /, =, >, <; no LaTeX; use * for multiplication)
- "answer": solved form with no spaces, e.g. "x=4", "x>9/5", "x=-3/2"
- "hint": one sentence following the method instruction above
${isWordProblem ? '- "problem": the word problem as a plain English sentence (no equations here)' : ''}

Examples:
{"eq": "x + 7 = 15", "answer": "x=8", "hint": "Transfer +7 to the right as −7."}
{"eq": "3x = 18", "answer": "x=6", "hint": "Divide both sides by 3."}
{"eq": "2x + 3 = 11", "answer": "x=4", "hint": "Subtract 3 from both sides, then divide by 2."}
{"eq": "5x - 2 > 7", "answer": "x>9/5", "hint": "Transfer −2 to the right as +2, giving 5x > 9."}`;
      
      try {
        const res = await fetch(GROQ_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${GROQ_KEY}`
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            temperature: 1.0,
            max_tokens: 220,
            messages: [
              { role: 'system', content: 'You are PrepBot. Respond with raw JSON only, no markdown.' },
              { role: 'user', content: prompt }
            ]
          })
        });
        
        if (!res.ok) throw new Error(`API error ${res.status}`);
        const data = await res.json();
        const raw = data?.choices?.[0]?.message?.content || '';
        const clean = raw.replace(/```json|```/gi, '').trim();
        const q = JSON.parse(clean);
        if (!q.eq) throw new Error('No equation in response');
        
        // Remember this equation (keep last 5)
        recentEquations.push(q.eq);
        if (recentEquations.length > 5) recentEquations.shift();
        
        currentAnswer = (q.answer || '').replace(/\s/g, '');
        
        hideStatus();
        sessionCount++;
        
        isSolved = false;
        document.getElementById('fs-canvas-wrap').classList.remove('solved');
        
        document.getElementById('fs-topic-badge').textContent = topicLabels[currentTopic];
        document.getElementById('fs-method-badge').textContent = methodLabel;
        document.getElementById('fs-eq-label').textContent = q.eq;
        document.getElementById('fs-hint-text').textContent = q.hint;
        
        document.getElementById('stat-count').textContent = sessionCount;
        document.getElementById('stat-topic').textContent = topicLabels[currentTopic];
        document.getElementById('page-placeholder').style.display = 'none';
        
        openOverlay();
        
        /* Store word problem prose for mountEquation to pick up */
        window.__currentWordProblem = (isWordProblem && q.problem) ? q.problem : null;
        
        if (gmReady) {
          requestAnimationFrame(() => requestAnimationFrame(() => mountEquation(q.eq)));
        } else {
          pendingEq = q.eq;
        }
        
      } catch (err) {
        showStatus('error', `PrepBot error: ${err.message}`);
        console.error(err);
      }
      
      pageBtn.classList.remove('loading');
      pageBtn.disabled = false;
      fsBtn.classList.remove('loading');
      fsBtn.disabled = false;
    }
    
    /* ═══════════════════════════════════════════
       MOUNT EQUATION INTO GM CANVAS
    ═══════════════════════════════════════════ */
    function mountEquation(eq) {
      const wrap = document.getElementById('fs-canvas-wrap');
      const canvasEl = document.getElementById('gm-fs-canvas');
      
      if (gmCanvas) {
        try { gmCanvas.remove(); } catch (e) {}
        gmCanvas = null;
      }
      canvasEl.innerHTML = '';
      const old = wrap.querySelector('.eq-fallback-fs');
      if (old) old.remove();
      
      try {
        gmCanvas = new gmath.Canvas('#gm-fs-canvas', {
          undo_btn: true,
          redo_btn: true,
          new_sheet_btn: false,
          font_size_btns: false,
          formula_btn: false,
          help_btn: false,
          help_logo_btn: false,
          fullscreen_toolbar_btn: false,
          fullscreen_btn: false,
          transform_btn: true,
          keypad_btn: false,
          scrub_btn: false,
          draw_btn: false,
          erase_btn: false,
          arrange_btn: true,
          reset_btn: false,
          save_btn: false,
          load_btn: false,
          settings_btn: true,
          insert_btn: true,
          insert_menu_items: {
            derivation: true,
            function: true,
            textbox: false,
          },
          use_hold_menu: false,
          display_labels: false,
          btn_size: 'xs',
          ask_confirmation_on_closing: false,
          
          vertical_scroll: true,
          allow_fullscreen: false,
          drag_mode: methodDragMode[currentMethod],
          use_degrees: true,
          show_balance_button: false,
          substitute_parentheses: true,
          auto_simplify_distribute: true,
          add_like_fractions: true,
          show_ellipsis: true,
          multiplication_sign: 'times',
          hide_multiplication: 'hide_where_possible',
          // No background_color — dark theme handles it
        });
        
        /* Responsive font size */
        const fontSize = window.innerWidth < 480 ? 26 :
          window.innerWidth < 768 ? 32 :
          36;
        gmCanvas.controller.set_font_size(fontSize);
        
        /* Word problem: render prose as a GM text element above the derivation */
        if (window.__currentWordProblem) {
          gmCanvas.model.createElement('text', {
            content: window.__currentWordProblem,
            pos: { x: 'center', y: 30 },
          });
        }
        
        const derivation = gmCanvas.model.createElement('derivation', {
          eq: eq,
          pos: { x: 'center', y: window.__currentWordProblem ? 160 : 100 },
        });
        
        /* Enable auto-simplify on the derivation element */
        if (derivation && typeof derivation.enableAutoSimplify === 'function') {
          derivation.enableAutoSimplify();
        }
        
        /* ── Solved detection ─────────────────────────────────────
           Confirmed-working GM pattern: canvas.model.on('el_changed')
           evt.last_eq holds the current equation string
        ────────────────────────────────────────────────────────── */
        gmCanvas.model.on('el_changed', function(evt) {
          if (isSolved || !currentAnswer || !evt || !evt.last_eq) return;
          console.log('[GM] last_eq:', evt.last_eq, '| expected:', currentAnswer);
          if (normaliseEq(evt.last_eq) === normaliseEq(currentAnswer)) {
            isSolved = true;
            document.getElementById('fs-canvas-wrap').classList.add('solved');
            gmCanvas.showHint('✓ Correct! Well done!');
          }
        });
        
      } catch (e) {
        canvasEl.innerHTML = '';
        const fb = document.createElement('div');
        fb.className = 'eq-fallback-fs';
        fb.textContent = eq;
        wrap.appendChild(fb);
        console.warn('GM render failed:', eq, e);
      }
    }
    
    /* ═══════════════════════════════════════════
       NORMALISE — makes evt.last_eq comparable
       to the bot answer regardless of spacing,
       parens, or unicode inequality symbols
    ═══════════════════════════════════════════ */
    function normaliseEq(str) {
      return (str || '')
        .replace(/\s/g, '')
        .replace(/[()]/g, '')
        .replace(/≤/g, '<=')
        .replace(/≥/g, '>=')
        .toLowerCase();
    }
    
    /* ═══════════════════════════════════════════
       HELPERS
    ═══════════════════════════════════════════ */
    function showStatus(type, msg) {
      const bar = document.getElementById('status-bar');
      bar.className = `status-bar ${type}`;
      bar.textContent = msg;
    }
    
    function hideStatus() {
      document.getElementById('status-bar').className = 'status-bar';
    }
    
    /* Init */
    updateGroupHighlight();
    
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && overlayOpen) closeOverlay();
    });