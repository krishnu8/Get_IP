"use client";

import { useEffect } from "react";

/**
 * Client component that automatically calls /api/track on mount
 * to record the visitor's IP and timestamp.
 */
export default function VisitorTracker() {
  useEffect(() => {
    const trackVisitor = async () => {
      try {
        await fetch("/api/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
      } catch (err) {
        console.error("Failed to track visit:", err);
      }
    };

    trackVisitor();
  }, []);

  return null; // This component renders nothing — it only fires the tracking call
}
