import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { COLORS, FONTS } from '../constants/theme';

interface GrandTotalProps {
  score: number;
}

export function GrandTotal({ score }: GrandTotalProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const prevScore = useRef(score);

  useEffect(() => {
    if (score !== prevScore.current) {
      prevScore.current = score;
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 1.1, duration: 150, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
      ]).start();
    }
  }, [score, scaleAnim]);

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.score, { transform: [{ scale: scaleAnim }] }]}>
        {score}
      </Animated.Text>
      <Text style={styles.label}>GRAND TOTAL</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  score: {
    fontFamily: FONTS.header,
    fontSize: 72,
    color: COLORS.text,
    letterSpacing: 3,
  },
  label: {
    fontFamily: FONTS.header,
    fontSize: 12,
    color: COLORS.muted,
    letterSpacing: 2,
    marginTop: -4,
  },
});
