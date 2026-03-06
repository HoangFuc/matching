import React from 'react';

import {createNativeStackNavigator} from '@react-navigation/native-stack';

import type {DataRoomStackParamList} from '../interface/tab.interface';
import {MemoDataRoomScreen} from '../screens/dataRoom/screens/DataRoomScreen';
import {MemoDataDetailScreen} from '../screens/dataRoom/screens/DataDetailScreen';
import {MemoSearchScreen} from '../screens/dataRoom/screens/SearchScreen';

const Stack = createNativeStackNavigator<DataRoomStackParamList>();

const DataRoomStack: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="DataRoomMain" component={MemoDataRoomScreen} />
      <Stack.Screen name="DataRoomDetail" component={MemoDataDetailScreen} />
      <Stack.Screen name="DataRoomSearch" component={MemoSearchScreen} />
    </Stack.Navigator>
  );
};

export default DataRoomStack;
