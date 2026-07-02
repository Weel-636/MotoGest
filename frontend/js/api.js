// ======================================
// CONFIGURACIÓN API
// ======================================

const API = "http://127.0.0.1:5000";


// ======================================
// ABRIR MODAL
// ======================================

function abrirModal(){

    document.getElementById(
        "modal"
    ).style.display = "flex";

}


// ======================================
// CERRAR MODAL
// ======================================

function cerrarModal(){

    document.getElementById("modal").style.display = "none";

    document.getElementById("modal").dataset.id = "";

    limpiarFormulario();

}

// ======================================
// LIMPIAR FORMULARIO
// ======================================

function limpiarFormulario(){

    document.getElementById("nombre").value = "";

    document.getElementById("carnet").value = "";

    document.getElementById("moto").value = "";

    document.getElementById("tipo").value = "Contado";

    document.getElementById("total").value = "";

    document.getElementById("inicial").value = "";

    document.getElementById("modalidad").value = "Diario";

}


// ======================================
// MOSTRAR CAMPOS SEGÚN TIPO
// ======================================

document.getElementById(
    "tipo"
).addEventListener("change", function(){

    if(this.value == "Contado"){

        document.getElementById(
            "modalidad"
        ).disabled = true;

        document.getElementById(
            "inicial"
        ).disabled = true;

    }

    else{

        document.getElementById(
            "modalidad"
        ).disabled = false;

        document.getElementById(
            "inicial"
        ).disabled = false;

    }

});


// ======================================
// AL CARGAR LA PÁGINA
// ======================================

window.onload = function(){

    document.getElementById(
        "modalidad"
    ).disabled = true;

    document.getElementById(
        "inicial"
    ).disabled = true;

}