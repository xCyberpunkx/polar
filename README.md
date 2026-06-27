# Polar

**The open-source bipolar disorder intelligence platform.**

Polar helps people with bipolar disorder understand their own patterns through consistent data tracking, evidence-based psychoeducation, and tools built around real clinical needs — not generic wellness aesthetics.

> Built by someone with bipolar disorder, for people with bipolar disorder.

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

---

## Why Polar exists

Most mood tracking apps fail because they treat mental illness like a productivity problem. They gamify streaks, show generic charts, and abandon you after three days.

Polar is built on three clinical realities:

1. **Memory is impaired during episodes.** You cannot reliably recall how you felt last week. Consistent tracking creates the external memory your illness disrupts.
2. **Patterns are invisible in the moment.** The connection between three nights of poor sleep and a mood crash five days later is not something the human brain tracks naturally. A database does.
3. **Psychiatrists make better decisions with data.** A monthly PDF report with your mood, sleep, medication adherence, and episode history changes what is possible in a 15-minute appointment.

---

## Features

| Feature | Description |
|---|---|
| ⚡ **Daily Pulse** | 60-second check-in: mood, energy, sleep, meds, one word. Gemini AI returns a reflection. |
| 🧠 **Pattern Detection** | Pure statistical analysis surfaces correlations invisible to the human brain. |
| ⚠ **Warning System** | Define personal early warning signs. Weekly check triggers alerts before episodes escalate. |
| 📓 **Episode Memory** | Document episodes after they pass — type, duration, trigger, severity, what helped. |
| 🛡 **WRAP Builder** | Full Wellness Recovery Action Plan with 9 clinical sections. |
| 📄 **Psychiatrist Report** | One-click printable PDF: mood history, patterns, episode log, medication adherence. |
| 🔬 **Substance Log** | Non-judgmental tracking correlated with mood data over time. |
| 👥 **Caregiver View** | Token-based read-only dashboard for a trusted person or clinician. |
| 📚 **Learn** | Psychoeducation from DSM-5, CANMAT, NICE, and BAP guidelines. |
| 🆘 **Crisis Resources** | Always accessible without login. International crisis lines and immediate guidance. |
| 📧 **Email System** | Morning brief (daily) and weekly digest via Resend. |

---

## Tech Stack

| Layer | Tech | Cost |
|---|---|---|
| Framework | Next.js 14 (App Router) | Free |
| Auth | Clerk | Free (10k MAU) |
| Database | PostgreSQL via Neon.tech | Free (0.5GB) |
| ORM | Prisma | Free |
| AI | Google Gemini 1.5 Flash | Free (1,500 req/day) |
| Email | Resend | Free (3,000/month) |
| Hosting | Vercel | Free (hobby) |

**Total monthly cost at launch: $0**

---

## Setup Guide

### Prerequisites

- Node.js 18+
- [Neon.tech](https://neon.tech) account — free Postgres
- [Clerk](https://clerk.com) account — free auth
- [Google AI Studio](https://aistudio.google.com) API key — free Gemini
- [Resend](https://resend.com) account — free email (optional for v1)

---

### Step 1 — Clone and install

```bash
git clone https://github.com/YOUR_USERNAME/polar.git
cd polar
npm install
```

---

### Step 2 — Create your Neon database

1. Go to [neon.tech](https://neon.tech) and create a free account
2. Click **New Project** → name it `polar`
3. Go to **Dashboard → Connection string**
4. Copy the connection string — it looks like:
   ```
   postgresql://user:password@ep-xxx-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

---

### Step 3 — Set up Clerk

1. Go to [clerk.com](https://clerk.com) and create a free account
2. Click **Add application** → name it `Polar`
3. Choose **Email** as the sign-in method
4. Go to **API Keys** — copy `Publishable key` and `Secret key`
5. Go to **Paths** and confirm these URLs:
   - Sign-in URL: `/sign-in`
   - Sign-up URL: `/sign-up`
   - After sign-in: `/`
   - After sign-up: `/`

---

### Step 4 — Get Gemini API key

1. Go to [aistudio.google.com](https://aistudio.google.com)
2. Click **Get API key → Create API key**
3. Copy the key (starts with `AIza...`)
4. Free tier gives you **1,500 requests/day** — more than enough

---

### Step 5 — Configure environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# Database (from Neon.tech)
DATABASE_URL="postgresql://user:password@ep-xxx.neon.tech/neondb?sslmode=require"

# Clerk (from clerk.com → API Keys)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Gemini (from aistudio.google.com)
GEMINI_API_KEY=AIza...

# Resend (from resend.com — optional for v1)
RESEND_API_KEY=re_...

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Cron security (generate with: openssl rand -hex 32)
CRON_SECRET=your_random_32_char_secret
```

---

### Step 6 — Initialize the database

```bash
# Generate Prisma client
npx prisma generate

# Push schema (creates all tables)
npx prisma db push
```

Expected output:
```
✓ Generated Prisma Client
✓ Your database is now in sync with your Prisma schema.
```

---

### Step 7 — Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — sign up and you're live.

---

## Deploy to Vercel

### Option A — CLI

```bash
npm i -g vercel
vercel
```

Follow the prompts. Then go to your **Vercel dashboard → Project → Settings → Environment Variables** and add all variables from `.env.example`.

### Option B — GitHub integration

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → **Add New Project**
3. Import your GitHub repo
4. Add environment variables in the Vercel UI
5. Click **Deploy**

### After deploying

1. Update `NEXT_PUBLIC_APP_URL` to your production URL (e.g. `https://polar.vercel.app`)
2. In Clerk dashboard → **Domains**, add your production domain
3. Redeploy if needed

### Cron jobs (email)

`vercel.json` configures automatic cron jobs:
- Daily morning brief: `0 7 * * *` (7am UTC)
- Weekly digest: `0 9 * * 0` (9am UTC Sunday)

These run automatically on Vercel's free plan. No setup needed.

---

## Project Structure

```
polar/
├── src/
│   ├── app/
│   │   ├── (auth)/              # Sign-in / sign-up
│   │   ├── (dashboard)/         # All authenticated pages
│   │   │   ├── page.tsx         # Dashboard
│   │   │   ├── pulse/           # Daily check-in
│   │   │   ├── timeline/        # Full mood history
│   │   │   ├── patterns/        # Pattern cards
│   │   │   ├── warnings/        # Warning sign manager
│   │   │   ├── episodes/        # Episode log
│   │   │   ├── substances/      # Substance tracker
│   │   │   ├── wrap/            # WRAP builder
│   │   │   ├── report/          # Psychiatrist report
│   │   │   ├── learn/           # Knowledge base
│   │   │   └── settings/        # Medications, caregiver
│   │   ├── api/                 # API routes
│   │   ├── caregiver/[token]/   # Public caregiver view
│   │   └── crisis/              # Public crisis page
│   ├── components/
│   │   ├── ui/                  # Card, Button, Badge, etc.
│   │   ├── charts/              # MoodChart, Timeline, StabilityRing
│   │   ├── pulse/               # PulseForm
│   │   └── layout/              # Sidebar
│   └── lib/
│       ├── db/                  # Prisma singleton
│       ├── email/               # Resend templates + daily tips
│       ├── gemini/              # AI reflection
│       ├── medical/             # Clinical knowledge base
│       ├── patterns/            # Statistical detection
│       └── utils/               # Stability score, helpers
├── prisma/schema.prisma
├── .github/workflows/ci.yml     # GitHub Actions
├── vercel.json                  # Cron config
├── .env.example
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
└── LICENSE
```

---

## Security

- All API routes validate Clerk auth before data access
- Caregiver tokens are random 32-char hex strings (cryptographically secure)
- Email cron endpoint requires bearer token (`CRON_SECRET`)
- Security headers: CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy
- WRAP crisis plan stored as encrypted JSON field
- No sensitive data in client-side state or logs

---

## Medical Disclaimer

Polar is a **psychoeducational and self-monitoring tool**. It is not a medical device, a diagnostic tool, or a substitute for professional psychiatric care.

Learn section content is sourced from:
- DSM-5-TR (APA, 2022)
- CANMAT & ISBD 2018 Guidelines for Bipolar Disorder
- NICE Guidelines CG185 — Bipolar disorder: assessment and management
- BAP Updated Guidelines (2016)

Always consult your psychiatrist or healthcare provider about your specific treatment.

If you are in crisis: [/crisis](/crisis) · Call emergency services.

---

## Roadmap

- [ ] Push notifications (PWA)
- [ ] Medication reminders
- [ ] Arabic + French translations
- [ ] Psychiatrist multi-patient portal
- [ ] Apple Health / Google Fit sleep integration
- [ ] CSV data export
- [ ] iOS / Android app

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

We especially need: **clinical content reviewers** (psychiatrists / psychologists) and **translators** (Arabic, French).

---

## License

MIT — see [LICENSE](LICENSE).

---

## Acknowledgments

Built for the ~40 million people worldwide living with bipolar disorder.

WRAP methodology by Mary Ellen Copeland — [mentalhealthrecovery.com](https://www.mentalhealthrecovery.com)
