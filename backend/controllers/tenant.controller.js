// ======================================================
// TENANT CONTROLLER
// ======================================================
import pool from "../db.js";

// ======================================================
// ADD TENANT
// ======================================================
// POST /add-tenant
export const addTenant = async (req, res) => {
    try {
        console.log("Add Tenant Request Body:", req.body);

        const {
            name,
            phone,
            houseNo,
            rent,
            garbage,
            deposit
        } = req.body;

        // Validate required fields
        if (!name || !phone || !houseNo || !rent || !garbage || !deposit) {
            return res.status(400).json({
                success: false,
                error: "Missing required fields: name, phone, houseNo, rent, garbage, and deposit are required"
            });
        }

        // Validate phone number format
        const phoneRegex = /^\+?[\d\s-]{7,15}$/;
        if (!phoneRegex.test(phone)) {
            return res.status(400).json({
                success: false,
                error: "Invalid phone number format"
            });
        }

        // Validate numeric fields
        if (isNaN(rent) || isNaN(garbage) || isNaN(deposit)) {
            return res.status(400).json({
                success: false,
                error: "Rent, garbage, and deposit must be valid numbers"
            });
        }

        const client = await pool.connect();

        try {
            await client.query("BEGIN");

            // Check if house already has an active tenant
            const existingTenant = await client.query(
                `
                SELECT t.id, t.name
                FROM tenantList t
                WHERE t.houseId = (
                    SELECT houseId FROM houseList WHERE houseNo = $1
                )
                AND t.moveOut IS NULL
                `,
                [houseNo]
            );

            if (existingTenant.rows.length > 0) {
                return res.status(409).json({
                    success: false,
                    error: `House ${houseNo} already has an active tenant: ${existingTenant.rows[0].name}`
                });
            }

            // Insert or update house
            const houseResult = await client.query(
                `INSERT INTO houseList(houseNo, rent, garbage)
                VALUES ($1, $2, $3)
                ON CONFLICT (houseNo)
                DO UPDATE SET rent = EXCLUDED.rent, garbage = EXCLUDED.garbage
                RETURNING houseId`,
                [houseNo, rent, garbage]
            );

            console.log("HOUSE RESULT:", houseResult.rows);

            const houseId = houseResult.rows[0].houseid;

            // Insert tenant
            const tenantResult = await client.query(
                `INSERT INTO tenantList(name, phone, houseId)
                VALUES ($1, $2, $3)
                RETURNING id`,
                [name, phone, houseId]
            );

            console.log("TENANT RESULT:", tenantResult.rows);

            const tenantId = tenantResult.rows[0].id;

            // Add phone to phoneList
            await client.query(
                `INSERT INTO phoneList(tenantId, phone)
                VALUES ($1, $2)`,
                [tenantId, phone]
            );

            // Add deposit charge
            await client.query(
                `INSERT INTO chargeList(tenantId, chargeType, chargeAmount)
                VALUES ($1, 'Deposit', $2)`,
                [tenantId, deposit]
            );

            await client.query("COMMIT");

            res.status(201).json({
                success: true,
                message: "Tenant added successfully",
                data: {
                    tenantId,
                    name,
                    phone,
                    houseNo,
                    rent,
                    garbage,
                    deposit
                }
            });
        } catch (err) {
            await client.query("ROLLBACK");
            throw err;
        } finally {
            client.release();
        }
    } catch (err) {
        console.error("Add Tenant Error:", err);
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

// ======================================================
// EDIT TENANT
// ======================================================
// PUT /edit-tenant
export const editTenant = async (req, res) => {
    const {
        tenantId,
        name,
        phone,
        rent,
        garbage
    } = req.body;

    // Validate required fields
    if (!tenantId || !name || !phone || !rent || !garbage) {
        return res.status(400).json({
            success: false,
            error: "Missing required fields: tenantId, name, phone, rent, and garbage are required"
        });
    }

    // Validate phone number format
    const phoneRegex = /^\+?[\d\s-]{7,15}$/;
    if (!phoneRegex.test(phone)) {
        return res.status(400).json({
            success: false,
            error: "Invalid phone number format"
        });
    }

    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        // Verify tenant exists and is active
        const tenantCheck = await client.query(
            `
            SELECT id, houseId, moveOut
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

        if (tenantCheck.rows[0].moveout !== null) {
            return res.status(400).json({
                success: false,
                error: "Cannot edit a moved out tenant"
            });
        }

        // Update tenant information
        await client.query(
            `
            UPDATE tenantList
            SET
                name = $1,
                phone = $2
            WHERE id = $3
            `,
            [name, phone, tenantId]
        );

        // Update house agreement
        await client.query(
            `
            UPDATE houseList
            SET
                rent = $1,
                garbage = $2
            WHERE houseId = (
                SELECT houseId
                FROM tenantList
                WHERE id = $3
            )
            `,
            [rent, garbage, tenantId]
        );

        await client.query("COMMIT");

        res.json({
            success: true,
            message: "Tenant updated successfully.",
            data: {
                tenantId,
                name,
                phone,
                rent,
                garbage
            }
        });
    } catch (err) {
        await client.query("ROLLBACK");
        console.error(err);
        res.status(500).json({
            success: false,
            error: err.message
        });
    } finally {
        client.release();
    }
};

// ======================================================
// REMOVE TENANT
// ======================================================
// POST /remove-tenant
export const removeTenant = async (req, res) => {
    try {
        const {
            houseNo,
            moveOut
        } = req.body;

        // Validate required fields
        if (!houseNo || !moveOut) {
            return res.status(400).json({
                success: false,
                error: "Missing required fields: houseNo and moveOut date are required"
            });
        }

        // Validate moveOut date
        const moveOutDate = new Date(moveOut);
        if (isNaN(moveOutDate.getTime())) {
            return res.status(400).json({
                success: false,
                error: "Invalid moveOut date format"
            });
        }

        const house = await pool.query(
            `
            SELECT houseId
            FROM houseList
            WHERE houseNo = $1
            `,
            [houseNo]
        );

        if (house.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: "House not found"
            });
        }

        const houseId = house.rows[0].houseid;

        const tenant = await pool.query(
            `
            UPDATE tenantList
            SET moveOut = $1
            WHERE houseId = $2
            AND moveOut IS NULL
            RETURNING id, name, phone, houseId
            `,
            [moveOut, houseId]
        );

        if (tenant.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: "No active tenant found in this house"
            });
        }

        res.json({
            success: true,
            message: "Tenant removed successfully",
            data: {
                tenant: tenant.rows[0],
                houseNo,
                moveOut
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

// ======================================================
// SEARCH TENANT BY PHONE
// ======================================================
// GET /searchTenant/:phone
export const searchTenantByPhone = async (req, res) => {
    try {
        const { phone } = req.params;

        if (!phone) {
            return res.status(400).json({
                success: false,
                error: "Phone number is required"
            });
        }

        const result = await pool.query(
            `
            SELECT DISTINCT
                t.id,
                t.name,
                h.houseNo

            FROM tenantList t

            JOIN houseList h
                ON t.houseId = h.houseId

            LEFT JOIN phoneList p
                ON t.id = p.tenantId

            WHERE
                (
                    t.phone = $1
                    OR p.phone = $1
                )
                AND t.moveOut IS NULL

            ORDER BY t.name
            `,
            [phone]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No active tenant found with this phone number"
            });
        }

        res.json({
            success: true,
            data: result.rows
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

// ======================================================
// SEARCH TENANT BY NAME
// ======================================================
// GET /searchTenantByName/:name
export const searchTenantByName = async (req, res) => {
    const { name } = req.params;

    if (!name) {
        return res.status(400).json({
            success: false,
            error: "Name is required for search"
        });
    }

    try {
        const result = await pool.query(`
            SELECT
                t.id,
                t.name,
                t.phone,
                h.houseNo
            FROM tenantList t
            JOIN houseList h
            ON t.houseId = h.houseId
            WHERE
                LOWER(t.name) LIKE LOWER($1)
                AND t.moveOut IS NULL
            ORDER BY t.name;
        `, [`%${name}%`]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No active tenants found with this name"
            });
        }

        res.json({
            success: true,
            data: result.rows
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

// ======================================================
// GET TENANT BY ID
// ======================================================
// GET /tenant/:id
export const getTenantById = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            success: false,
            error: "Tenant ID is required"
        });
    }

    try {
        const result = await pool.query(
            `
            SELECT
                t.id,
                t.name,
                t.phone,
                h.houseNo,
                h.rent,
                h.garbage
            FROM tenantList t
            JOIN houseList h
            ON t.houseId = h.houseId
            WHERE t.id = $1
            `,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: "Tenant not found"
            });
        }

        res.json({
            success: true,
            data: result.rows[0]
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};