import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, Modal } from 'react-native';
import { COLORS, FONTS, RADII } from '../constants/theme';
import { AvatarPicker } from './AvatarPicker';

interface SettingsModalProps {
  visible: boolean;
  currentAvatar: string;
  onSave: (avatar: string) => void;
  onClose: () => void;
}

export function SettingsModal({ visible, currentAvatar, onSave, onClose }: SettingsModalProps) {
  const [avatar, setAvatar] = useState(currentAvatar);

  useEffect(() => {
    if (visible) setAvatar(currentAvatar);
  }, [visible, currentAvatar]);

  const hasChanges = avatar !== currentAvatar;

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.box}>
          <Text style={styles.title}>SETTINGS</Text>
          <Text style={styles.label}>AVATAR</Text>
          <AvatarPicker selected={avatar} onSelect={setAvatar} />
          <View style={styles.buttons}>
            <Pressable
              onPress={onClose}
              style={({ pressed }) => [styles.btn, styles.btnCancel, pressed && styles.pressed]}
            >
              <Text style={styles.cancelText}>CANCEL</Text>
            </Pressable>
            <Pressable
              onPress={() => onSave(avatar)}
              style={({ pressed }) => [styles.btn, styles.btnSave, !hasChanges && styles.btnDisabled, pressed && styles.pressed]}
              disabled={!hasChanges}
            >
              <Text style={[styles.saveText, !hasChanges && styles.saveTextDisabled]}>SAVE</Text>
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
    marginBottom: 16,
  },
  label: {
    fontFamily: FONTS.header,
    fontSize: 13,
    letterSpacing: 2,
    color: COLORS.muted,
    marginBottom: 10,
  },
  buttons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 22,
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
  btnSave: {
    backgroundColor: COLORS.gold,
  },
  btnDisabled: {
    opacity: 0.4,
  },
  cancelText: {
    fontFamily: FONTS.header,
    fontSize: 18,
    letterSpacing: 1,
    color: COLORS.text,
  },
  saveText: {
    fontFamily: FONTS.header,
    fontSize: 18,
    letterSpacing: 1,
    color: '#000',
  },
  saveTextDisabled: {
    color: 'rgba(0,0,0,0.4)',
  },
});
