// assets/js/reservas-admin.js

// Cargar reservas al iniciar la página
document.addEventListener("DOMContentLoaded", () => {
  // Verificar que estamos en la página de gestión de reservas
  const tabla = document.getElementById("tablaReservas");
  if (!tabla) return;

  cargarReservas();
});

function cargarReservas() {
  const tbody = document.querySelector("#tablaReservas tbody");
  tbody.innerHTML = ""; // Limpiar contenido previo

  const reservas = JSON.parse(localStorage.getItem("reservas")) || [];

  if (reservas.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td colspan="7" style="text-align: center;">No hay reservas registradas.</td>`;
    tbody.appendChild(tr);
    return;
  }

  reservas.forEach(reserva => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${reserva.id}</td>
      <td>${reserva.nombreCliente || "Sin nombre"}</td>
      <td>${reserva.auto || "Toyota Corolla"}</td>
      <td>${reserva.fechaInicio} - ${reserva.fechaFin}</td>
      <td>S/ ${reserva.total || "0"}</td>
      <td><span class="status ${reserva.estado?.toLowerCase() || 'pending'}">${reserva.estado || 'Pendiente'}</span></td>
      <td>
        <button class="btn-confirm" data-id="${reserva.id}">Confirmar</button>
        <button class="btn-reject" data-id="${reserva.id}">Rechazar</button>
      </td>
    `;

    tbody.appendChild(tr);
  });

  // Añadir eventos a los botones
  document.querySelectorAll(".btn-confirm").forEach(btn => {
    btn.addEventListener("click", confirmarReserva);
  });

  document.querySelectorAll(".btn-reject").forEach(btn => {
    btn.addEventListener("click", rechazarReserva);
  });
}

// Confirmar una reserva
function confirmarReserva(e) {
  const id = e.target.dataset.id;
  let reservas = JSON.parse(localStorage.getItem("reservas")) || [];
  
  reservas = reservas.map(r => {
    if (r.id == id) {
      r.estado = "Confirmada";
    }
    return r;
  });

  localStorage.setItem("reservas", JSON.stringify(reservas));
  alert(`Reserva #${id} confirmada.`);
  cargarReservas(); // Recargar la tabla
}

// Rechazar una reserva
function rechazarReserva(e) {
  const id = e.target.dataset.id;
  let reservas = JSON.parse(localStorage.getItem("reservas")) || [];
  
  reservas = reservas.map(r => {
    if (r.id == id) {
      r.estado = "Rechazada";
    }
    return r;
  });

  localStorage.setItem("reservas", JSON.stringify(reservas));
  alert(`Reserva #${id} rechazada.`);
  cargarReservas(); // Recargar la tabla
}

function confirmarReserva(id) {
  let reservas = JSON.parse(localStorage.getItem("reservas")) || [];
  const index = reservas.findIndex(r => r.id == id);
  
  if (index !== -1) {
    reservas[index].estado = "Confirmada";
    localStorage.setItem("reservas", JSON.stringify(reservas));
    cargarReservas(); // Vuelve a mostrar la tabla
    alert("✅ Reserva confirmada.");
  }
}