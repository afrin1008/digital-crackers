import React from 'react';
import { Palette } from 'lucide-react';

export const PRESET_COLORS = [
  { name: 'Ruby Red', value: '#FF2E63' },
  { name: 'Saffron Gold', value: '#FFB800' },
  { name: 'Emerald Green', value: '#00E676' },
  { name: 'Electric Cyan', value: '#00D2FF' },
  { name: 'Neon Pink', value: '#FF007F' },
  { name: 'Royal Purple', value: '#9D4EDD' },
  { name: 'Fiery Orange', value: '#FF6B00' },
  { name: 'Starlight White', value: '#FFFFFF' }
];

export default function ColorPicker({
  selectedCrackerName,
  currentColor,
  onColorChange
}) {
  return (
    <div className="flex flex-col items-center gap-1.5 w-full max-w-md px-2">
      <div className="flex items-center gap-1.5 text-xs font-medium text-gray-300">
        <Palette className="w-3.5 h-3.5 text-amber-400" />
        <span>Customize <strong className="text-white">{selectedCrackerName}</strong> Colour:</span>
      </div>

      {/* Colour Swatches Row */}
      <div className="flex items-center justify-center gap-2 sm:gap-2.5 flex-wrap">
        {PRESET_COLORS.map((c) => {
          const isCurrent = currentColor.toLowerCase() === c.value.toLowerCase();
          return (
            <button
              key={c.value}
              onClick={() => onColorChange(c.value)}
              className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full transition-all duration-200 relative ${
                isCurrent ? 'scale-125 ring-2 ring-white shadow-lg' : 'hover:scale-110 opacity-85 hover:opacity-100'
              }`}
              style={{
                backgroundColor: c.value,
                boxShadow: isCurrent ? `0 0 12px ${c.value}` : undefined
              }}
              title={c.name}
            >
              {isCurrent && (
                <span className="absolute inset-0 flex items-center justify-center text-[10px] text-black font-extrabold">
                  ✓
                </span>
              )}
            </button>
          );
        })}

        {/* Custom Color Input via Palette Icon */}
        <label
          className="relative w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-tr from-pink-500 via-yellow-400 to-cyan-400 p-[1.5px] cursor-pointer hover:scale-110 transition-transform flex items-center justify-center"
          title="Pick any custom colour"
        >
          <div className="w-full h-full rounded-full bg-[#121324] flex items-center justify-center">
            <span className="text-[10px]">🎨</span>
          </div>
          <input
            type="color"
            value={currentColor}
            onChange={(e) => onColorChange(e.target.value)}
            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
          />
        </label>
      </div>
    </div>
  );
}
