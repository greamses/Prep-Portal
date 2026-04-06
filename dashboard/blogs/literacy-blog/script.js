
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
    // Groq uses corsproxy.io to bypass browser CORS restriction
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
    
    // ─── LITERACY TOPICS P1–SS3 ───────────────────────────────
    const LITERACY_TOPICS = [
      // ── GRAMMAR ───────────────────────────────────────────
      { text: 'Nouns, pronouns, and how to use them in sentences', category: 'grammar', classLevel: 'primary-1', complexity: 'simple' },
      { text: 'Verbs and adjectives: bringing sentences to life', category: 'grammar', classLevel: 'primary-2', complexity: 'simple' },
      { text: 'Simple, compound, and complex sentences explained', category: 'grammar', classLevel: 'primary-4', complexity: 'standard' },
      { text: 'Tenses: past, present, and future made easy', category: 'grammar', classLevel: 'primary-3', complexity: 'simple' },
      { text: 'Subject-verb agreement: the rule Nigerian students always break', category: 'grammar', classLevel: 'jss-1', complexity: 'standard' },
      { text: 'Punctuation marks and when to use each one', category: 'grammar', classLevel: 'jss-2', complexity: 'standard' },
      { text: 'Active and passive voice: when and how to switch', category: 'grammar', classLevel: 'jss-3', complexity: 'standard' },
      { text: 'Direct and indirect speech: rules and common mistakes', category: 'grammar', classLevel: 'ss-1', complexity: 'standard' },
      { text: 'Concord (agreement): the 10 rules WAEC always tests', category: 'grammar', classLevel: 'ss-2', complexity: 'deep' },
      { text: 'Figures of speech: metaphor, simile, personification, and more', category: 'grammar', classLevel: 'ss-3', complexity: 'deep' },
      { text: 'Clauses and phrases: relative, adverbial, and noun clauses', category: 'grammar', classLevel: 'ss-2', complexity: 'deep' },
      
      // ── VOCABULARY ────────────────────────────────────────
      { text: 'Building a vocabulary toolkit: words from everyday Nigerian life', category: 'vocabulary', classLevel: 'primary-2', complexity: 'simple' },
      { text: 'Synonyms and antonyms: expanding your word bank', category: 'vocabulary', classLevel: 'primary-4', complexity: 'simple' },
      { text: 'Prefixes and suffixes: how to decode unfamiliar words', category: 'vocabulary', classLevel: 'primary-5', complexity: 'standard' },
      { text: 'Context clues: guessing word meaning without a dictionary', category: 'vocabulary', classLevel: 'jss-1', complexity: 'standard' },
      { text: 'Idioms and proverbs in Nigerian English', category: 'vocabulary', classLevel: 'jss-2', complexity: 'standard' },
      { text: 'Words commonly confused in English: affect/effect, their/there, its/it\'s', category: 'vocabulary', classLevel: 'jss-3', complexity: 'standard' },
      { text: 'Register and formality: choosing the right words for the right context', category: 'vocabulary', classLevel: 'ss-1', complexity: 'standard' },
      { text: 'Lexis and structure questions in WAEC English', category: 'vocabulary', classLevel: 'ss-2', complexity: 'deep' },
      { text: 'Academic vocabulary for essay writing at SS level', category: 'vocabulary', classLevel: 'ss-3', complexity: 'deep' },
      
      // ── WRITING ───────────────────────────────────────────
      { text: 'How to write a simple story with a beginning, middle, and end', category: 'writing', classLevel: 'primary-2', complexity: 'simple' },
      { text: 'Descriptive writing: painting pictures with words', category: 'writing', classLevel: 'primary-4', complexity: 'standard' },
      { text: 'Letter writing: formal and informal letters step by step', category: 'writing', classLevel: 'jss-1', complexity: 'standard' },
      { text: 'How to write a perfect argumentative essay for WAEC', category: 'writing', classLevel: 'ss-1', complexity: 'deep' },
      { text: 'Expository writing: explaining ideas clearly and logically', category: 'writing', classLevel: 'jss-3', complexity: 'standard' },
      { text: 'Narrative writing: telling a compelling story in an exam', category: 'writing', classLevel: 'ss-2', complexity: 'deep' },
      { text: 'Summary writing: the technique WAEC examiners want to see', category: 'writing', classLevel: 'ss-2', complexity: 'deep' },
      { text: 'How to plan and structure any essay in under 5 minutes', category: 'writing', classLevel: 'ss-3', complexity: 'deep' },
      { text: 'Creative writing: dialogue, description, and suspense', category: 'writing', classLevel: 'jss-2', complexity: 'standard' },
      { text: 'Report writing: structure, language, and common errors', category: 'writing', classLevel: 'ss-1', complexity: 'standard' },
      
      // ── COMPREHENSION ─────────────────────────────────────
      { text: 'How to read and understand a story passage', category: 'comprehension', classLevel: 'primary-3', complexity: 'simple' },
      { text: 'Finding the main idea in a paragraph', category: 'comprehension', classLevel: 'primary-5', complexity: 'simple' },
      { text: 'Reading for detail: answering who, what, when, where, and why', category: 'comprehension', classLevel: 'primary-6', complexity: 'standard' },
      { text: 'Inference questions: reading between the lines', category: 'comprehension', classLevel: 'jss-1', complexity: 'standard' },
      { text: 'WAEC comprehension strategy: how to tackle the passage in 15 minutes', category: 'comprehension', classLevel: 'ss-1', complexity: 'deep' },
      { text: 'Tone, mood, and purpose in comprehension passages', category: 'comprehension', classLevel: 'ss-2', complexity: 'deep' },
      { text: 'Literary devices in prose comprehension: how to identify and explain', category: 'comprehension', classLevel: 'ss-3', complexity: 'deep' },
      { text: 'How to answer "in your own words" questions without losing marks', category: 'comprehension', classLevel: 'jss-3', complexity: 'standard' },
      
      // ── SPELLING ──────────────────────────────────────────
      { text: 'Spelling rules: silent letters and tricky combinations', category: 'spelling', classLevel: 'primary-3', complexity: 'simple' },
      { text: 'Common misspelled words that students always get wrong', category: 'spelling', classLevel: 'primary-5', complexity: 'simple' },
      { text: 'Word families: learning 10 spellings from one root word', category: 'spelling', classLevel: 'jss-1', complexity: 'standard' },
      { text: 'Homophones: words that sound the same but mean different things', category: 'spelling', classLevel: 'jss-2', complexity: 'standard' },
      { text: 'Spelling strategies that actually work: chunking, visualising, and more', category: 'spelling', classLevel: 'primary-6', complexity: 'simple' },
      { text: '50 words Nigerian students always misspell in WAEC', category: 'spelling', classLevel: 'ss-1', complexity: 'standard' },
      { text: 'Prefixes that change spelling: un-, dis-, mis-, re-', category: 'spelling', classLevel: 'primary-4', complexity: 'simple' },
      
      // ── PUBLIC SPEAKING ───────────────────────────────────
      { text: 'How to stand up and speak with confidence in class', category: 'public-speaking', classLevel: 'primary-3', complexity: 'simple' },
      { text: 'Show and tell: how to present your favourite object to the class', category: 'public-speaking', classLevel: 'primary-2', complexity: 'simple' },
      { text: 'How to give a short speech without forgetting what to say', category: 'public-speaking', classLevel: 'primary-5', complexity: 'standard' },
      { text: 'Debate basics: arguing for and against a topic', category: 'public-speaking', classLevel: 'jss-2', complexity: 'standard' },
      { text: 'Oral English for WAEC: stress, rhythm, and intonation explained', category: 'public-speaking', classLevel: 'ss-1', complexity: 'deep' },
      { text: 'How to eliminate filler words and speak more powerfully', category: 'public-speaking', classLevel: 'jss-3', complexity: 'standard' },
      { text: 'Oral presentation skills for school debates and competitions', category: 'public-speaking', classLevel: 'ss-2', complexity: 'standard' },
      { text: 'WAEC Oral English: vowels, consonants, and phonemic transcription', category: 'public-speaking', classLevel: 'ss-3', complexity: 'deep' },
      { text: 'Persuasive speaking: how to move an audience', category: 'public-speaking', classLevel: 'ss-2', complexity: 'standard' },
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
    const practiceDomainEl = document.getElementById('practiceDomainEl');
    
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
    
    const CAT_LABEL = { grammar: 'Grammar', writing: 'Writing', comprehension: 'Comprehension', vocabulary: 'Vocabulary', spelling: 'Spelling', 'public-speaking': 'Public Speaking' };
    const CAT_CLS = { grammar: 'lit-grammar', writing: 'lit-writing', comprehension: 'lit-comprehension', vocabulary: 'lit-vocabulary', spelling: 'lit-spelling', 'public-speaking': 'lit-speaking' };
    const CLASS_LABEL = cl => { if (!cl) return '--'; const [t, ...r] = cl.split('-'); const n = r.join(' '); if (t === 'primary') return `P${n}`; if (t === 'jss') return `JSS ${n}`; if (t === 'ss') return `SS ${n}`; return cl; };
    const CLASS_CLS = cl => { if (!cl) return 'cls-primary'; if (cl.startsWith('primary')) return 'cls-primary'; if (cl.startsWith('jss')) return 'cls-jss'; return 'cls-ss'; };
    
    function updateNextDisplay(ms) { if (!ms) { nextRunMinutesSpan.innerText = '--';
        nextRunDetailSpan.innerText = 'Next: idle'; return; } const m = Math.round(ms / 60000);
      nextRunMinutesSpan.innerText = m;
      nextRunDetailSpan.innerText = `Next: in ${m} min`; }
    
    function clearScheduler() { if (activeTimeout) { clearTimeout(activeTimeout);
        activeTimeout = null; } }
    
    function scheduleNextRun(ms) { clearScheduler(); if (!geminiApiKey && !groqApiKey) { addLog('[SCHED] No key', 'warn'); return; } addLog(`[SCHED] Next in ${Math.round(ms/60000)} min`, 'info');
      updateNextDisplay(ms);
      activeTimeout = setTimeout(async () => { activeTimeout = null;
        await executePublishCycle(); }, ms); }
    
    function showRoutingBadge(provider, isFallback) {
      const cls = (isFallback ? 'fallback' : provider.toLowerCase());
      const lbl = (isFallback ? `Fallback: ${provider}` : provider).toUpperCase();
      routingIndicator.innerHTML = `<div class="routing-badge ${cls}"><svg style="width:11px;height:11px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg> ${lbl}</div>`;
    }
    
    // ─── VIDEO / DOMAIN HELPERS ───────────────────────────────
    function getYouTubeThumbnail(url) {
      if (!url) return null;
      if (url.includes('<iframe')) { const m = url.match(/src=["']([^"']+)["']/);
        url = m ? m[1] : url; }
      const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|shorts\/)([^&\n?#]+)/);
      return m ? `https://img.youtube.com/vi/${m[1]}/mqdefault.jpg` : null;
    }
    
    function getEmbedUrl(url, type) {
      if (!url) return '';
      if (url.includes('<iframe')) { const m = url.match(/src=["']([^"']+)["']/);
        url = m ? m[1] : url; }
      if (type === 'video' || url.includes('youtube.com') || url.includes('youtu.be')) {
        const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([^&\n?#]+)/);
        if (yt && yt[1]) return `https://www.youtube.com/embed/${yt[1]}`;
      }
      return url;
    }
    
    function getDomain(url) {
      if (url.includes('<iframe')) { const m = url.match(/src=["']([^"']+)["']/);
        url = m ? m[1] : url; }
      try { return new URL(url).hostname.replace(/^www\./, ''); } catch (_) { return url; }
    }
    
    // Video preview
    videoUrlInput.addEventListener('input', () => {
      let inp = videoUrlInput.value.trim();
      if (inp.includes('<iframe')) { const m = inp.match(/src=["']([^"']+)["']/);
        inp = m ? m[1] : inp; }
      const thumb = getYouTubeThumbnail(inp);
      if (thumb) { videoThumbImg.src = thumb;
        videoThumbImg.classList.add('visible');
        videoPlayBadge.style.display = 'flex';
        videoThumbImg.onerror = () => { videoThumbImg.classList.remove('visible');
          videoPlayBadge.style.display = 'none'; }; }
      else { videoThumbImg.classList.remove('visible');
        videoPlayBadge.style.display = 'none'; }
    });
    
    // Practice preview
    practiceUrlInput.addEventListener('input', () => {
      let inp = practiceUrlInput.value.trim();
      if (inp) {
        const domain = getDomain(inp);
        practiceDomainEl.textContent = domain;
        practiceFavicon.src = `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
        practiceFavicon.onerror = () => { practiceFavicon.style.display = 'none'; };
        practicePreviewCard.classList.add('visible');
      } else { practicePreviewCard.classList.remove('visible'); }
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
    
    // ─── LITERACY PROMPT ──────────────────────────────────────
    function buildLiteracyPrompt(topic) {
      const { text, category, classLevel } = topic;
      const catLabel = CAT_LABEL[category] || category;
      const clsLabel = CLASS_LABEL(classLevel);
      const levelType = classLevel.startsWith('primary') ? 'primary' : classLevel.startsWith('jss') ? 'jss' : 'ss';
      
      const toneGuide = {
        primary: `You are a warm, nurturing English teacher for primary school pupils (ages 6–12).
- Use very simple words and short sentences. One idea per sentence.
- Relate everything to things children know: their home, school, playground, food, family.
- Use encouraging phrases: "Well done!", "Can you spot the pattern?", "Now it's your turn:".
- Absolutely no jargon. If it sounds like a textbook word, replace it with a simpler one.
- Talk directly to the student: "Have you ever noticed...", "Let's try this together:".`,
        
        jss: `You are a JSS English teacher who makes language exciting for 11–15 year olds.
- Friendly and direct. Think "cool older sibling who's great at English".
- Introduce grammar terms with immediate everyday definitions in brackets.
  Example: "clause (a group of words with a subject and a verb — like 'the dog ran')".
- Use Nigerian examples: Oga, Lagos traffic, WhatsApp messages, Afrobeats lyrics, market bargaining.
- Break rules into numbered steps. For "how to write a letter", give step 1, step 2, step 3.
- Call out the common mistake: "This is where most JSS students lose marks — read this carefully."`,
        
        ss: `You are an SS English teacher who helps 15–19 year olds crush WAEC, NECO, and JAMB.
- Smart, direct, exam-focused. Think "the teacher who has seen every marking scheme".
- Explicitly flag what WAEC tests: "WAEC almost always asks one question on concord in Section A".
- Teach WHY rules exist — not just what they are. Understanding prevents forgetting.
- Provide model answers and annotated examples showing exactly what earns full marks.
- Expose the traps: "Students fail this because they confuse X with Y — here's the test to tell them apart".
- For writing tasks, show before/after paragraph rewrites (weak version vs strong version).`
      } [levelType];
      
      const hookGuide = {
        primary: `Start with a playful question, a mini-game instruction, or a funny sentence that has a deliberate mistake. Make the child lean in. Examples:
  - "Can you spot the mistake? 'The dog runned very fast.' Did you find it?"
  - "If someone said to you 'Me and him went market' — does that sound right or wrong?"`,
        
        jss: `Open with a real-life scenario where getting the English wrong had a funny or embarrassing consequence. Or show a common WhatsApp/text message error. Examples:
  - "Imagine you wrote to your principal: 'Me and my friend was absent.' That sentence could cost you marks — and your dignity. Let's fix it."
  - "Here's a sentence from a JSS student's essay: 'She cried till her eyes became dry like harmattan.' Good or bad? Let's analyse."`,
        
        ss: `Open with a direct WAEC exam challenge or a shocking fact about mark loss. Make the student feel the urgency immediately. Examples:
  - "In the 2023 WAEC English paper, over 40% of candidates scored below average in summary writing — not because the passage was hard, but because they used the wrong technique. This lesson fixes that."
  - "Question: 'She is one of the students who _____ passed.' Is it HAS or HAVE? Most SS3 students get this wrong. Let's work through it."`
      } [levelType];
      
      const exampleInstruction = category === 'writing' ?
        `
WRITING SAMPLES — REQUIRED:
Include at least one annotated writing sample. Show:
<div class="worked-example">
  <h4>Example: [type of writing]</h4>
  <p><strong>Topic/Prompt:</strong> [the prompt given]</p>
  <p><strong>Model Answer (opening paragraph):</strong></p>
  <blockquote>[well-written example paragraph]</blockquote>
  <p><strong>Why this works:</strong> [brief annotation pointing to 2-3 specific techniques]</p>
</div>` :
        category === 'grammar' ?
        `
GRAMMAR PRACTICE — REQUIRED:
Include 3–5 practice sentences with explanations. Format:
<div class="worked-example">
  <h4>Practice Sentences</h4>
  <ol>
    <li><strong>Sentence:</strong> "..." | <strong>Correct:</strong> "..." | <strong>Rule:</strong> ...</li>
  </ol>
</div>` :
        category === 'public-speaking' ?
        `
SPEAKING EXERCISE — REQUIRED:
Include a specific speaking exercise or script template students can practise.
<div class="worked-example">
  <h4>Practice Activity: [short title]</h4>
  [specific, step-by-step activity with clear instructions and example lines to say]
</div>` :
        `
EXAMPLE — REQUIRED:
Include a clear, well-formatted example.
<div class="worked-example">
  <h4>Example: [short title]</h4>
  [concrete example relevant to Nigerian students]
</div>`;
      
      return `You are an expert Nigerian English and Literacy teacher writing a structured lesson for "Prep Portal 2026".

YOUR ROLE: You are TEACHING, not writing an essay. Every paragraph must move the student forward in language skill. Think of this as a written English lesson — practical, direct, and immediately useful.

TOPIC: ${text}
CATEGORY: ${catLabel}
CLASS LEVEL: ${clsLabel} (${levelType==='primary'?'ages 6–12':levelType==='jss'?'ages 11–15':'ages 15–19, WAEC/NECO/JAMB prep'})
LESSON LENGTH: ${levelType==='primary'?'3–4 minutes':levelType==='jss'?'4–6 minutes':'6–8 minutes'}

YOUR TEACHING STYLE:
${toneGuide}

LESSON STRUCTURE — follow exactly:

1. <h1> TITLE
   Specific and benefit-driven. Not "Direct Speech". Better: "How to Write and Punctuate Direct Speech Without Losing Marks in WAEC".

2. OPENING HOOK (first <p> after title)
${hookGuide}

3. LESSON SECTIONS (3–5 × <h2> + paragraphs)
   Each <h2> must sound like a teaching step:
   ❌ "Definition of a Noun"  ✅ "What Is a Noun, Really? Let's Start With Real Sentences"
   
   Inside each section:
   - State the rule or concept clearly FIRST in plain language.
   - Then give the formal definition or name.
   - Use sentence-by-sentence examples from Nigerian contexts.
   - Highlight rules with <strong> or <em> where genuinely useful.
   - Guide transitions: "Now here's the part students miss...", "Here's a quick trick:", "Remember: ...".

4. KEY RULES OR STEPS
   Include at least one <ul> (summary tips) or <ol> (numbered process steps).
   Keep each point to one or two clear sentences.
${exampleInstruction}

5. CLOSING PARAGRAPH
   - One-sentence summary of what the student now knows.
   - One specific thing to do TODAY (write a sentence, practise aloud, find 5 examples in a book).
   - One genuine word of encouragement.

HARD RULES:
- Output ONLY clean HTML starting from <h1>. No wrapper tags. No markdown fences.
- No <img> tags — admin adds images separately.
- No filler: no "In this lesson we shall discuss…", no "As stated above…".
- Every sentence must teach or guide. No padding.

METADATA (keep): <!-- category:${category} classLevel:${classLevel} -->`;
    }
    
    // ─── GENERATION WITH FALLBACK ─────────────────────────────
    async function callGroq(model, prompt) {
      // CORS fix: route through corsproxy.io
      const targetUrl = encodeURIComponent('https://api.groq.com/openai/v1/chat/completions');
      const r = await fetch('https://corsproxy.io/?' + targetUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${groqApiKey}` },
        body: JSON.stringify({
          model: model.model,
          messages: [
            { role: 'system', content: 'You are an expert English and Literacy teacher for Nigerian students (Primary 1 to SS3). Output only clean HTML — no markdown, no <img> tags. Write in a teaching voice, not a storytelling voice.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.72,
          max_tokens: 3500,
          top_p: 0.95
        })
      });
      if (!r.ok) { const t = await r.text(); throw new Error(`Groq ${r.status}: ${t.substring(0,150)}`); }
      const d = await r.json();
      const c = d.choices?.[0]?.message?.content;
      if (!c) throw new Error('Groq empty');
      return c;
    }
    
    async function callGemini(model, prompt) {
      const r = await fetch(`${model.url}?key=${geminiApiKey}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.72, maxOutputTokens: 3200 } }) });
      if (!r.ok) { const t = await r.text(); throw new Error(`Gemini ${r.status}: ${t.substring(0,100)}`); }
      const d = await r.json();
      const c = d.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!c) throw new Error('Gemini empty');
      return c;
    }
    
    async function generateWithFallback(topic) {
      const prompt = buildLiteracyPrompt(topic);
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
          return { title, content: raw, excerpt, category: topic.category, classLevel: topic.classLevel, modelUsed: model.label };
        } catch (e) {
          const isQ = e.message.toLowerCase().match(/credit|quota|rate|insufficient/);
          addLog(`[FAIL] ${model.label}: ${e.message.substring(0,80)}${isQ?' [quota]':''}`, 'error');
        }
      }
      throw new Error('All models exhausted');
    }
    
    // ─── PUBLISH ──────────────────────────────────────────────
    async function publishPost(post) {
      if (!currentUser) throw new Error('Not signed in');
      const ref = await addDoc(collection(db, 'english-posts'), {
        title: post.title,
        content: post.content,
        excerpt: post.excerpt,
        featuredImage: '',
        videoLink: '',
        practiceLink: '',
        category: post.category,
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
        source: 'auto-literacy-v1'
      });
      return ref.id;
    }
    
    async function executePublishCycle() {
      if (!geminiApiKey && !groqApiKey) { addLog('[CYCLE] No key', 'warn'); if (currentUser) await loadApiKeys(currentUser);
        scheduleNextRun(5 * 60 * 1000); return; }
      if (!currentUser) { addLog('[CYCLE] No user', 'error');
        scheduleNextRun(5 * 60 * 1000); return; }
      const topic = rand(LITERACY_TOPICS);
      addLog(`[RUN] "${topic.text}" [${CAT_LABEL[topic.category]} / ${CLASS_LABEL(topic.classLevel)}]`, 'info');
      try {
        const post = await generateWithFallback(topic);
        const postId = await publishPost(post);
        publishCount++;
        publishCountSpan.innerText = publishCount;
        localStorage.setItem('literacyPublishCount', publishCount);
        addLog(`[DONE] ID: ${postId.substring(0,10)}... — add images + links via panel`, 'success');
        scheduleNextRun(randMs());
        loadRecentPosts();
      } catch (e) { addLog(`[ERR] ${e.message}`, 'error');
        scheduleNextRun(5 * 60 * 1000); }
    }
    
    const forcePublish = async () => { if (!geminiApiKey && !groqApiKey) { if (currentUser) await loadApiKeys(currentUser); return; } clearScheduler();
      addLog('[MAN] Manual publish', 'info');
      await executePublishCycle(); };
    const testFirestore = async () => { addLog('[TEST] Testing...', 'info'); try { const s = await getDocs(collection(db, 'english-posts'));
        addLog(`[OK] ${s.size} posts`, 'success'); } catch (e) { addLog(`[ERR] ${e.message}`, 'error'); } };
    const restartScheduler = () => { clearScheduler(); if (geminiApiKey || groqApiKey) { scheduleNextRun(randMs());
        addLog('[OK] Restarted', 'success'); } else addLog('[WARN] No keys', 'error'); };
    
    // ─── MANAGE POSTS ─────────────────────────────────────────
    async function loadRecentPosts() {
      const list = document.getElementById('managePostsList');
      list.innerHTML = `<li class="manage-loading"><div class="spinner-ring"></div>Loading...</li>`;
      try {
        const q = query(collection(db, 'english-posts'), orderBy('publishedAt', 'desc'), limit(30));
        const snap = await getDocs(q);
        if (snap.empty) { list.innerHTML = '<li class="manage-empty">No posts yet.</li>'; return; }
        list.innerHTML = '';
        snap.forEach(d => {
          const data = d.data();
          const cat = data.category || 'grammar';
          const cls = data.classLevel || 'ss-1';
          const catCls = CAT_CLS[cat] || 'lit-grammar';
          const clsCls = CLASS_CLS(cls);
          const catLbl = CAT_LABEL[cat] || cat;
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
                <span class="lit-badge ${catCls}">${catLbl}</span>
                <span class="cls-badge ${clsCls}">${clsLbl}</span>
                ${data.modelUsed?`<span>${escHtml(data.modelUsed.split(' ').slice(0,2).join(' '))}</span>`:''}
                ${data.views?`<span>${data.views} views</span>`:''}
                ${!hasImg?`<span class="pill-pending"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>No imgs</span>`:''}
                ${!hasLinks?`<span class="pill-pending pill-links-missing"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>No links</span>`:''}
              </div>
            </div>
            <div class="manage-post-actions">
              <button class="btn btn-sm btn-links links-btn"
                data-id="${d.id}" data-title="${escHtml(data.title||'Untitled')}"
                data-video="${escHtml(data.videoLink||'')}" data-practice="${escHtml(data.practiceLink||'')}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                <span class="btn-label">Links</span>
              </button>
              <button class="btn btn-sm btn-edit img-btn"
                data-id="${d.id}" data-title="${escHtml(data.title||'Untitled')}" data-featured="${escHtml(data.featuredImage||'')}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                <span class="btn-label">Images</span>
              </button>
              <button class="btn btn-sm meta-btn"
                data-id="${d.id}" data-title="${escHtml(data.title||'')}"
                data-category="${escHtml(cat)}" data-class="${escHtml(cls)}" data-excerpt="${escHtml(data.excerpt||'')}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                <span class="btn-label">Edit</span>
              </button>
              <button class="btn btn-sm btn-danger del-btn"
                data-id="${d.id}" data-title="${escHtml(data.title||'Untitled')}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6l-1 14H6L5 6"></path><path d="M10 11v6M14 11v6"></path><path d="M9 6V4h6v2"></path></svg>
                <span class="btn-label">Delete</span>
              </button>
            </div>`;
          list.appendChild(li);
        });
        
        list.querySelectorAll('.links-btn').forEach(btn => btn.addEventListener('click', () => openLinksModal(btn.dataset.id, btn.dataset.title, btn.dataset.video, btn.dataset.practice)));
        list.querySelectorAll('.img-btn').forEach(btn => btn.addEventListener('click', () => openImageEditor(btn.dataset.id, btn.dataset.title, btn.dataset.featured)));
        list.querySelectorAll('.meta-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            pendingMetaId = btn.dataset.id;
            document.getElementById('metaTitle').value = btn.dataset.title || '';
            document.getElementById('metaCategory').value = btn.dataset.category || 'grammar';
            document.getElementById('metaClass').value = btn.dataset.class || 'ss-1';
            document.getElementById('metaExcerpt').value = btn.dataset.excerpt || '';
            metaModal.classList.add('active');
          });
        });
        list.querySelectorAll('.del-btn').forEach(btn => {
          btn.addEventListener('click', () => { pendingDeleteId = btn.dataset.id;
            confirmPostTitle.textContent = `"${btn.dataset.title}" — cannot be undone.`;
            confirmModal.classList.add('active'); });
        });
      } catch (e) { list.innerHTML = `<li class="manage-empty">Error: ${escHtml(e.message)}</li>`;
        addLog(`[ERR] ${e.message}`, 'error'); }
    }
    
    // ─── LINKS EDITOR ─────────────────────────────────────────
    function openLinksModal(postId, postTitle, currentVideo, currentPractice) {
      pendingLinksId = postId;
      document.getElementById('linksModal').querySelector('#linksModalSubtitle').textContent = `"${postTitle}" — add a video and activity link.`;
      videoUrlInput.value = currentVideo || '';
      practiceUrlInput.value = currentPractice || '';
      videoThumbImg.classList.remove('visible');
      videoPlayBadge.style.display = 'none';
      practicePreviewCard.classList.remove('visible');
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
        await updateDoc(doc(db, 'english-posts', pendingLinksId), { videoLink: video, practiceLink: practice, linksAdded: !!(video || practice), updatedAt: serverTimestamp() });
        addLog(`[LINKS] Saved for ${pendingLinksId.substring(0,10)}...`, 'success');
        linksModal.classList.remove('active');
        pendingLinksId = null;
        await loadRecentPosts();
      } catch (e) { addLog(`[ERR] ${e.message}`, 'error'); }
      finally { saveLinksBtn.disabled = false;
        saveLinksBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>Save Links`; }
    });
    cancelLinksBtn.addEventListener('click', () => { linksModal.classList.remove('active');
      pendingLinksId = null; });
    linksModal.addEventListener('click', e => { if (e.target === linksModal) { linksModal.classList.remove('active');
        pendingLinksId = null; } });
    
    // ─── IMAGE EDITOR ─────────────────────────────────────────
    async function openImageEditor(postId, postTitle, currentFeatured) {
      pendingImgId = postId;
      document.getElementById('imgModalSubtitle').textContent = `"${postTitle}"`;
      paraBlocksList.innerHTML = `<div class="manage-loading"><div class="spinner-ring"></div>Loading...</div>`;
      imgPendingBanner.style.display = 'none';
      featuredImgInput.value = currentFeatured || '';
      updateFeaturedThumb(currentFeatured || '');
      imgModal.classList.add('active');
      try {
        const snap = await getDoc(doc(db, 'english-posts', postId));
        if (!snap.exists()) { addLog('[IMG] Not found', 'error'); return; }
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
      container.childNodes.forEach(n => { if (n.nodeType !== Node.ELEMENT_NODE) return; if (n.tagName === 'IMG') return; if (BLOCK_TAGS.has(n.tagName)) blocks.push(n); });
      if (!blocks.length) { paraBlocksList.innerHTML = '<div class="manage-empty">No blocks found.</div>'; return; }
      paraBlocksList.innerHTML = '';
      blocks.forEach((block, idx) => {
        const preview = block.textContent.trim().replace(/\s+/g, ' ').substring(0, 90);
        const row = document.createElement('div');
        row.className = 'para-block';
        row.dataset.idx = idx;
        row.innerHTML = `<div class="para-block-header"><span class="para-block-type">${block.tagName}</span><span class="para-block-preview">${escHtml(preview)||'(empty)'}</span></div><div class="para-block-body"><div class="para-img-row"><input type="url" class="para-img-input" data-idx="${idx}" placeholder="Image URL (leave blank to skip)"><img class="para-img-preview" alt="" data-idx="${idx}"></div><p class="para-void-note"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>Leave blank for no image.</p></div>`;
        paraBlocksList.appendChild(row);
        const inp = row.querySelector('.para-img-input');
        const prev = row.querySelector('.para-img-preview');
        inp.addEventListener('input', () => { const u = inp.value.trim(); if (u) { inp.classList.add('has-img');
            prev.src = u;
            prev.classList.add('visible');
            prev.onerror = () => { prev.src = '';
              prev.classList.remove('visible'); }; } else { inp.classList.remove('has-img');
            prev.src = '';
            prev.classList.remove('visible'); } });
      });
      paraBlocksList._blocks = blocks;
    }
    
    featuredImgInput.addEventListener('input', () => updateFeaturedThumb(featuredImgInput.value.trim()));
    
    function updateFeaturedThumb(url) { if (url) { featuredImgThumb.src = url;
        featuredImgThumb.classList.add('visible');
        featuredImgThumb.onerror = () => { featuredImgThumb.src = '';
          featuredImgThumb.classList.remove('visible'); }; } else { featuredImgThumb.src = '';
        featuredImgThumb.classList.remove('visible'); } }
    
    saveImgBtn.addEventListener('click', async () => {
      if (!pendingImgId) return;
      const featured = featuredImgInput.value.trim();
      const blocks = paraBlocksList._blocks || [];
      const inputs = paraBlocksList.querySelectorAll('.para-img-input');
      const STYLE = 'width:100%;max-width:100%;height:auto;border:2px solid #0a0a0a;margin:1.25rem 0;display:block;';
      let newContent = '';
      blocks.forEach((block, idx) => { newContent += block.outerHTML; const inp = inputs[idx]; if (inp?.value.trim()) newContent += `<img src="${escHtml(inp.value.trim())}" alt="${escHtml(block.textContent.trim().substring(0,40))}" style="${STYLE}">`; });
      if (!newContent) newContent = pendingImgContent;
      const hasAny = !!featured || [...inputs].some(i => i.value.trim());
      saveImgBtn.disabled = true;
      saveImgBtn.textContent = 'Saving...';
      try { await updateDoc(doc(db, 'english-posts', pendingImgId), { content: newContent, featuredImage: featured, imagesAdded: hasAny, updatedAt: serverTimestamp() });
        addLog(`[IMG] Saved for ${pendingImgId.substring(0,10)}...`, 'success');
        imgModal.classList.remove('active');
        pendingImgId = null;
        pendingImgContent = '';
        await loadRecentPosts(); }
      catch (e) { addLog(`[ERR] ${e.message}`, 'error'); }
      finally { saveImgBtn.disabled = false;
        saveImgBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>Save Images`; }
    });
    cancelImgBtn.addEventListener('click', () => { imgModal.classList.remove('active');
      pendingImgId = null;
      pendingImgContent = ''; });
    imgModal.addEventListener('click', e => { if (e.target === imgModal) { imgModal.classList.remove('active');
        pendingImgId = null;
        pendingImgContent = ''; } });
    
    // ─── META SAVE ────────────────────────────────────────────
    saveMetaBtn.addEventListener('click', async () => {
      if (!pendingMetaId) return;
      const title = document.getElementById('metaTitle').value.trim();
      const category = document.getElementById('metaCategory').value;
      const cls = document.getElementById('metaClass').value;
      const excerpt = document.getElementById('metaExcerpt').value.trim();
      if (!title) { addLog('[META] Title required', 'warn'); return; }
      saveMetaBtn.disabled = true;
      saveMetaBtn.textContent = 'Saving...';
      try { await updateDoc(doc(db, 'english-posts', pendingMetaId), { title, category, classLevel: cls, excerpt, updatedAt: serverTimestamp() });
        addLog(`[META] Updated: "${title}"`, 'success');
        metaModal.classList.remove('active');
        pendingMetaId = null;
        await loadRecentPosts(); }
      catch (e) { addLog(`[ERR] ${e.message}`, 'error'); }
      finally { saveMetaBtn.disabled = false;
        saveMetaBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>Save Details`; }
    });
    cancelMetaBtn.addEventListener('click', () => { metaModal.classList.remove('active');
      pendingMetaId = null; });
    metaModal.addEventListener('click', e => { if (e.target === metaModal) { metaModal.classList.remove('active');
        pendingMetaId = null; } });
    
    // ─── DELETE ───────────────────────────────────────────────
    confirmDeleteBtn.addEventListener('click', async () => {
      if (!pendingDeleteId) return;
      confirmDeleteBtn.disabled = true;
      confirmDeleteBtn.textContent = 'Deleting...';
      try { await deleteDoc(doc(db, 'english-posts', pendingDeleteId));
        addLog(`[DEL] ${pendingDeleteId.substring(0,10)}...`, 'success');
        confirmModal.classList.remove('active');
        pendingDeleteId = null;
        await loadRecentPosts(); }
      catch (e) { addLog(`[ERR] ${e.message}`, 'error'); }
      finally { confirmDeleteBtn.disabled = false;
        confirmDeleteBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6l-1 14H6L5 6"></path><path d="M10 11v6M14 11v6"></path><path d="M9 6V4h6v2"></path></svg>Yes, Delete`; }
    });
    cancelDeleteBtn.addEventListener('click', () => { confirmModal.classList.remove('active');
      pendingDeleteId = null; });
    confirmModal.addEventListener('click', e => { if (e.target === confirmModal) { confirmModal.classList.remove('active');
        pendingDeleteId = null; } });
    
    document.addEventListener('keydown', e => { if (e.key === 'Escape')[confirmModal, metaModal, linksModal, imgModal].forEach(m => m.classList.remove('active')); });
    forceBtn.addEventListener('click', forcePublish);
    restartBtn.addEventListener('click', restartScheduler);
    testBtn.addEventListener('click', testFirestore);
    refreshPostsBtn.addEventListener('click', loadRecentPosts);
    const navToggle = document.getElementById('nav-toggle'),
      navLinks = document.getElementById('navLinks');
    if (navToggle && navLinks) navToggle.addEventListener('click', () => { navToggle.classList.toggle('open');
      navLinks.classList.toggle('open'); });
    
    const saved = localStorage.getItem('literacyPublishCount');
    if (saved) { publishCount = parseInt(saved);
      publishCountSpan.innerText = publishCount; }
    
    onAuthStateChanged(auth, async user => {
      if (user) {
        currentUser = user;
        const short = user.email.length > 26 ? user.email.substring(0, 24) + '...' : user.email;
        statusDot.classList.remove('red');
        authStatusSpan.innerHTML = `<span class="status-dot"></span>${escHtml(short)}`;
        addLog(`[AUTH] ${user.email}`, 'success');
        const ok = await loadApiKeys(user);
        if (ok && !activeTimeout) { addLog('[READY] Starting scheduler...', 'success');
          scheduleNextRun(randMs()); }
        loadRecentPosts();
      } else {
        statusDot.classList.add('red');
        authStatusSpan.innerHTML = `<span class="status-dot red"></span>Waiting for sign-in...`;
        addLog('[AUTH] Waiting...', 'info');
      }
    });
    
    setInterval(() => { if (currentUser && (geminiApiKey || groqApiKey)) console.log('[ALIVE] literacy publisher running'); }, 30000);
    addLog('[BOOT] Literacy Publisher v1.0 — Grammar, Writing, Speaking, Comprehension, Vocabulary, Spelling', 'info');
    addLog('[BOOT] Groq via corsproxy.io | Gemini direct | Admin adds images + links after each post', 'success');
  