/* ════════════════════════════════════════
   curriculum-data.js
   Pure data — no DOM, no side-effects.
════════════════════════════════════════ */

export const SUBJECTS = {
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

export const CURRICULUM = {
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
    'Social Studies':     { 'General': ['My family', 'My community', 'Rules and responsibilities', 'Our environment', 'Basic rights and duties', 'Transportation in Nigeria'] },
    'Civic Education':    { 'General': ['Obedience', 'Honesty and truthfulness', 'Cooperation', 'Rights of a child', 'National symbols (flag, anthem, coat of arms)'] },
    'Home Economics':     { 'General': ['Personal hygiene', 'Healthy eating habits', 'Basic household chores', 'Food groups', 'Clothing and care', 'Safety in the home'] },
    'Physical Education': { 'General': ['Ball games', 'Running and jumping', 'Team play and sportsmanship', 'Basic exercises', 'Swimming safety awareness'] },
  },

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
    'Computer Studies':     { 'ICT': ['Parts of a computer — detailed', 'Operating systems', 'File management', 'Internet safety and ethics', 'Introduction to coding (Scratch)', 'Digital citizenship'] },
    'Social Studies':       { 'General': ['Citizenship and civic responsibilities', 'Nigeria — states and capitals', 'African countries', 'Trade and commerce', 'Human rights', 'Conflict resolution'] },
  },

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
      'Basic Physics':   ['Measurement — SI units, instruments', 'Motion — speed, velocity, acceleration', "Forces — types, Newton's Laws", 'Pressure in solids, liquids, gases', 'Work, energy, and power', 'Heat — temperature vs heat, thermometers', 'Light — reflection and refraction', 'Sound — properties and transmission'],
      'Basic Chemistry': ['Matter — definition, states, properties', 'Elements, compounds, mixtures', 'Symbols and formulae (common)', 'Physical and chemical changes', 'Acids, bases, and salts — introduction', 'Water — properties and purification', 'Metals and non-metals', 'Simple chemical reactions'],
    },
    'Agricultural Science': { 'General': ['Types of agriculture', 'Farm planning', 'Crop cultivation', 'Animal production', 'Soil science', 'Fertilisers', 'Irrigation and drainage', 'Agricultural pests'] },
    'Business Studies':     { 'General': ['Introduction to business', 'Entrepreneurship', 'Business documents', 'Commerce — trade and transportation', 'Banking basics', 'Consumer rights', 'Advertising and marketing'] },
    'Home Economics':       { 'General': ['Nutrients and their functions', 'Meal planning', 'Food preparation and preservation', 'Textile — fibres and fabrics', 'Clothing construction basics', 'Family resources management'] },
    'Computer Studies':     { 'ICT': ['Programming concepts — variables, loops, conditionals', 'Scratch and Python introduction', 'Problem solving with algorithms', 'Networks and the internet', 'Cybersecurity basics', 'Digital footprint and online safety'] },
    'Social Studies':       { 'General': ['Nigerian history — pre-colonial, colonial, post-independence', 'Government — types and levels', 'Human rights and civic responsibilities', 'Environmental issues', 'Globalisation', 'Population and development'] },
    'Civic Education':      { 'General': ['Democracy and democratic values', 'Rule of law', 'Citizenship', 'National values', 'Electoral process', 'Human rights in Nigeria', 'Conflict resolution'] },
  },

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
    'Physics':   { 'General': ['Measurements and units', 'Linear motion', "Newton's Laws", 'Work, energy, power', 'Waves', 'Light — reflection, refraction, lenses', 'Electrostatics', 'Current electricity', 'Electromagnetic induction', 'Atomic and nuclear physics'] },
    'Chemistry': { 'General': ['Atomic structure and periodic table', 'Chemical bonding', 'Stoichiometry and mole concept', 'Energy changes in reactions', 'Equilibrium', 'Acids, bases, salts', 'Redox reactions and electrochemistry', 'Rates of reaction', 'Organic chemistry', 'Metals — extraction, reactivity series'] },
    'Biology':   { 'General': ['Cell biology', 'Genetics — Mendelian inheritance', 'Evolution', 'Ecology — energy flow', 'Human physiology', 'Nervous system and hormones', 'Reproduction', 'Biotechnology', 'Classification of living things', 'Diseases and immune system'] },
    'Computer Science': {
      'Data Analysis':       ['Descriptive statistics in Python/Excel', 'Data visualisation', 'Data cleaning and wrangling', 'Regression and trend analysis'],
      'Python Programming':  ['Variables, data types, input/output', 'Control structures', 'Functions', 'Lists, tuples, dictionaries', 'File handling', 'OOP — classes and objects', 'Libraries — NumPy, Pandas, Matplotlib'],
      'Web Development':     ['HTML5 — semantic elements, forms', 'CSS3 — selectors, box model, Flexbox, Grid', 'Responsive design', 'JavaScript — DOM manipulation, events', 'HTTP and how the web works'],
      'Database Management': ['Relational database concepts', 'Entity-relationship diagrams', 'SQL — SELECT, INSERT, UPDATE, DELETE', 'JOIN operations', 'Normalisation', 'NoSQL — introduction'],
    },
    'Geography':            { 'General': ['Physical geography — landforms, rivers, climate', 'Nigeria — physical and human geography', 'Map reading', 'Population geography', 'Economic geography', 'Environmental problems'] },
    'Economics':            { 'General': ['Demand and supply', 'Theory of the firm', 'National income accounting', 'Money and banking', 'Inflation', 'International trade', 'Development economics'] },
    'Agricultural Science': { 'General': ['Crop physiology', 'Soil chemistry and fertility', 'Pest and disease management', 'Farm mechanisation', 'Agricultural economics', 'Animal husbandry', 'Fisheries and aquaculture'] },
  },

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
    'Economics':             { 'General': ['Demand and supply', 'National income', 'Money and banking', 'Inflation', 'International trade', 'Development economics'] },
    'Geography':             { 'General': ['Physical geography', 'Human geography', 'Map reading', 'Nigeria geography', 'Environmental management'] },
  },

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
