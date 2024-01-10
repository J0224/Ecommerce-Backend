// middleware.ts
import { Request, Response, NextFunction } from 'express';

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user; // Cast to any to access the 'user' property
  if (user && user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ error: 'Permission denied' });
};
