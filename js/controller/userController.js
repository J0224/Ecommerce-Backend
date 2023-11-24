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
exports.resetPassword = exports.forgotPassword = exports.changePassword = exports.updateUser = exports.loginStatus = exports.getUser = exports.logout = exports.login = exports.signup = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../model/userModel"));
const tokenModel_1 = __importDefault(require("../model/tokenModel"));
const crypto_1 = __importDefault(require("crypto"));
const sendEmail_1 = __importDefault(require("../utils/sendEmail"));
const userFunctions_1 = require("./userFunctions");
const validation_1 = require("../utils/validation");
//This is a function called genarateToken for users
const genarateToken = (userId) => {
    const secret = process.env.JWT_SECRET || "";
    return jsonwebtoken_1.default.sign({ userId }, secret, { expiresIn: "1d" });
};
//This is an async function called signup
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //Destructuring 
        const { name, email, password, phone, address } = req.body;
        // Validate user input
        const emailValidationResult = (0, validation_1.emailValidator)(email);
        const passwordValidationResult = (0, validation_1.passwordValidator)(password);
        const phoneValidationResult = (0, validation_1.phoneValidator)(phone);
        const addressValidationResult = (0, validation_1.addressValidator)(address);
        // Check if any validation failed
        if (!emailValidationResult.isValid || !passwordValidationResult.isValid || !phoneValidationResult.isValid || !addressValidationResult.isValid) {
            return res.status(400).json({
                error: "Invalid inputs",
                emailValidation: emailValidationResult,
                passwordValidation: passwordValidationResult,
                phoneValidation: phoneValidationResult,
                addressValidation: addressValidationResult,
            });
        }
        // Check if the user already exists
        const existingUser = yield userModel_1.default.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ error: "User already exists" });
        }
        // Check if all fields are present
        if (!name || !email || !password || !phone || !address) {
            return res.status(400).json({ error: "Please fill out all field required" });
        }
        // Hash the password before saving it or creating new user
        const hashPassword = yield bcryptjs_1.default.hash(password, 10);
        // Create a new user
        const newUser = new userModel_1.default({
            name,
            email,
            password: hashPassword,
            phone,
            address,
        });
        // Save the user to the database
        yield newUser.save();
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
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}); // Ends of sygnup
exports.signup = signup;
//This is an async function called login
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Validate user input
        const emailValidationResult = (0, validation_1.emailValidator)(email);
        const passwordValidationResult = (0, validation_1.passwordValidator)(password);
        if (!emailValidationResult.isValid || !passwordValidationResult.isValid) {
            return res.status(400).json({
                error: "Invalid inputs",
                emailValidation: emailValidationResult,
                passwordValidation: passwordValidationResult,
            });
        }
        // Find the user by email
        const user = yield userModel_1.default.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: "Invalid Credentials" });
        }
        // Check if the user is locked
        if (user.isLocked) {
            return res.status(403).json({ error: "Account is locked. Please contact an administrator." });
        }
        // Compare the provided password with the stored hashed password
        const isPasswordValid = yield bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            // Increment failed login attempts
            yield (0, userFunctions_1.incrementConsecutiveFailedAttempts)(user);
            // Check if the user should be locked
            if (user.consecutiveFailedAttempts >= 5) {
                yield (0, userFunctions_1.lockUserAccount)(user);
                return res.status(403).json({ error: "Account is locked. Please contact an administrator." });
            }
            return res.status(401).json({ error: "Invalid Credentials, keep in mind 5 consecutive fails lock your account" });
        }
        // Reset consecutive failed attempts on successful login
        yield (0, userFunctions_1.resetConsecutiveFailedAttempts)(user);
        // Generate a token for the user
        const token = genarateToken(user._id);
        // Update last login
        yield (0, userFunctions_1.updateLastLogin)(user);
        // This is to send HTTP Only cookie
        res.cookie("token", token, {
            path: "/",
            httpOnly: true,
            expires: new Date(Date.now() + 1000 * 86400),
            sameSite: "none",
            secure: true
        });
        // Return user information and token
        return res.status(200).json({ userId: user._id, token });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}); // Ends of login
exports.login = login;
//This is an async function called logout
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // This is to send HTTP Only cookie
    res.cookie("token", {
        path: "/",
        httpOnly: true,
        expires: new Date(0),
        sameSite: "none",
        secure: true
    });
    return res.status(200).json({ message: "You have logged out successfully" });
}); //Ends of logout
exports.logout = logout;
//This is an async function called getUser to get users data
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const user = yield userModel_1.default.findById(userId);
        if (user) {
            const { _id, email, name, address, phone } = user;
            return res.status(200).json({ _id, email, name, address, phone });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(400).json({ error: "User not found" });
    }
}); // Ends of getUser 
exports.getUser = getUser;
//This is an async fuction called loginStatus to Get login status of the user
const loginStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.token;
    // If there is no token, the user is not logged in
    if (!token) {
        return res.status(401).json({ error: "You are not logged in, please sign in." });
    }
    try {
        // Verify the token using the secret
        const secret = process.env.JWT_SECRET || "";
        const verifiedToken = jsonwebtoken_1.default.verify(token, secret);
        // If verification is successful, the user is logged in
        if (verifiedToken) {
            return res.status(200).json({ message: "You are logged in" });
        }
        // If verification fails, the user is not logged in
        return res.status(401).json({ error: "You are not logged in, please sign in." });
    }
    catch (error) {
        /*If there is any error in the verification process,
         the user is not logged in */
        console.log(error);
        return res.status(401).json({ error: "You are not logged in, please sign in." });
    }
}); // Ends of loginStatus
exports.loginStatus = loginStatus;
//This is an async fuction called updateUser to update the user data
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const user = yield userModel_1.default.findById(userId);
    if (user) {
        const { name, email, phone, address } = user;
        user.email = email;
        user.name = req.body.name === undefined ? name : req.body.name;
        user.phone = req.body.phone === undefined ? phone : req.body.phone;
        user.address = req.body.address === undefined ? address : req.body.address;
        // Validate user input
        // Validate user input
        const emailValidationResult = (0, validation_1.emailValidator)(email);
        const phoneValidationResult = (0, validation_1.phoneValidator)(phone);
        const addressValidationResult = (0, validation_1.addressValidator)(address);
        // Check if any validation failed
        if (!emailValidationResult.isValid || !phoneValidationResult.isValid || !addressValidationResult.isValid) {
            return res.status(400).json({
                error: "Invalid inputs",
                emailValidation: emailValidationResult,
                phoneValidation: phoneValidationResult,
                addressValidation: addressValidationResult,
            });
        }
        const updatedUser = yield user.save();
        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            phone: updatedUser.phone,
            address: updatedUser.address,
        });
    }
    else {
        res.status(404).json({ error: "User has not been found, please sign up" });
    }
}); // Ends of updateUser
exports.updateUser = updateUser;
//This is an async fuction called changePassword to change the user password
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const { oldPassword, password } = req.body;
    // Validate user input
    const passwordValidationResult = (0, validation_1.passwordValidator)(password);
    if (!passwordValidationResult.isValid) {
        return res.status(400).json({
            errorMessage: "Invalid inputs",
            passwordValidation: passwordValidationResult,
        });
    }
    const user = yield userModel_1.default.findById(userId);
    if (!user) {
        return res.status(404).json({ error: "User has not been found, please sign up" });
    }
    //This is the validation to change the password
    if (!oldPassword || !password) {
        return res.status(400).json({ error: "Please add existing password and the new password" });
    }
    //Check if old password is correct or matches in DB
    const passwordIsCorrect = yield bcryptjs_1.default.compare(oldPassword, user.password);
    // Save new hashed password
    if (user && passwordIsCorrect) {
        const newHashedPssword = yield bcryptjs_1.default.hash(password, 10);
        user.password = newHashedPssword;
        yield user.save();
        return res.status(200).json({ message: "Password has been changed successfully" });
    }
    else {
        return res.status(401).json({ error: "Invalid Credentials, keep in mind 5 consecutive fails lock your account" });
    }
}); // Ends of changePassword
exports.changePassword = changePassword;
//This is an async fuction called forgotPassword to reset the user password
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const user = yield userModel_1.default.findOne({ email });
    // Validate user input
    const emailValidationResult = (0, validation_1.emailValidator)(email);
    if (!emailValidationResult.isValid) {
        return res.status(400).json({
            error: "Invalid inputs",
            emailValidation: emailValidationResult,
        });
    }
    if (!user) {
        return res.status(404).json({ error: "User do not exist" });
    }
    // Delete Token if exists in DB
    let token = yield tokenModel_1.default.findOne({ userId: user._id });
    if (token) {
        yield token.deleteOne();
    }
    //Create reset token
    let resetToken = crypto_1.default.randomBytes(32).toString("hex") + user._id;
    //Hash Token before saving to DB
    const hashedToken = crypto_1.default
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
    //Save token to DB
    yield new tokenModel_1.default({
        userId: user._id,
        token: hashedToken,
        createdAt: Date.now(),
        expiresAt: Date.now() + 30 * (60 * 1000) //30 minutes
    }).save();
    //Construct reset URL
    const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;
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
    const subject = "Campanita Store Reset Password";
    const send_to = user.email;
    const sent_from = process.env.EMAIL_USER;
    try {
        yield (0, sendEmail_1.default)(subject, message, send_to, sent_from);
        return res.status(200)
            .json({
            success: true,
            message: "Please check your email and follow the proccess to reset the password"
        });
    }
    catch (error) {
        return res.status(500).json({ error: "There was an issue, please try again later" });
    }
}); // Ends of forgotPassword
exports.forgotPassword = forgotPassword;
// This is an async function called resetPassword
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { password } = req.body;
    const { resetToken } = req.params;
    // Validate user input
    const passwordValidationResult = (0, validation_1.passwordValidator)(password);
    if (!passwordValidationResult.isValid) {
        return res.status(400).json({
            error: "Invalid inputs",
            passwordValidation: passwordValidationResult,
        });
    }
    try {
        const hashedToken = crypto_1.default.createHash("sha256").update(resetToken).digest("hex");
        // Retrieve the token from the database
        const userToken = yield tokenModel_1.default.findOne({ token: hashedToken });
        if (!userToken) {
            return res.status(401).json({ error: "Invalid token" });
        }
        // Check if the token is expired
        if (userToken.expiresAt && userToken.expiresAt.getTime() < Date.now()) {
            return res.status(401).json({ error: "Token Expired" });
        }
        // Retrieve the user based on the token
        const user = yield userModel_1.default.findById(userToken.userId);
        if (!user) {
            return res.status(404).json({ error: "User not found please sign up" });
        }
        // Save token to DB
        yield new tokenModel_1.default({
            userId: user._id,
            token: hashedToken,
            createdAt: Date.now(),
            expiresAt: Date.now() + 30 * (60 * 1000) // 30 minutes
        }).save();
        // Hash the new password and update the user's password
        const newHashedPassword = yield bcryptjs_1.default.hash(password, 10);
        user.password = newHashedPassword;
        // Save the updated user to the database
        yield user.save();
        // Delete the token from the database since it's been used
        yield userToken.deleteOne();
        return res.status(200).json({ message: "Password has been reset successfully" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}); //Ends of resetPassword
exports.resetPassword = resetPassword;
