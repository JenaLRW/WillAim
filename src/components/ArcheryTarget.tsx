import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Path, G, Text as SvgText } from 'react-native-svg';
import { RINGS } from '../constants/scoring';

interface ArcheryTargetProps {
  onScore: (value: number) => void;
  disabled?: boolean;
}

const RING_COLORS = [
  '#e8e8e8', // 1 - white
  '#e8e8e8', // 2 - white
  '#4fc3f7', // 3 - blue
  '#4fc3f7', // 4 - blue
  '#e53935', // 5 - red
  '#e53935', // 6 - red
  '#ffd600', // 7 - gold
  '#ffd600', // 8 - gold
  '#ffd600', // 9 - gold
  '#ffd600', // 10 - gold (bullseye)
];

function ringPath(cx: number, cy: number, r1: number, r2: number): string {
  const arc = (r: number) =>
    `M ${cx + r} ${cy} A ${r} ${r} 0 1 0 ${cx + r - 0.001} ${cy} Z`;
  return `${arc(r1)} ${arc(r2)}`;
}

export function ArcheryTarget({ onScore, disabled }: ArcheryTargetProps) {
  const handlePress = (val: number) => {
    if (!disabled) onScore(val);
  };

  return (
    <View style={styles.container}>
      <Svg viewBox="0 0 100 100" style={styles.svg}>
        {/* Background colored rings (outermost first) */}
        {RINGS.map((ring, i) =>
          ring.inner === 0 ? (
            <Circle
              key={`bg-${i}`}
              cx="50"
              cy="50"
              r={ring.outer}
              fill={RING_COLORS[i]}
            />
          ) : (
            <Path
              key={`bg-${i}`}
              d={ringPath(50, 50, ring.outer, ring.inner)}
              fill={RING_COLORS[i]}
              fillRule="evenodd"
            />
          ),
        )}

        {/* Ring borders */}
        {RINGS.map((ring, i) => (
          <Circle
            key={`border-${i}`}
            cx="50"
            cy="50"
            r={ring.outer}
            fill="none"
            stroke="rgba(0,0,0,0.25)"
            strokeWidth="0.3"
          />
        ))}

        {/* Pressable zones with labels */}
        {RINGS.map((ring, i) => {
          const ang = -45 * (Math.PI / 180);
          const mr = ring.inner === 0 ? ring.outer / 2 : (ring.inner + ring.outer) / 2;
          const lx = 50 + mr * Math.cos(ang);
          const ly = 50 + mr * Math.sin(ang);
          const fs = ring.val >= 9 ? 3.2 : ring.val >= 7 ? 3.8 : 4.2;

          return (
            <G key={`zone-${i}`} onPress={() => handlePress(ring.val)}>
              {ring.inner === 0 ? (
                <Circle cx="50" cy="50" r={ring.outer} fill="transparent" />
              ) : (
                <Path
                  d={ringPath(50, 50, ring.outer, ring.inner)}
                  fill="transparent"
                  fillRule="evenodd"
                />
              )}
              <SvgText
                x={lx + 0.25}
                y={ly + 0.35}
                textAnchor="middle"
                alignmentBaseline="middle"
                fill="rgba(0,0,0,0.7)"
                fontSize={fs}
                fontFamily="Bebas Neue, sans-serif"
                fontWeight="700"
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
              >
                {ring.val}
              </SvgText>
            </G>
          );
        })}

        {/* Miss button */}
        <G onPress={() => handlePress(0)}>
          <Circle cx="50" cy="91" r="4.5" fill="rgba(0,0,0,0.6)" stroke="rgba(255,255,255,0.6)" strokeWidth="0.5" />
          <SvgText
            x="50"
            y="91.4"
            textAnchor="middle"
            alignmentBaseline="middle"
            fill="white"
            fontSize="3.5"
            fontFamily="Bebas Neue, sans-serif"
            fontWeight="700"
          >
            M
          </SvgText>
        </G>
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
  svg: {
    width: '85%',
    aspectRatio: 1,
  },
});
