// ======================================================
// BILL ROUTES
// ======================================================
import express from "express";
import auth from "../middleware/auth.js";
import {
    createBills,
    getBillByMonth,
    getBillPivot,
    modifyBills
} from "../controllers/bill.controller.js";

const router = express.Router();

// ---------- BILL ----------
// POST   /create-bills
// GET    /bill-month/:month
// GET    /bill-pivot
// PUT    /modify-bills

router.post("/create-bills", auth, createBills);
router.get("/bill-month/:month", getBillByMonth);
router.get("/bill-pivot", getBillPivot);
router.put("/modify-bills", auth, modifyBills);

export default router;