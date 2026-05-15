import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useAuthStore } from '../store/useAuthStore';

import SplashScreen from '../screens/auth/SplashScreen';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import ProfileSetupScreen from '../screens/auth/ProfileSetupScreen';
import GroupSelectionScreen from '../screens/main/GroupSelectionScreen';
import { RootStackParamList } from '../types/navigation';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const { user, setUser, isLoading, setLoading } = useAuthStore();
  const [initializing, setInitializing] = useState(true);

  // Handle user state changes
  async function onAuthStateChanged(fbUser: any) {
    if (fbUser) {
      // Fetch Firestore data
      const userDoc = await firestore().collection('users').doc(fbUser.uid).get();
      const userData = userDoc.data();

      setUser({
        uid: fbUser.uid,
        phoneNumber: fbUser.phoneNumber || '',
        displayName: userData?.displayName || fbUser.displayName || undefined,
        photoURL: userData?.photoURL || fbUser.photoURL || undefined,
        role: userData?.role,
        groupId: userData?.groupId,
      });
    } else {
      setUser(null);
    }
    if (initializing) setInitializing(false);
    setLoading(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    
    // Setup Notifications
    NotificationService.requestUserPermission();
    const unsubscribeNotifications = NotificationService.setupListeners();

    return () => {
      subscriber();
      unsubscribeNotifications();
    };
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
          <Stack.Screen
            name="GroupSelection"
            component={GroupSelectionScreen}
          />
        ) : (
          <Stack.Screen name="Main" component={MainNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
