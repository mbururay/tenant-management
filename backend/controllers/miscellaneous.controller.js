// ======================================================
// MISCELLANEOUS CONTROLLER
// ======================================================
import pool from "../db.js";

// ======================================================
// HEALTH CHECK
// ======================================================
// GET /
export const healthCheck = async (req, res) => {
    res.status(200).json({
        success: true,
        status: "alive",
        message: "Server is running",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || "development"
    });
};

// ======================================================
// DATABASE HEALTH CHECK
// ======================================================
// GET /serene_homes
export const databaseHealthCheck = async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW() AS current_time");
        
        res.status(200).json({
            success: true,
            status: "healthy",
            message: "Database connection is active",
            database: {
                currentTime: result.rows[0].current_time,
                connected: true
            },
            timestamp: new Date().toISOString()
        });
    } catch (err) {
        console.error("DATABASE HEALTH CHECK ERROR:", err);
        res.status(500).json({
            success: false,
            status: "unhealthy",
            message: "Database connection failed",
            error: {
                code: err.code,
                message: err.message
            },
            timestamp: new Date().toISOString()
        });
    }
};

// ======================================================
// OPTIONAL: ADDITIONAL HEALTH CHECK ENDPOINTS
// ======================================================

// GET /health - Detailed health check
export const detailedHealthCheck = async (req, res) => {
    const health = {
        success: true,
        status: "healthy",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        services: {
            server: {
                status: "up",
                port: process.env.PORT || 3001,
                nodeVersion: process.version
            },
            database: {
                status: "unknown"
            },
            memory: {
                used: process.memoryUsage().heapUsed / 1024 / 1024,
                total: process.memoryUsage().heapTotal / 1024 / 1024
            }
        }
    };

    try {
        // Test database connection
        await pool.query("SELECT 1");
        health.services.database.status = "up";
    } catch (err) {
        health.success = false;
        health.status = "degraded";
        health.services.database.status = "down";
        health.services.database.error = err.message;
    }

    const statusCode = health.success ? 200 : 503;
    res.status(statusCode).json(health);
};

// GET /info - Server information
export const serverInfo = async (req, res) => {
    res.status(200).json({
        name: "Serene Homes API",
        version: "1.0.0",
        environment: process.env.NODE_ENV || "development",
        timestamp: new Date().toISOString(),
        endpoints: {
            auth: "/api/auth",
            bills: "/api/bills",
            dashboard: "/api/dashboard",
            invoices: "/api/invoices",
            moveout: "/api/moveout",
            payments: "/api/payments",
            pdfEmail: "/api/pdf-email",
            phones: "/api/phones",
            tenants: "/api/tenants",
            water: "/api/water"
        }
    });
};