import { apiSlice } from './apiSlice';

const TODOS_URL = '/api/qolbaq';

export const qolbaqApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getQolbaq: builder.query({
      query: () => ({
        url: `${TODOS_URL}/`,
      }),
    }),
    addQolbaq: builder.mutation({
      query: (qolbaq) => ({
        url: `${TODOS_URL}/`,
        method: 'POST',
        body: qolbaq,
      }),
    }),
    updateQolbaq: builder.mutation({
        query: (id) => ({
            url: `${TODOS_URL}/${id}`,
            method: 'PUT',
            body: id
        })
    }),
    deleteQolbaq: builder.mutation({
      query: (id) => ({
        url: `${TODOS_URL}/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const { useGetQolbaqQuery, useAddQolbaqMutation, useDeleteQolbaqMutation, useUpdateQolbaqMutation } = qolbaqApiSlice;
