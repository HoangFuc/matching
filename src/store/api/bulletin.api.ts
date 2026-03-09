import { API_BASE_URL, TOKEN } from '@env';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import {
  IBulletinListParams,
  IBulletinListResponse,
  IBulletinPost,
  ICreateBulletinParams,
} from '@/src/interface/bulletin.interface';

export const bulletinApi = createApi({
  reducerPath: 'bulletinApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/bulletins`,
    prepareHeaders: async headers => {
      const token = TOKEN;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['BulletinList', 'BulletinDetail'],
  endpoints: builder => ({
    //---------------------------------------
    getBulletins: builder.query<IBulletinListResponse, IBulletinListParams>({
      query: ({ limit, page }) => `?limit=${limit}&page=${page}`,
      transformResponse: (response: any): IBulletinListResponse => {
        if (response?.data && response?.meta) {
          return response;
        }
        return {
          data: response?.data?.data,
          meta: response?.meta ?? {
            page: 1,
            limit: 10,
            total: 0,
            totalPages: 0,
          },
        };
      },
      providesTags: ['BulletinList'],
    }),

    //---------------------------------------
    getBulletinDetail: builder.query<IBulletinPost, string>({
      query: postId => `/posts/${postId}`,
      transformResponse: (response: any): IBulletinPost =>
        response?.data ?? response,
      providesTags: (_result, _error, postId) => [
        { type: 'BulletinDetail', id: postId },
      ],
    }),

    //---------------------------------------
    createBulletin: builder.mutation<IBulletinPost, ICreateBulletinParams>({
      query: ({ title, content, images }) => {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        images?.forEach(image => {
          formData.append('images', {
            uri: image.uri,
            type: image.type || 'image/jpeg',
            name: image.name || 'image.jpg',
          } as any);
        });
        return {
          url: '',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['BulletinList'],
    }),
  }),
});

export const {
  useGetBulletinsQuery,
  useGetBulletinDetailQuery,
  useCreateBulletinMutation,
} = bulletinApi;
