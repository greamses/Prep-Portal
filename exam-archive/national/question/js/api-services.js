/* ═══════════════════════════════════════════════════════════
   PREP PORTAL — WASSCE Practice Paper
   MODULE 2: API Services (Gemini & YouTube)
   ═══════════════════════════════════════════════════════════ */

'use strict';

// ── GEMINI API ─────────────────────────────────────────────────
async function callGemini(prompt, maxTokens = 600) {
    const key = geminiKey();
    if (!key) throw new Error('No Gemini key. Add your key in API Keys.');
    let lastErr = null;
    for (const model of GEMINI_MODELS) {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`;
        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: { temperature: 0.4, maxOutputTokens: maxTokens }
                })
            });
            if (res.status === 404) continue;
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const d = await res.json();
            return d?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
        } catch (e) { lastErr = e; }
    }
    throw lastErr || new Error('All Gemini models failed');
}

async function callGeminiChat(messages, maxTokens = 700) {
    const key = geminiKey();
    if (!key) throw new Error('No Gemini key.');
    const contents = messages.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
    }));
    let lastErr = null;
    for (const model of GEMINI_MODELS) {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`;
        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents, generationConfig: { temperature: 0.6, maxOutputTokens: maxTokens } })
            });
            if (res.status === 404) continue;
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const d = await res.json();
            return d?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
        } catch (e) { lastErr = e; }
    }
    throw lastErr || new Error('All Gemini models failed');
}

// ── YOUTUBE API ────────────────────────────────────────────────
async function searchYouTube(query, maxResults = 3) {
    const key = ytKey();
    if (!key) return [];
    try {
        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=${maxResults}&q=${encodeURIComponent(query)}&key=${encodeURIComponent(key)}`;
        const res = await fetch(url);
        if (!res.ok) return [];
        const d = await res.json();
        return (d.items || []).map(item => ({
            id: item.id.videoId,
            title: item.snippet.title,
            channel: item.snippet.channelTitle,
            thumb: item.snippet.thumbnails?.default?.url || ''
        }));
    } catch (e) { return []; }
}

// ── THEORY MARKING ─────────────────────────────────────────────
async function markTheory(question, studentAnswer, markScheme = '') {
    const prompt = `You are an experienced WAEC examiner.

QUESTION:
${question}
${markScheme ? `\nMARK SCHEME:\n${markScheme}` : ''}

STUDENT'S ANSWER:
${studentAnswer}

Mark out of 10. Be fair, constructive, and specific. Note what was correct and what was missing.

Respond ONLY as raw JSON (no markdown):
{"score":7,"outOf":10,"feedback":"Your explanation of X was correct. You missed Y."}`;
    
    const raw = await callGemini(prompt, 400);
    const clean = raw.replace(/```[a-z]*\n?/gi, '').replace(/```/g, '').trim();
    const p = JSON.parse(clean);
    if (p.score === undefined || !p.feedback) throw new Error('Bad AI response');
    return { score: p.score, outOf: p.outOf || 10, feedback: p.feedback };
}