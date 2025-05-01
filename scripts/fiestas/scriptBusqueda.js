if (sessionStorage.getItem('origen') == 'crear' || sessionStorage.getItem('origen') == 'inicio'){
    
    /**
     * Parte central de la pagina donde elegir la fecha y el tipo de fiesta
     */
    const fecha = document.getElementById('fecha');
    const sinFecha = document.getElementById('sinFecha');
    const botonContainer = document.getElementById("botonContainer");


    botonContainer.addEventListener('click', (evt) => {
        if (evt.target.tagName == "BUTTON"){
            const fechaIngresada = new Date(fecha.value);
            const fechaActual = new Date();

            //Para comparar solo la fecha, sin horas ni minutos
            fechaActual.setHours(0, 0, 0, 0);
            fechaIngresada.setHours(0, 0, 0, 0);
            if (!fecha.value) {
                sinFecha.textContent = ""
                sinFecha.textContent = "Debes seleccionar una fecha";
            }else if (fechaIngresada < fechaActual) {
                sinFecha.textContent = ""
                sinFecha.textContent = "No puedes seleccionar una fecha anterior a hoy";

            } else{
                sinFecha.textContent = "";
                if (evt.target.id == "btnFiesta"){
                    sessionStorage.setItem("tipo", "fiesta");
                    sessionStorage.setItem("fecha", fecha.value);
                window.location.href = "/frontend/views/index/fiestas.html";  
                }
                if (evt.target.id == "btnDiscoteca"){
                    sessionStorage.setItem("tipo", "discoteca");
                    sessionStorage.setItem("fecha", fecha.value);
                    window.location.href = "/frontend/views/index/fiestas.html";  

                }
                if (evt.target.id == "btnAmbas"){
                    sessionStorage.setItem("tipo", "ambas");
                    sessionStorage.setItem("fecha", fecha.value);
                    window.location.href = "/frontend/views/index/fiestas.html";  
                }
            }
        }
    });
}  else {
    window.location.href = "/frontend/views/usuarios/CrearUsuario.html"; 
}
