import { useState, useEffect, useCallback } from 'react';
import { Player } from '../store/types';
import * as playerStore from '../store/playerStore';

export function usePlayers() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const data = await playerStore.getAllPlayers();
      setPlayers(data);
    } catch {
      // storage read failed — keep existing data
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addPlayer = useCallback(
    async (data: { name: string; grade: string; avatar: string }) => {
      const player = await playerStore.addPlayer(data);
      await refresh();
      return player;
    },
    [refresh],
  );

  const deletePlayer = useCallback(
    async (id: string) => {
      await playerStore.deletePlayer(id);
      await refresh();
    },
    [refresh],
  );

  return { players, loading, refresh, addPlayer, deletePlayer };
}
