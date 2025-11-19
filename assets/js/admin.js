// assets/js/admin.js
function requireAdmin() {
  const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));

  if (!usuarioActivo || usuarioActivo.rol !== "admin") {
    window.location.href = "../auth/login.html";
    return false;
  }

  const adminNameEl = document.getElementById("admin-name");
  if (adminNameEl && usuarioActivo.nombre) {
    adminNameEl.textContent = usuarioActivo.nombre;
  }

  return true;
}

document.addEventListener("DOMContentLoaded", () => {
  requireAdmin();
});
// assets/js/admin.js
function requireAdmin() {
  const user = JSON.parse(localStorage.getItem("usuarioActivo"));

  if (!user || 
      user.email !== "admin@admin.com" || 
      user.rol !== "admin") {
    window.location.href = "../auth/login.html";
  }
}
// assets/js/admin.js

function requireAdmin() {
  const user = JSON.parse(localStorage.getItem("usuarioActivo"));

  if (!user || user.email !== "admin@admin.com" || user.rol !== "admin") {
    window.location.href = "../auth/login.html";
    return false;
  }

  const adminNameEl = document.getElementById("admin-name");
  if (adminNameEl && user.nombre) {
    adminNameEl.textContent = user.nombre;
  }

  return true;
}

document.addEventListener("DOMContentLoaded", () => {
  requireAdmin();
});