"use strict";
// userFunctions.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLastLogin = exports.lockUserAccount = exports.resetConsecutiveFailedAttempts = exports.incrementConsecutiveFailedAttempts = void 0;
/* This is an async fuction called
incrementConsecutiveFailedAttempts   */
const incrementConsecutiveFailedAttempts = (user) => __awaiter(void 0, void 0, void 0, function* () {
    user.consecutiveFailedAttempts += 1;
    yield user.save();
});
exports.incrementConsecutiveFailedAttempts = incrementConsecutiveFailedAttempts;
/* This is an async fuction called
resetConsecutiveFailedAttempts   */
const resetConsecutiveFailedAttempts = (user) => __awaiter(void 0, void 0, void 0, function* () {
    user.consecutiveFailedAttempts = 0;
    yield user.save();
});
exports.resetConsecutiveFailedAttempts = resetConsecutiveFailedAttempts;
/* This is an async fuction called
lockUserAccount    */
const lockUserAccount = (user) => __awaiter(void 0, void 0, void 0, function* () {
    user.isLocked = true;
    yield user.save();
});
exports.lockUserAccount = lockUserAccount;
/* This is an async fuction called
updateLastLogin */
const updateLastLogin = (user) => __awaiter(void 0, void 0, void 0, function* () {
    user.lastLogin = new Date();
    yield user.save();
});
exports.updateLastLogin = updateLastLogin;
