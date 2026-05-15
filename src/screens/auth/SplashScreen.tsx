import React, { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS } from '../../constants/theme';
import { useAuthStore } from '../../store/useAuthStore';

const SplashScreen = () => {
  const setLoading = useAuthStore(state => state.setLoading);

  useEffect(() => {
    // Simulate initial load / check auth
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={COLORS.white} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SplashScreen;
