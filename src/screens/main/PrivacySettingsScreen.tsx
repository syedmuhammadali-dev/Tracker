import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  FlatList,
  Modal,
  TextInput,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, FONTS, SPACING, SIZES } from '../../constants/theme';
import { useAuthStore } from '../../store/useAuthStore';

const PrivacySettingsScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { groupId } = route.params;
  const { user } = useAuthStore();

  const [settings, setSettings] = useState({
    pauseSharing: false,
    invisibleMode: false,
    shareDuringHours: false,
    startHour: '09:00',
    endHour: '18:00',
  });

  const [members, setMembers] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user's own settings from member doc
    const fetchMySettings = async () => {
      if (!user?.uid || !groupId) return;

      const memberDoc = await firestore()
        .collection('familyGroups')
        .doc(groupId)
        .collection('members')
        .doc(user.uid)
        .get();

      if (memberDoc.exists) {
        const data = memberDoc.data();
        setSettings({
          pauseSharing: data?.pauseSharing || false,
          invisibleMode: data?.invisibleMode || false,
          shareDuringHours: data?.shareDuringHours || false,
          startHour: data?.startHour || '09:00',
          endHour: data?.endHour || '18:00',
        });
        setIsAdmin(data?.role === 'admin' || data?.role === 'owner');
      }
    };

    // Fetch group members
    const unsubscribeMembers = firestore()
      .collection('familyGroups')
      .doc(groupId)
      .collection('members')
      .onSnapshot(snapshot => {
        const memberList = snapshot.docs.map(doc => ({
          uid: doc.id,
          ...doc.data(),
        }));
        setMembers(memberList);
        setLoading(false);
      });

    fetchMySettings();
    return () => unsubscribeMembers();
  }, [groupId, user?.uid]);

  const updateSetting = async (key: string, value: any) => {
    try {
      setSettings(prev => ({ ...prev, [key]: value }));
      await firestore()
        .collection('familyGroups')
        .doc(groupId)
        .collection('members')
        .doc(user?.uid)
        .update({ [key]: value });
    } catch (error) {
      console.error('Error updating setting:', error);
      Alert.alert('Error', 'Failed to update setting');
    }
  };

  const handleRemoveMember = (member: any) => {
    if (member.uid === user?.uid) {
      Alert.alert(
        'Error',
        'You cannot remove yourself. Use "Leave Group" instead.',
      );
      return;
    }

    Alert.alert(
      'Remove Member',
      `Are you sure you want to remove ${member.displayName} from the circle?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await firestore()
                .collection('familyGroups')
                .doc(groupId)
                .collection('members')
                .doc(member.uid)
                .delete();

              // Also clear groupID from user's main doc
              await firestore().collection('users').doc(member.uid).update({
                groupId: firestore.FieldValue.delete(),
              });
            } catch (error) {
              console.error('Error removing member:', error);
            }
          },
        },
      ],
    );
  };

  const handleLeaveGroup = () => {
    Alert.alert(
      'Leave Group',
      'Are you sure you want to leave this family circle?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Leave',
          style: 'destructive',
          onPress: async () => {
            try {
              await firestore()
                .collection('familyGroups')
                .doc(groupId)
                .collection('members')
                .doc(user?.uid)
                .delete();

              await firestore().collection('users').doc(user?.uid).update({
                groupId: firestore.FieldValue.delete(),
              });

              navigation.reset({
                index: 0,
                routes: [{ name: 'GroupSelection' }],
              });
            } catch (error) {
              console.error('Error leaving group:', error);
            }
          },
        },
      ],
    );
  };

  const renderSectionHeader = (title: string) => (
    <Text style={styles.sectionHeader}>{title}</Text>
  );

  const renderSettingItem = (
    icon: string,
    title: string,
    subtitle: string,
    value: boolean,
    onToggle: (val: boolean) => void,
  ) => (
    <View style={styles.settingItem}>
      <View style={styles.settingIconContainer}>
        <Icon name={icon} size={24} color={COLORS.primary} />
      </View>
      <View style={styles.settingTextContainer}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingSubtitle}>{subtitle}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: COLORS.border, true: COLORS.primary }}
        thumbColor={COLORS.white}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-left" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Settings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {renderSectionHeader('Location Sharing')}

        {renderSettingItem(
          'map-marker-off',
          'Pause Location Sharing',
          'Temporarily stop sharing your live location',
          settings.pauseSharing,
          val => updateSetting('pauseSharing', val),
        )}

        {renderSettingItem(
          'incognito',
          'Invisible Mode',
          'Show as offline to other members',
          settings.invisibleMode,
          val => updateSetting('invisibleMode', val),
        )}

        {renderSettingItem(
          'clock-outline',
          'Scheduled Sharing',
          'Share location only during specific hours',
          settings.shareDuringHours,
          val => updateSetting('shareDuringHours', val),
        )}

        {settings.shareDuringHours && (
          <View style={styles.timeContainer}>
            <View style={styles.timeInputBox}>
              <Text style={styles.timeLabel}>Start Time</Text>
              <TextInput
                style={styles.timeInput}
                value={settings.startHour}
                onChangeText={text =>
                  setSettings(s => ({ ...s, startHour: text }))
                }
                onBlur={() => updateSetting('startHour', settings.startHour)}
                placeholder="09:00"
              />
            </View>
            <View style={styles.timeInputBox}>
              <Text style={styles.timeLabel}>End Time</Text>
              <TextInput
                style={styles.timeInput}
                value={settings.endHour}
                onChangeText={text =>
                  setSettings(s => ({ ...s, endHour: text }))
                }
                onBlur={() => updateSetting('endHour', settings.endHour)}
                placeholder="18:00"
              />
            </View>
          </View>
        )}

        {renderSectionHeader('Circle Management')}

        <View style={styles.sectionContainer}>
          {members.map(member => (
            <View key={member.uid} style={styles.memberItem}>
              <View style={styles.memberAvatar}>
                <Text style={styles.avatarText}>
                  {member.displayName?.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={styles.memberInfo}>
                <Text style={styles.memberName}>{member.displayName}</Text>
                <Text style={styles.memberRole}>{member.role || 'Member'}</Text>
              </View>
              {isAdmin && member.uid !== user?.uid && (
                <TouchableOpacity
                  onPress={() => handleRemoveMember(member)}
                  style={styles.removeButton}
                >
                  <Icon name="account-remove" size={22} color={COLORS.error} />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.leaveButton} onPress={handleLeaveGroup}>
          <Icon name="exit-run" size={20} color={COLORS.error} />
          <Text style={styles.leaveButtonText}>Leave Family Circle</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    padding: SPACING.xs,
    marginRight: SPACING.md,
  },
  headerTitle: {
    ...FONTS.h3,
    color: COLORS.text,
  },
  scrollContent: {
    padding: SPACING.md,
  },
  sectionHeader: {
    ...FONTS.body2,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: SIZES.radius,
    marginBottom: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    ...FONTS.body1,
    fontWeight: '600',
    color: COLORS.text,
  },
  settingSubtitle: {
    ...FONTS.body3,
    color: COLORS.textSecondary,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.xs,
    marginBottom: SPACING.md,
  },
  timeInputBox: {
    flex: 0.48,
    backgroundColor: COLORS.surface,
    padding: SPACING.sm,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  timeLabel: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  timeInput: {
    ...FONTS.body2,
    color: COLORS.text,
    padding: 0,
  },
  sectionContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  avatarText: {
    color: COLORS.white,
    fontWeight: '700',
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    ...FONTS.body1,
    fontWeight: '600',
    color: COLORS.text,
  },
  memberRole: {
    ...FONTS.body3,
    color: COLORS.textSecondary,
  },
  removeButton: {
    padding: SPACING.sm,
  },
  leaveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.xl,
    padding: SPACING.md,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  leaveButtonText: {
    ...FONTS.body1,
    color: COLORS.error,
    fontWeight: '600',
    marginLeft: SPACING.sm,
  },
});

export default PrivacySettingsScreen;
