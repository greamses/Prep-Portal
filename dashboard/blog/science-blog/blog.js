import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, query, orderBy, getDocs, doc, getDoc, updateDoc, increment, addDoc, serverTimestamp, arrayUnion, arrayRemove } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA2N3uI_XfSIVsto2Ku1g_qSezmD3qFmbk",
  authDomain: "prep-portal-2026.web.app",
  projectId: "prep-portal-2026",
  storageBucket: "prep-portal-2026.firebasestorage.app",
  messagingSenderId: "837672918701",
  appId: "1:837672918701:web:e64c0c25dc01b542e23024"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let allPosts = [];
let currentSubject = 'all';
let currentClass = 'all';
let currentSearch = '';
let currentUser = null;
let activePost = null;
let groqApiKeyPublic = null; // loaded for AI comment replies
let geminiApiKeyPublic = null; // fallback for AI replies

const scienceGrid = document.getElementById('scienceGrid');
const singlePostView = document.getElementById('singlePostView');
const singlePostContent = document.getElementById('singlePostContent');
const closePostBtn = document.getElementById('closePostBtn');
const searchInput = document.getElementById('searchInput');
const scrollTopBtn = document.getElementById('scrollTop');
const toastEl = document.getElementById('toast');
const embedOverlay = document.getElementById('embedOverlay');
const embedFrame = document.getElementById('embedFrame');
const embedFrameWrap = document.getElementById('embedFrameWrap');
const embedTitle = document.getElementById('embedTitle');
const embedOpenLink = document.getElementById('embedOpenLink');
const embedCloseBtn = document.getElementById('embedCloseBtn');
const embedSpinner = document.getElementById('embedSpinner');

onAuthStateChanged(auth, async u => {
  currentUser = u;
  if (u) {
    // Load API key for AI comment replies
    try {
      const snap = await getDoc(doc(db, 'users', u.uid));
      if (snap.exists()) {
        const d = snap.data();
        groqApiKeyPublic = d.groqKey || d.groqApiKey || null;
        geminiApiKeyPublic = d.geminiKey || d.geminiApiKey || d.apiKey || d.gemini || null;
      }
    } catch (_) {}
  }
});

// ─── UTILS ────────────────────────────────────────────────
const showToast = msg => {
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  setTimeout(() => toastEl.classList.remove('show'), 2800);
};
const escHtml = s => { if (!s) return ''; return s.replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' } [m])); };
const stripHtml = h => {
  const d = document.createElement('div');
  d.innerHTML = h;
  return d.textContent || d.innerText || '';
};
const formatDate = ts => { if (!ts) return 'Just now'; const d = ts.toDate ? ts.toDate() : new Date(ts); const diff = Math.floor((Date.now() - d) / 86400000); if (diff === 0) return 'Today'; if (diff === 1) return 'Yesterday'; if (diff < 7) return `${diff} days ago`; return d.toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' }); };
const calcReadTime = c => { if (!c) return 1; return Math.max(1, Math.ceil(c.replace(/<[^>]*>/g, ' ').trim().split(/\s+/).length / 200)); };

// Badge helpers
const SUBJECT_LABEL = { math: 'Mathematics', chemistry: 'Chemistry', biology: 'Biology', physics: 'Physics', 'basic-science': 'Basic Science', 'basic-tech': 'Basic Tech' };
const SUBJECT_CLS = { math: 'sci-math', chemistry: 'sci-chemistry', biology: 'sci-biology', physics: 'sci-physics', 'basic-science': 'sci-basicscience', 'basic-tech': 'sci-basictech' };
const CLASS_LABEL = cl => { if (!cl) return '--'; const [t, ...r] = cl.split('-'); const n = r.join(' '); if (t === 'primary') return `Primary ${n}`; if (t === 'jss') return `JSS ${n}`; if (t === 'ss') return `SS ${n}`; return cl; };
const CLASS_SHORT = cl => { if (!cl) return '--'; const [t, ...r] = cl.split('-'); const n = r.join(' '); if (t === 'primary') return `P${n}`; if (t === 'jss') return `JSS ${n}`; if (t === 'ss') return `SS ${n}`; return cl; };
const CLASS_CLS = cl => { if (!cl) return 'cls-primary'; if (cl.startsWith('primary')) return 'cls-primary'; if (cl.startsWith('jss')) return 'cls-jss'; return 'cls-ss'; };

// ─── VIDEO THUMBNAIL ──────────────────────────────────────
function getYouTubeThumbnail(url) {
  if (!url) return null;
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
  return m ? `https://img.youtube.com/vi/${m[1]}/mqdefault.jpg` : null;
}

function getDomain(url) { try { return new URL(url).hostname.replace(/^www\./, ''); } catch (_) { return url; } }


// Converts standard URLs (Watch, Shorts, youtu.be) into embeddable <iframe> URLs
function getEmbedUrl(url, type) {
  if (!url) return '';
  
  // 1. If it's a full <iframe> tag, extract the 'src'
  if (url.includes('<iframe')) {
    const srcMatch = url.match(/src=["']([^"']+)["']/);
    url = srcMatch ? srcMatch[1] : url;
  }
  
  // 2. Handle YouTube specifically (Shorts, Watch, etc.)
  if (type === 'video' || url.includes('youtube.com') || url.includes('youtu.be')) {
    const ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([^&\n?#]+)/);
    if (ytMatch && ytMatch[1]) {
      return `https://www.youtube.com/embed/${ytMatch[1]}`;
    }
  }
  
  // 3. Return the cleaned URL (works for PhET, GeoGebra, etc.)
  return url;
}


// ─── SVG ICONS ────────────────────────────────────────────
const I = {
  calendar: `<svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`,
  clock: `<svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`,
  eye: `<svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`,
  cpu: `<svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>`,
  heart: `<svg style="width:12px;height:12px;flex-shrink:0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`,
  heartFill: `<svg style="width:12px;height:12px;flex-shrink:0" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`,
  share: `<svg style="width:13px;height:13px;flex-shrink:0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>`,
  chat: `<svg style="width:18px;height:18px;flex-shrink:0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>`,
  arrow: `<svg style="width:13px;height:13px;flex-shrink:0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`,
  reply: `<svg style="width:11px;height:11px;flex-shrink:0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 17 4 12 9 7"></polyline><path d="M20 18v-2a4 4 0 0 0-4-4H4"></path></svg>`,
  link: `<svg style="width:13px;height:13px;flex-shrink:0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>`,
  video: `<svg style="width:13px;height:13px;flex-shrink:0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>`,
  practice: `<svg style="width:13px;height:13px;flex-shrink:0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>`
};

// ─── CARD RENDER ──────────────────────────────────────────
function renderCard(post) {
  const subj = post.subject || 'math';
  const cls = post.classLevel || 'ss-1';
  const sciCls = SUBJECT_CLS[subj] || 'sci-math';
  const clsCls = CLASS_CLS(cls);
  const subjLbl = SUBJECT_LABEL[subj] || subj;
  const clsLbl = CLASS_SHORT(cls);
  const date = formatDate(post.publishedAt);
  const rt = calcReadTime(post.content);
  const excerpt = post.excerpt || stripHtml(post.content || '').substring(0, 110);
  const hasVideo = !!post.videoLink;
  const hasPractice = !!post.practiceLink;
  
  return `
        <div class="science-card" data-post-id="${post.id}">
          ${post.featuredImage ? `<img class="card-featured-img" src="${escHtml(post.featuredImage)}" alt="${escHtml(post.title)}" loading="lazy">` : ''}
          <div class="card-inner">
            <div class="card-badges">
              <span class="sci-badge ${sciCls}">${subjLbl}</span>
              <span class="cls-badge ${clsCls}">${clsLbl}</span>
            </div>
            <div class="card-meta">
              <span>${I.calendar} ${date}</span>
              <span>${I.clock} ${rt} min</span>
            </div>
            <h2 class="card-title">${escHtml(post.title)}</h2>
            <div class="card-resource-row">
              <span class="card-resource-chip${hasVideo?' has-link':''}">${I.video} Video</span>
              <span class="card-resource-chip${hasPractice?' has-link':''}">${I.practice} Practice</span>
            </div>
            <p class="card-excerpt">${escHtml(excerpt)}...</p>
            <div class="read-more">Open topic ${I.arrow}</div>
          </div>
        </div>`;
}

function filterPosts() {
  let f = [...allPosts];
  if (currentSubject !== 'all') f = f.filter(p => p.subject === currentSubject);
  if (currentClass !== 'all') f = f.filter(p => p.classLevel === currentClass);
  if (currentSearch) {
    const s = currentSearch.toLowerCase();
    f = f.filter(p => p.title.toLowerCase().includes(s) || stripHtml(p.content || '').toLowerCase().includes(s));
  }
  return f;
}

function renderPosts() {
  const f = filterPosts();
  if (!f.length) { scienceGrid.innerHTML = '<div class="no-posts">No posts found for this filter.</div>'; return; }
  scienceGrid.innerHTML = f.map(renderCard).join('');
  scienceGrid.querySelectorAll('.science-card').forEach(card => {
    card.addEventListener('click', () => { const post = allPosts.find(p => p.id === card.dataset.postId); if (post) showSinglePost(post); });
  });
}

// ─── SINGLE POST — HASH-BASED DEEP LINKING ────────────────
async function incViews(id) { try { await updateDoc(doc(db, 'science-posts', id), { views: increment(1) }); } catch (_) {} }

function showSinglePost(post) {
  activePost = post;
  const subj = post.subject || 'math';
  const cls = post.classLevel || 'ss-1';
  const sciCls = SUBJECT_CLS[subj] || 'sci-math';
  const clsCls = CLASS_CLS(cls);
  const subjLbl = SUBJECT_LABEL[subj] || subj;
  const clsLbl = CLASS_LABEL(cls);
  const date = formatDate(post.publishedAt);
  const rt = calcReadTime(post.content);
  const views = (post.views || 0) + 1;
  const likes = post.likes || [];
  const liked = currentUser && likes.includes(currentUser.uid);
  const videoThumb = getYouTubeThumbnail(post.videoLink);
  const practiceDomain = post.practiceLink ? getDomain(post.practiceLink) : null;
  
  incViews(post.id);
  history.pushState({ postId: post.id }, post.title, `${window.location.pathname}#${post.id}`);
  document.title = `${post.title} | Prep Portal Science`;
  
  singlePostContent.innerHTML = `
        <h1 class="post-title">${escHtml(post.title)}</h1>
        <div class="post-badges">
          <span class="sci-badge ${sciCls}">${subjLbl}</span>
          <span class="cls-badge ${clsCls}">${clsLbl}</span>
        </div>
        <div class="post-meta">
          <span>${I.calendar} ${date}</span>
          <span>${I.clock} ${rt} min read</span>
          <span>${I.eye} ${views} views</span>
          ${post.modelUsed ? `<span>${I.cpu} ${escHtml(post.modelUsed.split(' ').slice(0,2).join(' '))}</span>` : ''}
        </div>
        <div class="reader-actions">
          <button class="action-btn like-btn${liked?' liked':''}" id="likeBtn">
            ${liked?I.heartFill:I.heart} <span id="likeCount">${likes.length}</span>
          </button>
          <button class="action-btn share-btn" id="shareBtn">${I.share} Share</button>
          <button class="action-btn" id="copyLinkBtn">${I.link} Copy Link</button>
        </div>

        ${post.featuredImage ? `<img class="post-featured-img" src="${escHtml(post.featuredImage)}" alt="${escHtml(post.title)}" loading="lazy">` : ''}

        <!-- Resource links: video + practice with embedded viewing -->
        ${(post.videoLink || post.practiceLink) ? `
        <div class="resource-links-section">
          <div class="resource-links-heading">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
            Learning Resources
          </div>
          <div class="resource-links-grid">
            ${post.videoLink ? `
            <div class="resource-card video-resource" role="button" tabindex="0"
              data-embed-url="${escHtml(getEmbedUrl(post.videoLink,'video'))}"
              data-raw-url="${escHtml(post.videoLink)}"
              data-embed-type="video"
              data-embed-title="Video: ${escHtml(post.title)}">
              <div class="video-thumb-area">
                ${videoThumb
                  ? `<img src="${escHtml(videoThumb)}" alt="Video thumbnail" loading="lazy" onerror="this.parentElement.style.background='#222'">`
                  : `<div style="display:flex;align-items:center;justify-content:center;height:100%;background:#111"><svg style="width:40px;height:40px;color:#fff" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2"></rect></svg></div>`}
                <div class="video-play-overlay">
                  <svg viewBox="0 0 50 50" fill="none">
                    <circle cx="25" cy="25" r="25" fill="rgba(0,0,0,0.5)"></circle>
                    <polygon points="20,15 20,35 38,25" fill="white"></polygon>
                  </svg>
                </div>
              </div>
              <div class="resource-card-footer">
                <span class="resource-type-label">Watch Video</span>
                <svg class="resource-open-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </div>
            </div>` : ''}

            ${post.practiceLink ? `
<div class="resource-card practice-resource" role="button" tabindex="0"
  data-embed-url="${escHtml(post.practiceLink)}"
  data-raw-url="${escHtml(post.practiceLink)}"
  data-embed-type="practice"
  data-embed-title="Practice: ${escHtml(practiceDomain)}">
  
  <div class="practice-thumb-area sci-${subj}-bg">
    <!-- Using a high-res 128px favicon as the "thumbnail" -->
    <img class="practice-large-icon" 
         src="https://www.google.com/s2/favicons?domain=${escHtml(practiceDomain)}&sz=128" 
         alt="${escHtml(practiceDomain)}"
         onerror="this.src='../../logo/logo-light.svg'">
    
    <div class="practice-platform-tag">${escHtml(practiceDomain)}</div>
    
    <!-- Interaction Icon Overlay -->
    <div class="video-play-overlay">
      <svg style="width:40px;height:40px;color:rgba(107, 33, 168, 0.8)" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
         <rect x="2" y="3" width="20" height="14" rx="2"></rect>
         <line x1="8" y1="21" x2="16" y2="21"></line>
         <line x1="12" y1="17" x2="12" y2="21"></line>
      </svg>
    </div>
  </div>

  <div class="practice-card-body">
    <div class="practice-site-row">
      <span class="practice-site-name">Interactive Activity</span>
    </div>
    <p class="practice-desc">Explore this topic on ${escHtml(practiceDomain)}.</p>
  </div>
  
  <div class="resource-card-footer">
    <span class="resource-type-label">Open Lab</span>
    <svg class="resource-open-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
  </div>
</div>` : '' }
          </div>
        </div>` : ''}

        <div class="single-post-body">${post.content||'<p>Content not available.</p>'}</div>

        <section class="comments-section" aria-label="Comments">
          <h3 class="comments-title">${I.chat} Comments (<span id="commentCount">0</span>)</h3>
          <div id="commentsList"></div>
          ${currentUser
            ? `<div class="add-comment-form">
                <h4>Leave a comment</h4>
                <textarea class="comment-textarea" id="commentInput" placeholder="Share your thoughts or ask a question..." maxlength="1000"></textarea>
                <button class="comment-submit-btn" id="submitCommentBtn">Post Comment</button>
               </div>`
            : `<p class="login-to-comment">Sign in to leave a comment.</p>`}
        </section>`;
  
  singlePostView.classList.add('active');
  singlePostView.scrollTop = 0;
  document.body.style.overflow = 'hidden';
  
  // Render MathJax equations
  if (window.MathJax?.typesetPromise) {
    MathJax.typesetPromise([singlePostContent]).catch(e => console.warn('MathJax:', e));
  }
  
  document.getElementById('likeBtn')?.addEventListener('click', () => toggleLike(post));
  // ... existing code in showSinglePost ...
  
  // Add listeners to Resource Cards (Video/Practice)
  singlePostContent.querySelectorAll('.resource-card').forEach(card => {
    card.addEventListener('click', (e) => {
      e.stopPropagation();
      const { embedUrl, embedType, embedTitle, rawUrl } = card.dataset;
      openEmbedModal(embedUrl, embedType, embedTitle, rawUrl);
    });
  });
  
  // ... existing call to loadComments(post.id) ...
  document.getElementById('shareBtn')?.addEventListener('click', () => sharePost(post));
  document.getElementById('copyLinkBtn')?.addEventListener('click', copyPostLink);
  document.getElementById('submitCommentBtn')?.addEventListener('click', () => submitComment(post.id));
  loadComments(post.id);
}

function closePostView() {
  singlePostView.classList.remove('active');
  document.body.style.overflow = '';
  history.pushState('', document.title, window.location.pathname + window.location.search);
  document.title = 'Prep Portal 2026 | Science Archive';
  activePost = null;
}

function openEmbedModal(url, type, title, rawUrl) {
  embedTitle.textContent = title;
  embedOpenLink.href = rawUrl || url;
  embedFrame.src = url;
  
  // Apply specific sizing for video (16:9) vs practice (Fixed height)
  embedFrameWrap.className = 'embed-frame-wrap ' + (type === 'video' ? 'video-mode' : 'practice-mode');
  
  embedSpinner.style.display = 'flex';
  embedOverlay.classList.add('active');
  
  // Hide spinner once iframe content loads
  embedFrame.onload = () => {
    embedSpinner.style.display = 'none';
  };
}

function closeEmbedModal() {
  embedOverlay.classList.remove('active');
  embedFrame.src = ''; // Crucial: stops video audio from playing in the background
}

// Attach listeners to the modal close buttons
embedCloseBtn.addEventListener('click', closeEmbedModal);
embedOverlay.addEventListener('click', (e) => {
  if (e.target === embedOverlay) closeEmbedModal();
});

// ─── HASH ROUTING ─────────────────────────────────────────
async function openPostFromHash() {
  const hash = window.location.hash.slice(1);
  if (!hash) return;
  const cached = allPosts.find(p => p.id === hash);
  if (cached) { showSinglePost(cached); return; }
  try {
    const snap = await getDoc(doc(db, 'science-posts', hash));
    if (!snap.exists()) return;
    const d = snap.data();
    showSinglePost({ id: snap.id, title: d.title || 'Untitled', content: d.content || '', excerpt: d.excerpt || '', featuredImage: d.featuredImage || '', videoLink: d.videoLink || '', practiceLink: d.practiceLink || '', subject: d.subject || 'math', classLevel: d.classLevel || 'ss-1', publishedAt: d.publishedAt, modelUsed: d.modelUsed || '', views: d.views || 0, likes: d.likes || [] });
  } catch (_) {}
}

window.addEventListener('popstate', e => {
  if (e.state?.postId) { const post = allPosts.find(p => p.id === e.state.postId); if (post) showSinglePost(post); }
  else if (singlePostView.classList.contains('active')) {
    singlePostView.classList.remove('active');
    document.body.style.overflow = '';
    activePost = null;
    document.title = 'Prep Portal 2026 | Science Archive';
  }
});

// ─── LIKE ─────────────────────────────────────────────────
async function toggleLike(post) {
  if (!currentUser) { showToast('Sign in to like'); return; }
  const ref = doc(db, 'science-posts', post.id);
  const likes = post.likes || [];
  const had = likes.includes(currentUser.uid);
  try {
    if (had) {
      await updateDoc(ref, { likes: arrayRemove(currentUser.uid) });
      post.likes = likes.filter(u => u !== currentUser.uid);
    }
    else {
      await updateDoc(ref, { likes: arrayUnion(currentUser.uid) });
      post.likes = [...likes, currentUser.uid];
    }
    const now = post.likes.includes(currentUser.uid);
    const btn = document.getElementById('likeBtn');
    if (btn) {
      btn.className = `action-btn like-btn${now?' liked':''}`;
      btn.innerHTML = `${now?I.heartFill:I.heart} <span id="likeCount">${post.likes.length}</span>`;
    }
    const idx = allPosts.findIndex(p => p.id === post.id);
    if (idx !== -1) allPosts[idx].likes = post.likes;
  } catch (_) { showToast('Could not update like'); }
}

// ─── SHARE ────────────────────────────────────────────────
function sharePost(post) {
  const url = `${location.origin}${location.pathname}#${post.id}`;
  if (navigator.share) navigator.share({ title: post.title, url }).catch(() => {});
  else copyToClipboard(url);
}

function copyPostLink() {
  const url = `${location.origin}${location.pathname}#${activePost?.id||''}`;
  copyToClipboard(url);
}

function copyToClipboard(text) {
  if (navigator.clipboard) navigator.clipboard.writeText(text).then(() => showToast('Link copied!'));
  else {
    const t = document.createElement('textarea');
    t.value = text;
    document.body.appendChild(t);
    t.select();
    document.execCommand('copy');
    document.body.removeChild(t);
    showToast('Link copied!');
  }
}

// ─── COMMENTS WITH LIKES + REPLIES ────────────────────────
async function loadComments(postId) {
  const list = document.getElementById('commentsList');
  const cnt = document.getElementById('commentCount');
  if (!list) return;
  list.innerHTML = `<div class="loading-spinner" style="grid-column:unset;padding:1.5rem"><div class="spinner-ring"></div></div>`;
  try {
    const snap = await getDocs(query(collection(db, 'science-posts', postId, 'comments'), orderBy('createdAt', 'asc')));
    if (cnt) cnt.textContent = snap.size;
    if (snap.empty) { list.innerHTML = '<p class="no-comments">No comments yet. Be the first!</p>'; return; }
    list.innerHTML = '';
    for (const d of snap.docs) {
      const c = d.data();
      const date = c.createdAt?.toDate ? c.createdAt.toDate().toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Just now';
      const name = c.authorName || (c.authorEmail ? c.authorEmail.split('@')[0] : 'Anonymous');
      const cLikes = c.likes || [];
      const cLiked = currentUser && cLikes.includes(currentUser.uid);
      let replyCount = 0;
      try {
        const rs = await getDocs(collection(db, 'science-posts', postId, 'comments', d.id, 'replies'));
        replyCount = rs.size;
      } catch (_) {}
      const el = document.createElement('div');
      el.className = 'comment-item';
      el.dataset.commentId = d.id;
      el.innerHTML = `
            <div class="comment-main">
              <div class="comment-author-row"><span class="comment-author">${escHtml(name)}</span><span class="comment-time">${date}</span></div>
              <p class="comment-text">${escHtml(c.text)}</p>
              <div class="comment-actions">
                <button class="comment-action-btn comment-like-btn${cLiked?' liked':''}" data-comment-id="${d.id}" data-post-id="${postId}">${cLiked?I.heartFill:I.heart}<span class="clikes">${cLikes.length||''}</span></button>
                <button class="comment-action-btn reply-toggle-btn" data-comment-id="${d.id}" data-post-id="${postId}">${I.reply} ${replyCount>0?`${replyCount} Repl${replyCount===1?'y':'ies'}`:'Reply'}</button>
              </div>
            </div>
            <div class="replies-section" id="replies-${d.id}" style="display:none">
              <div class="replies-list" id="replies-list-${d.id}"></div>
              ${currentUser?`<div class="reply-form-area" id="reply-form-${d.id}"><textarea class="reply-textarea" id="reply-input-${d.id}" placeholder="Write a reply..." maxlength="500"></textarea><div class="reply-form-actions"><button class="reply-submit-btn" data-comment-id="${d.id}" data-post-id="${postId}">Post Reply</button><button class="reply-cancel-btn" data-comment-id="${d.id}">Cancel</button></div></div>`:''}
            </div>`;
      list.appendChild(el);
    }
    list.querySelectorAll('.comment-like-btn').forEach(btn => btn.addEventListener('click', () => toggleCommentLike(btn.dataset.postId, btn.dataset.commentId, btn)));
    list.querySelectorAll('.reply-toggle-btn').forEach(btn => btn.addEventListener('click', () => toggleReplies(btn.dataset.postId, btn.dataset.commentId)));
    list.querySelectorAll('.reply-submit-btn').forEach(btn => btn.addEventListener('click', () => submitReply(btn.dataset.postId, btn.dataset.commentId)));
    list.querySelectorAll('.reply-cancel-btn').forEach(btn => btn.addEventListener('click', () => { const s = document.getElementById(`replies-${btn.dataset.commentId}`); if (s) s.style.display = 'none'; }));
  } catch (_) { list.innerHTML = '<p class="no-comments">Could not load comments.</p>'; }
}

async function toggleCommentLike(postId, commentId, btn) {
  if (!currentUser) { showToast('Sign in to like'); return; }
  const ref = doc(db, 'science-posts', postId, 'comments', commentId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;
  const likes = snap.data().likes || [];
  const had = likes.includes(currentUser.uid);
  if (had) {
    await updateDoc(ref, { likes: arrayRemove(currentUser.uid) });
    btn.classList.remove('liked');
    btn.innerHTML = `${I.heart}<span class="clikes">${Math.max(0,likes.length-1)||''}</span>`;
  }
  else {
    await updateDoc(ref, { likes: arrayUnion(currentUser.uid) });
    btn.classList.add('liked');
    btn.innerHTML = `${I.heartFill}<span class="clikes">${likes.length+1}</span>`;
  }
}

const loadedReplies = new Set();
async function toggleReplies(postId, commentId) {
  const s = document.getElementById(`replies-${commentId}`);
  if (!s) return;
  if (s.style.display !== 'none') { s.style.display = 'none'; return; }
  s.style.display = 'block';
  if (!loadedReplies.has(commentId)) {
    await loadReplies(postId, commentId);
    loadedReplies.add(commentId);
  }
}

async function loadReplies(postId, commentId) {
  const listEl = document.getElementById(`replies-list-${commentId}`);
  if (!listEl) return;
  listEl.innerHTML = '';
  try {
    const snap = await getDocs(query(collection(db, 'science-posts', postId, 'comments', commentId, 'replies'), orderBy('createdAt', 'asc')));
    if (snap.empty) return;
    snap.forEach(d => {
      const r = d.data();
      const date = r.createdAt?.toDate ? r.createdAt.toDate().toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Just now';
      const name = r.authorName || (r.authorEmail ? r.authorEmail.split('@')[0] : 'Anonymous');
      const rLikes = r.likes || [];
      const rLiked = currentUser && rLikes.includes(currentUser.uid);
      const el = document.createElement('div');
      el.className = 'reply-item';
      el.dataset.replyId = d.id;
      el.innerHTML = `<div class="reply-author-row"><span class="reply-author">${escHtml(name)}</span><span class="reply-time">${date}</span></div><p class="reply-text">${escHtml(r.text)}</p><button class="reply-like-btn${rLiked?' liked':''}" data-reply-id="${d.id}" data-comment-id="${commentId}" data-post-id="${postId}">${rLiked?I.heartFill:I.heart}<span class="rlikes">${rLikes.length||''}</span></button>`;
      listEl.appendChild(el);
    });
    listEl.querySelectorAll('.reply-like-btn').forEach(btn => btn.addEventListener('click', () => toggleReplyLike(btn.dataset.postId, btn.dataset.commentId, btn.dataset.replyId, btn)));
  } catch (_) {}
}

async function toggleReplyLike(postId, commentId, replyId, btn) {
  if (!currentUser) { showToast('Sign in to like'); return; }
  const ref = doc(db, 'science-posts', postId, 'comments', commentId, 'replies', replyId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;
  const likes = snap.data().likes || [];
  const had = likes.includes(currentUser.uid);
  if (had) {
    await updateDoc(ref, { likes: arrayRemove(currentUser.uid) });
    btn.classList.remove('liked');
    btn.innerHTML = `${I.heart}<span class="rlikes">${Math.max(0,likes.length-1)||''}</span>`;
  }
  else {
    await updateDoc(ref, { likes: arrayUnion(currentUser.uid) });
    btn.classList.add('liked');
    btn.innerHTML = `${I.heartFill}<span class="rlikes">${likes.length+1}</span>`;
  }
}

async function submitReply(postId, commentId) {
  if (!currentUser) { showToast('Sign in to reply'); return; }
  const input = document.getElementById(`reply-input-${commentId}`);
  const btn = document.querySelector(`[data-comment-id="${commentId}"].reply-submit-btn`);
  const text = input?.value.trim();
  if (!text || text.length < 2) { showToast('Reply too short'); return; }
  btn.disabled = true;
  btn.textContent = 'Posting...';
  try {
    await addDoc(collection(db, 'science-posts', postId, 'comments', commentId, 'replies'), { text, authorId: currentUser.uid, authorEmail: currentUser.email, authorName: currentUser.displayName || currentUser.email.split('@')[0], likes: [], createdAt: serverTimestamp() });
    input.value = '';
    loadedReplies.delete(commentId);
    await loadReplies(postId, commentId);
    showToast('Reply posted!');
  } catch (e) { showToast('Error: ' + e.message); }
  finally {
    btn.disabled = false;
    btn.textContent = 'Post Reply';
  }
}

async function submitComment(postId) {
  if (!currentUser) { showToast('Sign in to comment'); return; }
  const input = document.getElementById('commentInput');
  const btn = document.getElementById('submitCommentBtn');
  const text = input?.value.trim();
  if (!text || text.length < 3) { showToast('Comment too short'); return; }
  btn.disabled = true;
  btn.textContent = 'Posting...';
  try {
    await addDoc(collection(db, 'science-posts', postId, 'comments'), { text, authorId: currentUser.uid, authorEmail: currentUser.email, authorName: currentUser.displayName || currentUser.email.split('@')[0], likes: [], createdAt: serverTimestamp() });
    input.value = '';
    await loadComments(postId);
    showToast('Comment posted!');
  } catch (e) { showToast('Error: ' + e.message); }
  finally {
    btn.disabled = false;
    btn.textContent = 'Post Comment';
  }
}

// ─── LOAD POSTS ───────────────────────────────────────────
async function loadPosts() {
  try {
    const snap = await getDocs(query(collection(db, 'science-posts'), orderBy('publishedAt', 'desc')));
    allPosts = [];
    snap.forEach(d => {
      const data = d.data();
      allPosts.push({ id: d.id, title: data.title || 'Untitled', content: data.content || '', excerpt: data.excerpt || '', featuredImage: data.featuredImage || '', videoLink: data.videoLink || '', practiceLink: data.practiceLink || '', subject: data.subject || 'math', classLevel: data.classLevel || 'ss-1', publishedAt: data.publishedAt, modelUsed: data.modelUsed || '', views: data.views || 0, likes: data.likes || [] });
    });
    if (!allPosts.length) { scienceGrid.innerHTML = '<div class="no-posts">No science posts yet. Check back soon!</div>'; return; }
    renderPosts();
    if (window.location.hash) openPostFromHash();
  } catch (err) { scienceGrid.innerHTML = `<div class="no-posts">Error: ${escHtml(err.message)}</div>`; }
}

// ─── FILTER DROPDOWNS ─────────────────────────────────────
function wireDropdown(dropdownId, btnId, textId, onSelect) {
  const dropdown = document.getElementById(dropdownId);
  const btn = document.getElementById(btnId);
  const textEl = document.getElementById(textId);
  btn.addEventListener('click', e => {
    e.stopPropagation();
    const o = dropdown.classList.toggle('open');
    btn.setAttribute('aria-expanded', o);
  });
  document.addEventListener('click', e => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    }
  });
  dropdown.querySelectorAll('.dropdown-item').forEach(item => {
    item.addEventListener('click', () => {
      dropdown.querySelectorAll('.dropdown-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      textEl.textContent = item.textContent.trim();
      dropdown.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      onSelect(item.dataset.filter);
    });
  });
}

wireDropdown('subjectDropdown', 'subjectDropdownBtn', 'subjectFilterText', f => {
  currentSubject = f;
  renderPosts();
});
wireDropdown('classDropdown', 'classDropdownBtn', 'classFilterText', f => {
  currentClass = f;
  renderPosts();
});

let st;
searchInput.addEventListener('input', e => {
  clearTimeout(st);
  st = setTimeout(() => {
    currentSearch = e.target.value;
    renderPosts();
  }, 280);
});

closePostBtn.addEventListener('click', closePostView);
document.addEventListener('keydown', e => { if (e.key === 'Escape' && singlePostView.classList.contains('active')) closePostView(); });
window.addEventListener('scroll', () => scrollTopBtn.classList.toggle('show', window.scrollY > 300));
scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

const navToggle = document.getElementById('nav-toggle'),
  navLinks = document.getElementById('navLinks');
if (navToggle && navLinks) navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('open');
  navLinks.classList.toggle('open');
});

loadPosts();
setInterval(loadPosts, 60000);