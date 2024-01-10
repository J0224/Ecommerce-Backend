"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const productSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, 'Please add the product name'],
    },
    category: {
        type: String,
        required: [true, "Please add a product category"],
    },
    description: {
        type: String,
        required: [true, "Please add a product description"],
    },
    price: {
        type: Number,
        required: [true, "Please add the product price"],
    },
    color: [],
    size: [],
    quantity: {
        type: Number,
        required: [true, "Please add quantity"]
    },
    sku: {
        type: String,
        required: false,
        unique: true,
    },
    image: {
        type: Object,
        required: [true, 'Please add the product image URL'],
    },
});
const Product = mongoose_1.default.model('Product', productSchema);
exports.default = Product;
