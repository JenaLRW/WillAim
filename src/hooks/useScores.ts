import { useState, useEffect, useCallback } from 'react';
import { Score } from '../store/types';
import * as scoreStore from '../store/scoreStore';

export function useScores() {
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const data = await scoreStore.getAllScores();
    setScores(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addScore = useCallback(
    async (data: Omit<Score, 'id'>) => {
      const score = await scoreStore.addScore(data);
      await refresh();
      return score;
    },
    [refresh],
  );

  const deleteScore = useCallback(
    async (id: string) => {
      await scoreStore.deleteScore(id);
      await refresh();
    },
    [refresh],
  );

  const getPlayerScores = useCallback(async (playerId: string) => {
    return scoreStore.getScoresByPlayerId(playerId);
  }, []);

  const getRecentScores = useCallback(async (limit: number) => {
    return scoreStore.getRecentScores(limit);
  }, []);

  return { scores, loading, refresh, addScore, deleteScore, getPlayerScores, getRecentScores };
}
