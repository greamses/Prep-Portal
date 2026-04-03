/* ═══════════════════════════════════════════════════════════
   PREP PORTAL — WASSCE Practice Paper
   MODULE 2: API Services (Gemini & YouTube with Embedded Playback)
   ═══════════════════════════════════════════════════════════ */

'use strict';

// ── GEMINI CONFIGURATION ───────────────────────────────────────
const GEMINI_MODELS = [
    { label: 'Gemini 3.1 Flash-Lite', url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent' },
    { label: 'Gemini 3.1 Pro', url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-pro-preview:generateContent' },
    { label: 'Gemini 3 Flash', url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent' },
    { label: 'Gemini 2.5 Flash-Lite', url: 'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash-lite:generateContent' },
    { label: 'Gemini 2.5 Flash', url: 'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent' },
    { label: 'Gemini 2.5 Pro', url: 'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-pro:generateContent' },
];

// ── GEMINI API CALLS ───────────────────────────────────────────
async function callGemini(prompt, maxTokens = 600) {
    const key = geminiKey();
    if (!key) throw new Error('No Gemini key. Add your key in API Keys.');
    let lastErr = null;
    for (const model of GEMINI_MODELS) {
        const url = `${model.url}?key=${encodeURIComponent(key)}`;
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
        } catch(e) { lastErr = e; }
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
        const url = `${model.url}?key=${encodeURIComponent(key)}`;
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
        } catch(e) { lastErr = e; }
    }
    throw lastErr || new Error('All Gemini models failed');
}

// ── VIDEO CACHE ────────────────────────────────────────────────
const VIDEO_CACHE = {};

// ── POPULAR CHANNELS BY SUBJECT (PRIORITIZED) ─────────────────
function getPopularChannels(subject, level) {
    const isPrimary = /primary|pry|grade [123456]/i.test(level);
    const isJSS = /jss|junior secondary|grade [789]/i.test(level);
    const isSecondary = /sss|senior secondary|grade 10|grade 11|grade 12|waec/i.test(level);

    // ========== CHEMISTRY ==========
    if (/chemistry/i.test(subject)) {
        return [
            { name: 'The Organic Chemistry Tutor', handle: 'theorganicchemistrytutor', priority: 1, category: 'Chemistry' },
            { name: 'Khan Academy', handle: 'khanacademy', priority: 1, category: 'Chemistry' },
            { name: 'Tyler DeWitt', handle: 'tylerdewitt', priority: 1, category: 'Chemistry' },
            { name: 'Professor Dave Explains', handle: 'professordaveexplains', priority: 1, category: 'Chemistry' },
            { name: 'Crash Course Chemistry', handle: 'crashcourse', priority: 2, category: 'Chemistry' },
            { name: 'Melissa Maribel', handle: 'melissamaribel', priority: 2, category: 'Chemistry' },
            { name: 'Bozeman Science', handle: 'bozemanscience', priority: 2, category: 'Chemistry' }
        ];
    }

    // ========== PHYSICS ==========
    if (/physics/i.test(subject)) {
        if (isPrimary) {
            return [
                { name: 'SciShow Kids', handle: 'scishowkids', priority: 1, category: 'Physics' },
                { name: 'Peekaboo Kidz', handle: 'peekabookidz', priority: 1, category: 'Physics' }
            ];
        }
        return [
            { name: 'The Organic Chemistry Tutor', handle: 'theorganicchemistrytutor', priority: 1, category: 'Physics' },
            { name: 'Khan Academy', handle: 'khanacademy', priority: 1, category: 'Physics' },
            { name: 'Veritasium', handle: 'veritasium', priority: 1, category: 'Physics' },
            { name: 'MinutePhysics', handle: 'minutephysics', priority: 1, category: 'Physics' },
            { name: 'Professor Dave Explains', handle: 'professordaveexplains', priority: 1, category: 'Physics' },
            { name: 'Flipping Physics', handle: 'flippingphysics', priority: 2, category: 'Physics' }
        ];
    }

    // ========== BIOLOGY ==========
    if (/biology/i.test(subject)) {
        if (isPrimary) {
            return [
                { name: 'SciShow Kids', handle: 'scishowkids', priority: 1, category: 'Biology' },
                { name: 'Peekaboo Kidz', handle: 'peekabookidz', priority: 1, category: 'Biology' }
            ];
        }
        return [
            { name: 'Amoeba Sisters', handle: 'amoebasisters', priority: 1, category: 'Biology' },
            { name: 'Khan Academy', handle: 'khanacademy', priority: 1, category: 'Biology' },
            { name: 'Professor Dave Explains', handle: 'professordaveexplains', priority: 1, category: 'Biology' },
            { name: 'Crash Course Biology', handle: 'crashcourse', priority: 1, category: 'Biology' },
            { name: 'Bozeman Science', handle: 'bozemanscience', priority: 2, category: 'Biology' }
        ];
    }

    // ========== MATHEMATICS ==========
    if (/math|maths/i.test(subject)) {
        if (isPrimary) {
            return [
                { name: 'Numberblocks', handle: 'learningblocks', priority: 1, category: 'Math' },
                { name: 'Math Antics', handle: 'mathantics', priority: 1, category: 'Math' },
                { name: 'Khan Academy', handle: 'khanacademy', priority: 1, category: 'Math' }
            ];
        }
        if (isJSS) {
            return [
                { name: 'Math Antics', handle: 'mathantics', priority: 1, category: 'Math' },
                { name: 'Khan Academy', handle: 'khanacademy', priority: 1, category: 'Math' },
                { name: 'The Organic Chemistry Tutor', handle: 'theorganicchemistrytutor', priority: 1, category: 'Math' }
            ];
        }
        return [
            { name: 'The Organic Chemistry Tutor', handle: 'theorganicchemistrytutor', priority: 1, category: 'Math' },
            { name: 'Khan Academy', handle: 'khanacademy', priority: 1, category: 'Math' },
            { name: '3Blue1Brown', handle: '3blue1brown', priority: 1, category: 'Math' },
            { name: 'Professor Dave Explains', handle: 'professordaveexplains', priority: 1, category: 'Math' },
            { name: 'blackpenredpen', handle: 'blackpenredpen', priority: 2, category: 'Math' },
            { name: 'Eddie Woo', handle: 'misterwootube', priority: 2, category: 'Math' }
        ];
    }

    // ========== ENGLISH LANGUAGE ==========
    if (/english/i.test(subject)) {
        if (isPrimary) {
            return [
                { name: 'Alphablocks', handle: 'learningblocks', priority: 1, category: 'English' },
                { name: 'Scratch Garden', handle: 'scratchgarden', priority: 1, category: 'English' },
                { name: 'Jack Hartmann', handle: 'jackhartmann', priority: 1, category: 'English' }
            ];
        }
        return [
            { name: 'TED-Ed', handle: 'teded', priority: 1, category: 'English' },
            { name: 'CrashCourse', handle: 'crashcourse', priority: 1, category: 'English' },
            { name: 'English with Lucy', handle: 'englishwithlucy', priority: 1, category: 'English' },
            { name: 'BBC Learning English', handle: 'bbclearningenglish', priority: 1, category: 'English' },
            { name: 'Khan Academy', handle: 'khanacademy', priority: 2, category: 'English' }
        ];
    }

    // ========== LITERATURE ==========
    if (/literature/i.test(subject)) {
        return [
            { name: 'TED-Ed', handle: 'teded', priority: 1, category: 'Literature' },
            { name: 'CrashCourse', handle: 'crashcourse', priority: 1, category: 'Literature' },
            { name: 'The School of Life', handle: 'theschooloflifetv', priority: 1, category: 'Literature' },
            { name: 'Overly Sarcastic Productions', handle: 'overlysarcasticproductions', priority: 2, category: 'Literature' }
        ];
    }

    // ========== HISTORY ==========
    if (/history/i.test(subject)) {
        return [
            { name: 'CrashCourse', handle: 'crashcourse', priority: 1, category: 'History' },
            { name: 'TED-Ed', handle: 'teded', priority: 1, category: 'History' },
            { name: 'Kings and Generals', handle: 'kingsandgenerals', priority: 1, category: 'History' },
            { name: 'Overly Sarcastic Productions', handle: 'overlysarcasticproductions', priority: 2, category: 'History' }
        ];
    }

    // ========== GOVERNMENT / CIVIC ==========
    if (/government|civic/i.test(subject)) {
        return [
            { name: 'CrashCourse', handle: 'crashcourse', priority: 1, category: 'Government' },
            { name: 'TED-Ed', handle: 'teded', priority: 1, category: 'Government' },
            { name: 'CGP Grey', handle: 'cgpgrey', priority: 1, category: 'Government' }
        ];
    }

    // ========== GEOGRAPHY ==========
    if (/geography/i.test(subject)) {
        if (isPrimary) {
            return [
                { name: 'National Geographic Kids', handle: 'natgeokids', priority: 1, category: 'Geography' },
                { name: 'SciShow Kids', handle: 'scishowkids', priority: 1, category: 'Geography' }
            ];
        }
        return [
            { name: 'Geography Now', handle: 'geographynow', priority: 1, category: 'Geography' },
            { name: 'Khan Academy', handle: 'khanacademy', priority: 1, category: 'Geography' },
            { name: 'CrashCourse', handle: 'crashcourse', priority: 2, category: 'Geography' }
        ];
    }

    // ========== ECONOMICS ==========
    if (/economics/i.test(subject)) {
        return [
            { name: 'CrashCourse', handle: 'crashcourse', priority: 1, category: 'Economics' },
            { name: 'ACDC Econ', handle: 'acdcecon', priority: 1, category: 'Economics' },
            { name: 'Economics Explained', handle: 'economicsexplained', priority: 1, category: 'Economics' },
            { name: 'Khan Academy', handle: 'khanacademy', priority: 2, category: 'Economics' }
        ];
    }

    // ========== ACCOUNTING / COMMERCE ==========
    if (/accounting|commerce|financial/i.test(subject)) {
        return [
            { name: 'Accounting Stuff', handle: 'accountingstuff', priority: 1, category: 'Accounting' },
            { name: 'Khan Academy', handle: 'khanacademy', priority: 1, category: 'Accounting' },
            { name: 'Edspira', handle: 'edspira', priority: 2, category: 'Accounting' }
        ];
    }

    // ========== COMPUTER / ICT ==========
    if (/computer|ict/i.test(subject)) {
        if (isPrimary) {
            return [
                { name: 'Code.org', handle: 'codeorg', priority: 1, category: 'Computer' },
                { name: 'Scratch Team', handle: 'scratch', priority: 1, category: 'Computer' }
            ];
        }
        return [
            { name: 'CS50 Harvard', handle: 'cs50', priority: 1, category: 'Computer' },
            { name: 'Computerphile', handle: 'computerphile', priority: 1, category: 'Computer' },
            { name: 'Khan Academy', handle: 'khanacademy', priority: 1, category: 'Computer' },
            { name: 'Fireship', handle: 'fireship', priority: 2, category: 'Computer' }
        ];
    }

    // ========== AGRICULTURE ==========
    if (/agricultural|agric/i.test(subject)) {
        return [
            { name: 'Khan Academy', handle: 'khanacademy', priority: 1, category: 'Agriculture' },
            { name: 'Real Agriculture', handle: 'realagriculture', priority: 2, category: 'Agriculture' }
        ];
    }

    // ========== DEFAULT (Any Subject) ==========
    return [
        { name: 'Khan Academy', handle: 'khanacademy', priority: 1, category: 'General' },
        { name: 'CrashCourse', handle: 'crashcourse', priority: 1, category: 'General' },
        { name: 'TED-Ed', handle: 'teded', priority: 1, category: 'General' },
        { name: 'The Organic Chemistry Tutor', handle: 'theorganicchemistrytutor', priority: 2, category: 'General' },
        { name: 'Professor Dave Explains', handle: 'professordaveexplains', priority: 2, category: 'General' }
    ];
}

// ── SCORE TITLE FOR RELEVANCE (NO WAEC) ────────────────────────
function scoreTitle(title, keywords) {
    const t = title.toLowerCase();
    
    // EXCLUDE: WAEC, JAMB, NECO, exam prep specific
    const blacklist = [
        'waec', 'jamb', 'neco', 'utme', 'post-utme',
        'hindi', 'urdu', 'tamil', 'malayalam', 'telugu',
        'cbse', 'ncert', 'jee', 'neet', 'iit', 'aakash',
        'byjus', 'vedantu', 'unacademy', 'physics wallah'
    ];
    
    if (blacklist.some(word => t.includes(word))) return -100;
    
    // Prioritize educational keywords
    const positiveKeywords = ['tutorial', 'lesson', 'explained', 'introduction', 'basics', 'crash course'];
    let score = 0;
    
    if (keywords?.length) {
        score += keywords.filter(kw => t.includes(kw.toLowerCase())).length * 2;
    }
    
    score += positiveKeywords.filter(kw => t.includes(kw)).length;
    
    return score || 1;
}

// ── YOUTUBE SEARCH WITH EMBEDDED PLAYBACK ──────────────────────
async function ytSearch(query, keywords, channelHandle = null) {
    const key = ytKey();
    if (!key) return null;
    
    let searchQuery = query;
    if (channelHandle) {
        searchQuery = `${query} ${channelHandle}`;
    }
    
    // Remove any WAEC references from query
    searchQuery = searchQuery.replace(/waec|jamb|neco/gi, '').trim();
    
    const url = [
        'https://www.googleapis.com/youtube/v3/search',
        '?part=snippet',
        '&type=video',
        '&maxResults=5',
        '&videoEmbeddable=true',
        '&safeSearch=strict',
        '&videoDuration=medium',
        '&relevanceLanguage=en',
        '&regionCode=US',
        `&q=${encodeURIComponent(searchQuery + ' lesson tutorial')}`,
        `&key=${encodeURIComponent(key)}`,
    ].join('');

    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`YouTube API ${res.status}`);
        const data = await res.json();
        if (!data.items?.length) return null;

        const scored = data.items.map(item => ({
            item,
            score: scoreTitle(item.snippet.title, keywords),
        }));

        scored.sort((a, b) => b.score - a.score);
        const best = scored[0];
        
        if (best.score < 1) return null;

        const item = best.item;
        return {
            videoId: item.id.videoId,
            title: item.snippet.title,
            channel: item.snippet.channelTitle,
            thumbnail: item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url || '',
        };
    } catch(e) {
        console.warn('YouTube search error:', e);
        return null;
    }
}

// ── MAIN VIDEO RESOURCE FETCHING ───────────────────────────────
async function fetchVideoResources(questionText, subject, level) {
    const cacheKey = `${level}::${subject}::${questionText.slice(0, 80)}`;
    if (VIDEO_CACHE[cacheKey]) return VIDEO_CACHE[cacheKey];

    const channels = getPopularChannels(subject, level);
    const topChannels = channels.filter(c => c.priority === 1).slice(0, 4);
    
    // Extract keywords from question (exclude common words)
    const keywords = questionText
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .split(/\s+/)
        .filter(w => w.length > 3 && !['what', 'when', 'where', 'which', 'whose', 'there', 'their', 'about', 'waec', 'jamb'].includes(w))
        .slice(0, 5);
    
    const videos = [];
    
    for (const channel of topChannels) {
        try {
            const topicQuery = keywords.slice(0, 3).join(' ');
            const result = await ytSearch(topicQuery, keywords, channel.name);
            
            if (result && !videos.some(v => v.videoId === result.videoId)) {
                videos.push({
                    mode: 'embed',
                    videoId: result.videoId,
                    title: result.title,
                    channel: result.channel,
                    channelHandle: channel.handle,
                    category: channel.category,
                    thumb: result.thumbnail,
                    watchUrl: `https://www.youtube.com/watch?v=${result.videoId}`,
                    embedUrl: `https://www.youtube.com/embed/${result.videoId}?rel=0&modestbranding=1&autoplay=1&cc_load_policy=1`,
                });
            }
        } catch(e) {
            console.warn(`Failed to search ${channel.name}:`, e);
        }
        
        if (videos.length >= 3) break;
    }
    
    // Fallback: search without channel filter if no videos found
    if (videos.length === 0 && keywords.length > 0) {
        const fallbackResult = await ytSearch(keywords.slice(0, 3).join(' '), keywords);
        if (fallbackResult) {
            videos.push({
                mode: 'embed',
                videoId: fallbackResult.videoId,
                title: fallbackResult.title,
                channel: fallbackResult.channel,
                thumb: fallbackResult.thumbnail,
                watchUrl: `https://www.youtube.com/watch?v=${fallbackResult.videoId}`,
                embedUrl: `https://www.youtube.com/embed/${fallbackResult.videoId}?rel=0&modestbranding=1&autoplay=1`,
            });
        }
    }
    
    const result = { 
        topicLabel: subject, 
        videos, 
        hasVideos: videos.length > 0 
    };
    
    VIDEO_CACHE[cacheKey] = result;
    return result;
}

// ── SIMPLE SEARCH YOUTUBE (for backward compatibility) ─────────
async function searchYouTube(query, maxResults = 3) {
    const key = ytKey();
    if (!key) return [];
    try {
        const results = [];
        const keywords = query.split(' ').slice(0, 5);
        
        for (let i = 0; i < maxResults; i++) {
            const result = await ytSearch(query, keywords);
            if (result && !results.some(r => r.id === result.videoId)) {
                results.push({
                    id: result.videoId,
                    title: result.title,
                    channel: result.channel,
                    thumb: result.thumbnail
                });
            }
        }
        return results;
    } catch(e) { 
        console.warn('YouTube search error:', e);
        return []; 
    }
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

// ── EXPORTS ────────────────────────────────────────────────────
window.callGemini = callGemini;
window.callGeminiChat = callGeminiChat;
window.searchYouTube = searchYouTube;
window.fetchVideoResources = fetchVideoResources;
window.markTheory = markTheory;