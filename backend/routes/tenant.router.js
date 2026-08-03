// ======================================================
// TENANT ROUTES
// ======================================================
import express from "express";
import auth from "../middleware/auth.js";
import {
    addTenant,
    editTenant,
    removeTenant,
    searchTenantByPhone,
    searchTenantByName,
    getTenantById
} from "../controllers/tenant.controller.js";

const router = express.Router();

// ---------- TENANT ----------
// POST   /add-tenant
// PUT    /edit-tenant
// POST   /remove-tenant
// GET    /searchTenant/:phone
// GET    /searchTenantByName/:name
// GET    /tenant/:id

router.post("/add-tenant", auth, addTenant);
router.put("/edit-tenant", auth, editTenant);
router.post("/remove-tenant", auth, removeTenant);
router.get("/searchTenant/:phone", searchTenantByPhone);
router.get("/searchTenantByName/:name", searchTenantByName);
router.get("/tenant/:id", auth, getTenantById);

export default router;