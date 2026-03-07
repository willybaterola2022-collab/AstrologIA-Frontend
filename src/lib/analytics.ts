/**
 * AstrologIA — Analytics & Click Tracking Layer
 * 100% traceable customer journey: every click, scroll, CTA, funnel event
 * 
 * Sends to: GA4 + (later) Supabase module_events table
 * Use this in every component to track user actions
 */

declare global {
    interface Window {
        gtag?: (...args: unknown[]) => void;
        dataLayer?: unknown[];
    }
}

// ─── GA4 Event Types ────────────────────────────────────────────────
export type AstroEventName =
    // CTA clicks
    | "cta_click"           // Any call-to-action button
    | "calculate_click"     // User starts a calculation
    | "result_received"     // Calculation completed
    | "freemium_gate_hit"   // User sees a paywall
    | "upgrade_click"       // User clicks on upgrade/pricing
    | "share_whatsapp"      // WhatsApp share clicked
    // Navigation
    | "module_enter"        // User enters a module page
    | "module_scroll_depth" // 25/50/75/100% scroll
    | "explorer_click"      // User clicks sign/explorer tab
    | "tab_change"          // User changes tab
    // Engagement
    | "affirmation_copied"  // User copies affirmation
    | "reading_expanded"    // User expands a reading
    | "retry_calculation"   // User retried after error
    // Conversion funnel
    | "pricing_page_view"   // Pricing page loaded
    | "checkout_start"      // Checkout initiated
    | "checkout_complete"   // Payment confirmed
    | "thankyou_referral"   // Referral email submitted on thank you page
    | "newsletter_signup"   // Email newsletter opt-in
    // Search & Content
    | "sign_selected"       // User selects a zodiac sign
    | "module_completed"    // User reached result state
    | "form_submitted"      // Birth data form submitted
    | "pdf_download"        // PDF report downloaded
    // Errors
    | "calculation_error"   // Backend error during calculation
    | "backend_wakeup"      // Render/Railway backend was sleeping

export interface AstroEventProps {
    module: string;           // "nodo-norte" | "patrones" | "clima" | "wealth" | ...
    action?: string;          // Specific action label
    sign?: string;            // Zodiac sign if applicable
    value?: number;           // Numeric value (score, percent, etc.)
    plan?: string;            // "free" | "esencial" | "maestro" | "rockstar"
    variant?: string;         // A/B test variant: "A" | "B" | "C"
    scroll_depth?: number;    // 25 | 50 | 75 | 100
    error_msg?: string;       // Error message if applicable
}

/**
 * Track any user event — sends to GA4 + console in dev
 */
export function trackEvent(name: AstroEventName, props: AstroEventProps) {
    try {
        if (typeof window !== "undefined" && window.gtag) {
            window.gtag("event", name, {
                ...props,
                send_to: process.env.NEXT_PUBLIC_GA4_ID,
            });
        }
        // Dev logging
        if (process.env.NODE_ENV === "development") {
            console.log(`[Analytics] ${name}`, props);
        }
        // TODO: also POST to /api/events → Supabase module_events table
        // This gives us full BI without depending on GA4 data sharing
    } catch (e) {
        // Never let analytics break the UX
        console.warn("[Analytics] Event failed silently:", e);
    }
}

/**
 * Scroll depth tracker — call once in component useEffect
 * Reports 25%, 50%, 75%, 100% milestones to GA4
 */
export function initScrollTracker(module: string) {
    if (typeof window === "undefined") return;
    const reached = new Set<number>();
    const checkScroll = () => {
        const el = document.documentElement;
        const percent = Math.round((window.scrollY / (el.scrollHeight - el.clientHeight)) * 100);
        [25, 50, 75, 100].forEach(milestone => {
            if (percent >= milestone && !reached.has(milestone)) {
                reached.add(milestone);
                trackEvent("module_scroll_depth", { module, scroll_depth: milestone });
            }
        });
    };
    window.addEventListener("scroll", checkScroll, { passive: true });
    return () => window.removeEventListener("scroll", checkScroll);
}

/**
 * Pre-built tracker helpers for common events
 */
export const track = {
    moduleEnter: (module: string) =>
        trackEvent("module_enter", { module }),

    calculateClick: (module: string, sign?: string) =>
        trackEvent("calculate_click", { module, sign }),

    resultReceived: (module: string, sign?: string, value?: number) =>
        trackEvent("result_received", { module, sign, value }),

    gateHit: (module: string, plan = "esencial") =>
        trackEvent("freemium_gate_hit", { module, plan }),

    upgradeClick: (module: string, plan = "esencial") =>
        trackEvent("upgrade_click", { module, plan }),

    shareWhatsApp: (module: string) =>
        trackEvent("share_whatsapp", { module }),

    signSelected: (module: string, sign: string) =>
        trackEvent("sign_selected", { module, sign }),

    ctaClick: (module: string, action: string, variant?: string) =>
        trackEvent("cta_click", { module, action, variant }),

    calcError: (module: string, error_msg: string) =>
        trackEvent("calculation_error", { module, error_msg }),

    newsletterSignup: (module: string) =>
        trackEvent("newsletter_signup", { module }),

    pdfDownload: (module: string) =>
        trackEvent("pdf_download", { module }),

    referralSubmit: (count: number) =>
        trackEvent("thankyou_referral", { module: "thankyou", value: count }),
};
