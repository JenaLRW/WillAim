import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Path, G } from 'react-native-svg';
import { RINGS } from '../constants/scoring';

interface ArcheryTargetProps {
  onScore: (value: number) => void;
  disabled?: boolean;
}

const RING_COLORS = [
  '#e8e8e8', // 1 - white
  '#e8e8e8', // 2 - white
  '#000000', // 3 - black
  '#000000', // 4 - black
  '#4fc3f7', // 5 - blue
  '#4fc3f7', // 6 - blue
  '#e53935', // 7 - red
  '#e53935', // 8 - red
  '#ffd600', // 9 - gold
  '#ffd600', // 10 - gold (bullseye)
];

// Quarter-circle origin at bottom-right corner of the viewBox
const CX = 100;
const CY = 100;
// Scale so outermost ring (radius 57) maps to full viewBox width (100)
const S = 100 / 57;
const BULL_R = 5.7 * S; // ~10

function scaled(r: number): number {
  return r * S;
}

function quarterArc(r: number): string {
  const sr = scaled(r);
  return `M ${CX} ${CY - sr} A ${sr} ${sr} 0 0 0 ${CX - sr} ${CY}`;
}

function quarterRingPath(r1: number, r2: number): string {
  const sr1 = scaled(r1);
  const sr2 = scaled(r2);
  return [
    `M ${CX} ${CY - sr1}`,
    `A ${sr1} ${sr1} 0 0 0 ${CX - sr1} ${CY}`,
    `L ${CX - sr2} ${CY}`,
    `A ${sr2} ${sr2} 0 0 1 ${CX} ${CY - sr2}`,
    'Z',
  ].join(' ');
}


export function ArcheryTarget({ onScore, disabled }: ArcheryTargetProps) {
  const handlePress = (val: number) => {
    if (!disabled) onScore(val);
  };

  return (
    <View style={[styles.container, disabled && styles.disabled]}>
      <Svg viewBox="24 24 76 80" style={styles.svg}>
        {/* Background colored rings (outermost first) */}
        {RINGS.map((ring, i) =>
          ring.inner === 0 ? (
            <Circle
              key={`bg-${i}`}
              cx={CX}
              cy={CY}
              r={BULL_R}
              fill={RING_COLORS[i]}
            />
          ) : (
            <Path
              key={`bg-${i}`}
              d={quarterRingPath(ring.outer, ring.inner)}
              fill={RING_COLORS[i]}
            />
          ),
        )}

        {/* Ring borders */}
        {RINGS.map((ring, i) =>
          ring.inner === 0 ? (
            <Circle
              key={`border-${i}`}
              cx={CX}
              cy={CY}
              r={BULL_R}
              fill="none"
              stroke="rgba(0,0,0,0.25)"
              strokeWidth="0.3"
            />
          ) : (
            <Path
              key={`border-${i}`}
              d={quarterArc(ring.outer)}
              fill="none"
              stroke={ring.val === 4 ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.25)'}
              strokeWidth="0.3"
            />
          ),
        )}

        {/* Pressable zones */}
        {RINGS.map((ring, i) => (
          <G key={`zone-${i}`}>
            {ring.inner === 0 ? (
              <Circle
                cx={CX}
                cy={CY}
                r={BULL_R}
                fill="rgba(0,0,0,0.01)"
                onPress={() => handlePress(ring.val)}
              />
            ) : (
              <Path
                d={quarterRingPath(ring.outer, ring.inner)}
                fill="rgba(0,0,0,0.01)"
                onPress={() => handlePress(ring.val)}
              />
            )}
          </G>
        ))}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  disabled: {
    opacity: 0.4,
  },
  svg: {
    width: '95%',
    aspectRatio: 1,
  },
});
