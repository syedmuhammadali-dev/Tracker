import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuthStore } from '../store/useAuthStore';

import SplashScreen from '../screens/auth/SplashScreen';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import ProfileSetupScreen from '../screens/auth/ProfileSetupScreen';
import CreateJoinGroupScreen from '../screens/main/CreateJoinGroupScreen';

export type RootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  Main: undefined;
  ProfileSetup: undefined;
  CreateJoinGroup: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const { user, isLoading } = useAuthStore();

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : !user.displayName ? (
          <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
        ) : !user.groupId ? (
          <Stack.Screen name="CreateJoinGroup" component={CreateJoinGroupScreen} />
        ) : (
          <Stack.Screen name="Main" component={MainNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
