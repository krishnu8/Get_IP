import VisitorTracker from "./components/VisitorTracker";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <VisitorTracker />

      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-border/50 bg-background/60 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-sm font-semibold tracking-wide uppercase text-accent-light">
            Visitor Tracker
          </span>
          <Link
            href="/admin"
            className="text-sm text-muted hover:text-foreground transition-colors duration-200"
          >
            Admin Dashboard →
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex items-center justify-center px-6 pt-16">
        <div className="max-w-2xl text-center animate-fade-in">
          {/* Glow orb */}
          <div className="relative mx-auto mb-8 w-24 h-24 animate-float">
            <div className="absolute inset-0 rounded-full bg-accent/20 blur-2xl" />
            <div className="relative w-full h-full rounded-full glass-card flex items-center justify-center animate-pulse-glow">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-10 h-10 text-accent-light"
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

          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-6 animate-fade-in-delay-1">
            <span className="gradient-text">Welcome</span>{" "}
            <span className="text-foreground">to the Website</span>
          </h1>

          <p className="text-lg text-muted leading-relaxed mb-10 max-w-lg mx-auto animate-fade-in-delay-2">
            Your visit has been recorded. We track anonymous visitor data to
            understand traffic patterns — no personal information is stored.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-delay-3">
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent hover:bg-accent-light text-white font-medium transition-all duration-200 shadow-lg shadow-accent/20 hover:shadow-accent/30 hover:-translate-y-0.5"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2Z"
                />
              </svg>
              View Visitor Logs
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border hover:border-accent/50 text-muted hover:text-foreground font-medium transition-all duration-200 hover:-translate-y-0.5"
            >
              Source Code
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
                />
              </svg>
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-6 text-center text-xs text-muted">
        Built with Next.js, Supabase &amp; Tailwind CSS
      </footer>
    </>
  );
}
