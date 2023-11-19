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
const mail_1 = __importDefault(require("@sendgrid/mail"));
const dotenv_1 = __importDefault(require("dotenv"));
const asyncHandler = require("express-async-handler");
dotenv_1.default.config();
const sendgridApiKey = process.env.SENDGRID_API_KEY;
if (!sendgridApiKey) {
    throw new Error("SENDGRID_API_KEY is not defined in the environment variables.");
}
mail_1.default.setApiKey(sendgridApiKey);
const sendEmail = asyncHandler((subject, message, send_to, sent_from, reply_to) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const to = send_to || "";
    const from = sent_from || "";
    const replyTo = reply_to || sent_from || ""; // Use sent_from as reply_to if not provided separately
    const msg = {
        to,
        from,
        replyTo,
        subject,
        html: message,
    };
    try {
        const info = yield mail_1.default.send(msg);
        console.log(info);
    }
    catch (error) {
        console.log("SendGrid Error:", (_a = error.response) === null || _a === void 0 ? void 0 : _a.body);
    }
}));
exports.default = sendEmail;
