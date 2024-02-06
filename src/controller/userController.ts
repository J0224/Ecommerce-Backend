import {Request, Response} from "express";
import bcrypt from "bcryptjs";
import jwt, { Secret } from "jsonwebtoken";
import User from "../model/userModel";
import Token from "../model/tokenModel";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail";
import {
   incrementConsecutiveFailedAttempts,
   resetConsecutiveFailedAttempts,
   lockUserAccount,
   updateLastLogin,
} from "./userFunctions";
import { 
  emailValidator, 
  passwordValidator,
  phoneValidator, 
  addressValidator, 
  ValidationResult, } from "../utils/validation";

//This is a function called genarateToken for users
const generateToken = (userId: string) => {
  const secret: string = process.env.JWT_SECRET || "";
  return jwt.sign({userId}, secret, {expiresIn:"1d"});
};

//This is an async function called signup
export const signup = async(req: Request, res: Response) => { 
  try {
    //Destructuring 
    const { name, lastName, email, password, confirmPassword, phone, streetAddress, city, state, zipCode, } = req.body;

     // Validate user input
     const emailValidationResult: ValidationResult = emailValidator(email);
     const passwordValidationResult: ValidationResult = passwordValidator(password);
     const phoneValidationResult: ValidationResult = phoneValidator(phone);
     const addressValidationResult: ValidationResult = addressValidator(streetAddress, city, state, zipCode);

     // Check if any validation failed
     if(
      !emailValidationResult.isValid || !passwordValidationResult.isValid || !phoneValidationResult.isValid || !addressValidationResult.isValid ){
        return res.status(400).json({
          error: "Invalid inputs",
          emailValidation: emailValidationResult,
          passwordValidation: passwordValidationResult,
          phoneValidation: phoneValidationResult,
          addressValidation: addressValidationResult,
        });
      }
   

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }

    // Check if the password and confirmPassword match
if (password !== confirmPassword) {
  return res.status(400).json({ error: "Password and confirmPassword do not match" });
}

    // Check if all fields are present
    if (!name || !lastName || !email || !password || !phone || !streetAddress || !city || !state || !zipCode) {
      return res.status(400).json({ error: "Please fill out all field required"});
    } 

    // Hash the password before saving it or creating new user
    const hashPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      name,
      lastName,
      email,
      password: hashPassword,
      phone,
      streetAddress,
      city,
      state,
      zipCode,
      role: "customer",

    });

    // Save the user to the database
    await newUser.save();

    // Generate a token for the user
    const token = generateToken(newUser._id);

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
}; // Ends of sygnup


//This is an async function called login
export const login = async(req: Request,
res: Response) =>{
  try {
    const {email, password} = req.body;

      // Validate user input
      const emailValidationResult: ValidationResult = emailValidator(email);
      const passwordValidationResult: ValidationResult = passwordValidator(password);
      if(!emailValidationResult.isValid || !passwordValidationResult.isValid){
        return res.status(400).json({
          error: "Invalid inputs",
          emailValidation: emailValidationResult,
          passwordValidation: passwordValidationResult,
        });

      }
    

    // Find the user by email
    const user = await User.findOne({email});
    if(!user){
      return res.status(401).json({error: "No account found with that email."})
    }

    // Check if the user is locked
    if(user.isLocked){
      return res.status(403).json({error: "Account is locked. Please contact an administrator."})
    }
    
    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(!isPasswordValid){
      // Increment failed login attempts
      await incrementConsecutiveFailedAttempts(user);

      // Check if the user should be locked
      if(user.consecutiveFailedAttempts >= 5) {
        await lockUserAccount(user);
        return res.status(403).json({error: "Account is locked. Please contact an administrator."})
      }

      return res.status(400).json({error: "Invalid Credentials, keep in mind 5 consecutive fails lock your account"})
    }

    // Reset consecutive failed attempts on successful login
    await resetConsecutiveFailedAttempts(user);

     // Generate a token for the user
     const token = generateToken(user._id);

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
   return res.status(200).json({userId: user._id,firstName: user.name, token});
  } catch (error) {
    console.log(error);
    return res.status(500).json({error: "Internal Server Error"})
  }

};// Ends of login

//This is an async function called logout
export const logout = async (req: Request, 
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
}; //Ends of logout

//This is an async function called getUser to get users data
export const getUser = async (req: Request, res: Response) => {
  try {
  const {userId} = req.params
  const user = await User.findById(userId)

  if (user) {
    const {_id, name, lastName, email, phone, streetAddress, city, state, zipCode} = user;
    return res.status(200).json({_id, name, lastName, email, phone, streetAddress, city, state, zipCode });
  }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: "User not found" });
  }
  
}; // Ends of getUser 

//This is an async fuction called loginStatus to Get login status of the user
export const loginStatus = async (req: Request, res: Response) => {
  const token = req.cookies.token;

  // If there is no token, the user is not logged in
  if(!token){
    return res.status(401).json({error: "You are not logged in, please sign in."});
  }
  try {
    // Verify the token using the secret
    const secret: string = process.env.JWT_SECRET || "";
    const verifiedToken = jwt.verify(token, secret );
    // If verification is successful, the user is logged in
    if(verifiedToken){
      return res.status(200).json({message: "You are logged in"})
    }
    // If verification fails, the user is not logged in
    return res.status(401).json({error: "You are not logged in, please sign in."})
  } catch (error) {
    /*If there is any error in the verification process,
     the user is not logged in */
     console.log(error)
     return res.status(401).json({error: "You are not logged in, please sign in."})
  }
}; // Ends of loginStatus

//This is an async fuction called updateUser to update the user data
export const updateUser = async(req: Request, res: Response) => {
  const { userId } = req.params;
  const user = await User.findById(userId);

  if(user){ 
    const {name, email, phone, streetAddress, lastName, state, zipCode, city } = user;
    user.email = email;
    user.name = req.body.name === undefined? name: req.body.name;
    user.lastName = req.body.lastName === undefined? lastName: req.body.lastName;
    user.phone = req.body.phone === undefined? phone: req.body.phone;
    user.streetAddress = req.body.address === undefined ?  streetAddress: req.body.address;
    user.state = req.body.state === undefined? state: req.body.state;
    user.zipCode = req.body.zipCode === undefined? zipCode: req.body.zipCode;
    user.city = req.body.city === undefined? city: req.body.city;

     // Validate user input
    
     // Validate user input
     const emailValidationResult: ValidationResult = emailValidator(email);
     const phoneValidationResult: ValidationResult = phoneValidator(phone);
     const addressValidationResult: ValidationResult = addressValidator(streetAddress, city, state, zipCode);

     // Check if any validation failed
     if(
      !emailValidationResult.isValid || !phoneValidationResult.isValid || !addressValidationResult.isValid ){
        return res.status(400).json({
          error: "Invalid inputs",
          emailValidation: emailValidationResult,
          phoneValidation: phoneValidationResult,
          addressValidation: addressValidationResult,
        });
      }


    const updatedUser = await user.save();
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      phone: updatedUser.phone,
      streetAddress: updatedUser.streetAddress,
      city: updatedUser.city,
      state: updatedUser.state,
      zipCode: updatedUser.zipCode,
    })
  } else {
    res.status(404).json({error: "User has not been found, please sign up"})
  }
} // Ends of updateUser

//This is an async fuction called changePassword to change the user password
export const changePassword = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const {oldPassword, password} = req.body;

   // Validate user input
   const passwordValidationResult: ValidationResult = passwordValidator(password);

   if (!passwordValidationResult.isValid){
    return res.status(400).json({
      errorMessage: "Invalid inputs",
      passwordValidation: passwordValidationResult,
    });
   }
  
  const user = await User.findById(userId);
  if(!user){
   return res.status(404).json({error: "User has not been found, please sign up"});
    
  }
  //This is the validation to change the password
  if(!oldPassword || !password ){
    return res.status(400).json({error: "Please add existing password and the new password"});
    
  }
   //Check if old password is correct or matches in DB
   const passwordIsCorrect = await bcrypt.compare(oldPassword, user.password);

    // Save new hashed password
    if(user && passwordIsCorrect){
      const newHashedPssword = await bcrypt.hash(password, 10);
      user.password = newHashedPssword;
      await user.save();
     return res.status(200).json({message: "Password has been changed successfully"})
    } else {
     return res.status(401).json({error: "Invalid Credentials, keep in mind 5 consecutive fails lock your account"});
    }

}; // Ends of changePassword



//This is an async fuction called forgotPassword to reset the user password
export const forgotPassword = async (req: Request, res: Response) => {
  const {email} = req.body;
  const user = await User.findOne({email});

   // Validate user input
   const emailValidationResult: ValidationResult = emailValidator(email);

   if(!emailValidationResult.isValid){
    return res.status(400).json({
      error: "Invalid inputs",
      emailValidation: emailValidationResult,
    });

   }
   
  if(!user){
    return res.status(404).json({error: "User do not exist"})
  }

   // Check if the user is locked
   if(user.isLocked){
    return res.status(403).json({error: "Account is locked. Please contact an administrator."})
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

  <p> Hello ${user.name} ${user.lastName} <p>

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
    return res.status(200)
    .json({
      success: true, 
      message: "Please check your email and follow the proccess to reset the password"});

  } catch (error) {
   return res.status(500).json({error: "There was an issue, please try again later"})
  }

}; // Ends of forgotPassword


// This is an async function called resetPassword
export const resetPassword = async (req: Request, res: Response) => {
  const { newPassword, confirmPassword } = req.body;
  const { resetToken } = req.params;

   // Validate user input
   const passwordValidationResult: ValidationResult = passwordValidator(newPassword && confirmPassword);
   if(!passwordValidationResult.isValid){
     return res.status(400).json({
       error: "Invalid inputs",
       passwordValidation: passwordValidationResult,
     });

   }

  try {
     // Hash the reset token from the URL
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    // Retrieve the token from the database
    const userToken = await Token.findOne({ token: hashedToken });

     // Check if the token is expired
    if (!userToken || (userToken.expiresAt && userToken.expiresAt.getTime()<Date.now() ) ) {
      return res.status(401).json({ error: "Invalid token or expire token" });
    }

    // Retrieve the user based on the token
    const user = await User.findById(userToken.userId);

    if (!user) {
      return res.status(404).json({ error: "User not found please sign up" });
    }

     // Hash the new password and update the user's password
     const newHashedPassword = await bcrypt.hash(newPassword, 10);
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
}; //Ends of resetPassword


