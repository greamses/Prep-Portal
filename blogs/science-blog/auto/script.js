import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore, collection, addDoc, serverTimestamp, doc, getDoc, getDocs, deleteDoc, updateDoc, query, orderBy, limit } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA2N3uI_XfSIVsto2Ku1g_qSezmD3qFmbk",
  authDomain: "prep-portal-2026.web.app",
  projectId: "prep-portal-2026",
  storageBucket: "prep-portal-2026.firebasestorage.app",
  messagingSenderId: "837672918701",
  appId: "1:837672918701:web:e64c0c25dc01b542e23024"
};

// ─── MODELS ───────────────────────────────────────────────
const GROQ_MODELS = [
  { label: 'Llama 3.3 70B', provider: 'groq', model: 'llama-3.3-70b-versatile' },
  { label: 'Llama 3.1 8B', provider: 'groq', model: 'llama-3.1-8b-instant' },
  { label: 'Mixtral 8x7B', provider: 'groq', model: 'mixtral-8x7b-32768' },
  { label: 'Gemma 2 9B', provider: 'groq', model: 'gemma2-9b-it' },
  { label: 'Llama 3.2 3B', provider: 'groq', model: 'llama-3.2-3b-preview' },
  { label: 'Llama 3.2 11B', provider: 'groq', model: 'llama-3.2-11b-text-preview' },
];


const GEMINI_MODELS = [
  { label: 'Gemini 3.1 Flash-Lite', provider: 'gemini', url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent' },
  { label: 'Gemini 3.1 Pro', provider: 'gemini', url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-pro-preview:generateContent' },
  { label: 'Gemini 3 Flash', provider: 'gemini', url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent' },
  { label: 'Gemini 2.5 Flash-Lite', provider: 'gemini', url: 'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash-lite:generateContent' },
  { label: 'Gemini 2.5 Flash', provider: 'gemini', url: 'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent' },
  { label: 'Gemini 2.5 Pro', provider: 'gemini', url: 'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-pro:generateContent' },
];

// ─── SCIENCE TOPICS P1–SS3 ────────────────────────────────
const SCIENCE_TOPICS = [
  // Basic Science — Primary 1–3
  { text: 'The five senses: how we experience the world around us', subject: 'basic-science', classLevel: 'primary-1', complexity: 'simple' },
  { text: 'Living and non-living things: what makes something alive?', subject: 'basic-science', classLevel: 'primary-2', complexity: 'simple' },
  { text: 'Parts of a plant and what each part does', subject: 'basic-science', classLevel: 'primary-2', complexity: 'simple' },
  { text: 'Animals and their homes: habitats made simple', subject: 'basic-science', classLevel: 'primary-3', complexity: 'simple' },
  { text: 'Water: where it comes from and why we need it', subject: 'basic-science', classLevel: 'primary-3', complexity: 'simple' },
  // Mathematics — Primary 1–3
  { text: 'Addition and subtraction using everyday objects', subject: 'math', classLevel: 'primary-1', complexity: 'simple' },
  { text: 'Multiplication tables: fun ways to master them', subject: 'math', classLevel: 'primary-2', complexity: 'simple' },
  { text: 'Fractions: understanding halves, quarters, and thirds', subject: 'math', classLevel: 'primary-3', complexity: 'simple' },
  // Basic Science — Primary 4–6
  { text: 'The human skeleton: bones, joints, and how we move', subject: 'basic-science', classLevel: 'primary-4', complexity: 'standard' },
  { text: 'Photosynthesis: how plants make their own food', subject: 'basic-science', classLevel: 'primary-5', complexity: 'standard' },
  { text: 'Simple machines: levers, pulleys, and inclined planes', subject: 'basic-science', classLevel: 'primary-6', complexity: 'standard' },
  { text: 'States of matter: solids, liquids, and gases explained', subject: 'basic-science', classLevel: 'primary-5', complexity: 'simple' },
  // Mathematics — Primary 4–6
  { text: 'Long division made easy: step-by-step with examples', subject: 'math', classLevel: 'primary-4', complexity: 'standard' },
  { text: 'Decimals and percentages: real-life applications', subject: 'math', classLevel: 'primary-5', complexity: 'standard' },
  { text: 'Area and perimeter of 2D shapes', subject: 'math', classLevel: 'primary-6', complexity: 'standard' },
  { text: 'Introduction to basic algebra: finding the unknown', subject: 'math', classLevel: 'primary-6', complexity: 'standard' },
  // Basic Technology — Primary 4–6
  { text: 'Tools and their uses: safety in the workshop', subject: 'basic-tech', classLevel: 'primary-4', complexity: 'simple' },
  { text: 'Simple electrical circuits: bulbs, batteries, and wires', subject: 'basic-tech', classLevel: 'primary-5', complexity: 'standard' },
  { text: 'Computer basics: hardware, software, and the internet', subject: 'basic-tech', classLevel: 'primary-6', complexity: 'standard' },
  // JSS — Basic Science
  { text: 'Cell structure: the building blocks of all living things', subject: 'basic-science', classLevel: 'jss-1', complexity: 'standard' },
  { text: 'Food and nutrition: macronutrients, micronutrients, and balanced diet', subject: 'basic-science', classLevel: 'jss-2', complexity: 'standard' },
  { text: 'Reproduction in plants and animals', subject: 'basic-science', classLevel: 'jss-3', complexity: 'standard' },
  // JSS — Basic Technology
  { text: 'Properties of materials: metals, wood, plastics, and ceramics', subject: 'basic-tech', classLevel: 'jss-1', complexity: 'standard' },
  { text: 'Drawing and sketching: orthographic projection basics', subject: 'basic-tech', classLevel: 'jss-2', complexity: 'standard' },
  { text: 'Electricity and magnetism: principles and applications', subject: 'basic-tech', classLevel: 'jss-3', complexity: 'standard' },
  // JSS — Mathematics
  { text: 'Algebra: simplifying expressions and solving linear equations', subject: 'math', classLevel: 'jss-1', complexity: 'standard' },
  { text: 'Pythagoras theorem: proof and real-world uses', subject: 'math', classLevel: 'jss-2', complexity: 'standard' },
  { text: 'Statistics: mean, median, mode, and range with worked examples', subject: 'math', classLevel: 'jss-3', complexity: 'standard' },
  { text: 'Quadratic expressions: factorisation and completing the square', subject: 'math', classLevel: 'jss-3', complexity: 'deep' },
  // SS — Mathematics
  { text: 'Trigonometry: sine, cosine, tangent and the unit circle', subject: 'math', classLevel: 'ss-1', complexity: 'deep' },
  { text: 'Differentiation: first principles and standard derivatives', subject: 'math', classLevel: 'ss-2', complexity: 'deep' },
  { text: 'Integration: techniques and area under a curve', subject: 'math', classLevel: 'ss-3', complexity: 'deep' },
  { text: 'Logarithms and exponentials: rules and problem solving', subject: 'math', classLevel: 'ss-1', complexity: 'standard' },
  { text: 'Vectors and scalars: magnitude, direction, and operations', subject: 'math', classLevel: 'ss-1', complexity: 'standard' },
  { text: 'Matrices and determinants: operations and applications', subject: 'math', classLevel: 'ss-2', complexity: 'deep' },
  // SS — Physics
  { text: "Newton's laws of motion: understanding force and acceleration", subject: 'physics', classLevel: 'ss-1', complexity: 'deep' },
  { text: 'Work, energy, and power: definitions, equations, and problems', subject: 'physics', classLevel: 'ss-1', complexity: 'deep' },
  { text: 'Waves: types, properties, and the wave equation', subject: 'physics', classLevel: 'ss-2', complexity: 'deep' },
  { text: 'Electromagnetic spectrum: from radio waves to gamma rays', subject: 'physics', classLevel: 'ss-2', complexity: 'standard' },
  { text: 'Electric fields and potential: Coulomb\'s law explained', subject: 'physics', classLevel: 'ss-2', complexity: 'deep' },
  { text: 'Nuclear physics: radioactivity, decay series, and half-life', subject: 'physics', classLevel: 'ss-3', complexity: 'deep' },
  { text: 'Capacitors and RC circuits: charge, discharge, and time constants', subject: 'physics', classLevel: 'ss-3', complexity: 'deep' },
  // SS — Chemistry
  { text: 'Atomic structure: protons, neutrons, electrons, and energy levels', subject: 'chemistry', classLevel: 'ss-1', complexity: 'deep' },
  { text: 'Chemical bonding: ionic, covalent, and metallic bonds', subject: 'chemistry', classLevel: 'ss-1', complexity: 'standard' },
  { text: 'Mole concept: Avogadro\'s number and stoichiometry', subject: 'chemistry', classLevel: 'ss-2', complexity: 'deep' },
  { text: 'Acids, bases, and salts: pH, indicators, and neutralisation', subject: 'chemistry', classLevel: 'ss-2', complexity: 'deep' },
  { text: 'Electrochemistry: electrolysis, galvanic cells, and Faraday\'s laws', subject: 'chemistry', classLevel: 'ss-3', complexity: 'deep' },
  { text: 'Organic chemistry: alkanes, alkenes, and functional groups', subject: 'chemistry', classLevel: 'ss-3', complexity: 'deep' },
  { text: 'Equilibrium: Le Chatelier\'s principle and Kc calculations', subject: 'chemistry', classLevel: 'ss-3', complexity: 'deep' },
  // SS — Biology
  { text: 'Cell division: mitosis and meiosis compared', subject: 'biology', classLevel: 'ss-1', complexity: 'standard' },
  { text: 'Genetics: Mendel\'s laws, inheritance patterns, and Punnett squares', subject: 'biology', classLevel: 'ss-2', complexity: 'deep' },
  { text: 'Evolution: natural selection, adaptation, and evidence', subject: 'biology', classLevel: 'ss-3', complexity: 'deep' },
  { text: 'Ecology: food chains, food webs, and energy flow in ecosystems', subject: 'biology', classLevel: 'ss-1', complexity: 'standard' },
  { text: 'The circulatory system: heart structure, blood vessels, and blood pressure', subject: 'biology', classLevel: 'ss-2', complexity: 'standard' },
  { text: 'Respiration: aerobic vs anaerobic, ATP and the Krebs cycle', subject: 'biology', classLevel: 'ss-3', complexity: 'deep' },
];

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
setPersistence(auth, browserLocalPersistence);

let geminiApiKey = null;
let groqApiKey = null;
let currentUser = null;
let activeTimeout = null;
let publishCount = 0;
let pendingDeleteId = null;
let pendingMetaId = null;
let pendingImgId = null;
let pendingImgContent = '';
let pendingLinksId = null;

// DOM
const authStatusSpan = document.getElementById('authStatus');
const statusDot = document.getElementById('statusDot');
const publishCountSpan = document.getElementById('publishCount');
const nextRunMinutesSpan = document.getElementById('nextRunMinutes');
const nextRunDetailSpan = document.getElementById('nextRunDetail');
const routingIndicator = document.getElementById('routingIndicator');
const logContainer = document.getElementById('logContainer');
const forceBtn = document.getElementById('forcePublishBtn');
const restartBtn = document.getElementById('restartSchedulerBtn');
const testBtn = document.getElementById('testWriteBtn');
const refreshPostsBtn = document.getElementById('refreshPostsBtn');
const confirmModal = document.getElementById('confirmModal');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
const confirmPostTitle = document.getElementById('confirmPostTitle');
const metaModal = document.getElementById('metaModal');
const saveMetaBtn = document.getElementById('saveMetaBtn');
const cancelMetaBtn = document.getElementById('cancelMetaBtn');
const linksModal = document.getElementById('linksModal');
const saveLinksBtn = document.getElementById('saveLinksBtn');
const cancelLinksBtn = document.getElementById('cancelLinksBtn');
const imgModal = document.getElementById('imgModal');
const saveImgBtn = document.getElementById('saveImgBtn');
const cancelImgBtn = document.getElementById('cancelImgBtn');
const paraBlocksList = document.getElementById('paraBlocksList');
const featuredImgInput = document.getElementById('featuredImgInput');
const featuredImgThumb = document.getElementById('featuredImgThumb');
const imgPendingBanner = document.getElementById('imgPendingBanner');
const videoUrlInput = document.getElementById('videoUrlInput');
const practiceUrlInput = document.getElementById('practiceUrlInput');
const videoThumbImg = document.getElementById('videoThumbImg');
const videoPlayBadge = document.getElementById('videoPlayBadge');
const practicePreviewCard = document.getElementById('practicePreviewCard');
const practiceFavicon = document.getElementById('practiceFavicon');
const practiceDomain = document.getElementById('practiceDomain');

// ─── UTILS ────────────────────────────────────────────────
function addLog(msg, type = 'info') {
  const t = new Date().toLocaleTimeString();
  const el = document.createElement('div');
  el.className = 'log-entry';
  const cls = { success: 'log-success', error: 'log-error', warn: 'log-warn' } [type] || 'log-info';
  el.innerHTML = `<span class="log-time">[${t}]</span> <span class="${cls}">${escHtml(msg)}</span>`;
  logContainer.appendChild(el);
  el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

const escHtml = s => { if (!s) return ''; return s.replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' } [m])); };
const formatDate = ts => { if (!ts) return '--'; const d = ts.toDate ? ts.toDate() : new Date(ts); return d.toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' }); };
const rand = arr => arr[Math.floor(Math.random() * arr.length)];
const randMs = () => Math.floor(Math.random() * 5 * 60 * 1000 + 10 * 60 * 1000);

// Badge helpers
const SUBJECT_LABEL = { math: 'Mathematics', chemistry: 'Chemistry', biology: 'Biology', physics: 'Physics', 'basic-science': 'Basic Science', 'basic-tech': 'Basic Technology' };
const SUBJECT_CLS = { math: 'sci-math', chemistry: 'sci-chemistry', biology: 'sci-biology', physics: 'sci-physics', 'basic-science': 'sci-basicscience', 'basic-tech': 'sci-basictech' };
const CLASS_LABEL = cl => { if (!cl) return '--'; const [type, ...rest] = cl.split('-'); const n = rest.join(' '); if (type === 'primary') return `P${n}`; if (type === 'jss') return `JSS ${n}`; if (type === 'ss') return `SS ${n}`; return cl; };
const CLASS_CLS = cl => { if (!cl) return 'cls-primary'; if (cl.startsWith('primary')) return 'cls-primary'; if (cl.startsWith('jss')) return 'cls-jss'; return 'cls-ss'; };

function updateNextDisplay(ms) {
  if (!ms) {
    nextRunMinutesSpan.innerText = '--';
    nextRunDetailSpan.innerText = 'Next: idle';
    return;
  }
  const m = Math.round(ms / 60000);
  nextRunMinutesSpan.innerText = m;
  nextRunDetailSpan.innerText = `Next: in ${m} min`;
}

function clearScheduler() {
  if (activeTimeout) {
    clearTimeout(activeTimeout);
    activeTimeout = null;
  }
}

function scheduleNextRun(ms) {
  clearScheduler();
  if (!geminiApiKey && !groqApiKey) { addLog('[SCHED] No key', 'warn'); return; } addLog(`[SCHED] Next in ${Math.round(ms/60000)} min`, 'info');
  updateNextDisplay(ms);
  activeTimeout = setTimeout(async () => {
    activeTimeout = null;
    await executePublishCycle();
  }, ms);
}

function showRoutingBadge(provider, isFallback) {
  const cls = isFallback ? 'fallback' : provider.toLowerCase();
  const lbl = (isFallback ? `Fallback: ${provider}` : provider).toUpperCase();
  routingIndicator.innerHTML = `<div class="routing-badge ${cls}"><svg style="width:11px;height:11px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg> ${lbl}</div>`;
}

// ─── VIDEO THUMBNAIL ──────────────────────────────────────
// ─── VIDEO THUMBNAIL & DOMAIN HELPERS ──────────────────────
function getYouTubeThumbnail(url) {
  if (!url) return null;
  // Updated regex to support watch?v=, youtu.be, embed, and shorts/
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|shorts\/)([^&\n?#]+)/);
  return m ? `https://img.youtube.com/vi/${m[1]}/mqdefault.jpg` : null;
}

function getDomain(url) {
  try {
    // Cleans up the URL to show a nice name like "geogebra.org"
    return new URL(url).hostname.replace(/^www\./, '');
  } catch (_) {
    return url;
  }
}


// Video Preview Listener
videoUrlInput.addEventListener('input', () => {
  let input = videoUrlInput.value.trim();
  
  // If user pasted <iframe>, extract src for the thumbnail generator
  if (input.includes('<iframe')) {
    const srcMatch = input.match(/src=["']([^"']+)["']/);
    input = srcMatch ? srcMatch[1] : input;
  }
  
  const thumb = getYouTubeThumbnail(input);
  if (thumb) {
    videoThumbImg.src = thumb;
    videoThumbImg.classList.add('visible');
    videoPlayBadge.style.display = 'flex';
  } else {
    videoThumbImg.classList.remove('visible');
    videoPlayBadge.style.display = 'none';
  }
});

// Practice Preview Listener
// Practice Preview Listener
practiceUrlInput.addEventListener('input', () => {
  let input = practiceUrlInput.value.trim();
  
  // If user pasted <iframe>, extract src
  if (input.includes('<iframe')) {
    const srcMatch = input.match(/src=["']([^"']+)["']/);
    input = srcMatch ? srcMatch[1] : input;
  }
  
  if (input) {
    const domain = getDomain(input);
    practiceDomain.textContent = domain;
    // Show snapshot preview, fallback to favicon
    practiceFavicon.src = `https://image.thum.io/get/width/100/crop/100/${input}`;
    practiceFavicon.onerror = () => {
      practiceFavicon.src = `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
      practiceFavicon.onerror = null;
    };
    practicePreviewCard.classList.add('visible');
  } else {
    practicePreviewCard.classList.remove('visible');
  }
});

practiceUrlInput.addEventListener('input', () => {
  const url = practiceUrlInput.value.trim();
  if (url) {
    const domain = getDomain(url);
    practiceDomain.textContent = domain;
    practiceFavicon.src = `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
    practiceFavicon.onerror = () => { practiceFavicon.style.display = 'none'; };
    practicePreviewCard.classList.add('visible');
  } else {
    practicePreviewCard.classList.remove('visible');
  }
});

// ─── API KEYS ─────────────────────────────────────────────
async function loadApiKeys(user) {
  if (!user) return false;
  for (let i = 1; i <= 3; i++) {
    try {
      addLog(`[KEYS] Fetching (attempt ${i})...`, 'info');
      const snap = await getDoc(doc(db, 'users', user.uid));
      if (!snap.exists()) { addLog('[KEYS] User doc missing', 'error'); return false; }
      const d = snap.data();
      geminiApiKey = d.geminiKey || d.geminiApiKey || d.apiKey || d.gemini || null;
      groqApiKey = d.groqKey || d.groqApiKey || null;
      const loaded = [];
      if (geminiApiKey) loaded.push('Gemini');
      if (groqApiKey) loaded.push('Groq');
      if (!loaded.length) { addLog('[KEYS] No keys found', 'error'); return false; }
      addLog(`[KEYS] Loaded: ${loaded.join(', ')}`, 'success');
      return true;
    } catch (e) { addLog(`[KEYS] Attempt ${i}: ${e.message}`, 'error'); if (i < 3) await new Promise(r => setTimeout(r, 2000)); }
  }
  return false;
}

// ─── SCIENCE PROMPT ───────────────────────────────────────
function buildSciencePrompt(topic) {
  const { text, subject, classLevel } = topic;
  const subjectLabel = SUBJECT_LABEL[subject] || subject;
  const classLabel = CLASS_LABEL(classLevel);
  const levelType = classLevel.startsWith('primary') ? 'primary' : classLevel.startsWith('jss') ? 'jss' : 'ss';
  
  // ── TONE per level ──────────────────────────────────────
  const toneGuide = {
    primary: `You are a warm, patient primary school teacher (ages 6–12). You explain things the same way you'd explain to a curious child asking "why?". Use:
- Very short sentences. One idea per sentence.
- Everyday objects as examples (water bottle, fan, mango, football).
- Encouraging phrases like "Good question!", "Here's the cool part:", "Now you try:".
- Zero jargon. If a word sounds "textbooky", replace it with a simpler one.
- Active voice. Talk directly TO the student: "You know how...", "Have you ever noticed...".`,
    
    jss: `You are a JSS teacher who makes science click for 11–15 year olds. Your style:
- Friendly and direct — like explaining to a smart classmate.
- Introduce each new term immediately followed by a plain-English explanation in brackets. Example: "osmosis (the movement of water through a membrane — think of water seeping through wet paper)".
- Use Nigerian everyday examples: NEPA light, buses, suya, market, rain season.
- Break explanations into small digestible chunks. Use numbered steps where order matters.
- Acknowledge what's confusing: "This is the part many students get wrong — let's slow down here."`,
    
    ss: `You are an SS teacher helping students aged 15–19 pass WAEC, NECO, and JAMB. Your approach:
- Rigorous but never robotic. Think "knowledgeable friend who aced the exam".
- Flag WAEC/JAMB exam patterns explicitly: "WAEC loves to ask about...", "In JAMB 2023 they tested this exact concept".
- Teach the WHY behind formulas — don't just state them.
- For every concept, immediately show it working in a real calculation or scenario.
- Anticipate misconceptions: "Students often confuse X with Y — here's how to tell them apart".
- Use numbered derivations and worked solutions with clear step labels (Step 1, Step 2…).`
  } [levelType];
  
  // ── MathJax LaTeX requirement ────────────────────────────
  const mathJaxNote = (['math', 'physics', 'chemistry'].includes(subject)) ? `

EQUATION FORMATTING — ABSOLUTELY REQUIRED:
Every single mathematical expression, formula, symbol, or number with a unit MUST be written in LaTeX for MathJax.
- Inline math wrapping:  \\( expression \\)   →  example: "the speed \\( v = 20 \\, \\text{m/s} \\)"
- Display (block) math:  \\[ expression \\]   →  for standalone equations, derivations, and worked solutions
- LaTeX rules:
    • Fractions:      \\frac{numerator}{denominator}
    • Powers:         x^{2},  v^{2}
    • Subscripts:     x_{0},  v_{i}
    • Square roots:   \\sqrt{x}
    • Units in text:  \\text{m/s},  \\text{kg},  \\text{J}
    • Multiplication dot:  \\times  or  \\cdot
    • Greek letters:  \\alpha,  \\lambda,  \\Delta,  \\pi
    • Summation:      \\sum_{i=1}^{n}
    • Integrals:      \\int_{a}^{b}
NEVER write "E = mc2" — always "\\( E = mc^2 \\)".
NEVER write plain text fractions like "a/b" in equations — use \\frac{a}{b}.` : '';
  
  // ── Hook instruction per level ───────────────────────────
  const hookGuide = {
    primary: `Open your first <p> with a short, exciting question or surprising fact a child cannot ignore. Something they can picture RIGHT NOW from their daily life. Examples:
  - "Did you know your body has more bones than a full bag of sugar has grains? Okay, not really — but you DO have 206 bones!"
  - "Close your eyes and touch your nose. How did your hand know where to go?"`,
    jss: `Open with a real-world scenario or "Did you know" fact that connects the topic to something students actually encounter. Make them think: "Oh, that's actually interesting." Examples:
  - "Every time you charge your phone, you're using the same principle scientists use to purify metals. Let's find out how."
  - "Why does a car feel heavier to push when it's pointing uphill?"`,
    ss: `Open by exposing a common misconception OR showing a real exam-style question at the top. Make the student feel "I need to understand this to pass." Examples:
  - "Most SS students lose 4–6 marks in WAEC Physics on this single topic. Not because it's hard, but because they memorise the wrong thing. Let's fix that."
  - "Before we start: can you explain the difference between \\( Q = mcΔT \\) and \\( Q = ml \\)? If you hesitated, keep reading."`
  } [levelType];
  
  // ── Worked examples instruction ──────────────────────────
  const workedExamples = (['math', 'physics', 'chemistry'].includes(subject)) ?
    `
WORKED EXAMPLES — MANDATORY:
Include at least 2 fully solved problems. Format each one like this:

<div class="worked-example">
  <h4>Example 1: [short description]</h4>
  <p><strong>Given:</strong> [list what is known, using LaTeX for all values]</p>
  <p><strong>Find:</strong> [what to calculate]</p>
  <p><strong>Step 1 — [action]:</strong> [explanation + LaTeX equation]</p>
  <p><strong>Step 2 — [action]:</strong> [explanation + LaTeX equation]</p>
  <p><strong>Answer:</strong> \\( result \\)</p>
  <p class="exam-tip"><strong>Exam tip:</strong> [one sentence on how WAEC/JAMB tests this]</p>
</div>

Show EVERY algebraic manipulation step. Never skip a line.` :
    `
REAL-WORLD EXAMPLE — MANDATORY:
Include at least one concrete example or mini case study that connects the concept to Nigerian students' real lives. Format it with a clear heading like:
<div class="worked-example">
  <h4>Real-life example: [short title]</h4>
  [explanation]
</div>`;
  
  return `You are an expert Nigerian science and mathematics teacher writing a structured lesson article for "Prep Portal 2026".

YOUR ROLE: You are TEACHING, not storytelling. Every paragraph must move the student forward in understanding. Think of this as a written lesson — not an essay, not a story, not a Wikipedia article.

SUBJECT: ${subjectLabel}
CLASS LEVEL: ${classLabel} (${levelType === 'primary' ? 'ages 6–12' : levelType === 'jss' ? 'ages 11–15' : 'ages 15–19, WAEC/NECO/JAMB'})
TOPIC: ${text}
LESSON LENGTH: ${levelType === 'primary' ? '3–4 minutes reading time' : levelType === 'jss' ? '4–6 minutes' : '7–9 minutes'}

YOUR TEACHING STYLE:
${toneGuide}
${mathJaxNote}

LESSON STRUCTURE — follow this exactly:

1. <h1> TITLE
   Make it specific and curiosity-provoking. Bad: "Newton's Laws of Motion". Good: "Why You Lurch Forward When a Bus Brakes Suddenly: Newton's Laws Finally Made Clear".

2. OPENING HOOK (first <p> after the title)
${hookGuide}

3. LESSON SECTIONS (3–5 × <h2> + <p> paragraphs)
   Each <h2> should read like a teaching step, not a textbook chapter.
   Bad heading: "Definition of Force". Good heading: "What Exactly Is a Force? Let's Build the Right Picture."
   
   Inside each section:
   - Explain the concept clearly FIRST in plain language.
   - Then introduce formal definitions or formulas (with LaTeX if applicable).
   - Use short connecting phrases to guide the reader: "Now here's where it gets interesting...", "Before we move on, make sure you understand...", "Think of it this way...".
   - When introducing a new term, always define it in the same sentence.

4. LIST OF KEY POINTS OR STEPS
   Include at least one <ol> or <ul> with:
   - Clear, scannable bullet points or numbered steps.
   - For processes: use <ol> with numbered steps.
   - For summary points: use <ul>.
${workedExamples}

5. CLOSING PARAGRAPH
   End with: one sentence summarising what the student now knows, one specific action they can take TODAY (e.g., "Try solving this: [short problem]" or "Open your textbook to page X and re-read section Y with these notes in mind"), and one word of genuine encouragement.

HARD RULES:
- Output ONLY clean HTML body content starting from the <h1>. No <html>, no <head>, no markdown.
- NO <img> tags whatsoever — images are added by admin.
- No filler phrases like "In this article, we will explore..." or "As you can see...".
- Every single sentence must teach something or guide understanding.
- Vary sentence length — mix short punchy sentences with longer explanations.

METADATA (keep this comment): <!-- subject:${subject} classLevel:${classLevel} -->`;
}

// ─── GENERATION WITH FALLBACK CHAIN ───────────────────────
async function callGroq(model, prompt) {
  // 🚨 FIX: Added corsproxy.io to bypass the browser's CORS block
  const targetUrl = encodeURIComponent('https://api.groq.com/openai/v1/chat/completions');
  
  const response = await fetch('https://corsproxy.io/?' + targetUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${groqApiKey}`
    },
    body: JSON.stringify({
      model: model.model, // e.g., 'llama-3.3-70b-versatile'
      messages: [
      {
        role: 'system',
        content: 'You are an expert science educator for Nigerian students. Output only clean HTML with MathJax LaTeX equations for any mathematical expressions. No markdown, no <img> tags. Use \\( ... \\) for inline math and \\[ ... \\] for display math.'
      },
      {
        role: 'user',
        content: prompt
      }],
      temperature: 0.72,
      max_tokens: 3500,
      top_p: 0.95
    })
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('Groq API error:', response.status, errorText);
    throw new Error(`Groq ${response.status}: ${errorText.substring(0, 150)}`);
  }
  
  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  
  if (!content) {
    throw new Error('Groq returned empty response');
  }
  
  return content;
}

async function callGemini(model, prompt) {
  const r = await fetch(`${model.url}?key=${geminiApiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.72, maxOutputTokens: 3200 } })
  });
  if (!r.ok) { const t = await r.text(); throw new Error(`Gemini ${r.status}: ${t.substring(0,100)}`); }
  const d = await r.json();
  const c = d.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!c) throw new Error('Gemini empty');
  return c;
}

async function generateWithFallback(topic) {
  const prompt = buildSciencePrompt(topic);
  const complex = topic.complexity || 'standard';
  
  let chain;
  if (complex === 'simple' && groqApiKey) {
    chain = [...GROQ_MODELS.map(m => ({ ...m, isFallback: false })), ...GEMINI_MODELS.slice(0, 2).map(m => ({ ...m, isFallback: true }))];
  } else if (complex === 'deep' && geminiApiKey) {
    chain = [...GEMINI_MODELS.slice(0, 2).map(m => ({ ...m, isFallback: false })), ...(groqApiKey ? GROQ_MODELS.slice(0, 1).map(m => ({ ...m, isFallback: true })) : []), ...GEMINI_MODELS.slice(2).map(m => ({ ...m, isFallback: true }))];
  } else {
    chain = [...(groqApiKey ? GROQ_MODELS.map(m => ({ ...m, isFallback: false })) : []), ...GEMINI_MODELS.map(m => ({ ...m, isFallback: false }))];
  }
  chain = chain.filter(m => m.provider === 'groq' ? !!groqApiKey : !!geminiApiKey);
  if (!chain.length) throw new Error('No API keys');
  
  for (const model of chain) {
    addLog(`[MODEL] Trying ${model.label}${model.isFallback?' (fallback)':''}...`, 'info');
    showRoutingBadge(model.provider, model.isFallback);
    try {
      let raw = model.provider === 'groq' ? await callGroq(model, prompt) : await callGemini(model, prompt);
      raw = raw.trim().replace(/```html\n?/gi, '').replace(/```\n?/g, '').replace(/<img[^>]*>/gi, '');
      const titleMatch = raw.match(/<h1[^>]*>([^<]+)<\/h1>/i);
      const title = titleMatch ? titleMatch[1].trim() : topic.text;
      const excerpt = raw.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 160);
      addLog(`[OK] "${title}" via ${model.label}`, 'success');
      return { title, content: raw, excerpt, subject: topic.subject, classLevel: topic.classLevel, modelUsed: model.label };
    } catch (e) {
      const isQuota = e.message.toLowerCase().match(/credit|quota|rate|insufficient/);
      addLog(`[FAIL] ${model.label}: ${e.message.substring(0,80)}${isQuota?' [quota]':''}`, 'error');
    }
  }
  throw new Error('All models exhausted');
}

// ─── PUBLISH ──────────────────────────────────────────────
async function publishPost(post) {
  if (!currentUser) throw new Error('Not signed in');
  const ref = await addDoc(collection(db, 'science-posts'), {
    title: post.title,
    content: post.content,
    excerpt: post.excerpt,
    featuredImage: '',
    videoLink: '',
    practiceLink: '',
    subject: post.subject,
    classLevel: post.classLevel,
    status: 'published',
    authorId: currentUser.uid,
    authorEmail: currentUser.email,
    publishedAt: serverTimestamp(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    views: 0,
    likes: [],
    imagesAdded: false,
    linksAdded: false,
    modelUsed: post.modelUsed,
    source: 'auto-science-v1'
  });
  return ref.id;
}

async function executePublishCycle() {
  if (!geminiApiKey && !groqApiKey) {
    addLog('[CYCLE] No key', 'warn');
    if (currentUser) await loadApiKeys(currentUser);
    scheduleNextRun(5 * 60 * 1000);
    return;
  }
  if (!currentUser) {
    addLog('[CYCLE] No user', 'error');
    scheduleNextRun(5 * 60 * 1000);
    return;
  }
  const topic = rand(SCIENCE_TOPICS);
  addLog(`[RUN] "${topic.text}" [${topic.subject} / ${CLASS_LABEL(topic.classLevel)}]`, 'info');
  try {
    const post = await generateWithFallback(topic);
    const postId = await publishPost(post);
    publishCount++;
    publishCountSpan.innerText = publishCount;
    localStorage.setItem('sciencePublishCount', publishCount);
    addLog(`[DONE] ID: ${postId.substring(0,10)}... — add images + links via panel`, 'success');
    scheduleNextRun(randMs());
    loadRecentPosts();
  } catch (e) {
    addLog(`[ERR] ${e.message}`, 'error');
    scheduleNextRun(5 * 60 * 1000);
  }
}

const forcePublish = async () => {
  if (!geminiApiKey && !groqApiKey) { if (currentUser) await loadApiKeys(currentUser); return; } clearScheduler();
  addLog('[MAN] Manual publish', 'info');
  await executePublishCycle();
};
const testFirestore = async () => {
  addLog('[TEST] Testing...', 'info');
  try {
    const s = await getDocs(collection(db, 'science-posts'));
    addLog(`[OK] ${s.size} posts`, 'success');
  } catch (e) { addLog(`[ERR] ${e.message}`, 'error'); }
};
const restartScheduler = () => {
  clearScheduler();
  if (geminiApiKey || groqApiKey) {
    scheduleNextRun(randMs());
    addLog('[OK] Restarted', 'success');
  } else addLog('[WARN] No keys', 'error');
};

// ─── MANAGE POSTS ─────────────────────────────────────────
async function loadRecentPosts() {
  const list = document.getElementById('managePostsList');
  list.innerHTML = `<li class="manage-loading"><div class="spinner-ring"></div>Loading...</li>`;
  try {
    const q = query(collection(db, 'science-posts'), orderBy('publishedAt', 'desc'), limit(30));
    const snap = await getDocs(q);
    if (snap.empty) { list.innerHTML = '<li class="manage-empty">No posts yet.</li>'; return; }
    list.innerHTML = '';
    snap.forEach(d => {
      const data = d.data();
      const subj = data.subject || 'math';
      const cls = data.classLevel || 'ss-1';
      const sciCls = SUBJECT_CLS[subj] || 'sci-math';
      const clsCls = CLASS_CLS(cls);
      const subjLbl = SUBJECT_LABEL[subj] || subj;
      const clsLbl = CLASS_LABEL(cls);
      const hasImg = !!data.featuredImage || data.imagesAdded;
      const hasLinks = data.linksAdded || (data.videoLink || data.practiceLink);
      
      const li = document.createElement('li');
      li.className = 'manage-post-item';
      li.innerHTML = `
            <div class="manage-post-info">
              <div class="manage-post-title" title="${escHtml(data.title||'')}">${escHtml(data.title||'Untitled')}</div>
              <div class="manage-post-meta">
                <span>${formatDate(data.publishedAt)}</span>
                <span class="sci-badge ${sciCls}">${subjLbl}</span>
                <span class="cls-badge ${clsCls}">${clsLbl}</span>
                ${data.modelUsed ? `<span>${escHtml(data.modelUsed.split(' ').slice(0,2).join(' '))}</span>` : ''}
                ${data.views ? `<span>${data.views} views</span>` : ''}
                ${!hasImg ? `<span class="pill-pending"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>No imgs</span>` : ''}
                ${!hasLinks ? `<span class="pill-pending pill-links-missing"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>No links</span>` : ''}
              </div>
            </div>
            <div class="manage-post-actions">
              <button class="btn btn-sm btn-links links-btn"
                data-id="${d.id}"
                data-title="${escHtml(data.title||'Untitled')}"
                data-video="${escHtml(data.videoLink||'')}"
                data-practice="${escHtml(data.practiceLink||'')}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                <span class="btn-label">Links</span>
              </button>
              <button class="btn btn-sm btn-edit img-btn"
                data-id="${d.id}"
                data-title="${escHtml(data.title||'Untitled')}"
                data-featured="${escHtml(data.featuredImage||'')}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                <span class="btn-label">Images</span>
              </button>
              <button class="btn btn-sm meta-btn"
                data-id="${d.id}"
                data-title="${escHtml(data.title||'')}"
                data-subject="${escHtml(subj)}"
                data-class="${escHtml(cls)}"
                data-excerpt="${escHtml(data.excerpt||'')}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                <span class="btn-label">Edit</span>
              </button>
              <button class="btn btn-sm btn-danger del-btn"
                data-id="${d.id}"
                data-title="${escHtml(data.title||'Untitled')}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6l-1 14H6L5 6"></path><path d="M10 11v6M14 11v6"></path><path d="M9 6V4h6v2"></path></svg>
                <span class="btn-label">Delete</span>
              </button>
            </div>`;
      list.appendChild(li);
    });
    
    // Wire Links buttons
    list.querySelectorAll('.links-btn').forEach(btn => {
      btn.addEventListener('click', () => openLinksModal(btn.dataset.id, btn.dataset.title, btn.dataset.video, btn.dataset.practice));
    });
    
    // Wire Image buttons
    list.querySelectorAll('.img-btn').forEach(btn => {
      btn.addEventListener('click', () => openImageEditor(btn.dataset.id, btn.dataset.title, btn.dataset.featured));
    });
    
    // Wire Meta buttons
    list.querySelectorAll('.meta-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        pendingMetaId = btn.dataset.id;
        document.getElementById('metaTitle').value = btn.dataset.title || '';
        document.getElementById('metaSubject').value = btn.dataset.subject || 'math';
        document.getElementById('metaClass').value = btn.dataset.class || 'ss-1';
        document.getElementById('metaExcerpt').value = btn.dataset.excerpt || '';
        metaModal.classList.add('active');
      });
    });
    
    // Wire Delete buttons
    list.querySelectorAll('.del-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        pendingDeleteId = btn.dataset.id;
        confirmPostTitle.textContent = `"${btn.dataset.title}" — this cannot be undone.`;
        confirmModal.classList.add('active');
      });
    });
  } catch (e) {
    list.innerHTML = `<li class="manage-empty">Error: ${escHtml(e.message)}</li>`;
    addLog(`[ERR] ${e.message}`, 'error');
  }
}

// ─── LINKS EDITOR ─────────────────────────────────────────
function openLinksModal(postId, postTitle, currentVideo, currentPractice) {
  pendingLinksId = postId;
  document.getElementById('linksModal').querySelector('#linksModalSubtitle').textContent = `"${postTitle}" — add a video and interactive practice link.`;
  videoUrlInput.value = currentVideo || '';
  practiceUrlInput.value = currentPractice || '';
  // Reset previews
  videoThumbImg.classList.remove('visible');
  videoPlayBadge.style.display = 'none';
  practicePreviewCard.classList.remove('visible');
  // Trigger previews if values exist
  if (currentVideo) videoUrlInput.dispatchEvent(new Event('input'));
  if (currentPractice) practiceUrlInput.dispatchEvent(new Event('input'));
  linksModal.classList.add('active');
}

saveLinksBtn.addEventListener('click', async () => {
  if (!pendingLinksId) return;
  const video = videoUrlInput.value.trim();
  const practice = practiceUrlInput.value.trim();
  saveLinksBtn.disabled = true;
  saveLinksBtn.textContent = 'Saving...';
  try {
    await updateDoc(doc(db, 'science-posts', pendingLinksId), {
      videoLink: video,
      practiceLink: practice,
      linksAdded: !!(video || practice),
      updatedAt: serverTimestamp()
    });
    addLog(`[LINKS] Saved for ${pendingLinksId.substring(0,10)}...`, 'success');
    linksModal.classList.remove('active');
    pendingLinksId = null;
    await loadRecentPosts();
  } catch (e) { addLog(`[ERR] ${e.message}`, 'error'); }
  finally {
    saveLinksBtn.disabled = false;
    saveLinksBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>Save Links`;
  }
});
cancelLinksBtn.addEventListener('click', () => {
  linksModal.classList.remove('active');
  pendingLinksId = null;
});
linksModal.addEventListener('click', e => {
  if (e.target === linksModal) {
    linksModal.classList.remove('active');
    pendingLinksId = null;
  }
});

// ─── IMAGE EDITOR ─────────────────────────────────────────
async function openImageEditor(postId, postTitle, currentFeatured) {
  pendingImgId = postId;
  document.getElementById('imgModalSubtitle').textContent = `"${postTitle}" — paste image URLs per paragraph.`;
  paraBlocksList.innerHTML = `<div class="manage-loading"><div class="spinner-ring"></div>Loading...</div>`;
  imgPendingBanner.style.display = 'none';
  featuredImgInput.value = currentFeatured || '';
  updateFeaturedThumb(currentFeatured || '');
  imgModal.classList.add('active');
  try {
    const snap = await getDoc(doc(db, 'science-posts', postId));
    if (!snap.exists()) { addLog('[IMG] Post not found', 'error'); return; }
    const data = snap.data();
    pendingImgContent = data.content || '';
    imgPendingBanner.style.display = (!data.featuredImage && !data.imagesAdded) ? 'flex' : 'none';
    renderParaBlocks(pendingImgContent);
  } catch (e) { paraBlocksList.innerHTML = `<div class="manage-empty">Error: ${escHtml(e.message)}</div>`; }
}

function renderParaBlocks(html) {
  const container = document.createElement('div');
  container.innerHTML = html;
  const BLOCK_TAGS = new Set(['H1', 'H2', 'H3', 'H4', 'P', 'UL', 'OL', 'BLOCKQUOTE', 'TABLE', 'PRE', 'DIV']);
  const blocks = [];
  container.childNodes.forEach(node => { if (node.nodeType !== Node.ELEMENT_NODE) return; if (node.tagName === 'IMG') return; if (BLOCK_TAGS.has(node.tagName)) blocks.push(node); });
  if (!blocks.length) { paraBlocksList.innerHTML = '<div class="manage-empty">No paragraph blocks found.</div>'; return; }
  paraBlocksList.innerHTML = '';
  blocks.forEach((block, idx) => {
    const preview = block.textContent.trim().replace(/\s+/g, ' ').substring(0, 90);
    const row = document.createElement('div');
    row.className = 'para-block';
    row.dataset.idx = idx;
    row.innerHTML = `
          <div class="para-block-header">
            <span class="para-block-type">${block.tagName}</span>
            <span class="para-block-preview">${escHtml(preview)||'(empty)'}</span>
          </div>
          <div class="para-block-body">
            <div class="para-img-row">
              <input type="url" class="para-img-input" data-idx="${idx}" placeholder="Image URL (leave blank to skip)">
              <img class="para-img-preview" alt="" data-idx="${idx}">
            </div>
            <p class="para-void-note"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>Leave blank for no image on this paragraph.</p>
          </div>`;
    paraBlocksList.appendChild(row);
    const input = row.querySelector('.para-img-input');
    const prev = row.querySelector('.para-img-preview');
    input.addEventListener('input', () => {
      const u = input.value.trim();
      if (u) {
        input.classList.add('has-img');
        prev.src = u;
        prev.classList.add('visible');
        prev.onerror = () => {
          prev.src = '';
          prev.classList.remove('visible');
        };
      }
      else {
        input.classList.remove('has-img');
        prev.src = '';
        prev.classList.remove('visible');
      }
    });
  });
  paraBlocksList._blocks = blocks;
}

featuredImgInput.addEventListener('input', () => updateFeaturedThumb(featuredImgInput.value.trim()));

function updateFeaturedThumb(url) {
  if (url) {
    featuredImgThumb.src = url;
    featuredImgThumb.classList.add('visible');
    featuredImgThumb.onerror = () => {
      featuredImgThumb.src = '';
      featuredImgThumb.classList.remove('visible');
    };
  }
  else {
    featuredImgThumb.src = '';
    featuredImgThumb.classList.remove('visible');
  }
}

saveImgBtn.addEventListener('click', async () => {
  if (!pendingImgId) return;
  const featured = featuredImgInput.value.trim();
  const blocks = paraBlocksList._blocks || [];
  const inputs = paraBlocksList.querySelectorAll('.para-img-input');
  const IMG_STYLE = 'width:100%;max-width:100%;height:auto;border:2px solid #0a0a0a;margin:1.25rem 0;display:block;';
  let newContent = '';
  blocks.forEach((block, idx) => {
    newContent += block.outerHTML;
    const input = inputs[idx];
    if (input?.value.trim()) newContent += `<img src="${escHtml(input.value.trim())}" alt="${escHtml(block.textContent.trim().substring(0,40))}" style="${IMG_STYLE}">`;
  });
  if (!newContent) newContent = pendingImgContent;
  const hasAnyImg = !!featured || [...inputs].some(i => i.value.trim());
  saveImgBtn.disabled = true;
  saveImgBtn.textContent = 'Saving...';
  try {
    await updateDoc(doc(db, 'science-posts', pendingImgId), { content: newContent, featuredImage: featured, imagesAdded: hasAnyImg, updatedAt: serverTimestamp() });
    addLog(`[IMG] Images saved for ${pendingImgId.substring(0,10)}...`, 'success');
    imgModal.classList.remove('active');
    pendingImgId = null;
    pendingImgContent = '';
    await loadRecentPosts();
  } catch (e) { addLog(`[ERR] ${e.message}`, 'error'); }
  finally {
    saveImgBtn.disabled = false;
    saveImgBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>Save Images`;
  }
});
cancelImgBtn.addEventListener('click', () => {
  imgModal.classList.remove('active');
  pendingImgId = null;
  pendingImgContent = '';
});
imgModal.addEventListener('click', e => {
  if (e.target === imgModal) {
    imgModal.classList.remove('active');
    pendingImgId = null;
    pendingImgContent = '';
  }
});

// ─── META SAVE ────────────────────────────────────────────
saveMetaBtn.addEventListener('click', async () => {
  if (!pendingMetaId) return;
  const title = document.getElementById('metaTitle').value.trim();
  const subject = document.getElementById('metaSubject').value;
  const cls = document.getElementById('metaClass').value;
  const excerpt = document.getElementById('metaExcerpt').value.trim();
  if (!title) { addLog('[META] Title required', 'warn'); return; }
  saveMetaBtn.disabled = true;
  saveMetaBtn.textContent = 'Saving...';
  try {
    await updateDoc(doc(db, 'science-posts', pendingMetaId), { title, subject, classLevel: cls, excerpt, updatedAt: serverTimestamp() });
    addLog(`[META] Updated: "${title}"`, 'success');
    metaModal.classList.remove('active');
    pendingMetaId = null;
    await loadRecentPosts();
  } catch (e) { addLog(`[ERR] ${e.message}`, 'error'); }
  finally {
    saveMetaBtn.disabled = false;
    saveMetaBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>Save Details`;
  }
});
cancelMetaBtn.addEventListener('click', () => {
  metaModal.classList.remove('active');
  pendingMetaId = null;
});
metaModal.addEventListener('click', e => {
  if (e.target === metaModal) {
    metaModal.classList.remove('active');
    pendingMetaId = null;
  }
});

// ─── DELETE ───────────────────────────────────────────────
confirmDeleteBtn.addEventListener('click', async () => {
  if (!pendingDeleteId) return;
  confirmDeleteBtn.disabled = true;
  confirmDeleteBtn.textContent = 'Deleting...';
  try {
    await deleteDoc(doc(db, 'science-posts', pendingDeleteId));
    addLog(`[DEL] ${pendingDeleteId.substring(0,10)}...`, 'success');
    confirmModal.classList.remove('active');
    pendingDeleteId = null;
    await loadRecentPosts();
  } catch (e) { addLog(`[ERR] ${e.message}`, 'error'); }
  finally {
    confirmDeleteBtn.disabled = false;
    confirmDeleteBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6l-1 14H6L5 6"></path><path d="M10 11v6M14 11v6"></path><path d="M9 6V4h6v2"></path></svg>Yes, Delete`;
  }
});
cancelDeleteBtn.addEventListener('click', () => {
  confirmModal.classList.remove('active');
  pendingDeleteId = null;
});
confirmModal.addEventListener('click', e => {
  if (e.target === confirmModal) {
    confirmModal.classList.remove('active');
    pendingDeleteId = null;
  }
});

// ─── KEYBOARD ─────────────────────────────────────────────
document.addEventListener('keydown', e => {
  if (e.key === 'Escape')[confirmModal, metaModal, linksModal, imgModal].forEach(m => { m.classList.remove('active'); });
});

// ─── NAV ──────────────────────────────────────────────────
forceBtn.addEventListener('click', forcePublish);
restartBtn.addEventListener('click', restartScheduler);
testBtn.addEventListener('click', testFirestore);
refreshPostsBtn.addEventListener('click', loadRecentPosts);
const navToggle = document.getElementById('nav-toggle'),
  navLinks = document.getElementById('navLinks');
if (navToggle && navLinks) navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// ─── INIT ─────────────────────────────────────────────────
const saved = localStorage.getItem('sciencePublishCount');
if (saved) {
  publishCount = parseInt(saved);
  publishCountSpan.innerText = publishCount;
}

onAuthStateChanged(auth, async user => {
  if (user) {
    currentUser = user;
    const short = user.email.length > 26 ? user.email.substring(0, 24) + '...' : user.email;
    statusDot.classList.remove('red');
    authStatusSpan.innerHTML = `<span class="status-dot"></span>${escHtml(short)}`;
    addLog(`[AUTH] ${user.email}`, 'success');
    const ok = await loadApiKeys(user);
    if (ok && !activeTimeout) {
      addLog('[READY] Starting scheduler...', 'success');
      scheduleNextRun(randMs());
    }
    loadRecentPosts();
  } else {
    statusDot.classList.add('red');
    authStatusSpan.innerHTML = `<span class="status-dot red"></span>Waiting for sign-in...`;
    addLog('[AUTH] Waiting...', 'info');
  }
});

setInterval(() => { if (currentUser && (geminiApiKey || groqApiKey)) console.log('[ALIVE] science publisher running'); }, 30000);
addLog('[BOOT] Science Publisher v1.0 — MathJax equations, P1–SS3 topics', 'info');
addLog('[BOOT] Admin: add Images, Video Link, and Practice Link after each post', 'success');