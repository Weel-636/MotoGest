from flask import Flask
from flask_cors import CORS

# Importar rutas
from routers.clientes import clientes_bp
from routers.pagos import pagos_bp

# ======================================
# CREAR APLICACIÓN
# ======================================

app = Flask(__name__)

# Permitir conexiones desde el frontend
CORS(app)

# ======================================
# REGISTRAR RUTAS
# ======================================

app.register_blueprint(clientes_bp)
app.register_blueprint(pagos_bp)

# ======================================
# RUTA PRINCIPAL
# ======================================

@app.route("/")
def inicio():

    return {
        "mensaje": "API Sistema de Venta de Motos funcionando correctamente"
    }

# ======================================
# INICIAR SERVIDOR
# ======================================

if __name__ == "__main__":

    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )