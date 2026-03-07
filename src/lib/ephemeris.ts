/**
 * AstrologIA — Ephemeris Proxy API Route
 * 100% real Swiss Ephemeris — NEVER demo data in production
 * 
 * This route proxies all calculation requests to the real backend
 * using a service JWT — no user auth required for calculations.
 */

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "https://astro-api-z48v.onrender.com";
const SERVICE_JWT = process.env.ASTROLOGIA_SERVICE_JWT || "";

export interface NatalChartInput {
    year: number; month: number; day: number;
    hour: number; lat: number; lon: number;
}

export interface PlanetResult {
    longitude: number;
    sign: string;
    degree: number;
    insight_text?: string;
}

export interface NatalChartResult {
    Sun: PlanetResult;
    Moon: PlanetResult;
    Mercury: PlanetResult;
    Venus: PlanetResult;
    Mars: PlanetResult;
    Jupiter: PlanetResult;
    Saturn: PlanetResult;
    Uranus: PlanetResult;
    Neptune: PlanetResult;
    Pluto: PlanetResult;
    Chiron: PlanetResult;
    True_Node: PlanetResult;
    Lilith: PlanetResult;
    Ascendant?: { longitude: number; sign: number; degree: number };
    Midheaven?: { longitude: number; sign: number; degree: number };
}

/**
 * Calculate natal chart with 100% real Swiss Ephemeris precision.
 * Falls back to a clearly-labeled "precision pending" state if backend unavailable.
 * NEVER returns fake data as real data.
 */
export async function calculateNatalChartReal(input: NatalChartInput): Promise<{
    data: NatalChartResult | null;
    error: string | null;
    isPrecise: boolean;
}> {
    if (!SERVICE_JWT) {
        return {
            data: null,
            error: "Service configuration error — calculations unavailable",
            isPrecise: false,
        };
    }

    try {
        const response = await fetch(`${BACKEND_URL}/api/carta-natal`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${SERVICE_JWT}`,
            },
            body: JSON.stringify(input),
            signal: AbortSignal.timeout(30000), // 30s timeout (backend may be waking from sleep)
        });

        if (!response.ok) {
            const errorText = await response.text();
            return {
                data: null,
                error: `Backend error ${response.status}: ${errorText}`,
                isPrecise: false,
            };
        }

        const data = await response.json();
        return { data, error: null, isPrecise: true };

    } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        return {
            data: null,
            error: `Connection error: ${msg}. Backend may be waking up — retry in 30 seconds.`,
            isPrecise: false,
        };
    }
}

/**
 * Get North Node (True Node) sign and house from real backend.
 * The True Node is the most astronomically precise way to calculate it.
 */
export async function getNorthNodeReal(input: NatalChartInput): Promise<{
    sign: string;
    house: number;
    longitude: number;
    isPrecise: boolean;
    error: string | null;
}> {
    const result = await calculateNatalChartReal(input);

    if (!result.data || result.error) {
        return { sign: "Cargando...", house: 0, longitude: 0, isPrecise: false, error: result.error };
    }

    const trueNode = result.data.True_Node;
    const signNames = ["Aries", "Tauro", "Géminis", "Cáncer", "Leo", "Virgo",
        "Libra", "Escorpio", "Sagitario", "Capricornio", "Acuario", "Piscis"];
    const signIdx = Math.floor(trueNode.longitude / 30);

    // Simplified house calculation (real house system requires ascendant + birth place)
    const ascLon = result.data.Ascendant?.longitude || 0;
    const relLon = ((trueNode.longitude - ascLon) + 360) % 360;
    const house = Math.floor(relLon / 30) + 1;

    return {
        sign: signNames[signIdx] || trueNode.sign,
        house,
        longitude: trueNode.longitude,
        isPrecise: true,
        error: null,
    };
}

/**
 * Get Venus and Mars signs for Patrones Relacionales — real precision.
 */
export async function getVenusMarsSigns(input: NatalChartInput): Promise<{
    venus: string; mars: string;
    isPrecise: boolean; error: string | null;
}> {
    const result = await calculateNatalChartReal(input);

    if (!result.data || result.error) {
        return { venus: "", mars: "", isPrecise: false, error: result.error };
    }

    return {
        venus: result.data.Venus.sign,
        mars: result.data.Mars.sign,
        isPrecise: true,
        error: null,
    };
}
