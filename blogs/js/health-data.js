// health-data.js - Replace this entire file for different subjects
// For Physics, create physics-data.js with the same structure
// For Chemistry, create chemistry-data.js with the same structure
// etc.

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
  name: 'Health Sciences',
  collectionName: 'health-posts', // Firestore collection name
  source: 'auto-health-v1', // Source identifier
  apiKeyField: 'geminiKey', // Field name in user doc for API keys
  groqKeyField: 'groqKey',
};

// ─── SUBJECT-SPECIFIC TOPICS ─────────────────────────────────
export const SUBJECT_TOPICS = [
  // Primary 1–3 (Basic Health)
  { text: 'Personal hygiene: washing hands, brushing teeth, and bathing', subject: 'health', classLevel: 'primary-1', complexity: 'simple' },
  { text: 'Healthy eating: fruits, vegetables, and drinking clean water', subject: 'health', classLevel: 'primary-2', complexity: 'simple' },
  { text: 'Exercise and rest: why moving our bodies and sleeping matter', subject: 'health', classLevel: 'primary-2', complexity: 'simple' },
  { text: 'Keeping our environment clean: waste disposal and sanitation', subject: 'health', classLevel: 'primary-3', complexity: 'simple' },
  { text: 'Common illnesses: malaria, cold, and how to prevent them', subject: 'health', classLevel: 'primary-3', complexity: 'simple' },
  
  // Primary 4–6 (Basic Health)
  { text: 'The five senses and how they protect our body', subject: 'health', classLevel: 'primary-4', complexity: 'standard' },
  { text: 'First aid basics: treating minor cuts, burns, and bruises', subject: 'health', classLevel: 'primary-5', complexity: 'standard' },
  { text: 'Nutrition: carbohydrates, proteins, fats, vitamins, and minerals', subject: 'health', classLevel: 'primary-6', complexity: 'standard' },
  { text: 'Diseases and prevention: germs, vaccination, and immunity', subject: 'health', classLevel: 'primary-6', complexity: 'standard' },
  
  // JSS (Junior Secondary) - Health Science
  { text: 'The human digestive system: from mouth to stomach to intestines', subject: 'health', classLevel: 'jss-1', complexity: 'standard' },
  { text: 'The respiratory system: how we breathe and exchange gases', subject: 'health', classLevel: 'jss-1', complexity: 'standard' },
  { text: 'The circulatory system: heart, blood vessels, and blood components', subject: 'health', classLevel: 'jss-2', complexity: 'standard' },
  { text: 'The excretory system: kidneys, skin, lungs removing waste', subject: 'health', classLevel: 'jss-2', complexity: 'standard' },
  { text: 'Reproductive health: puberty, hygiene, and understanding changes', subject: 'health', classLevel: 'jss-3', complexity: 'standard' },
  { text: 'Communicable diseases: HIV/AIDS, tuberculosis, and prevention', subject: 'health', classLevel: 'jss-3', complexity: 'standard' },
  { text: 'Drug abuse: effects of tobacco, alcohol, and illicit drugs', subject: 'health', classLevel: 'jss-3', complexity: 'standard' },
  
  // SS (Senior Secondary) - Health Science / Biology
  { text: 'Cell structure and function: organelles and their roles in health', subject: 'health', classLevel: 'ss-1', complexity: 'deep' },
  { text: 'The skeletal system: bones, joints, and protection of organs', subject: 'health', classLevel: 'ss-1', complexity: 'deep' },
  { text: 'The muscular system: muscle types, contraction, and movement', subject: 'health', classLevel: 'ss-1', complexity: 'deep' },
  { text: 'The nervous system: brain, spinal cord, and nerve impulses', subject: 'health', classLevel: 'ss-2', complexity: 'deep' },
  { text: 'The endocrine system: hormones and their regulatory functions', subject: 'health', classLevel: 'ss-2', complexity: 'deep' },
  { text: 'Immunity and vaccination: how vaccines work and herd immunity', subject: 'health', classLevel: 'ss-2', complexity: 'deep' },
  { text: 'Public health: epidemiology, disease surveillance, and prevention', subject: 'health', classLevel: 'ss-3', complexity: 'deep' },
  { text: 'Maternal and child health: antenatal care, nutrition, and vaccination', subject: 'health', classLevel: 'ss-3', complexity: 'deep' },
  { text: 'Mental health: stress, anxiety, depression, and coping strategies', subject: 'health', classLevel: 'ss-3', complexity: 'deep' },
  { text: 'Non-communicable diseases: diabetes, hypertension, and cancer', subject: 'health', classLevel: 'ss-3', complexity: 'deep' },
];

// ─── SUBJECT LABELS & STYLES ───────────────────────────────
export const SUBJECT_LABELS = {
  health: 'Health Sciences',
  'health-science': 'Health Science'
};

export const SUBJECT_STYLES = {
  health: 'sci-health',
  'health-science': 'sci-health'
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

// ─── PROMPT BUILDER (Subject-Specific) ─────────────────────
export function buildSubjectPrompt(topic) {
  const { text, subject, classLevel } = topic;
  const subjectLabel = SUBJECT_LABELS[subject] || SUBJECT_CONFIG.name;
  const levelType = classLevel.startsWith('primary') ? 'primary' : classLevel.startsWith('jss') ? 'jss' : 'ss';
  const classNum = classLevel.split('-')[1];
  const classLabel = CLASS_LABELS[levelType] ? CLASS_LABELS[levelType](classNum) : classLevel;
  
  const toneGuide = {
    primary: `You are a warm, caring primary school teacher (ages 6-12) explaining health concepts. Use:
- Very short sentences. One idea per sentence.
- Everyday examples (washing hands, eating fruits, covering mouth when coughing).
- Encouraging phrases like "Good job!", "Here's how to stay healthy:", "Can you try this at home?"
- Simple words for body parts and health habits.
- Active voice: "You can keep germs away by..."`,
    
    jss: `You are a JSS teacher explaining health science to 11-15 year olds. Your style:
- Friendly and direct — like explaining to a smart classmate.
- Introduce new terms with plain-English explanations in brackets.
- Use Nigerian everyday health examples: malaria from mosquitoes, drinking clean water, vaccines at health centres.
- Break body systems into small digestible chunks.
- Address common misconceptions.`,
    
    ss: `You are an SS teacher preparing students aged 15-19 for WAEC, NECO, and JAMB exams. Your approach:
- Rigorous but practical — think "future healthcare professional".
- Flag exam patterns: "WAEC often asks about the pathway of blood..."
- Connect body systems to real diseases and public health.
- Include clinical applications.
- Anticipate misconceptions about health and disease.`
  } [levelType];
  
  const hookGuide = {
    primary: `Open with an exciting question a child cannot ignore. Examples:
- "Did you know that washing your hands with soap can save your life?"
- "Have you ever wondered why you sneeze? Your body is protecting you!"
- "What happens to your food after you swallow it?"`,
    
    jss: `Open with a real-world health scenario students encounter. Examples:
- "Imagine you wake up with a fever and body aches. What's happening inside you?"
- "Every time you breathe, your lungs are doing something amazing."
- "Why do nurses check your temperature before you see the doctor?"`,
    
    ss: `Open by exposing a common misconception or showing an exam question. Examples:
- "Most students can name the heart, but can you trace blood through all four chambers?"
- "Before we start: Why does malaria give you a fever? If you said 'because of the mosquito,' keep reading."
- "In Nigeria, 1 in 4 adults has high blood pressure and doesn't know it."`
  } [levelType];
  
  return `You are an expert ${subjectLabel} educator for Nigerian students writing a structured lesson article for "Prep Portal 2026".

YOUR ROLE: You are TEACHING — making complex concepts clear, practical, and memorable.

SUBJECT: ${subjectLabel}
CLASS LEVEL: ${classLabel} (${levelType === 'primary' ? 'ages 6-12' : levelType === 'jss' ? 'ages 11-15' : 'ages 15-19, WAEC/NECO/JAMB'})
TOPIC: ${text}
LESSON LENGTH: ${levelType === 'primary' ? '3-4 minutes' : levelType === 'jss' ? '4-6 minutes' : '7-9 minutes'}

YOUR TEACHING STYLE:
${toneGuide}

LESSON STRUCTURE:
1. <h1> TITLE (curiosity-provoking)
2. OPENING HOOK (first <p>): ${hookGuide}
3. LESSON SECTIONS (3-5 × <h2> + <p>)
4. KEY POINTS OR STEPS (<ol> or <ul>)
5. ${levelType === 'ss' ? 'EXAM QUESTIONS SECTION (<div class="exam-questions">)' : 'PRACTICAL TIPS SECTION'}
6. CLOSING PARAGRAPH (summary + action + encouragement)

HARD RULES:
- Output ONLY clean HTML starting from <h1>. No <html>, no <head>, no markdown.
- NO <img> tags — images added by admin.
- No filler phrases like "In this article, we will explore..."
- For SS level, include 1-2 exam-style questions.
- All health facts must be accurate based on current medical knowledge.

METADATA: <!-- subject:${subject} classLevel:${classLevel} -->`;
}