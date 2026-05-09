# 🌐 Visitor Tracker

A minimal full-stack visitor tracking application built with **Next.js (App Router)**, **Supabase**, and **Tailwind CSS**. Automatically captures visitor IP addresses and timestamps, with a premium admin dashboard to review all records.

---

## ✨ Features

- **Automatic visitor tracking** — IP + timestamp captured on every page visit
- **Server-side admin dashboard** — paginated table of all visitor logs
- **Relative timestamps** — "2 minutes ago" style display via `date-fns`
- **Secure architecture** — service role key never exposed to the browser
- **Premium dark UI** — glassmorphism, gradient text, micro-animations
- **Fully responsive** — works on mobile, tablet, and desktop
- **Deploy-ready** — one-click deploy to Vercel

---

## 📁 Project Structure

```
├── app/
│   ├── api/
│   │   └── track/
│   │       └── route.ts        # POST — captures visitor IP + timestamp
│   ├── admin/
│   │   └── page.tsx            # Server-rendered admin dashboard
│   ├── components/
│   │   └── VisitorTracker.tsx   # Client component — fires tracking call
│   ├── globals.css              # Tailwind v4 + custom theme + animations
│   ├── layout.tsx               # Root layout with SEO metadata
│   └── page.tsx                 # Homepage with visitor tracker
├── lib/
│   ├── supabase/
│   │   ├── client.ts           # Browser Supabase client (anon key)
│   │   └── server.ts           # Server Supabase client (service role key)
│   └── types.ts                # Shared TypeScript types
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
-- Supabase SQL Schema: visitors table
-- =============================================

CREATE TABLE IF NOT EXISTS visitors (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address TEXT NOT NULL,
  visited_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Index for faster sorting by visit time
CREATE INDEX IF NOT EXISTS idx_visitors_visited_at
  ON visitors (visited_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;

-- Policy: allow inserts from the service role (API route)
CREATE POLICY "Allow service role insert"
  ON visitors
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Policy: allow reads from the service role (admin page)
CREATE POLICY "Allow service role select"
  ON visitors
  FOR SELECT
  TO service_role
  USING (true);
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

Open [http://localhost:3000](http://localhost:3000) — your visit will be tracked automatically.

Visit [http://localhost:3000/admin](http://localhost:3000/admin) to see the log.

---

## 🚢 Deploy to Vercel

### Option 1: Vercel Dashboard

1. Push your code to GitHub/GitLab/Bitbucket
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your repository
4. Add environment variables:
   | Variable | Value |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your anon/public key |
   | `SUPABASE_SERVICE_ROLE_KEY` | Your service role key |
5. Click **Deploy**

### Option 2: Vercel CLI

```bash
npm i -g vercel
vercel

# Set env variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY

# Deploy to production
vercel --prod
```

---

## 🔒 Security Notes

| Variable | Scope | Exposed to Browser? |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Public | ✅ Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | ✅ Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | ❌ No |

- The **service role key** is only used in `lib/supabase/server.ts`, which runs exclusively on the server (API routes and server components).
- **Row Level Security (RLS)** is enabled on the `visitors` table — only the service role can read/write.

---

## 🛠 Tech Stack

| Technology | Purpose |
|---|---|
| [Next.js](https://nextjs.org) (App Router) | Full-stack React framework |
| [Supabase](https://supabase.com) | PostgreSQL database + auth |
| [Tailwind CSS](https://tailwindcss.com) v4 | Utility-first styling |
| [date-fns](https://date-fns.org) | Relative time formatting |
| [Vercel](https://vercel.com) | Hosting & deployment |

---

## 📜 License

MIT — use freely for personal or commercial projects.
