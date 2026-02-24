/*************************
 NINA SPORT - DASHBOARD
**************************/

/* ===============================
   SEGURIDAD
================================ */

const sesion = JSON.parse(localStorage.getItem("usuarioActivo"));
if (!sesion || sesion.rol === "cliente") {
  location.href = "login.html";
}

/* ===============================
   USUARIOS
================================ */

const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
const clientes = usuarios.filter(u => u.rol === "cliente");

/* ===============================
   CANVAS
================================ */

const ctx1 = document.getElementById("graficaUsuarios");
const ctx2 = document.getElementById("graficaProgreso");

/* ===============================
   GRAFICA CLIENTES
================================ */

new Chart(ctx1, {
  type: "doughnut",
  data: {
    labels: ["Clientes registradas"],
    datasets: [{
      label: "Total",
      data: [clientes.length],
      borderWidth: 2
    }]
  },
  options:{
    plugins:{
      legend:{ labels:{ color:"white" } }
    }
  }
});

/* ===============================
   GRAFICA PROGRESO REAL
   (usa medidas_usuario)
================================ */

let totalMedidas = 0;

clientes.forEach(c => {
  const key = "medidas_" + c.user;
  const historial = JSON.parse(localStorage.getItem(key)) || [];
  totalMedidas += historial.length;
});

new Chart(ctx2, {
  type: "bar",
  data: {
    labels: ["Registros corporales"],
    datasets: [{
      label: "Total de mediciones",
      data: [totalMedidas],
      borderWidth: 2
    }]
  },
  options:{
    plugins:{
      legend:{ labels:{ color:"white" } }
    },
    scales:{
      y:{ ticks:{ color:"white" }},
      x:{ ticks:{ color:"white" }}
    }
  }
});

