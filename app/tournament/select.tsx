import React, { useState, useCallback } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../src/constants/theme';
import { TopBar } from '../../src/components/TopBar';
import { SelectPlayerCard } from '../../src/components/SelectPlayerCard';
import { EmptyState } from '../../src/components/EmptyState';
import { useToast } from '../../src/components/Toast';
import { Player } from '../../src/store/types';
import * as playerStore from '../../src/store/playerStore';

export default function SelectPlayersScreen() {
  const router = useRouter();
  const { showToast } = useToast();
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const all = await playerStore.getAllPlayers();
        setPlayers(all);
        setSelectedIds([]);
      })();
    }, []),
  );

  const togglePlayer = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleStart = () => {
    if (!selectedIds.length) {
      showToast('Select at least one player');
      return;
    }
    router.push({
      pathname: '/tournament/scoring',
      params: { playerIds: JSON.stringify(selectedIds) },
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <TopBar
        title="SELECT PLAYERS"
        onBack={() => router.back()}
        rightAction={{ label: 'START', onPress: handleStart }}
      />
      <FlatList
        data={players}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <SelectPlayerCard
            avatar={item.avatar}
            name={item.name}
            subtitle={item.grade || '—'}
            selected={selectedIds.includes(item.id)}
            onToggle={() => togglePlayer(item.id)}
          />
        )}
        ListEmptyComponent={
          <EmptyState icon="👤" message={'No players found.\nGo to Players to add some first.'} />
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
