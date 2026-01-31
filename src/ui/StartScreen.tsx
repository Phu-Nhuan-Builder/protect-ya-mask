import { useGame } from '@/store/GameContext';
import { useEffect, useState } from 'react';

export function StartScreen() {
  const { startGame } = useGame();
  const [isVisible, setIsVisible] = useState(true);

  const handleStart = () => {
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
      {/* Logo/Title */}
      <div className="text-center mb-12">
        <h1 className="font-display text-5xl md:text-7xl font-black glitch-text tracking-wider">
          PROTECT YA
        </h1>
        <h1 className="font-display text-5xl md:text-7xl font-black glitch-text tracking-wider mt-2">
          MASK
        </h1>
        <p className="mt-6 text-muted-foreground text-lg font-body tracking-wide">
          Don't lose yourself.
        </p>
      </div>

      {/* Player preview - floating animation */}
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-white/20 to-white/5 border-2 border-white/30 animate-float mb-12" />

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

      {/* Credits */}
      <div className="absolute bottom-6 text-xs text-muted-foreground">
        Global Game Jam 2026 • Theme: Mask
      </div>
    </div>
  );
}
