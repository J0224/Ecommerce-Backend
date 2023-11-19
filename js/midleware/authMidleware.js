"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../model/userModel"));
const asyncHandler = require("express-async-handler");
//This is an async function called verifyToken
const verifyToken = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.cookies.token;
        if (!token) {
            res.status(401); //unathorize user
            throw new Error("No authorized, please signup");
        }
        //verify token
        const verified = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "");
        //get user id from token
        const user = yield userModel_1.default.findById(verified.id).select("-nopassword");
        if (!user) {
            res.status(401);
            throw new Error("No user found");
        }
        req.user = user;
        next();
    }
    catch (error) {
        res.status(401);
        throw new Error("No user found");
    }
})); // Ends of verifyToken
module.exports = verifyToken;
