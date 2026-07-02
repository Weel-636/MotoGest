// ==========================================
// DASHBOARD.JS
// Sistema de Gestión de Venta de Motos
// ==========================================


// ==========================================
// CARGAR DASHBOARD
// ==========================================

async function cargarDashboard(){

    const respuesta =
    await fetch(
        API + "/clientes"
    );

    const clientes =
    await respuesta.json();

    let totalClientes = clientes.length;

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

        cobrado += total - saldo;

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
        "totalClientes"
    ).innerHTML =
    totalClientes;

    document.getElementById(
        "totalContado"
    ).innerHTML =
    contado;

    document.getElementById(
        "totalCredito"
    ).innerHTML =
    credito;

    document.getElementById(
        "saldoPendiente"
    ).innerHTML =
    formatoBs(
        pendiente
    );

}