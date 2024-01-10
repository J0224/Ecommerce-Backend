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
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLastLogin = exports.lockUserAccount = exports.resetConsecutiveFailedAttempts = exports.incrementConsecutiveFailedAttempts = void 0;
/* This is an async fuction called
incrementConsecutiveFailedAttempts   */
const incrementConsecutiveFailedAttempts = (admin) => __awaiter(void 0, void 0, void 0, function* () {
    admin.consecutiveFailedAttempts += 1;
    yield admin.save();
});
exports.incrementConsecutiveFailedAttempts = incrementConsecutiveFailedAttempts;
/* This is an async fuction called
resetConsecutiveFailedAttempts   */
const resetConsecutiveFailedAttempts = (admin) => __awaiter(void 0, void 0, void 0, function* () {
    admin.consecutiveFailedAttempts = 0;
    yield admin.save();
});
exports.resetConsecutiveFailedAttempts = resetConsecutiveFailedAttempts;
/* This is an async fuction called
lockUserAccount    */
const lockUserAccount = (admin) => __awaiter(void 0, void 0, void 0, function* () {
    admin.isLocked = true;
    yield admin.save();
});
exports.lockUserAccount = lockUserAccount;
/* This is an async fuction called
updateLastLogin */
const updateLastLogin = (admin) => __awaiter(void 0, void 0, void 0, function* () {
    admin.lastLogin = new Date();
    yield admin.save();
});
exports.updateLastLogin = updateLastLogin;
