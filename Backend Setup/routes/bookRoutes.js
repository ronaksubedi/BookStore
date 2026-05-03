import express from "express";
import mongoose from "mongoose";
import { notAllowed } from "../utils/notAllowed.js";
import {
  createBook,
  deleteBookById,
  getBookById,
  getBooks,
  rateBook,
  updateBookById,
} from "../controllers/booksController.js";

import upload from "../middlewares/upload.js";

const router = express.Router();
router.param('id', (req, res, next, id) => {
  if(!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid book ID" });
  }
  req.bookId = id;
  next();
});

router
  .route("/")
  .get(getBooks)
  .post(upload.single("coverImage"), createBook).all(notAllowed);

router
  .route("/:id")
  .get(getBookById)
  .patch(upload.single("coverImage"), updateBookById)
  .delete(deleteBookById);

  router.route("/:id/rate").post(rateBook);

export default router;