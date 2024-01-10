"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const adminSchema = new mongoose_1.Schema({
    _id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        default: mongoose_1.default.Types.ObjectId,
    },
    name: {
        type: String,
        required: [true, "Please add a name"]
    },
    lastName: {
        type: String,
        required: [true, "Please add Last Name"]
    },
    email: {
        type: String,
        required: [true, "Please add an email address"],
        unique: true,
        trim: true,
        match: [
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
    password: {
        type: String,
        required: [true, "Please add password"],
        minlength: [6, "Password must be at least 6 characters"]
    },
    role: {
        type: String,
        required: [true, "Please add the role"]
    },
    companyName: {
        type: String,
        required: function () {
            return this.role === "admin";
        },
    },
    companyRNC: {
        type: String,
        required: function () {
            return this.role === "admin";
        },
    },
    adminOfCompany: {
        type: String,
        required: function () {
            return this.role === "admin";
        },
    },
    consecutiveFailedAttempts: {
        type: Number,
        default: 0,
    },
    isLocked: {
        type: Boolean,
        default: false,
    },
    lastLogin: {
        type: Date,
        default: null,
    },
    expiresAt: {
        type: Date,
        default: null,
    },
}, { timestamps: true });
const AdminCompany = mongoose_1.default.model("AdminCompany", adminSchema);
exports.default = AdminCompany;
