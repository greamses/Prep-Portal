/**
 * modules/gemini.js
 * Gemini AI question generation — supports equation, expression, and word types.
 */

export const GEMINI_MODELS = [
    { label: 'Gemini 3.1 Flash-Lite', url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent' },
    { label: 'Gemini 3.1 Pro',        url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-pro-preview:generateContent' },
    { label: 'Gemini 3 Flash',        url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent' },
    { label: 'Gemini 2.5 Flash-Lite', url: 'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash-lite:generateContent' },
    { label: 'Gemini 2.5 Flash',      url: 'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent' },
    { label: 'Gemini 2.5 Pro',        url: 'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-pro:generateContent' },
];

// Topic → question type mapping (mirrors topics.js without importing to keep this module standalone)
const WORD_TOPICS = new Set([
    'Basic Patterns','Number Sequences','Word Problems','Ratios Intro',
    'Area & Perimeter','Ratios & Proportion','Word Problems (Algebra)',
    'Number Bases','Sets & Sequences',
]);
const EXPRESSION_TOPICS = new Set([
    'Order of Operations','Algebraic Simplification','Indices & Powers',
    'Factorization','Advanced Factorization','Binomial Theorem','Partial Fractions',
]);

function buildPrompt(topic, classId, method) {
    const isWord       = WORD_TOPICS.has(topic);
    const isExpression = EXPRESSION_TOPICS.has(topic);

    // Anti-repetition: inject random seed numbers
    const a = Math.floor(Math.random() * 80) + 5;
    const b = Math.floor(Math.random() * 40) + 3;
    const c = Math.floor(Math.random() * 20) + 2;

    const levelNote = `${classId} level (P1-P6 = Primary, JSS1-JSS3 = Junior Secondary, SS1-SS3 = Senior Secondary)`;
    const hintStyle = method === 'balancing'
        ? 'phrase the hint using the balancing method (do the same operation to both sides)'
        : 'phrase the hint using the transposing/transfer method (move terms across the equals sign)';

    if (isWord) {
        return `You are a math question generator for Nigerian school students.

Generate ONE word problem for the topic "${topic}" at ${levelNote}.

STRICT RULES:
- Write a realistic scenario using Nigerian names, places, or contexts where natural.
- Do NOT include an equation — the student writes one themselves.
- The "hint" is one sentence giving a formula or approach, not the answer.
- Vary numbers every time. Seed values for this question: ${a}, ${b}, ${c}.
- Match difficulty to the level.

Respond with ONLY a raw JSON object, nothing else:
{"type":"word","problem":"<problem text>","hint":"<one sentence hint>"}`;
    }

    if (isExpression) {
        return `You are a math expression generator for Nigerian school students.

Generate ONE expression (NO equals sign) for the topic "${topic}" at ${levelNote}.

STRICT RULES:
- "eq" is the unsimplified expression fed into Graspable Math canvas.
  Use ONLY: letters, digits, +, -, *, /, ^, parentheses. No spaces inside eq.
- "goal" is the fully simplified or factored form (ASCII, no spaces). Used for the hint only — not auto-checked.
- "hint" is one sentence describing what to do (simplify / expand / factorise / evaluate).
- Vary numbers every time. Seed values: ${a}, ${b}, ${c}.
- Match difficulty to the level.

Respond with ONLY a raw JSON object, nothing else:
{"type":"expression","eq":"<expression>","goal":"<simplified form>","hint":"<one sentence>"}`;
    }

    // Equation (default)
    return `You are an algebra question generator for Nigerian school students.

Generate ONE algebra equation for the topic "${topic}" at ${levelNote}.

STRICT RULES:
- "eq" is fed into Graspable Math. Use ONLY: letters, digits, +, -, *, /, ^, =, parentheses. No spaces inside eq.
- The equation MUST contain an equals sign.
- "goal" is the exact solution in ASCII with no spaces (e.g. "x=7" or "x=3,y=2").
- "hint" is one sentence. ${hintStyle}.
- The solution must be a clean integer or simple fraction.
- Vary numbers every time. Seed values: ${a}, ${b}, ${c}. Do NOT repeat the same values.

Respond with ONLY a raw JSON object, nothing else:
{"type":"equation","eq":"<equation>","goal":"<solution>","hint":"<one sentence>"}`;
}

/**
 * Generate a question via Gemini AI, trying models in chain order.
 * @throws if all models fail
 */
export async function generateWithGemini(topic, classId, method, apiKey) {
    const prompt = buildPrompt(topic, classId, method);
    let lastError = null;

    for (const model of GEMINI_MODELS) {
        const url = `${model.url}?key=${encodeURIComponent(apiKey)}`;
        try {
            console.log(`[AlgebraLab] Trying ${model.label}…`);
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: { temperature: 1.0, maxOutputTokens: 350 },
                }),
            });

            if (res.status === 404) {
                console.warn(`[AlgebraLab] ${model.label} not found, skipping…`);
                continue;
            }
            if (!res.ok) {
                const err = await res.text().catch(() => '');
                throw new Error(`HTTP ${res.status} — ${err.slice(0, 200)}`);
            }

            const data  = await res.json();
            const raw   = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
            const clean = raw.replace(/```[a-z]*\n?/gi, '').replace(/```/g, '').trim();
            const parsed = JSON.parse(clean);

            // Validate
            if (parsed.type === 'word') {
                if (!parsed.problem || !parsed.hint) throw new Error('Incomplete word fields');
            } else if (parsed.type === 'expression') {
                if (!parsed.eq || !parsed.hint) throw new Error('Incomplete expression fields');
            } else {
                parsed.type = 'equation';
                if (!parsed.eq || !parsed.goal || !parsed.hint) throw new Error('Incomplete equation fields');
                parsed.goal = parsed.goal.replace(/\s/g, '');
            }

            console.log(`[AlgebraLab] ✓ from ${model.label}:`, parsed);
            return parsed;

        } catch (err) {
            console.warn(`[AlgebraLab] ${model.label} failed:`, err.message);
            lastError = err;
        }
    }

    throw lastError || new Error('All Gemini models failed.');
}
