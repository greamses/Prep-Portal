/* ═══════════════════════════════════════════════════════
   THEORY ANALYSER  v6.3 (Text-Only / Non-Calculation)
   Multi-question · Auto-gen · Level-calibrated · Print-exact
   ───────────────────────────────────────────────────── */
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
  
  function _parseJSON(raw) {
    const s = raw.indexOf('{'),
      e = raw.lastIndexOf('}');
    if (s < 0 || e < 0) throw new Error('No JSON in AI response');
    let jsonStr = raw.slice(s, e + 1).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]+/g, '');
    return JSON.parse(jsonStr);
  }
  
  /* ─────────────────────────────────────────────────────
     LEVEL PROFILE (Focused on Theoretical Writing)
  ─────────────────────────────────────────────────────── */
  function _levelProfile(level) {
    const l = (level || '').toLowerCase();
    
    if (/primary [123]|grade [123]|p\.?[123]/.test(l)) return {
      label: 'Infant / Lower Primary (Pry 1–3)',
      age: '5–9',
      maxDefault: 5,
      calibration: `
MARKING — INFANT LEVEL (age 5–9):
• Focus on simple identification and basic descriptive sentences.
• Maximum generosity. One correct fact in any phrasing = FULL marks.
• NEVER penalise for missing technical vocabulary.
• "Bones keep us standing" is fully correct for the skeletal system.`
    };
    if (/primary [45]|grade [45]|p\.?[45]/.test(l)) return {
      label: 'Lower Primary (Pry 4–5)',
      age: '9–11',
      maxDefault: 8,
      calibration: `
MARKING — LOWER PRIMARY (age 9–11):
• Definition alone earns 60%. Full marks needs one example or descriptive fact.
• Accept informal but correct conceptual explanations.
• OUTSTANDING: student provides real-world example unprompted.`
    };
    if (/primary 6|grade 6|p\.?6/.test(l)) return {
      label: 'Upper Primary (Pry 6)',
      age: '11–12',
      maxDefault: 10,
      calibration: `
MARKING — UPPER PRIMARY (age 11–12):
• Expect definition + supporting explanation for full marks.
• Look for clear sentence structure and logical sequence.`
    };
    if (/jss/.test(l)) return {
      label: 'Junior Secondary (JSS)',
      age: '11–15',
      maxDefault: 10,
      calibration: `
MARKING — JSS (age 11–15):
• Definition earns ~40%. Full marks requires explanation + illustrative examples.
• Technical terminology is expected; informal equivalents earn partial credit.`
    };
    return {
      label: 'Senior Secondary (SS)',
      age: '15–19',
      maxDefault: 10,
      calibration: `
MARKING — SS (age 15–19):
• Focus on depth of argument and theoretical synthesis.
• Definition alone earns only 20–30%. 
• Full marks requires: definition + detailed explanation + analysis of importance/function.
• Correct technical vocabulary is mandatory.`
    };
  }
  
  /* ─────────────────────────────────────────────────────
     ANNOTATED TEXT PARSER
  ─────────────────────────────────────────────────────── */
  function _parseAnnotated(raw) {
    if (!raw) return '';
    let h = raw.replace(/\\n/g, '\n');
    h = h.replace(
      /<mark\s+type=['"]([^'"]+)['"]\s*(?:fix=['"]([^'"]*?)['"])?\s*>([\s\S]*?)<\/mark>/gi,
      (_, type, fix, content) => {
        if (type === 'del') return `<span class="rp-del">${content}</span>`;
        if (type === 'ins') return `<span class="rp-ins"><span class="rp-caret">&#x2038;</span><span class="rp-ins-w">${_esc(fix||'')}</span></span>`;
        if (fix) return `<span class="rp-wrap"><span class="rp-above">${_esc(fix)}</span><span class="rp-err">${content}</span></span>`;
        return `<span class="rp-err">${content}</span>`;
      }
    );
    h = h.replace(/<ok>([\s\S]*?)<\/ok>/gi, (_, c) => `<span class="rp-ok"><span class="rp-tick">✓</span>${c}</span>`);
    h = h.replace(/<weak>([\s\S]*?)<\/weak>/gi, (_, c) => `<span class="rp-weak">${c}</span>`);
    h = h.replace(/\n/g, '<br>');
    return `<p>${h}</p>`;
  }
  
  /* ─────────────────────────────────────────────────────
     RENDERER
  ─────────────────────────────────────────────────────── */
  function _renderAll(results, combined, studentName, submissionDate, el) {
    const totalScore = combined.totalScore || 0;
    const totalMax = combined.totalMax || 0;
    const pct = totalMax ? Math.round((totalScore / totalMax) * 100) : 0;
    const band = combined.band || 'Average';
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
      const qbk = (d.band || 'Average').toLowerCase().replace(/\s+/g, '-');
      const annotated = _parseAnnotated(d.annotatedText);
      const missedItems = (d.missedPoints || []).filter(Boolean);
      const imprItems = (d.improvements || []).filter(Boolean);
      
      paperHtml += `
  <div class="ta-q-block">
    <div class="ta-q-stamp-wrap"><div class="ta-q-stamp ta-s-${qbk}"><span class="ta-q-stamp-score">${d.totalScore}/${d.maxMarks}</span></div></div>
    <div class="ta-q-label"><span class="ta-q-num">Question ${i + 1}</span></div>
    <div class="ta-q-qtext">${_esc(r.question)}</div>
    <div class="ta-annotated">${annotated}</div>
    <div class="ta-teacher-notes">
      ${missedItems.length ? `<div class="ta-tn-heading">Missed Facts:</div><ul class="ta-tn-list miss">${missedItems.map(p => `<li>${_esc(p)}</li>`).join('')}</ul>` : ''}
    </div>
  </div>`;
    });
    
    paperHtml += `</div>`;
    el.innerHTML = `<div class="ta-root">${paperHtml}</div>`;
    el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  
  /* ─────────────────────────────────────────────────────
     TEXT-ONLY THEORY PROMPT
  ─────────────────────────────────────────────────────── */
  function _combinedPrompt(questionsArr, answersArr) {
    const profile = _levelProfile(_cfg.level || '');
    const qBlocks = questionsArr.map((q, i) => `
--- QUESTION ${i + 1} ---
${q.text}
STUDENT ANSWER ${i + 1}:
${(answersArr[i] || '').trim() || '[No answer provided]'}`).join('\n\n');
    
    return `You are a ${_cfg.subject} examiner marking a ${profile.label} student in Nigeria.
Focus ONLY on theoretical knowledge, definitions, and explanations. Ignore any lack of mathematical calculations unless the question specifically asked for a description of a process.

${qBlocks}

LEVEL CALIBRATION:
${profile.calibration}

MARKING RULES:
- Award marks for correct theoretical facts, logical explanations, and appropriate technical terms.
- Annotate the student's text for grammar, spelling, and factual accuracy using XML tags.
- <ok>text</ok> for valid points; <weak>text</weak> for vague points.
- missedPoints: Specific theoretical points or descriptive details the student failed to mention.

RESPOND ONLY WITH VALID JSON:
{
  "totalScore": 0, "totalMax": 0, "band": "Excellent|Good|Average|Weak|Very Weak",
  "overallFeedback": "", "overallImprovements": [],
  "questions": [
    {
      "totalScore": 0, "maxMarks": 10, "band": "...",
      "awardedPoints": [{ "point": "...", "marks": 0 }],
      "missedPoints": [], "feedback": "", "annotatedText": ""
    }
  ]
}`;
  }
  
  /* ─────────────────────────────────────────────────────
     THEORY-ONLY QUESTION GENERATION PROMPT
  ─────────────────────────────────────────────────────── */
  function _genPrompt(count, existingTopics) {
    const profile = _levelProfile(_cfg.level || '');
    const topicFocus = (_cfg.topics && _cfg.topics.length) ?
      `Focus on these specific topics: ${_cfg.topics.join(', ')}.` : '';
    
    return `You are a ${_cfg.subject} teacher writing exam questions for ${profile.label} students in Nigeria.

TASK: Generate exactly ${count} THEORY questions. 
CRITICAL RULE: NO CALCULATIONS. NO MATH PROBLEMS. NO NUMERICAL SOLVING.
Questions must require descriptive, explanatory, or comparative text-based answers.

Example Question Types:
- "Describe the process of..."
- "Explain the importance of..."
- "Compare and contrast..."
- "Define and give examples of..."

${topicFocus}
${existingTopics.length ? `Avoid: ${existingTopics.join(', ')}.` : ''}

RESPOND ONLY WITH VALID JSON:
{
  "questions": [
    { "text": "Question text here", "suggestedMarks": 10 }
  ]
}`;
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
    },
    
    async generateQuestions(count = 1, existingTopics = []) {
      const raw = await _post({
        systemInstruction: { parts: [{ text: _genPrompt(count, existingTopics) }] },
        contents: [{ parts: [{ text: `Generate ${count} theory questions.` }] }],
        generationConfig: { responseMimeType: 'application/json', temperature: 0.8 },
      });
      return _parseJSON(raw.candidates[0].content.parts[0].text).questions || [];
    },
    
    async analyseAll(questionsArr, answersArr, studentName, submissionDate) {
      const el = document.getElementById(_cfg.mountId);
      el.innerHTML = '<div class="ta-loading">Analysing theory answers...</div>';
      
      try {
        const raw = await _post({
          systemInstruction: { parts: [{ text: _combinedPrompt(questionsArr, answersArr) }] },
          contents: [{ parts: [{ text: `Mark theory paper for ${studentName}.` }] }],
          generationConfig: { responseMimeType: 'application/json', temperature: 0.1 },
        });
        
        const combined = _parseJSON(raw.candidates[0].content.parts[0].text);
        const results = combined.questions.map((q, i) => ({
          question: questionsArr[i]?.text || `Question ${i+1}`,
          data: q
        }));
        
        _renderAll(results, combined, studentName, submissionDate, el);
        return { combined, results };
      } catch (err) {
        el.innerHTML = `<div class="ta-error">Marking failed: ${err.message}</div>`;
        return null;
      }
    }
  };
  
  global.TheoryAnalyser = TheoryAnalyser;
})(typeof window !== 'undefined' ? window : global);