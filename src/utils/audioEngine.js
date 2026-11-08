// Web Audio API Synthesizer for Digital Crackers
// Synthesizes realistic rocket whistles, booms, crackles, and celestial chimes.
// 100% self-contained: no external audio files required, zero latency, offline ready.

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.isMuted = true; // Audio disabled by default per requirements
    this.volume = 0.7;
    this.isInitialized = false;
  }

  // Initialize AudioContext on first user interaction to comply with browser autoplay policy
  init() {
    if (this.isInitialized && this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
      this.isInitialized = true;
    } catch (err) {
      console.warn('Web Audio API not supported or blocked:', err);
    }
  }

  resume() {
    if (!this.isInitialized) {
      this.init();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setMuted(muted) {
    this.isMuted = muted;
    this.resume();
    if (this.masterGain && this.ctx) {
      const targetGain = muted ? 0 : this.volume;
      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.05);
    }
    return this.isMuted;
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (!this.isMuted && this.masterGain && this.ctx) {
      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
  }

  // Helper to generate white noise buffer
  createNoiseBuffer(duration = 1.0) {
    if (!this.ctx) return null;
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  // Play rocket launch ascending whistle & hiss
  playLaunch(pitchFactor = 1.0) {
    if (this.isMuted || !this.ctx) return;
    this.resume();
    const now = this.ctx.currentTime;
    const duration = 0.75 + Math.random() * 0.3;

    try {
      // 1. Whistle oscillator (frequency ramps up)
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      
      osc.type = 'sawtooth';
      const baseFreq = 220 * pitchFactor;
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 3.8, now + duration * 0.85);

      // Lowpass filter to smooth harshness
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(baseFreq * 1.5, now);
      filter.frequency.exponentialRampToValueAtTime(baseFreq * 4.2, now + duration * 0.85);
      filter.Q.setValueAtTime(3.5, now);

      oscGain.gain.setValueAtTime(0.001, now);
      oscGain.gain.linearRampToValueAtTime(0.18, now + 0.15);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(filter);
      filter.connect(oscGain);
      oscGain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + duration);

      // 2. Turbulent air friction hiss (Noise)
      const noiseBuffer = this.createNoiseBuffer(duration);
      if (noiseBuffer) {
        const noise = this.ctx.createBufferSource();
        noise.buffer = noiseBuffer;
        
        const noiseFilter = this.ctx.createBiquadFilter();
        noiseFilter.type = 'bandpass';
        noiseFilter.frequency.setValueAtTime(1200, now);
        noiseFilter.frequency.exponentialRampToValueAtTime(3500, now + duration);
        noiseFilter.Q.setValueAtTime(2.0, now);

        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.01, now);
        noiseGain.gain.linearRampToValueAtTime(0.08, now + 0.1);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(this.masterGain);

        noise.start(now);
        noise.stop(now + duration);
      }
    } catch (e) {
      console.warn('Error playing launch sound:', e);
    }
  }

  // Play deep explosive thud and percussion boom
  playExplosion(type = 'circle', sizeMultiplier = 1.0) {
    if (this.isMuted || !this.ctx) return;
    this.resume();
    const now = this.ctx.currentTime;

    try {
      // 1. Sub-bass boom (punchy sine sweep down)
      const subOsc = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      subOsc.type = 'sine';

      const startFreq = 160 + (Math.random() * 40 - 20);
      subOsc.frequency.setValueAtTime(startFreq, now);
      subOsc.frequency.exponentialRampToValueAtTime(28, now + 0.45);

      const boomVol = Math.min(0.45 * sizeMultiplier, 0.7);
      subGain.gain.setValueAtTime(boomVol, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

      subOsc.connect(subGain);
      subGain.connect(this.masterGain);
      subOsc.start(now);
      subOsc.stop(now + 0.7);

      // 2. Mid punch impact noise
      const noiseBuf = this.createNoiseBuffer(0.5);
      if (noiseBuf) {
        const punch = this.ctx.createBufferSource();
        punch.buffer = noiseBuf;

        const punchFilter = this.ctx.createBiquadFilter();
        punchFilter.type = 'lowpass';
        punchFilter.frequency.setValueAtTime(1400, now);
        punchFilter.frequency.exponentialRampToValueAtTime(100, now + 0.4);

        const punchGain = this.ctx.createGain();
        punchGain.gain.setValueAtTime(0.35, now);
        punchGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        punch.connect(punchFilter);
        punchFilter.connect(punchGain);
        punchGain.connect(this.masterGain);

        punch.start(now);
        punch.stop(now + 0.45);
      }

      // 3. Crackling Chrysanthemum / Secondary Pops for willow, star, or spiral
      if (type === 'willow' || type === 'spiral' || Math.random() > 0.4) {
        this.playCrackles(now + 0.2, 8 + Math.floor(Math.random() * 8));
      }

      // 4. Magical sparkle chime for heart or rainbow
      if (type === 'heart' || type === 'rainbow' || type === 'star') {
        this.playCelestialChime(now + 0.05, type);
      }
    } catch (e) {
      console.warn('Error playing explosion sound:', e);
    }
  }

  // Play crackling spark pops
  playCrackles(startTime, count = 10) {
    if (this.isMuted || !this.ctx) return;
    const noiseBuf = this.createNoiseBuffer(0.08);
    if (!noiseBuf) return;

    for (let i = 0; i < count; i++) {
      const popTime = startTime + Math.random() * 0.7;
      const pop = this.ctx.createBufferSource();
      pop.buffer = noiseBuf;

      const popFilter = this.ctx.createBiquadFilter();
      popFilter.type = 'highpass';
      popFilter.frequency.setValueAtTime(2500 + Math.random() * 3000, popTime);

      const popGain = this.ctx.createGain();
      const popVol = 0.05 + Math.random() * 0.09;
      popGain.gain.setValueAtTime(popVol, popTime);
      popGain.gain.exponentialRampToValueAtTime(0.001, popTime + 0.04);

      pop.connect(popFilter);
      popFilter.connect(popGain);
      popGain.connect(this.masterGain);

      pop.start(popTime);
      pop.stop(popTime + 0.05);
    }
  }

  // Play magical harmonic sparkle chime for festive patterns
  playCelestialChime(startTime, type) {
    if (this.isMuted || !this.ctx) return;
    const notes = type === 'heart' 
      ? [523.25, 659.25, 783.99, 1046.50] // C E G C (Warm Major Chord)
      : [440, 554.37, 659.25, 880, 1108.73]; // A C# E A C# (Brilliant Sparkle)

    notes.forEach((freq, idx) => {
      const t = startTime + idx * 0.06;
      const chimeOsc = this.ctx.createOscillator();
      const chimeGain = this.ctx.createGain();

      chimeOsc.type = 'triangle';
      chimeOsc.frequency.setValueAtTime(freq, t);

      chimeGain.gain.setValueAtTime(0.001, t);
      chimeGain.gain.linearRampToValueAtTime(0.08, t + 0.03);
      chimeGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.8);

      chimeOsc.connect(chimeGain);
      chimeGain.connect(this.masterGain);

      chimeOsc.start(t);
      chimeOsc.stop(t + 0.85);
    });
  }

  // Grand celebration finale cascade
  playCelebrationCascade() {
    if (this.isMuted || !this.ctx) return;
    this.resume();
    // Launch a series of booms and crackles
    for (let i = 0; i < 6; i++) {
      setTimeout(() => {
        this.playLaunch(0.8 + Math.random() * 0.4);
      }, i * 180);
      setTimeout(() => {
        this.playExplosion(i % 2 === 0 ? 'rainbow' : 'willow', 1.2);
      }, i * 180 + 500);
    }
  }
}

export const soundEngine = new AudioEngine();
