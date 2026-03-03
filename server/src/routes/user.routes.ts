import express, { Response } from "express";
import { protect, AuthRequest } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/profile", protect, (req: AuthRequest, res: Response) => {
  res.json({
    message: "Protected route accessed",
    user: req.user,
  });
});

export default router;