import {
  ICreateMeetingSchedulePayload,
  IMeetingScheduleListParams,
  IMeetingScheduleListResponse,
  IMeetingScheduleManagement,
} from '@/src/interface/meetingScheduleManagement.interface';
import { getToken } from '@/src/services/tokenService';
import { API_BASE_URL } from '@env';
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
      const token = await getToken();
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['MeetingScheduleManagement'],
  endpoints: builder => ({
    getMeetingSchedules: builder.query<
      IMeetingScheduleListResponse,
      IMeetingScheduleListParams
    >({
      query: params => {
        const searchParams = new URLSearchParams();
        if (params.page) searchParams.append('page', String(params.page));
        if (params.limit) searchParams.append('limit', String(params.limit));
        searchParams.append('startDate', params.startDate);
        searchParams.append('endDate', params.endDate);
        searchParams.append('scope', params.scope);
        searchParams.append('scheduleType', 'customer_meeting');
        return `/schedules?${searchParams.toString()}`;
      },
      transformResponse: (response: any): IMeetingScheduleListResponse => {
        const inner = response?.data;
        return {
          data: inner?.data ?? response?.data ?? [],
          meta: inner?.meta ??
            response?.meta ?? {
              page: 1,
              limit: 20,
              total: 0,
              totalPages: 0,
            },
        };
      },
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
