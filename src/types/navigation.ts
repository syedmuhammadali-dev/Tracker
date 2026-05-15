import { StackNavigationProp } from '@react-navigation/stack';

export type RootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  Main: undefined;
  ProfileSetup: undefined;
  GroupSelection: undefined;
};

export type AuthStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  OtpVerification: { confirmation: any; phoneNumber: string };
  ProfileSetup: undefined;
};

export type MainStackParamList = {
  Home: undefined;
  Map: undefined;
  Settings: undefined;
  CreateGroup: undefined;
  JoinGroup: undefined;
  GroupMembers: { groupId: string };
  AddSafeZone: undefined;
  SafeZonesList: undefined;
  SOS: undefined;
};

export type AppNavigationProp = StackNavigationProp<
  RootStackParamList & AuthStackParamList & MainStackParamList
>;
