"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController_1 = require("../controller/adminController");
//Routes
const routerAdmin = express_1.default.Router();
routerAdmin.post("/company/login", adminController_1.login);
routerAdmin.post("/company/signup", adminController_1.signup);
routerAdmin.get("/company/logout", adminController_1.logout);
routerAdmin.get("/company/:adminId", adminController_1.getAdmin);
routerAdmin.get("/company/loggedin/:adminId", adminController_1.loginStatus);
routerAdmin.patch("/company/updateadmin/:adminId", adminController_1.updateAdmin);
routerAdmin.patch("/company/changepassword/:adminId", adminController_1.changePassword);
routerAdmin.post("/company/forgotpassword", adminController_1.forgotPassword);
routerAdmin.put("/company/resetpassword/:resetToken", adminController_1.resetPassword);
exports.default = routerAdmin;
