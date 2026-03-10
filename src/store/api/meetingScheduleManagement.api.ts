import {
  ICreateMeetingSchedulePayload,
  IMeetingScheduleManagement,
} from '@/src/interface/meetingScheduleManagement.interface';
import { API_BASE_URL, TOKEN } from '@env';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface IUploadRecordingPayload {
  id: string;
  filePath: string;
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
      { startDate: string; endDate: string }
    >({
      query: ({ startDate, endDate }) =>
        `/meeting-schedules?startDate=${startDate}&endDate=${endDate}`,
      transformResponse: (response: any) =>
        Array.isArray(response) ? response : response?.data ?? [],
      providesTags: ['MeetingScheduleManagement'],
    }),
    //---------------------------------------
    getMeetingScheduleDetail: builder.query<IMeetingScheduleManagement, string>({
      query: id => `/meeting-schedules/${id}`,
      transformResponse: (response: any) => response?.data ?? response,
      providesTags: (_result, _error, id) => [
        { type: 'MeetingScheduleManagement', id },
      ],
    }),
    //---------------------------------------
    createMeetingSchedule: builder.mutation<any, ICreateMeetingSchedulePayload>({
      query: body => ({
        url: '/meeting-schedules',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['MeetingScheduleManagement'],
    }),
    //---------------------------------------
    completeMeetingSchedule: builder.mutation<any, string>({
      query: id => ({
        url: `/meeting-schedules/${id}/complete`,
        method: 'PUT',
      }),
      invalidatesTags: ['MeetingScheduleManagement'],
    }),
    //---------------------------------------
    uploadRecording: builder.mutation<any, IUploadRecordingPayload>({
      queryFn: async ({ id, filePath }) => {
        try {
          const fileName = filePath.split('/').pop() ?? 'recording.m4a';
          const ext = fileName.split('.').pop()?.toLowerCase() ?? 'm4a';
          const mimeMap: Record<string, string> = {
            m4a: 'audio/m4a',
            mp4: 'audio/mp4',
            '3gp': 'audio/3gpp',
            wav: 'audio/wav',
            aac: 'audio/aac',
          };
          const mimeType = mimeMap[ext] ?? 'audio/octet-stream';

          const formData = new FormData();
          formData.append('file', {
            uri: filePath,
            type: mimeType,
            name: fileName,
          } as any);

          const response = await fetch(
            `${API_BASE_URL}/meeting-schedules/${id}/recording`,
            {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${TOKEN}`,
              },
              body: formData,
            },
          );

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return { error: { status: response.status, data: errorData } };
          }

          const data = await response.json();
          return { data: data?.data ?? data };
        } catch (err) {
          return { error: { status: 'FETCH_ERROR', error: String(err) } };
        }
      },
      invalidatesTags: (_r, _e, { id }) => [
        { type: 'MeetingScheduleManagement', id },
      ],
    }),
  }),
});

export const {
  useGetMeetingSchedulesQuery,
  useGetMeetingScheduleDetailQuery,
  useCreateMeetingScheduleMutation,
  useCompleteMeetingScheduleMutation,
  useUploadRecordingMutation,
} = meetingScheduleManagementApi;
