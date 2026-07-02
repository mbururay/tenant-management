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
});

app.get("/invoice/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // invoice header
    const invoice = await pool.query(`
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
        SELECT
        previousReading,
        currentReading,
        usage,
        rate,
        bill
        FROM waterReadings
        WHERE invoiceId = $1
        LIMIT 1;
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

app.get("/searchTenant/:phone", async (req, res) => {
  try {

    const { phone } = req.params;

    const result = await pool.query(`
      SELECT
        t.id,
        t.name,
        h.houseNo
      FROM tenantList t
      JOIN houseList h
        ON t.houseId = h.houseId
      WHERE t.phone = $1
      AND t.moveOut IS NULL
      ORDER BY t.name
    `, [phone]);

    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/payment", async (req, res) => {
  const {
    tenantId,
    payAmount,
    paymentMethod,
    confirmationCode
  } = req.body;

  try {
    await pool.query(
      `
      INSERT INTO paymentList (
        tenantId,
        payAmount,
        paymentMethod,
        confirmationCode
      )
      VALUES ($1, $2, $3, $4)
      `,
      [
        tenantId,
        payAmount,
        paymentMethod,
        confirmationCode
      ]
    );

    res.json({
      success: true,
      message: "Payment recorded successfully."
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

app.get("/searchTenantByName/:name", async (req, res) => {
  const { name } = req.params;

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

    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err.message
    });
  }
});

app.get("/tenant/:id", async (req, res) => {
  const { id } = req.params;

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

    res.json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.put("/edit-tenant", async (req, res) => {
  const {
    tenantId,
    name,
    phone,
    rent,
    garbage
  } = req.body;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

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
      message: "Tenant updated successfully."
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
});

app.get("/water-update-list", async (req, res) => {
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

    res.json(result.rows);

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: err.message
    });
  }
});

app.post("/water-update", async(req,res)=>{

    const { rate, houses } = req.body;

    const client = await pool.connect();

    try{

        await client.query("BEGIN");

        for(const house of houses){

            const previous =
                Number(house.previousReading);

            const current =
                Number(house.currentReading);

            if(current < previous){

                throw new Error(
                    `Current reading for ${house.houseNo} cannot be less than previous reading.`
                );

            }

            const usage =
                current - previous;

            const bill =
                usage * Number(rate);

            await client.query(

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

        }

        await client.query("COMMIT");

        res.json({
            success:true
        });

    }

    catch(err){

        await client.query("ROLLBACK");

        console.error(err);

        res.status(500).json({
            error:err.message
        });

    }

    finally{

        client.release();

    }

});

app.get("/searchWaterByHouse/:houseNo", async (req, res) => {
  const { houseNo } = req.params;

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
      `,
      [`%${houseNo}%`]
    );

    res.json(result.rows);

  } catch (err) {

    console.error(err);
    res.status(500).json({ error: err.message });

  }
});

app.get("/waterRecord/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT
        id,
        houseid,
        previousreading,
        currentreading,
        readingmonth
      FROM waterReadings
      WHERE id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Record not found" });
    }

    res.json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.put("/edit-water", async (req, res) => {
  const { id, houseId, currentReading, rate } = req.body;

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

    await client.query(
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
      `,
      [current, r, usage, bill, id, houseId]
    );

    await client.query("COMMIT");

    res.json({
      success: true,
      message: "Water record updated successfully",
      data: { usage, bill }
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
});

app.get("/searchInvoiceByName/:name", async (req, res) => {

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

});

app.post("/createInvoiceCorrection", async (req, res) => {

    const {
        invoiceId,
        tenantId,
        amount,
        reason,
        correctionType
    } = req.body;

    const client = await pool.connect();

    try {

        await client.query("BEGIN");

        await client.query(
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
            `,
            [
                invoiceId,
                tenantId,
                amount,
                reason,
                correctionType
            ]
        );

        await client.query("COMMIT");

        res.json({
            success: true,
            message: "Invoice correction created."
        });

    }
    catch(err){

        await client.query("ROLLBACK");

        console.error(err);

        res.status(500).json({
            success:false,
            error:err.message
        });

    }
    finally{

        client.release();

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