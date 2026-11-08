// Web Audio API Sound Synthesizer for Digital Crackers
// Completely self-contained, no external audio files, offline & sandboxed friendly.

class SoundSynthesizer {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.enabled = true;
    this.initialized = false;
  }

  init() {
    if (this.initialized && this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.enabled ? 0.7 : 0, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
      this.initialized = true;
    } catch (e) {
      console.warn('Web Audio not available:', e);
    }
  }

  resume() {
    if (!this.initialized) this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleSound() {
    this.enabled = !this.enabled;
    this.resume();
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.enabled ? 0.7 : 0, this.ctx.currentTime);
    }
    return this.enabled;
  }

  createNoise(duration) {
    if (!this.ctx) return null;
    const bufferSize = Math.floor(this.ctx.sampleRate * duration);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  // Rocket launch whistle
  playRocketLaunch() {
    if (!this.enabled) return;
    this.resume();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const duration = 0.8;

    // Ascending pitch whistle
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.exponentialRampToValueAtTime(1100, now + duration * 0.85);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(600, now);
    filter.frequency.exponentialRampToValueAtTime(1800, now + duration);
    filter.Q.setValueAtTime(4, now);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + duration);
  }

  // Deep boom explosion (Rocket, Bomb)
  playBoom(intensity = 1.0) {
    if (!this.enabled) return;
    this.resume();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // Sub bass drop
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(28, now + 0.5);

    gain.gain.setValueAtTime(0.5 * intensity, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.65);

    // Punch noise
    const noiseBuf = this.createNoise(0.4);
    if (noiseBuf) {
      const noise = this.ctx.createBufferSource();
      noise.buffer = noiseBuf;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1200, now);
      filter.frequency.exponentialRampToValueAtTime(100, now + 0.35);

      const nGain = this.ctx.createGain();
      nGain.gain.setValueAtTime(0.35 * intensity, now);
      nGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      noise.connect(filter);
      filter.connect(nGain);
      nGain.connect(this.masterGain);
      noise.start(now);
      noise.stop(now + 0.4);
    }
  }

  // Rapid crackles (Flowerpot, Sparkler, Rocket secondary)
  playCrackles(count = 12, startTimeOffset = 0) {
    if (!this.enabled) return;
    this.resume();
    if (!this.ctx) return;
    const baseNow = this.ctx.currentTime + startTimeOffset;
    const noiseBuf = this.createNoise(0.05);
    if (!noiseBuf) return;

    for (let i = 0; i < count; i++) {
      const popTime = baseNow + Math.random() * 0.7;
      const pop = this.ctx.createBufferSource();
      pop.buffer = noiseBuf;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(2800 + Math.random() * 2500, popTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.08 + Math.random() * 0.08, popTime);
      gain.gain.exponentialRampToValueAtTime(0.001, popTime + 0.04);

      pop.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      pop.start(popTime);
      pop.stop(popTime + 0.045);
    }
  }

  // Chakra spinning whir sound
  playChakraSound() {
    if (!this.enabled) return;
    this.resume();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const duration = 1.4;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.linearRampToValueAtTime(520, now + duration * 0.5);
    osc.frequency.linearRampToValueAtTime(220, now + duration);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.2, now + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + duration);

    this.playCrackles(16, 0.2);
  }

  // Flowerpot fountain roaring hiss
  playFountainSound() {
    if (!this.enabled) return;
    this.resume();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const duration = 1.8;

    const noiseBuf = this.createNoise(duration);
    if (noiseBuf) {
      const noise = this.ctx.createBufferSource();
      noise.buffer = noiseBuf;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(900, now);
      filter.frequency.linearRampToValueAtTime(3200, now + 0.8);
      filter.frequency.linearRampToValueAtTime(1400, now + duration);
      filter.Q.setValueAtTime(2.5, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.25, now + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);
      noise.start(now);
      noise.stop(now + duration);
    }
    this.playCrackles(20, 0.3);
  }

  // Sparkler sparkle fizzy hiss
  playSparklerSound() {
    if (!this.enabled) return;
    this.resume();
    if (!this.ctx) return;
    this.playCrackles(24, 0);
  }

  // Play sound according to cracker type
  playCrackerBlast(type) {
    switch (type) {
      case 'rocket':
        this.playRocketLaunch();
        setTimeout(() => {
          this.playBoom(1.0);
          this.playCrackles(14, 0.2);
        }, 750);
        break;
      case 'chakra':
        this.playChakraSound();
        break;
      case 'flowerpot':
        this.playFountainSound();
        break;
      case 'bomb':
        // Fuse sizzle then massive boom
        this.playCrackles(8, 0);
        setTimeout(() => {
          this.playBoom(1.4);
        }, 650);
        break;
      case 'sparkler':
        this.playSparklerSound();
        setTimeout(() => {
          this.playCrackles(18, 0);
        }, 400);
        break;
      default:
        this.playBoom();
    }
  }
}

export const sounds = new SoundSynthesizer();
