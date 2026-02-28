import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, G, Text as SvgText } from 'react-native-svg';
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

function quarterCirclePath(r: number): string {
  const sr = scaled(r);
  return [
    `M ${CX} ${CY}`,
    `L ${CX} ${CY - sr}`,
    `A ${sr} ${sr} 0 0 0 ${CX - sr} ${CY}`,
    'Z',
  ].join(' ');
}

export function ArcheryTarget({ onScore, disabled }: ArcheryTargetProps) {
  const handlePress = (val: number) => {
    if (!disabled) onScore(val);
  };

  return (
    <View style={[styles.container, disabled && styles.disabled]}>
      <Svg viewBox="0 0 100 100" style={styles.svg}>
        {/* Background colored rings (outermost first) */}
        {RINGS.map((ring, i) => (
          <Path
            key={`bg-${i}`}
            d={ring.inner === 0 ? quarterCirclePath(ring.outer) : quarterRingPath(ring.outer, ring.inner)}
            fill={RING_COLORS[i]}
          />
        ))}

        {/* Ring borders */}
        {RINGS.map((ring, i) => (
          <Path
            key={`border-${i}`}
            d={quarterArc(ring.outer)}
            fill="none"
            stroke="rgba(0,0,0,0.25)"
            strokeWidth="0.3"
          />
        ))}

        {/* Pressable zones with labels */}
        {RINGS.map((ring, i) => {
          const ang = -45 * (Math.PI / 180);
          const mr = ring.inner === 0 ? ring.outer / 2 : (ring.inner + ring.outer) / 2;
          const lx = CX + scaled(mr) * Math.cos(ang);
          const ly = CY + scaled(mr) * Math.sin(ang);
          const fs = ring.val >= 9 ? 4.5 : ring.val >= 7 ? 5.5 : 6;

          return (
            <G key={`zone-${i}`}>
              <Path
                d={ring.inner === 0 ? quarterCirclePath(ring.outer) : quarterRingPath(ring.outer, ring.inner)}
                fill="transparent"
                onPress={() => handlePress(ring.val)}
              />
              <SvgText
                x={lx + 0.3}
                y={ly + 0.4}
                textAnchor="middle"
                alignmentBaseline="middle"
                fill="rgba(0,0,0,0.7)"
                fontSize={fs}
                fontFamily="Bebas Neue, sans-serif"
                fontWeight="700"
                pointerEvents="none"
              >
                {ring.val}
              </SvgText>
              <SvgText
                x={lx}
                y={ly}
                textAnchor="middle"
                alignmentBaseline="middle"
                fill="white"
                fontSize={fs}
                fontFamily="Bebas Neue, sans-serif"
                fontWeight="700"
                pointerEvents="none"
              >
                {ring.val}
              </SvgText>
            </G>
          );
        })}

        {/* Miss button — bottom-left corner */}
        <Path
          d="M 4 96 L 4 86 A 10 10 0 0 1 14 96 Z"
          fill="rgba(0,0,0,0.6)"
          stroke="rgba(255,255,255,0.6)"
          strokeWidth="0.5"
          onPress={() => handlePress(0)}
        />
        <SvgText
          x="7.5"
          y="93"
          textAnchor="middle"
          alignmentBaseline="middle"
          fill="white"
          fontSize="5"
          fontFamily="Bebas Neue, sans-serif"
          fontWeight="700"
          pointerEvents="none"
        >
          M
        </SvgText>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  disabled: {
    opacity: 0.4,
  },
  svg: {
    width: '85%',
    aspectRatio: 1,
  },
});
