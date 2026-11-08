import React, { useMemo } from 'react';

export default function MoonAndClouds() {
  // Generate a fixed starry sky background
  const stars = useMemo(() => {
    return Array.from({ length: 85 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 75, // Upper 75% of sky
      size: Math.random() * 2.2 + 0.8,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 4,
      opacity: Math.random() * 0.7 + 0.3
    }));
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      {/* Dynamic Starfield */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="star absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            boxShadow: `0 0 ${star.size * 2}px rgba(255, 255, 255, 0.8)`,
            animation: `twinkle ${star.duration}s ease-in-out ${star.delay}s infinite alternate`
          }}
        />
      ))}

      {/* Luminous Glowing Moon */}
      <div className="moon-container absolute top-6 right-8 md:top-10 md:right-16 flex items-center justify-center">
        {/* Outer atmospheric corona glow */}
        <div className="absolute w-28 h-28 md:w-36 md:h-36 rounded-full bg-amber-100/10 blur-2xl animate-pulse pointer-events-none" />
        <div className="absolute w-20 h-20 md:w-28 md:h-28 rounded-full bg-yellow-200/20 blur-xl pointer-events-none" />

        {/* Moon body */}
        <div className="moon relative w-16 h-16 md:w-22 md:h-22 rounded-full bg-gradient-to-tr from-amber-100 via-amber-50 to-white shadow-[0_0_35px_rgba(255,243,196,0.65)] overflow-hidden">
          {/* Subtle craters */}
          <div className="absolute top-3 left-4 w-3.5 h-3.5 rounded-full bg-amber-200/40 blur-[0.6px]" />
          <div className="absolute top-7 left-2 w-4 h-4 rounded-full bg-amber-200/30 blur-[0.8px]" />
          <div className="absolute top-5 right-4 w-5 h-5 rounded-full bg-amber-200/35 blur-[0.7px]" />
          <div className="absolute bottom-3 left-6 w-3 h-3 rounded-full bg-amber-200/30 blur-[0.5px]" />
          <div className="absolute bottom-2 right-5 w-2.5 h-2.5 rounded-full bg-amber-200/25 blur-[0.5px]" />
        </div>
      </div>

      {/* Drifting Clouds Layer 1 */}
      <div 
        className="cloud-layer cloud-1 absolute top-[12%] -left-32 w-[600px] h-[130px] rounded-full bg-gradient-to-r from-transparent via-indigo-900/15 to-transparent blur-3xl pointer-events-none"
        style={{ animation: 'floatClouds 85s linear infinite' }}
      />
      
      {/* Drifting Clouds Layer 2 */}
      <div 
        className="cloud-layer cloud-2 absolute top-[28%] -left-48 w-[750px] h-[160px] rounded-full bg-gradient-to-r from-transparent via-purple-900/12 to-transparent blur-3xl pointer-events-none"
        style={{ animation: 'floatClouds 120s linear infinite 15s' }}
      />

      {/* Subtle Mountain / Horizon Skyline Silhouette at very bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-14 bg-gradient-to-t from-black via-[#080918]/80 to-transparent pointer-events-none" />
    </div>
  );
}
