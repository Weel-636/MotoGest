// ==========================================
// PAGOS.JS
// Sistema de Gestión de Venta de Motos
// ==========================================

let clientePago = 0;


// ==========================================
// ABRIR MODAL DE PAGO
// ==========================================

function abrirPago(id,nombre,saldo){

    clientePago=id;

    document.getElementById(
        "modalPago"
    ).style.display="flex";

    document.getElementById(
        "nombrePago"
    ).innerHTML=nombre;

    document.getElementById(
        "saldoActual"
    ).innerHTML="Bs. "+saldo;

    document.getElementById(
        "montoPago"
    ).value="";

}



// ==========================================
// CERRAR MODAL
// ==========================================

function cerrarPago(){

    document.getElementById(
        "modalPago"
    ).style.display="none";

}



// ==========================================
// REGISTRAR PAGO
// ==========================================

async function guardarPago(){

    let monto =
    parseFloat(

        document.getElementById(
            "montoPago"
        ).value

    );

    if(isNaN(monto) || monto<=0){

        alert(
            "Ingrese un monto válido."
        );

        return;

    }

    let fecha =
    new Date().toLocaleDateString();

    await fetch(

        API+"/pagos",

        {

            method:"POST",

            headers:{

                "Content-Type":"application/json"

            },

            body:JSON.stringify({

                cliente_id:clientePago,

                monto:monto,

                fecha:fecha

            })

        }

    );

    cerrarPago();

    await cargarClientes();

    await actualizarDashboard();

}
// ==========================================
// VER HISTORIAL DE PAGOS
// ==========================================

async function verHistorial(cliente_id,nombre){

    document.getElementById(
        "modalHistorial"
    ).style.display="flex";

    document.getElementById(
        "tituloHistorial"
    ).innerHTML=
    "Historial de Pagos - "+nombre;

    let respuesta=
    await fetch(
        API+"/pagos/"+cliente_id
    );

    let pagos=
    await respuesta.json();

    let tabla=
    document.getElementById(
        "tablaHistorial"
    );

    tabla.innerHTML="";

    let total=0;

    if(pagos.length==0){

        tabla.innerHTML=`

        <tr>

            <td colspan="3">

                No existen pagos registrados.

            </td>

        </tr>

        `;

    }

    pagos.forEach(pago=>{

        total+=Number(pago.monto);

        tabla.innerHTML+=`

        <tr>

            <td>

                ${pago.fecha}

            </td>

            <td>

                Bs. ${Number(pago.monto).toFixed(2)}

            </td>

            <td>

                <button

                class="eliminar"

                onclick="eliminarPago(${pago.id},${cliente_id},'${nombre}')"

                >

                🗑

                </button>

            </td>

        </tr>

        `;

    });

    document.getElementById(
        "totalPagado"
    ).innerHTML=
    "Bs. "+total.toFixed(2);

}



// ==========================================
// CERRAR HISTORIAL
// ==========================================

function cerrarHistorial(){

    document.getElementById(
        "modalHistorial"
    ).style.display="none";

}



// ==========================================
// ELIMINAR PAGO
// ==========================================

async function eliminarPago(id,cliente,nombre){

    let opcion=
    confirm(
        "¿Desea eliminar este pago?"
    );

    if(!opcion){

        return;

    }

    await fetch(

        API+"/pagos/"+id,

        {

            method:"DELETE"

        }

    );

    await cargarClientes();

    await actualizarDashboard();

    verHistorial(

        cliente,

        nombre

    );

}
// ==========================================
// OBTENER ESTADO DEL CLIENTE
// ==========================================

function obtenerEstado(cliente){

    let saldo = Number(cliente.saldo);

    if(saldo <= 0){

        return "<span class='estado pagado'>🟢 Pagado</span>";

    }

    if(cliente.proximo_pago=="Pendiente"){

        return "<span class='estado activo'>🟢 Al día</span>";

    }

    let hoy = new Date();

    let fechaPago = new Date(cliente.proximo_pago);

    if(fechaPago < hoy){

        return "<span class='estado atrasado'>🔴 Atrasado</span>";

    }

    return "<span class='estado activo'>🟢 Al día</span>";

}



// ==========================================
// CALCULAR PRÓXIMO PAGO
// ==========================================

function calcularProximoPago(modalidad){

    let fecha = new Date();

    switch(modalidad){

        case "Diario":

            fecha.setDate(
                fecha.getDate()+1
            );

        break;

        case "Semanal":

            fecha.setDate(
                fecha.getDate()+7
            );

        break;

        case "Mensual":

            fecha.setMonth(
                fecha.getMonth()+1
            );

        break;

    }

    return fecha.toISOString().split("T")[0];

}



// ==========================================
// FORMATO MONEDA
// ==========================================

function formatoBs(numero){

    return "Bs. " +

    Number(numero)

    .toLocaleString(

        "es-BO",

        {

            minimumFractionDigits:2,

            maximumFractionDigits:2

        }

    );

}