import express from "express";

import auth from "../middlewares/auth.js";
import multer from "../middlewares/multer.js";

import bookCtrl from "../controllers/book.js";

const router = express.Router();

router.get("/", bookCtrl.getAllBooks);
router.get("/bestrating", bookCtrl.getBestRatedBooks);
router.get("/:id", bookCtrl.getOneBook);
router.post("/", auth, multer, bookCtrl.createBook);
router.post("/:id/rating", auth, bookCtrl.addBookRating);
router.put("/:id", auth, multer, bookCtrl.updateBook);
router.delete("/:id", auth, bookCtrl.deleteBook);

export default router;
