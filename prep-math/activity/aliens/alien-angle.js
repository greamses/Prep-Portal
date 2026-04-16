// alien-angle.js - Alien Angle Game Logic

// ---------- CONFIGURATION ----------
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const ORIGIN = { x: 400, y: 560 };
const RADIUS = 320;
const ALIEN = "👾";
const ROCKET = "🚀";
const EXPLOSION = "💥";

// Game state
let state = {
  phase: 'aiming',
  showProtractor: false,
  targetAngle: 51,
  currentAngle: 0,
  alienHue: 120,
  hits: 0,
  shots: 0,
  projectile: { x: ORIGIN.x, y: ORIGIN.y, speed: 8, flying: false },
  showExplosion: false,
  explosionPos: { x: 0, y: 0 },
  explosionTimer: 0,
  stars: [],
  difficulty: 3,
  soundEnabled: true
};

// UI Elements
let slider, shootBtn, newAlienBtn, resetStatsBtn;
let alienAngleDisplay, shotPrecisionDisplay, shotProgressDisplay;
let gameFeedback, modalScore, statsShots, statsHits, statsAccuracy;
let protractorCheck, protractorModalCheck, soundCheck;

// Audio context
let audioCtx = null;

// ---------- INITIALIZATION ----------
function initGame() {
  // Generate stars
  for (let i = 0; i < 200; i++) {
    state.stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * (canvas.height - 150),
      size: Math.random() * 2,
      color: Math.random() > 0.8 ? '#ffeeba' : '#ffffff'
    });
  }
  
  // Get UI elements
  slider = document.getElementById('angle-slider');
  shootBtn = document.getElementById('shoot-btn');
  newAlienBtn = document.getElementById('new-alien-btn');
  resetStatsBtn = document.getElementById('reset-stats-btn');
  alienAngleDisplay = document.getElementById('alien-angle');
  shotPrecisionDisplay = document.getElementById('shot-precision');
  shotProgressDisplay = document.getElementById('shot-progress');
  gameFeedback = document.getElementById('game-feedback');
  modalScore = document.getElementById('modal-score');
  statsShots = document.getElementById('stat-shots');
  statsHits = document.getElementById('stat-hits');
  statsAccuracy = document.getElementById('stat-accuracy');
  protractorCheck = document.getElementById('show-protractor');
  protractorModalCheck = document.getElementById('show-protractor-modal');
  soundCheck = document.getElementById('sound-enabled');
  
  // Initialize audio
  if (window.AudioContext || window.webkitAudioContext) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  
  // Event listeners
  slider.addEventListener('input', updateAngle);
  protractorCheck.addEventListener('change', toggleProtractor);
  protractorModalCheck.addEventListener('change', toggleProtractorModal);
  soundCheck.addEventListener('change', toggleSound);
  
  // Start game loop
  updateUI();
  gameLoop();
}

// ---------- AUDIO ----------
function initAudio() {
  if (!audioCtx || !state.soundEnabled) return;
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function playShootSound() {
  if (!audioCtx || !state.soundEnabled) return;
  initAudio();
  
  const now = audioCtx.currentTime;
  const osc1 = audioCtx.createOscillator();
  const gain1 = audioCtx.createGain();
  osc1.type = 'sawtooth';
  osc1.frequency.setValueAtTime(120, now);
  osc1.frequency.exponentialRampToValueAtTime(60, now + 0.4);
  gain1.gain.setValueAtTime(0.15, now);
  gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
  osc1.connect(gain1).connect(audioCtx.destination);
  osc1.start();
  osc1.stop(now + 0.5);
}

function playHitSound() {
  if (!audioCtx || !state.soundEnabled) return;
  initAudio();
  
  const now = audioCtx.currentTime;
  const osc1 = audioCtx.createOscillator();
  const gain1 = audioCtx.createGain();
  osc1.type = 'sawtooth';
  osc1.frequency.setValueAtTime(150, now);
  osc1.frequency.exponentialRampToValueAtTime(30, now + 0.4);
  gain1.gain.setValueAtTime(0.25, now);
  gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
  osc1.connect(gain1).connect(audioCtx.destination);
  osc1.start();
  osc1.stop(now + 0.5);
}

function playMissSound() {
  if (!audioCtx || !state.soundEnabled) return;
  initAudio();
  
  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(500, now);
  osc.frequency.exponentialRampToValueAtTime(200, now + 0.6);
  gain.gain.setValueAtTime(0.1, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
  osc.connect(gain).connect(audioCtx.destination);
  osc.start();
  osc.stop(now + 0.6);
}

// ---------- GAME FUNCTIONS ----------
function updateAngle() {
  state.currentAngle = parseInt(slider.value);
  document.getElementById('angle-display').textContent = state.currentAngle + '°';
}

function toggleProtractor(e) {
  state.showProtractor = e.target.checked;
  if (protractorModalCheck) protractorModalCheck.checked = e.target.checked;
}

function toggleProtractorModal(e) {
  state.showProtractor = e.target.checked;
  if (protractorCheck) protractorCheck.checked = e.target.checked;
}

function toggleSound(e) {
  state.soundEnabled = e.target.checked;
}

function getXY(angleDegrees, radius) {
  const rad = angleDegrees * (Math.PI / 180);
  return {
    x: ORIGIN.x + radius * Math.cos(rad),
    y: ORIGIN.y - radius * Math.sin(rad)
  };
}

function spawnNewAlien() {
  if (state.phase === 'shooting' && state.projectile.flying) return;
  
  state.targetAngle = Math.floor(Math.random() * 160) + 10;
  state.alienHue = Math.floor(Math.random() * 360);
  state.phase = 'aiming';
  state.projectile.flying = false;
  state.projectile.x = ORIGIN.x;
  state.projectile.y = ORIGIN.y;
  state.showExplosion = false;
  slider.value = 0;
  state.currentAngle = 0;
  
  updateUI();
  gameFeedback.className = 'gp-feedback-box';
  gameFeedback.textContent = 'New alien detected! Align your shot.';
}

function fireShot() {
  if (state.phase === 'aiming') {
    state.phase = 'shooting';
    state.projectile.flying = true;
    state.shots++;
    playShootSound();
    updateUI();
    gameFeedback.textContent = 'Shot fired!';
  } else if (state.phase === 'shooting' && !state.projectile.flying) {
    spawnNewAlien();
  }
}

function resetStats() {
  state.hits = 0;
  state.shots = 0;
  updateUI();
  gameFeedback.textContent = 'Stats reset. Keep practicing!';
}

function updateUI() {
  if (alienAngleDisplay) alienAngleDisplay.textContent = state.targetAngle + '°';
  
  if (state.phase === 'aiming') {
    if (shotPrecisionDisplay) shotPrecisionDisplay.textContent = '-';
  } else {
    const precision = Math.abs(state.targetAngle - state.currentAngle);
    if (shotPrecisionDisplay) shotPrecisionDisplay.textContent = precision + '°';
  }
  
  if (shotProgressDisplay) {
    shotProgressDisplay.textContent = state.hits + '/' + state.shots;
  }
  
  if (modalScore) modalScore.textContent = state.hits + '/' + state.shots;
  if (statsShots) statsShots.textContent = state.shots;
  if (statsHits) statsHits.textContent = state.hits;
  
  const accuracy = state.shots > 0 ? Math.round((state.hits / state.shots) * 100) : 0;
  if (statsAccuracy) statsAccuracy.textContent = accuracy + '%';
}

// ---------- RENDERING ----------
function drawArrowLine(fromX, fromY, toX, toY, color, width, dashed = false) {
  const headlen = 12;
  const dx = toX - fromX;
  const dy = toY - fromY;
  const angle = Math.atan2(dy, dx);
  
  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  if (dashed) {
    ctx.setLineDash([8, 6]);
  } else {
    ctx.setLineDash([]);
  }
  ctx.stroke();
  ctx.setLineDash([]);
  
  ctx.beginPath();
  ctx.moveTo(toX, toY);
  ctx.lineTo(toX - headlen * Math.cos(angle - Math.PI / 7), toY - headlen * Math.sin(angle - Math.PI / 7));
  ctx.lineTo(toX - headlen * Math.cos(angle + Math.PI / 7), toY - headlen * Math.sin(angle + Math.PI / 7));
  ctx.lineTo(toX, toY);
  ctx.fillStyle = color;
  ctx.fill();
}

function drawProtractor() {
  if (!state.showProtractor) return;
  
  const INNER_R = RADIUS - 70;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
  ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
  ctx.lineWidth = 1.5;
  
  ctx.beginPath();
  ctx.arc(ORIGIN.x, ORIGIN.y, RADIUS, Math.PI, 0);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(ORIGIN.x, ORIGIN.y, INNER_R, Math.PI, 0);
  ctx.stroke();
  
  for (let a = 0; a <= 180; a++) {
    if (a % 10 === 0) {
      const start = getXY(a, RADIUS);
      const end = getXY(a, RADIUS - 15);
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(start.x, start.y); ctx.lineTo(end.x, end.y); ctx.stroke();
      
      ctx.save();
      const textPos = getXY(a, RADIUS - 28);
      ctx.translate(textPos.x, textPos.y);
      ctx.rotate((90 - a) * Math.PI / 180);
      ctx.font = "bold 16px 'JetBrains Mono'";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(a, 0, 0);
      ctx.restore();
    }
  }
}

function gameLoop() {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw stars
  state.stars.forEach(s => {
    ctx.fillStyle = s.color;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
    ctx.fill();
  });
  
  // Draw base radius (0-degree line)
  const zeroPos = getXY(0, RADIUS + 20);
  drawArrowLine(ORIGIN.x, ORIGIN.y, zeroPos.x, zeroPos.y, "rgba(255, 255, 255, 0.6)", 1.5);
  
  // Draw protractor if enabled
  drawProtractor();
  
  // Draw 0-degree reference
  const refPos = getXY(0, RADIUS + 40);
  drawArrowLine(ORIGIN.x, ORIGIN.y, refPos.x, refPos.y, "rgba(255, 255, 255, 0.3)", 1);
  
  // White aiming arrow
  if (state.phase === 'aiming' || (state.phase === 'shooting' && !state.projectile.flying)) {
    const currentPos = getXY(state.currentAngle, RADIUS + 40);
    drawArrowLine(ORIGIN.x, ORIGIN.y, currentPos.x, currentPos.y, "#ffffff", 2.5);
  }
  
  // Red target arrow and alien
  if (state.phase === 'shooting') {
    const targetPos = getXY(state.targetAngle, RADIUS + 15);
    drawArrowLine(ORIGIN.x, ORIGIN.y, targetPos.x, targetPos.y, "#ff2200", 2, true);
    
    const alienPos = getXY(state.targetAngle, RADIUS + 35);
    ctx.save();
    ctx.filter = `hue-rotate(${state.alienHue}deg) saturate(200%)`;
    ctx.font = "40px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(ALIEN, alienPos.x, alienPos.y);
    ctx.restore();
  }
  
  // Explosion effect
  if (state.showExplosion && state.explosionTimer > 0) {
    ctx.font = "50px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(EXPLOSION, state.explosionPos.x, state.explosionPos.y);
    state.explosionTimer--;
    if (state.explosionTimer <= 0) {
      state.showExplosion = false;
    }
  }
  
  // Projectile
  if (state.phase === 'shooting' && state.projectile.flying) {
    const rad = state.currentAngle * (Math.PI / 180);
    state.projectile.x += state.projectile.speed * Math.cos(rad);
    state.projectile.y -= state.projectile.speed * Math.sin(rad);
    
    const dist = Math.hypot(state.projectile.x - ORIGIN.x, state.projectile.y - ORIGIN.y);
    
    if (dist >= RADIUS + 40) {
      state.projectile.flying = false;
      const precision = Math.abs(state.targetAngle - state.currentAngle);
      const hitPos = getXY(state.currentAngle, RADIUS + 35);
      
      if (precision <= state.difficulty) {
        state.hits++;
        state.showExplosion = true;
        state.explosionPos = hitPos;
        state.explosionTimer = 20;
        playHitSound();
        gameFeedback.className = 'gp-feedback-box success';
        gameFeedback.textContent = `Direct hit! Precision: ${precision}°`;
      } else {
        playMissSound();
        gameFeedback.className = 'gp-feedback-box miss';
        gameFeedback.textContent = `Miss! Off by ${precision}°. Try again.`;
      }
      updateUI();
    } else {
      ctx.save();
      ctx.translate(state.projectile.x, state.projectile.y);
      ctx.rotate(-rad + Math.PI / 4);
      ctx.font = "30px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(ROCKET, 0, 0);
      ctx.restore();
      
      ctx.beginPath();
      ctx.moveTo(ORIGIN.x, ORIGIN.y);
      ctx.lineTo(state.projectile.x, state.projectile.y);
      ctx.strokeStyle = "rgba(255,255,255,0.2)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([5, 5]);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }
  
  requestAnimationFrame(gameLoop);
}

// ---------- MODAL CONTROL ----------
function openGameModal() {
  document.getElementById('game-modal').classList.add('active');
  document.body.style.overflow = 'hidden';
  initAudio();
  updateUI();
}

function closeGameModal() {
  document.getElementById('game-modal').classList.remove('active');
  document.body.style.overflow = '';
}

// ---------- DROPDOWN LOGIC ----------
function toggleDropdown(id) {
  const dd = document.getElementById(id);
  if (!dd) return;
  const isOpen = dd.classList.contains('open');
  document.querySelectorAll('.pp-dropdown.open').forEach(el => el.classList.remove('open'));
  if (!isOpen) dd.classList.add('open');
}

document.addEventListener('click', (e) => {
  if (!e.target.closest('.pp-dropdown')) {
    document.querySelectorAll('.pp-dropdown.open').forEach(el => el.classList.remove('open'));
  }
});

document.querySelectorAll('.pp-dropdown-list').forEach(list => {
  list.addEventListener('click', (e) => {
    const item = e.target.closest('.pp-dropdown-item');
    if (!item) return;
    const dd = item.closest('.pp-dropdown');
    const value = item.dataset.value;
    const headerSpan = dd.querySelector('.dd-selected');
    
    list.querySelectorAll('.pp-dropdown-item').forEach(i => i.classList.remove('selected'));
    item.classList.add('selected');
    if (headerSpan) headerSpan.textContent = item.textContent.trim();
    dd.classList.remove('open');
    
    if (dd.id === 'dd-difficulty') {
      state.difficulty = value === 'easy' ? 5 : value === 'medium' ? 3 : 1;
    }
    if (dd.id === 'dd-speed') {
      state.projectile.speed = value === 'slow' ? 5 : value === 'normal' ? 8 : 12;
    }
  });
});

// ---------- EXPOSE TO GLOBAL ----------
window.toggleDropdown = toggleDropdown;
window.openGameModal = openGameModal;
window.closeGameModal = closeGameModal;
window.spawnNewAlien = spawnNewAlien;
window.fireShot = fireShot;
window.resetStats = resetStats;
window.updateAngle = updateAngle;

// ---------- START ----------
document.addEventListener('DOMContentLoaded', () => {
  // Initialize ticker
  const track = document.getElementById('ticker-track');
  if (track && track.children.length === 0) {
    const words = ['Alien Angle', 'Angle Estimation', 'Precision Shooting', 'Geometry Practice', 'Prep Portal 2026'];
    [...words, ...words].forEach(t => {
      const s = document.createElement('span');
      s.className = 'ticker-item';
      s.textContent = t;
      track.appendChild(s);
    });
  }
  
  initGame();
  spawnNewAlien();
});