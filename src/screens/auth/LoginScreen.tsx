import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import auth from '@react-native-firebase/auth';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { COLORS, FONTS, SPACING } from '../../constants/theme';
import { AuthStackParamList } from '../../types/navigation';

const LoginScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<StackNavigationProp<AuthStackParamList>>();

  const validatePhone = (phone: string) => {
    // Basic Pakistan phone validation (starts with 3 and is 10 digits after +92)
    const regex = /^3\d{9}$/;
    return regex.test(phone);
  };

  const handleSendOTP = async () => {
    if (!validatePhone(phoneNumber)) {
      Alert.alert(
        'Invalid Number',
        'Please enter a valid 10-digit mobile number starting with 3.',
      );
      return;
    }

    setLoading(true);
    try {
      const formattedPhone = `+92${phoneNumber}`;
      const confirmation = await auth().signInWithPhoneNumber(formattedPhone);
      setLoading(false);
      navigation.navigate('OtpVerification', {
        phoneNumber: formattedPhone,
        confirmation,
      });
    } catch (error: any) {
      setLoading(false);
      console.error(error);
      Alert.alert(
        'Error',
        error.message || 'Failed to send OTP. Please try again.',
      );
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Welcome to SafeCircle</Text>
            <Text style={styles.subtitle}>
              Secure your family with Pakistan's premium safety app.
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Input
                label="Phone Number"
                placeholder="300 1234567"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                maxLength={10}
                style={{ paddingLeft: 55 }}
              />
              <Text style={styles.prefix}>+92</Text>
            </View>

            <Text style={styles.infoText}>
              We'll send an OTP for verification. Messaging rates may apply.
            </Text>

            <Button
              title="Get Verification Code"
              onPress={handleSendOTP}
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
  header: {
    marginTop: SPACING.xxl,
    marginBottom: SPACING.xl,
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
  form: {
    marginTop: SPACING.xl,
  },
  inputContainer: {
    position: 'relative',
  },
  prefix: {
    position: 'absolute',
    left: 15,
    top: 42,
    ...FONTS.body1,
    color: COLORS.text,
    fontWeight: '600',
  },
  infoText: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
  },
  button: {
    marginTop: SPACING.md,
  },
});

export default LoginScreen;
