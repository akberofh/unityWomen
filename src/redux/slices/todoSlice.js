import { createSlice } from '@reduxjs/toolkit';

const todoSlice = createSlice({
  name: 'todo',
  initialState: {
    userTodos: [],
  },
  reducers: {
    setTodos: (state, action) => {
      state.userTodos = action.payload;
    },
    addTodo: (state, action) => {
      state.userTodos.push(action.payload);
    },
    removeTodo: (state, action) => {
      state.userTodos = state.userTodos.filter(todo => todo._id !== action.payload);
    },
    updateTodo: (state, action) => {
      const index = state.userTodos.findIndex(todo => todo._id === action.payload._id);
      if (index !== -1) {
        state.userTodos[index] = { ...state.userTodos[index], ...action.payload };
      }
    },
  },
});

export const { setTodos, addTodo, removeTodo, updateTodo } = todoSlice.actions;

export default todoSlice.reducer;
