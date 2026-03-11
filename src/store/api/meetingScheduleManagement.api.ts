import { MeetingScheduleScopeEnum } from '@/src/constants/meetingSchedule';
import {
  ICreateMeetingSchedulePayload,
  IMeetingScheduleManagement,
} from '@/src/interface/meetingScheduleManagement.interface';
import { API_BASE_URL, TOKEN } from '@env';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface ICreateMeetingLogPayload {
  scheduleId: string;
  content: string;
}

export interface ICreateMeetingLogResponse {
  uploadId: string;
}

export const meetingScheduleManagementApi = createApi({
  reducerPath: 'meetingScheduleManagementApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}`,
    prepareHeaders: async headers => {
      const token = TOKEN;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['MeetingScheduleManagement'],
  endpoints: builder => ({
    getMeetingSchedules: builder.query<
      IMeetingScheduleManagement[],
      {
        startDate: string;
        endDate: string;
        scope: MeetingScheduleScopeEnum;
      }
    >({
      query: ({ startDate, endDate, scope }) =>
        `/schedules?startDate=${startDate}&endDate=${endDate}&scheduleType=customer_meeting&scope=${scope}`,
      transformResponse: (response: any) =>
        Array.isArray(response) ? response : response?.data ?? [],
      providesTags: ['MeetingScheduleManagement'],
    }),
    //---------------------------------------
    getMeetingScheduleDetail: builder.query<IMeetingScheduleManagement, string>(
      {
        query: id => `/schedules/${id}`,
        transformResponse: (response: any) => response?.data ?? response,
        providesTags: (_result, _error, id) => [
          { type: 'MeetingScheduleManagement', id },
        ],
      },
    ),
    //---------------------------------------
    createMeetingSchedule: builder.mutation<any, ICreateMeetingSchedulePayload>(
      {
        query: body => ({
          url: '/schedules',
          method: 'POST',
          body: { ...body, scheduleType: 'customer_meeting' },
        }),
        invalidatesTags: ['MeetingScheduleManagement'],
      },
    ),
    //---------------------------------------
    createMeetingLog: builder.mutation<
      ICreateMeetingLogResponse,
      ICreateMeetingLogPayload
    >({
      query: ({ scheduleId, content }) => ({
        url: `/schedules/${scheduleId}/meeting-log`,
        method: 'POST',
        body: { content },
      }),
      transformResponse: (response: any) => response?.data ?? response,
    }),
    //---------------------------------------
    cancelRecordingUpload: builder.mutation<void, string>({
      query: uploadId => ({
        url: `/meeting-logs/uploads/${uploadId}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetMeetingSchedulesQuery,
  useGetMeetingScheduleDetailQuery,
  useCreateMeetingScheduleMutation,
  useCreateMeetingLogMutation,
  useCancelRecordingUploadMutation,
} = meetingScheduleManagementApi;
