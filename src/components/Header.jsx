import React from 'react';
import { Volume2, VolumeX, Maximize2, Minimize2, Sparkles, Flame } from 'lucide-react';

export default function Header({ 
  burstCount, 
  soundEnabled, 
  onToggleSound, 
  isFullscreen, 
  onToggleFullscreen,
  onReset 
}) {
  return (
    <header className="relative z-20 w-full pt-4 px-4 md:px-8 pb-2 flex flex-col items-center select-none pointer-events-none">
      {/* Top Bar Utilities (Pointer events enabled for buttons) */}
      <div className="w-full max-w-7xl flex items-center justify-between mb-1 pointer-events-auto">
        {/* Left Badge: Live Cracker Counter */}
        <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 shadow-lg text-xs md:text-sm text-amber-300">
          <Flame className="w-4 h-4 text-orange-400 animate-bounce" />
          <span className="font-semibold text-white">Crackers Burst:</span>
          <span className="font-bold text-amber-300 tracking-wider text-sm">{burstCount}</span>
        </div>

        {/* Right Controls: Sound & Fullscreen */}
        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
            aria-label={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
            className={`p-2 rounded-full border transition-all duration-300 backdrop-blur-md ${
              soundEnabled
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-[0_0_15px_rgba(255,190,11,0.3)]'
                : 'bg-white/5 text-gray-400 border-white/10 hover:text-white hover:bg-white/10'
            }`}
          >
            {soundEnabled ? (
              <div className="relative">
                <Volume2 className="w-4 h-4 md:w-5 md:h-5" />
                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
              </div>
            ) : (
              <VolumeX className="w-4 h-4 md:w-5 md:h-5" />
            )}
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={onToggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            className="p-2 rounded-full border border-white/10 bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300 backdrop-blur-md"
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4 md:w-5 md:h-5" />
            ) : (
              <Maximize2 className="w-4 h-4 md:w-5 md:h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Main Title & Subtitle with Glowing Effects */}
      <div className="text-center mt-1 pointer-events-auto">
        <div className="inline-flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
          <span className="text-[10px] md:text-xs font-semibold tracking-[0.25em] text-amber-300 uppercase px-2.5 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/20">
            Festival of Lights
          </span>
          <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
        </div>

        <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-pink-400 to-purple-300 drop-shadow-[0_0_25px_rgba(255,105,180,0.6)] font-['Cinzel',serif]">
          DIGITAL CRACKERS
        </h1>

        <p className="mt-1 text-xs md:text-base text-purple-200/80 font-medium tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
          ✨ Light Up the Sky, Spread Happiness! ✨
        </p>
      </div>
    </header>
  );
}
