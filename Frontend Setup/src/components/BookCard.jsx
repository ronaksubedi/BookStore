import { Link, useNavigate } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import { useState } from "react";
import { useRateBookMutation } from "../features/books/bookApi.js";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../features/cart/cartSlice.js";
import Swal from "sweetalert2";

export default function BookCard({ book }) {
  const [expanded, setExpanded] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [rateBook] = useRateBookMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector(state => state.user.user);

  const isLong = book?.description?.length > 60;
  const displayDesc = expanded ? book?.description : book?.description?.slice(0, 50);

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
  };

  return (
    <div className="rounded-lg p-2 w-full">
      <div className="flex flex-row items-start gap-4">
        <div className="shrink-0 w-24 sm:w-32">
          <Link to={`/books/${book._id}`} className="relative block">
            <img
              src={book?.coverImage}
              alt={book?.title}
              className="w-full aspect-2/3 object-cover rounded-md cursor-pointer hover:scale-105 transition-all duration-200 shadow-sm"
            />
            <span className="absolute top-2 left-2 text-xs text-white font-medium bg-red-900/10 px-2 py-0.5 rounded-full">
              {book?.category}
            </span>
          </Link>
        </div>
        <div className="flex flex-col flex-1 min-w-0">
          <Link to={`/books/${book._id}`}>
            <h3 className="text-sm sm:text-base font-semibold hover:text-primary mb-1 leading-snug">
              {book?.title}
            </h3>
          </Link>
          <div className="flex items-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                size={14}
                className={`cursor-pointer transition-colors ${
                  star <= (hoveredStar || Math.round(book?.rating || 0))
                    ? "text-yellow-400"
                    : "text-gray-300"
                }`}
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(0)}
                onClick={() => handleRate(star)}
              />
            ))}
            <span className="text-xs text-gray-500 ml-1">
              {book?.rating?.toFixed(1) || "0"} ({book?.ratingCount || 0})
            </span>
          </div>
          <p className="text-gray-600 text-xs sm:text-sm mb-3 leading-relaxed">
            {displayDesc}
            {isLong && !expanded && "... "}
            {isLong && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-primary text-xs hover:underline font-medium"
              >
                {expanded ? " Read less" : "Read more"}
              </button>
            )}
          </p>
          <p className="font-semibold text-sm mb-2">
            ${book?.newprice}
            <span className="line-through font-normal text-gray-400 ml-2 text-xs">
              ${book?.oldprice}
            </span>
          </p>
          <button
            onClick={handleAddToCart}
            className="btn-primary px-3 py-1.5 sm:px-4 sm:py-2 flex items-center gap-1.5 w-fit text-xs sm:text-sm"
          >
            <FiShoppingCart size={12} />
            <span>Add to Basket</span>
          </button>
        </div>
      </div>
    </div>
  );
}