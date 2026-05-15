import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';
import { COLORS, FONTS, SPACING, SIZES } from '../../constants/theme';
import { useAuthStore } from '../../store/useAuthStore';

const SettingsScreen = () => {
  const { user, logout } = useAuthStore();
  const [isSharing, setIsSharing] = React.useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Settings</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy</Text>
          <View style={styles.row}>
            <View>
              <Text style={styles.rowTitle}>Share Location</Text>
              <Text style={styles.rowSubtitle}>
                Allow family to see your live location
              </Text>
            </View>
            <Switch
              value={isSharing}
              onValueChange={setIsSharing}
              trackColor={{ false: COLORS.border, true: COLORS.primary }}
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowTitle: {
    ...FONTS.body1,
    fontWeight: '600',
  },
  rowSubtitle: {
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
