import { ISchedule } from '@/src/screens/schedule/type';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '@env';

export const scheduleApi = createApi({
  reducerPath: 'dataRoomApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}`,
    prepareHeaders: async headers => {
      // const auth = await _retrieveData('auth');
      const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyIiwiZW1haWwiOiJkZXZAdGVzdC5jb20iLCJpYXQiOjE3NzI3OTE2MTAsImV4cCI6MTc3MzM5NjQxMH0.b0MvbVjnXGtcG3VqTi_CvU_pVB_BwpzqPl2s-PujXeA';
      // const token = JSON.parse(auth || '{}')?.accessToken;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Schedule', 'Calendar'],
  endpoints: builder => ({
    getSchedules: builder.query<ISchedule[], { startDate: string; endDate: string }>({
      query: ({ startDate, endDate }) => `/schedules?startDate=${startDate}&endDate=${endDate}`,
      transformResponse: (response: any) =>
        Array.isArray(response) ? response : response?.data ?? [],
      providesTags: ['Schedule'],
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

export const { useGetSchedulesQuery } = scheduleApi;
