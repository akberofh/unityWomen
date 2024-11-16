import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

const baseQuery = fetchBaseQuery({
    baseUrl: 'https://unity-women-backend.vercel.app',
    credentials: 'include',
  });
export const apiSlice = createApi({
    baseQuery,
    tagTypes:['defolt'],
    endpoints:(builder) => ({})
})