# CLAUDE.md — Vancouver WA House Cleaning
## vancouverwahousecleaning.com

This is a rank-and-rent lead generation site. Ranks on Google for house cleaning searches in Vancouver WA and Clark County. Generates inbound phone leads. Routes to a local contractor. JD and Justin own the domain, tracking number, and lead flow.

---

## Stack
- Next.js 14, App Router, React 18, TypeScript
- Static export: `output: "export"` — all pages pre-render to plain HTML at build time
- Hand-written CSS in app/globals.css — no Tailwind, no Bootstrap, no CSS framework
- Markdown content in content/ directories — parsed at build time
- Supabase pinned to 2.25.0 — browser-only, lead forms only, NEVER queried at render
- Vercel hosting, GitHub auto-deploy on push to main
- Claude API scripts in /scripts/ for content generation

## Supabase Rule
ALWAYS pin: `npm install @supabase/supabase-js@2.25.0`
Higher versions break on this stack. Never upgrade without explicit instruction.

---

## Content Rules (Non-Negotiable)
- No em-dashes anywhere in any content
- No exclamation marks
- No AI slop: never use "delve," "comprehensive," "game-changer," "seamless," "robust," "leverage," "utilize," "in today's world," "at the end of the day"
- Pain before offer — lead with what the reader is dealing with, not your service
- First paragraph addresses the searcher directly within 2 sentences
- No company history in the opening paragraph
- Write for a homeowner in Vancouver WA who is actively comparison-shopping right now

---

## SEO Rules (Non-Negotiable)
- H1 on every page = primary keyword, keyword-first position, no taglines or clever copy
- Primary keyword appears in: title tag, H1, first sentence of first paragraph
- Title tag format: [Primary Keyword] in Vancouver, WA | Vancouver WA House Cleaning
- Meta descriptions: 150-160 characters, includes service + city + soft CTA
- Top two-thirds of every page = macro semantics (money service terms, what you do, how it works)
- Bottom third = micro semantics (FAQ, local context, pricing ranges)
- Homepage links to max 3 service pages from body — move-out cleaning, deep cleaning, recurring maid
- Phone number (tel: link) above fold on every page — clickable on mobile
- FAQ section on homepage and every service page — minimum 5 questions each
- Schema: LocalBusiness on homepage, Service schema on service pages, FAQ schema where FAQs exist
- All images WebP format — descriptive alt tags including service + city
- No orphan pages — every page linked from at least one other page
- Internal linking: service pages link to related service pages, location pages link to service pages

---

## Citation Rules
Every factual claim on every content page must be backed by a contextual inline link from this allowed domains list. Minimum 2 citations per content page. Inline in the sentence — not a reference list at the bottom.

ALLOWED DOMAINS:
- bbb.org
- cleaninginstitute.org
- ibcshq.com
- epa.gov
- clark.wa.gov
- cityofvancouver.us
- lni.wa.gov
- app.leg.wa.gov
- atg.wa.gov
- columbian.com
- census.gov

---

## Review Workflow
ALL generated content lands with `review_flags: pending` in frontmatter.
Nothing publishes until JD manually removes the review_flags line.
schedule-approved.py stamps the publish date after approval.
NO AUTO-PUBLISHING under any circumstances.

Frontmatter template for every page:
```yaml
---
title: ""
description: ""
keyword: ""
review_flags: pending
date_approved: ""
schema_type: ""
---
```

---

## Location Page Rules
Each location page must be genuinely different. Not find-and-replace with a different city name. Google de-indexes templated location pages.

Pre-loaded data:
- Camas WA: median HH income $141,126, avg home $711K-789K, 78.3% owner-occupied, $31/hr cleaning rates, luxury custom homes — angle: recurring maid, premium positioning
- Ridgefield WA: 6.81% annual growth, master-planned subdivisions, constant move-in demand — angle: move-in cleaning, post-construction, new homeowner market

For all other locations: run location research prompt (in brain.md), save as .md, feed to content generator before writing the page.

---

## Move-Out Cleaning Page (Special)
Must include the Washington security deposit statutes, what "professionally cleaned" means under WA law, Clark County landlord inspection standards, pricing $350-650, timeline for booking, move-out vs standard clean.
Required citations: app.leg.wa.gov, atg.wa.gov

CORRECTED 2026-08-23: the original brief named RCW 59.18.020 as the security deposit law. It is not. RCW 59.18.020 is "Rights and remedies — Obligation of good faith imposed." Verified against the statute text, the correct sections are:
- RCW 59.18.280 — statement and refund of deposit. 30 days from termination and vacation. Bars charging for "wear resulting from ordinary use of the premises" and for undocumented damages. Liability for the full deposit on non-compliance, up to 2x for intentional refusal, plus costs and attorney fees.
- RCW 59.18.260 — deposit conditions, written rental agreement, move-in checklist.
Do not cite 59.18.020 as deposit law on any page.

Note: some atg.wa.gov pages still state a 21-day deadline. The statute says 30. Cite the statute for the deadline and the AG only for checklist and documentation guidance.

atg.wa.gov returns HTTP 403 to all automated requests. This is a bot block, not a dead link. The validator reports it as a warning rather than a failure, otherwise the required citation could never pass.

---

## Image Rules
- WebP format only
- Descriptive alt tags: include service + city naturally
- No stock photo clichés — use real PNW residential imagery where possible

---

## Build Sequence
1. Core money pages first (homepage + 6 service pages)
2. Get indexed — submit sitemap to GSC
3. Watch GSC 4-6 weeks for suburb impression signals
4. Build location pages toward where Google is pulling traffic
5. Camas and Ridgefield expected to lead — but GSC confirms
