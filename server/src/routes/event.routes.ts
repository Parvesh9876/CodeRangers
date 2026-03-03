import express from "express";
import {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} from "../controllers/event.controller";
import { protect } from "../middleware/auth.middleware";
import adminOnly from "../middleware/admin.middleware";
import upload from "../middleware/upload.middleware";

const router = express.Router();


// Admin Only Routes
router.post(
  "/",
  protect,
  adminOnly,
  upload.single("image"),
  createEvent
);

// Update Event Routes
router.put(
    "/:id",
    protect,
    adminOnly,
    upload.single("image"),
    updateEvent
)

// Delete Event Routes
router.delete(
    "/:id",
    protect,
    adminOnly,
    deleteEvent

)

//Public Routes
router.get(
    "/", 
    getEvents
)
router.post(
    "/:id",
    getEventById

)

export default router;