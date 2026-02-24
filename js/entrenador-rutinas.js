/*************************
 NINA SPORT - ENTRENADOR RUTINAS PRO
**************************/

const clienteSelect = document.getElementById("clienteSelect");
const diasPanel = document.getElementById("diasPanel");
const mesInput = document.getElementById("mesInput");

const dias = ["lunes","martes","miercoles","jueves","viernes"];

iniciar();

/* =====================
   INIT
===================== */

function iniciar() {
  cargarClientes();
  crearDias();
}

/* =====================
   HELPERS
===================== */

function getUsuarios() {
  return JSON.parse(localStorage.getItem("usuarios")) || [];
}

function setUsuarios(u) {
  localStorage.setItem("usuarios", JSON.stringify(u));
}

/* =====================
   CLIENTES
===================== */

function cargarClientes() {
  const usuarios = getUsuarios();

  clienteSelect.innerHTML = "";

  usuarios.filter(u => u.rol === "cliente").forEach(c => {
    const op = document.createElement("option");
    op.value = c.user;
    op.textContent = c.nombre;
    clienteSelect.appendChild(op);
  });
}

/* =====================
   UI
===================== */

function crearDias() {

  diasPanel.innerHTML = "";

  dias.forEach(dia => {

    const div = document.createElement("div");
    div.className = "dia-card";

    div.innerHTML = `
      <h3>${dia.toUpperCase()}</h3>
      <div id="lista-${dia}" class="lista"></div>

      <input placeholder="Ejercicio" id="ej-${dia}">
      <input placeholder="Series" type="number" id="se-${dia}">
      <input placeholder="Reps" type="number" id="re-${dia}">
      <input placeholder="sentadilla.gif" id="an-${dia}">

      <button onclick="agregarEjercicio('${dia}')">➕ Agregar</button>
    `;

    diasPanel.appendChild(div);
  });
}

/* =====================
   AGREGAR
===================== */

function agregarEjercicio(dia) {

  const ej = document.getElementById(`ej-${dia}`).value.trim();
  const se = document.getElementById(`se-${dia}`).value.trim();
  const re = document.getElementById(`re-${dia}`).value.trim();
  const an = document.getElementById(`an-${dia}`).value.trim();

  if (!ej || !se || !re) return alert("Completa ejercicio, series y reps");

  const lista = document.getElementById(`lista-${dia}`);

  const div = document.createElement("div");
  div.className = "ejercicio";

  div.innerHTML = `
    <span>${ej} - ${se}x${re}</span>
    <button onclick="this.parentElement.remove()">❌</button>
  `;

  lista.appendChild(div);

  const arr = JSON.parse(lista.dataset.rutina || "[]");

  arr.push({
    ejercicio: ej,
    series: se,
    reps: re,
    animacion: an ? `animaciones/${an}` : ""
  });

  lista.dataset.rutina = JSON.stringify(arr);

  document.getElementById(`ej-${dia}`).value="";
  document.getElementById(`se-${dia}`).value="";
  document.getElementById(`re-${dia}`).value="";
  document.getElementById(`an-${dia}`).value="";
}

/* =====================
   LIMPIAR
===================== */

function limpiarDias() {
  dias.forEach(dia => {
    const lista = document.getElementById(`lista-${dia}`);
    lista.innerHTML = "";
    lista.dataset.rutina = "[]";
  });
}

/* =====================
   CARGAR RUTINA
===================== */

function cargarRutina() {

  limpiarDias();

  const usuarios = getUsuarios();
  const user = clienteSelect.value;
  const mes = mesInput.value;

  if (!user || !mes) return;

  const cliente = usuarios.find(u => u.user === user);

  if (!cliente?.rutinas || !cliente.rutinas[mes]) return;

  const rutina = cliente.rutinas[mes];

  dias.forEach(dia => {
    const lista = document.getElementById(`lista-${dia}`);
    const arr = rutina[dia] || [];

    lista.dataset.rutina = JSON.stringify(arr);

    arr.forEach(e => {
      const div = document.createElement("div");
      div.className = "ejercicio";
      div.innerHTML = `
        <span>${e.ejercicio} - ${e.series}x${e.reps}</span>
        <button onclick="this.parentElement.remove()">❌</button>
      `;
      lista.appendChild(div);
    });
  });
}

/* =====================
   GUARDAR
===================== */

function guardarRutina() {

  const usuarios = getUsuarios();
  const user = clienteSelect.value;
  const mes = mesInput.value;

  if (!user || !mes) return alert("Selecciona cliente y mes");

  const cliente = usuarios.find(u => u.user === user);
  cliente.rutinas = cliente.rutinas || {};

  const rutina = {};

  dias.forEach(dia => {
    const lista = document.getElementById(`lista-${dia}`);
    rutina[dia] = JSON.parse(lista.dataset.rutina || "[]");
  });

  cliente.rutinas[mes] = rutina;
  setUsuarios(usuarios);

  alert("🔥 Rutina guardada correctamente");
}

/* =====================
   EVENTOS
===================== */

clienteSelect.addEventListener("change", cargarRutina);
mesInput.addEventListener("change", cargarRutina);