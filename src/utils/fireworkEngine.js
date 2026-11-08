// High-performance HTML5 Canvas Fireworks Animation Engine
// Features: Physics simulation, motion trails, additive blending, multiple patterns,
// flash illumination, secondary crackles, and celestial floating messages.

import { FIREWORK_COLORS } from './presets';
import { soundEngine } from './audioEngine';

// Utility helper functions
const random = (min, max) => Math.random() * (max - min) + min;
const randomInt = (min, max) => Math.floor(random(min, max + 1));
const randomChoice = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Convert hex to rgb
function hexToRgb(hex) {
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map(x => x + x).join('');
  const num = parseInt(c, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}

// Particle class for explosion fragments
class Particle {
  constructor(x, y, vx, vy, color, options = {}) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.color = color;
    this.rgb = hexToRgb(color.startsWith('#') ? color : '#ffd700');
    
    this.friction = options.friction || 0.96;
    this.gravity = options.gravity || 0.055;
    this.alpha = 1;
    this.decay = options.decay || random(0.012, 0.024);
    this.size = options.size || random(1.8, 3.2);
    this.originalSize = this.size;
    this.flicker = options.flicker ?? (Math.random() > 0.4);
    this.hasSecondary = options.hasSecondary && Math.random() < 0.25;
    this.secondaryTriggered = false;
    
    // Trail positions for motion blur / spark trails
    this.trail = [];
    this.maxTrail = options.trailLength || 4;
  }

  update(addParticleCallback) {
    this.trail.push({ x: this.x, y: this.y, alpha: this.alpha });
    if (this.trail.length > this.maxTrail) {
      this.trail.shift();
    }

    this.vx *= this.friction;
    this.vy *= this.friction;
    this.vy += this.gravity;

    this.x += this.vx;
    this.y += this.vy;

    this.alpha -= this.decay;

    // Secondary micro-spark pop
    if (this.hasSecondary && !this.secondaryTriggered && this.alpha < 0.35) {
      this.secondaryTriggered = true;
      if (addParticleCallback) {
        for (let i = 0; i < 4; i++) {
          const angle = random(0, Math.PI * 2);
          const spd = random(0.8, 2.2);
          addParticleCallback(new Particle(
            this.x,
            this.y,
            Math.cos(angle) * spd,
            Math.sin(angle) * spd,
            '#ffffff',
            { decay: random(0.04, 0.08), size: 1.5, friction: 0.92, gravity: 0.03 }
          ));
        }
      }
    }

    return this.alpha > 0;
  }

  draw(ctx) {
    if (this.alpha <= 0) return;

    ctx.save();
    // Draw motion trail
    if (this.trail.length > 1) {
      ctx.beginPath();
      ctx.moveTo(this.trail[0].x, this.trail[0].y);
      for (let i = 1; i < this.trail.length; i++) {
        ctx.lineTo(this.trail[i].x, this.trail[i].y);
      }
      ctx.strokeStyle = `rgba(${this.rgb.r}, ${this.rgb.g}, ${this.rgb.b}, ${this.alpha * 0.45})`;
      ctx.lineWidth = this.size * 0.8;
      ctx.lineCap = 'round';
      ctx.stroke();
    }

    // Particle head with sparkle
    let currentAlpha = this.alpha;
    if (this.flicker && Math.random() < 0.3) {
      currentAlpha *= random(0.3, 1.4);
    }
    currentAlpha = Math.min(1, Math.max(0, currentAlpha));

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * (0.6 + (this.alpha * 0.4)), 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.rgb.r}, ${this.rgb.g}, ${this.rgb.b}, ${currentAlpha})`;
    ctx.shadowBlur = 10;
    ctx.shadowColor = `rgba(${this.rgb.r}, ${this.rgb.g}, ${this.rgb.b}, 0.9)`;
    ctx.fill();

    // Hot white core for high-energy look
    if (this.alpha > 0.6) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 0.35, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${currentAlpha * 0.9})`;
      ctx.fill();
    }

    ctx.restore();
  }
}

// Rocket class for ascending cracker
class Rocket {
  constructor(startX, startY, targetX, targetY, colorKey, pattern, messageOptions = null) {
    this.x = startX;
    this.y = startY;
    this.startX = startX;
    this.startY = startY;
    this.targetX = targetX;
    this.targetY = targetY;
    this.colorKey = colorKey;
    this.pattern = pattern;
    this.messageOptions = messageOptions;

    // Calculate distance and velocity
    const dx = targetX - startX;
    const dy = targetY - startY;
    this.distanceToTarget = Math.hypot(dx, dy);
    this.distanceTraveled = 0;

    // Rocket physics
    const speed = random(10, 15);
    const angle = Math.atan2(dy, dx);
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;

    this.trail = [];
    this.maxTrail = 18;
    this.sparks = [];

    // Get color definition
    const colDef = FIREWORK_COLORS[colorKey] || FIREWORK_COLORS.golden;
    this.rocketColor = colDef.isRainbow ? '#ffffff' : colDef.primary;
    this.rgb = hexToRgb(this.rocketColor.startsWith('#') ? this.rocketColor : '#ffd700');

    // Play launch sound
    soundEngine.playLaunch();
  }

  update() {
    this.trail.push({ x: this.x, y: this.y });
    if (this.trail.length > this.maxTrail) {
      this.trail.shift();
    }

    // Emit sparkling smoke/exhaust particles
    if (Math.random() < 0.8) {
      this.sparks.push({
        x: this.x + random(-2, 2),
        y: this.y + random(1, 5),
        vx: random(-0.8, 0.8),
        vy: random(1.5, 4.0),
        alpha: 1,
        decay: random(0.04, 0.08),
        size: random(1, 2.5),
        color: Math.random() > 0.5 ? '#ffffff' : '#ffd166'
      });
    }

    // Update sparks
    for (let i = this.sparks.length - 1; i >= 0; i--) {
      const sp = this.sparks[i];
      sp.x += sp.vx;
      sp.y += sp.vy;
      sp.alpha -= sp.decay;
      if (sp.alpha <= 0) {
        this.sparks.splice(i, 1);
      }
    }

    const prevX = this.x;
    const prevY = this.y;
    this.x += this.vx;
    this.y += this.vy;

    // Apply subtle air drag
    this.vx *= 0.995;
    this.vy *= 0.992;

    this.distanceTraveled += Math.hypot(this.x - prevX, this.y - prevY);

    // Explode when reaching near target or moving downwards (apex)
    return (this.distanceTraveled >= this.distanceToTarget || this.vy >= -0.5);
  }

  draw(ctx) {
    ctx.save();

    // Draw exhaust sparks
    for (const sp of this.sparks) {
      ctx.beginPath();
      ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
      ctx.fillStyle = sp.color === '#ffffff' 
        ? `rgba(255, 255, 255, ${sp.alpha})`
        : `rgba(255, 209, 102, ${sp.alpha})`;
      ctx.shadowBlur = 4;
      ctx.shadowColor = '#ffd166';
      ctx.fill();
    }

    // Draw rocket glowing trail
    if (this.trail.length > 1) {
      for (let i = 0; i < this.trail.length - 1; i++) {
        const pt1 = this.trail[i];
        const pt2 = this.trail[i + 1];
        const progress = i / this.trail.length;

        ctx.beginPath();
        ctx.moveTo(pt1.x, pt1.y);
        ctx.lineTo(pt2.x, pt2.y);
        ctx.strokeStyle = `rgba(${this.rgb.r}, ${this.rgb.g}, ${this.rgb.b}, ${progress * 0.8})`;
        ctx.lineWidth = 1 + progress * 3;
        ctx.lineCap = 'round';
        ctx.stroke();
      }
    }

    // Draw rocket head
    ctx.beginPath();
    ctx.arc(this.x, this.y, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.shadowBlur = 16;
    ctx.shadowColor = `rgba(${this.rgb.r}, ${this.rgb.g}, ${this.rgb.b}, 1)`;
    ctx.fill();

    ctx.restore();
  }
}

// Celestial Floating Message displayed on sky
class SkyMessage {
  constructor(text, x, y, colorHex = '#ffd700', themeColorKey = 'golden') {
    this.text = text;
    this.x = x;
    this.y = y;
    this.targetY = Math.max(80, y - 40);
    this.colorHex = colorHex === 'match' 
      ? (FIREWORK_COLORS[themeColorKey]?.primary || '#ffd700') 
      : colorHex;
    this.alpha = 0;
    this.scale = 0.5;
    this.life = 0;
    this.maxLife = 260; // ~4.3 seconds at 60fps
    this.sparks = [];

    // Create surrounding celestial micro-sparkles
    for (let i = 0; i < 18; i++) {
      this.sparks.push({
        relX: random(-120, 120),
        relY: random(-40, 40),
        size: random(1, 2.5),
        twinkleSpeed: random(0.04, 0.1),
        phase: random(0, Math.PI * 2)
      });
    }
  }

  update() {
    this.life++;

    // Fade-in and scale-up phase
    if (this.life < 25) {
      const p = this.life / 25;
      this.alpha = p;
      this.scale = 0.5 + 0.5 * Math.sin(p * Math.PI * 0.5);
      this.y += (this.targetY - this.y) * 0.1;
    } 
    // Hold phase with gentle hovering
    else if (this.life < this.maxLife - 40) {
      this.alpha = 1;
      this.scale = 1 + Math.sin(this.life * 0.05) * 0.03;
      this.y -= 0.15; // Slow gentle upward float
    } 
    // Fade out phase
    else {
      const remaining = this.maxLife - this.life;
      this.alpha = Math.max(0, remaining / 40);
      this.scale = 1 + (1 - this.alpha) * 0.15;
      this.y -= 0.3;
    }

    return this.life < this.maxLife;
  }

  draw(ctx) {
    if (this.alpha <= 0 || !this.text) return;

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.scale(this.scale, this.scale);

    const rgb = hexToRgb(this.colorHex.startsWith('#') ? this.colorHex : '#ffd700');

    // Draw ambient halo behind text
    const haloGrad = ctx.createRadialGradient(0, 0, 5, 0, 0, 160);
    haloGrad.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${this.alpha * 0.28})`);
    haloGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = haloGrad;
    ctx.beginPath();
    ctx.arc(0, 0, 160, 0, Math.PI * 2);
    ctx.fill();

    // Draw orbiting sparkling stars
    for (const sp of this.sparks) {
      const sparkleAlpha = this.alpha * (0.4 + 0.6 * Math.sin(this.life * sp.twinkleSpeed + sp.phase));
      if (sparkleAlpha > 0) {
        ctx.beginPath();
        ctx.arc(sp.relX, sp.relY, sp.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${sparkleAlpha})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`;
        ctx.fill();
      }
    }

    // Responsive font sizing based on message length
    let fontSize = 32;
    if (this.text.length > 20) fontSize = 24;
    if (this.text.length > 35) fontSize = 20;

    ctx.font = `800 ${fontSize}px 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Outer intense glow pass
    ctx.shadowColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`;
    ctx.shadowBlur = 24;
    ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${this.alpha * 0.9})`;
    ctx.fillText(this.text, 0, 0);

    // Inner bright pass
    ctx.shadowBlur = 10;
    ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
    ctx.fillText(this.text, 0, 0);

    ctx.restore();
  }
}

// Sky Flash effect when cracker explodes
class SkyFlash {
  constructor(x, y, colorRgb, radius = 250) {
    this.x = x;
    this.y = y;
    this.rgb = colorRgb;
    this.radius = radius;
    this.alpha = 0.35;
    this.decay = 0.035;
  }

  update() {
    this.alpha -= this.decay;
    return this.alpha > 0;
  }

  draw(ctx) {
    if (this.alpha <= 0) return;
    ctx.save();
    const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
    grad.addColorStop(0, `rgba(${this.rgb.r}, ${this.rgb.g}, ${this.rgb.b}, ${this.alpha})`);
    grad.addColorStop(0.6, `rgba(${this.rgb.r}, ${this.rgb.g}, ${this.rgb.b}, ${this.alpha * 0.4})`);
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

// Main Fireworks Simulation Engine Class
export class FireworksEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false });
    this.rockets = [];
    this.particles = [];
    this.messages = [];
    this.flashes = [];

    this.isRunning = false;
    this.animationFrameId = null;
    this.burstCount = 0;
    this.onBurstCallback = null;

    this.width = canvas.width;
    this.height = canvas.height;

    this.resize = this.resize.bind(this);
    this.loop = this.loop.bind(this);
    this.addParticle = this.addParticle.bind(this);

    window.addEventListener('resize', this.resize);
    this.resize();
  }

  resize() {
    const dpr = window.devicePixelRatio || 1;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.ctx.scale(dpr, dpr);

    // Initial clear with night sky color
    this.ctx.fillStyle = '#060714';
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  addParticle(particle) {
    if (this.particles.length < 1400) {
      this.particles.push(particle);
    }
  }

  start() {
    if (!this.isRunning) {
      this.isRunning = true;
      this.loop();
    }
  }

  stop() {
    this.isRunning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  clear() {
    this.rockets = [];
    this.particles = [];
    this.messages = [];
    this.flashes = [];
    this.ctx.fillStyle = '#060714';
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  destroy() {
    this.stop();
    window.removeEventListener('resize', this.resize);
  }

  setOnBurst(cb) {
    this.onBurstCallback = cb;
  }

  // Launch a single firework
  launch({
    startX = null,
    targetX = null,
    targetY = null,
    color = 'golden',
    pattern = 'circle',
    message = null,
    messageColor = 'match'
  } = {}) {
    const sX = startX !== null ? startX : this.width * random(0.2, 0.8);
    const sY = this.height + 10;
    const tX = targetX !== null ? targetX : sX + random(-80, 80);
    const tY = targetY !== null ? targetY : this.height * random(0.18, 0.48);

    const messageOpts = message ? { text: message, color: messageColor } : null;

    const rocket = new Rocket(sX, sY, tX, tY, color, pattern, messageOpts);
    this.rockets.push(rocket);
  }

  // Launch multiple fireworks simultaneously with varied offsets
  launchMultiple(count = 5, customOptions = {}) {
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const patterns = ['circle', 'star', 'heart', 'spiral', 'rainbow', 'willow'];
        const colors = Object.keys(FIREWORK_COLORS);
        
        const pattern = customOptions.pattern === 'random' 
          ? randomChoice(patterns) 
          : (customOptions.pattern || randomChoice(patterns));

        const color = customOptions.color === 'random' 
          ? randomChoice(colors) 
          : (customOptions.color || randomChoice(colors));

        const startX = this.width * (0.15 + (0.7 / count) * i + random(-0.06, 0.06));
        const targetX = startX + random(-60, 60);
        const targetY = this.height * random(0.16, 0.48);

        this.launch({
          startX,
          targetX,
          targetY,
          color,
          pattern,
          message: i === Math.floor(count / 2) ? customOptions.message : null,
          messageColor: customOptions.messageColor
        });
      }, i * 220);
    }
  }

  // Explode rocket and generate pattern-specific particles
  explode(rocket) {
    const { x, y, colorKey, pattern, messageOptions } = rocket;
    const colDef = FIREWORK_COLORS[colorKey] || FIREWORK_COLORS.golden;
    const palette = colDef.palette;
    const rgb = hexToRgb(colDef.isRainbow ? '#ffffff' : colDef.primary);

    this.burstCount++;
    if (this.onBurstCallback) {
      this.onBurstCallback(this.burstCount);
    }

    // 1. Sky flash
    this.flashes.push(new SkyFlash(x, y, rgb, random(260, 380)));

    // 2. Play explosion audio
    soundEngine.playExplosion(pattern);

    // 3. Create pattern particles
    switch (pattern) {
      case 'star':
        this.createStarBurst(x, y, palette, colDef.isRainbow);
        break;
      case 'heart':
        this.createHeartBurst(x, y, palette, colDef.isRainbow);
        break;
      case 'spiral':
        this.createSpiralBurst(x, y, palette, colDef.isRainbow);
        break;
      case 'rainbow':
        this.createRainbowBurst(x, y);
        break;
      case 'willow':
        this.createWillowBurst(x, y, palette);
        break;
      case 'circle':
      default:
        this.createCircleBurst(x, y, palette, colDef.isRainbow);
        break;
    }

    // 4. Show celestial floating message if specified
    if (messageOptions && messageOptions.text) {
      this.messages.push(new SkyMessage(
        messageOptions.text,
        x,
        y - 30,
        messageOptions.color,
        colorKey
      ));
    }
  }

  // --- Pattern: Classic Circle Burst ---
  createCircleBurst(x, y, palette, isRainbow) {
    const particleCount = randomInt(85, 120);
    for (let i = 0; i < particleCount; i++) {
      const angle = random(0, Math.PI * 2);
      const speed = random(2.5, 7.8);
      const color = isRainbow 
        ? FIREWORK_COLORS.rainbow.palette[i % FIREWORK_COLORS.rainbow.palette.length] 
        : randomChoice(palette);

      this.addParticle(new Particle(
        x, y,
        Math.cos(angle) * speed,
        Math.sin(angle) * speed,
        color,
        {
          decay: random(0.012, 0.022),
          size: random(2.0, 3.4),
          hasSecondary: true,
          trailLength: 5
        }
      ));
    }

    // Inner bright core
    for (let i = 0; i < 25; i++) {
      const angle = random(0, Math.PI * 2);
      const speed = random(0.8, 2.5);
      this.addParticle(new Particle(
        x, y,
        Math.cos(angle) * speed,
        Math.sin(angle) * speed,
        '#ffffff',
        { decay: random(0.02, 0.04), size: 1.8, friction: 0.94 }
      ));
    }
  }

  // --- Pattern: 5-Pointed Star Burst ---
  createStarBurst(x, y, palette, isRainbow) {
    const points = 5;
    const outerRadius = random(5.5, 7.8);
    const innerRadius = outerRadius * 0.382; // Golden ratio star proportion
    const totalVertices = points * 2;
    const vertices = [];

    for (let i = 0; i < totalVertices; i++) {
      const angle = (i * Math.PI) / points - Math.PI / 2;
      const r = i % 2 === 0 ? outerRadius : innerRadius;
      vertices.push({ x: Math.cos(angle) * r, y: Math.sin(angle) * r });
    }

    // Interpolate particles along each edge of the 5-point star
    const particlesPerEdge = 10;
    for (let i = 0; i < totalVertices; i++) {
      const v1 = vertices[i];
      const v2 = vertices[(i + 1) % totalVertices];

      for (let j = 0; j < particlesPerEdge; j++) {
        const t = j / particlesPerEdge;
        const vx = (v1.x + (v2.x - v1.x) * t) * (1 + random(-0.05, 0.05));
        const vy = (v1.y + (v2.y - v1.y) * t) * (1 + random(-0.05, 0.05));

        const color = isRainbow 
          ? FIREWORK_COLORS.rainbow.palette[i % FIREWORK_COLORS.rainbow.palette.length] 
          : randomChoice(palette);

        this.addParticle(new Particle(
          x, y, vx, vy, color,
          {
            decay: random(0.013, 0.020),
            size: random(2.2, 3.5),
            friction: 0.965,
            trailLength: 6
          }
        ));
      }
    }

    // Star center sparkler
    for (let k = 0; k < 18; k++) {
      const a = random(0, Math.PI * 2);
      const s = random(0.5, 2.0);
      this.addParticle(new Particle(x, y, Math.cos(a) * s, Math.sin(a) * s, '#ffffff', { decay: 0.03 }));
    }
  }

  // --- Pattern: Romantic Heart Shaped Burst ---
  createHeartBurst(x, y, palette, isRainbow) {
    const count = 90;
    const heartScale = random(0.35, 0.48);

    for (let i = 0; i < count; i++) {
      // Parametric cardioid/heart formula
      const t = (i / count) * Math.PI * 2;
      const rawX = 16 * Math.pow(Math.sin(t), 3);
      const rawY = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));

      const jitter = random(0.92, 1.08);
      const vx = rawX * heartScale * jitter;
      const vy = rawY * heartScale * jitter;

      const color = isRainbow
        ? FIREWORK_COLORS.rainbow.palette[i % FIREWORK_COLORS.rainbow.palette.length]
        : (palette[i % palette.length]);

      this.addParticle(new Particle(
        x, y, vx, vy, color,
        {
          decay: random(0.012, 0.018),
          size: random(2.2, 3.6),
          friction: 0.962,
          gravity: 0.035, // Low gravity preserves heart outline longer
          trailLength: 6
        }
      ));
    }

    // Inner glowing heart shimmer
    for (let i = 0; i < 35; i++) {
      const t = random(0, Math.PI * 2);
      const s = heartScale * 0.55 * random(0.3, 0.9);
      const vx = 16 * Math.pow(Math.sin(t), 3) * s;
      const vy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * s;
      this.addParticle(new Particle(x, y, vx, vy, '#ffffff', {
        decay: random(0.02, 0.035),
        size: 1.8,
        gravity: 0.03
      }));
    }
  }

  // --- Pattern: Pinwheel / Rotating Spiral Burst ---
  createSpiralBurst(x, y, palette, isRainbow) {
    const arms = 4;
    const particlesPerArm = 24;

    for (let arm = 0; arm < arms; arm++) {
      const armOffset = (arm * Math.PI * 2) / arms;
      for (let i = 0; i < particlesPerArm; i++) {
        const spiralT = (i / particlesPerArm) * Math.PI * 1.8;
        const angle = armOffset + spiralT;
        const speed = 1.8 + (i / particlesPerArm) * 5.8;

        // Tangential swirl component
        const tangential = 1.2;
        const vx = Math.cos(angle) * speed - Math.sin(angle) * tangential;
        const vy = Math.sin(angle) * speed + Math.cos(angle) * tangential;

        const color = isRainbow
          ? FIREWORK_COLORS.rainbow.palette[(arm * 2 + i) % FIREWORK_COLORS.rainbow.palette.length]
          : palette[i % palette.length];

        this.addParticle(new Particle(
          x, y, vx, vy, color,
          {
            decay: random(0.013, 0.022),
            size: random(2.0, 3.4),
            friction: 0.96,
            hasSecondary: true,
            trailLength: 6
          }
        ));
      }
    }
  }

  // --- Pattern: Multi-tiered Cosmic Rainbow Burst ---
  createRainbowBurst(x, y) {
    const rainbowColors = FIREWORK_COLORS.rainbow.palette;
    const rings = 4;

    for (let r = 0; r < rings; r++) {
      const ringSpeed = 2.4 + r * 1.7;
      const count = 24 + r * 12;

      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 + (r * 0.2);
        const color = rainbowColors[(i + r * 2) % rainbowColors.length];

        this.addParticle(new Particle(
          x, y,
          Math.cos(angle) * ringSpeed,
          Math.sin(angle) * ringSpeed,
          color,
          {
            decay: random(0.012, 0.020),
            size: random(2.2, 3.6),
            friction: 0.962,
            hasSecondary: r === rings - 1,
            trailLength: 5
          }
        ));
      }
    }

    // High energy white center starburst
    for (let i = 0; i < 28; i++) {
      const a = random(0, Math.PI * 2);
      const s = random(0.6, 2.2);
      this.addParticle(new Particle(x, y, Math.cos(a) * s, Math.sin(a) * s, '#ffffff', {
        decay: 0.03,
        size: 2.0
      }));
    }
  }

  // --- Pattern: Weeping Golden Willow ---
  createWillowBurst(x, y, palette) {
    const count = 100;
    for (let i = 0; i < count; i++) {
      const angle = random(0, Math.PI * 2);
      const speed = random(1.5, 6.2);
      const color = randomChoice(FIREWORK_COLORS.golden.palette);

      this.addParticle(new Particle(
        x, y,
        Math.cos(angle) * speed,
        Math.sin(angle) * speed,
        color,
        {
          decay: random(0.007, 0.014), // Extra long life for willow
          size: random(1.8, 3.0),
          gravity: 0.09, // Cascades downward gracefully
          friction: 0.97,
          flicker: true,
          trailLength: 8
        }
      ));
    }
  }

  // Main Animation Loop
  loop() {
    if (!this.isRunning) return;

    // Semi-transparent overlay creating cinematic motion trail blur
    this.ctx.globalCompositeOperation = 'source-over';
    this.ctx.fillStyle = 'rgba(6, 7, 20, 0.22)';
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Draw sky flashes
    for (let i = this.flashes.length - 1; i >= 0; i--) {
      const flash = this.flashes[i];
      if (!flash.update()) {
        this.flashes.splice(i, 1);
      } else {
        flash.draw(this.ctx);
      }
    }

    // Update and draw ascending rockets
    for (let i = this.rockets.length - 1; i >= 0; i--) {
      const rocket = this.rockets[i];
      const reachedTarget = rocket.update();
      rocket.draw(this.ctx);

      if (reachedTarget) {
        this.explode(rocket);
        this.rockets.splice(i, 1);
      }
    }

    // Use additive blending for glowing firework particles
    this.ctx.globalCompositeOperation = 'lighter';

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      const alive = p.update(this.addParticle);
      if (!alive) {
        this.particles.splice(i, 1);
      } else {
        p.draw(this.ctx);
      }
    }

    // Switch back to source-over for crisp typography
    this.ctx.globalCompositeOperation = 'source-over';

    // Update and draw floating sky messages
    for (let i = this.messages.length - 1; i >= 0; i--) {
      const msg = this.messages[i];
      if (!msg.update()) {
        this.messages.splice(i, 1);
      } else {
        msg.draw(this.ctx);
      }
    }

    this.animationFrameId = requestAnimationFrame(this.loop);
  }
}
