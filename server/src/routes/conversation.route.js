import express from "express";
import {
  createOrGetConversation,
  getUserConversations,
} from "../controllers/conversation.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", protect, createOrGetConversation);
router.get("/", protect, getUserConversations);

export default router;