"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cart = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const cartItemSchema = new mongoose_1.default.Schema({
    product: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Product",
    },
    name: String,
    price: Number,
    quantity: Number,
    subTotal: Number,
    total: Number,
});
const cartSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
    },
    guestId: String,
    nameUser: String,
    items: [cartItemSchema],
    subTotal: Number,
    total: Number,
});
const Cart = mongoose_1.default.model('Cart', cartSchema);
exports.Cart = Cart;
