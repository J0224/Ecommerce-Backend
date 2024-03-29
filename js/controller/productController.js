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
exports.searchProduct = exports.getProductsByCategory = exports.getSingleProduct = exports.deleteProduct = exports.updateProduct = exports.getProducts = exports.createProduct = void 0;
const productModel_1 = __importDefault(require("../model/productModel"));
const uploadImage_1 = require("../utils/uploadImage");
const cloudinary_1 = require("cloudinary");
const fs_1 = __importDefault(require("fs"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Initialize cloudinary configuration
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "",
    api_key: process.env.CLOUDINARY_API_KEY || "",
    api_secret: process.env.CLOUDINARY_API_SECRET || "",
});
// This is an asynchronous function called createProduct
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, category, description, price, color, size, quantity, sku, } = req.body;
    let fileData = {};
    if (!name ||
        !category ||
        !description ||
        !price ||
        !color ||
        !size ||
        !quantity ||
        !sku)
        if (!req.file) {
            return res.status(400).json({ error: "Image File is required" });
        }
    // Handle upload images
    if (req.file) {
        // Save image to cloudinary
        let uploadedFile;
        if (!fs_1.default.existsSync(req.file.path)) {
            return res.status(404).json({ error: 'File not found' });
        }
        try {
            uploadedFile = yield cloudinary_1.v2.uploader.upload(req.file.path, {
                folder: "Store App",
                resource_type: "image",
            });
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ error: "Image could not be uploaded" });
        }
        fileData = {
            fileName: req.file.originalname,
            filePath: uploadedFile.secure_url,
            fileType: req.file.mimetype,
            fileSize: (0, uploadImage_1.fileSizeFormatter)(req.file.size, 2),
        };
    }
    try {
        const sku = generateSku(name);
        const newProduct = yield productModel_1.default.create({
            name,
            category,
            description,
            price,
            color,
            size,
            quantity,
            sku,
            image: fileData,
        });
        return res.status(201).json(newProduct);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}); //Ends of createProduct
exports.createProduct = createProduct;
// Helper function to generate a product code
const generateSku = (productName) => {
    const prefix = productName.slice(0, 2).toUpperCase();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000).toString();
    return `${prefix}${randomSuffix}`;
};
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
    const { name, category, description, price, color, size, quantity, img } = req.body;
    try {
        const updateProduct = yield productModel_1.default.findByIdAndUpdate(id, {
            name,
            category,
            description,
            price,
            color,
            size,
            quantity,
            img
        }, { new: true });
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
// This is an async function called getProductsByCategory
const getProductsByCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { category } = req.query;
    try {
        const products = yield productModel_1.default.find({ category });
        return res.status(200).json(products);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}); // Ends of 
exports.getProductsByCategory = getProductsByCategory;
// This is an async function called searchProduct
const searchProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const search = req.query.search;
    console.log("This is the Search term:", search);
    try {
        const products = yield productModel_1.default.find({
            $or: [
                { name: { $regex: new RegExp(search, "i") } },
                { sku: { $regex: new RegExp(search, "i") } },
            ],
        });
        console.log("Found products:", products);
        res.json(products);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}); // Ends of searchProduct
exports.searchProduct = searchProduct;
