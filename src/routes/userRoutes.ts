import express from "express";
import verifyToken from "../midleware/authMidleware";
 import { 
   signup,
   login, 
   logout, 
   getUser,
   loginStatus,
   updateUser, 
   changePassword,
   forgotPassword,
   resetPassword
 } from "../controller/userController";


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

export default routerUser;