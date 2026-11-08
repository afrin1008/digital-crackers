import React, { useState, useCallback } from 'react';
import NightSky from './components/NightSky';
import CrackerCharacters, { CRACKER_TYPES } from './components/CrackerCharacters';
import ColorPicker from './components/ColorPicker';
import { sounds } from './utils/audio';
import { Volume2, VolumeX, Sparkles, Edit2, Check } from 'lucide-react';

export default function App() {
  // 1. Five Cracker Characters State & Colors
  const [selectedCracker, setSelectedCracker] = useState('rocket');
  const [crackerColors, setCrackerColors] = useState({
    rocket: '#FF2E63',     // Ruby Red
    chakra: '#FFB800',     // Golden Amber
    flowerpot: '#FF6B00',  // Vivid Orange
    bomb: '#00E676',       // Emerald Green
    sparkler: '#00D2FF'    // Electric Cyan
  });

  // 2. Customizable Celebration Message
  const [celebrationMessage, setCelebrationMessage] = useState('Happy Diwali! 🪔');
  const [isEditingMessage, setIsEditingMessage] = useState(false);

  // 3. Audio State
  const [soundEnabled, setSoundEnabled] = useState(true);

  // 4. Blast Trigger State
  const [activeBurst, setActiveBurst] = useState(null);
  const [isBlasting, setIsBlasting] = useState(false);

  // Get active cracker details
  const activeCrackerObj = CRACKER_TYPES.find(c => c.id === selectedCracker) || CRACKER_TYPES[0];
  const currentColor = crackerColors[selectedCracker] || '#FF2E63';

  // Toggle sound
  const handleToggleSound = useCallback(() => {
    const next = sounds.toggleSound();
    setSoundEnabled(next);
  }, []);

  // Update selected cracker colour
  const handleColorChange = useCallback((newColor) => {
    setCrackerColors(prev => ({
      ...prev,
      [selectedCracker]: newColor
    }));
  }, [selectedCracker]);

  // Launch and Blast selected cracker!
  const handleBlast = useCallback(() => {
    if (isBlasting) return;
    setIsBlasting(true);

    // Play synthesized sound
    sounds.playCrackerBlast(selectedCracker);

    // Trigger visual launch into night sky
    setActiveBurst({
      crackerType: selectedCracker,
      color: currentColor,
      timestamp: Date.now()
    });

    // Reset blasting status after flight and initial explosion
    setTimeout(() => {
      setIsBlasting(false);
    }, 1200);
  }, [isBlasting, selectedCracker, currentColor]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gradient-to-b from-[#060817] via-[#090d26] to-[#0e102e] text-white flex flex-col justify-between select-none font-['Outfit',sans-serif]">
      
      {/* TOP HEADER: Title, Celebration Message, and Sound Toggle */}
      <header className="relative z-20 w-full px-4 pt-3 pb-1 flex flex-col items-center gap-1.5 shrink-0">
        <div className="w-full max-w-4xl flex items-center justify-between">
          
          {/* App Title */}
          <div className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl animate-pulse">🎆</span>
            <h1 className="text-lg sm:text-xl font-extrabold tracking-wider bg-gradient-to-r from-amber-300 via-pink-400 to-cyan-300 bg-clip-text text-transparent uppercase">
              Digital Crackers
            </h1>
          </div>

          {/* Sound Toggle Button */}
          <button
            onClick={handleToggleSound}
            className="p-1.5 sm:px-2.5 sm:py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-xs text-gray-200 transition-all flex items-center gap-1.5 active:scale-95"
            title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-4 h-4 text-emerald-400" />
                <span className="hidden sm:inline text-[11px] font-medium">Sound ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-gray-400" />
                <span className="hidden sm:inline text-[11px] font-medium">Muted</span>
              </>
            )}
          </button>
        </div>

        {/* Customizable Celebration Message Banner */}
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/15 shadow-sm max-w-md w-auto">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0 animate-spin" style={{ animationDuration: '6s' }} />
          
          {isEditingMessage ? (
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                value={celebrationMessage}
                onChange={(e) => setCelebrationMessage(e.target.value)}
                maxLength={36}
                placeholder="Enter celebration message..."
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && setIsEditingMessage(false)}
                className="bg-transparent border-b border-amber-400 text-xs sm:text-sm font-semibold text-amber-200 outline-none w-44 sm:w-56 text-center"
              />
              <button
                onClick={() => setIsEditingMessage(false)}
                className="text-emerald-400 hover:text-emerald-300 p-0.5 rounded"
                title="Save message"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => setIsEditingMessage(true)}
              className="flex items-center gap-1.5 cursor-pointer group"
              title="Click to customize celebration message"
            >
              <span className="text-xs sm:text-sm font-bold text-amber-300 tracking-wide group-hover:text-amber-200">
                {celebrationMessage || 'Happy Diwali! 🪔'}
              </span>
              <Edit2 className="w-3 h-3 text-amber-400/60 group-hover:text-amber-300 transition-colors" />
            </div>
          )}
        </div>
      </header>

      {/* CENTER: NIGHT SKY WITH CANVAS EXPLOSIONS & LAUNCH ANIMATIONS */}
      <main className="relative flex-1 w-full overflow-hidden">
        <NightSky
          activeBurst={activeBurst}
          celebrationText={celebrationMessage}
          isBlasting={isBlasting}
        />
      </main>

      {/* BOTTOM CONTROL DOCK: CRACKER CHARACTERS ROW, COLOUR PICKER & LARGE BLAST BUTTON */}
      <footer className="relative z-20 w-full px-3 pb-3 sm:pb-4 pt-2 bg-gradient-to-t from-black/80 via-[#0e1029]/80 to-transparent backdrop-blur-md flex flex-col items-center gap-2 sm:gap-3 shrink-0">
        
        {/* 1. Five colourful cracker characters in one row */}
        <CrackerCharacters
          selectedCracker={selectedCracker}
          onSelectCracker={setSelectedCracker}
          crackerColors={crackerColors}
        />

        {/* 2. Simple Colour Picker for selected cracker */}
        <ColorPicker
          selectedCrackerName={activeCrackerObj.name}
          currentColor={currentColor}
          onColorChange={handleColorChange}
        />

        {/* 3. One Large BLAST Button */}
        <button
          onClick={handleBlast}
          disabled={isBlasting}
          className={`relative group px-8 sm:px-12 py-2.5 sm:py-3.5 rounded-2xl sm:rounded-3xl font-black text-sm sm:text-base tracking-wider uppercase transition-all duration-300 outline-none active:scale-95 flex items-center justify-center gap-2.5 shadow-2xl cursor-pointer ${
            isBlasting
              ? 'opacity-80 scale-98 cursor-not-allowed'
              : 'hover:scale-105 hover:-translate-y-0.5'
          }`}
          style={{
            backgroundColor: currentColor,
            color: '#FFFFFF',
            boxShadow: `0 0 25px ${currentColor}90, 0 4px 15px rgba(0,0,0,0.5)`
          }}
        >
          <span className="text-lg sm:text-xl transition-transform group-hover:rotate-12">
            💥
          </span>
          <span className="font-extrabold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
            {isBlasting ? `Launching ${activeCrackerObj.name}...` : `BLAST ${activeCrackerObj.name.toUpperCase()}!`}
          </span>
          <span className="text-lg sm:text-xl transition-transform group-hover:-rotate-12">
            ✨
          </span>
        </button>

      </footer>

    </div>
  );
}
