import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, RADII } from '../../src/constants/theme';
import { GRADES } from '../../src/constants/scoring';
import { TopBar } from '../../src/components/TopBar';
import { Button } from '../../src/components/Button';
import { AvatarPicker } from '../../src/components/AvatarPicker';
import { useToast } from '../../src/components/Toast';
import * as playerStore from '../../src/store/playerStore';
import { Pressable } from 'react-native';

export default function AddPlayerScreen() {
  const router = useRouter();
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('');
  const [avatar, setAvatar] = useState('🏹');
  const [showGrades, setShowGrades] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      showToast('Please enter a name');
      return;
    }
    await playerStore.addPlayer({ name: name.trim(), grade, avatar });
    showToast('Player created!');
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <TopBar title="NEW PLAYER" onBack={() => router.back()} />
      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
        <View style={styles.field}>
          <Text style={styles.label}>FULL NAME</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Alex Johnson"
            placeholderTextColor={COLORS.muted}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>GRADE / DIVISION</Text>
          <Pressable style={styles.input} onPress={() => setShowGrades(!showGrades)}>
            <Text style={[styles.inputText, !grade && { color: COLORS.muted }]}>
              {grade || 'Select grade'}
            </Text>
          </Pressable>
          {showGrades && (
            <View style={styles.dropdown}>
              {GRADES.map((g) => (
                <Pressable
                  key={g}
                  style={[styles.dropdownItem, g === grade && styles.dropdownSelected]}
                  onPress={() => {
                    setGrade(g);
                    setShowGrades(false);
                  }}
                >
                  <Text style={[styles.dropdownText, g === grade && styles.dropdownSelectedText]}>
                    {g}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>AVATAR</Text>
          <AvatarPicker selected={avatar} onSelect={setAvatar} />
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <Button title="CREATE PLAYER" onPress={handleSave} fullWidth />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  body: {
    flex: 1,
  },
  bodyContent: {
    padding: 20,
    gap: 20,
  },
  field: {
    gap: 8,
  },
  label: {
    fontFamily: FONTS.header,
    fontSize: 13,
    color: COLORS.muted,
    letterSpacing: 2,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADII.default,
    padding: 13,
    fontFamily: FONTS.body,
    fontSize: 16,
    color: COLORS.text,
  },
  inputText: {
    fontFamily: FONTS.body,
    fontSize: 16,
    color: COLORS.text,
  },
  dropdown: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADII.default,
    overflow: 'hidden',
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  dropdownSelected: {
    backgroundColor: 'rgba(240,180,41,0.12)',
  },
  dropdownText: {
    fontFamily: FONTS.body,
    fontSize: 15,
    color: COLORS.text,
  },
  dropdownSelectedText: {
    color: COLORS.gold,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
});
