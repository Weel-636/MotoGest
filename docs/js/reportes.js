// ==========================================
// REPORTES.JS
// Sistema de Gestión de Venta de Motos
// ==========================================


// ==========================================
// ABRIR REPORTES
// ==========================================

async function abrirReportes(){

    document.getElementById(
        "modalReportes"
    ).style.display="flex";

    await cargarReportes();

}



// ==========================================
// CERRAR REPORTES
// ==========================================

function cerrarReportes(){

    document.getElementById(
        "modalReportes"
    ).style.display="none";

}



// ==========================================
// CARGAR REPORTES
// ==========================================

async function cargarReportes(){

    const respuesta =
    await fetch(
        API+"/clientes"
    );

    const clientes =
    await respuesta.json();

    let contado = 0;

    let credito = 0;

    let vendido = 0;

    let cobrado = 0;

    let pendiente = 0;

    let pagados = 0;

    let activos = 0;


    clientes.forEach(cliente=>{

        let total =
        Number(cliente.total);

        let saldo =
        Number(cliente.saldo);

        vendido += total;

        pendiente += saldo;

        cobrado += total-saldo;

        if(cliente.tipo=="Contado"){

            contado++;

        }

        else{

            credito++;

        }

        if(saldo<=0){

            pagados++;

        }

        else{

            activos++;

        }

    });


    document.getElementById(
        "rClientes"
    ).innerHTML =
    clientes.length;

    document.getElementById(
        "rContado"
    ).innerHTML =
    contado;

    document.getElementById(
        "rCredito"
    ).innerHTML =
    credito;

    document.getElementById(
        "rCobrado"
    ).innerHTML =
    formatoBs(
        cobrado
    );

    document.getElementById(
        "rPendiente"
    ).innerHTML =
    formatoBs(
        pendiente
    );

}
// ==========================================
// EXPORTAR REPORTE A PDF
// ==========================================

function exportarPDF(){

    window.print();

}



// ==========================================
// EXPORTAR REPORTE A EXCEL
// ==========================================

function exportarExcel(){

    let tabla = `
    <table border="1">

        <tr>

            <th>Dato</th>

            <th>Valor</th>

        </tr>

        <tr>

            <td>Clientes Registrados</td>

            <td>${document.getElementById("rClientes").innerHTML}</td>

        </tr>

        <tr>

            <td>Ventas Contado</td>

            <td>${document.getElementById("rContado").innerHTML}</td>

        </tr>

        <tr>

            <td>Ventas Crédito</td>

            <td>${document.getElementById("rCredito").innerHTML}</td>

        </tr>

        <tr>

            <td>Total Cobrado</td>

            <td>${document.getElementById("rCobrado").innerHTML}</td>

        </tr>

        <tr>

            <td>Saldo Pendiente</td>

            <td>${document.getElementById("rPendiente").innerHTML}</td>

        </tr>

    </table>
    `;

    let archivo = new Blob(

        [tabla],

        {

            type:"application/vnd.ms-excel"

        }

    );

    let enlace = document.createElement("a");

    enlace.href = URL.createObjectURL(archivo);

    enlace.download = "Reporte.xls";

    enlace.click();

}