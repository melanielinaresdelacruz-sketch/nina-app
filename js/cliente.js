/*************************
 NINA SPORT - CLIENTE DASHBOARD PRO
**************************/

const sesion = JSON.parse(localStorage.getItem("usuarioActivo"));
if (!sesion) location.href = "login.html";

// ==========================
// DATOS CLIENTE
// ==========================
const key = "medidas_" + sesion.user;
let historial = JSON.parse(localStorage.getItem(key)) || [];

document.getElementById("nombreCliente").innerText =
  "Bienvenida, " + (sesion.nombre || sesion.user);

// ==========================
// GUARDAR MEDIDAS (cliente)
// ==========================
window.guardarMedidas = function () {

  const edad = parseInt(edad.value);
  let estatura = parseFloat(estaturaInput.value);
  const peso = parseFloat(pesoInput.value);

  if (!edad || !estatura || !peso) {
    alert("Completa edad, estatura y peso");
    return;
  }

  if (estatura > 3) estatura /= 100;

  const imc = peso / (estatura * estatura);
  const grasa = (1.2 * imc) + (0.23 * edad) - 5.4;
  const musculo = 100 - grasa;

  const registro = {
    mes: new Date().toISOString().slice(0,7),
    edad,
    estatura,
    peso,
    imc: +imc.toFixed(1),
    grasa: +grasa.toFixed(1),
    musculo: +musculo.toFixed(1),

    brazo: +brazo.value || 0,
    pecho: +pecho.value || 0,
    espalda: +espalda.value || 0,
    cintura: +cintura.value || 0,
    abdomen: +abdomen.value || 0,
    cadera: +cadera.value || 0,
    pierna: +pierna.value || 0,
    pantorrilla: +pantorrilla.value || 0
  };

  historial = historial.filter(r => r.mes !== registro.mes);
  historial.push(registro);
  historial.sort((a,b)=>a.mes.localeCompare(b.mes));

  localStorage.setItem(key, JSON.stringify(historial));

  renderResultados(registro);
  renderHistorial();
  dibujarGrafica();

  alert("✅ Medidas guardadas");
};

// ==========================
// RESULTADOS
// ==========================
function renderResultados(r) {
  imc.innerText = r.imc;
  grasaSpan.innerText = r.grasa;
  document.getElementById("comparacion").innerHTML =
    `💪 Músculo: ${r.musculo}%`;
}

// ==========================
// HISTORIAL
// ==========================
function renderHistorial() {
  historialDiv.innerHTML = "";

  historial.forEach(r=>{
    historialDiv.innerHTML += `
      <div class="historial-item">
        <b>${r.mes}</b> |
        Peso: ${r.peso}kg |
        IMC: ${r.imc} |
        Grasa: ${r.grasa}% |
        Músculo: ${r.musculo}%
      </div>
    `;
  });
}

// ==========================
// COLORES
// ==========================
function color(actual, anterior) {
  if (anterior == null) return "#ff4d6d";
  return actual <= anterior ? "#2ecc71" : "#e74c3c";
}

// ==========================
// GRAFICA COMPLETA
// ==========================
let grafica;

function dibujarGrafica() {

  if (!historial.length) return;

  if (grafica) grafica.destroy();

  const actual = historial.at(-1);
  const anterior = historial.length > 1 ? historial.at(-2) : null;

  const campos = ["peso","brazo","pecho","espalda","cintura","abdomen","cadera","pierna","pantorrilla"];

  grafica = new Chart(document.getElementById("graficaMedidas"), {
    type: "bar",
    data: {
      labels: campos.map(c=>c.toUpperCase()),
      datasets: [{
        label: "Último registro",
        data: campos.map(c=>actual[c]),
        backgroundColor: campos.map(c=>color(actual[c], anterior?.[c]))
      }]
    }
  });
}

// ==========================
// INIT
// ==========================
const pesoInput = document.getElementById("peso");
const estaturaInput = document.getElementById("estatura");
const edad = document.getElementById("edad");

const brazo = document.getElementById("brazo");
const pecho = document.getElementById("pecho");
const espalda = document.getElementById("espalda");
const cintura = document.getElementById("cintura");
const abdomen = document.getElementById("abdomen");
const cadera = document.getElementById("cadera");
const pierna = document.getElementById("pierna");
const pantorrilla = document.getElementById("pantorrilla");

const historialDiv = document.getElementById("historial");
const imc = document.getElementById("imc");
const grasaSpan = document.getElementById("grasa");

if (historial.length) renderResultados(historial.at(-1));
renderHistorial();
dibujarGrafica();