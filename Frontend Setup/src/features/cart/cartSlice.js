import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
  },
  reducers: {
    loadUserCart: (state, action) => {
      const userId = action.payload;
      const saved = localStorage.getItem(`cart_${userId}`);
      state.items = saved ? JSON.parse(saved) : [];
    },
    clearCartState: (state) => {
      state.items = [];
    },
    addToCart: (state, action) => {
      const { book, userId } = action.payload;
      const existing = state.items.find(item => item._id === book._id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...book, quantity: 1 });
      }
      localStorage.setItem(`cart_${userId}`, JSON.stringify(state.items));
    },
    removeFromCart: (state, action) => {
      const { id, userId } = action.payload;
      state.items = state.items.filter(item => item._id !== id);
      localStorage.setItem(`cart_${userId}`, JSON.stringify(state.items));
    },
    updateQuantity: (state, action) => {
      const { id, quantity, userId } = action.payload;
      const item = state.items.find(item => item._id === id);
      if (item) item.quantity = quantity;
      localStorage.setItem(`cart_${userId}`, JSON.stringify(state.items));
    },
    clearCart: (state, action) => {
      const userId = action.payload;
      state.items = [];
      if (userId) localStorage.removeItem(`cart_${userId}`);
    },
  },
});

export const {
  loadUserCart, clearCartState, addToCart,
  removeFromCart, updateQuantity, clearCart
} = cartSlice.actions;
export default cartSlice.reducer;