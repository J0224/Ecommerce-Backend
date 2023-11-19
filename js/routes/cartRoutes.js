"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productModel = require("../model/productModel");
const cartModel = require("../model/cartModel");
const { addProduct, deleteCartProduct } = require("../controller/cartController");
const routerCart = express_1.default.Router();
routerCart.post("/add-product", addProduct);
routerCart.delete("/delete-product:id", deleteCartProduct);
exports.default = routerCart;
