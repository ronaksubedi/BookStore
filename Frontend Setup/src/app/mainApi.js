import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const base = 'https://bookstore-ggcs.onrender.com/api/';
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