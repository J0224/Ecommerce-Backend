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
        return { isValid: false, errorMessage: "Passord is required" };
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
        console.log('hasUpperCase:', hasUpperCase);
        console.log('hasLowerCase:', hasLowerCase);
        console.log('hasDigit:', hasDigit);
        console.log('hasSpecialChar:', hasSpecialChar);
        if (!hasUpperCase || !hasLowerCase || !hasDigit || !hasSpecialChar) {
            return { isValid: false, errorMessage: "Please password must have upper case and lower case letter as well as digit and special characters" };
        }
        else {
            return { isValid: true };
        }
    }
} // Ends of passwordValidator
exports.passwordValidator = passwordValidator;
function phoneValidator(phone) {
    if (!phone) {
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
function addressValidator(address) {
    if (!address) {
        return { isValid: false, errorMessage: "Please add the address is required" };
    }
    else if (address.length < 10) {
        return { isValid: false, errorMessage: "Please address must have at least 10 character" };
    }
    else {
        return { isValid: true };
    }
} //Ends of addressValidator
exports.addressValidator = addressValidator;
