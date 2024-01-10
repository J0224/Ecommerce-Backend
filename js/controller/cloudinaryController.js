"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processImage = exports.uploadImage = void 0;
const multer_1 = __importDefault(require("multer"));
const uploadImage_1 = require("../utils/uploadImage");
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
exports.uploadImage = upload.single("file");
const processImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({ error: "Missing file" });
        }
        // Create a stream from the buffer
        const stream = uploadImage_1.cloudinary.uploader.upload_stream({ upload_preset: "campanita-store" }, (error, result) => {
            if (error) {
                console.error("Error uploading image:", error);
                res.status(500).json({ error: "Internal Server Error" });
            }
            else {
                res.json(result);
            }
        });
        // Write the buffer to the stream
        stream.write(file.buffer);
        stream.end();
    }
    catch (error) {
        console.error("Error processing image:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.processImage = processImage;
