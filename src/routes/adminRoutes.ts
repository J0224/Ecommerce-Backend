import express from "express";
 import { 
   signup,
   login, 
   logout, 
   getAdmin,
   loginStatus,
   updateAdmin, 
   changePassword,
   forgotPassword,
   resetPassword
 } from "../controller/adminController";


//Routes
const routerAdmin = express.Router();

routerAdmin.post("/company/login", login);
routerAdmin.post("/company/signup", signup);
routerAdmin.get("/company/logout", logout);
routerAdmin.get("/company/:adminId", getAdmin);
routerAdmin.get("/company/loggedin/:adminId", loginStatus);
routerAdmin.patch("/company/updateadmin/:adminId", updateAdmin);
routerAdmin.patch("/company/changepassword/:adminId", changePassword);
routerAdmin.post("/company/forgotpassword", forgotPassword);
routerAdmin.put("/company/resetpassword/:resetToken", resetPassword);

export default routerAdmin;