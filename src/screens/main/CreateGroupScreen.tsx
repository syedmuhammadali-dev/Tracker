import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Alert,
  Share,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { COLORS, FONTS, SPACING, SIZES } from '../../constants/theme';
import { useAuthStore } from '../../store/useAuthStore';

const CreateGroupScreen = () => {
  const [groupName, setGroupName] = useState('');
  const [loading, setLoading] = useState(false);
  const [inviteCode, setInviteCode] = useState<string | null>(null);

  const { user, setUser } = useAuthStore();

  const generateInviteCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      Alert.alert('Required', 'Please enter a name for your family circle.');
      return;
    }

    setLoading(true);
    try {
      const code = generateInviteCode();
      const groupRef = firestore().collection('familyGroups').doc();

      const groupData = {
        id: groupRef.id,
        name: groupName,
        adminId: user?.uid,
        inviteCode: code,
        createdAt: firestore.FieldValue.serverTimestamp(),
      };

      await groupRef.set(groupData);

      // Add the creator as the first member
      await groupRef
        .collection('members')
        .doc(user?.uid)
        .set({
          uid: user?.uid,
          displayName: user?.displayName,
          role: user?.role,
          photoURL: user?.photoURL || null,
          joinedAt: firestore.FieldValue.serverTimestamp(),
        });

      // Update user's group ID
      await firestore().collection('users').doc(user?.uid).update({
        groupId: groupRef.id,
      });

      setInviteCode(code);
      setUser({ ...user!, groupId: groupRef.id });

      Alert.alert('Success', 'Family circle created successfully!');
    } catch (error: any) {
      console.error(error);
      Alert.alert('Error', 'Failed to create group. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleShareCode = async () => {
    if (!inviteCode) return;
    try {
      await Share.share({
        message: `Join my family circle on SafeCircle PK using this code: ${inviteCode}`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  if (inviteCode) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Group Created!</Text>
            <Text style={styles.subtitle}>
              Share this code with your family members so they can join your
              circle.
            </Text>
          </View>

          <View style={styles.codeContainer}>
            <Text style={styles.codeLabel}>Invite Code</Text>
            <Text style={styles.codeText}>{inviteCode}</Text>
          </View>

          <Button
            title="Share Invite Code"
            onPress={handleShareCode}
            style={styles.button}
          />
          <Text style={styles.footerText}>
            You can also find this code in your Circle Settings.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Create Circle</Text>
          <Text style={styles.subtitle}>
            Give your family circle a name (e.g. "The Khan Family").
          </Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Circle Name"
            placeholder="e.g. Khan Family"
            value={groupName}
            onChangeText={setGroupName}
          />

          <Button
            title="Create Circle"
            onPress={handleCreateGroup}
            loading={loading}
            style={styles.button}
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
    marginTop: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  title: {
    ...FONTS.h1,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
  },
  form: {
    marginTop: SPACING.md,
  },
  codeContainer: {
    backgroundColor: COLORS.surface,
    padding: SPACING.xl,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: SPACING.xxl,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
  },
  codeLabel: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: SPACING.sm,
  },
  codeText: {
    fontSize: 40,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 4,
  },
  button: {
    marginTop: SPACING.md,
  },
  footerText: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.xl,
  },
});

export default CreateGroupScreen;
