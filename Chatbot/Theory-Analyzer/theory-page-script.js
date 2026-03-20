/* ════════════════════════════════════════
   API KEY — sessionStorage only (clears on tab close)
════════════════════════════════════════ */
let GEMINI_KEY   = '';
let KEY_VERIFIED = false;

(function initKey() {
  const saved = sessionStorage.getItem('pp_gemini_key') || '';
  if (saved) {
    document.getElementById('apikey-input').value = saved;
    _setKeyRaw(saved, false);
  }
})();

window.addEventListener('beforeunload', () => {
  sessionStorage.removeItem('pp_gemini_key');
  GEMINI_KEY   = '';
  KEY_VERIFIED = false;
});

function _setKeyRaw(raw, verified) {
  const key     = raw.trim();
  GEMINI_KEY    = key;
  KEY_VERIFIED  = verified;

  const dot    = document.getElementById('apikey-dot');
  const txt    = document.getElementById('apikey-status-text');
  const done   = document.getElementById('done-key');
  const verBtn = document.getElementById('apikey-verify-btn');

  if (!key) {
    dot.className      = 'apikey-dot';
    txt.textContent    = 'Paste your key, then click Verify';
    done.classList.remove('show');
    verBtn.disabled    = true;
    verBtn.className   = 'apikey-verify-btn';
    verBtn.textContent = 'Verify →';
  } else if (!verified) {
    dot.className      = 'apikey-dot bad';
    txt.textContent    = 'Key pasted — click Verify to confirm it works';
    done.classList.remove('show');
    verBtn.disabled    = false;
    verBtn.className   = 'apikey-verify-btn';
    verBtn.textContent = 'Verify →';
    sessionStorage.setItem('pp_gemini_key', key);
  } else {
    dot.className      = 'apikey-dot ok';
    txt.textContent    = '✓ Key verified and active for this session';
    done.classList.add('show');
    verBtn.disabled    = true;
    verBtn.className   = 'apikey-verify-btn verified';
    verBtn.textContent = '✓ Verified';
    sessionStorage.setItem('pp_gemini_key', key);
  }
  checkReady();
}

document.getElementById('apikey-input').addEventListener('input', function () {
  _setKeyRaw(this.value, false);
});

document.getElementById('apikey-toggle').addEventListener('click', function () {
  const inp    = document.getElementById('apikey-input');
  const hidden = inp.type === 'password';
  inp.type         = hidden ? 'text' : 'password';
  this.textContent = hidden ? 'Hide' : 'Show';
});

document.getElementById('apikey-verify-btn').addEventListener('click', async function () {
  const key = GEMINI_KEY.trim();
  if (!key) return;

  const dot  = document.getElementById('apikey-dot');
  const txt  = document.getElementById('apikey-status-text');
  const done = document.getElementById('done-key');
  this.disabled    = true;
  this.className   = 'apikey-verify-btn verifying';
  this.textContent = 'Checking…';
  dot.className    = 'apikey-dot verifying';
  txt.textContent  = 'Verifying key with Gemini…';

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${encodeURIComponent(key)}`;
    const res = await fetch(url, {
      method : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify({
        contents: [{ parts: [{ text: 'Reply with the single word: ok' }] }],
        generationConfig: { maxOutputTokens: 5 }
      })
    });

    if (res.ok || res.status === 400) {
      _setKeyRaw(key, true);
    } else if (res.status === 429) {
      _setKeyRaw(key, true);
      document.getElementById('apikey-status-text').textContent =
        '✓ Key valid (quota limit active — will retry automatically)';
    } else if (res.status === 401 || res.status === 403) {
      KEY_VERIFIED       = false;
      dot.className      = 'apikey-dot bad';
      txt.textContent    = '✗ Invalid key — check and re-paste from AI Studio';
      done.classList.remove('show');
      this.className     = 'apikey-verify-btn failed';
      this.textContent   = '✗ Invalid';
      this.disabled      = false;
      sessionStorage.removeItem('pp_gemini_key');
    } else {
      throw new Error(`HTTP ${res.status}`);
    }
  } catch (err) {
    dot.className    = 'apikey-dot bad';
    txt.textContent  = `Could not reach Gemini — check connection (${err.message})`;
    this.className   = 'apikey-verify-btn failed';
    this.textContent = 'Retry →';
    this.disabled    = false;
  }
  checkReady();
});

/* ════════════════════════════════════════
   AUTO-RESIZE HELPER
════════════════════════════════════════ */
function autoResize(ta) {
  if (CSS.supports('field-sizing', 'content')) return;
  ta.style.height = 'auto';
  ta.style.height = ta.scrollHeight + 'px';
}

/* ════════════════════════════════════════
   SUBJECTS per class-key
════════════════════════════════════════ */
const SUBJECTS = {
  'primary-lower': [
    'English Language', 'Mathematics', 'Basic Science',
    'Basic Technology', 'Social Studies', 'Civic Education',
    'CRS / IRS', 'Home Economics', 'Fine & Creative Arts', 'Physical Education',
  ],
  'primary-upper': [
    'English Language', 'Mathematics', 'Basic Science',
    'Basic Technology', 'Social Studies', 'Civic Education',
    'CRS / IRS', 'Agricultural Science', 'Home Economics',
    'Computer Studies', 'Fine & Creative Arts', 'Physical & Health Education',
    'Yoruba / Hausa / Igbo',
  ],
  'jss': [
    'English Language', 'Mathematics', 'Basic Science',
    'Social Studies', 'Civic Education', 'Agricultural Science',
    'Home Economics', 'Computer Studies', 'Business Studies',
    'CRS / IRS', 'French', 'Fine & Creative Arts',
    'Physical & Health Education', 'Yoruba / Hausa / Igbo',
  ],
  'ss-science': [
    'English Language', 'Mathematics', 'Further Mathematics',
    'Physics', 'Chemistry', 'Biology', 'Agricultural Science',
    'Computer Science', 'Geography', 'Economics', 'CRS / IRS',
    'Technical Drawing', 'Food & Nutrition',
  ],
  'ss-arts': [
    'English Language', 'Mathematics', 'Literature in English',
    'Government', 'History', 'CRS / IRS', 'Yoruba / Hausa / Igbo',
    'French', 'Fine Art', 'Music', 'Economics', 'Geography', 'Islamic Studies',
  ],
  'ss-commercial': [
    'English Language', 'Mathematics', 'Commerce',
    'Financial Accounting', 'Economics', 'Government',
    'Business Studies', 'Marketing', 'Office Practice',
    'CRS / IRS', 'Computer Studies', 'Geography',
    'Typewriting & Data Processing',
  ],
};

/* ════════════════════════════════════════
   CURRICULUM — full topic scheme
   __WRITING_LINK__ = opens writing page
════════════════════════════════════════ */
const CURRICULUM = {
  /* ── PRIMARY LOWER (1–3) ── */
  'primary-lower': {
    'English Language': {
      'Grammar':    ['Nouns (naming words)', 'Verbs (action words)', 'Adjectives (describing words)', 'Pronouns (he/she/it/they)', 'Simple sentences', 'Joining words (and/but/or)', 'Punctuation basics (. ! ?)', 'Capital letters'],
      'Vocabulary': ['Word families', 'Opposites (antonyms)', 'Similar words (synonyms)', 'Compound words', 'Animals and their young', 'Community helpers'],
      'Spelling':   ['Phonics — vowel sounds', 'Phonics — consonant blends', 'Common sight words', 'Word endings (-ing, -ed, -s)', 'Double letters', 'Silent letters'],
      'Writing ↗':  '__WRITING_LINK__',
    },
    'Mathematics': {
      'Arithmetic': ['Counting 1–100', 'Addition (up to 20)', 'Subtraction (up to 20)', 'Multiplication (2, 3, 5 tables)', 'Simple division (sharing equally)', 'Fractions (half, quarter)', 'Money basics', 'Word problems'],
      'Patterns':   ['Number sequences (up to 100)', 'Odd and even numbers', 'Skip counting (2s, 5s, 10s)', 'Simple shape patterns', 'Repeating patterns'],
    },
    'Basic Science': {
      'Life Science':     ['Living and non-living things', 'Parts of a plant (root, stem, leaf, flower)', 'Basic animals and their habitats', 'Human body parts', 'What plants need to grow', 'Taking care of our body'],
      'Earth Science':    ['Weather types (sunny, rainy, windy)', 'Soil — types and uses', 'Day and night', 'Seasons (harmattan, rainy season)', 'Sources of water', 'Rocks and their uses'],
      'Physical Science': ['Properties of materials (hard/soft, rough/smooth)', 'Light and shadow', 'Sources of sound', 'Simple machines (wheel, lever, pulley)', 'Floating and sinking', 'Push and pull (forces)'],
    },
    'Basic Technology': {
      'Design Technology': ['Design process basics', 'Drawing simple objects', 'Properties of everyday materials', 'Simple structures (bridges, towers)', 'Tools and their uses', 'Safety in the workshop'],
      'ICT':               ['Parts of a computer', 'Input and output devices', 'Keyboard and mouse skills', 'Drawing with a computer', 'Introduction to the internet', 'Digital safety basics'],
      'Mechatronics':      ['What is a machine?', 'Simple wheels and axles', 'Gears — what they do', 'Levers in everyday life', 'Simple electrical circuits', 'Robots — what they are and do'],
      'Origami':           ['Folding techniques (valley fold, mountain fold)', 'Making a paper boat', 'Making a paper plane', 'Making a jumping frog', 'Geometric shapes through folding', 'Creating patterns with folds'],
      'STEAM':             ['Science in everyday life', 'Simple technology projects', 'Engineering a bridge from paper', 'Art and patterns in nature', 'Mathematics in shapes and building', 'Problem solving through making'],
    },
    'Social Studies':  { 'General': ['My family', 'My community', 'Rules and responsibilities', 'Our environment', 'Basic rights and duties', 'Transportation in Nigeria'] },
    'Civic Education': { 'General': ['Obedience', 'Honesty and truthfulness', 'Cooperation', 'Rights of a child', 'National symbols (flag, anthem, coat of arms)'] },
    'Home Economics':  { 'General': ['Personal hygiene', 'Healthy eating habits', 'Basic household chores', 'Food groups', 'Clothing and care', 'Safety in the home'] },
    'Physical Education': { 'General': ['Ball games', 'Running and jumping', 'Team play and sportsmanship', 'Basic exercises', 'Swimming safety awareness'] },
  },

  /* ── PRIMARY UPPER (4–5) ── */
  'primary-upper': {
    'English Language': {
      'Grammar':    ['Parts of speech (noun, verb, adjective, adverb, pronoun, preposition)', 'Tenses (past, present, future)', 'Subject and predicate', 'Types of sentences', 'Direct and indirect speech', 'Conjunctions and connectives', 'Punctuation (comma, apostrophe, speech marks)'],
      'Vocabulary': ['Synonyms and antonyms', 'Homonyms and homophones', 'Prefixes and suffixes', 'Word formation', 'Idioms and proverbs', 'Context clues'],
      'Spelling':   ['Common misspellings', 'Spelling rules (-ible/-able, -tion/-sion)', 'Word families', 'Commonly confused words', 'British spelling conventions'],
      'Writing ↗':  '__WRITING_LINK__',
    },
    'Mathematics': {
      'Arithmetic': ['Whole numbers (place value, rounding)', 'Addition and subtraction of large numbers', 'Long multiplication', 'Long division', 'Fractions — equivalence, addition, subtraction', 'Decimals', 'Percentages (basic)', 'Ratio and proportion', 'Word problems'],
      'Patterns':   ['Number sequences and rules', 'Square numbers and cube numbers', 'Factors and multiples', 'LCM and HCF', 'Pattern prediction'],
      'Geometry':   ['2D shapes — properties and classification', '3D shapes — faces, edges, vertices', 'Perimeter and area', 'Lines of symmetry', 'Angles — types (acute, obtuse, right)'],
      'Statistics': ['Reading bar charts and pictograms', 'Reading pie charts (simple)', 'Tally charts and frequency tables', 'Mean (average)'],
    },
    'Basic Science': {
      'Life Science':     ['Photosynthesis (simple)', 'Food chains and food webs', 'Adaptation in plants and animals', 'Reproduction in plants', 'Nutrition and balanced diet', 'Diseases — causes and prevention'],
      'Earth Science':    ['The water cycle', 'Erosion and its effects', 'Natural resources — types and conservation', 'The solar system', 'Earthquakes and volcanoes (basic)', 'Air and atmospheric layers'],
      'Physical Science': ['States of matter — solid, liquid, gas', 'Changes of state (melting, boiling, condensation)', 'Mixtures and solutions', 'Electricity — basic circuits', 'Magnetism', 'Heat transfer'],
    },
    'Basic Technology': {
      'Design Technology': ['Design process (brief, research, ideas, prototype, evaluate)', 'Technical drawing basics', 'Properties of materials (wood, metal, plastic)', 'Joining methods', 'Structures and forces', 'Workshop safety'],
      'ICT':               ['Computer hardware and software', 'Word processing skills', 'Creating simple presentations', 'Internet — searching and safety', 'Introduction to spreadsheets', 'Email basics'],
      'Mechatronics':      ['Simple machines — review (wheel, lever, pulley, inclined plane)', 'Gears and pulleys', 'Electrical components (battery, switch, bulb)', 'Building simple circuits', 'Introduction to sensors', 'How a robot works'],
      'Origami':           ['Advanced folding techniques', 'Modular origami', 'Origami animals', 'Geometric origami', 'Designing your own model', 'Connecting maths to folding'],
      'STEAM':             ['Engineering design challenges', 'Technology in our community', 'Art in science (microscopy drawings, diagrams)', 'Data collection and graphing', 'Coding basics (block-based)', 'Creative problem solving'],
    },
    'Agricultural Science': { 'General': ['Importance of agriculture', 'Farm tools and their uses', 'Types of farming', 'Crop production steps', 'Animal husbandry (poultry, livestock)', 'Soil fertility and management'] },
    'Computer Studies': {
      'ICT': ['Parts of a computer — detailed', 'Operating systems', 'File management', 'Internet safety and ethics', 'Introduction to coding (Scratch)', 'Digital citizenship'],
    },
    'Social Studies': { 'General': ['Citizenship and civic responsibilities', 'Nigeria — states and capitals', 'African countries', 'Trade and commerce', 'Human rights', 'Conflict resolution'] },
  },

  /* ── JSS ── */
  'jss': {
    'English Language': {
      'Grammar':    ['Parts of speech — full review', 'Phrases and clauses', 'Simple, compound, and complex sentences', 'Active and passive voice', 'Reported speech', 'Conditional sentences', 'Modal verbs', 'Relative clauses', 'Punctuation — advanced'],
      'Vocabulary': ['Denotation vs connotation', 'Register and formal/informal language', 'Technical vocabulary', 'Figurative language (simile, metaphor, personification)', 'Idiomatic expressions', 'Word derivation'],
      'Spelling':   ['Commonly confused words', 'Silent letters', 'Irregular plurals', 'Spelling rules — suffixes', 'Homophone pairs', 'British vs American English'],
      'Writing ↗':  '__WRITING_LINK__',
    },
    'Mathematics': {
      'Algebra':    ['Introduction to algebra', 'Like and unlike terms', 'Solving linear equations', 'Substitution', 'Expanding brackets', 'Factorisation (simple)', 'Word problems using algebra', 'Number bases'],
      'Geometry':   ['Angles on a line and at a point', 'Angles in a triangle', 'Parallel lines and transversals', 'Pythagoras theorem (introduction)', 'Construction (using ruler and compass)', 'Coordinates and the number plane', 'Transformation — reflection, translation, rotation'],
      'Statistics': ['Data collection methods', 'Frequency tables', 'Mean, median, mode', 'Range', 'Pie charts and bar charts', 'Probability (introduction)'],
      'Arithmetic': ['Integers — directed numbers', 'Fractions, decimals, percentages — operations', 'Ratio and proportion', 'Profit and loss', 'Simple interest', 'Rates (speed, distance, time)', 'Taxes and discounts'],
    },
    'Basic Science': {
      'Basic Biology':   ['The cell — structure and functions', 'Levels of organisation (cell → organ → system)', 'Nutrition in plants (photosynthesis in detail)', 'Nutrition in animals — digestive system', 'Respiration — aerobic and anaerobic', 'Reproduction — sexual and asexual', 'Genetics — introduction', 'Ecology — ecosystem and food web'],
      'Basic Physics':   ['Measurement — SI units, instruments', 'Motion — speed, velocity, acceleration', 'Forces — types, Newton\'s Laws', 'Pressure in solids, liquids, gases', 'Work, energy, and power', 'Heat — temperature vs heat, thermometers', 'Light — reflection and refraction', 'Sound — properties and transmission'],
      'Basic Chemistry': ['Matter — definition, states, properties', 'Elements, compounds, mixtures', 'Symbols and formulae (common)', 'Physical and chemical changes', 'Acids, bases, and salts — introduction', 'Water — properties and purification', 'Metals and non-metals', 'Simple chemical reactions'],
    },
    'Agricultural Science': { 'General': ['Types of agriculture', 'Farm planning', 'Crop cultivation', 'Animal production', 'Soil science', 'Fertilisers', 'Irrigation and drainage', 'Agricultural pests'] },
    'Business Studies':     { 'General': ['Introduction to business', 'Entrepreneurship', 'Business documents', 'Commerce — trade and transportation', 'Banking basics', 'Consumer rights', 'Advertising and marketing'] },
    'Home Economics':       { 'General': ['Nutrients and their functions', 'Meal planning', 'Food preparation and preservation', 'Textile — fibres and fabrics', 'Clothing construction basics', 'Family resources management'] },
    'Computer Studies': {
      'ICT': ['Programming concepts — variables, loops, conditionals', 'Scratch and Python introduction', 'Problem solving with algorithms', 'Networks and the internet', 'Cybersecurity basics', 'Digital footprint and online safety'],
    },
    'Social Studies': { 'General': ['Nigerian history — pre-colonial, colonial, post-independence', 'Government — types and levels', 'Human rights and civic responsibilities', 'Environmental issues', 'Globalisation', 'Population and development'] },
    'Civic Education': { 'General': ['Democracy and democratic values', 'Rule of law', 'Citizenship', 'National values', 'Electoral process', 'Human rights in Nigeria', 'Conflict resolution'] },
  },

  /* ── SS SCIENCE ── */
  'ss-science': {
    'English Language': {
      'Grammar':    ['Advanced syntax — clause analysis', 'Cohesion and coherence', 'Stylistics', 'Figures of speech (irony, paradox, synecdoche)', 'Register and tone', 'Error identification and correction'],
      'Vocabulary': ['WAEC vocabulary — abstract nouns', 'Academic word list', 'Technical vocabulary by subject', 'Word roots (Latin & Greek)', 'Clichés and effective alternatives'],
      'Spelling':   ['WAEC common misspellings', 'Homophones in academic writing', 'Confusable words', 'Spelling under exam conditions'],
      'Writing ↗':  '__WRITING_LINK__',
    },
    'Mathematics': {
      'Algebra':    ['Quadratic equations', 'Simultaneous equations', 'Inequalities', 'Polynomials and remainder theorem', 'Logarithms and indices', 'Sets — union, intersection, Venn diagrams', 'Sequences and series — AP and GP', 'Binomial expansion'],
      'Geometry':   ['Circle theorems', 'Loci and constructions', 'Vectors in 2D', 'Coordinate geometry', 'Mensuration — arc, sector, surface area, volume', 'Transformation — matrices'],
      'Calculus':   ['Limits and continuity', 'Differentiation — rules (product, quotient, chain)', 'Applications of differentiation — tangents, normals, max/min', 'Integration — basic rules, definite integrals', 'Applications of integration — area under a curve'],
      'Statistics': ['Frequency distributions — cumulative frequency, ogive', 'Measures of central tendency (grouped)', 'Measures of dispersion — variance, standard deviation', 'Probability — independent and mutually exclusive events', 'Permutations and combinations', 'Correlation and regression'],
    },
    'Physics':   { 'General': ['Measurements and units', 'Linear motion', 'Newton\'s Laws', 'Work, energy, power', 'Waves', 'Light — reflection, refraction, lenses', 'Electrostatics', 'Current electricity', 'Electromagnetic induction', 'Atomic and nuclear physics'] },
    'Chemistry': { 'General': ['Atomic structure and periodic table', 'Chemical bonding', 'Stoichiometry and mole concept', 'Energy changes in reactions', 'Equilibrium', 'Acids, bases, salts', 'Redox reactions and electrochemistry', 'Rates of reaction', 'Organic chemistry', 'Metals — extraction, reactivity series'] },
    'Biology':   { 'General': ['Cell biology', 'Genetics — Mendelian inheritance', 'Evolution', 'Ecology — energy flow', 'Human physiology', 'Nervous system and hormones', 'Reproduction', 'Biotechnology', 'Classification of living things', 'Diseases and immune system'] },
    'Computer Science': {
      'Data Analysis':       ['Descriptive statistics in Python/Excel', 'Data visualisation', 'Data cleaning and wrangling', 'Regression and trend analysis'],
      'Python Programming':  ['Variables, data types, input/output', 'Control structures', 'Functions', 'Lists, tuples, dictionaries', 'File handling', 'OOP — classes and objects', 'Libraries — NumPy, Pandas, Matplotlib'],
      'Web Development':     ['HTML5 — semantic elements, forms', 'CSS3 — selectors, box model, Flexbox, Grid', 'Responsive design', 'JavaScript — DOM manipulation, events', 'HTTP and how the web works'],
      'Database Management': ['Relational database concepts', 'Entity-relationship diagrams', 'SQL — SELECT, INSERT, UPDATE, DELETE', 'JOIN operations', 'Normalisation', 'NoSQL — introduction'],
    },
    'Geography': { 'General': ['Physical geography — landforms, rivers, climate', 'Nigeria — physical and human geography', 'Map reading', 'Population geography', 'Economic geography', 'Environmental problems'] },
    'Economics': { 'General': ['Demand and supply', 'Theory of the firm', 'National income accounting', 'Money and banking', 'Inflation', 'International trade', 'Development economics'] },
    'Agricultural Science': { 'General': ['Crop physiology', 'Soil chemistry and fertility', 'Pest and disease management', 'Farm mechanisation', 'Agricultural economics', 'Animal husbandry', 'Fisheries and aquaculture'] },
  },

  /* ── SS ARTS ── */
  'ss-arts': {
    'English Language': {
      'Grammar':    ['Advanced syntax', 'Cohesion and coherence', 'Figures of speech', 'Register and tone', 'Error identification'],
      'Vocabulary': ['WAEC vocabulary', 'Abstract and connotative meaning', 'Technical vocabulary', 'Idioms in context'],
      'Spelling':   ['WAEC common misspellings', 'Homophones in academic writing', 'Confusable words'],
      'Writing ↗':  '__WRITING_LINK__',
    },
    'Mathematics': {
      'Algebra':    ['Quadratic equations', 'Simultaneous equations', 'Inequalities', 'Sets — Venn diagrams', 'Sequences — AP and GP'],
      'Geometry':   ['Circle theorems', 'Mensuration', 'Loci and constructions', 'Vectors', 'Coordinate geometry'],
      'Statistics': ['Frequency distributions', 'Measures of central tendency', 'Probability', 'Permutations and combinations'],
      'Arithmetic': ['Commercial mathematics — profit, loss, interest', 'Percentage and ratio applications', 'Matrices — basic operations'],
    },
    'Literature in English': { 'General': ['Prose — plot, character, theme, setting', 'Poetry — rhyme, rhythm, figurative devices', 'Drama — structure, stagecraft', 'African literature', 'Oral literature and tradition', 'Prescribed texts analysis', 'Critical writing about literature'] },
    'Government':            { 'General': ['Political concepts — state, sovereignty, power', 'Democracy — principles and types', 'Constitutions — types and Nigerian features', 'Arms of government', 'Federalism', 'Local government', 'Electoral systems and INEC', 'Political parties', 'International organisations — AU, UN, ECOWAS', 'Nigerian foreign policy', 'Human rights'] },
    'History':               { 'General': ['Pre-colonial Nigeria', 'Trans-Atlantic slave trade', 'Colonial Nigeria — British rule, amalgamation', 'Nationalist movement', 'Independence 1960', 'Military coups and civilian rule', 'Nigerian Civil War', 'Return to democracy', 'Pan-Africanism', 'World Wars and Cold War'] },
    'Economics': { 'General': ['Demand and supply', 'National income', 'Money and banking', 'Inflation', 'International trade', 'Development economics'] },
    'Geography': { 'General': ['Physical geography', 'Human geography', 'Map reading', 'Nigeria geography', 'Environmental management'] },
  },

  /* ── SS COMMERCIAL ── */
  'ss-commercial': {
    'English Language': {
      'Grammar':    ['Advanced syntax', 'Cohesion and coherence', 'Figures of speech', 'Register and tone', 'Error identification'],
      'Vocabulary': ['Business vocabulary', 'WAEC vocabulary', 'Technical terms in commerce'],
      'Spelling':   ['Common misspellings', 'Confusable business terms'],
      'Writing ↗':  '__WRITING_LINK__',
    },
    'Mathematics': {
      'Arithmetic': ['Commercial arithmetic — profit, loss, discount, VAT', 'Simple and compound interest', 'Shares and dividends', 'Insurance and annuities', 'Currency and exchange rates'],
      'Algebra':    ['Quadratic equations', 'Simultaneous equations', 'Sets and Venn diagrams', 'Sequences and series'],
      'Statistics': ['Frequency distributions', 'Measures of central tendency', 'Probability', 'Index numbers'],
      'Geometry':   ['Mensuration — area, volume', 'Coordinate geometry', 'Vectors (basic)'],
    },
    'Commerce':             { 'General': ['Trade — home and foreign', 'Aids to trade (banking, insurance, warehousing, advertising, transport)', 'Wholesale and retail trade', 'E-commerce', 'Channels of distribution', 'Consumer protection', 'Balance of trade and payments'] },
    'Financial Accounting': { 'General': ['Accounting concepts and principles', 'Double-entry bookkeeping', 'Books of prime entry', 'Trial balance', 'Trading, profit and loss account', 'Balance sheet', 'Bank reconciliation statement', 'Control accounts', 'Incomplete records', 'Partnership accounts', 'Company accounts'] },
    'Economics':            { 'General': ['Demand and supply', 'Market structures', 'National income', 'Money and banking', 'Inflation', 'International trade', 'Development economics'] },
    'Government':           { 'General': ['Arms of government', 'Democracy', 'Nigerian government structure', 'Citizenship', 'International organisations'] },
    'Business Studies':     { 'General': ['Business formation', 'Business planning and management', 'Human resource management', 'Marketing mix — 4Ps', 'Business finance', 'Communication in business', 'Business ethics and CSR'] },
    'Marketing':            { 'General': ['Marketing concepts', 'Consumer behaviour', 'Market research', 'Marketing mix', 'Branding and packaging', 'Digital marketing', 'Distribution channels'] },
    'Computer Studies': {
      'Data Analysis':       ['Excel — pivot tables, advanced formulas', 'Data visualisation for business', 'Business intelligence tools'],
      'Python Programming':  ['Basic Python for data tasks', 'Automating spreadsheet tasks', 'Simple data analysis with Pandas'],
      'Web Development':     ['HTML/CSS basics', 'Building simple business websites', 'Online presence and e-commerce platforms'],
      'Database Management': ['Basic SQL', 'Business database design', 'Using cloud-based databases'],
    },
  },
};

/* ════════════════════════════════════════
   TICKER
════════════════════════════════════════ */
(function () {
  const items = [
    'Government', 'Biology', 'Chemistry', 'Physics', 'Economics',
    'Literature', 'History', 'Mathematics', 'Further Maths',
    'Geography', 'Commerce', 'Accounts', 'Computer Science',
    'Agricultural Science', 'English Language',
  ];
  const doubled = [...items, ...items];
  document.getElementById('ticker-track').innerHTML = doubled
    .map(i => `<span class="ticker-item">${i}<span class="ticker-dot">◆</span></span>`)
    .join('');
})();

/* ════════════════════════════════════════
   CUSTOM SELECT ENGINE
════════════════════════════════════════ */
class CSelect {
  constructor(id, { onSelect } = {}) {
    this.el    = document.getElementById(id);
    this.btn   = this.el.querySelector('.csel-btn');
    this.valEl = this.el.querySelector('.csel-placeholder');
    this.panel = this.el.querySelector('.csel-panel');
    this.cb    = onSelect;
    this.value = null;
    this._dis  = false;

    this.btn.addEventListener('click', e => {
      e.stopPropagation();
      if (!this._dis) this.toggle();
    });
    this.panel.addEventListener('click', e => {
      const item = e.target.closest('.csel-item');
      if (!item) return;
      this.pick(item.dataset.val, item.querySelector('span')?.textContent);
    });
    document.addEventListener('click', e => { if (!this.el.contains(e.target)) this.close(); });
    this.btn.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (!this._dis) this.toggle(); }
      if (e.key === 'Escape') this.close();
    });
  }
  toggle() {
    document.querySelectorAll('.csel.open').forEach(el => { if (el !== this.el) el.classList.remove('open'); });
    const o = !this.el.classList.contains('open');
    this.el.classList.toggle('open', o);
    this.btn.setAttribute('aria-expanded', o);
  }
  close() { this.el.classList.remove('open'); this.btn.setAttribute('aria-expanded', 'false'); }
  pick(val, label) {
    this.value = val;
    this.valEl.textContent = label || val;
    this.btn.classList.add('has-val');
    this.panel.querySelectorAll('.csel-item').forEach(i => i.classList.toggle('selected', i.dataset.val === val));
    this.close();
    if (this.cb) this.cb(val, label || val);
  }
  reset(placeholder) {
    this.value = null;
    this.valEl.textContent = placeholder || '— Select —';
    this.btn.classList.remove('has-val');
    this.panel.querySelectorAll('.csel-item').forEach(i => i.classList.remove('selected'));
  }
  setItems(groups) {
    let html = '';
    for (const g of groups) {
      if (g.label) html += `<div class="csel-group">${g.label}</div>`;
      for (const item of (g.items || [g])) {
        html += `<div class="csel-item" data-val="${item.val}"><span>${item.label}</span></div>`;
      }
    }
    this.panel.innerHTML = html;
  }
  enable()  { this._dis = false; this.btn.disabled = false; this.el.classList.remove('csel--dis'); }
  disable() { this._dis = true;  this.btn.disabled = true;  this.close(); }
}

/* ════════════════════════════════════════
   STATE
════════════════════════════════════════ */
const st = { name: '', cls: '', level: '', subjectKey: '', track: '', subject: '', count: 1 };
let submissionDate = '';

/* ════════════════════════════════════════
   NAME INPUT
════════════════════════════════════════ */
document.getElementById('name-input').addEventListener('input', function () {
  st.name = this.value.trim();
  document.getElementById('done-name').classList.toggle('show', !!st.name);
  checkReady();
});

/* ════════════════════════════════════════
   CLASS SELECT
════════════════════════════════════════ */
const clsSel = new CSelect('csel-class', {
  onSelect(val) {
    const [label, level] = val.split('|');
    st.cls   = label;
    st.level = level;
    st.track = '';
    st.subject = '';

    document.getElementById('done-class').classList.add('show');
    document.getElementById('class-sub').textContent = `Selected: ${label}`;

    const isss = level === 'ss';
    document.getElementById('track-row').classList.toggle('show', isss);

    if (isss) {
      trackSel.reset('— Choose track —');
      subjectSel.reset('— Select track first —');
      subjectSel.disable();
      document.getElementById('subject-sub').textContent = 'Choose your SS track first';
    } else {
      document.getElementById('track-row').classList.remove('show');
      st.subjectKey = level;
      populateSubjects(level);
    }

    selectedTopics = [];
    document.getElementById('topic-picker-row').style.display   = 'none';
    document.getElementById('question-panel-row').style.display = 'none';
    document.getElementById('done-subject').classList.remove('show');
    rebuildSlots();
    checkReady();
  }
});

clsSel.setItems([
  { label: 'Primary (Lower)',  items: [{ val: 'Primary 1|primary-lower', label: 'Primary 1' }, { val: 'Primary 2|primary-lower', label: 'Primary 2' }, { val: 'Primary 3|primary-lower', label: 'Primary 3' }] },
  { label: 'Primary (Upper)',  items: [{ val: 'Primary 4|primary-upper', label: 'Primary 4' }, { val: 'Primary 5|primary-upper', label: 'Primary 5' }, { val: 'Primary 6|primary-upper', label: 'Primary 6' }] },
  { label: 'Junior Secondary', items: [{ val: 'JSS 1|jss', label: 'JSS 1' }, { val: 'JSS 2|jss', label: 'JSS 2' }, { val: 'JSS 3|jss', label: 'JSS 3' }] },
  { label: 'Senior Secondary', items: [{ val: 'SS 1|ss', label: 'SS 1' }, { val: 'SS 2|ss', label: 'SS 2' }, { val: 'SS 3|ss', label: 'SS 3' }] },
]);

/* ════════════════════════════════════════
   TRACK SELECT (SS only)
════════════════════════════════════════ */
const trackSel = new CSelect('csel-track', {
  onSelect(val) {
    st.track = val;
    st.subjectKey = `ss-${val}`;
    populateSubjects(`ss-${val}`);
    selectedTopics = [];
    document.getElementById('topic-picker-row').style.display   = 'none';
    document.getElementById('question-panel-row').style.display = 'none';
    checkReady();
  }
});

/* ════════════════════════════════════════
   SUBJECT SELECT
════════════════════════════════════════ */
const subjectSel = new CSelect('csel-subject', {
  onSelect(val) {
    st.subject = val;
    document.getElementById('done-subject').classList.add('show');

    selectedTopics = [];
    document.getElementById('question-panel-row').style.display = 'none';
    buildTopicPicker(st.subjectKey, val);
    checkReady();
  }
});
subjectSel.disable();

function populateSubjects(key) {
  const list = SUBJECTS[key] || [];
  if (!list.length) { subjectSel.disable(); return; }
  subjectSel.setItems(list.map(s => ({ val: s, label: s })));
  subjectSel.reset('— Choose subject —');
  st.subject = '';
  document.getElementById('done-subject').classList.remove('show');
  subjectSel.enable();
  document.getElementById('subject-sub').textContent = `${list.length} subjects available`;
}

/* ════════════════════════════════════════
   TOPIC PICKER
════════════════════════════════════════ */
const MAX_TOPICS = 5;
let selectedTopics = [];

function getTopicKey(subTopic, topic) { return `${subTopic}::${topic}`; }

function buildTopicPicker(classKey, subject) {
  const pickerRow = document.getElementById('topic-picker-row');
  const groupsEl  = document.getElementById('topic-groups');
  const subEl     = document.getElementById('topic-picker-sub');

  selectedTopics = [];
  groupsEl.innerHTML = '';

  const classData   = CURRICULUM[classKey];
  if (!classData) { pickerRow.style.display = 'none'; return; }
  const subjectData = classData[subject];
  if (!subjectData) { pickerRow.style.display = 'none'; return; }

  const subTopics = Object.keys(subjectData);
  subTopics.forEach(subTopic => {
    const items = subjectData[subTopic];
    const grpEl = document.createElement('div');
    grpEl.className = 'topic-group';

    if (items === '__WRITING_LINK__') {
      grpEl.innerHTML = `
        <div class="topic-group-label writing-link-lbl">Writing Practice</div>
        <div class="topic-chips">
          <a class="topic-chip writing-link" href="/writing" target="_blank">
            <span>✍ Open Writing Practice Page ↗</span>
          </a>
        </div>`;
      groupsEl.appendChild(grpEl);
      return;
    }

    grpEl.innerHTML = `<div class="topic-group-label">${subTopic}</div><div class="topic-chips" data-subtopic="${subTopic}"></div>`;
    const chipsEl = grpEl.querySelector('.topic-chips');

    items.forEach(topic => {
      const key  = getTopicKey(subTopic, topic);
      const chip = document.createElement('div');
      chip.className   = 'topic-chip';
      chip.dataset.key = key;
      chip.innerHTML   = `<div class="topic-chip-check"></div><span>${topic}</span>`;

      chip.addEventListener('click', () => {
        if (chip.classList.contains('disabled-max')) return;
        const idx = selectedTopics.indexOf(key);
        if (idx >= 0) {
          selectedTopics.splice(idx, 1);
          chip.classList.remove('checked');
        } else {
          if (selectedTopics.length >= MAX_TOPICS) return;
          selectedTopics.push(key);
          chip.classList.add('checked');
        }
        updateTopicUI();
        updateQcountTiles();
        checkReady();
      });
      chipsEl.appendChild(chip);
    });
    groupsEl.appendChild(grpEl);
  });

  updateTopicUI();
  pickerRow.style.display = '';
  subEl.textContent = `${subject} — ${subTopics.filter(s => subjectData[s] !== '__WRITING_LINK__').length} sub-topics available`;
}

function updateTopicUI() {
  const count = selectedTopics.length;
  document.getElementById('topic-count').textContent = count;
  const badge = document.getElementById('topic-count-badge');
  badge.style.borderColor = count === MAX_TOPICS ? 'var(--red)' : '';

  document.querySelectorAll('.topic-chip').forEach(chip => {
    const checked = selectedTopics.includes(chip.dataset.key);
    chip.classList.toggle('checked', checked);
    chip.classList.toggle('disabled-max', !checked && count >= MAX_TOPICS);
  });

  const hint = document.getElementById('topic-footer-hint');
  if (count === 0)             hint.textContent = 'Select topics or skip to cover the full subject';
  else if (count < MAX_TOPICS) hint.textContent = `${count} topic${count > 1 ? 's' : ''} selected — ${MAX_TOPICS - count} more allowed`;
  else                         hint.textContent = `Maximum ${MAX_TOPICS} topics reached`;
}

document.getElementById('topic-clear-btn').addEventListener('click', () => {
  selectedTopics = [];
  updateTopicUI();
  updateQcountTiles();
  checkReady();
});

function getSelectedTopicLabels() {
  return selectedTopics.map(key => {
    const [sub, top] = key.split('::');
    return `${sub}: ${top}`;
  });
}

/* ── Skip topics / proceed to questions ── */
document.getElementById('proceed-to-questions-btn').addEventListener('click', () => {
  showQuestionPanel();
});

document.getElementById('skip-topics-btn').addEventListener('click', () => {
  selectedTopics = [];
  updateTopicUI();
  showQuestionPanel();
});

function showQuestionPanel() {
  const qPanel = document.getElementById('question-panel-row');
  qPanel.style.display = '';
  qPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  updateQcountTiles();
  rebuildSlots();
  checkReady();
}

/* ════════════════════════════════════════
   QUESTION COUNT TILES
════════════════════════════════════════ */
document.getElementById('qcount-row').addEventListener('click', e => {
  const tile = e.target.closest('.qcount-tile');
  if (!tile || tile.classList.contains('tile-disabled')) return;
  document.querySelectorAll('.qcount-tile').forEach(t => t.classList.remove('active'));
  tile.classList.add('active');
  st.count = parseInt(tile.dataset.n);
  document.getElementById('done-count').classList.add('show');
  rebuildSlots();
  checkReady();
});

function updateQcountTiles() {
  const minCount = selectedTopics.length || 1;
  if (st.count < minCount) st.count = minCount;
  document.querySelectorAll('.qcount-tile').forEach(tile => {
    const n        = parseInt(tile.dataset.n);
    const disabled = n < minCount;
    tile.classList.toggle('tile-disabled', disabled);
    tile.style.opacity      = disabled ? '0.3' : '';
    tile.style.cursor       = disabled ? 'not-allowed' : '';
    tile.style.pointerEvents = disabled ? 'none' : '';
    if (n === st.count) tile.classList.add('active');
    else if (!disabled) tile.classList.remove('active');
  });
  const activeTile = document.querySelector(`.qcount-tile[data-n="${st.count}"]`);
  if (activeTile) {
    document.querySelectorAll('.qcount-tile').forEach(t => t.classList.remove('active'));
    activeTile.classList.add('active');
  }
}

/* ════════════════════════════════════════
   QUESTION SLOTS
════════════════════════════════════════ */
function rebuildSlots() {
  const n         = st.count;
  const container = document.getElementById('slots-container');
  const agBtn     = document.getElementById('autogen-all-btn');

  const existing = [];
  container.querySelectorAll('.q-slot').forEach((slot, i) => {
    existing[i] = {
      text      : slot.querySelector('.q-slot-ta')?.value || '',
      marks     : slot.querySelector('.marks-input')?.value || '',
      compulsory: slot.querySelector('input[type=checkbox]')?.checked ?? (i === 0),
    };
  });

  container.innerHTML = '';
  for (let i = 0; i < n; i++) {
    container.appendChild(buildSlot(i, existing[i] || { text: '', marks: '', compulsory: i === 0 }));
  }

  agBtn.disabled = !(st.cls && st.subject);
  checkReady();
}

function buildSlot(i, { text = '', marks = '', compulsory = false } = {}) {
  const div     = document.createElement('div');
  div.className = 'q-slot';
  div.dataset.idx = i;

  div.innerHTML = `
    <div class="q-slot-hd">
      <div class="q-slot-num">${i + 1}</div>
      <label class="compulsory-label">
        <input type="checkbox" ${compulsory ? 'checked' : ''}>
        <div class="compulsory-star">★</div>
        <span class="compulsory-text">Compulsory</span>
      </label>
      <button class="q-autogen-btn" type="button" data-idx="${i}" ${!(st.cls && st.subject) ? 'disabled' : ''}>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
        Auto-gen
      </button>
    </div>
    <div class="q-slot-body">
      <textarea class="q-slot-ta" placeholder="Type the question here, or click Auto-gen…" rows="2">${text}</textarea>
    </div>
    <div class="q-slot-ft">
      <div class="marks-wrap">
        <span class="marks-label">Marks:</span>
        <input class="marks-input" type="number" min="1" max="10"
          value="${marks}" placeholder="Auto" title="Leave blank to auto-award (max 10)">
        <span class="marks-max">/ 10 max</span>
      </div>
      <span class="marks-hint">Leave blank — AI awards based on question type</span>
    </div>`;

  const slotTa = div.querySelector('.q-slot-ta');
  slotTa.addEventListener('input', () => { autoResize(slotTa); checkReady(); });
  requestAnimationFrame(() => autoResize(slotTa));
  div.querySelector('.marks-input').addEventListener('input', checkReady);
  div.querySelector('input[type=checkbox]').addEventListener('change', checkReady);
  div.querySelector('.q-autogen-btn').addEventListener('click', () => autoGenOne(i));

  return div;
}

/* ── Auto-gen all ── */
document.getElementById('autogen-all-btn').addEventListener('click', async () => {
  if (!st.cls || !st.subject) return;
  const btn = document.getElementById('autogen-all-btn');
  btn.disabled  = true;
  btn.innerHTML = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/></svg> Generating…`;

  TheoryAnalyser.init({
    geminiKey: GEMINI_KEY,
    subject  : st.subject,
    level    : st.cls + (st.track ? ` (${st.track})` : ''),
    topics   : getSelectedTopicLabels(),
    mountId  : 'theory-results',
  });

  try {
    const questions = await TheoryAnalyser.generateQuestions(st.count);
    questions.forEach((q, i) => {
      const slot = document.querySelector(`.q-slot[data-idx="${i}"]`);
      if (!slot) return;
      const ta = slot.querySelector('.q-slot-ta');
      const mi = slot.querySelector('.marks-input');
      ta.value = q.text || '';
      ta.classList.add('autofilled');
      autoResize(ta);
      if (q.suggestedMarks) mi.value = q.suggestedMarks;
    });
    checkReady();
  } catch (err) {
    alert('Auto-generate failed: ' + err.message);
  }

  btn.disabled  = false;
  btn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> Auto-generate All`;
});

/* ── Auto-gen one slot ── */
async function autoGenOne(idx) {
  if (!st.cls || !st.subject) return;
  const slot = document.querySelector(`.q-slot[data-idx="${idx}"]`);
  if (!slot) return;
  const btn = slot.querySelector('.q-autogen-btn');
  btn.disabled    = true;
  btn.classList.add('loading');
  btn.textContent = '⚡ Generating…';

  const existing = [];
  document.querySelectorAll('.q-slot-ta').forEach(ta => {
    if (ta.value.trim()) existing.push(ta.value.trim().slice(0, 80));
  });

  TheoryAnalyser.init({
    geminiKey: GEMINI_KEY,
    subject  : st.subject,
    level    : st.cls + (st.track ? ` (${st.track})` : ''),
    topics   : getSelectedTopicLabels(),
    mountId  : 'theory-results',
  });

  try {
    const [q] = await TheoryAnalyser.generateQuestions(1, existing);
    if (q) {
      const ta = slot.querySelector('.q-slot-ta');
      const mi = slot.querySelector('.marks-input');
      ta.value = q.text || '';
      ta.classList.add('autofilled');
      autoResize(ta);
      if (q.suggestedMarks) mi.value = q.suggestedMarks;
      checkReady();
    }
  } catch (err) {
    alert('Auto-gen failed: ' + err.message);
  }

  btn.disabled    = false;
  btn.classList.remove('loading');
  btn.innerHTML   = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> Auto-gen`;
}

/* ════════════════════════════════════════
   GET SLOT DATA
════════════════════════════════════════ */
function getSlotData() {
  const slots = [];
  document.querySelectorAll('.q-slot').forEach(slot => {
    slots.push({
      text      : slot.querySelector('.q-slot-ta').value.trim(),
      marks     : parseInt(slot.querySelector('.marks-input').value) || null,
      compulsory: slot.querySelector('input[type=checkbox]').checked,
    });
  });
  return slots;
}

/* ════════════════════════════════════════
   VALIDATION
════════════════════════════════════════ */
function checkReady() {
  const qPanelVisible = document.getElementById('question-panel-row').style.display !== 'none';
  const slots         = qPanelVisible ? getSlotData() : [];
  const needsTrack    = st.level === 'ss' && !st.track;
  const allQsFilled   = qPanelVisible && slots.length > 0 && slots.every(s => s.text.length >= 6);
  const ok            = KEY_VERIFIED && st.name && st.cls && st.subject && !needsTrack && allQsFilled;

  document.getElementById('begin-btn').disabled = !ok;

  const s = document.getElementById('setup-status');
  if (!KEY_VERIFIED)   { s.textContent = 'Paste and verify your Gemini API key to continue'; s.className = 'setup-status'; }
  else if (!st.name)   { s.textContent = 'Enter your name to continue';                       s.className = 'setup-status'; }
  else if (!st.cls)    { s.textContent = 'Select your class';                                 s.className = 'setup-status'; }
  else if (needsTrack) { s.textContent = 'Select your SS track (Science / Arts / Commercial)'; s.className = 'setup-status'; }
  else if (!st.subject){ s.textContent = 'Choose a subject';                                  s.className = 'setup-status'; }
  else if (!qPanelVisible) { s.textContent = 'Select topics or skip, then proceed to questions'; s.className = 'setup-status'; }
  else if (!allQsFilled)   { s.textContent = `Enter or auto-gen all ${st.count} question(s)`;   s.className = 'setup-status'; }
  else                     { s.textContent = '✓ Ready — click Begin Practice';                  s.className = 'setup-status ready'; }
}

/* ════════════════════════════════════════
   OPEN MODAL
════════════════════════════════════════ */
function openModal() {
  const slots      = getSlotData();
  const trackLabel = st.track ? ` · ${st.track.charAt(0).toUpperCase() + st.track.slice(1)}` : '';
  const levelForAI = st.cls + (st.track ? ` (${st.track})` : '');

  document.getElementById('mhdr-sub').textContent  = st.subject;
  document.getElementById('mhdr-cls').textContent  = st.cls + trackLabel;
  document.getElementById('mhdr-name').textContent = st.name;

  const today    = new Date();
  submissionDate = today.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });

  const paper = document.getElementById('exam-paper');
  let html = `
    <div class="paper-hdr">
      <div class="paper-info">
        <span class="paper-field">Name:<span class="paper-field-val">${st.name}</span></span>
        <span class="paper-field">Subject:<span class="paper-field-val">${st.subject}</span></span>
        <span class="paper-field">Class:<span class="paper-field-val">${st.cls}${trackLabel}</span></span>
        <span class="paper-field">Date:<span class="paper-field-val">${submissionDate}</span></span>
      </div>
    </div>`;

  slots.forEach((q, i) => {
    html += `
      <div class="paper-q-block" data-qidx="${i}">
        <div class="paper-q-label">
          <span class="paper-q-num">Question ${i + 1}</span>
          ${q.compulsory
            ? `<span class="paper-q-compulsory">★ Compulsory</span>`
            : `<span style="font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.08em;color:var(--muted)">Optional</span>`}
          ${q.marks ? `<span style="margin-left:auto;font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.08em;color:var(--muted)">${q.marks} marks</span>` : ''}
        </div>
        <div class="paper-q-text">${q.text}</div>
        <div class="paper-q-prompt">Answer:</div>
        <textarea class="paper-ta" data-qidx="${i}" rows="6"
          placeholder="Write your answer here…"
          spellcheck="true"></textarea>
        <div class="paper-video-row" id="video-row-${i}">
          <button class="paper-video-btn" data-qidx="${i}" data-qtext="${q.text.replace(/"/g, '&quot;')}" type="button">
            ▶ Watch Video
          </button>
        </div>
      </div>`;
  });

  paper.innerHTML = html;
  paper.querySelectorAll('.paper-ta').forEach(ta => ta.addEventListener('input', updateWC));
  paper.querySelectorAll('.paper-video-btn').forEach(btn => {
    btn.addEventListener('click', () => handleVideoBtn(btn));
  });

  updateWC();
  showPhase('write');

  TheoryAnalyser.init({
    geminiKey: GEMINI_KEY,
    subject  : st.subject,
    level    : levelForAI,
    topics   : getSelectedTopicLabels(),
    mountId  : 'theory-results',
  });

  const modal = document.getElementById('modal');
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  setTimeout(() => paper.querySelector('.paper-ta')?.focus(), 260);
}

document.getElementById('begin-btn').addEventListener('click', openModal);

/* ════════════════════════════════════════
   MODAL CLOSE
════════════════════════════════════════ */
function closeModal() {
  document.getElementById('modal').classList.remove('open');
  document.getElementById('modal').setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}
document.getElementById('modal-close').addEventListener('click', closeModal);
document.getElementById('cancel-btn').addEventListener('click', closeModal);
document.getElementById('new-q-btn').addEventListener('click', closeModal);
document.getElementById('modal').addEventListener('click', function (e) {
  if (e.target === this && document.getElementById('phase-write').style.display !== 'none') closeModal();
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

/* ════════════════════════════════════════
   PHASE SWITCHER
════════════════════════════════════════ */
function showPhase(phase) {
  const pw = document.getElementById('phase-write');
  const pr = document.getElementById('phase-results');
  const fw = document.getElementById('ftr-write');
  const fr = document.getElementById('ftr-results');

  if (phase === 'write') {
    pw.style.display = 'block'; pr.style.display = 'none';
    fw.style.display = 'flex';  fr.style.display = 'none';
    document.getElementById('mhdr-phase').textContent = 'Write';
    document.getElementById('theory-results').innerHTML = '';
  } else {
    pw.style.display = 'none';  pr.style.display = 'block';
    fw.style.display = 'none';  fr.style.display = 'flex';
    document.getElementById('mhdr-phase').textContent = 'Results';
    document.getElementById('modal-body').scrollTo({ top: 0, behavior: 'smooth' });
  }
}

/* ════════════════════════════════════════
   WORD COUNT
════════════════════════════════════════ */
function updateWC() {
  const all = document.getElementById('exam-paper').querySelectorAll('.paper-ta');
  let total = 0;
  all.forEach(ta => { if (ta.value.trim()) total += ta.value.trim().split(/\s+/).length; });
  document.getElementById('wc').textContent = total;

  const slots          = getSlotData();
  const compulsory     = slots.filter(s => s.compulsory);
  const compulsoryDone = compulsory.every((_, i) => {
    const ci = slots.indexOf(compulsory[i]);
    const ta = document.querySelector(`.paper-ta[data-qidx="${ci}"]`);
    return ta && ta.value.trim().length > 3;
  });
  document.getElementById('submit-btn').disabled = !(total >= 5 && (compulsory.length === 0 || compulsoryDone));
}

/* ════════════════════════════════════════
   SUBMIT
════════════════════════════════════════ */
document.getElementById('submit-btn').addEventListener('click', async function () {
  const answers = [];
  document.querySelectorAll('.paper-ta').forEach((ta, i) => { answers[i] = ta.value; });
  this.disabled    = true;
  this.textContent = 'Marking…';
  showPhase('results');
  await TheoryAnalyser.analyseAll(getSlotData(), answers, st.name, submissionDate);
  this.disabled    = false;
  this.textContent = 'Submit for Marking';
});

/* ════════════════════════════════════════
   TRY AGAIN
════════════════════════════════════════ */
document.getElementById('try-again-btn').addEventListener('click', () => {
  showPhase('write');
  document.querySelectorAll('.paper-ta').forEach(ta => ta.value = '');
  updateWC();
  setTimeout(() => document.querySelector('.paper-ta')?.focus(), 80);
});

/* ════════════════════════════════════════
   PRINT
════════════════════════════════════════ */
document.getElementById('print-btn').addEventListener('click', () => {
  const paper = document.querySelector('#theory-results .ta-paper');
  if (paper) document.getElementById('print-sheet').innerHTML = `<div class="ta-root">${paper.outerHTML}</div>`;
  window.print();
});

/* ════════════════════════════════════════
   VIDEO / RESOURCE GENERATION
════════════════════════════════════════ */

/* Cache so repeated clicks don't re-fetch */
const _videoCache = {};

/* Fallback model chain — all v1beta to avoid 400s */
const _VIDEO_MODELS = [
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent',
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent',
];

function _isMathSubject(subject) {
  return /math|maths|further math/i.test(subject);
}

async function _fetchVideoResources(questionText, subject, level) {
  const cacheKey = `${level}::${subject}::${questionText.slice(0, 80)}`;
  if (_videoCache[cacheKey]) return _videoCache[cacheKey];

  const isMath    = _isMathSubject(subject);
  const mathExtra = isMath ? `
INTERACTIVE TOOLS (for Mathematics):
Return up to 3 interactive practice resources appropriate for ${level}.
Prefer these sources in order: Khan Academy (khanacademy.org), GeoGebra (geogebra.org),
Desmos (desmos.com), Mathway (mathway.com), Brilliant (brilliant.org), CK-12 (ck12.org).
For each tool, provide a deep-link if the topic maps to a known URL pattern, otherwise
provide the homepage URL. Also suggest 1 physical manipulative activity (no URL needed).
` : '';

  const prompt = `You are an educational resource curator for Nigerian school students.

STUDENT LEVEL: ${level}
SUBJECT: ${subject}
QUESTION TOPIC: ${questionText}

TASK:
1. Identify the core topic(s) covered by this question.
2. Find the BEST 2 YouTube educational videos for this topic at ${level} level.
   - Prefer Nigerian or African content when available and high quality.
   - Otherwise prefer: Khan Academy, CrashCourse, TED-Ed, BBC Bitesize, 3Blue1Brown (for maths), Kurzgesagt.
   - Generate a YouTube search URL like: https://www.youtube.com/results?search_query=...
     Use specific, targeted search terms (e.g. "photosynthesis explained JSS Nigeria" not just "photosynthesis").
   - If you know a specific high-quality video exists on a channel, you may use its direct URL.
${mathExtra}
RESPOND ONLY WITH VALID JSON — no markdown fences, no preamble:
{
  "topicLabel": "<short topic name, e.g. 'Photosynthesis' or 'Quadratic Equations'>",
  "videos": [
    {
      "title"      : "<descriptive title of what this video covers>",
      "channel"    : "<channel name>",
      "url"        : "<YouTube search URL or direct video URL>",
      "why"        : "<one sentence: why this video suits ${level} learners>"
    }
  ],
  "interactive": ${isMath ? `[
    {
      "name"       : "<tool name>",
      "url"        : "<direct URL>",
      "type"       : "practice|manipulative|visualiser|game",
      "description": "<one sentence on how it helps with this topic>"
    }
  ]` : 'null'},
  "manipulative": ${isMath ? `"<one sentence describing a physical hands-on activity that reinforces this topic without a screen>"` : 'null'}
}`;

  const body = {
    systemInstruction: { parts: [{ text: prompt }] },
    contents: [{ parts: [{ text: `Find resources for: ${questionText}` }] }],
    generationConfig : { responseMimeType: 'application/json', temperature: 0.2, maxOutputTokens: 800 },
  };

  let lastErr;
  for (const modelUrl of _VIDEO_MODELS) {
    try {
      const res = await fetch(`${modelUrl}?key=${encodeURIComponent(GEMINI_KEY)}`, {
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify(body),
      });

      if (res.status === 429 || res.status === 503) {
        lastErr = new Error(`Quota on ${modelUrl.split('/models/')[1].split(':')[0]}`);
        continue;
      }
      if (!res.ok) {
        const msg = await res.text().catch(() => '');
        lastErr = new Error(`HTTP ${res.status}: ${msg}`);
        continue;
      }

      const raw  = await res.json();
      const text = raw.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const s = text.indexOf('{'), e = text.lastIndexOf('}');
      if (s < 0 || e < 0) throw new Error('No JSON in response');
      const data = JSON.parse(text.slice(s, e + 1));
      _videoCache[cacheKey] = data;
      return data;

    } catch (err) {
      lastErr = err;
      // network / parse error — try next model
    }
  }

  throw lastErr || new Error('All models failed for video resources');
}

/* Render the resource panel into the video row */
function _renderVideoPanel(row, data, isMath) {
  const esc = s => String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

  const videoCards = (data.videos || []).map(v => `
    <a class="pvr-video-card" href="${esc(v.url)}" target="_blank" rel="noopener noreferrer">
      <div class="pvr-video-icon">▶</div>
      <div class="pvr-video-info">
        <div class="pvr-video-title">${esc(v.title)}</div>
        <div class="pvr-video-meta">${esc(v.channel)} &nbsp;·&nbsp; ${esc(v.why)}</div>
      </div>
      <div class="pvr-ext-icon">↗</div>
    </a>`).join('');

  let interactiveCards = '';
  if (isMath && Array.isArray(data.interactive) && data.interactive.length) {
    interactiveCards = `
      <div class="pvr-section-label">Interactive Practice &amp; Manipulatives</div>
      ${data.interactive.map(r => `
        <a class="pvr-tool-card" href="${esc(r.url)}" target="_blank" rel="noopener noreferrer">
          <div class="pvr-tool-type pvr-type-${esc(r.type)}">${esc(r.type)}</div>
          <div class="pvr-tool-info">
            <div class="pvr-tool-name">${esc(r.name)}</div>
            <div class="pvr-tool-desc">${esc(r.description)}</div>
          </div>
          <div class="pvr-ext-icon">↗</div>
        </a>`).join('')}
      ${data.manipulative ? `
        <div class="pvr-manipulative">
          <div class="pvr-manip-icon">✋</div>
          <div class="pvr-manip-text"><strong>Hands-on activity:</strong> ${esc(data.manipulative)}</div>
        </div>` : ''}`;
  }

  row.innerHTML = `
    <div class="pvr-panel">
      <div class="pvr-header">
        <span class="pvr-topic">${esc(data.topicLabel || 'Resources')}</span>
        <button class="pvr-close-btn" type="button">✕</button>
      </div>
      <div class="pvr-section-label">Videos</div>
      ${videoCards}
      ${interactiveCards}
    </div>`;

  row.querySelector('.pvr-close-btn').addEventListener('click', () => {
    row.innerHTML = `<button class="paper-video-btn" type="button" data-restored="1">▶ Watch Video</button>`;
    row.querySelector('.paper-video-btn').addEventListener('click', () => handleVideoBtn(row.querySelector('.paper-video-btn')));
  });
}

/* Main click handler */
async function handleVideoBtn(btn) {
  const row = btn.closest('.paper-video-row');
  if (!row) return;
  const qTextEl      = row.closest('.paper-q-block')?.querySelector('.paper-q-text');
  const questionText = qTextEl?.textContent?.trim() || btn.dataset.qtext || '';
  const isMath       = _isMathSubject(st.subject);

  row.innerHTML = `<div class="pvr-loading"><span class="pvr-spinner"></span>Finding resources…</div>`;

  try {
    const data = await _fetchVideoResources(questionText, st.subject, st.cls);
    _renderVideoPanel(row, data, isMath);
  } catch (err) {
    row.innerHTML = `
      <div class="pvr-error">
        Could not load resources — ${err.message}.
        <button class="paper-video-btn pvr-retry-btn" type="button">Retry</button>
      </div>`;
    row.querySelector('.pvr-retry-btn').addEventListener('click', () => {
      row.innerHTML = `<button class="paper-video-btn" type="button">▶ Watch Video</button>`;
      const newBtn = row.querySelector('.paper-video-btn');
      if (questionText) newBtn.dataset.qtext = questionText;
      newBtn.addEventListener('click', () => handleVideoBtn(newBtn));
      handleVideoBtn(newBtn);
    });
  }
}

/* ════════════════════════════════════════
   INIT
════════════════════════════════════════ */
rebuildSlots();
checkReady();
