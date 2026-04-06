// publisher-core.js - 100% reusable across all subjects
import { db } from './config.js';
import { collection, addDoc, serverTimestamp, updateDoc, doc, getDoc, getDocs, deleteDoc, query, orderBy, limit } from 'firebase/firestore';

// ─── STATE ─────────────────────────────────────────────────
let geminiApiKey = null;
let groqApiKey = null;
let currentUser = null;
let subjectConfig = null;
let subjectData = null;

// ─── INITIALIZATION ────────────────────────────────────────
export function initPublisher(config, dataModule) {
  subjectConfig = config;
  subjectData = dataModule;
}

export function setCurrentUser(user) {
  currentUser = user;
}

export async function loadApiKeys(user, config) {
  if (!user) return false;
  const apiKeyField = config?.apiKeyField || 'geminiKey';
  const groqKeyField = config?.groqKeyField || 'groqKey';
  
  for (let i = 1; i <= 3; i++) {
    try {
      const snap = await getDoc(doc(db, 'users', user.uid));
      if (!snap.exists()) return false;
      const d = snap.data();
      geminiApiKey = d[apiKeyField] || d.geminiApiKey || d.apiKey || null;
      groqApiKey = d[groqKeyField] || d.groqApiKey || null;
      return !!(geminiApiKey || groqApiKey);
    } catch (e) {
      if (i < 3) await new Promise(r => setTimeout(r, 2000));
    }
  }
  return false;
}

// ─── GENERIC API CALLS ─────────────────────────────────────
async function callGroq(model, prompt) {
  const targetUrl = encodeURIComponent('https://api.groq.com/openai/v1/chat/completions');
  
  const response = await fetch('https://corsproxy.io/?' + targetUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${groqApiKey}`
    },
    body: JSON.stringify({
      model: model.model,
      messages: [
        {
          role: 'system',
          content: `You are an expert educator for Nigerian students. Output only clean HTML. No markdown, no <img> tags. Use clear, practical examples relevant to Nigerian students.`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.72,
      max_tokens: 3500,
      top_p: 0.95
    })
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Groq ${response.status}: ${errorText.substring(0, 150)}`);
  }
  
  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error('Groq returned empty response');
  return content;
}

async function callGemini(model, prompt) {
  const r = await fetch(`${model.url}?key=${geminiApiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      contents: [{ parts: [{ text: prompt }] }], 
      generationConfig: { temperature: 0.72, maxOutputTokens: 3200 } 
    })
  });
  if (!r.ok) { const t = await r.text(); throw new Error(`Gemini ${r.status}: ${t.substring(0,100)}`); }
  const d = await r.json();
  const c = d.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!c) throw new Error('Gemini empty');
  return c;
}

export async function generateWithFallback(topic, onModelChange) {
  if (!subjectData || !subjectData.buildSubjectPrompt) {
    throw new Error('Subject data not loaded. Call initPublisher first.');
  }
  
  const prompt = subjectData.buildSubjectPrompt(topic);
  const complex = topic.complexity || 'standard';
  
  const groqModels = subjectData.SUBJECT_MODELS?.groq || [];
  const geminiModels = subjectData.SUBJECT_MODELS?.gemini || [];
  
  let chain;
  if (complex === 'simple' && groqApiKey) {
    chain = [...groqModels.map(m => ({ ...m, isFallback: false })), ...geminiModels.slice(0, 2).map(m => ({ ...m, isFallback: true }))];
  } else if (complex === 'deep' && geminiApiKey) {
    chain = [...geminiModels.slice(0, 2).map(m => ({ ...m, isFallback: false })), ...(groqApiKey ? groqModels.slice(0, 1).map(m => ({ ...m, isFallback: true })) : []), ...geminiModels.slice(2).map(m => ({ ...m, isFallback: true }))];
  } else {
    chain = [...(groqApiKey ? groqModels.map(m => ({ ...m, isFallback: false })) : []), ...geminiModels.map(m => ({ ...m, isFallback: false }))];
  }
  chain = chain.filter(m => m.provider === 'groq' ? !!groqApiKey : !!geminiApiKey);
  if (!chain.length) throw new Error('No API keys available');
  
  for (const model of chain) {
    if (onModelChange) onModelChange(model.label, model.provider, model.isFallback);
    try {
      let raw = model.provider === 'groq' ? await callGroq(model, prompt) : await callGemini(model, prompt);
      raw = raw.trim().replace(/```html\n?/gi, '').replace(/```\n?/g, '').replace(/<img[^>]*>/gi, '');
      const titleMatch = raw.match(/<h1[^>]*>([^<]+)<\/h1>/i);
      const title = titleMatch ? titleMatch[1].trim() : topic.text;
      const excerpt = raw.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 160);
      return { title, content: raw, excerpt, subject: topic.subject, classLevel: topic.classLevel, modelUsed: model.label };
    } catch (e) {
      console.error(`Failed with ${model.label}:`, e);
    }
  }
  throw new Error('All models exhausted');
}

export async function publishPost(post) {
  if (!currentUser) throw new Error('Not signed in');
  if (!subjectConfig) throw new Error('Subject config not loaded');
  
  const ref = await addDoc(collection(db, subjectConfig.collectionName), {
    title: post.title,
    content: post.content,
    excerpt: post.excerpt,
    featuredImage: '',
    videoLink: '',
    practiceLink: '',
    subject: post.subject,
    classLevel: post.classLevel,
    status: 'published',
    authorId: currentUser.uid,
    authorEmail: currentUser.email,
    publishedAt: serverTimestamp(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    views: 0,
    likes: [],
    imagesAdded: false,
    linksAdded: false,
    modelUsed: post.modelUsed,
    source: subjectConfig.source
  });
  return ref.id;
}

export async function executePublishCycle(onLog, onSchedule, onTopicSelected, onModelChange) {
  if (!subjectData || !subjectData.SUBJECT_TOPICS) {
    if (onLog) onLog('[CYCLE] Subject topics not loaded', 'error');
    return false;
  }
  
  if (!geminiApiKey && !groqApiKey) {
    if (onLog) onLog('[CYCLE] No API keys available', 'warn');
    if (onSchedule) onSchedule(5 * 60 * 1000);
    return false;
  }
  if (!currentUser) {
    if (onLog) onLog('[CYCLE] No user signed in', 'error');
    if (onSchedule) onSchedule(5 * 60 * 1000);
    return false;
  }
  
  const rand = arr => arr[Math.floor(Math.random() * arr.length)];
  const topic = rand(subjectData.SUBJECT_TOPICS);
  if (onTopicSelected) onTopicSelected(topic);
  if (onLog) onLog(`[RUN] "${topic.text}" [${topic.subject} / ${topic.classLevel}]`, 'info');
  
  try {
    const post = await generateWithFallback(topic, onModelChange);
    const postId = await publishPost(post);
    if (onLog) onLog(`[DONE] Published post ID: ${postId.substring(0,10)}...`, 'success');
    if (onSchedule) onSchedule(Math.floor(Math.random() * 5 * 60 * 1000 + 10 * 60 * 1000));
    return postId;
  } catch (e) {
    if (onLog) onLog(`[ERR] ${e.message}`, 'error');
    if (onSchedule) onSchedule(5 * 60 * 1000);
    return null;
  }
}

// ─── GENERIC CRUD OPERATIONS ──────────────────────────────
export async function loadRecentPosts(limitCount = 30) {
  if (!subjectConfig) throw new Error('Subject config not loaded');
  const q = query(collection(db, subjectConfig.collectionName), orderBy('publishedAt', 'desc'), limit(limitCount));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function updatePostMeta(postId, updates) {
  if (!subjectConfig) throw new Error('Subject config not loaded');
  await updateDoc(doc(db, subjectConfig.collectionName, postId), { ...updates, updatedAt: serverTimestamp() });
}

export async function updatePostImages(postId, content, featuredImage, imagesAdded) {
  if (!subjectConfig) throw new Error('Subject config not loaded');
  await updateDoc(doc(db, subjectConfig.collectionName, postId), { 
    content, 
    featuredImage, 
    imagesAdded, 
    updatedAt: serverTimestamp() 
  });
}

export async function updatePostLinks(postId, videoLink, practiceLink, linksAdded) {
  if (!subjectConfig) throw new Error('Subject config not loaded');
  await updateDoc(doc(db, subjectConfig.collectionName, postId), { 
    videoLink, 
    practiceLink, 
    linksAdded, 
    updatedAt: serverTimestamp() 
  });
}

export async function deletePost(postId) {
  if (!subjectConfig) throw new Error('Subject config not loaded');
  await deleteDoc(doc(db, subjectConfig.collectionName, postId));
}

export async function getPost(postId) {
  if (!subjectConfig) throw new Error('Subject config not loaded');
  const snap = await getDoc(doc(db, subjectConfig.collectionName, postId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export function hasApiKeys() {
  return !!(geminiApiKey || groqApiKey);
}

export function getSubjectName() {
  return subjectConfig?.name || 'Unknown Subject';
}