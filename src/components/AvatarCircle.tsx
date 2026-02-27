import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const SIZES = {
  sm: { size: 44, fontSize: 20 },
  md: { size: 52, fontSize: 24 },
  lg: { size: 64, fontSize: 32 },
};

interface AvatarCircleProps {
  emoji: string;
  size?: 'sm' | 'md' | 'lg';
}

export function AvatarCircle({ emoji, size = 'sm' }: AvatarCircleProps) {
  const { size: dim, fontSize } = SIZES[size];
  return (
    <LinearGradient
      colors={['#f0b429', '#d4860a']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.circle, { width: dim, height: dim, borderRadius: dim / 2 }]}
    >
      <Text style={{ fontSize }}>{emoji}</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
