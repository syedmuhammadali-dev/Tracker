import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/main/HomeScreen';
import MapScreen from '../screens/main/MapScreen';
import SettingsScreen from '../screens/main/SettingsScreen';
import CreateJoinGroupScreen from '../screens/main/CreateJoinGroupScreen';

export type MainStackParamList = {
  Home: undefined;
  Map: undefined;
  Settings: undefined;
  CreateJoinGroup: undefined;
};

const Stack = createStackNavigator<MainStackParamList>();

const MainNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Map" component={MapScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="CreateJoinGroup" component={CreateJoinGroupScreen} />
    </Stack.Navigator>
  );
};

export default MainNavigator;
