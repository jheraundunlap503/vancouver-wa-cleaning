'use strict'

/**
 * The build queue, in priority order, mirroring CORE/keyword-targets.md.
 *
 * `brief` is what the page has to cover. `extra` carries non-negotiable
 * requirements that the validators also check independently.
 */

const PAGES = [
  /* ------------------------------------------------ Phase 1, money pages */
  {
    priority: 1,
    phase: 1,
    keyword: 'house cleaning vancouver wa',
    titleKeyword: 'House Cleaning',
    h1: 'House Cleaning Vancouver WA',
    slug: 'home',
    collection: 'pages',
    pageType: 'home',
    schemaType: 'LocalBusiness',
    brief: `
The homepage. Covers house cleaning in Vancouver WA broadly, then routes to the
three highest intent services: move out cleaning, deep cleaning, recurring maid
service. Sections in this order: what the service covers, what it costs, how
booking works, then Clark County areas served, Pacific Northwest specific cleaning
problems (winter mud and rain tracking, damp season mildew, spring pollen), and FAQ.
Link to exactly three service pages from the body and no more.`,
  },
  {
    priority: 2,
    phase: 1,
    keyword: 'move out cleaning vancouver wa',
    titleKeyword: 'Move Out Cleaning',
    h1: 'Move Out Cleaning Vancouver WA',
    slug: 'move-out-cleaning-vancouver-wa',
    collection: 'services',
    pageType: 'service',
    schemaType: 'Service',
    brief: `
The highest converting page on the site. The reader is a tenant whose lease is
ending and whose deposit is on the line, or a seller under contract. Cover what a
move out clean includes room by room, how it differs from a standard clean, the
price range, how far ahead to book, and what landlords in Clark County actually
inspect.`,
    extra: `
- Must cite the correct Washington security deposit statutes. RCW 59.18.280 governs
  the statement and refund of a deposit and the prohibition on charging for wear
  from ordinary use. RCW 59.18.260 governs deposit conditions and the move in
  checklist. RCW 59.18.020 is the good faith provision and is NOT the deposit law,
  do not cite it as such.
- Must explain what "wear resulting from ordinary use" means, and that it cannot be
  charged to the tenant.
- Must state the deadline for the landlord's statement and refund, taken from the
  statute text you retrieve, not from memory.
- Must include a citation from app.leg.wa.gov and a citation from atg.wa.gov.
- Must state the $350 to $650 price range for a move out clean.`,
  },
  {
    priority: 3,
    phase: 1,
    keyword: 'deep cleaning vancouver wa',
    titleKeyword: 'Deep Cleaning',
    h1: 'Deep Cleaning Vancouver WA',
    slug: 'deep-cleaning-vancouver-wa',
    collection: 'services',
    pageType: 'service',
    schemaType: 'Service',
    brief: `
The reader has let things slide, or is hosting, or is starting a recurring service
and needs the first reset. Cover what a deep clean reaches that a standard clean
does not, room by room scope, how long it takes, price range, and how often a home
in this climate needs one. Damp season mildew in bathrooms and window frames is a
real local angle worth covering.`,
  },
  {
    priority: 4,
    phase: 1,
    keyword: 'maid service vancouver wa',
    titleKeyword: 'Recurring Maid Service',
    h1: 'Recurring Maid Service Vancouver WA',
    slug: 'recurring-maid-service-vancouver-wa',
    collection: 'services',
    pageType: 'service',
    schemaType: 'Service',
    brief: `
The reader wants the problem to stop recurring. Cover weekly, biweekly, and monthly
cadence and who each suits, what is covered on every visit, why the first visit is
a deep clean, pricing per visit by cadence, and how scheduling and access work when
nobody is home.`,
  },
  {
    priority: 5,
    phase: 1,
    keyword: 'airbnb cleaning vancouver wa',
    titleKeyword: 'Airbnb Turnover Cleaning',
    h1: 'Airbnb Turnover Cleaning Vancouver WA',
    slug: 'airbnb-turnover-cleaning-vancouver-wa',
    collection: 'services',
    pageType: 'service',
    schemaType: 'Service',
    brief: `
The reader is a short term rental host losing sleep over same day turnovers and
review scores. Cover turnaround windows, the checklist difference between a
turnover and a residential clean, linens and restocking, damage reporting, and
pricing per turnover. Clark County has roughly 947 active listings, which is worth
framing as a real local market.`,
  },
  {
    priority: 6,
    phase: 1,
    keyword: 'post construction cleaning vancouver wa',
    titleKeyword: 'Post Construction Cleaning',
    h1: 'Post Construction Cleaning Vancouver WA',
    slug: 'post-construction-cleaning-vancouver-wa',
    collection: 'services',
    pageType: 'service',
    schemaType: 'Service',
    brief: `
The reader just finished a remodel or is taking delivery of new construction and
the place is covered in drywall dust. Cover the rough and final clean phases, why
drywall dust needs specific handling and repeat passes, what gets damaged by the
wrong method, price range by square footage, and timing against the contractor's
punch list. Ridgefield and the wider new construction wave is the local hook.`,
  },

  /* ------------------------------------------- Phase 2, location pages */
  ...[
    ['camas-wa', 'Camas', 7],
    ['ridgefield-wa', 'Ridgefield', 8],
    ['salmon-creek-wa', 'Salmon Creek', 9],
    ['battle-ground-wa', 'Battle Ground', 10],
    ['washougal-wa', 'Washougal', 11],
    ['hazel-dell-wa', 'Hazel Dell', 12],
  ].map(([slug, label, priority]) => ({
    priority,
    phase: 2,
    keyword: `house cleaning ${label.toLowerCase()} wa`,
    titleKeyword: `House Cleaning ${label}`,
    h1: `House Cleaning ${label} WA`,
    slug,
    collection: 'locations',
    pageType: 'location',
    schemaType: 'Service',
    brief: `
A location page for ${label}, Washington. Every figure must come from
content/locations/${slug.replace(/-wa$/, '')}-research.md, which is a required input.
This page must not read as the Vancouver page with the city name swapped. Lead with
the housing stock and the cleaning problem that actually follows from it in ${label},
then services, then pricing, then local FAQ.`,
    extra: `
- Read content/locations/${slug.replace(/-wa$/, '')}-research.md and use its data.
- Anything the research file marks UNCERTAIN must be cut, not published.
- Link to two or three service pages that match this suburb's actual demand.`,
  })),

  /* ------------------------------------------------- Phase 3, blog */
  ...[
    ['how-much-does-house-cleaning-cost-vancouver-wa', 'how much does house cleaning cost vancouver wa', 'House Cleaning Cost'],
    ['move-out-cleaning-checklist-clark-county', 'move out cleaning checklist clark county', 'Move Out Cleaning Checklist'],
    ['best-house-cleaners-camas-wa', 'best house cleaners camas wa', 'Best House Cleaners in Camas'],
    ['airbnb-cleaning-service-vancouver-wa-guide', 'airbnb cleaning service vancouver wa', 'Airbnb Cleaning Service Guide'],
    ['spring-cleaning-vancouver-wa', 'spring cleaning vancouver wa', 'Spring Cleaning'],
    ['house-cleaning-tips-pacific-northwest', 'house cleaning tips pacific northwest', 'Pacific Northwest House Cleaning Tips'],
  ].map(([slug, keyword, titleKeyword], i) => ({
    priority: 13 + i,
    phase: 3,
    keyword,
    titleKeyword,
    h1: keyword.replace(/\b\w/g, (c) => c.toUpperCase()),
    slug,
    collection: 'blog',
    pageType: 'blog',
    schemaType: 'Article',
    brief: `
A supporting blog post targeting "${keyword}". Answers the question fully and
concretely with real numbers and local specifics. Links to the money page it
supports. This is topical authority, not a sales page.`,
  })),
]

function byPriority() {
  return [...PAGES].sort((a, b) => a.priority - b.priority)
}

function find(keywordOrSlug) {
  const needle = String(keywordOrSlug).toLowerCase().trim()
  return PAGES.find((p) => p.keyword === needle || p.slug === needle) || null
}

module.exports = { PAGES, byPriority, find }
