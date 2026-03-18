import React, { useCallback, useState, useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CommonActions, NavigationContainer, useFocusEffect } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { moderateScale as ms } from 'react-native-size-matters/extend';
import Toast from 'react-native-toast-message';

import { toastConfig } from '@/src/component/toastConfig';

import { AppText } from '@/src/component/AppText';
import { MemoUnderDevelopmentModal } from '@/src/component/UnderDevelopmentModal';
import { AppColor, AppColors } from '@/src/constants/colors';
import type {
  RootStackParamList,
  RootTabParamList,
} from '@/src/interface/tab.interface';
import { MemoBulletinDetail } from '../screens/bulletin/component/BulletinDetail';
import { MemoBulletinBoard } from '../screens/bulletin/screens/BulletinBoard';
import { MemoCreateBulletinScreen } from '../screens/bulletin/screens/CreateBulletinScreen';
import { MemoMeetingScheduleManagementScreen } from '../screens/meetingScheduleManagement/screens/MeetingScheduleManagementScreen';
import { MemoCreateMeetingScheduleScreen } from '../screens/meetingScheduleManagement/screens/CreateMeetingScheduleScreen';
import { MemoMeetingScheduleDetailScreen } from '../screens/meetingScheduleManagement/screens/MeetingScheduleDetailScreen';
import { MemoScheduleCalendarView } from '../screens/schedule/screens/ScheduleCalendarView';
import AuthStack from './AuthStack';
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
import { OverlayProvider, useOverlay } from '../providers/OverlayProvider';
import { MemoQuickActionFAB } from '../screens/dashboard/component/calendarAction/QuickActionModal';

const RootStack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();

const PlaceholderScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [showModal, setShowModal] = useState(true);

  //---------------------------------------
  const handleClose = useCallback(() => {
    setShowModal(false);
    navigation.goBack();
  }, [navigation]);

  //---------------------------------------
  useFocusEffect(
    useCallback(() => {
      setShowModal(true);
    }, []),
  );

  return (
    <View style={styles.placeholder}>
      <MemoUnderDevelopmentModal visible={showModal} onClose={handleClose} />
    </View>
  );
};

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

const FullScreenOverlay: React.FC = () => {
  const { overlayVisible, setOverlayVisible } = useOverlay();

  if (!overlayVisible) {
    return null;
  }

  return (
    <Pressable
      style={styles.overlay}
      onPress={() => setOverlayVisible(false)}
    />
  );
};

const MainTabs: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState('Home');
  const insets = useSafeAreaInsets();

  //---------------------------------------

  const tabBarStyle = useMemo(
    () => ({
      ...styles.tabBar,
      height: ms(70) + insets.bottom,
      paddingBottom: insets.bottom,
    }),
    [insets.bottom],
  );

  //---------------------------------------

  const getTabBarIcon = React.useCallback(
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

  //---------------------------------------

  const getTabBarLabel = React.useCallback(
    (routeName: string, color: string, focused: boolean) => (
      <TabBarLabel routeName={routeName} color={color} focused={focused} />
    ),
    [],
  );

  //---------------------------------------

  const handleTabChange = React.useCallback(
    (e: { data: { state: { routes: { name: string }[]; index: number } } }) => {
      const { routes, index } = e.data.state;
      setActiveTab(routes[index].name);
    },
    [],
  );

  return (
    <OverlayProvider>
      <View style={styles.tabNavigatorContainer}>
        <Tab.Navigator
          screenListeners={({ navigation, route }) => ({
            state: handleTabChange,
            blur: () => {
              const state = navigation.getState();
              const tabRoute = state.routes.find(
                (r: { name: string }) => r.name === route.name,
              );
              if (tabRoute?.state && tabRoute.state.routes.length > 1) {
                navigation.dispatch(
                  CommonActions.reset({
                    ...state,
                    routes: state.routes.map(
                      (r: { name: string }) =>
                        r.name === route.name
                          ? { ...r, state: undefined }
                          : r,
                    ),
                  }),
                );
              }
            },
          })}
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarIcon: ({ color, focused }) =>
              getTabBarIcon(route.name, color, focused),
            tabBarLabel: ({ color, focused }) =>
              getTabBarLabel(route.name, color, focused),
            tabBarActiveTintColor: AppColors.purple,
            tabBarInactiveTintColor: AppColors.gray50,
            tabBarStyle: tabBarStyle,
            tabBarItemStyle: styles.tabBarItem,
          })}
        >
          <Tab.Screen name="Home" component={HomeStack} />

          <Tab.Screen name="Schedule" component={ScheduleStack} />

          <Tab.Screen name="MeetingMinutes" component={MeetingMinutesStack} />

          <Tab.Screen name="Contract" component={PlaceholderScreen} />

          <Tab.Screen name="Draft" component={PlaceholderScreen} />
        </Tab.Navigator>
      </View>

      <FullScreenOverlay />
      {activeTab === 'Home' && <MemoQuickActionFAB />}
    </OverlayProvider>
  );
};

const AppNavigator: React.FC = () => {
  return (
    <>
      <NavigationContainer>
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
          <RootStack.Screen name="Auth" component={AuthStack} />
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
          <RootStack.Screen
            name="MeetingScheduleManagement"
            component={MemoMeetingScheduleManagementScreen}
          />
          <RootStack.Screen
            name="CreateMeetingSchedule"
            component={MemoCreateMeetingScheduleScreen}
          />
          <RootStack.Screen
            name="MeetingScheduleDetail"
            component={MemoMeetingScheduleDetailScreen}
          />
          <RootStack.Screen
            name="ScheduleCalendarView"
            component={MemoScheduleCalendarView}
          />
        </RootStack.Navigator>
      </NavigationContainer>

      <Toast config={toastConfig} />
    </>
  );
};

export default AppNavigator;

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    zIndex: 1,
  },
  placeholder: {
    flex: 1,
    backgroundColor: AppColors.white,
  },
  tabBar: {
    borderTopLeftRadius: ms(20),
    borderTopRightRadius: ms(20),
    backgroundColor: AppColors.white,
  },
  tabNavigatorContainer: {
    flex: 1,
    backgroundColor: AppColors.white,
  },
  tabBarItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: ms(4),
    paddingVertical: ms(12),
  },
});
