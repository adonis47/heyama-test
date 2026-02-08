import { baseApi } from './baseApi';
import type { AuthResponse, SignupDto, SigninDto, User, ApiResponse } from '@heyama/shared';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    signup: builder.mutation<AuthResponse, SignupDto>({
      query: (credentials) => ({
        url: '/auth/signup',
        method: 'POST',
        body: credentials,
      }),
      transformResponse: (response: ApiResponse<AuthResponse>) => response.data,
    }),
    signin: builder.mutation<AuthResponse, SigninDto>({
      query: (credentials) => ({
        url: '/auth/signin',
        method: 'POST',
        body: credentials,
      }),
      transformResponse: (response: ApiResponse<AuthResponse>) => response.data,
    }),
    getMe: builder.query<User, void>({
      query: () => '/auth/me',
      transformResponse: (response: ApiResponse<User>) => response.data,
      providesTags: ['User'],
    }),
  }),
});

export const { useSignupMutation, useSigninMutation, useGetMeQuery } = authApi;
