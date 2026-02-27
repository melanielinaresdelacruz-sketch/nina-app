/*************************
 NINA SPORT SUPABASE INIT
 VERSION ESTABLE VERCEL
**************************/

const SUPABASE_URL = "https://mbllpmydlewmdzcnxpcq.supabase.co";
const SUPABASE_KEY = "TU_PUBLIC_ANON_KEY_AQUI";

/* Verificar que el CDN esté cargado */
if (typeof window.supabase === "undefined") {

  console.error("❌ Supabase CDN no cargó");

} else {

  window.supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    }
  );

  console.log("✅ SUPABASE CLIENT OK");

}