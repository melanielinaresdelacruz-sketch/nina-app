/*************************
 NINA SPORT SUPABASE INIT
 VERSION ESTABLE VERCEL
**************************/

const SUPABASE_URL = "https://mbllpmydlewmdzcnxpcq.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ibGxwbXlkbGV3bWR6Y254cGNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExMzk3MjcsImV4cCI6MjA4NjcxNTcyN30.9_mbG9jZDmwT-AKa4sDS9oVwdVcbIwO95f7yKW-yBRk";

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