import { createClient } from "@supabase/supabase-js";

// Both values are public by design (the database's row security, not secrecy, protects the data).
// Set them in .env.local and in the GitHub repo variables SUPABASE_URL / SUPABASE_PUBLISHABLE_KEY.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_KEY;

// Null until the Supabase project is connected; the admin page then shows setup steps instead of crashing.
export const supabase = url && key ? createClient(url, key) : null;
