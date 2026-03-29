// ---------- DATA (NO EMOJIS) ----------
const YEARS = Array.from({ length: 16 }, (_, i) => 2010 + i);
const LIVE_YEARS = [2023, 2024, 2025];
const SUBJECTS = {
  science: ['English Language', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Further Mathematics', 'Geography', 'Agricultural Science', 'Technical Drawing'],
  arts: ['English Language', 'Mathematics', 'Literature in English', 'Government', 'History', 'Christian Religious Studies', 'Yoruba', 'Fine Art', 'Economics'],
  commercial: ['English Language', 'Mathematics', 'Commerce', 'Financial Accounting', 'Economics', 'Marketing', 'Insurance', 'Business Management', 'Office Practice']
};

// global state
let state = {
  year: null,
  stream: '',
  subjects: [],
  types: []
};

// DOM elements
const yearContainer = document.getElementById('year-chips');
const doneYear = document.getElementById('done-year');
const doneStream = document.getElementById('done-stream');
const doneSubject = document.getElementById('done-subject');
const doneType = document.getElementById('done-type');
const subjectRow = document.getElementById('subject-row');
const typeRow = document.getElementById('type-row');
const subjectChipsDiv = document.getElementById('subject-chips');
const subjectCountSpan = document.getElementById('subject-count');
const beginBtn = document.getElementById('begin-btn');
const setupStatusSpan = document.getElementById('setup-status');
const streamLabelSpan = document.getElementById('stream-label');
const streamSelectContainer = document.getElementById('csel-stream');
const streamBtn = document.getElementById('streamBtn');

// helper update overall ready state
function updateReadyState() {
  const yearOk = state.year !== null;
  const streamOk = state.stream !== '';
  const subjectsOk = state.subjects.length > 0;
  const typesOk = state.types.length > 0;
  const ready = yearOk && streamOk && subjectsOk && typesOk;
  
  beginBtn.disabled = !ready;
  if (ready) {
    setupStatusSpan.innerHTML = 'All set. Ready to generate WAEC paper.';
    setupStatusSpan.style.color = '#00a550';
    setupStatusSpan.classList.add('ready');
  } else {
    let msg = 'Incomplete: ';
    if (!yearOk) msg += 'select exam year  •  ';
    if (!streamOk) msg += 'choose stream  •  ';
    if (!subjectsOk) msg += 'pick subjects  •  ';
    if (!typesOk) msg += 'select format';
    setupStatusSpan.innerHTML = msg;
    setupStatusSpan.style.color = '#4a4a4a';
    setupStatusSpan.classList.remove('ready');
  }
}

// subject UI render based on stream
function renderSubjects(streamKey) {
  if (!streamKey || !SUBJECTS[streamKey]) return;
  const list = SUBJECTS[streamKey];
  subjectChipsDiv.innerHTML = '';
  state.subjects = [];
  doneSubject.classList.remove('show');
  typeRow.style.display = 'none';
  doneType.classList.remove('show');
  state.types = [];
  document.querySelectorAll('#type-chips .custom-chip').forEach(chip => chip.classList.remove('checked'));
  
  list.forEach(sub => {
    const chip = document.createElement('div');
    chip.className = 'custom-chip';
    chip.innerHTML = `<div class="chip-check-box"></div><span>${sub}</span>`;
    chip.onclick = (e) => {
      e.stopPropagation();
      const idx = state.subjects.indexOf(sub);
      if (idx !== -1) {
        state.subjects.splice(idx, 1);
        chip.classList.remove('checked');
      } else {
        if (state.subjects.length < 9) {
          state.subjects.push(sub);
          chip.classList.add('checked');
        } else {
          setupStatusSpan.innerHTML = 'Max 9 subjects allowed per session';
          setupStatusSpan.style.color = '#ff6b3e';
          setTimeout(() => updateReadyState(), 900);
          return;
        }
      }
      subjectCountSpan.innerText = state.subjects.length;
      if (state.subjects.length > 0) {
        doneSubject.classList.add('show');
        typeRow.style.display = 'block';
      } else {
        doneSubject.classList.remove('show');
        typeRow.style.display = 'none';
        doneType.classList.remove('show');
        state.types = [];
        document.querySelectorAll('#type-chips .custom-chip').forEach(c => c.classList.remove('checked'));
      }
      updateReadyState();
    };
    subjectChipsDiv.appendChild(chip);
  });
  subjectCountSpan.innerText = state.subjects.length;
  subjectRow.style.display = 'block';
  updateReadyState();
}

// handle type toggles
function initTypeToggles() {
  const typeChips = document.querySelectorAll('#type-chips .custom-chip');
  typeChips.forEach(chip => {
    chip.onclick = (e) => {
      e.stopPropagation();
      const tVal = chip.getAttribute('data-type');
      const idx = state.types.indexOf(tVal);
      if (idx !== -1) {
        state.types.splice(idx, 1);
        chip.classList.remove('checked');
      } else {
        state.types.push(tVal);
        chip.classList.add('checked');
      }
      if (state.types.length > 0) {
        doneType.classList.add('show');
      } else {
        doneType.classList.remove('show');
      }
      updateReadyState();
    };
  });
}

// build year chips
function buildYearGrid() {
  yearContainer.innerHTML = '';
  YEARS.forEach(yr => {
    const isLive = LIVE_YEARS.includes(yr);
    const chip = document.createElement('div');
    chip.className = `custom-chip year-chip ${!isLive ? 'disabled' : ''}`;
    chip.innerHTML = `<div class="status-dot ${isLive ? 'live' : 'offline'}"></div><span>${yr}</span>`;
    if (isLive) {
      chip.onclick = () => {
        document.querySelectorAll('.year-chip').forEach(c => c.classList.remove('checked'));
        chip.classList.add('checked');
        state.year = yr;
        doneYear.classList.add('show');
        updateReadyState();
      };
    } else {
      chip.style.pointerEvents = 'none';
    }
    yearContainer.appendChild(chip);
  });
}

// dropdown logic: clean, no emojis
function setupDropdown() {
  const wrapper = document.getElementById('csel-stream');
  const btn = streamBtn;
  const items = wrapper.querySelectorAll('.csel-item');
  
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const isOpen = wrapper.classList.contains('open');
    document.querySelectorAll('.csel.open').forEach(el => {
      if (el !== wrapper) el.classList.remove('open');
    });
    if (isOpen) wrapper.classList.remove('open');
    else wrapper.classList.add('open');
  });
  
  items.forEach(item => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      const streamVal = item.getAttribute('data-val');
      const streamText = item.innerText.trim();
      state.stream = streamVal;
      streamLabelSpan.innerText = streamText;
      doneStream.classList.add('show');
      // reset subjects and types when stream changes
      state.subjects = [];
      state.types = [];
      if (subjectRow) subjectRow.style.display = 'none';
      if (typeRow) typeRow.style.display = 'none';
      doneSubject.classList.remove('show');
      doneType.classList.remove('show');
      document.querySelectorAll('#type-chips .custom-chip').forEach(c => c.classList.remove('checked'));
      renderSubjects(streamVal);
      wrapper.classList.remove('open');
      updateReadyState();
    });
  });
  
  document.addEventListener('click', function closeDropdown(e) {
    if (!wrapper.contains(e.target)) {
      wrapper.classList.remove('open');
    }
  });
}

// ticker with no emojis
function initTicker() {
  const tickerTrack = document.getElementById('ticker-track');
  const items = ['WAEC 2025 PREP', 'AI MARKED ESSAYS', 'PAST QUESTIONS LIBRARY', 'JAMB SIMULATOR', 'SCORE ANALYTICS'];
  const repeated = [...items, ...items];
  tickerTrack.innerHTML = repeated.map(i => `<span class="ticker-item">${i} ◆</span>`).join('');
}

function init() {
  buildYearGrid();
  setupDropdown();
  initTypeToggles();
  initTicker();
  state = { year: null, stream: '', subjects: [], types: [] };
  doneYear.classList.remove('show');
  doneStream.classList.remove('show');
  doneSubject.classList.remove('show');
  doneType.classList.remove('show');
  subjectRow.style.display = 'none';
  typeRow.style.display = 'none';
  updateReadyState();
}

init();