// userFunctions.ts

import   {IUser } from "../model/userModel";
import User from "../model/userModel"

/* This is an async fuction called  
incrementConsecutiveFailedAttempts   */
export const incrementConsecutiveFailedAttempts = async (user: IUser): Promise<void> => {
  user.consecutiveFailedAttempts += 1;
  await user.save();
};

/* This is an async fuction called  
resetConsecutiveFailedAttempts   */
export const resetConsecutiveFailedAttempts = async (user: IUser): Promise<void> => {
  user.consecutiveFailedAttempts = 0;
  await user.save();
};

/* This is an async fuction called  
lockUserAccount    */
export const lockUserAccount = async (user: IUser): Promise<void> => {
  user.isLocked = true;
  await user.save();
};

/* This is an async fuction called  
updateLastLogin */
export const updateLastLogin = async (user: IUser): Promise<void> => {
  user.lastLogin = new Date();
  await user.save();
};
