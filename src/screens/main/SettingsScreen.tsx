import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, FONTS, SPACING, SIZES } from '../../constants/theme';
import { useAuthStore } from '../../store/useAuthStore';

const SettingsScreen = () => {
  const navigation = useNavigation<any>();
  const { user, logout } = useAuthStore();
  const [isSharing, setIsSharing] = React.useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Settings</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy & Safety</Text>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() =>
              navigation.navigate('PrivacySettings', { groupId: user?.groupId })
            }
          >
            <View style={styles.menuIconContainer}>
              <Icon
                name="shield-lock-outline"
                size={24}
                color={COLORS.primary}
              />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuTitle}>Privacy Settings</Text>
              <Text style={styles.menuSubtitle}>
                Location sharing, invisible mode & group privacy
              </Text>
            </View>
            <Icon name="chevron-right" size={24} color={COLORS.border} />
          </TouchableOpacity>

          <View style={[styles.menuItem, { borderBottomWidth: 0 }]}>
            <View style={styles.menuIconContainer}>
              <Icon name="map-marker-radius" size={24} color={COLORS.primary} />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuTitle}>Share Location</Text>
              <Text style={styles.menuSubtitle}>
                Allow family to see your live location
              </Text>
            </View>
            <Switch
              value={isSharing}
              onValueChange={setIsSharing}
              trackColor={{ false: COLORS.border, true: COLORS.primary }}
              thumbColor={COLORS.white}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.profileRow}>
            <View style={styles.avatarPlaceholder} />
            <View>
              <Text style={styles.userName}>{user?.displayName}</Text>
              <Text style={styles.userPhone}>{user?.phoneNumber}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutText}>Logout</Text>
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
  content: {
    padding: SPACING.lg,
  },
  title: {
    ...FONTS.h2,
    marginBottom: SPACING.xl,
  },
  section: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    padding: SPACING.md,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sectionTitle: {
    ...FONTS.h3,
    color: COLORS.primary,
    marginBottom: SPACING.md,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    ...FONTS.body1,
    fontWeight: '600',
    color: COLORS.text,
  },
  menuSubtitle: {
    ...FONTS.body3,
    color: COLORS.textSecondary,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.border,
    marginRight: SPACING.md,
  },
  userName: {
    ...FONTS.body1,
    fontWeight: '700',
  },
  userPhone: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
  },
  logoutButton: {
    height: 56,
    borderRadius: SIZES.radius,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.error,
    marginTop: SPACING.xl,
  },
  logoutText: {
    ...FONTS.body1,
    color: COLORS.error,
    fontWeight: '600',
  },
});

export default SettingsScreen;
