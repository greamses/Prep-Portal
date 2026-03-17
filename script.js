
const examData = [
  { id: "01", title: "Common Entrance", desc: "National baseline assessments for secondary transition.", link: "#", live: false },
  { id: "02", title: "Cambridge Exam", desc: "International standard papers for primary foundation learners.", link: "./Cambridge/index.html", live: true },
  { id: "03", title: "Grade 4 Spring", desc: "Second term revision modules for Year 4 students.", link: "./Grade-4-Exam/index.html", live: true },
  { id: "04", title: "Grade 5 Spring", desc: "Intensive preparatory sets for Year 5 promotional exams.", link: "./Grade-5-Exam/index.html", live: true },
  { id: "05", title: "TULIP Questions", desc: "Exclusive archive for TULIP scholarship entrance.", link: "#", live: false },
  { id: "06", title: "Scholastic Prep", desc: "Elite-level competition drills for academic decathlons.", link: "./Scholarstic/index.html", live: true },
  { id: "07", title: "WAEC", desc: "West African Senior School Certificate Examination past papers.", link: "./WAEC/index.html", live: true },
];

const tickerItems = ["Common Entrance", "Cambridge", "Grade 5 Spring", "WAEC", "TULIP Questions", "Scholastic Prep", "Grade 4 Spring", "2026 Edition", "New Papers Added", "Interactive Quizzes"];
const tickerTrack = document.getElementById('ticker-track');
[...tickerItems, ...tickerItems].forEach(t => {
  const s = document.createElement('span');
  s.className = 'ticker-item';
  s.innerHTML = t + '<span class="ticker-dot">✦</span>';
  tickerTrack.appendChild(s);
});

const featuredCards = document.getElementById('featured-cards');
examData.filter(e => e.live).forEach(item => {
  const a = document.createElement('a');
  a.href = item.link;
  a.className = 'feat-card';
  a.innerHTML = `<div class="feat-card-inner"><span class="feat-badge">Live</span><h3>${item.title}</h3></div>`;
  featuredCards.appendChild(a);
});

const grid = document.getElementById('exam-grid');
examData.forEach((item, i) => {
  const c = document.createElement('a');
  c.href = item.link;
  c.className = 'card';
  c.style.transitionDelay = `${0.5+i*0.1}s`;
  c.innerHTML = `<div class="card-inner"><span class="card-num">${item.id}</span><h2>${item.title}</h2><p>${item.desc}</p><span class="card-arrow">→</span></div>`;
  grid.appendChild(c);
});

const splitText = el => {
  const lines = el.innerHTML.split('<br>');
  el.innerHTML = '';
  lines.forEach((line, li) => {
    const div = document.createElement('div');
    div.style.display = 'block';
    line.split('').forEach((char, ci) => {
      const wrapper = document.createElement('span');
      wrapper.className = 'char-wrapper';
      const span = document.createElement('span');
      span.className = 'char';
      span.innerHTML = char === ' ' ? '&nbsp;' : char;
      span.style.transitionDelay = `${li*0.2+ci*0.03}s`;
      wrapper.appendChild(span);
      div.appendChild(wrapper);
    });
    el.appendChild(div);
  });
};
splitText(document.getElementById('main-title'));

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible');
      revealObserver.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

window.onload = () => document.body.classList.add('active');

const toggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');
toggle.addEventListener('click', () => { toggle.classList.toggle('open');
  navLinks.classList.toggle('open'); });
window.addEventListener('scroll', () => {
  document.getElementById('site-nav').style.boxShadow = window.scrollY > 10 ? '0 4px 0 0 #1f1f1f' : 'none';
}, { passive: true });


/* ══════════════════════════════════════════
   PREPBOT — AI CHATBOT
══════════════════════════════════════════ */
const fab = document.getElementById('chat-fab');
const win = document.getElementById('chat-window');
const closeBtn = document.getElementById('chat-close');
const messages = document.getElementById('chat-messages');
const input = document.getElementById('chat-input');
const sendBtn = document.getElementById('chat-send');
const charCounter = document.getElementById('char-counter');
const clearBtn = document.getElementById('chat-clear-btn');
const clearBar = document.getElementById('chat-clear-bar');
const clearConfirm = document.getElementById('clear-confirm');
const clearCancel = document.getElementById('clear-cancel');
const suggBox = document.getElementById('chat-suggestions');
const tabs = document.querySelectorAll('.chat-tab');

let isOpen = false;
let isBusy = false;
let history = []; // {role, content}[]
let activeSubject = 'General';

/* ── Open / Close ── */
function toggleChat(forceOpen) {
  isOpen = forceOpen !== undefined ? forceOpen : !isOpen;
  win.classList.toggle('open', isOpen);
  fab.setAttribute('aria-expanded', isOpen);
  if (isOpen) { setTimeout(() => input.focus(), 280); }
}

fab.addEventListener('click', () => toggleChat());
closeBtn.addEventListener('click', () => toggleChat(false));

document.addEventListener('mousedown', e => {
  if (isOpen && !win.contains(e.target) && e.target !== fab && !fab.contains(e.target)) {
    toggleChat(false);
  }
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && isOpen) toggleChat(false);
});

/* ── Subject Tabs ── */
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => { t.classList.remove('active');
      t.setAttribute('aria-selected', 'false'); });
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    activeSubject = tab.dataset.subject;
    updateSuggestions(activeSubject);
  });
});

const subjectSuggestions = {
  'General': ['What is LCM?', 'BODMAS rule', 'Exam tips', 'Parts of speech', 'Photosynthesis'],
  'Mathematics': ['HCF and LCM', 'Solve: 3x + 5 = 20', 'Convert ¾ to %', 'BODMAS example', 'Roman numerals'],
  'English': ['Parts of speech', 'Simile vs metaphor', 'What is a clause?', 'Punctuation rules', 'Essay structure'],
  'Science': ['Photosynthesis', 'Food chain example', 'States of matter', 'Newton\'s laws', 'Digestive system'],
  'Exam Tips': ['How to manage time', 'Beat exam anxiety', 'How to revise', 'Mark scheme tips', 'Past paper strategy'],
};

function updateSuggestions(subject) {
  const chips = subjectSuggestions[subject] || subjectSuggestions['General'];
  suggBox.innerHTML = '';
  chips.forEach((text, i) => {
    const btn = document.createElement('button');
    btn.className = 'suggestion-chip' + (i === 0 ? ' blue' : '');
    btn.textContent = text;
    btn.addEventListener('click', () => {
      input.value = text;
      suggBox.style.display = 'none';
      sendMessage();
    });
    suggBox.appendChild(btn);
  });
}

/* ── Input helpers ── */
input.addEventListener('input', () => {
  input.style.height = 'auto';
  input.style.height = Math.min(input.scrollHeight, 96) + 'px';
  const remaining = 500 - input.value.length;
  charCounter.textContent = remaining;
  charCounter.classList.toggle('near-limit', remaining < 80);
});

input.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault();
    sendMessage(); }
});

sendBtn.addEventListener('click', sendMessage);

/* Initial suggestion chips */
document.querySelectorAll('.suggestion-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    input.value = chip.textContent;
    suggBox.style.display = 'none';
    sendMessage();
  });
});

/* ── Clear chat ── */
clearBtn.addEventListener('click', () => { clearBar.classList.add('visible'); });
clearCancel.addEventListener('click', () => { clearBar.classList.remove('visible'); });
clearConfirm.addEventListener('click', () => {
  history = []; // Gemini-format [{role,parts}] array
  messages.innerHTML = `
            <div class="chat-intro-card">
                <div class="intro-label">PrepBot · 2026</div>
                <p>Conversation cleared. Ask me anything — <strong>Maths, English, Science</strong>, or exam strategy.</p>
            </div>`;
  suggBox.style.display = '';
  clearBar.classList.remove('visible');
});

/* ── Append message bubble ── */
function appendMessage(role, text) {
  const wrap = document.createElement('div');
  wrap.className = `msg ${role}`;
  const meta = document.createElement('div');
  meta.className = 'msg-meta';
  meta.textContent = role === 'user' ? 'You' : 'PrepBot';
  const bubble = document.createElement('div');
  bubble.className = 'msg-bubble';
  bubble.innerHTML = formatText(text);
  wrap.appendChild(meta);
  wrap.appendChild(bubble);
  messages.appendChild(wrap);
  messages.scrollTop = messages.scrollHeight;
  return bubble;
}

/* ── Typing indicator ── */
function showTyping() {
  const wrap = document.createElement('div');
  wrap.className = 'msg bot';
  wrap.id = 'typing-indicator';
  const meta = document.createElement('div');
  meta.className = 'msg-meta';
  meta.textContent = 'PrepBot';
  const bubble = document.createElement('div');
  bubble.className = 'msg-bubble';
  bubble.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';
  wrap.appendChild(meta);
  wrap.appendChild(bubble);
  messages.appendChild(wrap);
  messages.scrollTop = messages.scrollHeight;
}

function hideTyping() {
  const el = document.getElementById('typing-indicator');
  if (el) el.remove();
}

/* ── Basic markdown → HTML ── */
function formatText(text) {
  return text
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code style="background:#f0f0f0;padding:1px 5px;font-family:monospace;font-size:0.9em">$1</code>')
    .replace(/\n/g, '<br>');
}

/* ── System prompt per subject ── */
function getSystemPrompt(subject) {
  const base = `You are PrepBot, a friendly AI study assistant on Prep Portal — an exam prep platform for Nigerian and international students (primary to SS2 level) preparing for Common Entrance, Cambridge, WAEC, Grade 4/5, TULIP, and Scholastic exams.

Rules:
- Be clear, concise, and encouraging.
- Use **bold** for key terms and answers.
- Use numbered steps for multi-step solutions.
- Keep responses short enough to read in a chat window.
- If a question is off-topic (not study-related), kindly redirect.
- Never give harmful, political, or adult content.`;
  
  const focus = subject !== 'General' ?
    `\n\nThe student has selected the **${subject}** tab, so focus your responses on ${subject} topics.` :
    '';
  
  return base + focus;
}


const GEMINI_KEY = 'AIzaSyCQDStgsPo7EQtgqx96QBQdICTUR0Pfqk4';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`;

/* ── Send message ── */
async function sendMessage() {
  const text = input.value.trim();
  if (!text || isBusy) return;
  
  isBusy = true;
  sendBtn.disabled = true;
  sendBtn.classList.add('loading');
  suggBox.style.display = 'none';
  
  input.value = '';
  input.style.height = 'auto';
  charCounter.textContent = '500';
  charCounter.classList.remove('near-limit');
  
  appendMessage('user', text);
  history.push({ role: 'user', parts: [{ text }] });
  showTyping();
  
  try {
    const res = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: getSystemPrompt(activeSubject) }] },
        contents: history,
        generationConfig: { maxOutputTokens: 800, temperature: 0.7 }
      })
    });
    
    hideTyping();
    
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      const errMsg = errData?.error?.message || `HTTP ${res.status}`;
      console.error('Gemini API error:', errMsg);
      appendMessage('bot', `⚠️ **API error:** ${errMsg}`);
    } else {
      const data = await res.json();
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text ||
        'Sorry, I couldn\'t get a response. Please try again.';
      history.push({ role: 'model', parts: [{ text: reply }] });
      appendMessage('bot', reply);
    }
    
  } catch (err) {
    hideTyping();
    // Log the real error so you can see exactly what's failing
    console.error('PrepBot fetch error:', err.name, err.message);
    appendMessage('bot', `⚠️ **${err.name}:** ${err.message}`);
  }
  
  isBusy = false;
  sendBtn.disabled = false;
  sendBtn.classList.remove('loading');
  input.focus();
}