/*************************
 NINA SPORT SUPABASE INIT
 VERSION BLINDADA FINAL
**************************/

const SUPABASE_URL = "https://mbllpmydlewmdzcnxpcq.supabase.co";
const SUPABASE_KEY = "sb_publishable_SQ--Ml1EUIZUGm3Tv36diA_oi5bCbNm";

/* VERIFICAR QUE SUPABASE CDN CARGO */
if (!window.supabase) {

  console.error("❌ Supabase CDN no cargó");
  
} else {

  /* CREAR CLIENTE */
  window.supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
  );

  console.log("✅ SUPABASE CLIENT OK");

}