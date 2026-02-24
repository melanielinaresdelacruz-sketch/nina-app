const { jsPDF } = window.jspdf;

/* =========================
   CARGAR RUTINA DEL MES
========================= */

function cargarRutinaCliente() {

  const sesion = JSON.parse(localStorage.getItem("usuarioActivo"));
  if (!sesion) {
    location.href = "login.html";
    return;
  }

  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  const cliente = usuarios.find(u => u.user === sesion.user);
  if (!cliente || !cliente.rutinas) return;

  const mesActual = new Date().toISOString().slice(0, 7);
  const rutina = cliente.rutinas[mesActual];
  if (!rutina) return;

  document.getElementById("mesRutina").innerText = mesActual;
  document.getElementById("r-lunes").innerText = rutina.lunes || "";
  document.getElementById("r-martes").innerText = rutina.martes || "";
  document.getElementById("r-miercoles").innerText = rutina.miercoles || "";
  document.getElementById("r-jueves").innerText = rutina.jueves || "";
  document.getElementById("r-viernes").innerText = rutina.viernes || "";
}

document.addEventListener("DOMContentLoaded", cargarRutinaCliente);

/* =========================
   PDF CLIENTE
========================= */

function descargarRutinaPDF() {

  const sesion = JSON.parse(localStorage.getItem("usuarioActivo"));
  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  const cliente = usuarios.find(u => u.user === sesion.user);
  if (!cliente) return;

  const mes = new Date().toISOString().slice(0, 7);
  const r = cliente.rutinas?.[mes];
  if (!r) return alert("No hay rutina asignada");

  generarPDF(cliente, mes, r, true);
}

function descargarYEnviarWhats() {

  const sesion = JSON.parse(localStorage.getItem("usuarioActivo"));
  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  const cliente = usuarios.find(u => u.user === sesion.user);
  if (!cliente) return;

  const mes = new Date().toISOString().slice(0, 7);
  const r = cliente.rutinas?.[mes];
  if (!r) return alert("No hay rutina asignada");

  generarPDF(cliente, mes, r, true);

  const mensaje = `Hola 👋 te envío mi rutina del mes ${mes} de Nina Sport 💪🔥`;
  const url = `https://wa.me/?text=${encodeURIComponent(mensaje)}`;

  setTimeout(() => {
    window.open(url, "_blank");
  }, 900);
}

/* =========================
   GENERADOR PDF
========================= */

function generarPDF(cliente, mes, r, descargar = true) {

  const pdf = new jsPDF();
  let y = 20;

  const logo = new Image();
  logo.src = "logo-png.jpg";

  logo.onload = () => {

    pdf.addImage(logo, "PNG", 80, 5, 50, 20);

    pdf.setFontSize(14);
    pdf.text("Nina Sport - Rutina mensual", 105, 35, { align: "center" });

    pdf.setFontSize(11);
    pdf.text(`Cliente: ${cliente.nombre}`, 10, 45);
    pdf.text(`Mes: ${mes}`, 10, 52);

    y = 65;

    const dias = [
      ["Lunes", r.lunes],
      ["Martes", r.martes],
      ["Miércoles", r.miercoles],
      ["Jueves", r.jueves],
      ["Viernes", r.viernes],
      ["Sábado", "Descanso"],
      ["Domingo", "Descanso"]
    ];

    dias.forEach(d => {
      pdf.setFont(undefined, "bold");
      pdf.text(d[0], 10, y);
      y += 6;
      pdf.setFont(undefined, "normal");
      pdf.text(pdf.splitTextToSize(d[1] || "", 180), 10, y);
      y += 14;
    });

    if (descargar) {
      pdf.save(`Rutina_${cliente.nombre}_${mes}.pdf`);
    }
  };
}