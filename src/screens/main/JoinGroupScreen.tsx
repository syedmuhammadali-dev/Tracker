import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { COLORS, FONTS, SPACING, SIZES } from '../../constants/theme';
import { useAuthStore } from '../../store/useAuthStore';

const JoinGroupScreen = () => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [foundGroup, setFoundGroup] = useState<any>(null);
  
  const { user, setUser } = useAuthStore();

  const handleFindGroup = async () => {
    if (code.length !== 6) {
      Alert.alert('Invalid Code', 'Please enter a 6-character invite code.');
      return;
    }

    setLoading(true);
    try {
      const snapshot = await firestore()
        .collection('familyGroups')
        .where('inviteCode', '==', code.toUpperCase())
        .limit(1)
        .get();

      if (snapshot.empty) {
        Alert.alert('Not Found', 'No family circle found with this code.');
        setLoading(false);
        return;
      }

      const groupData = snapshot.docs[0].data();
      setFoundGroup(groupData);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGroup = async () => {
    if (!foundGroup) return;

    setLoading(true);
    try {
      const groupRef = firestore().collection('familyGroups').doc(foundGroup.id);
      
      // Check if already a member
      const memberDoc = await groupRef.collection('members').doc(user?.uid).get();
      if (memberDoc.exists) {
        Alert.alert('Already Member', 'You are already a member of this circle.');
        setUser({ ...user!, groupId: foundGroup.id });
        setLoading(false);
        return;
      }

      // 1. Add to group members sub-collection
      await groupRef.collection('members').doc(user?.uid).set({
        uid: user?.uid,
        displayName: user?.displayName,
        role: user?.role,
        photoURL: user?.photoURL || null,
        joinedAt: firestore.FieldValue.serverTimestamp(),
      });

      // 2. Update user's group ID
      await firestore().collection('users').doc(user?.uid).update({
        groupId: foundGroup.id,
      });

      setUser({ ...user!, groupId: foundGroup.id });
      Alert.alert('Welcome!', `You have joined ${foundGroup.name}.`);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to join group. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (foundGroup) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Circle Found!</Text>
            <Text style={styles.subtitle}>
              Would you like to join this family circle?
            </Text>
          </View>

          <View style={styles.groupCard}>
            <View style={styles.groupIcon}>
               <Text style={styles.iconText}>👪</Text>
            </View>
            <Text style={styles.groupName}>{foundGroup.name}</Text>
            <Text style={styles.groupMeta}>Managed by Admin</Text>
          </View>

          <Button 
            title="Join This Circle" 
            onPress={handleJoinGroup} 
            loading={loading}
            style={styles.button}
          />
          <Button 
            title="Try Different Code" 
            onPress={() => setFoundGroup(null)} 
            variant="outline"
            style={styles.secondaryButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Join a Circle</Text>
          <Text style={styles.subtitle}>
            Enter the 6-character invite code shared with you.
          </Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Invite Code"
            placeholder="ABCXYZ"
            value={code}
            onChangeText={(val) => setCode(val.toUpperCase())}
            autoCapitalize="characters"
            maxLength={6}
            style={styles.codeInput}
          />
          
          <Button 
            title="Find Circle" 
            onPress={handleFindGroup} 
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
  codeInput: {
    letterSpacing: 4,
    textAlign: 'center',
    ...FONTS.h2,
  },
  groupCard: {
    backgroundColor: COLORS.surface,
    padding: SPACING.xl,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    marginVertical: SPACING.xxl,
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 2,
  },
  groupIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  iconText: {
    fontSize: 40,
  },
  groupName: {
    ...FONTS.h2,
    color: COLORS.text,
  },
  groupMeta: {
    ...FONTS.body3,
    color: COLORS.textSecondary,
  },
  button: {
    marginTop: SPACING.md,
  },
  secondaryButton: {
    marginTop: SPACING.md,
  },
});

export default JoinGroupScreen;
