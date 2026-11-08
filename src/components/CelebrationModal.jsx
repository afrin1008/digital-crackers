import React from 'react';
import { PartyPopper, Sparkles, RotateCcw, Heart, Flame, X } from 'lucide-react';

export default function CelebrationModal({
  isOpen,
  onClose,
  burstCount,
  onRestart,
  onMegaFinale
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md rounded-3xl border border-amber-400/40 bg-gradient-to-b from-[#180d33] via-[#0e1029] to-[#0a0518] p-6 shadow-[0_0_50px_rgba(255,190,11,0.35)] overflow-hidden text-center text-white">
        
        {/* Glow ambient background lights */}
        <div className="absolute -top-16 -left-16 w-36 h-36 rounded-full bg-pink-500/30 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-36 h-36 rounded-full bg-amber-500/30 blur-3xl pointer-events-none" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 text-gray-300 hover:text-white hover:bg-white/20 transition-colors"
          title="Close Modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Icon */}
        <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-pink-500 shadow-[0_0_20px_rgba(255,190,11,0.6)]">
          <PartyPopper className="h-8 w-8 text-white animate-bounce" />
        </div>

        {/* Heading */}
        <h2 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-pink-300 to-yellow-100 font-['Cinzel',serif]">
          MAGICAL CELEBRATION!
        </h2>
        
        <p className="mt-1 text-xs md:text-sm text-purple-200/90 font-medium">
          The night sky is glowing with your digital crackers!
        </p>

        {/* Festive Metrics Card */}
        <div className="mt-5 grid grid-cols-2 gap-3 bg-white/5 rounded-2xl p-3 border border-white/10">
          <div className="flex flex-col items-center p-2 rounded-xl bg-black/20">
            <div className="flex items-center gap-1 text-amber-300 text-xs font-semibold">
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              <span>Crackers Fired</span>
            </div>
            <span className="text-xl md:text-2xl font-black text-white mt-1">{burstCount}</span>
          </div>

          <div className="flex flex-col items-center p-2 rounded-xl bg-black/20">
            <div className="flex items-center gap-1 text-pink-300 text-xs font-semibold">
              <Heart className="w-3.5 h-3.5 text-pink-400" />
              <span>Happiness Level</span>
            </div>
            <span className="text-xl md:text-2xl font-black text-pink-300 mt-1">100% 💖</span>
          </div>
        </div>

        {/* Quotes / Festive greeting */}
        <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-amber-500/10 via-pink-500/10 to-purple-500/10 border border-white/10 text-xs text-amber-200/90 italic">
          "May your life be as bright, colorful, and joyful as these digital fireworks!"
        </div>

        {/* Action Buttons */}
        <div className="mt-6 space-y-2.5">
          <button
            onClick={() => {
              onMegaFinale();
              onClose();
            }}
            className="w-full py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-amber-500 via-pink-500 to-purple-600 hover:from-amber-400 hover:to-purple-500 shadow-[0_0_20px_rgba(255,42,133,0.5)] transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-200 animate-spin" />
            <span>Launch Mega Grand Finale</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                onRestart();
                onClose();
              }}
              className="py-2.5 px-3 rounded-xl font-semibold text-xs text-gray-200 bg-white/10 hover:bg-white/20 border border-white/10 transition-colors flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restart All</span>
            </button>

            <button
              onClick={onClose}
              className="py-2.5 px-3 rounded-xl font-semibold text-xs text-amber-300 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 transition-colors"
            >
              Watch Sky
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
