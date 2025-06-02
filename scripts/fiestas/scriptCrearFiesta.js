if (sessionStorage.getItem("origen") == "inicio" || sessionStorage.getItem("origen") == "crear"){


    const formFiesta = document.querySelector("form")


    //Campos a rellenar
    const tipoFiesta = document.getElementById("tipoFiesta");
    const ciudad = document.getElementById("ciudad");
    const localizacion = document.getElementById("localizacion");
    const fecha = document.getElementById("fecha");
    const hora = document.getElementById("hora");
    const vestimenta = document.getElementById("vestimenta");
    const tipoMusica = document.getElementById("tipoMusica");
    const combinado = document.getElementById("combinado");
    const cerveza = document.getElementById("cerveza");
    const refresco = document.getElementById("refresco");
    const botonSubmit = document.getElementById("botonSubmit");

    //Campos opcionales
    const nombre = document.getElementById("nombre");
    const precioDisco = document.getElementById("precioDiscoteca");
    const tuAlcohol = document.getElementById("tuAlcohol");

    //Variables fecha y hora actual pasados a como se reciben en un input
    const fechaActual = new Date().toISOString().split('T')[0];
    const horaActual = new Date().toISOString().split('T')[1].split(':')[0];

    //Variables para mostrar errores
    const tipoFiestaErr = document.getElementById("tipoFiestaErr");
    const ciudadErr = document.getElementById("ciudadErr");
    const localizacionErr = document.getElementById("localizacionErr");
    const fechaErr = document.getElementById("fechaErr");
    const horaErr = document.getElementById("horaErr");
    const vestimentaErr = document.getElementById("vestimentaErr");
    const tipoMusicaErr = document.getElementById("musicaErr");
    const combinadoErr = document.getElementById("combinadoErr");
    const cervezaErr = document.getElementById("cervezaErr");
    const refrescoErr = document.getElementById("refrescoErr");

    //Evento para cuando seleccionen un tipo de fiesta aparezcan los input correspondientes
    tipoFiesta.addEventListener("change", function() {

        
        if(tipoFiesta.value =="discoteca"){
            nombre.innerHTML ="";
            precioDisco.innerHTML="";
            tuAlcohol.innerHTML="";

            const labelNombre = document.createElement("label");
            labelNombre.textContent = "Nombre de la discoteca: ";
            labelNombre.className = "form-label";

            const inputNombre = document.createElement("input");
            inputNombre.type = "text";
            inputNombre.name="nombre";
            inputNombre.id="nombreDiscoteca";
            inputNombre.className ="form-control";
            inputNombre.maxLength = "20";

            const nombreErr = document.createElement("span");
            nombreErr.id="nombreErr";
            nombreErr.textContent = "";
            nombreErr.className = "text-danger";

            nombre.appendChild(labelNombre);
            nombre.appendChild(inputNombre);
            nombre.appendChild(nombreErr);
            nombre.appendChild(document.createElement("br"));
        
            const labelPrecio = document.createElement("label");
            labelPrecio.textContent = "Precio de la discoteca: ";
            labelPrecio.className = "form-label"
            const inputPrecio = document.createElement("input");
            inputPrecio.type="number";
            inputPrecio.name="precioDiscoteca";
            inputPrecio.id="precioDisco";
            inputPrecio.className = "form-control"

            const spanPrecio = document.createElement("span");
            spanPrecio.id="precioDiscoErr";
            spanPrecio.textContent ="";
            spanPrecio.className = "text-danger"

            precioDisco.appendChild(labelPrecio);
            precioDisco.appendChild(inputPrecio);
            precioDisco.appendChild(spanPrecio);
            precioDisco.appendChild(document.createElement("br"));

            combinado.disabled = false;
            refresco.disabled = false;
            cerveza.disabled = false;

            nombre.addEventListener("input", ()  => {
                nombreErr.textContent = inputNombre.value  ? "" : "Debe introducir un nombre de discoteca";
                checkValidations();
            });
            inputPrecio.addEventListener("input", ()  => {
                if (!inputPrecio.value){
                    spanPrecio.textContent ="Debe introducir un precio de la discoteca";
                } else if(inputPrecio.value <0) {
                    spanPrecio.textContent = "El precio no puede ser negativo"
                } else {
                    spanPrecio.textContent = "";
                }
                checkValidations();
            });
            
        } else if(tipoFiesta.value =="fiestaPrivada"){
                nombre.innerHTML ="";
                precioDisco.innerHTML="";
                tuAlcohol.innerHTML="";

                const labelAlcohol = document.createElement("label");
                labelAlcohol.textContent = "¿Pueden llevar su alcohol?";
                labelAlcohol.className = "form-label"
                const inputAlcohol = document.createElement("input");
                inputAlcohol.type = "checkbox";
                inputAlcohol.name = "alcohol";
                inputAlcohol.id = "alcohol";
                inputAlcohol.className = "form-check-input"
                inputAlcohol.style.textAlign = "center";

                tuAlcohol.appendChild(labelAlcohol);
                tuAlcohol.appendChild(inputAlcohol);
                tuAlcohol.appendChild(document.createElement("br"));

                //Si en una fiesta p`rivada puedes llevar su alcohol se desactiva los campos de los precios
                inputAlcohol.addEventListener("change", () => {
                    if(inputAlcohol.checked){
                        combinado.disabled=true;
                        combinado.value=null;
                        cerveza.disabled=true;
                        cerveza.value=null;
                        refresco.disabled=true;
                        refresco.value=null;
                    }else {
                        combinado.disabled = false;
                        cerveza.disabled = false;
                        refresco.disabled = false;
                    }
                    checkValidations();
                });
            
            }
    });

    //Eventos para mostrar errores
    tipoFiesta.addEventListener("change", () => {
        if (!tipoFiesta.value){
            tipoFiestaErr.textContent = "Debes seleccionar un tipo de fiesta";
        } else{
            tipoFiestaErr.textContent = "";
        }
        checkValidations();
    });

    ciudad.addEventListener("change", () => {
        ciudadErr.textContent = ciudad.value ? "" : "Debe introducir una ciudad";
        checkValidations();
    });

    localizacion.addEventListener("input", () => {
        localizacionErr.textContent = localizacion.value ? "" : "Debe introducir una localización";
        checkValidations();
    });

    fecha.addEventListener("input", () => {
        fechaErr.textContent = fecha.value ? "" : "Debe introducir una fecha";
        if(fecha.value < fechaActual) {
            fechaErr.textContent = "La fecha debe ser mayor o igual a la actual";
        }
        checkValidations();
    });

    hora.addEventListener("input", () => {
        horaErr.textContent = hora.value ? "" : "Debe introducir una hora";
        if (fecha.value == fechaActual && hora.value < horaActual) {
            horaErr.textContent = "La hora no puede ser anterior a la actual";
        
        }
        checkValidations();
    });

    vestimenta.addEventListener("change", () => {
        vestimentaErr.textContent = vestimenta.value ? "" : "Debe introducir un tipo de vestimenta";
        checkValidations();
    });

    tipoMusica.addEventListener("input", () => {
        tipoMusicaErr.textContent = tipoMusica.value ? "" : "Debe introducir un tipo de musica";
        checkValidations();
    });



    combinado.addEventListener("input", () => {
        const inputAlcohol = document.getElementById("alcohol");
        if(tipoFiesta.value ==  "discoteca" || (tipoFiesta.value=="fiestaPrivada" && !inputAlcohol.checked)){
            if(!combinado.value) {
                combinadoErr.textContent = "Debes introducir un precio de combinado";
            } else if (combinado.value <= 0){
                combinadoErr.textContent = "El precio del combinado no puede ser negativo";
            } else {
                combinadoErr.textContent = "";
            }
            checkValidations();
        }
    });

    cerveza.addEventListener("input", () => {
        const inputAlcohol = document.getElementById("alcohol");
        if(tipoFiesta.value == "discoteca" || !inputAlcohol.checked){
            if (!cerveza.value){
                cervezaErr.textContent = "Debes introducir un precio de cerveza";
            } else if (cerveza.value < 0){
                cervezaErr.textContent = "El precio de la cerveza no puede ser negativo";
            } else {
                cervezaErr.textContent = "";
            }
            checkValidations();
        }
    });

    refresco.addEventListener("input", () => {
        const inputAlcohol = document.getElementById("alcohol");
        if(tipoFiesta.value == "discoteca" || !inputAlcohol.checked){
            if (!refresco.value){
                refrescoErr.textContent = "Debes introducir un precio de refresco";
            } else if (refresco.value < 0){
                refrescoErr.textContent = "El precio del refresco no puede ser negativo";
            } else {
                refrescoErr.textContent = "";
            }
        checkValidations();
        }
    });

    //Función para habilitar o deshabilitar el botón submit
    function checkValidations() {
        let valido = true;

        if (!tipoFiesta.value) valido = false;
        if (!ciudad.value) valido = false;
        if (!localizacion.value) valido = false;
        if (!fecha.value || fecha.value < fechaActual) valido = false;
        if (!hora.value || (fecha.value == fechaActual && hora.value < horaActual)) valido = false;
        if (!vestimenta.value) valido = false;
        if (!tipoMusica.value) valido = false;

        if (tipoFiesta.value === "discoteca"){
            const nombre = document.getElementById("nombreDiscoteca");
            const precioDisco = document.getElementById("precioDisco");
            if (!nombre.value) valido = false;
            if (!precioDisco.value) valido = false;
            
            if (!combinado.value || combinado.value < 0) valido = false;
            if (!cerveza.value || cerveza.value < 0) valido = false;
            if (!refresco.value || refresco.value < 0) valido = false;

        }else if (tipoFiesta.value == "fiestaPrivada"){
            const inputAlcohol = document.getElementById("alcohol");

            if (inputAlcohol.checked) {

                combinadoErr.textContent = "";
                cervezaErr.textContent = "";
                refrescoErr.textContent = "";
            } else {
    
                if (!combinado.value) valido = false;
                if (!cerveza.value) valido = false;
                if (!refresco.value) valido = false;
            }
        }

        botonSubmit.disabled = !valido;
        if (!valido) {
            botonSubmit.className = "btn btn-danger";
        } else {
            botonSubmit.className = "btn btn-success";
        }
    }
formFiesta.addEventListener("submit", async function(event){
        event.preventDefault();

        const inputNombre = document.getElementById("nombreDiscoteca");
        const inputPrecio = document.getElementById("precioDisco");
        const inputAlcohol = document.getElementById("alcohol");
        const alcoholChecked = inputAlcohol ? inputAlcohol.checked : false;
        const nombre = inputNombre ? inputNombre.value : '';
        const precio = inputPrecio ? inputPrecio.value : '';


        const datos = {
            tipo: tipoFiesta.value,
            ciudad: ciudad.value,
            localizacion: localizacion.value,
            fecha: fecha.value,
            hora: hora.value,
            vestimenta: vestimenta.value,
            musica: tipoMusica.value,
            precioCombinado: combinado.value,
            precioCerveza: cerveza.value,
            precioRefresco: refresco.value,
            nombre: nombre,  
            precio: precio,     
            tuAlcohol: alcoholChecked         
        };
        try {
            const respuesta = await fetch('http://127.0.0.1:3000/fiesta/crear', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });
    
            const resultado = await respuesta.json();
    
            if (respuesta.ok) {
                window.location.href = '/frontend/views/index/busqueda.html'; 
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
        }
    });
    
    
} else{
    window.location.href = "/frontend/views/usuarios/CrearUsuario.html"; 
}