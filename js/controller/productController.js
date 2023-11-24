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
exports.getSingleProduct = exports.deleteProduct = exports.updateProduct = exports.getProducts = exports.createProduct = void 0;
const productModel_1 = __importDefault(require("../model/productModel"));
//this is an asyngc fuction called createProduct
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, price, img } = req.body;
    if (!name || !description || !price || !img) {
        return res.status(404).json({ message: "Please add all fields required" });
    }
    try {
        const newProduct = new productModel_1.default({
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
}); //Ends of createProduct
exports.createProduct = createProduct;
//this is an asyngc fuction called getProducts
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield productModel_1.default.find();
        if (!products) {
            return res.status(404).send({ message: "There was not product found" });
        }
        return res.status(200).json(products);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}); //Ends of getProduct
exports.getProducts = getProducts;
// this is an async function called getSingleProduct
const getSingleProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const getOneProduct = yield productModel_1.default.findById(id);
        if (!getOneProduct) {
            res.status(404).json({ message: `Product not found, Id: ${id} not exist` });
        }
        return res.status(200).json(getOneProduct);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}); //Ends of getSingleProduct
exports.getSingleProduct = getSingleProduct;
// this is an async function called updateProduct 
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, description, price, img } = req.body;
    try {
        const updateProduct = yield productModel_1.default.findByIdAndUpdate(id, { name, description, price, img }, { new: true });
        if (!updateProduct) {
            return res.status(404).json({ error: "Product Not Found" });
        }
        res.status(200).json(updateProduct);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Interna Server Error" });
    }
}); //Ends of updateProduct
exports.updateProduct = updateProduct;
// this is an async function called deleteProduct
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const deleteProduct = yield productModel_1.default.findByIdAndDelete(id);
        if (!deleteProduct) {
            return res.status(404).json({ error: `Product with id:${id} not found` });
        }
        res.status(200).json({ message: "Product has been deleted successfully" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}); //Ends of deleteProduct
exports.deleteProduct = deleteProduct;
