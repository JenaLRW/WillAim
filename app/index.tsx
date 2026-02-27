import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS } from '../src/constants/theme';
import { Button } from '../src/components/Button';
import { PlayerCard } from '../src/components/PlayerCard';
import { EmptyState } from '../src/components/EmptyState';
import { formatDate } from '../src/utils/formatDate';
import { Score, Player } from '../src/store/types';
import * as scoreStore from '../src/store/scoreStore';
import * as playerStore from '../src/store/playerStore';

export default function HomeScreen() {
  const router = useRouter();
  const [recentScores, setRecentScores] = useState<Score[]>([]);
  const [playerMap, setPlayerMap] = useState<Record<string, Player>>({});

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const [scores, players] = await Promise.all([
          scoreStore.getRecentScores(20),
          playerStore.getAllPlayers(),
        ]);
        setRecentScores(scores);
        const map: Record<string, Player> = {};
        players.forEach((p) => (map[p.id] = p));
        setPlayerMap(map);
      })();
    }, []),
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>🏹 NASP ARCHERY</Text>
        <Text style={styles.subtitle}>SCORE KEEPER · LOCAL DATABASE</Text>
      </View>
      <View style={styles.buttons}>
        <Button title="NEW TOURNAMENT" onPress={() => router.push('/tournament/select')} style={{ flex: 1 }} />
        <Button
          title="PLAYERS"
          variant="secondary"
          onPress={() => router.push('/players')}
          style={{ flex: 1 }}
        />
      </View>
      <Text style={styles.sectionLabel}>RECENT TOURNAMENTS</Text>
      <FlatList
        data={recentScores}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const player = playerMap[item.playerId];
          if (!player) return null;
          return (
            <PlayerCard
              avatar={player.avatar}
              name={player.name}
              subtitle={formatDate(item.date)}
              score={item.grand}
              onPress={() => router.push(`/players/${player.id}`)}
            />
          );
        }}
        ListEmptyComponent={
          <EmptyState icon="🎯" message={'No tournaments yet.\nAdd players and start shooting!'} />
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
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    alignItems: 'center',
  },
  title: {
    fontFamily: FONTS.header,
    fontSize: 48,
    color: COLORS.gold,
    letterSpacing: 3,
  },
  subtitle: {
    fontFamily: FONTS.header,
    fontSize: 12,
    color: COLORS.muted,
    letterSpacing: 2,
    marginTop: 2,
  },
  buttons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 20,
  },
  sectionLabel: {
    fontFamily: FONTS.header,
    fontSize: 13,
    color: COLORS.muted,
    letterSpacing: 2,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  list: {
    paddingHorizontal: 20,
    gap: 8,
    paddingBottom: 20,
  },
});
