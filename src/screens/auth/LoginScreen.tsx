import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput } from 'react-native';
import Button from '../../components/common/Button';
import { COLORS, FONTS, SPACING, SIZES } from '../../constants/theme';
import { useAuthStore } from '../../store/useAuthStore';

const LoginScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1: Phone, 2: OTP
  const setUser = useAuthStore(state => state.setUser);

  const handleSendOTP = () => {
    // Firebase Phone Auth logic would go here
    setStep(2);
  };

  const handleVerifyOTP = () => {
    // Mocking user login for now
    setUser({
      uid: '123',
      phoneNumber,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {step === 1 ? 'Welcome Back' : 'Verify Phone'}
          </Text>
          <Text style={styles.subtitle}>
            {step === 1
              ? 'Enter your phone number to continue'
              : `Enter the code sent to ${phoneNumber}`}
          </Text>
        </View>

        <View style={styles.form}>
          {step === 1 ? (
            <TextInput
              style={styles.input}
              placeholder="+92 300 1234567"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />
          ) : (
            <TextInput
              style={styles.input}
              placeholder="000000"
              value={otp}
              onChangeText={setOtp}
              keyboardType="number-pad"
              maxLength={6}
            />
          )}

          <Button
            title={step === 1 ? 'Send OTP' : 'Verify & Continue'}
            onPress={step === 1 ? handleSendOTP : handleVerifyOTP}
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
    marginTop: SPACING.xxl,
    marginBottom: SPACING.xl,
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
  form: {
    marginTop: SPACING.xl,
  },
  input: {
    height: 56,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    paddingHorizontal: SPACING.md,
    ...FONTS.body1,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.lg,
  },
  button: {
    marginTop: SPACING.sm,
  },
});

export default LoginScreen;
