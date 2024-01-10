"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addressValidator = exports.phoneValidator = exports.passwordValidator = exports.emailValidator = void 0;
function emailValidator(email) {
    if (!email) {
        return { isValid: false, errorMessage: "Please add email is required" };
    }
    else if (!email.includes("@")) {
        return { isValid: false, errorMessage: "Please add a valid format email" };
    }
    // Use a regular expression to validate the email format
    const emailRegex = /^\s*[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}\s*$/;
    if (!emailRegex.test(email.trim())) {
        return { isValid: false, errorMessage: "Please add a valid format email" };
    }
    else {
        return { isValid: true };
    }
} // Ends of emailValidator
exports.emailValidator = emailValidator;
function passwordValidator(password) {
    if (!password) {
        return { isValid: false, errorMessage: "Password is required" };
    }
    else if (password.length < 6) {
        return { isValid: false, errorMessage: "Password must have at least 6 characters" };
    }
    else {
        // Password strength validation
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasDigit = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        if (!hasUpperCase || !hasLowerCase || !hasDigit || !hasSpecialChar) {
            return { isValid: false, errorMessage: "Password must have upper case and lower case letter as well as digit and special characters" };
        }
        else {
            return { isValid: true };
        }
    }
} // Ends of passwordValidator
exports.passwordValidator = passwordValidator;
function phoneValidator(phone) {
    if (!phone || phone.trim() === "") {
        return { isValid: false, errorMessage: "Please add a phone number is required" };
    }
    else if (phone.length < 10) {
        return { isValid: false, errorMessage: "Add a valid phone please" };
    }
    else if (!/^\d+$/.test(phone)) {
        return { isValid: false, errorMessage: "Phone must be just number" };
    }
    else {
        return { isValid: true };
    }
} // Ends of phoneValidator
exports.phoneValidator = phoneValidator;
function addressValidator(streetAddress, city, state, zipCode) {
    if (!streetAddress || streetAddress.trim() === "") {
        return { isValid: false, errorMessage: "Please add the address is required" };
    }
    else if (streetAddress.length < 10) {
        return { isValid: false, errorMessage: "Please street address must have at least 10 characters" };
    }
    else if (streetAddress.length > 100) {
        return { isValid: false, errorMessage: "Please street address must have max 100 characters" };
    }
    else if (!city || city.trim() === "") {
        return { isValid: false, errorMessage: "City is required" };
    }
    else if (city.length < 5) {
        return { isValid: false, errorMessage: "Please City must have at least 5 characters" };
    }
    else if (!state || state.trim() === "") {
        return { isValid: false, errorMessage: "State is required" };
    }
    else if (state.length < 2) {
        return { isValid: false, errorMessage: "Please State must have at least 2 characters" };
    }
    else if (!zipCode || zipCode.trim() === "") {
        return { isValid: false, errorMessage: "ZIP Code is required" };
    }
    else if (zipCode.length !== 5) {
        return { isValid: false, errorMessage: "Please Zip Code must be 5 characters" };
    }
    else {
        return { isValid: true };
    }
} // Ends of addressValidator
exports.addressValidator = addressValidator;
