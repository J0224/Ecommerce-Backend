// controllers/uploadController.ts
import { Request, Response } from "express";
import multer from "multer";
import { cloudinary } from "../utils/uploadImage";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

export const uploadImage = upload.single("file");

export const processImage = async (req: Request, res: Response) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "Missing file" });
    }

    // Create a stream from the buffer
    const stream = cloudinary.uploader.upload_stream(
      { upload_preset: "campanita-store" },
      (error, result) => {
        if (error) {
          console.error("Error uploading image:", error);
          res.status(500).json({ error: "Internal Server Error" });
        } else {
          res.json(result);
        }
      }
    );

    // Write the buffer to the stream
    stream.write(file.buffer);
    stream.end();
  } catch (error) {
    console.error("Error processing image:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
