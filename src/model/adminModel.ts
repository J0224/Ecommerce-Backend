import { timeStamp } from "console";
import mongoose, {Document, Schema} from "mongoose";
import bcrypt from "bcryptjs";
import { Admin } from "mongodb";

interface IAdmin extends Document {
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
  role: "admin";
  companyName: string;
  companyRNC: string;
  adminOfCompany: string;
  expiresAt: Date | null;
}


const adminSchema = new Schema<IAdmin>({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    default: mongoose.Types.ObjectId,
  },

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
    required: [true,"Please add the role"]

  },

  companyName: {
    type: String,
    required: function(this: IAdmin){
      return this.role === "admin";
    },
  },
  companyRNC: {
    type: String, 
    required: function(this: IAdmin){
      return this.role === "admin";
    },
  },
  adminOfCompany: {
    type: String,
    required: function(this: IAdmin){
      return this.role === "admin";
    },

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
  expiresAt: {
    type: Date,
    default: null,
  },

}, {timestamps: true}
);

const AdminCompany = mongoose.model<IAdmin>("AdminCompany",adminSchema);

export default AdminCompany;
export   {IAdmin};