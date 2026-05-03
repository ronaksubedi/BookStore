import { Link, useNavigate } from "react-router-dom";
import { HiBars3 } from "react-icons/hi2";
import { IoSearchOutline } from "react-icons/io5";
import { HiOutlineUser, HiOutlineHeart, HiOutlineShoppingCart } from "react-icons/hi";
import AvatarImg from "../assets/avatar.png";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { userSlice } from "../features/auth/userSlice.js";
import { clearCartState } from "../features/cart/cartSlice.js";

const navigation = [
  { name: "Books", href: "/books" },
  { name: "Dashboard", href: "/dashboard" },
  { name: "Orders", href: "/orders" },
  { name: "Cart Page", href: "/cart" },
  
];

export default function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const currentUser = useSelector(state => state.user.user);
  const cartItems = useSelector(state => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(userSlice.actions.removeUser());
    dispatch(clearCartState());
    setIsDropdownOpen(false);
    navigate("/login");
  };

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchTerm.trim()) {
      navigate(`/books?search=${encodeURIComponent(searchTerm)}`);
      setSearchTerm("");
    }
  };

  return (
    <header className="w-full px-3 sm:px-4 py-4">
      <nav className="max-w-7xl mx-auto flex items-center justify-between gap-3">

        {/* Left side */}
        <div className="flex items-center gap-3 sm:gap-5 flex-1 min-w-0">
          <Link to="/" className="text-3xl shrink-0">
            <HiBars3 />
          </Link>
          <div className="relative w-full max-w-xs sm:max-w-sm">
            <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg" />
            <input
              type="text"
              placeholder="Search books..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearch}
              className="w-full py-2 pl-10 pr-3 rounded-md focus:outline-none bg-[#EAEAEA] text-sm"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="relative">
            {currentUser ? (
              <>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="relative"
                >
                  <img
                    src={AvatarImg}
                    alt=""
                    className="size-7 rounded-full ring-2 ring-primary"
                  />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white shadow-lg rounded-md z-40 border border-gray-100">
                    {/* User info */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {currentUser.fullname}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {currentUser.email}
                      </p>
                    </div>

                    <ul className="py-1">
                      {/* Regular nav links */}
                      {navigation.map((item) => (
                        <li key={item.name}>
                          <Link
                            to={item.href}
                            onClick={() => setIsDropdownOpen(false)}
                            className="block hover:bg-gray-50 px-4 py-2 text-sm text-gray-700"
                          >
                            {item.name}
                          </Link>
                        </li>
                      ))}

                      {/* ✅ Admin link - only shown for admin role */}
                      {currentUser?.role === "admin" && (
                        <li>
                          <Link
                            to="/admin"
                            onClick={() => setIsDropdownOpen(false)}
                            className="block hover:bg-purple-50 px-4 py-2 text-sm text-purple-600 font-medium"
                          >
                            Admin Dashboard
                          </Link>
                        </li>
                      )}

                      {/* Logout */}
                      <li>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50"
                        >
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <Link to="/login">
                <HiOutlineUser className="size-5 sm:size-6" />
              </Link>
            )}
          </div>

          <button className="hidden sm:block" type="button">
            <HiOutlineHeart className="size-5 sm:size-6" />
          </button>

          <Link
            to="/cart"
            className="bg-[#FFCE1A] py-1.5 px-2 sm:px-4 flex items-center rounded"
          >
            <HiOutlineShoppingCart className="size-5 sm:size-6" />
            <span className="text-sm font-semibold ml-1">{cartItems.length}</span>
          </Link>
        </div>
      </nav>
    </header>
  );
}