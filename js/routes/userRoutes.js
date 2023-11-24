"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controller/userController");
//Routes
const routerUser = express_1.default.Router();
routerUser.post("/signup", userController_1.signup);
routerUser.post("/login", userController_1.login);
routerUser.get("/logout", userController_1.logout);
routerUser.get("/getuser/:userId", userController_1.getUser);
routerUser.get("/loggedin", userController_1.loginStatus);
routerUser.patch("/updateuser/:userId", userController_1.updateUser);
routerUser.patch("/changepassword/:userId", userController_1.changePassword);
routerUser.post("/forgotpassword", userController_1.forgotPassword);
routerUser.put("/resetpassword/:resetToken", userController_1.resetPassword);
exports.default = routerUser;
