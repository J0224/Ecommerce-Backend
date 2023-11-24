import express from 'express';
import { createProduct, getProducts, updateProduct, deleteProduct, getSingleProduct }from "../controller/productController";


const router = express.Router();

// Create a new product
router.post("/", createProduct);
router.get("/", getProducts);
router.get("/:id", getSingleProduct)
router.put("/:id", updateProduct)
router.delete("/:id", deleteProduct)

// ... other routes ...

export default router;
