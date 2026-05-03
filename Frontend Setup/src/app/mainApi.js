import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const base = 'http://localhost:5000';
const baseApi = `${base}/api/`;
export const mainApi = createApi({
  reducerPath: "mainApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseApi,
  }),
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => "/products",
    }),
  }),

})