import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS } from '../../src/constants/theme';
import { PlayerTab } from '../../src/components/PlayerTab';
import { GrandTotal } from '../../src/components/GrandTotal';
import { ScoreGrid } from '../../src/components/ScoreGrid';
import { ArcheryTarget } from '../../src/components/ArcheryTarget';
import { ConfirmModal } from '../../src/components/ConfirmModal';
import { RewardModal } from '../../src/components/RewardModal';
import { useToast } from '../../src/components/Toast';
import { useScoring } from '../../src/hooks/useScoring';
import { flatSum, freshPlayerState } from '../../src/utils/scoring';
import { ScoringPlayer } from '../../src/store/types';
import * as playerStore from '../../src/store/playerStore';
import * as scoreStore from '../../src/store/scoreStore';

export default function ScoringScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ playerIds: string }>();
  const { showToast } = useToast();
  const [initialized, setInitialized] = useState(false);
  const [scoringPlayers, setScoringPlayers] = useState<ScoringPlayer[]>([]);
  const { state, dispatch } = useScoring(scoringPlayers);
  const hasNavigated = useRef(false);

  useEffect(() => {
    (async () => {
      const ids: string[] = JSON.parse(params.playerIds || '[]');
      const players = await Promise.all(ids.map((id) => playerStore.getPlayerById(id)));
      const sp: ScoringPlayer[] = players
        .filter(Boolean)
        .map((p) => ({
          id: p!.id,
          name: p!.name,
          avatar: p!.avatar,
          state: freshPlayerState(),
        }));
      setScoringPlayers(sp);
      dispatch({ type: 'INIT', players: sp });
      setInitialized(true);
    })();
  }, [params.playerIds]);

  // Save score to DB when reward is shown
  useEffect(() => {
    if (state.showReward && state.rewardPlayer) {
      const rp = state.rewardPlayer;
      scoreStore.addScore({
        playerId: rp.id,
        date: new Date().toISOString(),
        grand: state.rewardGrand,
        score10: state.rewardScore10,
        score15: state.rewardScore15,
        rounds10: rp.state.scores['10m'].map((r) => r.map((v) => v ?? 0)),
        rounds15: rp.state.scores['15m'].map((r) => r.map((v) => v ?? 0)),
      });
    }
  }, [state.showReward]);

  // Navigate home when all done
  useEffect(() => {
    if (state.allDone && !hasNavigated.current) {
      hasNavigated.current = true;
      showToast('Tournament complete!');
      setTimeout(() => {
        router.dismissAll();
        router.replace('/');
      }, 500);
    }
  }, [state.allDone]);

  if (!initialized || state.players.length === 0) return null;

  const activePlayer = state.players[state.activePlayerIdx];
  const ps = activePlayer.state;
  const grand = flatSum(ps.scores['10m']) + flatSum(ps.scores['15m']);
  const t10 = flatSum(ps.scores['10m']);
  const t15 = flatSum(ps.scores['15m']);

  const confirmTitle =
    state.pendingConfirmDist === '10m' ? 'CONFIRM 10 METER' : 'CONFIRM 15 METER';
  const confirmBody =
    state.pendingConfirmDist === '10m'
      ? `${activePlayer.name}'s 10 Meter total is ${t10}. Lock in this score?`
      : `${activePlayer.name}'s 15 Meter total is ${t15}. Lock in this score?`;

  const handleConfirmYes = () => {
    const was10m = state.pendingConfirmDist === '10m';
    dispatch({ type: 'CONFIRM_YES' });
    if (was10m) {
      showToast('10m locked! Now shoot 15 meters.');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Player tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabBar} contentContainerStyle={styles.tabContent}>
        {state.players.map((p, i) => (
          <PlayerTab
            key={p.id}
            avatar={p.avatar}
            name={p.name}
            isActive={i === state.activePlayerIdx}
            isDone={p.state.done}
            onPress={() => dispatch({ type: 'SWITCH_PLAYER', index: i })}
          />
        ))}
      </ScrollView>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
        <GrandTotal score={grand} />

        {/* 10m block */}
        <View style={[styles.distBlock, ps.phase === '15m' && styles.inactiveBlock]}>
          <View style={styles.distHeader}>
            <Text style={styles.distTitle}>⬤ 10 METERS</Text>
            <Text style={styles.distTotal}>
              {ps.confirmed10 ? t10 : t10 > 0 ? t10 : '—'}
            </Text>
          </View>
          <ScoreGrid
            scores={ps.scores['10m']}
            currentRound={ps.phase === '10m' ? ps.round : -1}
            currentShot={ps.phase === '10m' ? ps.shot : -1}
            isActive={ps.phase === '10m'}
            isConfirmed={ps.confirmed10}
          />
        </View>

        {/* 15m block */}
        <View style={[styles.distBlock, ps.phase === '10m' && styles.inactiveBlock]}>
          <View style={styles.distHeader}>
            <Text style={styles.distTitle}>◎ 15 METERS</Text>
            <Text style={styles.distTotal}>
              {ps.confirmed15 ? t15 : t15 > 0 ? t15 : '—'}
            </Text>
          </View>
          <ScoreGrid
            scores={ps.scores['15m']}
            currentRound={ps.phase === '15m' ? ps.round : -1}
            currentShot={ps.phase === '15m' ? ps.shot : -1}
            isActive={ps.phase === '15m'}
            isConfirmed={ps.confirmed15}
          />
        </View>

        <ArcheryTarget
          onScore={(val) => dispatch({ type: 'ADD_SCORE', value: val })}
          disabled={ps.done}
        />
      </ScrollView>

      {/* Confirm modal */}
      <ConfirmModal
        visible={state.showConfirm}
        title={confirmTitle}
        body={confirmBody}
        onConfirm={handleConfirmYes}
        onGoBack={() => dispatch({ type: 'CONFIRM_NO' })}
      />

      {/* Reward modal */}
      <RewardModal
        visible={state.showReward}
        playerName={state.rewardPlayer?.name ?? ''}
        grand={state.rewardGrand}
        score10={state.rewardScore10}
        score15={state.rewardScore15}
        onClose={() => dispatch({ type: 'CLOSE_REWARD' })}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  tabBar: {
    flexGrow: 0,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tabContent: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  body: {
    flex: 1,
  },
  bodyContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  distBlock: {
    marginBottom: 16,
  },
  inactiveBlock: {
    opacity: 0.4,
  },
  distHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  distTitle: {
    fontFamily: FONTS.header,
    fontSize: 16,
    color: COLORS.text,
    letterSpacing: 1.5,
  },
  distTotal: {
    fontFamily: FONTS.header,
    fontSize: 22,
    color: COLORS.gold,
  },
});
