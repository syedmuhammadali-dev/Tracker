import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/navigation';
import Button from '../../components/common/Button';
import { COLORS, FONTS, SPACING } from '../../constants/theme';

const OnboardingScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>SafeCircle PK</Text>
          <Text style={styles.subtitle}>
            Keep your family safe and connected across Pakistan.
          </Text>
        </View>

        <View style={styles.footer}>
          <Button
            title="Get Started"
            onPress={() => navigation.navigate('Login')}
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
    justifyContent: 'space-between',
  },
  header: {
    marginTop: SPACING.xxl,
    alignItems: 'center',
  },
  title: {
    ...FONTS.h1,
    color: COLORS.primary,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    ...FONTS.body1,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  footer: {
    marginBottom: SPACING.xl,
  },
});

export default OnboardingScreen;
