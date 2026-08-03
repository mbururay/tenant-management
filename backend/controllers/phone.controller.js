// ======================================================
// PHONE CONTROLLER
// ======================================================
import pool from "../db.js";

// ======================================================
// ADD PHONE
// ======================================================
// POST /phone
export const addPhone = async (req, res) => {
    const {
        tenantId,
        phone
    } = req.body;

    // Validate required fields
    if (!tenantId || !phone) {
        return res.status(400).json({
            success: false,
            error: "Missing required fields: tenantId and phone are required"
        });
    }

    // Validate phone number format (basic validation)
    const phoneRegex = /^\+?[\d\s-]{7,15}$/;
    if (!phoneRegex.test(phone)) {
        return res.status(400).json({
            success: false,
            error: "Invalid phone number format"
        });
    }

    try {
        // Verify tenant exists
        const tenantCheck = await pool.query(
            `
            SELECT id, moveOut
            FROM tenantList
            WHERE id = $1
            `,
            [tenantId]
        );

        if (tenantCheck.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: "Tenant not found"
            });
        }

        // Check if phone already exists
        const exists = await pool.query(
            `
            SELECT 1
            FROM phoneList
            WHERE phone = $1
            `,
            [phone]
        );

        if (exists.rows.length) {
            return res.status(409).json({
                success: false,
                error: "Phone number already exists"
            });
        }

        // Insert new phone
        await pool.query(
            `
            INSERT INTO phoneList
            (
                tenantId,
                phone
            )
            VALUES
            (
                $1,
                $2
            )
            `,
            [tenantId, phone]
        );

        res.status(201).json({
            success: true,
            message: "Phone added successfully.",
            data: {
                tenantId,
                phone
            }
        });
    } catch (err) {
        console.error("Add Phone Error:", err);
        res.status(500).json({
            success: false,
            error: err.message || "Failed to add phone number"
        });
    }
};