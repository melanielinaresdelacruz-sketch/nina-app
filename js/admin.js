function cargarRutina(mes) {
  let rutinas = JSON.parse(localStorage.getItem("rutinas")) || {};

  if (!rutinas[mes]) {
    rutinas[mes] = {
      mes: mes,
      dias: {
        lunes: [],
        martes: [],
        miercoles: [],
        jueves: [],
        viernes: []
      }
    };
  }

  localStorage.setItem("rutinas", JSON.stringify(rutinas));
  mostrarRutina(rutinas[mes]);
}

let ejercicios = [];

function agregarEjercicio() {
  const nombre = document.getElementById("nombre").value;
  const series = document.getElementById("series").value;
  const reps = document.getElementById("reps").value;
  const video = document.getElementById("video").value;

  if (!nombre || !series || !reps) {
    alert("Completa todos los campos");
    return;
  }

  ejercicios.push({ nombre, series, reps, video });
  mostrarLista();

  document.getElementById("nombre").value = "";
  document.getElementById("series").value = "";
  document.getElementById("reps").value = "";
  document.getElementById("video").value = "";
}

function mostrarLista() {
  const lista = document.getElementById("lista");
  lista.innerHTML = "";

  ejercicios.forEach((e, i) => {
    lista.innerHTML += `
      <p>
        ${e.nombre} (${e.series}x${e.reps})
        <button onclick="eliminar(${i})">❌</button>
      </p>
    `;
  });
}

function eliminar(i) {
  ejercicios.splice(i, 1);
  mostrarLista();
}

function guardarRutina() {
  const mes = document.getElementById("mes").value;
  const usuario = document.getElementById("usuario").value;
  const dia = document.getElementById("dia").value;

  if (!mes || !usuario || ejercicios.length === 0) {
    alert("Faltan datos");
    return;
  }

  let rutinas = JSON.parse(localStorage.getItem("rutinas")) || {};

  if (!rutinas[mes]) rutinas[mes] = {};
  if (!rutinas[mes][usuario]) rutinas[mes][usuario] = {};

  rutinas[mes][usuario][dia] = ejercicios;

  localStorage.setItem("rutinas", JSON.stringify(rutinas));

  ejercicios = [];
  mostrarLista();

  alert("✅ Rutina guardada");
}

let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
let admin = JSON.parse(localStorage.getItem("usuarioActivo"));

if (!admin || admin.rol !== "admin") {
  window.location.href = "login.html";
}

/* =====================
   CREAR CLIENTE
===================== */

function crearCliente() {
  const nombre = document.getElementById("nombre").value.trim();
  const user = document.getElementById("user").value.trim();
  const pass = document.getElementById("pass").value.trim();
  const msg = document.getElementById("msg");

  if (!nombre || !user || !pass) {
    msg.innerText = "⚠️ Completa todos los campos";
    msg.style.color = "red";
    return;
  }

  if (usuarios.some(u => u.user === user)) {
    msg.innerText = "⚠️ Ese usuario ya existe";
    msg.style.color = "red";
    return;
  }

  const nuevo = {
    nombre,
    user,
    pass,
    rol: "cliente",
    historial: [],
    rutinas: {},
    diasCompletados: []
  };

  usuarios.push(nuevo);
  localStorage.setItem("usuarios", JSON.stringify(usuarios));

  msg.innerText = "✅ Cliente creado correctamente";
  msg.style.color = "green";

  document.getElementById("nombre").value = "";
  document.getElementById("user").value = "";
  document.getElementById("pass").value = "";

  mostrarClientes();
}

/* =====================
   MOSTRAR CLIENTES
===================== */

function mostrarClientes() {
  const cont = document.getElementById("listaClientes");
  cont.innerHTML = "";

  usuarios
    .filter(u => u.rol === "cliente")
    .forEach((c, index) => {
      cont.innerHTML += `
        <div class="cliente-card">
          <strong>${c.nombre}</strong><br>
          Usuario: ${c.user}<br>
          <button onclick="eliminarCliente(${index})">🗑 Eliminar</button>
        </div>
      `;
    });
}

/* =====================
   ELIMINAR
===================== */

function eliminarCliente(i) {
  if (!confirm("¿Eliminar este cliente?")) return;

  usuarios.splice(i, 1);
  localStorage.setItem("usuarios", JSON.stringify(usuarios"));
  mostrarClientes();
}

mostrarClientes();