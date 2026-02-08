import { baseApi } from './baseApi';
import type { ObjectItem, PaginatedResponse, ApiResponse } from '@heyama/shared';

export const objectsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getObjects: builder.query<PaginatedResponse<ObjectItem>, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 10 } = {}) => `/objects?page=${page}&limit=${limit}`,
      transformResponse: (response: ApiResponse<PaginatedResponse<ObjectItem>>) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ _id }) => ({ type: 'Object' as const, id: _id })),
              { type: 'Object', id: 'LIST' },
            ]
          : [{ type: 'Object', id: 'LIST' }],
    }),
    getObject: builder.query<ObjectItem, string>({
      query: (id) => `/objects/${id}`,
      transformResponse: (response: ApiResponse<ObjectItem>) => response.data,
      providesTags: (result, error, id) => [{ type: 'Object', id }],
    }),
    createObject: builder.mutation<ObjectItem, FormData>({
      query: (formData) => ({
        url: '/objects',
        method: 'POST',
        body: formData,
      }),
      transformResponse: (response: ApiResponse<ObjectItem>) => response.data,
      invalidatesTags: [{ type: 'Object', id: 'LIST' }],
    }),
    deleteObject: builder.mutation<void, string>({
      query: (id) => ({
        url: `/objects/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Object', id },
        { type: 'Object', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetObjectsQuery,
  useGetObjectQuery,
  useCreateObjectMutation,
  useDeleteObjectMutation,
} = objectsApi;
