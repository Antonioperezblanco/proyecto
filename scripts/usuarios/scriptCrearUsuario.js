// Variables para mostrar la contraseña
const mostrar = document.getElementById("show");  
const pass = document.getElementById("pass");   
const confPass = document.getElementById("confPass");
const mostrarPass = document.getElementById("mostrarPass");

// Elementos del formulario
const formulario = document.querySelector("form")
const submitButton = document.querySelector('input[type="submit"]');

// Campos del formulario
const nombreUsuario = document.getElementById("nombreUsuario");
const correo = document.getElementById("correo");
const edad = document.getElementById("edad");
const ciudad = document.getElementById("ciudad");

// Variables para mostrar los errores
const nombreError = document.getElementById("nombreError");
const correoError = document.getElementById("correoError");
const passError = document.getElementById("passError");
const confPassError = document.getElementById("confPassError");
const edadError = document.getElementById("edadError");
const ciudadError = document.getElementById("ciudadError");

// Patrón de correo electrónico
const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

// Función para inicializar las validaciones al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    checkValidations();
});

// Ocultar y mostrar contraseña
mostrar.addEventListener("click", () => {
    if (pass.type === "password") {
        pass.type = "text";
        confPass.type = "text";
        mostrarPass.textContent = "Ocultar contraseña";
        mostrar.className = "fa-solid fa-eye-slash";
    } else {
        pass.type = "password";
        confPass.type = "password";
        mostrarPass.textContent = "Mostrar contraseña";
        mostrar.className = "fa-solid fa-eye";
    }
});

// Validación de los campos al escribir
nombreUsuario.addEventListener("input", () => {
    if (nombreUsuario.value === "") {
        nombreError.textContent = "Debe introducir un nombre de usuario";
        nombreUsuario.style.outline = 'red 2px solid';
    } else {
        nombreError.textContent = "";
        nombreUsuario.style.outline = 'none';
    }
    checkValidations();
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
    checkValidations();
});

pass.addEventListener("input", () => {
    if (!pass.value) {
        passError.textContent = "Debe introducir una contraseña";
        pass.style.outline = 'red 2px solid';
    } else if (pass.value.length < 8) {
        passError.textContent = "La contraseña debe tener al menos 8 caracteres";
        pass.style.outline = 'red 2px solid';
    } else {
        passError.textContent = "";
        pass.style.outline = 'none';
    }
    checkValidations();
});

confPass.addEventListener("input", () => {
    if (pass.value !== confPass.value) {
        confPassError.textContent = "Las contraseñas no son iguales";
        confPass.style.outline = 'red 2px solid';
    } else {
        confPassError.textContent = "";
        confPass.style.outline = 'none';
    }
    checkValidations();
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
    checkValidations();
});

ciudad.addEventListener("input", () => {
    if (ciudad.value === "0") {
        ciudadError.textContent = "Debes seleccionar una ciudad";
        ciudad.style.outline = 'red 2px solid';
    } else {
        ciudadError.textContent = "";
        ciudad.style.outline = 'none';
    }
    checkValidations();
});

function checkValidations() {
    let valido = true;

    if (!nombreUsuario.value) valido = false;
    if (!correo.value || !emailPattern.test(correo.value)) valido = false;
    if (!pass.value || pass.value.length < 8) valido = false;
    if (pass.value !== confPass.value) valido = false;
    if (!edad.value || parseInt(edad.value) < 18 || parseInt(edad.value) > 120) valido = false;
    if (ciudad.value === "0") valido = false;
    
    submitButton.disabled = !valido; 

    if (valido) {
        submitButton.className = "btn btn-success";
    } else {
        submitButton.className = "btn btn-danger";
    }
}

formulario.addEventListener("submit", async function(event) {
    event.preventDefault();

    const datos = {
        nombreUsuario: nombreUsuario.value,
        correo: correo.value,
        pass: pass.value,
        edad: edad.value,
        ciudad: ciudad.value
    };

    try {
        const respuesta = await fetch('http://localhost:3000/usuario/crear', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });

        const resultado = await respuesta.json();

        if (respuesta.ok) {
            sessionStorage.setItem('usuario', JSON.stringify(resultado));
            sessionStorage.setItem('origen', 'crear');
            const usuarioGuardado = sessionStorage.getItem("usuario");

            if (usuarioGuardado) {
                console.log("Usuario guardado:", JSON.parse(usuarioGuardado));

                window.location.href = "/frontend/views/index/busqueda.html"; 
            } else {
                Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: resultado.mensaje,
                        confirmButtonColor: '#d33'
                    });
            }
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
            text: "Hubo un problema con la conexion",
            confirmButtonColor: '#d33'
        });
    }
});