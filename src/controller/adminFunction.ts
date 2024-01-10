import   {IAdmin } from "../model/adminModel";

/* This is an async fuction called  
incrementConsecutiveFailedAttempts   */
export const incrementConsecutiveFailedAttempts = async (admin: IAdmin): Promise<void> => {
  admin.consecutiveFailedAttempts += 1;
  await admin.save();
};

/* This is an async fuction called  
resetConsecutiveFailedAttempts   */
export const resetConsecutiveFailedAttempts = async (admin: IAdmin): Promise<void> => {
  admin.consecutiveFailedAttempts = 0;
  await admin.save();
};

/* This is an async fuction called  
lockUserAccount    */
export const lockUserAccount = async (admin: IAdmin): Promise<void> => {
  admin.isLocked = true;
  await admin.save();
};

/* This is an async fuction called  
updateLastLogin */
export const updateLastLogin = async (admin: IAdmin): Promise<void> => {
  admin.lastLogin = new Date();
  await admin.save();
};
