// ======================================================
// PHONE ROUTES
// ======================================================
import express from "express";
import {
    addPhone
} from "../controllers/phone.controller.js";

const router = express.Router();

// ---------- PHONE ----------
// POST   /phone

router.post("/phone", addPhone);

export default router;