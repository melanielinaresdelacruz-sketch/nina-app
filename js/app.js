let clienteActivo = JSON.parse(localStorage.getItem("usuarioActivo"));

if (!clienteActivo) {
  window.location.href = "login.html";
}

document.addEventListener("DOMContentLoaded", () => {
  const sesion = JSON.parse(localStorage.getItem("usuarioActivo"));

  if (!clienteActivo) {
    alert("selecciona o crea un cliente");
  }
    window.location.href = "index.html";
    return;
  }

  setTimeout(() => {
    document.getElementById("splash").style.display = "none";
    document.getElementById("app").classList.remove("hidden");

    if (typeof mostrarHistorial === "function") mostrarHistorial();
    if (typeof crearGraficas === "function") crearGraficas();
    if (typeof cargarRutinaPersonalizada === "function") cargarRutinaPersonalizada();
    if (typeof actualizarRacha === "function") actualizarRacha();

  }, 1500);
});

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

  localStorage.setItem("usuarios", JSON.stringify(usuarios));
  mostrarRutina(rutinas[mes]);
}

function mostrarRutina(rutina) {
  lunesInput.value = rutina.dias.lunes.join("\n");
  martesInput.value = rutina.dias.martes.join("\n");
  miercolesInput.value = rutina.dias.miercoles.join("\n");
  juevesInput.value = rutina.dias.jueves.join("\n");
  viernesInput.value = rutina.dias.viernes.join("\n");
}

const dias = ["domingo","lunes","martes","miercoles","jueves","viernes","sabado"];
let hoy = dias[new Date().getDay()];

/* =========================
   CÁLCULOS
========================= */

function calcular() {
  const peso = parseFloat(document.getElementById("peso").value);
  let estatura = parseFloat(document.getElementById("estatura").value);
  const edad = parseInt(document.getElementById("edad").value);
  const sexo = document.getElementById("sexo").value;

  if (!peso || !estatura || !edad) {
    alert("Completa todos los campos");
    return;
  }

  if (estatura < 3) estatura *= 100;

  const estaturaM = estatura / 100;
  const imc = peso / (estaturaM * estaturaM);

  let clasificacion = "Normal";
  if (imc < 18.5) clasificacion = "Bajo peso";
  else if (imc >= 30) clasificacion = "Obesidad";
  else if (imc >= 25) clasificacion = "Sobrepeso";

  const grasa =
    sexo === "mujer"
      ? (1.2 * imc) + (0.23 * edad) - 5.4
      : (1.2 * imc) + (0.23 * edad) - 16.2;

  const musculo = 100 - grasa;

  document.getElementById("imc").innerText = imc.toFixed(1);
  document.getElementById("clasificacion").innerText = clasificacion;
  document.getElementById("grasa").innerText = grasa.toFixed(1);
  document.getElementById("musculo").innerText = musculo.toFixed(1);

  guardarHistorial(imc, grasa, musculo);
  
}

/* =========================
   HISTORIAL POR USUARIO
========================= */

function guardarHistorial(imc, grasa, musculo) {
  const sesion = JSON.parse(localStorage.getItem("usuarioActivo"));
  if (!sesion) return;

  let historial = JSON.parse(localStorage.getItem("historial")) || {};

  if (!historial[sesion.user]) {
    historial[sesion.user] = {};
  }

  const mes = new Date().toISOString().slice(0, 7); // 2026-01

  historial[sesion.user][mes] = {
    imc: imc.toFixed(1),
    grasa: grasa.toFixed(1),
    musculo: musculo.toFixed(1)
  };

  localStorage.setItem("historial", JSON.stringify(historial));
}

function mostrarHistorial() {
  const sesion = JSON.parse(localStorage.getItem("usuarioActivo"));
  const historial = JSON.parse(localStorage.getItem("historial")) || {};
  const tabla = document.getElementById("tablaHistorial");

  if (!tabla || !historial[sesion.user]) return;

  tabla.innerHTML = "";

  Object.keys(historial[sesion.user]).forEach(mes => {
    const d = historial[sesion.user][mes];

    tabla.innerHTML += `
      <tr>
        <td>${mes}</td>
        <td>${d.imc}</td>
        <td>${d.grasa}%</td>
        <td>${d.musculo}%</td>
      </tr>
    `;
  });
}

/* =========================
   GRÁFICAS
========================= */

function crearGraficas() {
  const sesion = JSON.parse(localStorage.getItem("usuarioActivo"));
  const historial = JSON.parse(localStorage.getItem("historial")) || {};

  if (!historial[sesion.user]) return;

  const meses = Object.keys(historial[sesion.user]);
  const imcData = meses.map(m => historial[sesion.user][m].imc);
  const grasaData = meses.map(m => historial[sesion.user][m].grasa);
  const musculoData = meses.map(m => historial[sesion.user][m].musculo);

  new Chart(document.getElementById("graficaIMC"), {
    type: "line",
    data: { labels: meses, datasets: [{ label: "IMC", data: imcData, borderWidth: 2 }] }
  });

  new Chart(document.getElementById("graficaGrasa"), {
    type: "line",
    data: { labels: meses, datasets: [{ label: "% Grasa", data: grasaData, borderWidth: 2 }] }
  });

  new Chart(document.getElementById("graficaMusculo"), {
    type: "line",
    data: { labels: meses, datasets: [{ label: "% Músculo", data: musculoData, borderWidth: 2 }] }
  });
}

/* =========================
   LOGOUT
========================= */

function logout() {
  localStorage.removeItem("usuarioActivo");
  window.location.href = "index.html";
}

function exportarRutinaPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF("p", "mm", "a4");

  const logo = new Image();
  logo.src = "img/logo.png";

  const rutinas = {
    lunes: "Pierna + glúteo (Sentadillas, desplantes, prensa, hip thrust)",
    martes: "Espalda + bíceps (Jalón, remo, curl, peso muerto)",
    miercoles: "Cardio + abdomen (30 min cardio + crunch, plancha)",
    jueves: "Pecho + tríceps (Press, fondos, extensiones)",
    viernes: "Hombro + core (Elevaciones, press, abdomen)",
    sabado: "Descanso activo",
    domingo: "Descanso activo"
  };

  const dias = ["domingo","lunes","martes","miercoles","jueves","viernes","sabado"];
  const hoy = dias[new Date().getDay()];
  const fecha = new Date().toLocaleDateString();

  logo.onload = function () {

    // ========== PORTADA ==========
    doc.addImage(logo, "PNG", 55, 20, 100, 100);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(28);
    doc.text("Nina Sport", 105, 135, { align: "center" });

    doc.setFontSize(14);
    doc.text("Rutina de entrenamiento", 105, 145, { align: "center" });

    doc.setFontSize(11);
    doc.text("Fecha: " + fecha, 105, 155, { align: "center" });

    doc.addPage();

    // ========== RUTINA DEL DÍA ==========
    doc.setFontSize(20);
    doc.text("Rutina del día", 15, 20);

    doc.setFontSize(13);
    doc.text("Hoy: " + hoy.toUpperCase(), 15, 32);

    doc.setFontSize(12);
    doc.text(rutinas[hoy], 15, 45, { maxWidth: 180, lineHeightFactor: 1.6 });

    // ========== RUTINA SEMANAL ==========
    doc.addPage();
    doc.setFontSize(20);
    doc.text("Rutina semanal", 15, 20);

    let y = 35;
    for (let d in rutinas) {
      doc.setFont("helvetica", "bold");
      doc.text(d.toUpperCase(), 15, y);
      y += 7;
      doc.setFont("helvetica", "normal");
      doc.text("• " + rutinas[d], 18, y, { maxWidth: 175 });
      y += 14;
    }

    // ========== PIE ==========
    doc.setFontSize(9);
    doc.setTextColor(120);
    doc.text("Nina Sport · Ejercítate para estar saludable", 105, 290, { align: "center" });

    doc.save("Rutina_NinaSport_PRO.pdf");
  };
}

doc.text(`Cliente: ${clienteActivo.nombre}`, 105, 80, null, null, "center");

function agregarCliente() {
  const nombre = nombreCliente.value.trim();
  const edad = edadCliente.value;
  const objetivo = objetivoCliente.value.trim();

  if (!nombre) return alert("Escribe el nombre");

  crearCliente(nombre, edad, objetivo);
  cargarClientes();
}

function cargarClientes() {
  const select = document.getElementById("listaClientes");
  if (!select) return;

  select.innerHTML = `<option value="">Seleccionar cliente</option>`;
  clientes.forEach(c => {
    select.innerHTML += `<option value="${c.id}">${c.nombre}</option>`;
  });

  if (clienteActivo) {
    clienteActual.innerHTML = `👤 Cliente activo: <b>${clienteActivo.nombre}</b> — ${clienteActivo.objetivo}`;
  }
}

function cambiarCliente(id) {
  if (!id) return;
  seleccionarCliente(Number(id));
}

document.addEventListener("DOMContentLoaded", cargarClientes);
