import {Request, Response, NextFunction} from "express";
import jwt from "jsonwebtoken";
import User from "../model/userModel";
const asyncHandler = require("express-async-handler");

// Extend the Request object to include a 'user' property
interface AuthRequest extends Request {
  user?: {}
}

//This is an async function called verifyToken
const verifyToken =  asyncHandler(async (req: AuthRequest, 
   res: Response, next: NextFunction) =>{
    try {
      const token = req.cookies.token
      if(!token){
        res.status(401)//unathorize user
        throw new Error("No authorized, please signup")
      }
       
      //verify token
      const verified: any = jwt.verify(token, process.env.JWT_SECRET || "");
      //get user id from token
      const user = await User.findById(verified.id).select("-nopassword");
      if (!user){
        res.status(401)
        throw new Error("No user found") 
      }
      req.user = user
      next()


    } catch (error) {
      res.status(401);
      throw new Error("No user found") 
    }
  

}); // Ends of verifyToken

module.exports = verifyToken