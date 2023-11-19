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
Object.defineProperty(exports, "__esModule", { value: true });
const asyncHandler = require("express-async-handler");
const Product = require("../model/productModel").default;
const jwt = require("jsonwebtoken");
//this is an asyngc fuction called createProduct
const createProduct = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, price, img } = req.body;
    if (!name || !description || !price || !img) {
        return res.status(404).send({ message: "Please add all fields required" });
    }
    try {
        const newProduct = new Product({
            name,
            description,
            price,
            img,
        });
        yield newProduct.save();
        return res.status(201).json(newProduct);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})); //Ends of createProduct
//this is an asyngc fuction called getProducts
const getProducts = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield Product.find();
        if (!products) {
            return res.status(404).send({ message: "There was not product found" });
        }
        return res.status(200).json(products);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})); //Ends of getProduct
// this is an async function called getSingleProduct
const getSingleProduct = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const getOneProduct = yield Product.findById(id);
        if (!getOneProduct) {
            res.status(404).send({ message: `Product not found, Id: ${id} not exist` });
        }
        return res.status(200).json(getOneProduct);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})); //Ends of getSingleProduct
// this is an async function called updateProduct 
const updateProduct = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, description, price, img } = req.body;
    try {
        const updateProduct = yield Product.findByIdAndUpdate(id, { name, description, price, img }, { new: true });
        if (!updateProduct) {
            return res.status(404).json({ error: "Product Not Found" });
        }
        res.status(200).json(updateProduct);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Interna Server Error" });
    }
})); //Ends of updateProduct
// this is an async function called deleteProduct
const deleteProduct = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const deleteProduct = yield Product.findByIdAndDelete(id);
        if (!deleteProduct) {
            return res.status(404).json({ error: `Product with id:${id} not found` });
        }
        res.status(200).send({ message: "Product has been deleted successfully" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json("Internal Server Error");
    }
})); //Ends of deleteProduct
/*Here I am Exporting the functions that I created for the CRUD
So that we can use them in the routes folder and everywhere we want*/
module.exports = {
    createProduct,
    getProducts,
    updateProduct,
    deleteProduct,
    getSingleProduct,
};
