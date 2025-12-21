import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Cek apakah variabel lingkungan sudah terisi
  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Kunci API Supabase tidak ditemukan. Pastikan file .env.local sudah benar dan aplikasi sudah direstart."
    );
  }

  return createBrowserClient(supabaseUrl, supabaseKey);
}
