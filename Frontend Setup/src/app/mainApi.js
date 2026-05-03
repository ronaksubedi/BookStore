import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const base =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_BASE ||
  "https://bookstore-ggcs.onrender.com";

const normalizedBase = base.replace(/\/+$/, "");
const baseApi = /\/api$/i.test(normalizedBase)
  ? `${normalizedBase}/`
  : `${normalizedBase}/api/`;

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

});

export { baseApi };