import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";

const adminOnly = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Admin access only" });
  }
};

export default adminOnly;