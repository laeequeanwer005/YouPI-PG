import sqlite3

db = sqlite3.connect("data/youpi_pg.sqlite")
for row in db.execute("PRAGMA table_info(merchants)"):
    print(row[1])
db.close()
