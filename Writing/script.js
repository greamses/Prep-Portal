/* ── API ── */
const p1 = "gsk_9sz5p",
  p2 = "0Vrwv8chiknSBrJW",
  p3 = "Gdyb3FYnQIifcPYSc9",
  p4 = "Dhi1tMvB8VmAh";
const GROQ_KEY = p1 + p2 + p3 + p4;
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

/* ── DOM ── */
const $ = id => document.getElementById(id);
const elTopicBox = $('topic-box');
const elTopic = $('topic-display');
const elTextarea = $('writing-area');
const elWordCount = $('word-count');
const elSubmitBtn = $('submit-btn');
const elEditorSec = $('editor-section');
const elResultsSec = $('results-section');
const elLoading = $('loading-overlay');
const elRubric = $('rubric-content');
const elAnnotated = $('annotated-text');
const elStamp = $('score-stamp');
const elRetryBtn = $('retry-btn');
const elPopover = $('mark-popover');
const elModal = $('topic-modal');

let currentTopic = "";
let activeEl = null;

/* ── EVENT LISTENERS ── */
elTextarea.addEventListener('input', () => {
  const words = elTextarea.value.trim() ? elTextarea.value.trim().split(/\s+/).length : 0;
  elWordCount.textContent = words;
  elSubmitBtn.disabled = words < 20;
});

$('new-topic-btn').addEventListener('click', openModal);
$('close-modal').addEventListener('click', closeModal);

// Close modal when clicking outside box
elModal.addEventListener('click', (e) => {
  if (e.target === elModal) closeModal();
});

// Attach listeners to Modal Type Buttons
document.querySelectorAll('.type-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    fetchGeneratedTopic(btn.dataset.type);
  });
});

elRetryBtn.addEventListener('click', () => {
  elResultsSec.classList.remove('active');
  elEditorSec.style.display = 'block';
  openModal();
  elTextarea.value = '';
  elWordCount.textContent = '0';
  elSubmitBtn.disabled = true;
  elPopover.classList.remove('visible');
  activeEl = null;
});

/* ── MODAL LOGIC ── */
function openModal() {
  elModal.classList.add('active');
}

function closeModal() {
  elModal.classList.remove('active');
  // Provide a fallback if user closes without picking initially
  if (!currentTopic) {
    currentTopic = "Write a descriptive essay about an abandoned place that suddenly comes to life.";
    elTopic.textContent = currentTopic;
  }
}

/* ── GENERATE TOPIC VIA API ── */
async function fetchGeneratedTopic(type) {
  elTopicBox.style.opacity = '0.5';
  elTopic.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Generating ${type} prompt...`;
  closeModal();
  
  try {
    const res = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: `You are a creative writing teacher. Generate a single, highly engaging secondary-school level writing prompt for the following genre: ${type}. Return ONLY the prompt text. No quotes, no introductions, no extra text.` }
        ],
        temperature: 0.8,
        max_tokens: 150
      })
    });
    
    if (!res.ok) throw new Error(`API ${res.status}`);
    
    const data = await res.json();
    let promptText = data.choices?.[0]?.message?.content || "Failed to generate topic.";
    // Clean off any lingering quotes just in case
    promptText = promptText.replace(/^["']|["']$/g, '').trim();
    
    currentTopic = promptText;
    elTopic.textContent = currentTopic;
    
    // Re-validate text area length against new topic
    const words = elTextarea.value.trim() ? elTextarea.value.trim().split(/\s+/).length : 0;
    elSubmitBtn.disabled = words < 20;
    
  } catch (err) {
    console.error(err);
    elTopic.textContent = "Error generating topic. Please try again or click 'Change Topic'.";
    currentTopic = "";
  } finally {
    elTopicBox.style.opacity = '1';
  }
}

/* ── GRADING SYSTEM PROMPT ── */
function getSystemPrompt() {
  return `You are an uncompromising secondary-school English examiner marking with a red pen. You are NOT generous. Your job is to find and mark EVERY single error.

CALIBRATION — anchor your scores to these benchmarks:
  Grammar & Mechanics /30:
    30 = Perfect. Zero errors anywhere.
    24–26 = 2–3 minor slips only.
    18–22 = 4–7 errors of mixed severity.
    12–16 = 8–12 errors; clear mechanical weaknesses.
    6–10  = 13+ errors; pervasive grammar/spelling/punctuation problems.

  Vocabulary & Style /25:
    23–25 = Varied, precise, sophisticated word choices throughout.
    18–22 = Generally good but some weak or repetitive words.
    12–16 = Frequent vague, repetitive, or imprecise diction.
    6–10  = Very limited vocabulary; monotonous or inappropriate register.

  Structure & Coherence /25:
    23–25 = Clear intro, well-developed body, satisfying conclusion; smooth transitions.
    18–22 = Mostly organised but one structural weakness.
    12–16 = Structure partially present; missing or underdeveloped sections.
    6–10  = Little sense of organisation; very hard to follow.

  Creativity & Content /20:
    18–20 = Genuinely original; rich detail; engaging throughout.
    13–17 = Some interesting ideas but unevenly developed.
    8–12  = Generic content; lacks depth or originality.
    3–7   = Very thin content; little engagement with the topic.

TOTAL SCORE BANDS:
  85–95 = Near-perfect. Only 1–2 trivial issues.
  70–84 = Good, competent writing with a handful of errors.
  55–69 = Average. Several errors, adequate structure.
  40–54 = Weak. Frequent errors, poor vocabulary or organisation.
  0–39  = Very weak. Pervasive errors; difficult to follow.

STRICT RULES:
- Perfect writing is impossible. NEVER exceed 95.
- If in doubt between two scores, choose the lower one.
- A score above 80 requires truly impressive, near-error-free writing.
- Count every error before scoring Grammar & Mechanics. Each error costs points.

RUBRIC:
  Grammar & Mechanics   /30
  Vocabulary & Style    /25
  Structure & Coherence /25
  Creativity & Content  /20

RESPOND ONLY WITH VALID JSON. No markdown fences, no extra text, no preamble.

REQUIRED JSON:
{
  "totalScore": <number equal to exact sum of rubric scores>,
  "rubric": [
    { "category": "Grammar & Mechanics",  "score": <n>, "outOf": 30, "feedback": "<2 specific sentences naming actual errors found>" },
    { "category": "Vocabulary & Style",   "score": <n>, "outOf": 25, "feedback": "<2 specific sentences>" },
    { "category": "Structure & Coherence","score": <n>, "outOf": 25, "feedback": "<2 specific sentences>" },
    { "category": "Creativity & Content", "score": <n>, "outOf": 20, "feedback": "<2 specific sentences>" }
  ],
  "annotatedText": "<student essay with annotation tags injected>"
}

ANNOTATION TAG RULES — inject into annotatedText. Mark EVERY error without exception:

1. Delete wrong/extra word:
   <mark type="del" loss="-2">word</mark>

2. Insert missing word:
   <mark type="ins" fix="missingword" loss="-2"> </mark>

3. Needs capital letter:
   <mark type="cap" loss="-2">word</mark>

4. Wrong capital — make lowercase:
   <mark type="lc" loss="-2">Word</mark>

5. Words in wrong order — transpose:
   <mark type="trans" loss="-2">second first</mark>

6. New paragraph needed here:
   <mark type="para" loss="-2"> </mark>

7. Abbreviation — spell out in full:
   <mark type="spell" loss="-1">abbr</mark>

8. Spelling mistake (wrong letters):
   <mark type="sp" loss="-2">mispeled</mark>

9. Run-on sentence (two sentences fused without proper punctuation):
   <mark type="run" loss="-3">first clause second clause run together</mark>

10. Sentence fragment (incomplete sentence):
    <mark type="frag" loss="-3">Because it was raining.</mark>

11. Wrong punctuation mark used:
    <mark type="punct" loss="-2">,</mark>

12. Weak word — offer better alternatives (comma-separated):
    <sub opts="stronger1, stronger2, stronger3">weak_word</sub>

13. Weak/awkward sentence — offer full rewrites (pipe-separated |||):
    <sent opts="Rewrite option one.|||Rewrite option two.">The original weak sentence.</sent>

ANNOTATION RULES:
- Use <mark> tags on EVERY grammar, spelling, and punctuation error — leave nothing uncorrected.
- loss values: -1 trivial, -2 standard, -3 moderate, -4 serious, -5 severe.
- Prefer <mark type="sp"> for misspelled words over <mark type="del">.
- Prefer <mark type="run"> when two complete clauses are fused.
- Use <sub> and <sent> generously to improve weak vocabulary and phrasing.
- Preserve paragraph breaks as \\n\\n in annotatedText.
- Escape all JSON strings. Do NOT use markdown code fences.`;
}

/* ── SUBMIT GRADING ── */
elSubmitBtn.addEventListener('click', async () => {
  const userText = elTextarea.value.trim();
  if (!userText) return;
  
  elLoading.classList.add('active');
  
  try {
    const res = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: getSystemPrompt() },
          { role: "user", content: `TOPIC: ${currentTopic}\n\nSTUDENT ESSAY:\n${userText}` }
        ],
        temperature: 0.1,
        max_tokens: 4000
      })
    });
    
    if (!res.ok) throw new Error(`API ${res.status}`);
    
    const data = await res.json();
    let raw = data.choices?.[0]?.message?.content || "";
    raw = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim();
    
    const parsed = JSON.parse(raw);
    renderResults(parsed, userText);
    
  } catch (err) {
    console.error(err);
    alert("Grading error — the AI returned unexpected data. Please try again.");
    elLoading.classList.remove('active');
  }
});

/* ── RENDER RESULTS ── */
function renderResults(data, originalText) {
  
  /* Score stamp */
  const score = Math.min(100, Math.max(0, data.totalScore || 0));
  elStamp.textContent = `${score}%`;
  elStamp.className = `score-stamp${score < 55 ? ' fail' : score < 70 ? ' avg' : ''}`;
  
  /* Rubric rows */
  elRubric.innerHTML = '';
  (data.rubric || []).forEach(item => {
    const pct = Math.round((item.score / item.outOf) * 100);
    const col = pct >= 70 ? 'var(--green)' : pct >= 50 ? 'var(--amber)' : 'var(--red)';
    elRubric.innerHTML += `
        <div class="rubric-row">
          <div class="rubric-cat">${safe(item.category)}</div>
          <div class="rubric-score" style="color:${col}">${item.score} / ${item.outOf}</div>
          <p class="rubric-fb">${safe(item.feedback)}</p>
        </div>`;
  });
  
  /* Build annotated HTML */
  let html = data.annotatedText || originalText;
  
  // Restore escaped newlines → HTML breaks
  html = html.replace(/\\n\\n/g, '\n\n').replace(/\n\n/g, '<br><br>').replace(/\n/g, '<br>');
  
  // <mark type="X" fix="Y" loss="Z">content</mark>
  html = html.replace(
    /<mark\s+type=['"]([^'"]+)['"]\s*(?:fix=['"]([^'"]*?)['"])?\s*(?:loss=['"]([^'"]*?)['"])?>([\s\S]*?)<\/mark>/gi,
    (_, type, fix, loss, content) => {
      const fixAttr = fix ? ` data-fix="${safe(fix)}"` : '';
      const deduction = loss ? `<span class="deduction">${safe(loss)}</span>` : '';
      return `<span class="doodle doodle-${type}"${fixAttr}>${content}${deduction}</span>`;
    }
  );
  
  // <sub opts="...">word</sub>
  html = html.replace(
    /<sub\s+opts=['"]([^'"]+)['"]>([^<]+)<\/sub>/gi,
    (_, opts, word) =>
    `<span class="sub-word" data-opts="${safe(opts)}" data-type="word">${word}</span>`
  );
  
  // <sent opts="...">sentence text</sent>
  html = html.replace(
    /<sent\s+opts=['"]([^'"]+)['"]>([\s\S]*?)<\/sent>/gi,
    (_, opts, sentence) =>
    `<span class="sent-sub" data-opts="${safe(opts)}" data-type="sent">${sentence}</span>`
  );
  
  elAnnotated.innerHTML = html;
  
  /* Attach popover listeners */
  elAnnotated.querySelectorAll('.sub-word, .sent-sub').forEach(el => {
    el.addEventListener('click', e => {
      e.stopPropagation();
      openPopover(el);
    });
  });
  
  /* Transition */
  elLoading.classList.remove('active');
  elEditorSec.style.display = 'none';
  elResultsSec.classList.add('active');
}

/* ── POPOVER LOGIC ── */
function openPopover(el) {
  activeEl = el;
  const type = el.dataset.type || 'word';
  const optsStr = el.dataset.opts || '';
  if (!optsStr) return;
  
  const opts = type === 'sent' ?
    optsStr.split('|||').map(s => s.trim()).filter(Boolean) :
    optsStr.split(',').map(s => s.trim()).filter(Boolean);
  
  const isSent = type === 'sent';
  const labelColor = isSent ? 'var(--amber)' : 'var(--blue)';
  const iconClass = isSent ? 'fas fa-pen' : 'fas fa-lightbulb';
  const labelText = isSent ? 'Sentence Rewrite' : 'Word Substitute';
  
  let html = `<div class="pop-title" style="color:${labelColor}"><i class="${iconClass}"></i>${labelText}</div>`;
  opts.forEach(opt => {
    html += `<button class="pop-opt">${opt}</button>`;
  });
  
  elPopover.innerHTML = html;
  elPopover.classList.add('visible');
  
  /* Positioning (fixed, keep in viewport) */
  const rect = el.getBoundingClientRect();
  const pw = 300;
  let left = rect.left;
  let top = rect.bottom + 6;
  if (left + pw > window.innerWidth - 8) left = window.innerWidth - pw - 8;
  if (left < 8) left = 8;
  if (top + 160 > window.innerHeight) top = rect.top - 170;
  elPopover.style.left = left + 'px';
  elPopover.style.top = top + 'px';
  
  elPopover.querySelectorAll('.pop-opt').forEach(btn => {
    btn.addEventListener('click', () => applyOpt(btn.textContent));
  });
}

function applyOpt(chosen) {
  if (!activeEl) return;
  activeEl.textContent = chosen;
  activeEl.style.textDecoration = 'none';
  activeEl.style.color = 'var(--green)';
  activeEl.style.fontWeight = '600';
  activeEl.classList.remove('sub-word', 'sent-sub');
  elPopover.classList.remove('visible');
  activeEl = null;
}

document.addEventListener('click', e => {
  if (!elPopover.contains(e.target)) elPopover.classList.remove('visible');
});

/* ── UTIL ── */
function safe(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/* Init -> Automatically Open Modal on Start */
window.addEventListener('DOMContentLoaded', openModal);