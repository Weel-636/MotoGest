from flask import Blueprint, request, jsonify

from models.pago_model import (
    registrar_pago,
    obtener_pagos,
    total_pagado,
    eliminar_pago
)

pagos_bp = Blueprint(
    "pagos",
    __name__
)

# ======================================
# REGISTRAR PAGO
# ======================================

@pagos_bp.route(
    "/pagos",
    methods=["POST"]
)
def guardar_pago():

    datos = request.json

    registrar_pago(

        datos["cliente_id"],

        float(datos["monto"]),

        datos["fecha"]

    )

    return jsonify({

        "mensaje":"Pago registrado correctamente"

    })


# ======================================
# OBTENER HISTORIAL
# ======================================

@pagos_bp.route(
    "/pagos/<int:cliente_id>",
    methods=["GET"]
)
def historial(cliente_id):

    pagos = obtener_pagos(cliente_id)

    lista = []

    for pago in pagos:

        lista.append({

            "id": pago["id"],

            "cliente_id": pago["cliente_id"],

            "monto": pago["monto"],

            "fecha": pago["fecha"]

        })

    return jsonify(lista)


# ======================================
# TOTAL PAGADO
# ======================================

@pagos_bp.route(
    "/pagos/total/<int:cliente_id>",
    methods=["GET"]
)
def total(cliente_id):

    return jsonify({

        "total": total_pagado(cliente_id)

    })


# ======================================
# ELIMINAR PAGO
# ======================================

@pagos_bp.route(
    "/pagos/<int:id>",
    methods=["DELETE"]
)
def borrar_pago(id):

    eliminar_pago(id)

    return jsonify({

        "mensaje":"Pago eliminado"

    })