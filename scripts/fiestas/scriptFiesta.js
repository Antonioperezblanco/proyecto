if (sessionStorage.getItem('origen') == 'crear' || sessionStorage.getItem('origen') == 'inicio'){
    const tipo = document.getElementById("tipo")
    if (sessionStorage.getItem("tipo") == "discoteca"){
        tipo.textContent = "DISCOTECA";
    }else if (sessionStorage.getItem("tipo") == "fiesta"){
        tipo.textContent = "FIESTA PRIVADA";
    }
    if (sessionStorage.getItem("tipo") == "ambas"){
        tipo.textContent = "AMBAS";
    }
    const fecha = document.getElementById("fecha");

    const fechaString = sessionStorage.getItem("fecha");
    const fechaObj = new Date(fechaString);

    const dia = fechaObj.getDate().toString().padStart(2, '0'); 
    const mes = (fechaObj.getMonth() + 1).toString().padStart(2, '0'); 
    const anio = fechaObj.getFullYear();

    fecha.textContent = `${dia}/${mes}/${anio}`;

     // Enviar al backend
    const datos = {
        fecha: fechaString,
        tipo: sessionStorage.getItem('tipo')
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

} else{
    window.location.href = "/frontend/views/usuarios/CrearUsuario.html"; 
}
function mostrarFiestas(fiestas) {
    const contenedor = document.getElementById("contenedorFiestas");
    contenedor.innerHTML = ""; // Limpiar el contenedor antes de añadir nuevas fiestas

    if (!Array.isArray(fiestas) || fiestas.length === 0) {
        contenedor.innerHTML = "<p class='text-center text-danger'>No hay fiestas disponibles para esta fecha y tipo.</p>";
        return;
    }

    fiestas.forEach(fiesta => {
       
        if (sessionStorage.getItem("tipo") == "discoteca"){
            const div = document.createElement("div");
            div.classList.add("card", "m-2", "p-3", "tarjeta");
            div.innerHTML = `
            <h3>${fiesta.nombre}</h3>
            <p><strong>Ubicación:</strong> ${fiesta.localizacion}</p>
            <p><strong>Hora:</strong> ${fiesta.hora}</p>
            <p><strong>Tipo de música:</strong> ${fiesta.musica}</p>
        `;

        contenedor.appendChild(div);
        } else{
            const div = document.createElement("div");
            if (fiesta.tuAlcohol){
                fiesta.tuAlcohol = "Si"
            }else{
                fiesta.tuAlcohol = "No"
            }
            div.classList.add("card", "m-2", "p-3", "tarjeta");
            div.innerHTML = `
            <h3>${fiesta.localizacion}</h3>
            <p><strong>Hora:</strong> ${fiesta.hora}</p>
            <p><strong>Tipo de música:</strong> ${fiesta.musica}</p>
            <p><strong>Tu alcohol:</strong> ${fiesta.tuAlcohol}</p>
        `;

        contenedor.appendChild(div);
        }
        
    });
}

