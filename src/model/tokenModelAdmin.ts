import mongoose, { Document, Schema, ObjectId  } from "mongoose";


const adminTokenSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "admin",
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },

  expiresAt: {
    type: Date,
    required: true,
  },
}, { timestamps: true });

const AdminToken = mongoose.model ("AdminToken", adminTokenSchema);

export default AdminToken;

