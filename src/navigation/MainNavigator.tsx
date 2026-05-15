import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/main/HomeScreen';
import MapScreen from '../screens/main/MapScreen';
import SettingsScreen from '../screens/main/SettingsScreen';
import CreateGroupScreen from '../screens/main/CreateGroupScreen';
import GroupMembersScreen from '../screens/main/GroupMembersScreen';
import AddSafeZoneScreen from '../screens/main/AddSafeZoneScreen';
import SafeZonesListScreen from '../screens/main/SafeZonesListScreen';
import SOSScreen from '../screens/main/SOSScreen';
import JoinGroupScreen from '../screens/main/JoinGroupScreen';
import PrivacySettingsScreen from '../screens/main/PrivacySettingsScreen';
import { MainStackParamList } from '../types/navigation';

const Stack = createStackNavigator<MainStackParamList>();

const MainNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Map" component={MapScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="CreateGroup" component={CreateGroupScreen} />
      <Stack.Screen name="JoinGroup" component={JoinGroupScreen} />
      <Stack.Screen name="GroupMembers" component={GroupMembersScreen} />
      <Stack.Screen name="AddSafeZone" component={AddSafeZoneScreen} />
      <Stack.Screen name="SafeZonesList" component={SafeZonesListScreen} />
      <Stack.Screen name="SOS" component={SOSScreen} />
      <Stack.Screen name="PrivacySettings" component={PrivacySettingsScreen} />
    </Stack.Navigator>
  );
};

export default MainNavigator;
