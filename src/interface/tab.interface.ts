import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type {
  CompositeNavigationProp,
  NavigatorScreenParams,
} from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { TScheduleType } from '../screens/schedule/component/ScheduleTypePicker';
import { TScheduleMode } from '../screens/schedule/type';
import type { TMeetingMinutes } from './meetingMinutes.interface';
import type { IMeetingScheduleManagement } from './meetingScheduleManagement.interface';
import type { TScheduleEvent } from './schedule.interface';

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<RootTabParamList> | undefined;
  DataRoom: undefined;
  BulletinBoard: undefined;
  BulletinDetail: { postId: string };
  CreateBulletin: undefined;
  MeetingScheduleManagement: undefined;
  CreateMeetingSchedule: undefined;
  MeetingScheduleDetail: { item: IMeetingScheduleManagement };
};

export type MeetingMinutesStackParamList = {
  MeetingMinutesMain: undefined;
  CreateMeetingMinutes: undefined;
  MeetingMinutesDetail: { id: string };
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

export type ScheduleStackParamList = {
  ScheduleMain: { mode?: TScheduleMode; filterTypes?: TScheduleType[] } | undefined;
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
