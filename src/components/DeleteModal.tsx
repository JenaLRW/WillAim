import React from 'react';
import { View, Text, Pressable, StyleSheet, Modal } from 'react-native';
import { COLORS, FONTS, RADII } from '../constants/theme';

interface DeleteModalProps {
  visible: boolean;
  onDelete: () => void;
  onCancel: () => void;
}

export function DeleteModal({ visible, onDelete, onCancel }: DeleteModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={styles.box}>
          <Text style={styles.title}>DELETE SCORE?</Text>
          <Text style={styles.body}>
            This will permanently remove this tournament score. This cannot be undone.
          </Text>
          <View style={styles.buttons}>
            <Pressable
              onPress={onCancel}
              style={({ pressed }) => [styles.btn, styles.btnCancel, pressed && styles.pressed]}
            >
              <Text style={styles.cancelText}>CANCEL</Text>
            </Pressable>
            <Pressable
              onPress={onDelete}
              style={({ pressed }) => [styles.btn, styles.btnDelete, pressed && styles.pressed]}
            >
              <Text style={styles.deleteText}>DELETE</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  box: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADII.lg,
    padding: 28,
    width: '100%',
    maxWidth: 360,
  },
  title: {
    fontFamily: FONTS.header,
    fontSize: 24,
    letterSpacing: 1.5,
    color: COLORS.gold,
    marginBottom: 8,
  },
  body: {
    fontFamily: FONTS.body,
    fontSize: 14,
    color: COLORS.muted,
    lineHeight: 22,
    marginBottom: 22,
  },
  buttons: {
    flexDirection: 'row',
    gap: 10,
  },
  btn: {
    flex: 1,
    padding: 13,
    borderRadius: 12,
    alignItems: 'center',
  },
  pressed: {
    transform: [{ scale: 0.96 }],
  },
  btnCancel: {
    backgroundColor: COLORS.surface2,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  btnDelete: {
    backgroundColor: COLORS.red,
  },
  cancelText: {
    fontFamily: FONTS.header,
    fontSize: 18,
    letterSpacing: 1,
    color: COLORS.text,
  },
  deleteText: {
    fontFamily: FONTS.header,
    fontSize: 18,
    letterSpacing: 1,
    color: '#fff',
  },
});
