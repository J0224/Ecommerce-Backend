"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCart = exports.deleteCartProduct = exports.addProduct = void 0;
const cartModel_1 = require("../model/cartModel");
const mongoose_1 = __importDefault(require("mongoose"));
// This is an async function called addProduct
const addProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //destrocturing from Cart Schema Model ICartItem, ICart
        const { userId, nameUser, product, quantity, guestId } = req.body;
        if (!product || !quantity) {
            return res.status(400).send("Please provide product and quantity");
        }
        let cart;
        if (userId) {
            cart = yield cartModel_1.Cart.findOne({ user: userId, nameUser });
        }
        else {
            cart = yield cartModel_1.Cart.findOne({ guestId });
        }
        if (!cart) {
            let guestId;
            // Generate a unique guestId if not provided
            guestId = new mongoose_1.default.Types.ObjectId().toHexString();
            cart = new cartModel_1.Cart({
                user: userId,
                guestId,
                nameUser: nameUser,
                items: [
                    {
                        product: product._id,
                        name: product.name,
                        price: product.price,
                        quantity,
                        subTotal: product.price * quantity,
                        total: product.price * quantity,
                    },
                ],
            });
        }
        else {
            const existingItem = cart.items.find((item) => item && item.product && item.product.equals(product._id));
            if (existingItem) {
                // Asigning quantity user can increment quantity
                existingItem.quantity += quantity;
                // Calculating subtotal
                existingItem.subTotal = existingItem.quantity * product.price;
                existingItem.total = existingItem.quantity * product.price;
            }
            else {
                // Create new item in the ICartItem that is in Cart schema
                const newItem = {
                    product: product._id,
                    name: product.name,
                    price: product.price,
                    quantity,
                    subTotal: product.price * quantity,
                    total: product.price * quantity,
                };
                cart.items.push(newItem);
            }
        }
        yield cart.save();
        // Calculate subTotal and total based on the items in the cart
        cart.subTotal = cart.items.reduce((acc, item) => acc + (item.subTotal || 0), 0);
        cart.total = cart.items.reduce((acc, item) => acc + (item.total || 0), 0);
        yield cart.save();
        res.status(201).json(cart);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}); // Ends of addProduct
exports.addProduct = addProduct;
// This is an async function called deleteCartProduct
const deleteCartProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { product, quantityToRemove = 1 } = req.body;
    try {
        // Find the cart by ID and remove the product from the items array
        let cart = yield cartModel_1.Cart.findById(id);
        if (!cart) {
            return res.status(404).json({ error: `Product with id: ${product._id} not found in cart with id: ${id} ` });
        }
        // Find the item in the cart with the specified product ID
        const cartItem = cart.items.find(item => item.product.equals(product._id));
        if (!cartItem) {
            return res.status(404).json({ error: `Product with id:${product._id} not found in the cart with id:${id}` });
        }
        /* Check if the quantity to remove is greater than or equal to the item's quantity */
        if (quantityToRemove >= cartItem.quantity) {
            // Remove the entire item if the quantity to remove is greater or equal
            cart.items = cart.items.filter(item => !item.product.equals(product._id));
        }
        else {
            // Reduce the quantity if the quantity to remove is less than the item's quantity
            cartItem.quantity -= quantityToRemove;
            cartItem.subTotal = cartItem.quantity * cartItem.price;
            cartItem.total = cartItem.quantity * cartItem.price;
        }
        // Calculate subTotal and total based on the items in the cart
        cart.subTotal = cart.items.reduce((acc, item) => acc + (item.subTotal || 0), 0);
        cart.total = cart.items.reduce((acc, item) => acc + (item.total || 0), 0);
        yield cart.save();
        return res.status(200).json({ message: `Successfully removed ${quantityToRemove} ${product.name} (s) from the shopping cart` });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.deleteCartProduct = deleteCartProduct;
// This is an async function called getCart
const getCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params; // Use id directly
        // Find the cart by _id
        const cart = yield cartModel_1.Cart.findById(id);
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }
        res.status(200).json(cart);
    }
    catch (error) {
        console.error('Error in getCart:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.getCart = getCart;
