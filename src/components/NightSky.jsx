import React, { useRef, useEffect } from 'react';

// Helper to convert hex to RGB
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

export default function NightSky({
  activeBurst,
  celebrationText,
  isBlasting
}) {
  const canvasRef = useRef(null);
  const stateRef = useRef({
    particles: [],
    flyingCrackers: [],
    activeMessage: null,
    stars: []
  });

  // Handle new blast trigger
  useEffect(() => {
    if (!activeBurst) return;

    const { crackerType, color } = activeBurst;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = canvas.width;
    const height = canvas.height;

    // Launch location: bottom center
    const startX = width * 0.5 + (Math.random() * 60 - 30);
    const startY = height;
    
    // Target explosion altitude
    let targetY = height * (crackerType === 'flowerpot' ? 0.6 : 0.32) + (Math.random() * 40 - 20);
    const targetX = width * 0.5 + (Math.random() * 80 - 40);

    stateRef.current.flyingCrackers.push({
      type: crackerType,
      color,
      x: startX,
      y: startY,
      targetX,
      targetY,
      speed: crackerType === 'flowerpot' ? 9 : 14,
      rotation: 0,
      trail: [],
      reached: false
    });
  }, [activeBurst]);

  // Main Canvas Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Responsive canvas resizing
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);

      // Generate fixed background stars
      const numStars = Math.floor((rect.width * rect.height) / 3200);
      const stars = [];
      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: Math.random() * rect.width,
          y: Math.random() * rect.height,
          radius: Math.random() * 1.4 + 0.3,
          alpha: Math.random() * 0.8 + 0.2,
          twinkleSpeed: Math.random() * 0.03 + 0.01,
          phase: Math.random() * Math.PI * 2
        });
      }
      stateRef.current.stars = stars;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle explosion generator tailored to cracker type
    const triggerExplosion = (x, y, crackerType, colorHex) => {
      const rgb = hexToRgb(colorHex);
      const particles = stateRef.current.particles;

      // Flash background illumination
      ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.25)`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Show floating celebration message in sky
      stateRef.current.activeMessage = {
        text: celebrationText || 'Happy Diwali! 🪔',
        x,
        y: Math.max(50, y - 55),
        alpha: 1.0,
        scale: 0.6,
        color: colorHex
      };

      if (crackerType === 'rocket') {
        // Classic spherical burst with secondary sparkles and willow trails
        const count = 130;
        for (let i = 0; i < count; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 7 + 1.5;
          const isGold = Math.random() < 0.3;
          particles.push({
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            color: isGold ? '#FFD700' : colorHex,
            rgb: isGold ? { r: 255, g: 215, b: 0 } : rgb,
            alpha: 1,
            decay: Math.random() * 0.015 + 0.01,
            gravity: 0.065,
            friction: 0.96,
            size: Math.random() * 2.8 + 1.2,
            trail: []
          });
        }
      } else if (crackerType === 'chakra') {
        // Spiral pinwheel galaxy
        const arms = 5;
        const perArm = 24;
        for (let a = 0; a < arms; a++) {
          const armBaseAngle = (a / arms) * Math.PI * 2;
          for (let i = 0; i < perArm; i++) {
            const angle = armBaseAngle + (i / perArm) * 1.5;
            const speed = (i / perArm) * 6.5 + 1.2;
            const isWhite = Math.random() < 0.2;
            particles.push({
              x,
              y,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              color: isWhite ? '#FFFFFF' : colorHex,
              rgb: isWhite ? { r: 255, g: 255, b: 255 } : rgb,
              alpha: 1,
              decay: Math.random() * 0.018 + 0.012,
              gravity: 0.04,
              friction: 0.97,
              size: Math.random() * 2.5 + 1,
              spin: 0.05,
              trail: []
            });
          }
        }
      } else if (crackerType === 'flowerpot') {
        // Tall cone fountain eruption raining down
        const count = 150;
        for (let i = 0; i < count; i++) {
          const spreadAngle = -Math.PI / 2 + (Math.random() * 1.0 - 0.5);
          const speed = Math.random() * 8.5 + 4;
          const isGold = Math.random() < 0.5;
          particles.push({
            x: x + (Math.random() * 20 - 10),
            y,
            vx: Math.cos(spreadAngle) * speed,
            vy: Math.sin(spreadAngle) * speed,
            color: isGold ? '#FFA000' : colorHex,
            rgb: isGold ? { r: 255, g: 160, b: 0 } : rgb,
            alpha: 1,
            decay: Math.random() * 0.014 + 0.009,
            gravity: 0.12, // High gravity shower
            friction: 0.98,
            size: Math.random() * 3.0 + 1.2,
            trail: []
          });
        }
      } else if (crackerType === 'bomb') {
        // High-velocity shockwave ring + debris
        // 1. Shockwave ring particles
        for (let i = 0; i < 60; i++) {
          const angle = (i / 60) * Math.PI * 2;
          const speed = 7.5;
          particles.push({
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            color: '#FFFFFF',
            rgb: { r: 255, g: 255, b: 255 },
            alpha: 1,
            decay: 0.035,
            gravity: 0.02,
            friction: 0.94,
            size: 3.5,
            trail: []
          });
        }
        // 2. Fiery explosive debris
        for (let i = 0; i < 90; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 9 + 2;
          particles.push({
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            color: colorHex,
            rgb,
            alpha: 1,
            decay: Math.random() * 0.02 + 0.015,
            gravity: 0.08,
            friction: 0.95,
            size: Math.random() * 3 + 1.5,
            trail: []
          });
        }
      } else if (crackerType === 'sparkler') {
        // Dazzling dense starburst of twinkling needles
        const count = 120;
        for (let i = 0; i < count; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 5.5 + 1;
          const isBright = Math.random() < 0.4;
          particles.push({
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            color: isBright ? '#FFFF99' : colorHex,
            rgb: isBright ? { r: 255, g: 255, b: 153 } : rgb,
            alpha: 1,
            decay: Math.random() * 0.016 + 0.01,
            gravity: 0.035,
            friction: 0.95,
            size: Math.random() * 2.2 + 1,
            twinkle: true,
            trail: []
          });
        }
      }
    };

    // Render loop
    let lastTime = performance.now();
    const render = (time) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      // Clear with slight motion persistence for smooth trails
      ctx.fillStyle = 'rgba(6, 8, 24, 0.22)';
      ctx.fillRect(0, 0, w, h);

      // Draw starry sky
      ctx.save();
      stateRef.current.stars.forEach(star => {
        star.phase += star.twinkleSpeed;
        const currentAlpha = star.alpha + Math.sin(star.phase) * 0.25;
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.1, Math.min(1, currentAlpha))})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw gentle crescent moon
      const moonX = w * 0.85;
      const moonY = 48;
      ctx.fillStyle = 'rgba(255, 245, 200, 0.9)';
      ctx.shadowColor = 'rgba(255, 235, 150, 0.5)';
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.arc(moonX, moonY, 22, 0, Math.PI * 2);
      ctx.fill();
      // Cut moon with dark circle to form crescent
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#060818';
      ctx.beginPath();
      ctx.arc(moonX - 7, moonY - 4, 19, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Render flying crackers
      const flying = stateRef.current.flyingCrackers;
      for (let i = flying.length - 1; i >= 0; i--) {
        const c = flying[i];
        const dx = c.targetX - c.x;
        const dy = c.targetY - c.y;
        const dist = Math.hypot(dx, dy);

        // Store trail
        c.trail.push({ x: c.x, y: c.y });
        if (c.trail.length > 8) c.trail.shift();

        // Draw rocket ascent trail
        ctx.save();
        ctx.beginPath();
        if (c.trail.length > 1) {
          ctx.moveTo(c.trail[0].x, c.trail[0].y);
          for (let t = 1; t < c.trail.length; t++) {
            ctx.lineTo(c.trail[t].x, c.trail[t].y);
          }
          ctx.strokeStyle = c.color;
          ctx.lineWidth = 3.5;
          ctx.shadowColor = c.color;
          ctx.shadowBlur = 12;
          ctx.stroke();
        }

        // Draw launching projectile glow
        ctx.fillStyle = '#FFF';
        ctx.beginPath();
        ctx.arc(c.x, c.y, 4, 0, Math.PI * 2);
        ctx.fill();

        // Spark emissions from tail
        for (let s = 0; s < 3; s++) {
          stateRef.current.particles.push({
            x: c.x + (Math.random() * 6 - 3),
            y: c.y + (Math.random() * 6 - 3),
            vx: (Math.random() - 0.5) * 2,
            vy: Math.random() * 3 + 1,
            color: '#FFA500',
            rgb: { r: 255, g: 165, b: 0 },
            alpha: 0.8,
            decay: 0.05,
            gravity: 0.05,
            friction: 0.95,
            size: 2,
            trail: []
          });
        }
        ctx.restore();

        // Move towards target
        if (dist < c.speed || c.y <= c.targetY) {
          // Reached peak -> Explode!
          triggerExplosion(c.targetX, c.targetY, c.type, c.color);
          flying.splice(i, 1);
        } else {
          c.x += (dx / dist) * c.speed;
          c.y += (dy / dist) * c.speed;
        }
      }

      // Additive blending for vibrant luminous firework sparks
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';

      const particles = stateRef.current.particles;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        // Motion physics
        p.vx *= p.friction;
        p.vy *= p.friction;
        p.vy += p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        // Trail
        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > 4) p.trail.shift();

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        // Draw particle trail
        if (p.trail.length > 1) {
          ctx.beginPath();
          ctx.moveTo(p.trail[0].x, p.trail[0].y);
          for (let t = 1; t < p.trail.length; t++) {
            ctx.lineTo(p.trail[t].x, p.trail[t].y);
          }
          ctx.strokeStyle = `rgba(${p.rgb.r}, ${p.rgb.g}, ${p.rgb.b}, ${p.alpha * 0.6})`;
          ctx.lineWidth = p.size * 0.8;
          ctx.stroke();
        }

        // Draw particle core
        const drawAlpha = p.twinkle ? (Math.random() > 0.3 ? p.alpha : p.alpha * 0.3) : p.alpha;
        ctx.fillStyle = `rgba(${p.rgb.r}, ${p.rgb.g}, ${p.rgb.b}, ${drawAlpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // Draw floating celebration text in sky
      const msg = stateRef.current.activeMessage;
      if (msg && msg.alpha > 0) {
        msg.alpha -= 0.007; // Fade out gradually
        if (msg.scale < 1.0) msg.scale += 0.04; // Smooth zoom in
        msg.y -= 0.25; // Gentle float upwards

        ctx.save();
        ctx.translate(msg.x, msg.y);
        ctx.scale(msg.scale, msg.scale);

        ctx.font = 'bold 22px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Glow behind text
        ctx.shadowColor = msg.color;
        ctx.shadowBlur = 18;
        ctx.fillStyle = `rgba(255, 255, 255, ${msg.alpha})`;
        ctx.fillText(msg.text, 0, 0);

        // Golden secondary sparkle outline
        ctx.strokeStyle = `rgba(255, 215, 0, ${msg.alpha * 0.8})`;
        ctx.lineWidth = 1;
        ctx.strokeText(msg.text, 0, 0);

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [celebrationText]);

  // Direct sky tap to create playful burst
  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const colors = ['#FF2E63', '#FFB800', '#00E676', '#00D2FF', '#FF007F'];
    const randColor = colors[Math.floor(Math.random() * colors.length)];
    const rgb = hexToRgb(randColor);

    for (let i = 0; i < 35; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4 + 1;
      stateRef.current.particles.push({
        x: clickX,
        y: clickY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: randColor,
        rgb,
        alpha: 1,
        decay: Math.random() * 0.025 + 0.015,
        gravity: 0.05,
        friction: 0.95,
        size: Math.random() * 2.5 + 1,
        trail: []
      });
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        className="w-full h-full block cursor-pointer"
      />
      {/* Subtle guide hint when idle */}
      {!isBlasting && stateRef.current.particles.length === 0 && (
        <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm text-[11px] text-gray-300/70 tracking-wide animate-pulse">
          ✨ Tap sky or click BLAST below!
        </div>
      )}
    </div>
  );
}
