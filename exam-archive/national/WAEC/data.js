
  // ---------- DATA ----------
  const YEARS = Array.from({ length: 16 }, (_, i) => 2010 + i);
  const LIVE_YEARS = [2024];
  
  // Base subject pools (without automatic compulsory)
  const BASE_SUBJECTS = {
    science: ['Physics', 'Chemistry', 'Biology', 'Further Mathematics', 'Geography', 'Agricultural Science', 'Technical Drawing'],
    arts: ['Literature in English', 'Government', 'History', 'Christian Religious Studies', 'Yoruba', 'Fine Art', 'Economics'],
    commercial: ['Commerce', 'Financial Accounting', 'Economics', 'Marketing', 'Insurance', 'Business Management', 'Office Practice']
  };
  
  const COMPULSORY_CORE = ['English Language', 'Mathematics'];
  
  // Helper: get full subject list depending on compulsory toggle
  function getFullSubjectList(streamKey, compulsoryEnabled) {
    if (!streamKey || !BASE_SUBJECTS[streamKey]) return [];
    const base = [...BASE_SUBJECTS[streamKey]];
    if (compulsoryEnabled) {
      // merge compulsory first, then unique base subjects (avoid duplicates)
      let combined = [...COMPULSORY_CORE];
      base.forEach(sub => {
        if (!combined.includes(sub)) combined.push(sub);
      });
      return combined;
    } else {
      // when compulsory OFF, just show base + optionally we still need to show eng/math as normal selectable
      // but the requirement says "English and Math is always compulsory" BUT user can toggle them in options.
      // So if toggle OFF, they become optional and appear inside the list as normal selectable subjects.
      let optionalMode = [...COMPULSORY_CORE, ...base];
      // remove duplicates if any (english/math might appear twice)
      return [...new Map(optionalMode.map(s => [s, s])).values()];
    }
  }

  let state = {
    year: null,
    stream: '',
    subjects: [],      // stores selected subjects IDs (full names)
    types: [],
    compulsoryEnabled: true
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
  const compulsoryToggle = document.getElementById('compulsoryToggle');
  const compulsoryHint = document.getElementById('compulsoryHint');

  function updateReadyState() {
    const yearOk = state.year !== null;
    const streamOk = state.stream !== '';
    const subjectsOk = state.subjects.length > 0;
    const typesOk = state.types.length > 0;
    const ready = yearOk && streamOk && subjectsOk && typesOk;
    beginBtn.disabled = !ready;
    if (ready) {
      setupStatusSpan.innerHTML = '✓ All set. Ready to generate WAEC paper.';
      setupStatusSpan.classList.add('ready');
    } else {
      let msg = '⚠️ Incomplete: ';
      if (!yearOk) msg += 'select year • ';
      if (!streamOk) msg += 'choose stream • ';
      if (!subjectsOk) msg += 'pick subjects • ';
      if (!typesOk) msg += 'select format';
      setupStatusSpan.innerHTML = msg;
      setupStatusSpan.classList.remove('ready');
    }
  }

  // re-render subjects based on current stream + compulsory flag
  function renderSubjects() {
    if (!state.stream) return;
    const fullList = getFullSubjectList(state.stream, state.compulsoryEnabled);
    if (!fullList.length) return;
    
    subjectChipsDiv.innerHTML = '';
    // determine which subjects are auto-selected if compulsory mode is on
    let autoSelected = [];
    if (state.compulsoryEnabled) {
      autoSelected = [...COMPULSORY_CORE];
    }
    
    // rebuild state.subjects: we want to keep previously selected subjects that still exist in fullList,
    // and also ensure autoSelected are always present (if compulsory)
    let newSelected = [];
    if (state.compulsoryEnabled) {
      // compulsory subjects must be inside selection
      newSelected = [...autoSelected];
      // add any previous selections that are not already in autoSelected and exist in fullList
      state.subjects.forEach(sub => {
        if (!autoSelected.includes(sub) && fullList.includes(sub) && !newSelected.includes(sub)) {
          newSelected.push(sub);
        }
      });
    } else {
      // compulsory OFF: keep previous selections but filter by fullList
      newSelected = state.subjects.filter(sub => fullList.includes(sub));
    }
    // limit to max 9
    if (newSelected.length > 9) newSelected = newSelected.slice(0,9);
    state.subjects = newSelected;
    
    fullList.forEach(sub => {
      const isCompulsory = state.compulsoryEnabled && COMPULSORY_CORE.includes(sub);
      const isSelected = state.subjects.includes(sub);
      const chip = document.createElement('div');
      chip.className = `custom-chip ${isCompulsory ? 'compulsory' : ''} ${isSelected ? 'checked' : ''}`;
      chip.innerHTML = `<div class="chip-check-box"></div><span>${sub}</span>`;
      
      if (!isCompulsory) {
        chip.onclick = () => {
          if (state.compulsoryEnabled && COMPULSORY_CORE.includes(sub)) return; // safety
          const idx = state.subjects.indexOf(sub);
          if (idx !== -1) {
            state.subjects.splice(idx, 1);
            chip.classList.remove('checked');
          } else {
            if (state.subjects.length < 9) {
              state.subjects.push(sub);
              chip.classList.add('checked');
            } else {
              setupStatusSpan.innerHTML = '⚠️ Max 9 subjects allowed';
              setTimeout(() => updateReadyState(), 700);
              return;
            }
          }
          subjectCountSpan.innerText = state.subjects.length;
          if (state.subjects.length > 0) doneSubject.classList.add('show');
          else doneSubject.classList.remove('show');
          updateReadyState();
        };
      } else {
        chip.style.cursor = 'default';
      }
      subjectChipsDiv.appendChild(chip);
    });
    
    subjectCountSpan.innerText = state.subjects.length;
    if (state.subjects.length > 0) doneSubject.classList.add('show');
    else doneSubject.classList.remove('show');
    
    // control type row visibility
    if (state.subjects.length > 0) typeRow.style.display = 'block';
    else typeRow.style.display = 'none';
    
    updateReadyState();
  }

  // When stream changes, reset subjects & types, then render
  function onStreamChange(streamVal, streamText) {
    state.stream = streamVal;
    streamLabelSpan.innerText = streamText;
    doneStream.classList.add('show');
    // reset dependent selections
    state.subjects = [];
    state.types = [];
    doneSubject.classList.remove('show');
    doneType.classList.remove('show');
    if (typeRow) typeRow.style.display = 'none';
    document.querySelectorAll('#type-chips .custom-chip').forEach(c => c.classList.remove('checked'));
    
    // re-render subjects with current compulsory flag
    renderSubjects();
    subjectRow.style.display = 'block';
    updateReadyState();
  }

  // compulsory toggle handler
  function handleCompulsoryToggle() {
    state.compulsoryEnabled = compulsoryToggle.checked;
    if (state.stream) {
      // re-evaluate subjects
      renderSubjects();
      // update hint text
      if (state.compulsoryEnabled) {
        compulsoryHint.innerText = 'English & Mathematics are mandatory and always included.';
      } else {
        compulsoryHint.innerText = 'Compulsory mode OFF: English & Mathematics can be selected manually.';
      }
    } else {
      if (state.compulsoryEnabled) compulsoryHint.innerText = 'English & Math are compulsory (will apply after stream selection).';
      else compulsoryHint.innerText = 'Compulsory mode OFF: you may select English & Math from subject list.';
    }
    updateReadyState();
  }

  // year grid
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

  // type toggles
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
        doneType.classList.toggle('show', state.types.length > 0);
        updateReadyState();
      };
    });
  }

  // dropdown
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
        onStreamChange(streamVal, streamText);
        wrapper.classList.remove('open');
      });
    });
    document.addEventListener('click', function close(e) {
      if (!wrapper.contains(e.target)) wrapper.classList.remove('open');
    });
  }

  function initTicker() {
    const tickerTrack = document.getElementById('ticker-track');
    const items = ['WAEC 2025 PREP', 'AI MARKED ESSAYS', 'PAST QUESTIONS', 'COMPULSORY ENGLISH & MATH', 'SCORE ANALYTICS'];
    const repeated = [...items, ...items];
    tickerTrack.innerHTML = repeated.map(i => `<span class="ticker-item">${i} ◆</span>`).join('');
  }

  function init() {
    buildYearGrid();
    setupDropdown();
    initTypeToggles();
    initTicker();
    compulsoryToggle.addEventListener('change', handleCompulsoryToggle);
    handleCompulsoryToggle(); // set initial hint
    state = { year: null, stream: '', subjects: [], types: [], compulsoryEnabled: true };
    doneYear.classList.remove('show');
    doneStream.classList.remove('show');
    doneSubject.classList.remove('show');
    doneType.classList.remove('show');
    subjectRow.style.display = 'none';
    typeRow.style.display = 'none';
    updateReadyState();
  }
  init();