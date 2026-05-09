import { NextRequest } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      visitorId,
      ipAddress,
      latitude,
      longitude,
      address,
      permissionStatus,
    } = body;

    if (!visitorId || !permissionStatus) {
      return Response.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();

    const { error } = await supabase.from("visitor_locations").insert({
      visitor_id: visitorId,
      ip_address: ipAddress || "unknown",
      latitude: latitude || null,
      longitude: longitude || null,
      address: address || null,
      permission_status: permissionStatus,
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Supabase location insert error:", error);
      return Response.json(
        { success: false, error: "Failed to store location" },
        { status: 500 }
      );
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error("Location API error:", err);
    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
