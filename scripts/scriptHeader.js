document.addEventListener("DOMContentLoaded", function () {
    fetch('/frontend/views/parts/header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-container').innerHTML = data;
            iniciarEdicionUsuario(); // Llamamos a la función que maneja la edición
        })
        .catch(error => console.error('Error cargando el header:', error));
});

function iniciarEdicionUsuario() {
    const info = document.getElementById('info');
    const overlay = document.getElementById('overlay');
    const formularioEdicion = document.getElementById('formularioEdicion');

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
        console.log(sessionStorage.getItem('usuario')); // Verifica qué contiene

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
                alert("Error: " + resultado.mensaje);
            }
        } catch (error) {
            console.log("Error de conexión:", error);
            alert("Problema con la conexión");
        }
    });
}

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
