// ======================================================
// INVOICE CONTROLLER
// ======================================================
import pool from "../db.js";

// ======================================================
// INVOICE OPERATIONS
// ======================================================

// ======================================================
// GENERATE INVOICE
// ======================================================
// POST /gen-invoice
export const generateInvoice = async (req, res) => {
    try {
        // Next billing month
        const billingDate = new Date();
        billingDate.setMonth(billingDate.getMonth() + 1);
        billingDate.setDate(1);

        const tenants = await pool.query(`
            SELECT
                t.id,
                t.houseId,
                h.rent,
                h.garbage

            FROM tenantList t

            JOIN houseList h
            ON t.houseId = h.houseId

            WHERE t.moveOut IS NULL
        `);

        let created = 0;

        for (const t of tenants.rows) {
            const tenantId = t.id;
            const houseId = t.houseid;

            /*
              ADD MONTHLY CHARGES
            */
            const rentExists = await pool.query(
                `
                SELECT 1
                FROM chargeList

                WHERE tenantId = $1
                AND chargeType = 'Rent'
                AND billingDate = $2
                `,
                [tenantId, billingDate]
            );

            if (rentExists.rows.length === 0) {
                await pool.query(
                    `
                    INSERT INTO chargeList(
                        tenantId,
                        chargeType,
                        chargeAmount,
                        billingDate
                    )

                    VALUES(
                        $1,
                        'Rent',
                        $2,
                        $3
                    )
                    `,
                    [tenantId, t.rent, billingDate]
                );
            }

            const garbageExists = await pool.query(
                `
                SELECT 1
                FROM chargeList

                WHERE tenantId = $1
                AND chargeType = 'Garbage'
                AND billingDate = $2
                `,
                [tenantId, billingDate]
            );

            if (garbageExists.rows.length === 0) {
                await pool.query(
                    `
                    INSERT INTO chargeList(
                        tenantId,
                        chargeType,
                        chargeAmount,
                        billingDate
                    )

                    VALUES(
                        $1,
                        'Garbage',
                        $2,
                        $3
                    )
                    `,
                    [tenantId, t.garbage, billingDate]
                );
            }

            /*
              GET UNINVOICED CHARGES
            */
            const charges = await pool.query(
                `
                SELECT
                    chargeId,
                    chargeAmount

                FROM chargeList

                WHERE tenantId = $1
                AND invoiceId IS NULL
                `,
                [tenantId]
            );

            /*
              GET WATER
            */
            console.log("House:", houseId);

            const water = await pool.query(
                `
                SELECT
                    id,
                    bill

                FROM waterReadings

                WHERE houseId = $1
                AND invoiceId IS NULL
                AND isOpening = FALSE

                ORDER BY readingMonth DESC

                LIMIT 1;
                `,
                [houseId]
            );

            if (charges.rows.length === 0 && water.rows.length === 0) {
                continue;
            }

            /*
              CALCULATE PREVIOUS BALANCE
              Previous invoices - Payments
            */
            const previousBalanceResult = await pool.query(
                `
                SELECT

                COALESCE(
                    (
                        SELECT SUM(totalAmount)
                        FROM invoiceList
                        WHERE tenantId = $1
                    ),
                    0
                )

                -

                COALESCE(
                    (
                        SELECT SUM(payAmount)
                        FROM paymentList
                        WHERE tenantId = $1
                    ),
                    0
                )

                AS balance
                `,
                [tenantId]
            );

            const previousBalance = Number(previousBalanceResult.rows[0].balance);

            /*
              CREATE INVOICE
            */
            const invoice = await pool.query(
                `
                INSERT INTO invoiceList(
                    tenantId,
                    generatedDate,
                    billingDate,
                    previousBalance
                )

                VALUES(
                    $1,
                    CURRENT_DATE,
                    $2,
                    $3
                )

                RETURNING invoiceId
                `,
                [tenantId, billingDate, previousBalance]
            );

            const invoiceId = invoice.rows[0].invoiceid;

            /*
              CALCULATE CURRENT CHARGES
            */
            const chargeTotal = await pool.query(
                `
                SELECT

                COALESCE(
                    SUM(chargeAmount),
                    0
                ) AS total

                FROM chargeList

                WHERE tenantId = $1

                AND invoiceId IS NULL
                `,
                [tenantId]
            );

            const totalCharges = Number(chargeTotal.rows[0].total);

            const waterBill = water.rows.length > 0 ? Number(water.rows[0].bill) : 0;

            const total = totalCharges + waterBill;

            /*
              ASSIGN CHARGES TO INVOICE
            */
            await pool.query(
                `
                UPDATE chargeList

                SET invoiceId = $1

                WHERE tenantId = $2

                AND invoiceId IS NULL
                `,
                [invoiceId, tenantId]
            );

            /*
              ASSIGN ONLY THE WATER READING THAT WAS INVOICED
            */
            if (water.rows.length > 0) {
                await pool.query(
                    `
                    UPDATE waterReadings

                    SET invoiceId = $1

                    WHERE id = $2
                    `,
                    [invoiceId, water.rows[0].id]
                );
            }

            /*
              SAVE TOTAL
            */
            await pool.query(
                `
                UPDATE invoiceList

                SET totalAmount = $1

                WHERE invoiceId = $2
                `,
                [total, invoiceId]
            );

            created++;
        }

        res.json({
            success: true,
            message: `${created} invoices generated`
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: err.message
        });
    }
};

// ======================================================
// GET INVOICE BY ID
// ======================================================
// GET /invoice/:id
export const getInvoiceById = async (req, res) => {
    const { id } = req.params;

    try {
        // invoice header
        const invoice = await pool.query(`
            SELECT
                i.invoiceId,
                i.tenantId,
                i.billingDate,
                i.totalAmount,
                i.previousBalance AS accountBalance,

                t.name,
                h.houseNo

            FROM invoiceList i

            JOIN tenantList t
            ON t.id = i.tenantId

            JOIN houseList h
            ON h.houseId = t.houseId

            WHERE i.invoiceId = $1
        `, [id]);

        if (invoice.rows.length === 0) {
            return res.status(404).json({
                error: "Invoice not found"
            });
        }

        // charges attached to this invoice
        const charges = await pool.query(`
            SELECT 
                chargeId, 
                chargeType, 
                chargeAmount

            FROM chargeList

            WHERE invoiceId = $1

            ORDER BY chargeId ASC
        `, [id]);

        // water attached to this invoice
        const water = await pool.query(
            `
            SELECT
                previousReading,
                currentReading,
                usage,
                rate,
                bill

            FROM waterReadings

            WHERE invoiceId = $1
            AND isOpening = FALSE

            ORDER BY readingMonth DESC

            LIMIT 1
            `,
            [id]
        );

        res.json({
            invoice: invoice.rows[0],
            charges: charges.rows,
            water: water.rows[0] || null
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: err.message
        });
    }
};

// ======================================================
// GET INVOICE INFO
// ======================================================
// GET /invoice-info
export const getInvoiceInfo = async (req, res) => {
    try {
        const billing = await pool.query(`
            SELECT billingDate
            FROM invoiceList
            ORDER BY invoiceId DESC
            LIMIT 1
        `);

        const tenants = await pool.query(`
            SELECT COUNT(*) AS count
            FROM tenantList
            WHERE moveOut IS NULL
        `);

        res.json({
            billingMonth: billing.rows.length > 0 ? billing.rows[0].billingdate : "No invoices yet",
            tenantCount: tenants.rows[0].count
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: err.message
        });
    }
};

// ======================================================
// GET INVOICE BY MONTH
// ======================================================
// GET /invoice-month/:month
export const getInvoiceByMonth = async (req, res) => {
    const { month } = req.params;

    try {
        const result = await pool.query(
            `
            SELECT
                i.invoiceid,
                i.billingdate,
                i.totalamount,
                t.name,
                t.houseid
            FROM invoiceList i

            JOIN tenantList t
            ON i.tenantid = t.id

            WHERE TO_CHAR(
                i.billingdate,
                'YYYY-MM'
            ) = $1

            ORDER BY t.houseid
            `,
            [month]
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
// GET INVOICE MONTHS
// ======================================================
// GET /invoice-months
export const getInvoiceMonths = async (req, res) => {
    try {
        const result = await pool.query(
            `
            SELECT
                TO_CHAR(billingDate,'YYYY-MM') AS month,
                COUNT(*) AS invoiceCount,
                SUM(totalAmount) AS totalBilled
            FROM invoiceList
            GROUP BY TO_CHAR(billingDate,'YYYY-MM')
            ORDER BY month DESC
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
// GET ALL INVOICES
// ======================================================
// GET /invoices
export const getInvoices = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                i.invoiceId,
                i.generatedDate,
                i.billingDate,
                i.totalAmount,

                t.name,
                h.houseNo

            FROM invoiceList i

            JOIN tenantList t
            ON t.id = i.tenantId

            JOIN houseList h
            ON h.houseId = t.houseId

            ORDER BY i.invoiceId DESC;
        `);

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: err.message
        });
    }
};

// ======================================================
// GET MONTH INVOICES
// ======================================================
// GET /month-invoices/:month
export const getMonthInvoices = async (req, res) => {
    const { month } = req.params;

    try {
        const invoices = await pool.query(
            `
            SELECT
                i.invoiceId,
                i.billingDate,
                i.totalAmount,
                t.name,
                h.houseNo
            FROM invoiceList i
            JOIN tenantList t
                ON t.id = i.tenantId
            JOIN houseList h
                ON h.houseId = t.houseId
            WHERE TO_CHAR(i.billingDate, 'YYYY-MM') ILIKE $1
            `,
            [month]
        );

        const results = [];

        for (const invoice of invoices.rows) {
            const charges = await pool.query(
                `
                SELECT chargeId, chargeType, chargeAmount
                FROM chargeList
                WHERE invoiceId = $1
                `,
                [invoice.invoiceid]
            );

            const water = await pool.query(
                `
                SELECT
                    previousReading,
                    currentReading,
                    usage,
                    rate,
                    bill
                FROM waterReadings
                WHERE invoiceId = $1
                LIMIT 1
                `,
                [invoice.invoiceid]
            );

            results.push({
                invoice,
                charges: charges.rows,
                water: water.rows[0] || null
            });
        }

        res.json(results);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: err.message
        });
    }
};

// ======================================================
// SEARCH INVOICE BY NAME
// ======================================================
// GET /searchInvoiceByName/:name
export const searchInvoiceByName = async (req, res) => {
    const { name } = req.params;

    try {
        const result = await pool.query(
            `
            SELECT
                il.invoiceid      AS "invoiceId",
                tl.id             AS "tenantId",
                tl.name           AS "tenant",
                h.houseno         AS "houseNo",
                il.generateddate  AS "generatedDate",
                il.billingdate    AS "billingDate",
                il.totalamount    AS "totalAmount"

            FROM invoiceList il

            JOIN tenantList tl
                ON il.tenantid = tl.id

            JOIN houseList h
                ON tl.houseid = h.houseid

            WHERE LOWER(tl.name) LIKE LOWER($1)

            ORDER BY il.billingdate DESC;
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

// ======================================================
// INVOICE CORRECTION OPERATIONS
// ======================================================

// ======================================================
// CREATE INVOICE CORRECTION
// ======================================================
// POST /createInvoiceCorrection
export const createInvoiceCorrection = async (req, res) => {
    const {
        invoiceId,
        tenantId,
        amount,
        reason,
        correctionType
    } = req.body;

    if (!invoiceId || !tenantId || !amount || !reason || !correctionType) {
        return res.status(400).json({
            success: false,
            error: "Missing required fields"
        });
    }

    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        // Verify invoice exists
        const invoiceCheck = await client.query(
            `
            SELECT invoiceId
            FROM invoiceList
            WHERE invoiceId = $1
            `,
            [invoiceId]
        );

        if (invoiceCheck.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: "Invoice not found"
            });
        }

        const result = await client.query(
            `
            INSERT INTO invoiceCorrection
            (
                invoiceId,
                tenantId,
                adjustmentAmount,
                reason,
                correctionType,
                status,
                createdAt
            )
            VALUES
            (
                $1,
                $2,
                $3,
                $4,
                $5,
                'Draft',
                CURRENT_TIMESTAMP
            )
            RETURNING correctionId
            `,
            [invoiceId, tenantId, amount, reason, correctionType]
        );

        await client.query("COMMIT");

        res.json({
            success: true,
            message: "Invoice correction created.",
            correctionId: result.rows[0].correctionid
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
// GET INVOICE CORRECTION BY ID
// ======================================================
// GET /invoice-correction/:id
export const getInvoiceCorrectionById = async (req, res) => {
    const { id } = req.params;

    try {
        const correction = await pool.query(`
            SELECT
                ic.correctionId,
                ic.adjustmentAmount,
                ic.reason,
                ic.correctionType,
                ic.status,
                ic.createdAt,

                i.invoiceId,
                i.billingDate,
                i.totalAmount,

                t.name,
                h.houseNo

            FROM invoiceCorrection ic

            JOIN invoiceList i
            ON i.invoiceId = ic.invoiceId

            JOIN tenantList t
            ON t.id = ic.tenantId

            JOIN houseList h
            ON h.houseId = t.houseId

            WHERE ic.correctionId = $1
        `, [id]);

        if (correction.rows.length === 0) {
            return res.status(404).json({
                error: "Invoice correction not found"
            });
        }

        res.json(correction.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: err.message
        });
    }
};

export const printMonthlyInvoice = async (req, res) => {
    const token = req.token;
    try {
        const { month } = req.params;

        const browser = await puppeteer.launch({
            args: chromium.args,
            executablePath: await chromium.executablePath(),
            headless: true
        });

        const page = await browser.newPage();

        await page.evaluateOnNewDocument(
            (token) => {
                localStorage.setItem("token", token);
            },
            token
        );

        // Open the React invoice page
        await page.goto(
            `${process.env.FRONTEND_URL}/InvoicePrint/${encodeURIComponent(month)}`,
            {
                waitUntil: "networkidle0"
            }
        );

        const pdfBuffer = await page.pdf({
            format: "A4",
            printBackground: true,
            margin: {
                top: "20px",
                right: "20px",
                bottom: "20px",
                left: "20px"
            }
        });

        await browser.close();

        res.setHeader(
            "Content-Disposition",
            `inline; filename=invoice-${month}.pdf`
        );

        res.setHeader(
            "Content-Type",
            "application/pdf"
        );

        res.send(pdfBuffer);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
