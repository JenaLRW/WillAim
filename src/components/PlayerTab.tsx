import React from 'react';
import { Text, Pressable, StyleSheet } from 'react-native';
import { COLORS, FONTS, RADII } from '../constants/theme';

interface PlayerTabProps {
  avatar: string;
  name: string;
  isActive: boolean;
  isDone: boolean;
  onPress: () => void;
}

export function PlayerTab({ avatar, name, isActive, isDone, onPress }: PlayerTabProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.tab, isDone && styles.done, isActive && (isDone ? styles.activeDone : styles.active)]}
    >
      <Text style={[styles.text, isDone && styles.doneText, isActive && (isDone ? styles.activeDoneText : styles.activeText)]}>
        {avatar} {name.split(' ')[0]}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: RADII.lg,
    backgroundColor: COLORS.surface2,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    marginRight: 8,
  },
  active: {
    backgroundColor: COLORS.gold,
    borderColor: COLORS.gold,
  },
  done: {
    borderColor: COLORS.green,
    backgroundColor: 'rgba(34,197,94,0.1)',
  },
  activeDone: {
    borderColor: COLORS.green,
    backgroundColor: COLORS.green,
  },
  text: {
    fontFamily: FONTS.bodySemiBold,
    fontSize: 14,
    color: COLORS.text,
  },
  activeText: {
    color: '#000',
  },
  doneText: {
    color: COLORS.green,
  },
  activeDoneText: {
    color: '#000',
  },
});
