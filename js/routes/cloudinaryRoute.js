"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/uploadRoutes.ts
const express_1 = __importDefault(require("express"));
const cloudinaryController_1 = require("../controller/cloudinaryController");
const router = express_1.default.Router();
router.post("/", cloudinaryController_1.uploadImage, cloudinaryController_1.processImage);
exports.default = router;
