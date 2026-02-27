/*************************
 NINA SPORT SUPABASE INIT
 VERSION ESTABLE VERCEL
**************************/

const SUPABASE_URL = "https://usugqvmyfrxvevnizody.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzdWdxdm15ZnJ4dmV2bml6b2R5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyMjc5NDYsImV4cCI6MjA4NzgwMzk0Nn0.XZDxzEPnYsbeQ_BlM6DzBSMy39_VPxrxwGHoMSAy-Eg";

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