import { type } from "os";


export type ValidationResult = {
  isValid: boolean;
  errorMessage?: string;
}


export function emailValidator(email: string): ValidationResult {
  if (!email){
    return {isValid: false, errorMessage: "Please add email is required"};
  } else if (!email.includes("@")){
    return {isValid: false, errorMessage: "Please add a valid format email"};
  }
   // Use a regular expression to validate the email format
   const emailRegex = /^\s*[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}\s*$/;
   if (!emailRegex.test(email.trim())) {
    return {isValid: false, errorMessage: "Please add a valid format email" };
   } else {
    return {isValid: true}
   }
} // Ends of emailValidator


export function passwordValidator(password: string): ValidationResult {
  if(!password){
    return {isValid: false, errorMessage: "Passord is required"};
  } else if (password.length < 6){
    return {isValid: false, errorMessage: "Password must have at least 6 characters"};
  } else {
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
      return {isValid: false, errorMessage: "Please password must have upper case and lower case letter as well as digit and special characters"};
    }
    else {
      return {isValid: true};
    }  
  }
} // Ends of passwordValidator

export function phoneValidator(phone: string): ValidationResult {
  if(!phone){
    return {isValid: false, errorMessage: "Please add a phone number is required"};
  } else if (phone.length < 10 ){
    return {isValid: false, errorMessage: "Add a valid phone please"};
  } else if (! /^\d+$/.test(phone)){
    return {isValid: false, errorMessage: "Phone must be just number"};
  } else {
    return {isValid: true};
  }
} // Ends of phoneValidator


export function addressValidator(address: string): ValidationResult {
  if (!address){
    return {isValid: false, errorMessage: "Please add the address is required"};
  } else if (address.length < 10 ){
    return {isValid: false, errorMessage: "Please address must have at least 10 character"}
  } else {
    return {isValid: true}
  }

} //Ends of addressValidator