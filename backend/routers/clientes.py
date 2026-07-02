from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta

from models.cliente_model import (
    obtener_clientes,
    obtener_cliente,
    insertar_cliente,
    actualizar_cliente,
    eliminar_cliente,
    buscar_clientes
)

clientes_bp = Blueprint("clientes", __name__)


# ======================================
# OBTENER TODOS LOS CLIENTES
# ======================================

@clientes_bp.route("/clientes", methods=["GET"])
def listar_clientes():

    clientes = obtener_clientes()

    lista = []

    for cliente in clientes:

        lista.append({

            "id": cliente["id"],
            "nombre": cliente["nombre"],
            "carnet": cliente["carnet"],
            "moto": cliente["moto"],
            "tipo": cliente["tipo"],
            "modalidad": cliente["modalidad"],
            "total": cliente["total"],
            "inicial": cliente["inicial"],
            "saldo": cliente["saldo"],
            "fecha": cliente["fecha"],
            "proximo_pago": cliente["proximo_pago"]

        })

    return jsonify(lista)


# ======================================
# OBTENER UN CLIENTE
# ======================================

@clientes_bp.route("/clientes/<int:id>", methods=["GET"])
def obtener(id):

    cliente = obtener_cliente(id)

    if cliente is None:

        return jsonify({
            "mensaje":"Cliente no encontrado"
        }),404

    return jsonify({

        "id":cliente["id"],
        "nombre":cliente["nombre"],
        "carnet":cliente["carnet"],
        "moto":cliente["moto"],
        "tipo":cliente["tipo"],
        "modalidad":cliente["modalidad"],
        "total":cliente["total"],
        "inicial":cliente["inicial"],
        "saldo":cliente["saldo"],
        "fecha":cliente["fecha"],
        "proximo_pago":cliente["proximo_pago"]

    })


# ======================================
# INSERTAR CLIENTE
# ======================================

@clientes_bp.route("/clientes", methods=["POST"])
def guardar():

    datos = request.json

    # ==========================
    # CALCULAR PRÓXIMO PAGO
    # ==========================

    if datos["tipo"] == "Contado":

        datos["proximo_pago"] = "Pagado"

    else:

        hoy = datetime.now()

        if datos["modalidad"] == "Diario":

            proximo = hoy + timedelta(days=1)

        elif datos["modalidad"] == "Semanal":

            proximo = hoy + timedelta(days=7)

        elif datos["modalidad"] == "Mensual":

            # Aproximadamente 30 días
            proximo = hoy + timedelta(days=30)

        else:

            proximo = hoy

        datos["proximo_pago"] = proximo.strftime("%d/%m/%Y")

    insertar_cliente(datos)

    return jsonify({

        "mensaje":"Cliente registrado correctamente"

    })

# ======================================
# ACTUALIZAR CLIENTE
# ======================================

@clientes_bp.route("/clientes/<int:id>", methods=["PUT"])
def editar(id):

    datos = request.json

    actualizar_cliente(id, datos)

    return jsonify({

        "mensaje":"Cliente actualizado"

    })


# ======================================
# ELIMINAR CLIENTE
# ======================================

@clientes_bp.route("/clientes/<int:id>", methods=["DELETE"])
def eliminar(id):

    eliminar_cliente(id)

    return jsonify({

        "mensaje":"Cliente eliminado"

    })


# ======================================
# BUSCAR CLIENTES
# ======================================

@clientes_bp.route("/buscar/<texto>", methods=["GET"])
def buscar(texto):

    clientes = buscar_clientes(texto)

    lista = []

    for cliente in clientes:

        lista.append({

            "id":cliente["id"],
            "nombre":cliente["nombre"],
            "carnet":cliente["carnet"],
            "moto":cliente["moto"],
            "tipo":cliente["tipo"],
            "modalidad":cliente["modalidad"],
            "total":cliente["total"],
            "inicial":cliente["inicial"],
            "saldo":cliente["saldo"],
            "fecha":cliente["fecha"],
            "proximo_pago":cliente["proximo_pago"]

        })

    return jsonify(lista)