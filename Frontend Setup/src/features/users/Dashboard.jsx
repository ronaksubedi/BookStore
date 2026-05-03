import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { HiOutlineUser, HiOutlineShoppingBag, HiOutlineHeart, HiOutlineCog } from "react-icons/hi";
import { HiOutlineArrowRightOnRectangle } from "react-icons/hi2";
import { useGetUserProfileQuery, useUpdateUserProfileMutation } from "../auth/userApi.js";
import { useDispatch } from "react-redux";
import { userSlice } from "../auth/userSlice.js";
import Swal from "sweetalert2";

export default function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const [orders, setOrders] = useState([]);

  if (!token) {
    navigate("/login");
    return null;
  }

  const { data: user, isLoading } = useGetUserProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateUserProfileMutation();
  const { register, handleSubmit } = useForm();

  // ✅ fetch real order count
  useEffect(() => {
    fetch("https://bookstore-ggcs.onrender.com/api/orders/my-orders", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setOrders(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  const handleLogout = () => {
    dispatch(userSlice.actions.removeUser());
    navigate("/login");
  };

  const onSubmit = async (data) => {
    const updateData = {};
    if (data.fullname && data.fullname !== user?.fullname) updateData.fullname = data.fullname;
    if (data.password) updateData.password = data.password;
    if (Object.keys(updateData).length === 0) return;

    const result = await updateProfile(updateData);
    if (result.error) {
      Swal.fire("Error", "Update failed", "error");
    } else {
      Swal.fire("Success", "Profile updated!", "success");
    }
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  // count by status
  const orderStats = {
    total: orders.length,
    pending: orders.filter(o => o.status === "pending").length,
    delivered: orders.filter(o => o.status === "delivered").length,
  };

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
              <h1 className="text-xl font-bold text-gray-800">{user?.fullname}</h1>
              <p className="text-sm text-gray-500">{user?.email}</p>
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium capitalize">
                {user?.role}
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

        {/* ✅ Real order stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "Total Orders", value: orderStats.total, icon: HiOutlineShoppingBag, color: "bg-blue-50 text-blue-600" },
            { label: "Pending", value: orderStats.pending, icon: HiOutlineShoppingBag, color: "bg-yellow-50 text-yellow-600" },
            { label: "Delivered", value: orderStats.delivered, icon: HiOutlineHeart, color: "bg-green-50 text-green-600" },
          ].map(stat => (
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
            {quickLinks.map(link => (
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
        <div className="bg-white rounded-2xl shadow-sm p-6">
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
          </form>
        </div>

      </div>
    </div>
  );
}