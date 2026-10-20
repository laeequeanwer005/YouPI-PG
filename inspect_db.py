import sqlite3

db = sqlite3.connect("data/youpi_pg.sqlite")
tables = db.execute(
    "SELECT name FROM sqlite_master WHERE type = 'table'"
).fetchall()

print("Database tables:")
for table in tables:
    print("-", table[0])

db.close()
