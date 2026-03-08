// ══════════════════════════════════════════════════════════
// Supabase client — browser side (public key)
// Use in Client Components for reads that respect RLS
// ══════════════════════════════════════════════════════════
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
}

// Singleton for use in non-component contexts (analytics, etc.)
let browserClient: ReturnType<typeof createClient> | null = null;

export function getSupabaseClient() {
    if (!browserClient) browserClient = createClient();
    return browserClient;
}
