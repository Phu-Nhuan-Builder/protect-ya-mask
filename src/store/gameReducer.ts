import { GameState, MaskType, initialState } from './initialState';

export type GameAction =
  | { type: 'SET_MASK'; payload: MaskType }
  | { type: 'TAKE_DAMAGE'; payload: number }
  | { type: 'ADD_SCORE'; payload: number }
  | { type: 'INCREMENT_COMBO' }
  | { type: 'RESET_COMBO' }
  | { type: 'SET_LEVEL'; payload: number }
  | { type: 'START_GAME' }
  | { type: 'PAUSE_GAME' }
  | { type: 'RESUME_GAME' }
  | { type: 'GAME_OVER' }
  | { type: 'VICTORY' }
  | { type: 'RESTART_GAME' }
  | { type: 'TRIGGER_SHAKE' }
  | { type: 'CLEAR_SHAKE' };

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_MASK':
      return { ...state, currentMask: action.payload };

    case 'TAKE_DAMAGE': {
      const newHp = Math.max(0, state.hp - action.payload);
      const isGameOver = newHp <= 0;
      return {
        ...state,
        hp: newHp,
        combo: 0,
        isGameOver,
        isPlaying: !isGameOver,
        screenShake: true,
      };
    }

    case 'ADD_SCORE': {
      const comboMultiplier = 1 + Math.floor(state.combo / 5) * 0.1;
      const scoreToAdd = Math.floor(action.payload * comboMultiplier);
      return { ...state, score: state.score + scoreToAdd };
    }

    case 'INCREMENT_COMBO':
      return { ...state, combo: state.combo + 1 };

    case 'RESET_COMBO':
      return { ...state, combo: 0 };

    case 'SET_LEVEL':
      return { ...state, level: action.payload };

    case 'START_GAME':
      return { ...initialState, isPlaying: true };

    case 'PAUSE_GAME':
      return { ...state, isPaused: true };

    case 'RESUME_GAME':
      return { ...state, isPaused: false };

    case 'GAME_OVER':
      return { ...state, isGameOver: true, isPlaying: false };

    case 'VICTORY':
      return { ...state, isVictory: true, isPlaying: false };

    case 'RESTART_GAME':
      return { ...initialState, isPlaying: true };

    case 'TRIGGER_SHAKE':
      return { ...state, screenShake: true };

    case 'CLEAR_SHAKE':
      return { ...state, screenShake: false };

    default:
      return state;
  }
}
