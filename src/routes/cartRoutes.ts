import express from 'express';

import {addProduct, deleteCartProduct, getCart} from "../controller/cartController";

const routerCart = express.Router();

routerCart.post("/add-product", addProduct);
routerCart.delete("/delete-product:id", deleteCartProduct);
routerCart.get("/:id", getCart);


export default routerCart;

