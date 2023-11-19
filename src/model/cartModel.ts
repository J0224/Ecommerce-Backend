import mongoose, { Document } from "mongoose";

interface ICartItem extends Document {
  product: mongoose.Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  subTotal: number;
  total: number;
}

interface ICart extends Document {
  user: mongoose.Types.ObjectId;
  nameUser: string;
  items: ICartItem[];
  price: number;
  subTotal: number;
  total: number;
}

const cartItemSchema = new mongoose.Schema<ICartItem>({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  name: String,
  price: Number,
  quantity: Number,
  subTotal: Number,
  total: Number,
});

const cartSchema = new mongoose.Schema<ICart>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  nameUser: String,
  items: [cartItemSchema],
  price: Number,
  subTotal: Number,
  total: Number,
});

const Cart = mongoose.model<ICart>('Cart', cartSchema);

export { ICartItem, ICart, Cart };
