// routes/uploadRoutes.ts
import express from "express";
import { uploadImage, processImage } from "../controller/cloudinaryController";
import { cloudinary } from "../utils/uploadImage";
const router = express.Router();

router.post("/", uploadImage, processImage);

export default router;
