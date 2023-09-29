import express from "express";

import auth from "../middlewares/auth.js";
import image from "../middlewares/image.js";

import bookCtrl from "../controllers/book.js";

const router = express.Router();

router.get("/", bookCtrl.getAllBooks);
router.get("/bestrating", bookCtrl.getBestRatedBooks);
router.get("/:id", bookCtrl.getOneBook);
router.post("/", auth, image, bookCtrl.createBook);
router.post("/:id/rating", auth, bookCtrl.addBookRating);
router.put("/:id", auth, image, bookCtrl.updateBook);
router.delete("/:id", auth, bookCtrl.deleteBook);

export default router;
