document.addEventListener("DOMContentLoaded", function () {
    fetch('/frontend/views/parts/header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-container').innerHTML = data;
            
            iniciarEdicionUsuario(); 
            configurarFormularioAmigo();
            contarSolicitudes();
            mostrarSolicitudes();
            mostrarAmigos();
            mostrarConfig();
            cerrarSesion();
        })
        .catch(error => console.error('Error cargando el header:', error));
});

//Función para que salga el numero de solicitudes que tienes
function contarSolicitudes(){
    const numeroNotificaciones = document.getElementById("nNotificacion")
    const solicitudesJSON = sessionStorage.getItem('solicitudes');
    if (JSON.parse(solicitudesJSON).length <9){
         numeroNotificaciones.textContent = JSON.parse(solicitudesJSON).length
    }else if (sessionStorage.getItem("origen") == "crear"){
        numeroNotificaciones.textContent = "0"
    }else{
        numeroNotificaciones.textContent = "9+"
    }
}

function cerrarSesion() {
    const logout = document.getElementById("logout");

    logout.addEventListener("click", () => {
        Swal.fire({
            title: '¿Estás seguro de que quieres cerrar sesión?',
            text: "Tendrás que iniciar sesión de nuevo para acceder.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, cerrar sesión',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                sessionStorage.setItem("origen", "");
                sessionStorage.setItem("usuario", "");
                window.location.href = "/frontend/views/usuarios/InicioSesion.html";
            }
        });
    });
}


//Función para al dar click al nombre de usuario te salga un formulario para poder editarlo
function iniciarEdicionUsuario() {
    const info = document.getElementById('info');
    const overlay = document.getElementById('overlay');
    const formularioEdicion = document.getElementById('formularioEdicion');
    const botonCancelar = document.getElementById("botonCancelar");

    if (!info) return console.error("Elemento con id 'info' no encontrado.");

    const usuario = JSON.parse(sessionStorage.getItem('usuario')) || {};
    info.textContent = usuario.nombreUsuario;

    info.addEventListener("click", function () {
        overlay.style.display = 'block';

        document.getElementById("nombreUsuario").value = usuario.nombreUsuario || '';
        document.getElementById("correo").value = usuario.correo || '';
        document.getElementById("edad").value = usuario.edad || '';
        document.getElementById("ciudad").value = usuario.ciudad || '';

        agregarValidaciones();
    });

    formularioEdicion.addEventListener('submit', async function (event) {
        event.preventDefault();
        console.log(usuario)
        const updatedUsuario = {
            id: usuario.id,
            nombreUsuario: document.getElementById('nombreUsuario').value,
            correo: document.getElementById('correo').value,
            edad: document.getElementById('edad').value,
            ciudad: document.getElementById('ciudad').value
        };
        console.log(sessionStorage.getItem('usuario')); 

        console.log(updatedUsuario)
        try {
            const respuesta = await fetch('http://localhost:3000/usuario/editarUsuario', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedUsuario)
            });
            const resultado = await respuesta.json();

            if (respuesta.ok) {
                sessionStorage.setItem('usuario', JSON.stringify(updatedUsuario));
                info.textContent = updatedUsuario.nombreUsuario;
                overlay.style.display = 'none';
                location.reload();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: resultado.mensaje,
                    confirmButtonColor: '#d33'
                });
            }
        } catch (error) {
            console.log("Error de conexión:", error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: "Problema con la conexión",
                confirmButtonColor: '#d33'
            });
        }
    });

    botonCancelar.addEventListener("click", (event) => {
        event.preventDefault();
        overlay.style.display = 'none';
    })
}

function mostrarConfig() {
    const config = document.getElementById("config");
    const sidebar = document.getElementById("sidebar");

    config.addEventListener("click", () => {
        sidebar.classList.toggle('mostrar');
        
        let inicio = '0px';
    let final;

    if (window.innerWidth <= 480) {
        final = '200px';
    } else if (window.innerHeight> 480 && window.innerWidth <= 700) {
        final = '300px';
    } else {
        final = '400px';
    }

    if (sidebar.classList.contains('mostrar')) {
        config.className = "fa-solid fa-arrow-left";
        config.style.setProperty('--inicio', inicio);
        config.style.setProperty('--final', final);
    } else {
        config.className = "fa-solid fa-bars";
        config.style.setProperty('--inicio', final);
        config.style.setProperty('--final', inicio);
    }
        


        config.classList.remove('rebote');
        void config.offsetWidth; // Forzar reflow
        config.classList.add('rebote');
    });
}


//Funcion para validar el formulario de arriba
function agregarValidaciones() {
    const nombreUsuarioForm = document.getElementById("nombreUsuario");
    const correo = document.getElementById("correo");
    const edad = document.getElementById("edad");

    const nombreError = document.getElementById("nombreError");
    const correoError = document.getElementById("correoError");
    const edadError = document.getElementById("edadError");

    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    nombreUsuarioForm.addEventListener("input", () => {
        nombreError.textContent = nombreUsuarioForm.value ? "" : "Debe introducir un nombre de usuario";
        nombreUsuarioForm.style.outline = nombreUsuarioForm.value ? 'none' : 'red 2px solid';
    });

    correo.addEventListener("input", () => {
        if (!correo.value) {
            correoError.textContent = "Debe introducir un correo";
            correo.style.outline = 'red 2px solid';
        } else if (!emailPattern.test(correo.value)) {
            correoError.textContent = "Debe introducir un correo válido";
            correo.style.outline = 'red 2px solid';
        } else {
            correoError.textContent = "";
            correo.style.outline = 'none';
        }
    });

    edad.addEventListener("input", () => {
        const valorEdad = parseInt(edad.value);
        if (!edad.value) {
            edadError.textContent = "Debe introducir una edad";
            edad.style.outline = 'red 2px solid';
        } else if (valorEdad < 18) {
            edadError.textContent = "Debes ser mayor de edad";
            edad.style.outline = 'red 2px solid';
        } else if (valorEdad > 120) {
            edadError.textContent = "Edad no válida";
            edad.style.outline = 'red 2px solid';
        } else {
            edadError.textContent = "";
            edad.style.outline = 'none';
        }
    });
}

//Funcion para enviar solicitudes de amistad
function configurarFormularioAmigo() {
    const formularioHeader = document.getElementById("formHeader");

    formularioHeader.addEventListener("submit", async (e) => {
        e.preventDefault();

        const usuario = JSON.parse(sessionStorage.getItem("usuario"));
        const nombreAmigo = document.getElementById("anadir")?.value.trim();

        if (!nombreAmigo) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: "Por favor, introduce el nombre de usuario del amigo",
                confirmButtonColor: '#d33'
            });
            return;
        }

        const datos = {
            usuario: usuario.nombreUsuario,
            amigo: nombreAmigo
        };

        try {
            const respuesta = await fetch('http://127.0.0.1:3000/usuario/anadir', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });

            const resultado = await respuesta.json();

            if (respuesta.ok) {
                Swal.fire({
                    icon: 'info',
                    title: 'Solicitud enviada',
                    text: 'La solicitud de amistad ha sido enviada.',
                    confirmButtonColor: '#3085d6'
                });
                document.getElementById("anadir").value = ""; 
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: resultado.mensaje,
                    confirmButtonColor: '#d33'
                });
            }
        } catch (error) {
            console.error("Error de conexión:", error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: "Hubo un error al intentar enviar la solicitud",
                confirmButtonColor: '#d33'
            });
        }
    });
}
async function mostrarSolicitudes() {
    const icono = document.getElementById("icono");
    const lista = document.getElementById('listaSolicitudes');

    icono.addEventListener("click", () => {
        lista.classList.toggle('oculto');

        if (!lista.classList.contains('oculto')) {
            const solicitudesJSON = sessionStorage.getItem('solicitudes');
            const solicitudes = solicitudesJSON ? JSON.parse(solicitudesJSON) : [];

            lista.innerHTML = '';

            if (solicitudes.length === 0 || sessionStorage.getItem("origen") == "crear") {
                lista.innerHTML = "<p style='color:black; text-align:center'>No tienes solicitudes</p>";
            } else {
                solicitudes.forEach((sol, i) => {
                    const div = document.createElement('div');
                    div.innerHTML = `
                        <span style='color:black'><strong style='text-decoration: underline'>${sol.usuario}</strong> te ha enviado una solicitud</span><br>
                        <button class='btn btn-primary' onclick="aceptar(${i})">Aceptar</button>
                        <button class='btn btn-danger' onclick="rechazar(${i})">Rechazar</button>
                        <hr>
                    `;
                    lista.appendChild(div);
                });
            }
        }
    });
}

async function aceptar(i) {
    const solicitudes = JSON.parse(sessionStorage.getItem('solicitudes'));
    const solicitud = solicitudes[i];
    const receptor = JSON.parse(sessionStorage.getItem('usuario'));

    try {
        const respuesta = await fetch('http://127.0.0.1:3000/usuario/aceptar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                usuario: solicitud.usuario,
                receptor: receptor.nombreUsuario
            })
        });

        const resultado = await respuesta.json(); 

        if (respuesta.ok) {
            solicitudes.splice(i, 1);
            sessionStorage.setItem('solicitudes', JSON.stringify(solicitudes));
            mostrarSolicitudes();
            Swal.fire({
                icon: 'info',
                title: '¡Genial!',
                text: 'Solicitud aceptada',
                timer: 2000,
                showConfirmButton: false
            });
            location.reload();

            
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: resultado.mensaje || 'Error al aceptar solicitud',
                confirmButtonColor: '#d33'
            });
        }
    } catch (error) {
        console.error('Error aceptando solicitud: ', error);
    }
}

async function rechazar(i) {
    const solicitudes = JSON.parse(sessionStorage.getItem('solicitudes'));
    const solicitud = solicitudes[i];
    const receptor = JSON.parse(sessionStorage.getItem('usuario'));

    try {
        const respuesta = await fetch('http://127.0.0.1:3000/usuario/rechazar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                usuario: solicitud.usuario,
                receptor: receptor.nombreUsuario
            })
        });

        const resultado = await respuesta.json(); 

        if (respuesta.ok) {
            solicitudes.splice(i, 1);
            sessionStorage.setItem('solicitudes', JSON.stringify(solicitudes));
            mostrarSolicitudes();
            Swal.fire({
                icon: 'info',
                title: 'Solicitud rechazada',
                text: 'La solicitud de amistad ha sido rechazada.',
                confirmButtonColor: '#3085d6'
            });
            location.reload();

            
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: resultado.mensaje || 'Error al rechazar solicitud',
                confirmButtonColor: '#d33'
            });
        }
    } catch (error) {
        console.error('Error rechazando solicitud: ', error);
    }
}

async function mostrarAmigos() {
    const icono = document.getElementById("amigo");
    const lista = document.getElementById('listaAmigos');

    icono.addEventListener("click", () => {
        lista.classList.toggle('oculto');

        if (!lista.classList.contains('oculto')) {
            const amigosJSON = sessionStorage.getItem('amigos');
            const amigos = amigosJSON ? JSON.parse(amigosJSON) : [];

            lista.innerHTML = '';

            if (amigos.length === 0 || sessionStorage.getItem("origen") == "crear") {
                lista.innerHTML = "<p style='color:black; text-align:center'>No tienes amigos</p>";
            } else {
                amigos.forEach((ami, i) => {
                    const div = document.createElement('div');
                    div.innerHTML = `
                        <strong style='text-decoration: underline; color:black'>${ami}</strong> <br>
                        <button class='btn btn-danger' style='position:relative; float: right' onclick="eliminar(${i})">Eliminar</button>
                        <br>
                        <hr>
                    `;
                    lista.appendChild(div);
                });
            }
        }
    });
}
async function eliminar(i) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "Esta acción no se puede deshacer.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
}).then(async (result) => {
    if (result.isConfirmed) {
        const amigos = JSON.parse(sessionStorage.getItem('amigos'));
        const usuario = JSON.parse(sessionStorage.getItem('usuario'));

        if (!amigos[i] || !usuario) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: "Datos no encontrados",
                confirmButtonColor: '#d33'
            });
            return;
        }

        const amigo = amigos[i];

        try {

            
            const respuesta = await fetch('http://127.0.0.1:3000/usuario/eliminar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    usuario: usuario,
                    amigo: amigo
                })
            });

            const resultado = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(resultado.mensaje || 'Error al eliminar amigo');
            }

            amigos.splice(i, 1);
            sessionStorage.setItem('amigos', JSON.stringify(amigos)); 
            
            mostrarAmigos();
            Swal.fire({
                icon: 'info',
                title: 'Amigo eliminado',
                text: 'Amigo eliminado correctamente.',
                confirmButtonColor: '#3085d6'
            });

            location.reload();

        } catch (error) {
            console.error('Error eliminando amigo: ', error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error.mensaje,
                confirmButtonColor: '#d33'
            });
        }
    }
    })
}