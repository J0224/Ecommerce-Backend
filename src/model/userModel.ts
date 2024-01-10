import { timeStamp } from "console";
import mongoose, {Document, Schema} from "mongoose";
import bcrypt from "bcryptjs";
import { Admin } from "mongodb";

interface IUser extends Document {
  name: string;
  lastName: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  password: string;
  consecutiveFailedAttempts: number;
  isLocked: boolean;
  lastLogin: Date | null;

  role:"customer"; // Use string literal types here
}

const userSchema = new Schema<IUser>({
  name: {
    type: String, 
    required: [true, "Please add a name"]
   },
   lastName:{
    type: String,
    required: [true, "Please add Last Name"]
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

  phone: {
    type: String, 
    required: [true, "Please add an phone number"] 
  },

  streetAddress: {
    type: String, 
    required: [true, "Please add an street address"] 
  },
  
  city: {
    type: String,
    required: [true, "Please add a city"],
  },
  state: {
    type: String,
    required: [true, "Please add a state"],
  },
  zipCode: {
    type: String,
    required: [true, "Please add a ZIP Code"],
  },

  password:{
    type: String, 
    required: [true, "Please add password"],
    minlength:[6, "Password must be at least 6 characters"]
  },

  role: {
    type: String,
    default: "customer",
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
  },

}, {timestamps: true}
);

const User = mongoose.model<IUser>("User",userSchema);

export default User;
export   {IUser};