import React, { useState } from 'react';
import { 
  Rocket, 
  Layers, 
  Shuffle, 
  PartyPopper, 
  Trash2, 
  Palette, 
  MessageSquare, 
  ChevronUp, 
  ChevronDown, 
  Sparkles, 
  Circle, 
  Star, 
  Heart, 
  Disc3, 
  Sun, 
  RotateCcw,
  Volume2,
  VolumeX,
  Send
} from 'lucide-react';
import { 
  FIREWORK_COLORS, 
  FIREWORK_PATTERNS, 
  PRESET_MESSAGES, 
  MESSAGE_COLORS 
} from '../utils/presets';

export default function ControlPanel({
  onLaunchSingle,
  onLaunchMultiple,
  isSurpriseMode,
  onToggleSurpriseMode,
  selectedColor,
  onSelectColor,
  selectedPattern,
  onSelectPattern,
  customMessage,
  onChangeCustomMessage,
  messageColor,
  onSelectMessageColor,
  soundEnabled,
  onToggleSound,
  onClearSky,
  onCelebrate,
  onReset
}) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeTab, setActiveTab] = useState('crackers'); // 'crackers' | 'message' | 'palette'

  // Map pattern ID to Lucide icon component
  const getPatternIcon = (id) => {
    switch (id) {
      case 'circle': return <Circle className="w-4 h-4" />;
      case 'star': return <Star className="w-4 h-4" />;
      case 'heart': return <Heart className="w-4 h-4" />;
      case 'spiral': return <Disc3 className="w-4 h-4" />;
      case 'rainbow': return <Sun className="w-4 h-4" />;
      case 'willow': return <Sparkles className="w-4 h-4" />;
      default: return <Sparkles className="w-4 h-4" />;
    }
  };

  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 w-[95%] max-w-2xl z-30 select-none transition-all duration-300">
      <div className="glass-panel relative rounded-2xl md:rounded-3xl border border-white/15 bg-[#0e1029]/80 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.6)] overflow-hidden">
        
        {/* Glow accent border line on top */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-pink-500 to-amber-400 opacity-80" />

        {/* Panel Header & Minimize Toggle */}
        <div className="px-4 py-2.5 flex items-center justify-between border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-pink-500 shadow-[0_0_8px_#ff2a85]" />
            <h2 className="text-xs md:text-sm font-bold tracking-wider uppercase text-white/90">
              Control Station
            </h2>
            {isSurpriseMode && (
              <span className="ml-2 text-[10px] font-semibold tracking-wider px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-pink-500 text-white animate-pulse">
                Auto Show Active
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {/* Clear Sky Button */}
            <button
              onClick={onClearSky}
              title="Clear Sky Particles"
              className="px-2 py-1 text-[11px] font-medium text-gray-300 hover:text-red-300 bg-white/5 hover:bg-red-500/10 rounded-lg border border-white/10 transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear</span>
            </button>

            {/* Sound Toggle Shortcut */}
            <button
              onClick={onToggleSound}
              title={soundEnabled ? 'Sound ON' : 'Sound OFF'}
              className={`p-1.5 rounded-lg border text-xs transition-colors ${
                soundEnabled 
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-300' 
                  : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>

            {/* Minimize / Expand Toggle */}
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              aria-label={isMinimized ? 'Expand panel' : 'Minimize panel'}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 transition-colors"
            >
              {isMinimized ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Panel Body (Collapsible) */}
        {!isMinimized && (
          <div className="p-3 md:p-4 space-y-3.5 max-h-[68vh] overflow-y-auto custom-scrollbar">
            
            {/* Tab navigation for clean organization */}
            <div className="flex items-center p-1 bg-black/40 rounded-xl border border-white/10 text-xs">
              <button
                onClick={() => setActiveTab('crackers')}
                className={`flex-1 py-1.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'crackers'
                    ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Rocket className="w-3.5 h-3.5" />
                <span>Crackers & Patterns</span>
              </button>

              <button
                onClick={() => setActiveTab('message')}
                className={`flex-1 py-1.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'message'
                    ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Message & Greetings</span>
              </button>

              <button
                onClick={() => setActiveTab('palette')}
                className={`flex-1 py-1.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'palette'
                    ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Palette className="w-3.5 h-3.5" />
                <span>Colors</span>
              </button>
            </div>

            {/* TAB 1: CRACKERS & PATTERNS */}
            {activeTab === 'crackers' && (
              <div className="space-y-3 animate-fadeIn">
                {/* Pattern Selector Grid */}
                <div>
                  <div className="text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                    <span>Select Pattern</span>
                    <span className="text-amber-300 capitalize">{selectedPattern}</span>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {FIREWORK_PATTERNS.map((pattern) => {
                      const isSelected = selectedPattern === pattern.id;
                      return (
                        <button
                          key={pattern.id}
                          onClick={() => onSelectPattern(pattern.id)}
                          className={`p-2 rounded-xl flex flex-col items-center gap-1 transition-all border ${
                            isSelected
                              ? 'bg-gradient-to-b from-purple-600/40 to-pink-600/40 border-pink-400 text-white shadow-[0_0_12px_rgba(255,42,133,0.4)] scale-105'
                              : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          <div className={isSelected ? 'text-pink-300' : 'text-gray-400'}>
                            {getPatternIcon(pattern.id)}
                          </div>
                          <span className="text-[10px] font-medium leading-tight text-center">
                            {pattern.name.replace(' Burst', '').replace(' Shaped', '').replace(' Explosion', '')}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Quick Color Strip Preview */}
                <div>
                  <div className="text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                    <span>Color Theme</span>
                    <span className="text-pink-300 capitalize">{FIREWORK_COLORS[selectedColor]?.name || selectedColor}</span>
                  </div>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {Object.entries(FIREWORK_COLORS).map(([key, col]) => {
                      const isSelected = selectedColor === key;
                      return (
                        <button
                          key={key}
                          onClick={() => onSelectColor(key)}
                          className={`flex-1 min-w-[38px] h-8 rounded-lg border flex items-center justify-center transition-all ${
                            isSelected
                              ? 'border-white scale-110 shadow-[0_0_12px_rgba(255,255,255,0.7)]'
                              : 'border-white/20 opacity-70 hover:opacity-100'
                          }`}
                          style={{
                            background: col.primary,
                            boxShadow: isSelected ? `0 0 14px ${col.shadow}` : 'none'
                          }}
                          title={col.name}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: CELEBRATION MESSAGES */}
            {activeTab === 'message' && (
              <div className="space-y-3 animate-fadeIn">
                {/* Custom Text Input */}
                <div>
                  <label className="text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-1 block">
                    Custom Message on Sky
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      maxLength={45}
                      value={customMessage}
                      onChange={(e) => onChangeCustomMessage(e.target.value)}
                      placeholder="e.g., Happy Diwali! or Happy Birthday!"
                      className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/15 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 pr-10"
                    />
                    {customMessage && (
                      <button
                        onClick={() => onChangeCustomMessage('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>

                {/* Preset Greetings Chips */}
                <div>
                  <span className="text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-1.5 block">
                    Quick Preset Greetings
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {PRESET_MESSAGES.map((preset) => {
                      const isCurrent = customMessage === preset.text;
                      return (
                        <button
                          key={preset.text}
                          onClick={() => {
                            onChangeCustomMessage(preset.text);
                            if (preset.theme && FIREWORK_COLORS[preset.theme]) {
                              onSelectColor(preset.theme);
                            }
                          }}
                          className={`px-2.5 py-1 text-xs rounded-lg border transition-all ${
                            isCurrent
                              ? 'bg-pink-600/40 border-pink-400 text-white font-semibold shadow-[0_0_10px_rgba(255,42,133,0.3)]'
                              : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          {preset.text}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Message Color Selection */}
                <div>
                  <span className="text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-1.5 block">
                    Message Glowing Color
                  </span>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {MESSAGE_COLORS.map((mc) => {
                      const isSelected = messageColor === mc.color;
                      return (
                        <button
                          key={mc.id}
                          onClick={() => onSelectMessageColor(mc.color)}
                          className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition-all flex items-center gap-1.5 ${
                            isSelected
                              ? 'bg-white/20 border-white text-white shadow-[0_0_10px_rgba(255,255,255,0.4)]'
                              : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                          }`}
                        >
                          <span 
                            className="w-2.5 h-2.5 rounded-full" 
                            style={{ background: mc.display }} 
                          />
                          <span>{mc.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: FULL COLOR PALETTE */}
            {activeTab === 'palette' && (
              <div className="space-y-3 animate-fadeIn">
                <div className="text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-1.5 block">
                  Color Themes with Particle Gradients
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {Object.entries(FIREWORK_COLORS).map(([key, col]) => {
                    const isSelected = selectedColor === key;
                    return (
                      <button
                        key={key}
                        onClick={() => onSelectColor(key)}
                        className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition-all ${
                          isSelected
                            ? 'bg-white/15 border-white text-white shadow-[0_0_14px_rgba(255,255,255,0.3)]'
                            : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <div 
                          className="w-5 h-5 rounded-full border border-white/40 shrink-0"
                          style={{
                            background: col.primary,
                            boxShadow: `0 0 8px ${col.shadow}`
                          }}
                        />
                        <div className="text-left overflow-hidden">
                          <div className="text-xs font-semibold truncate">{col.name}</div>
                          <div className="text-[10px] text-gray-400 truncate">{col.label}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ACTION BUTTONS (HERO ROW) */}
            <div className="pt-2 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-2">
              {/* 1. Launch Single Firework (Hero Button) */}
              <button
                onClick={onLaunchSingle}
                className="col-span-2 sm:col-span-1 px-4 py-2.5 rounded-xl font-bold text-xs md:text-sm text-white bg-gradient-to-r from-amber-500 via-pink-500 to-purple-600 hover:from-amber-400 hover:via-pink-400 hover:to-purple-500 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,42,133,0.5)] flex items-center justify-center gap-2 border border-white/30"
              >
                <Rocket className="w-4 h-4 animate-bounce" />
                <span>LAUNCH FIREWORK</span>
              </button>

              {/* 2. Launch Multiple (Barrage) */}
              <button
                onClick={onLaunchMultiple}
                className="px-3 py-2.5 rounded-xl font-semibold text-xs text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-95 transition-all border border-blue-400/30 flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(0,180,216,0.3)]"
              >
                <Layers className="w-4 h-4 text-cyan-300" />
                <span>LAUNCH MULTIPLE</span>
              </button>

              {/* 3. Random / Surprise Mode Toggle */}
              <button
                onClick={onToggleSurpriseMode}
                className={`px-3 py-2.5 rounded-xl font-semibold text-xs transition-all border flex items-center justify-center gap-1.5 ${
                  isSurpriseMode
                    ? 'bg-amber-500/25 border-amber-400 text-amber-200 shadow-[0_0_15px_rgba(255,190,11,0.4)]'
                    : 'bg-white/5 border-white/10 text-gray-200 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Shuffle className={`w-4 h-4 ${isSurpriseMode ? 'text-amber-300 animate-spin' : 'text-gray-400'}`} />
                <span>{isSurpriseMode ? 'Stop Surprise' : 'Surprise Mode'}</span>
              </button>

              {/* 4. Celebrate Grand Finale */}
              <button
                onClick={onCelebrate}
                className="px-3 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-yellow-500 via-red-500 to-pink-500 hover:from-yellow-400 hover:via-red-400 hover:to-pink-400 active:scale-95 transition-all border border-yellow-300/40 shadow-[0_0_18px_rgba(255,190,11,0.5)] flex items-center justify-center gap-1.5"
              >
                <PartyPopper className="w-4 h-4 text-yellow-200" />
                <span>CELEBRATE!</span>
              </button>
            </div>
          </div>
        )}

        {/* Minimized Quick Dock */}
        {isMinimized && (
          <div className="p-2.5 flex items-center justify-between gap-2">
            <button
              onClick={onLaunchSingle}
              className="flex-1 py-2 px-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-amber-500 via-pink-500 to-purple-600 shadow-md flex items-center justify-center gap-2"
            >
              <Rocket className="w-3.5 h-3.5" />
              <span>Launch Firework</span>
            </button>

            <button
              onClick={onLaunchMultiple}
              className="py-2 px-3 rounded-xl font-semibold text-xs text-white bg-blue-600/80 border border-blue-400/30 flex items-center gap-1.5"
            >
              <Layers className="w-3.5 h-3.5 text-cyan-300" />
              <span>Multiple</span>
            </button>

            <button
              onClick={onCelebrate}
              className="py-2 px-3 rounded-xl font-bold text-xs text-amber-200 bg-amber-500/20 border border-amber-400/40 flex items-center gap-1.5"
            >
              <PartyPopper className="w-3.5 h-3.5 text-amber-300" />
              <span>Celebrate</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
