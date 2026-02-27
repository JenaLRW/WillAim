import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { COLORS, FONTS, RADII } from '../constants/theme';
import { AvatarCircle } from './AvatarCircle';

interface SelectPlayerCardProps {
  avatar: string;
  name: string;
  subtitle: string;
  selected: boolean;
  onToggle: () => void;
}

export function SelectPlayerCard({ avatar, name, subtitle, selected, onToggle }: SelectPlayerCardProps) {
  return (
    <Pressable onPress={onToggle} style={[styles.card, selected && styles.selected]}>
      <AvatarCircle emoji={avatar} size="sm" />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{name}</Text>
        <Text style={styles.meta} numberOfLines={1}>{subtitle}</Text>
      </View>
      <View style={[styles.check, selected && styles.checkSelected]}>
        {selected && <Text style={styles.checkMark}>✓</Text>}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: RADII.default,
    padding: 14,
    gap: 14,
  },
  selected: {
    borderColor: COLORS.gold,
    backgroundColor: 'rgba(240,180,41,0.08)',
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
  check: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkSelected: {
    borderColor: COLORS.gold,
    backgroundColor: COLORS.gold,
  },
  checkMark: {
    color: '#000',
    fontSize: 16,
    fontWeight: '700',
  },
});
