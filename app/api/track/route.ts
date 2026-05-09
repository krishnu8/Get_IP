import { NextRequest } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    // Detect the real visitor IP from various headers (Vercel, Cloudflare, etc.)
    const forwarded = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    const vercelIp = request.headers.get("x-vercel-forwarded-for");

    let ip =
      vercelIp?.split(",")[0]?.trim() ||
      forwarded?.split(",")[0]?.trim() ||
      realIp?.trim() ||
      "unknown";

    // Strip IPv6-mapped IPv4 prefix (e.g. "::ffff:192.168.1.5" → "192.168.1.5")
    if (ip.startsWith("::ffff:")) {
      ip = ip.slice(7);
    }

    // Normalize loopback addresses to a readable label
    if (ip === "::1" || ip === "127.0.0.1") {
      ip = "127.0.0.1 (localhost)";
    }

    const supabase = createServiceClient();

    const { data, error } = await supabase
      .from("visitors")
      .insert({
        ip_address: ip,
        visited_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return Response.json(
        { success: false, error: "Failed to track visitor" },
        { status: 500 }
      );
    }

    // Return the inserted visitor ID so the frontend can link location data
    return Response.json({ success: true, visitorId: data.id, ip });
  } catch (err) {
    console.error("Track API error:", err);
    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
