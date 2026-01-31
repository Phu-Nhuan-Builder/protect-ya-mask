import { useGame } from '@/store/GameContext';
import { useEffect, useState } from 'react';

export function GameOverScreen() {
  const { state, restartGame } = useGame();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (state.isGameOver || state.isVictory) {
      // Delay appearance for dramatic effect
      setTimeout(() => setIsVisible(true), 500);
    } else {
      setIsVisible(false);
    }
  }, [state.isGameOver, state.isVictory]);

  const handleRestart = () => {
    setIsVisible(false);
    setTimeout(() => restartGame(), 300);
  };

  useEffect(() => {
    if (!isVisible) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        handleRestart();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible]);

  if (!isVisible) return null;

  const isVictory = state.isVictory;

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/95 backdrop-blur-sm z-50 animate-in fade-in duration-500">
      {/* Result */}
      <div className="text-center mb-8">
        {isVictory ? (
          <>
            <h1 className="font-display text-4xl md:text-6xl font-black text-accent tracking-wider mb-4">
              IDENTITY PRESERVED
            </h1>
            <p className="text-muted-foreground text-lg">
              You survived the day without losing yourself.
            </p>
          </>
        ) : (
          <>
            <h1 className="font-display text-4xl md:text-6xl font-black text-destructive tracking-wider mb-4">
              MASK SHATTERED
            </h1>
            <p className="text-muted-foreground text-lg">
              The pressure was too much...
            </p>
          </>
        )}
      </div>

      {/* Stats */}
      <div className="bg-card/50 border border-border rounded-lg p-8 mb-8">
        <div className="grid grid-cols-2 gap-8">
          <div className="text-center">
            <span className="text-sm text-muted-foreground uppercase tracking-wider">
              Final Score
            </span>
            <div className="score-display text-3xl mt-2">
              {state.score.toLocaleString()}
            </div>
          </div>
          <div className="text-center">
            <span className="text-sm text-muted-foreground uppercase tracking-wider">
              Level Reached
            </span>
            <div className="font-display text-3xl text-primary mt-2">
              {state.level}
            </div>
          </div>
        </div>
      </div>

      {/* Restart button */}
      <button className="arcade-button" onClick={handleRestart}>
        Press SPACE to Try Again
      </button>

      {/* Broken mask visual */}
      {!isVictory && (
        <div className="absolute bottom-20 opacity-20">
          <div className="w-32 h-32 rounded-full border-4 border-destructive relative">
            <div className="absolute inset-0 bg-destructive/10" />
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-destructive rotate-45 origin-center" />
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-destructive -rotate-45 origin-center" />
          </div>
        </div>
      )}
    </div>
  );
}
