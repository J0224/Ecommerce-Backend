"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cartController_1 = require("../controller/cartController");
const routerCart = express_1.default.Router();
routerCart.post("/add-product", cartController_1.addProduct);
routerCart.delete("/delete-product:id", cartController_1.deleteCartProduct);
routerCart.get("/:id", cartController_1.getCart);
exports.default = routerCart;
