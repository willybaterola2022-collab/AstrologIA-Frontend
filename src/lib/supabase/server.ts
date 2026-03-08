// ══════════════════════════════════════════════════════════
// Supabase client — server side (service role key)
// Use ONLY in Server Components, API Routes, Server Actions
// NEVER expose this to the browser
// ══════════════════════════════════════════════════════════
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Admin client — bypasses RLS (for server-side operations only)
export function createAdminClient() {
    return createSupabaseClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    );
}

// Regular server client (respects RLS, uses anon key)
export function createServerClient() {
    return createSupabaseClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_ANON_KEY!
    );
}
