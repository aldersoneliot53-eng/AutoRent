// assets/js/auth.js

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");

  // =========================
  // REGISTRO DE CLIENTES
  // =========================
  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const nombre = document.getElementById("nombre").value.trim();
      const dni = document.getElementById("dni").value.trim();
      const telefono = document.getElementById("telefono").value.trim();
      const email = document.getElementById("email").value.trim().toLowerCase();
      const password = document.getElementById("password").value;

      // Validaciones
      if (!/^\d{8}$/.test(dni)) {
        alert("El DNI debe tener 8 dígitos.");
        return;
      }

      if (!/^9\d{8}$/.test(telefono)) {
        alert("El teléfono debe tener 9 dígitos y empezar con 9.");
        return;
      }

      if (password.length < 6) {
        alert("La contraseña debe tener al menos 6 caracteres.");
        return;
      }

      // Obtener usuarios existentes
      let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

      // Evitar duplicados
      if (usuarios.some(u => u.email === email)) {
        alert("Este correo ya está registrado.");
        return;
      }

      // Verificar si es el admin (no se registra, pero no impide crear cliente con ese correo)
      if (email === "admin@admin.com") {
        alert("Esta dirección de correo está reservada para el administrador. Usa otra.");
        return;
      }

      // Registrar como cliente normal
      // En auth.js - registro
      usuarios.push({
        nombre: document.getElementById("nombre").value.trim(), // ✅ Asegúrate que sea .trim()
        dni,
        telefono,
        email,
        password,
        rol: "cliente"
      });

      localStorage.setItem("usuarios", JSON.stringify(usuarios));
      alert("✅ Registro exitoso. Ahora puedes iniciar sesión.");
      registerForm.reset();
      window.location.href = "login.html";
    });
  }

  // =========================
  // INICIO DE SESIÓN
  // =========================
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = document.getElementById("email").value.trim().toLowerCase();
      const password = document.getElementById("password").value;

      // Cuenta predefinida del ADMIN
      if (email === "admin@admin.com" && password === "Admin123") {
        const adminData = {
          nombre: "Administrador",
          rol: "admin",
          email: "admin@admin.com"
        };
        localStorage.setItem("usuarioActivo", JSON.stringify(adminData));
        window.location.href = "../admin/dashboard.html";
        return;
      }

      // Buscar en clientes registrados
      const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
      const usuario = usuarios.find(u => u.email === email && u.password === password);

      // En auth.js - dentro del evento submit del loginForm
        if (usuario) {
        localStorage.setItem("usuarioActivo", JSON.stringify({
          nombre: usuario.nombre,     // ✅ Guardamos el nombre
          rol: usuario.rol,
          email: usuario.email
        }));
        window.location.href = "../cliente/index.html";
      } else {
        alert("❌ Correo o contraseña incorrectos. Intenta de nuevo.");
      }
    });
  }
});
// Cuando inicia sesión
if (usuario.email === "admin@admin.com" && password === "Admin123") {
  localStorage.setItem("usuarioActivo", JSON.stringify({
    nombre: "Administrador",
    rol: "admin",
    email: "admin@admin.com"
  }));
  window.location.href = "../admin/dashboard.html";
} else {
  // Buscar en clientes
  const cliente = usuarios.find(u => u.email === email && u.password === password);
  if (cliente) {
    localStorage.setItem("usuarioActivo", JSON.stringify({
      nombre: cliente.nombre,
      rol: "cliente",
      email: cliente.email
    }));
    window.location.href = "../cliente/index.html";
  } else {
    alert("Credenciales incorrectas");
  }
}