import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { moderateScale as ms } from 'react-native-size-matters/extend';
import Toast from 'react-native-toast-message';

import { toastConfig } from '@/src/component/toastConfig';

import { AppText } from '@/src/component/AppText';
import { AppColor, AppColors } from '@/src/constants/colors';
import type {
  RootStackParamList,
  RootTabParamList,
} from '@/src/interface/tab.interface';
import { MemoBulletinDetail } from '../screens/bulletin/component/BulletinDetail';
import { MemoBulletinBoard } from '../screens/bulletin/screens/BulletinBoard';
import { MemoCreateBulletinScreen } from '../screens/bulletin/screens/CreateBulletinScreen';
import HomeStack from './HomeStack';
import MeetingMinutesStack from './MeetingMinutesStack';
import ScheduleStack from './ScheduleStack';
import DataRoomStack from './DataRoomStack';
import {
  Calendar,
  ClipboardText,
  Document,
  DocumentText,
  Home2,
} from '../constants/icons';

const RootStack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();

const ContractScreen = () => <View style={styles.placeholder} />;
const DraftScreen = () => <View style={styles.placeholder} />;

const TabBarLabel: React.FC<{
  routeName: string;
  color: string;
  focused: boolean;
}> = ({ routeName, color, focused }) => (
  <AppText variant={focused ? 'body6' : 'detail'} color={color}>
    {routeName === 'Home'
      ? '홈'
      : routeName === 'Schedule'
      ? '일정'
      : routeName === 'MeetingMinutes'
      ? '회의록'
      : routeName === 'Contract'
      ? '계약현황'
      : '기안'}
  </AppText>
);

const MainTabs: React.FC = () => {
  const getTabBarIcon = useCallback(
    (routeName: string, color: AppColor | string, focused: boolean) => {
      const size = ms(24);
      const variant = focused ? 'Bold' : 'Linear';

      switch (routeName) {
        case 'Home':
          return <Home2 size={size} color={color} variant={variant} />;
        case 'Schedule':
          return <Calendar size={size} color={color} variant={variant} />;
        case 'MeetingMinutes':
          return <ClipboardText size={size} color={color} variant={variant} />;
        case 'Contract':
          return <DocumentText size={size} color={color} variant={variant} />;
        case 'Draft':
          return <Document size={size} color={color} variant={variant} />;
        default:
          return null;
      }
    },
    [],
  );

  const getTabBarLabel = useCallback(
    (routeName: string, color: string, focused: boolean) => (
      <TabBarLabel routeName={routeName} color={color} focused={focused} />
    ),
    [],
  );

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, focused }) =>
          getTabBarIcon(route.name, color, focused),
        tabBarLabel: ({ color, focused }) =>
          getTabBarLabel(route.name, color, focused),
        tabBarActiveTintColor: AppColors.purple,
        tabBarInactiveTintColor: AppColors.gray50,
        tabBarStyle: styles.tabBar,
        tabBarItemStyle: styles.tabBarItem,
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />

      <Tab.Screen name="Schedule" component={ScheduleStack} />

      <Tab.Screen name="MeetingMinutes" component={MeetingMinutesStack} />

      <Tab.Screen name="Contract" component={ContractScreen} />

      <Tab.Screen name="Draft" component={DraftScreen} />
    </Tab.Navigator>
  );
};

const AppNavigator: React.FC = () => {
  return (
    <>
      <NavigationContainer>
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
          <RootStack.Screen name="MainTabs" component={MainTabs} />
          <RootStack.Screen name="DataRoom" component={DataRoomStack} />
          <RootStack.Screen
            name="BulletinBoard"
            component={MemoBulletinBoard}
          />
          <RootStack.Screen
            name="BulletinDetail"
            component={MemoBulletinDetail}
          />
          <RootStack.Screen
            name="CreateBulletin"
            component={MemoCreateBulletinScreen}
          />
        </RootStack.Navigator>
      </NavigationContainer>

      <Toast config={toastConfig} />
    </>
  );
};

export default AppNavigator;

const styles = StyleSheet.create({
  placeholder: {
    flex: 1,
    backgroundColor: AppColors.white,
  },
  tabBar: {
    height: ms(92),
    borderTopLeftRadius: ms(20),
    borderTopRightRadius: ms(20),
  },
  tabBarItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: ms(4),
    paddingTop: ms(8),
    paddingBottom: ms(24),
  },
});
