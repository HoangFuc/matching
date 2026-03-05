import React, { useCallback } from "react";
import { StyleSheet, View } from "react-native";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import {
  Calendar,
  ClipboardText,
  Document,
  DocumentText,
  Home2,
} from "iconsax-react-nativejs";
import { moderateScale as ms, s } from "react-native-size-matters/extend";

import { AppText } from "@/src/component/AppText";
import { AppColor, AppColors } from "@/src/constants/colors";
import { Dashboard } from "../screens/dashboard/Dashboard";
import ScheduleStack from "./ScheduleStack";

const Tab = createBottomTabNavigator();
const MeetingScreen = () => (
  <View style={styles.placeholder} />
);
const ContractScreen = () => (
  <View style={styles.placeholder} />
);
const DraftScreen = () => (
  <View style={styles.placeholder} />
);

const AppNavigator: React.FC = () => {
  const getTabBarIcon = useCallback(
    (routeName: string, color: AppColor | string, focused: boolean) => {
      const size = `${ms(24)}`;
      const variant = focused ? "Bold" : "Linear";

      switch (routeName) {
        case "Home":
          return <Home2 size={size} color={color} variant={variant} />;
        case "Schedule":
          return <Calendar size={size} color={color} variant={variant} />;
        case "Meeting":
          return <ClipboardText size={size} color={color} variant={variant} />;
        case "Contract":
          return <DocumentText size={size} color={color} variant={variant} />;
        case "Draft":
          return <Document size={size} color={color} variant={variant} />;
        default:
          return null;
      }
    },
    [],
  );

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ color, focused }) =>
            getTabBarIcon(route.name, color, focused),
          tabBarLabel: ({ color, focused }) => (
            <AppText variant={focused ? "body6" : "detail"} color={color}>
              {route.name === "Home"
                ? "홈"
                : route.name === "Schedule"
                  ? "일정"
                  : route.name === "Meeting"
                    ? "회의록"
                    : route.name === "Contract"
                      ? "계약현황"
                      : "기안"}
            </AppText>
          ),
          tabBarActiveTintColor: AppColors.purple,
          tabBarInactiveTintColor: AppColors.gray50,
          tabBarStyle: styles.tabBar,
          tabBarItemStyle: styles.tabBarItem,
        })}
      >
        <Tab.Screen name="Home" component={Dashboard} />

        <Tab.Screen name="Schedule" component={ScheduleStack} />

        <Tab.Screen name="Meeting" component={MeetingScreen} />

        <Tab.Screen name="Contract" component={ContractScreen} />

        <Tab.Screen name="Draft" component={DraftScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

const styles = StyleSheet.create({
  placeholder: {
    flex: 1,
    backgroundColor: AppColors.white,
  },
  tabBar: {
    width: s(375),
    height: s(92),
    borderTopLeftRadius: ms(20),
    borderTopRightRadius: ms(20),
  },
  tabBarItem: {
    alignItems: "center",
    justifyContent: "center",
    gap: ms(4),
    paddingTop: ms(8),
    paddingHorizontal: ms(13),
    paddingBottom: ms(24),
    width: s(65.4),
    height: s(64),
  },
});
