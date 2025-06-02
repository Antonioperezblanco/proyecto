document.addEventListener("DOMContentLoaded", async () => {
  const usuario = JSON.parse(sessionStorage.getItem("usuario"));
  if (!usuario) {
    window.location.href = "/frontend/views/usuarios/CrearUsuario.html";
    return;
  }

  const hoy = new Date().toISOString().split("T")[0];

  try {
    const datos = {
            nombreUsuario: usuario.nombreUsuario,
            desde: hoy    
        };
    const response = await fetch("http://127.0.0.1:3000/fiesta/misFiestas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.mensaje || "Error al obtener fiestas");

    mostrarFiestas(data.fiestas);
  } catch (error) {
    console.error("Error:", error);
  }
});

function mostrarFiestas(fiestas) {
  const contenedor = document.getElementById("misFiestasContainer");
  if (!fiestas || fiestas.length === 0) {
    contenedor.innerHTML = "<p>No tienes fiestas próximas.</p>";
    return;
  }

  const fiestasPorMes = {};
  fiestas.forEach(f => {
    const fecha = new Date(f.fecha);
    const mesNombre = fecha.toLocaleString("es-ES", { month: "long" });
    const año = fecha.getFullYear();
    const clave = `${mesNombre} ${año}`;

    const dia = fecha.getDate().toString().padStart(2, '0');
    const diaNum = fecha.getDate(); 
    const nombre = f.nombre || f.localizacion || "Fiesta";

    if (!fiestasPorMes[clave]) fiestasPorMes[clave] = [];

    fiestasPorMes[clave].push({ dia, diaNum, nombre, id: f.id });
  });

  contenedor.innerHTML = "";
  for (const [mesCompleto, lista] of Object.entries(fiestasPorMes)) {
    lista.sort((a, b) => a.diaNum - b.diaNum);

    const mesDiv = document.createElement("div");
    mesDiv.classList.add("mes");
    mesDiv.textContent = mesCompleto;
    contenedor.appendChild(mesDiv);

    lista.forEach(f => {
      const item = document.createElement("div");
      item.classList.add("fiesta-item");

      const textoDiv = document.createElement("div");
      textoDiv.textContent = `${f.dia} - ${f.nombre}`;

      const btnEliminar = document.createElement("button");
      btnEliminar.textContent = "Eliminar";
      btnEliminar.classList.add("btn-eliminar", "btn", "btn-danger");

      btnEliminar.addEventListener("click", () => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "Esta acción no se puede deshacer.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
            desapuntarseDeFiesta(f.id, item);
            }
        });
});

      item.style.display = "flex";
      item.style.alignItems = "center";
      item.style.justifyContent = "space-between";
      item.style.padding = "5px 0";

      item.appendChild(textoDiv);
      item.appendChild(btnEliminar);

      contenedor.appendChild(item);
    });
  }
}

async function desapuntarseDeFiesta(idFiesta, elementoDOM) {
  try {
    const usuario = JSON.parse(sessionStorage.getItem("usuario"));
    if (!usuario) {
      alert("Usuario no logueado");
      return;
    }

    const datos = {
      nombreUsuario: usuario.nombreUsuario,
      idFiesta: idFiesta
    };

    const response = await fetch("http://127.0.0.1:3000/fiesta/desapuntarse", {
      method: "POST", 
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos)
    });

    const result = await response.json();

    if (!response.ok) {
      Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: result.mensaje,
                confirmButtonColor: '#d33'
            });
      return;
    }

    elementoDOM.remove();
  } catch (error) {
    console.error("Error al desapuntarse:", error);
  }
}
