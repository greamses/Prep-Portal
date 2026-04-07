// ui-controller.js - 100% reusable across all subjects
import { auth } from './config.js';
import { onAuthStateChanged } from 'firebase/auth';
import {
  initPublisher,
  setCurrentUser,
  loadApiKeys,
  executePublishCycle,
  loadRecentPosts,
  updatePostMeta,
  updatePostImages,
  updatePostLinks,
  updatePostContent,
  deletePost,
  getPost,
  hasApiKeys,
  getSubjectName
} from './publisher-core.js';

// This module expects subjectConfig and subjectData to be passed in
let subjectConfig = null;
let subjectData = null;
let subjectLabels = null;
let subjectStyles = null;
let classLabels = null;
let classStyles = null;

// ─── DOM ELEMENTS (assumed to exist in HTML) ───────────────
const authStatusSpan = document.getElementById('authStatus');
const statusDot = document.getElementById('statusDot');
const publishCountSpan = document.getElementById('publishCount');
const nextRunMinutesSpan = document.getElementById('nextRunMinutes');
const nextRunDetailSpan = document.getElementById('nextRunDetail');
const routingIndicator = document.getElementById('routingIndicator');
const logContainer = document.getElementById('logContainer');
const forceBtn = document.getElementById('forcePublishBtn');
const restartBtn = document.getElementById('restartSchedulerBtn');
const testBtn = document.getElementById('testWriteBtn');
const refreshPostsBtn = document.getElementById('refreshPostsBtn');
const confirmModal = document.getElementById('confirmModal');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
const confirmPostTitle = document.getElementById('confirmPostTitle');
const metaModal = document.getElementById('metaModal');
const saveMetaBtn = document.getElementById('saveMetaBtn');
const cancelMetaBtn = document.getElementById('cancelMetaBtn');
const linksModal = document.getElementById('linksModal');
const saveLinksBtn = document.getElementById('saveLinksBtn');
const cancelLinksBtn = document.getElementById('cancelLinksBtn');
const imgModal = document.getElementById('imgModal');
const saveImgBtn = document.getElementById('saveImgBtn');
const cancelImgBtn = document.getElementById('cancelImgBtn');
const paraBlocksList = document.getElementById('paraBlocksList');
const featuredImgInput = document.getElementById('featuredImgInput');
const featuredImgThumb = document.getElementById('featuredImgThumb');
const imgPendingBanner = document.getElementById('imgPendingBanner');
const videoUrlInput = document.getElementById('videoUrlInput');
const practiceUrlInput = document.getElementById('practiceUrlInput');
const videoThumbImg = document.getElementById('videoThumbImg');
const videoPlayBadge = document.getElementById('videoPlayBadge');
const practicePreviewCard = document.getElementById('practicePreviewCard');
const practiceFavicon = document.getElementById('practiceFavicon');
const practiceDomain = document.getElementById('practiceDomain');
const contentModal = document.getElementById('contentModal');
const saveContentBtn = document.getElementById('saveContentBtn');
const cancelContentBtn = document.getElementById('cancelContentBtn');
const contentEditorTextarea = document.getElementById('contentEditorTextarea');
const contentPreviewPane = document.getElementById('contentPreviewPane');

// ─── STATE ─────────────────────────────────────────────────
let activeTimeout = null;
let publishCount = 0;
let pendingDeleteId = null;
let pendingMetaId = null;
let pendingImgId = null;
let pendingImgContent = '';
let pendingLinksId = null;
let pendingContentId = null;

// ─── INITIALIZATION ────────────────────────────────────────
export function initUI(config, dataModule) {
  subjectConfig = config;
  subjectData = dataModule;
  subjectLabels = dataModule.SUBJECT_LABELS;
  subjectStyles = dataModule.SUBJECT_STYLES;
  classLabels = dataModule.CLASS_LABELS;
  classStyles = dataModule.CLASS_STYLES;
  
  initPublisher(config, dataModule);
  
  // Update UI with subject name
  document.title = `${config.name} Publisher | Prep Portal 2026`;
  const headerTitle = document.querySelector('.app-header h1');
  if (headerTitle) headerTitle.textContent = `${config.name} Auto-Publisher`;
  
  addLog(`[BOOT] ${config.name} Publisher v1.0 loaded`, 'success');
}

// ─── UTILITIES ─────────────────────────────────────────────
function addLog(msg, type = 'info') {
  const t = new Date().toLocaleTimeString();
  const el = document.createElement('div');
  el.className = 'log-entry';
  const cls = { success: 'log-success', error: 'log-error', warn: 'log-warn' } [type] || 'log-info';
  el.innerHTML = `<span class="log-time">[${t}]</span> <span class="${cls}">${escapeHtml(msg)}</span>`;
  logContainer.appendChild(el);
  el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

const escapeHtml = s => { if (!s) return ''; return s.replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' } [m])); };
const formatDate = ts => { if (!ts) return '--'; const d = ts.toDate ? ts.toDate() : new Date(ts); return d.toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' }); };

function getClassLabel(classLevel) {
  if (!classLevel || !classLabels) return '--';
  const [type, num] = classLevel.split('-');
  if (classLabels[type]) return classLabels[type](num);
  return classLevel;
}

function getClassStyle(classLevel) {
  if (!classLevel || !classStyles) return 'cls-primary';
  if (classLevel.startsWith('primary')) return classStyles.primary;
  if (classLevel.startsWith('jss')) return classStyles.jss;
  return classStyles.ss;
}

function getSubjectLabel(subject) {
  return subjectLabels?.[subject] || subjectConfig?.name || subject;
}

function getSubjectStyle(subject) {
  return subjectStyles?.[subject] || 'sci-default';
}

function updateNextDisplay(ms) {
  if (!ms) {
    nextRunMinutesSpan.innerText = '--';
    nextRunDetailSpan.innerText = 'Next: idle';
    return;
  }
  const m = Math.round(ms / 60000);
  nextRunMinutesSpan.innerText = m;
  nextRunDetailSpan.innerText = `Next: in ${m} min`;
}

function clearScheduler() {
  if (activeTimeout) {
    clearTimeout(activeTimeout);
    activeTimeout = null;
  }
}

function scheduleNextRun(ms) {
  clearScheduler();
  if (!hasApiKeys()) { addLog('[SCHED] No API keys', 'warn'); return; }
  addLog(`[SCHED] Next ${subjectConfig?.name} post in ${Math.round(ms/60000)} min`, 'info');
  updateNextDisplay(ms);
  activeTimeout = setTimeout(async () => {
    activeTimeout = null;
    await runPublishCycle();
  }, ms);
}

function showRoutingBadge(provider, isFallback) {
  const cls = isFallback ? 'fallback' : provider.toLowerCase();
  const lbl = (isFallback ? `Fallback: ${provider}` : provider).toUpperCase();
  routingIndicator.innerHTML = `<div class="routing-badge ${cls}"><svg style="width:11px;height:11px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg> ${lbl}</div>`;
}

async function runPublishCycle() {
  await executePublishCycle(addLog, scheduleNextRun, (topic) => {
    // Topic selected callback
  }, (modelLabel, provider, isFallback) => {
    showRoutingBadge(provider, isFallback);
    addLog(`[MODEL] Using ${modelLabel}${isFallback ? ' (fallback)' : ''}`, 'info');
  });
}

// ─── VIDEO & PRACTICE PREVIEW ──────────────────────────────
function getYouTubeThumbnail(url) {
  if (!url) return null;
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|shorts\/)([^&\n?#]+)/);
  return m ? `https://img.youtube.com/vi/${m[1]}/mqdefault.jpg` : null;
}

function getDomain(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch (_) {
    return url;
  }
}

videoUrlInput?.addEventListener('input', () => {
  let input = videoUrlInput.value.trim();
  if (input.includes('<iframe')) {
    const srcMatch = input.match(/src=["']([^"']+)["']/);
    input = srcMatch ? srcMatch[1] : input;
  }
  const thumb = getYouTubeThumbnail(input);
  if (thumb) {
    videoThumbImg.src = thumb;
    videoThumbImg.classList.add('visible');
    videoPlayBadge.style.display = 'flex';
  } else {
    videoThumbImg.classList.remove('visible');
    videoPlayBadge.style.display = 'none';
  }
});

practiceUrlInput?.addEventListener('input', () => {
  let input = practiceUrlInput.value.trim();
  if (input.includes('<iframe')) {
    const srcMatch = input.match(/src=["']([^"']+)["']/);
    input = srcMatch ? srcMatch[1] : input;
  }
  if (input) {
    const domain = getDomain(input);
    practiceDomain.textContent = domain;
    practiceFavicon.src = `https://image.thum.io/get/width/100/crop/100/${input}`;
    practiceFavicon.onerror = () => {
      practiceFavicon.src = `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
    };
    practicePreviewCard.classList.add('visible');
  } else {
    practicePreviewCard.classList.remove('visible');
  }
});

// ─── LOAD POSTS UI ─────────────────────────────────────────
async function renderRecentPosts() {
  const list = document.getElementById('managePostsList');
  if (!list) return;
  list.innerHTML = `<li class="manage-loading"><div class="spinner-ring"></div>Loading ${subjectConfig?.name} posts...</li>`;
  try {
    const posts = await loadRecentPosts(30);
    if (!posts.length) { list.innerHTML = `<li class="manage-empty">No ${subjectConfig?.name} posts yet.</li>`; return; }
    list.innerHTML = '';
    posts.forEach(post => {
      const subj = post.subject || Object.keys(subjectLabels || {})[0] || 'default';
      const cls = post.classLevel || 'ss-1';
      const sciCls = getSubjectStyle(subj);
      const clsCls = getClassStyle(cls);
      const subjLbl = getSubjectLabel(subj);
      const clsLbl = getClassLabel(cls);
      const hasImg = !!post.featuredImage || post.imagesAdded;
      const hasLinks = post.linksAdded || (post.videoLink || post.practiceLink);
      
      const li = document.createElement('li');
      li.className = 'manage-post-item';
      li.innerHTML = `
        <div class="manage-post-info">
          <div class="manage-post-title" title="${escapeHtml(post.title || '')}">${escapeHtml(post.title || 'Untitled')}</div>
          <div class="manage-post-meta">
            <span>${formatDate(post.publishedAt)}</span>
            <span class="sci-badge ${sciCls}">${subjLbl}</span>
            <span class="cls-badge ${clsCls}">${clsLbl}</span>
            ${post.modelUsed ? `<span>${escapeHtml(post.modelUsed.split(' ').slice(0,2).join(' '))}</span>` : ''}
            ${post.views ? `<span>${post.views} views</span>` : ''}
            ${!hasImg ? `<span class="pill-pending"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>No imgs</span>` : ''}
            ${!hasLinks ? `<span class="pill-pending pill-links-missing"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>No links</span>` : ''}
          </div>
        </div>
        <div class="manage-post-actions">
          <button class="btn btn-sm btn-links links-btn" data-id="${post.id}" data-title="${escapeHtml(post.title || 'Untitled')}" data-video="${escapeHtml(post.videoLink || '')}" data-practice="${escapeHtml(post.practiceLink || '')}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
            <span class="btn-label">Links</span>
          </button>
          <button class="btn btn-sm btn-edit img-btn" data-id="${post.id}" data-title="${escapeHtml(post.title || 'Untitled')}" data-featured="${escapeHtml(post.featuredImage || '')}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
            <span class="btn-label">Images</span>
          </button>
          <button class="btn btn-sm meta-btn" data-id="${post.id}" data-title="${escapeHtml(post.title || '')}" data-subject="${escapeHtml(subj)}" data-class="${escapeHtml(cls)}" data-excerpt="${escapeHtml(post.excerpt || '')}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            <span class="btn-label">Edit</span>
          </button>
          <button class="btn btn-sm content-btn" data-id="${post.id}" data-title="${escapeHtml(post.title || 'Untitled')}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            <span class="btn-label">Content</span>
          </button>
          <button class="btn btn-sm btn-danger del-btn" data-id="${post.id}" data-title="${escapeHtml(post.title || 'Untitled')}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6l-1 14H6L5 6"></path><path d="M10 11v6M14 11v6"></path><path d="M9 6V4h6v2"></path></svg>
            <span class="btn-label">Delete</span>
          </button>
        </div>`;
      list.appendChild(li);
    });
    
    attachButtonListeners(list);
  } catch (e) {
    list.innerHTML = `<li class="manage-empty">Error: ${escapeHtml(e.message)}</li>`;
    addLog(`[ERR] ${e.message}`, 'error');
  }
}

function attachButtonListeners(container) {
  container.querySelectorAll('.links-btn').forEach(btn => {
    btn.addEventListener('click', () => openLinksModal(btn.dataset.id, btn.dataset.title, btn.dataset.video, btn.dataset.practice));
  });
  container.querySelectorAll('.img-btn').forEach(btn => {
    btn.addEventListener('click', () => openImageEditor(btn.dataset.id, btn.dataset.title, btn.dataset.featured));
  });
  container.querySelectorAll('.meta-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      pendingMetaId = btn.dataset.id;
      document.getElementById('metaTitle').value = btn.dataset.title || '';
      document.getElementById('metaSubject').value = btn.dataset.subject || Object.keys(subjectLabels || {})[0] || 'default';
      document.getElementById('metaClass').value = btn.dataset.class || 'ss-1';
      document.getElementById('metaExcerpt').value = btn.dataset.excerpt || '';
      metaModal.classList.add('active');
    });
  });
  container.querySelectorAll('.content-btn').forEach(btn => {
    btn.addEventListener('click', () => openContentEditor(btn.dataset.id, btn.dataset.title));
  });
  container.querySelectorAll('.del-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      pendingDeleteId = btn.dataset.id;
      confirmPostTitle.textContent = `"${btn.dataset.title}" — this cannot be undone.`;
      confirmModal.classList.add('active');
    });
  });
}

// ─── MODAL HANDLERS ─────────────────────────────────────────
function openLinksModal(postId, postTitle, currentVideo, currentPractice) {
  pendingLinksId = postId;
  const subtitle = document.getElementById('linksModalSubtitle');
  if (subtitle) subtitle.textContent = `"${postTitle}" — add video and interactive practice link.`;
  videoUrlInput.value = currentVideo || '';
  practiceUrlInput.value = currentPractice || '';
  videoThumbImg.classList.remove('visible');
  videoPlayBadge.style.display = 'none';
  practicePreviewCard.classList.remove('visible');
  if (currentVideo) videoUrlInput.dispatchEvent(new Event('input'));
  if (currentPractice) practiceUrlInput.dispatchEvent(new Event('input'));
  linksModal.classList.add('active');
}

async function openImageEditor(postId, postTitle, currentFeatured) {
  pendingImgId = postId;
  const subtitle = document.getElementById('imgModalSubtitle');
  if (subtitle) subtitle.textContent = `"${postTitle}" — paste image URLs per paragraph.`;
  paraBlocksList.innerHTML = `<div class="manage-loading"><div class="spinner-ring"></div>Loading...</div>`;
  imgPendingBanner.style.display = 'none';
  featuredImgInput.value = currentFeatured || '';
  updateFeaturedThumb(currentFeatured || '');
  imgModal.classList.add('active');
  try {
    const post = await getPost(postId);
    if (!post) { addLog('[IMG] Post not found', 'error'); return; }
    pendingImgContent = post.content || '';
    imgPendingBanner.style.display = (!post.featuredImage && !post.imagesAdded) ? 'flex' : 'none';
    renderParaBlocks(pendingImgContent);
  } catch (e) {
    paraBlocksList.innerHTML = `<div class="manage-empty">Error: ${escapeHtml(e.message)}</div>`;
  }
}

async function openContentEditor(postId, postTitle) {
  pendingContentId = postId;
  const subtitle = document.getElementById('contentModalSubtitle');
  if (subtitle) subtitle.textContent = `"${postTitle}"`;
  if (contentEditorTextarea) contentEditorTextarea.value = '<link rel="stylesheet" href="../../render.css">';
  if (contentPreviewPane) contentPreviewPane.innerHTML = '';
  contentModal.classList.add('active');
  try {
    const post = await getPost(postId);
    if (!post) { addLog('[CONTENT] Post not found', 'error'); return; }
    contentEditorTextarea.value += post.content || '<link rel="stylesheet" href="../../render.css">';
    contentPreviewPane.innerHTML = post.content || '';
    if (window.MathJax) MathJax.typesetPromise([contentPreviewPane]);
  } catch (e) {
    addLog(`[ERR] ${e.message}`, 'error');
  }
}

function renderParaBlocks(html) {
  const container = document.createElement('div');
  container.innerHTML = html;
  const BLOCK_TAGS = new Set(['H1', 'H2', 'H3', 'H4', 'P', 'UL', 'OL', 'BLOCKQUOTE', 'TABLE', 'PRE', 'DIV']);
  const blocks = [];
  container.childNodes.forEach(node => {
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    if (node.tagName === 'IMG') return;
    if (BLOCK_TAGS.has(node.tagName)) blocks.push(node);
  });
  if (!blocks.length) { paraBlocksList.innerHTML = '<div class="manage-empty">No paragraph blocks found.</div>'; return; }
  paraBlocksList.innerHTML = '';
  blocks.forEach((block, idx) => {
    const preview = block.textContent.trim().replace(/\s+/g, ' ').substring(0, 90);
    const row = document.createElement('div');
    row.className = 'para-block';
    row.dataset.idx = idx;
    row.innerHTML = `
      <div class="para-block-header">
        <span class="para-block-type">${block.tagName}</span>
        <span class="para-block-preview">${escapeHtml(preview) || '(empty)'}</span>
      </div>
      <div class="para-block-body">
        <div class="para-img-row">
          <input type="url" class="para-img-input" data-idx="${idx}" placeholder="Image URL (leave blank to skip)">
          <img class="para-img-preview" alt="" data-idx="${idx}">
        </div>
        <p class="para-void-note"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>Leave blank for no image on this paragraph.</p>
      </div>`;
    paraBlocksList.appendChild(row);
    const input = row.querySelector('.para-img-input');
    const prev = row.querySelector('.para-img-preview');
    input.addEventListener('input', () => {
      const u = input.value.trim();
      if (u) {
        input.classList.add('has-img');
        prev.src = u;
        prev.classList.add('visible');
        prev.onerror = () => {
          prev.src = '';
          prev.classList.remove('visible');
        };
      } else {
        input.classList.remove('has-img');
        prev.src = '';
        prev.classList.remove('visible');
      }
    });
  });
  paraBlocksList._blocks = blocks;
}

function updateFeaturedThumb(url) {
  if (url) {
    featuredImgThumb.src = url;
    featuredImgThumb.classList.add('visible');
    featuredImgThumb.onerror = () => {
      featuredImgThumb.src = '';
      featuredImgThumb.classList.remove('visible');
    };
  } else {
    featuredImgThumb.src = '';
    featuredImgThumb.classList.remove('visible');
  }
}

// ─── CONTENT EDITOR LIVE PREVIEW ───────────────────────────
contentEditorTextarea?.addEventListener('input', () => {
  contentPreviewPane.innerHTML = contentEditorTextarea.value;
  if (window.MathJax) MathJax.typesetPromise([contentPreviewPane]);
});

// ─── SAVE HANDLERS ─────────────────────────────────────────
saveContentBtn?.addEventListener('click', async () => {
  if (!pendingContentId) return;
  const content = contentEditorTextarea.value.trim();
  if (!content) { addLog('[CONTENT] Content cannot be empty', 'warn'); return; }
  saveContentBtn.disabled = true;
  saveContentBtn.textContent = 'Saving...';
  try {
    await updatePostContent(pendingContentId, content);
    addLog(`[CONTENT] Saved for ${pendingContentId.substring(0,10)}...`, 'success');
    contentModal.classList.remove('active');
    pendingContentId = null;
    await renderRecentPosts();
  } catch (e) { addLog(`[ERR] ${e.message}`, 'error'); }
  finally {
    saveContentBtn.disabled = false;
    saveContentBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>Save Content`;
  }
});

saveLinksBtn?.addEventListener('click', async () => {
  if (!pendingLinksId) return;
  const video = videoUrlInput.value.trim();
  const practice = practiceUrlInput.value.trim();
  saveLinksBtn.disabled = true;
  saveLinksBtn.textContent = 'Saving...';
  try {
    await updatePostLinks(pendingLinksId, video, practice, !!(video || practice));
    addLog(`[LINKS] Saved for ${pendingLinksId.substring(0,10)}...`, 'success');
    linksModal.classList.remove('active');
    pendingLinksId = null;
    await renderRecentPosts();
  } catch (e) { addLog(`[ERR] ${e.message}`, 'error'); }
  finally {
    saveLinksBtn.disabled = false;
    saveLinksBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>Save Links`;
  }
});

saveImgBtn?.addEventListener('click', async () => {
  if (!pendingImgId) return;
  const featured = featuredImgInput.value.trim();
  const blocks = paraBlocksList._blocks || [];
  const inputs = paraBlocksList.querySelectorAll('.para-img-input');
  const IMG_STYLE = 'width:100%;max-width:100%;height:auto;border-radius:8px;margin:1.25rem 0;display:block;';
  let newContent = '';
  blocks.forEach((block, idx) => {
    newContent += block.outerHTML;
    const input = inputs[idx];
    if (input?.value.trim()) newContent += `<img src="${escapeHtml(input.value.trim())}" alt="${escapeHtml(block.textContent.trim().substring(0,40))}" style="${IMG_STYLE}">`;
  });
  if (!newContent) newContent = pendingImgContent;
  const hasAnyImg = !!featured || [...inputs].some(i => i.value.trim());
  saveImgBtn.disabled = true;
  saveImgBtn.textContent = 'Saving...';
  try {
    await updatePostImages(pendingImgId, newContent, featured, hasAnyImg);
    addLog(`[IMG] Images saved for ${pendingImgId.substring(0,10)}...`, 'success');
    imgModal.classList.remove('active');
    pendingImgId = null;
    pendingImgContent = '';
    await renderRecentPosts();
  } catch (e) { addLog(`[ERR] ${e.message}`, 'error'); }
  finally {
    saveImgBtn.disabled = false;
    saveImgBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>Save Images`;
  }
});

saveMetaBtn?.addEventListener('click', async () => {
  if (!pendingMetaId) return;
  const title = document.getElementById('metaTitle').value.trim();
  const subject = document.getElementById('metaSubject').value;
  const cls = document.getElementById('metaClass').value;
  const excerpt = document.getElementById('metaExcerpt').value.trim();
  if (!title) { addLog('[META] Title required', 'warn'); return; }
  saveMetaBtn.disabled = true;
  saveMetaBtn.textContent = 'Saving...';
  try {
    await updatePostMeta(pendingMetaId, { title, subject, classLevel: cls, excerpt });
    addLog(`[META] Updated: "${title}"`, 'success');
    metaModal.classList.remove('active');
    pendingMetaId = null;
    await renderRecentPosts();
  } catch (e) { addLog(`[ERR] ${e.message}`, 'error'); }
  finally {
    saveMetaBtn.disabled = false;
    saveMetaBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>Save Details`;
  }
});

confirmDeleteBtn?.addEventListener('click', async () => {
  if (!pendingDeleteId) return;
  confirmDeleteBtn.disabled = true;
  confirmDeleteBtn.textContent = 'Deleting...';
  try {
    await deletePost(pendingDeleteId);
    addLog(`[DEL] ${pendingDeleteId.substring(0,10)}...`, 'success');
    confirmModal.classList.remove('active');
    pendingDeleteId = null;
    await renderRecentPosts();
  } catch (e) { addLog(`[ERR] ${e.message}`, 'error'); }
  finally {
    confirmDeleteBtn.disabled = false;
    confirmDeleteBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6l-1 14H6L5 6"></path><path d="M10 11v6M14 11v6"></path><path d="M9 6V4h6v2"></path></svg>Yes, Delete`;
  }
});

// ─── CLOSE MODALS ──────────────────────────────────────────
cancelContentBtn?.addEventListener('click', () => {
  contentModal.classList.remove('active');
  pendingContentId = null;
});
cancelLinksBtn?.addEventListener('click', () => {
  linksModal.classList.remove('active');
  pendingLinksId = null;
});
cancelImgBtn?.addEventListener('click', () => {
  imgModal.classList.remove('active');
  pendingImgId = null;
  pendingImgContent = '';
});
cancelMetaBtn?.addEventListener('click', () => {
  metaModal.classList.remove('active');
  pendingMetaId = null;
});
cancelDeleteBtn?.addEventListener('click', () => {
  confirmModal.classList.remove('active');
  pendingDeleteId = null;
});

[confirmModal, metaModal, linksModal, imgModal, contentModal].forEach(modal => {
  modal?.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('active'); });
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape')[confirmModal, metaModal, linksModal, imgModal, contentModal].forEach(m => { m?.classList.remove('active'); });
});

// ─── FORCE PUBLISH & RESTART ───────────────────────────────
forceBtn?.addEventListener('click', async () => {
  if (!hasApiKeys()) {
    if (currentUser) await loadApiKeys(currentUser, subjectConfig);
    else { addLog('[MAN] No user signed in', 'error'); return; }
  }
  clearScheduler();
  addLog(`[MAN] Manual ${subjectConfig?.name} post publish`, 'info');
  await runPublishCycle();
});

restartBtn?.addEventListener('click', () => {
  clearScheduler();
  if (hasApiKeys()) {
    scheduleNextRun(Math.floor(Math.random() * 5 * 60 * 1000 + 10 * 60 * 1000));
    addLog('[OK] Scheduler restarted', 'success');
  } else addLog('[WARN] No API keys available', 'error');
});

testBtn?.addEventListener('click', async () => {
  addLog('[TEST] Testing Firestore connection...', 'info');
  try {
    const posts = await loadRecentPosts(5);
    addLog(`[OK] Found ${posts.length} ${subjectConfig?.name} posts`, 'success');
  } catch (e) { addLog(`[ERR] ${e.message}`, 'error'); }
});

refreshPostsBtn?.addEventListener('click', renderRecentPosts);

// ─── AUTH & INIT ───────────────────────────────────────────
const saved = localStorage.getItem(`${subjectConfig?.collectionName}Count`);
if (saved) {
  publishCount = parseInt(saved);
  if (publishCountSpan) publishCountSpan.innerText = publishCount;
}

onAuthStateChanged(auth, async user => {
  if (user) {
    setCurrentUser(user);
    const short = user.email.length > 26 ? user.email.substring(0, 24) + '...' : user.email;
    if (statusDot) statusDot.classList.remove('red');
    if (authStatusSpan) authStatusSpan.innerHTML = `<span class="status-dot"></span>${escapeHtml(short)}`;
    addLog(`[AUTH] ${user.email}`, 'success');
    const ok = await loadApiKeys(user, subjectConfig);
    if (ok && !activeTimeout) {
      addLog(`[READY] Starting ${subjectConfig?.name} scheduler...`, 'success');
      scheduleNextRun(Math.floor(Math.random() * 5 * 60 * 1000 + 10 * 60 * 1000));
    }
    await renderRecentPosts();
  } else {
    if (statusDot) statusDot.classList.add('red');
    if (authStatusSpan) authStatusSpan.innerHTML = `<span class="status-dot red"></span>Waiting for sign-in...`;
    addLog('[AUTH] Waiting for sign-in...', 'info');
  }
});

setInterval(() => { if (currentUser && hasApiKeys()) console.log(`[ALIVE] ${subjectConfig?.name} publisher running`); }, 30000);
addLog(`[READY] ${subjectConfig?.name} Publisher — waiting for API keys...`, 'info');