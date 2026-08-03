// ======================================================
// DASHBOARD ROUTES
// ======================================================
import express from "express";
import {
    getDashboardSummary,
    getHousePivot,
    getTenantDashboard,
    getTenantStatement
} from "../controllers/dashboard.controller.js";

const router = express.Router();

// ---------- DASHBOARD ----------
// GET    /dashboard-summary
// GET    /house-pivot
// GET    /tenant-dashboard

router.get("/dashboard-summary", getDashboardSummary);
router.get("/house-pivot", getHousePivot);
router.get("/tenant-dashboard", getTenantDashboard);
router.get("/tenant-statement/:id",getTenantStatement);

export default router;