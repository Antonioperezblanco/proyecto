//Elementos del formulario
const submit = document.getElementById("submit");
const formInicio = document.querySelector("form");

//Variables para mostrar la contraseña
const mostrar = document.getElementById("show"); 
const pass = document.getElementById("pass");

//Cambiar la forma de iniciar sesion
const btnUsuario = document.getElementById("btnUsuario");   
const btnCorreo = document.getElementById("btnCorreo");    
const labelRegistro = document.getElementById("registroLabel");     
const registro = document.getElementById("registro"); 

//Variables de errores
const registroErr = document.getElementById("registroErr");
const passErr = document.getElementById("passErr");

document.addEventListener("DOMContentLoaded", () => {
    checkValidations();
});

btnUsuario.addEventListener("click", () => {
    labelRegistro.textContent = "Nombre de usuario" 
    registro.name = "nombre"  
    registro.type = "text"  
});

btnCorreo.addEventListener("click", () => {
    labelRegistro.textContent = "Correo electrónico"
    registro.name = "correo"
    registro.type = "email"
});

mostrar.addEventListener("click", (event) =>{
    event.preventDefault();   
    if(pass.type == "password"){ 
        pass.type = "text"  
        show.className = "fa-solid fa-eye-slash" 
    } else{
        pass.type = "password"
        show.className = "fas fa-eye"
    }
});

registro.addEventListener("input", () => {
    if (registro.name==="nombre"){
        if(registro.value === ""){
            registroErr.textContent = "Debe introducir un nombre de usuario";
            registro.style.outline = "2px solid red";
        } else{
            registroErr.textContent = "";
            registro.style.outline = 'none';
        }
    } else if(registro.name==="correo"){
        if(registro.value === ""){
            registroErr.textContent = "Debe introducir un correo electrónico";
            registro.style.outline = "2px solid red";
        } else{
            registroErr.textContent = "";
            registro.style.outline = 'none';
        }
    }
    checkValidations();
});

pass.addEventListener("input", () => {
    if(pass.value === ""){
        passErr.textContent = "Debe introducir una contraseña";
        pass.style.outline = "2px solid red";
    } else{
        passErr.textContent = "";
        pass.style.outline = 'none';
    }
    checkValidations();
});

function checkValidations(){
    let valido = true;

    if(!registro.value) valido = false;
    if(!pass.value) valido = false;

    submit.disabled = !valido;

    if (valido){
        submit.className = "btn btn-success";
    } else{
        submit.className = "btn btn-danger";
    }
}
formInicio.addEventListener("submit", async function(event) {
    event.preventDefault(); 

    const datos = {
        pass: pass.value
    };

    if (registro.type === "email") {
        datos.correo = registro.value;
    } else {
        datos.nombreUsuario = registro.value;
    }

    try {
        const respuesta = await fetch('http://127.0.0.1:3000/usuario/inicioSesion', {
            method: 'POST',  
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)  
        });

        const resultado = await respuesta.json(); 

        if (respuesta.ok) {
            const usuario =  resultado.usuario;
            sessionStorage.setItem("usuario", JSON.stringify(usuario));
            sessionStorage.setItem('solicitudes', JSON.stringify(resultado.solicitudesRecibidas));
            sessionStorage.setItem('amigos', JSON.stringify(resultado.amigos));
            sessionStorage.setItem('origen', 'inicio');

            if (sessionStorage.getItem("usuario")){
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
            text: "Hubo un error al intentar iniciar sesión",
            confirmButtonColor: '#d33'
        });
    }
});
