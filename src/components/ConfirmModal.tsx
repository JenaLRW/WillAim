import React from 'react';
import { View, Text, Pressable, StyleSheet, Modal } from 'react-native';
import { COLORS, FONTS, RADII } from '../constants/theme';

interface ConfirmModalProps {
  visible: boolean;
  title: string;
  body: string;
  onConfirm: () => void;
  onGoBack: () => void;
}

export function ConfirmModal({ visible, title, body, onConfirm, onGoBack }: ConfirmModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View style={styles.overlay}>
        <View style={styles.box}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.body}>{body}</Text>
          <View style={styles.buttons}>
            <Pressable
              onPress={onGoBack}
              style={({ pressed }) => [styles.btn, styles.btnNo, pressed && styles.pressed]}
            >
              <Text style={styles.btnNoText}>← GO BACK</Text>
            </Pressable>
            <Pressable
              onPress={onConfirm}
              style={({ pressed }) => [styles.btn, styles.btnYes, pressed && styles.pressed]}
            >
              <Text style={styles.btnYesText}>CONFIRM ✓</Text>
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
  btnNo: {
    backgroundColor: COLORS.surface2,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  btnYes: {
    backgroundColor: COLORS.gold,
  },
  btnNoText: {
    fontFamily: FONTS.header,
    fontSize: 18,
    letterSpacing: 1,
    color: COLORS.text,
  },
  btnYesText: {
    fontFamily: FONTS.header,
    fontSize: 18,
    letterSpacing: 1,
    color: '#000',
  },
});
