"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const adminTokenSchema = new mongoose_1.default.Schema({
    adminId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
const AdminToken = mongoose_1.default.model("AdminToken", adminTokenSchema);
exports.default = AdminToken;
