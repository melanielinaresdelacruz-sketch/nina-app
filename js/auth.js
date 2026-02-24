/*************************
 NINA SPORT AUTH FINAL
 VERSION ANTI-LOOP
**************************/

const client = window.supabaseClient;

if (!client) {
  console.error("Supabase no inicializado");
}

/**********************
 LOGIN
**********************/
async function login() {

  const usuario = document.getElementById("usuario").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorBox = document.getElementById("error");

  errorBox.textContent = "";

  if (!usuario || !password) {
    errorBox.textContent = "Completa los campos";
    return;
  }

  try {

    const email = usuario + "@ninasport.com";

    const { data, error } = await client.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      errorBox.textContent = error.message;
      return;
    }

    const user = data.user;

    if (!user) {
      errorBox.textContent = "No se pudo iniciar sesión";
      return;
    }

    console.log("LOGIN OK", user.id);

    await crearPerfilSiNoExiste(user);

    window.location.href = "dashboard.html";

  } catch (err) {

    console.error(err);
    errorBox.textContent = "Error inesperado";

  }
}

window.login = login;


/**********************
 CREAR PERFIL AUTOMATICO
**********************/
async function crearPerfilSiNoExiste(user) {

  const { data: perfil } = await client
    .from("perfiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (perfil) {
    console.log("Perfil existe");
    return;
  }

  console.log("Creando perfil...");

  await client.from("perfiles").insert({
    id: user.id,
    usuario: user.email,
    rol: "admin"
  });

}


/**********************
 VERIFICAR SESION
 SOLO PARA PAGINAS PRIVADAS
**********************/
async function verificarSesion() {

  const { data } = await client.auth.getSession();

  if (!data.session) {

    console.log("Sin sesión, redirigiendo...");
    window.location.href = "login.html";
    return;

  }

  console.log("Sesion activa");

}

window.verificarSesion = verificarSesion;