// ======================================================
// MOVE OUT CONTROLLER
// ======================================================
import pool from "../db.js";

// ======================================================
// COMPLETE MOVE OUT
// ======================================================
// POST /complete-moveout
export const completeMoveOut = async (req, res) => {
    const {
        tenant,
        moveOutDate,
        depositHeld,
        totalCharges,
        refundDue,
        balanceOwing,
        charges
    } = req.body;

    // Validate required fields
    if (!tenant || !tenant.id || !moveOutDate) {
        return res.status(400).json({
            success: false,
            error: "Missing required fields: tenant.id and moveOutDate are required"
        });
    }

    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        // Verify tenant exists and is active
        const tenantCheck = await client.query(
            `
            SELECT id, moveOut
            FROM tenantList
            WHERE id = $1
            `,
            [tenant.id]
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
                error: "Tenant has already been moved out"
            });
        }

        // Save move out summary
        const moveOutResult = await client.query(
            `
            INSERT INTO moveOutList
            (
                tenantId,
                moveOutDate,
                depositHeld,
                totalCharges,
                refundDue,
                balanceOwing
            )
            VALUES
            (
                $1,
                $2,
                $3,
                $4,
                $5,
                $6
            )
            RETURNING moveOutId
            `,
            [tenant.id, moveOutDate, depositHeld, totalCharges, refundDue, balanceOwing]
        );

        const moveOutId = moveOutResult.rows[0].moveoutid;

        // Save all deductions
        if (charges && charges.length > 0) {
            for (const charge of charges) {
                await client.query(
                    `
                    INSERT INTO moveOutCharge
                    (
                        moveOutId,
                        description,
                        amount
                    )
                    VALUES
                    (
                        $1,
                        $2,
                        $3
                    )
                    `,
                    [moveOutId, charge.description, charge.amount]
                );
            }
        }

        // Mark tenant as moved out
        await client.query(
            `
            UPDATE tenantList
            SET moveOut = $1
            WHERE id = $2
            `,
            [moveOutDate, tenant.id]
        );

        await client.query("COMMIT");

        res.json({
            success: true,
            message: "Move out completed successfully.",
            moveOutId: moveOutId
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
// GET MOVE OUT LIST
// ======================================================
// GET /moveout-list
export const getMoveOutList = async (req, res) => {
    try {
        const result = await pool.query(
            `
            SELECT
                m.moveOutId,
                t.name,
                h.houseNo,
                m.moveOutDate,
                m.depositHeld,
                m.totalCharges,
                m.refundDue,
                m.balanceOwing,
                m.createdAt

            FROM moveOutList m

            JOIN tenantList t
                ON m.tenantId = t.id

            LEFT JOIN houseList h
                ON t.houseId = h.houseId

            ORDER BY
                m.moveOutDate DESC,
                t.name;
            `
        );

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: err.message
        });
    }
};

// ======================================================
// GET MOVE OUT TENANT DETAILS
// ======================================================
// GET /moveout-tenant/:id
export const getMoveOutTenant = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            error: "Tenant ID is required"
        });
    }

    try {
        const result = await pool.query(
            `
            SELECT
                t.id,
                t.name,
                h.houseNo,
                c.chargeAmount AS deposit
            FROM tenantList t

            LEFT JOIN houseList h
                ON t.houseId = h.houseId

            LEFT JOIN chargeList c
                ON t.id = c.tenantId
               AND c.chargeType = 'Deposit'

            WHERE t.id = $1
            `,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: "Tenant not found"
            });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: err.message
        });
    }
};

// ======================================================
// GET MOVE OUT VIEW
// ======================================================
// GET /moveout-view/:moveoutId
export const getMoveOutView = async (req, res) => {
    const { moveoutId } = req.params;

    if (!moveoutId) {
        return res.status(400).json({
            error: "Move out ID is required"
        });
    }

    try {
        const summary = await pool.query(
            `
            SELECT
                m.moveOutId,
                m.moveOutDate,
                m.depositHeld,
                m.totalCharges,
                m.refundDue,
                m.balanceOwing,
                t.id,
                t.name,
                t.phone,
                h.houseNo

            FROM moveOutList m

            JOIN tenantList t
                ON m.tenantId = t.id

            LEFT JOIN houseList h
                ON t.houseId = h.houseId

            WHERE
                m.moveOutId = $1
            `,
            [moveoutId]
        );

        if (summary.rows.length === 0) {
            return res.status(404).json({
                error: "Move out record not found"
            });
        }

        const deductions = await pool.query(
            `
            SELECT
                chargeId,
                description,
                amount

            FROM moveOutCharge

            WHERE
                moveOutId = $1

            ORDER BY
                chargeId
            `,
            [moveoutId]
        );

        res.json({
            summary: summary.rows[0],
            deductions: deductions.rows
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: err.message
        });
    }
};