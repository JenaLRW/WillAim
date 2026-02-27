import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { COLORS, FONTS, RADII } from '../constants/theme';
import { Score } from '../store/types';
import { formatDate } from '../utils/formatDate';

interface HistoryCardProps {
  score: Score;
  onDelete: (id: string) => void;
}

export function HistoryCard({ score, onDelete }: HistoryCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.date}>{formatDate(score.date)}</Text>
        <Text style={styles.total}>{score.grand}</Text>
      </View>
      <View style={styles.breakdown}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>10m: {score.score10}</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>15m: {score.score15}</Text>
        </View>
      </View>
      <View style={styles.actions}>
        <Pressable onPress={() => onDelete(score.id)} style={({ pressed }) => [styles.deleteBtn, pressed && { opacity: 0.7 }]}>
          <Text style={styles.deleteText}>🗑 Delete</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADII.default,
    padding: 14,
    gap: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontFamily: FONTS.body,
    fontSize: 13,
    color: COLORS.muted,
  },
  total: {
    fontFamily: FONTS.header,
    fontSize: 26,
    color: COLORS.gold,
  },
  breakdown: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    backgroundColor: COLORS.surface2,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADII.sm,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  badgeText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 12,
    color: COLORS.muted,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  deleteBtn: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: COLORS.surface2,
    borderWidth: 1,
    borderColor: COLORS.red,
    borderRadius: RADII.sm,
  },
  deleteText: {
    fontFamily: FONTS.body,
    fontSize: 12,
    color: COLORS.red,
  },
});
