import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { COLORS, FONTS, SPACING } from '../../constants/theme';
import { AuthStackParamList } from '../../types/navigation';

const OtpVerificationScreen = () => {
  const route = useRoute<RouteProp<AuthStackParamList, 'OtpVerification'>>();
  const navigation = useNavigation();
  const { phoneNumber, confirmation: initialConfirmation } = route.params;

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmation, setConfirmation] = useState(initialConfirmation);
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      Alert.alert(
        'Invalid OTP',
        'Please enter the 6-digit code sent to your phone.',
      );
      return;
    }

    setLoading(true);
    try {
      await confirmation.confirm(otp);
      // Success: Firebase onAuthStateChanged will handle the rest
    } catch (error: any) {
      setLoading(false);
      console.error(error);
      Alert.alert(
        'Verification Failed',
        'The code you entered is incorrect or expired.',
      );
    }
  };

  const handleResendOTP = async () => {
    if (timer > 0) return;

    setLoading(true);
    try {
      const newConfirmation = await auth().signInWithPhoneNumber(phoneNumber);
      setConfirmation(newConfirmation);
      setTimer(60);
      setLoading(false);
      Alert.alert('OTP Resent', 'A new verification code has been sent.');
    } catch (error: any) {
      setLoading(false);
      Alert.alert('Error', 'Failed to resend OTP. Please try again later.');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backText}>← Change Number</Text>
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.title}>Verify OTP</Text>
            <Text style={styles.subtitle}>
              Enter the 6-digit code sent to {phoneNumber}
            </Text>
          </View>

          <View style={styles.form}>
            <Input
              label="Verification Code"
              placeholder="000000"
              value={otp}
              onChangeText={setOtp}
              keyboardType="number-pad"
              maxLength={6}
              style={styles.otpInput}
            />

            <View style={styles.resendContainer}>
              <Text style={styles.resendText}>Didn't receive code? </Text>
              <TouchableOpacity onPress={handleResendOTP} disabled={timer > 0}>
                <Text
                  style={[styles.resendLink, timer > 0 && styles.disabledLink]}
                >
                  {timer > 0 ? `Resend in ${timer}s` : 'Resend Code'}
                </Text>
              </TouchableOpacity>
            </View>

            <Button
              title="Verify & Continue"
              onPress={handleVerifyOTP}
              loading={loading}
              style={styles.button}
            />
          </View>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
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
  backButton: {
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
  },
  backText: {
    ...FONTS.body2,
    color: COLORS.primary,
    fontWeight: '600',
  },
  header: {
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
    marginTop: SPACING.xl,
  },
  otpInput: {
    letterSpacing: 8,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '700',
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: SPACING.xl,
  },
  resendText: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
  },
  resendLink: {
    ...FONTS.body2,
    color: COLORS.primary,
    fontWeight: '700',
  },
  disabledLink: {
    color: COLORS.textSecondary,
  },
  button: {
    marginTop: SPACING.md,
  },
});

export default OtpVerificationScreen;
