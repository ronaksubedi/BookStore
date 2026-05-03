import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../cart/cartSlice.js";
import Swal from "sweetalert2";
import { baseApi } from "../../app/mainApi.js";

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector(state => state.cart.items);
  const currentUser = useSelector(state => state.user.user);
  const token = localStorage.getItem("token");
  const total = items.reduce((sum, item) => sum + item.newprice * item.quantity, 0);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const apiUrl = (path) => `${baseApi}${path.replace(/^\//, "")}`;

  // ✅ redirect if not logged in
  if (!token || !currentUser) {
    navigate("/login");
    return null;
  }

  const onSubmit = async (data) => {
    try {
      const response = await fetch(apiUrl("orders"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: items.map(item => ({
            book: item._id,
            title: item.title,
            coverImage: item.coverImage,
            newprice: item.newprice,
            quantity: item.quantity,
          })),
          totalPrice: total,
          receiver: {
            name: data.name,
            address: data.address,
            phone: data.phone,
          },
        }),
      });

      if (response.ok) {
        dispatch(clearCart(currentUser.id)); // ✅ pass userId
        Swal.fire("Success", "Order placed successfully!", "success");
        navigate("/orders");
      } else {
        Swal.fire("Error", "Order failed. Please try again.", "error");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "An error occurred. Please try again.", "error");
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Checkout</h1>
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="font-semibold text-gray-800 mb-3">Order Summary</h2>
        {items.map(item => (
          <div key={item._id} className="flex justify-between text-sm py-1">
            <span>{item.title} x{item.quantity}</span>
            <span>${(item.newprice * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="border-t mt-3 pt-3 flex justify-between font-bold">
          <span>Total</span>
          <span className="text-primary">${total.toFixed(2)}</span>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="font-semibold text-gray-800 mb-4">Delivery Details</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Receiver Name</label>
            <input
              {...register("name", { required: "Name is required" })}
              type="text"
              placeholder="Full name"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <textarea
              {...register("address", { required: "Address is required" })}
              placeholder="Full delivery address"
              rows={3}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary resize-none"
            />
            {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              {...register("phone", { required: "Phone is required" })}
              type="tel"
              placeholder="Your phone number"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary"
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600">
            💵 Payment: Cash on Delivery
          </div>
          <button type="submit" className="btn-primary w-full py-3 text-sm">
            Place Order
          </button>
        </form>
      </div>
    </div>
  );
}