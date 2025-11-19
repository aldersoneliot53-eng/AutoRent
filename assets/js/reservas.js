// assets/js/reservas.js

document.addEventListener("DOMContentLoaded", () => {
  const formRequisitos = document.getElementById("requisitosForm");
  const formOpciones = document.getElementById("opcionesForm");
  const formPago = document.getElementById("pagoForm");

  // Paso 1: Requisitos
  if (formRequisitos) {
    formRequisitos.addEventListener("submit", (e) => {
      e.preventDefault();

      const dni = document.getElementById("dni").value;
      const licencia = document.getElementById("licencia").value;
      const fechaNac = document.getElementById("fechaNac").value;
      const telefono = document.getElementById("telefono").value;
      const email = document.getElementById("email").value;
      const fechaInicio = document.getElementById("fechaInicio").value;
      const fechaFin = document.getElementById("fechaFin").value;

      // Validar edad
      if (!validarEdad(fechaNac)) {
        alert("Debes tener al menos 21 años.");
        return;
      }

      // Calcular días
      const dias = Math.ceil((new Date(fechaFin) - new Date(fechaInicio)) / (1000 * 60 * 60 * 24));
      if (dias <= 0) {
        alert("La fecha de fin debe ser posterior a la de inicio.");
        return;
      }

      // Obtener auto seleccionado
      const auto = JSON.parse(localStorage.getItem("autoSeleccionado")) || { modelo: "Toyota Corolla", precio: 120 };

      // Guardar datos temporales
      const datos = {
        dni,
        licencia,
        fechaNac,
        telefono,
        email,
        fechaInicio,
        fechaFin,
        dias,
        auto: auto.modelo,
        precioDiario: auto.precio,
        img: auto.img
      };

      localStorage.setItem("reservaTemporal", JSON.stringify(datos));
      window.location.href = "paso2-opciones.html";
    });
  }

  // Paso 2: Opciones
  if (formOpciones) {
    const auto = JSON.parse(localStorage.getItem("autoSeleccionado")) || {};
    const reserva = JSON.parse(localStorage.getItem("reservaTemporal")) || {};

    // Mostrar info del auto y días
    document.getElementById("auto-seleccionado").textContent = `${auto.modelo} (S/ ${auto.precio}/día)`;
    document.getElementById("dias-reserva").textContent = `Duración: ${reserva.dias} días`;

    formOpciones.addEventListener("submit", (e) => {
      e.preventDefault();
      const extras = [];
      document.querySelectorAll('input[name="extras"]:checked').forEach(cb => {
        extras.push({
          nombre: cb.value,
          precio: cb.dataset.precio
        });
      });

      reserva.extras = extras;
      localStorage.setItem("reservaTemporal", JSON.stringify(reserva));
      window.location.href = "paso3-metodo-pago.html";
    });
  }

  // Paso 3: Pago
  if (formPago) {
    const reserva = JSON.parse(localStorage.getItem("reservaTemporal")) || {};
    const detalles = document.getElementById("detalle-reserva");

    // Calcular total
    let total = reserva.precioDiario * reserva.dias;
    if (reserva.extras) {
      total += reserva.extras.reduce((acc, e) => acc + (parseInt(e.precio) * reserva.dias), 0);
    }

    // Mostrar resumen
    detalles.innerHTML = `
      <li><strong>Auto:</strong> ${reserva.auto}</li>
      <li><strong>Fechas:</strong> ${reserva.fechaInicio} - ${reserva.fechaFin}</li>
      <li><strong>Días:</strong> ${reserva.dias}</li>
      <li><strong>Servicios:</strong> ${reserva.extras?.map(e => e.nombre).join(", ") || "Ninguno"}</li>
      <li><strong>Método de Pago:</strong> ${document.querySelector('input[name="metodo"]:checked')?.value === 'tarjeta' ? 'Tarjeta' : 'Efectivo en agencia'}</li>
      <li><strong>Total a pagar:</strong> S/ ${total}</li>
    `;

    formPago.addEventListener("submit", (e) => {
      e.preventDefault();
      const metodo = document.querySelector('input[name="metodo"]:checked').value;

      reserva.metodoPago = metodo;
      if (metodo === "tarjeta") {
        const numTarjeta = document.getElementById("numTarjeta").value;
        if (!validarTarjeta(numTarjeta)) {
          alert("Número de tarjeta inválido.");
          return;
        }
        reserva.datosTarjeta = {
          num: numTarjeta,
          expira: document.getElementById("expira").value,
          cvv: document.getElementById("cvv").value,
          nombre: document.getElementById("nombreTarjeta").value
        };
      }

      // Obtener el nombre del usuario desde usuarioActivo
      const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));

      // Simular ID y estado
      reserva.id = Date.now();
      reserva.estado = "Pendiente";
      reserva.total = total;
      reserva.email = usuarioActivo.email; // Para filtrar en cliente/reservas.html
      reserva.nombreCliente = usuarioActivo.nombre || "Sin nombre"; // ← ¡Este es el cambio clave!

      // Guardar en historial
      const reservas = JSON.parse(localStorage.getItem("reservas")) || [];
      reservas.push(reserva);
      localStorage.setItem("reservas", JSON.stringify(reservas));

      // Limpiar temporal
      localStorage.removeItem("reservaTemporal");

      // Ir a confirmación
      window.location.href = "paso4-confirmacion.html";
    });
  }

  // Paso 4: Confirmación
  if (document.querySelector(".confirm-page")) {
    const reserva = JSON.parse(localStorage.getItem("reservas"))?.at(-1);
    const detalle = document.getElementById("detalle-reserva");

    if (reserva && detalle) {
      detalle.innerHTML = `
        <li><strong>Auto:</strong> ${reserva.auto || "Toyota Corolla"}</li>
        <li><strong>Fechas:</strong> ${reserva.fechaInicio} - ${reserva.fechaFin}</li>
        <li><strong>Días:</strong> ${reserva.dias}</li>
        <li><strong>Servicios:</strong> ${reserva.extras?.map(e => e.nombre).join(", ") || "Ninguno"}</li>
        <li><strong>Método de Pago:</strong> ${reserva.metodoPago === 'tarjeta' ? 'Tarjeta' : 'Efectivo en agencia'}</li>
        <li><strong>Total a pagar:</strong> S/ ${reserva.total}</li>
      `;
    }
  }
});

// Funciones de validación (pueden ir en validaciones.js)
function validarEdad(fechaNac) {
  const hoy = new Date();
  const nacimiento = new Date(fechaNac);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();
  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) edad--;
  return edad >= 21;
}

function validarTarjeta(num) {
  return /^\d{16}$/.test(num);
}

// Este bloque ya no es necesario porque está dentro del submit
// Lo comento para evitar duplicados
/*
const nuevaReserva = {
  id: Date.now(),
  auto: datos.auto,
  fechaInicio: datos.fechaInicio,
  fechaFin: datos.fechaFin,
  total: calcularTotal(datos),
  estado: "Pendiente",
  email: usuario.email
};

reservas.push(nuevaReserva);
localStorage.setItem("reservas", JSON.stringify(reservas));
*/