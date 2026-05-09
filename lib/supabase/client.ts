import { createClient } from "@supabase/supabase-js";

/**
 * Creates a Supabase client using the ANON key.
 * Safe to use in client-side code.
 */
export function createBrowserClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createClient(supabaseUrl, supabaseAnonKey);
}
