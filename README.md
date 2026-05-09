# 🌐 Visitor Tracker

A full-stack visitor tracking application built with **Next.js (App Router)**, **Supabase**, and **Tailwind CSS**. Captures visitor IPs, requests location permission, stores coordinates + reverse-geocoded addresses, and redirects to an external site.

---

## ✨ Features

- **Automatic visitor tracking** — IP + timestamp on every page visit
- **Location permission modal** — appears automatically on page load
- **Reverse geocoding** — converts coordinates to readable addresses via OpenStreetMap Nominatim
- **Permission tracking** — stores granted/denied status
- **Auto-redirect** — redirects to Flipkart after permission flow completes
- **Hidden admin dashboard** at `/admin` — no visible links anywhere
- **Server-side rendering** — admin data fetched on the server
- **Pagination** + **relative timestamps** in admin dashboard
- **Premium dark UI** — glassmorphism, gradient text, micro-animations
- **Fullscreen background image** with dark overlay on homepage
- **Fully responsive** — works on all devices
- **Deploy-ready** — one-click deploy to Vercel

---

## 📁 Project Structure

```
├── app/
│   ├── api/
│   │   ├── track/
│   │   │   └── route.ts          # POST — captures IP, returns visitor ID
│   │   └── location/
│   │       └── route.ts          # POST — stores location + permission status
│   ├── admin/
│   │   └── page.tsx              # Server-rendered admin dashboard
│   ├── components/
│   │   └── VisitorTracker.tsx    # Client: permission modal + tracking + redirect
│   ├── globals.css               # Tailwind v4 + custom theme + animations
│   ├── layout.tsx                # Root layout with SEO metadata
│   └── page.tsx                  # Fullscreen homepage (no admin links)
├── lib/
│   ├── supabase/
│   │   ├── client.ts            # Browser Supabase client (anon key)
│   │   └── server.ts            # Server Supabase client (service role key)
│   └── types.ts                 # Shared TypeScript types
├── public/
│   └── bg.png                   # Background image for homepage
├── .env.example                 # Environment variable template
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 20+ and npm
- A **Supabase** account ([supabase.com](https://supabase.com))

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd ho
npm install
```

### 2. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) → Create a new project
2. Navigate to **SQL Editor** and run the following schema:

```sql
-- =============================================
-- Table 1: visitors (IP + timestamp)
-- =============================================

CREATE TABLE IF NOT EXISTS visitors (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address TEXT NOT NULL,
  visited_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_visitors_visited_at
  ON visitors (visited_at DESC);

ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow service role insert" ON visitors
  FOR INSERT TO service_role WITH CHECK (true);

CREATE POLICY "Allow service role select" ON visitors
  FOR SELECT TO service_role USING (true);


-- =============================================
-- Table 2: visitor_locations (location + permission)
-- =============================================

CREATE TABLE IF NOT EXISTS visitor_locations (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  visitor_id        UUID NOT NULL REFERENCES visitors(id) ON DELETE CASCADE,
  ip_address        TEXT,
  latitude          TEXT,
  longitude         TEXT,
  address           TEXT,
  permission_status TEXT NOT NULL DEFAULT 'denied',
  created_at        TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_visitor_locations_visitor_id
  ON visitor_locations (visitor_id);

CREATE INDEX IF NOT EXISTS idx_visitor_locations_created_at
  ON visitor_locations (created_at DESC);

ALTER TABLE visitor_locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow service role insert" ON visitor_locations
  FOR INSERT TO service_role WITH CHECK (true);

CREATE POLICY "Allow service role select" ON visitor_locations
  FOR SELECT TO service_role USING (true);
```

3. Get your project credentials:
   - Go to **Settings → API**
   - Copy: `Project URL`, `anon (public) key`, `service_role (secret) key`

### 3. Configure Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
```

> ⚠️ **Never commit `.env.local`** — it's already in `.gitignore`.

### 4. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — a location permission modal will appear automatically.

Admin dashboard: [http://localhost:3000/admin](http://localhost:3000/admin) (hidden — no links on frontend).

---

## 🚢 Deploy to Vercel

### Option 1: Vercel Dashboard

1. Push your code to GitHub
2. Go to [vercel.com/new](https://vercel.com/new) → Import repository
3. Add environment variables:
   | Variable | Value |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your anon/public key |
   | `SUPABASE_SERVICE_ROLE_KEY` | Your service role key |
4. Click **Deploy**

### Option 2: Vercel CLI

```bash
npm i -g vercel
vercel
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel --prod
```

---

## 🔒 Security

| Variable | Scope | Exposed to Browser? |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Public | ✅ Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | ✅ Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | ❌ No |

- Service role key only used in `lib/supabase/server.ts` (server-side only)
- RLS enabled on both tables — only service role can read/write
- Admin page has no visible links from the frontend

---

## 🔄 Visitor Flow

1. User opens homepage → IP + timestamp stored in `visitors` table
2. Location permission modal appears automatically
3. **If allowed**: coordinates captured → reverse geocoded → stored in `visitor_locations`
4. **If denied**: denied status stored in `visitor_locations`
5. User is redirected to `https://flipkart.com`

---

## 🛠 Tech Stack

| Technology | Purpose |
|---|---|
| [Next.js](https://nextjs.org) (App Router) | Full-stack React framework |
| [Supabase](https://supabase.com) | PostgreSQL database |
| [Tailwind CSS](https://tailwindcss.com) v4 | Styling |
| [date-fns](https://date-fns.org) | Relative time formatting |
| [OpenStreetMap Nominatim](https://nominatim.openstreetmap.org) | Reverse geocoding |
| [Vercel](https://vercel.com) | Hosting & deployment |

---

## 📜 License

MIT
