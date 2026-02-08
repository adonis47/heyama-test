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
      providesTags: (_result, _error, id) => [{ type: 'Object', id }],
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
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          objectsApi.util.updateQueryData('getObjects', { page: 1, limit: 20 }, (draft) => {
            draft.items = draft.items.filter((item) => item._id !== id);
            draft.total = Math.max(0, draft.total - 1);
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: (_result, _error, id) => [
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
