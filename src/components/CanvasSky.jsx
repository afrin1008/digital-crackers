import React, { useRef, useEffect, useState, useCallback } from 'react';

export default function CanvasSky({ 
  engineRef, 
  onBurst, 
  activeColor, 
  activePattern, 
  activeMessage, 
  messageColor,
  soundEnabled 
}) {
  const canvasRef = useRef(null);
  const [clickRipples, setClickRipples] = useState([]);

  // Initialize and bind canvas to FireworksEngine
  useEffect(() => {
    if (!canvasRef.current || !engineRef.current) return;
    
    // Start engine
    engineRef.current.start();
    engineRef.current.setOnBurst(onBurst);

    return () => {
      if (engineRef.current) {
        engineRef.current.stop();
      }
    };
  }, [engineRef, onBurst]);

  // Handle user tap or click on night sky
  const handleCanvasClick = useCallback((e) => {
    // Only launch if clicking on the canvas directly
    if (e.target !== canvasRef.current || !engineRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Launch firework to clicked coordinates
    engineRef.current.launch({
      startX: clickX + (Math.random() * 40 - 20),
      targetX: clickX,
      targetY: clickY,
      color: activeColor,
      pattern: activePattern,
      message: activeMessage || null,
      messageColor: messageColor
    });

    // Add interactive click ripple effect
    const rippleId = Date.now() + Math.random();
    setClickRipples(prev => [...prev.slice(-4), { id: rippleId, x: clickX, y: clickY }]);
    setTimeout(() => {
      setClickRipples(prev => prev.filter(r => r.id !== rippleId));
    }, 700);
  }, [engineRef, activeColor, activePattern, activeMessage, messageColor]);

  return (
    <div className="absolute inset-0 z-10 overflow-hidden cursor-crosshair">
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        className="w-full h-full block"
      />

      {/* Visual Click Feedback Ripples */}
      {clickRipples.map(ripple => (
        <div
          key={ripple.id}
          className="pointer-events-none absolute w-8 h-8 rounded-full border border-yellow-300/80 -translate-x-1/2 -translate-y-1/2 animate-ping"
          style={{ left: ripple.x, top: ripple.y }}
        />
      ))}

      {/* Floating subtle instruction hint */}
      <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 text-xs md:text-sm text-indigo-200/50 tracking-wider font-light bg-black/20 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/5 transition-opacity duration-500">
        ✨ Tap anywhere in the night sky to launch fireworks ✨
      </div>
    </div>
  );
}
