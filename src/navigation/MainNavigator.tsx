import HomeScreen from '../screens/main/HomeScreen';
import MapScreen from '../screens/main/MapScreen';
import SettingsScreen from '../screens/main/SettingsScreen';
import CreateGroupScreen from '../screens/main/CreateGroupScreen';
import JoinGroupScreen from '../screens/main/JoinGroupScreen';
import GroupMembersScreen from '../screens/main/GroupMembersScreen';

export type MainStackParamList = {
  Home: undefined;
  Map: undefined;
  Settings: undefined;
  CreateGroup: undefined;
  JoinGroup: undefined;
  GroupMembers: { groupId: string };
};

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
    </Stack.Navigator>
  );
};

export default MainNavigator;
