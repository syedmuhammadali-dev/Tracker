import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import auth from '@react-native-firebase/auth';
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
  const { user, setUser, isLoading, setLoading } = useAuthStore();
  const [initializing, setInitializing] = useState(true);

  // Handle user state changes
  function onAuthStateChanged(fbUser: any) {
    if (fbUser) {
      setUser({
        uid: fbUser.uid,
        phoneNumber: fbUser.phoneNumber || '',
        displayName: fbUser.displayName || undefined,
        photoURL: fbUser.photoURL || undefined,
      });
    } else {
      setUser(null);
    }
    if (initializing) setInitializing(false);
    setLoading(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (isLoading || initializing) {
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
