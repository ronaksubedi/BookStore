import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const normalizeApiBase = (value) => {
  const trimmed = value.trim().replace(/\/+$/, "");
  return /\/api$/i.test(trimmed) ? `${trimmed}/` : `${trimmed}/api/`;
};

const resolveApiBase = () => {
  const configuredBase =
    import.meta.env.VITE_API_BASE_URL ||
    import.meta.env.VITE_API_BASE ||
    import.meta.env.VITE_BACKEND_URL;

  const isLocalhostBase =
    typeof configuredBase === "string" && /(^|\/)(localhost|127\.0\.0\.1)(:\d+)?(\/|$)/i.test(configuredBase);

  if (configuredBase && (!isLocalhostBase || import.meta.env.DEV)) {
    return normalizeApiBase(configuredBase);
  }

  if (import.meta.env.DEV) {
    return normalizeApiBase("http://localhost:5000");
  }

  return normalizeApiBase("https://bookstore-ggcs.onrender.com");
};

const baseApi = resolveApiBase();

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