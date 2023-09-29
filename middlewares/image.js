import multer from "multer";
import sharp from "sharp";

export default (req, res, next) => {
  const storage = multer.memoryStorage();
  const upload = multer({ storage });

  upload.single("image")(req, res, async (error) => {
    if (error) {
      return next(error);
    }

    if (req.file) {
      const { buffer, originalname } = req.file;

      const timestamp = Date.now();
      const fileName = `${timestamp}_${originalname}.webp`;

      res.locals.fileName = fileName;

      await sharp(buffer)
        .webp({ quality: 20 })
        .toFile("./images/" + fileName);
    }

    next();
  });
};
