import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle } from 'react-native';
import { COLORS, FONTS, RADII } from '../constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  fullWidth?: boolean;
  style?: ViewStyle;
}

export function Button({ title, onPress, variant = 'primary', fullWidth, style }: ButtonProps) {
  const isPrimary = variant === 'primary';
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        isPrimary ? styles.primary : styles.secondary,
        fullWidth && styles.fullWidth,
        pressed && styles.pressed,
        style,
      ]}
    >
      <Text style={[styles.text, isPrimary ? styles.primaryText : styles.secondaryText]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: RADII.default,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: COLORS.gold,
  },
  secondary: {
    backgroundColor: COLORS.surface2,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  fullWidth: {
    width: '100%',
  },
  pressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.9,
  },
  text: {
    fontFamily: FONTS.header,
    fontSize: 20,
    letterSpacing: 1.5,
  },
  primaryText: {
    color: '#000',
  },
  secondaryText: {
    color: COLORS.text,
  },
});
