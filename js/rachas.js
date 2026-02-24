function actualizarRacha() {
  const sesion = JSON.parse(localStorage.getItem("usuarioActivo"));
  if (!sesion) return;

  const usuario = sesion.user;
  const rachaKey = `racha_${usuario}`;

  const hoy = new Date().toISOString().split("T")[0];

  let racha = JSON.parse(localStorage.getItem(rachaKey)) || {
    dias: [],
    total: 0
  };

  if (!racha.dias.includes(hoy)) {
    racha.dias.push(hoy);
  }

  racha.total = contarDiasConsecutivos(racha.dias);
  localStorage.setItem(rachaKey, JSON.stringify(racha));

  document.getElementById("racha").innerText = racha.total;
}

function contarDiasConsecutivos(dias) {
  dias.sort();
  let contador = 1;

  for (let i = dias.length - 1; i > 0; i--) {
    const actual = new Date(dias[i]);
    const anterior = new Date(dias[i - 1]);

    if ((actual - anterior) / 86400000 === 1) {
      contador++;
    } else break;
  }
  return dias.length ? contador : 0;
}

actualizarRacha();

let completados = clienteActivo.diasCompletados || [];

let completados = clienteActivo.diasCompletados || [];

const hoy = new Date().toDateString();
const ultima = localStorage.getItem("ultimoDia");

let racha = parseInt(localStorage.getItem("racha")) || 0;

if (ultima !== hoy) {
  racha++;
  localStorage.setItem("racha", racha);
  localStorage.setItem("ultimoDia", hoy);
}

document.getElementById("racha").innerText = "🔥 Racha: " + racha + " días";