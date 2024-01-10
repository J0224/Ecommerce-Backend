import express from 'express';
import { 
  createProduct, 
  getProducts, 
  updateProduct, 
  deleteProduct, 
  getSingleProduct,
  getProductsByCategory, 
  searchProduct } from "../controller/productController";
import { upload } from '../utils/uploadImage';

const router = express.Router();

// Routes for my API Products
router.post("/", upload.single("image"),createProduct);
router.get("/", getProducts);
router.get("/by-category", getProductsByCategory);
router.get("/:id", getSingleProduct);
router.get("/search", searchProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);


export default router;
