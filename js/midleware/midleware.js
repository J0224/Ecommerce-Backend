"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = void 0;
const isAdmin = (req, res, next) => {
    const user = req.user; // Cast to any to access the 'user' property
    if (user && user.role === 'admin') {
        return next();
    }
    return res.status(403).json({ error: 'Permission denied' });
};
exports.isAdmin = isAdmin;
