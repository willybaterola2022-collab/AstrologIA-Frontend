import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

// POST /api/events
// Receives analytics events from the browser and stores in Supabase
// Complements GA4 with first-party, cookie-free analytics
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { event, module, session_id, properties, user_id } = body;

        if (!event || !session_id) {
            return NextResponse.json({ error: "event and session_id required" }, { status: 400 });
        }

        const supabase = createAdminClient();
        const { error } = await supabase.from("module_events").insert({
            event,
            module,
            session_id,
            user_id: user_id || null,
            properties: properties || {},
            url: req.headers.get("referer") || null,
            ua: req.headers.get("user-agent") || null,
            created_at: new Date().toISOString(),
        });

        if (error) {
            console.error("Supabase events insert error:", error.message);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error("Events API error:", err);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}
