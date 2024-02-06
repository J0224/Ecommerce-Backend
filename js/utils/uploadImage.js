"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileSizeFormatter = exports.upload = exports.cloudinary = void 0;
const multer_1 = __importDefault(require("multer"));
const uuid_1 = require("uuid");
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "Store-Photos");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExtension = file.originalname.split('.').pop() || ''; // Handle the case where the extension is missing
        const uniqueFilename = `${(0, uuid_1.v4)()}-${uniqueSuffix}.${fileExtension}`;
        cb(null, uniqueFilename);
    }
});
function fileFilter(req, file, cb) {
    if (file.mimetype === "image/png" ||
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/jpg") {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
}
const upload = (0, multer_1.default)({ storage, fileFilter });
exports.upload = upload;
// File size formatter
const fileSizeFormatter = (bytes, decimal) => {
    if (bytes === 0) {
        return "0 Bytes";
    }
    const dm = decimal || 2;
    const sizes = ["Bytes", "KB", "MB", "GB",
        "TB", "PB", "EB", "YB", "ZB"];
    const index = Math.floor(Math.log(bytes) / Math.log(1000));
    return (parseFloat((bytes / Math.pow(1000, index)).toFixed(dm)) + " "
        + sizes[index]);
};
exports.fileSizeFormatter = fileSizeFormatter;
// uploadImage.ts
const cloudinary_1 = require("cloudinary");
Object.defineProperty(exports, "cloudinary", { enumerable: true, get: function () { return cloudinary_1.v2; } });
// Initialize cloudinary configuration
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "",
    api_key: process.env.CLOUDINARY_API_KEY || "",
    api_secret: process.env.CLOUDINARY_API_SECRET || "",
});
