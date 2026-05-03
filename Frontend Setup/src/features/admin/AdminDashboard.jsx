import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import {
  HiOutlineShoppingBag, HiOutlineUsers, HiOutlineBookOpen,
  HiOutlineCurrencyDollar, HiOutlineChartBar, HiOutlinePencil,
  HiOutlineTrash, HiOutlinePlus,
} from "react-icons/hi";

const BOOK_CATEGORIES = [
  "Fiction", "Nonfiction", "Fantasy", "Science Fiction", "Romance",
  "History", "Self-help", "Biography", "Children's", "Mystery",
  "Thriller", "Horror", "Poetry", "Graphic Novel", "Classic",
  "Young Adult", "Science", "Philosophy", "Religion", "Travel",
  "Business", "Tech",
];

const statusColors = {
  pending: "bg-yellow-100 text-yellow-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const statusOptions = ["pending", "processing", "shipped", "delivered", "cancelled"];
const tabs = ["Overview", "Orders", "Books", "Customers"];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const currentUser = useSelector(state => state.user.user);
  const token = localStorage.getItem("token");
  const [activeTab, setActiveTab] = useState("Overview");
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showBookModal, setShowBookModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [isSubmittingBook, setIsSubmittingBook] = useState(false);
  const [isDeletingBook, setIsDeletingBook] = useState(false);
  const { register, handleSubmit, reset, setValue } = useForm();

  if (!currentUser || currentUser.role !== "admin") {
    navigate("/");
    return null;
  }

  const headers = { Authorization: `Bearer ${token}` };

  const fetchData = () => {
    Promise.all([
      fetch("https://bookstore-ggcs.onrender.com/api/orders/all", { headers }).then(r => r.json()),
      fetch("https://bookstore-ggcs.onrender.com/api/users/all", { headers }).then(r => r.json()),
      fetch("https://bookstore-ggcs.onrender.com/api/books").then(r => r.json()),
    ]).then(([ordersData, customersData, booksData]) => {
      setOrders(Array.isArray(ordersData) ? ordersData : []);
      setCustomers(Array.isArray(customersData) ? customersData : []);
      setBooks(Array.isArray(booksData) ? booksData : []);
      setIsLoading(false);
    }).catch(() => setIsLoading(false));
  };

  const fetchBooks = async () => {
    try {
      const res = await fetch("https://bookstore-ggcs.onrender.com/api/books");
      const data = await res.json();
      setBooks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch books", error);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const updateStatus = async (orderId, status) => {
    await fetch(`https://bookstore-ggcs.onrender.com/api/orders/${orderId}/status`, {
      method: "PATCH",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status } : o));
  };

  const toggleUserStatus = async (userId) => {
    const res = await fetch(`https://bookstore-ggcs.onrender.com/api/users/${userId}/toggle-status`, {
      method: "PATCH",
      headers,
    });
    if (res.ok) {
      const user = customers.find(c => c._id === userId);
      setCustomers(prev => prev.map(c =>
        c._id === userId ? { ...c, isActive: !c.isActive } : c
      ));
      Swal.fire("Success", `User ${!user.isActive ? "activated" : "deactivated"} successfully!`, "success");
    } else {
      Swal.fire("Error", "Failed to update user status.", "error");
    }
  };

  const deleteBook = async (bookId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This book will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#008080",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    });
    if (!result.isConfirmed) return;
    
    setIsDeletingBook(true);
    try {
      const res = await fetch(`https://bookstore-ggcs.onrender.com/api/books/${bookId}`, {
        method: "DELETE",
        headers,
      });
      if (res.ok) {
        setBooks(prev => prev.filter(b => b._id !== bookId));
        Swal.fire("Deleted!", "Book has been deleted successfully.", "success");
      } else {
        Swal.fire("Error", "Failed to delete book.", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Failed to delete book: " + error.message, "error");
    } finally {
      setIsDeletingBook(false);
    }
  };

  const openAddBook = () => {
    setEditingBook(null);
    reset();
    setShowBookModal(true);
  };

  const openEditBook = (book) => {
    setEditingBook(book);
    setValue("title", book.title);
    setValue("description", book.description);
    setValue("category", book.category);
    setValue("newprice", book.newprice);
    setValue("oldprice", book.oldprice);
    setValue("trending", book.trending);
    setValue("stock", book.stock);
    setShowBookModal(true);
  };

  const onBookSubmit = async (data) => {
    setIsSubmittingBook(true);
    Swal.fire({
      title: "Processing...",
      html: "Uploading book...",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => Swal.showLoading()
    });
    
    try {
      const formData = new FormData();
      Object.keys(data).forEach(key => {
        if (key === "coverImage") {
          if (data.coverImage?.[0]) formData.append("coverImage", data.coverImage[0]);
        } else {
          formData.append(key, data[key]);
        }
      });

      const url = editingBook
        ? `https://bookstore-ggcs.onrender.com/api/books/${editingBook._id}`
        : "https://bookstore-ggcs.onrender.com/api/books";
      const method = editingBook ? "PATCH" : "POST";

      const res = await fetch(url, { method, headers, body: formData });
      if (res.ok) {
        setShowBookModal(false);
        Swal.fire("Success", editingBook ? "Book updated successfully!" : "Book created successfully!", "success");
        await fetchBooks();
      } else {
        const error = await res.json();
        Swal.fire("Error", error.message || "Failed to save book", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Failed to save book: " + error.message, "error");
    } finally {
      setIsSubmittingBook(false);
    }
  };

  const totalRevenue = orders
    .filter(o => o.status === "delivered")
    .reduce((sum, o) => sum + o.totalPrice, 0);

  const stats = [
    { label: "Total Revenue", value: `$${totalRevenue.toFixed(2)}`, icon: HiOutlineCurrencyDollar, color: "bg-green-50 text-green-600" },
    { label: "Total Orders", value: orders.length, icon: HiOutlineShoppingBag, color: "bg-blue-50 text-blue-600" },
    { label: "Customers", value: customers.length, icon: HiOutlineUsers, color: "bg-purple-50 text-purple-600" },
    { label: "Books", value: books.length, icon: HiOutlineBookOpen, color: "bg-orange-50 text-orange-600" },
  ];

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-sm text-gray-500">Welcome back, {currentUser.fullname}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
                activeTab === tab
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === "Overview" && (
          <div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {stats.map(stat => (
                <div key={stat.label} className="bg-white rounded-2xl shadow-sm p-5 flex items-center gap-4">
                  <div className={`size-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                    <stat.icon className="size-6" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-gray-800">{stat.value}</p>
                    <p className="text-xs text-gray-500">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <HiOutlineChartBar className="size-5" />
                  Orders by Status
                </h2>
                {statusOptions.map(status => {
                  const count = orders.filter(o => o.status === status).length;
                  const pct = orders.length ? Math.round((count / orders.length) * 100) : 0;
                  return (
                    <div key={status} className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="capitalize text-gray-600">{status}</span>
                        <span className="font-medium">{count}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="font-semibold text-gray-800 mb-4">Recent Orders</h2>
                <div className="space-y-3">
                  {orders.slice(0, 5).map(order => (
                    <div key={order._id} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-800">{order.user?.fullname || "Unknown"}</p>
                        <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[order.status]}`}>
                          {order.status}
                        </span>
                        <span className="text-sm font-bold text-primary">${order.totalPrice.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Orders */}
        {activeTab === "Orders" && (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order._id} className="bg-white rounded-xl shadow-sm p-5">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <div>
                    <p className="text-xs text-gray-500">Order ID: {order._id}</p>
                    <p className="text-sm font-medium">{order.user?.fullname} — {order.user?.email}</p>
                  </div>
                  <select
                    value={order.status}
                    onChange={e => updateStatus(order._id, e.target.value)}
                    className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-primary"
                  >
                    {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="space-y-2 mb-3">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <img src={item.coverImage} alt={item.title} className="w-8 h-10 object-cover rounded" />
                      <div className="flex-1">
                        <p className="text-sm">{item.title}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity} × ${item.newprice}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600 mb-3">
                  <p><strong>Receiver:</strong> {order.receiver?.name}</p>
                  <p><strong>Address:</strong> {order.receiver?.address}</p>
                  <p><strong>Phone:</strong> {order.receiver?.phone}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
                  <p className="font-bold text-primary">${order.totalPrice.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Books */}
        {activeTab === "Books" && (
          <div>
            <button
              onClick={openAddBook}
              className="btn-primary px-4 py-2 text-sm flex items-center gap-2 mb-6"
            >
              <HiOutlinePlus className="size-4" />
              Add New Book
            </button>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {books.map(book => (
                <div key={book._id} className="bg-white rounded-xl shadow-sm p-4 flex gap-3">
                  <img src={book.coverImage} alt={book.title} className="w-14 object-cover rounded-md" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 text-sm truncate">{book.title}</p>
                    <p className="text-xs text-gray-500">{book.category}</p>
                    <p className="text-sm font-bold text-primary mt-1">${book.newprice}</p>
                    <p className="text-xs text-gray-500">Stock: {book.stock}</p>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => openEditBook(book)}
                        className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                      >
                        <HiOutlinePencil className="size-3" /> Edit
                      </button>
                      <button
                        onClick={() => deleteBook(book._id)}
                        disabled={isDeletingBook}
                        className="text-xs text-red-500 hover:underline flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <HiOutlineTrash className="size-3" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Customers */}
        {activeTab === "Customers" && (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-6 py-3 text-gray-600 font-medium">Name</th>
                  <th className="text-left px-6 py-3 text-gray-600 font-medium">Email</th>
                  <th className="text-left px-6 py-3 text-gray-600 font-medium">Role</th>
                  <th className="text-left px-6 py-3 text-gray-600 font-medium">Status</th>
                  <th className="text-left px-6 py-3 text-gray-600 font-medium">Orders</th>
                  <th className="text-left px-6 py-3 text-gray-600 font-medium">Joined</th>
                  <th className="text-left px-6 py-3 text-gray-600 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {customers.map(customer => {
                  const customerOrders = orders.filter(o => o.user?._id === customer._id);
                  return (
                    <tr key={customer._id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-3 font-medium">{customer.fullname}</td>
                      <td className="px-6 py-3 text-gray-600">{customer.email}</td>
                      <td className="px-6 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          customer.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-600"
                        }`}>
                          {customer.role}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          customer.isActive !== false ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}>
                          {customer.isActive !== false ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-3 font-bold text-primary">{customerOrders.length}</td>
                      <td className="px-6 py-3 text-gray-500">{new Date(customer.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-3">
                        <button
                          onClick={() => toggleUserStatus(customer._id)}
                          className={`text-xs px-3 py-1 rounded-lg ${
                            customer.isActive !== false
                              ? "bg-red-50 text-red-600 hover:bg-red-100"
                              : "bg-green-50 text-green-600 hover:bg-green-100"
                          }`}
                        >
                          {customer.isActive !== false ? "Deactivate" : "Activate"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* Book Modal */}
      {showBookModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              {editingBook ? "Edit Book" : "Add New Book"}
            </h2>
            <form onSubmit={handleSubmit(onBookSubmit)} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input {...register("title", { required: true })} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea {...register("description", { required: true })} rows={3} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select {...register("category", { required: true })} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary bg-white cursor-pointer">
                    <option value="">Select Category</option>
                    {BOOK_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                  <input {...register("stock")} type="number" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Price</label>
                  <input {...register("newprice", { required: true })} type="number" step="0.01" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Old Price</label>
                  <input {...register("oldprice", { required: true })} type="number" step="0.01" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input {...register("trending")} type="checkbox" id="trending" />
                <label htmlFor="trending" className="text-sm text-gray-700">Trending</label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cover Image {editingBook && "(leave empty to keep current)"}
                </label>
                <input
                  {...register("coverImage", { required: !editingBook })}
                  type="file"
                  accept="image/*"
                  className="w-full text-sm text-gray-600"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBookModal(false)}
                  disabled={isSubmittingBook}
                  className="flex-1 border border-gray-300 py-2.5 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingBook}
                  className="flex-1 btn-primary py-2.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmittingBook ? (editingBook ? "Updating..." : "Adding...") : (editingBook ? "Update Book" : "Add Book")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}