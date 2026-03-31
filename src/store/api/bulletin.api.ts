import { API_BASE_URL } from '@env';
import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseQuery } from './baseQuery';
import { getCommonHeaders } from '@/src/services/apiHeaderService';

import {
  IBulletinComment,
  IBulletinCommentListResponse,
  IBulletinListParams,
  IBulletinListResponse,
  IBulletinPost,
  ICreateBulletinParams,
  ICreateCommentParams,
  IDeleteCommentParams,
  IToggleCommentLikeParams,
  IToggleLikeResponse,
  IUpdateCommentParams,
} from '@/src/interface/bulletin.interface';

export const bulletinApi = createApi({
  reducerPath: 'bulletinApi',
  baseQuery: createBaseQuery('/bulletins'),
  tagTypes: ['BulletinList', 'BulletinDetail', 'Comments'],
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
    toggleLike: builder.mutation<IToggleLikeResponse, string>({
      query: postId => ({
        url: `/posts/${postId}/likes`,
        method: 'POST',
      }),
      transformResponse: (response: any): IToggleLikeResponse =>
        response?.data ?? response,
      invalidatesTags: (_result, _error, postId) => [
        { type: 'BulletinDetail', id: postId },
      ],
    }),

    //---------------------------------------
    getComments: builder.query<IBulletinCommentListResponse, string>({
      query: postId => `/posts/${postId}/comments`,
      transformResponse: (response: any): IBulletinCommentListResponse =>
        response,
      providesTags: (_result, _error, postId) => [
        { type: 'Comments', id: postId },
      ],
    }),

    //---------------------------------------
    createComment: builder.mutation<IBulletinComment, ICreateCommentParams>({
      query: ({ postId, content, parentId }) => ({
        url: `/posts/${postId}/comments`,
        method: 'POST',
        body: { content, ...(parentId && { parentId }) },
      }),
      invalidatesTags: (_result, _error, { postId }) => [
        { type: 'Comments', id: postId },
      ],
    }),

    //---------------------------------------
    updateComment: builder.mutation<IBulletinComment, IUpdateCommentParams>({
      query: ({ commentId, content }) => ({
        url: `/comments/${commentId}`,
        method: 'PATCH',
        body: { content },
      }),
      invalidatesTags: (_result, _error, { postId }) => [
        { type: 'Comments', id: postId },
      ],
    }),

    //---------------------------------------
    deleteComment: builder.mutation<void, IDeleteCommentParams>({
      query: ({ commentId }) => ({
        url: `/comments/${commentId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, { postId }) => [
        { type: 'Comments', id: postId },
      ],
    }),

    //---------------------------------------
    toggleCommentLike: builder.mutation<
      IToggleLikeResponse,
      IToggleCommentLikeParams
    >({
      query: ({ commentId }) => ({
        url: `/comments/${commentId}/likes`,
        method: 'POST',
      }),
      transformResponse: (response: any): IToggleLikeResponse =>
        response?.data ?? response,
      invalidatesTags: (_result, _error, { postId }) => [
        { type: 'Comments', id: postId },
      ],
    }),

    //---------------------------------------
    createBulletin: builder.mutation<IBulletinPost, ICreateBulletinParams>({
      async queryFn({ title, content, images }) {
        try {
          const formData = new FormData();
          formData.append('title', title);
          formData.append('content', content);

          if (images?.length) {
            for (const image of images) {
              formData.append('images', {
                uri: image.uri,
                type: image.type || 'image/jpeg',
                name: image.name || 'image.jpg',
              } as any);
            }
          }

          const commonHeaders = await getCommonHeaders();
          const { 'Content-Type': _ct, ...headersWithoutCT } = commonHeaders;
          const res = await fetch(`${API_BASE_URL}/bulletins`, {
            method: 'POST',
            headers: headersWithoutCT,
            body: formData as unknown as BodyInit_,
          });

          if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            return { error: { status: res.status, data: errorData } };
          }

          const data: any = await res.json();
          return { data: data?.data ?? data };
        } catch (error: any) {
          return {
            error: { status: 'FETCH_ERROR', error: error.message },
          };
        }
      },
      invalidatesTags: ['BulletinList'],
    }),
  }),
});

export const {
  useGetBulletinsQuery,
  useGetBulletinDetailQuery,
  useGetCommentsQuery,
  useCreateBulletinMutation,
  useCreateCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
  useToggleLikeMutation,
  useToggleCommentLikeMutation,
} = bulletinApi;
