// ======================================================
// PAYMENT ROUTES
// ======================================================
import express from "express";
import auth from "../middleware/auth.js";
import {
    createPayment,
    createPaymentCorrection,
    getPaymentById,
    getPaymentCorrectionById,
    getPayments,
    getReceipt,
    searchPaymentByName
} from "../controllers/payment.controller.js";

const router = express.Router();

// ---------- PAYMENT ----------
// POST   /payment
// POST   /createPaymentCorrection
// GET    /payment/:paymentId
// GET    /payment-correction/:id
// GET    /payments
// GET    /receipt/:paymentId
// GET    /searchPaymentByName/:name

router.post("/payment", auth, createPayment);
router.post("/createPaymentCorrection", auth, createPaymentCorrection);
router.get("/payment/:paymentId", getPaymentById);
router.get("/payment-correction/:id", getPaymentCorrectionById);
router.get("/payments", getPayments);
router.get("/receipt/:paymentId", getReceipt);
router.get("/searchPaymentByName/:name", searchPaymentByName);

export default router;