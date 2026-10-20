import sqlite3

db = sqlite3.connect("data/youpi_pg.sqlite")
rows = db.execute(
    "SELECT id, business_name FROM merchants"
).fetchall()

print("Merchant records:")
for merchant_id, business_name in rows:
    print(f"Merchant ID: {merchant_id} | Business: {business_name}")

db.close()
