/*************************
   NINA SPORT - CLIENTE RUTINA PRO
**************************/

const sesion = JSON.parse(localStorage.getItem("usuarioActivo"));
if (!sesion) location.href = "login.html";

const contenedor = document.getElementById("rutinaCliente");
const rachaTexto = document.getElementById("rachaTexto");
const textoSemana = document.getElementById("textoSemana");

const dias = ["lunes","martes","miercoles","jueves","viernes"];

function getUsuarios() {
  return JSON.parse(localStorage.getItem("usuarios")) || [];
}
function setUsuarios(u) {
  localStorage.setItem("usuarios", JSON.stringify(u));
}

/* =====================
   OBTENER SEMANA ACTUAL
===================== */
function obtenerSemanaActual() {

  const hoy = new Date();
  const anio = hoy.getFullYear();
  const mes = String(hoy.getMonth() + 1).padStart(2, "0");
  const mesKey = `${anio}-${mes}`;

  // calcular primer lunes del mes
  const primerDiaMes = new Date(anio, hoy.getMonth(), 1);
  let primerLunes = new Date(primerDiaMes);
  while (primerLunes.getDay() !== 1) {
    primerLunes.setDate(primerLunes.getDate() + 1);
  }

  const diff = hoy - primerLunes;
  const semanaIndex = Math.floor(diff / (7 * 86400000));

  const semanaKey = ["semana1","semana2","semana3","semana4"][semanaIndex] || "semana4";

  return { mesKey, semanaKey };
}

/* =====================
   TEXTO FECHA
===================== */
function obtenerRangoSemana(mes, semana) {

  const [anio, mesNum] = mes.split("-");
  const primerDiaMes = new Date(anio, mesNum - 1, 1);

  let primerLunes = new Date(primerDiaMes);
  while (primerLunes.getDay() !== 1) {
    primerLunes.setDate(primerLunes.getDate() + 1);
  }

  const offset = {
    semana1: 0,
    semana2: 7,
    semana3: 14,
    semana4: 21
  }[semana];

  const lunes = new Date(primerLunes);
  lunes.setDate(primerLunes.getDate() + offset);

  const viernes = new Date(lunes);
  viernes.setDate(lunes.getDate() + 4);

  const mesTxt = lunes.toLocaleDateString("es-MX", { month: "long" });

  return `${lunes.getDate()} al ${viernes.getDate()} de ${mesTxt}`;
}

/* =====================
   CARGAR RUTINA CLIENTE
===================== */
function cargarRutinaCliente() {

  contenedor.innerHTML = "";

  const usuarios = getUsuarios();
  const cliente = usuarios.find(u => u.user === sesion.user);

  if (!cliente || !cliente.rutinas) {
    contenedor.innerHTML = "<p>No tienes rutina asignada</p>";
    return;
  }

  const { mesKey, semanaKey } = obtenerSemanaActual();

  if (!cliente.rutinas[mesKey] || !cliente.rutinas[mesKey][semanaKey]) {
    contenedor.innerHTML = "<p>No hay rutina asignada esta semana</p>";
    return;
  }

  textoSemana.innerText =
    "📅 Semana: " + obtenerRangoSemana(mesKey, semanaKey);

  cliente.racha = cliente.racha || { dias:0, ultima:null };
  rachaTexto.innerText = "🔥 Racha: " + cliente.racha.dias + " días";

  const rutina = cliente.rutinas[mesKey][semanaKey];

  dias.forEach(dia => {

    const card = document.createElement("div");
    card.className = "dia-card";

    let html = `<h3>${dia.toUpperCase()}</h3>`;

    if (!rutina[dia] || rutina[dia].length === 0) {
      html += "<p>Descanso</p>";
    } else {
      rutina[dia].forEach(e => {
        html += `
          <div class="ejercicio-card">
            <b>${e.ejercicio}</b>
            <p>${e.series} x ${e.reps}</p>
            ${e.animacion ? `<button onclick="verAnimacion('${e.ejercicio}','${e.animacion}')">▶ Ver</button>` : ""}
          </div>
        `;
      });
    }

    html += `<button class="btn-ok" onclick="marcarDia()">✅ Marcar entrenado</button>`;

    card.innerHTML = html;
    contenedor.appendChild(card);
  });
}

/* =====================
   RACHA
===================== */
function marcarDia() {

  const usuarios = getUsuarios();
  const cliente = usuarios.find(u => u.user === sesion.user);

  const hoy = new Date().toDateString();
  if (cliente.racha?.ultima === hoy) {
    alert("Ya marcaste hoy 💪");
    return;
  }

  cliente.racha.dias++;
  cliente.racha.ultima = hoy;

  setUsuarios(usuarios);
  rachaTexto.innerText = "🔥 Racha: " + cliente.racha.dias + " días";
}

/* =====================
   PDF SEMANAL
===================== */
function exportarRutinaPDF() {

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const usuarios = getUsuarios();
  const cliente = usuarios.find(u => u.user === sesion.user);
  const { mesKey, semanaKey } = obtenerSemanaActual();

  const rutina = cliente.rutinas[mesKey][semanaKey];

  let y = 10;
  doc.text("Nina Sport - Rutina Semanal", 10, y);
  y += 8;
  doc.text(obtenerRangoSemana(mesKey, semanaKey), 10, y);

  dias.forEach(dia => {
    y += 10;
    doc.text(dia.toUpperCase(), 10, y);
    y += 5;

    rutina[dia].forEach(e => {
      doc.text(`• ${e.ejercicio} - ${e.series} x ${e.reps}`, 12, y);
      y += 5;
    });
  });

  doc.save("rutina-semanal.pdf");
}

/* =====================
   INIT
===================== */
cargarRutinaCliente();