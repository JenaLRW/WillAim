import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { COLORS, FONTS, RADII } from '../constants/theme';

interface TopBarProps {
  title: string;
  onBack?: () => void;
  rightAction?: { label: string; onPress: () => void };
  rightLabel?: string;
}

export function TopBar({ title, onBack, rightAction, rightLabel }: TopBarProps) {
  return (
    <View style={styles.container}>
      {onBack ? (
        <Pressable onPress={onBack} style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}>
          <Text style={styles.backText}>←</Text>
        </Pressable>
      ) : (
        <View style={{ width: 12 }} />
      )}
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      {rightAction ? (
        <Pressable
          onPress={rightAction.onPress}
          style={({ pressed }) => [styles.actionBtn, pressed && styles.pressed]}
        >
          <Text style={styles.actionText}>{rightAction.label}</Text>
        </Pressable>
      ) : rightLabel ? (
        <Text style={styles.rightLabel}>{rightLabel}</Text>
      ) : (
        <View style={{ width: 12 }} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: RADII.round,
    backgroundColor: COLORS.surface2,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    color: COLORS.text,
    fontSize: 18,
  },
  pressed: {
    transform: [{ scale: 0.95 }],
    opacity: 0.8,
  },
  title: {
    flex: 1,
    fontFamily: FONTS.header,
    fontSize: 22,
    letterSpacing: 1.5,
    color: COLORS.text,
  },
  actionBtn: {
    backgroundColor: COLORS.gold,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: RADII.lg,
  },
  actionText: {
    fontFamily: FONTS.bodySemiBold,
    fontSize: 13,
    color: '#000',
  },
  rightLabel: {
    fontFamily: FONTS.bodySemiBold,
    fontSize: 14,
    color: COLORS.muted,
  },
});
