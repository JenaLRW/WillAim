import { ROUNDS, SHOTS } from '../constants/scoring';
import { PlayerScoringState } from '../store/types';

export function flatSum(arr2d: (number | null)[][]): number {
  return arr2d.flat().reduce<number>((a, v) => a + (v ?? 0), 0);
}

export function freshPlayerState(): PlayerScoringState {
  return {
    phase: '10m',
    scores: {
      '10m': Array.from({ length: ROUNDS }, () => Array(SHOTS).fill(null)),
      '15m': Array.from({ length: ROUNDS }, () => Array(SHOTS).fill(null)),
    },
    confirmed10: false,
    confirmed15: false,
    round: 0,
    shot: 0,
    done: false,
  };
}
