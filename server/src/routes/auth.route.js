import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { forgotPassword, getProfile, login, logout, refreshAccessToken, resetPassword, signup } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/refresh-token", refreshAccessToken);
router.post("/logout", protect, logout);
router.get("/me", protect, getProfile);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;