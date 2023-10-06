import express from "express";

import auth from "../middlewares/auth.js";
import uploadFile from "../middlewares/upload.js";

import bookCtrl from "../controllers/book.js";

const router = express.Router();

router.get("/", bookCtrl.getAllBooks);
router.get("/bestrating", bookCtrl.getBestRatedBooks);
router.get("/:id", bookCtrl.getOneBook);
router.post("/", auth, uploadFile, bookCtrl.createBook);
router.post("/:id/rating", auth, bookCtrl.addBookRating);
router.put("/:id", auth, uploadFile, bookCtrl.updateBook);
router.delete("/:id", auth, bookCtrl.deleteBook);

export default router;
