import React, { useState } from 'react';
import { View, Pressable, StyleSheet, GestureResponderEvent } from 'react-native';
import Svg, { Circle, Path, Rect, Text as SvgText } from 'react-native-svg';
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

const LABEL_COLORS = [
  '#333',  // 1 - dark on white
  '#333',  // 2 - dark on white
  '#fff',  // 3 - white on black
  '#fff',  // 4 - white on black
  '#fff',  // 5 - white on blue
  '#fff',  // 6 - white on blue
  '#fff',  // 7 - white on red
  '#fff',  // 8 - white on red
  '#333',  // 9 - dark on gold
  '#333',  // 10 - dark on gold
];

// Quarter-circle origin at bottom-right corner of the viewBox
const CX = 100;
const CY = 100;
// Scale so outermost ring (radius 57) maps to full viewBox width (100)
const S = 100 / 57;
const BULL_R = 5.7 * S; // ~10

// ViewBox parameters
const VB_X = 24;
const VB_Y = 24;
const VB_W = 76;
const VB_H = 80;

// Miss button bounds (bottom-left of viewBox)
const MISS_X = 27;
const MISS_Y = 93;
const MISS_W = 22;
const MISS_H = 9;

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
  const [size, setSize] = useState(0);

  const handleTouch = (e: GestureResponderEvent) => {
    if (disabled || size === 0) return;
    const { locationX, locationY } = e.nativeEvent;

    // Convert view coordinates to SVG coordinates
    // preserveAspectRatio="xMidYMid meet": height (80) constrains in a square view
    const s = size / VB_H;
    const renderedW = VB_W * s;
    const offsetX = (size - renderedW) / 2;

    const svgX = VB_X + ((locationX - offsetX) / renderedW) * VB_W;
    const svgY = VB_Y + (locationY / size) * VB_H;

    // Check Miss button first
    if (svgX >= MISS_X && svgX <= MISS_X + MISS_W &&
        svgY >= MISS_Y && svgY <= MISS_Y + MISS_H) {
      onScore(0);
      return;
    }

    // Distance from center
    const dx = CX - svgX;
    const dy = CY - svgY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Ring 10 is a full circle — accept taps from any direction
    if (dist <= BULL_R) {
      onScore(10);
      return;
    }

    // Other rings — must be in the quarter-circle area (top-left from center)
    if (svgX > CX || svgY > CY) return;

    for (const ring of RINGS) {
      if (ring.inner === 0) continue;
      const so = scaled(ring.outer);
      const si = scaled(ring.inner);
      if (dist <= so && dist >= si) {
        onScore(ring.val);
        return;
      }
    }
  };

  return (
    <View style={[styles.container, disabled && styles.disabled]}>
      <View
        style={styles.targetWrap}
        onLayout={(e) => setSize(e.nativeEvent.layout.width)}
      >
        <Svg viewBox={`${VB_X} ${VB_Y} ${VB_W} ${VB_H}`} style={StyleSheet.absoluteFill}>
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
          {/* Ring labels along 45° diagonal */}
          {RINGS.map((ring, i) => {
            const mr = scaled((ring.inner + ring.outer) / 2);
            const d = mr * Math.SQRT1_2; // cos(45°) = sin(45°) = 1/√2
            const lx = CX - d;
            const ly = CY - d;
            const fs = 5;

            return (
              <SvgText
                key={`label-${i}`}
                x={lx}
                y={ly}
                textAnchor="middle"
                alignmentBaseline="central"
                fill={LABEL_COLORS[i]}
                fontSize={fs}
                fontFamily="Bebas Neue, sans-serif"
                fontWeight="700"
                pointerEvents="none"
              >
                {ring.val}
              </SvgText>
            );
          })}
          {/* Miss button */}
          <Rect
            x={MISS_X}
            y={MISS_Y}
            width={MISS_W}
            height={MISS_H}
            rx={3}
            fill="rgba(0,0,0,0.6)"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="0.4"
          />
          <SvgText
            x={MISS_X + MISS_W / 2}
            y={MISS_Y + MISS_H / 2}
            textAnchor="middle"
            alignmentBaseline="central"
            fill="white"
            fontSize="5"
            fontFamily="Bebas Neue, sans-serif"
            fontWeight="700"
            pointerEvents="none"
          >
            MISS
          </SvgText>
        </Svg>
        <Pressable style={StyleSheet.absoluteFill} onPressIn={handleTouch} />
      </View>
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
  targetWrap: {
    width: '98%',
    aspectRatio: 1,
  },
});
