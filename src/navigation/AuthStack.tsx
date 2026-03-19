import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import type { AuthStackParamList } from '@/src/interface/tab.interface';
import { RegisterCompanyProvider } from '../screens/auth/context/RegisterCompanyContext';
import { MemoWelcomeScreen } from '../screens/auth/screens/WelcomeScreen';
import { MemoLoginScreen } from '../screens/auth/screens/LoginScreen';
import { MemoJoinOrganizationScreen } from '../screens/auth/screens/JoinOrganizationScreen';
import { MemoConfirmOrganizationInvitationScreen } from '../screens/auth/screens/ConfirmOrganizationInvitationScreen';
import { MemoJoinMembershipScreen } from '../screens/auth/screens/JoinMembershipScreen';
import { MemoCreateAgencyScreen } from '../screens/auth/screens/CreateAgencyScreen';
import { MemoOrgChartSetupScreen } from '../screens/auth/screens/OrgChartSetupScreen';
import { MemoInviteMemberScreen } from '../screens/auth/screens/InviteMemberScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthStack: React.FC = () => {
  return (
    <RegisterCompanyProvider>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={MemoWelcomeScreen} />
        <Stack.Screen name="Login" component={MemoLoginScreen} />
        <Stack.Screen name="JoinOrganization" component={MemoJoinOrganizationScreen} />
        <Stack.Screen name="ConfirmOrganizationInvitation" component={MemoConfirmOrganizationInvitationScreen} />
        <Stack.Screen name="JoinMembership" component={MemoJoinMembershipScreen} />
        <Stack.Screen name="CreateAgency" component={MemoCreateAgencyScreen} />
        <Stack.Screen name="OrgChartSetup" component={MemoOrgChartSetupScreen} />
        <Stack.Screen name="InviteMember" component={MemoInviteMemberScreen} />
      </Stack.Navigator>
    </RegisterCompanyProvider>
  );
};

export default AuthStack;
