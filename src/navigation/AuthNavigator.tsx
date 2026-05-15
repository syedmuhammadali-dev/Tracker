import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import OnboardingScreen from '../screens/auth/OnboardingScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import ProfileSetupScreen from '../screens/auth/ProfileSetupScreen';

export type AuthStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  ProfileSetup: undefined;
};

const Stack = createStackNavigator<AuthStackParamList>();

const AuthNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
