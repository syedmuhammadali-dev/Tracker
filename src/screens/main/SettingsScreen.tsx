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
import { useSettingsStore } from '../../store/useSettingsStore';
import { translations } from '../../constants/translations';

const SettingsScreen = () => {
  const navigation = useNavigation<any>();
  const { user, logout } = useAuthStore();
  const { 
    language, 
    lowInternetMode, 
    batteryOptimization,
    setLanguage, 
    setLowInternetMode, 
    setBatteryOptimization 
  } = useSettingsStore();

  const t = translations[language];

  const handleLanguageToggle = () => {
    setLanguage(language === 'en' ? 'ru' : 'en');
  };

  const renderOptimizationOption = (label: string, value: 'high' | 'medium' | 'low') => (
    <TouchableOpacity
      style={[
        styles.optButton,
        batteryOptimization === value && styles.optButtonActive,
      ]}
      onPress={() => setBatteryOptimization(value)}
    >
      <Text style={[
        styles.optText,
        batteryOptimization === value && styles.optTextActive
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{t.settings}</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.privacy}</Text>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigation.navigate('PrivacySettings', { groupId: user?.groupId })}
          >
            <View style={styles.menuIconContainer}>
              <Icon name="shield-lock-outline" size={24} color={COLORS.primary} />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuTitle}>{t.privacy}</Text>
              <Text style={styles.menuSubtitle}>{t.privacy_desc}</Text>
            </View>
            <Icon name="chevron-right" size={24} color={COLORS.border} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.optimization}</Text>
          
          <View style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <Icon name="wifi-off" size={24} color={COLORS.warning} />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuTitle}>{t.low_internet}</Text>
              <Text style={styles.menuSubtitle}>{t.low_internet_desc}</Text>
            </View>
            <Switch
              value={lowInternetMode}
              onValueChange={setLowInternetMode}
              trackColor={{ false: COLORS.border, true: COLORS.primary }}
              thumbColor={COLORS.white}
            />
          </View>

          <View style={[styles.menuItem, { borderBottomWidth: 0 }]}>
            <View style={styles.menuIconContainer}>
              <Icon name="battery-high" size={24} color={COLORS.success} />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuTitle}>{t.battery_mode}</Text>
              <View style={styles.optContainer}>
                {renderOptimizationOption('High', 'high')}
                {renderOptimizationOption('Med', 'medium')}
                {renderOptimizationOption('Low', 'low')}
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.language}</Text>
          <TouchableOpacity style={styles.menuItem} onPress={handleLanguageToggle}>
            <View style={styles.menuIconContainer}>
              <Icon name="translate" size={24} color={COLORS.info} />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuTitle}>{language === 'en' ? 'Roman Urdu' : 'English'}</Text>
              <Text style={styles.menuSubtitle}>Tap to switch language</Text>
            </View>
            <Icon name="swap-horizontal" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.profileRow}>
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>
                {user?.displayName?.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View>
              <Text style={styles.userName}>{user?.displayName}</Text>
              <Text style={styles.userPhone}>{user?.phoneNumber}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutText}>{t.logout}</Text>
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
  optContainer: {
    flexDirection: 'row',
    marginTop: SPACING.sm,
    gap: SPACING.xs,
  },
  optButton: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  optButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  optText: {
    ...FONTS.body3,
    color: COLORS.textSecondary,
  },
  optTextActive: {
    color: COLORS.white,
    fontWeight: '600',
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  avatarText: {
    color: COLORS.white,
    ...FONTS.h3,
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
