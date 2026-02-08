import { baseApi } from './baseApi';
import type { AuthResponse, SignupDto, SigninDto, User } from '@heyama/shared';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    signup: builder.mutation<AuthResponse, SignupDto>({
      query: (credentials) => ({
        url: '/auth/signup',
        method: 'POST',
        body: credentials,
      }),
    }),
    signin: builder.mutation<AuthResponse, SigninDto>({
      query: (credentials) => ({
        url: '/auth/signin',
        method: 'POST',
        body: credentials,
      }),
    }),
    getMe: builder.query<User, void>({
      query: () => '/auth/me',
      providesTags: ['User'],
    }),
  }),
});

export const { useSignupMutation, useSigninMutation, useGetMeQuery } = authApi;
