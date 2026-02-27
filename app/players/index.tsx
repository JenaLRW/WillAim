import React, { useState, useCallback } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../src/constants/theme';
import { TopBar } from '../../src/components/TopBar';
import { PlayerCard } from '../../src/components/PlayerCard';
import { EmptyState } from '../../src/components/EmptyState';
import { Player, Score } from '../../src/store/types';
import * as playerStore from '../../src/store/playerStore';
import * as scoreStore from '../../src/store/scoreStore';

export default function PlayersScreen() {
  const router = useRouter();
  const [players, setPlayers] = useState<Player[]>([]);
  const [scoresByPlayer, setScoresByPlayer] = useState<Record<string, Score[]>>({});

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const [allPlayers, allScores] = await Promise.all([
          playerStore.getAllPlayers(),
          scoreStore.getAllScores(),
        ]);
        setPlayers(allPlayers);
        const map: Record<string, Score[]> = {};
        allScores.forEach((s) => {
          if (!map[s.playerId]) map[s.playerId] = [];
          map[s.playerId].push(s);
        });
        setScoresByPlayer(map);
      })();
    }, []),
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <TopBar
        title="PLAYERS"
        onBack={() => router.back()}
        rightAction={{ label: '+ ADD', onPress: () => router.push('/players/add') }}
      />
      <FlatList
        data={players}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const ps = scoresByPlayer[item.id] || [];
          const best = ps.length ? Math.max(...ps.map((s) => s.grand)) : null;
          return (
            <PlayerCard
              avatar={item.avatar}
              name={item.name}
              subtitle={`${item.grade || 'No grade'} · ${ps.length} tournament${ps.length !== 1 ? 's' : ''}`}
              score={best ?? '—'}
              onPress={() => router.push(`/players/${item.id}`)}
            />
          );
        }}
        ListEmptyComponent={
          <EmptyState icon="👤" message={'No players yet.\nTap "+ ADD" to create one.'} />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  list: {
    padding: 16,
    gap: 8,
  },
});
