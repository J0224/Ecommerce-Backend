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
  guestId: mongoose.Types.ObjectId;
  cartId: mongoose.Types.ObjectId;
  nameUser?: string;
  items: ICartItem[];
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
  guestId: String,
  nameUser: String,
  items: [cartItemSchema],
  subTotal: Number,
  total: Number,
});

const Cart = mongoose.model<ICart>('Cart', cartSchema);

export { ICartItem, ICart, Cart };
