import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Animated,
  Alert,
  Vibration,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Geolocation from 'react-native-geolocation-service';
import DeviceInfo from 'react-native-device-info';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../store/useAuthStore';
import { COLORS, FONTS, SPACING, SIZES } from '../../constants/theme';

const SOSScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuthStore();
  const [isActivating, setIsActivating] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [isAlertSent, setIsAlertSent] = useState(false);

  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isActivating && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      Vibration.vibrate(100);
      return () => clearTimeout(timer);
    } else if (isActivating && countdown === 0) {
      triggerSOS();
    }
  }, [isActivating, countdown]);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const triggerSOS = async () => {
    setIsActivating(false);
    setIsAlertSent(true);
    Vibration.vibrate([500, 200, 500, 200, 500], false);

    try {
      // Get current location specifically for SOS
      Geolocation.getCurrentPosition(
        async position => {
          const batteryLevel = await DeviceInfo.getBatteryLevel();

          const sosData = {
            type: 'SOS',
            userId: user?.uid,
            userName: user?.displayName,
            userRole: user?.role,
            location: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
            },
            batteryLevel: Math.round(batteryLevel * 100),
            timestamp: firestore.FieldValue.serverTimestamp(),
            status: 'ACTIVE',
          };

          // 1. Save to group alerts
          await firestore()
            .collection('familyGroups')
            .doc(user?.groupId)
            .collection('alerts')
            .add(sosData);

          // 2. Update user's specific SOS status
          await firestore().collection('users').doc(user?.uid).update({
            activeSOS: true,
          });

          Alert.alert(
            'SOS Alert Sent',
            'Your family members have been notified of your emergency and location.',
            [{ text: 'OK', onPress: () => navigation.goBack() }],
          );
        },
        error => {
          console.error(error);
          Alert.alert(
            'Error',
            'Could not get your location for the SOS alert.',
          );
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
      );
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to send SOS alert.');
    }
  };

  const handlePressIn = () => {
    setIsActivating(true);
    setCountdown(3);
  };

  const handlePressOut = () => {
    if (countdown > 0) {
      setIsActivating(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Emergency SOS</Text>
          <Text style={styles.subtitle}>
            Hold the button for 3 seconds to alert your family circle.
          </Text>
        </View>

        <View style={styles.center}>
          <Animated.View
            style={[styles.pulseCircle, { transform: [{ scale: pulseAnim }] }]}
          />

          <TouchableOpacity
            activeOpacity={0.8}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={[styles.sosButton, isActivating && styles.sosButtonActive]}
          >
            {isActivating ? (
              <Text style={styles.countdownText}>{countdown}</Text>
            ) : (
              <Text style={styles.sosText}>SOS</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerTitle}>What happens?</Text>
          <Text style={styles.footerText}>
            • All family members get a high-priority alert.{'\n'}• Your live
            location is shared instantly.{'\n'}• Your battery status is
            included.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  content: {
    flex: 1,
    padding: SPACING.xl,
    justifyContent: 'space-between',
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: SPACING.md,
  },
  closeText: {
    fontSize: 24,
    color: COLORS.textSecondary,
  },
  header: {
    alignItems: 'center',
  },
  title: {
    ...FONTS.h1,
    color: COLORS.error,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingHorizontal: SPACING.md,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
  },
  pulseCircle: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255, 77, 77, 0.2)',
  },
  sosButton: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: COLORS.error,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowColor: COLORS.error,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  sosButtonActive: {
    backgroundColor: '#CC0000',
    transform: [{ scale: 0.95 }],
  },
  sosText: {
    ...FONTS.h1,
    color: COLORS.white,
    fontSize: 40,
    fontWeight: '900',
  },
  countdownText: {
    ...FONTS.h1,
    color: COLORS.white,
    fontSize: 60,
    fontWeight: '900',
  },
  footer: {
    backgroundColor: '#FFF5F5',
    padding: SPACING.lg,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: '#FFDADA',
  },
  footerTitle: {
    ...FONTS.body1,
    fontWeight: '700',
    color: COLORS.error,
    marginBottom: SPACING.sm,
  },
  footerText: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
});

export default SOSScreen;
