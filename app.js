const API_URL = "/lista-compra/api.php";
let usuarioActual = '';
let familiaId = localStorage.getItem('familiaIdLista') || null;

window.onload = function () {
    if (!familiaId) {
        document.getElementById('pantallaPin').style.display = 'block';
        document.getElementById('pantallaRegistro').style.display = 'none';
        document.getElementById('pantallaUsuario').style.display = 'none';
        document.getElementById('panelPrincipal').style.display = 'none';
    } else {
        const nombreGuardado = localStorage.getItem('usuarioLista');
        if (nombreGuardado) {
            iniciarApp(nombreGuardado);
        } else {
            document.getElementById('pantallaPin').style.display = 'none';
            document.getElementById('pantallaRegistro').style.display = 'none';
            document.getElementById('pantallaUsuario').style.display = 'block';
            document.getElementById('panelPrincipal').style.display = 'none';
        }
    }
};

function toggleMostrarPin() {
    const pinInput = document.getElementById('inputPin');
    pinInput.type = (pinInput.type === 'password') ? 'text' : 'password';
}

async function validarPin() {
    const pinInput = document.getElementById('inputPin').value.trim();
    const errorDiv = document.getElementById('errorPin');

    if (!pinInput) return;

    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ accion: 'validar_pin', pin: pinInput })
        });
        const data = await res.json();

        if (data.status === 'ok') {
            familiaId = data.familia_id;
            localStorage.setItem('familiaIdLista', familiaId);
            localStorage.setItem('nombreFamiliaLista', data.nombre_familia);

            document.getElementById('pantallaPin').style.display = 'none';
            document.getElementById('pantallaUsuario').style.display = 'block';
            errorDiv.style.display = 'none';
        } else {
            errorDiv.innerText = data.mensaje || "PIN incorrecto";
            errorDiv.style.display = 'block';
        }
    } catch (error) {
        console.error("Error al validar el PIN:", error);
        errorDiv.innerText = "Error de conexión con el servidor";
        errorDiv.style.display = 'block';
    }
}

function mostrarPantallaRegistro() {
    document.getElementById('pantallaPin').style.display = 'none';
    document.getElementById('pantallaRegistro').style.display = 'block';
}

function cancelarRegistro() {
    document.getElementById('pantallaRegistro').style.display = 'none';
    document.getElementById('pantallaPin').style.display = 'block';
}

function toggleMostrarNuevoPin() {
    const input = document.getElementById('nuevoPinFamilia');
    input.type = (input.type === 'password') ? 'text' : 'password';
}

async function registrarFamilia() {
    const nombre = document.getElementById('nuevoNombreFamilia').value.trim();
    const pin = document.getElementById('nuevoPinFamilia').value.trim();
    const errorDiv = document.getElementById('errorRegistro');

    if (!nombre || !pin) {
        errorDiv.innerText = "Por favor, completa el nombre y el PIN.";
        errorDiv.style.display = 'block';
        return;
    }

    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ accion: 'crear_familia', nombre: nombre, pin: pin })
        });
        const data = await res.json();

        if (data.status === 'ok') {
            familiaId = data.familia_id;
            localStorage.setItem('familiaIdLista', familiaId);
            localStorage.setItem('nombreFamiliaLista', data.nombre_familia);

            document.getElementById('pantallaRegistro').style.display = 'none';
            document.getElementById('pantallaUsuario').style.display = 'block';
            errorDiv.style.display = 'none';
        } else {
            errorDiv.innerText = data.mensaje || "Error al crear la familia";
            errorDiv.style.display = 'block';
        }
    } catch (error) {
        console.error("Error al registrar familia:", error);
        errorDiv.innerText = "Error de conexión con el servidor";
        errorDiv.style.display = 'block';
    }
}

function guardarNombreUsuario() {
    const nombreInput = document.getElementById('inputNombreUsuario').value.trim();
    if (!nombreInput) return;
    localStorage.setItem('usuarioLista', nombreInput);
    iniciarApp(nombreInput);
}

function seleccionarUsuario(nombre) {
    localStorage.setItem('usuarioLista', nombre);
    iniciarApp(nombre);
}

function iniciarApp(nombre) {
    usuarioActual = nombre;

    document.getElementById('pantallaPin').style.display = 'none';
    document.getElementById('pantallaRegistro').style.display = 'none';
    document.getElementById('pantallaUsuario').style.display = 'none';
    document.getElementById('panelPrincipal').style.display = 'block';

    document.getElementById('textoSaludo').innerText = '👋🏼 Hola, ' + usuarioActual;
    document.getElementById('nuevoProducto').focus();

    cargarProductos();
}

async function cargarProductos() {
    try {
        const res = await fetch(`${API_URL}?familia_id=${familiaId}`);
        const productos = await res.json();
        dibujarLista(productos);
    } catch (error) {
        console.error("Error al conectar con la Toshiba:", error);
    }
}

function dibujarLista(productos) {
    const ul = document.getElementById('lista');
    ul.innerHTML = '';

    productos.forEach(function (prod) {
        const li = document.createElement('li');
        const estaComprado = (prod.comprado == 1);

        let htmlProducto = '<div style="display: flex; align-items: center; gap: 10px;">';

        htmlProducto += '<input type="checkbox" ';
        if (estaComprado) {
            htmlProducto += 'checked ';
        }
        htmlProducto += 'onchange="marcarProducto(' + prod.id + ', ' + (!estaComprado) + ')" ';
        htmlProducto += 'style="width: 20px; height: 20px; cursor: pointer;" ';
        htmlProducto += 'title="Marcar como comprado">';

        htmlProducto += '<div class="info-producto" style="cursor: pointer;" onclick="marcarProducto(' + prod.id + ', ' + (!estaComprado) + ')">';

        if (estaComprado) {
            htmlProducto += '<strong style="text-decoration: line-through; opacity: 0.5;">' + prod.nombre + '</strong>';
        } else {
            htmlProducto += '<strong>' + prod.nombre + '</strong>';
        }

        if (estaComprado && prod.comprado_por) {
            htmlProducto += '<span class="autor" style="font-size: 0.8em; color: #777; display: block;">Comprado por: ' + prod.comprado_por + '</span>';
        }

        htmlProducto += '</div></div>';
        htmlProducto += '<button class="btn-borrar" onclick="eliminarProducto(' + prod.id + ')">Borrar</button>';

        li.innerHTML = htmlProducto;
        ul.appendChild(li);
    });
}

async function agregarProducto() {
    const input = document.getElementById('nuevoProducto');
    const texto = input.value.trim();

    if (texto === '') return;

    try {
        await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ accion: 'agregar', nombre: texto, familia_id: familiaId })
        });

        input.value = '';
        input.focus();
        cargarProductos();
    } catch (error) {
        console.error("Error al añadir producto:", error);
    }
}

async function marcarProducto(id, nuevoEstadoComprado) {
    try {
        await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                accion: 'marcar',
                id: id,
                comprado: nuevoEstadoComprado,
                comprado_por: usuarioActual
            })
        });
        cargarProductos();
    } catch (error) {
        console.error("Error al marcar producto:", error);
    }
}

async function eliminarProducto(id) {
    try {
        await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ accion: 'eliminar', id: id })
        });
        cargarProductos();
    } catch (error) {
        console.error("Error al eliminar producto:", error);
    }
}