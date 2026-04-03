/* ═══════════════════════════════════════════════════════════
   PREP PORTAL — WASSCE Practice Paper
   MODULE 6: Embedded Video Player Component
   ═══════════════════════════════════════════════════════════ */

'use strict';

const VideoPlayer = (() => {
  
  let activePlayer = null;
  
  function esc(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  
  function createEmbeddedPlayer(video) {
    const container = document.createElement('div');
    container.className = 'video-embedded-player';
    container.innerHTML = `
            <div class="video-player-container">
                <div class="video-player-header">
                    <div class="video-player-title">${esc(video.title)}</div>
                    <button class="video-player-close">✕</button>
                </div>
                <div class="video-iframe-wrapper">
                    <iframe 
                        src="${video.embedUrl}"
                        title="${esc(video.title)}"
                        frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen>
                    </iframe>
                </div>
                <div class="video-player-footer">
                    <div class="video-player-channel">📺 ${esc(video.channel)}</div>
                    <a href="${video.watchUrl}" target="_blank" rel="noopener" class="video-watch-youtube">
                        Watch on YouTube ↗
                    </a>
                </div>
            </div>
        `;
    
    container.querySelector('.video-player-close').addEventListener('click', () => {
      container.remove();
      activePlayer = null;
    });
    
    return container;
  }
  
  function showVideo(video, targetContainer) {
    // Remove existing player
    if (activePlayer && activePlayer.parentNode) {
      activePlayer.remove();
    }
    
    const player = createEmbeddedPlayer(video);
    targetContainer.appendChild(player);
    activePlayer = player;
    
    // Scroll player into view
    player.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  
  async function searchAndPlay(questionText, subject, level, container) {
    // Show loading
    container.innerHTML = `
            <div class="video-loading-state">
                <div class="video-spinner"></div>
                <span>Searching for ${esc(subject)} videos...</span>
            </div>
        `;
    
    try {
      const data = await fetchVideoResources(questionText, subject, level);
      
      if (!data.videos || data.videos.length === 0) {
        container.innerHTML = `
                    <div class="video-no-results">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <circle cx="12" cy="12" r="10"/>
                            <line x1="12" y1="8" x2="12" y2="12"/>
                            <circle cx="12" cy="16" r="0.5" fill="currentColor" stroke="none"/>
                        </svg>
                        <p>No videos found for this topic.</p>
                        <button class="video-retry-btn">Try Again</button>
                    </div>
                `;
        container.querySelector('.video-retry-btn')?.addEventListener('click', () => {
          searchAndPlay(questionText, subject, level, container);
        });
        return;
      }
      
      // Show video selection
      container.innerHTML = `
                <div class="video-selection-panel">
                    <div class="video-selection-header">
                        <span class="video-selection-title"> Video Resources</span>
                        <button class="video-selection-close">✕</button>
                    </div>
                    <div class="video-channels-list">
                        ${data.videos.map(v => `
                            <button class="video-channel-btn" data-video-index="${data.videos.indexOf(v)}">
                                <div class="video-channel-thumb">
                                    <img src="${esc(v.thumb)}" alt="${esc(v.title)}" loading="lazy">
                                    <div class="video-play-icon">▶</div>
                                </div>
                                <div class="video-channel-info">
                                    <div class="video-channel-name">${esc(v.channel)}</div>
                                    <div class="video-channel-title">${esc(v.title.substring(0, 60))}${v.title.length > 60 ? '…' : ''}</div>
                                    ${v.category ? `<div class="video-channel-category">${esc(v.category)}</div>` : ''}
                                </div>
                            </button>
                        `).join('')}
                    </div>
                </div>
            `;
      
      // Attach click handlers
      container.querySelectorAll('.video-channel-btn').forEach(btn => {
        const index = parseInt(btn.dataset.videoIndex);
        btn.addEventListener('click', () => {
          const video = data.videos[index];
          showVideo(video, container);
        });
      });
      
      container.querySelector('.video-selection-close').addEventListener('click', () => {
        container.innerHTML = '';
        container.classList.remove('video-panel-active');
      });
      
      container.classList.add('video-panel-active');
      
    } catch (err) {
      console.error('Video search error:', err);
      container.innerHTML = `
                <div class="video-error-state">
                    <p>${esc(err.message || 'Failed to load videos')}</p>
                    <button class="video-retry-btn">Retry</button>
                </div>
            `;
      container.querySelector('.video-retry-btn')?.addEventListener('click', () => {
        searchAndPlay(questionText, subject, level, container);
      });
    }
  }
  
  return {
    searchAndPlay,
    showVideo
  };
})();

window.VideoPlayer = VideoPlayer;