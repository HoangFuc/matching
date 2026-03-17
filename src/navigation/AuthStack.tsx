import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import type { AuthStackParamList } from '@/src/interface/tab.interface';
import { MemoWelcomeScreen } from '../screens/auth/screens/WelcomeScreen';
import { MemoLoginScreen } from '../screens/auth/screens/LoginScreen';
import { MemoJoinOrganizationScreen } from '../screens/auth/screens/JoinOrganizationScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthStack: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={MemoWelcomeScreen} />
      <Stack.Screen name="Login" component={MemoLoginScreen} />
      <Stack.Screen name="JoinOrganization" component={MemoJoinOrganizationScreen} />
    </Stack.Navigator>
  );
};

export default AuthStack;
