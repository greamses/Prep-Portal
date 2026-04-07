// ─── SUBJECT-SPECIFIC MODELS ─────────────────────────────────
export const SUBJECT_MODELS = {
  groq: [
    { label: 'Llama 3.3 70B', provider: 'groq', model: 'llama-3.3-70b-versatile' },
    { label: 'Llama 3.1 8B', provider: 'groq', model: 'llama-3.1-8b-instant' },
    { label: 'Mixtral 8x7B', provider: 'groq', model: 'mixtral-8x7b-32768' },
    { label: 'Gemma 2 9B', provider: 'groq', model: 'gemma2-9b-it' },
  ],
  gemini: [
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
  }, ]
};

// ─── SUBJECT CONFIGURATION ───────────────────────────────────
export const SUBJECT_CONFIG = {
  name: 'Life Sciences',
  collectionName: 'lifescience-posts', // Firestore collection name
  source: 'auto-lifescience-v1', // Source identifier
  apiKeyField: 'geminiKey', // Field name in user doc for Gemini API keys
  groqKeyField: 'groqKey', // Field name in user doc for Groq API keys
};

// ─── LIFE SCIENCES TOPICS (P1–SS3) ──────────────────────────
export const SUBJECT_TOPICS = [
  // ==================== PRIMARY 1–3 (Basic Science - Living Things) ====================
  { text: 'Living and non-living things: what makes something alive?', subject: 'lifescience', classLevel: 'primary-1', complexity: 'simple' },
  { text: 'Plants around us: trees, flowers, and grasses in our environment', subject: 'lifescience', classLevel: 'primary-1', complexity: 'simple' },
  { text: 'Animals in our home and community: domestic and wild animals', subject: 'lifescience', classLevel: 'primary-1', complexity: 'simple' },
  { text: 'Our body parts: head, arms, legs, eyes, ears, and nose', subject: 'lifescience', classLevel: 'primary-1', complexity: 'simple' },
  { text: 'The five senses: seeing, hearing, smelling, tasting, and touching', subject: 'lifescience', classLevel: 'primary-1', complexity: 'simple' },
  { text: 'Where plants and animals live: land, water, and air', subject: 'lifescience', classLevel: 'primary-1', complexity: 'simple' },
  { text: 'Differences between plants and animals for young learners', subject: 'lifescience', classLevel: 'primary-1', complexity: 'simple' },
  { text: 'How plants and animals help each other', subject: 'lifescience', classLevel: 'primary-1', complexity: 'simple' },
  { text: 'What living things need: food, water, and air', subject: 'lifescience', classLevel: 'primary-1', complexity: 'simple' },
  { text: 'Growing and changing: how babies become adults', subject: 'lifescience', classLevel: 'primary-1', complexity: 'simple' },
  
  { text: 'Parts of a plant: roots, stem, leaves, flowers, and fruits', subject: 'lifescience', classLevel: 'primary-2', complexity: 'simple' },
  { text: 'What plants need to grow: water, sunlight, air, and soil', subject: 'lifescience', classLevel: 'primary-2', complexity: 'simple' },
  { text: 'Types of animals: mammals, birds, fish, reptiles, and insects', subject: 'lifescience', classLevel: 'primary-2', complexity: 'simple' },
  { text: 'Animal body coverings: fur, feathers, scales, and shells', subject: 'lifescience', classLevel: 'primary-2', complexity: 'simple' },
  { text: 'How animals move: walking, flying, swimming, and crawling', subject: 'lifescience', classLevel: 'primary-2', complexity: 'simple' },
  { text: 'Our sense organs: eyes for seeing, ears for hearing', subject: 'lifescience', classLevel: 'primary-2', complexity: 'simple' },
  { text: 'The sense of touch: our skin and what it feels', subject: 'lifescience', classLevel: 'primary-2', complexity: 'simple' },
  { text: 'The sense of smell: our nose and different odors', subject: 'lifescience', classLevel: 'primary-2', complexity: 'simple' },
  { text: 'The sense of taste: our tongue and sweet, sour, salty, bitter', subject: 'lifescience', classLevel: 'primary-2', complexity: 'simple' },
  { text: 'Baby animals and their parents', subject: 'lifescience', classLevel: 'primary-2', complexity: 'simple' },
  { text: 'Homes of animals: nests, burrows, caves, and hives', subject: 'lifescience', classLevel: 'primary-2', complexity: 'simple' },
  { text: 'How seeds are scattered: wind, water, and animals', subject: 'lifescience', classLevel: 'primary-2', complexity: 'simple' },
  
  { text: 'What animals eat: herbivores, carnivores, and omnivores', subject: 'lifescience', classLevel: 'primary-3', complexity: 'simple' },
  { text: 'Life cycles of common animals: butterfly, frog, and chicken', subject: 'lifescience', classLevel: 'primary-3', complexity: 'simple' },
  { text: 'How seeds grow into plants: germination and growth', subject: 'lifescience', classLevel: 'primary-3', complexity: 'simple' },
  { text: 'Useful plants and animals: food, medicine, and materials', subject: 'lifescience', classLevel: 'primary-3', complexity: 'simple' },
  { text: 'Caring for our body: eating well, exercise, and rest', subject: 'lifescience', classLevel: 'primary-3', complexity: 'simple' },
  { text: 'Differences between plants and animals', subject: 'lifescience', classLevel: 'primary-3', complexity: 'simple' },
  { text: 'Why we need food: energy, growth, and health', subject: 'lifescience', classLevel: 'primary-3', complexity: 'simple' },
  { text: 'Types of food: carbohydrates, proteins, vitamins, and minerals', subject: 'lifescience', classLevel: 'primary-3', complexity: 'simple' },
  { text: 'Water in our life: drinking, washing, and growing plants', subject: 'lifescience', classLevel: 'primary-3', complexity: 'simple' },
  { text: 'Cleanliness and health: washing hands before eating', subject: 'lifescience', classLevel: 'primary-3', complexity: 'simple' },
  { text: 'Dangerous animals: snakes, scorpions, and how to stay safe', subject: 'lifescience', classLevel: 'primary-3', complexity: 'simple' },
  { text: 'Fruits we eat and vegetables we grow', subject: 'lifescience', classLevel: 'primary-3', complexity: 'simple' },
  
  // ==================== PRIMARY 4–6 (Basic Science - Ecosystems & Body Systems) ====================
  { text: 'The human skeleton: bones, joints, and how we move', subject: 'lifescience', classLevel: 'primary-4', complexity: 'standard' },
  { text: 'Muscles and movement: how muscles pull on bones', subject: 'lifescience', classLevel: 'primary-4', complexity: 'standard' },
  { text: 'The teeth: types of teeth and their functions', subject: 'lifescience', classLevel: 'primary-4', complexity: 'standard' },
  { text: 'How to care for our teeth: brushing, flossing, and diet', subject: 'lifescience', classLevel: 'primary-4', complexity: 'standard' },
  { text: 'Animals that live in water: fish, crabs, and whales', subject: 'lifescience', classLevel: 'primary-4', complexity: 'standard' },
  { text: 'Animals that live on land: lions, elephants, and ants', subject: 'lifescience', classLevel: 'primary-4', complexity: 'standard' },
  { text: 'Animals that fly: birds, bats, and insects', subject: 'lifescience', classLevel: 'primary-4', complexity: 'standard' },
  { text: 'The food we eat: a balanced diet for growing children', subject: 'lifescience', classLevel: 'primary-4', complexity: 'standard' },
  { text: 'Digestion: what happens to food in our mouth and stomach', subject: 'lifescience', classLevel: 'primary-4', complexity: 'standard' },
  { text: 'Our lungs and breathing: how we inhale and exhale', subject: 'lifescience', classLevel: 'primary-4', complexity: 'standard' },
  { text: 'Our heart: a powerful pump that moves blood', subject: 'lifescience', classLevel: 'primary-4', complexity: 'standard' },
  { text: 'Common illnesses: malaria, cold, and stomach ache', subject: 'lifescience', classLevel: 'primary-4', complexity: 'standard' },
  { text: 'First aid for small injuries: cuts, bruises, and burns', subject: 'lifescience', classLevel: 'primary-4', complexity: 'standard' },
  
  { text: 'Photosynthesis: how plants make their own food', subject: 'lifescience', classLevel: 'primary-5', complexity: 'standard' },
  { text: 'Food chains and food webs: who eats whom in nature', subject: 'lifescience', classLevel: 'primary-5', complexity: 'standard' },
  { text: 'Producers, consumers, and decomposers in an ecosystem', subject: 'lifescience', classLevel: 'primary-5', complexity: 'standard' },
  { text: 'The respiratory system: breathing and the lungs', subject: 'lifescience', classLevel: 'primary-5', complexity: 'standard' },
  { text: 'The importance of air for living things', subject: 'lifescience', classLevel: 'primary-5', complexity: 'standard' },
  { text: 'Water in our body: why we need to drink water', subject: 'lifescience', classLevel: 'primary-5', complexity: 'standard' },
  { text: 'The sense organs: eye, ear, nose, tongue, and skin in detail', subject: 'lifescience', classLevel: 'primary-5', complexity: 'standard' },
  { text: 'How the eye works: seeing light and color', subject: 'lifescience', classLevel: 'primary-5', complexity: 'standard' },
  { text: 'How the ear works: hearing sounds', subject: 'lifescience', classLevel: 'primary-5', complexity: 'standard' },
  { text: 'Reproduction in plants: flowers, seeds, and fruits', subject: 'lifescience', classLevel: 'primary-5', complexity: 'standard' },
  { text: 'Wind and insect pollination: how pollen moves', subject: 'lifescience', classLevel: 'primary-5', complexity: 'standard' },
  { text: 'How animals reproduce: eggs and live birth', subject: 'lifescience', classLevel: 'primary-5', complexity: 'standard' },
  { text: 'Metamorphosis: complete and incomplete changes in insects', subject: 'lifescience', classLevel: 'primary-5', complexity: 'standard' },
  
  { text: 'The digestive system: from mouth to stomach to intestines', subject: 'lifescience', classLevel: 'primary-6', complexity: 'standard' },
  { text: 'The circulatory system: heart, blood, and blood vessels', subject: 'lifescience', classLevel: 'primary-6', complexity: 'standard' },
  { text: 'Habitats and adaptations: how animals survive in their homes', subject: 'lifescience', classLevel: 'primary-6', complexity: 'standard' },
  { text: 'Adaptations in plants: how plants survive in different environments', subject: 'lifescience', classLevel: 'primary-6', complexity: 'standard' },
  { text: 'Microorganisms: helpful and harmful germs', subject: 'lifescience', classLevel: 'primary-6', complexity: 'standard' },
  { text: 'How diseases spread and how to prevent them', subject: 'lifescience', classLevel: 'primary-6', complexity: 'standard' },
  { text: 'Personal hygiene and sanitation for good health', subject: 'lifescience', classLevel: 'primary-6', complexity: 'standard' },
  { text: 'The nervous system: brain, spinal cord, and nerves', subject: 'lifescience', classLevel: 'primary-6', complexity: 'standard' },
  { text: 'How we think, feel, and move: the role of the brain', subject: 'lifescience', classLevel: 'primary-6', complexity: 'standard' },
  { text: 'The excretory system: how we remove waste from our body', subject: 'lifescience', classLevel: 'primary-6', complexity: 'standard' },
  { text: 'Our kidneys: filters of the blood', subject: 'lifescience', classLevel: 'primary-6', complexity: 'standard' },
  { text: 'Drugs and medicines: using them safely', subject: 'lifescience', classLevel: 'primary-6', complexity: 'standard' },
  { text: 'Harmful substances: alcohol, tobacco, and their effects', subject: 'lifescience', classLevel: 'primary-6', complexity: 'standard' },
  { text: 'Conserving energy and protecting nature', subject: 'lifescience', classLevel: 'primary-6', complexity: 'standard' },
  
  // ==================== JSS (JUNIOR SECONDARY) - Basic Science & Biology ====================
  { text: 'Cell structure: the building blocks of all living things', subject: 'lifescience', classLevel: 'jss-1', complexity: 'standard' },
  { text: 'Classification of living things: Kingdoms and their characteristics', subject: 'lifescience', classLevel: 'jss-1', complexity: 'standard' },
  { text: 'Characteristics of living things: movement, respiration, sensitivity, growth, reproduction, excretion, nutrition', subject: 'lifescience', classLevel: 'jss-1', complexity: 'standard' },
  { text: 'Differences between plants and animals at the cellular level', subject: 'lifescience', classLevel: 'jss-1', complexity: 'standard' },
  { text: 'Simple and complex animals: invertebrates vs vertebrates', subject: 'lifescience', classLevel: 'jss-1', complexity: 'standard' },
  { text: 'Groups of vertebrates: fish, amphibians, reptiles, birds, mammals', subject: 'lifescience', classLevel: 'jss-1', complexity: 'standard' },
  { text: 'Groups of invertebrates: insects, arachnids, mollusks, worms', subject: 'lifescience', classLevel: 'jss-1', complexity: 'standard' },
  { text: 'The microscope: parts and how to use it', subject: 'lifescience', classLevel: 'jss-1', complexity: 'standard' },
  { text: 'Plant cells: cell wall, chloroplasts, and large vacuole', subject: 'lifescience', classLevel: 'jss-1', complexity: 'standard' },
  { text: 'Animal cells: cell membrane, nucleus, and small vacuoles', subject: 'lifescience', classLevel: 'jss-1', complexity: 'standard' },
  { text: 'Unicellular and multicellular organisms', subject: 'lifescience', classLevel: 'jss-1', complexity: 'standard' },
  { text: 'Bacteria: structure, types, and where they live', subject: 'lifescience', classLevel: 'jss-1', complexity: 'standard' },
  { text: 'Fungi: mushrooms, yeast, and molds', subject: 'lifescience', classLevel: 'jss-1', complexity: 'standard' },
  { text: 'Protozoa: single-celled animal-like organisms', subject: 'lifescience', classLevel: 'jss-1', complexity: 'standard' },
  { text: 'Algae: plant-like protists in water', subject: 'lifescience', classLevel: 'jss-1', complexity: 'standard' },
  
  { text: 'Nutrition in plants: photosynthesis, mineral salts, and transport', subject: 'lifescience', classLevel: 'jss-2', complexity: 'standard' },
  { text: 'Nutrition in animals: digestive system and balanced diet', subject: 'lifescience', classLevel: 'jss-2', complexity: 'standard' },
  { text: 'Transport systems in plants: xylem, phloem, and transpiration', subject: 'lifescience', classLevel: 'jss-2', complexity: 'standard' },
  { text: 'Transport systems in animals: circulatory system and blood composition', subject: 'lifescience', classLevel: 'jss-2', complexity: 'standard' },
  { text: 'The skeletal system: axial and appendicular skeleton', subject: 'lifescience', classLevel: 'jss-2', complexity: 'standard' },
  { text: 'Joints and movement: ball-and-socket, hinge, pivot joints', subject: 'lifescience', classLevel: 'jss-2', complexity: 'standard' },
  { text: 'The muscular system: voluntary and involuntary muscles', subject: 'lifescience', classLevel: 'jss-2', complexity: 'standard' },
  { text: 'The digestive system: organs and their functions in detail', subject: 'lifescience', classLevel: 'jss-2', complexity: 'standard' },
  { text: 'Enzymes in digestion: amylase, protease, and lipase', subject: 'lifescience', classLevel: 'jss-2', complexity: 'standard' },
  { text: 'Absorption of nutrients: villi in the small intestine', subject: 'lifescience', classLevel: 'jss-2', complexity: 'standard' },
  { text: 'The heart: chambers, valves, and blood flow', subject: 'lifescience', classLevel: 'jss-2', complexity: 'standard' },
  { text: 'Blood vessels: arteries, veins, and capillaries', subject: 'lifescience', classLevel: 'jss-2', complexity: 'standard' },
  { text: 'Blood composition: red blood cells, white blood cells, and platelets', subject: 'lifescience', classLevel: 'jss-2', complexity: 'standard' },
  { text: 'The lymphatic system: fighting infection', subject: 'lifescience', classLevel: 'jss-2', complexity: 'standard' },
  { text: 'The respiratory system: trachea, bronchi, and alveoli', subject: 'lifescience', classLevel: 'jss-2', complexity: 'standard' },
  { text: 'Gas exchange: oxygen and carbon dioxide in the lungs', subject: 'lifescience', classLevel: 'jss-2', complexity: 'standard' },
  
  { text: 'Respiration: aerobic vs anaerobic respiration in cells', subject: 'lifescience', classLevel: 'jss-3', complexity: 'standard' },
  { text: 'Reproduction in plants: pollination, fertilization, and seed dispersal', subject: 'lifescience', classLevel: 'jss-3', complexity: 'standard' },
  { text: 'Reproduction in animals: sexual and asexual reproduction', subject: 'lifescience', classLevel: 'jss-3', complexity: 'standard' },
  { text: 'Ecology: components of an ecosystem and energy flow', subject: 'lifescience', classLevel: 'jss-3', complexity: 'standard' },
  { text: 'Food chains, food webs, and energy pyramids', subject: 'lifescience', classLevel: 'jss-3', complexity: 'standard' },
  { text: 'Nutrient cycles: carbon cycle and water cycle', subject: 'lifescience', classLevel: 'jss-3', complexity: 'standard' },
  { text: 'Human impact on the environment: pollution and deforestation', subject: 'lifescience', classLevel: 'jss-3', complexity: 'standard' },
  { text: 'Conservation of natural resources', subject: 'lifescience', classLevel: 'jss-3', complexity: 'standard' },
  { text: 'The nitrogen cycle: how nitrogen moves through ecosystems', subject: 'lifescience', classLevel: 'jss-3', complexity: 'standard' },
  { text: 'Biomes: tropical rainforest, savanna, desert, and tundra', subject: 'lifescience', classLevel: 'jss-3', complexity: 'standard' },
  { text: 'Population ecology: birth rate, death rate, and migration', subject: 'lifescience', classLevel: 'jss-3', complexity: 'standard' },
  { text: 'Competition and predation in nature', subject: 'lifescience', classLevel: 'jss-3', complexity: 'standard' },
  { text: 'Symbiosis: mutualism, commensalism, and parasitism', subject: 'lifescience', classLevel: 'jss-3', complexity: 'standard' },
  { text: 'Adaptation for survival: camouflage, mimicry, and warning colors', subject: 'lifescience', classLevel: 'jss-3', complexity: 'standard' },
  { text: 'Endangered species in Nigeria and their protection', subject: 'lifescience', classLevel: 'jss-3', complexity: 'standard' },
  
  // ==================== SS (SENIOR SECONDARY) - Advanced Biology ====================
  { text: 'Cell organelles and their functions: nucleus, mitochondria, chloroplasts', subject: 'lifescience', classLevel: 'ss-1', complexity: 'deep' },
  { text: 'Cell division: mitosis and meiosis compared in detail', subject: 'lifescience', classLevel: 'ss-1', complexity: 'deep' },
  { text: 'Enzymes: structure, mode of action, and factors affecting activity', subject: 'lifescience', classLevel: 'ss-1', complexity: 'deep' },
  { text: 'Cellular transport: diffusion, osmosis, and active transport', subject: 'lifescience', classLevel: 'ss-1', complexity: 'deep' },
  { text: 'Tissues, organs, and organ systems in plants', subject: 'lifescience', classLevel: 'ss-1', complexity: 'deep' },
  { text: 'Tissues, organs, and organ systems in animals', subject: 'lifescience', classLevel: 'ss-1', complexity: 'deep' },
  { text: 'The skin: structure and functions in protection and thermoregulation', subject: 'lifescience', classLevel: 'ss-1', complexity: 'deep' },
  { text: 'The eye: structure, function, and common defects', subject: 'lifescience', classLevel: 'ss-1', complexity: 'deep' },
  { text: 'The ear: structure, hearing, and balance', subject: 'lifescience', classLevel: 'ss-1', complexity: 'deep' },
  { text: 'ATP and cellular energy: how cells store and use energy', subject: 'lifescience', classLevel: 'ss-1', complexity: 'deep' },
  { text: 'Glycolysis: the first step of cellular respiration', subject: 'lifescience', classLevel: 'ss-1', complexity: 'deep' },
  { text: 'Krebs cycle and electron transport chain', subject: 'lifescience', classLevel: 'ss-1', complexity: 'deep' },
  { text: 'Fermentation: lactic acid and alcoholic fermentation', subject: 'lifescience', classLevel: 'ss-1', complexity: 'deep' },
  { text: 'Plant tissues: meristematic, parenchyma, collenchyma, and sclerenchyma', subject: 'lifescience', classLevel: 'ss-1', complexity: 'deep' },
  { text: 'Animal tissues: epithelial, connective, muscle, and nervous', subject: 'lifescience', classLevel: 'ss-1', complexity: 'deep' },
  { text: 'Support and movement in plants: turgor pressure and cell walls', subject: 'lifescience', classLevel: 'ss-1', complexity: 'deep' },
  { text: 'Exoskeleton and endoskeleton in animals', subject: 'lifescience', classLevel: 'ss-1', complexity: 'deep' },
  
  { text: 'Genetics: Mendel\'s laws, inheritance patterns, and Punnett squares', subject: 'lifescience', classLevel: 'ss-2', complexity: 'deep' },
  { text: 'DNA and RNA: structure, replication, transcription, and translation', subject: 'lifescience', classLevel: 'ss-2', complexity: 'deep' },
  { text: 'Evolution: natural selection, adaptation, and evidence for evolution', subject: 'lifescience', classLevel: 'ss-2', complexity: 'deep' },
  { text: 'The nervous system: neurons, synapses, and reflex arcs', subject: 'lifescience', classLevel: 'ss-2', complexity: 'deep' },
  { text: 'The brain: structure, lobes, and functions', subject: 'lifescience', classLevel: 'ss-2', complexity: 'deep' },
  { text: 'The endocrine system: hormones and their regulatory functions', subject: 'lifescience', classLevel: 'ss-2', complexity: 'deep' },
  { text: 'Reproductive system in humans: male and female anatomy', subject: 'lifescience', classLevel: 'ss-2', complexity: 'deep' },
  { text: 'Menstrual cycle, fertilization, pregnancy, and development', subject: 'lifescience', classLevel: 'ss-2', complexity: 'deep' },
  { text: 'Plant hormones: auxins, gibberellins, and tropisms', subject: 'lifescience', classLevel: 'ss-2', complexity: 'deep' },
  { text: 'Chromosomes and genes: homologous chromosomes and alleles', subject: 'lifescience', classLevel: 'ss-2', complexity: 'deep' },
  { text: 'Incomplete dominance, codominance, and multiple alleles', subject: 'lifescience', classLevel: 'ss-2', complexity: 'deep' },
  { text: 'Sex determination and sex-linked inheritance', subject: 'lifescience', classLevel: 'ss-2', complexity: 'deep' },
  { text: 'Mutations: types, causes, and effects', subject: 'lifescience', classLevel: 'ss-2', complexity: 'deep' },
  { text: 'Protein synthesis: how genes make proteins', subject: 'lifescience', classLevel: 'ss-2', complexity: 'deep' },
  { text: 'The lac operon: gene regulation in bacteria', subject: 'lifescience', classLevel: 'ss-2', complexity: 'deep' },
  { text: 'Evidence for evolution: fossils, anatomy, and molecular biology', subject: 'lifescience', classLevel: 'ss-2', complexity: 'deep' },
  { text: 'Speciation: how new species form', subject: 'lifescience', classLevel: 'ss-2', complexity: 'deep' },
  
  { text: 'Ecology: population dynamics, succession, and conservation', subject: 'lifescience', classLevel: 'ss-3', complexity: 'deep' },
  { text: 'Variation and evolution: sources of genetic variation', subject: 'lifescience', classLevel: 'ss-3', complexity: 'deep' },
  { text: 'The excretory system: kidneys, nephrons, and osmoregulation', subject: 'lifescience', classLevel: 'ss-3', complexity: 'deep' },
  { text: 'The immune system: antigens, antibodies, and immunity types', subject: 'lifescience', classLevel: 'ss-3', complexity: 'deep' },
  { text: 'Biotechnology: applications in medicine, agriculture, and industry', subject: 'lifescience', classLevel: 'ss-3', complexity: 'deep' },
  { text: 'Genetic engineering: CRISPR, GMOs, and gene therapy', subject: 'lifescience', classLevel: 'ss-3', complexity: 'deep' },
  { text: 'Human diseases: malaria, HIV/AIDS, typhoid, and tuberculosis', subject: 'lifescience', classLevel: 'ss-3', complexity: 'deep' },
  { text: 'Public health and disease prevention strategies', subject: 'lifescience', classLevel: 'ss-3', complexity: 'deep' },
  { text: 'Ecosystems in Nigeria: rainforest, savanna, and mangrove', subject: 'lifescience', classLevel: 'ss-3', complexity: 'deep' },
  { text: 'Conservation of wildlife and endangered species', subject: 'lifescience', classLevel: 'ss-3', complexity: 'deep' },
  { text: 'Ecological succession: primary and secondary succession', subject: 'lifescience', classLevel: 'ss-3', complexity: 'deep' },
  { text: 'Population growth models: exponential and logistic growth', subject: 'lifescience', classLevel: 'ss-3', complexity: 'deep' },
  { text: 'Carrying capacity and limiting factors', subject: 'lifescience', classLevel: 'ss-3', complexity: 'deep' },
  { text: 'Biodiversity and its importance', subject: 'lifescience', classLevel: 'ss-3', complexity: 'deep' },
  { text: 'Climate change and its effects on ecosystems', subject: 'lifescience', classLevel: 'ss-3', complexity: 'deep' },
  { text: 'Pollution: air, water, and soil pollution and their control', subject: 'lifescience', classLevel: 'ss-3', complexity: 'deep' },
  { text: 'The greenhouse effect and global warming', subject: 'lifescience', classLevel: 'ss-3', complexity: 'deep' },
  { text: 'The ozone layer: depletion and its consequences', subject: 'lifescience', classLevel: 'ss-3', complexity: 'deep' },
  { text: 'Sustainable development and environmental management', subject: 'lifescience', classLevel: 'ss-3', complexity: 'deep' },
];

// ─── SUBJECT LABELS & STYLES ───────────────────────────────
export const SUBJECT_LABELS = {
  lifescience: 'Life Sciences',
  biology: 'Biology',
  'basic-science': 'Basic Science'
};

export const SUBJECT_STYLES = {
  lifescience: 'sci-biology',
  biology: 'sci-biology',
  'basic-science': 'sci-basicscience'
};

export const CLASS_LABELS = {
  primary: (n) => `P${n}`,
  jss: (n) => `JSS ${n}`,
  ss: (n) => `SS ${n}`
};

export const CLASS_STYLES = {
  primary: 'cls-primary',
  jss: 'cls-jss',
  ss: 'cls-ss'
};

// ─── HOOK STYLES FOR ROTATION ──────────────────────────────
const HOOK_STYLES = ['question', 'descriptive', 'story'];

// ─── EXTRACTED HOOK CONTENT BY LEVEL AND STYLE ─────────────
const HOOK_CONTENT = {
  primary: {
    question: `**HOOK TYPE: QUESTION**

Open your lesson with a question that makes a little kid stop what they're doing and listen.

**Use one of these patterns:**

**The "Did You Know" Question:**
"Did you know that a tree can make its own food? ... (pause) ... Let me show you how."

**The "Have You Ever" Question:**
"Have you ever watched a caterpillar turn into a butterfly? ... (pause) ... It's like magic — but it's science!"

**The Body Question (make them touch themselves):**
"Close your eyes and feel your heart beating. ... (pause) ... Thump-thump. Thump-thump. That sound keeps you alive. Let's find out why."

**The "Look Around" Question:**
"Look outside your window. Find a plant. Any plant. ... (pause) ... That green thing is alive — just like you!"

**The "I Bet You Can't" Question:**
"I bet you can't name five living things in your home right now. ... (pause) ... Try it! ... (longer pause) ... Now let's check if you're right."

**Adapt for your specific topic:** Choose the closest match and replace the example with your topic. Keep the energy high and the pause clear.`,
    
    descriptive: `**HOOK TYPE: DESCRIPTIVE**

Paint a picture with your words. Tell the child to close their eyes and SEE what you're describing.

**Use one of these patterns:**

**Sight Hook:**
"Close your eyes. Picture a mango tree in your compound. Big green leaves. Yellow fruits hanging down. Now imagine a tiny seed falling from that tree. That seed is about to do something amazing..."

**Sound Hook:**
"Close your eyes and listen. Lub-DUB. Lub-DUB. That's the sound of a heart. YOUR heart. Right now, while you're sitting still, it's making that sound. Put your hand on your chest. Feel it?"

**Touch Hook:**
"Touch your arm. Feel your skin? It's soft, right? Now pinch it — gently! Feel that? That's your skin protecting everything inside. Your muscles. Your bones. Your blood. Your skin is like a superhero suit."

**Smell/Taste Hook:**
"Think about the last time you ate fresh bread. Remember that smell? Warm and soft. Your nose sent a message to your brain: 'Something good is coming!' That's your sense of smell working."

**Movement Hook:**
"Stand up. Stretch your arms wide like wings. Now flap. You're a bird! But here's the thing — birds have hollow bones. That's why they can fly. Your bones are solid. That's why you stay on the ground."

**Adapt for your specific topic:** Replace the example with your topic. Keep it to 3-4 sentences. Use ONE sense at a time for little kids.`,
    
    story: `**HOOK TYPE: STORY**

Tell a short story with a character, a small problem, and a science solution.

**Use one of these patterns:**

**The Seed's Journey:**
"Once upon a time, there was a tiny mango seed. She was buried in dark soil. So dark she couldn't see anything. She was scared. 'Will I stay here forever?' she whispered. Then the rain came. Drip. Drip. Drip. The seed drank the water. The sun warmed the soil. And the seed felt something inside her — a little push. CRACK! A tiny green shoot popped out. That seed wasn't just a seed anymore. She was a baby plant. And she was reaching for the light."

**The Caterpillar Who Changed:**
"There was a caterpillar named Tunde. He was hungry all the time. He ate leaves. And more leaves. And MORE leaves. His friends laughed at him. 'You're so round!' they said. Then one day, Tunde stopped eating. He hung upside down from a branch. He wrapped himself in a hard shell. His friends thought he was gone. But inside, something magical was happening. Tunde was turning into soup — yes, soup! — and then... wings. When he came out, he wasn't a caterpillar anymore. He was a butterfly. And he could fly."

**The Little Drop of Blood:**
"Meet Dami, a tiny red blood cell. Dami's job was to carry oxygen. But where? He didn't know. He lived in the heart — a big, noisy house with four rooms. One day, a door opened. WHOOSH! Dami was pushed out. He traveled through tunnels — some big, some tiny. He visited the lungs and picked up oxygen. Then he visited a toe and dropped it off. 'Thank you, Dami!' said the toe. Dami smiled. Then he went back to the heart to get more oxygen. And he did this all day, every day."

**The Hungry Stomach:**
"Deep inside Chidi's belly lived a stomach named Mr. Gurgle. Mr. Gurgle was bored. He hadn't seen food in hours. 'Where is it?' he grumbled. Then — THUMP — something landed. It was a piece of bread. 'Finally!' said Mr. Gurgle. He squeezed the bread. He squished it. He poured acid on it. The bread turned into mush. Then Mr. Gurgle pushed the mush down a long tunnel to the intestines. 'Bye, bread!' he said. 'Thanks for the visit!'"

**Adapt for your specific topic:** Create a character (seed, caterpillar, blood cell, stomach, bone, tooth). Give them a simple problem. Let the science solve it. Keep it to 4-5 sentences. Use a Nigerian name for the character.`
  },
  
  jss: {
    question: `**HOOK TYPE: QUESTION**

Open with a question that connects biology to everyday life — food, sports, their body, things they've noticed but never understood.

**Use one of these patterns:**

**The Food Question:**
"Every time you eat a mango, you're helping a plant reproduce. ... (pause) ... Seriously. That seed inside? You just became part of the plant's life cycle. Here's how seeds work."

**The Body & Sports Question:**
"Why do your muscles get tired after running? ... (pause) ... The answer is inside your cells. Tiny little factories that run out of energy. Let me show you what's happening."

**The Animal Question (Nigerian examples):**
"Have you noticed that birds build nests before laying eggs? ... (pause) ... That's not just a habit — it's survival. And it's controlled by hormones."

**The "You've Noticed This But Never Knew Why" Question:**
"Have you ever wondered why your heart beats faster when you're scared? ... (pause) ... That's your body getting ready to fight or run. It's called the 'fight or flight' response."

**The Myth-Buster Question:**
"You've probably heard that you have 5 senses. ... (pause) ... Actually, you have way more. Balance? That's a sense. Temperature? That's another one. Let me count them."

**Adapt for your specific topic:** Start with something they experience daily. Ask "Have you ever wondered..." Then promise an answer.`,
    
    descriptive: `**HOOK TYPE: DESCRIPTIVE**

Build a scene they can step into. Use specific details. Use Nigerian settings they recognize.

**Use one of these patterns:**

**Everyday Nigerian Scene:**
"It's 6pm in Lagos. The sun is going down. You're sitting outside, and a mosquito lands on your arm. You don't even feel it at first. Then — ITCH. That tiny bump on your skin is your body's reaction to mosquito spit. And that spit? Sometimes it carries malaria. Here's how that tiny insect can make you sick."

**Animal Observation:**
"You see a lizard on the wall. It's just sitting there. Not moving. Then a fly buzzes past. WHIP — the lizard's tongue shoots out, grabs the fly, and snaps back in. All in less than a second. How does the lizard move so fast? Cold blood. Literally. Let me explain what that means."

**Body System Description:**
"You're running during P.E. class. Your chest is heaving. Your legs are burning. You can feel your heart pounding in your ears. That's not just 'being tired.' That's your body screaming for oxygen. Your muscles are working so hard they've run out of energy. Now they're begging your lungs and heart to catch up."

**The "Slow Motion" Description:**
"Imagine you swallow a piece of bread. Slow down time in your head. First, your tongue pushes it to the back of your throat. Then a flap — your epiglottis — closes over your windpipe. (If it didn't, you'd choke.) The bread slides down your esophagus — a long tube that squeezes like someone stepping on a toothpaste tube. Ten seconds later, it lands in your stomach — a bag of acid. That acid starts breaking the bread into tiny pieces. This is digestion."

**Adapt for your specific topic:** Set the scene (time + place + action). Add 2 sensory details. End with "Here's what's happening..." Keep it under 6 sentences.`,
    
    story: `**HOOK TYPE: STORY**

Tell a short story about a student their age, an animal they know, or a cell with a personality. Add mild conflict and a science solution.

**Use one of these patterns:**

**The Student Who Ran Too Fast:**
"Chinedu loved football. But every time he ran after the ball, his chest would burn. His legs would feel heavy. 'Why am I so tired?' he asked his coach. 'Let me show you something,' the coach said. 'When you run, your muscles work hard. They use up oxygen faster than your lungs can provide. So your muscles switch to a backup plan — they make energy without oxygen. But that backup plan creates a waste product called lactic acid. That burning feeling? That's the lactic acid. The heavy legs? That's your body saying, 'Please stop — I need oxygen!' Chinedu understood. He started breathing deeper when he ran. And he got faster."

**The Gecko Who Lost Her Tail:**
"Ada the gecko was sleeping on a wall. A snake slid toward her. Ada woke up. Too late — the snake was close. So Ada did something dramatic. She contracted a special muscle in her tail. CRACK — the tail broke off. It kept wiggling on the ground. The snake attacked the wiggling tail. Ada ran away. 'I lost my tail!' she cried later. But here's the miracle: Her tail started growing back. Not immediately — it took weeks. But a new tail formed. That's called regeneration."

**The Boy Who Didn't Drink Water:**
"Day 1: Emeka forgot his water bottle. No big deal. Day 2: He forgot again. His mouth felt dry. Day 3: He drank only one cup. His pee was dark yellow. 'Why is my pee so dark?' he wondered. Here's why: His body was running out of water. His kidneys — two bean-shaped filters in his back — were working overtime. They were grabbing every drop of water they could find and putting it back into his blood. The little water left in his kidneys became super concentrated — dark yellow. That's his body's way of saying, 'DRINK WATER!'"

**The Farmer Who Planted Cassava Stems:**
"Mr. Okonkwo wanted more cassava plants. But he didn't have seeds. Cassava doesn't grow from seeds — not easily, anyway. So he did what farmers do: he cut stems from his biggest cassava plant. He planted those stems in the ground. Two weeks later, roots grew from the stems. Four weeks later, leaves appeared. Six months later, he harvested new cassava tubers — identical to the original plant. That's asexual reproduction."

**Adapt for your specific topic:** Create a character (student, animal, farmer). Give them a problem. Use biology to solve it. Keep it 5-7 sentences. Use Nigerian names.`
  },
  
  ss: {
    question: `**HOOK TYPE: QUESTION**

Open with an exam strategy, a misconception attack, or a clinical application. Make them see why this matters for their score or their future career.

**Use one of these patterns:**

**The Exam Strategy Question:**
"Most SS students lose 4–6 marks in WAEC Biology on genetics — not because it's hard, but because they confuse key terms. Let's fix that right now."

**The Misconception Smash Question:**
"Before we start: Can you explain why the mitochondria is called the 'powerhouse of the cell'? ... (pause) ... If your answer is just 'it makes energy,' keep reading — there's more to the story. And that 'more' is what WAEC wants."

**The Clinical/Real-World Question:**
"When someone has a heart attack, which blood vessel is blocked? Usually the coronary artery. If you want to study medicine, you need to know this. But even if you don't — WAEC expects you to know it."

**The "Connect the Dots" Question:**
"Remember enzymes from SS1? The lock-and-key model? ... (pause) ... We're about to use that to understand digestion. Then we'll use digestion to understand metabolism. Everything connects."

**The "Challenge Your Thinking" Question:**
"Here's a question: 'A man with blood group A marries a woman with blood group B. Their child has blood group O. Explain how this is possible.' Try to solve it right now. ... (pause) ... Stuck? That's okay. Let me walk you through it."

**Adapt for your specific topic:** Choose the angle that fits. For exam-heavy topics, use exam strategy. For tricky concepts, use misconception smash. For applied topics, use clinical hook.`,
    
    descriptive: `**HOOK TYPE: DESCRIPTIVE**

Build a mental model they can manipulate. Walk them through a biological process step by step. Use precise, scientific descriptions but keep them conversational.

**Use one of these patterns:**

**Cellular Scale:**
"Picture this: inside one of your cells — so small you'd need a microscope to see it — there's a factory. The factory is the ribosome. Its job? Building proteins. It reads a message from the nucleus — that's the control room — and then it starts assembling amino acids, one by one, like beads on a string. When it's done, it folds that string into a 3D shape. That shape determines what the protein does. This is translation. And WAEC WILL ask you to explain it."

**Organ Scale:**
"Imagine you're shrinking down and entering the heart through the superior vena cava — a big vein bringing blood from your upper body. You drop into the right atrium. Then you're pushed through the tricuspid valve into the right ventricle. Then you're squeezed up through the pulmonary valve into the pulmonary artery. You travel to the lungs. You pick up oxygen. You come back to the left atrium. Then left ventricle. Then — WHOOSH — you're shot out through the aorta to the entire body. That's one heartbeat. Trace it. WAEC will ask you to."

**Ecosystem Scale:**
"Imagine a savanna in northern Nigeria — 10,000 years ago. It's dry. Grass everywhere. A herd of antelope is grazing. Most are brown — they blend in. But one is born with lighter fur — almost white. Against the brown grass, it stands out. A lion sees it first. The white antelope is eaten. The brown ones survive. They pass their brown fur genes to their babies. Generation after generation, the population gets browner. That's natural selection."

**The "Exam-Ready" Description:**
"Here's a WAEC-style question: 'Describe the pathway of a red blood cell from the right ventricle to the aorta.' Most students get lost. But if you can picture it — if you can see that cell moving through the heart — you can answer it without memorizing. Let me walk you through it. Close your eyes if you need to. Right ventricle pushes the cell to the lungs. Lungs add oxygen. Cell returns to left atrium. Then left ventricle. Then aorta. That's the whole path."

**Adapt for your specific topic:** Choose the scale (cellular, organ, ecosystem). Describe in chronological steps (first, then, next, finally). End with an exam connection. Keep it 6-8 sentences.`,
    
    story: `**HOOK TYPE: STORY**

Tell a clinical case study, a historical discovery, or a "what if" scenario. Use real stakes — life or death, career failure, ethical dilemmas.

**Use one of these patterns:**

**The Clinical Case Study:**
"A 45-year-old man walked into a clinic in Lagos. His symptoms: extreme thirst, frequent urination, weight loss, blurry vision. He thought it was malaria. The nurse checked his blood sugar: 280 mg/dL. Normal is below 100. 'You have diabetes,' the doctor said. The man was confused. 'But I don't eat too much sugar.' The doctor explained: 'Your body makes insulin — a hormone that unlocks your cells so sugar can enter. But your cells aren't responding. The sugar stays in your blood. Your kidneys try to filter it out, but there's too much. So sugar spills into your urine. That sugar pulls water with it — that's why you pee so much. And that's why you're thirsty.' The man started treatment. His blood sugar dropped."

**The Historical Discovery:**
"It's 1854. London. A cholera outbreak is killing hundreds. Everyone believes cholera spreads through bad air — 'miasma.' But a doctor named John Snow isn't convinced. He maps every death in London. He sees a pattern: most deaths cluster around a single water pump on Broad Street. Snow removes the pump handle. The outbreak stops. People can't believe it — disease from WATER? Impossible. But Snow was right. Cholera spreads through contaminated water, not bad air. This was the birth of epidemiology."

**The "What If" Ethical Scenario:**
"What if you could edit the DNA of a baby before it's born? Remove genes for sickle cell anemia. Add genes for disease resistance. Choose eye color, height, even intelligence. This isn't science fiction. It's CRISPR — a gene-editing tool that's cheap, precise, and available today. In 2018, a Chinese scientist named He Jiankui created the first gene-edited babies. He was sent to prison. But the technology is still here. Question: Should we edit human embryos?"

**The Ecosystem in Crisis:**
"The rainforest in southwestern Nigeria is disappearing. Not slowly — quickly. Every year, more trees fall. Farmers need land. Loggers need wood. As the trees disappear, so do the animals. But here's what people don't see: the soil is dying too. Tree roots hold soil together. Without trees, rain washes soil into rivers. The land becomes barren. Deforestation isn't just about trees. It's about the entire ecosystem collapsing."

**Adapt for your specific topic:** Choose case study (for body systems), history (for major discoveries), ethics (for biotechnology), or crisis (for ecology). Use real details. End with the biological principle.`
  }
};

// ─── TONE GUIDES (simplified per level) ────────────────────
function getToneGuide(levelType) {
  const toneGuides = {
    primary: `You are a warm, patient primary school teacher (ages 6–12) explaining life science. Talk to the child like you're sitting beside them under a mango tree.

**Key rules:**
- One short sentence at a time
- Use Nigerian things they see every day (mango trees, chickens, goats, rain)
- Always start with excitement ("Ooh, good question!", "Guess what?")
- Ask them to do small things (point, touch, pretend)
- Use baby words first, then teach the real word
- Make sounds and act things out
- End with something they can do ("Now go show your mom...")`,
    
    jss: `You are a JSS biology teacher (for 11–15 year olds) making life science click. Talk like the cool older sibling who actually explains things well.

**Key rules:**
- Start with what they already know
- Put new word explanations in brackets: "Photosynthesis (big word, simple meaning: plants cooking food with sunshine)"
- Use Nigerian examples (cassava, geckos, mosquitoes, garri)
- Break big ideas into small chunks
- Ask rhetorical questions to keep them thinking
- Call out common mistakes directly
- End with "Try this" or "Ask yourself"`,
    
    ss: `You are an SS biology teacher (for 15–19 year olds) preparing students for WAEC, NECO, and JAMB. Talk like a passionate university lecturer who still remembers what it's like to be a student.

**Key rules:**
- Be rigorous but never boring
- Flag exam patterns EXPLICITLY ("WAEC loves to ask about...")
- Teach the WHY, not just the WHAT
- Use clinical and real-world applications
- Anticipate misconceptions and crush them gently
- Connect topics across the curriculum
- Give exam strategy advice naturally
- End with what they should do next (draw, make a table, find past questions)`
  };
  
  return toneGuides[levelType];
}

// ─── WORKED EXAMPLES FOR SS (only included for SS level) ───
function getWorkedExamples(topic, topicIndex) {
  // Return different worked examples based on topic and index
  // This is a simplified version - you can expand based on your needs
  
  const exampleTypes = ['waec', 'neco', 'jamb'];
  const exampleType = exampleTypes[topicIndex % exampleTypes.length];
  
  // Base template that works for most SS topics
  return `
**WORKED EXAMPLES — MANDATORY FOR SS**

<div class="worked-example">
  <h4>${exampleType.toUpperCase()} Style Question (4-6 marks)</h4>
  
  <p><strong>Question:</strong> [Insert exam-style question relevant to "${topic.text}"]</p>
  
  <p><strong>What the examiner is really asking:</strong><br>
  [One sentence revealing the hidden skill they're testing]</p>
  
  <p><strong>How marks are allocated:</strong><br>
  - Definition/identification: 1 mark<br>
  - Correct explanation of process: 2-3 marks<br>
  - Biological significance: 1 mark<br>
  - Relevant example: 1 mark</p>
  
  <p><strong>Step-by-step model answer:</strong></p>
  <ol>
    <li><strong>Step 1 — Define your terms:</strong> [Write the definition]</li>
    <li><strong>Step 2 — Describe the process:</strong> [Numbered sub-steps]</li>
    <li><strong>Step 3 — Explain the significance:</strong> [Why it matters]</li>
    <li><strong>Step 4 — Give an example:</strong> [Use a Nigerian example]</li>
  </ol>
  
  <p><strong>Common mistakes students make:</strong><br>
  - [Specific error] — <em>How to avoid:</em> [Strategy]<br>
  - [Specific error] — <em>How to avoid:</em> [Strategy]</p>
  
  <p><strong>Exam tip:</strong> [Specific actionable advice for this topic]</p>
</div>

Include 2-3 such examples. Make each question directly test the specific topic "${topic.text}". Use authentic-sounding WAEC/NECO/JAMB phrasing.`;
}


// ─── CPA-FOCUSED PROMPT BUILDER ──────────────────────────

export function buildSubjectPrompt(topic, topicIndex = 0) {
  const { text, subject, classLevel } = topic;
  const levelType = classLevel.startsWith('primary') ? 'primary' : classLevel.startsWith('jss') ? 'jss' : 'ss';
  const classNum = classLevel.split('-')[1];
  
  // Get seamless CPA structure based on level
  const cpaFramework = getSeamlessCPAFramework(levelType, classNum, text);
  
  return `You are a master ${getSubjectArea(levelType)} teacher creating a highly effective lesson on: "${text}"

## YOUR TEACHING PHILOSOPHY:
You use the CPA (Concrete, Pictorial, Abstract) instructional method, but you make it completely invisible to the student. You never start with abstract definitions. You seamlessly weave from physical reality (concrete), to visual models (pictorial), and finally to formal scientific theory (abstract).

## THE INVISIBLE LESSON FLOW (FOLLOW THIS EXACT SEQUENCE):

${cpaFramework.structure}

## CONTENT & EXAMPLES REQUIREMENTS:

${getContentRequirements(levelType, text)}

## LANGUAGE AND TONE:

${getLanguageGuide(levelType)}

${levelType === 'ss' ? getSSExamIntegration(text) : ''}

## CRITICAL FORMATTING RULES:
- DO NOT use structural labels as headings (Never use "Hook", "Concrete", "Pictorial", "Abstract", or "Exam Focus").
- DO NOT mention exam names like "WAEC", "NECO", or "JAMB".
- Use natural, engaging <h3> headings that relate directly to the lesson content (e.g., instead of "Abstract Stage", use "How the Heart Actually Pumps").
- Use <p> for paragraphs. Keep paragraphs short (3-4 sentences max) for easy reading.
- Use <ul>/<li> for lists where appropriate.
- Transition smoothly between the physical experience, the visualization, and the formal science so it reads like a natural, captivating story.
- Never use markdown (#, ##, etc.). Use only HTML tags.

Now write the complete lesson. Let it flow naturally.`;
}

function getSeamlessCPAFramework(levelType, classNum, topicText) {
  const frameworks = {
    primary: {
      structure: `
1. **The Opening (2-3 sentences)** — Grab attention using a relatable everyday question or short story.
2. **The Physical Connection** — Give the student a simple physical task they can do right now (e.g., "Touch your chest", "Go look at a leaf", "Take a deep breath"). Connect this physical feeling directly to the topic without using big words yet.
3. **The Mental Picture** — Paint a vivid picture using everyday Nigerian objects. (e.g., "Imagine the leaf is a tiny kitchen baking food..."). 
4. **The Science Concept** — Now, smoothly introduce the 1 or 2 scientific words for what they just felt and imagined. Keep definitions to a single, simple sentence.
5. **Quick Check** — End with a fun, simple question or mini-challenge to see if they understand.`
    },
    
    jss: {
      structure: `
1. **The Opening (3-4 sentences)** — Connect the topic to something they experience in their daily teenage life (sports, food, weather, etc.).
2. **The Real-World Experience** — Start with a physical experience they know well. Explain how this relates to "${topicText}" before using textbook definitions.
3. **The Visual Analogy** — Create an analogy using a system they understand (e.g., "Your blood vessels are like the Lagos road network"). Walk them through a mental diagram of the structures involved.
4. **The Formal Biology** — Seamlessly introduce the formal classification and proper terminology. Explain *how* the system works using proper JSS-level biological terms.
5. **Concept Application** — Ask 2-3 thought-provoking questions that require them to apply what they just learned to a new, everyday situation.`
    },
    
    ss: {
      structure: `
1. **The Opening (3-4 sentences)** — Open with a captivating clinical scenario, ecological crisis, or real-world biological mystery related to the topic.
2. **The Tangible Reality** — Ground the complex topic in a macroscopic phenomenon (e.g., a patient's symptoms, a plant surviving a drought). Show the visible consequences of the biological mechanism first.
3. **The System Visualization** — Verbally trace the anatomical pathway or structural system. Break down complex cycles into a clear, visual flow-chart style description. 
4. **The Biochemical/Physiological Mechanism** — Deliver the rigorous scientific theory. Provide the biochemical pathways, genetic principles, or physiological regulation. Use precise advanced terminology exclusively here.
5. **Knowledge Mastery** — Walk through a complex problem or scenario that tests their deep understanding of the concept, modeling how to answer it perfectly.`
    }
  };
  
  return frameworks[levelType];
}

function getSubjectArea(levelType) {
  const areas = { primary: 'Basic Science', jss: 'Basic Science', ss: 'Biology' };
  return areas[levelType];
}

function getContentRequirements(levelType, topicText) {
  const requirements = {
    primary: `For "${topicText}":
- Include a physical action the child can do immediately.
- Use only 1 or 2 big scientific words. Do not overwhelm them.
- Use examples from their immediate environment (chickens, dogs, mangoes, rain, soil).
- Focus strictly on WHAT it is and WHAT it does.`,
    
    jss: `For "${topicText}":
- Include relatable analogies (e.g., comparing cell parts to a school or factory).
- Provide step-by-step visualizations of biological processes.
- Introduce proper terminology immediately after the analogy.
- Make a clear distinction between structure (what it is) and function (what it does).`,
    
    ss: `For "${topicText}":
- Include a clear breakdown of the mechanism (the WHY, not just the WHAT).
- Use precise biochemical/physiological vocabulary (e.g., "concentration gradient", "active transport", "homeostasis").
- Provide a clinical, agricultural, or ecological application to show real-world relevance.`
  };
  
  return requirements[levelType];
}

function getLanguageGuide(levelType) {
  const guides = {
    primary: `**Language Rules:**
- Short, simple sentences (max 10-12 words).
- Speak directly to the child ("You", "Your").
- Be enthusiastic and encouraging.
- Never use complex causal chains (Avoid: "This causes X, which triggers Y").
- Use familiar Nigerian context (e.g., "Like when you eat yam...").`,
    
    jss: `**Language Rules:**
- Conversational but educational tone (like a smart older sibling).
- Use analogies heavily before using the scientific term.
- Sentence length can vary, but keep paragraphs short.
- Connect biological functions to things they care about.`,
    
    ss: `**Language Rules:**
- Academic, rigorous, yet accessible tone.
- Do not use "baby words" when explaining mechanisms. Use precise scientific vocabulary.
- Explain cause-and-effect clearly using terms like "consequently," "results in," "catalyzes."
- When explaining mechanisms, use chronological sequence (first, subsequently, finally).`
  };
  
  return guides[levelType];
}

function getSSExamIntegration(topicText) {
  return `## ADVANCED UNDERSTANDING CHECK:
At the very end of the lesson, include a challenging application section (but DO NOT call it an exam section or mention WAEC/JAMB).
Format it naturally like this:

<div class="concept-check">
  <h3>Test Your Understanding</h3>
  <p><strong>The Challenge:</strong> [Pose a difficult, real-world analytical question related to ${topicText} that tests for common misconceptions]</p>
  
  <p><strong>How to Break It Down:</strong></p>
  <ul>
    <li>[Point 1: The underlying principle]</li>
    <li>[Point 2: The structural/visual location]</li>
    <li>[Point 3: The biochemical/physiological outcome]</li>
  </ul>
</div>`;
}

// ─── HELPER FUNCTION TO GENERATE ALL PROMPTS ─────────────────
export function generateAllPrompts() {
  return SUBJECT_TOPICS.map((topic, index) => ({
    ...topic,
    prompt: buildSubjectPrompt(topic, index),
    hookStyle: HOOK_STYLES[index % HOOK_STYLES.length]
  }));
}


function getTeachingApproach(levelType, classNum, topicText) {
  const approaches = {
    primary: {
      philosophy: `You teach Primary ${classNum} students (ages ${classNum <= 3 ? '6-9' : '9-12'}). At this level, you introduce scientific concepts through observation, comparison, and simple classification. You use correct terminology alongside everyday language, always explaining what words mean. You focus on WHAT things are and WHAT they do, not complex mechanisms.`,
      
      structure: `
1. **Opening (2-3 sentences)** — Pose a question or observation that connects to the child's experience. Use correct terms but explain them immediately.
2. **Core Concept (10-12 sentences)** — Present 2-3 key ideas about the topic. For each: name it, describe it, give an example, explain its basic purpose.
3. **Check for Understanding (3-4 questions)** — Simple recall and application questions.
4. **Summary (2-3 sentences)** — Restate the key points using the correct terminology.`
    },
    
    jss: {
      philosophy: `You teach JSS ${classNum} students (ages ${classNum === 1 ? '11-12' : classNum === 2 ? '12-14' : '13-15'}). At this level, you introduce systematic biology: classification, structure-function relationships, and basic physiological processes. You establish correct terminology as the primary language of instruction. You teach HOW systems work and WHY they are organized as they are.`,
      
      structure: `
1. **Opening (3-4 sentences)** — Establish the biological significance of the topic. State what students will understand by the end.
2. **Concept Development (20-25 sentences)** — Organize into 3-4 subsections:
   - Definition and classification (where applicable)
   - Structural organization (components and their arrangement)
   - Function and mechanism (how it works)
   - Interconnections (how this relates to other systems/processes)
3. **Application (5-6 sentences)** — Connect to health, agriculture, or everyday biology.
4. **Review Questions (4-5 questions)** — Test conceptual understanding, not just recall.
5. **Summary (3-4 sentences)** — Synthesize the key principles.`
    },
    
    ss: {
      philosophy: `You teach SS ${classNum} students (ages ${classNum === 1 ? '15-16' : classNum === 2 ? '16-17' : '17-19'}). You are preparing students for WAEC, NECO, and JAMB. You teach biology as a rigorous science: biochemical mechanisms, physiological regulation, genetic principles, and ecological dynamics. You emphasize mechanisms over memorization, and application over definition.`,
      
      structure: `
1. **Opening (3-4 sentences)** — State the biological principle, its significance, and its examination relevance.
2. **Core Content (30-40 sentences)** — Organize into 4-5 subsections:
   - **Fundamental principles** (underlying concepts)
   - **Structural basis** (morphological/organization)
   - **Physiological mechanism** (how it functions)
   - **Regulation and control** (homeostasis, feedback)
   - **Clinical/ecological significance** (real-world application)
3. **Worked Examples (2-3)** — Exam-style questions with mark schemes and common errors.
4. **Summary (4-5 sentences)** — Key principles and exam strategies.`
    }
  };
  
  return approaches[levelType];
}

function getStyleGuide(levelType) {
  const guides = {
    primary: `**Primary Level (ages 6-12):**
- Speak warmly, like a patient aunt or uncle
- Use short, complete sentences (8-12 words max)
- Ask occasional questions to keep them engaged
- Use Nigerian examples: mango trees, chickens, goats, rain, harmattan
- Introduce new words gently: "This is called photosynthesis — a big word for how plants make food"
- End with a simple action: "Now go show someone what you learned"`,
    
    jss: `**JSS Level (ages 11-15):**
- Speak like a knowledgeable older sibling
- Connect to things they experience: sports, food, their changing bodies
- Use Nigerian examples: cassava farming, geckos, Lagos traffic, malaria
- Explain new terms in context: "Homeostasis — your body keeping everything just right"
- Call out common misconceptions directly
- End with "Try this" or "Ask yourself"`,
    
    ss: `**SS Level (ages 15-19):**
- Speak like a passionate teacher preparing students for exams
- Flag WAEC/NECO/JAMB patterns explicitly
- Explain WHY things work, not just WHAT
- Use clinical and real-world applications
- Connect topics across the curriculum
- Give exam strategy advice naturally`
  };
  return guides[levelType];
}

function getHookInstruction(levelType, hookStyle, topicText) {
  // Extract the topic to give the AI something specific to work with
  const topic = topicText.toLowerCase();
  
  const hooks = {
    primary: {
      question: `Write a 2-3 sentence question hook that makes a child curious. Start with "Did you know..." or "Have you ever wondered..." Make it specific to ${topic}. End with a promise to explain.

Example: "Did you know that a tiny seed inside a mango can travel far from its tree? It hitches a ride on wind, water, or even animals! Let me show you how."`,
      
      descriptive: `Write a 2-3 sentence descriptive hook that paints a picture. Ask them to imagine something specific about ${topic}. Use one sense (sight, sound, or touch). Keep it simple.

Example: "Imagine a tiny mango seed falling from a tall tree. It lands on soft soil, waiting for rain to wake it up. That's how new mango trees begin their journey."`,
      
      story: `Write a 2-3 sentence micro-story about ${topic}. Give a character a tiny problem and show how nature solves it. Use a Nigerian name.

Example: "Bola the mango seed was tired of sitting under his mother tree. 'I want to see the world!' he said. Then a bird came, picked him up, and dropped him in a new garden far away."`
    },
    
    jss: {
      question: `Write a 2-3 sentence question hook for JSS students about ${topic}. Connect to something they experience daily. Start with "Ever noticed..." or "Why do you think..."

Example: "Ever noticed how a mango tree can have seedlings growing far away from it? Those seeds didn't walk there. They used wind, water, or animals as free taxi rides."`,
      
      descriptive: `Write a 2-3 sentence descriptive hook for JSS students about ${topic}. Set a scene they recognize (Lagos evening, school break, harmattan morning). Add one sensory detail.

Example: "It's a windy afternoon in Lagos. You see a dry seed pod spinning through the air like a tiny helicopter. That seed is searching for a new home to grow."`,
      
      story: `Write a 3-4 sentence story hook for JSS students about ${topic}. Use a student their age or an animal they know. Add a small conflict resolved by the science.

Example: "Chidi planted a mango seed in his backyard. A week later, nothing. Two weeks, still nothing. 'Did it die?' he asked. His mother laughed. 'No, Chidi. It's sleeping. The rain will wake it up.'"`
    },
    
    ss: {
      question: `Write a 2-3 sentence question hook for SS students about ${topic}. Use an exam angle, misconception, or clinical application. Make them see why this matters for WAEC/NECO/JAMB.

Example: "WAEC frequently asks about seed dispersal, but most students lose marks because they describe the methods without explaining WHY each method matters for plant survival. Let me show you the difference between a 2-mark answer and a 5-mark answer."`,
      
      descriptive: `Write a 3-4 sentence descriptive hook for SS students about ${topic}. Build a mental model they can use to answer exam questions. Use precise scientific terms, then explain them.

Example: "Picture a seed as a baby plant in a suitcase. The suitcase has food (endosperm), a protective coat (testa), and a tiny embryo inside. Seed dispersal is how that suitcase travels to a new location where it can unpack and grow."`,
      
      story: `Write a 3-4 sentence story hook for SS students about ${topic}. Use a real case study, historical discovery, or ethical dilemma. Make it exam-relevant.

Example: "In 1854, a farmer in England noticed that his best crops grew near a hedge where birds rested. He realized the birds were eating berries from one field and dropping the seeds — with natural fertilizer — in another. That farmer had discovered what biologists now call endozoochory: seed dispersal through animal digestion."`
    }
  };
  
  return hooks[levelType][hookStyle];
}


// ─── EXPORT FOR USE IN OTHER FILES ─────────────────────────
export { HOOK_STYLES, HOOK_CONTENT };