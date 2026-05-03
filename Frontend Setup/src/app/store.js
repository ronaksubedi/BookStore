import { configureStore } from "@reduxjs/toolkit";
import { mainApi } from "./mainApi.js";
import userReducer from "../features/auth/userSlice.js";
import cartReduer from "../features/cart/cartSlice.js";

export const store = configureStore({
  reducer: {
    [mainApi.reducerPath]: mainApi.reducer,
    cart: cartReduer,
    user: userReducer
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(mainApi.middleware)
});