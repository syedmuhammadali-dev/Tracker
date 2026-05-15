import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput } from 'react-native';
import Button from '../../components/common/Button';
import { COLORS, FONTS, SPACING, SIZES } from '../../constants/theme';
import { useAuthStore } from '../../store/useAuthStore';

const ProfileSetupScreen = () => {
  const [name, setName] = useState('');
  const { user, setUser } = useAuthStore();

  const handleSave = () => {
    if (user) {
      setUser({ ...user, displayName: name });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Complete Profile</Text>
          <Text style={styles.subtitle}>
            Tell us your name so your family can recognize you.
          </Text>
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
          />

          <Button
            title="Continue"
            onPress={handleSave}
            disabled={!name.trim()}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: SPACING.xl,
  },
  header: {
    marginTop: SPACING.xxl,
    marginBottom: SPACING.xl,
  },
  title: {
    ...FONTS.h2,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
  },
  form: {
    marginTop: SPACING.xl,
  },
  input: {
    height: 56,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    paddingHorizontal: SPACING.md,
    ...FONTS.body1,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.lg,
  },
});

export default ProfileSetupScreen;
