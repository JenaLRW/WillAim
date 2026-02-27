import { useReducer } from 'react';
import { ROUNDS, SHOTS } from '../constants/scoring';
import { ScoringState, ScoringAction, ScoringPlayer } from '../store/types';
import { flatSum } from '../utils/scoring';

function getInitialState(players: ScoringPlayer[]): ScoringState {
  return {
    players,
    activePlayerIdx: 0,
    showConfirm: false,
    pendingConfirmDist: null,
    showReward: false,
    rewardPlayer: null,
    rewardGrand: 0,
    rewardScore10: 0,
    rewardScore15: 0,
    allDone: false,
  };
}

function scoringReducer(state: ScoringState, action: ScoringAction): ScoringState {
  switch (action.type) {
    case 'INIT':
      return getInitialState(action.players);

    case 'SWITCH_PLAYER': {
      if (action.index < 0 || action.index >= state.players.length) return state;
      return { ...state, activePlayerIdx: action.index };
    }

    case 'ADD_SCORE': {
      const players = state.players.map((p, i) => {
        if (i !== state.activePlayerIdx) return p;
        const ps = p.state;
        if (ps.done) return p;

        const dist = ps.phase;
        const newScores = {
          ...ps.scores,
          [dist]: ps.scores[dist].map((row, ri) =>
            ri === ps.round
              ? row.map((val, si) => (si === ps.shot ? action.value : val))
              : row,
          ),
        };

        let newRound = ps.round;
        let newShot = ps.shot + 1;

        if (newShot >= SHOTS) {
          newShot = 0;
          newRound = ps.round + 1;
        }

        return {
          ...p,
          state: { ...ps, scores: newScores, round: newRound, shot: newShot },
        };
      });

      const activePlayer = players[state.activePlayerIdx];
      const ps = activePlayer.state;

      if (ps.round >= ROUNDS) {
        return {
          ...state,
          players,
          showConfirm: true,
          pendingConfirmDist: ps.phase,
        };
      }

      return { ...state, players };
    }

    case 'CONFIRM_NO': {
      const dist = state.pendingConfirmDist!;
      const players = state.players.map((p, i) => {
        if (i !== state.activePlayerIdx) return p;
        const ps = p.state;
        const distScores = ps.scores[dist];

        // Walk backward to find and remove the last entered shot
        let undoRound = ps.round;
        let undoShot = ps.shot;
        let newDistScores = distScores;

        for (let r = ROUNDS - 1; r >= 0; r--) {
          let found = false;
          for (let s = SHOTS - 1; s >= 0; s--) {
            if (distScores[r][s] !== null) {
              newDistScores = distScores.map((row, ri) =>
                ri === r ? row.map((val, si) => (si === s ? null : val)) : row,
              );
              undoRound = r;
              undoShot = s;
              found = true;
              break;
            }
          }
          if (found) break;
        }

        return {
          ...p,
          state: {
            ...ps,
            scores: { ...ps.scores, [dist]: newDistScores },
            round: undoRound,
            shot: undoShot,
          },
        };
      });

      return {
        ...state,
        players,
        showConfirm: false,
        pendingConfirmDist: null,
      };
    }

    case 'CONFIRM_YES': {
      const dist = state.pendingConfirmDist!;

      if (dist === '10m') {
        const players = state.players.map((p, i) => {
          if (i !== state.activePlayerIdx) return p;
          return {
            ...p,
            state: {
              ...p.state,
              confirmed10: true,
              phase: '15m' as const,
              round: 0,
              shot: 0,
              scores: {
                ...p.state.scores,
                '15m': Array.from({ length: ROUNDS }, () => Array(SHOTS).fill(null)),
              },
            },
          };
        });
        return {
          ...state,
          players,
          showConfirm: false,
          pendingConfirmDist: null,
        };
      }

      // dist === '15m'
      const activePlayer = state.players[state.activePlayerIdx];
      const s10 = flatSum(activePlayer.state.scores['10m']);
      const s15 = flatSum(activePlayer.state.scores['15m']);
      const grand = s10 + s15;

      const players = state.players.map((p, i) => {
        if (i !== state.activePlayerIdx) return p;
        return {
          ...p,
          state: { ...p.state, confirmed15: true, done: true },
        };
      });

      return {
        ...state,
        players,
        showConfirm: false,
        pendingConfirmDist: null,
        showReward: true,
        rewardPlayer: { ...activePlayer, state: { ...activePlayer.state, confirmed15: true, done: true } },
        rewardGrand: grand,
        rewardScore10: s10,
        rewardScore15: s15,
      };
    }

    case 'CLOSE_REWARD': {
      const allDone = state.players.every((p) => p.state.done);

      // Auto-advance to next unfinished player
      let nextIdx = state.activePlayerIdx;
      if (!allDone) {
        const nextUnfinished = state.players.findIndex(
          (p, i) => i !== state.activePlayerIdx && !p.state.done,
        );
        if (nextUnfinished !== -1) {
          nextIdx = nextUnfinished;
        }
      }

      return {
        ...state,
        showReward: false,
        rewardPlayer: null,
        allDone,
        activePlayerIdx: nextIdx,
      };
    }

    default:
      return state;
  }
}

export function useScoring(initialPlayers: ScoringPlayer[]) {
  const [state, dispatch] = useReducer(scoringReducer, initialPlayers, getInitialState);
  return { state, dispatch };
}
