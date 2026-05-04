import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { baseApi } from "../../app/mainApi.js";
import OrdersPageSkeleton from "../../components/OrdersPageSkeleton.jsx";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem("token");
  const apiUrl = (path) => `${baseApi}${path.replace(/^\//, "")}`;

  useEffect(() => {
    fetch(apiUrl("orders/my-orders"), {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => { setOrders(data); setIsLoading(false); })
      .catch(() => setIsLoading(false));
  }, []);

  if (isLoading) return <OrdersPageSkeleton />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 mb-4">No orders yet</p>
          <Link to="/" className="btn-primary px-6 py-2">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order._id} className="bg-white rounded-xl shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs text-gray-500">Order ID</p>
                  <p className="text-sm font-mono text-gray-700">{order._id}</p>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-medium capitalize ${statusColors[order.status]}`}>
                  {order.status}
                </span>
              </div>

              <div className="space-y-2 mb-3">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <img src={item.coverImage} alt={item.title} className="w-10 h-12 object-cover rounded" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{item.title}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity} × ${item.newprice}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-3 flex justify-between items-center">
                <div className="text-xs text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </div>
                <div className="font-bold text-primary">${order.totalPrice.toFixed(2)}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}