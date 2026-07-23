from pathlib import Path
import pandas as pd

BASE_DIR = Path(__file__).parent

excel_file = BASE_DIR / "tenants.xlsx"
output_file = BASE_DIR / "migration.sql"

df = pd.read_excel(excel_file)

sql = ""

for _, row in df.iterrows():

    # Read values
    name = str(row["Name"]).replace("'", "''")
    house = str(row["House No"]).replace("'", "''")

    rent = float(row["Rent"])
    garbage = float(row["Garbage"])
    balance = float(row["Opening Balance"])

    previous = int(row["Previous Water Reading"])
    current = int(row["Current Water Reading"])
    usage = current - previous

    # Split phone numbers
    phones = [
        p.strip()
        for p in str(row["Phone Numbers"]).split("/")
        if p.strip()
    ]

    primary_phone = phones[0].replace("'", "''")

    # Generate phone CTEs
    phone_ctes = ""

    for i, phone in enumerate(phones[1:], start=1):
        phone = phone.replace("'", "''")

        phone_ctes += f""",

phone_{i} AS (
    INSERT INTO phoneList (
        tenantid,
        phone
    )
    SELECT
        id,
        '{phone}'
    FROM new_tenant
)
"""

    # Opening balance CTE
    opening_balance = ""

    if balance != 0:
        opening_balance = f""",

opening_balance AS (
    INSERT INTO chargeList (
        tenantid,
        chargetype,
        chargeamount
    )
    SELECT
        id,
        'Opening Balance',
        {balance}
    FROM new_tenant
)
"""

    sql += f"""
BEGIN;

WITH

new_house AS (
    INSERT INTO houseList (
        houseno,
        rent,
        garbage
    )
    VALUES (
        '{house}',
        {rent},
        {garbage}
    )
    RETURNING houseid
),

new_tenant AS (
    INSERT INTO tenantList (
        name,
        phone,
        houseid
    )
    SELECT
        '{name}',
        '{primary_phone}',
        houseid
    FROM new_house
    RETURNING id, houseid
)
{phone_ctes}
{opening_balance},

initial_water AS (
    INSERT INTO waterReadings (
        houseid,
        readingmonth,
        previousreading,
        currentreading,
        usage,
        rate,
        bill
    )
    SELECT
        houseid,
        CURRENT_DATE,
        {previous},
        {current},
        {usage},
        0,
        0
    FROM new_tenant
)

SELECT 1;

COMMIT;

"""

with open(output_file, "w", encoding="utf-8") as f:
    f.write(sql)

print(f"Generated {output_file}")