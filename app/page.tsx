import VisitorTracker from "./components/VisitorTracker";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Welcome",
  description: "Welcome to our website.",
};

export default function HomePage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/bg.png')" }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/65" />

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 grid-pattern opacity-30" />

      {/* Content */}
      <main className="relative z-10 text-center px-6 max-w-2xl animate-fade-in">
        {/* Glow orb */}
        <div className="relative mx-auto mb-8 w-20 h-20 animate-float">
          <div className="absolute inset-0 rounded-full bg-accent/30 blur-2xl" />
          <div className="relative w-full h-full rounded-full glass-card flex items-center justify-center animate-pulse-glow">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-9 h-9 text-accent-light"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5a17.92 17.92 0 0 1-8.716-2.247m0 0A8.966 8.966 0 0 1 3 12c0-1.264.26-2.467.732-3.558"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-5">
          <span className="gradient-text">Welcome</span>{" "}
          <span className="text-white">to the Website</span>
        </h1>

        <p className="text-lg text-white/60 leading-relaxed max-w-lg mx-auto animate-fade-in-delay-1">
          Discover amazing content and experiences. We&apos;re glad you&apos;re
          here.
        </p>
      </main>

      {/* Location permission modal (fires automatically) */}
      <VisitorTracker />
    </div>
  );
}
