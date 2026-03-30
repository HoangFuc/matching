import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseQuery } from './baseQuery';
import type { TMember, TStructure } from '@/src/screens/organizationChart/type';

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
  companyName?: string;
  removeDirector2Id?: string;
  appointDirector2Id?: string;
  kickMemberIds?: string[];
  departments: {
    id?: string;
    name: string;
    managedById?: string;
    headId?: string;
    teams: {
      id?: string;
      name: string;
      isDefault?: boolean;
      leaderId?: string;
      memberIds?: string[];
    }[];
  }[];
};

export type TMemberGroup = {
  role: string;
  members: TMember[];
};

export const companyApi = createApi({
  reducerPath: 'companyApi',
  baseQuery: createBaseQuery('/company'),
  tagTypes: ['Departments', 'Members', 'Structure'],
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
      invalidatesTags: ['Departments', 'Members', 'Structure'],
    }),

    //---------------------------------------
    getStructure: builder.query<TStructure, number | void>({
      query: (directorSlot = 1) => ({
        url: '/structure',
        params: { directorSlot },
      }),
      transformResponse: (response: any): TStructure => {
        const data = response?.data?.data ?? response?.data ?? response;
        return {
          ...data,
          canEdit: data.canEdit ?? false,
          departments: (data.departments ?? []).map((dept: any) => ({
            ...dept,
            canEdit: dept.canEdit ?? false,
          })),
        };
      },
      providesTags: ['Structure'],
    }),

    //---------------------------------------
    getMembers: builder.query<TMemberGroup[], void>({
      query: () => '/members',
      transformResponse: (response: any): TMemberGroup[] => {
        const data = response?.data?.data ?? response?.data ?? response;
        if (Array.isArray(data) && data.length > 0 && 'role' in data[0] && 'members' in data[0]) {
          return data;
        }
        const members: TMember[] = Array.isArray(data) ? data : [];
        const grouped = new Map<string, TMember[]>();
        for (const member of members) {
          const role = member.role;
          if (!grouped.has(role)) {
            grouped.set(role, []);
          }
          grouped.get(role)!.push(member);
        }
        return Array.from(grouped.entries()).map(([role, groupMembers]) => ({
          role,
          members: groupMembers,
        }));
      },
      providesTags: ['Members'],
    }),

  }),
});

export const {
  useGetDepartmentsQuery,
  useUpdateDepartmentsMutation,
  useGetStructureQuery,
  useGetMembersQuery,
} = companyApi;
