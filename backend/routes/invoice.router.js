// ======================================================
// INVOICE ROUTES
// ======================================================
import express from "express";
import auth from "../middleware/auth.js";
import {
    // Invoice operations
    generateInvoice,
    getInvoiceById,
    getInvoiceInfo,
    getInvoiceByMonth,
    getInvoiceMonths,
    getInvoices,
    getMonthInvoices,
    searchInvoiceByName,
    printMonthlyInvoice,
    // Invoice Correction operations
    createInvoiceCorrection,
    getInvoiceCorrectionById
} from "../controllers/invoice.controller.js";

const router = express.Router();

// ---------- INVOICE ----------
// POST   /gen-invoice
// GET    /invoice/:id
// GET    /invoice-info
// GET    /invoice-month/:month
// GET    /invoice-months
// GET    /invoices
// GET    /month-invoices/:month
// GET    /searchInvoiceByName/:name

router.post("/gen-invoice", auth, generateInvoice);
router.get("/invoice/:id", getInvoiceById);
router.get("/invoice-info", getInvoiceInfo);
router.get("/invoice-month/:month", getInvoiceByMonth);
router.get("/invoice-months", getInvoiceMonths);
router.get("/invoices", getInvoices);
router.get("/month-invoices/:month", getMonthInvoices);
router.get("/searchInvoiceByName/:name", searchInvoiceByName);
router.get("/invoice-pdf/:month", printMonthlyInvoice);

// ---------- INVOICE CORRECTION ----------
// POST   /createInvoiceCorrection
// GET    /invoice-correction/:id

router.post("/createInvoiceCorrection", auth, createInvoiceCorrection);
router.get("/invoice-correction/:id", getInvoiceCorrectionById);

export default router;