import express from 'express';
const productModel = require("../model/productModel")
const cartModel = require("../model/cartModel");
const {addProduct, deleteCartProduct} = require("../controller/cartController");

const routerCart = express.Router();

routerCart.post("/add-product", addProduct);
routerCart.delete("/delete-product:id", deleteCartProduct);

export default routerCart;

