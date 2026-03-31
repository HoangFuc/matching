import {
  ICreateMeetingLogPayload,
  ICreateMeetingLogResponse,
  IDeleteRecordingResponse,
  IMeetingLogListParams,
  IMeetingLogListResponse,
  IUpdateMeetingLogPayload,
  TMeetingMinutes,
} from '@/src/interface/meetingMinutes.interface';
import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseQuery } from './baseQuery';

export const meetingLogApi = createApi({
  reducerPath: 'meetingLogApi',
  baseQuery: createBaseQuery('/meeting-logs'),
  tagTypes: ['MeetingLogList', 'MeetingLogDetail'],
  endpoints: builder => ({
    //---------------------------------------
    createMeetingLog: builder.mutation<
      ICreateMeetingLogResponse,
      ICreateMeetingLogPayload
    >({
      query: body => ({
        url: '',
        method: 'POST',
        body,
      }),
      transformResponse: (response: any) => {
        return response?.data;
      },
      invalidatesTags: ['MeetingLogList'],
    }),
    //---------------------------------------
    updateMeetingLog: builder.mutation<TMeetingMinutes, IUpdateMeetingLogPayload>(
      {
        query: ({ id, ...body }) => ({
          url: `/${id}`,
          method: 'PUT',
          body,
        }),
        transformResponse: (response: any) => {
          return response?.data ?? response;
        },
        invalidatesTags: ['MeetingLogList', 'MeetingLogDetail'],
      },
    ),
    //---------------------------------------
    deleteRecording: builder.mutation<
      IDeleteRecordingResponse,
      string
    >({
      query: id => ({
        url: `/${id}/recordings`,
        method: 'PUT',
      }),
      transformResponse: (response: any) => {
        return response?.data ?? response;
      },
      invalidatesTags: ['MeetingLogDetail'],
    }),
    //---------------------------------------
    getMeetingLogDetail: builder.query<TMeetingMinutes, string>({
      query: id => `/${id}`,
      transformResponse: (response: any) => {
        return response?.data ?? response;
      },
      providesTags: ['MeetingLogDetail'],
    }),
    //---------------------------------------
    getMeetingLogs: builder.query<
      IMeetingLogListResponse,
      IMeetingLogListParams
    >({
      query: params => {
        const searchParams = new URLSearchParams();
        if (params.page) searchParams.append('page', String(params.page));
        if (params.limit) searchParams.append('limit', String(params.limit));
        if (params.search) searchParams.append('search', params.search);
        if (params.sortBy) searchParams.append('sortBy', params.sortBy);
        if (params.sortOrder)
          searchParams.append('sortOrder', params.sortOrder);
        if (params.startDate)
          searchParams.append('startDate', params.startDate);
        if (params.endDate) searchParams.append('endDate', params.endDate);
        if (params.meetingType)
          searchParams.append('meetingType', params.meetingType);
        return `?${searchParams.toString()}`;
      },
      transformResponse: (response: any): IMeetingLogListResponse => {
        const inner = response?.data;
        return {
          data: inner?.data ?? response?.data ?? [],
          meta: inner?.meta ?? response?.meta ?? {
            page: 1,
            limit: 20,
            total: 0,
            totalPages: 0,
          },
        };
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      serializeQueryArgs: ({ queryArgs: { page, ...rest } }) => {
        return rest;
      },
      merge: (currentCache, newItems) => {
        if (newItems.meta.page === 1) {
          return newItems;
        }
        const existingIds = new Set(currentCache.data.map(item => item.id));
        const uniqueNewItems = newItems.data.filter(
          item => !existingIds.has(item.id),
        );
        return {
          data: [...currentCache.data, ...uniqueNewItems],
          meta: newItems.meta,
        };
      },
      forceRefetch: ({ currentArg, previousArg }) => {
        return currentArg !== previousArg;
      },
      providesTags: ['MeetingLogList'],
    }),
  }),
});

export const {
  useGetMeetingLogsQuery,
  useCreateMeetingLogMutation,
  useUpdateMeetingLogMutation,
  useDeleteRecordingMutation,
  useGetMeetingLogDetailQuery,
  useLazyGetMeetingLogDetailQuery,
} = meetingLogApi;
