let audioCtx = null;

export function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
}

export function playFlipSound() {
  initAudio();
  if (!audioCtx) return;

  const duration = 0.5;
  const bufferSize = audioCtx.sampleRate * duration;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const noise = audioCtx.createBufferSource();
  noise.buffer = buffer;

  const filter = audioCtx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.setValueAtTime(1000, audioCtx.currentTime);
  filter.frequency.exponentialRampToValueAtTime(
    120,
    audioCtx.currentTime + duration,
  );
  filter.Q.setValueAtTime(4.0, audioCtx.currentTime);

  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(0.15, audioCtx.currentTime + 0.06);
  gain.gain.exponentialRampToValueAtTime(
    0.001,
    audioCtx.currentTime + duration,
  );

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(audioCtx.destination);
  noise.start();
}

export function playPanSound() {
  initAudio();
  if (!audioCtx) return;
  const duration = 0.35;
  const osc  = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(120, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(65, audioCtx.currentTime + duration);
  gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(0.03, audioCtx.currentTime + 0.08);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}
