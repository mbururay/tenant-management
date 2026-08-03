// ======================================================
// MISCELLANEOUS ROUTES
// ======================================================
import express from "express";
import {
    healthCheck,
    databaseHealthCheck
} from "../controllers/miscellaneous.controller.js";

const router = express.Router();

// ---------- MISCELLANEOUS ----------
// GET    /
// GET    /serene_homes

router.get("/", healthCheck);
router.get("/serene_homes", databaseHealthCheck);

export default router;