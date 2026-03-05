import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { MemoScheduleMain } from "../screens/schedule/Schedule";
import { MemoScheduleDetail } from "../screens/schedule/ScheduleDetail";
import type { ScheduleStackParamList } from "../interface/tab.interface";

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
