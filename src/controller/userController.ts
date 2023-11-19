import {Request, Response} from "express";
import bcrypt from "bcryptjs";
import jwt, { Secret } from "jsonwebtoken";
import User from "../model/userModel";
const asyncHandler = require ("express-async-handler");
const express = require("express");
const Token = require ("../model/tokenModel");
const crypto = require ("crypto");
import sendEmail from "../utils/sendEmail";

import {
   incrementConsecutiveFailedAttempts,
   resetConsecutiveFailedAttempts,
   lockUserAccount,
   updateLastLogin
} from "./userFunctions";

//This is a function called genarateToken for users
const genarateToken = (userId: string) => {
  const secret: string = process.env.JWT_SECRET || "";
  return jwt.sign({userId}, secret, {expiresIn:"1d"});
};

//This is an async function called signup
const signup = asyncHandler(async(req: Request, res: Response) => { 
  try {
    //Destructuring 
    const { name, email, password, phone, address } = req.body;
   

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(401).json({ error: "User already exists" });
    }

    // Check if all fields are present
    if (!name || !email || !password || !phone || !address) {
      return res.status(400).json({ error: "Please fill out all field required"});
    } 

    if(password.length <6){
      res.status(400)
      throw new Error ("PLease password must be at lest 6 charaters")
    }

    // Hash the password before saving it or creating new user
    const hashPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      name,
      email,
      password: hashPassword,
      phone,
      address,
    });

    // Save the user to the database
    await newUser.save();

    // Generate a token for the user
    const token = genarateToken(newUser._id);

    // This is to send HTTP Only cookie
    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400),
      sameSite: "none",
      secure: true
    });
    
    return res.status(201).json({ userId: newUser._id, token });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}); // Ends of sygnup


//This is an async function called login
const login = asyncHandler(async(req: Request,
res: Response) =>{
  try {
    const {email, password} = req.body;

    // Find the user by email
    const user = await User.findOne({email});
    if(!user){
      return res.status(401).json({error: "Invalid Credentials"})
    }

    // Check if the user is locked
    if(user.isLocked){
      return res.status(401).json({error: "Account is locked. Please contact an administrator."})
    }
    
    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(!isPasswordValid){
      // Increment failed login attempts
      await incrementConsecutiveFailedAttempts(user);

      // Check if the user should be locked
      if(user.consecutiveFailedAttempts >= 5) {
        await lockUserAccount(user);
        return res.status(401).json({error: "Account is locked. Please contact an administrator."})
      }

      return res.status(401).json({error: "Invalid Credentials, keep in mind 5 consecutive fails lock your account"})
    }

    // Reset consecutive failed attempts on successful login
    await resetConsecutiveFailedAttempts(user);

     // Generate a token for the user
     const token = genarateToken(user._id);

     // Update last login
     await updateLastLogin(user);

      // This is to send HTTP Only cookie
    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400),
      sameSite: "none",
      secure: true
    });

     // Return user information and token
    res.status(200).json({userId: user._id, token});
  } catch (error) {
    console.log(error);
    return res.status(500).json({error: "Internal Server Error"})
  }

});// Ends of login

//This is an async function called logout
const logout = asyncHandler(async (req: Request, 
  res: Response) => {
       // This is to send HTTP Only cookie
       res.cookie("token", {
        path: "/",
        httpOnly: true,
        expires: new Date(0),// Expire the cookie
        sameSite: "none",
        secure: true
      });
      return res.status(200).json({message: "You have logged out successfully"})
}); //Ends of logout

//This is an async function called getUser to get users data
const getUser = asyncHandler(async (req: Request, res: Response) => {
  const {userId} = req.params
  const user = await User.findById(userId)

  if (user) {
    const {_id, email, name, address, phone} = user;
    res.status(200).json({ _id, email, name, address, phone });
  } else {
    res.status(400).json({ error: "User not found" });
  }
  

}); // Ends of getUser 

//This is an async fuction called loginStatus to Get login status of the user
const loginStatus = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies.token;

  // If there is no token, the user is not logged in
  if(!token){
    return res.json(false).send("You are not logged in, please sign in.")
  }
  try {
    // Verify the token using the secret
    const secret: string = process.env.JWT_SECRET || "";
    const verifiedToken = jwt.verify(token, secret );
    // If verification is successful, the user is logged in
    if(verifiedToken){
      return res.json(true).send("You are logged in");
    }
    // If verification fails, the user is not logged in
    return res.json(false).send("You are not logged in, please sign in.");
  } catch (error) {
    /*If there is any error in the verification process,
     the user is not logged in */
     console.log(error)
     return res.json(false).send("You are not logged in, please sign in.");
  }
}); // Ends of loginStatus

//This is an async fuction called updateUser to update the user data
const updateUser = asyncHandler(async(req: Request, res: Response) => {
  const { userId } = req.params;
  const user = await User.findById(userId);

  if(user){ 
    const {name, email, phone, address } = user;
    user.email = email;
    user.name = req.body.name || name;
    user.phone = req.body.phone || phone;
    user.address = req.body.address || address;

    const updatedUser = await user.save();
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      address: updatedUser.address,
    })
  } else {
    res.status(404)
    throw new Error("User has not been found");
  }
}) // Ends of updateUser

//This is an async fuction called changePassword to change the user password
const changePassword = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const {oldPassword, password} = req.body;
  
  const user = await User.findById(userId);
  if(!user){
   return res.status(400).send("User not Found, Please sign up");
    
  }
  //This is the validation to change the password
  if(!oldPassword || !password ){
    return res.status(400).send("Please add existing password and the new password")
    
  }
   //Check if old password is correct or matches in DB
   const passwordIsCorrect = await bcrypt.compare(oldPassword, user.password);

    // Save new hashed password
    if(user && passwordIsCorrect){
      const newHashedPssword = await bcrypt.hash(password, 10);
      user.password = newHashedPssword;
      await user.save();
      res.status(200).send("Password has been changed successfully");
    } else {
     return res.status(400).send("Invalid Credentials, keep in mind 5 consecutive fails lock your account");
    }

}); // Ends of changePassword



//This is an async fuction called forgotPassword to reset the user password
const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const {email} = req.body;
  const user = await User.findOne({email});

  if(!user){
    res.status(404)
    throw new Error("User do not exist")
  }

  // Delete Token if exists in DB
  let token = await Token.findOne({userId: user._id})
  if (token){
    await token.deleteOne()
  } 
  //Create reset token
  let resetToken = crypto.randomBytes(32).toString("hex") + user._id;

  //Hash Token before saving to DB
  const hashedToken = crypto
  .createHash("sha256")
  .update(resetToken)
  .digest("hex");



  //Save token to DB
  await new Token({
    userId: user._id,
    token:  hashedToken,
    createdAt: Date.now(),
    expiresAt: Date.now() + 30 * (60 * 1000) //30 minutes
  }).save();

  //Construct reset URL
  const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`

  //Reset Email
  const message = `
  <div class="container-reset-password">
  <h2>Campanita Store Password Reset</h2>

  <p> Hello ${user.name} <p>

  <p>We received a request to reset your Campanita Store account password. If you did not make this request, you can ignore this email.</p>

  <p>Please click the link below to reset your password. This link will expire in 30 minutes for security reasons:</p>

  <p>If you're having trouble clicking the link, you can copy and paste the following URL into your browser:</p>

  <p> <a href=${resetUrl}> ${resetUrl} </a> </p>

  <p>This password reset link is valid for 30 minutes. After that, you'll need to request a new link.</p>

  <p>Best regards,<br>Campanita Store Team</p>
  </div>
  `;

  const subject = "Campanita Store Reset Password"
  const send_to = user.email
  const sent_from = process.env.EMAIL_USER

  try {
    await sendEmail(subject, message, send_to, sent_from,);
    res.status(200)
    .json({
      success: true, 
      message: "Please check your email and follow the proccess to reset the password"});

  } catch (error) {
    res.status(500);
    throw new Error("There was an issue, please try again later");
  }

}); // Ends of forgotPassword


// This is an async function called resetPassword
const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { password } = req.body;
  const { resetToken } = req.params;

  try {
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    // Retrieve the token from the database
    const userToken = await Token.findOne({ token: hashedToken });


    if (!userToken) {
      return res.status(404).json({ error: "Invalid token" });
    }

    // Check if the token is expired
    if (userToken.expiresAt < Date.now()) {
      return res.status(400).json({ error: "Token Expired" });
    }

    // Retrieve the user based on the token
    const user = await User.findById(userToken.userId);

    if (!user) {
      return res.status(404).json({ error: "User not found please sign up" });
    }

    // Save token to DB
    await new Token({
    userId: user._id,
    token: hashedToken,
    createdAt: Date.now(),
    expiresAt: Date.now() + 30 * (60 * 1000) // 30 minutes
    }).save();

    // Hash the new password and update the user's password
    const newHashedPassword = await bcrypt.hash(password, 10);
    user.password = newHashedPassword;

    // Save the updated user to the database
    await user.save();

    // Delete the token from the database since it's been used
    await userToken.deleteOne();

    return res.status(200).json({ message: "Password has been reset successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}); //Ends of resetPassword


module.exports = {
  signup,
  login,
  logout,
  getUser,
  loginStatus,
  updateUser,
  changePassword,
  forgotPassword,
  resetPassword,
}