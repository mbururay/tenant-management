import express from "express";
import cors from "cors";
import pool from "./db.js";

const app = express();

app.use(cors());
app.use(express.json());

// test route
app.get("/", (req, res) => {
    res.send("server alive");
});

// main dashboard
app.get("/tenant-dashboard", async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT * FROM tenant_dashboard;
    `);

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: err.message
        });
    }
});



//ADD TENANT
app.post("/add-tenant", async (req, res) => {
    try {
        console.log(req.body);

        const {
            name,
            phone,
            houseNo,
            rent,
            garbage,
            deposit
        } = req.body;

        const houseResult = await pool.query(
            `INSERT INTO houseList(houseNo, rent, garbage)
       VALUES ($1, $2, $3)
       ON CONFLICT (houseNo)
       DO UPDATE SET rent = EXCLUDED.rent, garbage = EXCLUDED.garbage
       RETURNING houseId`,
            [houseNo, rent, garbage]
        );

        console.log("HOUSE RESULT:", houseResult.rows);

        const houseId = houseResult.rows[0].houseid;

        const tenantResult = await pool.query(
            `INSERT INTO tenantList(name, phone, houseId)
       VALUES ($1, $2, $3)
       RETURNING id`,
            [name, phone, houseId]
        );

        console.log("TENANT RESULT:", tenantResult.rows);

        const tenantId = tenantResult.rows[0].id;

        await pool.query(
            `INSERT INTO phoneList(tenantId, phone)
       VALUES ($1, $2)`,
            [tenantId, phone]
        );

        await pool.query(
            `INSERT INTO chargeList(tenantId, chargeType, chargeAmount)
       VALUES ($1, 'Deposit', $2)`,
            [tenantId, deposit]
        );

        res.json({
            success: true
        });

    } catch (err) {
        console.error("FULL ERROR:", err);
        res.status(500).json({
            error: err.message
        });
    }
});

//UPDATE WATER READINGS
app.post("/add-water", async (req, res) => {
    const {
        houseNo,
        currentReading,
        rate
    } = req.body;
    const current = Number(currentReading);
    const r = Number(rate);

    if (!houseNo || isNaN(current) || isNaN(r)) {
        return res.status(400).json({
            error: "Invalid input"
        });
    }

    try {
        // 1. get houseId
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
                error: "House not found"
            });
        }

        const houseId = house.rows[0].houseid;

        // 2. get previous reading (SAFE BACKEND LOGIC)
        const prev = await pool.query(
            `
      SELECT currentreading
      FROM waterReadings
      WHERE houseId = $1
      ORDER BY id DESC
      LIMIT 1
      `,
            [houseId]
        );

        const previousReading = prev.rows.length > 0 ?
            Number(prev.rows[0].currentreading) :
            0;


        // 3. compute usage + bill
        const usage = current - previousReading;
        const bill = usage * r;

        // 4. insert water record (IMPORTANT FOR HISTORY)
        await pool.query(
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
      VALUES ($1, NOW(), $2, $3, $4, $5, $6)
      `,
            [
                houseId,
                previousReading,
                current,
                usage,
                r,
                bill
            ]
        );
        // 5. get tenants
        const tenants = await pool.query(
            `
      SELECT id
      FROM tenantList
      WHERE houseId = $1 AND moveout IS NULL
      `,
            [houseId]
        );

        // 6. safety check (IMPORTANT)
        if (tenants.rows.length === 0) {
            return res.json({
                success: true,
                message: "Water recorded but no active tenants to charge"
            });
        }

        // 7. split bill
        const splitBill = bill / tenants.rows.length;

        for (const tenant of tenants.rows) {
            await pool.query(
                `
        INSERT INTO chargeList(tenantId, chargeType, chargeAmount)
        VALUES ($1, 'Water', $2)
        `,
                [tenant.id, splitBill]
            );
        }

        res.json({
            success: true
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: err.message
        });
    }
});


//REMOVE TENANTS
app.post("/remove-tenant", async (req, res) => {
    try {
        const {
            houseNo,
            moveOut
        } = req.body;

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
      RETURNING *
      `,
            [moveOut, houseId]
        );

        if (tenant.rows.length === 0) {
            return res.status(404).json({
                error: "No active tenant found"
            });
        }

        res.json({
            success: true,
            tenant: tenant.rows[0]
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: err.message
        });
    }
});



// postgres test route
app.get("/serene_homes", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");
        res.json(result.rows[0]);
    } catch (err) {
        console.error("POSTGRES ERROR:", err);
        res.status(500).json({
            error: err.message
        });
    }
});



// start server LAST
app.listen(3001, () => {
    console.log("Server running on port 3001");
});