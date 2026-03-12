import {
  IAttendanceToday,
  IMyAttendanceResponse,
} from '@/src/interface/checkin.interface';
import { API_BASE_URL } from '@env';
import { getToken } from '@/src/services/tokenService';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const checkinApi = createApi({
  reducerPath: 'checkinApi',
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
  tagTypes: ['Attendance'],
  endpoints: builder => ({
    getAttendanceToday: builder.query<IAttendanceToday, void>({
      query: () => '/attendance/today',
      providesTags: ['Attendance'],
    }),
    //---------------------------------------
    getMyAttendance: builder.query<
      IMyAttendanceResponse,
      { startDate: string; endDate: string }
    >({
      query: ({ startDate, endDate }) =>
        `/attendance/my?startDate=${startDate}&endDate=${endDate}`,
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
      invalidatesTags: ['Attendance'],
    }),
  }),
});

export const {
  useGetAttendanceTodayQuery,
  useGetMyAttendanceQuery,
  useCheckinMutation,
} = checkinApi;
