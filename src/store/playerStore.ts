import { Player } from './types';
import { getItem, setItem, generateId } from './storage';

const KEY = 'nasp_players';

export async function getAllPlayers(): Promise<Player[]> {
  return (await getItem<Player[]>(KEY)) ?? [];
}

export async function getPlayerById(id: string): Promise<Player | undefined> {
  const players = await getAllPlayers();
  return players.find((p) => p.id === id);
}

export async function addPlayer(data: { name: string; grade: string; avatar: string }): Promise<Player> {
  const players = await getAllPlayers();
  const player: Player = {
    id: generateId(),
    name: data.name,
    grade: data.grade,
    avatar: data.avatar,
    joined: new Date().toISOString(),
  };
  players.push(player);
  await setItem(KEY, players);
  return player;
}

export async function deletePlayer(id: string): Promise<void> {
  const players = await getAllPlayers();
  await setItem(KEY, players.filter((p) => p.id !== id));
  // Cascade: remove orphaned scores
  const { deleteScoresByPlayerId } = await import('./scoreStore');
  await deleteScoresByPlayerId(id);
}
