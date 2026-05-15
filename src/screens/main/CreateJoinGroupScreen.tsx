import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  ScrollView,
} from 'react-native';
import Button from '../../components/common/Button';
import { COLORS, FONTS, SPACING, SIZES } from '../../constants/theme';
import { useAuthStore } from '../../store/useAuthStore';

const CreateJoinGroupScreen = () => {
  const [inviteCode, setInviteCode] = useState('');
  const { user, setUser } = useAuthStore();

  const handleCreateGroup = () => {
    if (user) {
      setUser({ ...user, groupId: 'new-group-id' });
    }
  };

  const handleJoinGroup = () => {
    if (user && inviteCode.trim()) {
      setUser({ ...user, groupId: 'joined-group-id' });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Family Group</Text>
          <Text style={styles.subtitle}>
            Create a new group or join an existing one using an invite code.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Join a Group</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Invite Code"
            value={inviteCode}
            onChangeText={setInviteCode}
            autoCapitalize="characters"
          />
          <Button
            title="Join Group"
            onPress={handleJoinGroup}
            variant="outline"
            disabled={!inviteCode.trim()}
          />
        </View>

        <View style={styles.divider}>
          <View style={styles.line} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.line} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Start New Group</Text>
          <Text style={styles.sectionDescription}>
            Create a private circle for your family members.
          </Text>
          <Button title="Create Group" onPress={handleCreateGroup} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.xl,
  },
  header: {
    marginTop: SPACING.lg,
    marginBottom: SPACING.xxl,
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
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    ...FONTS.h3,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  sectionDescription: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
  },
  input: {
    height: 56,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    paddingHorizontal: SPACING.md,
    ...FONTS.body1,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.xxl,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    marginHorizontal: SPACING.md,
  },
});

export default CreateJoinGroupScreen;
