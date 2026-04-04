// Import from your existing firebase-init.js
import { auth, db } from "../../firebase-init.js";
import { collection, addDoc, getDocs, query, orderBy, limit, doc, getDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";

// Gemini Models
const GEMINI_MODELS = [
    { label: 'Gemini 3.1 Flash-Lite', url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent' },
    { label: 'Gemini 3.1 Pro', url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-pro-preview:generateContent' },
    { label: 'Gemini 3 Flash', url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent' },
    { label: 'Gemini 2.5 Flash-Lite', url: 'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash-lite:generateContent' },
    { label: 'Gemini 2.5 Flash', url: 'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent' },
    { label: 'Gemini 2.5 Pro', url: 'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-pro:generateContent' },
];

// State
let currentUser = null;
let currentGeneratedBlog = null;
let geminiApiKey = null;
let pendingBlogs = []; // Store blogs to save when online

// DOM Elements
const authGate = document.getElementById('auth-gate');
const appContent = document.getElementById('app-content');
const userBadge = document.getElementById('user-badge');
const alertArea = document.getElementById('alert-area');
const generateBtn = document.getElementById('generate-btn');
const publishBtn = document.getElementById('publish-btn');
const clearPreviewBtn = document.getElementById('clear-preview-btn');
const refreshBtn = document.getElementById('refresh-btn');
const previewArea = document.getElementById('preview-area');
const blogTopic = document.getElementById('blog-topic');
const blogStyle = document.getElementById('blog-style');
const audience = document.getElementById('audience');
const postStatus = document.getElementById('post-status');
const progressContainer = document.getElementById('progress-container');
const progressFill = document.getElementById('progress-fill');
const offlineStatus = document.getElementById('offline-status');

// Helper Functions
function showAlert(message, type = 'info') {
  alertArea.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
  setTimeout(() => {
    if (alertArea.firstChild) alertArea.innerHTML = '';
  }, 5000);
}

function updateProgress(percent) {
  progressContainer.style.display = 'block';
  progressFill.style.width = `${percent}%`;
  if (percent >= 100) {
    setTimeout(() => {
      progressContainer.style.display = 'none';
      progressFill.style.width = '0%';
    }, 1000);
  }
}

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function extractTitleFromContent(content) {
  const h1Match = content.match(/<h1[^>]*>([^<]+)<\/h1>/i);
  if (h1Match) return h1Match[1];
  
  const h2Match = content.match(/<h2[^>]*>([^<]+)<\/h2>/i);
  if (h2Match) return h2Match[1];
  
  const firstLine = content.split('\n')[0].replace(/[#*]/g, '').trim();
  if (firstLine && firstLine.length < 80) return firstLine;
  
  return null;
}

function extractExcerptFromContent(content, maxLength = 150) {
  const stripped = content.replace(/<[^>]*>/g, '');
  const sentences = stripped.match(/[^.!?]+[.!?]+/g);
  if (sentences && sentences.length > 0) {
    let excerpt = '';
    for (const sentence of sentences) {
      if ((excerpt + sentence).length <= maxLength) {
        excerpt += sentence;
      } else {
        break;
      }
    }
    return excerpt.trim() || stripped.substring(0, maxLength);
  }
  return stripped.substring(0, maxLength);
}

// Random model picker
function getRandomModel() {
  const randomIndex = Math.floor(Math.random() * GEMINI_MODELS.length);
  return {
    index: randomIndex,
    model: GEMINI_MODELS[randomIndex]
  };
}

// Check online status
function updateOnlineStatus() {
  if (offlineStatus) {
    if (!navigator.onLine) {
      offlineStatus.style.display = 'block';
      offlineStatus.innerHTML = 'You are offline. Blog will be saved locally and synced when online.';
      showAlert('You are offline. Generated blogs will be saved locally and uploaded automatically when you reconnect.', 'info');
    } else {
      offlineStatus.style.display = 'none';
      syncPendingBlogs();
    }
  }
}

// Save blog to IndexedDB for offline storage
async function saveBlogToIndexedDB(blog, status) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('PrepPortalBlogs', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(['pendingBlogs'], 'readwrite');
      const store = transaction.objectStore('pendingBlogs');
      
      const blogWithMeta = {
        ...blog,
        status,
        pendingId: Date.now() + Math.random(),
        createdAt: new Date().toISOString(),
        authorId: currentUser?.uid,
        authorEmail: currentUser?.email
      };
      
      const saveRequest = store.add(blogWithMeta);
      saveRequest.onsuccess = () => resolve(blogWithMeta.pendingId);
      saveRequest.onerror = () => reject(saveRequest.error);
    };
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('pendingBlogs')) {
        db.createObjectStore('pendingBlogs', { keyPath: 'pendingId' });
      }
    };
  });
}

// Sync pending blogs when online
async function syncPendingBlogs() {
  if (!navigator.onLine || !currentUser) return;
  
  const request = indexedDB.open('PrepPortalBlogs', 1);
  
  request.onsuccess = async (event) => {
    const db = event.target.result;
    if (!db.objectStoreNames.contains('pendingBlogs')) return;
    
    const transaction = db.transaction(['pendingBlogs'], 'readonly');
    const store = transaction.objectStore('pendingBlogs');
    const getAllRequest = store.getAll();
    
    getAllRequest.onsuccess = async () => {
      const pending = getAllRequest.result;
      
      for (const blog of pending) {
        try {
          const blogData = {
            title: blog.title,
            content: blog.content,
            excerpt: blog.excerpt,
            status: blog.status,
            authorId: currentUser.uid,
            authorEmail: currentUser.email,
            publishedAt: blog.status === 'published' ? serverTimestamp() : null,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            views: 0,
            source: 'ai-blog-manager-offline',
            modelUsed: blog.modelUsed
          };
          
          await addDoc(collection(db, 'blogs'), blogData);
          
          // Remove from IndexedDB after successful sync
          const deleteTransaction = db.transaction(['pendingBlogs'], 'readwrite');
          const deleteStore = deleteTransaction.objectStore('pendingBlogs');
          deleteStore.delete(blog.pendingId);
          
          console.log(`Synced blog: ${blog.title}`);
        } catch (error) {
          console.error('Failed to sync blog:', error);
        }
      }
      
      if (pending.length > 0) {
        showAlert(`${pending.length} blog(s) synced to cloud!`, 'success');
        await loadRecentBlogs();
      }
    };
  };
}

async function loadGeminiKey() {
  if (!currentUser) return null;
  
  try {
    const userDocRef = doc(db, 'users', currentUser.uid);
    const userDoc = await getDoc(userDocRef);
    const userData = userDoc.data();
    
    console.log('User data loaded:', userData);
    
    if (userData && userData.geminiKey) {
      geminiApiKey = userData.geminiKey;
      console.log('Gemini key loaded successfully');
      return geminiApiKey;
    }
    
    if (userData && userData.gemini) {
      geminiApiKey = userData.gemini;
      console.log('Gemini key loaded from alternative field');
      return geminiApiKey;
    }
  } catch (error) {
    console.error('Error loading Gemini key:', error);
  }
  
  console.warn('No Gemini key found for user');
  return null;
}

async function generateBlogWithGemini(topic, style, targetAudience, modelUrl) {
  if (!geminiApiKey) {
    await loadGeminiKey();
    if (!geminiApiKey) {
      throw new Error('Gemini API key not found. Please add your API key in the API Keys settings page.');
    }
  }

  let stylePrompt = '';
  switch(style) {
    case 'exam-tips':
      stylePrompt = 'Practical exam tips and strategies';
      break;
    case 'study-guide':
      stylePrompt = 'Comprehensive study guide with examples';
      break;
    case 'past-paper-analysis':
      stylePrompt = 'Analysis of past papers and common question patterns';
      break;
    case 'motivation':
      stylePrompt = 'Motivational content for exam preparation';
      break;
    default:
      stylePrompt = 'Practical exam tips and strategies';
  }

  const prompt = `Write a detailed blog post for an exam preparation website called "Prep Portal 2026".

Topic: ${topic}
Style: ${stylePrompt}
Target Audience: ${targetAudience}

Write the blog post in HTML format. Use these tags:
- <h1> for the title (make it catchy, under 60 characters)
- <h2> for main section headings (3-4 sections)
- <p> for paragraphs
- <ul> and <li> for one bullet-point list
- End with a call-to-action to browse Prep Portal exams

Make it 600-800 words. Use simple, clear language. Start directly with the <h1> tag. Do not include any JSON, markdown, or explanatory text. Return only the HTML.`;

  updateProgress(30);

  const response = await fetch(`${modelUrl}?key=${geminiApiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ 
        parts: [{ text: prompt }] 
      }],
      generationConfig: { 
        temperature: 0.7, 
        maxOutputTokens: 2500
      }
    })
  });

  updateProgress(70);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `HTTP ${response.status}`);
  }

  const data = await response.json();
  
  updateProgress(85);
  
  if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
    console.error('Invalid API response:', data);
    throw new Error('Invalid response from Gemini API');
  }
  
  let htmlContent = data.candidates[0].content.parts[0].text;
  
  updateProgress(90);
  
  // Clean up the response
  htmlContent = htmlContent.trim();
  
  // Remove markdown code blocks if present
  htmlContent = htmlContent.replace(/```html\n?/gi, '');
  htmlContent = htmlContent.replace(/```\n?/g, '');
  
  // Extract title from HTML
  let title = extractTitleFromContent(htmlContent);
  if (!title) {
    title = topic.substring(0, 60);
  }
  
  // Extract excerpt
  let excerpt = extractExcerptFromContent(htmlContent);
  if (!excerpt || excerpt.length < 50) {
    excerpt = `A comprehensive guide to ${topic.toLowerCase()}. Learn key strategies and tips for exam success.`;
  }
  
  updateProgress(100);
  
  return {
    title: title,
    content: htmlContent,
    excerpt: excerpt
  };
}

function renderPreview(blog) {
  previewArea.innerHTML = `
    <div style="max-height: 500px; overflow-y: auto; padding-right: 10px;">
      <div style="font-family: 'DM Serif Display', serif; font-size: 1.25rem; margin-bottom: 0.5rem; font-weight: bold;">
        ${escapeHtml(blog.title)}
      </div>
      <div style="font-size: 0.7rem; color: #666; margin-bottom: 1rem; text-transform: uppercase; border-bottom: 1px solid #eee; padding-bottom: 0.5rem;">
        Generated Preview | Model: ${blog.modelUsed}
      </div>
      <div style="line-height: 1.6; font-size: 0.85rem;">
        ${blog.content}
      </div>
      <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #eee; font-size: 0.7rem; color: #666; background: #f9f9f9; padding: 0.75rem;">
        <strong>Excerpt:</strong> ${escapeHtml(blog.excerpt)}
      </div>
    </div>
  `;
  publishBtn.disabled = false;
}

async function saveBlogToFirestore(blog, status) {
  if (!currentUser) throw new Error('Not authenticated');
  
  const blogData = {
    title: blog.title,
    content: blog.content,
    excerpt: blog.excerpt,
    status: status,
    authorId: currentUser.uid,
    authorEmail: currentUser.email,
    publishedAt: status === 'published' ? serverTimestamp() : null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    views: 0,
    source: 'ai-blog-manager',
    modelUsed: blog.modelUsed
  };
  
  const docRef = await addDoc(collection(db, 'blogs'), blogData);
  return docRef.id;
}

async function loadRecentBlogs() {
  const recentContainer = document.getElementById('recent-blogs');
  recentContainer.innerHTML = '<p style="color: #999; text-align: center; padding: 2rem;">Loading...</p>';
  
  try {
    const q = query(collection(db, 'blogs'), orderBy('createdAt', 'desc'), limit(10));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      recentContainer.innerHTML = '<p style="color: #999; text-align: center; padding: 2rem;">No blogs yet. Generate your first blog above.</p>';
      return;
    }
    
    recentContainer.innerHTML = '';
    snapshot.forEach(doc => {
      const blog = doc.data();
      const date = blog.createdAt?.toDate().toLocaleDateString() || 'Just now';
      const statusClass = blog.status === 'published' ? 'status-published' : 'status-draft';
      const statusText = blog.status === 'published' ? 'Published' : 'Draft';
      
      const blogEl = document.createElement('div');
      blogEl.className = 'blog-item';
      blogEl.innerHTML = `
        <div class="blog-title">${escapeHtml(blog.title)}</div>
        <div class="blog-meta">${date} | by ${blog.authorEmail || 'Unknown'} | Model: ${blog.modelUsed || 'Unknown'}</div>
        <div class="blog-excerpt">${escapeHtml(blog.excerpt || (blog.content ? blog.content.substring(0, 100).replace(/<[^>]*>/g, '') : ''))}...</div>
        <span class="blog-status ${statusClass}">${statusText}</span>
      `;
      recentContainer.appendChild(blogEl);
    });
  } catch (error) {
    console.error('Error loading blogs:', error);
    recentContainer.innerHTML = '<p style="color: #dc2626; text-align: center; padding: 2rem;">Error loading blogs. Check console.</p>';
  }
}

// Load pending blogs from IndexedDB
async function loadPendingBlogsCount() {
  return new Promise((resolve) => {
    const request = indexedDB.open('PrepPortalBlogs', 1);
    
    request.onsuccess = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('pendingBlogs')) {
        resolve(0);
        return;
      }
      
      const transaction = db.transaction(['pendingBlogs'], 'readonly');
      const store = transaction.objectStore('pendingBlogs');
      const countRequest = store.count();
      
      countRequest.onsuccess = () => {
        const count = countRequest.result;
        if (count > 0) {
          showAlert(`${count} blog(s) pending sync. Will upload when online.`, 'info');
        }
        resolve(count);
      };
      countRequest.onerror = () => resolve(0);
    };
    
    request.onerror = () => resolve(0);
  });
}

// Event Handlers
function setupTopicTags() {
  document.querySelectorAll('.topic-tag').forEach(tag => {
    tag.addEventListener('click', () => {
      blogTopic.value = tag.getAttribute('data-topic');
    });
  });
}

async function handleGenerate() {
  const topic = blogTopic.value.trim();
  if (!topic) {
    showAlert('Please enter a topic or select from the suggestions', 'error');
    return;
  }
  
  generateBtn.disabled = true;
  generateBtn.innerHTML = '<span class="spinner"></span> Generating...';
  
  try {
    const style = blogStyle.value;
    const targetAudience = audience.value;
    
    // Randomly pick a model
    const { index, model } = getRandomModel();
    const modelUrl = model.url;
    const modelLabel = model.label;
    
    showAlert(`Randomly selected: ${modelLabel}`, 'info');
    
    const blog = await generateBlogWithGemini(topic, style, targetAudience, modelUrl);
    blog.modelUsed = modelLabel;
    currentGeneratedBlog = blog;
    renderPreview(blog);
    showAlert(`Blog generated successfully using ${modelLabel}! Review it and click Save.`, 'success');
  } catch (error) {
    console.error('Generation error:', error);
    showAlert(`Failed to generate blog: ${error.message}`, 'error');
  } finally {
    generateBtn.disabled = false;
    generateBtn.innerHTML = 'Generate Blog with Gemini';
  }
}

async function handlePublish() {
  if (!currentGeneratedBlog) {
    showAlert('No blog to save. Generate a blog first.', 'error');
    return;
  }
  
  const status = postStatus.value;
  publishBtn.disabled = true;
  publishBtn.innerHTML = '<span class="spinner"></span> Saving...';
  
  try {
    // Check if online
    if (!navigator.onLine) {
      // Save to IndexedDB for offline
      await saveBlogToIndexedDB(currentGeneratedBlog, status);
      showAlert(`Blog "${currentGeneratedBlog.title}" saved locally! Will sync when online.`, 'success');
      
      currentGeneratedBlog = null;
      previewArea.innerHTML = '<p style="color: #999; text-align: center; padding: 2rem;">Blog saved offline. It will be uploaded when you reconnect.</p>';
      publishBtn.disabled = true;
      
      await loadPendingBlogsCount();
    } else {
      // Save directly to Firestore
      const blogId = await saveBlogToFirestore(currentGeneratedBlog, status);
      showAlert(`Blog "${currentGeneratedBlog.title}" saved successfully! ID: ${blogId}`, 'success');
      
      currentGeneratedBlog = null;
      previewArea.innerHTML = '<p style="color: #999; text-align: center; padding: 2rem;">Blog saved. Generate a new blog post to see preview here.</p>';
      publishBtn.disabled = true;
      
      await loadRecentBlogs();
    }
  } catch (error) {
    console.error('Save error:', error);
    showAlert(`Failed to save blog: ${error.message}`, 'error');
  } finally {
    publishBtn.disabled = false;
    publishBtn.innerHTML = 'Save to Firestore';
  }
}

function handleClearPreview() {
  currentGeneratedBlog = null;
  previewArea.innerHTML = '<p style="color: #999; text-align: center; padding: 2rem;">Generate a blog post to see preview here</p>';
  publishBtn.disabled = true;
  blogTopic.value = '';
}

// Auth State Handler
function setupAuthListener() {
  console.log('Setting up auth listener...');
  
  onAuthStateChanged(auth, async (user) => {
    console.log('Auth state changed:', user ? `User: ${user.uid} (${user.email})` : 'No user');
    
    if (user) {
      currentUser = user;
      authGate.classList.add('hidden');
      appContent.classList.remove('hidden');
      userBadge.textContent = user.email || user.uid.substring(0, 8);
      
      await loadGeminiKey();
      await loadRecentBlogs();
      await loadPendingBlogsCount();
      
      // Listen for online/offline events
      window.addEventListener('online', updateOnlineStatus);
      window.addEventListener('offline', updateOnlineStatus);
      
      if (!geminiApiKey) {
        showAlert('Gemini API key not found. Please add your key in the API Keys settings page.', 'error');
      } else {
        showAlert(`Welcome back, ${user.email}! Gemini API key loaded.`, 'success');
      }
    } else {
      currentUser = null;
      authGate.classList.remove('hidden');
      appContent.classList.add('hidden');
    }
  });
}

// Initialize
function init() {
  console.log('Initializing Blog Manager...');
  setupTopicTags();
  setupAuthListener();
  
  generateBtn.addEventListener('click', handleGenerate);
  publishBtn.addEventListener('click', handlePublish);
  clearPreviewBtn.addEventListener('click', handleClearPreview);
  refreshBtn.addEventListener('click', loadRecentBlogs);
  
  // Create offline status div if it doesn't exist
  if (!document.getElementById('offline-status')) {
    const statusDiv = document.createElement('div');
    statusDiv.id = 'offline-status';
    statusDiv.style.cssText = 'display: none; background: #f59e0b; color: white; padding: 0.5rem; text-align: center; margin-bottom: 1rem; border-radius: 4px;';
    const container = document.querySelector('.container');
    if (container) {
      container.insertBefore(statusDiv, container.firstChild);
    }
  }
}

// Start the app
init();