# quickstart.md — Vancouver WA House Cleaning

## First Time Setup

### 1. Clone and Install
```bash
git clone [repo-url]
cd vancouver-wa-cleaning
npm install
```

### 2. Environment Variables
Copy .env.example to .env.local and fill in all values:
```bash
cp .env.example .env.local
```

### 3. Supabase Setup
Pin version — do not upgrade:
```bash
npm install @supabase/supabase-js@2.25.0
```

Run these SQL tables in Supabase dashboard:
```sql
CREATE TABLE leads (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  phone text NOT NULL,
  service_type text,
  zip_code text,
  message text,
  created_at timestamptz DEFAULT now()
);
```

### 4. Local Dev
```bash
npm run dev
```
Visit http://localhost:3000

### 5. Build and Export
```bash
npm run build
```
Output goes to /out — this is the static HTML that Vercel serves.

### 6. Deploy
Push to main branch — Vercel auto-deploys.

---

## Environment Variables Reference

| Variable | Where to Get It |
|----------|----------------|
| NEXT_PUBLIC_SUPABASE_URL | Supabase project settings |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Supabase project settings |
| ANTHROPIC_API_KEY | console.anthropic.com |
| TRACKING_PHONE | Twilio 360 area code number |

---

## Content Generation Scripts

All scripts are Node. There is no Python in this project.

### Convert source images to WebP
```bash
npm run images
```
Reads `vancouver-local-images/`, writes `public/images/*.webp` and `lib/image-manifest.json`.

### Generate a single page
```bash
npm run generate -- --keyword "deep cleaning vancouver wa"
npm run generate -- --slug deep-cleaning-vancouver-wa --force
```
Two passes. Pass 1 researches with web search locked to the allowed domains.
Pass 2 binds each citation inline. Then the validators run, with up to three
attempts before the page is written to `content/_rejected/` with a report.

### Research a suburb (required before any location page)
```bash
npm run research -- --suburb "Salmon Creek"
```
Writes `content/locations/<slug>-research.md`. Verify every UNCERTAIN item by hand.

### Run the keyword queue
```bash
npm run queue -- --phase 1 --dry     # show what would run
npm run queue -- --phase 1           # generate everything missing in phase 1
```
Refuses to start a location page whose research file does not exist.

### Check content against every rule
```bash
npm run validate
npm run validate -- --skip-liveness
```
Exits non-zero on failure, so it can gate a deploy.

### Approve content for publishing
Open the file, delete the `review_flags: pending` line by hand, then:
```bash
npm run approve
```
The script refuses any file that still carries the flag. It never removes it.

---

## File Structure
```
/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Homepage
│   ├── services/          # Service pages
│   ├── service-areas/     # Location pages
│   ├── blog/              # Blog posts
│   └── globals.css        # All CSS — hand-written, no framework
├── content/               # Markdown content files
│   ├── services/          # Service page content
│   ├── locations/         # Location page content + research files
│   └── blog/              # Blog post content
├── scripts/               # Content generation scripts
├── components/            # Reusable React components
├── lib/                   # Utilities (supabase client, markdown parser)
├── public/                # Static assets (images in WebP)
├── CORE/                  # Project intelligence files
│   ├── brain.md           # Project context and voice
│   └── quickstart.md      # This file
├── CLAUDE.md              # Rules and constraints for every agent session
└── .env.example           # Environment variable template
```

---

## The Publishing Gate

A page is published only when BOTH are true: the `review_flags` line is gone,
and `date_approved` carries a date. The gate is enforced twice, independently:

1. `scripts/schedule-approved.js` refuses to stamp a flagged file.
2. `lib/markdown.ts` refuses to render one into a production build.

A pending page therefore cannot reach `/out` at all, which means a normal
`npm run build` fails while the homepage is unapproved. That is deliberate.

To preview unapproved work on a real device:
```bash
ALLOW_PENDING_BUILD=true npm run build
```
Pending pages then render with a red PENDING REVIEW banner and are forced to
`noindex, nofollow`. They are still excluded from `sitemap.xml` regardless.

---

## Key Rules
- Supabase PINNED at 2.25.0 — never upgrade
- Static export only — no server-side rendering, no API routes that run at request time
- All images WebP format
- review_flags: pending on all generated content — nothing auto-publishes
- The tracking phone number is baked in at build time. Changing it means editing
  `.env.local` and redeploying.
- Read CLAUDE.md before every agent session
