// Variables para mostrar la contraseña
const mostrar = document.getElementById("show");  // Icono ojo
const pass = document.getElementById("pass");   // Input contraseña
const confPass = document.getElementById("confPass");   // Input confirmar contraseña
const mostrarPass = document.getElementById("mostrarPass");  // Span texto icono

const submit = document.getElementById("submit");
const formInicio = document.querySelector("form");

const token = window.location.pathname.split("/").pop();
formInicio.action = `http://127.0.0.1:3000/pass/restablecer/${token}`;

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
 
pass.addEventListener("input", () => {
var error = true;
    if (!pass.value) {
        passError.textContent = "Debe introducir una contraseña";
        pass.style.outline = 'red 2px solid';
        error = true;
    } else if (pass.value.length < 8) {
        passError.textContent = "La contraseña debe tener al menos 8 caracteres";
        pass.style.outline = 'red 2px solid';
        error = true
    } else {
        passError.textContent = "";
        pass.style.outline = 'none';
        error = false
    }
});
confPass.addEventListener("input", () => {
    if (!confPass.value){
        confPassError.textContent = "Debes confirmar la contraseña";
        confPass.style.outline = 'red 2px solid';
        error = true
    }
    else if (pass.value !== confPass.value) {
        confPassError.textContent = "Las contraseñas no son iguales";
        confPass.style.outline = 'red 2px solid';
        error = true
    } else {
        confPassError.textContent = "";
        confPass.style.outline = 'none';
        error = false
    }
    if (error){
        submit.disabled = true;
        submit.className = "btn btn-danger";
    } else {
        submit.disabled = false;
        submit.className = "btn btn-primary";

    }

});

formInicio.addEventListener("submit", async function(event) {
    event.preventDefault(); 

    const nuevaPass = pass.value;
    const token = window.location.pathname.split('/').pop();

    try {
        const respuesta = await fetch(`http://127.0.0.1:3000/pass/restablecer/${token}`, {
            method: 'POST',  
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nuevaPass: nuevaPass })  
        });

        if (!respuesta.ok) {
            const errorData = await respuesta.json();
            throw new Error(errorData.error || 'Error al actualizar contraseña');
        }

        const resultado = await respuesta.json(); 

        
            alert("Contraseña actualizada")
    } catch (error) {
        console.error("Error de conexión:", error);
        alert(`Error: ${error.message}`);
    }
});
