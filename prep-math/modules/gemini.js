/**
 * modules/gemini.js
 * Generates WORD PROBLEMS only via Gemini AI.
 * Equations, expressions, and inequalities are handled offline in generator.js.
 *
 * Called when: type === 'word' AND geminiKey is present.
 * If no key, the caller (script.js) should show a prompt to add a key.
 */

const GEMINI_MODELS = [
    { label: 'Gemini 3.1 Flash-Lite', url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent' },
    { label: 'Gemini 3.1 Pro',        url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-pro-preview:generateContent' },
    { label: 'Gemini 3 Flash',        url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent' },
    { label: 'Gemini 2.5 Flash-Lite', url: 'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash-lite:generateContent' },
    { label: 'Gemini 2.5 Flash',      url: 'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent' },
    { label: 'Gemini 2.5 Pro',        url: 'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-pro:generateContent' },
];

/**
 * Build a word-problem prompt from topic + subtopic.
 * Injects random seed numbers to prevent repetition.
 */
function buildWordPrompt(topic, subtopic, classId) {
    const a = Math.floor(Math.random() * 80) + 5;
    const b = Math.floor(Math.random() * 40) + 3;
    const levelNote = `"${classId}" level (P1-P6 = Primary, JSS1-JSS3 = Junior Secondary, SS1-SS3 = Senior Secondary)`;

    return `You are a math word problem generator for Nigerian school students.

Generate ONE word problem for the topic "${topic}", specifically about: "${subtopic}", at the ${levelNote}.

RULES:
- Write a realistic, age-appropriate scenario. Use Nigerian names, places, or contexts naturally.
- Do NOT include any equation, expression, or worked solution in the "problem" text — the student sets it up themselves.
- The "hint" is ONE sentence: a formula, method, or first step. Do not reveal the answer.
- Vary numbers on every call. Seed values for this question: ${a}, ${b}.
- Match difficulty strictly to the level.
- The problem must be clearly solvable using the concepts in "${subtopic}".

Respond with ONLY a raw JSON object — no markdown, no explanation:
{"type":"word","problem":"<problem text>","hint":"<one sentence hint>"}`;
}

/**
 * Generate a word problem via Gemini API, trying models in fallback chain order.
 *
 * @param {string} topic     - topic group name
 * @param {string} subtopic  - the specific subtopic string from topics.js
 * @param {string} classId   - e.g. 'jss2'
 * @param {string} apiKey    - Gemini API key
 * @returns {Promise<{type:'word', problem:string, hint:string}>}
 * @throws if all models fail
 */
export async function generateWordProblem(topic, subtopic, classId, apiKey) {
    const prompt = buildWordPrompt(topic, subtopic, classId);
    let lastError = null;

    for (const model of GEMINI_MODELS) {
        const url = `${model.url}?key=${encodeURIComponent(apiKey)}`;
        try {
            console.log(`[Gemini] Trying ${model.label}…`);

            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: { temperature: 1.0, maxOutputTokens: 350 },
                }),
            });

            if (res.status === 404) {
                console.warn(`[Gemini] ${model.label} not available, trying next…`);
                continue;
            }
            if (!res.ok) {
                const errText = await res.text().catch(() => '');
                throw new Error(`HTTP ${res.status} — ${errText.slice(0, 200)}`);
            }

            const data   = await res.json();
            const raw    = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
            const clean  = raw.replace(/```[a-z]*\n?/gi, '').replace(/```/g, '').trim();
            const parsed = JSON.parse(clean);

            if (parsed.type !== 'word' || !parsed.problem || !parsed.hint) {
                throw new Error(`Invalid word problem shape: ${clean}`);
            }

            console.log(`[Gemini] ✓ Word problem from ${model.label}`);
            return parsed;

        } catch (err) {
            console.warn(`[Gemini] ${model.label} failed:`, err.message);
            lastError = err;
        }
    }

    throw lastError || new Error('All Gemini models failed.');
}
