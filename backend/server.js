// ======================================================
// IMPORTS
// ======================================================
import express from "express";
import cors from "cors";
import pool from "./db.js";
import PDFDocument from "pdfkit";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import resend from "./resendClient.js";
import TestEmails from "./emails/TestEmails.js";
import crypto from "crypto";
import auth from "./middleware/auth.js";



import authRoutes from "./routes/auth.router.js";
import billRoutes from "./routes/bill.router.js";
import dashboardRoutes from "./routes/dashboard.router.js";
import invoiceRoutes from "./routes/invoice.router.js";
import moveoutRoutes from "./routes/moveout.router.js";
import paymentRoutes from "./routes/payment.router.js";
import phoneRoutes from "./routes/phone.router.js";
import tenantRoutes from "./routes/tenant.router.js";
import waterRoutes from "./routes/water.router.js";
import miscellanousRoutes from "./routes/miscellaneous.router.js"


// ======================================================
// ENVIRONMENT
// ======================================================
dotenv.config();

const app = express();
const FRONTEND_URL = process.env.FRONTEND_URL;


// ======================================================
// EXPRESS SETUP
// ======================================================
app.use(cors());
app.use(express.json());

// ======================================================
// MIDDLEWARE
// ======================================================
// auth middleware is imported and used on protected routes

// ======================================================
// HELPER FUNCTIONS
// ======================================================
// (Placeholder for any helper functions that may be needed)


// ======================================================
// ROUTES
// ======================================================
app.use(authRoutes);
app.use(billRoutes);
app.use(dashboardRoutes);
app.use(invoiceRoutes);
app.use(moveoutRoutes);
app.use(paymentRoutes);
app.use(phoneRoutes);
app.use(tenantRoutes);
app.use(waterRoutes);
app.use(miscellanousRoutes);








// ======================================================
// TENANT STATEMENTS
// ======================================================
// ---------- TENANT STATEMENT ----------
// GET    /tenant-statement/:id






// ======================================================
// SERVER START
// ======================================================
app.listen(3001, () => {
    console.log("Server running on port 3001");
});