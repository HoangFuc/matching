import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { CompositeNavigationProp } from "@react-navigation/native";
import type { TScheduleEvent } from "./schedule.interface";
import type { TBulletinPost } from "./bulletin.interface";

export type RootTabParamList = {
  Home: undefined;
  Schedule: undefined;
  Meeting: undefined;
  Contract: undefined;
  Draft: undefined;
};

export type RootStackParamList = {
  MainTabs: undefined;
  BulletinBoard: undefined;
  BulletinDetail: { post: TBulletinPost };
};

export type HomeStackParamList = {
  Dashboard: undefined;
};

export type ScheduleStackParamList = {
  ScheduleMain: undefined;
  ScheduleDetail: {
    dateKey: string;
    events: TScheduleEvent[];
  };
};

export type RootTabNavigationProp = BottomTabNavigationProp<RootTabParamList>;

export type ScheduleNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<ScheduleStackParamList>,
  BottomTabNavigationProp<RootTabParamList>
>;
