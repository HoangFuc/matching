import {
  IAttendanceToday,
  IMyAttendanceResponse,
} from '@/src/interface/checkin.interface';
import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseQuery } from './baseQuery';

export const checkinApi = createApi({
  reducerPath: 'checkinApi',
  baseQuery: createBaseQuery(),
  tagTypes: ['Attendance'],
  endpoints: builder => ({
    getAttendanceToday: builder.query<IAttendanceToday, void>({
      query: () => '/attendance/today',
      transformResponse: (response: any): IAttendanceToday => {
        const data = response?.data ?? response;
        return data;
      },
      providesTags: ['Attendance'],
    }),
    //---------------------------------------
    getMyAttendance: builder.query<
      IMyAttendanceResponse,
      { startDate: string; endDate: string }
    >({
      query: ({ startDate, endDate }) =>
        `/attendance/my?startDate=${startDate}&endDate=${endDate}`,
      transformResponse: (response: { data: IMyAttendanceResponse }) => ({
        records: response.data.records,
        summary: response.data.summary,
      }),
      providesTags: ['Attendance'],
    }),
    //---------------------------------------
    checkin: builder.mutation<
      IAttendanceToday,
      { latitude: number; longitude: number }
    >({
      query: body => ({
        url: '/attendance/check-in',
        method: 'POST',
        body,
      }),
      invalidatesTags: (_result, error) => (error ? [] : ['Attendance']),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const raw = (data as any)?.data ?? data;
          dispatch(
            checkinApi.util.updateQueryData(
              'getAttendanceToday',
              undefined,
              () => ({
                checkedIn: true,
                checkInTime: raw.checkInTime ?? raw.createdAt ?? null,
              }),
            ),
          );
        } catch {
          // invalidatesTags will handle refetch on error
        }
      },
    }),
  }),
});

export const {
  useGetAttendanceTodayQuery,
  useGetMyAttendanceQuery,
  useCheckinMutation,
} = checkinApi;
