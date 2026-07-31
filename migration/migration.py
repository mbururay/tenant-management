from pathlib import Path
import pandas as pd

BASE_DIR = Path(__file__).parent

excel_file = BASE_DIR / "tenants.xlsx"
output_file = BASE_DIR / "migration.sql"

df = pd.read_excel(excel_file)

sql = ""

for _, row in df.iterrows():

    name = str(row["Name"]).replace("'", "''")
    house = str(row["House No"]).replace("'", "''")

    rent = float(row["Rent"])
    garbage = float(row["Garbage"])
    opening_balance = float(row["Opening Balance"])

    previous = int(row["Previous Water Reading"])
    current = int(row["Current Water Reading"])
    usage = current - previous

    phones = [
        p.strip()
        for p in str(row["Phone Numbers"]).split("/")
        if p.strip()
    ]

    primary_phone = phones[0].replace("'", "''")

    phone_ctes = ""

    for i, phone in enumerate(phones[1:], start=1):

        phone = phone.replace("'", "''")

        phone_ctes += f""",

phone_{i} AS (
    INSERT INTO phoneList (
        tenantId,
        phone
    )
    SELECT
        id,
        '{phone}'
    FROM new_tenant
)
"""

    opening_balance_cte = ""

    if opening_balance != 0:

        opening_balance_cte = f""",

opening_balance_charge AS (

    INSERT INTO chargeList (
        tenantId,
        chargeType,
        chargeAmount,
        chargeDate
    )

    SELECT
        id,
        'Opening Balance',
        {opening_balance},
        CURRENT_DATE

    FROM new_tenant

)
"""

    sql += f"""
BEGIN;

WITH

new_house AS (

    INSERT INTO houseList (
        houseNo,
        rent,
        garbage
    )

    VALUES (
        '{house}',
        {rent},
        {garbage}
    )

    RETURNING houseId

),

new_tenant AS (

    INSERT INTO tenantList (
        name,
        phone,
        houseId
    )

    SELECT
        '{name}',
        '{primary_phone}',
        houseId

    FROM new_house

    RETURNING id, houseId

)
{phone_ctes}
{opening_balance_cte},

initial_water AS (

    INSERT INTO waterReadings (
        houseId,
        readingMonth,
        previousReading,
        currentReading,
        usage,
        rate,
        bill,
        isOpening
    )

    SELECT
        houseId,
        CURRENT_DATE,
        {previous},
        {current},
        {usage},
        0,
        0,
        TRUE

    FROM new_tenant

)

SELECT 1;

COMMIT;

"""

with open(output_file, "w", encoding="utf-8") as f:
    f.write(sql)

print(f"Generated {output_file}")