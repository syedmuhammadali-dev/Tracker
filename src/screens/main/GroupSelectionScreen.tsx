import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackParamList } from '../../types/navigation';
import { COLORS, FONTS, SPACING, SIZES } from '../../constants/theme';
import Button from '../../components/common/Button';

const GroupSelectionScreen = () => {
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Family Circle</Text>
          <Text style={styles.subtitle}>
            Join your family's circle to stay connected and safe together.
          </Text>
        </View>

        <View style={styles.options}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Join a Circle</Text>
            <Text style={styles.cardText}>
              Enter an invite code shared by a family member.
            </Text>
            <Button
              title="Enter Code"
              onPress={() => navigation.navigate('JoinGroup')}
              variant="outline"
            />
          </View>

          <View style={styles.divider}>
            <View style={styles.line} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.line} />
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Create a New Circle</Text>
            <Text style={styles.cardText}>
              Start a new private group and invite your family.
            </Text>
            <Button
              title="Create Circle"
              onPress={() => navigation.navigate('CreateGroup')}
            />
          </View>
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
    justifyContent: 'center',
  },
  header: {
    marginBottom: SPACING.xxl,
  },
  title: {
    ...FONTS.h1,
    color: COLORS.primary,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
  },
  options: {
    gap: SPACING.md,
  },
  card: {
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardTitle: {
    ...FONTS.h3,
    marginBottom: SPACING.xs,
  },
  cardText: {
    ...FONTS.body3,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.md,
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

export default GroupSelectionScreen;
