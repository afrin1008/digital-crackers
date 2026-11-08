import React, { useState, useRef, useEffect, useCallback } from 'react';
import MoonAndClouds from './components/MoonAndClouds';
import CanvasSky from './components/CanvasSky';
import Header from './components/Header';
import ControlPanel from './components/ControlPanel';
import CelebrationModal from './components/CelebrationModal';
import { FireworksEngine } from './utils/fireworkEngine';
import { soundEngine } from './utils/audioEngine';
import { FIREWORK_COLORS, FIREWORK_PATTERNS } from './utils/presets';

export default function App() {
  const engineRef = useRef(null);
  const surpriseIntervalRef = useRef(null);

  // States
  const [burstCount, setBurstCount] = useState(0);
  const [selectedColor, setSelectedColor] = useState('rainbow');
  const [selectedPattern, setSelectedPattern] = useState('circle');
  const [customMessage, setCustomMessage] = useState('Happy Diwali! 🪔');
  const [messageColor, setMessageColor] = useState('match');
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [isSurpriseMode, setIsSurpriseMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isCelebrationOpen, setIsCelebrationOpen] = useState(false);

  // Initialize engine on canvas mount
  useEffect(() => {
    const canvas = document.querySelector('canvas');
    if (canvas && !engineRef.current) {
      engineRef.current = new FireworksEngine(canvas);
    }

    return () => {
      if (engineRef.current) {
        engineRef.current.destroy();
        engineRef.current = null;
      }
    };
  }, []);

  // Sync fullscreen state changes
  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  // Surprise / Auto Show Mode Loop
  useEffect(() => {
    if (isSurpriseMode) {
      surpriseIntervalRef.current = setInterval(() => {
        if (!engineRef.current) return;
        const colorKeys = Object.keys(FIREWORK_COLORS);
        const patternIds = FIREWORK_PATTERNS.map(p => p.id);

        const randColor = colorKeys[Math.floor(Math.random() * colorKeys.length)];
        const randPattern = patternIds[Math.floor(Math.random() * patternIds.length)];

        engineRef.current.launch({
          color: randColor,
          pattern: randPattern,
          message: Math.random() < 0.35 ? customMessage : null,
          messageColor: messageColor
        });
      }, 1600);
    } else if (surpriseIntervalRef.current) {
      clearInterval(surpriseIntervalRef.current);
      surpriseIntervalRef.current = null;
    }

    return () => {
      if (surpriseIntervalRef.current) {
        clearInterval(surpriseIntervalRef.current);
      }
    };
  }, [isSurpriseMode, customMessage, messageColor]);

  // Audio Toggle
  const handleToggleSound = useCallback(() => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    soundEngine.setMuted(!nextState);
  }, [soundEnabled]);

  // Fullscreen Toggle
  const handleToggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.warn('Fullscreen request failed:', err);
      });
    } else {
      document.exitFullscreen().catch(err => {
        console.warn('Exit fullscreen failed:', err);
      });
    }
  }, []);

  // Launch Single Firework
  const handleLaunchSingle = useCallback(() => {
    if (!engineRef.current) return;
    engineRef.current.launch({
      color: selectedColor,
      pattern: selectedPattern,
      message: customMessage || null,
      messageColor: messageColor
    });
  }, [selectedColor, selectedPattern, customMessage, messageColor]);

  // Launch Multiple Fireworks (Barrage of 5)
  const handleLaunchMultiple = useCallback(() => {
    if (!engineRef.current) return;
    engineRef.current.launchMultiple(5, {
      color: selectedColor,
      pattern: selectedPattern,
      message: customMessage || null,
      messageColor: messageColor
    });
  }, [selectedColor, selectedPattern, customMessage, messageColor]);

  // Surprise Mode Toggle
  const handleToggleSurpriseMode = useCallback(() => {
    setIsSurpriseMode(prev => !prev);
  }, []);

  // Clear Sky
  const handleClearSky = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.clear();
    }
  }, []);

  // Celebrate Grand Finale
  const handleCelebrate = useCallback(() => {
    if (!engineRef.current) return;

    // Launch multi-wave barrage
    soundEngine.playCelebrationCascade();

    // Wave 1: Golden willows and hearts
    engineRef.current.launchMultiple(6, {
      pattern: 'random',
      color: 'random',
      message: customMessage || 'MAGICAL CELEBRATION! 🎆',
      messageColor: messageColor
    });

    // Wave 2 after 1.2s: Rainbow and stars
    setTimeout(() => {
      if (engineRef.current) {
        engineRef.current.launchMultiple(5, {
          pattern: 'rainbow',
          color: 'rainbow'
        });
      }
    }, 1200);

    // Wave 3 after 2.2s: Grand Willow cascade
    setTimeout(() => {
      if (engineRef.current) {
        engineRef.current.launchMultiple(4, {
          pattern: 'willow',
          color: 'golden'
        });
      }
    }, 2200);

    // Open celebration modal after short delay
    setTimeout(() => {
      setIsCelebrationOpen(true);
    }, 1500);
  }, [customMessage, messageColor]);

  // Restart Experience
  const handleRestart = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.clear();
    }
    setBurstCount(0);
    setIsSurpriseMode(false);
    setSelectedColor('rainbow');
    setSelectedPattern('circle');
    setCustomMessage('Happy Diwali! 🪔');
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gradient-to-b from-[#060714] via-[#0d0f2b] to-[#1a103c] select-none font-['Outfit',sans-serif]">
      {/* Visual Sky Background (Stars, Moon, Drifting Clouds) */}
      <MoonAndClouds />

      {/* Interactive Canvas for Fireworks simulation and click-to-launch */}
      <CanvasSky
        engineRef={engineRef}
        onBurst={setBurstCount}
        activeColor={selectedColor}
        activePattern={selectedPattern}
        activeMessage={customMessage}
        messageColor={messageColor}
        soundEnabled={soundEnabled}
      />

      {/* Main Screen Header & Stats */}
      <Header
        burstCount={burstCount}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
        onReset={handleRestart}
      />

      {/* Floating Modern Glassmorphism Control Panel */}
      <ControlPanel
        onLaunchSingle={handleLaunchSingle}
        onLaunchMultiple={handleLaunchMultiple}
        isSurpriseMode={isSurpriseMode}
        onToggleSurpriseMode={handleToggleSurpriseMode}
        selectedColor={selectedColor}
        onSelectColor={setSelectedColor}
        selectedPattern={selectedPattern}
        onSelectPattern={setSelectedPattern}
        customMessage={customMessage}
        onChangeCustomMessage={setCustomMessage}
        messageColor={messageColor}
        onSelectMessageColor={setMessageColor}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onClearSky={handleClearSky}
        onCelebrate={handleCelebrate}
        onReset={handleRestart}
      />

      {/* Celebration Grand Finale Modal */}
      <CelebrationModal
        isOpen={isCelebrationOpen}
        onClose={() => setIsCelebrationOpen(false)}
        burstCount={burstCount}
        onRestart={handleRestart}
        onMegaFinale={handleCelebrate}
      />
    </div>
  );
}
