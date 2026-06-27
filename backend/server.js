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

app.get("/invoice-info", async (req, res) => {
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
      billingMonth:
        billing.rows.length > 0
          ? billing.rows[0].billingdate
          : "No invoices yet",

      tenantCount: tenants.rows[0].count
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/gen-invoice", async (req, res) => {
  try {

    // Bill NEXT month
    const billingDate = new Date();
    billingDate.setMonth(billingDate.getMonth() + 1);
    billingDate.setDate(1);

    // Get all active tenants
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

      //--------------------------------------------------
      // CREATE MONTHLY RENT
      //--------------------------------------------------

      const rentExists = await pool.query(`
        SELECT 1
        FROM chargeList
        WHERE tenantId = $1
        AND chargeType = 'Rent'
        AND billingDate = $2
      `,[tenantId,billingDate]);

      if(rentExists.rows.length === 0){

        await pool.query(`
          INSERT INTO chargeList(
            tenantId,
            chargeType,
            chargeAmount,
            billingDate
          )
          VALUES($1,'Rent',$2,$3)
        `,[tenantId,t.rent,billingDate]);

      }

      //--------------------------------------------------
      // CREATE MONTHLY GARBAGE
      //--------------------------------------------------

      const garbageExists = await pool.query(`
        SELECT 1
        FROM chargeList
        WHERE tenantId = $1
        AND chargeType = 'Garbage'
        AND billingDate = $2
      `,[tenantId,billingDate]);

      if(garbageExists.rows.length === 0){

        await pool.query(`
          INSERT INTO chargeList(
            tenantId,
            chargeType,
            chargeAmount,
            billingDate
          )
          VALUES($1,'Garbage',$2,$3)
        `,[tenantId,t.garbage,billingDate]);

      }

      //--------------------------------------------------
      // GET UNINVOICED CHARGES
      //--------------------------------------------------

      const charges = await pool.query(`
        SELECT
          chargeId,
          chargeAmount
        FROM chargeList
        WHERE tenantId = $1
        AND invoiceId IS NULL
      `,[tenantId]);

      //--------------------------------------------------
      // GET LATEST WATER
      //--------------------------------------------------

      const water = await pool.query(`
        SELECT
          id,
          bill
        FROM waterReadings
        WHERE houseId = $1
        AND invoiceId IS NULL
        ORDER BY readingMonth DESC
        LIMIT 1
      `,[houseId]);

      if(charges.rows.length === 0 && water.rows.length === 0){
        continue;
      }

      //--------------------------------------------------
      // CREATE INVOICE
      //--------------------------------------------------

      const invoice = await pool.query(`
        INSERT INTO invoiceList(
          tenantId,
          generatedDate,
          billingDate
        )
        VALUES(
          $1,
          CURRENT_DATE,
          $2
        )
        RETURNING invoiceId
      `,[tenantId,billingDate]);

      const invoiceId = invoice.rows[0].invoiceid;

      //--------------------------------------------------
      // TOTAL CHARGES
      //--------------------------------------------------

      const chargeTotal = await pool.query(`
        SELECT
          COALESCE(SUM(chargeAmount),0) AS total
        FROM chargeList
        WHERE tenantId = $1
        AND invoiceId IS NULL
      `,[tenantId]);

      const totalCharges =
        Number(chargeTotal.rows[0].total);

      const waterBill =
        water.rows.length > 0
        ? Number(water.rows[0].bill)
        : 0;

      const total = totalCharges + waterBill;

      //--------------------------------------------------
      // ATTACH CHARGES
      //--------------------------------------------------

      await pool.query(`
        UPDATE chargeList
        SET invoiceId = $1
        WHERE tenantId = $2
        AND invoiceId IS NULL
      `,[invoiceId,tenantId]);

      //--------------------------------------------------
      // ATTACH WATER
      //--------------------------------------------------

      await pool.query(`
        UPDATE waterReadings
        SET invoiceId = $1
        WHERE houseId = $2
        AND invoiceId IS NULL
      `,[invoiceId,houseId]);

      //--------------------------------------------------
      // STORE TOTAL
      //--------------------------------------------------

      await pool.query(`
        UPDATE invoiceList
        SET totalAmount = $1
        WHERE invoiceId = $2
      `,[total,invoiceId]);

      created++;

    }

    res.json({
      success:true,
      message:`${created} invoices generated`
    });

  } catch(err){

    console.error(err);

    res.status(500).json({
      error:err.message
    });

  }
});

app.get("/invoices", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        i.invoiceId,
        i.generatedDate,
        i.billingDate,
        t.name,
        h.houseNo,

        COALESCE(SUM(c.chargeAmount), 0)
        + COALESCE(SUM(w.bill), 0) AS total

      FROM invoiceList i
      JOIN tenantList t ON t.id = i.tenantId
      JOIN houseList h ON h.houseId = t.houseId

      LEFT JOIN chargeList c ON c.invoiceId = i.invoiceId
      LEFT JOIN waterReadings w ON w.invoiceId = i.invoiceId

      GROUP BY 
        i.invoiceId,
        i.generatedDate,
        i.billingDate,
        t.name,
        h.houseNo

      ORDER BY i.invoiceId DESC;
    `);

    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/invoice/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // invoice header
    const invoice = await pool.query(`
      SELECT 
        i.invoiceId,
        i.billingDate,
        t.name,
        h.houseNo
      FROM invoiceList i
      JOIN tenantList t ON t.id = i.tenantId
      JOIN houseList h ON h.houseId = t.houseId
      WHERE i.invoiceId = $1
    `, [id]);

    // charges
    const charges = await pool.query(`
      SELECT chargeId, chargeType, chargeAmount
      FROM chargeList
      WHERE invoiceId = $1
    `, [id]);

    // water
    const water = await pool.query(`
      SELECT bill
      FROM waterReadings
      WHERE invoiceId = $1
      LIMIT 1
    `, [id]);

    res.json({
      invoice: invoice.rows[0],
      charges: charges.rows,
      water: water.rows[0] || null
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
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