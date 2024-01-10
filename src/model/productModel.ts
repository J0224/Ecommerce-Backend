import mongoose, { Document } from 'mongoose';

/*This is the Schema Struture for the sckeleton struture 
this is how the data is gona be organized before it stores into 
the data base  is gonna be inside the model function*/



interface IProduct extends Document {
  name: string;
  category: string;
  description: string;
  price: number;
  color: string[];
  size: string[];
  image: object;
  quantity: number;
  sku: string;
}

const productSchema = new mongoose.Schema<IProduct>({
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
  size:[],
  quantity:{
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



const Product = mongoose.model<IProduct>('Product', productSchema);

export default Product;
