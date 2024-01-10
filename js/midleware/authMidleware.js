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
const adminModel_1 = __importDefault(require("../model/adminModel"));
const verifyToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check for the token in headers
        const token = req.headers.authorization && req.headers.authorization.split(" ")[1];
        if (!token) {
            return res.status(401).json({ error: "No authorized, please signup" });
        }
        const verified = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "");
        const admin = yield adminModel_1.default.findById(verified.adminId).select("-nopassword");
        if (!admin) {
            return res.status(401).json({ error: "No user found" });
        }
        req.admin = admin;
        if (admin.role === "admin") {
            return next();
        }
        return res.status(403).json({ error: "Permission denied" });
    }
    catch (error) {
        return res.status(401).json({ error: "Authentication failed" });
    }
});
exports.default = verifyToken;
