from database import conectar


# ===========================================
# OBTENER TODOS LOS CLIENTES
# ===========================================

def obtener_clientes():

    conexion = conectar()
    cursor = conexion.cursor()

    cursor.execute("""
        SELECT *
        FROM clientes
        ORDER BY id DESC
    """)

    clientes = cursor.fetchall()

    conexion.close()

    return clientes


# ===========================================
# OBTENER CLIENTE POR ID
# ===========================================

def obtener_cliente(id):

    conexion = conectar()
    cursor = conexion.cursor()

    cursor.execute("""
        SELECT *
        FROM clientes
        WHERE id=?
    """, (id,))

    cliente = cursor.fetchone()

    conexion.close()

    return cliente


# ===========================================
# INSERTAR CLIENTE
# ===========================================

def insertar_cliente(datos):

    conexion = conectar()
    cursor = conexion.cursor()

    cursor.execute("""
        INSERT INTO clientes(

            nombre,
            carnet,
            moto,
            tipo,
            modalidad,
            total,
            inicial,
            saldo,
            fecha,
            proximo_pago

        )

        VALUES(?,?,?,?,?,?,?,?,?,?)

    """, (

        datos["nombre"],
        datos["carnet"],
        datos["moto"],
        datos["tipo"],
        datos["modalidad"],
        datos["total"],
        datos["inicial"],
        datos["saldo"],
        datos["fecha"],
        datos["proximo_pago"]

    ))

    conexion.commit()
    conexion.close()


# ===========================================
# ACTUALIZAR CLIENTE
# ===========================================

def actualizar_cliente(id, datos):

    conexion = conectar()
    cursor = conexion.cursor()

    cursor.execute("""
        UPDATE clientes
        SET

            nombre=?,
            carnet=?,
            moto=?,
            tipo=?,
            modalidad=?,
            total=?,
            inicial=?,
            saldo=?,
            fecha=?,
            proximo_pago=?

        WHERE id=?

    """, (

        datos["nombre"],
        datos["carnet"],
        datos["moto"],
        datos["tipo"],
        datos["modalidad"],
        datos["total"],
        datos["inicial"],
        datos["saldo"],
        datos["fecha"],
        datos["proximo_pago"],
        id

    ))

    conexion.commit()
    conexion.close()


# ===========================================
# ELIMINAR CLIENTE
# ===========================================

def eliminar_cliente(id):

    conexion = conectar()
    cursor = conexion.cursor()

    cursor.execute("""
        DELETE FROM clientes
        WHERE id=?
    """, (id,))

    conexion.commit()
    conexion.close()


# ===========================================
# BUSCAR CLIENTES
# ===========================================

def buscar_clientes(texto):

    conexion = conectar()
    cursor = conexion.cursor()

    cursor.execute("""

        SELECT *

        FROM clientes

        WHERE

            nombre LIKE ?
            OR carnet LIKE ?
            OR moto LIKE ?

        ORDER BY id DESC

    """, (

        f"%{texto}%",
        f"%{texto}%",
        f"%{texto}%"

    ))

    clientes = cursor.fetchall()

    conexion.close()

    return clientes