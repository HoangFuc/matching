import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseQuery } from './baseQuery';

export type TUserCompany = {
  id: string;
  name: string;
  logoUrl: string | null;
};

export type TUserRole = {
  id: string;
  name: string;
  slug: string;
};

export type TUserDepartment = {
  id: string;
  name: string;
} | null;

export type TUserTeam = {
  id: string;
  name: string;
} | null;

export type TUserProfile = {
  id: string;
  fullName: string;
  phone: string;
  email: string | null;
  avatarUrl: string | null;
  company: TUserCompany;
  role: TUserRole;
  department: TUserDepartment;
  team: TUserTeam;
};

export type TUpdateProfileParams = {
  fullName?: string;
  phone?: string;
  phoneVerificationToken?: string;
};

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: createBaseQuery('/user'),
  tagTypes: ['UserProfile'],
  endpoints: builder => ({
    //---------------------------------------
    getUserProfile: builder.query<TUserProfile, void>({
      query: () => '/profile',
      transformResponse: (response: any): TUserProfile => {
        const data = response?.data ?? response;
        return data;
      },
      providesTags: ['UserProfile'],
    }),

    //---------------------------------------
    updateProfile: builder.mutation<TUserProfile, TUpdateProfileParams>({
      query: body => ({
        url: '/profile',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['UserProfile'],
    }),
  }),
});

export const { useGetUserProfileQuery, useUpdateProfileMutation } = userApi;
