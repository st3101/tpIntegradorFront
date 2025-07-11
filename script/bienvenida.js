document.addEventListener("DOMContentLoaded", () => {
  const nombre = sessionStorage.getItem("nombreUsuario");

  if (!nombre) {
    // Si no hay nombre en sessionStorage, redirige a la página de bienvenida
    window.location.href = "welcome.html";  // Cambia por el nombre correcto de tu página de ingreso
    return;
  }

  // Si hay nombre, muestra el mensaje
  const bienvenida = document.getElementById("bienvenida-usuario");
  bienvenida.textContent = `¡Bienvenido/a ${nombre}!`;
});