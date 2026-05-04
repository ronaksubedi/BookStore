import { useState, useEffect } from "react";
import { useGetBooksQuery, useSearchBooksQuery } from "./bookApi.js";
import { Link, useSearchParams } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import BookCard from "../../components/BookCard.jsx";
import BookGridSkeleton from "../../components/BookGridSkeleton.jsx";

const ALL = "All Categories";

export default function BooksPage() {
  const { data: allBooks = [], isLoading: loadingBooks } = useGetBooksQuery();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const { data: searchResults = [] } = useSearchBooksQuery(searchTerm, { skip: !searchTerm });
  const [selectedCategory, setSelectedCategory] = useState(ALL);
  const [filteredBooks, setFilteredBooks] = useState([]);

  // Get unique categories
  const categories = [ALL, ...new Set(allBooks.map((book) => book.category))];

  // Filter books based on category and search
  useEffect(() => {
    let books = searchTerm ? searchResults : allBooks;
    
    if (selectedCategory !== ALL) {
      books = books.filter((book) => book.category === selectedCategory);
    }
    
    setFilteredBooks(books);
  }, [allBooks, searchResults, selectedCategory, searchTerm]);

  if (loadingBooks && !allBooks.length) {
    return (
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-12">
            <div className="h-10 bg-gray-300 rounded w-64 mb-2 animate-pulse"></div>
            <div className="h-5 bg-gray-300 rounded w-96 animate-pulse"></div>
          </div>
          <div className="mb-8 animate-pulse">
            <div className="h-10 bg-gray-300 rounded w-full"></div>
          </div>
          <BookGridSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Our Books Collection</h1>
          <p className="text-gray-600">Browse thousands of books across all genres</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
            <input
              type="text"
              placeholder="Search by title, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:border-[#008080] focus:ring-1 focus:ring-[#008080] text-sm"
            />
          </div>
        </div>

        {/* Filters & Results Info */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full sm:w-64 px-4 py-2.5 rounded-lg border border-gray-300 bg-white focus:outline-none focus:border-[#008080] focus:ring-1 focus:ring-[#008080] text-sm cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div className="text-sm text-gray-600 mt-6">
            Showing <span className="font-bold text-[#008080]">{filteredBooks.length}</span> book(s)
          </div>
        </div>

        {/* Books Grid */}
        {filteredBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredBooks.map((book) => (
              <Link key={book._id} to={`/books/${book._id}`} className="group">
                <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 h-full overflow-hidden flex flex-col">
                  <div className="relative aspect-[3/4] bg-gray-200 overflow-hidden">
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {book.trending && (
                      <div className="absolute top-3 right-3 bg-[#008080] text-white text-xs font-bold px-3 py-1 rounded-full">
                        Trending
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-xs text-[#008080] font-semibold mb-2 uppercase">{book.category}</p>
                      <h3 className="text-sm font-bold text-gray-900 line-clamp-2 mb-2 group-hover:text-[#008080] transition">
                        {book.title}
                      </h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-lg font-bold text-[#008080]">${book.newprice}</p>
                          {book.oldprice > book.newprice && (
                            <p className="text-xs text-gray-500 line-through">${book.oldprice}</p>
                          )}
                        </div>
                        {book.stock > 0 ? (
                          <span className="text-xs bg-green-100 text-green-800 px-2.5 py-1 rounded-full font-medium">In Stock</span>
                        ) : (
                          <span className="text-xs bg-red-100 text-red-800 px-2.5 py-1 rounded-full font-medium">Out</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl">
            <p className="text-gray-500 text-lg font-medium">No books found</p>
            <p className="text-gray-400 text-sm mt-2">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
