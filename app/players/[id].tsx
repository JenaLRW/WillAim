import React, { useState, useCallback } from 'react';
import { View, Text, Pressable, FlatList, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, RADII } from '../../src/constants/theme';
import { TopBar } from '../../src/components/TopBar';
import { AvatarCircle } from '../../src/components/AvatarCircle';
import { StatCard } from '../../src/components/StatCard';
import { HistoryCard } from '../../src/components/HistoryCard';
import { EmptyState } from '../../src/components/EmptyState';
import { DeleteModal } from '../../src/components/DeleteModal';
import { SettingsModal } from '../../src/components/SettingsModal';
import { useToast } from '../../src/components/Toast';
import { formatDate } from '../../src/utils/formatDate';
import { Player, Score } from '../../src/store/types';
import * as playerStore from '../../src/store/playerStore';
import * as scoreStore from '../../src/store/scoreStore';

export default function PlayerProfileScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { showToast } = useToast();
  const [player, setPlayer] = useState<Player | null>(null);
  const [scores, setScores] = useState<Score[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const p = await playerStore.getPlayerById(id!);
        if (p) setPlayer(p);
        const s = await scoreStore.getScoresByPlayerId(id!);
        s.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setScores(s);
      })();
    }, [id]),
  );

  const grands = scores.map((s) => s.grand);
  const best = grands.length ? Math.max(...grands) : null;
  const avg = grands.length ? Math.round(grands.reduce((a, b) => a + b, 0) / grands.length) : null;

  const handleDelete = async () => {
    if (deleteId) {
      await scoreStore.deleteScore(deleteId);
      setDeleteId(null);
      showToast('Score deleted');
      const s = await scoreStore.getScoresByPlayerId(id!);
      s.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setScores(s);
    }
  };

  const handleSaveAvatar = async (avatar: string) => {
    const updated = await playerStore.updatePlayer(id!, { avatar });
    if (updated) {
      setPlayer(updated);
      showToast('Avatar updated');
    }
    setShowSettings(false);
  };

  const handleShoot = () => {
    router.push({
      pathname: '/tournament/scoring',
      params: { playerIds: JSON.stringify([id]) },
    });
  };

  if (!player) return null;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <TopBar
        title={player.name.split(' ')[0].toUpperCase()}
        onBack={() => router.back()}
        rightExtra={
          <Pressable
            onPress={() => setShowSettings(true)}
            style={({ pressed }) => [styles.settingsBtn, pressed && styles.settingsPressed]}
          >
            <Text style={styles.settingsIcon}>⚙️</Text>
          </Pressable>
        }
        rightAction={{ label: 'SHOOT', onPress: handleShoot }}
      />
      <FlatList
        data={scores}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <>
            <View style={styles.hero}>
              <View style={styles.profileRow}>
                <AvatarCircle emoji={player.avatar} size="lg" />
                <View style={{ flex: 1 }}>
                  <Text style={styles.name}>{player.name}</Text>
                  {player.grade ? <Text style={styles.meta}>{player.grade}</Text> : null}
                  <Text style={styles.meta}>Joined {formatDate(player.joined)}</Text>
                </View>
              </View>
              <View style={styles.statsRow}>
                <StatCard value={best ?? '—'} label="Best Score" />
                <StatCard value={avg ?? '—'} label="Average" />
                <StatCard value={scores.length} label="Tournaments" />
              </View>
            </View>
            <Text style={styles.sectionLabel}>HISTORY</Text>
          </>
        }
        renderItem={({ item }) => (
          <HistoryCard score={item} onDelete={(sid) => setDeleteId(sid)} />
        )}
        ListEmptyComponent={<EmptyState icon="📋" message="No scores recorded yet." />}
      />
      <DeleteModal
        visible={deleteId !== null}
        onDelete={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
      <SettingsModal
        visible={showSettings}
        currentAvatar={player.avatar}
        onSave={handleSaveAvatar}
        onClose={() => setShowSettings(false)}
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
    paddingHorizontal: 16,
    gap: 8,
    paddingBottom: 20,
  },
  hero: {
    paddingVertical: 16,
    gap: 16,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  name: {
    fontFamily: FONTS.header,
    fontSize: 30,
    color: COLORS.text,
    letterSpacing: 1,
  },
  meta: {
    fontFamily: FONTS.body,
    fontSize: 13,
    color: COLORS.muted,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  sectionLabel: {
    fontFamily: FONTS.header,
    fontSize: 13,
    color: COLORS.muted,
    letterSpacing: 2,
    marginTop: 8,
    marginBottom: 8,
  },
  settingsBtn: {
    width: 36,
    height: 36,
    borderRadius: RADII.round,
    backgroundColor: COLORS.surface2,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsPressed: {
    transform: [{ scale: 0.95 }],
    opacity: 0.8,
  },
  settingsIcon: {
    fontSize: 18,
  },
});
