import React, { useEffect, useRef } from 'react';
import { View, Text, Pressable, StyleSheet, Modal, Animated } from 'react-native';
import { COLORS, FONTS, RADII } from '../constants/theme';
import { Confetti } from './Confetti';

interface RewardModalProps {
  visible: boolean;
  playerName: string;
  grand: number;
  score10: number;
  score15: number;
  onClose: () => void;
}

export function RewardModal({ visible, playerName, grand, score10, score15, onClose }: RewardModalProps) {
  const trophyScale = useRef(new Animated.Value(0)).current;
  const scoreScale = useRef(new Animated.Value(0.2)).current;
  const scoreOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      trophyScale.stopAnimation();
      scoreScale.stopAnimation();
      scoreOpacity.stopAnimation();
      trophyScale.setValue(0);
      scoreScale.setValue(0.2);
      scoreOpacity.setValue(0);

      Animated.sequence([
        Animated.delay(300),
        Animated.spring(trophyScale, { toValue: 1, friction: 4, tension: 60, useNativeDriver: true }),
      ]).start();

      Animated.sequence([
        Animated.delay(500),
        Animated.parallel([
          Animated.spring(scoreScale, { toValue: 1, friction: 5, tension: 80, useNativeDriver: true }),
          Animated.timing(scoreOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        ]),
      ]).start();
    }
  }, [visible, trophyScale, scoreScale, scoreOpacity]);

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Confetti active={visible} />
        <View style={styles.box}>
          <Animated.Text style={[styles.trophy, { transform: [{ scale: trophyScale }] }]}>
            🏆
          </Animated.Text>
          <Text style={styles.playerName}>{playerName}</Text>
          <Text style={styles.finalLabel}>FINAL SCORE</Text>
          <Animated.Text
            style={[styles.grand, { transform: [{ scale: scoreScale }], opacity: scoreOpacity }]}
          >
            {grand}
          </Animated.Text>
          <View style={styles.breakdown}>
            <View style={styles.brkItem}>
              <Text style={styles.brkVal}>{score10}</Text>
              <Text style={styles.brkLabel}>10 METERS</Text>
            </View>
            <Text style={styles.separator}>|</Text>
            <View style={styles.brkItem}>
              <Text style={styles.brkVal}>{score15}</Text>
              <Text style={styles.brkLabel}>15 METERS</Text>
            </View>
          </View>
          <Pressable onPress={onClose} style={({ pressed }) => [styles.closeBtn, pressed && { opacity: 0.7 }]}>
            <Text style={styles.closeText}>✕</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  box: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.green,
    borderRadius: RADII.lg,
    padding: 28,
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
  },
  trophy: {
    fontSize: 52,
    marginBottom: 8,
  },
  playerName: {
    fontFamily: FONTS.body,
    fontSize: 13,
    color: COLORS.muted,
    marginBottom: 4,
  },
  finalLabel: {
    fontFamily: FONTS.header,
    fontSize: 12,
    color: COLORS.muted,
    letterSpacing: 2,
    marginBottom: 4,
  },
  grand: {
    fontFamily: FONTS.header,
    fontSize: 96,
    color: COLORS.gold,
    textShadowColor: 'rgba(240,180,41,0.4)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 30,
    marginBottom: 12,
  },
  breakdown: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
  },
  brkItem: {
    alignItems: 'center',
  },
  brkVal: {
    fontFamily: FONTS.header,
    fontSize: 28,
    color: COLORS.text,
  },
  brkLabel: {
    fontFamily: FONTS.header,
    fontSize: 10,
    color: COLORS.muted,
    letterSpacing: 1.5,
  },
  separator: {
    color: COLORS.border,
    fontSize: 24,
  },
  closeBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.surface2,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    color: COLORS.text,
    fontSize: 18,
  },
});
