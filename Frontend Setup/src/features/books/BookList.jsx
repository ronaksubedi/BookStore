import { useState } from "react";
import { useGetBooksQuery } from "./bookApi.js";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import BookCard from "../../components/BookCard.jsx";

const ALL = "category";

export default function BookList() {
  const { data: books = [], isLoading, isError, error } = useGetBooksQuery();
  
  // ✅ get unique categories from backend data
  const categories = [ALL, ...new Set(books.map((book) => book.category))];
  const [selectedCategory, setSelectedCategory] = useState(ALL);

  const filteredBooks = selectedCategory === ALL
    ? books
    : books.filter((book) => book.category === selectedCategory);

  if (isLoading) return <div>Loading...</div>;
  if (isError) {
    const errorStatus = error?.status ? ` (status: ${error.status})` : "";
    return <div>Unable to load books right now{errorStatus}.</div>;
  }

  return (
    <section className="py-10">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-[#000000]">
          Top Sellers
        </h2>

        <div className="mb-6">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border bg-[#eaeaea] border-gray-300 px-3 py-2 rounded-md text-sm focus:outline-none cursor-pointer"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <Swiper
          navigation={true}
          modules={[Navigation]}
          slidesPerView={3}
          spaceBetween={30}
          className="top-sellers-swiper"
          style={{ alignItems: 'stretch' }}
          breakpoints={{
            360: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1180: { slidesPerView: 3 },
          }}
        >
          {filteredBooks.map((book) => (
            <SwiperSlide key={book._id}>
              <BookCard book={book} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}