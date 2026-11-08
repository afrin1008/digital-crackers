import React from 'react';

export const CRACKER_TYPES = [
  { id: 'rocket', name: 'Rocket', hint: 'Sky Zoomer' },
  { id: 'chakra', name: 'Chakra', hint: 'Ground Spinner' },
  { id: 'flowerpot', name: 'Flower Pot', hint: 'Spark Fountain' },
  { id: 'bomb', name: 'Bomb', hint: 'Big Boom' },
  { id: 'sparkler', name: 'Sparkler', hint: 'Magic Twinkler' }
];

export default function CrackerCharacters({
  selectedCracker,
  onSelectCracker,
  crackerColors
}) {
  return (
    <div className="w-full max-w-2xl px-2">
      {/* 5 Colourful Cracker Characters Displayed in ONE Row */}
      <div className="grid grid-cols-5 gap-2 sm:gap-3 w-full">
        {CRACKER_TYPES.map((cracker) => {
          const isSelected = selectedCracker === cracker.id;
          const color = crackerColors[cracker.id] || '#FF2E63';

          return (
            <button
              key={cracker.id}
              onClick={() => onSelectCracker(cracker.id)}
              className={`group relative flex flex-col items-center justify-between p-2 sm:p-2.5 rounded-2xl transition-all duration-300 outline-none ${
                isSelected
                  ? 'bg-white/15 scale-105 shadow-[0_0_20px_rgba(255,255,255,0.25)] border-2'
                  : 'bg-white/5 hover:bg-white/10 hover:scale-102 border border-white/10'
              }`}
              style={{
                borderColor: isSelected ? color : 'rgba(255, 255, 255, 0.1)',
                boxShadow: isSelected ? `0 0 18px ${color}80, inset 0 0 10px ${color}30` : undefined
              }}
              title={`Click to select ${cracker.name}`}
            >
              {/* Selected floating badge */}
              {isSelected && (
                <span
                  className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full text-white shadow-md uppercase tracking-wider animate-pulse whitespace-nowrap z-10"
                  style={{ backgroundColor: color }}
                >
                  Active
                </span>
              )}

              {/* Cute Cracker Illustration Container */}
              <div className="w-12 h-14 sm:w-16 sm:h-18 flex items-center justify-center relative">
                {renderCrackerSvg(cracker.id, color, isSelected)}
              </div>

              {/* Cracker Name Label */}
              <div className="mt-1 text-center">
                <span
                  className={`block text-[11px] sm:text-xs font-bold tracking-wide transition-colors ${
                    isSelected ? 'text-white' : 'text-gray-300 group-hover:text-white'
                  }`}
                  style={isSelected ? { color } : {}}
                >
                  {cracker.name}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Render cute illustrated SVGs for each of the 5 crackers
function renderCrackerSvg(type, color, isSelected) {
  const bounceClass = isSelected ? 'animate-bounce' : 'group-hover:-translate-y-1';

  switch (type) {
    case 'rocket':
      return (
        <svg
          viewBox="0 0 64 80"
          className={`w-full h-full transition-transform duration-300 ${bounceClass}`}
          style={{ filter: `drop-shadow(0 2px 6px ${color}60)` }}
        >
          {/* Wooden Stick */}
          <line x1="32" y1="52" x2="32" y2="78" stroke="#8D6E63" strokeWidth="3" strokeLinecap="round" />
          
          {/* Rocket Fins */}
          <polygon points="20,52 14,56 22,44" fill="#E65100" />
          <polygon points="44,52 50,56 42,44" fill="#E65100" />
          
          {/* Main Body */}
          <rect x="22" y="24" width="20" height="28" rx="4" fill={color} />
          
          {/* Decorative festive stripe */}
          <rect x="22" y="34" width="20" height="5" fill="#FFE082" />

          {/* Pointed Cone Top */}
          <polygon points="32,6 20,24 44,24" fill="#FF1744" />
          
          {/* Cute Kawaii Eyes */}
          <circle cx="28" cy="30" r="2" fill="#1A1A1A" />
          <circle cx="36" cy="30" r="2" fill="#1A1A1A" />
          <circle cx="28.6" cy="29.4" r="0.7" fill="#FFFFFF" />
          <circle cx="36.6" cy="29.4" r="0.7" fill="#FFFFFF" />
          
          {/* Cute Kawaii Smile */}
          <path d="M29 33 Q32 36 35 33" stroke="#1A1A1A" strokeWidth="1.2" fill="none" strokeLinecap="round" />
          
          {/* Pink Cheeks */}
          <circle cx="25" cy="32" r="1.5" fill="#FF80AB" opacity="0.8" />
          <circle cx="39" cy="32" r="1.5" fill="#FF80AB" opacity="0.8" />
          
          {/* Idle Sparkle at Nose */}
          <circle cx="32" cy="5" r="1.5" fill="#FFF59D" className="animate-ping" />
        </svg>
      );

    case 'chakra':
      return (
        <svg
          viewBox="0 0 64 64"
          className={`w-full h-full transition-transform duration-300 ${isSelected ? 'animate-spin' : 'group-hover:rotate-45'}`}
          style={{ animationDuration: '4s', filter: `drop-shadow(0 2px 6px ${color}60)` }}
        >
          {/* Outer Ring */}
          <circle cx="32" cy="32" r="28" fill="#FFB300" stroke="#FF6F00" strokeWidth="2" />
          
          {/* Spiral segments */}
          <path d="M32 4 A28 28 0 0 1 60 32 L32 32 Z" fill={color} opacity="0.9" />
          <path d="M32 60 A28 28 0 0 1 4 32 L32 32 Z" fill={color} opacity="0.9" />
          
          {/* Outer sparkle dots */}
          <circle cx="32" cy="8" r="2" fill="#FFFFFF" />
          <circle cx="56" cy="32" r="2" fill="#FFFFFF" />
          <circle cx="32" cy="56" r="2" fill="#FFFFFF" />
          <circle cx="8" cy="32" r="2" fill="#FFFFFF" />

          {/* Center Hub */}
          <circle cx="32" cy="32" r="13" fill="#FFF9C4" stroke="#FFA000" strokeWidth="2" />
          
          {/* Cute Face */}
          <circle cx="28" cy="30" r="1.8" fill="#1A1A1A" />
          {/* Winking right eye */}
          <path d="M35 30 Q37 28 39 30" stroke="#1A1A1A" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          {/* Happy smile */}
          <path d="M29 34 Q32 37 35 34" stroke="#1A1A1A" strokeWidth="1.2" fill="none" strokeLinecap="round" />
          <circle cx="26" cy="33" r="1.2" fill="#FF4081" opacity="0.8" />
          <circle cx="38" cy="33" r="1.2" fill="#FF4081" opacity="0.8" />
        </svg>
      );

    case 'flowerpot':
      return (
        <svg
          viewBox="0 0 64 64"
          className={`w-full h-full transition-transform duration-300 ${bounceClass}`}
          style={{ filter: `drop-shadow(0 2px 6px ${color}60)` }}
        >
          {/* Golden fountain sparks erupting from tip */}
          <path d="M32 14 L29 6 L32 9 L35 4 L34 14" fill="#FFEB3B" opacity="0.9" className="animate-pulse" />
          <circle cx="32" cy="5" r="2" fill="#FF6D00" className="animate-ping" />

          {/* Earthen Flowerpot Cone Body */}
          <polygon points="32,15 16,56 48,56" fill={color} />
          
          {/* Base Rim */}
          <rect x="14" y="55" width="36" height="5" rx="2" fill="#5D4037" />

          {/* Festive Body Pattern (Zig-zag) */}
          <path d="M22 46 L27 41 L32 46 L37 41 L42 46" stroke="#FFF59D" strokeWidth="2" fill="none" strokeLinecap="round" />

          {/* Cute Kawaii Face */}
          <circle cx="28" cy="32" r="2" fill="#1A1A1A" />
          <circle cx="36" cy="32" r="2" fill="#1A1A1A" />
          <circle cx="28.6" cy="31.4" r="0.7" fill="#FFFFFF" />
          <circle cx="36.6" cy="31.4" r="0.7" fill="#FFFFFF" />
          <path d="M29 36 Q32 39 35 36" stroke="#1A1A1A" strokeWidth="1.2" fill="none" strokeLinecap="round" />
          <circle cx="25" cy="35" r="1.4" fill="#FF80AB" opacity="0.8" />
          <circle cx="39" cy="35" r="1.4" fill="#FF80AB" opacity="0.8" />
        </svg>
      );

    case 'bomb':
      return (
        <svg
          viewBox="0 0 64 64"
          className={`w-full h-full transition-transform duration-300 ${bounceClass}`}
          style={{ filter: `drop-shadow(0 2px 6px ${color}60)` }}
        >
          {/* Sizzling Fuse */}
          <path d="M32 18 Q36 8 44 12" stroke="#8D6E63" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          {/* Burning Spark at tip */}
          <circle cx="44" cy="12" r="2.5" fill="#FF1744" className="animate-ping" />
          <circle cx="44" cy="12" r="1.5" fill="#FFFF00" />

          {/* Cap on top of bomb */}
          <rect x="27" y="16" width="10" height="4" rx="1.5" fill="#3E2723" />

          {/* Round Sutli / Atom Bomb Shell */}
          <circle cx="32" cy="38" r="20" fill={color} />

          {/* Twine / String Texture Criss-Cross */}
          <ellipse cx="32" cy="38" rx="20" ry="8" fill="none" stroke="#FFFFFF" strokeWidth="1" opacity="0.4" />
          <ellipse cx="32" cy="38" rx="8" ry="20" fill="none" stroke="#FFFFFF" strokeWidth="1" opacity="0.4" />

          {/* Cute Playful Kawaii Face */}
          <circle cx="26" cy="35" r="2.2" fill="#1A1A1A" />
          <circle cx="38" cy="35" r="2.2" fill="#1A1A1A" />
          <circle cx="26.8" cy="34.2" r="0.8" fill="#FFFFFF" />
          <circle cx="38.8" cy="34.2" r="0.8" fill="#FFFFFF" />
          
          {/* Mischievous Grin */}
          <path d="M28 41 Q32 46 36 41 Z" fill="#1A1A1A" />
          <path d="M30 42 Q32 44 34 42" stroke="#FF5252" strokeWidth="1" fill="#FF5252" />
          <circle cx="23" cy="39" r="1.5" fill="#FF80AB" opacity="0.85" />
          <circle cx="41" cy="39" r="1.5" fill="#FF80AB" opacity="0.85" />
        </svg>
      );

    case 'sparkler':
      return (
        <svg
          viewBox="0 0 64 80"
          className={`w-full h-full transition-transform duration-300 ${bounceClass}`}
          style={{ filter: `drop-shadow(0 2px 6px ${color}60)` }}
        >
          {/* Wire Handle */}
          <line x1="32" y1="48" x2="32" y2="76" stroke="#B0BEC5" strokeWidth="3" strokeLinecap="round" />

          {/* Sparkler Coated Body */}
          <rect x="28" y="18" width="8" height="32" rx="3" fill={color} />
          {/* Texture grain */}
          <line x1="30" y1="24" x2="34" y2="24" stroke="#FFF" strokeWidth="1" opacity="0.6" />
          <line x1="30" y1="32" x2="34" y2="32" stroke="#FFF" strokeWidth="1" opacity="0.6" />
          <line x1="30" y1="40" x2="34" y2="40" stroke="#FFF" strokeWidth="1" opacity="0.6" />

          {/* Cute Face on Sparkler body */}
          <circle cx="30" cy="27" r="1" fill="#1A1A1A" />
          <circle cx="34" cy="27" r="1" fill="#1A1A1A" />
          <path d="M30.5 30 Q32 31.5 33.5 30" stroke="#1A1A1A" strokeWidth="0.8" fill="none" strokeLinecap="round" />

          {/* Radiating Sparkler Stars from Tip */}
          <path d="M32 6 L33 12 L39 13 L33 15 L32 21 L31 15 L25 13 L31 12 Z" fill="#FFE57F" className="animate-spin" style={{ transformOrigin: '32px 14px', animationDuration: '3s' }} />
          <circle cx="24" cy="8" r="1.5" fill="#FF80AB" className="animate-ping" />
          <circle cx="40" cy="8" r="1.5" fill="#00E5FF" className="animate-ping" />
          <circle cx="32" cy="14" r="2.5" fill="#FFFFFF" />
        </svg>
      );

    default:
      return null;
  }
}
