/* =========================
   VALIDAR SESIÓN ADMIN
========================= */
const sesion = JSON.parse(localStorage.getItem("usuarioActivo"));

if (!sesion || sesion.rol !== "admin") {
  location.href = "login.html";
}

/* =========================
   VALIDAR CLIENTE ACTIVO
========================= */
const clienteActivo = JSON.parse(localStorage.getItem("clienteActivo"));

if (!clienteActivo || !clienteActivo.user) {
  alert("Error: no hay cliente válido seleccionado");
  location.href = "admin-clientes.html";
}

document.getElementById("nombreCliente").innerText =
  "👤 " + clienteActivo.nombre;

/* =========================
   HISTORIAL STORAGE
========================= */
const key = `medidas_${clienteActivo.user}`;
let historial = JSON.parse(localStorage.getItem(key)) || [];

if (!Array.isArray(historial)) {
  historial = [];
}

/* =========================
   ELEMENTOS DOM
========================= */
const historialDiv = document.getElementById("historial");
const tablaDiv = document.getElementById("tablaProgreso");

const mesInput = document.getElementById("mes");
const edad = document.getElementById("edad");
const peso = document.getElementById("peso");
const estatura = document.getElementById("estatura");
const cuello = document.getElementById("cuello");
const brazo = document.getElementById("brazo");
const pecho = document.getElementById("pecho");
const espalda = document.getElementById("espalda");
const cintura = document.getElementById("cintura");
const abdomen = document.getElementById("abdomen");
const cadera = document.getElementById("cadera");
const pierna = document.getElementById("pierna");
const pantorrilla = document.getElementById("pantorrilla");

/* =========================
   GUARDAR MEDIDAS
========================= */
function guardarMedidas() {
  const mes = mesInput.value;

  if (!mes) {
    alert("Selecciona un mes");
    return;
  }

  // Evitar meses duplicados
  const existe = historial.find(m => m.mes === mes);
  if (existe) {
    alert("Ese mes ya tiene registro");
    return;
  }

  const data = {
    mes,
    edad: +edad.value || 0,
    peso: +peso.value || 0,
    estatura: +estatura.value || 0,
    cuello: +cuello.value || 0,
    brazo: +brazo.value || 0,
    pecho: +pecho.value || 0,
    espalda: +espalda.value || 0,
    cintura: +cintura.value || 0,
    abdomen: +abdomen.value || 0,
    cadera: +cadera.value || 0,
    pierna: +pierna.value || 0,
    pantorrilla: +pantorrilla.value || 0
  };

  /* =========================
     IMC
  ========================= */
  if (data.peso > 0 && data.estatura > 0) {
    const m = data.estatura / 100;
    data.imc = +(data.peso / (m * m)).toFixed(2);
  } else {
    data.imc = null;
  }

  /* =========================
     % GRASA (FÓRMULA MUJER)
  ========================= */
  if (
    data.cintura > 0 &&
    data.cadera > 0 &&
    data.cuello > 0 &&
    data.estatura > 0
  ) {
    const gc =
      163.205 *
        Math.log10(data.cintura + data.cadera - data.cuello) -
      97.684 * Math.log10(data.estatura) -
      78.387;

    data.grasa = +gc.toFixed(1);
  } else {
    data.grasa = null;
  }

  /* =========================
     MASAS
  ========================= */
  if (typeof data.grasa === "number" && data.peso > 0) {
    data.masaGrasa = +(data.peso * (data.grasa / 100)).toFixed(2);
    data.masaMagra = +(data.peso - data.masaGrasa).toFixed(2);
    data.musculo = +(data.masaMagra * 0.45).toFixed(2);
  } else {
    data.masaGrasa = null;
    data.masaMagra = null;
    data.musculo = null;
  }

  historial.push(data);
  localStorage.setItem(key, JSON.stringify(historial));

  limpiar();
  pintarTodo();
}

/* =========================
   CLASIFICAR IMC
========================= */
function clasificarIMC(imc) {
  if (!imc) return "-";
  if (imc < 18.5) return "Bajo peso";
  if (imc < 25) return "Normal";
  if (imc < 30) return "Sobrepeso";
  return "Obesidad";
}

/* =========================
   TARJETAS
========================= */
function pintarTarjetas() {
  const div = document.getElementById("cardsFisicas");
  if (!div || historial.length === 0) return;

  const actual = historial[historial.length - 1];
  const prev = historial[historial.length - 2] || {};

  const deltaGrasa =
    prev.grasa != null && actual.grasa != null
      ? actual.grasa - prev.grasa
      : null;

  const deltaMusculo =
    prev.musculo != null && actual.musculo != null
      ? actual.musculo - prev.musculo
      : null;

  div.innerHTML = `
    <div class="card-fisica">
      <h4>IMC</h4>
      <div class="valor">${actual.imc ?? "-"}</div>
      <div class="detalle">${clasificarIMC(actual.imc)}</div>
    </div>

    <div class="card-fisica">
      <h4>% Grasa</h4>
      <div class="valor">${actual.grasa ?? "-"}</div>
      <div class="detalle">
        ${
          deltaGrasa != null
            ? (deltaGrasa > 0 ? "🔼 +" : "🔽 ") +
              Math.abs(deltaGrasa).toFixed(1) +
              "%"
            : "Primer registro"
        }
      </div>
    </div>

    <div class="card-fisica">
      <h4>Músculo</h4>
      <div class="valor">${actual.musculo ?? "-"}</div>
      <div class="detalle">
        ${
          deltaMusculo != null
            ? (deltaMusculo > 0 ? "💪 +" : "📉 ") +
              Math.abs(deltaMusculo).toFixed(2) +
              " kg"
            : "Primer registro"
        }
      </div>
    </div>
  `;
}

/* =========================
   TABLA
========================= */
function pintarTablaComparativa() {
  if (historial.length === 0) {
    tablaDiv.innerHTML =
      "<p style='text-align:center;color:#ff9fc4'>Aún no hay registros</p>";
    return;
  }

  let html = `
  <div style="overflow-x:auto">
  <table style="width:100%;border-collapse:collapse;text-align:center;font-size:13px">
    <tr style="background:#ff4d8d;color:white">
      <th>Mes</th><th>Peso</th><th>Brazo</th><th>Pecho</th><th>Espalda</th>
      <th>Cintura</th><th>Abdomen</th><th>Cadera</th><th>Pierna</th><th>Pantorrilla</th>
      <th>IMC</th><th>% Grasa</th><th>Músculo kg</th>
    </tr>
  `;

  historial.forEach(m => {
    html += `
    <tr style="border-bottom:1px solid #333">
      <td>${m.mes}</td>
      <td>${m.peso || "-"}</td>
      <td>${m.brazo || "-"}</td>
      <td>${m.pecho || "-"}</td>
      <td>${m.espalda || "-"}</td>
      <td>${m.cintura || "-"}</td>
      <td>${m.abdomen || "-"}</td>
      <td>${m.cadera || "-"}</td>
      <td>${m.pierna || "-"}</td>
      <td>${m.pantorrilla || "-"}</td>
      <td>${m.imc ?? "-"}</td>
      <td>${m.grasa ?? "-"}</td>
      <td>${m.musculo ?? "-"}</td>
    </tr>`;
  });

  html += "</table></div>";
  tablaDiv.innerHTML = html;
}

/* =========================
   HISTORIAL TEXTO
========================= */
function pintarHistorial() {
  if (historial.length === 0) {
    historialDiv.innerHTML = "<p>Sin registros aún</p>";
    return;
  }

  historialDiv.innerHTML = "";

  historial.forEach(m => {
    historialDiv.innerHTML += `
      <p><b>${m.mes}</b><br>
      Peso: ${m.peso} | Brazo: ${m.brazo} | Pecho: ${m.pecho} | Espalda: ${m.espalda}<br>
      Cintura: ${m.cintura} | Abdomen: ${m.abdomen} | Cadera: ${m.cadera}<br>
      Pierna: ${m.pierna} | Pantorrilla: ${m.pantorrilla}<br>
      IMC: ${m.imc ?? "-"} | Grasa: ${m.grasa ?? "-"} % | Músculo: ${m.musculo ?? "-"} kg
      </p><hr>
    `;
  });
}

/* =========================
   LIMPIAR
========================= */
function limpiar() {
  document.querySelectorAll("input").forEach(i => {
    if (i.type !== "month") i.value = "";
  });
}

/* =========================
   PINTAR TODO
========================= */
function pintarTodo() {
  pintarTarjetas();
  pintarTablaComparativa();
  pintarHistorial();
}

pintarTodo();