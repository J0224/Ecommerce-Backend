"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const User = require("../model/userModel");
const { signup, login, logout, getUser, loginStatus, updateUser, changePassword, forgotPassword, resetPassword } = require("../controller/userController");
//Routes
const routerUser = express.Router();
routerUser.post("/signup", signup);
routerUser.post("/login", login);
routerUser.get("/logout", logout);
routerUser.get("/getuser/:userId", getUser);
routerUser.get("/loggedin", loginStatus);
routerUser.patch("/updateuser/:userId", updateUser);
routerUser.patch("/changepassword/:userId", changePassword);
routerUser.post("/forgotpassword", forgotPassword);
routerUser.put("/resetpassword/:resetToken", resetPassword);
exports.default = routerUser;
