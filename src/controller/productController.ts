const asyncHandler = require("express-async-handler");
const Product = require("../model/productModel").default;
const jwt = require ("jsonwebtoken");
import { Request, Response } from 'express';
import { send } from 'process';


//this is an asyngc fuction called createProduct
 const createProduct = asyncHandler(async (req: Request, 
  res: Response) => {
  const { name, description, price, img } = req.body;

  if (!name || !description || !price || !img){
    return res.status(404).send({message: "Please add all fields required"})
  }

  try {
    const newProduct = new Product({
      name,
      description,
      price,
      img,
    });

    await newProduct.save();
    return res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}); //Ends of createProduct

//this is an asyngc fuction called getProducts
 const getProducts = asyncHandler (async (req:Request, 
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

}); //Ends of getProduct

// this is an async function called getSingleProduct
const getSingleProduct = asyncHandler(async (req:Request, 
  res:Response) =>{
    const {id} = req.params;
    try {
      const getOneProduct = await Product.findById(id);
      if(!getOneProduct){
        res.status(404).send({message:  `Product not found, Id: ${id} not exist`});
      } 
      return res.status(200).json(getOneProduct);
      
    } catch (error) {
      console.log(error)
      res.status(500).json({error: "Internal Server Error"})
    }
}); //Ends of getSingleProduct

// this is an async function called updateProduct 
const updateProduct = asyncHandler(async (req:Request, 
  res:Response) =>{
    const {id} = req.params;
    const { name, description, price, img } = req.body;
    try {
      const updateProduct = await Product.findByIdAndUpdate(id,{ name, description, price, img }, {new: true});

      if(!updateProduct){
        return res.status(404).json({error: "Product Not Found"})
      }
      res.status(200).json(updateProduct);

    } catch (error) {
      console.log(error);
      res.status(500).json({error: "Interna Server Error"})

    }

}); //Ends of updateProduct

// this is an async function called deleteProduct
const deleteProduct = asyncHandler(async (req:Request, res:Response) => {
  const {id} = req.params;
  
  try {
    const deleteProduct = await Product.findByIdAndDelete(id);
    if(!deleteProduct){
      return res.status(404).json({error: `Product with id:${id} not found`});
    }
    res.status(200).send({message:"Product has been deleted successfully"})
  } catch (error) {
    console.log(error)
    res.status(500).json("Internal Server Error")
  }

}); //Ends of deleteProduct


/*Here I am Exporting the functions that I created for the CRUD
So that we can use them in the routes folder and everywhere we want*/

module.exports = {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  getSingleProduct,
}
