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
     fetch('http://localhost:3000/fiesta/buscar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            fecha: fechaString,  // Se manda en formato YYYY-MM-DD
            tipo: sessionStorage.getItem("tipo")
        })
    })
    .then(response => response.json())
    .then(data => {
        mostrarFiestas(data);
    })
    .catch(error => console.error('Error al obtener fiestas:', error));
} else{
    window.location.href = "/frontend/views/usuarios/CrearUsuario.html"; 
}
function mostrarFiestas(fiestas) {
    const contenedor = document.getElementById("contenedorFiestas");
    contenedor.innerHTML = ""; // Limpiar el contenedor antes de añadir nuevas fiestas

    if (fiestas.length === 0) {
        contenedor.innerHTML = "<p class='text-center text-danger'>No hay fiestas disponibles para esta fecha y tipo.</p>";
        return;
    }

    fiestas.forEach(fiesta => {
        const div = document.createElement("div");
        div.classList.add("card", "m-2", "p-3");

        div.innerHTML = `
            <h4>${fiesta.nombre}</h4>
            <p><strong>Ubicación:</strong> ${fiesta.ubicacion}</p>
            <p><strong>Hora:</strong> ${fiesta.hora}</p>
            <p><strong>Descripción:</strong> ${fiesta.descripcion}</p>
        `;

        contenedor.appendChild(div);
    });
}

