import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { COLORS, RADII } from '../constants/theme';
import { AVATARS } from '../constants/scoring';

interface AvatarPickerProps {
  selected: string;
  onSelect: (emoji: string) => void;
}

export function AvatarPicker({ selected, onSelect }: AvatarPickerProps) {
  return (
    <View style={styles.grid}>
      {AVATARS.map((a) => (
        <Pressable
          key={a}
          onPress={() => onSelect(a)}
          style={[styles.cell, a === selected && styles.selected]}
        >
          <Text style={styles.emoji}>{a}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  cell: {
    width: 52,
    height: 52,
    borderRadius: RADII.default,
    backgroundColor: COLORS.surface2,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selected: {
    borderColor: COLORS.gold,
    backgroundColor: 'rgba(240,180,41,0.15)',
  },
  emoji: {
    fontSize: 26,
  },
});
