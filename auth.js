/*************************
 NINA SPORT AUTH SYSTEM
 VERSION FINAL ESTABLE
**************************/

const client = window.supabaseClient;

if (!client) {
  console.error("Supabase client no inicializado");
}

/**********************
 LOGIN
**********************/
async function login() {

  const email = document.getElementById("usuario").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorBox = document.getElementById("error");

  errorBox.textContent = "";

  if (!email || !password) {
    errorBox.textContent = "Completa todos los campos";
    return;
  }

  try {

    const { data, error } = await client.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error("LOGIN ERROR:", error.message);
      errorBox.textContent = "Correo o contraseña incorrectos";
      return;
    }

    const user = data.user;

    if (!user) {
      errorBox.textContent = "Error obteniendo usuario";
      return;
    }

    console.log("LOGIN OK:", user.id);

    await crearPerfilSiNoExiste(user);

    // esperar a que Supabase guarde sesión
    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 300);

  }
  catch (err) {

    console.error("ERROR LOGIN:", err);
    errorBox.textContent = "Error inesperado";

  }

}

window.login = login;


/**********************
 CREAR PERFIL SI NO EXISTE
**********************/
async function crearPerfilSiNoExiste(user) {

  try {

    const { data, error } = await client
      .from("perfiles")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();

    if (error) {
      console.error("Error buscando perfil:", error.message);
      return;
    }

    if (data) {
      console.log("Perfil existente");
      return;
    }

    console.log("Creando perfil nuevo...");

    const { error: insertError } = await client
      .from("perfiles")
      .insert({
        id: user.id,
        nombre: user.email,
        rol: "admin"
      });

    if (insertError) {
      console.error("Error creando perfil:", insertError.message);
    }
    else {
      console.log("Perfil creado correctamente");
    }

  }
  catch (err) {
    console.error("Error crearPerfil:", err);
  }

}


/**********************
 VERIFICAR SESION
**********************/
async function verificarSesion() {

  try {

    console.log("Verificando sesión...");

    // esperar restauración sesión
    await new Promise(resolve => setTimeout(resolve, 400));

    const { data, error } = await client.auth.getSession();

    if (error) {
      console.error("Error sesión:", error.message);
      redirigirLogin();
      return;
    }

    if (!data.session) {
      console.log("No hay sesión");
      redirigirLogin();
      return;
    }

    const user = data.session.user;

    console.log("Sesión activa:", user.id);

    const { data: perfil, error: perfilError } = await client
      .from("perfiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (perfilError || !perfil) {

      console.log("Perfil no encontrado, creando...");

      await crearPerfilSiNoExiste(user);

      return;
    }

    localStorage.setItem("usuarioActivo", JSON.stringify(perfil));

    console.log("Acceso autorizado");

  }
  catch (err) {

    console.error("Error verificarSesion:", err);
    redirigirLogin();

  }

}

window.verificarSesion = verificarSesion;


/**********************
 LOGOUT
**********************/
async function logout() {

  await client.auth.signOut();

  localStorage.clear();

  window.location.href = "login.html";

}

window.logout = logout;


/**********************
 REDIRIGIR LOGIN
**********************/
function redirigirLogin() {

  if (!window.location.pathname.includes("login.html")) {

    window.location.href = "login.html";

  }

}