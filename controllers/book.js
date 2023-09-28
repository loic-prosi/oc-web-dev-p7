import Book from "../models/book.js";
import fs from "fs";

export const getAllBooks = (req, res) => {
  Book.find()
    .then((books) => {
      res.status(200).json(books);
    })
    .catch((error) => {
      res.status(400).json({
        error: error
      });
    });
};

export const getOneBook = (req, res) => {
  Book.findOne({
    _id: req.params.id
  })
    .then((book) => {
      res.status(200).json(book);
    })
    .catch((error) => {
      res.status(404).json({
        error: error
      });
    });
};

export const getBestRatedBooks = () => {
  // TODO
};

export const createBook = (req, res) => {
  const bookObj = JSON.parse(req.body.book);
  delete bookObj._id;
  delete bookObj._userId;
  const book = new Book({
    ...bookObj,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
  });
  book
    .save()
    .then(() => {
      res.status(201).json({ message: "Book created successfully" });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

export const addBookRating = () => {
  // TODO
};

export const updateBook = (req, res) => {
  const bookObj = req.file
    ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`
      }
    : { ...req.body };

  delete bookObj._userId;
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId !== req.auth.userId) {
        res.status(401).json({ message: "Not authorized" });
      } else {
        Book.updateOne(
          { _id: req.params.id },
          { ...bookObj, _id: req.params.id }
        )
          .then(() =>
            res.status(200).json({ message: "Book updated successfully" })
          )
          .catch((error) => res.status(401).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

export const deleteBook = (req, res) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId !== req.auth.userId) {
        res.status(401).json({ message: "Not authorized" });
      } else {
        const filename = book.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          Book.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: "Book deleted successfully" });
            })
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
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