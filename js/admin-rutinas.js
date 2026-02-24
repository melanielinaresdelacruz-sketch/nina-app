/*************************
   NINA SPORT - ADMIN RUTINAS PRO
**************************/

function getUsuarios() {
  return JSON.parse(localStorage.getItem("usuarios")) || [];
}
function setUsuarios(u) {
  localStorage.setItem("usuarios", JSON.stringify(u));
}

let usuarios = getUsuarios();

const clienteSelect = document.getElementById("clienteSelect");
const mesInput = document.getElementById("mes");
const semanaSelect = document.getElementById("semanaSelect");
const textoSemana = document.getElementById("textoSemana");
const panel = document.getElementById("rutinaPanel");

const dias = ["lunes","martes","miercoles","jueves","viernes"];

mesInput.value = new Date().toISOString().slice(0,7);

/* =====================
   SEMANA ACTUAL
===================== */
function obtenerRangoSemana(mes, semana) {

  const [anio, mesNum] = mes.split("-");
  const primerDiaMes = new Date(anio, mesNum - 1, 1);

  // Buscar el primer lunes del mes
  let primerLunes = new Date(primerDiaMes);
  while (primerLunes.getDay() !== 1) {
    primerLunes.setDate(primerLunes.getDate() + 1);
  }

  const semanaIndex = {
    semana1: 0,
    semana2: 7,
    semana3: 14,
    semana4: 21
  }[semana];

  const lunes = new Date(primerLunes);
  lunes.setDate(primerLunes.getDate() + semanaIndex);

  const viernes = new Date(lunes);
  viernes.setDate(lunes.getDate() + 4);

  const mesTexto = lunes.toLocaleDateString("es-MX", { month: "long" });

  return `${lunes.getDate()} al ${viernes.getDate()} de ${mesTexto}`;
}

/* =====================
   CLIENTAS
===================== */
function cargarClientes() {
  clienteSelect.innerHTML = "<option value=''>Selecciona clienta</option>";
  usuarios.filter(u => u.rol === "cliente").forEach(c => {
    const op = document.createElement("option");
    op.value = c.user;
    op.textContent = c.nombre;
    clienteSelect.appendChild(op);
  });
}

/* =====================
   CARGAR RUTINA
===================== */
function cargarRutina() {

  panel.innerHTML = "";

  const user = clienteSelect.value;
  const mes = mesInput.value;
  const semana = semanaSelect.value;

  if (!user || !mes || !semana) return;
  textoSemana.innerText =
  "📅 Semana: " + obtenerRangoSemana(mes, semana);

  const cliente = usuarios.find(u => u.user === user);
  cliente.rutinas = cliente.rutinas || {};
  cliente.rutinas[mes] = cliente.rutinas[mes] || {};
  cliente.rutinas[mes][semana] = cliente.rutinas[mes][semana] || {
    lunes:[], martes:[], miercoles:[], jueves:[], viernes:[]
  };

  setUsuarios(usuarios);

  const rutina = cliente.rutinas[mes][semana];

  dias.forEach(dia => {

    const card = document.createElement("div");
    card.className = "dia-card";

    card.innerHTML = `
      <h3>${dia.toUpperCase()}</h3>
      <div id="lista-${dia}"></div>

      <input id="ej-${dia}" placeholder="Ejercicio">
      <input id="se-${dia}" type="number" placeholder="Series">
      <input id="re-${dia}" type="number" placeholder="Reps">
      <input id="an-${dia}" placeholder="sentadilla.gif">

      <button onclick="agregarEjercicio('${dia}')">➕ Agregar</button>
    `;

    panel.appendChild(card);
    pintarDia(dia, rutina[dia]);
  });
}

/* =====================
   PINTAR DÍA
===================== */
function pintarDia(dia, lista) {
  const cont = document.getElementById("lista-" + dia);
  cont.innerHTML = "";

  lista.forEach((e, i) => {
    cont.innerHTML += `
      <div class="ejercicio-card">
        <b>${e.ejercicio}</b>
        <p>${e.series} x ${e.reps}</p>
        <small>${e.animacion || ""}</small>
        <button onclick="eliminarEjercicio('${dia}',${i})">❌</button>
      </div>
    `;
  });
}

/* =====================
   AGREGAR EJERCICIO
===================== */
function agregarEjercicio(dia) {

  const ej = document.getElementById("ej-" + dia).value;
  const se = document.getElementById("se-" + dia).value;
  const re = document.getElementById("re-" + dia).value;
  const an = document.getElementById("an-" + dia).value;

  if (!ej || !se || !re) return alert("Completa todo");

  const cliente = usuarios.find(u => u.user === clienteSelect.value);
  cliente.rutinas[mesInput.value][semanaSelect.value][dia].push({
    ejercicio: ej,
    series: se,
    reps: re,
    animacion: an
  });

  setUsuarios(usuarios);
  cargarRutina();
}

/* =====================
   ELIMINAR
===================== */
function eliminarEjercicio(dia, i) {
  const cliente = usuarios.find(u => u.user === clienteSelect.value);
  cliente.rutinas[mesInput.value][semanaSelect.value][dia].splice(i,1);
  setUsuarios(usuarios);
  cargarRutina();
}

/* =====================
   GUARDAR
===================== */
function guardarRutina() {
  alert("✅ Rutina semanal guardada");
}

/* =====================
   EVENTOS
===================== */
clienteSelect.addEventListener("change", cargarRutina);
mesInput.addEventListener("change", cargarRutina);
semanaSelect.addEventListener("change", cargarRutina);

/* =====================
   INIT
===================== */
cargarClientes();