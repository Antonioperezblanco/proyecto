const formInicio = document.querySelector("form");
const submit = document.getElementById("submit");

const email = document.getElementById("email");
const correoErr = document.getElementById("correoErr");

const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;


email.addEventListener("input", () => {
    if (!email.value){
        correoErr.textContent = "Este campo no puede estar vacío";
        submit.disabled = true;
        email.style.outline = 'red 2px solid';
        submit.className = "btn btn-danger"
    } else if (!emailPattern.test(email.value)) {
        correoErr.textContent = "Debe introducir un correo válido";
        email.style.outline = 'red 2px solid';
        submit.className = "btn btn-danger"
    } else{ 
        correoErr.textContent = "";
        submit.disabled = false;
        submit.className = "btn btn-primary"
        email.style.outline = 'none';
    }
});


formInicio.addEventListener("submit", async function(event) {
    event.preventDefault(); 

        const datos = {
            correo: email.value
        };

    try {
        const respuesta = await fetch('http://127.0.0.1:3000/pass/solicitar', {
            method: 'POST',  
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)  
        });

        const resultado = await respuesta.json(); 

        if (respuesta.ok) {
            Swal.fire({
                icon: 'success',
                title: '¡Genial!',
                text: 'Revise su correo',
                timer: 2000,
                showConfirmButton: false
            });
        } else {
            Swal.fire({
            icon: 'error',
            title: 'Vaya...',
            text: "Correo no encontrado",
            confirmButtonColor: '#d33'
        });
        }
    } catch (error) {
        console.error("Error de conexión:", error);
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: "Hubo un error al recuperar la contraseña",
            confirmButtonColor: '#d33'
        });
    }
});
