const sesion = JSON.parse(localStorage.getItem("usuarioActivo"));

if (!sesion) {
  console.warn("No hay sesión activa");
} else {

  // =========================
  // INPUTS
  // =========================
  const pesoInput = document.getElementById("peso");
  const estaturaInput = document.getElementById("estatura");
  const edadInput = document.getElementById("edad");
  const sexoInput = document.getElementById("sexo");

  // =========================
  // STORAGE POR USUARIO
  // =========================
  const userKey = `medidas_${sesion.user}`;
  let historial = JSON.parse(localStorage.getItem(userKey)) || [];

  let graficaIMC, graficaGrasa, graficaMusculo;

  // =========================
  // GUARDAR MEDIDAS
  // =========================
  window.guardarMedidas = function () {

    const peso = parseFloat(pesoInput.value);
    let estatura = parseFloat(estaturaInput.value);
    const edad = parseInt(edadInput.value);
    const sexo = sexoInput.value;

    if (!peso || !estatura || !edad) {
      alert("Completa peso, estatura y edad");
      return;
    }

    if (estatura > 3) estatura /= 100; // convertir cm a m

    // ---------- IMC ----------
    const imc = peso / (estatura * estatura);

    // ---------- GRASA ----------
    const grasa = sexo === "mujer"
      ? (1.2 * imc) + (0.23 * edad) - 5.4
      : (1.2 * imc) + (0.23 * edad) - 16.2;

    // ---------- MUSCULO ----------
    const musculo = 100 - grasa;

    // ---------- MOSTRAR ----------
    document.getElementById("imc").innerText = imc.toFixed(1);

    document.getElementById("clasificacion").innerText =
      imc < 18.5 ? "Bajo peso" :
      imc < 25 ? "Normal" :
      imc < 30 ? "Sobrepeso" : "Obesidad";

    document.getElementById("grasa").innerText = grasa.toFixed(1);
    document.getElementById("musculo").innerText = musculo.toFixed(1);

    // ---------- GUARDAR POR MES ----------
    const mes = new Date().toISOString().slice(0, 7);

    historial = historial.filter(r => r.mes !== mes);
    historial.push({
      mes,
      imc: imc.toFixed(1),
      grasa: grasa.toFixed(1),
      musculo: musculo.toFixed(1)
    });

    localStorage.setItem(userKey, JSON.stringify(historial));

    dibujarGraficas();
  };

  // =========================
  // GRÁFICAS
  // =========================
  const graficaIMCEl = document.getElementById("graficaIMC");
  const graficaGrasaEl = document.getElementById("graficaGrasa");
  const graficaMusculoEl = document.getElementById("graficaMusculo");

  function dibujarGraficas() {

    if (historial.length === 0) return;

    const labels = historial.map(h => h.mes);

    if (graficaIMC) graficaIMC.destroy();
    if (graficaGrasa) graficaGrasa.destroy();
    if (graficaMusculo) graficaMusculo.destroy();

    graficaIMC = new Chart(graficaIMCEl, {
      type: "line",
      data: {
        labels,
        datasets: [{
          label: "IMC",
          data: historial.map(h => h.imc),
          tension: 0.3
        }]
      }
    });

    graficaGrasa = new Chart(graficaGrasaEl, {
      type: "line",
      data: {
        labels,
        datasets: [{
          label: "% Grasa",
          data: historial.map(h => h.grasa),
          tension: 0.3
        }]
      }
    });

    graficaMusculo = new Chart(graficaMusculoEl, {
      type: "line",
      data: {
        labels,
        datasets: [{
          label: "% Músculo",
          data: historial.map(h => h.musculo),
          tension: 0.3
        }]
      }
    });
  }

  dibujarGraficas();
}