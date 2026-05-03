import { createSlice } from "@reduxjs/toolkit";

const getUserFromLocal = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: getUserFromLocal(),
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    removeUser: (state) => {
      state.user = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  },
});

export default userSlice.reducer;