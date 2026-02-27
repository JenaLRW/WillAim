import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { COLORS, FONTS, RADII } from '../constants/theme';
import { AvatarCircle } from './AvatarCircle';

interface PlayerCardProps {
  avatar: string;
  name: string;
  subtitle: string;
  score?: number | string | null;
  onPress: () => void;
}

export function PlayerCard({ avatar, name, subtitle, score, onPress }: PlayerCardProps) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <AvatarCircle emoji={avatar} size="sm" />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{name}</Text>
        <Text style={styles.meta} numberOfLines={1}>{subtitle}</Text>
      </View>
      {score != null && (
        <Text style={styles.score}>{score}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADII.default,
    padding: 14,
    gap: 14,
  },
  pressed: {
    backgroundColor: COLORS.surface2,
    borderColor: COLORS.gold,
  },
  info: {
    flex: 1,
  },
  name: {
    fontFamily: FONTS.bodySemiBold,
    fontSize: 15,
    color: COLORS.text,
  },
  meta: {
    fontFamily: FONTS.body,
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 2,
  },
  score: {
    fontFamily: FONTS.header,
    fontSize: 22,
    color: COLORS.gold,
  },
});
