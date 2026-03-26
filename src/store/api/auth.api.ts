import { API_BASE_URL } from '@env';
import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseQuery } from './baseQuery';
import { getCommonHeaders } from '@/src/services/apiHeaderService';

import {
  IAuthTokenResponse,
  ICreateCompanyParams,
  ICreateInvitationParams,
  IInvitationDetailResponse,
  IInvitationLink,
  IJoinCompanyParams,
  ILoginParams,
  ILogoutParams,
  IOtpSendParams,
  IOtpSendResponse,
  IOtpVerifyParams,
  IOtpVerifyResponse,
  IRefreshTokenParams,
  IRefreshTokenResponse,
  IRegisterCompanyParams,
  IRegisterWithInviteParams,
  ISocialLoginParams,
} from '@/src/interface/auth.interface';

export type TInvitableRole = {
  slug: string;
  name: string;
};

export type TInvitablePositionTeam = {
  teamId: string;
  teamName: string;
};

export type TInvitablePosition = {
  departmentId: string;
  departmentName: string;
  teams: TInvitablePositionTeam[];
};

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: createBaseQuery('/auth'),
  tagTypes: ['Invitations'],
  endpoints: builder => ({
    //---------------------------------------
    sendOtp: builder.mutation<IOtpSendResponse, IOtpSendParams>({
      query: body => ({
        url: '/otp/send',
        method: 'POST',
        body,
      }),
      transformResponse: (response: any): IOtpSendResponse =>
        response?.data ?? response,
    }),

    //---------------------------------------
    verifyOtp: builder.mutation<IOtpVerifyResponse, IOtpVerifyParams>({
      query: body => ({
        url: '/otp/verify',
        method: 'POST',
        body,
      }),
      transformResponse: (response: any): IOtpVerifyResponse =>
        response?.data ?? response,
    }),

    //---------------------------------------
    login: builder.mutation<IAuthTokenResponse, ILoginParams>({
      async queryFn(body) {
        try {
          const jsonBody = JSON.stringify(body);
          console.log('[Login] Request body:', jsonBody);
          const res = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: jsonBody,
          });
          if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            return { error: { status: res.status, data: errorData } };
          }
          const json: any = await res.json();
          return { data: (json?.data ?? json) as IAuthTokenResponse };
        } catch (error: any) {
          return { error: { status: 'FETCH_ERROR', error: error.message } };
        }
      },
    }),

    //---------------------------------------
    socialLogin: builder.mutation<IAuthTokenResponse, ISocialLoginParams>({
      async queryFn(body) {
        try {
          const jsonBody = JSON.stringify(body);
          console.log('[SocialLogin] Request body:', jsonBody);
          const commonHeaders = await getCommonHeaders();
          const res = await fetch(`${API_BASE_URL}/auth/social-login`, {
            method: 'POST',
            headers: commonHeaders,
            body: jsonBody,
          });
          if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            return { error: { status: res.status, data: errorData } };
          }
          const json: any = await res.json();
          return { data: (json?.data ?? json) as IAuthTokenResponse };
        } catch (error: any) {
          return { error: { status: 'FETCH_ERROR', error: error.message } };
        }
      },
    }),

    //---------------------------------------
    registerCompany: builder.mutation<
      IAuthTokenResponse,
      IRegisterCompanyParams
    >({
      async queryFn(params) {
        try {
          const formData = new FormData();

          // Step 1 - JoinMembership
          formData.append('fullName', params.fullName);
          formData.append('phone', params.phone);
          formData.append('password', params.password);
          formData.append('passwordConfirm', params.passwordConfirm);
          formData.append(
            'phoneVerificationToken',
            params.phoneVerificationToken,
          );
          formData.append('termsAgreed', String(params.termsAgreed));
          formData.append('privacyAgreed', String(params.privacyAgreed));
          formData.append('marketingAgreed', String(params.marketingAgreed));

          // Step 2 - CreateAgency
          formData.append('companyName', params.companyName);
          formData.append('directorCount', String(params.directorCount));

          if (params.companyLogo) {
            formData.append('companyLogo', {
              uri: params.companyLogo.uri,
              type: params.companyLogo.type || 'image/jpeg',
              name: params.companyLogo.name || 'logo.jpg',
            } as any);
          }

          // Step 3 - OrgChartSetup
          formData.append('departments', params.departments);

          const commonHeaders = await getCommonHeaders();
          const { 'Content-Type': _ct, ...headersWithoutCT } = commonHeaders;
          const res = await fetch(`${API_BASE_URL}/auth/register-company`, {
            method: 'POST',
            headers: headersWithoutCT,
            body: formData as unknown as BodyInit_,
          });

          if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            return { error: { status: res.status, data: errorData } };
          }

          const json: any = await res.json();
          const data = json?.data?.data ?? json?.data ?? json;
          return { data: data as IAuthTokenResponse };
        } catch (error: any) {
          return {
            error: { status: 'FETCH_ERROR', error: error.message },
          };
        }
      },
    }),

    //---------------------------------------
    createCompany: builder.mutation<
      IAuthTokenResponse,
      ICreateCompanyParams
    >({
      async queryFn(params) {
        try {
          const formData = new FormData();

          formData.append('companyName', params.companyName);
          formData.append('directorCount', String(params.directorCount));

          if (params.companyLogo) {
            formData.append('companyLogo', {
              uri: params.companyLogo.uri,
              type: params.companyLogo.type || 'image/jpeg',
              name: params.companyLogo.name || 'logo.jpg',
            } as any);
          }

          formData.append('departments', params.departments);

          const commonHeaders = await getCommonHeaders();
          const { 'Content-Type': _ct, ...headersWithoutCT } = commonHeaders;
          const res = await fetch(`${API_BASE_URL}/auth/create-company`, {
            method: 'POST',
            headers: headersWithoutCT,
            body: formData as unknown as BodyInit_,
          });

          if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            return { error: { status: res.status, data: errorData } };
          }

          const json: any = await res.json();
          const data = json?.data?.data ?? json?.data ?? json;
          console.log('[CreateCompany] API response keys:', Object.keys(data));
          return { data: data as IAuthTokenResponse };
        } catch (error: any) {
          return {
            error: { status: 'FETCH_ERROR', error: error.message },
          };
        }
      },
    }),

    //---------------------------------------
    joinCompany: builder.mutation<IAuthTokenResponse, IJoinCompanyParams>({
      query: body => ({
        url: '/join-company',
        method: 'POST',
        body,
      }),
      transformResponse: (response: any): IAuthTokenResponse =>
        response?.data ?? response,
    }),

    //---------------------------------------
    registerWithInvite: builder.mutation<
      IAuthTokenResponse,
      IRegisterWithInviteParams
    >({
      query: body => ({
        url: '/register-with-invite',
        method: 'POST',
        body,
      }),
      transformResponse: (response: any): IAuthTokenResponse =>
        response?.data ?? response,
    }),

    //---------------------------------------
    createInvitation: builder.mutation<
      IInvitationLink,
      ICreateInvitationParams
    >({
      query: body => ({
        url: '/invitations',
        method: 'POST',
        body,
      }),
      transformResponse: (response: any): IInvitationLink =>
        response?.data ?? response,
      invalidatesTags: ['Invitations'],
    }),

    //---------------------------------------
    getInvitationByCode: builder.query<IInvitationDetailResponse, string>({
      query: code => `/invitations/${code}`,
      transformResponse: (response: any): IInvitationDetailResponse =>
        response?.data ?? response,
    }),

    //---------------------------------------
    refreshToken: builder.mutation<IRefreshTokenResponse, IRefreshTokenParams>({
      query: body => ({
        url: '/refresh',
        method: 'POST',
        body,
      }),
      transformResponse: (response: any): IRefreshTokenResponse =>
        response?.data ?? response,
    }),

    //---------------------------------------
    logout: builder.mutation<void, ILogoutParams>({
      query: body => ({
        url: '/logout',
        method: 'POST',
        body,
      }),
    }),

    //---------------------------------------
    getInvitableRoles: builder.query<TInvitableRole[], void>({
      query: () => '/company/invitable-roles',
      transformResponse: (response: any): TInvitableRole[] => {
        const data = response?.data ?? response;
        return data;
      },
    }),

    //---------------------------------------
    getInvitablePositions: builder.query<TInvitablePosition[], void>({
      query: () => '/company/invitable-positions',
      transformResponse: (response: any): TInvitablePosition[] => {
        const data = response?.data ?? response;
        return data;
      },
    }),
  }),
});

export const {
  useSendOtpMutation,
  useVerifyOtpMutation,
  useLoginMutation,
  useSocialLoginMutation,
  useJoinCompanyMutation,
  useRegisterCompanyMutation,
  useCreateCompanyMutation,
  useRegisterWithInviteMutation,
  useCreateInvitationMutation,
  useGetInvitationByCodeQuery,
  useLazyGetInvitationByCodeQuery,
  useRefreshTokenMutation,
  useLogoutMutation,

  useGetInvitableRolesQuery,
  useGetInvitablePositionsQuery,
} = authApi;
