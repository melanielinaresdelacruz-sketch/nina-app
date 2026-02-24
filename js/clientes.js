/* =========================
   NINA SPORT - CLIENTAS
========================= */

function getUsuarios() {
  return JSON.parse(localStorage.getItem("usuarios")) || [];
}

function setUsuarios(u) {
  localStorage.setItem("usuarios", JSON.stringify(u));
}

/* =========================
   CREAR CLIENTA
========================= */
window.registrar = function () {

  const nombre = document.getElementById("nombre").value.trim();
  const user = document.getElementById("usuario").value.trim();
  const pass = document.getElementById("password").value.trim();
  const msg = document.getElementById("msg");

  if (!nombre || !user || !pass) {
    msg.innerText = "⚠️ Completa todos los campos";
    msg.style.color = "red";
    return;
  }

  let usuarios = getUsuarios();

  if (usuarios.some(u => u.user === user)) {
    msg.innerText = "⚠️ Ese usuario ya existe";
    msg.style.color = "red";
    return;
  }

  usuarios.push({
    nombre,
    user,
    pass,
    rol: "cliente",
    rutinas: {},
    racha: { dias: 0, ultima: null }
  });

  setUsuarios(usuarios);

  msg.innerText = "✅ Clienta creada correctamente";
  msg.style.color = "green";

  document.getElementById("nombre").value = "";
  document.getElementById("usuario").value = "";
  document.getElementById("password").value = "";

  mostrarClientes();
};

/* =========================
   MOSTRAR CLIENTAS
========================= */
function mostrarClientes() {

  const contenedor = document.getElementById("listaClientes");
  if (!contenedor) return;

  const usuarios = getUsuarios();
  const clientas = usuarios.filter(u => u.rol === "cliente");

  contenedor.innerHTML = "";

  if (clientas.length === 0) {
    contenedor.innerHTML = "<p>No hay clientas registradas</p>";
    return;
  }

  clientas.forEach(c => {

    const div = document.createElement("div");
    div.className = "card mini-card";

    div.innerHTML = `
      <h3>👩 ${c.nombre}</h3>
      <p>Usuario: ${c.user}</p>

      <div class="acciones">
        <button onclick="verMedidas('${c.user}')">📏 Medidas</button>
        <button onclick="verRutinas('${c.user}')">🏋️ Rutinas</button>
        <button onclick="eliminarCliente('${c.user}')">🗑 Eliminar</button>
      </div>
    `;

    contenedor.appendChild(div);
  });
}

/* =========================
   ACCIONES
========================= */
window.verMedidas = function (user) {
  const usuarios = getUsuarios();
  const cliente = usuarios.find(u => u.user === user);

  if(!cliente){
    alert("Clienta no encontrada");
    return;
  }

  localStorage.setItem("clienteActivo", JSON.stringify(cliente));
  location.href = "admin-medidas.html";
};

window.verRutinas = function (user) {
  const usuarios = getUsuarios();
  const cliente = usuarios.find(u => u.user === user);

  if(!cliente){
    alert("Clienta no encontrada");
    return;
  }

  localStorage.setItem("clienteActivo", JSON.stringify(cliente));
  location.href = "admin-rutinas.html";
};

window.eliminarCliente = function (user) {

  if (!confirm("¿Eliminar esta clienta? Se borrarán también sus datos.")) return;

  let usuarios = getUsuarios().filter(u => u.user !== user);
  setUsuarios(usuarios);

  localStorage.removeItem("medidas_" + user);

  mostrarClientes();
};

/* =========================
   INIT
========================= */
mostrarClientes();