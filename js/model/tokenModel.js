"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const tokenSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        require: true,
        ref: "user",
    },
    token: {
        type: String,
        require: true,
    },
    createdAt: {
        type: Date,
        require: true,
    },
    expiresAt: {
        type: Date,
        require: true,
    }
});
const Token = mongoose_1.default.model("Token", tokenSchema);
module.exports = Token;