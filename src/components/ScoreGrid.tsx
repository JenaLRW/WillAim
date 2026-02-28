import React, { useEffect, useRef } from 'react';
import { View, Text, Pressable, StyleSheet, Animated, Easing } from 'react-native';
import { COLORS, FONTS, RADII } from '../constants/theme';
import { ROUNDS, SHOTS } from '../constants/scoring';

interface ScoreGridProps {
  scores: (number | null)[][];
  currentRound: number;
  currentShot: number;
  isActive: boolean;
  isConfirmed: boolean;
  onCellPress?: (round: number, shot: number) => void;
}

function PulsingBox({ children }: { children: React.ReactNode }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 600, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
        Animated.timing(anim, { toValue: 0, duration: 600, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [anim]);

  const borderColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.blue, 'rgba(96,165,250,0.3)'],
  });

  return (
    <Animated.View style={[styles.box, styles.currentBox, { borderColor }]}>
      {children}
    </Animated.View>
  );
}

export function ScoreGrid({ scores, currentRound, currentShot, isActive, isConfirmed, onCellPress }: ScoreGridProps) {
  return (
    <View style={[styles.container, !isActive && styles.inactive]}>
      {Array.from({ length: ROUNDS }, (_, r) => {
        let rowSum = 0;
        let rowFilled = 0;
        scores[r]?.forEach((v) => {
          if (v !== null) {
            rowSum += v;
            rowFilled++;
          }
        });

        return (
          <View key={r} style={styles.row}>
            {Array.from({ length: SHOTS }, (_, s) => {
              const val = scores[r]?.[s];
              const isCurrent = isActive && !isConfirmed && r === currentRound && s === currentShot;
              const isFilled = val !== null;

              if (isCurrent) {
                return (
                  <PulsingBox key={s}>
                    <Text style={styles.boxText} />
                  </PulsingBox>
                );
              }

              if (isFilled && isActive && !isConfirmed && onCellPress) {
                return (
                  <Pressable key={s} onPress={() => onCellPress(r, s)}>
                    <View style={[styles.box, styles.filledBox]}>
                      <Text style={[styles.boxText, styles.filledText]}>
                        {val === 0 ? 'M' : val}
                      </Text>
                    </View>
                  </Pressable>
                );
              }

              return (
                <View key={s} style={[styles.box, isFilled && styles.filledBox]}>
                  <Text style={[styles.boxText, isFilled && styles.filledText]}>
                    {isFilled ? (val === 0 ? 'M' : val) : ''}
                  </Text>
                </View>
              );
            })}
            <View style={[styles.box, styles.totalBox, rowFilled === SHOTS && styles.filledTotal, { marginLeft: 50 }]}>
              <Text style={[styles.totalText, rowFilled === SHOTS && styles.filledTotalText]}>
                {rowFilled === SHOTS ? rowSum : ''}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  inactive: {
    opacity: 0.4,
  },
  row: {
    flexDirection: 'row',
    gap: 6,
  },
  box: {
    width: 42,
    height: 42,
    borderRadius: RADII.sm,
    backgroundColor: COLORS.surface2,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentBox: {
    borderWidth: 2,
    borderColor: COLORS.blue,
  },
  filledBox: {
    borderColor: COLORS.gold,
    backgroundColor: 'rgba(240,180,41,0.12)',
  },
  boxText: {
    fontFamily: FONTS.header,
    fontSize: 19,
    color: COLORS.muted,
  },
  filledText: {
    color: COLORS.gold,
  },
  totalBox: {
    backgroundColor: 'transparent',
    borderStyle: 'dashed',
  },
  filledTotal: {
    backgroundColor: 'rgba(240,180,41,0.12)',
    borderColor: COLORS.gold,
    borderStyle: 'solid',
  },
  totalText: {
    fontFamily: FONTS.header,
    fontSize: 17,
    color: COLORS.muted,
  },
  filledTotalText: {
    color: COLORS.gold,
  },
});
