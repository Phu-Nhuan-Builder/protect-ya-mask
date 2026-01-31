import { useGame } from '@/store/GameContext';
import { useEffect, useState } from 'react';
import * as ex from 'excalibur';
import logoImg from '@/assets/logo/logo.png';
import phunhuanLogo from '@/assets/logo/phunhuanbuilder.jpg';
import hackonteamLogo from '@/assets/logo/hackonteam.png';

export function StartScreen() {
  const { startGame } = useGame();
  const [isVisible, setIsVisible] = useState(true);

  const handleStart = async () => {
    // Resume AudioContext on user gesture to fix autoplay restrictions
    try {
      await ex.WebAudio.unlock();
    } catch (e) {
      console.log('WebAudio unlock failed:', e);
    }
    
    setIsVisible(false);
    setTimeout(() => startGame(), 300);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        handleStart();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/95 backdrop-blur-sm z-50">
      {/* Logo */}
      <img 
        src={logoImg} 
        alt="Protect Ya Mask" 
        className="w-64 md:w-80 mb-8 animate-float"
      />
      
      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="font-display text-4xl md:text-6xl font-black glitch-text tracking-wider">
          PROTECT YA MASK
        </h1>
        <p className="mt-4 text-muted-foreground text-lg font-body tracking-wide">
          Don't lose yourself.
        </p>
      </div>

      {/* Instructions */}
      <div className="text-center mb-8">
        <div className="flex gap-6 mb-6">
          <div className="flex flex-col items-center">
            <div className="mask-indicator mask-indicator-work px-6">
              <span className="text-xs opacity-60">[Q]</span>
              <span className="ml-2">Work</span>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="mask-indicator mask-indicator-family px-6">
              <span className="text-xs opacity-60">[W]</span>
              <span className="ml-2">Family</span>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="mask-indicator mask-indicator-social px-6">
              <span className="text-xs opacity-60">[E]</span>
              <span className="ml-2">Social</span>
            </div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Hold the right key to match incoming enemies
        </p>
      </div>

      {/* Start button */}
      <button className="arcade-button" onClick={handleStart}>
        Press SPACE to Wake Up
      </button>

      {/* Sponsor logos */}
      <div className="flex items-center justify-center gap-8 mt-8">
        <img 
          src={phunhuanLogo} 
          alt="Phu Nhuan Builder" 
          className="h-16 w-auto rounded-lg object-contain"
        />
        <img 
          src={hackonteamLogo} 
          alt="Hackon Team" 
          className="h-16 w-auto rounded-lg object-contain"
        />
      </div>

      {/* Credits */}
      <div className="mt-4 text-xs text-muted-foreground">
        Global Game Jam 2026 • Theme: Mask
      </div>
    </div>
  );
}
