import Product from "../model/productModel";
import { Request, Response } from 'express';
import { fileSizeFormatter } from "../utils/uploadImage";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

// Initialize cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "",
  api_key: process.env.CLOUDINARY_API_KEY || "",
  api_secret: process.env.CLOUDINARY_API_SECRET || "",
});


// This is an asynchronous function called createProduct
const createProduct = async (req: Request, res: Response) => {
  const {
    name,
    category,
    description,
    price,
    color,
    size,
    quantity,
    sku,
  } = req.body;

  let fileData = {};

  if(
    !name ||
    !category ||
    !description ||
    !price ||
    !color ||
    !size ||
    !quantity ||
    !sku
  )
  
  if (!req.file) {
    return res.status(400).json({error: "Image File is required"})
  }

  // Handle upload images
  if (req.file) {
    // Save image to cloudinary
    let uploadedFile;
    if (!fs.existsSync(req.file.path)) {
      return res.status(404).json({ error: 'File not found' });
    }
    try {
      
      uploadedFile = await cloudinary.uploader.upload(req.file.path, {
        folder: "Store App",
        resource_type: "image",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Image could not be uploaded" });
    }

    fileData = {
      fileName: req.file.originalname,
      filePath: uploadedFile.secure_url,
      fileType: req.file.mimetype,
      fileSize: fileSizeFormatter(req.file.size, 2),
    };
  }

  try {
    const sku = generateSku(name);
    const newProduct = await Product.create({
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
    
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}; //Ends of createProduct

// Helper function to generate a product code
const generateSku = (productName: string): string => {
  const prefix = productName.slice(0, 2).toUpperCase();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000).toString();
  return `${prefix}${randomSuffix}`;
}

//this is an asyngc fuction called getProducts
 const getProducts = async (req:Request, 
  res:Response) => {
    try {
      const products = await Product.find();
      if(!products){
        return res.status(404).send({message: "There was not product found"})
      }
      return res.status(200).json(products)
    } catch (error) {
      console.log(error);
      res.status(500).json({error: "Internal Server Error"})
      
    }

}; //Ends of getProduct

// this is an async function called getSingleProduct
const getSingleProduct = async (req:Request, 
  res:Response) =>{
    const {id} = req.params;
    try {
      const getOneProduct = await Product.findById(id);
      if(!getOneProduct){
        res.status(404).json({message:  `Product not found, Id: ${id} not exist`});
      } 
      return res.status(200).json(getOneProduct);
      
    } catch (error) {
      console.log(error)
      res.status(500).json({error: "Internal Server Error"})
    }
}; //Ends of getSingleProduct

// this is an async function called updateProduct 
const updateProduct = async (req:Request, 
  res:Response) =>{
    const {id} = req.params;
    const {
      name,
      category,
      description,
      price,
      color,
      size,
      quantity,
       img } = req.body;
    try {
      const updateProduct = await Product.findByIdAndUpdate(id,{  
        name,
        category,
        description,
        price,
        color,
        size,
        quantity,
         img }, {new: true});

      if(!updateProduct){
        return res.status(404).json({error: "Product Not Found"})
      }
      res.status(200).json(updateProduct);

    } catch (error) {
      console.log(error);
      res.status(500).json({error: "Interna Server Error"})

    }

}; //Ends of updateProduct

// this is an async function called deleteProduct
const deleteProduct = async (req:Request, res:Response) => {
  const {id} = req.params;
  
  try {
    const deleteProduct = await Product.findByIdAndDelete(id);
    if(!deleteProduct){
      return res.status(404).json({error: `Product with id:${id} not found`});
    }
    res.status(200).json({message:"Product has been deleted successfully"});

  } catch (error) {
    console.log(error)
    res.status(500).json({error: "Internal Server Error"})
  }

}; //Ends of deleteProduct


// This is an async function called getProductsByCategory
const getProductsByCategory = async (req: Request, res: Response) => {
  const { category } = req.query;

  try {
    const products = await Product.find({ category });
    return res.status(200).json(products);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}; // Ends of 


// This is an async function called searchProduct
const searchProduct = async (req: Request, res: Response) => {
  const search = req.query.search as string;
  console.log("This is the Search term:", search);

  try {
    const products = await Product.find({
      $or: [
        { name: { $regex: new RegExp(search, "i") } },
        { sku: { $regex: new RegExp(search, "i") } },
      ],
    });

    console.log("Found products:", products);

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}; // Ends of searchProduct


/*Here I am Exporting the functions that I created for the CRUD
So that we can use them in the routes folder and everywhere we want*/

export {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  getSingleProduct,
  getProductsByCategory,
  searchProduct,
}