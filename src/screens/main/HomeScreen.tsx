import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { COLORS, FONTS, SPACING, SIZES } from '../../constants/theme';
import { useAuthStore } from '../../store/useAuthStore';

const HomeScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { user } = useAuthStore();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Assalam-o-Alaikum,</Text>
            <Text style={styles.username}>{user?.displayName}</Text>
          </View>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => navigation.navigate('Settings')}
          >
            <Text>⚙️</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.mapCard}
          onPress={() => navigation.navigate('Map')}
        >
          <Text style={styles.mapCardTitle}>Live Family Map</Text>
          <Text style={styles.mapCardSubtitle}>
            View real-time location of your circle
          </Text>
          <View style={styles.mapPlaceholder}>
            <Text style={styles.placeholderText}>Map Preview</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: COLORS.error }]}
            >
              <Text style={styles.actionIcon}>🚨</Text>
              <Text style={styles.actionText}>SOS</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionIcon}>🏠</Text>
              <Text style={styles.actionText}>Places</Text>
            </TouchableOpacity>
          </View>
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
    padding: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  greeting: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
  },
  username: {
    ...FONTS.h2,
    color: COLORS.text,
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  mapCard: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    padding: SPACING.md,
    marginBottom: SPACING.xl,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  mapCardTitle: {
    ...FONTS.h3,
    color: COLORS.text,
  },
  mapCardSubtitle: {
    ...FONTS.body3,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  mapPlaceholder: {
    height: 150,
    backgroundColor: '#E0E0E0',
    borderRadius: SIZES.radius - 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    ...FONTS.caption,
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
  actionGrid: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  actionButton: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    padding: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: SPACING.xs,
  },
  actionText: {
    ...FONTS.body2,
    fontWeight: '600',
    color: COLORS.text,
  },
});

export default HomeScreen;
