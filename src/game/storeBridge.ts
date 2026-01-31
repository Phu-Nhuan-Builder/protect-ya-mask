import { getGlobalDispatch } from '@/store/GameContext';
import { MaskType } from '@/store/initialState';
import { GameAction } from '@/store/gameReducer';

/**
 * Bridge module for Excalibur to dispatch actions to React store
 */

export function dispatchToStore(action: GameAction) {
  const dispatch = getGlobalDispatch();
  if (dispatch) {
    dispatch(action);
  } else {
    console.warn('Store not initialized yet');
  }
}

export function setMask(mask: MaskType) {
  dispatchToStore({ type: 'SET_MASK', payload: mask });
}

export function takeDamage(amount: number) {
  dispatchToStore({ type: 'TAKE_DAMAGE', payload: amount });
}

export function addScore(points: number) {
  dispatchToStore({ type: 'ADD_SCORE', payload: points });
  dispatchToStore({ type: 'INCREMENT_COMBO' });
}

export function resetCombo() {
  dispatchToStore({ type: 'RESET_COMBO' });
}

export function triggerShake() {
  dispatchToStore({ type: 'TRIGGER_SHAKE' });
  setTimeout(() => dispatchToStore({ type: 'CLEAR_SHAKE' }), 300);
}

export function gameOver() {
  dispatchToStore({ type: 'GAME_OVER' });
}

export function victory() {
  dispatchToStore({ type: 'VICTORY' });
}

export function setLevel(level: number) {
  dispatchToStore({ type: 'SET_LEVEL', payload: level });
}
