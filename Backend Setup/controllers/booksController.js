import Book from "../models/Book.js";
import { getImageData } from "../utils/bookHelpers.js";
import cloudinary from "../utils/cloudinary.js";

// GET ALL BOOKS (with optional search)
export const getBooks = async (req, res) => {
  try {
    const { search } = req.query;
    
    if (search) {
      // Search in title and description
      const books = await Book.find({
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { category: { $regex: search, $options: 'i' } }
        ]
      });
      res.status(200).json(books);
    } else {
      const books = await Book.find();
      res.status(200).json(books);
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// CREATE BOOK
export const createBook = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Cover image is required" });
    }
    const book = await Book.create({
      ...req.body,
      ...getImageData(req.file),
    });
    res.status(201).json({ message: "Book created successfully", book });
  } catch (error) {
    if (req.file?.filename) {
      await cloudinary.uploader.destroy(req.file.filename);
    }
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// GET BOOK BY ID
export const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// UPDATE BOOK BY ID
export const updateBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });

    if (req.file && book.imagePublicId) {
      await cloudinary.uploader.destroy(book.imagePublicId);
    }

    let updateData = { ...req.body };
    if (req.file) {
      updateData = { ...updateData, ...getImageData(req.file) };
    } else {
      // If no new image, remove image fields from update data to keep existing ones
      delete updateData.coverImage;
      delete updateData.imagePublicId;
    }

    const updated = await Book.findByIdAndUpdate(req.bookId, updateData, { new: true });
    res.status(200).json({ message: "Book updated successfully", updated });
  } catch (error) {
    console.error("Update error:", error.message);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// DELETE BOOK BY ID
export const deleteBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });

    if (book.imagePublicId) {
      await cloudinary.uploader.destroy(book.imagePublicId);
    }

    await book.deleteOne();
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// RATE BOOK
export const rateBook = async (req, res) => {
  try {
    console.log("RATE BOOK HIT:", req.params.id);
    console.log("BODY:", req.body);

    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    const { rating, userId } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    // ✅ safe check for old documents that don't have ratedBy
    const existingRating = (book.ratedBy || []).find((r) => r.userId === userId);

    if (existingRating) {
      // user already rated — UPDATE their rating (count stays same)
      const oldRating = existingRating.rating;
      const newRating =
        ((book.rating * book.ratingCount) - oldRating + Number(rating)) /
        book.ratingCount;

      const updated = await Book.findByIdAndUpdate(
        req.params.id,
        {
          rating: Math.round(newRating * 10) / 10,
          $set: { "ratedBy.$[elem].rating": Number(rating) },
        },
        {
          new: true,
          arrayFilters: [{ "elem.userId": userId }],
        }
      );
      return res.status(200).json({ message: "Rating updated", updated });

    } else {
      // new rating — increment count
      const newCount = book.ratingCount + 1;
      const newRating =
        ((book.rating * book.ratingCount) + Number(rating)) / newCount;

      const updated = await Book.findByIdAndUpdate(
        req.params.id,
        {
          rating: Math.round(newRating * 10) / 10,
          ratingCount: newCount,
          $push: { ratedBy: { userId, rating: Number(rating) } },
        },
        { new: true }
      );
      return res.status(200).json({ message: "Rating submitted", updated });
    }

  } catch (error) {
    console.log("RATE ERROR:", error.message);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};