import { useParams, useNavigate } from "react-router-dom";
import { useGetBookByIdQuery, useRateBookMutation } from "./bookApi.js";
import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { FiShoppingCart, FiArrowLeft } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../cart/cartSlice.js";
import Swal from "sweetalert2";

export default function BookDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.user.user);
  const [hoveredStar, setHoveredStar] = useState(0);
  const { data: book, isLoading, isError, error, refetch } = useGetBookByIdQuery(id, {
    skip: !id,
  });
  const [rateBook] = useRateBookMutation();

  useEffect(() => {
    if (id) {
      refetch();
    }
  }, [id, refetch]);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Loading book details...</p>
      </div>
    );
  }

  if (isError || !book) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 mb-4 text-lg font-medium">
            {error?.status === 404 ? "Book not found" : "Unable to load book details"}
          </p>
          <button
            onClick={() => navigate("/books")}
            className="text-[#008080] hover:text-[#006666] font-semibold transition"
          >
            ← Back to books
          </button>
        </div>
      </div>
    );
  }

  const handleRate = async (star) => {
    let userId = localStorage.getItem("userId");
    if (!userId) {
      userId = "user_" + Math.random().toString(36).substr(2, 9);
      localStorage.setItem("userId", userId);
    }
    try {
      const result = await rateBook({ id: book._id, rating: star, userId });
      if (result.error) {
        Swal.fire("Error", result.error.data?.message || "Rating failed", "error");
      } else {
        Swal.fire("Success", "Book rated successfully!", "success");
      }
    } catch (err) {
      console.error("Rating failed:", err);
    }
  };

  const handleAddToCart = () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    dispatch(addToCart({ book, userId: currentUser.id }));
    Swal.fire("Added to Cart", `${book.title} has been added to your cart!`, "success");
  };

  const discount = book.oldprice > book.newprice 
    ? Math.round(((book.oldprice - book.newprice) / book.oldprice) * 100)
    : 0;

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate("/books")}
          className="flex items-center gap-2 text-[#008080] hover:text-[#006666] font-semibold mb-8 transition"
        >
          <FiArrowLeft size={20} />
          Back to Books
        </button>

        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-10 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {/* Book Image */}
            <div className="flex items-center justify-center">
              <div className="relative max-w-sm w-full">
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="w-full h-auto rounded-lg shadow-md"
                />
                {discount > 0 && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg">
                    -{discount}%
                  </div>
                )}
              </div>
            </div>

            {/* Book Details */}
            <div className="flex flex-col justify-between">
              <div>
                {/* Category Badge */}
                <p className="text-sm font-bold text-[#008080] mb-3 uppercase tracking-wide">{book.category}</p>

                {/* Title */}
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">{book.title}</h1>

                {/* Description */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <h2 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wide">Description</h2>
                  <p className="text-gray-600 leading-relaxed text-base">{book.description}</p>
                </div>

                {/* Price */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <div className="flex items-baseline gap-4">
                    <span className="text-4xl font-bold text-[#008080]">${book.newprice.toFixed(2)}</span>
                    {book.oldprice > book.newprice && (
                      <span className="text-xl text-gray-500 line-through">${book.oldprice.toFixed(2)}</span>
                    )}
                  </div>
                </div>

                {/* Stock Info */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                  {book.stock > 0 ? (
                    <div className="flex items-center gap-2">
                      <div className="size-3 bg-green-500 rounded-full"></div>
                      <p className="text-green-700 font-semibold">{book.stock} copies in stock</p>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="size-3 bg-red-500 rounded-full"></div>
                      <p className="text-red-700 font-semibold">Out of Stock</p>
                    </div>
                  )}
                </div>

                {/* Rating */}
                <div className="mb-6">
                  <h3 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wide">Rate This Book</h3>
                  <div className="flex gap-2 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleRate(star)}
                        onMouseEnter={() => setHoveredStar(star)}
                        onMouseLeave={() => setHoveredStar(0)}
                        className="transition"
                      >
                        <FaStar
                          size={28}
                          className={
                            star <= (hoveredStar || book.rating || 0)
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }
                        />
                      </button>
                    ))}
                  </div>
                  {book.rating && (
                    <p className="text-sm text-gray-600">
                      Current rating: <span className="font-bold text-[#008080]">{book.rating}/5</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={book.stock === 0}
                className="w-full flex items-center justify-center gap-3 bg-[#008080] text-white font-bold py-3.5 px-6 rounded-lg hover:bg-[#006666] transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiShoppingCart size={22} />
                {book.stock > 0 ? "Add to Cart" : "Out of Stock"}
              </button>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition text-center">
            <h3 className="font-bold text-gray-800 mb-2 text-lg">📦 Free Shipping</h3>
            <p className="text-sm text-gray-600">On orders over $50</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition text-center">
            <h3 className="font-bold text-gray-800 mb-2 text-lg">↩️ Easy Returns</h3>
            <p className="text-sm text-gray-600">30-day return policy</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition text-center">
            <h3 className="font-bold text-gray-800 mb-2 text-lg">🔒 Secure Payment</h3>
            <p className="text-sm text-gray-600">100% secure transactions</p>
          </div>
        </div>
      </div>
    </div>
  );
}
