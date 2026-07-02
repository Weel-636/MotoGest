// ==========================================
// CLIENTES.JS
// Sistema de Gestión de Venta de Motos
// ==========================================

let editando = false;
let idEditar = 0;

// ==========================================
// CARGAR CLIENTES
// ==========================================

async function cargarClientes(){

    const respuesta = await fetch(API + "/clientes");

    const clientes = await respuesta.json();

    let tabla = document.getElementById("tablaClientes");

    tabla.innerHTML = "";

    let contado = 0;
    let credito = 0;
    let saldoTotal = 0;

    clientes.forEach(cliente=>{

        if(cliente.tipo=="Contado"){

            contado++;

        }else{

            credito++;

        }

        saldoTotal += Number(cliente.saldo);

        let estado = obtenerEstado(cliente);

        tabla.innerHTML += `

        <tr>

            <td>${cliente.id}</td>

            <td>${cliente.nombre}</td>

            <td>${cliente.carnet}</td>

            <td>${cliente.moto}</td>

            <td>${cliente.tipo}</td>

            <td>${cliente.modalidad}</td>

            <td>${cliente.proximo_pago}</td>

            <td>Bs. ${Number(cliente.saldo).toFixed(2)}</td>

            <td>${estado}</td>

            <td>

                <button
                class="editar"
                onclick="editarCliente(${cliente.id})">
                ✏️
                </button>

                <button
                class="pagar"
                onclick="abrirPago(
                    ${cliente.id},
                    '${cliente.nombre}',
                    ${cliente.saldo}
                )">
                💳
                </button>

                <button
                class="historial"
                onclick="verHistorial(
                    ${cliente.id},
                    '${cliente.nombre}'
                )">
                📜
                </button>

                <button
                class="eliminar"
                onclick="eliminarCliente(${cliente.id})">
                🗑
                </button>

            </td>

        </tr>

        `;

    });

    document.getElementById("totalClientes").innerHTML =
    clientes.length;

    document.getElementById("totalContado").innerHTML =
    contado;

    document.getElementById("totalCredito").innerHTML =
    credito;

    document.getElementById("saldoPendiente").innerHTML =
    "Bs. " + saldoTotal.toFixed(2);

}
// ==========================================
// GUARDAR CLIENTE
// ==========================================

async function guardarCliente(){

    let nombre =
    document.getElementById(
        "nombre"
    ).value.trim();

    let carnet =
    document.getElementById(
        "carnet"
    ).value.trim();

    let moto =
    document.getElementById(
        "moto"
    ).value.trim();

    let tipo =
    document.getElementById(
        "tipo"
    ).value;

    let total =
    parseFloat(
        document.getElementById(
            "total"
        ).value
    );

    let inicial =
    parseFloat(
        document.getElementById(
            "inicial"
        ).value
    );

    let modalidad =
    document.getElementById(
        "modalidad"
    ).value;


    // ============================
    // VALIDACIONES
    // ============================

    if(nombre==""){

        alert("Ingrese el nombre.");

        return;

    }

    if(carnet==""){

        alert("Ingrese el carnet.");

        return;

    }

    if(moto==""){

        alert("Ingrese la motocicleta.");

        return;

    }

    if(isNaN(total) || total<=0){

        alert("Ingrese el monto total.");

        return;

    }


    if(tipo=="Contado"){

        modalidad="-";

        inicial=total;

    }

    else{

        if(isNaN(inicial)){

            inicial=0;

        }

    }


    let datos={

        nombre:nombre,

        carnet:carnet,

        moto:moto,

        tipo:tipo,

        modalidad:modalidad,

        total:total,

        inicial:inicial,

        saldo:total-inicial,

        fecha:new Date().toLocaleDateString(),

        proximo_pago:""

    };


    // ============================
    // EDITAR
    // ============================

    if(editando){

        await fetch(

            API+"/clientes/"+idEditar,

            {

                method:"PUT",

                headers:{

                    "Content-Type":"application/json"

                },

                body:JSON.stringify(datos)

            }

        );

        editando=false;

        idEditar=0;

    }

    // ============================
    // NUEVO
    // ============================

    else{

        await fetch(

            API+"/clientes",

            {

                method:"POST",

                headers:{

                    "Content-Type":"application/json"

                },

                body:JSON.stringify(datos)

            }

        );

    }

    cerrarModal();

    cargarClientes();

}
// ==========================================
// EDITAR CLIENTE
// ==========================================

async function editarCliente(id){

    const respuesta =
    await fetch(
        API + "/clientes/" + id
    );

    const cliente =
    await respuesta.json();

    document.getElementById(
        "nombre"
    ).value = cliente.nombre;

    document.getElementById(
        "carnet"
    ).value = cliente.carnet;

    document.getElementById(
        "moto"
    ).value = cliente.moto;

    document.getElementById(
        "tipo"
    ).value = cliente.tipo;

    document.getElementById(
        "total"
    ).value = cliente.total;

    document.getElementById(
        "inicial"
    ).value = cliente.inicial;

    document.getElementById(
        "modalidad"
    ).value = cliente.modalidad;

    editando = true;

    idEditar = id;

    abrirModal();

}



// ==========================================
// ELIMINAR CLIENTE
// ==========================================

async function eliminarCliente(id){

    let opcion =
    confirm(
        "¿Desea eliminar este cliente?"
    );

    if(!opcion){

        return;

    }

    await fetch(

        API + "/clientes/" + id,

        {

            method:"DELETE"

        }

    );

    cargarClientes();

}



// ==========================================
// BUSCAR CLIENTE
// ==========================================

async function buscarCliente(){

    let texto =
    document.getElementById("buscar")
    .value
    .toLowerCase()
    .trim();

    const respuesta =
    await fetch(API + "/clientes");

    const clientes =
    await respuesta.json();

    let tabla =
    document.getElementById("tablaClientes");

    tabla.innerHTML = "";

    clientes.forEach(cliente=>{

        let datos = (

            cliente.nombre + " " +
            cliente.carnet + " " +
            cliente.moto

        ).toLowerCase();

        if(
            texto=="" ||
            datos.includes(texto)
        ){

            let estado =
            obtenerEstado(cliente);

            tabla.innerHTML += `

            <tr>

                <td>${cliente.id}</td>

                <td>${cliente.nombre}</td>

                <td>${cliente.carnet}</td>

                <td>${cliente.moto}</td>

                <td>${cliente.tipo}</td>

                <td>${cliente.modalidad}</td>

                <td>${cliente.proximo_pago}</td>

                <td>
                    Bs. ${Number(cliente.saldo).toFixed(2)}
                </td>

                <td>

                    ${estado}

                </td>

                <td>

                    <button
                    class="editar"
                    onclick="editarCliente(${cliente.id})"
                    >

                    ✏️

                    </button>

                    <button
                    class="pagar"
                    onclick="abrirPago(
                        ${cliente.id},
                        '${cliente.nombre}',
                        ${cliente.saldo}
                    )"
                    >

                    💳

                    </button>

                    <button
                    class="historial"
                    onclick="verHistorial(
                        ${cliente.id},
                        '${cliente.nombre}'
                    )"
                    >

                    📜

                    </button>

                    <button
                    class="eliminar"
                    onclick="eliminarCliente(${cliente.id})"
                    >

                    🗑

                    </button>

                </td>

            </tr>

            `;

        }

    });

}
// ==========================================
// LIMPIAR FORMULARIO
// ==========================================

function limpiarFormulario(){

    document.getElementById("nombre").value = "";

    document.getElementById("carnet").value = "";

    document.getElementById("moto").value = "";

    document.getElementById("tipo").value = "Contado";

    document.getElementById("total").value = "";

    document.getElementById("inicial").value = "";

    document.getElementById("modalidad").value = "Diario";

}


// ==========================================
// RECARGAR TODO
// ==========================================

async function recargarSistema(){

    await cargarClientes();

    await cargarDashboard();

    await cargarDashboardClientes();
}



// ==========================================
// CERRAR MODAL SI SE HACE CLICK AFUERA
// ==========================================

window.onclick = function(event){

    const modalCliente =
    document.getElementById("modal");

    const modalPago =
    document.getElementById("modalPago");

    const modalHistorial =
    document.getElementById("modalHistorial");

    if(event.target==modalCliente){

        cerrarModal();

    }

    if(event.target==modalPago){

        cerrarPago();

    }

    if(event.target==modalHistorial){

        cerrarHistorial();

    }

}

// ==========================================
// OBTENER ESTADO
// ==========================================

function obtenerEstado(cliente){

    if(Number(cliente.saldo) <= 0){

        return "🟢 Pagado";

    }

    if(
        !cliente.proximo_pago ||
        cliente.proximo_pago=="Pendiente" ||
        cliente.proximo_pago=="Pagado"
    ){

        return "🟢 Al día";

    }

    let partes = cliente.proximo_pago.split("/");

    if(partes.length != 3){

        return "🟢 Al día";

    }

    let fechaPago = new Date(
        partes[2],
        partes[1]-1,
        partes[0]
    );

    let hoy = new Date();

    hoy.setHours(0,0,0,0);
    fechaPago.setHours(0,0,0,0);

    if(fechaPago < hoy){

        return "🔴 Atrasado";

    }

    return "🟢 Al día";

}

// ==========================================
// MOSTRAR DASHBOARD
// ==========================================

function mostrarDashboard(){

    document.getElementById("dashboardSection").style.display="block";
    document.getElementById("clientesSection").style.display="none";
    document.getElementById("pagosSection").style.display="none";

    window.scrollTo({
        top:0,
        behavior:"instant"
    });

}

// ==========================================
// MOSTRAR CLIENTES
// ==========================================

function mostrarClientes(){

    document.getElementById("dashboardSection").style.display="none";
    document.getElementById("clientesSection").style.display="block";
    document.getElementById("pagosSection").style.display="none";

    window.scrollTo({
        top:0,
        behavior:"instant"
    });

}


// ==========================================
// MOSTRAR PAGOS
// ==========================================

async function mostrarPagos(){

    document.getElementById("dashboardSection").style.display = "none";
    document.getElementById("clientesSection").style.display = "none";
    document.getElementById("pagosSection").style.display = "block";

    window.scrollTo(0,0);

    await cargarTablaPagos();

}
// ==========================================
// CARGAR TABLA DE PAGOS
// ==========================================

async function cargarTablaPagos(){

    let tabla = document.getElementById("tablaPagos");

    tabla.innerHTML = "";

    const respuesta = await fetch(API + "/clientes");

    const clientes = await respuesta.json();

    for(const cliente of clientes){

        const r = await fetch(API + "/pagos/" + cliente.id);

        const pagos = await r.json();

        pagos.forEach(pago=>{

            tabla.innerHTML += `

            <tr>

                <td>${pago.id}</td>

                <td>${cliente.nombre}</td>

                <td>${pago.fecha}</td>

                <td>Bs. ${Number(pago.monto).toFixed(2)}</td>

            </tr>

            `;

        });

    }

}

async function cargarDashboardClientes(){

    const respuesta = await fetch(API+"/clientes");

    const clientes = await respuesta.json();

    let tabla =
    document.getElementById("tablaDashboard");

    tabla.innerHTML="";

    clientes
    .slice(0,5)
    .forEach(cliente=>{

        let estado =
        obtenerEstado(cliente);

        tabla.innerHTML+=`

        <tr>

            <td>${cliente.id}</td>

            <td>${cliente.nombre}</td>

            <td>${cliente.moto}</td>

            <td>${estado}</td>

            <td>

                Bs. ${Number(cliente.saldo).toFixed(2)}

            </td>

        </tr>

        `;

    });

}

// ==========================================
// INICIALIZAR SISTEMA
// ==========================================

window.onload = async function(){

    limpiarFormulario();

    await recargarSistema();

    mostrarDashboard();

}
async function filtrarClientes(){

    const filtro =
    document.getElementById(
        "filtroClientes"
    ).value;

    const respuesta =
    await fetch(
        API + "/clientes"
    );

    const clientes =
    await respuesta.json();

    let tabla =
    document.getElementById(
        "tablaClientes"
    );

    tabla.innerHTML="";

    clientes.forEach(cliente=>{

        let estado = obtenerEstado(cliente);

        let mostrar=false;

        if(filtro=="Todos"){

            mostrar=true;

        }

        if(filtro=="Contado" && cliente.tipo=="Contado"){

            mostrar=true;

        }

        if(filtro=="Crédito" && cliente.tipo=="Crédito"){

            mostrar=true;

        }

        if(filtro=="Pagados" && estado.includes("Pagado")){

            mostrar=true;

        }

        if(filtro=="Al día" && estado.includes("Al día")){

            mostrar=true;

        }

        if(filtro=="Atrasados" && estado.includes("Atrasado")){

            mostrar=true;

        }

        if(!mostrar){

            return;

        }

        tabla.innerHTML+=`

        <tr>

            <td>${cliente.id}</td>

            <td>${cliente.nombre}</td>

            <td>${cliente.carnet}</td>

            <td>${cliente.moto}</td>

            <td>${cliente.tipo}</td>

            <td>${cliente.modalidad}</td>

            <td>${cliente.proximo_pago}</td>

            <td>Bs. ${cliente.saldo}</td>

            <td>${estado}</td>

            <td>

                <button
                class="editar"
                onclick="editarCliente(${cliente.id})"
                >

                ✏️

                </button>

                <button
                class="pagar"
                onclick="abrirPago(
                ${cliente.id},
                '${cliente.nombre}',
                ${cliente.saldo}
                )"
                >

                💳

                </button>

                <button
                class="historial"
                onclick="verHistorial(
                ${cliente.id},
                '${cliente.nombre}'
                )"
                >

                📜

                </button>

                <button
                class="eliminar"
                onclick="eliminarCliente(${cliente.id})"
                >

                🗑

                </button>

            </td>

        </tr>

        `;

    });

}