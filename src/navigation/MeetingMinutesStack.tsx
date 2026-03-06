import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { MeetingMinutesStackParamList } from '../interface/tab.interface';
import { MemoMeetingMinutesScreen } from '../screens/meetingMinutes/screens/MeetingMinutesScreen';
import { MemoCreateMeetingMinutesScreen } from '../screens/meetingMinutes/screens/CreateMeetingMinutesScreen';
import { MemoMeetingMinutesDetailScreen } from '../screens/meetingMinutes/screens/MeetingMinutesDetailScreen';
import { MemoEditMeetingMinutesScreen } from '../screens/meetingMinutes/screens/EditMeetingMinutesScreen';

const Stack = createNativeStackNavigator<MeetingMinutesStackParamList>();

const MeetingMinutesStack: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MeetingMinutesMain" component={MemoMeetingMinutesScreen} />
      <Stack.Screen name="CreateMeetingMinutes" component={MemoCreateMeetingMinutesScreen} />
      <Stack.Screen name="MeetingMinutesDetail" component={MemoMeetingMinutesDetailScreen} />
      <Stack.Screen name="EditMeetingMinutes" component={MemoEditMeetingMinutesScreen} />
    </Stack.Navigator>
  );
};

export default MeetingMinutesStack;
