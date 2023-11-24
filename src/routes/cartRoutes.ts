import express from 'express';

import {addProduct, deleteCartProduct} from "../controller/cartController";

const routerCart = express.Router();

routerCart.post("/add-product", addProduct);
routerCart.delete("/delete-product:id", deleteCartProduct);

export default routerCart;

