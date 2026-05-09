import { createServiceClient } from "@/lib/supabase/server";
import type { Metadata } from "next";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export const metadata: Metadata = {
  title: "Admin — Visitor Logs",
  description: "View all tracked visitor records with location data.",
};

export const dynamic = "force-dynamic";

const PER_PAGE = 15;

interface AdminPageProps {
  searchParams: Promise<{ page?: string }>;
}

interface VisitorRow {
  id: string;
  ip_address: string;
  visited_at: string;
  visitor_locations: {
    id: string;
    latitude: string | null;
    longitude: string | null;
    address: string | null;
    permission_status: string;
    created_at: string;
  }[];
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params.page || "1", 10));
  const offset = (currentPage - 1) * PER_PAGE;

  const supabase = createServiceClient();

  // Fetch total count
  const { count: totalCount, error: countError } = await supabase
    .from("visitors")
    .select("*", { count: "exact", head: true });

  if (countError) {
    return <ErrorState message={countError.message} />;
  }

  const total = totalCount ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));

  // Fetch paginated visitors with their location data (newest first)
  const { data: visitors, error } = await supabase
    .from("visitors")
    .select(`
      id,
      ip_address,
      visited_at,
      visitor_locations (
        id,
        latitude,
        longitude,
        address,
        permission_status,
        created_at
      )
    `)
    .order("visited_at", { ascending: false })
    .range(offset, offset + PER_PAGE - 1);

  if (error) {
    return <ErrorState message={error.message} />;
  }

  // Count granted/denied
  let grantedCount = 0;
  let deniedCount = 0;
  (visitors as VisitorRow[] | null)?.forEach((v) => {
    const loc = v.visitor_locations?.[0];
    if (loc?.permission_status === "granted") grantedCount++;
    else if (loc?.permission_status === "denied") deniedCount++;
  });

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-border/50 bg-background/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-sm font-semibold tracking-wide uppercase text-accent-light">
            Admin Dashboard
          </span>
          <span className="text-xs text-muted font-mono">
            /admin
          </span>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-28 pb-16">
        {/* Header */}
        <div className="mb-10 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
            <span className="gradient-text">Visitor Logs</span>
          </h1>
          <p className="text-muted text-sm">
            Tracking visitor data with location permissions in real time.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8 animate-fade-in-delay-1">
          <StatCard
            label="Total Visitors"
            value={total.toLocaleString()}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
              </svg>
            }
          />
          <StatCard
            label="Location Granted"
            value={grantedCount.toString()}
            color="success"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            }
          />
          <StatCard
            label="Location Denied"
            value={deniedCount.toString()}
            color="danger"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            }
          />
          <StatCard
            label="Page"
            value={`${currentPage} / ${totalPages}`}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
            }
          />
        </div>

        {/* Table */}
        <div className="glass-card overflow-hidden animate-fade-in-delay-2">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="px-4 py-4 text-xs font-semibold text-muted uppercase tracking-wider">#</th>
                  <th className="px-4 py-4 text-xs font-semibold text-muted uppercase tracking-wider">IP Address</th>
                  <th className="px-4 py-4 text-xs font-semibold text-muted uppercase tracking-wider">Permission</th>
                  <th className="px-4 py-4 text-xs font-semibold text-muted uppercase tracking-wider">Coordinates</th>
                  <th className="px-4 py-4 text-xs font-semibold text-muted uppercase tracking-wider">Address</th>
                  <th className="px-4 py-4 text-xs font-semibold text-muted uppercase tracking-wider">Date & Time</th>
                  <th className="px-4 py-4 text-xs font-semibold text-muted uppercase tracking-wider">Relative</th>
                </tr>
              </thead>
              <tbody>
                {visitors && visitors.length > 0 ? (
                  (visitors as VisitorRow[]).map((visitor, index) => {
                    const dt = new Date(visitor.visited_at);
                    const dateStr = dt.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    });
                    const timeStr = dt.toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: true,
                    });
                    const relativeTime = formatDistanceToNow(dt, {
                      addSuffix: true,
                    });

                    const loc = visitor.visitor_locations?.[0];
                    const permStatus = loc?.permission_status || "—";
                    const coords =
                      loc?.latitude && loc?.longitude
                        ? `${parseFloat(loc.latitude).toFixed(4)}, ${parseFloat(loc.longitude).toFixed(4)}`
                        : "—";
                    const address = loc?.address || "—";

                    return (
                      <tr
                        key={visitor.id}
                        className="border-b border-border/30 hover:bg-card-hover/50 transition-colors duration-150"
                      >
                        <td className="px-4 py-4 text-sm text-muted font-mono">
                          {offset + index + 1}
                        </td>
                        <td className="px-4 py-4">
                          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-accent-glow text-accent-light text-sm font-mono">
                            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                            {visitor.ip_address}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <PermissionBadge status={permStatus} />
                        </td>
                        <td className="px-4 py-4 text-sm text-foreground font-mono">
                          {coords}
                        </td>
                        <td className="px-4 py-4 text-sm text-foreground max-w-[200px] truncate" title={address}>
                          {address}
                        </td>
                        <td className="px-4 py-4 text-sm text-foreground whitespace-nowrap">
                          {dateStr} <span className="text-muted font-mono">{timeStr}</span>
                        </td>
                        <td className="px-4 py-4 text-sm text-muted whitespace-nowrap">
                          {relativeTime}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center text-muted">
                      <div className="flex flex-col items-center gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-border" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                        </svg>
                        <span>No visitor records found yet.</span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8 animate-fade-in-delay-3">
            <PaginationLink
              page={currentPage - 1}
              disabled={currentPage <= 1}
              label="← Previous"
            />
            {generatePageNumbers(currentPage, totalPages).map((p, i) =>
              p === null ? (
                <span key={`dots-${i}`} className="px-2 text-muted">…</span>
              ) : (
                <PaginationLink
                  key={p}
                  page={p}
                  active={p === currentPage}
                  label={p.toString()}
                />
              )
            )}
            <PaginationLink
              page={currentPage + 1}
              disabled={currentPage >= totalPages}
              label="Next →"
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-6 text-center text-xs text-muted">
        Admin Dashboard — Internal Use Only
      </footer>
    </div>
  );
}

/* ---- Sub-components ---- */

function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  color?: "success" | "danger";
}) {
  const bgColor =
    color === "success"
      ? "bg-success/10"
      : color === "danger"
      ? "bg-danger/10"
      : "bg-accent-glow";
  const textColor =
    color === "success"
      ? "text-success"
      : color === "danger"
      ? "text-danger"
      : "text-accent-light";

  return (
    <div className="glass-card p-5 flex items-center gap-4">
      <div className={`w-10 h-10 rounded-xl ${bgColor} flex items-center justify-center ${textColor} shrink-0`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-xs text-muted uppercase tracking-wider">{label}</p>
      </div>
    </div>
  );
}

function PermissionBadge({ status }: { status: string }) {
  if (status === "granted") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success/10 text-success text-xs font-medium">
        <span className="w-1.5 h-1.5 rounded-full bg-success" />
        Granted
      </span>
    );
  }
  if (status === "denied") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-danger/10 text-danger text-xs font-medium">
        <span className="w-1.5 h-1.5 rounded-full bg-danger" />
        Denied
      </span>
    );
  }
  return <span className="text-xs text-muted">—</span>;
}

function PaginationLink({
  page,
  disabled,
  active,
  label,
}: {
  page: number;
  disabled?: boolean;
  active?: boolean;
  label: string;
}) {
  if (disabled) {
    return (
      <span className="px-4 py-2 rounded-lg text-sm text-muted/40 cursor-not-allowed border border-border/30">
        {label}
      </span>
    );
  }
  return (
    <Link
      href={`/admin?page=${page}`}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${
        active
          ? "bg-accent text-white border-accent shadow-lg shadow-accent/20"
          : "border-border/50 text-muted hover:text-foreground hover:border-accent/50 hover:bg-card-hover"
      }`}
    >
      {label}
    </Link>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="glass-card p-8 max-w-md text-center">
        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-danger/10 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold mb-2 text-foreground">Database Error</h2>
        <p className="text-sm text-muted mb-4">{message}</p>
        <p className="text-xs text-muted">Check your Supabase configuration and environment variables.</p>
      </div>
    </div>
  );
}

function generatePageNumbers(current: number, total: number): (number | null)[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | null)[] = [1];
  if (current > 3) pages.push(null);
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);
  if (current < total - 2) pages.push(null);
  pages.push(total);
  return pages;
}
