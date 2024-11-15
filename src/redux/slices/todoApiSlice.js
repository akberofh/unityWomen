import { apiSlice } from './apiSlice';

const TODOS_URL = '/api/todos';

export const todoApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTodos: builder.query({
      query: () => ({
        url: `${TODOS_URL}/`,
      }),
    }),
    addTodo: builder.mutation({
      query: (todo) => ({
        url: `${TODOS_URL}/`,
        method: 'POST',
        body: todo,
      }),
    }),
    updateTodo: builder.mutation({
      query: (formData) => ({
        url: `https://unity-women-backend.vercel.app/api/todos/${formData.get('_id')}`, // Assuming your URL requires the ID
        method: 'PUT',
        body: formData,
      }),
    }),
    deleteTodo: builder.mutation({
      query: (id) => ({
        url: `${TODOS_URL}/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const { useGetTodosQuery, useAddTodoMutation, useDeleteTodoMutation, useUpdateTodoMutation } = todoApiSlice;


