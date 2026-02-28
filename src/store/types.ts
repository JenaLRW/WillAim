export interface Player {
  id: string;
  name: string;
  grade: string;
  avatar: string;
  joined: string;
}

export interface Score {
  id: string;
  playerId: string;
  date: string;
  grand: number;
  score10: number;
  score15: number;
  rounds10: number[][];
  rounds15: number[][];
}

export interface PlayerScoringState {
  phase: '10m' | '15m';
  scores: {
    '10m': (number | null)[][];
    '15m': (number | null)[][];
  };
  confirmed10: boolean;
  confirmed15: boolean;
  round: number;
  shot: number;
  done: boolean;
}

export interface ScoringPlayer {
  id: string;
  name: string;
  avatar: string;
  state: PlayerScoringState;
}

export type ScoringAction =
  | { type: 'INIT'; players: ScoringPlayer[] }
  | { type: 'ADD_SCORE'; value: number }
  | { type: 'SWITCH_PLAYER'; index: number }
  | { type: 'JUMP_TO'; round: number; shot: number }
  | { type: 'CONFIRM_YES' }
  | { type: 'CONFIRM_NO' }
  | { type: 'CLOSE_REWARD' };

export interface ScoringState {
  players: ScoringPlayer[];
  activePlayerIdx: number;
  showConfirm: boolean;
  pendingConfirmDist: '10m' | '15m' | null;
  showReward: boolean;
  rewardPlayer: ScoringPlayer | null;
  rewardGrand: number;
  rewardScore10: number;
  rewardScore15: number;
  allDone: boolean;
}
