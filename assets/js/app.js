// assets/js/app.js

document.addEventListener("DOMContentLoaded", () => {
  // Cargar header y footer
  const headerEl = document.getElementById("header-placeholder");
  const footerEl = document.getElementById("footer-placeholder");

  if (headerEl) {
    fetch("../includes/header.html")
      .then(r => r.text())
      .then(data => headerEl.innerHTML = data)
      .then(() => {
        actualizarBotonLogin(); // Actualiza el botón de login/logout
      });
  }

  if (footerEl) {
    fetch("../includes/footer.html")
      .then(r => r.text())
      .then(data => footerEl.innerHTML = data);
  }

  // Actualizar CTA al cargar
  if (typeof actualizarCTA === 'function') {
    actualizarCTA();
  }
});

// Función para actualizar el botón de login/logout
function actualizarBotonLogin() {
  const container = document.getElementById("login-btn-container");
  const usuario = JSON.parse(localStorage.getItem("usuarioActivo"));

  if (usuario) {
    // Usuario logueado → mostrar "Cerrar Sesión"
    container.innerHTML = `
      <button id="logoutBtn" class="btn-logout">Cerrar Sesión</button>
    `;
    
    document.getElementById("logoutBtn").addEventListener("click", () => {
      localStorage.removeItem("usuarioActivo");
      window.location.href = "../auth/login.html";
    });
  } else {
    // Usuario no logueado → mostrar "Iniciar Sesión"
    container.innerHTML = `
      <a href="../auth/login.html" class="btn-login">Iniciar Sesión</a>
    `;
  }
}

// Función para actualizar el CTA (si se llama desde index.html)
function actualizarCTA() {
  const ctaSection = document.getElementById("ctaSection");
  const usuario = JSON.parse(localStorage.getItem("usuarioActivo"));

  if (usuario) {
    // Usuario logueado → ocultar CTA
    ctaSection.style.display = "none";
  } else {
    // Usuario no logueado → mostrar CTA
    ctaSection.style.display = "block";
  }
}
