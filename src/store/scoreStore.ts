import { Score } from './types';
import { getItem, setItem, generateId } from './storage';

const KEY = 'nasp_scores';

export async function getAllScores(): Promise<Score[]> {
  return (await getItem<Score[]>(KEY)) ?? [];
}

export async function getScoresByPlayerId(playerId: string): Promise<Score[]> {
  const scores = await getAllScores();
  return scores.filter((s) => s.playerId === playerId);
}

export async function getRecentScores(limit: number): Promise<Score[]> {
  const scores = await getAllScores();
  scores.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return scores.slice(0, limit);
}

export async function addScore(data: Omit<Score, 'id'>): Promise<Score> {
  const scores = await getAllScores();
  const score: Score = { id: generateId(), ...data };
  scores.push(score);
  await setItem(KEY, scores);
  return score;
}

export async function deleteScore(id: string): Promise<void> {
  const scores = await getAllScores();
  await setItem(KEY, scores.filter((s) => s.id !== id));
}

export async function deleteScoresByPlayerId(playerId: string): Promise<void> {
  const scores = await getAllScores();
  await setItem(KEY, scores.filter((s) => s.playerId !== playerId));
}
