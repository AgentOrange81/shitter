/**
 * Fart sound generator using Web Audio API
 * No external audio files needed
 */
let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
}

export function playFartSound() {
  const ctx = getAudioContext();
  
  // Resume context if suspended (browser autoplay policy)
  if (ctx.state === 'suspended') {
    ctx.resume();
  }
  
  const now = ctx.currentTime;
  
  // Create noise buffer for the "burst" sound
  const bufferSize = ctx.sampleRate * 0.3; // 300ms
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  
  // Fill with filtered noise
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.15));
  }
  
  // Noise source
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  
  // Low-pass filter for that muffled quality
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(400, now);
  filter.frequency.exponentialRampToValueAtTime(100, now + 0.2);
  
  // Gain envelope
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.8, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
  
  // Connect nodes
  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  
  // Play
  noise.start(now);
  noise.stop(now + 0.3);
}
