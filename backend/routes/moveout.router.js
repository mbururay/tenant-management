// ======================================================
// MOVE OUT ROUTES
// ======================================================
import express from "express";
import auth from "../middleware/auth.js";
import {
    completeMoveOut,
    getMoveOutList,
    getMoveOutTenant,
    getMoveOutView
} from "../controllers/moveout.controller.js";

const router = express.Router();

// ---------- MOVE OUT ----------
// POST   /complete-moveout
// GET    /moveout-list
// GET    /moveout-tenant/:id
// GET    /moveout-view/:moveoutId

router.post("/complete-moveout", auth, completeMoveOut);
router.get("/moveout-list", getMoveOutList);
router.get("/moveout-tenant/:id", getMoveOutTenant);
router.get("/moveout-view/:moveoutId", getMoveOutView);

export default router;