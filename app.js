import express from "express";
import mongoose from "mongoose";
import "dotenv/config";

import cors from "./middlewares/cors.js";

import bookRoutes from "./routes/book.js";
import authRoutes from "./routes/auth.js";

const app = express();

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_LOCATION}/?retryWrites=true&w=majority`
  )
  .then(() => console.log("MongoDB connexion OK"))
  .catch((error) => console.log("MongoDB connection error: ", error));

app.use(express.json());
app.use(cors);
// Serve images folder to client
app.use("/images", express.static(new URL("images", import.meta.url).pathname));

app.use("/api/books", bookRoutes);
app.use("/api/auth", authRoutes);

export default app;
