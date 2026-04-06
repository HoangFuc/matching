import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type {
  CompositeNavigationProp,
  NavigatorScreenParams,
} from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { TScheduleType } from '../screens/schedule/component/ScheduleTypePicker';
import { TScheduleMode } from '../screens/schedule/type';
import type {
  ICompanyResponse,
  IInvitationDetailResponse,
} from './auth.interface';
import type { TMeetingMinutes } from './meetingMinutes.interface';
import type { Department } from '../screens/auth/hooks/useOrgChartDepartments';
import type { IMeetingScheduleManagement } from './meetingScheduleManagement.interface';

export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  JoinOrganization:
    | { fromSocialLogin?: boolean; inviteCode?: string }
    | undefined;
  ConfirmOrganizationInvitation: {
    invitation: IInvitationDetailResponse;
    inviteCode: string;
    fromSocialLogin?: boolean;
  };
  JoinMembership: { withSteps?: boolean; inviteCode?: string } | undefined;
  CreateAgency: { fromSocialLogin?: boolean } | undefined;
  OrgChartSetup:
    | {
        managementType?: 'single' | 'dual';
        hideStepBar?: boolean;
        fromSocialLogin?: boolean;
      }
    | undefined;
  InviteMember:
    | {
        company?: ICompanyResponse;
        departments?: Department[];
        directorCount?: number;
        hideStepBar?: boolean;
      }
    | undefined;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList> | undefined;
  MainTabs: NavigatorScreenParams<RootTabParamList> | undefined;
  DataRoom: undefined;
  BulletinBoard: undefined;
  BulletinDetail: { postId: string };
  CreateBulletin: undefined;
  MeetingScheduleManagement: undefined;
  CreateMeetingSchedule: undefined;
  MeetingScheduleDetail: { item: IMeetingScheduleManagement };
  ScheduleCalendarView: { filterTypes?: TScheduleType[] };
  OrganizationChart: undefined;
  MyPage: undefined;
  OrgChartSetup:
    | {
        managementType?: 'single' | 'dual';
        hideStepBar?: boolean;
        fromSocialLogin?: boolean;
      }
    | undefined;
  InviteMember:
    | {
        company?: ICompanyResponse;
        departments?: Department[];
        directorCount?: number;
        hideStepBar?: boolean;
      }
    | undefined;
};

export type MeetingMinutesStackParamList = {
  MeetingMinutesMain: undefined;
  CreateMeetingMinutes: undefined;
  MeetingMinutesDetail: { id: string };
  EditMeetingMinutes: { item: TMeetingMinutes };
};

export type RootTabParamList = {
  Home: NavigatorScreenParams<HomeStackParamList> | undefined;
  Schedule: NavigatorScreenParams<ScheduleStackParamList> | undefined;
  MeetingMinutes: undefined;
  Contract: undefined;
  Draft: undefined;
};

export type HomeStackParamList = {
  Dashboard: undefined;
};

export type ScheduleStackParamList = {
  ScheduleMain:
    | {
        mode?: TScheduleMode;
        filterTypes?: TScheduleType[];
        hideTabBar?: boolean;
      }
    | undefined;
  ScheduleDetail: {
    dateKey: string;
  };
};

export type RootTabNavigationProp = BottomTabNavigationProp<RootTabParamList>;

export type DataRoomStackParamList = {
  DataRoomMain: undefined;
  DataRoomSearch: undefined;
  DataRoomDetail: {
    folderId: string;
    folderName: string;
    tabType: import('../screens/dataRoom/constants').TDataRoomTabType;
  };
  DataRoomFileViewer: {
    fileName: string;
    downloadUrl: string;
    mimeType: string;
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
