if (localStorage.getItem('origen') == 'crear' || localStorage.getItem('origen') == 'inicio'){
    
/**
 * Parte del header
 */
document.addEventListener("DOMContentLoaded", function() {
    fetch('./parts/header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-container').innerHTML = data;

            const info = document.getElementById('info');
            const overlay = document.getElementById('overlay');
            const formularioEdicion = document.getElementById('formularioEdicion');

            if (info) {
                const usuario = JSON.parse(localStorage.getItem('usuario')) || {};
                const nombreUsuario = usuario.nombreUsuario;
                info.textContent = nombreUsuario;

                info.addEventListener("click", function() {
                    overlay.style.display = 'block';

                    const nombreUsuarioForm = document.getElementById("nombreUsuario");
                    const correo = document.getElementById("correo");
                    const edad = document.getElementById("edad");
                    const ciudad = document.getElementById("ciudad");

                    nombreUsuarioForm.value = nombreUsuario;
                    correo.value = usuario.correo;
                    edad.value = usuario.edad;
                    ciudad.value = usuario.ciudad;

                    const nombreError = document.getElementById("nombreError");
                    const correoError = document.getElementById("correoError");
                    const edadError = document.getElementById("edadError");

                    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

                    // Validación de campos
                    nombreUsuarioForm.addEventListener("input", () => {
                        if (nombreUsuarioForm.value === "") {
                            nombreError.textContent = "Debe introducir un nombre de usuario";
                            nombreUsuarioForm.style.outline = 'red 2px solid';
                        } else {
                            nombreError.textContent = "";
                            nombreUsuarioForm.style.outline = 'none';
                        }
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
                });

                formularioEdicion.addEventListener('submit', async function(event) {
                    event.preventDefault();

                    const updatedUsuario = {
                        id: usuario.id,
                        nombreUsuario: document.getElementById('nombreUsuario').value,
                        correo: document.getElementById('correo').value,
                        edad: document.getElementById('edad').value,
                        ciudad: document.getElementById('ciudad').value
                    };

                    try {
                        const respuesta = await fetch('http://localhost:3000/usuario/editarUsuario', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(updatedUsuario)
                        });
                        const resultado = await respuesta.json();

                        if (respuesta.ok) {
                            localStorage.setItem('usuario', JSON.stringify(updatedUsuario));
                            info.textContent = updatedUsuario.nombreUsuario;
                            overlay.style.display = 'none';
                            location.reload();
                        } else {
                            alert("Error: " + resultado.mensaje);
                        }
                    } catch (error) {
                        console.log("Error de conexion:", error);
                        alert("Problema con la conexion");
                    }
                });
            } else {
                console.error("Elemento con id 'info' no encontrado.");
            }
        })
        .catch(error => console.error('Error cargando el header:', error));
});

    /**
     * Parte central de la pagina donde elegir la fecha y el tipo de fiesta
     */
    const fecha = document.getElementById('fecha');
    const sinFecha = document.getElementById('sinFecha');
    const botonContainer = document.getElementById("botonesContainer");


    botonContainer.addEventListener('click', (evt) => {
        if (evt.target.tagName == "BUTTON"){
            const fechaIngresada = new Date(fecha.value);
            const fechaActual = new Date();

            //Para comparar solo la fecha, sin horas ni minutos
            fechaActual.setHours(0, 0, 0, 0);
            fechaIngresada.setHours(0, 0, 0, 0);
            if (!fecha.value) {
                sinFecha.textContent = "Debes seleccionar una fecha";
            }else if (fechaIngresada < fechaActual) {
                sinFecha.textContent = "No puedes seleccionar una fecha anterior a hoy";
            } else {
                sinFecha.textContent = "";
            }
        }
        
    });
}  else {
    window.location.href = "/frontend/usuarios/CrearUsuario.html"; 
}
