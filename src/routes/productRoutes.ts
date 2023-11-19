import express from 'express';
const productModel = require("../model/productModel");
const { createProduct, getProducts, updateProduct, deleteProduct, getSingleProduct } = require("../controller/productController");


const router = express.Router();

// Create a new product
router.post("/", createProduct);
router.get("/", getProducts);
router.get("/:id", getSingleProduct)
router.put("/:id", updateProduct)
router.delete("/:id", deleteProduct)

// ... other routes ...

export default router;
