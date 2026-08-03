// ======================================================
// PAYMENT CONTROLLER
// ======================================================
import pool from "../db.js";

// ======================================================
// CREATE PAYMENT
// ======================================================
// POST /payment
export const createPayment = async (req, res) => {
    const {
        tenantId,
        payAmount,
        paymentMethod,
        confirmationCode,
        paymentDate
    } = req.body;

    // Validate required fields
    if (!tenantId || !payAmount || !paymentMethod || !paymentDate) {
        return res.status(400).json({
            success: false,
            error: "Missing required fields: tenantId, payAmount, paymentMethod, and paymentDate are required"
        });
    }

    try {
        // Verify tenant exists and is active
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

        if (tenantCheck.rows[0].moveout !== null) {
            return res.status(400).json({
                success: false,
                error: "Cannot record payment for moved out tenant"
            });
        }

        const result = await pool.query(
            `
            INSERT INTO paymentList (
                tenantId,
                payAmount,
                paymentMethod,
                confirmationCode,
                paymentDate
            )
            VALUES ($1, $2, $3, $4, $5)
            RETURNING payId
            `,
            [tenantId, payAmount, paymentMethod, confirmationCode, paymentDate]
        );

        res.json({
            success: true,
            message: "Payment recorded successfully.",
            paymentId: result.rows[0].payid
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
// CREATE PAYMENT CORRECTION
// ======================================================
// POST /createPaymentCorrection
export const createPaymentCorrection = async (req, res) => {
    const {
        paymentId,
        fieldName,
        oldValue,
        newValue,
        reason
    } = req.body;

    // Validate required fields
    if (!paymentId || !fieldName || !reason) {
        return res.status(400).json({
            success: false,
            error: "Missing required fields: paymentId, fieldName, and reason are required"
        });
    }

    try {
        // Verify payment exists
        const paymentCheck = await pool.query(
            `
            SELECT payId
            FROM paymentList
            WHERE payId = $1
            `,
            [paymentId]
        );

        if (paymentCheck.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: "Payment not found"
            });
        }

        const result = await pool.query(
            `
            INSERT INTO paymentCorrections
            (
                paymentId,
                fieldName,
                oldValue,
                newValue,
                reason,
                createdAt
            )
            VALUES
            (
                $1,
                $2,
                $3,
                $4,
                $5,
                CURRENT_TIMESTAMP
            )
            RETURNING correctionId
            `,
            [paymentId, fieldName, oldValue, newValue, reason]
        );

        res.status(201).json({
            success: true,
            message: "Payment correction created",
            correctionId: result.rows[0].correctionid
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            error: "Failed to create payment correction"
        });
    }
};

// ======================================================
// GET PAYMENT BY ID
// ======================================================
// GET /payment/:paymentId
export const getPaymentById = async (req, res) => {
    const { paymentId } = req.params;

    if (!paymentId) {
        return res.status(400).json({
            error: "Payment ID is required"
        });
    }

    try {
        const result = await pool.query(
            `
            SELECT
                p.payId             AS paymentId,
                p.payAmount         AS paymentAmount,
                p.paymentMethod     AS paymentMethod,
                p.confirmationCode  AS confirmationCode,
                p.payDate           AS paymentDate,

                t.name              AS tenant

            FROM paymentList p

            JOIN tenantList t
            ON t.id = p.tenantId

            WHERE p.payId = $1
            `,
            [paymentId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: "Payment not found"
            });
        }

        res.json({
            payment: result.rows[0]
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: err.message
        });
    }
};

// ======================================================
// GET PAYMENT CORRECTION BY ID
// ======================================================
// GET /payment-correction/:id
export const getPaymentCorrectionById = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            error: "Correction ID is required"
        });
    }

    try {
        const result = await pool.query(
            `
            SELECT
                pc.correctionId,
                pc.paymentId,
                pc.fieldName,
                pc.oldValue,
                pc.newValue,
                pc.reason,
                pc.createdAt,

                p.payamount,
                p.paymentmethod,
                p.confirmationcode,
                p.paydate,

                t.name,
                h.houseNo

            FROM paymentCorrections pc

            JOIN paymentList p
            ON p.payid = pc.paymentId

            JOIN tenantList t
            ON t.id = p.tenantid

            LEFT JOIN houseList h
            ON h.houseId = t.houseid

            WHERE pc.correctionId = $1
            `,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: "Correction not found"
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
// GET ALL PAYMENTS
// ======================================================
// GET /payments
export const getPayments = async (req, res) => {
    try {
        const result = await pool.query(
            `
            SELECT
                p.payId,
                p.payDate,
                p.payAmount,
                p.paymentMethod,
                p.confirmationCode,

                t.name AS tenant,

                h.houseNo

            FROM paymentList p

            JOIN tenantList t
            ON t.id = p.tenantId

            LEFT JOIN houseList h
            ON h.houseId = t.houseId

            ORDER BY
                p.payDate DESC,
                p.payId DESC
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
// GET RECEIPT
// ======================================================
// GET /receipt/:paymentId
export const getReceipt = async (req, res) => {
    const { paymentId } = req.params;

    if (!paymentId) {
        return res.status(400).json({
            error: "Payment ID is required"
        });
    }

    try {
        const result = await pool.query(
            `
            SELECT
                p.payId,
                p.payAmount,
                p.paymentMethod,
                p.confirmationCode,
                p.payDate,

                t.name,
                h.houseNo

            FROM paymentList p

            JOIN tenantList t
            ON t.id = p.tenantId

            LEFT JOIN houseList h
            ON h.houseId = t.houseId

            WHERE p.payId = $1
            `,
            [paymentId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: "Receipt not found"
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
// SEARCH PAYMENT BY NAME
// ======================================================
// GET /searchPaymentByName/:name
export const searchPaymentByName = async (req, res) => {
    const { name } = req.params;

    if (!name) {
        return res.status(400).json({
            error: "Name is required for search"
        });
    }

    try {
        const result = await pool.query(
            `
            SELECT
                p.payid,
                p.paydate,
                p.payamount,
                p.paymentmethod,
                p.confirmationcode,

                t.id,
                t.name

            FROM paymentList p

            JOIN tenantList t
            ON t.id = p.tenantid

            WHERE t.name ILIKE $1

            ORDER BY p.paydate DESC
            `,
            [`%${name}%`]
        );

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: err.message
        });
    }
};