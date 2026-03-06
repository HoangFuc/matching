import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { CompositeNavigationProp, NavigatorScreenParams } from "@react-navigation/native";
import type { TScheduleEvent } from "./schedule.interface";
import type { TBulletinPost } from "./bulletin.interface";
import type { TMeetingMinutes } from "./meetingMinutes.interface";

export type RootStackParamList = {
  MainTabs: undefined;
  DataRoom: undefined;
  BulletinBoard: undefined;
  BulletinDetail: { post: TBulletinPost };
  CreateBulletin: undefined;
};

export type MeetingMinutesStackParamList = {
  MeetingMinutesMain: undefined;
  CreateMeetingMinutes: undefined;
  MeetingMinutesDetail: { item: TMeetingMinutes };
  EditMeetingMinutes: { item: TMeetingMinutes };
};

export type RootTabParamList = {
  Home: undefined;
  Schedule: NavigatorScreenParams<ScheduleStackParamList> | undefined;
  MeetingMinutes: undefined;
  Contract: undefined;
  Draft: undefined;
};

export type HomeStackParamList = {
  Dashboard: undefined;
};

export type TScheduleMode = 'schedule' | 'attendance';

export type ScheduleStackParamList = {
  ScheduleMain: { mode?: TScheduleMode } | undefined;
  ScheduleDetail: {
    dateKey: string;
    events: TScheduleEvent[];
  };
};

export type RootTabNavigationProp = BottomTabNavigationProp<RootTabParamList>;

export type DataRoomStackParamList = {
  DataRoomMain: undefined;
  DataRoomSearch: undefined;
  DataRoomDetail: {
    folderId: string;
    folderName: string;
  };
};

export type ScheduleNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<ScheduleStackParamList>,
  BottomTabNavigationProp<RootTabParamList>
>;

export type DataRoomNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<DataRoomStackParamList>,
  BottomTabNavigationProp<RootTabParamList>
>;
