import fs from "fs/promises";
import sharp from "sharp";

export const optimizeImage = async (file) => {
  let image = file.buffer;

  const metadata = await sharp(image).metadata();
  if (metadata.width > 400) {
    const { data } = await sharp(image)
      .resize({ width: 400 })
      .toBuffer({ resolveWithObject: true });
    image = data;
  }

  const timestamp = Date.now();
  const fileName = `${timestamp}_${file.originalname}.webp`;
  await sharp(image)
    .webp({ quality: 75 })
    .toFile("./images/" + fileName);

  return fileName;
};

export const deleteImage = async (imageUrl) => {
  const fileName = imageUrl.split("images/")[1];
  await fs.unlink("./images/" + fileName);
};
