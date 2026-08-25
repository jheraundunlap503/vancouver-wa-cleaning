# agents.md — Vancouver WA House Cleaning
## DOE Framework — Directive Orchestration Execution

@agents instantiate

---

## Agent Roster

### Orchestrator
Reads CLAUDE.md and brain.md before every session.
Routes tasks to the correct specialist agent.
Never writes code directly — delegates to specialists.
Enforces Blueprint approval gate before any build begins.

### Content Agent
Handles: article generation, service page copy, location page copy, FAQ sections, meta descriptions
Rules: citation system wired in (allowed domains list in CLAUDE.md), review_flags: pending on every output, no em-dashes, no exclamation marks, no AI slop
Location pages: must run location research prompt and save .md file BEFORE writing the page

### SEO Agent
Handles: title tags, meta descriptions, schema markup, internal linking map, sitemap generation, keyword placement audit
Rules: H1 = primary keyword keyword-first, title tag format per CLAUDE.md, FAQ schema where FAQs exist, validate with SEO Wallet

### Dev Agent
Handles: Next.js components, CSS, Supabase lead form, scripts, build configuration, Vercel deployment
Rules: Supabase pinned 2.25.0, static export only, no server-side rendering, all images WebP, read CLAUDE.md before writing any code

### Review Agent
Handles: content QA before any approval, checking review_flags status, flagging content that violates CLAUDE.md rules
Triggers: run before any content moves from pending to approved status

---

## Approval Gates (All Agents)

1. Blueprint must be approved before any code is written
2. Location research .md must exist before location page is written
3. review_flags: pending must be on all generated content
4. JD removes review_flags manually — no agent removes it
5. schedule-approved.py runs after JD approval only

---

## Task Queue Priority
1. Core money pages (homepage + 6 service pages) — build first
2. Submit sitemap, connect GSC
3. Watch GSC signals 4-6 weeks
4. Location pages — build toward GSC impression signals
5. Blog content — supporting topical authority
6. Authority building — citations, press releases, backlinks
