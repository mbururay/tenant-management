// ======================================================
// WATER CONTROLLER
// ======================================================
import pool from "../db.js";

// ======================================================
// EDIT WATER RECORD
// ======================================================
// PUT /edit-water
export const editWater = async (req, res) => {
    const { id, houseId, currentReading, rate } = req.body;

    // Validate required fields
    if (!id || !houseId || currentReading === undefined || !rate) {
        return res.status(400).json({
            success: false,
            error: "Missing required fields: id, houseId, currentReading, and rate are required"
        });
    }

    // Validate numeric fields
    if (isNaN(currentReading) || isNaN(rate)) {
        return res.status(400).json({
            success: false,
            error: "currentReading and rate must be valid numbers"
        });
    }

    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        // Get previous reading first (IMPORTANT for correctness)
        const prevResult = await client.query(
            `SELECT previousReading FROM waterReadings WHERE id = $1 AND houseId = $2`,
            [id, houseId]
        );

        if (prevResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: "Water record not found"
            });
        }

        const previousReading = Number(prevResult.rows[0].previousreading);
        const current = Number(currentReading);
        const r = Number(rate);

        const usage = current - previousReading;
        const bill = usage * r;

        if (usage < 0) {
            return res.status(400).json({
                success: false,
                error: "Current reading cannot be less than previous reading"
            });
        }

        // Check if record is already invoiced
        const invoiceCheck = await client.query(
            `
            SELECT invoiceId
            FROM waterReadings
            WHERE id = $1 AND invoiceId IS NOT NULL
            `,
            [id]
        );

        if (invoiceCheck.rows.length > 0) {
            return res.status(400).json({
                success: false,
                error: "Cannot edit water record that has already been invoiced"
            });
        }

        const result = await client.query(
            `
            UPDATE waterReadings
            SET
                currentReading = $1,
                rate = $2,
                usage = $3,
                bill = $4
            WHERE
                id = $5
                AND houseId = $6
                AND invoiceId IS NULL
            RETURNING id
            `,
            [current, r, usage, bill, id, houseId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: "Water record not found or already invoiced"
            });
        }

        await client.query("COMMIT");

        res.json({
            success: true,
            message: "Water record updated successfully",
            data: { 
                id,
                previousReading,
                currentReading: current,
                usage,
                rate: r,
                bill
            }
        });
    } catch (err) {
        await client.query("ROLLBACK");
        console.error("Edit Water Error:", err);
        res.status(500).json({
            success: false,
            error: err.message
        });
    } finally {
        client.release();
    }
};

// ======================================================
// SEARCH WATER BY HOUSE
// ======================================================
// GET /searchWaterByHouse/:houseNo
export const searchWaterByHouse = async (req, res) => {
    const { houseNo } = req.params;

    if (!houseNo) {
        return res.status(400).json({
            success: false,
            error: "House number is required"
        });
    }

    try {
        const result = await pool.query(
            `
            SELECT
                wr.id,
                h.houseNo,
                t.name AS tenant,
                wr.readingMonth,
                wr.previousReading,
                wr.currentReading
            FROM waterReadings wr
            JOIN houseList h
            ON wr.houseId = h.houseId
            LEFT JOIN tenantList t
            ON t.houseId = h.houseId
            WHERE
                wr.invoiceId IS NULL
                AND LOWER(h.houseNo) LIKE LOWER($1)
                AND t.moveOut IS NULL
            ORDER BY wr.readingMonth DESC
            `,
            [`%${houseNo}%`]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No water records found for this house"
            });
        }

        res.json({
            success: true,
            data: result.rows
        });
    } catch (err) {
        console.error("Search Water Error:", err);
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

// ======================================================
// UPDATE WATER READINGS
// ======================================================
// POST /water-update
export const updateWater = async (req, res) => {
    const { rate, houses } = req.body;

    // Validate required fields
    if (!rate || !houses || !Array.isArray(houses) || houses.length === 0) {
        return res.status(400).json({
            success: false,
            error: "Missing required fields: rate and houses array are required"
        });
    }

    // Validate rate
    if (isNaN(rate) || Number(rate) <= 0) {
        return res.status(400).json({
            success: false,
            error: "Rate must be a positive number"
        });
    }

    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const results = [];

        for (const house of houses) {
            // Validate house data
            if (!house.houseId || house.previousReading === undefined || house.currentReading === undefined) {
                throw new Error(`Invalid data for house: missing houseId, previousReading, or currentReading`);
            }

            const previous = Number(house.previousReading);
            const current = Number(house.currentReading);

            if (isNaN(previous) || isNaN(current)) {
                throw new Error(`Invalid readings for house ${house.houseNo || house.houseId}`);
            }

            if (current < previous) {
                throw new Error(
                    `Current reading for ${house.houseNo || 'house'} cannot be less than previous reading.`
                );
            }

            const usage = current - previous;
            const bill = usage * Number(rate);

            // Check if house has an active tenant
            const tenantCheck = await client.query(
                `
                SELECT id
                FROM tenantList
                WHERE houseId = $1 AND moveOut IS NULL
                `,
                [house.houseId]
            );

            if (tenantCheck.rows.length === 0) {
                throw new Error(`No active tenant found for house ${house.houseNo || house.houseId}`);
            }

            const result = await client.query(
                `
                INSERT INTO waterReadings(
                    houseId,
                    readingMonth,
                    previousReading,
                    currentReading,
                    usage,
                    rate,
                    bill
                )
                VALUES(
                    $1,
                    CURRENT_DATE,
                    $2,
                    $3,
                    $4,
                    $5,
                    $6
                )
                RETURNING id
                `,
                [
                    house.houseId,
                    previous,
                    current,
                    usage,
                    rate,
                    bill
                ]
            );

            results.push({
                houseId: house.houseId,
                houseNo: house.houseNo || 'Unknown',
                readingId: result.rows[0].id,
                usage,
                bill
            });
        }

        await client.query("COMMIT");

        res.json({
            success: true,
            message: `Water readings updated for ${results.length} house(s)`,
            data: results
        });
    } catch (err) {
        await client.query("ROLLBACK");
        console.error("Update Water Error:", err);
        res.status(500).json({
            success: false,
            error: err.message
        });
    } finally {
        client.release();
    }
};

// ======================================================
// GET WATER UPDATE LIST
// ======================================================
// GET /water-update-list
export const getWaterUpdateList = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                h.houseId AS "houseId",
                h.houseNo AS "houseNo",
                t.id AS "tenantId",
                t.name AS "tenant",
                COALESCE(
                    lastReading.currentReading,
                    0
                ) AS "previousReading"

            FROM tenantList t

            JOIN houseList h
            ON h.houseId = t.houseId

            LEFT JOIN LATERAL (
                SELECT currentReading
                FROM waterReadings
                WHERE houseId = h.houseId
                ORDER BY id DESC
                LIMIT 1
            ) lastReading
            ON TRUE

            WHERE t.moveOut IS NULL

            ORDER BY h.houseNo;
        `);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No active tenants found"
            });
        }

        res.json({
            success: true,
            data: result.rows
        });
    } catch (err) {
        console.error("Get Water Update List Error:", err);
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

// ======================================================
// GET WATER RECORD BY ID
// ======================================================
// GET /waterRecord/:id
export const getWaterRecordById = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            success: false,
            error: "Water record ID is required"
        });
    }

    try {
        const result = await pool.query(
            `
            SELECT
                id,
                houseid,
                previousreading,
                currentreading,
                readingmonth,
                usage,
                rate,
                bill,
                invoiceid
            FROM waterReadings
            WHERE id = $1
            `,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: "Water record not found"
            });
        }

        res.json({
            success: true,
            data: result.rows[0]
        });
    } catch (err) {
        console.error("Get Water Record Error:", err);
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};