// ================================
// RUTINA MENSUAL BASE
// ================================
const rutinaMensual = {
  lunes: "Pierna + glúteo 🍑 (Sentadilla 4x12, Prensa 4x10, Hip thrust 4x12, Desplantes 3x12)",
  martes: "Espalda + bíceps 💪 (Jalón 4x10, Remo 4x10, Curl barra 3x12, Curl mancuernas 3x12)",
  miercoles: "Cardio + abdomen ❤️ (30 min cardio, Crunch 3x20, Plancha 3x30s, Elevaciones 3x15)",
  jueves: "Pecho + tríceps 🏋️ (Press 4x10, Fondos 3x8, Aperturas 3x12, Extensiones 3x12)",
  viernes: "Hombro + core 🔥 (Press hombro 4x10, Elevaciones 3x12, Encogimientos 3x12, Russian twist 3x20)",
  sabado: "😴 Descanso",
  domingo: "😴 Descanso"
};

// ================================
// CARGAR RUTINA DEL DÍA
// ================================
function cargarRutina() {

  if (!window.usuarioActivo) return;

  if (!usuarioActivo.rutinas) {
    usuarioActivo.rutinas = rutinaMensual;
    guardarClientes();
  }

  const dias = ["domingo","lunes","martes","miercoles","jueves","viernes","sabado"];
  const hoy = dias[new Date().getDay()];

  const contenedor = document.getElementById("rutinaDia");

  if (contenedor) {
    contenedor.innerHTML = `
      <h3>${hoy.toUpperCase()}</h3>
      <p>${usuarioActivo.rutinas[hoy]}</p>
    `;
  }
}

document.addEventListener("DOMContentLoaded", cargarRutina);

// ================================
// MARCAR DÍA COMPLETADO
// ================================
function completarDia() {
  let completados = JSON.parse(localStorage.getItem("diasCompletados")) || [];
  const hoy = new Date().toISOString().split("T")[0];

  if (!completados.includes(hoy)) {
    completados.push(hoy);
    localStorage.setItem("diasCompletados", JSON.stringify(completados));
    alert("🔥 Día registrado, sigue así!");
  }
}

// ================================
// EXPORTAR PDF
// ================================
function exportarRutinaPDF() {

  if (!window.usuarioActivo) {
    alert("No hay usuario activo");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const fecha = new Date().toLocaleDateString();

  const logo = new Image();
  logo.src = "img/logo.png"; // ⚠️ ajusta a tu ruta real

  logo.onload = () => {

    doc.addImage(logo, "PNG", 85, 8, 40, 40);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("Nina Sport", 105, 55, { align: "center" });

    doc.setFontSize(12);
    doc.text("Rutina mensual", 105, 63, { align: "center" });
    doc.text("Fecha: " + fecha, 105, 70, { align: "center" });

    let y = 85;

    for (let dia in usuarioActivo.rutinas) {
      doc.setFontSize(13);
      doc.text(dia.toUpperCase(), 15, y);
      y += 6;
      doc.setFontSize(11);
      doc.text(usuarioActivo.rutinas[dia], 15, y, { maxWidth: 180 });
      y += 10;
    }

    doc.save(`Rutina_${usuarioActivo.nombre || "cliente"}.pdf`);
  };
}

// ================================
// GUARDAR CLIENTES
// ================================
function guardarClientes() {

  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

  usuarios = usuarios.map(u =>
    u.user === usuarioActivo.user ? usuarioActivo : u
  );

  localStorage.setItem("usuarios", JSON.stringify(usuarios));
  localStorage.setItem("usuarioActivo", JSON.stringify(usuarioActivo));
}