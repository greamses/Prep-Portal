import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, setPersistence, browserLocalPersistence } from 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  query,
  orderBy,
  limit
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA2N3uI_XfSIVsto2Ku1g_qSezmD3qFmbk",
  authDomain: "prep-portal-2026.web.app",
  projectId: "prep-portal-2026",
  storageBucket: "prep-portal-2026.firebasestorage.app",
  messagingSenderId: "837672918701",
  appId: "1:837672918701:web:e64c0c25dc01b542e23024"
};

// ─── MODEL DEFINITIONS ────────────────────────────────────
const GROQ_MODELS = [
  { label: 'Groq Llama-3.3-70B', provider: 'groq', model: 'llama-3.3-70b-versatile' },
  { label: 'Groq Llama-3.1-8B', provider: 'groq', model: 'llama-3.1-8b-instant' },
  { label: 'Groq Mixtral-8x7B', provider: 'groq', model: 'mixtral-8x7b-32768' },
];


const GEMINI_MODELS = [
{
  label: 'Gemini 3.1 Flash-Lite',
  provider: 'gemini',
  url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent'
},
{
  label: 'Gemini 3.1 Pro',
  provider: 'gemini',
  url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-pro-preview:generateContent'
},
{
  label: 'Gemini 3 Flash',
  provider: 'gemini',
  url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent'
},
{
  label: 'Gemini 2.5 Flash-Lite',
  provider: 'gemini',
  url: 'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash-lite:generateContent'
},
{
  label: 'Gemini 2.5 Flash',
  provider: 'gemini',
  url: 'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent'
},
{
  label: 'Gemini 2.5 Pro',
  provider: 'gemini',
  url: 'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-pro:generateContent'
}, ];

const BLOG_TOPICS = [
  { text: 'How to pass WAEC Mathematics without stress', audience: 'waec', complexity: 'deep' },
  { text: 'WAEC English Language: essay and comprehension techniques', audience: 'waec', complexity: 'deep' },
  { text: 'WAEC Biology: ecology and genetics quick revision', audience: 'waec', complexity: 'standard' },
  { text: 'NECO English Language: key areas to focus on', audience: 'neco', complexity: 'standard' },
  { text: 'NECO Chemistry: common topics and past question patterns', audience: 'neco', complexity: 'standard' },
  { text: 'JAMB UTME Physics: common mistakes and how to fix them', audience: 'jamb', complexity: 'deep' },
  { text: 'How to score 300+ in JAMB UTME', audience: 'jamb', complexity: 'deep' },
  { text: 'JAMB Chemistry: periodic table and bonding made simple', audience: 'jamb', complexity: 'standard' },
  { text: 'Cambridge IGCSE study schedule for top grades', audience: 'cambridge', complexity: 'deep' },
  { text: 'Cambridge A-Level Mathematics: integration strategies', audience: 'cambridge', complexity: 'deep' },
  { text: 'Common Entrance exam preparation strategies', audience: 'common', complexity: 'simple' },
  { text: 'Primary school leavers: what to expect in Common Entrance', audience: 'common', complexity: 'simple' },
  { text: 'Common Entrance Mathematics: fractions and decimals guide', audience: 'common', complexity: 'simple' },
  { text: 'How to overcome exam anxiety and perform better', audience: 'general', complexity: 'simple' },
  { text: 'Last minute revision techniques that work', audience: 'general', complexity: 'simple' },
  { text: 'Time management during exams: proven strategies', audience: 'general', complexity: 'simple' },
  { text: 'The Pomodoro method for exam preparation', audience: 'general', complexity: 'simple' },
  { text: 'Measuring teacher performance in Nigerian secondary schools', audience: 'educator', complexity: 'deep' },
  { text: 'Student performance metrics: what data tells us', audience: 'educator', complexity: 'deep' },
  { text: 'Improving academic outcomes with formative assessment strategies', audience: 'educator', complexity: 'deep' },
  { text: 'Differentiated instruction for mixed-ability classrooms', audience: 'educator', complexity: 'deep' },
  { text: 'How lesson planning affects student exam performance', audience: 'educator', complexity: 'standard' },
  { text: 'Pedagogical approaches that reduce exam failure rates', audience: 'educator', complexity: 'deep' },
  { text: 'Classroom management techniques for senior secondary teachers', audience: 'educator', complexity: 'standard' },
  { text: 'Professional development for WAEC and NECO teachers', audience: 'educator', complexity: 'standard' },
  { text: 'Using past exam data to improve school-wide academic outcomes', audience: 'educator', complexity: 'deep' },
];

const CONTENT_STYLES = ['exam-tips', 'study-guide', 'past-paper-analysis', 'motivation', 'research-based'];

// ─── APP INIT ─────────────────────────────────────────────
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
let pendingImgContent = ''; // raw HTML of the post being image-edited

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

const imgModal = document.getElementById('imgModal');
const saveImgBtn = document.getElementById('saveImgBtn');
const cancelImgBtn = document.getElementById('cancelImgBtn');
const paraBlocksList = document.getElementById('paraBlocksList');
const featuredImgInput = document.getElementById('featuredImgInput');
const featuredImgThumb = document.getElementById('featuredImgThumb');
const imgPendingBanner = document.getElementById('imgPendingBanner');
const imgModalSubtitle = document.getElementById('imgModalSubtitle');

// ─── UTILS ────────────────────────────────────────────────
function addLog(msg, type = 'info') {
  const time = new Date().toLocaleTimeString();
  const el = document.createElement('div');
  el.className = 'log-entry';
  const cls = { success: 'log-success', error: 'log-error', warn: 'log-warn' } [type] || 'log-info';
  el.innerHTML = `<span class="log-time">[${time}]</span> <span class="${cls}">${escHtml(msg)}</span>`;
  logContainer.appendChild(el);
  el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

const escHtml = s => { if (!s) return ''; return s.replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' } [m])); };

const formatDate = ts => {
  if (!ts) return '--';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' });
};

const getBadgeCls = a => ({ waec: 'badge-waec', neco: 'badge-neco', jamb: 'badge-jamb', cambridge: 'badge-cambridge', common: 'badge-common', educator: 'badge-educator' } [a] || 'badge-general');
const getBadgeLabel = a => ({ waec: 'WAEC', neco: 'NECO', jamb: 'JAMB', cambridge: 'Cambridge', common: 'Common Entrance', educator: 'Educator' } [a] || 'General');

const rand = arr => arr[Math.floor(Math.random() * arr.length)];
const randIntervalMs = () => Math.floor(Math.random() * 5 * 60 * 1000 + 10 * 60 * 1000);

function updateNextDisplay(ms) {
  if (!ms) {
    nextRunMinutesSpan.innerText = '--';
    nextRunDetailSpan.innerText = 'Next run: idle';
    return;
  }
  const m = Math.round(ms / 60000);
  nextRunMinutesSpan.innerText = m;
  nextRunDetailSpan.innerText = `Next run: in ${m} min`;
}

function clearScheduler() {
  if (activeTimeout) {
    clearTimeout(activeTimeout);
    activeTimeout = null;
  }
}

function scheduleNextRun(ms) {
  clearScheduler();
  if (!geminiApiKey && !groqApiKey) { addLog('[SCHED] No API key — cannot schedule', 'warn'); return; }
  addLog(`[SCHED] Next blog in ${Math.round(ms/60000)} min`, 'info');
  updateNextDisplay(ms);
  activeTimeout = setTimeout(async () => {
    activeTimeout = null;
    await executePublishCycle();
  }, ms);
}

function showRoutingBadge(provider, isFallback) {
  const label = isFallback ? `Fallback: ${provider}` : provider;
  const cls = isFallback ? 'fallback' : provider.toLowerCase();
  routingIndicator.innerHTML = `<div class="routing-badge ${cls}"><svg style="width:11px;height:11px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg> ${label.toUpperCase()}</div>`;
}

// ─── AUDIENCE RESOLUTION ──────────────────────────────────
const AUDIENCE_KW = {
  waec: ['waec', 'west african exam', 'ssce', 'wassce'],
  neco: ['neco', 'national examinations council'],
  jamb: ['jamb', 'utme', 'joint admissions', 'post-utme'],
  cambridge: ['cambridge', 'igcse', 'a-level', 'a level', 'o-level', 'o level'],
  common: ['common entrance', 'primary school leaving', 'basic education cert'],
  educator: ['teacher performance', 'student performance', 'pedagog', 'teaching method', 'classroom management', 'learning outcome', 'academic outcome', 'curriculum', 'formative assessment']
};

function resolveAudience(stored, topic, title) {
  if (stored && AUDIENCE_KW[stored.toLowerCase()]) return stored.toLowerCase();
  const hay = `${topic} ${title}`.toLowerCase();
  for (const [key, kws] of Object.entries(AUDIENCE_KW)) {
    if (kws.some(kw => hay.includes(kw))) return key;
  }
  return 'general';
}

// ─── API KEY LOADING ──────────────────────────────────────
async function loadApiKeys(user) {
  if (!user) return false;
  for (let i = 1; i <= 3; i++) {
    try {
      addLog(`[KEYS] Fetching keys (attempt ${i})...`, 'info');
      const snap = await getDoc(doc(db, 'users', user.uid));
      if (!snap.exists()) { addLog(`[KEYS] User doc missing`, 'error'); return false; }
      const data = snap.data();
      geminiApiKey = data.geminiKey || data.geminiApiKey || data.apiKey || data.gemini || null;
      groqApiKey = data.groqKey || data.groqApiKey || null;
      const loaded = [];
      if (geminiApiKey) loaded.push('Gemini');
      if (groqApiKey) loaded.push('Groq');
      if (!loaded.length) { addLog(`[KEYS] No keys found`, 'error'); return false; }
      addLog(`[KEYS] Loaded: ${loaded.join(', ')}`, 'success');
      return true;
    } catch (e) {
      addLog(`[KEYS] Attempt ${i} failed: ${e.message}`, 'error');
      if (i < 3) await new Promise(r => setTimeout(r, 2000));
    }
  }
  return false;
}

// ─── CONTENT GENERATION — NO IMAGES ───────────────────────
/*
 * The AI prompt deliberately contains NO image placeholders and no
 * instructions to embed <img> tags. Images are added by the admin
 * through the Image Editor after publishing.
 */
function buildPrompt(topicText, audience, style) {
  /*
   * Tone guidance per audience age group:
   *  - common (ages 9–12):  very simple words, short sentences, playful energy, no jargon
   *  - waec/neco/jamb (14–19): friendly peer tone, relatable scenarios, light humour okay
   *  - cambridge (14–18):   clear and encouraging, moderately formal
   *  - educator (adults):   professional but warm, evidence-based, collegial
   *  - general:             upbeat, supportive, accessible
   */
  const toneGuide = {
    common: 'Write like a friendly older sibling talking to a 10-year-old. Use very simple words, short sentences, and a fun, encouraging tone. Avoid all jargon.',
    waec: 'Write like a knowledgeable friend who has passed WAEC and wants to help. Keep it warm, relatable, and direct. Use everyday language Nigerian secondary school students relate to.',
    neco: 'Write like a knowledgeable friend who has passed NECO and wants to help. Keep it warm, relatable, and direct. Use everyday language Nigerian secondary school students relate to.',
    jamb: 'Write like someone who scored 320 in JAMB and wants to share exactly how. Be direct, practical, and encouraging. Use language Nigerian senior secondary students will connect with.',
    cambridge: 'Write in a clear, encouraging, and slightly formal tone appropriate for international curriculum students (ages 14–18). Be thorough but accessible.',
    educator: 'Write in a warm, collegial, professional tone for experienced teachers and school leaders. Be evidence-based, specific, and respectful of their expertise.',
    general: 'Write in an upbeat, supportive tone for Nigerian students across different exam types. Be encouraging and practical.'
  } [audience] || 'Write in a warm, practical tone for Nigerian exam students.';
  
  const audienceDesc = {
    waec: 'Nigerian SS2 and SS3 students preparing for WAEC SSCE exams',
    neco: 'Nigerian SS2 and SS3 students preparing for NECO SSCE exams',
    jamb: 'Nigerian students preparing for JAMB UTME university entrance exams',
    cambridge: 'students preparing for Cambridge IGCSE or A-Level examinations',
    common: 'Nigerian primary school pupils (ages 9–12) preparing for Common Entrance exams',
    educator: 'Nigerian secondary school teachers, HODs, and school administrators',
    general: 'Nigerian students preparing for their major school-leaving exams'
  } [audience] || 'Nigerian exam candidates';
  
  const hookInstruction = audience === 'common' ?
    'Start with a fun question or surprising fact that a 10-year-old would find exciting — something like "Did you know that..." or "What if I told you...".' :
    audience === 'educator' ?
    'Open with a compelling observation or a challenge many teachers face in classrooms — something specific that makes an educator nod and think "yes, that\'s exactly my situation".' :
    'Open with a powerful hook: a relatable scenario, a bold statement, or a direct question that grabs a Nigerian student\'s attention immediately. Think about the exact moment of stress or confusion a student feels, and speak directly into it.';
  
  return `You are writing a blog post for "Prep Portal 2026", a Nigerian exam preparation platform.

TOPIC: ${topicText}
AUDIENCE: ${audienceDesc}
CONTENT STYLE: ${style}
READING TIME: ${audience === 'educator' ? '6–8 minutes' : audience === 'common' ? '3–4 minutes' : '4–6 minutes'}

TONE INSTRUCTION:
${toneGuide}

STRUCTURE REQUIREMENTS:
1. Write a catchy <h1> TITLE — make it specific, benefit-driven, and NOT a verbatim copy of the topic. Example: instead of "WAEC Mathematics Tips", write "Stop Failing WAEC Maths: Here's the Simple Fix Nobody Tells You".
2. ${hookInstruction}
3. Write 3–5 <h2> sections. Each section heading should feel conversational, not textbook-like. Example: "Why Most Students Get This Wrong" instead of "Common Mistakes".
4. Each section needs well-developed <p> paragraphs with specific, actionable information. Be concrete — use examples, real subject names, real scenarios Nigerian students face.
5. Include at least one <ul> or <ol> list with practical tips, steps, or examples.
${audience === 'educator' ? `6. Include at least one section covering measurable indicators — whether teacher performance metrics, student outcome data, or assessment results. Be specific.` : `6. Include at least one relatable example or mini-scenario that shows the advice working in practice.`}
7. End with a short, punchy conclusion paragraph that motivates the reader and gives them one clear next action to take TODAY.

CRITICAL RULES:
- DO NOT include any <img> tags — images are added separately
- DO NOT add <html>, <head>, or <body> tags
- DO NOT wrap in markdown code fences
- Return ONLY the HTML content starting from the <h1> tag
- Write with personality — avoid dry, textbook-style writing
- Every paragraph must add real value. No filler sentences.

AUDIENCE TAG (do not remove): <!-- audience:${audience} -->`;
}

async function callGroq(model, prompt) {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${groqApiKey}` },
    body: JSON.stringify({
      model: model.model,
      messages: [
        { role: 'system', content: 'You are an expert educational content writer for Nigerian students and teachers. Output only clean HTML body content — no <img> tags, no markdown.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.72,
      max_tokens: 2800
    })
  });
  if (!res.ok) { const t = await res.text(); throw new Error(`Groq ${res.status}: ${t.substring(0,100)}`); }
  const data = await res.json();
  const c = data.choices?.[0]?.message?.content;
  if (!c) throw new Error('Groq returned empty content');
  return c;
}

async function callGemini(model, prompt) {
  const res = await fetch(`${model.url}?key=${geminiApiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.72, maxOutputTokens: 3000 }
    })
  });
  if (!res.ok) { const t = await res.text(); throw new Error(`Gemini ${res.status}: ${t.substring(0,100)}`); }
  const data = await res.json();
  const c = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!c) throw new Error('Gemini returned empty content');
  return c;
}

async function generateWithFallback(topic) {
  const style = rand(CONTENT_STYLES);
  const complexity = topic.complexity || 'standard';
  const prompt = buildPrompt(topic.text, topic.audience, style);
  
  let chain;
  if (complexity === 'simple' && groqApiKey) {
    chain = [
      ...GROQ_MODELS.map(m => ({ ...m, isFallback: false })),
      ...GEMINI_MODELS.slice(0, 2).map(m => ({ ...m, isFallback: true }))
    ];
  } else if (complexity === 'deep' && geminiApiKey) {
    chain = [
      ...GEMINI_MODELS.slice(0, 2).map(m => ({ ...m, isFallback: false })),
      ...(groqApiKey ? GROQ_MODELS.slice(0, 1).map(m => ({ ...m, isFallback: true })) : []),
      ...GEMINI_MODELS.slice(2).map(m => ({ ...m, isFallback: true }))
    ];
  } else {
    chain = [
      ...(groqApiKey ? GROQ_MODELS.map(m => ({ ...m, isFallback: false })) : []),
      ...GEMINI_MODELS.map(m => ({ ...m, isFallback: false }))
    ];
  }
  
  chain = chain.filter(m => m.provider === 'groq' ? !!groqApiKey : !!geminiApiKey);
  if (!chain.length) throw new Error('No API keys available');
  
  for (const model of chain) {
    addLog(`[MODEL] Trying ${model.label}${model.isFallback ? ' (fallback)' : ''}...`, 'info');
    showRoutingBadge(model.provider, model.isFallback);
    try {
      let raw = model.provider === 'groq' ?
        await callGroq(model, prompt) :
        await callGemini(model, prompt);
      
      // Strip any AI-generated <img> tags just in case the model ignored instructions
      raw = raw.trim()
        .replace(/```html\n?/gi, '').replace(/```\n?/g, '')
        .replace(/<img[^>]*>/gi, '');
      
      const titleMatch = raw.match(/<h1[^>]*>([^<]+)<\/h1>/i);
      const title = titleMatch ? titleMatch[1].trim() : topic.text;
      const excerpt = raw.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 160);
      
      addLog(`[OK] "${title}" via ${model.label}`, 'success');
      return { title, content: raw, excerpt, topic: topic.text, style, audience: topic.audience, modelUsed: model.label };
    } catch (e) {
      const reason = e.message.toLowerCase();
      const credit = reason.includes('credit') || reason.includes('quota') || reason.includes('rate') || reason.includes('insufficient');
      addLog(`[FAIL] ${model.label}: ${e.message.substring(0,80)}${credit ? ' [quota]' : ''}`, 'error');
    }
  }
  throw new Error('All models exhausted');
}

// ─── PUBLISH — IMAGES FIELD STARTS EMPTY ──────────────────
async function publishBlog(blog) {
  if (!currentUser) throw new Error('Not signed in');
  const audience = resolveAudience(blog.audience, blog.topic, blog.title);
  const docRef = await addDoc(collection(db, 'blogs'), {
    title: blog.title,
    content: blog.content, // text only — no <img> tags
    excerpt: blog.excerpt,
    featuredImage: '', // admin adds this in image editor
    status: 'published',
    authorId: currentUser.uid,
    authorEmail: currentUser.email,
    publishedAt: serverTimestamp(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    views: 0,
    likes: [],
    imagesAdded: false, // flag shown in manage panel
    source: 'auto-blog-v9',
    modelUsed: blog.modelUsed,
    originalTopic: blog.topic,
    style: blog.style,
    audience: audience
  });
  return docRef.id;
}

async function executePublishCycle() {
  if (!geminiApiKey && !groqApiKey) {
    addLog('[CYCLE] No key — reload attempt...', 'warn');
    if (currentUser) await loadApiKeys(currentUser);
    scheduleNextRun(5 * 60 * 1000);
    return;
  }
  if (!currentUser) {
    addLog('[CYCLE] No user', 'error');
    scheduleNextRun(5 * 60 * 1000);
    return;
  }
  
  const topic = rand(BLOG_TOPICS);
  addLog(`[RUN] "${topic.text}" [${topic.complexity}/${topic.audience}]`, 'info');
  try {
    const blog = await generateWithFallback(topic);
    const blogId = await publishBlog(blog);
    publishCount++;
    publishCountSpan.innerText = publishCount;
    localStorage.setItem('publishCount', publishCount);
    addLog(`[DONE] ID: ${blogId.substring(0,10)}... — add images via image editor`, 'success');
    scheduleNextRun(randIntervalMs());
    loadRecentPosts();
  } catch (e) {
    addLog(`[ERR] ${e.message}`, 'error');
    scheduleNextRun(5 * 60 * 1000);
  }
}

const forcePublish = async () => {
  if (!geminiApiKey && !groqApiKey) { addLog('[MAN] No key', 'warn'); if (currentUser) await loadApiKeys(currentUser); return; }
  clearScheduler();
  addLog('[MAN] Manual publish triggered', 'info');
  await executePublishCycle();
};

const testFirestore = async () => {
  addLog('[TEST] Testing Firestore...', 'info');
  try {
    const s = await getDocs(collection(db, 'blogs'));
    addLog(`[OK] ${s.size} posts found`, 'success');
  }
  catch (e) { addLog(`[ERR] ${e.message}`, 'error'); }
};

const restartScheduler = () => {
  clearScheduler();
  if (geminiApiKey || groqApiKey) {
    scheduleNextRun(randIntervalMs());
    addLog('[OK] Scheduler restarted', 'success');
  }
  else addLog('[WARN] No keys', 'error');
};

// ─── MANAGE POSTS ─────────────────────────────────────────
async function loadRecentPosts() {
  const list = document.getElementById('managePostsList');
  list.innerHTML = `<li class="manage-loading"><div class="spinner-ring"></div>Loading...</li>`;
  try {
    const q = query(collection(db, 'blogs'), orderBy('publishedAt', 'desc'), limit(30));
    const snap = await getDocs(q);
    if (snap.empty) { list.innerHTML = '<li class="manage-empty">No posts yet.</li>'; return; }
    
    list.innerHTML = '';
    snap.forEach(d => {
      const data = d.data();
      const aud = resolveAudience(data.audience, data.originalTopic || '', data.title || '');
      const cls = getBadgeCls(aud);
      const label = getBadgeLabel(aud);
      const hasImg = !!data.featuredImage || data.imagesAdded;
      const li = document.createElement('li');
      li.className = 'manage-post-item';
      li.innerHTML = `
            <div class="manage-post-info">
              <div class="manage-post-title" title="${escHtml(data.title||'')}">${escHtml(data.title||'Untitled')}</div>
              <div class="manage-post-meta">
                <span>${formatDate(data.publishedAt)}</span>
                <span class="manage-post-badge ${cls}">${label}</span>
                ${data.modelUsed ? `<span>${escHtml(data.modelUsed.split(' ').slice(0,2).join(' '))}</span>` : ''}
                ${data.views ? `<span>${data.views} views</span>` : ''}
                ${!hasImg ? `<span class="pill-pending"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>No images</span>` : ''}
              </div>
            </div>
            <div class="manage-post-actions">
              <button class="btn btn-sm btn-edit img-btn"
                data-id="${d.id}"
                data-title="${escHtml(data.title||'Untitled')}"
                data-featured="${escHtml(data.featuredImage||'')}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                Images
              </button>
              <button class="btn btn-sm meta-btn"
                data-id="${d.id}"
                data-title="${escHtml(data.title||'')}"
                data-audience="${escHtml(aud)}"
                data-excerpt="${escHtml(data.excerpt||'')}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                Edit
              </button>
              <button class="btn btn-sm btn-danger del-btn"
                data-id="${d.id}"
                data-title="${escHtml(data.title||'Untitled')}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6l-1 14H6L5 6"></path><path d="M10 11v6M14 11v6"></path><path d="M9 6V4h6v2"></path></svg>
                Delete
              </button>
            </div>`;
      list.appendChild(li);
    });
    
    // Image editor button
    list.querySelectorAll('.img-btn').forEach(btn => {
      btn.addEventListener('click', () => openImageEditor(btn.dataset.id, btn.dataset.title, btn.dataset.featured));
    });
    
    // Meta edit button
    list.querySelectorAll('.meta-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        pendingMetaId = btn.dataset.id;
        document.getElementById('metaTitle').value = btn.dataset.title || '';
        document.getElementById('metaAudience').value = btn.dataset.audience || 'general';
        document.getElementById('metaExcerpt').value = btn.dataset.excerpt || '';
        metaModal.classList.add('active');
      });
    });
    
    // Delete button
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

// ─── IMAGE EDITOR ─────────────────────────────────────────
/*
 * Workflow:
 *  1. Fetch the post's current content from Firestore.
 *  2. Parse it into block elements (h1, h2, h3, p, ul, ol, blockquote, etc.)
 *     — but skip any existing <img> nodes (we're rebuilding from scratch).
 *  3. Render one input row per block, plus a featured image input.
 *  4. On Save:
 *     a. For each block, append an <img> after it if the input has a URL.
 *     b. Reassemble the full HTML string.
 *     c. Write content, featuredImage, imagesAdded:true back to Firestore.
 */

async function openImageEditor(postId, postTitle, currentFeatured) {
  pendingImgId = postId;
  imgModalSubtitle.textContent = `"${postTitle}" — paste URLs below each paragraph to add images, or leave blank.`;
  
  // Fetch latest content
  paraBlocksList.innerHTML = `<div class="manage-loading"><div class="spinner-ring"></div>Loading content...</div>`;
  imgPendingBanner.style.display = 'none';
  featuredImgInput.value = currentFeatured || '';
  updateFeaturedThumb(currentFeatured || '');
  
  imgModal.classList.add('active');
  
  try {
    const snap = await getDoc(doc(db, 'blogs', postId));
    if (!snap.exists()) { addLog('[IMG] Post not found', 'error'); return; }
    const data = snap.data();
    pendingImgContent = data.content || '';
    
    const hasNoImages = !data.featuredImage && !data.imagesAdded;
    imgPendingBanner.style.display = hasNoImages ? 'flex' : 'none';
    
    renderParaBlocks(pendingImgContent);
  } catch (e) {
    paraBlocksList.innerHTML = `<div class="manage-empty">Error: ${escHtml(e.message)}</div>`;
    addLog(`[ERR] ${e.message}`, 'error');
  }
}

function renderParaBlocks(html) {
  /*
   * Parse the content HTML into block-level nodes.
   * We skip existing <img> tags — the admin is replacing/adding images fresh.
   * Each block gets a preview of its text and an image URL input.
   */
  const container = document.createElement('div');
  container.innerHTML = html;
  
  // Collect block-level children (skip img, script, style)
  const BLOCK_TAGS = new Set(['H1', 'H2', 'H3', 'H4', 'P', 'UL', 'OL', 'BLOCKQUOTE', 'TABLE', 'PRE', 'DIV', 'FIGURE']);
  const SKIP_TAGS = new Set(['IMG', 'SCRIPT', 'STYLE']);
  
  const blocks = [];
  container.childNodes.forEach(node => {
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    if (SKIP_TAGS.has(node.tagName)) return;
    if (BLOCK_TAGS.has(node.tagName)) {
      blocks.push(node);
    }
  });
  
  if (!blocks.length) {
    paraBlocksList.innerHTML = '<div class="manage-empty">No paragraph blocks found in this post.</div>';
    return;
  }
  
  paraBlocksList.innerHTML = '';
  
  blocks.forEach((block, idx) => {
    const tag = block.tagName;
    const preview = block.textContent.trim().replace(/\s+/g, ' ').substring(0, 90);
    const blockRow = document.createElement('div');
    blockRow.className = 'para-block';
    blockRow.dataset.idx = idx;
    
    blockRow.innerHTML = `
          <div class="para-block-header">
            <span class="para-block-type">${tag}</span>
            <span class="para-block-preview">${escHtml(preview) || '(empty block)'}</span>
          </div>
          <div class="para-block-body">
            <div class="para-img-row">
              <input
                type="url"
                class="para-img-input"
                data-idx="${idx}"
                placeholder="Image URL (optional — leave blank to skip)"
                autocomplete="off"
              >
              <img class="para-img-preview" alt="Preview" data-idx="${idx}">
            </div>
            <p class="para-void-note">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 8 12 12"></polyline><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              Leave blank to keep this paragraph image-free.
            </p>
          </div>`;
    
    paraBlocksList.appendChild(blockRow);
    
    // Live thumbnail preview on input
    const input = blockRow.querySelector('.para-img-input');
    const preview2 = blockRow.querySelector('.para-img-preview');
    input.addEventListener('input', () => {
      const url = input.value.trim();
      if (url) {
        input.classList.add('has-img');
        preview2.src = url;
        preview2.classList.add('visible');
        preview2.onerror = () => {
          preview2.src = '';
          preview2.classList.remove('visible');
        };
      } else {
        input.classList.remove('has-img');
        preview2.src = '';
        preview2.classList.remove('visible');
      }
    });
  });
  
  // Store block elements on the list for rebuild later
  paraBlocksList._blocks = blocks;
}

// Featured image live preview
featuredImgInput.addEventListener('input', () => updateFeaturedThumb(featuredImgInput.value.trim()));

function updateFeaturedThumb(url) {
  if (url) {
    featuredImgThumb.src = url;
    featuredImgThumb.classList.add('visible');
    featuredImgThumb.onerror = () => {
      featuredImgThumb.src = '';
      featuredImgThumb.classList.remove('visible');
    };
  } else {
    featuredImgThumb.src = '';
    featuredImgThumb.classList.remove('visible');
  }
}

// Save Images: rebuild content HTML with <img> tags injected after blocks
saveImgBtn.addEventListener('click', async () => {
  if (!pendingImgId) return;
  
  const featured = featuredImgInput.value.trim();
  const blocks = paraBlocksList._blocks || [];
  const inputs = paraBlocksList.querySelectorAll('.para-img-input');
  
  // Build new HTML: each block + optional <img> after it
  const IMG_STYLE = 'width:100%;max-width:100%;height:auto;border:2px solid #0a0a0a;margin:1.25rem 0;display:block;';
  let newContent = '';
  blocks.forEach((block, idx) => {
    newContent += block.outerHTML;
    const input = inputs[idx];
    if (input) {
      const url = input.value.trim();
      if (url) {
        const preview = block.textContent.trim().substring(0, 40) || `Block ${idx + 1}`;
        newContent += `<img src="${escHtml(url)}" alt="${escHtml(preview)}" style="${IMG_STYLE}">`;
      }
    }
  });
  
  if (!newContent) newContent = pendingImgContent; // fallback: no change
  
  const hasAnyImg = !!featured || inputs.length > 0 && [...inputs].some(i => i.value.trim());
  
  saveImgBtn.disabled = true;
  saveImgBtn.textContent = 'Saving...';
  try {
    await updateDoc(doc(db, 'blogs', pendingImgId), {
      content: newContent,
      featuredImage: featured,
      imagesAdded: hasAnyImg,
      updatedAt: serverTimestamp()
    });
    addLog(`[IMG] Images saved for ${pendingImgId.substring(0,10)}...`, 'success');
    imgModal.classList.remove('active');
    pendingImgId = null;
    pendingImgContent = '';
    await loadRecentPosts();
  } catch (e) {
    addLog(`[ERR] Image save failed: ${e.message}`, 'error');
  } finally {
    saveImgBtn.disabled = false;
    saveImgBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg> Save Images`;
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
  const audience = document.getElementById('metaAudience').value;
  const excerpt = document.getElementById('metaExcerpt').value.trim();
  if (!title) { addLog('[META] Title required', 'warn'); return; }
  saveMetaBtn.disabled = true;
  saveMetaBtn.textContent = 'Saving...';
  try {
    await updateDoc(doc(db, 'blogs', pendingMetaId), { title, audience, excerpt, updatedAt: serverTimestamp() });
    addLog(`[META] Updated: "${title}"`, 'success');
    metaModal.classList.remove('active');
    pendingMetaId = null;
    await loadRecentPosts();
  } catch (e) { addLog(`[ERR] ${e.message}`, 'error'); }
  finally {
    saveMetaBtn.disabled = false;
    saveMetaBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg> Save Details`;
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
    await deleteDoc(doc(db, 'blogs', pendingDeleteId));
    addLog(`[DEL] Deleted ${pendingDeleteId.substring(0,10)}...`, 'success');
    confirmModal.classList.remove('active');
    pendingDeleteId = null;
    await loadRecentPosts();
  } catch (e) { addLog(`[ERR] ${e.message}`, 'error'); }
  finally {
    confirmDeleteBtn.disabled = false;
    confirmDeleteBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6l-1 14H6L5 6"></path><path d="M10 11v6M14 11v6"></path><path d="M9 6V4h6v2"></path></svg> Yes, Delete`;
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

// ─── NAV & WIRING ─────────────────────────────────────────
forceBtn.addEventListener('click', forcePublish);
restartBtn.addEventListener('click', restartScheduler);
testBtn.addEventListener('click', testFirestore);
refreshPostsBtn.addEventListener('click', loadRecentPosts);

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    confirmModal.classList.remove('active');
    metaModal.classList.remove('active');
    imgModal.classList.remove('active');
    pendingDeleteId = pendingMetaId = pendingImgId = null;
    pendingImgContent = '';
  }
});

const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('navLinks');
if (navToggle && navLinks) navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// ─── INIT ─────────────────────────────────────────────────
const saved = localStorage.getItem('publishCount');
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
      scheduleNextRun(randIntervalMs());
    }
    loadRecentPosts();
  } else {
    statusDot.classList.add('red');
    authStatusSpan.innerHTML = `<span class="status-dot red"></span>Waiting for sign-in...`;
    addLog('[AUTH] Waiting...', 'info');
  }
});

setInterval(() => { if (currentUser && (geminiApiKey || groqApiKey)) console.log('[ALIVE] running'); }, 30000);

addLog('[BOOT] Publisher v9.0 — AI text only, images by admin', 'info');
addLog('[BOOT] Use "Images" button on any post to assign per-paragraph images', 'success');