// ======================================================
// WATER ROUTES
// ======================================================
import express from "express";
import auth from "../middleware/auth.js";
import {
    editWater,
    searchWaterByHouse,
    updateWater,
    getWaterUpdateList,
    getWaterRecordById
} from "../controllers/water.controller.js";

const router = express.Router();

// ---------- WATER ----------
// PUT    /edit-water
// GET    /searchWaterByHouse/:houseNo
// POST   /water-update
// GET    /water-update-list
// GET    /waterRecord/:id

router.put("/edit-water", auth, editWater);
router.get("/searchWaterByHouse/:houseNo", searchWaterByHouse);
router.post("/water-update", auth, updateWater);
router.get("/water-update-list", getWaterUpdateList);
router.get("/waterRecord/:id", getWaterRecordById);

export default router;