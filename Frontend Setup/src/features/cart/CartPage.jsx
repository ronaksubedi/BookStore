import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, updateQuantity, clearCart } from "./cartSlice.js";
import { Link } from "react-router-dom";
import { FiTrash2 } from "react-icons/fi";

export default function CartPage() {
  const dispatch = useDispatch();
  const items = useSelector(state => state.cart.items);
  const total = items.reduce((sum, item) => sum + item.newprice * item.quantity, 0);

  if (items.length === 0) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="text-gray-500 text-lg">Your cart is empty</p>
      <Link to="/" className="btn-primary px-6 py-2">Browse Books</Link>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Cart</h1>
      <div className="space-y-4 mb-6">
        {items.map((item) => (
          <div key={item._id} className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-4">
            <img src={item.coverImage} alt={item.title} className="w-16 h-20 object-cover rounded-md" />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 text-sm">{item.title}</h3>
              <p className="text-primary font-bold">${item.newprice}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => dispatch(updateQuantity({ id: item._id, quantity: Math.max(1, item.quantity - 1) }))}
                className="size-7 rounded-full border flex items-center justify-center text-gray-600 hover:bg-gray-100"
              >-</button>
              <span className="w-6 text-center text-sm">{item.quantity}</span>
              <button
                onClick={() => dispatch(updateQuantity({ id: item._id, quantity: item.quantity + 1 }))}
                className="size-7 rounded-full border flex items-center justify-center text-gray-600 hover:bg-gray-100"
              >+</button>
            </div>
            <button onClick={() => dispatch(removeFromCart(item._id))} className="text-red-400 hover:text-red-600">
              <FiTrash2 size={18} />
            </button>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between mb-4">
          <span className="font-semibold text-gray-800">Total</span>
          <span className="font-bold text-xl text-primary">${total.toFixed(2)}</span>
        </div>
        <div className="flex gap-3">
          <button onClick={() => dispatch(clearCart())} className="flex-1 border border-gray-300 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
            Clear Cart
          </button>
          <Link to="/checkout" className="flex-1 btn-primary py-2.5 rounded-lg text-sm text-center">
            Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}