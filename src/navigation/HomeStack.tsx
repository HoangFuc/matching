import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Dashboard } from '../screens/dashboard/Dashboard';
import type { HomeStackParamList } from '../interface/tab.interface';

const Stack = createNativeStackNavigator<HomeStackParamList>();

const HomeStack: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dashboard" component={Dashboard} />
    </Stack.Navigator>
  );
};

export default HomeStack;
