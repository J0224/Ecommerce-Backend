import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import AdminCompany, { IAdmin } from "../model/adminModel";

export interface AuthRequest extends Request {
  admin?: IAdmin;
}

const verifyToken = async (
  req: Request | AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Check for the token in headers
    const token =
      req.headers.authorization && req.headers.authorization.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "No authorized, please signup" });
    }

    const verified = jwt.verify(
      token,
      process.env.JWT_SECRET || ""
    ) as { adminId: string };

    const admin = await AdminCompany.findById(verified.adminId).select(
      "-nopassword"
    );

    if (!admin) {
      return res.status(401).json({ error: "No user found" });
    }

    (req as AuthRequest).admin = admin;

    if (admin.role === "admin") {
      return next();
    }

    return res.status(403).json({ error: "Permission denied" });
  } catch (error) {
    return res.status(401).json({ error: "Authentication failed" });
  }
};

export default verifyToken;

