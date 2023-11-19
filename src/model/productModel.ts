import mongoose, { Document } from 'mongoose';

/*This is the Schema Struture for the sckeleton struture 
this is how the data is gona be organized before it stores into 
the data base  is gonna be inside the model function*/



interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  img: string;
}

const productSchema = new mongoose.Schema<IProduct>({
  name: {
    type: String,
    required: [true, 'Please add the product name'],
  },
  description: {
    type: String,
    required: [true, 'Please add a product description'],
  },
  price: {
    type: Number,
    required: [true, 'Please add the product price'],
  },
  img: {
    type: String,
    required: [true, 'Please add the product image URL'],
  },
});



const Product = mongoose.model<IProduct>('Product', productSchema);

export default Product;
