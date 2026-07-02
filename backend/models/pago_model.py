from database import conectar
import sqlite3
from datetime import datetime, timedelta


# ======================================
# REGISTRAR PAGO
# ======================================

def registrar_pago(cliente_id, monto, fecha):

    conexion = conectar()

    cursor = conexion.cursor()
    
    cursor.execute("""
    INSERT INTO pagos(
        cliente_id,
        monto,
        fecha
    )
    VALUES(?,?,?)
    """,(
        cliente_id,
        monto,
        fecha
    ))

    # ======================================
    # OBTENER DATOS DEL CLIENTE
    # ======================================

    cursor.execute("""
    SELECT saldo, modalidad, proximo_pago
    FROM clientes
    WHERE id=?
    """,(
        cliente_id,
    ))

    fila = cursor.fetchone()

    saldo_actual = fila[0]
    modalidad = fila[1]
    proximo_pago = fila[2]

    # ======================================
    # CALCULAR NUEVO SALDO
    # ======================================

    nuevo_saldo = saldo_actual - monto

    if nuevo_saldo < 0:
        nuevo_saldo = 0

    # ======================================
    # CALCULAR PRÓXIMO PAGO
    # ======================================

    if nuevo_saldo == 0:

        nueva_fecha = "Pagado"

    else:

        try:

            if proximo_pago in ("Pendiente", "Pagado", "", None):

                fecha_base = datetime.now()

            else:

                fecha_base = datetime.strptime(
                    proximo_pago,
                    "%d/%m/%Y"
                )

        except:

            fecha_base = datetime.now()

        if modalidad == "Diario":

            fecha_base += timedelta(days=1)

        elif modalidad == "Semanal":

            fecha_base += timedelta(days=7)

        elif modalidad == "Mensual":

            fecha_base += timedelta(days=30)

        nueva_fecha = fecha_base.strftime("%d/%m/%Y")

    # ======================================
    # ACTUALIZAR CLIENTE
    # ======================================

    cursor.execute("""
    UPDATE clientes
    SET

        saldo=?,
        proximo_pago=?

    WHERE id=?
    """,(
        nuevo_saldo,
        nueva_fecha,
        cliente_id
    ))

    conexion.commit()

    conexion.close()

# ======================================
# HISTORIAL
# ======================================

def obtener_pagos(cliente_id):

    conexion = conectar()

    conexion.row_factory = sqlite3.Row

    cursor = conexion.cursor()

    cursor.execute("""
    SELECT *
    FROM pagos
    WHERE cliente_id=?
    ORDER BY id DESC
    """,(
        cliente_id,
    ))

    datos = cursor.fetchall()

    conexion.close()

    return datos


# ======================================
# TOTAL PAGADO
# ======================================

def total_pagado(cliente_id):

    conexion = conectar()

    cursor = conexion.cursor()

    cursor.execute("""
    SELECT SUM(monto)
    FROM pagos
    WHERE cliente_id=?
    """,(
        cliente_id,
    ))

    total = cursor.fetchone()[0]

    conexion.close()

    if total is None:

        return 0

    return total


# ======================================
# ELIMINAR PAGO
# ======================================

def eliminar_pago(id):

    conexion = conectar()

    cursor = conexion.cursor()

    cursor.execute("""
    SELECT cliente_id,monto
    FROM pagos
    WHERE id=?
    """,(
        id,
    ))

    pago = cursor.fetchone()

    if pago:

        cliente = pago[0]

        monto = pago[1]

        cursor.execute("""
        UPDATE clientes
        SET saldo = saldo + ?
        WHERE id=?
        """,(
            monto,
            cliente
        ))

        cursor.execute("""
        DELETE FROM pagos
        WHERE id=?
        """,(
            id,
        ))

    conexion.commit()

    conexion.close()