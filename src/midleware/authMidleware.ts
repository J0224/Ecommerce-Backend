import {Request, Response, NextFunction} from "express";
import jwt from "jsonwebtoken";
import User from "../model/userModel";
import {IUser} from "../model/userModel";

// Extend the Request object to include a 'user' property
interface AuthRequest extends Request {
  user?: IUser | null; // Use IUser | null 
}

//This is an async function called verifyToken
const verifyToken = async (req: AuthRequest, 
   res: Response) =>{
    try {
      const token = req.cookies.token
      if(!token){
        return res.status(401).json({error: "No authorized, please signup"})
        
      }
       
      //verify token
      const verified: any = jwt.verify(token, process.env.JWT_SECRET || "");
      //get user id from token
      const user = await User.findById(verified.id).select("-nopassword");
      if (!user){
       return res.status(401).json({error: "No user found"});
       
      }
      req.user = user
    


    } catch (error) {
     return res.status(401).json({error: "Authentication failed"})
    }
  

}; // Ends of verifyToken

export default verifyToken