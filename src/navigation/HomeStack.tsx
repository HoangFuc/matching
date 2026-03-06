import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import type { HomeStackParamList } from '../interface/tab.interface';
import { Dashboard } from '../screens/dashboard/screens/Dashboard';

const Stack = createNativeStackNavigator<HomeStackParamList>();

const HomeStack: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dashboard" component={Dashboard} />
    </Stack.Navigator>
  );
};

export default HomeStack;
