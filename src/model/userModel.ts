import { timeStamp } from "console";
import mongoose, {Document, Schema} from "mongoose";
const bcrypt = require("bcryptjs");

interface IUser extends Document {
  name: string;
  address: string;
  phone: string;
  email: string;
  password: string;
  consecutiveFailedAttempts: number;
  isLocked: boolean;
  lastLogin: Date | null;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String, 
    required: [true, "Please add a name"]
   },

  address: {
    type: String, 
    required: [true, "Please add an address"] 
  },
  phone: {
    type: String, 
  
  },
  email:{
    type: String, 
    required: [true, "Please add an email address"],
    unique: true,
    trim: true,
    match:[
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    "Please add a valid email address"
  ]
  },

  password:{
    type: String, 
    required: [true, "Please add password"],
    minlength:[6, "Password must be at least 6 characters"]
  },

  consecutiveFailedAttempts:{
    type: Number,
    default: 0,
  },

  isLocked: {
    type: Boolean,
    default: false,
  },

  lastLogin:{
    type: Date,
    default: null,
  }

}, {timestamps: true}
);

const User = mongoose.model<IUser>("User",userSchema);

export default User;
export   {IUser};