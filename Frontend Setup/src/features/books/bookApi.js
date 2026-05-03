import { mainApi } from "../../app/mainApi.js";

const bookApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({

    getBooks: builder.query({
      query: () => ({
        url: '/books',
        method: 'GET',
      }),
      providesTags: ['Books'],
    }),

    searchBooks: builder.query({
      query: (searchTerm) => ({
        url: `/books?search=${searchTerm}`,
        method: 'GET',
      }),
      providesTags: ['Books'],
    }),

    getBookById: builder.query({
      query: (id) => ({
        url: `/books/${id}`,
        method: 'GET',
      }),
      providesTags: ['Books'],
    }),

    rateBook: builder.mutation({
      query: ({ id, rating, userId }) => ({
        url: `/books/${id}/rate`,
        method: 'POST',
        body: { rating, userId },
      }),
      invalidatesTags: ['Books'],
    }),

  }),
});

export const { useGetBooksQuery, useSearchBooksQuery, useGetBookByIdQuery, useRateBookMutation } = bookApi;