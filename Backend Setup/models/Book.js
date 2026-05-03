import mongoose from "mongoose";

export const BOOK_CATEGORIES = [
  "Fiction", "Nonfiction", "Fantasy", "Science Fiction", "Romance",
  "History", "Self-help", "Biography", "Children's", "Mystery",
  "Thriller", "Horror", "Poetry", "Graphic Novel", "Classic",
  "Young Adult", "Science", "Philosophy", "Religion", "Travel",
  "Business", "Tech",
];

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 100,
    },
    description: {
      type: String,
      required: true,
    },
    trending: {
      type: Boolean,
      default: false,
    },
    recommended: {
      type: Boolean,
      default: false,
    },
    category: {
      type: String,
      enum: BOOK_CATEGORIES,
      required: true,
    },
    newprice: {
      type: Number,
      required: true,
      min: 0,
    },
    oldprice: {
      type: Number,
      required: true,
      min: 0,
    },
    stock: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
    },
    ratingCount: {
      type: Number,
      default: 0,
    },
    ratedBy: {
      type: [
        {
          userId: { type: String, required: true },
          rating: { type: Number, required: true, min: 1, max: 5 },
        }
      ],
      default: [], // ✅ fixes "ratedBy is undefined" on old documents
    },
    coverImage: {
      type: String,
      required: true,
    },
    imagePublicId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Book", bookSchema);