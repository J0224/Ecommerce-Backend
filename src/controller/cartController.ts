import { Cart, ICart, ICartItem } from '../model/cartModel';
import { Request, Response } from 'express';
import mongoose from 'mongoose';

// This is an async function called addProduct
const addProduct = async (req: Request, res: Response) => {
  try {
    //destrocturing from Cart Schema Model ICartItem, ICart
    const { userId, nameUser, product, quantity, guestId } = req.body as {
      userId: mongoose.Types.ObjectId;
      nameUser?: string;
      guestId: string;
      product: {
        _id: mongoose.Types.ObjectId;
        name: string;
        price: number;
      };
      quantity: number;
    };

    if (!product || !quantity) {
      return res.status(400).send("Please provide product and quantity");
    }
    
    let cart: ICart | null;
    

    if (userId) {
      cart = await Cart.findOne({ user: userId, nameUser });
    } else {
      cart = await Cart.findOne({ guestId });
    }
    
    if (!cart) {
      let guestId: string;
      // Generate a unique guestId if not provided
      guestId = new mongoose.Types.ObjectId().toHexString();
      cart = new Cart({
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
    } else {
      const existingItem = cart.items.find(
        (item) => item && item.product && item.product.equals(product._id)
      );
    
      if (existingItem) {
        // Asigning quantity user can increment quantity
        existingItem.quantity += quantity;
        // Calculating subtotal
        existingItem.subTotal = existingItem.quantity * product.price;
        existingItem.total = existingItem.quantity * product.price;
      } else {
        // Create new item in the ICartItem that is in Cart schema
        const newItem = {
          product: product._id,
          name: product.name,
          price: product.price,
          quantity,
          subTotal: product.price * quantity,
          total: product.price * quantity,
        } as ICartItem;
        cart.items.push(newItem);
      }
    }
    
    await cart.save();
    

   // Calculate subTotal and total based on the items in the cart
   cart.subTotal = cart.items.reduce( (acc, item) => acc + (item.subTotal || 0), 0 );
   cart.total = cart.items.reduce( (acc, item) => acc + (item.total || 0), 0 );

    await cart.save();

    res.status(201).json(cart);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}; // Ends of addProduct


// This is an async function called deleteCartProduct
const deleteCartProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { product, quantityToRemove = 1 } = req.body as {
    product: {
      _id: mongoose.Types.ObjectId;
      name: string;
      price: number;
    };
    quantityToRemove?: number; // Optional parameter, defaults to 1
  };

  try {
    // Find the cart by ID and remove the product from the items array
    let cart = await Cart.findById(id);

    if (!cart) {
      return res.status(404).json({ error: `Product with id: ${product._id} not found in cart with id: ${id} ` });
    }
    // Find the item in the cart with the specified product ID
    const cartItem: ICartItem | undefined = cart.items.find(item => item.product.equals(product._id));

    if (!cartItem) {
      return res.status(404).json({ error: `Product with id:${product._id} not found in the cart with id:${id}` });
    }

    /* Check if the quantity to remove is greater than or equal to the item's quantity */
    if (quantityToRemove >= cartItem.quantity) {
      // Remove the entire item if the quantity to remove is greater or equal
      cart.items = cart.items.filter(item => !item.product.equals(product._id));
    } else {
      // Reduce the quantity if the quantity to remove is less than the item's quantity
      cartItem.quantity -= quantityToRemove;
      cartItem.subTotal = cartItem.quantity * cartItem.price;
      cartItem.total = cartItem.quantity * cartItem.price;
    }

   // Calculate subTotal and total based on the items in the cart
    cart.subTotal = cart.items.reduce((acc, item) => acc + (item.subTotal || 0), 0);
    cart.total = cart.items.reduce((acc, item) => acc + (item.total || 0), 0);

    await cart.save();

    return res.status(200).json({ message: `Successfully removed ${quantityToRemove} ${product.name} (s) from the shopping cart` });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// This is an async function called getCart
const getCart = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // Use id directly

    // Find the cart by _id
    const cart: ICart | null = await Cart.findById(id);

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    res.status(200).json(cart);
  } catch (error) {
    console.error('Error in getCart:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};


export { addProduct, deleteCartProduct, getCart };
