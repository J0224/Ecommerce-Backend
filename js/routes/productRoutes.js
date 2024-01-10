"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productController_1 = require("../controller/productController");
const uploadImage_1 = require("../utils/uploadImage");
const router = express_1.default.Router();
// Routes for my API Products
router.post("/", uploadImage_1.upload.single("image"), productController_1.createProduct);
router.get("/", productController_1.getProducts);
router.get("/by-category", productController_1.getProductsByCategory);
router.get("/:id", productController_1.getSingleProduct);
router.get("/search", productController_1.searchProduct);
router.put("/:id", productController_1.updateProduct);
router.delete("/:id", productController_1.deleteProduct);
exports.default = router;
