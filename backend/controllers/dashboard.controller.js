// ======================================================
// DASHBOARD CONTROLLER
// ======================================================
import pool from "../db.js";

// ======================================================
// GET DASHBOARD SUMMARY
// ======================================================
// GET /dashboard-summary
export const getDashboardSummary = async (req, res) => {
    try {
        const occupiedResult = await pool.query(
            `
            SELECT COUNT(*) AS occupied
            FROM tenantList
            WHERE moveout IS NULL
            `
        );

        const vacantResult = await pool.query(
            `
            SELECT COUNT(*) AS vacant
            FROM houseList
            WHERE houseid NOT IN (
                SELECT houseid
                FROM tenantList
                WHERE moveout IS NULL
            )
            `
        );

        const paymentsResult = await pool.query(
            `
            SELECT
                COALESCE(
                    SUM(payamount),
                    0
                ) AS payments
            FROM paymentList
            WHERE DATE_TRUNC(
                'month',
                paydate
            )
            =
            DATE_TRUNC(
                'month',
                CURRENT_DATE
            )
            `
        );

        const arrearsResult = await pool.query(
            `
            SELECT
                COALESCE(
                    (
                        SELECT SUM(totalamount)
                        FROM invoiceList
                    ),
                    0
                )
                -
                COALESCE(
                    (
                        SELECT SUM(payamount)
                        FROM paymentList
                    ),
                    0
                )
                AS arrears
            `
        );

        res.json({
            occupiedUnits: Number(occupiedResult.rows[0].occupied),
            vacantUnits: Number(vacantResult.rows[0].vacant),
            paymentsReceived: Number(paymentsResult.rows[0].payments),
            outstandingArrears: Number(arrearsResult.rows[0].arrears)
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: err.message
        });
    }
};

// ======================================================
// GET HOUSE PIVOT
// ======================================================
// GET /house-pivot
export const getHousePivot = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                DATE_TRUNC('month', p.payDate) AS month,
                h.houseNo,
                SUM(p.payAmount) AS total

            FROM paymentList p

            JOIN tenantList t
            ON p.tenantId = t.id

            JOIN houseList h
            ON t.houseId = h.houseId

            GROUP BY
                DATE_TRUNC('month', p.payDate),
                h.houseNo

            ORDER BY
                DATE_TRUNC('month', p.payDate),
                h.houseNo;
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
// GET TENANT DASHBOARD
// ======================================================
// GET /tenant-dashboard
export const getTenantDashboard = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                td.*,
                COALESCE(ob.chargeamount, 0) AS openingbalance

            FROM tenant_dashboard td

            LEFT JOIN chargeList ob
                ON ob.tenantid = td.tenantid
               AND ob.chargetype = 'Opening Balance';
        `);

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: err.message
        });
    }
};

export const getTenantStatement = async (req, res)  => {
    const { id } = req.params;

    try {
        const tenantResult = await pool.query(
            `
            SELECT
                t.name,
                t.phone,
                h.houseNo

            FROM tenantList t

            JOIN houseList h
                ON t.houseId = h.houseId

            WHERE t.id = $1
            `,
            [id]
        );

        const transactionResult = await pool.query(
            `
            SELECT
                'CHARGE' AS type,
                c.chargeDate AS date,
                c.chargeType AS description,
                c.chargeAmount AS amount

            FROM chargeList c

            WHERE c.tenantId = $1

            UNION ALL

            SELECT
                'CHARGE' AS type,
                w.readingMonth AS date,
                'Water' AS description,
                w.bill AS amount

            FROM waterReadings w

            JOIN houseList h
                ON h.houseId = w.houseId

            JOIN tenantList t
                ON t.houseId = h.houseId

            WHERE t.id = $1
            AND w.isOpening = FALSE
            AND w.invoiceId IS NOT NULL

            UNION ALL

            SELECT
                'PAYMENT' AS type,
                p.paymentDate AS date,
                p.paymentMethod || ' - ' || p.confirmationCode AS description,
                p.payAmount AS amount

            FROM paymentList p

            WHERE p.tenantId = $1

            ORDER BY date ASC;
            `,
            [id]
        );

        let balance = 0;
        let charges = 0;
        let payments = 0;

        const transactions = transactionResult.rows.map(row => {
            const amount = Number(row.amount);

            let debit = 0;
            let credit = 0;

            if (row.type === "CHARGE") {
                debit = amount;
                balance += debit;
                charges += debit;
            } else {
                credit = amount;
                balance -= credit;
                payments += credit;
            }

            return {
                date: row.date,
                type: row.type,
                description: row.description,
                debit,
                credit,
                balance
            };
        });

        res.json({
            tenant: tenantResult.rows[0],
            summary: {
                openingBalance: 0,
                charges,
                payments,
                balance
            },
            transactions
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: err.message
        });
    }
};
