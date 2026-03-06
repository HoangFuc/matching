import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import type { ScheduleStackParamList } from '../interface/tab.interface';
import { MemoScheduleDetail } from '../screens/schedule/component/ScheduleDetail';
import { MemoScheduleMain } from '../screens/schedule/screens/Schedule';

const Stack = createNativeStackNavigator<ScheduleStackParamList>();

const ScheduleStack: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ScheduleMain" component={MemoScheduleMain} />
      <Stack.Screen name="ScheduleDetail" component={MemoScheduleDetail} />
    </Stack.Navigator>
  );
};

export default ScheduleStack;
