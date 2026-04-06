// life-science-data.js - Life Sciences/Biology topics for Nigerian curriculum
// Replace this file for different subjects while keeping same structure

// ─── SUBJECT-SPECIFIC MODELS ─────────────────────────────────
export const SUBJECT_MODELS = {
  groq: [
    { label: 'Llama 3.3 70B', provider: 'groq', model: 'llama-3.3-70b-versatile' },
    { label: 'Llama 3.1 8B', provider: 'groq', model: 'llama-3.1-8b-instant' },
    { label: 'Mixtral 8x7B', provider: 'groq', model: 'mixtral-8x7b-32768' },
    { label: 'Gemma 2 9B', provider: 'groq', model: 'gemma2-9b-it' },
  ],
  gemini: [
    { label: 'Gemini 2.5 Flash-Lite', provider: 'gemini', url: 'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash-lite:generateContent' },
    { label: 'Gemini 2.5 Flash', provider: 'gemini', url: 'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent' },
    { label: 'Gemini 2.5 Pro', provider: 'gemini', url: 'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-pro:generateContent' },
  ]
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
  // Primary 1–3 (Basic Science - Living Things)
  { text: 'Living and non-living things: what makes something alive?', subject: 'lifescience', classLevel: 'primary-1', complexity: 'simple' },
  { text: 'Plants around us: trees, flowers, and grasses in our environment', subject: 'lifescience', classLevel: 'primary-1', complexity: 'simple' },
  { text: 'Animals in our home and community: domestic and wild animals', subject: 'lifescience', classLevel: 'primary-2', complexity: 'simple' },
  { text: 'Parts of a plant: roots, stem, leaves, flowers, and fruits', subject: 'lifescience', classLevel: 'primary-2', complexity: 'simple' },
  { text: 'What animals eat: herbivores, carnivores, and omnivores', subject: 'lifescience', classLevel: 'primary-3', complexity: 'simple' },
  { text: 'Life cycles of common animals: butterfly, frog, and chicken', subject: 'lifescience', classLevel: 'primary-3', complexity: 'simple' },
  
  // Primary 4–6 (Basic Science - Ecosystems & Body Systems)
  { text: 'The human skeleton: bones, joints, and how we move', subject: 'lifescience', classLevel: 'primary-4', complexity: 'standard' },
  { text: 'Photosynthesis: how plants make their own food', subject: 'lifescience', classLevel: 'primary-5', complexity: 'standard' },
  { text: 'Food chains and food webs: who eats whom in nature', subject: 'lifescience', classLevel: 'primary-5', complexity: 'standard' },
  { text: 'The digestive system: from mouth to stomach to intestines', subject: 'lifescience', classLevel: 'primary-6', complexity: 'standard' },
  { text: 'The circulatory system: heart, blood, and blood vessels', subject: 'lifescience', classLevel: 'primary-6', complexity: 'standard' },
  { text: 'Habitats and adaptations: how animals survive in their homes', subject: 'lifescience', classLevel: 'primary-6', complexity: 'standard' },
  
  // JSS (Junior Secondary) - Basic Science & Biology
  { text: 'Cell structure: the building blocks of all living things', subject: 'lifescience', classLevel: 'jss-1', complexity: 'standard' },
  { text: 'Classification of living things: Kingdoms and their characteristics', subject: 'lifescience', classLevel: 'jss-1', complexity: 'standard' },
  { text: 'Nutrition in plants: photosynthesis, mineral salts, and transport', subject: 'lifescience', classLevel: 'jss-2', complexity: 'standard' },
  { text: 'Nutrition in animals: digestive system and balanced diet', subject: 'lifescience', classLevel: 'jss-2', complexity: 'standard' },
  { text: 'Transport systems in plants: xylem, phloem, and transpiration', subject: 'lifescience', classLevel: 'jss-2', complexity: 'standard' },
  { text: 'Transport systems in animals: circulatory system and blood composition', subject: 'lifescience', classLevel: 'jss-2', complexity: 'standard' },
  { text: 'Respiration: aerobic vs anaerobic respiration in cells', subject: 'lifescience', classLevel: 'jss-3', complexity: 'standard' },
  { text: 'Reproduction in plants: pollination, fertilization, and seed dispersal', subject: 'lifescience', classLevel: 'jss-3', complexity: 'standard' },
  { text: 'Reproduction in animals: sexual and asexual reproduction', subject: 'lifescience', classLevel: 'jss-3', complexity: 'standard' },
  { text: 'Ecology: components of an ecosystem and energy flow', subject: 'lifescience', classLevel: 'jss-3', complexity: 'standard' },
  
  // SS (Senior Secondary) - Advanced Biology
  { text: 'Cell organelles and their functions: nucleus, mitochondria, chloroplasts', subject: 'lifescience', classLevel: 'ss-1', complexity: 'deep' },
  { text: 'Cell division: mitosis and meiosis compared in detail', subject: 'lifescience', classLevel: 'ss-1', complexity: 'deep' },
  { text: 'Enzymes: structure, mode of action, and factors affecting activity', subject: 'lifescience', classLevel: 'ss-1', complexity: 'deep' },
  { text: 'Genetics: Mendel\'s laws, inheritance patterns, and Punnett squares', subject: 'lifescience', classLevel: 'ss-2', complexity: 'deep' },
  { text: 'DNA and RNA: structure, replication, transcription, and translation', subject: 'lifescience', classLevel: 'ss-2', complexity: 'deep' },
  { text: 'Evolution: natural selection, adaptation, and evidence for evolution', subject: 'lifescience', classLevel: 'ss-2', complexity: 'deep' },
  { text: 'The nervous system: neurons, synapses, and reflex arcs', subject: 'lifescience', classLevel: 'ss-2', complexity: 'deep' },
  { text: 'The endocrine system: hormones and their regulatory functions', subject: 'lifescience', classLevel: 'ss-2', complexity: 'deep' },
  { text: 'Ecology: population dynamics, succession, and conservation', subject: 'lifescience', classLevel: 'ss-3', complexity: 'deep' },
  { text: 'Variation and evolution: sources of genetic variation', subject: 'lifescience', classLevel: 'ss-3', complexity: 'deep' },
  { text: 'The excretory system: kidneys, nephrons, and osmoregulation', subject: 'lifescience', classLevel: 'ss-3', complexity: 'deep' },
  { text: 'The immune system: antigens, antibodies, and immunity types', subject: 'lifescience', classLevel: 'ss-3', complexity: 'deep' },
  { text: 'Biotechnology: applications in medicine, agriculture, and industry', subject: 'lifescience', classLevel: 'ss-3', complexity: 'deep' },
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

// ─── PROMPT BUILDER (Life Sciences Focus) ─────────────────
export function buildSubjectPrompt(topic) {
  const { text, subject, classLevel } = topic;
  const subjectLabel = SUBJECT_LABELS[subject] || SUBJECT_CONFIG.name;
  const levelType = classLevel.startsWith('primary') ? 'primary' : classLevel.startsWith('jss') ? 'jss' : 'ss';
  const classNum = classLevel.split('-')[1];
  const classLabel = CLASS_LABELS[levelType] ? CLASS_LABELS[levelType](classNum) : classLevel;
  
  const toneGuide = {
    primary: `You are a warm, patient primary school teacher (ages 6–12) explaining life science. Use:
- Very short sentences. One idea per sentence.
- Everyday examples from Nigerian life (mango trees, chickens, goats, rain).
- Encouraging phrases like "Good question!", "Here's the cool part:", "Can you find a plant near your home?"
- Simple words: "baby animals" instead of "offspring", "food factory" instead of "photosynthesis".
- Active voice: "Look at the leaves on that tree..."`,
    
    jss: `You are a JSS biology teacher making life sciences click for 11–15 year olds. Your style:
- Friendly and direct — like explaining to a smart classmate.
- Introduce each new term with a plain-English explanation in brackets. Example: "photosynthesis (the process where plants use sunlight to make food — like cooking with sunshine)".
- Use Nigerian examples: cassava plants, local birds, rainy season breeding.
- Break concepts into small digestible chunks.
- Ask rhetorical questions to keep engagement: "Have you ever wondered why...?"
- Address common misconceptions: "Many students think all bacteria are bad — but here's the truth."`,
    
    ss: `You are an SS biology teacher preparing students aged 15–19 for WAEC, NECO, and JAMB exams. Your approach:
- Rigorous but engaging — think "future doctor or biologist".
- Flag exam patterns explicitly: "WAEC loves to ask about the structure of the heart..."
- Teach the WHY behind biological processes, not just the WHAT.
- Include clinical and real-world applications.
- Use correct terminology while explaining it clearly.
- Anticipate misconceptions: "Students often confuse mitosis and meiosis — here's how to remember the difference."
- Include diagrams described in words (since no images allowed).`
  } [levelType];
  
  const hookGuide = {
    primary: `Open your first <p> with a short, exciting question or surprising fact. Examples:
- "Did you know that a tree can make its own food? Let me show you how."
- "Have you ever watched a caterpillar turn into a butterfly? It's like magic — but it's science!"
- "Close your eyes and feel your heart beating. That thump-thump keeps you alive. Let's find out why."`,
    
    jss: `Open with a real-world scenario or "Did you know" fact. Examples:
- "Every time you eat a mango, you're helping a plant reproduce. Here's how seeds work."
- "Why do your muscles get tired after running? The answer is inside your cells."
- "Have you noticed that birds build nests before laying eggs? That's not just a habit — it's survival."`,
    
    ss: `Open by exposing a common misconception OR showing an exam-style question. Examples:
- "Most SS students lose 4–6 marks in WAEC Biology on genetics — not because it's hard, but because they confuse key terms. Let's fix that."
- "Before we start: Can you explain why the mitochondria is called the 'powerhouse of the cell'? If your answer is just 'it makes energy,' keep reading — there's more to the story."
- "Here's a WAEC question from last year: 'Describe the process of meiosis and explain its importance.' Let's break down exactly how to answer this for full marks."`
  } [levelType];
  
  const workedExamples = levelType === 'ss' ? `
  
WORKED EXAMPLES — MANDATORY FOR SS:
Include at least 2 exam-style questions with full solutions. Format each one:

<div class="worked-example">
  <h4>WAEC/NECO Style Question 1:</h4>
  <p><strong>Question:</strong> [Full exam question]</p>
  <p><strong>Step-by-step solution:</strong></p>
  <ol>
    <li>[First step with explanation]</li>
    <li>[Second step]</li>
    <li>[Final answer]</li>
  </ol>
  <p class="exam-tip"><strong>Exam tip:</strong> [What examiners look for]</p>
</div>` : '';
  
  return `You are an expert Life Sciences/Biology educator for Nigerian students writing a structured lesson article for "Prep Portal 2026".

YOUR ROLE: You are TEACHING living systems — from cells to ecosystems. Make complex biological concepts clear, memorable, and connected to real life.

SUBJECT: ${subjectLabel}
CLASS LEVEL: ${classLabel} (${levelType === 'primary' ? 'ages 6–12' : levelType === 'jss' ? 'ages 11–15' : 'ages 15–19, WAEC/NECO/JAMB'})
TOPIC: ${text}
LESSON LENGTH: ${levelType === 'primary' ? '3–4 minutes reading time' : levelType === 'jss' ? '4–6 minutes' : '7–9 minutes'}

YOUR TEACHING STYLE:
${toneGuide}

LESSON STRUCTURE — follow this exactly:

1. <h1> TITLE
   Make it specific and curiosity-provoking.
   Bad: "The Digestive System"
   Good: "Where Does Your Food Go? A Journey Through Your Digestive System"

2. OPENING HOOK (first <p> after the title)
${hookGuide}

3. LESSON SECTIONS (3–5 × <h2> + <p> paragraphs)
   Each <h2> should read like a teaching step, not a textbook chapter.
   Bad heading: "Definition of Photosynthesis"
   Good heading: "How Plants Cook Their Own Food (Without a Kitchen)"
   
   Inside each section:
   - Explain the concept clearly FIRST in plain language.
   - Then introduce formal definitions and terminology.
   - Use analogies from everyday Nigerian life.
   - For processes, break them into numbered steps.
   - Use short connecting phrases: "Now here's where it gets interesting...", "Think of it this way...", "Before we move on..."

4. KEY POINTS OR STEPS
   Include at least one <ol> or <ul> with:
   - For biological processes: use <ol> with numbered steps
   - For summary points or characteristics: use <ul> with bullet points
   - For comparisons (mitosis vs meiosis): use a clear list format

5. REAL-WORLD CONNECTION
   Include a paragraph connecting the topic to Nigerian examples:
   - Agriculture (cassava, maize, cocoa, palm oil)
   - Local animals (goats, chickens, cattle, native birds)
   - Health issues (malaria, nutrition, hygiene)
   - Environmental topics (rainforest, savanna, Niger Delta)

${workedExamples}

6. CLOSING PARAGRAPH
   End with:
   - One sentence summarising what the student now knows
   - One specific action they can take (e.g., "Draw and label a plant cell", "Explain this to a friend", "Try this observation at home")
   - One word of genuine encouragement

HARD RULES:
- Output ONLY clean HTML body content starting from the <h1>. No <html>, no <head>, no markdown.
- NO <img> tags whatsoever — images are added by admin.
- No filler phrases like "In this article, we will explore..." or "As you can see...".
- Every single sentence must teach something or guide understanding.
- For SS level ${levelType === 'ss' ? 'include worked examples as specified above' : 'focus on clear explanations with Nigerian examples'}.
- All biological facts must be accurate and current.

METADATA (keep this comment): <!-- subject:${subject} classLevel:${classLevel} -->`;
}