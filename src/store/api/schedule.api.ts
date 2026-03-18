import { ISchedule, ISchedulePayload } from '@/src/screens/schedule/type';
import { API_BASE_URL } from '@env';
import { getToken } from '@/src/services/tokenService';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const scheduleApi = createApi({
  reducerPath: 'scheduleApi',
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
  tagTypes: ['Schedule', 'Calendar'],
  endpoints: builder => ({
    getSchedules: builder.query<
      ISchedule[],
      { startDate: string; endDate: string }
    >({
      query: ({ startDate, endDate }) =>
        `/schedules?startDate=${startDate}&endDate=${endDate}`,
      transformResponse: (response: any) => {
        const data = response?.data?.data ?? response?.data ?? response;
        return Array.isArray(data) ? data : [];
      },
      providesTags: ['Schedule'],
    }),
    //---------------------------------------
    getSchedulesByDate: builder.query<ISchedule[], string>({
      query: date => `/schedules?startDate=${date}&endDate=${date}`,
      transformResponse: (response: any) => {
        const data = response?.data?.data ?? response?.data ?? response;
        return Array.isArray(data) ? data : [];
      },
      providesTags: ['Schedule'],
    }),
    //---------------------------------------
    createSchedule: builder.mutation<any, ISchedulePayload>({
      query: body => ({
        url: '/schedules',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Schedule'],
    }),
    // createFolder: builder.mutation<IFolder, ICreateFolderPayload>({
    //   query: body => ({
    //     url: '/folders',
    //     method: 'POST',
    //     body,
    //   }),
    //   invalidatesTags: ['Folders'],
    // }),
    // getFilesByFolder: builder.query<IFile[], string>({
    //   query: folderId => `/folders/${folderId}/files`,
    //   providesTags: (_result, _error, folderId) => [
    //     { type: 'Files', id: folderId },
    //   ],
    // }),
    // searchFiles: builder.query<IFile[], string>({
    //   query: keyword => `/files/search?keyword=${encodeURIComponent(keyword)}`,
    // }),
    // moveFile: builder.mutation<void, IMoveFilePayload>({
    //   query: ({ fileId, targetFolderId }) => ({
    //     url: `/files/${fileId}/move`,
    //     method: 'PUT',
    //     body: { targetFolderId },
    //   }),
    //   invalidatesTags: ['Files'],
    // }),
    // renameItem: builder.mutation<void, IRenamePayload>({
    //   query: ({ id, name, kind }) => ({
    //     url: `/${kind}s/${id}/rename`,
    //     method: 'PUT',
    //     body: { name },
    //   }),
    //   invalidatesTags: ['Folders', 'Files'],
    // }),
    // deleteFile: builder.mutation<void, string>({
    //   query: fileId => ({
    //     url: `/files/${fileId}`,
    //     method: 'DELETE',
    //   }),
    //   invalidatesTags: ['Files'],
    // }),
    // deleteFolder: builder.mutation<void, string>({
    //   query: folderId => ({
    //     url: `/folders/${folderId}`,
    //     method: 'DELETE',
    //   }),
    //   invalidatesTags: ['Folders'],
    // }),
  }),
});

export const {
  useGetSchedulesQuery,
  useGetSchedulesByDateQuery,
  useCreateScheduleMutation,
} = scheduleApi;
