import Book from "../models/book.js";

import { isFileValid, validateFields } from "../utils/validation.js";
import { optimizeImage, deleteImage } from "../utils/image.js";

const bookSchema = {
  title: { type: "string" },
  author: { type: "string" },
  year: { type: "integer" },
  genre: { type: "string" },
  ratings: {
    grade: { type: "integer", range: [0, 5] }
  }
};

export const getAllBooks = async (req, res, next) => {
  try {
    const books = await Book.find();

    if (!books) {
      throw new Error("books is undefined");
    }

    res.status(200).json(books);
  } catch (error) {
    next(error);
  }
};

export const getOneBook = async (req, res, next) => {
  try {
    const book = await Book.findOne({
      _id: req.params.id
    });

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json(book);
  } catch (error) {
    next(error);
  }
};

export const getBestRatedBooks = async (req, res, next) => {
  try {
    const books = await Book.find()
      .sort({ averageRating: "descending" })
      .limit(3);

    if (!books) {
      throw new Error("books is undefined");
    }

    res.status(200).json(books);
  } catch (error) {
    next(error);
  }
};

export const createBook = async (req, res, next) => {
  try {
    let bookObj = JSON.parse(req.body.book);

    const error = validateFields(bookObj, bookSchema);
    if (error) {
      return res.status(400).json(error);
    }

    if (!req.file) {
      return res.status(400).json({ message: "Missing file" });
    }

    if (!isFileValid(req.file)) {
      return res.status(400).json({ message: "Invalid file" });
    }

    const fileName = await optimizeImage(req.file);

    bookObj.userId = req.auth.userId;
    bookObj.ratings[0].userId = req.auth.userId;
    bookObj.averageRating = bookObj.ratings[0].grade;
    bookObj.imageUrl = `${req.protocol}://${req.get(
      "host"
    )}/images/${fileName}`;

    const book = new Book(bookObj);

    await book.save();

    res.status(201).json({ message: "Book created successfully" });
  } catch (error) {
    next(error);
  }
};

export const addBookRating = async (req, res, next) => {
  try {
    const ratingObj = { userId: req.auth.userId, grade: req.body.rating };

    const error = validateFields(ratingObj, bookSchema.ratings);
    if (error) {
      return res.status(400).json(error);
    }

    const book = await Book.findOne({
      _id: req.params.id
    });

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    for (let rating of book.ratings) {
      if (rating.userId === ratingObj.userId) {
        return res.status(403).json({ message: "Unauthorized request" });
      }
    }

    let totalRatings = 0;
    book.ratings.push(ratingObj);
    for (let rating of book.ratings) {
      totalRatings = totalRatings + rating.grade;
    }
    book.averageRating = Math.round(totalRatings / book.ratings.length);

    await book.save();

    res.status(200).json(book);
  } catch (error) {
    next(error);
  }
};

export const updateBook = async (req, res, next) => {
  try {
    let bookObj = { ...req.body };
    if (req.file) {
      bookObj = JSON.parse(req.body.book);
    }

    const error = validateFields(bookObj, bookSchema);
    if (error) {
      return res.status(400).json(error);
    }

    const book = await Book.findOne({ _id: req.params.id });

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (book.userId !== req.auth.userId) {
      return res.status(403).json({ message: "Unauthorized request" });
    }

    if (req.file) {
      if (!isFileValid(req.file)) {
        return res.status(400).json({ message: "Invalid file" });
      }

      await deleteImage(book.imageUrl);

      const fileName = await optimizeImage(req.file);

      bookObj.imageUrl = `${req.protocol}://${req.get(
        "host"
      )}/images/${fileName}`;
    }

    await Book.updateOne(
      { _id: req.params.id },
      { ...bookObj, _id: req.params.id }
    );

    res.status(200).json({ message: "Book updated successfully" });
  } catch (error) {
    next(error);
  }
};

export const deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findOne({ _id: req.params.id });

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    if (book.userId !== req.auth.userId) {
      return res.status(403).json({ message: "Unauthorized request" });
    }

    await Book.deleteOne({ _id: req.params.id });

    await deleteImage(book.imageUrl);

    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export default {
  getAllBooks,
  getOneBook,
  getBestRatedBooks,
  createBook,
  addBookRating,
  updateBook,
  deleteBook
};
