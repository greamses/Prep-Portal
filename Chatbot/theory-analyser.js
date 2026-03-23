/* ═══════════════════════════════════════════════════════
   THEORY ANALYSER  v6.2 (Fixed Math Preservation & Line Breaks)
   Multi-question · Auto-gen · Level-calibrated · Print-exact
   ─────────────────────────────────────────────────────
   TheoryAnalyser.init({ geminiKey, subject, level, mountId?, onResult? })
   await TheoryAnalyser.generateQuestions(count, signal?)
   await TheoryAnalyser.analyse(answer, question, maxMarks?)
   TheoryAnalyser.reconfigure(partial)
═══════════════════════════════════════════════════════ */
(function(global) {
  'use strict';
  
  let _cfg = null,
    _midx = 0;
  
  const MODELS = [
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent',
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-pro-preview:generateContent',
    'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash-lite:generateContent',
    'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent',
    'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-pro:generateContent',
  ];
  const QUOTA = new Set([429, 503, 529]);
  
  /* ─── Gemini post ─── */
  async function _post(body) {
    for (let i = _midx; i < MODELS.length; i++) {
      let res;
      try {
        res = await fetch(`${MODELS[i]}?key=${_cfg.geminiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
      } catch (e) { console.warn('[TA] Network error, trying next model'); continue; }
      if (QUOTA.has(res.status)) { _midx = i + 1; continue; }
      if (!res.ok) throw new Error(`API ${res.status}: ${await res.text().catch(() => '')}`);
      _midx = i;
      return await res.json();
    }
    _midx = 0;
    throw new Error('All Gemini models are over quota. Please try again later.');
  }
  
  function _esc(s) {
    return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  
  // Helper function to preserve math delimiters while escaping HTML
  function _preserveMathAndEscape(text) {
    if (!text) return '';
    
    let result = '';
    let inMath = false;
    let mathBuffer = '';
    let regularBuffer = '';
    
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const nextChar = text[i + 1];
      
      // Check for $ delimiter
      if (char === '$' && !inMath) {
        if (regularBuffer) {
          result += _esc(regularBuffer);
          regularBuffer = '';
        }
        inMath = true;
        mathBuffer = '$';
      }
      else if (char === '$' && inMath) {
        mathBuffer += '$';
        result += mathBuffer;
        mathBuffer = '';
        inMath = false;
      }
      // Check for \( delimiter
      else if (char === '\\' && nextChar === '(' && !inMath) {
        if (regularBuffer) {
          result += _esc(regularBuffer);
          regularBuffer = '';
        }
        inMath = true;
        mathBuffer = '$';
        i++;
      }
      // Check for \) delimiter
      else if (char === '\\' && nextChar === ')' && inMath) {
        mathBuffer += '$';
        result += mathBuffer;
        mathBuffer = '';
        inMath = false;
        i++;
      }
      // Check for \[ delimiter
      else if (char === '\\' && nextChar === '[' && !inMath) {
        if (regularBuffer) {
          result += _esc(regularBuffer);
          regularBuffer = '';
        }
        inMath = true;
        mathBuffer = '$$';
        i++;
      }
      // Check for \] delimiter
      else if (char === '\\' && nextChar === ']' && inMath) {
        mathBuffer += '$$';
        result += mathBuffer;
        mathBuffer = '';
        inMath = false;
        i++;
      }
      else if (inMath) {
        mathBuffer += char;
      }
      else {
        regularBuffer += char;
      }
    }
    
    if (regularBuffer) result += _esc(regularBuffer);
    if (mathBuffer) result += mathBuffer;
    
    return result;
  }
  
  /* ─────────────────────────────────────────────────────
     STRIP MATHJAX XML AND EXTRACT CLEAN LATEX
  ─────────────────────────────────────────────────────── */
  function stripMathJaxXML(text) {
    if (!text) return text;
    let cleaned = text;
    
    // Instead of deleting the whole container, just strip the HTML tags 
    // but leave the text (which usually contains the raw LaTeX in assistive-mml)
    cleaned = cleaned.replace(/<[^>]+>/g, ' ');
    
    // Clean up HTML entities
    cleaned = cleaned.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&quot;/g, '"');
    
    return cleaned.trim();
  }
  
  /* ─────────────────────────────────────────────────────
     CLEAN MALFORMED MATH
  ─────────────────────────────────────────────────────── */
  function cleanMalformedMath(text) {
  if (!text) return text;
  
  // If the text already contains standard $ math delimiters, 
  // do NOT run the aggressive XML stripper on it.
  if (text.includes('$')) {
    return text.replace(/\\\[/g, '$$').replace(/\\\]/g, '$$').replace(/\\\(/g, '$').replace(/\\\)/g, '$');
  }
  
  // Otherwise, only perform light cleaning
  let cleaned = stripMathJaxXML(text);
  cleaned = cleaned.replace(/\\cdot\s*1([a-zA-Z])/g, '$1');
  return cleaned;
}
  
  function _parseJSON(raw) {
    let cleaned = stripMathJaxXML(raw);
    
    const s = cleaned.indexOf('{'),
      e = cleaned.lastIndexOf('}');
    if (s < 0 || e < 0) throw new Error('No JSON in AI response');
    
    
    
    // TO THIS (Safe preservation of \n and \r):
    let jsonStr = cleaned.slice(s, e + 1).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]+/g, '');
    
    jsonStr = jsonStr.replace(/\\\(/g, '$').replace(/\\\)/g, '$');
    jsonStr = jsonStr.replace(/\$\(([^)]+)\)\$/g, '$$1$');
    jsonStr = jsonStr.replace(/\$\s*\$\(([^)]+)\)\$\s*\$/g, '$$1$');
    // jsonStr = jsonStr.replace(/\$\$/g, '$');
    
    const parsed = JSON.parse(jsonStr);
    
    if (parsed.questions) {
      parsed.questions = parsed.questions.map(q => ({
        ...q,
        text: cleanMalformedMath(q.text)
      }));
    }
    
    if (parsed.questions) {
      parsed.questions = parsed.questions.map(q => ({
        ...q,
        annotatedText: q.annotatedText ? cleanMalformedMath(q.annotatedText) : q.annotatedText
      }));
    }
    
    return parsed;
  }
  
  /* ─────────────────────────────────────────────────────
     LEVEL PROFILE
  ─────────────────────────────────────────────────────── */
  function _levelProfile(level) {
    const l = (level || '').toLowerCase();
    
    const isMathSci = /math|physics|chemistry|science/i.test(_cfg.subject);
    const mathJaxRule = isMathSci ? "\n• MANDATORY: Use MathJax $syntax$ for ALL equations, formulas (e.g. $H_{2}SO_{4}$), and calculations." : "";
    
    if (/primary [123]|grade [123]|p\.?[123]/.test(l)) return {
      label: 'Infant / Lower Primary (Pry 1–3)',
      age: '5–9',
      maxDefault: 5,
      calibration: `
MARKING — INFANT LEVEL (age 5–9):
• Maximum generosity. One correct fact in any phrasing = FULL marks for that point.
• NEVER penalise for missing technical vocabulary.
• "Bones keep us standing" is fully correct for the skeletal system.
• Default maxMarks to 5 if not stated. Cap at 5 even if question says more.
• OUTSTANDING: student mentions 2+ facts unprompted, or uses age-advanced vocabulary.${mathJaxRule}`
    };
    if (/primary [45]|grade [45]|p\.?[45]/.test(l)) return {
      label: 'Lower Primary (Pry 4–5)',
      age: '9–11',
      maxDefault: 8,
      calibration: `
MARKING — LOWER PRIMARY (age 9–11):
• Definition alone earns 60% of marks. Full marks needs one example or extra fact.
• Accept informal but correct equivalents.
• Default maxMarks to 8 if not stated.
• OUTSTANDING: student structures answer and provides real-world example unprompted.${mathJaxRule}`
    };
    if (/primary 6|grade 6|p\.?6/.test(l)) return {
      label: 'Upper Primary (Pry 6)',
      age: '11–12',
      maxDefault: 10,
      calibration: `
MARKING — UPPER PRIMARY (age 11–12):
• Definition + one supporting point earns 70%. Full marks needs example or explanation.
• Default maxMarks to 10.
• OUTSTANDING: multi-point structured answer with application.${mathJaxRule}`
    };
    if (/jss/.test(l)) return {
      label: 'Junior Secondary (JSS)',
      age: '11–15',
      maxDefault: 10,
      calibration: `
MARKING — JSS (age 11–15):
• Definition earns ~40%. Full marks needs explanation + example.
• Technical terms expected; clear informal equivalents earn partial credit.
• Default maxMarks to 10.
• OUTSTANDING: analysis or cross-subject connection typical of SS level.${mathJaxRule}`
    };
    return {
      label: 'Senior Secondary (SS)',
      age: '15–19',
      maxDefault: 10,
      calibration: `
MARKING — SS (age 15–19):
• Definition alone earns only 20–30%. Full marks requires: definition + explanation + examples + analysis.
• Correct technical vocabulary required. Vague answers penalised even if correct.
• Default maxMarks to 10.
• OUTSTANDING: university-level depth, cross-topic synthesis, or original insight.${mathJaxRule}`
    };
  }
  
  /* ─────────────────────────────────────────────────────
     ANNOTATED TEXT PARSER (Improved Line Break Handling)
  ─────────────────────────────────────────────────────── */
  function _parseAnnotated(raw) {
    if (!raw) return '';
    
    // 1. Handle escaped newlines from the JSON response
    let h = raw.replace(/\\n/g, '\n');
    
    // 2. Process all XML tags on the ENTIRE block first (not line-by-line)
    // This prevents tags that span multiple lines from breaking the layout.
    h = h.replace(
      /<mark\s+type=['"]([^'"]+)['"]\s*(?:fix=['"]([^'"]*?)['"])?\s*>([\s\S]*?)<\/mark>/gi,
      (_, type, fix, content) => {
        if (type === 'del') return `<span class="rp-del" title="Delete">${content}</span>`;
        if (type === 'ins') return `<span class="rp-ins"><span class="rp-caret">&#x2038;</span><span class="rp-ins-w">${_esc(fix||'')}</span></span>`;
        if (fix) return `<span class="rp-wrap"><span class="rp-above">${_esc(fix)}</span><span class="rp-err">${content}</span></span>`;
        return `<span class="rp-err" title="${_esc(type)}">${content}</span>`;
      }
    );
    
    h = h.replace(/<ok>([\s\S]*?)<\/ok>/gi,
      (_, c) => `<span class="rp-ok"><span class="rp-tick">&#10003;</span>${c}</span>`);
    h = h.replace(/<weak>([\s\S]*?)<\/weak>/gi,
      (_, c) => `<span class="rp-weak">${c}</span>`);
    
    // 3. NOW convert actual newlines into HTML line breaks
    // Use trim to remove leading/trailing whitespace that might cause extra gaps
    h = h.split('\n').map(line => line.trim()).filter(l => l !== "").join('<br>');
    
    return `<p>${h}</p>`;
  }
  
  /* ─────────────────────────────────────────────────────
     RENDER MULTI-QUESTION RESULTS (CSS removed - assume external)
  ─────────────────────────────────────────────────────── */
  function _renderAll(results, combined, studentName, submissionDate, el) {
    const totalScore = combined.totalScore || results.reduce((s, r) => s + (r.data?.totalScore || 0), 0);
    const totalMax = combined.totalMax || results.reduce((s, r) => s + (r.data?.maxMarks || 0), 0);
    const pct = totalMax ? Math.round((totalScore / totalMax) * 100) : 0;
    const band = combined.band || (pct >= 80 ? 'Excellent' : pct >= 65 ? 'Good' : pct >= 50 ? 'Average' : pct >= 30 ? 'Weak' : 'Very Weak');
    const bk = band.toLowerCase().replace(/\s+/g, '-');
    
    let paperHtml = `
<div class="ta-paper">
  <div class="ta-sheet-hdr">
    <div class="ta-sheet-info">
      <div class="ta-sheet-field">Name: <span>${_esc(studentName)}</span></div>
      <div class="ta-sheet-field">Subject: <span>${_esc(_cfg.subject)}</span></div>
      <div class="ta-sheet-field">Class: <span>${_esc(_cfg.level)}</span></div>
      <div class="ta-sheet-field">Date: <span>${_esc(submissionDate)}</span></div>
    </div>
    <div class="ta-sheet-stamp-zone">
      ${combined.isOutstanding ? `<div class="ta-stamp-star">★ Outstanding</div>` : ''}
      <div class="ta-stamp ta-s-${bk}">
        <span class="ta-stamp-score">${totalScore}/${totalMax}</span>
        <span class="ta-stamp-band">${band}</span>
      </div>
    </div>
  </div>`;
    
    results.forEach((r, i) => {
      const d = r.data;
      if (!d) return;
      const qbk = (d.band || 'Average').toLowerCase().replace(/\s+/g, '-');
      
      let annotatedText = d.annotatedText || '';
      annotatedText = cleanMalformedMath(annotatedText);
      const annotated = _parseAnnotated(annotatedText);
      
      let questionText = r.question || '';
      questionText = cleanMalformedMath(questionText);
      questionText = _preserveMathAndEscape(questionText);
      
      const missedItems = (d.missedPoints || []).filter(Boolean);
      const imprItems = (d.improvements || []).filter(Boolean);
      const teacherNotes = (missedItems.length || imprItems.length) ? `
    <div class="ta-teacher-notes">
      ${missedItems.length ? `
        <div class="ta-tn-heading">Missed:</div>
        <ul class="ta-tn-list miss">${missedItems.map(p => `<li>${_esc(p)}</li>`).join('')}</ul>` : ''}
      ${imprItems.length ? `
        <div class="ta-tn-heading" style="margin-top:${missedItems.length?'8px':'0'}">Improve:</div>
        <ul class="ta-tn-list impr">${imprItems.map(p => `<li>${_esc(p)}</li>`).join('')}</ul>` : ''}
    </div>` : '';
      
      paperHtml += `
  <div class="ta-q-block">
    <div class="ta-q-stamp-wrap">
      <div class="ta-q-stamp ta-s-${qbk}">
        <span class="ta-q-stamp-score">${d.totalScore}/${d.maxMarks}</span>
        <span class="ta-q-stamp-lbl">${_esc(d.band)}</span>
      </div>
    </div>
    <div class="ta-q-label">
      <span class="ta-q-num">Question ${i + 1}</span>
      ${r.compulsory ? `<span class="ta-q-compulsory">★ Compulsory</span>` : ''}
      <span class="ta-q-marks-badge">Marks: <span>${d.totalScore}/${d.maxMarks}</span></span>
    </div>
    <div class="ta-q-qtext">${questionText}</div>
    <div class="ta-annotated">${annotated || '<span style="opacity:.35;font-style:italic">No answer provided</span>'}</div>
    ${teacherNotes}
  </div>`;
    });
    
    paperHtml += `
  <div class="ta-legend">
    <div class="ta-leg-i"><span class="rp-ok" style="padding:0 4px"><span class="rp-tick">✓</span>text</span> Valid point</div>
    <div class="ta-leg-i"><span class="rp-weak" style="padding:0 2px">text</span> Incomplete</div>
    <div class="ta-leg-i"><span style="font-family:'Caveat',cursive;color:#ff2200;font-weight:700">fix</span> above = correction</div>
    <div class="ta-leg-i"><span class="rp-del">word</span> = delete</div>
    <div class="ta-leg-i"><span style="font-family:'Caveat',cursive;color:#ff2200;font-size:.9em">✗ Missed / ↗ Improve</span> = teacher notes</div>
  </div>
</div>`;
    
    let cardsHtml = `<div class="ta-cards-section">`;
    
    results.forEach((r, i) => {
      const d = r.data;
      if (!d) return;
      if (d.isAgeMismatch) cardsHtml += `
        <div class="ta-mismatch">
          <div class="ta-notice-icon">⚠️</div>
          <div><div class="ta-notice-title">Q${i+1}: Advanced Question</div>
          <div class="ta-notice-body">${_esc(d.ageMismatchNote)}</div></div>
        </div>`;
      if (d.isOutstanding) cardsHtml += `
        <div class="ta-outstanding">
          <div class="ta-notice-icon">🌟</div>
          <div><div class="ta-notice-title">Q${i+1}: Outstanding Performance!</div>
          <div class="ta-notice-body">${_esc(d.outstandingNote)}</div></div>
        </div>`;
    });
    
    cardsHtml += `
    <div class="ta-summary-card">
      <div class="ta-card-hd">Overall Score <span class="ta-hd-pill">${totalScore} / ${totalMax}</span></div>
      <div class="ta-summary-row">
        <div class="ta-summary-cell"><div class="ta-sc-label">Total</div><div class="ta-sc-val ta-green">${totalScore}/${totalMax}</div></div>
        <div class="ta-summary-cell"><div class="ta-sc-label">Percentage</div><div class="ta-sc-val">${pct}%</div></div>
        <div class="ta-summary-cell"><div class="ta-sc-label">Band</div><div class="ta-sc-val">${band}</div></div>
      </div>
      <div class="ta-feedback">${_esc(combined.overallFeedback || '')}</div>
    </div>`;
    
    results.forEach((r, i) => {
      const d = r.data;
      if (!d) return;
      const ptRows = (d.awardedPoints || []).map(p =>
        `<tr><td style="width:24px;color:var(--green);font-weight:700">✓</td><td>${_esc(p.point)}</td><td class="tc-m ta-green">${p.marks}</td><td class="tc-n">${_esc(p.comment||'')}</td></tr>`
      ).join('');
      const missed = d.missedPoints || [];
      const impr = d.improvements || [];
      cardsHtml += `
      <div class="ta-card">
        <div class="ta-card-hd">Q${i+1} — ${_esc(r.question.length > 60 ? r.question.slice(0,60)+'…' : r.question)}
          <span class="ta-hd-ghost">${d.totalScore}/${d.maxMarks}</span>
        </div>
        <div class="ta-feedback">${_esc(d.feedback)}</div>
        ${ptRows ? `<div style="overflow-x:auto"><table class="ta-tbl"><thead><tr><th style="width:24px"></th><th>Point</th><th style="width:60px;text-align:center">Marks</th><th>Note</th></tr></thead><tbody>${ptRows}</tbody></table></div>` : ''}
        ${missed.length ? `<div class="ta-card-hd" style="background:var(--off);color:var(--ink);border-top:var(--border);font-size:7.5px">Missed Points</div><ul class="ta-list miss">${missed.map(p=>`<li>${_esc(p)}</li>`).join('')}</ul>` : ''}
        ${impr.length ? `<div class="ta-card-hd" style="background:var(--off);color:var(--ink);border-top:var(--border);font-size:7.5px">Improvements</div><ul class="ta-list impr">${impr.map(p=>`<li>${_esc(p)}</li>`).join('')}</ul>` : ''}
      </div>`;
    });
    
    const oi = combined.overallImprovements || [];
    if (oi.length) cardsHtml += `<div class="ta-card"><div class="ta-card-hd">Overall Improvements</div><ul class="ta-list impr">${oi.map(p=>`<li>${_esc(p)}</li>`).join('')}</ul></div>`;
    
    const tips = combined.overallStudyTips || [];
    if (tips.length) {
      cardsHtml += `<div class="ta-card"><div class="ta-card-hd">Study Tips</div><div class="ta-tips">${tips.map(t=>`<div class="ta-tip"><div class="ta-tip-t">${_esc(t.title)}</div><div class="ta-tip-b">${_esc(t.tip)}</div></div>`).join('')}</div></div>`;
    }
    cardsHtml += `</div>`;
    
    el.innerHTML = `<div class="ta-root">${paperHtml}${cardsHtml}</div>`;
    
    const mathElements = el.querySelectorAll('.ta-q-qtext, .ta-annotated');
    if (window.MathJax && typeof window.MathJax.typesetPromise === 'function') {
      window.MathJax.typesetPromise(Array.from(mathElements)).catch(err => console.warn('[TA] MathJax failed:', err.message));
    }
    
    el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  
  /* ─────────────────────────────────────────────────────
     COMBINED MARKING PROMPT
  ─────────────────────────────────────────────────────── */
  function _combinedPrompt(questionsArr, answersArr) {
    const profile = _levelProfile(_cfg.level || '');
    
    const qBlocks = questionsArr.map((q, i) => {
      const ml = q.marks ?
        `${q.marks} marks` :
        `infer from question text; default ${profile.maxDefault}, max 10`;
      return `--- QUESTION ${i + 1} (${ml}) ---
${q.text}

STUDENT ANSWER ${i + 1}:
${(answersArr[i] || '').trim() || '[No answer provided]'}`;
    }).join('\n\n');
    
    const _topicLine = (_cfg.topics && _cfg.topics.length) ?
      `\nFOCUS TOPICS: ${_cfg.topics.join(' | ')}\nAssess all content within the context of these specific topics.\n` :
      '';
    return `You are a ${_cfg.subject} examiner marking a ${profile.label} student (age ${profile.age}) in Nigeria.
Mark ALL questions below as one combined exam paper and compute a single cumulative score.${_topicLine}

${qBlocks}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LEVEL CALIBRATION:
${profile.calibration}

MARKING RULES (apply to every question):
- Award marks only for statements that are factually correct AND directly answer the question.
- Accept clear paraphrases. Reject irrelevant padding and factual errors.
- If the student uses visual formatting (circles, boxes, underlines) or MathJax $...$ formulas, treat the text as valid content.
- Same idea repeated in one answer = award once. Never exceed marks for that question.
- missedPoints per question: correct points the question expected that the student omitted.
- improvements per question: 2-3 specific, actionable suggestions for that answer.
- Total score = exact sum of all per-question scores.

BANDS (% of total marks): Excellent ≥80% | Good 65–79% | Average 50–64% | Weak 30–49% | Very Weak <30%

AGE-APPROPRIATENESS (per question):
If a question is clearly beyond ${profile.label}, set isAgeMismatch:true and write an encouraging ageMismatchNote for the student.

OUTSTANDING (per question):
If an answer far exceeds ${profile.label} expectations, set isOutstanding:true with a warm outstandingNote.

PROOFREAD & ANNOTATE every student answer — return the exact student text with these inline XML tags:
  <mark type="sp"    fix="correct">misspeled</mark>    spelling
  <mark type="cap"   fix="Word">word</mark>             capitalise
  <mark type="lc"    fix="word">Word</mark>             lowercase
  <mark type="agr"   fix="correct">wrong</mark>         subject-verb agreement
  <mark type="vt"    fix="correct">wrong</mark>         verb tense
  <mark type="punct" fix=". ">wrong,</mark>             punctuation
  <mark type="ww"    fix="right">wrong</mark>           wrong word
  <mark type="ins"   fix="word"> </mark>                insert missing word
  <mark type="del">extra word</mark>                    delete
  <ok>text earning marks</ok>                           valid point
  <weak>vague or incomplete point</weak>                partial

RESPOND ONLY WITH VALID JSON — no preamble, no markdown fences:
{
  "totalScore"        : <exact sum of all question scores>,
  "totalMax"          : <exact sum of all question maxMarks>,
  "band"              : "Excellent|Good|Average|Weak|Very Weak",
  "isOutstanding"     : <true if ANY question is outstanding>,
  "overallFeedback"   : "<2–3 sentence cumulative examiner comment>",
  "overallImprovements": ["<general improvement 1>","<general improvement 2>"],
  "overallStudyTips"  : [{ "title":"<short title>","tip":"<2 sentences>" }],
  "questions": [
    {
      "totalScore"    : <n>,
      "maxMarks"      : <n>,
      "band"          : "Excellent|Good|Average|Weak|Very Weak",
      "isAgeMismatch" : false,
      "ageMismatchNote": "",
      "isOutstanding" : false,
      "outstandingNote": "",
      "awardedPoints" : [{ "point":"<what student said>","marks":<n>,"comment":"<1 sentence>" }],
      "missedPoints"  : ["<important correct point not made>"],
      "feedback"      : "<1–2 sentence examiner comment for this question>",
      "improvements"  : ["<specific improvement>","<specific improvement>"],
      "annotatedText" : "<full student answer with all XML tags preserved>"
    }
  ]
}`;
  }
  
  /* ─────────────────────────────────────────────────────
     AUTO-GEN QUESTIONS PROMPT
  ─────────────────────────────────────────────────────── */
  function _genPrompt(count, existingTopics) {
    const profile = _levelProfile(_cfg.level || '');
    const avoid = existingTopics.length ? `Avoid topics already covered: ${existingTopics.join(', ')}.` : '';
    const topicFocus = (_cfg.topics && _cfg.topics.length) ?
      `Focus questions on these specific topics ONLY: ${_cfg.topics.join(', ')}.` :
      'Cover a range of appropriate topics for this subject.';
    
    const isMathSci = /math|physics|chemistry|science|mathematics/i.test(_cfg.subject);
    
    return `You are a ${_cfg.subject} teacher writing exam questions for ${profile.label} students (age ${profile.age}) in Nigeria.

Generate exactly ${count} theory question(s) appropriate for this level.

CRITICAL FORMATTING RULES - FOLLOW EXACTLY:
${isMathSci ? `
- Use ONLY single dollar signs for math: $ ... $
- NEVER use \\( or \\)
- NEVER use \\cdot 1x - just write x or 2x directly
- NEVER output MathJax XML/HTML tags like <mjx-container>
- Output ONLY plain text with $math$ delimiters
- Correct examples:
  * "Solve $3x + 5 = 14$ for $x$"
  * "Calculate $\\frac{3}{4} + \\frac{2}{3}$"
  * "Find $x$ in $2x^2 + 3x - 5 = 0$"
` : ''}

RULES:
- ${topicFocus}
- Each question must be answerable in 3-10 sentences
- Questions must be specific and unambiguous
- Vary question types (explain, describe, state, compare, give examples)
- Suggest mark value between 5 and 10

${avoid}

RESPOND ONLY WITH VALID JSON - DO NOT include any MathJax XML tags:
{
  "questions": [
    { "text": "<question text with $math$ syntax>", "suggestedMarks": <5-10> }
  ]
}


- MANDATORY: Wrap every single math symbol or equation in single dollar signs.
- Example: "Solve $4(x - 2) + 3 = 2(x + 5)$" 
- Use \n for line breaks between steps in the "annotatedText".
- DO NOT use any HTML tags or complex LaTeX environments like \begin{equation}.
`;
  }
  
  /* ─────────────────────────────────────────────────────
     PUBLIC API
  ─────────────────────────────────────────────────────── */
  const TheoryAnalyser = {
    
    init(config = {}) {
      ['geminiKey', 'subject', 'level'].forEach(k => {
        if (!config[k]) throw new Error(`TheoryAnalyser.init: missing "${k}"`);
      });
      _cfg = { mountId: 'theory-results', ...config };
      _midx = 0;
      console.info(`[TA] Ready — ${_cfg.subject} (${_cfg.level})`);
    },
    
    async generateQuestions(count = 1, existingTopics = []) {
      if (!_cfg) throw new Error('Call init() first');
      const raw = await _post({
        systemInstruction: { parts: [{ text: _genPrompt(count, existingTopics) }] },
        contents: [{ parts: [{ text: `Generate ${count} question(s) for ${_cfg.subject}, ${_cfg.level}.` }] }],
        generationConfig: { responseMimeType: 'application/json', temperature: 0.85, maxOutputTokens: 1200 },
      });
      const text = raw.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const data = _parseJSON(text);
      return data.questions || [];
    },
    
    async analyseAll(questionsArr, answersArr, studentName, submissionDate) {
      if (!_cfg) throw new Error('Call init() first');
      const el = document.getElementById(_cfg.mountId);
      if (!el) throw new Error(`No element #${_cfg.mountId}`);
      
      el.innerHTML = `<div class="ta-root"><div class="ta-loading"><div class="ta-spinner"></div>Marking ${questionsArr.length} question${questionsArr.length > 1 ? 's' : ''}…</div></div>`;
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      
      try {
        const raw = await _post({
          systemInstruction: { parts: [{ text: _combinedPrompt(questionsArr, answersArr) }] },
          contents: [{ parts: [{ text: `Mark this exam paper for ${studentName}, ${_cfg.subject}, ${_cfg.level}.` }] }],
          generationConfig: { responseMimeType: 'application/json', temperature: 0.1, maxOutputTokens: 10000 },
        });
        
        const text = raw.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const combined = _parseJSON(text);
        
        const results = (combined.questions || []).map((q, i) => ({
          question: questionsArr[i]?.text || `Question ${i+1}`,
          compulsory: questionsArr[i]?.compulsory || false,
          data: q,
        }));
        
        _renderAll(results, combined, studentName, submissionDate, el);
        
        if (typeof _cfg.onResult === 'function') try { _cfg.onResult({ combined, results }); } catch (_) {}
        return { combined, results };
        
      } catch (err) {
        el.innerHTML = `<div class="ta-root"><div class="ta-error"><strong>Marking failed</strong><br>${_esc(err.message)}</div></div>`;
        return null;
      }
    },
    
    reconfigure(partial = {}) {
      if (!_cfg) throw new Error('Call init() first');
      _cfg = { ..._cfg, ...partial };
    },
    
    getConfig() { return _cfg ? { ..._cfg } : null; },
  };
  
  global.TheoryAnalyser = TheoryAnalyser;
})(typeof window !== 'undefined' ? window : global);