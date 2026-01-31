import { useEffect, useRef, useCallback } from 'react';
import { createGame, getGame } from '@/game/Game';
import { useGame } from '@/store/GameContext';
import { GameHUD } from '@/ui/GameHUD';
import { StartScreen } from '@/ui/StartScreen';
import { GameOverScreen } from '@/ui/GameOverScreen';
import { cn } from '@/lib/utils';

export function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { state } = useGame();
  const gameInitialized = useRef(false);

  const initGame = useCallback(async () => {
    if (!canvasRef.current || gameInitialized.current) return;

    try {
      const game = createGame(canvasRef.current);
      await game.initialize();
      gameInitialized.current = true;
      console.log('Game initialized successfully');
    } catch (error) {
      console.error('Game initialization failed:', error);
    }
  }, []);

  useEffect(() => {
    initGame();

    return () => {
      const game = getGame();
      if (game) {
        game.dispose();
      }
    };
  }, [initGame]);

  // Start/stop game based on state
  useEffect(() => {
    const game = getGame();
    if (!game || !gameInitialized.current) {
      if (state.isPlaying) {
        console.log('Waiting for game to initialize before starting...');
        // Retry after a short delay if game is not ready
        const timer = setTimeout(() => {
          const g = getGame();
          if (g && state.isPlaying && !state.isPaused) {
            g.start();
          }
        }, 100);
        return () => clearTimeout(timer);
      }
      return;
    }

    if (state.isPlaying && !state.isPaused) {
      game.start();
    } else if (state.isGameOver || state.isVictory) {
      game.stop();
      game.playGameOverSound();
    } else if (state.isPaused) {
      game.pause();
    }
  }, [state.isPlaying, state.isPaused, state.isGameOver, state.isVictory]);

  // Handle level changes
  useEffect(() => {
    const game = getGame();
    if (!game || !state.isPlaying) return;

    game.onLevelChange(state.level);
  }, [state.level, state.isPlaying]);

  // Restart handler
  useEffect(() => {
    const game = getGame();
    if (!game) return;

    if (state.isPlaying && state.hp === 100 && state.score === 0) {
      game.restart();
    }
  }, [state.isPlaying, state.hp, state.score]);

  return (
    <div
      className={cn(
        'relative w-full h-screen flex items-center justify-center bg-background overflow-hidden',
        state.screenShake && 'shake'
      )}
    >
      {/* Game Canvas */}
      <canvas
        ref={canvasRef}
        className="max-w-full max-h-full"
        style={{ imageRendering: 'pixelated' }}
      />

      {/* UI Overlay */}
      <div className="game-overlay">
        {!state.isPlaying && !state.isGameOver && !state.isVictory && (
          <StartScreen />
        )}

        {state.isPlaying && <GameHUD />}

        {(state.isGameOver || state.isVictory) && <GameOverScreen />}
      </div>
    </div>
  );
}
