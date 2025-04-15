import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

const baseQuery = fetchBaseQuery({
    baseUrl: 'https://unitywomen-48288fd0e24a.herokuapp.com',
    credentials: 'include',
  });
export const apiSlice = createApi({
    baseQuery,
    tagTypes:['user'],
    endpoints:(builder) => ({})
})