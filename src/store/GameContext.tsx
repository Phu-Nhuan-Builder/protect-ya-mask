import React, { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';
import { GameState, initialState, MaskType } from './initialState';
import { GameAction, gameReducer } from './gameReducer';

interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  // Convenience methods
  setMask: (mask: MaskType) => void;
  takeDamage: (amount: number) => void;
  addScore: (points: number) => void;
  startGame: () => void;
  restartGame: () => void;
  triggerShake: () => void;
}

const GameContext = createContext<GameContextType | null>(null);

// Global reference for Excalibur to dispatch actions
let globalDispatch: React.Dispatch<GameAction> | null = null;

export function getGlobalDispatch(): React.Dispatch<GameAction> | null {
  return globalDispatch;
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Store global dispatch reference
  React.useEffect(() => {
    globalDispatch = dispatch;
    return () => {
      globalDispatch = null;
    };
  }, [dispatch]);

  const setMask = useCallback((mask: MaskType) => {
    dispatch({ type: 'SET_MASK', payload: mask });
  }, []);

  const takeDamage = useCallback((amount: number) => {
    dispatch({ type: 'TAKE_DAMAGE', payload: amount });
  }, []);

  const addScore = useCallback((points: number) => {
    dispatch({ type: 'ADD_SCORE', payload: points });
    dispatch({ type: 'INCREMENT_COMBO' });
  }, []);

  const startGame = useCallback(() => {
    dispatch({ type: 'START_GAME' });
  }, []);

  const restartGame = useCallback(() => {
    dispatch({ type: 'RESTART_GAME' });
  }, []);

  const triggerShake = useCallback(() => {
    dispatch({ type: 'TRIGGER_SHAKE' });
    setTimeout(() => dispatch({ type: 'CLEAR_SHAKE' }), 300);
  }, []);

  return (
    <GameContext.Provider
      value={{
        state,
        dispatch,
        setMask,
        takeDamage,
        addScore,
        startGame,
        restartGame,
        triggerShake,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame(): GameContextType {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
