// ======================================================
// BILL CONTROLLER
// ======================================================
import pool from "../db.js";

// ======================================================
// CREATE BILLS
// ======================================================
// POST /create-bills
export const createBills = async (req, res) => {
    const { billingMonth, bills } = req.body;

    if (!billingMonth || !bills || bills.length === 0) {
        return res.status(400).json({
            error: "Missing bill data"
        });
    }

    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        for (const bill of bills) {
            await client.query(
                `
                INSERT INTO billList
                (
                    billDate,
                    category,
                    description,
                    amount,
                    status
                )
                VALUES
                (
                    $1,
                    $2,
                    $3,
                    $4,
                    $5
                )
                `,
                [
                    `${billingMonth}-01`,
                    bill.category,
                    bill.description,
                    bill.amount,
                    bill.status
                ]
            );
        }

        await client.query("COMMIT");

        res.status(201).json({
            success: true,
            message: "Bills created successfully."
        });
    } catch (err) {
        await client.query("ROLLBACK");
        console.error(err);
        res.status(500).json({
            error: err.message
        });
    } finally {
        client.release();
    }
};

// ======================================================
// GET BILL BY MONTH
// ======================================================
// GET /bill-month/:month
export const getBillByMonth = async (req, res) => {
    const { month } = req.params;

    console.log("Month received:", month);

    try {
        const result = await pool.query(
            `
            SELECT
                billid,
                category,
                description,
                amount,
                status,
                billdate
            FROM billList

            WHERE TO_CHAR(
                billDate,
                'YYYY-MM'
            ) = $1

            ORDER BY billid
            `,
            [month]
        );

        res.json(result.rows);
    } catch (err) {
        console.error("QUERY ERROR:", err);
        res.status(500).json({
            error: err.message
        });
    }
};

// ======================================================
// GET BILL PIVOT
// ======================================================
// GET /bill-pivot
export const getBillPivot = async (req, res) => {
    try {
        const result = await pool.query(
            `
            SELECT
                TO_CHAR(billDate, 'YYYY-MM') AS month,
                category,
                SUM(amount) AS amount,

                BOOL_AND(
                    LOWER(TRIM(status)) = 'paid'
                ) AS paid

            FROM billList

            GROUP BY
                TO_CHAR(billDate, 'YYYY-MM'),
                category

            ORDER BY month
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
// MODIFY BILLS
// ======================================================
// PUT /modify-bills
export const modifyBills = async (req, res) => {
    const { bills } = req.body;

    if (!bills || bills.length === 0) {
        return res.status(400).json({
            success: false,
            error: "No bills provided for update"
        });
    }

    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        for (const bill of bills) {
            await client.query(
                `
                UPDATE billList

                SET
                    category = $1,
                    description = $2,
                    amount = $3,
                    status = $4

                WHERE billid = $5
                `,
                [
                    bill.category,
                    bill.description,
                    bill.amount,
                    bill.status,
                    bill.billid
                ]
            );
        }

        await client.query("COMMIT");

        res.json({
            success: true,
            message: "Bills updated successfully"
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