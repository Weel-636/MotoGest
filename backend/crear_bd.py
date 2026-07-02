from database import conectar

conexion = conectar()
cursor = conexion.cursor()

# ==========================
# TABLA CLIENTES
# ==========================

cursor.execute("""
CREATE TABLE IF NOT EXISTS clientes(

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    nombre TEXT NOT NULL,

    carnet TEXT,

    moto TEXT,

    tipo TEXT,

    modalidad TEXT,

    total REAL,

    inicial REAL,

    saldo REAL,

    fecha TEXT,

    proximo_pago TEXT
)
""")

# ==========================
# TABLA PAGOS
# ==========================

cursor.execute("""
CREATE TABLE IF NOT EXISTS pagos(

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    cliente_id INTEGER,

    fecha TEXT,

    monto REAL,

    FOREIGN KEY(cliente_id)
    REFERENCES clientes(id)

)
""")

conexion.commit()
conexion.close()

print("Base de datos creada correctamente.")