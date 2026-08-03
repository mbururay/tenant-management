// ======================================================
// AUTH ROUTES
// ======================================================
import express from "express";
import auth from "../middleware/auth.js";
import {
    login,
    register,
    forgotPassword,
    resetPassword,
    testAuth
} from "../controllers/auth.controller.js";

const router = express.Router();

// ---------- AUTH ----------
// POST   /login
// POST   /register
// POST   /forgot-password
// POST   /reset-password
// GET    /test-auth

router.post("/login", login);
router.post("/register", register);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/test-auth", auth, testAuth);

export default router;