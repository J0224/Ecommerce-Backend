import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
  userId:{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref:"user",
  },

  token:{
    type: String,
    required: true,
    unique: true,
  },

  createdAt:{
    type: Date,
    default: Date.now,
    required: true,
  }, 
  
  expiresAt:{
    type: Date,
    required: true,
  }
}) 

const Token = mongoose.model("Token", tokenSchema);

export default Token