if (sessionStorage.getItem('origen') == 'crear' || sessionStorage.getItem('origen') == 'inicio'){
    const tipo = document.getElementById("tipo")
    const tipoValor = sessionStorage.getItem("tipo");
    if (tipoValor === "discoteca") {
        tipo.textContent = "DISCOTECA";
    } else if (tipoValor === "fiesta") {
        tipo.textContent = "FIESTA PRIVADA";
    } else if (tipoValor === "ambas") {
        tipo.textContent = "AMBAS";
    }

    const fecha = document.getElementById("fecha");

    const fechaString = sessionStorage.getItem("fecha");
    const fechaObj = new Date(fechaString);

    const dia = fechaObj.getDate().toString().padStart(2, '0'); 
    const mes = (fechaObj.getMonth() + 1).toString().padStart(2, '0'); 
    const anio = fechaObj.getFullYear();

    fecha.textContent = `${dia}/${mes}/${anio}`;

    const usuario = JSON.parse(sessionStorage.getItem('usuario'));
    const datos = {
        fecha: fechaString,
        tipo: sessionStorage.getItem('tipo'),
        nombreUsuario: usuario.nombreUsuario
    };

    try{
        const respuesta = await fetch('http://127.0.0.1:3000/fiesta/buscar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });

        const resultado = await respuesta.json();

        if(respuesta.ok){
            mostrarFiestas(resultado.fiestas);
        }
    } catch (error){
        console.error("Error de conexión:", error);
    }
    
    try{
        const dato = {
            fecha: fechaString,
            nombreUsuario: usuario.nombreUsuario
        }
        console.log(dato)
        const response = await fetch('http://127.0.0.1:3000/fiesta/mostrar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dato)
        })
        const data = await response.json();
        const contenedorAmigos = document.getElementById('contenedorAmigos');
        contenedorAmigos.innerHTML = "";

        if (!data.amigosFiestas || data.amigosFiestas.length === 0) {
            contenedorAmigos.innerHTML = '<p class="text-white">No hay amigos con fiestas ese día.</p>';
        }

        data.amigosFiestas.forEach(amigoObj => {
            const amigoDiv = document.createElement('div');
            amigoDiv.classList.add('amigo-card', 'mb-3', 'p-2', 'bg-dark', 'text-light', 'rounded');

            let html = `<h5>${amigoObj.amigo}</h5><ul class="list-unstyled">`;

            amigoObj.fiestas.forEach(fiesta => {
                if (fiesta.nombre){
                    html += `<li>- <strong>Nombre:</strong>  ${fiesta.nombre}, <strong>Localización:</strong>  ${fiesta.localizacion}</li>`;
                }else{
                    html += ` <li>- <strong>Localización:</strong>  ${fiesta.localizacion}</li>`;
                }
                
            });

            html += '</ul>';

            amigoDiv.innerHTML = html;
            contenedorAmigos.appendChild(amigoDiv);
        });

    } catch (error){
        console.log("Error al cargar las fiestas de amigos", error);
    }

    const botonCiudad = document.getElementById("botonCiudad");
    botonCiudad.addEventListener("click", async () => {
        try{
            const fechaString = sessionStorage.getItem("fecha");
            const ciudad = usuario.ciudad
            const nombreUsuario = usuario.nombreUsuario;
            const datos =  {
                fecha: fechaString,
                tipo: sessionStorage.getItem("tipo"),
                nombreUsuario: nombreUsuario,
                ciudad: ciudad
            };
            const response = await fetch('http://127.0.0.1:3000/fiesta/cambiarCiudad', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });
            const resultado = await response.json();
            console.log(resultado);

            if (response.ok) {
                Swal.fire({
                        icon: 'success',
                        title: '¡Genial!',
                        text: `Ahora estás buscando en ${resultado.ciudadCambiada}`,
                        timer: 2000,
                        showConfirmButton: false
                    });
                usuario.ciudad = resultado.ciudadCambiada;
                document.getElementById("contenedorFiestas").innerHTML = ""
                mostrarFiestas(resultado.fiestas);
            } 
        }catch(error){
            console.error("Error de conexión:", error);
        }
    })
    
} else{
    window.location.href = "/frontend/views/usuarios/CrearUsuario.html"; 
}

function mostrarFiestas(fiestas) {
    const contenedor = document.getElementById("contenedorFiestas");
    const tipo = sessionStorage.getItem("tipo");
    let indiceActual = 0;

    if (!Array.isArray(fiestas) || fiestas.length === 0) {
        contenedor.innerHTML = "<p class='text-center text-danger'>No hay fiestas disponibles para esta fecha y tipo.</p>";
        return;
    }

    function renderFiesta(indice) {
    contenedor.innerHTML = "";

    if (indice >= fiestas.length) {
        const rutaDestino = "/frontend/views/index/busqueda.html";
        contenedor.innerHTML = `
            <div class="text-center text-success p-3">
                <p class="mb-4">¡Has revisado todas las fiestas!</p>
                <button id="reiniciar" class="btn btn-primary m-2">Volver a ver las fiestas</button>
                <button id="otraPagina" class="btn btn-secondary m-2">Página anterior</button>
            </div>
        `;
        document.getElementById("reiniciar").addEventListener("click", () => {
            indiceActual = 0;
            renderFiesta(indiceActual);
        });
        document.getElementById("otraPagina").addEventListener("click", () => {
            window.location.href = rutaDestino;
        });
        return;
    }

    const fiesta = fiestas[indice];
    const div = document.createElement("div");
    const div2 = document.createElement("div");
    div.classList.add("card", "m-2", "p-4", "tarjeta", "w-75");
    div2.classList.add("infor", "w-auto");

    if (tipo === "discoteca") {
        mostrarDiscoteca(div, div2, fiesta);
    } else if (tipo === "fiesta") {
        mostrarFiestaPrivada(div, div2, fiesta);
    } else {
        if (fiesta.nombre) {
            mostrarDiscoteca(div, div2, fiesta);
        } else {
            mostrarFiestaPrivada(div, div2, fiesta);
        }
    }

    contenedor.appendChild(div);
    contenedor.appendChild(div2);

    const btnFavorito = div.querySelector(".fav");
    const btnNo = div.querySelector(".dislike");

    if (btnFavorito) {
        btnFavorito.addEventListener("click", async () => {
            const usuario = JSON.parse(sessionStorage.getItem('usuario'));
            const nombreUsuario = usuario.nombreUsuario

            let fiestaParaEnviar = {
            ...fiesta,
            id: fiesta.id
            };

            try{
                 const respuesta = await fetch('http://127.0.0.1:3000/fiesta/unirse', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        nombreUsuario,  
                        fiesta: fiestaParaEnviar
                    })
                })
                const resultado = await respuesta.json();
    
                if (respuesta.ok) {
                    Swal.fire({
                        icon: 'success',
                        title: '¡Genial!',
                        text: 'Te has unido a la fiesta',
                        timer: 2000,
                        showConfirmButton: false
                    });
                } else {
                     Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: resultado.mensaje,
                        confirmButtonColor: '#d33'
                    });
                }
            } catch (error){
                console.error("Error al unirse a la fiesta:", error);
            }

            div.classList.add("swipe-left");
            div2.classList.add("swipe-left");
            setTimeout(() => {
                indiceActual++;
                renderFiesta(indiceActual);
            }, 500);
        });
    }

    if (btnNo) {
        btnNo.addEventListener("click", () => {
            div.classList.add("swipe-right");
            div2.classList.add("swipe-right");
            setTimeout(() => {
                indiceActual++;
                renderFiesta(indiceActual);
            }, 500);
        });
    }

    const icono = div.querySelector(".info-icon");
    const infoDiv = div2.querySelector(".info-extra");
    if (icono && infoDiv) {
        let click = false;
        icono.addEventListener("click", () => {
            click = !click;
            if (click) {
                div2.style.border = "2px solid black";
                div2.style.borderRadius = "10px";
                div2.style.padding = "10px";
                div2.style.backgroundColor = "#f8f9fa";
                if (!fiesta.tuAlcohol) {
                    infoDiv.innerHTML = `
                        <div class='text-dark p-3'>
                            <p><strong>Localización:</strong> ${fiesta.localizacion}</p>
                            <p><strong>Hora inicio:</strong> ${fiesta.hora}</p>
                            <p><strong>Tipo de música:</strong> ${fiesta.musica}</p>
                            <p><strong>Vestimenta:</strong> ${fiesta.vestimenta}</p>
                            <p><strong>Precio combinado:</strong> ${fiesta.precioCombinado} €</p>
                            <p><strong>Precio cerveza:</strong> ${fiesta.precioCerveza} €</p>
                            <p><strong>Precio refresco:</strong> ${fiesta.precioRefresco} €</p>
                        </div>
                    `;
                } else {
                    infoDiv.innerHTML = `
                        <div class='text-dark p-3'>
                            <p><strong>Localización:</strong> ${fiesta.localizacion}</p>
                            <p><strong>Hora inicio:</strong> ${fiesta.hora}</p>
                            <p><strong>Tipo de música:</strong> ${fiesta.musica}</p>
                            <p><strong>Vestimenta:</strong> ${fiesta.vestimenta}</p>
                        </div>
                    `;
                }
            } else {
                infoDiv.innerHTML = "";
                div2.style.border = "0";
                div2.style.borderRadius = "10px";
                div2.style.padding = "10px";
                div2.style.backgroundColor = "transparent";
            }
        });
    }
}


    renderFiesta(indiceActual); 
}



function mostrarDiscoteca(div, div2, fiesta) {
    div2.innerHTML = `
                <div class="info-extra"></div>
            `
            div.innerHTML = `
                <div class="d-flex justify-content-between align-items-center w-100">
                    <h3 class="mb-0">${fiesta.nombre}</h3>
                    <i class="fa-solid fa-bars info-icon" style="cursor:pointer;"></i>
                </div>
                <p class='mt-2'><strong>Ubicación:</strong> ${fiesta.localizacion}</p>
                <p><strong>Hora inicio:</strong> ${fiesta.hora}</p>
                <p><strong>Tipo de música:</strong> ${fiesta.musica}</p>
                <div class="d-flex justify-content-between align-items-center w-100">
                    <p><strong>Precio:</strong> ${fiesta.precio} €</p>
                    <span><i class="fa-solid fa-user"></i> ${fiesta.contador}</span>
                </div>   
                <div class="d-flex justify-content-center align-items-center w-100">
                    <i class="fav fa-solid fa-heart mr-2"></i>
                    <i class="dislike fa-solid fa-x ml-2"></i>
                </div>
            `;
}

function mostrarFiestaPrivada(div, div2, fiesta){
     const alcohol = fiesta.tuAlcohol ? "Sí" : "No";
        div2.innerHTML = `
            <div class="info-extra mt-2"></div>
        `
        div.innerHTML = `
            <div class="d-flex justify-content-between align-items-center w-100">
                <h3 class="mb-0">${fiesta.localizacion}</h3>
                <i class="fa-solid fa-bars info-icon" style="cursor:pointer;"></i>
            </div>  
            <p class='mt-2'><strong>Hora inicio:</strong> ${fiesta.hora}</p>
            <p><strong>Tipo de música:</strong> ${fiesta.musica}</p>
            <div class="d-flex justify-content-between align-items-center w-100">
                <p><strong>Tu alcohol:</strong> ${alcohol}</p>
                <span><i class="fa-solid fa-user"></i> ${fiesta.contador}</span>
            </div>   
            <div class="d-flex justify-content-center align-items-center w-100">
                <i class="fav fa-solid fa-heart mr-2"></i>
                <i class="dislike fa-solid fa-x ml-2"></i>
            </div>
        `;
}