"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productModel = require("../model/productModel");
const { createProduct, getProducts, updateProduct, deleteProduct, getSingleProduct } = require("../controller/productController");
const router = express_1.default.Router();
// Create a new product
router.post("/", createProduct);
router.get("/", getProducts);
router.get("/:id", getSingleProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);
// ... other routes ...
exports.default = router;
