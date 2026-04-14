// modules/gemini-client.js

const GEMINI_MODELS = [
    { label: 'Gemini 3.1 Flash-Lite', url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent' },
    { label: 'Gemini 3.1 Pro', url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-pro-preview:generateContent' },
    { label: 'Gemini 3 Flash', url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent' },
    { label: 'Gemini 2.5 Flash-Lite', url: 'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash-lite:generateContent' },
    { label: 'Gemini 2.5 Flash', url: 'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent' },
    { label: 'Gemini 2.5 Pro', url: 'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-pro:generateContent' },
];

export async function generateWithGemini(classId, topic, method, apiKey, WORD_PROBLEM_TOPICS) {
    const isWordProblem = WORD_PROBLEM_TOPICS.has(topic);
    
    const a = Math.floor(Math.random() * 80) + 5;
    const b = Math.floor(Math.random() * 50) + 3;
    const c = Math.floor(Math.random() * 20) + 2;
    
    const hintStyle = method === 'balancing'
        ? 'phrase the hint using the balancing method (do the same to both sides)'
        : 'phrase the hint using the transposing/transfer method (move terms across the equals sign)';
    
    const prompt = isWordProblem
        ? `You are a math question generator for Nigerian school students.

Generate ONE word problem for the topic "${topic}" at the "${classId}" level.

STRICT RULES:
- Write a realistic, age-appropriate scenario. Use Nigerian names, places, or contexts.
- The student will read the problem and write the equation themselves.
- The "hint" is one friendly sentence giving a formula or approach.
- Vary the numbers. Use seeds: ${a}, ${b}, ${c}.

Respond with ONLY a raw JSON object: {"type":"word","problem":"...","hint":"..."}`

        : `You are an algebra question generator for Nigerian school students.

Generate ONE algebra question for the topic "${topic}" at the "${classId}" level.

STRICT RULES:
- The equation must be solvable by a student at that level.
- The "eq" field uses ONLY: letters, digits, +, -, *, /, ^, =, and parentheses. No spaces.
- The "goal" must be the exact simplified solution (e.g. "x=7").
- The "hint" is one friendly sentence. ${hintStyle}.
- Vary the numbers. Use seeds: ${a}, ${b}, ${c}.

Respond with ONLY a raw JSON object: {"type":"equation","eq":"...","goal":"...","hint":"..."}`;
    
    let lastError = null;
    
    for (const model of GEMINI_MODELS) {
        const url = `${model.url}?key=${encodeURIComponent(apiKey)}`;
        try {
            console.log(`[Gemini] Trying ${model.label}...`);
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: { temperature: 1.0, maxOutputTokens: 300 }
                })
            });
            
            if (res.status === 404) {
                console.warn(`${model.label} not found, trying next…`);
                continue;
            }
            
            if (!res.ok) {
                const errText = await res.text().catch(() => '');
                throw new Error(`HTTP ${res.status}`);
            }
            
            const data = await res.json();
            const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
            const clean = raw.replace(/```[a-z]*\n?/gi, '').replace(/```/g, '').trim();
            const parsed = JSON.parse(clean);
            
            if (parsed.type === 'word') {
                if (!parsed.problem || !parsed.hint) throw new Error('Invalid word problem');
            } else {
                if (!parsed.eq || !parsed.goal || !parsed.hint) throw new Error('Invalid equation');
                parsed.type = 'equation';
                parsed.goal = parsed.goal.replace(/\s/g, '');
            }
            
            console.log(`[Gemini] ✓ Question from ${model.label}`);
            return parsed;
            
        } catch (err) {
            console.warn(`${model.label} failed:`, err.message);
            lastError = err;
        }
    }
    
    throw lastError || new Error('All Gemini models failed.');
}