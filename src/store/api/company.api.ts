import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseQuery } from './baseQuery';

export type TCompanyTeam = {
  id: string;
  name: string;
  isDefault: boolean;
  sortOrder: number;
  memberCount: number;
};

export type TCompanyDepartment = {
  id: string;
  name: string;
  sortOrder: number;
  memberCount: number;
  teams: TCompanyTeam[];
};

export type TUpdateDepartmentsParams = {
  departments: {
    id?: string;
    name: string;
    teams: {
      id?: string;
      name: string;
      isDefault: boolean;
    }[];
  }[];
};

export const companyApi = createApi({
  reducerPath: 'companyApi',
  baseQuery: createBaseQuery('/company'),
  tagTypes: ['Departments'],
  endpoints: builder => ({
    //---------------------------------------
    getDepartments: builder.query<TCompanyDepartment[], void>({
      query: () => '/departments',
      transformResponse: (response: any): TCompanyDepartment[] => {
        const data = response?.data ?? response;
        return data;
      },
      providesTags: ['Departments'],
    }),

    //---------------------------------------
    updateDepartments: builder.mutation<void, TUpdateDepartmentsParams>({
      query: body => ({
        url: '/departments',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Departments'],
    }),

  }),
});

export const { useGetDepartmentsQuery, useUpdateDepartmentsMutation } =
  companyApi;
