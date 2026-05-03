import { createSlice } from "@reduxjs/toolkit";

// ✅ get userId safely
const getUserId = () => {
try {
const user = JSON.parse(localStorage.getItem("user"));
return user?.\_id || "guest";
} catch {
return "guest";
}
};

// ✅ get cart based on user
const getCartFromLocal = () => {
const userId = getUserId();
const cart = localStorage.getItem(`cart_${userId}`);
return cart ? JSON.parse(cart) : [];
};

// ✅ save cart based on user
const saveCartToLocal = (items) => {
const userId = getUserId();
localStorage.setItem(`cart_${userId}`, JSON.stringify(items));
};

const cartSlice = createSlice({
name: "cart",
initialState: {
items: getCartFromLocal(),
},

reducers: {
loadCart: (state) => {
state.items = getCartFromLocal();
},
addToCart: (state, action) => {
const existing = state.items.find(item => item.\_id === action.payload.\_id);

      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }

      saveCartToLocal(state.items); // ✅ updated
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item._id !== action.payload);
      saveCartToLocal(state.items); // ✅ updated
    },

    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item._id === id);

      if (item) {
        item.quantity = quantity;
      }

      saveCartToLocal(state.items); // ✅ updated
    },

    clearCart: (state) => {
      state.items = [];
      const userId = getUserId();
      localStorage.removeItem(`cart_${userId}`); // ✅ updated
    },

},
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, loadCart } = cartSlice.actions;
export default cartSlice.reducer;

cart slice for backup👆

import { useNavigate, Link } from "react-router-dom";
import { HiOutlineUser, HiOutlineShoppingBag, HiOutlineHeart, HiOutlineCog } from "react-icons/hi";
import { HiOutlineArrowRightOnRectangle } from "react-icons/hi2";

export default function Dashboard() {
const navigate = useNavigate();
const currentUser = JSON.parse(localStorage.getItem("user") || "null");

// redirect if not logged in
if (!currentUser) {
navigate("/login");
return null;
}

const handleLogout = () => {
localStorage.removeItem("token");
localStorage.removeItem("user");
navigate("/login");
};

const stats = [
{ label: "Total Orders", value: "0", icon: HiOutlineShoppingBag, color: "bg-blue-50 text-blue-600" },
{ label: "Wishlist", value: "0", icon: HiOutlineHeart, color: "bg-pink-50 text-pink-600" },
];

const quickLinks = [
{ name: "My Orders", href: "/orders", desc: "View and track your orders" },
{ name: "My Cart", href: "/cart", desc: "Items waiting in your cart" },
{ name: "Checkout", href: "/checkout", desc: "Complete your purchase" },
];

return (

<div className="min-h-screen bg-gray-50">
<div className="max-w-5xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center">
              <HiOutlineUser className="size-8 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">{currentUser.fullname}</h1>
              <p className="text-sm text-gray-500">{currentUser.email}</p>
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium capitalize">
                {currentUser.role}
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg transition"
          >
            <HiOutlineArrowRightOnRectangle className="size-5" />
            <span className="hidden sm:block">Logout</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl shadow-sm p-5 flex items-center gap-4">
              <div className={`size-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                <stat.icon className="size-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Links</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {quickLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="border border-gray-100 hover:border-primary hover:bg-primary/5 rounded-xl p-4 transition"
              >
                <p className="font-medium text-gray-800 text-sm">{link.name}</p>
                <p className="text-xs text-gray-500 mt-1">{link.desc}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Profile Settings */}
        {/* <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <HiOutlineCog className="size-5" />
            Profile Settings
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
    <input
      {...register("fullname")}
      type="text"
      defaultValue={user?.fullname}
      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary"
    />
  </div>
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
    <input
      type="email"
      defaultValue={user?.email}
      disabled
      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
    />
    <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
  </div>
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
    <input
      {...register("password")}
      type="password"
      placeholder="Leave blank to keep current password"
      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary"
    />
  </div>
  <button
    type="submit"
    disabled={isUpdating}
    className="btn-primary px-6 py-2.5 text-sm disabled:opacity-50"
  >
    {isUpdating ? "Saving..." : "Save Changes"}
  </button>
</form> */}
        </div>

      </div>
    // </div>

);
}
userdashboard👆
